import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { User, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import api from '../utils/api'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const { register, handleSubmit } = useForm({ defaultValues: user })

  const saveMutation = useMutation({
    mutationFn: (data) => api.put('/auth/profile', data),
    onSuccess: (res) => { updateUser(res.data.user); toast.success('Profile saved!') },
    onError: () => toast.error('Save failed'),
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-display font-bold mb-6">My Profile</h1>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display font-black text-2xl">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div>
            <h3 className="font-display font-bold text-brand-950">{user?.first_name} {user?.last_name}</h3>
            <p className="text-brand-500 text-sm">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
              <input {...register('first_name')} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
              <input {...register('last_name')} className="input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input {...register('phone')} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
            <textarea {...register('address')} className="input resize-none" rows="2" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
              <input {...register('city')} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
              <input {...register('state')} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode</label>
              <input {...register('pincode')} className="input" />
            </div>
          </div>
          <button type="submit" disabled={saveMutation.isPending} className="btn-primary gap-2">
            <Save size={16} /> Save Profile
          </button>
        </form>
      </motion.div>
    </div>
  )
}