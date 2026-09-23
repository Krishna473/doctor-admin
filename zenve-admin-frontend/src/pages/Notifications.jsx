import { UserPlus, CheckCircle2, XCircle, MailCheck } from 'lucide-react'
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
const RAIL = {
  doctor_registered: 'border-l-amber',
  doctor_approved: 'border-l-brand',
  doctor_rejected: 'border-l-danger',
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function Notifications() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-faint">
          {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'You are all caught up.'}
        </p>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-sm">
            <MailCheck className="h-4 w-4" /> Mark all as read
          </button>
        )}
      </div>

      <div className="card divide-y divide-line overflow-hidden">
        {notifications.map((n) => {
          const Icon = ICONS[n.type] || UserPlus
          return (
            <div
              key={n.id}
              className={`flex items-start gap-3 border-l-[3px] px-5 py-4 ${n.read ? 'border-l-transparent' : `${RAIL[n.type] || 'border-l-admin'} bg-admin-light`}`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${ICON_TONE[n.type] || 'bg-surface2 text-ink-soft'}`}>
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{n.title}</p>
                <p className="text-sm text-ink-soft">{n.message}</p>
                <p className="text-xs text-ink-faint mt-1">{formatDate(n.createdAt)}</p>
              </div>
              {!n.read && (
                <button onClick={() => markRead(n.id)} className="btn-ghost text-xs shrink-0">
                  Mark read
                </button>
              )}
            </div>
          )
        })}
        {notifications.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-ink-faint">No notifications yet.</div>
        )}
      </div>
    </div>
  )
}
