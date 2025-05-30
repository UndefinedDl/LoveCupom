import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // Extrai o paymentId da URL
    const match = req.nextUrl.pathname.match(/\/payments\/status\/([^/]+)/)
    const paymentId = match ? match[1] : null

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId inválido' }, { status: 400 })
    }

    const payment = await prisma.payment.findUnique({
      where: {
        paymentId: paymentId
      }
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      paymentId: payment.paymentId,
      status: payment.status,
      amount: payment.amount,
      customerEmail: payment.customerEmail,
      customerName: payment.customerName,
      planType: payment.planType,
      paidAt: payment.paidAt,
      expiresAt: payment.expiresAt,
      createdAt: payment.createdAt
    })
  } catch (error) {
    console.error('Erro ao buscar status do pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar status do pagamento' },
      { status: 500 }
    )
  }
}
