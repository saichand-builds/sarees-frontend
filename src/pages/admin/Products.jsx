import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api'

export default function AdminProducts() {
  const qc = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({
    name: '', slug: '', description: '', category_id: '', price: '', discount_price: '', stock_quantity: '', images: []
  })

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/products?limit=100').then(r => r.data),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/products/categories').then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: () => api.post('/admin/products', form),
    onSuccess: () => { toast.success('Product created'); setShowModal(false); qc.invalidateQueries(['admin-products']) },
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-bold">Products</h1>
        <button onClick={() => { setEditingProduct(null); setForm({ name: '', slug: '', description: '', category_id: '', price: '', discount_price: '', stock_quantity: '', images: [] }); setShowModal(true) }} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr><th className="px-6 py-3 text-left">Product</th><th className="px-6 py-3 text-left">Category</th><th className="px-6 py-3 text-left">Price</th><th className="px-6 py-3 text-left">Stock</th><th className="px-6 py-3 text-left">Actions</th></tr>
          </thead>
          <tbody>
            {products?.data?.map(product => (
              <tr key={product.product_id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={product.images?.[0] || '/placeholder.jpg'} className="w-10 h-10 rounded object-cover" /><span>{product.name}</span></div></td>
                <td className="px-6 py-4">{product.category_name}</td>
                <td className="px-6 py-4">₹{product.price.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4">{product.stock_quantity}</td>
                <td className="px-6 py-4 flex gap-2"><button className="text-blue-600"><Edit size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}