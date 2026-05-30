import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useCartStore } from '../store/cartStore'

export default function WishlistPage() {
  const qc = useQueryClient()
  const { addToCart } = useCartStore()

  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get('/wishlist').then(r => r.data),
  })

  const removeMutation = useMutation({
    mutationFn: (productId) => api.delete(`/wishlist/${productId}`),
    onSuccess: () => {
      qc.invalidateQueries(['wishlist'])
      toast.success('Removed from wishlist')
    },
  })

  const items = data?.data || []

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save your favorite sarees here</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold">Explore Products</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold mb-6">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <motion.div key={item.wishlist_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="group relative">
            <Link to={`/products/${item.product_id}`}>
              <div className="bg-gray-100 rounded-2xl overflow-hidden mb-3">
                <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-brand-600 font-bold">₹{item.discount_price || item.price}</span>
              </div>
            </Link>
            <div className="flex gap-2 mt-3">
              <button onClick={() => addToCart(item.product_id)} className="flex-1 bg-brand-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors">
                Add to Cart
              </button>
              <button onClick={() => removeMutation.mutate(item.product_id)} className="w-10 h-10 rounded-lg border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}