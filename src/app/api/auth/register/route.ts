import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import { registerWithPaymentSchema } from '@/lib/abacatepay'
import { getPlanLimits } from '@/constants/plans'

// POST /api/auth/register - Registrar um novo usuário
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const paymentId = body.paymentId

    if (!paymentId) {
      console.log('SEM ID DE PAGAMENTO')
      return NextResponse.json(
        { error: 'ID de pagamento é obrigatório' },
        { status: 400 }
      )
    }

    const hasPaymentData = !!paymentId

    console.log('Dados recebidos:', {
      finalPaymentId: paymentId,
      hasPaymentData,
      bodyKeys: Object.keys(body)
    })

    // Usar esquema apropriado para validação
    const validationResult = hasPaymentData
      ? registerWithPaymentSchema.safeParse({ ...body, paymentId })
      : registerSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, password } = validationResult.data

    console.log('Registrando usuário com dados:', {
      name,
      email,
      paymentId,
      hasPaymentData
    })

    // Verificar se o e-mail já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este e-mail já está em uso' },
        { status: 400 }
      )
    }

    // Se há pagamento, verificar se é válido e pertence ao email
    let paymentData = null
    let planType = 'free'
    if (paymentId) {
      paymentData = await prisma.payment.findUnique({
        where: { paymentId }
      })

      console.log('Dados do pagamento encontrado:', paymentData)

      if (!paymentData) {
        return NextResponse.json(
          { error: 'Pagamento não encontrado' },
          { status: 400 }
        )
      }

      if (paymentData.status !== 'paid') {
        return NextResponse.json(
          { error: 'Pagamento ainda não foi confirmado' },
          { status: 400 }
        )
      }

      if (paymentData.customerEmail !== email) {
        return NextResponse.json(
          { error: 'Email não corresponde ao pagamento' },
          { status: 400 }
        )
      }

      if (paymentData.userId) {
        return NextResponse.json(
          { error: 'Este pagamento já foi utilizado para criar uma conta' },
          { status: 400 }
        )
      }

      planType = paymentData.planType
    }

    // Obter limites do plano
    const planLimits = getPlanLimits(planType)

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Calcular data de expiração do plano (se aplicável)
    let planExpiresAt = null
    // Todos os planos são pagamento único, não expiram

    // Usar transação para garantir consistência
    const result = await prisma.$transaction(async tx => {
      // Criar o usuário
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          planType,
          planExpiresAt,
          maxCollections: planLimits.maxCollections,
          maxCupoms: planLimits.maxCupons
        }
      })

      console.log('Usuário criado com ID:', newUser.id)

      // Se há pagamento válido, vincular ao usuário
      if (paymentData) {
        const updatedPayment = await tx.payment.update({
          where: { paymentId },
          data: { userId: newUser.id }
        })

        console.log('Pagamento vinculado ao usuário:', {
          paymentId,
          userId: newUser.id,
          updatedPayment: updatedPayment
        })
      }

      return newUser
    })

    // Remover a senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = result

    console.log('Registro concluído com sucesso:', {
      userId: result.id,
      email: result.email,
      planType: result.planType,
      maxCollections: result.maxCollections,
      maxCupoms: result.maxCupoms,
      paymentLinked: !!paymentData
    })

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: paymentData
          ? `Conta ${planType} criada com sucesso!`
          : 'Usuário criado com sucesso!',
        planActivated: !!paymentData
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao registrar usuário' },
      { status: 500 }
    )
  }
}
