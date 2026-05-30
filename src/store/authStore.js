import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const res = await api.post('/auth/login', { email, password })
          if (res.data.success) {
            set({ user: res.data.user, token: res.data.token, isAuthenticated: true, isLoading: false })
            localStorage.setItem('token', res.data.token)
            return { success: true }
          }
          set({ isLoading: false })
          return { success: false, message: res.data.message }
        } catch (err) {
          set({ isLoading: false })
          return { success: false, message: err.response?.data?.message || 'Login failed' }
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const res = await api.post('/auth/register', userData)
          if (res.data.success) {
            set({ user: res.data.user, token: res.data.token, isAuthenticated: true, isLoading: false })
            localStorage.setItem('token', res.data.token)
            return { success: true }
          }
          set({ isLoading: false })
          return { success: false, message: res.data.message }
        } catch (err) {
          set({ isLoading: false })
          return { success: false, message: err.response?.data?.message || 'Registration failed' }
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        localStorage.removeItem('token')
        localStorage.removeItem('auth-storage')
      },

      updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),

      hydrate: () => {
        const { token } = get()
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      },
    }),
    { name: 'auth-storage' }
  )
)

export default useAuthStore