import { Clock, X } from 'lucide-react'
import { getIcon } from './GetIcon'
import { useEffect, useRef } from 'react'

export const CouponModal = ({
  isVisible,
  coupon,
  onClose,
  onRedeem,
  message
}: any) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        onClose()
      }
    }

    // Handle click outside to close modal
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener('keydown', handleEsc)
      document.addEventListener('mousedown', handleOutsideClick)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.removeEventListener('mousedown', handleOutsideClick)
      document.body.style.overflow = ''
    }
  }, [isVisible, onClose])

  if (!isVisible || !coupon) return null

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden transform transition-all duration-300 scale-100 opacity-100"
      >
        <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 flex justify-between items-center">
          <h3 className="text-white font-bold">{coupon.title}</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            aria-label="Fechar"
          >
            <X />
          </button>
        </div>
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="bg-pink-100 p-4 rounded-full">
              {getIcon(coupon.icon)}
            </div>
          </div>
          <p className="text-center text-black mb-4">{coupon.description}</p>
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
            <>
              <div className="bg-green-100 text-green-800 p-4 rounded-md text-center mb-4">
                {message}
              </div>
              <a
                href={`https://wa.me/5511944502819?text=Olá! Resgatei o cupom: ${encodeURIComponent(
                  coupon.title
                )} - ${encodeURIComponent(coupon.description)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 text-white py-3 rounded-md font-medium hover:bg-green-600 transition-colors focus:ring-2 focus:ring-green-400 focus:outline-none flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="mr-2 fill-current"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 4a8 8 0 00-8 8c0 1.421.376 2.79 1.07 4L4 20l4.209-1.063A8 8 0 0020 12a8 8 0 00-8-8zm0 14.5a6.508 6.508 0 01-3.589-1.082l-.259-.153-2.659.699.712-2.609-.167-.267A6.495 6.495 0 015.5 12 6.5 6.5 0 1112 18.5z" />
                </svg>
                Enviar para WhatsApp
              </a>
            </>
          ) : coupon.used ? (
            <div className="bg-gray-100 text-gray-800 p-4 rounded-md text-center mb-4">
              Este cupom já foi resgatado
            </div>
          ) : (
            <button
              onClick={onRedeem}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-md font-medium hover:from-pink-600 hover:to-red-600 transition-colors focus:ring-2 focus:ring-pink-400 focus:outline-none"
            >
              Resgatar Cupom
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
