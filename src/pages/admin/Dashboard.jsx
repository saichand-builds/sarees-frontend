import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Users, Package, ShoppingBag, IndianRupee } from 'lucide-react'
import api from '../../utils/api'

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then(r => r.data),
  })

  const stats = data?.stats || {}
  const recentOrders = data?.recentOrders || []
  const lowStock = data?.lowStock || []

  const kpis = [
    { label: 'Total Customers', value: stats.total_customers || 0, icon: Users, color: 'blue' },
    { label: 'Total Products', value: stats.total_products || 0, icon: Package, color: 'green' },
    { label: 'Total Orders', value: stats.total_orders || 0, icon: ShoppingBag, color: 'orange' },
    { label: 'Total Revenue', value: `₹${(stats.total_revenue || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'purple' },
  ]

  if (isLoading) return <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48" /><div className="grid grid-cols-4 gap-4"><div className="h-24 bg-gray-200 rounded" /></div></div></div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-display font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        {kpis.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center`}>
                <Icon size={20} className={`text-${color}-600`} />
              </div>
              <span className="text-2xl font-bold">{value}</span>
            </div>
            <p className="text-gray-500 text-sm">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.order_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div><p className="font-medium">{order.order_number}</p><p className="text-sm text-gray-500">{order.first_name} {order.last_name}</p></div>
                <div className="text-right"><p className="font-bold">₹{order.total_amount.toLocaleString('en-IN')}</p><p className={`text-xs ${order.order_status === 'delivered' ? 'text-green-600' : order.order_status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>{order.order_status}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold mb-4">Low Stock Alert</h3>
          <div className="space-y-3">
            {lowStock.map(product => (
              <div key={product.product_id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <p className="font-medium">{product.name}</p>
                <p className="text-red-600 font-bold">Stock: {product.stock_quantity}</p>
              </div>
            ))}
            {lowStock.length === 0 && <p className="text-gray-500 text-center py-4">All products have sufficient stock</p>}
          </div>
        </div>
      </div>
    </div>
  )
}