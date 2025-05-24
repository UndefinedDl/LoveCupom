import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const url = new URL(req.url)
    const webhookSecret = url.searchParams.get('secret')

    console.log('Webhook AbacatePay recebido:', body)
    console.log('Webhook secret:', webhookSecret)

    // Validar webhook secret se fornecido

    // Extrair informações do webhook baseado no formato real do AbacatePay
    let paymentId: string
    let event: string
    let status: string

    // Formato real do AbacatePay - billing.paid
    if (body.event === 'billing.paid' && body.data?.pixQrCode) {
      paymentId = body.data.pixQrCode.id
      event = body.event
      status = body.data.pixQrCode.status || 'PAID'
    }
    // Formato alternativo - evento direto do PIX QRCode
    else if (body.event && body.data?.id) {
      paymentId = body.data.id
      event = body.event
      status = body.data.status || 'PAID'
    }
    // Formato simples - dados diretos
    else if (body.id && body.status) {
      paymentId = body.id
      event = `payment.${body.status.toLowerCase()}`
      status = body.status
    }
    // Formato para PIX QRCode direto
    else if (body.pixId || body.pixQrCodeId) {
      paymentId = body.pixId || body.pixQrCodeId
      event = 'pix.paid'
      status = body.status || 'PAID'
    } else {
      console.error('Formato de webhook não reconhecido:', body)
      return NextResponse.json(
        { error: 'Formato de webhook inválido' },
        { status: 400 }
      )
    }

    console.log(
      'Dados extraídos - ID:',
      paymentId,
      'Event:',
      event,
      'Status:',
      status
    )

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
    const upperStatus = status.toUpperCase()

    if (
      upperStatus === 'PAID' ||
      upperStatus === 'APPROVED' ||
      upperStatus === 'COMPLETED'
    ) {
      mappedStatus = 'paid'
    } else if (upperStatus === 'EXPIRED' || upperStatus === 'TIMEOUT') {
      mappedStatus = 'expired'
    } else if (upperStatus === 'CANCELED' || upperStatus === 'CANCELLED') {
      mappedStatus = 'canceled'
    } else if (upperStatus === 'PENDING') {
      mappedStatus = 'pending'
    }

    if (payment.status === mappedStatus) {
      // Status já foi processado
      console.log('Webhook já processado para pagamento:', paymentId)
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

    console.log(
      'Pagamento atualizado:',
      paymentId,
      'Novo status:',
      mappedStatus,
      'Evento:',
      event
    )

    return NextResponse.json({
      message: 'Webhook processado com sucesso',
      paymentId,
      status: mappedStatus,
      event
    })
  } catch (error) {
    console.error('Erro no webhook AbacatePay:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}
