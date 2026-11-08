import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/orders/admin/all`, {
        headers: { 'x-admin-key': password },
      })
      if (!res.ok) throw new Error('Wrong password')
      sessionStorage.setItem('buxtech_admin_key', password)
      navigate('/admin/dashboard')
    } catch {
      setError('Incorrect password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-24">
      <h1 className="font-display text-3xl text-ink mb-8 tracking-wide text-center">
        ADMIN LOGIN
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan text-base font-semibold py-3 rounded shadow-glow hover:shadow-glowStrong transition-shadow disabled:opacity-50"
        >
          {loading ? 'Checking…' : 'Log In'}
        </button>
      </form>
    </div>
  )
}
