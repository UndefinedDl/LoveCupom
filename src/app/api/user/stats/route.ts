import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'

import { getUserUsageStats } from '@/lib/planLimits'
import { authOptions } from '@/constants/constants'

// GET /api/user/stats - Obter estatísticas de uso do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const stats = await getUserUsageStats(session.user.id)

    if (!stats) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas do usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
