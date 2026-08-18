import { useState, useRef } from 'react'

// Uploads one or more image files directly to Cloudinary using an unsigned
// upload preset, and returns an array of hosted image URLs.
// Requires VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

async function uploadOne(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed')
  return data.secure_url
}

export default function ImageUploader({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef(null)

  async function handleFileSelect(e) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError('Image upload isn\'t set up yet — paste an image URL below instead for now.')
      return
    }

    setUploading(true)
    setError('')

    try {
      const uploaded = await Promise.all(files.map(uploadOne))
      onChange([...images, ...uploaded])
    } catch (err) {
      setError(err.message || 'Upload failed — try again')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function removeImage(index) {
    onChange(images.filter((_, i) => i !== index))
  }

  function addUrl() {
    if (!urlInput.trim()) return
    onChange([...images, urlInput.trim()])
    setUrlInput('')
  }

  return (
    <div>
      <label className="text-sm text-muted block mb-2">
        Product Photos {images.length > 0 && `(${images.length})`}
      </label>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((url, i) => (
            <div key={i} className="relative w-24 h-24">
              <img src={url} alt={`Product ${i + 1}`} className="w-24 h-24 object-cover rounded border border-border" />
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-cyan text-base text-[10px] font-medium px-1.5 py-0.5 rounded">
                  MAIN
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 bg-surface border border-border rounded-full w-6 h-6 flex items-center justify-center text-muted hover:text-red-400"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 items-center flex-wrap">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="border border-border rounded px-4 py-2 text-sm text-ink hover:border-cyan disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : 'Add Photos'}
        </button>
        <span className="text-muted text-xs">You can select several at once — first photo is the main one</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste an image URL…"
          className="flex-1 bg-base border border-border rounded px-4 py-2.5 text-sm text-ink focus:border-cyan outline-none"
        />
        <button
          type="button"
          onClick={addUrl}
          className="border border-border rounded px-4 py-2.5 text-sm text-ink hover:border-cyan"
        >
          Add
        </button>
      </div>

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  )
}
