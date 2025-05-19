'use client'
import { initialCoupons } from '@/constants/cupoms'
import Image from 'next/image'
import { SetStateAction, useEffect, useState } from 'react'
import { Header } from './components/Header'
import { SearchBar } from './components/Search'
import { CouponModal } from './components/CupomModal'
import { CouponGrid } from './components/CupomGrid'

type Coupon = {
  id: string
  title: string
  description: string
  category: string
  used: boolean
  icon: string
  validUntil: string
}

export default function Home() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [modalMessage, setModalMessage] = useState('')

  // Load coupons from localStorage (or use initial coupons if they don't exist)
  useEffect(() => {
    const storedCoupons = localStorage.getItem('loveCoupons')
    if (storedCoupons) {
      setCoupons(JSON.parse(storedCoupons))
    } else {
      const couponsWithStringId = initialCoupons.map(coupon => ({
        ...coupon,
        id: coupon.id.toString()
      }))
      setCoupons(couponsWithStringId)
      localStorage.setItem('loveCoupons', JSON.stringify(couponsWithStringId))
    }
  }, [])

  // Save coupons to localStorage whenever they change
  useEffect(() => {
    if (coupons.length > 0) {
      localStorage.setItem('loveCoupons', JSON.stringify(coupons))
    }
  }, [coupons])

  // Open the coupon details modal
  const openModal = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setModalVisible(true)
    setModalMessage('')
  }

  // Close the modal
  const closeModal = () => {
    setModalVisible(false)
    setSelectedCoupon(null)
  }

  // Redeem a coupon
  const redeemCoupon = () => {
    if (!selectedCoupon) return

    const updatedCoupons = coupons.map(c =>
      c.id === selectedCoupon.id ? { ...c, used: true } : c
    )

    setCoupons(updatedCoupons)
    setModalMessage(
      'Cupom resgatado com sucesso! Mostre esta tela para seu amor.'
    )
  }

  // Filter coupons based on search, category, and status
  const filteredCoupons = coupons.filter(coupon => {
    const matchesCategory =
      categoryFilter === 'All' || coupon.category === categoryFilter
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Available' && !coupon.used) ||
      (statusFilter === 'Redeemed' && coupon.used)
    const matchesSearch =
      coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesStatus && matchesSearch
  })

  // Get all unique categories
  const categories = ['All', ...new Set(coupons.map(c => c.category))]
  return (
    <>
      <div className="bg-pink-50 min-h-screen pb-8">
        <Header />

        <div className="container mx-auto p-4">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categories={categories}
          />

          <CouponGrid
            filteredCoupons={filteredCoupons}
            onCouponClick={openModal}
          />
        </div>

        <CouponModal
          isVisible={modalVisible}
          coupon={selectedCoupon}
          onClose={closeModal}
          onRedeem={redeemCoupon}
          message={modalMessage}
        />
      </div>
    </>
  )
}
