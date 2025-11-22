import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function DicomUploader() {
  const [studies, setStudies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchStudies = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/studies`)
      const data = await res.json()
      setStudies(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchStudies()
  }, [])

  const onUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${API_BASE}/api/studies/upload`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Upload failed')
      await fetchStudies()
    } catch (err) {
      setError(String(err.message || err))
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-semibold">DICOM Viewer</h2>
          <p className="text-blue-200/80 text-sm">Upload a .dcm file to render and store its metadata</p>
        </div>
        <label className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer transition">
          <input type="file" accept=".dcm,.dicom,.img,application/dicom" className="hidden" onChange={onUpload} />
          Upload DICOM
        </label>
      </div>

      {error && (
        <div className="text-red-300 bg-red-900/30 border border-red-800/50 p-3 rounded">{error}</div>
      )}

      {loading && (
        <div className="text-blue-200">Processing ...</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {studies.map((s) => (
          <div key={s.id} className="bg-slate-800/60 border border-blue-500/20 rounded-xl overflow-hidden">
            <img src={s.thumbnail_path} alt={s.series_description || 'thumbnail'} className="w-full h-48 object-contain bg-slate-900" />
            <div className="p-4 text-blue-100 text-sm space-y-1">
              <div className="font-semibold text-white">{s.modality || 'Unknown'} {s.study_date ? `• ${s.study_date}` : ''}</div>
              <div>Patient: {s.patient_name || s.patient_id || '—'}</div>
              <div>Size: {s.cols || '?'} × {s.rows || '?'}</div>
              <div>Window: {s.window_center ?? '—'} / {s.window_width ?? '—'}</div>
              <a href={s.image_path} target="_blank" className="inline-block mt-2 text-blue-400 hover:text-blue-300">Open full image</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
