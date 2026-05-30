import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Truck, Shield, Clock, Heart } from 'lucide-react'
import api from '../utils/api'

export default function HomePage() {
  const { data: featuredProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.get('/products?is_featured=true&limit=8').then(r => r.data),
  })

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹2499' },
    { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions' },
    { icon: Clock, title: 'Easy Returns', desc: '7 days return policy' },
    { icon: Heart, title: 'Pure Quality', desc: 'Authentic handloom sarees' },
  ]

  return (
    <div>
      <section className="relative bg-gradient-to-r from-brand-600 to-brand-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-display font-black mb-4">
            Timeless Elegance
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl md:text-2xl text-brand-100 mb-8">
            Discover our collection of handcrafted sarees
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to="/products" className="inline-flex items-center gap-2 bg-white text-brand-600 px-8 py-3 rounded-full font-semibold hover:bg-brand-50 transition-colors">
              Shop Now <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-10">Featured Collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts?.data?.slice(0, 4).map((product, i) => (
              <motion.div key={product.product_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group cursor-pointer">
                <Link to={`/products/${product.product_id}`}>
                  <div className="bg-gray-100 rounded-2xl overflow-hidden mb-3">
                    <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-brand-600 font-bold">₹{product.discount_price || product.price}</span>
                    {product.discount_price && <span className="text-gray-400 line-through text-sm">₹{product.price}</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{product.rating || 0}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}