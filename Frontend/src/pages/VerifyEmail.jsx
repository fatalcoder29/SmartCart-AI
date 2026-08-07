import { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, AlertCircle, Mail } from 'lucide-react'
import { api } from '../services/api'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying')
  const [error, setError] = useState('')

  useEffect(() => {
    async function doVerify() {
      if (!token) {
        setStatus('error')
        setError('Missing email verification token.')
        return
      }
      try {
        await api.verifyEmail(token)
        setStatus('success')
        setTimeout(() => navigate('/login'), 3000)
      } catch (err) {
        setStatus('error')
        setError(err.message || 'Email verification failed.')
      }
    }
    doVerify()
  }, [token, navigate])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-ink">
      <Link to="/" className="mb-10 inline-flex flex-col items-center">
        <span className="font-display text-2xl font-medium tracking-tight">Maren &amp; Co</span>
        <span className="mt-0.5 text-[10px] font-medium tracking-[0.22em] text-ink-muted uppercase">Est. Oslo · 2014</span>
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-cream p-8 text-center shadow-sm">
        {status === 'verifying' && (
          <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10">
              <Mail className="h-6 w-6 text-terracotta" />
            </div>
            <div className="mx-auto mt-5 h-8 w-8 animate-spin rounded-full border-2 border-terracotta border-t-transparent" />
            <h1 className="mt-5 font-display text-2xl font-medium">Verifying your email…</h1>
            <p className="mt-2 text-sm text-ink-muted">Please wait while we confirm your account.</p>
          </div>
        )}
        {status === 'success' && (
          <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-medium">Email verified!</h1>
            <p className="mt-2 text-sm text-ink-muted">Your account is fully active. Redirecting to sign in…</p>
            <Link to="/login" className="btn-primary mt-7 inline-flex rounded-full">Sign in now</Link>
          </div>
        )}
        {status === 'error' && (
          <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10">
              <AlertCircle className="h-7 w-7 text-terracotta" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-medium">Verification failed</h1>
            <p className="mt-2 text-sm text-terracotta">{error}</p>
            <Link to="/login" className="btn-primary mt-7 inline-flex rounded-full">Return to login</Link>
          </div>
        )}
      </div>
    </div>
  )
}
