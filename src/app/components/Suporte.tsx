'use client'
import React, { useState } from 'react'
import { MessageCircle, X, Send, User, Mail } from 'lucide-react'

export const SupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    // Validação básica
    if (
      !formData.name ||
      !formData.email ||
      !formData.title ||
      !formData.message
    ) {
      setError('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem')
      }

      setIsSuccess(true)
      setFormData({ name: '', email: '', title: '', message: '' })

      // Fechar modal após 3 segundos
      setTimeout(() => {
        setIsSuccess(false)
        setIsOpen(false)
      }, 3000)
    } catch (err) {
      setError('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Botão flutuante */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 animate-pulse"
          title="Suporte"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>

      {/* Modal de suporte */}
      {isOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 flex justify-between items-center">
              <div className="flex items-center">
                <MessageCircle className="h-6 w-6 text-white mr-2" />
                <h3 className="text-white font-bold text-lg">Suporte</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isSuccess ? (
                <div className="text-center">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle className="text-green-600 h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-green-600 mb-2">
                    Mensagem Enviada!
                  </h4>
                  <p className="text-gray-600">
                    Sua mensagem foi enviada com sucesso. Nossa equipe entrará
                    em contato em breve.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      🤖 Como podemos ajudar?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Descreva sua dúvida ou problema e nossa equipe entrará em
                      contato o mais rápido possível.
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <User className="inline h-4 w-4 mr-1" />
                        Nome *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Seu nome"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Mail className="inline h-4 w-4 mr-1" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assunto *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Resumo do seu problema ou dúvida"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mensagem *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none"
                        placeholder="Descreva detalhadamente sua dúvida ou problema..."
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-2 px-4 rounded-md font-medium hover:from-pink-600 hover:to-red-600 transition-colors disabled:opacity-70 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-xs text-blue-800">
                      💡 <strong>Dica:</strong> Para problemas técnicos, inclua
                      detalhes como navegador utilizado e passos que levaram ao
                      erro.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
