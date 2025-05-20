import { CouponCard, Coupon } from './CupomCard'

type CouponGridProps = {
  filteredCoupons: Coupon[]
  onCouponClick: (coupon: Coupon) => void
}

export const CouponGrid: React.FC<CouponGridProps> = ({
  filteredCoupons,
  onCouponClick
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredCoupons.map(coupon => (
      <CouponCard key={coupon.id} coupon={coupon} onClick={onCouponClick} />
    ))}
    {filteredCoupons.length === 0 && (
      <div className="col-span-3 text-center py-8">
        <p className="text-gray-500">
          Nenhum cupom encontrado com os filtros selecionados.
        </p>
      </div>
    )}
  </div>
)
