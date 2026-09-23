import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AppShell from './components/AppShell'
import ProtectedRoute from './components/ProtectedRoute'
import { NotificationsProvider } from './context/NotificationsContext'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <NotificationsProvider>
              <AppShell />
            </NotificationsProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
