import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Home, ShoppingBag, Heart, User, ShoppingCart, LogOut, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'

const NAV = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/products', icon: ShoppingBag, label: 'Shop' },
  { to: '/wishlist', icon: Heart, label: 'Wishlist' },
  { to: '/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function CustomerLayout() {
  const { user, logout } = useAuthStore()
  const { items } = useCartStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const doLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-gray-600">
              <Menu size={24} />
            </button>
            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">S</span>
              </div>
              <span className="font-display font-bold text-xl text-gray-800">SareeVista</span>
            </NavLink>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => 
                `flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-brand-500'}`
              }>
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <NavLink to="/cart" className="relative text-gray-600 hover:text-brand-500">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </NavLink>
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">{user?.first_name}</div>
                <button onClick={doLogout} className="text-xs text-gray-400 hover:text-red-500">Logout</button>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 lg:hidden shadow-xl">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <span className="font-display font-bold text-gray-800">Menu</span>
                <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
              </div>
              <nav className="p-4 space-y-2">
                {NAV.map(({ to, icon: Icon, label }) => (
                  <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-brand-50 text-brand-600' : 'text-gray-600'}`
                    }>
                    <Icon size={18} />{label}
                  </NavLink>
                ))}
                <button onClick={() => { doLogout(); setMobileOpen(false) }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 w-full">
                  <LogOut size={18} /> Logout
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main><Outlet /></main>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 SareeVista. All rights reserved.</p>
          <p className="text-sm mt-2">Beautiful Sarees for Every Occasion</p>
        </div>
      </footer>
    </div>
  )
}