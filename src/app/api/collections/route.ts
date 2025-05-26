import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createCollectionSchema } from '@/lib/validations'
import { generateShareToken } from '@/lib/utils'

import { canCreateCollection } from '@/lib/planLimits'
import { authOptions } from '@/constants/constants'

// GET /api/collections - Obter todas as coleções do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const collections = await prisma.couponCollection.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { coupons: true }
        }
      }
    })

    return NextResponse.json(collections)
  } catch (error) {
    console.error('Erro ao buscar coleções:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar coleções' },
      { status: 500 }
    )
  }
}

// POST /api/collections - Criar uma nova coleção
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se o usuário pode criar uma nova coleção
    const limitCheck = await canCreateCollection(session.user.id)

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
    const validationResult = createCollectionSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { title, description } = validationResult.data
    const shareToken = generateShareToken()

    // Criar a coleção no banco de dados
    const newCollection = await prisma.couponCollection.create({
      data: {
        title,
        description,
        shareToken,
        userId: session.user.id
      }
    })

    return NextResponse.json(newCollection, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar coleção:', error)
    return NextResponse.json(
      { error: 'Erro ao criar coleção' },
      { status: 500 }
    )
  }
}
