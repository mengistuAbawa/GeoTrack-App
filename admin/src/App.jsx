import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Footer from './components/layout/Footer'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import LiveLocations from './pages/LiveLocations'
import Users from './pages/Users'
import SharingSessions from './pages/SharingSessions'
import LocationHistory from './pages/LocationHistory'
import MessagesReports from './pages/MessagesReports'
import NotificationsPage from './pages/NotificationsPage'
import SecurityAudit from './pages/SecurityAudit'
import SystemSettings from './pages/SystemSettings'
import HelpSupport from './pages/HelpSupport'

function MainLayout() {
  const { isAuthenticated, loading } = useAuth()
  const [activePage, setActivePage] = useState('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1522] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">Loading GeoTrack...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'Overview':
        return <Dashboard onNavigate={setActivePage} />
      case 'Live locations':
        return <LiveLocations />
      case 'Users':
        return <Users />
      case 'Sharing sessions':
        return <SharingSessions />
      case 'Location history':
        return <LocationHistory />
      case 'Messages & reports':
        return <MessagesReports />
      case 'Notifications':
        return <NotificationsPage />
      case 'Security & audit':
        return <SecurityAudit />
      case 'System settings':
        return <SystemSettings />
      case 'Help & support':
        return <HelpSupport />
      default:
        return <Dashboard onNavigate={setActivePage} />
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-800">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="min-h-screen lg:pl-[264px] flex flex-col justify-between">
        <div>
          <Topbar
            activePage={activePage}
            onNavigate={setActivePage}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-6 sm:px-6 xl:px-8">
            {renderActivePage()}
          </main>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}
