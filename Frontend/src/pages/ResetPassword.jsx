import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
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
          <span className="font-display text-2xl font-medium tracking-tight">Maren &amp; Co</span>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-14">
        <h1 className="font-display text-4xl font-medium tracking-tight">Reset Password</h1>
        <p className="mt-2 text-sm text-ink-muted">Set a new password for your SmartCart AI account.</p>

        {success ? (
          <div className="mt-8 rounded-md bg-emerald-500/10 p-4 text-center text-sm text-emerald-700">
            ✅ Password reset successfully! Redirecting to login…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && <p className="rounded bg-terracotta/10 p-3 text-xs text-terracotta">{error}</p>}

            <label className="block">
              <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">New Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-md border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-terracotta"
                placeholder="At least 8 characters"
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">Confirm New Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-2 w-full rounded-md border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-terracotta"
                placeholder="Repeat password"
              />
            </label>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full rounded-md bg-ink py-3.5 text-[13px] font-medium tracking-wide text-cream transition hover:bg-terracotta disabled:opacity-50"
            >
              {loading ? 'Updating…' : 'Reset Password'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
