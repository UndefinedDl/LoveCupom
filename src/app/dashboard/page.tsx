'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { PlusCircle, Heart, Gift, Calendar } from 'lucide-react'
import { formatDateBR } from '@/lib/utils'

type Collection = {
  id: string
  title: string
  description: string | null
  shareToken: string
  createdAt: string
  _count: {
    coupons: number
  }
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/collections')

        if (!response.ok) {
          throw new Error('Falha ao buscar coleções')
        }

        const data = await response.json()
        setCollections(data)
      } catch (err) {
        console.error('Erro ao buscar coleções:', err)
        setError(
          'Não foi possível carregar suas coleções. Tente novamente mais tarde.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  const getRandomIcon = () => {
    const icons = [
      <Heart key="heart" className="text-red-500" />,
      <Gift key="gift" className="text-purple-500" />,
      <Calendar key="calendar" className="text-blue-500" />
    ]
    return icons[Math.floor(Math.random() * icons.length)]
  }

  return (
    <div className="text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bem-vindo, {session?.user?.name}</h1>
        <Link
          href="/dashboard/collections/new"
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-md font-medium flex items-center hover:from-pink-600 hover:to-red-600 transition-colors"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Nova Coleção
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-pink-200 rounded-full mb-4"></div>
            <div className="h-4 w-48 bg-pink-200 rounded mb-3"></div>
            <div className="h-3 w-32 bg-pink-100 rounded"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      ) : collections.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-pink-500" fill="#ec4899" />
          </div>
          <h2 className="text-xl font-bold mb-2">Nenhuma coleção encontrada</h2>
          <p className="text-gray-600 mb-6">
            Crie sua primeira coleção de cupons de amor para compartilhar com
            aquela pessoa especial.
          </p>
          <Link
            href="/dashboard/collections/new"
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-md font-medium inline-flex items-center hover:from-pink-600 hover:to-red-600 transition-colors"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Criar Coleção
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(collection => (
            <div
              key={collection.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-pink-100 p-3 rounded-full">
                    {getRandomIcon()}
                  </div>
                  <span className="text-sm bg-pink-100 text-pink-800 rounded-full px-3 py-1">
                    {collection._count.coupons} cupons
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{collection.title}</h3>
                {collection.description && (
                  <p className="text-gray-600 mb-4">{collection.description}</p>
                )}
                <div className="text-sm text-gray-500 mb-4">
                  Criado em: {formatDateBR(collection.createdAt)}
                </div>
                <div className="flex flex-col space-y-2">
                  <Link
                    href={`/dashboard/collections/${collection.id}`}
                    className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-center py-2 rounded-md font-medium hover:from-pink-600 hover:to-red-600 transition-colors"
                  >
                    Gerenciar Cupons
                  </Link>
                  <Link
                    href={`/s/${collection.shareToken}`}
                    target="_blank"
                    className="bg-pink-100 text-pink-700 text-center py-2 rounded-md font-medium hover:bg-pink-200 transition-colors"
                  >
                    Ver Link Compartilhado
                  </Link>
                </div>
              </div>
            </div>
          ))}

          <Link
            href="/dashboard/collections/new"
            className="bg-white rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 h-full hover:border-pink-300 hover:bg-pink-50 transition-colors"
          >
            <PlusCircle className="h-12 w-12 text-gray-400 mb-4" />
            <span className="text-gray-600 font-medium">
              Criar Nova Coleção
            </span>
          </Link>
        </div>
      )}
    </div>
  )
}
