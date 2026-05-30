import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react'
import api from '../utils/api'

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'bg-blue-100 text-blue-700' },
  processing: { label: 'Processing', icon: Package, color: 'bg-purple-100 text-purple-700' },
  shipped: { label: 'Shipped', icon: Truck, color: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-700' },
}

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders').then(r => r.data),
  })

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>

  const orders = data?.data || []

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order, i) => {
          const StatusIcon = statusConfig[order.order_status]?.icon || Package
          const statusColor = statusConfig[order.order_status]?.color || 'bg-gray-100 text-gray-700'
          return (
            <motion.div key={order.order_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-800">{order.order_number}</p>
                  <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                    <StatusIcon size={12} /> {statusConfig[order.order_status]?.label || order.order_status}
                  </span>
                  <p className="font-bold text-brand-600">₹{order.total_amount.toLocaleString('en-IN')}</p>
                  <Link to={`/orders/${order.order_id}`} className="text-brand-600 hover:text-brand-700">
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-gray-600">Items: {order.items?.length || 0}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}