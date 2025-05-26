'use client'

import { Suspense } from 'react'

import { RegisterForm } from './form'

export default function Register() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
