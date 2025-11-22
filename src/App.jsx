import DicomUploader from './components/DicomUploader'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative min-h-screen p-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Radiology Scan Viewer</h1>
            <p className="text-blue-200">Upload DICOM files to visualize and browse metadata.</p>
          </header>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 shadow-xl">
            <DicomUploader />
          </div>
          <footer className="text-center text-blue-300/60 text-sm">
            Built with FastAPI + React • Windowing applied automatically • Images served securely
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App
