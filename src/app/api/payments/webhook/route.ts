// src/app/api/payments/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    console.log('Webhook AbacatePay recebido:', body)

    // O AbacatePay pode enviar diferentes formatos de webhook
    // Vamos tentar identificar o formato e extrair as informações necessárias
    let paymentId: string
    let status: string

    // Formato 1: Webhook com payment_id e status diretos
    if (body.payment_id && body.status) {
      paymentId = body.payment_id
      status = body.status
    }
    // Formato 2: Webhook com objeto data
    else if (body.data && body.data.id) {
      paymentId = body.data.id
      status =
        body.data.status || body.event?.replace('payment.', '') || 'unknown'
    }
    // Formato 3: Webhook com id direto
    else if (body.id) {
      paymentId = body.id
      status = body.status || 'paid' // Assumir que é pagamento se não especificar
    } else {
      console.error('Formato de webhook não reconhecido:', body)
      return NextResponse.json(
        { error: 'Formato de webhook inválido' },
        { status: 400 }
      )
    }

    // Buscar o pagamento no banco de dados
    const payment = await prisma.payment.findUnique({
      where: {
        paymentId: paymentId
      }
    })

    if (!payment) {
      console.error('Pagamento não encontrado:', paymentId)
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      )
    }

    // Mapear status do AbacatePay para nosso sistema
    let mappedStatus = 'pending'
    if (status === 'paid' || status === 'approved' || status === 'completed') {
      mappedStatus = 'paid'
    } else if (status === 'expired' || status === 'timeout') {
      mappedStatus = 'expired'
    } else if (status === 'canceled' || status === 'cancelled') {
      mappedStatus = 'canceled'
    }

    if (payment.status === mappedStatus) {
      // Status já foi processado
      return NextResponse.json({ message: 'Webhook já processado' })
    }

    // Atualizar status do pagamento
    const updateData: any = {
      status: mappedStatus
    }

    if (mappedStatus === 'paid') {
      updateData.paidAt = new Date()
    }

    await prisma.payment.update({
      where: {
        paymentId: paymentId
      },
      data: updateData
    })

    console.log('Pagamento atualizado:', paymentId, 'Status:', mappedStatus)

    return NextResponse.json({ message: 'Webhook processado com sucesso' })
  } catch (error) {
    console.error('Erro no webhook AbacatePay:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}
