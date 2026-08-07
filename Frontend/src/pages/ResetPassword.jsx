import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { api } from '../services/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.resetPassword({ token, password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err.message || 'Failed to reset password. Token may be invalid or expired.')
    } finally {
      setLoading(false)
    }
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
          <Lock className="h-5 w-5 text-terracotta" strokeWidth={1.75} />
        </div>
        <p className="mt-4 text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">Account security</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">Reset password</h1>
        <p className="mt-3 text-sm text-ink-muted">Choose a new password for your Maren & Co account.</p>
        {success ? (
          <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
            <p className="mt-3 text-sm font-medium text-emerald-800">Password reset successfully!</p>
            <p className="mt-1 text-xs text-emerald-700">Redirecting to sign in…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-xl border border-terracotta/30 bg-terracotta/5 px-4 py-3 text-sm text-terracotta">{error}</div>
            )}
            {!token && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Missing or invalid reset token. Please request a new link.
              </div>
            )}
            <label className="block">
              <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">New password</span>
              <div className="relative mt-2">
                <input type={showPassword ? 'text' : 'password'} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-ink/15 bg-transparent px-4 py-3 pr-11 text-sm outline-none transition focus:border-terracotta" placeholder="At least 8 characters" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted transition hover:text-ink" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            <label className="block">
              <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">Confirm new password</span>
              <input type={showPassword ? 'text' : 'password'} required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-2 w-full rounded-lg border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-terracotta" placeholder="Repeat password" autoComplete="new-password" />
            </label>
            <button type="submit" disabled={loading || !token} className="btn-primary w-full rounded-full py-3.5 disabled:opacity-50">
              {loading ? 'Updating…' : 'Reset password'}
            </button>
          </form>
        )}
        <p className="mt-8 text-center text-sm text-ink-muted">
          <Link to="/login" className="font-medium text-ink underline underline-offset-4 transition hover:text-terracotta">Back to sign in</Link>
        </p>
      </main>
    </div>
  )
}
