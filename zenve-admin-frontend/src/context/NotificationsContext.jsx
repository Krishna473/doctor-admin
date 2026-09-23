import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import api from '../lib/api'
import { useAuth } from './AuthContext'

const NotificationsContext = createContext(null)
const POLL_INTERVAL_MS = 15000

export function NotificationsProvider({ children }) {
  const { token } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const timerRef = useRef(null)

  const refresh = useCallback(async () => {
    if (!token) return
    try {
      const data = await api.listNotifications(token)
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch {
      // silent — will retry on next poll
    }
  }, [token])

  useEffect(() => {
    if (!token) {
      setNotifications([])
      setUnreadCount(0)
      return
    }
    refresh()
    timerRef.current = setInterval(refresh, POLL_INTERVAL_MS)
    return () => clearInterval(timerRef.current)
  }, [token, refresh])

  const markRead = useCallback(
    async (id) => {
      if (!token) return
      await api.markNotificationRead(token, id)
      refresh()
    },
    [token, refresh]
  )

  const markAllRead = useCallback(async () => {
    if (!token) return
    await api.markAllNotificationsRead(token)
    refresh()
  }, [token, refresh])

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, refresh, markRead, markAllRead }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used within a NotificationsProvider')
  return ctx
}
