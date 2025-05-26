'use client'

import { Suspense } from 'react'

import { LoginForm } from './form'

export default function Login() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginForm />
    </Suspense>
  )
}
