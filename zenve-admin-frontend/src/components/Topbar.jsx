import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Menu, LogOut, Search, ChevronDown, UserPlus, CheckCircle2, XCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationsContext'

const ICONS = {
  doctor_registered: UserPlus,
  doctor_approved: CheckCircle2,
  doctor_rejected: XCircle,
}

const ICON_TONE = {
  doctor_registered: 'bg-amber-light text-amber',
  doctor_approved: 'bg-brand-light text-brand',
  doctor_rejected: 'bg-danger-light text-danger',
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}

function getTimeGreeting() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    return { text: 'Good morning', emoji: '☀️' }
  } else if (hour >= 12 && hour < 17) {
    return { text: 'Good afternoon', emoji: '🌤️' }
  } else if (hour >= 17 && hour < 21) {
    return { text: 'Good evening', emoji: '🌆' }
  } else {
    return { text: 'Good evening', emoji: '🌙' }
  }
}

export default function Topbar({ onMenuClick }) {
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [greeting, setGreeting] = useState(getTimeGreeting)
  const ref = useRef(null)
  const profileRef = useRef(null)
  const { admin, logout } = useAuth()
  const { notifications, unreadCount, markRead } = useNotifications()
  const navigate = useNavigate()

  useEffect(() => {
    // Check and update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getTimeGreeting())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const displayName = admin?.name
    ? (admin.name.toLowerCase().includes('admin') ? 'Zenve' : admin.name.split(' ')[0])
    : 'Zenve'

  return (
    <header className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-3 px-6 lg:px-8 pt-3.5 pb-2 bg-transparent shrink-0">
      {/* Decorative Top-Right Pet Wave Banner */}
      <div className="absolute top-0 right-0 h-20 w-72 pointer-events-none overflow-hidden hidden xl:block z-0">
        <svg
          className="absolute top-0 right-0 w-full h-full text-indigo-50/60"
          viewBox="0 0 320 120"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C90,40 180,95 320,30 L320,0 Z"
            fill="url(#topWaveGrad)"
          />
          <defs>
            <linearGradient id="topWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#E0E7FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Cursive text and paw print in top-right */}
        <div className="absolute top-2.5 right-6 flex items-center gap-2 select-none opacity-85">
          <svg className="w-4 h-4 text-[#434EE8]/50 transform -rotate-12" viewBox="0 0 24 24" fill="currentColor">
            <ellipse cx="6.5" cy="7" rx="1.8" ry="2.5" />
            <ellipse cx="11" cy="5" rx="1.8" ry="2.7" />
            <ellipse cx="15.5" cy="6" rx="1.8" ry="2.6" />
            <ellipse cx="19" cy="8.5" rx="1.6" ry="2.2" />
            <path d="M7.5 13.5C6.2 14.8 6 17 7.2 18.5C8.5 20.2 11 20.8 13 20C15 19.3 17 18.2 17.5 16.2C18 14.5 16.5 13 14.8 13.3C13.2 13.5 12.4 12.2 11 12C9.5 11.8 8.4 12.3 7.5 13.5Z" />
          </svg>
          <div className="font-script text-[15px] text-[#4F5B93] leading-none tracking-wide text-right">
            <p>Healthy Doctors</p>
            <p className="flex items-center justify-end gap-1">
              Happier Pets <span className="text-xs">♡</span>
            </p>
          </div>
        </div>
      </div>

      {/* Left Greeting */}
      <div className="flex items-center gap-2.5 relative z-10 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shrink-0 shadow-xs"
          aria-label="Open menu"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>
        <div className="min-w-0">
          <h1 className="font-display text-[22px] lg:text-[24px] font-bold text-[#181E38] tracking-tight flex items-center gap-2 leading-tight">
            {greeting.text}, {displayName} <span className="text-xl">{greeting.emoji}</span>
          </h1>
          <p className="text-[12px] text-[#78809A] mt-0.5">
            Here&apos;s what&apos;s happening with your doctors today.
          </p>
        </div>
      </div>

      {/* Right Controls: Search, Bell, Profile */}
      <div className="flex items-center gap-2.5 relative z-10 shrink-0">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search doctors, registrations..."
            className="w-52 md:w-60 lg:w-64 h-9 pl-9 pr-3 rounded-full border border-slate-200/90 bg-white/95 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#434EE8] focus:ring-2 focus:ring-[#434EE8]/10 shadow-xs transition-all"
          />
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-600 shadow-xs transition-colors hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#FF4242] px-1 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 mt-2 w-80 card p-0 overflow-hidden shadow-pop origin-top-right z-30"
              >
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <p className="font-display text-base font-semibold text-ink">Notifications</p>
                  {unreadCount > 0 ? (
                    <span className="rounded-full bg-danger-light px-2 py-0.5 text-[11px] font-semibold text-danger">
                      {unreadCount} new
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface2 px-2 py-0.5 text-[11px] font-medium text-ink-faint">
                      Caught up
                    </span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 6).map((n) => {
                    const Icon = ICONS[n.type] || UserPlus
                    return (
                      <button
                        key={n.id}
                        onClick={() => {
                          if (!n.read) markRead(n.id)
                          setOpen(false)
                          navigate('/doctors')
                        }}
                        className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-line last:border-b-0 hover:bg-surface2 transition-colors ${
                          !n.read ? 'bg-admin-light' : ''
                        }`}
                      >
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${ICON_TONE[n.type] || 'bg-surface2 text-ink-soft'}`}>
                          <Icon className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink truncate">{n.title}</p>
                          <p className="text-xs text-ink-faint line-clamp-2">{n.message}</p>
                          <p className="text-[11px] text-ink-faint mt-0.5">{timeAgo(n.createdAt)}</p>
                        </div>
                      </button>
                    )
                  })}
                  {notifications.length === 0 && (
                    <div className="px-4 py-6 text-center text-xs text-slate-400">
                      All caught up! No unread notifications.
                    </div>
                  )}
                </div>
                <Link
                  to="/notifications"
                  onClick={() => setOpen(false)}
                  className="block text-center text-xs font-semibold text-[#434EE8] px-4 py-2.5 border-t border-line hover:bg-slate-50 transition-colors"
                >
                  View all notifications
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar Dropdown Pill */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 h-10 pl-1.5 pr-2.5 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 shadow-xs transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8EDFC] text-[#434EE8] font-bold text-xs">
              ZA
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 card p-1.5 shadow-pop origin-top-right z-30"
              >
                <div className="px-3 py-2 border-b border-line mb-1">
                  <p className="text-xs font-semibold text-slate-800">Zenve Admin</p>
                  <p className="text-[11px] text-slate-400 truncate">admin@zenve.in</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-danger hover:bg-danger-light transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
