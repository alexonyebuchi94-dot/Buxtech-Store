import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import GoogleSignInButton from '../components/GoogleSignInButton.jsx'

export default function Signup() {
  const { register } = useAuth()
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
      await register(form.name, form.email, form.password)
      navigate('/account')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="font-display text-4xl text-ink mb-8 tracking-wide text-center">CREATE ACCOUNT</h1>

      <div className="mb-6">
        <GoogleSignInButton onError={setError} />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-muted text-xs">OR</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
        />
        <input
          required
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
        />
        <input
          required
          type="password"
          name="password"
          placeholder="Password (min. 6 characters)"
          value={form.password}
          onChange={handleChange}
          className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan text-base font-semibold py-3 rounded shadow-glow disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Sign Up'}
        </button>
      </form>

      <p className="text-muted text-sm text-center mt-6">
        Already have an account? <Link to="/login" className="text-cyan hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
