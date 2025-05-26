// src/app/layout.tsx - Adicionar o SupportWidget
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import AuthProvider from './providers/AuthProvider'
import { SupportWidget } from './components/Suporte'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Cupons de Amor - Compartilhe Momentos Especiais',
  description:
    'Crie, personalize e compartilhe cupons de amor com pessoas especiais'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          {/* Widget de suporte global */}
          <SupportWidget />
        </AuthProvider>
      </body>
    </html>
  )
}
