import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/payments/verify-link - Verificar vinculação entre pagamentos e usuários
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const paymentId = url.searchParams.get('paymentId')
    const email = url.searchParams.get('email')

    if (paymentId) {
      // Verificar um pagamento específico
      const payment = await prisma.payment.findUnique({
        where: { paymentId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              planType: true,
              createdAt: true
            }
          }
        }
      })

      if (!payment) {
        return NextResponse.json(
          { error: 'Pagamento não encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        payment: {
          id: payment.paymentId,
          customerEmail: payment.customerEmail,
          customerName: payment.customerName,
          amount: payment.amount,
          status: payment.status,
          planType: payment.planType,
          paidAt: payment.paidAt,
          createdAt: payment.createdAt
        },
        user: payment.user,
        isLinked: !!payment.user,
        message: payment.user
          ? 'Pagamento vinculado ao usuário com sucesso'
          : 'Pagamento não está vinculado a nenhum usuário'
      })
    }

    if (email) {
      // Verificar todos os pagamentos de um email
      const payments = await prisma.payment.findMany({
        where: { customerEmail: email },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              planType: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({
        email,
        totalPayments: payments.length,
        linkedPayments: payments.filter(p => p.user).length,
        unlinkedPayments: payments.filter(p => !p.user).length,
        payments: payments.map(payment => ({
          id: payment.paymentId,
          amount: payment.amount,
          status: payment.status,
          planType: payment.planType,
          paidAt: payment.paidAt,
          createdAt: payment.createdAt,
          user: payment.user,
          isLinked: !!payment.user
        }))
      })
    }

    // Listar todos os pagamentos com status de vinculação
    const paymentsOverview = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            planType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    const stats = {
      total: paymentsOverview.length,
      paid: paymentsOverview.filter(p => p.status === 'paid').length,
      pending: paymentsOverview.filter(p => p.status === 'pending').length,
      linked: paymentsOverview.filter(p => p.user).length,
      unlinked: paymentsOverview.filter(p => !p.user).length
    }

    return NextResponse.json({
      message: 'Overview de pagamentos e vinculações',
      stats,
      recentPayments: paymentsOverview.map(payment => ({
        id: payment.paymentId,
        customerEmail: payment.customerEmail,
        amount: payment.amount,
        status: payment.status,
        planType: payment.planType,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
        user: payment.user,
        isLinked: !!payment.user
      })),
      queryExamples: {
        'Verificar pagamento específico':
          '/api/payments/verify-link?paymentId=pix_char_123456',
        'Verificar por email': '/api/payments/verify-link?email=joao@teste.com'
      }
    })
  } catch (error) {
    console.error('Erro ao verificar vinculação:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar vinculação' },
      { status: 500 }
    )
  }
}

// POST /api/payments/verify-link - Forçar vinculação manual (para debug)
export async function POST(req: NextRequest) {
  // Só permitir em desenvolvimento
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Operação não permitida em produção' },
      { status: 403 }
    )
  }

  try {
    const { paymentId, userEmail } = await req.json()

    if (!paymentId || !userEmail) {
      return NextResponse.json(
        { error: 'paymentId e userEmail são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar pagamento
    const payment = await prisma.payment.findUnique({
      where: { paymentId }
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Fazer a vinculação
    const updatedPayment = await prisma.payment.update({
      where: { paymentId },
      data: { userId: user.id }
    })

    return NextResponse.json({
      message: 'Vinculação manual realizada com sucesso',
      payment: {
        id: updatedPayment.paymentId,
        customerEmail: updatedPayment.customerEmail,
        userId: updatedPayment.userId
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        planType: user.planType
      }
    })
  } catch (error) {
    console.error('Erro ao fazer vinculação manual:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer vinculação manual' },
      { status: 500 }
    )
  }
}
