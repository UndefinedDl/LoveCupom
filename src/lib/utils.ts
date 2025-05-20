import { v4 as uuidv4 } from 'uuid'
import * as crypto from 'crypto'

/**
 * Gera um token de compartilhamento único para coleções de cupons
 * O token é baseado em UUID v4 e hasheado para criar uma string mais curta
 */
export function generateShareToken(): string {
  const uuid = uuidv4()
  const hash = crypto.createHash('sha256').update(uuid).digest('hex')

  // Pega os primeiros 12 caracteres para criar um token mais curto
  return hash.substring(0, 12)
}

/**
 * Transforma uma data válida em um objeto Date ou retorna null
 */
export function parseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null

  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}

/**
 * Formata uma data para exibição no formato brasileiro (DD/MM/YYYY)
 */
export function formatDateBR(date: Date | string | null | undefined): string {
  if (!date) return ''

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date

    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      return typeof date === 'string' ? date : ''
    }

    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (error) {
    // Se houver erro no formato da data, retorna a string original ou vazio
    return typeof date === 'string' ? date : ''
  }
}

/**
 * Converte entre os formatos de cupom do banco de dados e da interface
 * Útil para adaptar entre diferentes representações de cupons
 */
export function adaptCouponToCouponCard(coupon: any): any {
  return {
    id: coupon.id,
    title: coupon.title,
    description: coupon.description,
    icon: coupon.icon,
    category: coupon.category,
    used: coupon.isUsed ?? false,
    validUntil: formatDateBR(coupon.validUntil),
    redeemedAt: coupon.redeemedAt ? formatDateBR(coupon.redeemedAt) : null
  }
}

/**
 * Converte um array de cupons para o formato compatível com CouponCard
 */
export function adaptCouponsForUI(coupons: any[]): any[] {
  return coupons.map(coupon => adaptCouponToCouponCard(coupon))
}
