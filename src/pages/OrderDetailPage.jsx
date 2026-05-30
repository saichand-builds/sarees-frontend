import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'
import api from '../utils/api'

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'bg-blue-100 text-blue-700' },
  processing: { label: 'Processing', icon: Package, color: 'bg-purple-100 text-purple-700' },
  shipped: { label: 'Shipped', icon: Truck, color: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-700' },
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`).then(r => r.data),
  })

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>

  const order = data?.data
  if (!order) return <div className="container mx-auto px-4 py-8">Order not found</div>

  const StatusIcon = statusConfig[order.order_status]?.icon || Package
  const statusColor = statusConfig[order.order_status]?.color || 'bg-gray-100 text-gray-700'

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-display font-bold mb-6">Order Details</h1>
      
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-medium">{order.order_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Order Date</p>
            <p>{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
              <StatusIcon size={12} /> {statusConfig[order.order_status]?.label || order.order_status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Method</p>
            <p className="capitalize">{order.payment_method}</p>
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p className="text-gray-600">{order.shipping_address}</p>
          <p className="text-gray-600">{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
        </div>

        {order.tracking_number && (
          <div className="border-t pt-4 mb-4">
            <p className="text-sm text-gray-500">Tracking Number</p>
            <p className="font-medium">{order.tracking_number}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-bold text-lg mb-4">Items</h3>
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div key={item.order_item_id} className="flex gap-4 py-3 border-b last:border-0">
              <img src={item.product_image || '/placeholder.jpg'} alt={item.product_name} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <h4 className="font-medium">{item.product_name}</h4>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">₹{item.total_price.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-500">₹{item.unit_price} each</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-4 space-y-2">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{order.shipping_charge === 0 ? 'Free' : `₹${order.shipping_charge}`}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{order.discount}</span></div>}
          <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span>₹{order.total_amount.toLocaleString('en-IN')}</span></div>
        </div>
      </div>
    </div>
  )
}