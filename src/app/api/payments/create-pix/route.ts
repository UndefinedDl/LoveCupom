// src/app/api/payments/create-pix/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { abacatePayClient } from '@/lib/abacatepay'
import { plans } from '@/constants/plans'

const createPixSchema = z.object({
  customerName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  customerEmail: z.string().email('Email inválido'),
  customerDocument: z.string().optional(),
  customerPhone: z.string().optional(),
  planType: z.enum(['base', 'premium', 'vip']).default('base')
})

// Preços dos planos em centavos
const PLAN_PRICES = {
  base: 799, // R$ 7,99
  premium: 1499, // R$ 14,99
  vip: 2499 // R$ 24,99
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validar dados de entrada
    const validationResult = createPixSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const {
      customerName,
      customerEmail,
      customerDocument,
      customerPhone,
      planType
    } = validationResult.data

    // Verificar se já existe um pagamento pendente para este email e plano
    const existingPayment = await prisma.payment.findFirst({
      where: {
        customerEmail,
        planType,
        status: 'pending',
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (existingPayment) {
      // Retornar o pagamento existente
      const abacatePayment = await abacatePayClient.getPayment(
        existingPayment.paymentId
      )

      return NextResponse.json({
        paymentId: existingPayment.paymentId,
        qrCode: abacatePayment.data.brCode,
        qrCodeBase64: abacatePayment.data.brCodeBase64,
        copyPaste: abacatePayment.data.brCode,
        amount: existingPayment.amount,
        expiresAt: existingPayment.expiresAt,
        status: existingPayment.status,
        planType: existingPayment.planType
      })
    }

    // Obter dados do plano
    const selectedPlan = plans.find(p => p.planType === planType)
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Plano não encontrado' },
        { status: 400 }
      )
    }

    const amount = PLAN_PRICES[planType]

    // Criar novo pagamento no AbacatePay
    const pixPayment = await abacatePayClient.createPixPayment({
      amount,
      expiresIn: 3600, // 1 hora em segundos
      description: `Plano ${selectedPlan.name} - Cupons de Amor`,
      customer: {
        name: customerName,
        email: customerEmail,
        cellphone: customerPhone,
        taxId: customerDocument
      }
    })

    // Verificar se houve erro na resposta
    if (pixPayment.error) {
      throw new Error(pixPayment.error)
    }

    // Salvar no banco de dados
    const payment = await prisma.payment.create({
      data: {
        paymentId: pixPayment.data.id,
        customerEmail,
        customerName,
        amount,
        status: 'pending',
        planType,
        expiresAt: new Date(pixPayment.data.expiresAt)
      }
    })

    return NextResponse.json({
      paymentId: payment.paymentId,
      qrCode: pixPayment.data.brCode,
      qrCodeBase64: pixPayment.data.brCodeBase64,
      copyPaste: pixPayment.data.brCode,
      amount: payment.amount,
      expiresAt: payment.expiresAt,
      status: payment.status,
      planType: payment.planType,
      planName: selectedPlan.name
    })
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error)
    return NextResponse.json(
      { error: 'Erro ao criar pagamento PIX' },
      { status: 500 }
    )
  }
}
