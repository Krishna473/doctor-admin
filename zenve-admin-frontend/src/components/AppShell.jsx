import { useState } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Stethoscope, Home, Bell } from 'lucide-react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Dashboard from '../pages/Dashboard'
import Doctors from '../pages/Doctors'
import Notifications from '../pages/Notifications'

const NAV = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/notifications', label: 'Notifications', icon: Bell },
]

function MobileNav({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute left-0 top-0 h-full w-72 bg-gradient-to-b from-[#1E255E] via-[#1A1F52] to-[#141842] text-white p-5 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 p-1 ring-1 ring-white/10 shadow-sm shrink-0">
                    <img
                      src="/assets/zenve-emblem.png"
                      alt="Zenve Logo"
                      className="h-full w-full object-contain filter drop-shadow"
                    />
                  </div>
                  <div className="leading-tight">
                    <p className="font-display text-base font-bold text-white tracking-tight">Zenve Doctors</p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#00DFD8]">ADMIN CRM</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-1.5 text-white/70 hover:text-white" aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {NAV.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive ? 'bg-[#434EE8] text-white font-semibold shadow-xs' : 'text-white/70 hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="font-script text-xl text-white/50 text-center py-4">
              Better care, Brighter lives ♡
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F7FB] selection:bg-[#434EE8]/20 selection:text-[#434EE8]">
      <Sidebar />
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto lg:overflow-hidden">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 min-h-0 px-4 md:px-6 lg:px-8 py-1 pb-3.5 w-full max-w-[1650px] mx-auto flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 min-h-0 flex flex-col"
            >
              <Routes location={location}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/notifications" element={<Notifications />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
