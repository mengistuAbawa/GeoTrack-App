import { useState } from 'react'
import { Bell, ChevronDown, Menu, Search, Sun, Moon, HelpCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import CommandPalette from './CommandPalette'
import NotificationsDropdown from './NotificationsDropdown'
import ProfileModal from './ProfileModal'

export default function Topbar({ activePage, onNavigate, onMenuClick }) {
  const { admin } = useAuth()
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const adminName = admin?.name || 'Mengistu Admin'
  const initials = adminName.split(' ').map(n => n[0]).join('')

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 xl:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
          >
            <Menu size={19} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <button
                onClick={() => onNavigate && onNavigate('Overview')}
                className="hover:text-blue-600 transition"
              >
                Workspace
              </button>
              <span>/</span>
              <span className="font-semibold text-slate-600">{activePage}</span>
            </div>
            <h1 className="mt-0.5 truncate text-[17px] font-bold tracking-tight text-slate-900">{activePage}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Spotlight */}
          <button
            onClick={() => setShowCommandPalette(true)}
            aria-label="Quick search (Cmd+K)"
            className="hidden h-10 w-64 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-400 hover:border-blue-400 hover:bg-white md:flex transition"
          >
            <div className="flex items-center gap-2 text-xs">
              <Search size={16} />
              <span>Search anything...</span>
            </div>
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] text-slate-400 font-mono">⌘ K</kbd>
          </button>

          {/* Appearance Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme appearance"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 transition"
          >
            {isDarkMode ? <Moon size={18} className="text-indigo-600" /> : <Sun size={18} />}
          </button>

          {/* Help & Support Button */}
          <button
            onClick={() => onNavigate && onNavigate('Help & support')}
            aria-label="Help & Knowledge base"
            title="Help & Support"
            className="hidden rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 sm:block transition"
          >
            <HelpCircle size={18} />
          </button>

          {/* Notifications Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              title="Notifications"
              className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 transition"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
            </button>

            <NotificationsDropdown
              open={showNotifications}
              onClose={() => setShowNotifications(false)}
              onNavigate={onNavigate}
            />
          </div>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          {/* Profile Button */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-1 text-left hover:bg-slate-50 transition"
          >
            <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-800">{adminName}</p>
              <p className="text-[10px] text-slate-400 capitalize">{admin?.role || 'Administrator'}</p>
            </div>
            <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
          </button>
        </div>
      </header>

      {/* Spotlight Command Palette Modal */}
      <CommandPalette
        open={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSelectPage={onNavigate}
      />

      {/* Admin Profile Modal */}
      <ProfileModal
        open={showProfile}
        onClose={() => setShowProfile(false)}
        onNavigate={onNavigate}
      />
    </>
  )
}
