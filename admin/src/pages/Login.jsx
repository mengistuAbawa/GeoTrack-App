import { useState } from 'react'
import { LocateFixed, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@geotrack.local')
  const [password, setPassword] = useState('ChangeThisPassword123!')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Invalid email or password. Please verify your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail('admin@geotrack.local')
    setPassword('ChangeThisPassword123!')
    setError(null)
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#0d1522] px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-md">
        {/* Brand header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/20 ring-1 ring-white/20">
            <LocateFixed size={28} className="text-white" />
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            GeoTrack<span className="text-blue-400">.</span> Admin
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Secure administrative control center & location management platform
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/80 p-7 shadow-2xl backdrop-blur-xl sm:p-8">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-400" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300" htmlFor="email">
                Administrator email
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@geotrack.local"
                  className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300" htmlFor="password">
                  Password
                </label>
                <span className="text-[10px] text-slate-400">Min. 12 characters</span>
              </div>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-2.5 pl-10 pr-10 text-xs text-white placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-slate-800 text-blue-600 focus:ring-blue-500/20"
                />
                <span className="text-xs text-slate-300">Remember credentials</span>
              </label>

              <button
                type="button"
                onClick={fillDemoCredentials}
                className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-[10px] font-semibold text-blue-300 hover:bg-blue-500/20"
              >
                <Sparkles size={11} /> Auto-fill demo
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign in to Dashboard</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Quick info note */}
          <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center">
            <p className="text-[11px] text-slate-400">
              Default Administrator: <span className="font-mono text-slate-200">admin@geotrack.local</span>
            </p>
            <p className="mt-0.5 text-[10px] text-slate-500">
              Password: <span className="font-mono text-slate-300">ChangeThisPassword123!</span>
            </p>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-center text-[11px] text-slate-500">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Protected by GeoTrack Security & JWT Bearer Token</span>
        </div>
      </div>
    </div>
  )
}
