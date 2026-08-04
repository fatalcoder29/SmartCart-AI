import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await api.forgotPassword(email.trim())
      setMessage(res.message || 'Check your email for password reset instructions.')
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.')
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
        <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">Account Security</p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">Forgot password?</h1>
        <p className="mt-3 text-sm text-ink-muted">Enter your account email to receive a password reset link.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && <p className="bg-terracotta/10 p-3 text-xs text-terracotta rounded">{error}</p>}
          {message && <p className="bg-emerald-500/10 p-3 text-xs text-emerald-700 rounded">{message}</p>}

          <label className="block">
            <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">Email Address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-terracotta rounded-md"
              placeholder="you@example.com"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink py-3.5 text-[13px] font-medium tracking-wide text-cream transition hover:bg-terracotta rounded-md disabled:opacity-50"
          >
            {loading ? 'Sending link…' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Remember your password?{' '}
          <Link to="/login" className="text-ink underline hover:text-terracotta">Sign in</Link>
        </p>
      </main>
    </div>
  )
}
