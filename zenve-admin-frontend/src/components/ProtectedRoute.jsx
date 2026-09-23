import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShieldCheck } from 'lucide-react'

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-admin to-admin-dark text-white shadow-glow animate-glow-pulse">
            <ShieldCheck className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <p className="text-sm text-ink-faint">Loading Zenve Admin…</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
