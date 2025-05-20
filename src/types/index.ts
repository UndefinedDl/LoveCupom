export type User = {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type CouponCollection = {
  id: string
  userId: string
  title: string
  description?: string | null
  shareToken: string
  createdAt: Date
  updatedAt: Date
  user?: User
  coupons?: Coupon[]
}

export type Coupon = {
  id: string
  collectionId: string
  title: string
  description: string
  icon: string
  category: string
  isUsed: boolean
  redeemedAt?: Date | null
  validUntil: Date
  createdAt: Date
  updatedAt: Date
  collection?: CouponCollection
}

export type CouponCreateInput = Omit<
  Coupon,
  | 'id'
  | 'collectionId'
  | 'isUsed'
  | 'redeemedAt'
  | 'createdAt'
  | 'updatedAt'
  | 'collection'
>

export type CollectionCreateInput = Omit<
  CouponCollection,
  | 'id'
  | 'userId'
  | 'shareToken'
  | 'createdAt'
  | 'updatedAt'
  | 'user'
  | 'coupons'
>
