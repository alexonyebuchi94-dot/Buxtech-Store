import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import SEO from '../components/SEO.jsx'

export default function Account() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [loading, user, navigate])

  if (loading || !user) {
    return <div className="max-w-sm mx-auto px-6 py-24 text-center text-muted">Loading…</div>
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-24">
      <SEO title="My Account — BuxTech" noindex />
      <h1 className="font-display text-3xl text-ink mb-8 tracking-wide text-center">
        MY ACCOUNT
      </h1>
      <div className="border border-border rounded-lg p-6 bg-surface space-y-2 mb-6">
        <p className="text-ink font-semibold">{user.name}</p>
        <p className="text-muted text-sm">{user.email}</p>
      </div>
      <button
        onClick={() => {
          logout()
          navigate('/')
        }}
        className="w-full border border-border text-muted py-3 rounded hover:text-ink hover:border-cyan transition-colors"
      >
        Log Out
      </button>
    </div>
  )
}
