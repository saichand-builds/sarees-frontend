import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Star } from 'lucide-react'
import api from '../utils/api'
import { useDebounce } from '../hooks/useDebounce'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')
  const [priceRange, setPriceRange] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/products/categories').then(r => r.data),
  })

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', debouncedSearch, category, sort, priceRange],
    queryFn: () => api.get('/products', { params: { search: debouncedSearch, category_id: category, sort, min_price: priceRange?.split('-')[0], max_price: priceRange?.split('-')[1] } }).then(r => r.data),
  })

  const priceRanges = [
    { label: 'All', value: '' },
    { label: 'Under ₹2,500', value: '0-2500' },
    { label: '₹2,500 - ₹5,000', value: '2500-5000' },
    { label: '₹5,000 - ₹10,000', value: '5000-10000' },
    { label: 'Above ₹10,000', value: '10000-999999' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              <button onClick={() => setCategory('')} className={`block text-sm ${!category ? 'text-brand-600 font-medium' : 'text-gray-600'}`}>All</button>
              {categories?.data?.map(cat => (
                <button key={cat.category_id} onClick={() => setCategory(cat.category_id)} className={`block text-sm ${category == cat.category_id ? 'text-brand-600 font-medium' : 'text-gray-600'}`}>{cat.name}</button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map(range => (
                <button key={range.value} onClick={() => setPriceRange(range.value)} className={`block text-sm ${priceRange === range.value ? 'text-brand-600 font-medium' : 'text-gray-600'}`}>{range.label}</button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sarees..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400" />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none">
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse"><div className="bg-gray-200 h-64 rounded-2xl mb-3" /><div className="h-4 bg-gray-200 rounded w-3/4 mb-2" /><div className="h-4 bg-gray-200 rounded w-1/2" /></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products?.data?.map((product, i) => (
                <motion.div key={product.product_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group cursor-pointer">
                  <Link to={`/products/${product.product_id}`}>
                    <div className="bg-gray-100 rounded-2xl overflow-hidden mb-3">
                      <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
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
          )}
          {products?.data?.length === 0 && <div className="text-center py-12 text-gray-500">No products found.</div>}
        </div>
      </div>
    </div>
  )
}