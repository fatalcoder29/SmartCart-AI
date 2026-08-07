import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, ArrowLeft } from 'lucide-react'
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
          <span className="mt-0.5 text-[10px] font-medium tracking-[0.22em] text-ink-muted uppercase">Est. Oslo · 2014</span>
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-14">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10">
          <KeyRound className="h-5 w-5 text-terracotta" strokeWidth={1.75} />
        </div>
        <p className="mt-4 text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">Account security</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">Forgot password?</h1>
        <p className="mt-3 text-sm text-ink-muted">Enter your account email and we'll send you a secure reset link.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && <div className="rounded-xl border border-terracotta/30 bg-terracotta/5 px-4 py-3 text-sm text-terracotta">{error}</div>}
          {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
          <label className="block">
            <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">Email address</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-terracotta" placeholder="you@example.com" autoComplete="email" />
          </label>
          <button type="submit" disabled={loading} className="btn-primary w-full rounded-full py-3.5 disabled:opacity-50">{loading ? 'Sending link…' : 'Send reset link'}</button>
        </form>
        <p className="mt-8 text-center text-sm text-ink-muted">
          <Link to="/login" className="inline-flex items-center gap-1.5 font-medium text-ink underline underline-offset-4 transition hover:text-terracotta">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </p>
      </main>
    </div>
  )
}
