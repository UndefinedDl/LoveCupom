// src/app/api/collections/[collectionId]/coupons/route.ts - VERSÃO CORRIGIDA

import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import { createCouponSchema } from '@/lib/validations'
import { parseDate } from '@/lib/utils'
import { canCreateCoupon } from '@/lib/planLimits'
import { authOptions } from '@/constants/constants'

// GET /api/collections/[collectionId]/coupons - Obter todos os cupons de uma coleção
export async function GET(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl
    // Extrai o collectionId da URL
    const match = pathname.match(/\/collections\/([^/]+)\/coupons/)
    const collectionId = match ? match[1] : null

    if (!collectionId) {
      return NextResponse.json(
        { error: 'collectionId inválido' },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)

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
export async function POST(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl
    const match = pathname.match(/\/collections\/([^/]+)\/coupons/)
    const collectionId = match ? match[1] : null

    if (!collectionId) {
      return NextResponse.json(
        { error: 'collectionId inválido' },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

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

    // CORRIGIDO: Processar data de início - se estiver em branco, usar dia anterior
    let processedValidStart: Date
    if (validStart && validStart.trim() !== '') {
      processedValidStart = parseDate(validStart) || new Date()
    } else {
      // Se validStart está em branco, usar ontem para garantir disponibilidade imediata
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0) // Início do dia
      processedValidStart = yesterday
    }

    // Criar o cupom no banco de dados
    const newCoupon = await prisma.coupon.create({
      data: {
        title,
        description,
        icon,
        category,
        validStart: processedValidStart,
        validUntil: parseDate(validUntil) || new Date('2099-12-31'),
        collectionId
      }
    })

    console.log('Cupom criado com sucesso:', {
      id: newCoupon.id,
      title: newCoupon.title,
      validStart: newCoupon.validStart,
      validUntil: newCoupon.validUntil,
      wasStartDateEmpty: !validStart || validStart.trim() === ''
    })

    return NextResponse.json(newCoupon, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar cupom:', error)
    return NextResponse.json({ error: 'Erro ao criar cupom' }, { status: 500 })
  }
}
