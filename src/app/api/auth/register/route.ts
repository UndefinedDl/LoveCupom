import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'

// POST /api/auth/register - Registrar um novo usuário
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validar dados de entrada
    const validationResult = registerSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, password } = validationResult.data

    // Verificar se o e-mail já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este e-mail já está em uso' },
        { status: 400 }
      )
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar o usuário
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    // Remover a senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      { user: userWithoutPassword, message: 'Usuário criado com sucesso!' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao registrar usuário' },
      { status: 500 }
    )
  }
}
