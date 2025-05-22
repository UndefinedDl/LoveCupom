import { plans } from '@/constants/plans'
import { X, Check } from 'lucide-react'

export const PricingModal = ({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  if (!isOpen) return null

  return (
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
                  plan.popular ? 'border-pink-500 shadow-lg' : 'border-gray-200'
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
                  className={`w-full py-3 px-4 rounded-md font-medium text-white bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity`}
                  onClick={() => {
                    // Aqui você pode implementar a lógica de seleção do plano
                    console.log(`Plano selecionado: ${plan.name}`)
                    // Por enquanto, vamos redirecionar para o registro
                    window.location.href = '/register'
                  }}
                >
                  Escolher {plan.name}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Todos os planos incluem 2 dias de teste gratuito</p>
            <p>Cancele a qualquer momento, sem multas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
