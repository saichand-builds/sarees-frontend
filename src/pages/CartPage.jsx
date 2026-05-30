import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react'
import { useCartStore } from '../store/cartStore'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, subtotal, fetchCart, updateQuantity, removeItem } = useCartStore()

  useEffect(() => { fetchCart() }, [])

  const shipping = subtotal >= 2499 ? 0 : 99
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-700">
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold mb-6">Shopping Cart ({items.length})</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <motion.div key={item.cart_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border">
              <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-brand-600 font-bold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.cart_id, item.quantity - 1)} className="w-7 h-7 rounded-full border flex items-center justify-center"><Minus size={12} /></button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cart_id, item.quantity + 1)} className="w-7 h-7 rounded-full border flex items-center justify-center"><Plus size={12} /></button>
                  </div>
                  <button onClick={() => removeItem(item.cart_id)} className="text-red-500 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="text-right"><p className="font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p></div>
            </motion.div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="border-t pt-2 mt-2"><div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div></div>
          </div>
          <button onClick={() => navigate('/checkout')} className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors">Proceed to Checkout</button>
          <Link to="/products" className="block text-center text-sm text-brand-600 mt-3 hover:underline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}