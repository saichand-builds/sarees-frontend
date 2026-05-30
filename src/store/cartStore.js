import { create } from 'zustand'
import api from '../utils/api'

export const useCartStore = create((set, get) => ({
  items: [],
  subtotal: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true })
    try {
      const res = await api.get('/cart')
      if (res.data.success) {
        set({ items: res.data.data, subtotal: res.data.subtotal, isLoading: false })
      }
    } catch (err) {
      set({ isLoading: false })
    }
  },

  addToCart: async (product_id, quantity = 1) => {
    try {
      await api.post('/cart/add', { product_id, quantity })
      await get().fetchCart()
    } catch (err) {
      console.error('Failed to add to cart', err)
    }
  },

  updateQuantity: async (cart_id, quantity) => {
    try {
      await api.put('/cart/update', { cart_id, quantity })
      await get().fetchCart()
    } catch (err) {
      console.error('Failed to update cart', err)
    }
  },

  removeItem: async (cart_id) => {
    try {
      await api.delete(`/cart/${cart_id}`)
      await get().fetchCart()
    } catch (err) {
      console.error('Failed to remove item', err)
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart')
      set({ items: [], subtotal: 0 })
    } catch (err) {
      console.error('Failed to clear cart', err)
    }
  },
}))