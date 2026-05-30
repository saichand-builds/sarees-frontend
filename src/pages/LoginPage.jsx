import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [showPw, setShowPw] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password)
    if (result.success) {
      const user = useAuthStore.getState().user
      toast.success(`Welcome back, ${user.first_name}!`)
      navigate(user.role === 'admin' ? '/admin' : '/')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-brand-50 to-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-brand-600 items-center justify-center mb-4">
            <span className="text-2xl font-display font-black text-white">S</span>
          </div>
          <h1 className="text-3xl font-display font-black text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to continue shopping</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input {...register('email', { required: 'Email is required' })} type="email" className="input" placeholder="you@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input {...register('password', { required: 'Password is required' })} type={showPw ? 'text' : 'password'} className="input pr-11" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center py-3 text-base">
            {isLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Don't have an account? <Link to="/register" className="text-brand-600 font-semibold hover:underline">Create one</Link>
        </p>

        <div className="mt-6 p-4 bg-brand-50 rounded-xl text-xs text-gray-600">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          <p>Customer: customer@demo.com / Demo@1234</p>
          <p>Admin: admin@sarees.com / Demo@1234</p>
        </div>
      </motion.div>
    </div>
  )
}