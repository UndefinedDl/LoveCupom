// src/app/components/PricingModal.tsx
'use client'

import React, { useState } from 'react'
import { plans } from '@/constants/plans'
import { X, Check, CreditCard } from 'lucide-react'

export const PricingModal = ({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  if (!isOpen) return null

  const handlePlanSelection = (planType: string) => {
    setSelectedPlan(planType)
    setShowPaymentModal(true)
  }

  return (
    <>
      <div className="fixed inset-0 bg-transparent bg-opacity-10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Escolha seu Plano
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white border-2 rounded-lg p-6 ${
                    plan.popular
                      ? 'border-pink-500 shadow-lg'
                      : 'border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Mais Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm"
                      >
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-4 rounded-md font-medium text-white bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity flex items-center justify-center`}
                    onClick={() => handlePlanSelection(plan.planType)}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Escolher {plan.name}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Todos os planos: Pagamento único via PIX</p>
              <p>Acesso imediato após confirmação do pagamento</p>
              <p>Sem mensalidades ou taxas ocultas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pagamento PIX */}
      {showPaymentModal && selectedPlan && (
        <PaymentModal
          planType={selectedPlan}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedPlan(null)
          }}
          onPaymentSuccess={() => {
            setShowPaymentModal(false)
            setSelectedPlan(null)
            onClose()
          }}
        />
      )}
    </>
  )
}

// Componente do Modal de Pagamento PIX
function PaymentModal({
  planType,
  onClose,
  onPaymentSuccess
}: {
  planType: string
  onClose: () => void
  onPaymentSuccess: () => void
}) {
  const [step, setStep] = useState<'form' | 'payment'>('form')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerDocument: '',
    customerPhone: ''
  })
  const [paymentData, setPaymentData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const selectedPlan = plans.find(p => p.planType === planType)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/payments/create-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          planType
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar pagamento')
      }

      setPaymentData(data)
      setStep('payment')
    } catch (error: any) {
      setError(error.message || 'Erro ao criar pagamento')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="text-black fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        {step === 'form' ? (
          <>
            <div
              className={`bg-gradient-to-r ${selectedPlan?.color} p-4 flex justify-between items-center`}
            >
              <h3 className="text-white font-bold text-lg">
                Plano {selectedPlan?.name}
              </h3>
              <button onClick={onClose} className="text-white">
                <X />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="bg-pink-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="text-pink-600 h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold mb-2">
                  {selectedPlan?.price}
                </h4>
                <p className="text-gray-600">Pagamento único via PIX</p>
                <div className="mt-4 text-sm text-gray-500">
                  {selectedPlan?.features.map((feature, index) => (
                    <p key={index}>✓ {feature}</p>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    name="customerDocument"
                    value={formData.customerDocument}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    placeholder="000.000.000-00"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r ${selectedPlan?.color} text-white py-2 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-70`}
                >
                  {loading ? 'Gerando PIX...' : 'Gerar PIX'}
                </button>
              </form>
            </div>
          </>
        ) : (
          <PixPaymentStep
            paymentData={paymentData}
            customerEmail={formData.customerEmail}
            planName={selectedPlan?.name || ''}
            onClose={onClose}
            onPaymentConfirmed={onPaymentSuccess}
          />
        )}
      </div>
    </div>
  )
}

// Componente para mostrar o PIX e aguardar pagamento
function PixPaymentStep({
  paymentData,
  customerEmail,
  planName,
  onClose,
  onPaymentConfirmed
}: {
  paymentData: any
  customerEmail: string
  planName: string
  onClose: () => void
  onPaymentConfirmed: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(paymentData.status)
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [isChecking, setIsChecking] = useState(false)

  // Função para copiar código PIX
  const handleCopyPix = () => {
    navigator.clipboard.writeText(paymentData.copyPaste)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Polling para verificar status do pagamento
  React.useEffect(() => {
    if (paymentStatus === 'paid') return

    const checkPaymentStatus = async () => {
      try {
        setIsChecking(true)
        const response = await fetch(
          `/api/payments/status/${paymentData.paymentId}`
        )
        const data = await response.json()

        if (data.status === 'paid') {
          setPaymentStatus('paid')
          setTimeout(() => {
            // Redirecionar para registro com dados do pagamento
            window.location.href = `/register?payment=${
              paymentData.paymentId
            }&email=${encodeURIComponent(customerEmail)}`
          }, 2000)
        }
      } catch (error) {
        console.error('Erro ao verificar status do pagamento:', error)
      } finally {
        setIsChecking(false)
      }
    }

    const interval = setInterval(checkPaymentStatus, 3000)
    return () => clearInterval(interval)
  }, [paymentStatus, paymentData.paymentId, customerEmail])

  // Contador de tempo restante
  React.useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date().getTime()
      const expiry = new Date(paymentData.expiresAt).getTime()
      const difference = expiry - now

      if (difference > 0) {
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        )
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
      } else {
        setTimeLeft('Expirado')
        setPaymentStatus('expired')
      }
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [paymentData.expiresAt])

  if (paymentStatus === 'paid') {
    return (
      <div className="p-6 text-center">
        <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Check className="text-green-600 h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-green-600 mb-2">
          🎉 Pagamento Confirmado!
        </h3>
        <p className="text-gray-600 mb-4">
          Seu plano {planName} foi ativado com sucesso!
        </p>
        <div className="bg-green-50 p-3 rounded-md mb-4">
          <p className="text-sm text-green-700">
            Redirecionando para criar sua conta...
          </p>
        </div>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
      </div>
    )
  }

  if (paymentStatus === 'expired') {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <X className="text-red-600 h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-red-600 mb-2">PIX Expirado</h3>
        <p className="text-gray-600 mb-4">
          O tempo para pagamento expirou. Gere um novo PIX para continuar.
        </p>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="bg-gradient-to-r from-pink-400 to-pink-500 p-4 flex justify-between items-center">
        <h3 className="text-white font-bold text-lg">
          Pagamento PIX - {planName}
        </h3>
        <button onClick={onClose} className="text-white">
          <X />
        </button>
      </div>

      <div className="p-6">
        <div className="text-center mb-6">
          <h4 className="text-lg font-bold mb-2">
            {paymentData.amount / 100
              ? `R$ ${(paymentData.amount / 100).toFixed(2).replace('.', ',')}`
              : paymentData.price}
          </h4>
          <p className="text-gray-600 mb-2">
            Escaneie o QR Code ou copie o código PIX
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-500">
              Tempo restante: {timeLeft}
            </span>
            {isChecking && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
            )}
          </div>
        </div>

        {/* Status de aguardando confirmação */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex items-center">
            <div className="animate-pulse flex items-center">
              <div className="rounded-full h-3 w-3 bg-blue-400 mr-2"></div>
              <p className="text-sm text-blue-700 font-medium">
                Aguardando confirmação do pagamento...
              </p>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Assim que o pagamento for processado, você será redirecionado
            automaticamente.
          </p>
        </div>

        {/* QR Code */}
        <div className="text-center mb-4">
          <img
            src={paymentData.qrCodeBase64}
            alt="QR Code PIX"
            className="mx-auto w-48 h-48 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Código PIX para copiar */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código PIX (Copia e Cola):
          </label>
          <div className="flex">
            <input
              type="text"
              value={paymentData.copyPaste}
              readOnly
              className="flex-1 p-2 border border-gray-300 rounded-l-md text-xs bg-gray-50"
            />
            <button
              onClick={handleCopyPix}
              className="bg-pink-500 text-white px-4 py-2 rounded-r-md hover:bg-pink-600 transition-colors flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Copiado!</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Copiar</span>
                  📋
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
          <p className="font-medium mb-2">📱 Como pagar:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Abra seu app do banco ou carteira digital</li>
            <li>Escolha a opção PIX</li>
            <li>Escaneie o QR Code ou cole o código acima</li>
            <li>Confirme o pagamento</li>
            <li>Aguarde a confirmação automática</li>
          </ol>
        </div>

        {/* Dicas */}
        <div className="mt-4 p-3 bg-yellow-50 rounded-md">
          <p className="text-xs text-yellow-800">
            💡 <strong>Dica:</strong> O pagamento é processado instantaneamente.
            Mantenha esta tela aberta para ser redirecionado automaticamente
            após a confirmação.
          </p>
        </div>
      </div>
    </>
  )
}
