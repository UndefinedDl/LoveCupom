import { Clock, X, Calendar } from 'lucide-react'
import { getIcon } from './GetIcon'

export const CouponModal = ({
  isVisible,
  coupon,
  onClose,
  onRedeem,
  message
}: any) => {
  if (!isVisible || !coupon) return null

  const getButtonContent = () => {
    if (message) {
      return null // Não mostrar botão se há mensagem
    }

    if (coupon.used) {
      return (
        <div className="bg-gray-100 text-gray-800 p-4 rounded-md text-center mb-4">
          Este cupom já foi resgatado
          {coupon.redeemedAt && (
            <div className="text-sm mt-1">
              Resgatado em:{' '}
              {new Date(coupon.redeemedAt).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>
      )
    }

    if (coupon.status === 'not-started') {
      return (
        <div className="bg-blue-100 text-blue-800 p-4 rounded-md text-center mb-4">
          Este cupom estará disponível a partir de {coupon.validStart}
        </div>
      )
    }

    if (coupon.status === 'expired') {
      return (
        <div className="bg-red-100 text-red-800 p-4 rounded-md text-center mb-4">
          Este cupom expirou e não pode mais ser resgatado
        </div>
      )
    }

    // Cupom disponível para resgate
    return (
      <button
        onClick={onRedeem}
        className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-md font-medium hover:from-pink-600 hover:to-red-600 transition-colors"
      >
        Resgatar Cupom
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 flex justify-between items-center">
          <h3 className="text-white font-bold">{coupon.title}</h3>
          <button onClick={onClose} className="text-white">
            <X />
          </button>
        </div>
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="bg-pink-100 p-4 rounded-full">
              {getIcon(coupon.icon)}
            </div>
          </div>
          <p className="text-center mb-4">{coupon.description}</p>
          <div className="flex justify-center mb-4">
            <span className="py-1 px-3 bg-pink-100 text-pink-800 rounded-full text-sm">
              {coupon.category}
            </span>
          </div>

          <div className="text-center text-sm text-gray-500 mb-6 space-y-1">
            {coupon.validStart && (
              <div className="flex items-center justify-center">
                <Calendar size={14} className="mr-1" /> Válido a partir de:{' '}
                {coupon.validStart}
              </div>
            )}
            <div className="flex items-center justify-center">
              <Clock size={14} className="mr-1" /> Válido até:{' '}
              {coupon.validUntil}
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-md text-center mb-4 ${
                message.includes('sucesso')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {message}
            </div>
          )}

          {getButtonContent()}
        </div>
      </div>
    </div>
  )
}
