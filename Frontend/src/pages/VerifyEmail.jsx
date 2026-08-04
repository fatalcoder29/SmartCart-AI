import { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '../services/api'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [status, setStatus] = useState('verifying') // verifying | success | error
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream text-ink px-4">
      <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-cream-dark/30 p-8 text-center shadow-lg">
        {status === 'verifying' && (
          <div>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-terracotta border-t-transparent"></div>
            <h1 className="mt-4 font-display text-2xl font-medium">Verifying your email…</h1>
            <p className="mt-2 text-xs text-ink-muted">Please wait while we confirm your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-600" />
            <h1 className="mt-4 font-display text-2xl font-medium">Email Verified!</h1>
            <p className="mt-2 text-xs text-ink-muted">Your account is fully active. Redirecting to sign in…</p>
            <Link to="/login" className="mt-6 inline-block rounded-full bg-ink px-6 py-2.5 text-xs text-cream hover:bg-terracotta">
              Sign In Now
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <AlertCircle className="mx-auto h-12 w-12 text-terracotta" />
            <h1 className="mt-4 font-display text-2xl font-medium">Verification Failed</h1>
            <p className="mt-2 text-xs text-terracotta">{error}</p>
            <Link to="/login" className="mt-6 inline-block rounded-full bg-ink px-6 py-2.5 text-xs text-cream hover:bg-terracotta">
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
