import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { redeemCouponSchema } from '@/lib/validations'

// POST /api/share/[token]/redeem - Resgatar um cupom
export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params
    const body = await req.json()

    // Validar dados de entrada
    const validationResult = redeemCouponSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { couponId } = validationResult.data

    // Verificar se a coleção existe pelo token de compartilhamento
    const collection = await prisma.couponCollection.findUnique({
      where: { shareToken: token },
      include: {
        coupons: {
          where: { id: couponId }
        }
      }
    })

    if (!collection) {
      return NextResponse.json(
        { error: 'Coleção não encontrada' },
        { status: 404 }
      )
    }

    if (collection.coupons.length === 0) {
      return NextResponse.json(
        { error: 'Cupom não encontrado nesta coleção' },
        { status: 404 }
      )
    }

    const coupon = collection.coupons[0]

    if (coupon.isUsed) {
      return NextResponse.json(
        { error: 'Este cupom já foi resgatado' },
        { status: 400 }
      )
    }

    // Atualizar o cupom como resgatado
    const updatedCoupon = await prisma.coupon.update({
      where: { id: couponId },
      data: {
        isUsed: true,
        redeemedAt: new Date()
      }
    })

    return NextResponse.json(updatedCoupon)
  } catch (error) {
    console.error('Erro ao resgatar cupom:', error)
    return NextResponse.json(
      { error: 'Erro ao resgatar cupom' },
      { status: 500 }
    )
  }
}
