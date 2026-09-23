import { NavLink } from 'react-router-dom'
import { Home, Stethoscope, Bell, MoreHorizontal } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationsContext'

const NAV = [
  { to: '/', label: 'Dashboard', icon: Home, end: true },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/notifications', label: 'Notifications', icon: Bell, hasBadge: true },
]

export default function Sidebar() {
  const { admin } = useAuth()
  const { unreadCount } = useNotifications()
  const name = admin?.name || 'Zenve Admin'
  const email = admin?.email || 'admin@zenve.in'

  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 h-screen sticky top-0 flex-col justify-between bg-gradient-to-b from-[#1E255E] via-[#1A1F52] to-[#141842] text-white relative z-10 select-none overflow-hidden">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 p-1 ring-1 ring-white/10 shadow-sm shrink-0">
            <img
              src="/assets/zenve-emblem.png"
              alt="Zenve Logo"
              className="h-full w-full object-contain filter drop-shadow"
            />
          </div>
          <div className="leading-tight">
            <p className="font-display text-[16px] font-bold text-white tracking-tight">Zenve Doctors</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#00DFD8] mt-0.5">ADMIN CRM</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3.5 py-1.5 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end, hasBadge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#434EE8] text-white shadow-sm font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-[17px] w-[17px] transition-colors ${
                        isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                      }`}
                      strokeWidth={isActive ? 2.2 : 1.9}
                    />
                    <span>{label}</span>
                  </div>
                  {hasBadge && unreadCount > 0 && (
                    <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#FF4242] px-1 text-[10px] font-bold text-white shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Decorative Pet Element in Center/Bottom */}
      <div className="flex flex-col items-center justify-center px-4 py-3 text-center pointer-events-none opacity-60">
        {/* Paw Print SVG */}
        <svg
          className="w-8 h-8 text-white/40 mb-1.5 transform -rotate-12"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <ellipse cx="6.5" cy="7" rx="2" ry="2.8" transform="rotate(-15 6.5 7)" />
          <ellipse cx="11" cy="5" rx="2" ry="3" />
          <ellipse cx="15.5" cy="6" rx="2" ry="2.9" transform="rotate(12 15.5 6)" />
          <ellipse cx="19" cy="8.5" rx="1.8" ry="2.5" transform="rotate(25 19 8.5)" />
          <path d="M7.2 13.5C5.8 15 5.5 17.5 7 19.2C8.5 21 11.2 21.8 13.5 21C15.8 20.2 18.2 19 18.8 16.8C19.3 14.8 17.5 13.2 15.5 13.5C13.8 13.8 12.8 12.2 11.2 12C9.5 11.8 8.2 12.3 7.2 13.5Z" />
        </svg>
        <div className="font-script text-[22px] text-white/70 leading-[1.1] -rotate-6 tracking-wide">
          <p>Better care</p>
          <p className="flex items-center justify-center gap-1">
            Brighter lives <span className="text-lg">♡</span>
          </p>
        </div>
      </div>

      {/* Bottom Profile Bar */}
      <div className="px-3.5 py-3 border-t border-white/10">
        <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#1E255E] font-display text-[11px] font-bold shadow-xs">
              ZA
            </div>
            <div className="leading-tight min-w-0">
              <p className="truncate text-[13px] font-semibold text-white">Zenve Admin</p>
              <p className="truncate text-[11px] text-white/50">{email}</p>
            </div>
          </div>
          <MoreHorizontal className="h-4 w-4 text-white/50 hover:text-white shrink-0" />
        </div>
      </div>
    </aside>
  )
}
