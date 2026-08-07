import { useState } from 'react'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  if (user) return <Navigate to={from} replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login({ email: email.trim(), password })
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <header className="border-b border-ink/5 px-5 py-5 md:px-8">
        <Link to="/" className="inline-flex flex-col">
          <span className="font-display text-2xl font-medium tracking-tight">Maren & Co</span>
          <span className="mt-0.5 text-[10px] font-medium tracking-[0.22em] text-ink-muted uppercase">
            Est. Oslo · 2014
          </span>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-14">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10">
          <Lock className="h-5 w-5 text-terracotta" strokeWidth={1.75} />
        </div>
        <p className="mt-4 text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">Account</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">Welcome back</h1>
        <p className="mt-3 text-sm text-ink-muted">
          Sign in to your Maren & Co account to continue shopping.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {error && (
            <div className="rounded-xl border border-terracotta/30 bg-terracotta/5 px-4 py-3 text-sm text-terracotta">
              {error}
            </div>
          )}

          <label className="block">
            <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-terracotta"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">Password</span>
            <div className="relative mt-2">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-ink/15 bg-transparent px-4 py-3 pr-11 text-sm outline-none transition focus:border-terracotta"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted transition hover:text-ink"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-ink-muted underline underline-offset-4 transition hover:text-terracotta"
            >
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full rounded-full py-3.5 disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-ink-muted">
          New here?{' '}
          <Link to="/register" className="font-medium text-ink underline underline-offset-4 transition hover:text-terracotta">
            Create an account
          </Link>
        </p>
      </main>
    </div>
  )
}
