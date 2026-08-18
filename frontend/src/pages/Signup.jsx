import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext.jsx'
import SEO from '../components/SEO.jsx'

const GOOGLE_CONFIGURED = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function Signup() {
  const { signup, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    setError('')
    try {
      await loginWithGoogle(credentialResponse.credential)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-24">
      <SEO
        title="Create an Account — BuxTech"
        description="Create a free BuxTech account to check out faster and track your orders."
        noindex
      />
      <h1 className="font-display text-3xl text-ink mb-8 tracking-wide text-center">
        SIGN UP
      </h1>

      <div className="flex justify-center mb-6">
        {GOOGLE_CONFIGURED ? (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign-in failed')}
          />
        ) : (
          <div className="w-full text-center text-xs text-muted border border-border rounded px-4 py-3">
            Google sign-in isn't set up yet
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted">OR</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Full name"
          className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
        />
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
        />
        <input
          type="password"
          name="password"
          required
          minLength={8}
          value={form.password}
          onChange={handleChange}
          placeholder="Password (min. 8 characters)"
          className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan text-base font-semibold py-3 rounded shadow-glow hover:shadow-glowStrong transition-shadow disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Sign Up'}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-cyan hover:underline">Log in</Link>
      </p>
    </div>
  )
}
