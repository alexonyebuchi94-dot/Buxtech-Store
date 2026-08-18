import { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function GoogleSignInButton({ onError }) {
  const { loginWithGoogle } = useAuth()
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    function renderButton() {
      if (!window.google || !buttonRef.current) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            await loginWithGoogle(response.credential)
          } catch (err) {
            onError?.(err.message)
          }
        },
      })
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
      })
    }

    if (window.google) {
      renderButton()
    } else {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.onload = renderButton
      document.body.appendChild(script)
    }
  }, [])

  if (!GOOGLE_CLIENT_ID) {
    return (
      <p className="text-muted text-xs text-center">
        Google sign-in isn't set up yet — use email and password below.
      </p>
    )
  }

  return <div ref={buttonRef} className="flex justify-center" />
}
