import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '../../auth/[...nextauth]/route'

// GET /api/collections/[id] - Obter uma coleção específica pelo ID
export async function GET(
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) {
  try {
    console.log('PARAMS', params)
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Corrigindo a consulta findUnique - deve ter apenas um campo único (id)
    const collection = await prisma.couponCollection.findUnique({
      where: {
        id: params.collectionId
      }
    })

    // Se a coleção não existir ou não pertencer ao usuário atual
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

// PATCH /api/collections/[id] - Atualizar uma coleção
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description } = body

    // Verificar se a coleção existe e pertence ao usuário
    const existingCollection = await prisma.couponCollection.findUnique({
      where: {
        id: params.id
      }
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

    // Atualizar a coleção
    const updatedCollection = await prisma.couponCollection.update({
      where: { id: params.id },
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

// DELETE /api/collections/[id] - Excluir uma coleção
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    console.log('PARAMS', params)
    // Verificar se a coleção existe e pertence ao usuário
    const existingCollection = await prisma.couponCollection.findUnique({
      where: {
        id: params.id
      }
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

    // Excluir a coleção (os cupons serão excluídos automaticamente devido à relação onDelete: Cascade)
    await prisma.couponCollection.delete({
      where: { id: params.id }
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
