// src/app/api/support/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
// Update the import path to the correct relative location if '@/lib/resend' does not exist

import { z } from 'zod'

// Importe ou inicialize o resend corretamente
import { resend } from '@/lib/resend'

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres')
})

// Template de email para suporte
const createSupportEmailTemplate = ({
  userName,
  userEmail,
  title,
  message
}: {
  userName: string
  userEmail: string
  title: string
  message: string
}) => {
  return {
    subject: `SUPORTE - ${title} - ${userName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Solicitação de Suporte</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #ec4899, #ef4444);
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background: #fff;
              padding: 20px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .footer {
              background: #f9fafb;
              padding: 15px;
              border: 1px solid #e5e7eb;
              border-top: none;
              border-radius: 0 0 8px 8px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }
            .info-box {
              background: #f0f9ff;
              border-left: 4px solid #0ea5e9;
              padding: 15px;
              margin: 15px 0;
            }
            .message-box {
              background: #fef3c7;
              border: 1px solid #f59e0b;
              padding: 15px;
              border-radius: 6px;
              margin: 15px 0;
            }
            .label {
              font-weight: bold;
              color: #374151;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🤖 Solicitação de Suporte</h1>
            <p>Nova mensagem recebida do sistema Cupons de Amor</p>
          </div>
          
          <div class="content">
            <div class="info-box">
              <p><span class="label">📅 Data:</span> ${new Date().toLocaleString('pt-BR')}</p>
              <p><span class="label">👤 Nome:</span> ${userName}</p>
              <p><span class="label">📧 Email:</span> ${userEmail}</p>
              <p><span class="label">📋 Assunto:</span> ${title}</p>
            </div>
            
            <div class="message-box">
              <h3>💬 Mensagem:</h3>
              <p style="white-space: pre-wrap; margin: 10px 0;">${message}</p>
            </div>
            
            <div class="info-box">
              <p><strong>💡 Instruções:</strong></p>
              <ul>
                <li>Responder diretamente para: <strong>${userEmail}</strong></li>
                <li>Mencionar sempre o assunto: <strong>${title}</strong></li>
                <li>Manter tom amigável e profissional</li>
                <li>Resolver o mais rápido possível</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>📧 Email automático do sistema Cupons de Amor</p>
            <p>🌐 Sistema de atendimento ao cliente</p>
          </div>
        </body>
      </html>
    `,
    text: `
🤖 SOLICITAÇÃO DE SUPORTE

Data: ${new Date().toLocaleString('pt-BR')}
Nome: ${userName}
Email: ${userEmail}
Assunto: ${title}

MENSAGEM:
${message}

---
Para responder, use o email: ${userEmail}
Assunto de referência: ${title}

Sistema Cupons de Amor - Suporte Automático
    `
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validar dados de entrada
    const validationResult = contactSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, title, message } = validationResult.data

    // Criar template do email
    const emailTemplate = createSupportEmailTemplate({
      userName: name,
      userEmail: email,
      title,
      message
    })

    // Enviar email via Resend
    const { data, error } = await resend.emails.send({
      from: 'suporte@lovecupoms.store', // Ajuste conforme seu domínio
      to: ['dilanlopez009@gmail.com'],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
      replyTo: email // Para facilitar a resposta
    })

    if (error) {
      console.error('Erro ao enviar email de suporte:', error)
      throw new Error('Falha no envio do email')
    }

    console.log('Email de suporte enviado com sucesso:', {
      to: 'dilanlopez009@gmail.com',
      from: email,
      subject: title,
      messageId: data?.id
    })

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso!'
    })
  } catch (error) {
    console.error('Erro na API de suporte:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
