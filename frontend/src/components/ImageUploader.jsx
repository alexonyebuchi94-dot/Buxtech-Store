import { useState, useRef } from 'react'

// Uploads an image file directly to Cloudinary using an unsigned upload preset,
// and returns the hosted image URL. Requires VITE_CLOUDINARY_CLOUD_NAME and
// VITE_CLOUDINARY_UPLOAD_PRESET to be set (see .env.example).

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export default function ImageUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  async function handleFileSelect(e) {
    const file = e.target.files[0]
    if (!file) return

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError('Image upload isn\'t set up yet — paste an image URL below instead for now.')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', UPLOAD_PRESET)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()

      if (!res.ok) throw new Error(data.error?.message || 'Upload failed')

      onChange(data.secure_url)
    } catch (err) {
      setError(err.message || 'Upload failed — try again')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="text-sm text-muted block mb-1">Product Image</label>

      {value && (
        <div className="mb-3 relative w-32 h-32">
          <img src={value} alt="Preview" className="w-32 h-32 object-cover rounded border border-border" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-surface border border-border rounded-full w-6 h-6 flex items-center justify-center text-muted hover:text-red-400"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex gap-3 items-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="border border-border rounded px-4 py-2 text-sm text-ink hover:border-cyan disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : value ? 'Change Photo' : 'Upload Photo'}
        </button>
        <span className="text-muted text-xs">or paste a URL below</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className="w-full mt-3 bg-base border border-border rounded px-4 py-3 text-sm text-ink focus:border-cyan outline-none"
      />

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  )
}
