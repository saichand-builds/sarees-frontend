import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useCartStore } from '../store/cartStore'
import useAuthStore from '../store/authStore'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { items, subtotal, clearCart, fetchCart } = useCartStore()
  const [address, setAddress] = useState({
    shipping_address: user?.address || '',
    shipping_city: user?.city || '',
    shipping_state: user?.state || '',
    shipping_pincode: user?.pincode || '',
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [couponCode, setCouponCode] = useState('')

  useEffect(() => { fetchCart() }, [])

  const shipping = subtotal >= 2499 ? 0 : 99
  const total = subtotal + shipping

  const createOrderMutation = useMutation({
    mutationFn: () => api.post('/orders/create', { ...address, payment_method: paymentMethod, coupon_code: couponCode }),
    onSuccess: (res) => {
      toast.success('Order placed successfully!')
      clearCart()
      navigate('/orders')
    },
    onError: () => toast.error('Failed to create order'),
  })

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Shipping Address</h3>
            <div className="space-y-4">
              <textarea value={address.shipping_address} onChange={(e) => setAddress({ ...address, shipping_address: e.target.value })}
                placeholder="Street Address" className="w-full p-3 border rounded-xl" rows="2" required />
              <div className="grid grid-cols-2 gap-4">
                <input value={address.shipping_city} onChange={(e) => setAddress({ ...address, shipping_city: e.target.value })}
                  placeholder="City" className="p-3 border rounded-xl" />
                <input value={address.shipping_state} onChange={(e) => setAddress({ ...address, shipping_state: e.target.value })}
                  placeholder="State" className="p-3 border rounded-xl" />
                <input value={address.shipping_pincode} onChange={(e) => setAddress({ ...address, shipping_pincode: e.target.value })}
                  placeholder="Pincode" className="p-3 border rounded-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="border-t pt-2 mt-2"><div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div></div>
          </div>

          <button onClick={() => createOrderMutation.mutate()} disabled={createOrderMutation.isPending}
            className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 disabled:opacity-50">
            {createOrderMutation.isPending ? 'Processing...' : `Place Order • ₹${total.toLocaleString('en-IN')}`}
          </button>
        </div>
      </div>
    </div>
  )
}