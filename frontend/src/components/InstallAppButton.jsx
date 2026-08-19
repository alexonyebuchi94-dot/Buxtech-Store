import { useEffect, useState } from 'react'

function isIOS() {
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true // iOS Safari
  )
}

// Shows an "Install App" button that:
// - On Chrome/Android/Edge: triggers the native install prompt
// - On iOS Safari: shows manual "Add to Home Screen" instructions,
//   since Apple doesn't allow triggering the install prompt from code
// - Hides itself if already installed, or if the browser doesn't support it at all
export default function InstallAppButton({ className = '' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showIOSHint, setShowIOSHint] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    if (isStandalone()) {
      setInstalled(true)
      return
    }

    function handleBeforeInstallPrompt(e) {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    function handleInstalled() {
      setInstalled(true)
      setDeferredPrompt(null)
    }
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  if (installed) return null

  // Neither a native prompt available nor iOS — likely desktop browser
  // that doesn't support installing, or an unsupported browser. Hide quietly.
  if (!deferredPrompt && !isIOS()) return null

  async function handleClick() {
    if (isIOS()) {
      setShowIOSHint(true)
      return
    }
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={className || 'border border-border rounded px-4 py-2 text-sm text-ink hover:border-cyan transition-colors whitespace-nowrap'}
      >
        Install App
      </button>

      {showIOSHint && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowIOSHint(false)}
        >
          <div
            className="bg-surface border border-border rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg text-ink mb-3 tracking-wide">INSTALL BUXTECH</h3>
            <ol className="text-sm text-muted space-y-2 list-decimal list-inside mb-4">
              <li>Tap the Share icon <span className="text-ink">⬆️</span> in Safari's toolbar</li>
              <li>Scroll down and tap <span className="text-ink">"Add to Home Screen"</span></li>
              <li>Tap <span className="text-ink">"Add"</span> in the top right</li>
            </ol>
            <button
              onClick={() => setShowIOSHint(false)}
              className="w-full bg-cyan text-base font-semibold py-2.5 rounded"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
