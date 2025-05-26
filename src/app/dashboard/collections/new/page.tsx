'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertCircle, Crown } from 'lucide-react'
import { CreateCollectionInput } from '@/lib/validations'

export default function NewCollection() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateCollectionInput>({
    title: '',
    description: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [limitInfo, setLimitInfo] = useState<any>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        // Verificar se é um erro de limite
        if (response.status === 403 && data.limitReached) {
          setLimitInfo(data)
          setShowLimitModal(true)
          setLoading(false)
          return
        }
        throw new Error(data.error || 'Erro ao criar coleção')
      }

      // Redirecionar para a página da coleção criada
      router.push(`/dashboard/collections/${data.id}`)
    } catch (error: any) {
      setError(
        error.message || 'Ocorreu um erro ao criar a coleção. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="text-black">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Nova Coleção de Cupons</h1>

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
              Título da Coleção *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ex: Cupons de Amor para João"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descrição (opcional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder="Uma breve descrição sobre esta coleção de cupons"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-md font-medium hover:from-pink-600 hover:to-red-600 transition-colors disabled:opacity-70"
            >
              {loading ? 'Criando...' : 'Criar Coleção'}
            </button>

            <Link
              href="/dashboard"
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>

      {/* Modal de Limite Atingido */}
      {showLimitModal && limitInfo && (
        <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Crown className="h-8 w-8 text-yellow-500 mr-3" />
                <h3 className="text-xl font-bold">
                  Limite de Coleções Atingido
                </h3>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-orange-400 mr-2" />
                  <p className="text-sm text-orange-800">
                    Você já possui {limitInfo.currentCount} de{' '}
                    {limitInfo.maxAllowed} coleções do seu plano{' '}
                    {limitInfo.planType}.
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Para criar mais coleções, faça upgrade para um plano superior e
                organize melhor seus cupons de amor!
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={() => {
                    setShowLimitModal(false)
                    window.location.href = '/#pricing'
                  }}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-red-600 transition-colors"
                >
                  Fazer Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
