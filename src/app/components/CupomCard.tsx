import { Check, Clock } from 'lucide-react'
import { getIcon } from './GetIcon'

export type Coupon = {
  id: any
  icon: string
  category: string
  used: boolean
  title: string
  description: string
  validUntil: string
}

type CouponCardProps = {
  coupon: Coupon
  onClick: (coupon: Coupon) => void
}

export const CouponCard: React.FC<CouponCardProps> = ({ coupon, onClick }) => (
  <div
    className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 ${
      coupon.used ? 'opacity-70' : ''
    }`}
    onClick={() => onClick(coupon)}
  >
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {getIcon(coupon.icon)}
          <span className="ml-2 text-xs py-1 px-2 bg-pink-100 text-pink-800 rounded-full">
            {coupon.category}
          </span>
        </div>
        {coupon.used && (
          <span className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded-full flex items-center">
            <Check size={12} className="mr-1" /> Resgatado
          </span>
        )}
      </div>
      <h3 className="text-lg text-black font-bold mb-1">{coupon.title}</h3>
      <p className="text-gray-600 text-sm">{coupon.description}</p>
      <div className="mt-4 flex items-center text-xs text-gray-500">
        <Clock size={12} className="mr-1" /> Válido até: {coupon.validUntil}
      </div>
    </div>
    <div className="bg-gradient-to-r from-pink-100 to-red-100 p-2 text-center">
      <span className="text-sm font-medium text-pink-700">
        Clique para {coupon.used ? 'ver detalhes' : 'resgatar'}
      </span>
    </div>
  </div>
)
