// src/lib/resend.ts
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY é obrigatória')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// Template de email para resgate de cupom
export const createCouponRedeemedEmailTemplate = ({
  ownerName,
  couponTitle,
  couponDescription,
  redeemerInfo,
  collectionTitle,
  redeemedAt
}: {
  ownerName: string
  couponTitle: string
  couponDescription: string
  redeemerInfo?: string
  collectionTitle: string
  redeemedAt: string
}) => {
  return {
    subject: `💖 Cupom "${couponTitle}" foi resgatado!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cupom Resgatado</title>
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
              padding: 30px 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background: #fff;
              padding: 30px 20px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .footer {
              background: #f9fafb;
              padding: 20px;
              border: 1px solid #e5e7eb;
              border-top: none;
              border-radius: 0 0 8px 8px;
              text-align: center;
              font-size: 14px;
              color: #6b7280;
            }
            .coupon-card {
              background: linear-gradient(135deg, #fdf2f8, #fce7f3);
              border: 2px solid #ec4899;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .coupon-title {
              font-size: 24px;
              font-weight: bold;
              color: #ec4899;
              margin-bottom: 10px;
            }
            .coupon-description {
              color: #6b7280;
              margin-bottom: 15px;
            }
            .redeemed-badge {
              background: #10b981;
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: bold;
              display: inline-block;
            }
            .info-box {
              background: #f0f9ff;
              border-left: 4px solid #0ea5e9;
              padding: 15px;
              margin: 20px 0;
            }
            .emoji {
              font-size: 24px;
              margin-right: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1><span class="emoji">💖</span>Cupom Resgatado!</h1>
            <p>Alguém especial usou um dos seus cupons de amor</p>
          </div>
          
          <div class="content">
            <p>Olá, <strong>${ownerName}</strong>!</p>
            
            <p>Temos uma ótima notícia para você! Um dos cupons da sua coleção "<strong>${collectionTitle}</strong>" foi resgatado.</p>
            
            <div class="coupon-card">
              <div class="coupon-title">${couponTitle}</div>
              <div class="coupon-description">${couponDescription}</div>
              <div class="redeemed-badge">✅ Resgatado</div>
            </div>
            
            <div class="info-box">
              <p><strong>📅 Data do resgate:</strong> ${redeemedAt}</p>
              ${redeemerInfo ? `<p><strong>👤 Informações:</strong> ${redeemerInfo}</p>` : ''}
            </div>
            
            <p>Este é um momento especial! Seu gesto de carinho foi reconhecido e agora é hora de cumprir essa promessa de amor. 💕</p>
            
            <p><strong>💡 Dica:</strong> Que tal criar mais cupons para continuar espalhando amor e carinho?</p>
          </div>
          
          <div class="footer">
            <p>📧 Este email foi enviado automaticamente pelo <strong>Cupons de Amor</strong></p>
            <p>💝 Espalhando amor, um cupom por vez</p>
          </div>
        </body>
      </html>
    `,
    text: `
💖 Cupom Resgatado!

Olá, ${ownerName}!

Temos uma ótima notícia! Um dos cupons da sua coleção "${collectionTitle}" foi resgatado.

Cupom: ${couponTitle}
Descrição: ${couponDescription}
Data do resgate: ${redeemedAt}
${redeemerInfo ? `Informações: ${redeemerInfo}` : ''}

Este é um momento especial! Seu gesto de carinho foi reconhecido e agora é hora de cumprir essa promessa de amor.

Dica: Que tal criar mais cupons para continuar espalhando amor e carinho?

---
Este email foi enviado automaticamente pelo Cupons de Amor
Espalhando amor, um cupom por vez 💝
    `
  }
}

// Função auxiliar para enviar email de cupom resgatado
export async function sendCouponRedeemedEmail({
  ownerEmail,
  ownerName,
  couponTitle,
  couponDescription,
  collectionTitle,
  redeemedAt,
  redeemerInfo
}: {
  ownerEmail: string
  ownerName: string
  couponTitle: string
  couponDescription: string
  collectionTitle: string
  redeemedAt: string
  redeemerInfo?: string
}) {
  try {
    const emailTemplate = createCouponRedeemedEmailTemplate({
      ownerName,
      couponTitle,
      couponDescription,
      redeemerInfo,
      collectionTitle,
      redeemedAt
    })

    const { data, error } = await resend.emails.send({
      from: 'resgates@lovecupoms.store', // Substitua pelo seu domínio
      to: [ownerEmail],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    })

    if (error) {
      console.error('Erro ao enviar email via Resend:', error)
      throw new Error('Falha no envio do email')
    }

    console.log('Email enviado com sucesso:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Erro no envio de email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}
