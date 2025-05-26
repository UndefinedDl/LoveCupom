// src/lib/planLimits.ts
import { prisma } from './prisma'
import { getPlanLimits } from '@/constants/plans'

export interface PlanLimitCheck {
  canCreate: boolean
  currentCount: number
  maxAllowed: number
  planType: string
  errorMessage?: string
}

/**
 * Verifica se o usuário pode criar uma nova coleção
 */
export async function canCreateCollection(
  userId: string
): Promise<PlanLimitCheck> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: { collections: true }
      }
    }
  })

  if (!user) {
    return {
      canCreate: false,
      currentCount: 0,
      maxAllowed: 0,
      planType: 'free',
      errorMessage: 'Usuário não encontrado'
    }
  }

  const planLimits = getPlanLimits(user.planType)
  const currentCount = user._count.collections
  const maxAllowed = user.maxCollections || planLimits.maxCollections

  const canCreate = currentCount < maxAllowed

  return {
    canCreate,
    currentCount,
    maxAllowed,
    planType: user.planType || 'free',
    errorMessage: canCreate
      ? undefined
      : `Você atingiu o limite de ${maxAllowed} coleções do seu plano ${user.planType || 'gratuito'}. Faça upgrade para criar mais coleções.`
  }
}

/**
 * Verifica se o usuário pode criar um novo cupom em uma coleção
 */
export async function canCreateCoupon(
  userId: string,
  collectionId?: string
): Promise<PlanLimitCheck> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      collections: {
        include: {
          _count: {
            select: { coupons: true }
          }
        }
      }
    }
  })

  if (!user) {
    return {
      canCreate: false,
      currentCount: 0,
      maxAllowed: 0,
      planType: 'free',
      errorMessage: 'Usuário não encontrado'
    }
  }

  const planLimits = getPlanLimits(user.planType)
  const maxAllowed = user.maxCupoms || planLimits.maxCupons

  // Contar total de cupons do usuário em todas as coleções
  const totalCoupons = user.collections.reduce((total, collection) => {
    return total + collection._count.coupons
  }, 0)

  const canCreate = totalCoupons < maxAllowed

  return {
    canCreate,
    currentCount: totalCoupons,
    maxAllowed,
    planType: user.planType || 'free',
    errorMessage: canCreate
      ? undefined
      : `Você atingiu o limite de ${maxAllowed} cupons do seu plano ${user.planType || 'gratuito'}. Faça upgrade para criar mais cupons.`
  }
}

/**
 * Obtém estatísticas de uso do usuário
 */
export async function getUserUsageStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      collections: {
        include: {
          _count: {
            select: { coupons: true }
          }
        }
      }
    }
  })

  if (!user) {
    return null
  }

  const planLimits = getPlanLimits(user.planType)
  const totalCoupons = user.collections.reduce((total, collection) => {
    return total + collection._count.coupons
  }, 0)

  return {
    planType: user.planType || 'free',
    collections: {
      current: user.collections.length,
      max: user.maxCollections || planLimits.maxCollections,
      percentage: Math.round(
        (user.collections.length /
          (user.maxCollections || planLimits.maxCollections)) *
          100
      )
    },
    coupons: {
      current: totalCoupons,
      max: user.maxCupoms || planLimits.maxCupons,
      percentage: Math.round(
        (totalCoupons / (user.maxCupoms || planLimits.maxCupons)) * 100
      )
    }
  }
}
