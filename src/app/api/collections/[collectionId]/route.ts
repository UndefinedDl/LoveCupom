import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/constants/constants'

// Função utilitária para extrair o collectionId da URL
function getCollectionIdFromRequest(req: NextRequest): string | null {
  const match = req.nextUrl.pathname.match(/\/collections\/([^/]+)/)
  return match ? match[1] : null
}

// GET /api/collections/[id]
export async function GET(req: NextRequest) {
  try {
    const collectionId = getCollectionIdFromRequest(req)
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

    const collection = await prisma.couponCollection.findUnique({
      where: { id: collectionId }
    })

    if (!collection || collection.userId !== session.user.id) {
      return NextResponse.json(
        {
          error:
            'Coleção não encontrada ou você não tem permissão para acessá-la'
        },
        { status: 404 }
      )
    }

    return NextResponse.json(collection)
  } catch (error) {
    console.error('Erro ao buscar coleção:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar coleção' },
      { status: 500 }
    )
  }
}

// PATCH /api/collections/[id]
export async function PATCH(req: NextRequest) {
  try {
    const collectionId = getCollectionIdFromRequest(req)
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

    const body = await req.json()
    const { title, description } = body

    const existingCollection = await prisma.couponCollection.findUnique({
      where: { id: collectionId }
    })

    if (!existingCollection || existingCollection.userId !== session.user.id) {
      return NextResponse.json(
        {
          error:
            'Coleção não encontrada ou você não tem permissão para editá-la'
        },
        { status: 404 }
      )
    }

    const updatedCollection = await prisma.couponCollection.update({
      where: { id: collectionId },
      data: {
        title: title || existingCollection.title,
        description:
          description !== undefined
            ? description
            : existingCollection.description,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedCollection)
  } catch (error) {
    console.error('Erro ao atualizar coleção:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar coleção' },
      { status: 500 }
    )
  }
}

// DELETE /api/collections/[id]
export async function DELETE(req: NextRequest) {
  try {
    const collectionId = getCollectionIdFromRequest(req)
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

    const existingCollection = await prisma.couponCollection.findUnique({
      where: { id: collectionId }
    })

    if (!existingCollection || existingCollection.userId !== session.user.id) {
      return NextResponse.json(
        {
          error:
            'Coleção não encontrada ou você não tem permissão para excluí-la'
        },
        { status: 404 }
      )
    }

    await prisma.couponCollection.delete({
      where: { id: collectionId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir coleção:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir coleção' },
      { status: 500 }
    )
  }
}
