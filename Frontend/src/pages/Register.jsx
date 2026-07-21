import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const result = register({
      name: name.trim(),
      email: email.trim(),
      password,
    })
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
          <span className="mt-0.5 text-[10px] font-medium tracking-[0.22em] text-ink-muted uppercase">
            Est. Oslo · 2014
          </span>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-14">
        <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">
          Account
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">Join the house</h1>
        <p className="mt-3 text-sm text-ink-muted">
          Create your account to save favourites and check out faster.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {error && (
            <p className="border border-terracotta/30 bg-terracotta/5 px-4 py-3 text-sm text-terracotta">
              {error}
            </p>
          )}

          <label className="block">
            <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">
              Full name
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-terracotta"
              placeholder="Your name"
              autoComplete="name"
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-terracotta"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">
              Password
            </span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-terracotta"
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">
              Confirm password
            </span>
            <input
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-2 w-full border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-terracotta"
              placeholder="Repeat password"
              autoComplete="new-password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink py-3.5 text-[13px] font-medium tracking-wide text-cream transition hover:bg-terracotta disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-ink-muted">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-ink underline underline-offset-4 hover:text-terracotta"
          >
            Sign in
          </Link>
        </p>
      </main>
    </div>
  )
}
