import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../../utils/api'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrders() {
  const qc = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', selectedStatus],
    queryFn: () => api.get('/admin/orders', { params: { status: selectedStatus } }).then(r => r.data),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, tracking }) => api.put(`/admin/orders/${id}/status`, { order_status: status, tracking_number: tracking }),
    onSuccess: () => { toast.success('Order status updated'); qc.invalidateQueries(['admin-orders']) },
    onError: () => toast.error('Failed to update status'),
  })

  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div className="p-6">
      <h1 className="text-2xl font-display font-bold mb-6">Manage Orders</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setSelectedStatus('')} className={`px-4 py-2 rounded-full text-sm font-medium ${!selectedStatus ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}>All</button>
        {statuses.map(s => (
          <button key={s} onClick={() => setSelectedStatus(s)} className={`px-4 py-2 rounded-full text-sm font-medium ${selectedStatus === s ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{s}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr><th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th><th className="px-6 py-3 text-left text-sm font-semibold">Customer</th><th className="px-6 py-3 text-left text-sm font-semibold">Amount</th><th className="px-6 py-3 text-left text-sm font-semibold">Status</th><th className="px-6 py-3 text-left text-sm font-semibold">Date</th><th className="px-6 py-3 text-left text-sm font-semibold">Actions</th></tr>
          </thead>
          <tbody>
            {data?.data?.map(order => (
              <tr key={order.order_id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{order.order_number}</td>
                <td className="px-6 py-4">{order.first_name} {order.last_name}</td>
                <td className="px-6 py-4 font-bold">₹{order.total_amount.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.order_status]}`}>{order.order_status}</span></td>
                <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <select onChange={(e) => updateStatusMutation.mutate({ id: order.order_id, status: e.target.value, tracking: order.tracking_number })}
                    defaultValue={order.order_status} className="px-2 py-1 border rounded text-sm">
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}