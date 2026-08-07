import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    const result = await register({ name: name.trim(), email: email.trim(), password })
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <header className="border-b border-ink/5 px-5 py-5 md:px-8">
        <Link to="/" className="inline-flex flex-col">
          <span className="font-display text-2xl font-medium tracking-tight">Maren & Co</span>
          <span className="mt-0.5 text-[10px] font-medium tracking-[0.22em] text-ink-muted uppercase">Est. Oslo · 2014</span>
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-14">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10">
          <UserPlus className="h-5 w-5 text-terracotta" strokeWidth={1.75} />
        </div>
        <p className="mt-4 text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">Account</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">Join the house</h1>
        <p className="mt-3 text-sm text-ink-muted">Create your account to save favourites and check out faster.</p>
        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {error && (
            <div className="rounded-xl border border-terracotta/30 bg-terracotta/5 px-4 py-3 text-sm text-terracotta">{error}</div>
          )}
          <label className="block">
            <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">Full name</span>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-lg border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-terracotta" placeholder="Your name" autoComplete="name" />
          </label>
          <label className="block">
            <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-terracotta" placeholder="you@example.com" autoComplete="email" />
          </label>
          <label className="block">
            <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">Password</span>
            <div className="relative mt-2">
              <input type={showPassword ? 'text' : 'password'} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-ink/15 bg-transparent px-4 py-3 pr-11 text-sm outline-none transition focus:border-terracotta" placeholder="At least 6 characters" autoComplete="new-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted hover:text-ink" aria-label="Toggle password">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
          <label className="block">
            <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">Confirm password</span>
            <input type={showPassword ? 'text' : 'password'} required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-2 w-full rounded-lg border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-terracotta" placeholder="Repeat password" autoComplete="new-password" />
          </label>
          <button type="submit" disabled={loading} className="btn-primary w-full rounded-full py-3.5 disabled:opacity-60">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-ink underline underline-offset-4 hover:text-terracotta">Sign in</Link>
        </p>
      </main>
    </div>
  )
}
