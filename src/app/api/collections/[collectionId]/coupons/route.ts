import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { createCouponSchema } from '@/lib/validations'
import { parseDate } from '@/lib/utils'
import { canCreateCoupon } from '@/lib/planLimits'

// GET /api/collections/[collectionId]/coupons - Obter todos os cupons de uma coleção
export async function GET(
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { collectionId } = params

    // Verificar se a coleção existe
    const collection = await prisma.couponCollection.findUnique({
      where: { id: collectionId }
    })

    if (!collection) {
      return NextResponse.json(
        { error: 'Coleção não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se o usuário tem permissão (dono da coleção)
    if (session?.user?.id && collection.userId !== session.user.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    // Buscar os cupons da coleção
    const coupons = await prisma.coupon.findMany({
      where: { collectionId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(coupons)
  } catch (error) {
    console.error('Erro ao buscar cupons:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar cupons' },
      { status: 500 }
    )
  }
}

// POST /api/collections/[collectionId]/coupons - Criar um novo cupom
export async function POST(
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { collectionId } = params

    // Verificar se a coleção existe e pertence ao usuário
    const collection = await prisma.couponCollection.findUnique({
      where: {
        id: collectionId,
        userId: session.user.id
      }
    })

    if (!collection) {
      return NextResponse.json(
        { error: 'Coleção não encontrada ou sem permissão' },
        { status: 404 }
      )
    }

    // Verificar se o usuário pode criar um novo cupom
    const limitCheck = await canCreateCoupon(session.user.id, collectionId)

    if (!limitCheck.canCreate) {
      return NextResponse.json(
        {
          error: limitCheck.errorMessage,
          limitReached: true,
          currentCount: limitCheck.currentCount,
          maxAllowed: limitCheck.maxAllowed,
          planType: limitCheck.planType
        },
        { status: 403 }
      )
    }

    const body = await req.json()

    // Validar dados de entrada
    const validationResult = createCouponSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { title, description, icon, category, validUntil, validStart } =
      validationResult.data

    // Criar o cupom no banco de dados
    const newCoupon = await prisma.coupon.create({
      data: {
        title,
        description,
        icon,
        category,
        validStart: parseDate(validStart) || new Date(),
        validUntil: parseDate(validUntil) || new Date('2099-12-31'),
        collectionId
      }
    })

    return NextResponse.json(newCoupon, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar cupom:', error)
    return NextResponse.json({ error: 'Erro ao criar cupom' }, { status: 500 })
  }
}
