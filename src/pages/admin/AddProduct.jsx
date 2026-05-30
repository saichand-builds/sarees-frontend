import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Upload, X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api'

export default function AddProduct() {
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    category_id: '',
    fabric: '',
    color: '',
    occasion: '',
    work_type: '',
    price: '',
    discount_price: '',
    stock_quantity: '',
    is_featured: false,
    is_new: false
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/products/categories').then(r => r.data),
  })

  const createProductMutation = useMutation({
    mutationFn: () => api.post('/admin/products', { ...form, images }),
    onSuccess: () => {
      toast.success('Product added successfully!')
      navigate('/admin/products')
    },
    onError: () => toast.error('Failed to add product'),
  })

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    // In a real app, you'd upload to server
    // For now, we'll use placeholder URLs
    const imageUrls = files.map((file, i) => 
      `/images/products/${form.slug || 'product'}-${i + 1}.jpg`
    )
    setImages([...images, ...imageUrls])
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-display font-bold mb-6">Add New Product</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={(e) => { e.preventDefault(); createProductMutation.mutate() }} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
              <input type="text" className="input bg-gray-50" value={form.slug} readOnly />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows="4"
              className="input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                required
                className="input"
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories?.data?.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
              <input type="text" className="input" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input type="text" className="input" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
              <input type="text" className="input" value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
              <input type="text" className="input" value={form.work_type} onChange={(e) => setForm({ ...form, work_type: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input type="number" required className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
              <input type="number" className="input" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input type="number" required className="input" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
              <div className="flex flex-wrap gap-3 mb-3">
                {images.map((img, i) => (
                  <div key={i} className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand-500">
                  <Upload size={20} className="text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Upload</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              <p className="text-xs text-gray-500">Upload product images. First image will be the main display image.</p>
            </div>
          </div>

          {/* Featured & New Flags */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
              <span className="text-sm">Feature this product (show on homepage)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} />
              <span className="text-sm">Mark as New Arrival</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={createProductMutation.isPending} className="btn-primary">
              {createProductMutation.isPending ? 'Adding...' : 'Add Product'}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}