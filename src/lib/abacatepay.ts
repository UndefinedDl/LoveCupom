// src/lib/abacatepay.ts
export interface AbacatePayConfig {
  apiKey: string
  baseUrl: string
}

export interface CreatePixPaymentRequest {
  amount: number // valor em centavos
  expiresIn: number // em segundos
  description: string
  customer: {
    name: string
    cellphone?: string
    email: string
    taxId?: string // CPF
  }
}

export interface PixPaymentResponse {
  data: {
    id: string
    amount: number
    status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELED'
    devMode: boolean
    brCode: string // Código PIX para copiar
    brCodeBase64: string // QR Code em base64
    platformFee: number
    createdAt: string
    updatedAt: string
    expiresAt: string
  }
  error?: string
}

export interface WebhookPayload {
  event: 'payment.paid' | 'payment.expired' | 'payment.canceled'
  data: {
    id: string
    status: string
    amount: number
    metadata?: Record<string, any>
  }
}

export class AbacatePayClient {
  private config: AbacatePayConfig

  constructor(config: AbacatePayConfig) {
    this.config = config
  }

  async createPixPayment(
    data: CreatePixPaymentRequest
  ): Promise<PixPaymentResponse> {
    try {
      const url = `${this.config.baseUrl}/pixQrCode/create`

      console.log('URL', url)

      const response = await axios
        .post(url, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`
          }
        })
        .catch(err => {
          console.log('AbcPay Error', err)
          return undefined
        })

      console.log('RES', response)

      if (!response) {
        throw new Error('No response received from AbacatePay API')
      }

      const responseData = await response.data

      return responseData
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error)
      throw error
    }
  }

  async getPayment(paymentId: string): Promise<PixPaymentResponse> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/pixQrCode/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`
          }
        }
      ).catch(err => {
        console.log('AbcPay Error', err)
        return undefined
      })

      if (!response) {
        throw new Error(
          'Failed to fetch payment information from AbacatePay API'
        )
      }

      const responseData = await response.json()

      if (!response.ok || responseData.error) {
        throw new Error(
          `AbacatePay API Error: ${responseData.error || response.statusText}`
        )
      }

      return responseData
    } catch (error) {
      console.error('Erro ao buscar pagamento:', error)
      throw error
    }
  }
}

// Instância única do client
export const abacatePayClient = new AbacatePayClient({
  apiKey: process.env.ABACATEPAY_API_KEY || '',
  baseUrl: process.env.ABACATEPAY_BASE_URL || 'https://api.abacatepay.com/v1'
})

import axios from 'axios'
// Adicionando esquema de validação para registro com pagamento
import { z } from 'zod'

export const registerWithPaymentSchema = z
  .object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres'),
    paymentId: z.string().optional(),
    planType: z.string().default('free')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword']
  })

// src/types/payment.ts
export interface PendingPayment {
  id: string
  userId?: string // Será preenchido após o cadastro
  paymentId: string // ID do pagamento no AbacatePay
  customerEmail: string
  customerName: string
  amount: number
  status: 'pending' | 'paid' | 'expired' | 'canceled'
  planType: 'premium'
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}
