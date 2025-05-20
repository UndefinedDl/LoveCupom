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

  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('pt-BR')
}
