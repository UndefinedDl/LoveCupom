'use client'

import { FormEvent, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, Gift, Calendar } from 'lucide-react'
import { CreateCouponInput } from '@/lib/validations'

// Categorias pré-definidas
const CATEGORIES = [
  'Encontro',
  'Bem-estar',
  'Aventura',
  'Lazer',
  'Memórias',
  'Presente',
  'Comida',
  'Relaxamento',
  'Surpresa',
  'Outro'
]

// Ícones disponíveis
const ICONS = [
  {
    value: 'heart',
    label: 'Coração',
    icon: <Heart className="text-red-500" />
  },
  {
    value: 'gift',
    label: 'Presente',
    icon: <Gift className="text-purple-500" />
  },
  {
    value: 'calendar',
    label: 'Calendário',
    icon: <Calendar className="text-blue-500" />
  }
]

export default function NewCoupon() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [formData, setFormData] = useState<CreateCouponInput>({
    title: '',
    description: '',
    icon: 'heart',
    category: 'Encontro',
    validUntil: '2025-12-31'
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`/api/collections/${params.id}/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar cupom')
      }

      // Redirecionar para a página da coleção
      router.push(`/dashboard/collections/${params.id}`)
    } catch (error: any) {
      setError(
        error.message || 'Ocorreu um erro ao criar o cupom. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/dashboard/collections/${params.id}`}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar à Coleção
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Novo Cupom</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Título do Cupom *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ex: Jantar Romântico"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descrição *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Descreva o que este cupom oferece"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="icon"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ícone *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ICONS.map(iconOption => (
                  <label
                    key={iconOption.value}
                    className={`
                      flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer
                      ${
                        formData.icon === iconOption.value
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="icon"
                      value={iconOption.value}
                      checked={formData.icon === iconOption.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="mb-1">{iconOption.icon}</div>
                    <span className="text-xs text-center">
                      {iconOption.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Categoria *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="validUntil"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Válido até *
            </label>
            <input
              type="date"
              id="validUntil"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-md font-medium hover:from-pink-600 hover:to-red-600 transition-colors disabled:opacity-70"
            >
              {loading ? 'Criando...' : 'Criar Cupom'}
            </button>

            <Link
              href={`/dashboard/collections/${params.id}`}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
