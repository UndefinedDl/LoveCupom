import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    paymentId: z.string().optional(),
    confirmPassword: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword']
  })

export const createCollectionSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z.string().optional()
})

export const createCouponSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z
    .string()
    .min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  icon: z.string().min(1, 'O ícone é obrigatório'),
  category: z.string().min(1, 'A categoria é obrigatória'),
  validUntil: z.string(),
  validStart: z.string()
})

export const redeemCouponSchema = z.object({
  couponId: z.string().uuid('ID de cupom inválido')
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>
export type CreateCouponInput = z.infer<typeof createCouponSchema>
export type RedeemCouponInput = z.infer<typeof redeemCouponSchema>
