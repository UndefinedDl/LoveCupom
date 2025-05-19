import { Clock, X } from 'lucide-react'
import { getIcon } from './GetIcon'

export const CouponModal = ({
  isVisible,
  coupon,
  onClose,
  onRedeem,
  message
}: any) => {
  if (!isVisible || !coupon) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
          <div className="text-center text-sm text-gray-500 mb-6">
            <span className="flex items-center justify-center">
              <Clock size={14} className="mr-1" /> Válido até:{' '}
              {coupon.validUntil}
            </span>
          </div>

          {message ? (
            <div className="bg-green-100 text-green-800 p-4 rounded-md text-center mb-4">
              {message}
            </div>
          ) : coupon.used ? (
            <div className="bg-gray-100 text-gray-800 p-4 rounded-md text-center mb-4">
              Este cupom já foi resgatado
            </div>
          ) : (
            <button
              onClick={onRedeem}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-md font-medium hover:from-pink-600 hover:to-red-600 transition-colors"
            >
              Resgatar Cupom
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
