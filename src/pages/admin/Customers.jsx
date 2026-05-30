import { useQuery } from '@tanstack/react-query'
import api from '../../utils/api'

export default function AdminCustomers() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then(r => r.data),
  })

  if (isLoading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-display font-bold mb-6">Customers</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr><th className="px-6 py-3 text-left">Name</th><th className="px-6 py-3 text-left">Email</th><th className="px-6 py-3 text-left">Phone</th><th className="px-6 py-3 text-left">Joined</th><th className="px-6 py-3 text-left">Status</th></tr>
          </thead>
          <tbody>
            {data?.data?.filter(u => u.role === 'customer').map(user => (
              <tr key={user.user_id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{user.first_name} {user.last_name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.is_active ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}