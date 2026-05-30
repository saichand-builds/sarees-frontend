import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Heart, Truck, Shield, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useCartStore } from '../store/cartStore'
import useAuthStore from '../store/authStore'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { addToCart } = useCartStore()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`).then(r => r.data),
  })

  const addToWishlistMutation = useMutation({
    mutationFn: () => api.post('/wishlist/add', { product_id: id }),
    onSuccess: () => toast.success('Added to wishlist'),
    onError: () => toast.error('Failed to add to wishlist'),
  })

  const addToCartHandler = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }
    addToCart(id, quantity)
    toast.success('Added to cart')
  }

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>
  if (!product?.data) return <div className="container mx-auto px-4 py-8">Product not found</div>

  const p = product.data
  const images = p.images || ['/placeholder.jpg']
  const finalPrice = p.discount_price || p.price

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4">
            <img src={images[selectedImage]} alt={p.name} className="w-full h-96 object-cover" />
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {images.map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === i ? 'border-brand-500' : 'border-transparent'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">{p.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1"><Star size={18} className="fill-yellow-400 text-yellow-400" /><span className="font-medium">{p.rating || 0}</span></div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">{p.total_reviews} reviews</span>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-bold text-brand-600">₹{finalPrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="space-y-3 mb-6">
            {p.fabric && <p><span className="font-medium">Fabric:</span> {p.fabric}</p>}
            {p.work_type && <p><span className="font-medium">Work Type:</span> {p.work_type}</p>}
            {p.occasion && <p><span className="font-medium">Occasion:</span> {p.occasion}</p>}
            {p.color && <p><span className="font-medium">Color:</span> {p.color}</p>}
          </div>

          <div className="mb-6">
            <label className="font-medium block mb-2">Quantity:</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">-</button>
              <span className="w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">+</button>
              <span className="text-gray-500 text-sm">({p.stock_quantity} available)</span>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button onClick={addToCartHandler} className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"><ShoppingCart size={18} /> Add to Cart</button>
            <button onClick={() => addToWishlistMutation.mutate()} className="w-12 h-12 rounded-xl border border-gray-300 flex items-center justify-center hover:border-brand-500 hover:text-brand-500 transition-colors"><Heart size={20} /></button>
          </div>

          <div className="border-t pt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600"><Truck size={18} /> Free Shipping on orders above ₹2499</div>
            <div className="flex items-center gap-3 text-sm text-gray-600"><Shield size={18} /> 7 Days Return Policy</div>
            <div className="flex items-center gap-3 text-sm text-gray-600"><Clock size={18} /> Authentic Handloom Product</div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-3">Description</h3>
        <p className="text-gray-600">{p.description}</p>
      </div>
    </div>
  )
}