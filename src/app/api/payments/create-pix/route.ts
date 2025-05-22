// src/app/api/payments/create-pix/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { abacatePayClient } from '@/lib/abacatepay'

const createPixSchema = z.object({
  customerName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  customerEmail: z.string().email('Email inválido'),
  customerDocument: z.string().optional(),
  customerPhone: z.string().optional(),
  planType: z.string().default('base')
})

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

    // Verificar se já existe um pagamento pendente para este email
    const existingPayment = await prisma.payment.findFirst({
      where: {
        customerEmail,
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
        status: existingPayment.status
      })
    }

    // Criar novo pagamento no AbacatePay
    const pixPayment = await abacatePayClient.createPixPayment({
      amount: 799, // R$ 7,99 em centavos
      expiresIn: 3600, // 1 hora em segundos
      description: 'Plano Base - Cupons de Amor',
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
        amount: 799,
        status: 'pending',
        planType: planType || 'base',
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
      status: payment.status
    })
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error)
    return NextResponse.json(
      { error: 'Erro ao criar pagamento PIX' },
      { status: 500 }
    )
  }
}
