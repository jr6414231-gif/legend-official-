import React, { useState, useEffect } from 'react'
import { Copy, Download, File, Video, Image, Music, FileText, Link2, Upload, X, Loader } from 'lucide-react'

export default function Home() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    username: '',
    email: '',
    reason: '',
    details: '',
    file: null
  })
  const [uploadMessage, setUploadMessage] = useState('')

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/get-all-reports')
      const data = await res.json()
      setReports(data.reports || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (fileType) => {
    if (!fileType) return <FileText size={24} className="text-blue-500" />
    
    if (fileType.includes('video')) return <Video size={24} className="text-red-500" />
    if (fileType.includes('image')) return <Image size={24} className="text-green-500" />
    if (fileType.includes('audio')) return <Music size={24} className="text-purple-500" />
    if (fileType.includes('pdf')) return <File size={24} className="text-orange-500" />
    
    return <FileText size={24} className="text-blue-500" />
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleFileChange = (e) => {
    setUploadForm({ ...uploadForm, file: e.target.files[0] })
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setUploading(true)
    setUploadMessage('')

    try {
      if (uploadForm.details.length < 50) {
        setUploadMessage('❌ Details must be at least 50 characters')
        setUploading(false)
        return
      }

      const formData = new FormData()
      formData.append('username', uploadForm.username)
      formData.append('email', uploadForm.email)
      formData.append('reason', uploadForm.reason)
      formData.append('details', uploadForm.details)
      if (uploadForm.file) {
        formData.append('file', uploadForm.file)
      }

      const res = await fetch('/api/upload-report', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (res.ok) {
        setUploadMessage('✅ Report uploaded successfully!')
        setUploadForm({
          username: '',
          email: '',
          reason: '',
          details: '',
          file: null
        })
        setTimeout(() => {
          setShowUploadModal(false)
          fetchReports()
        }, 2000)
      } else {
        setUploadMessage('❌ ' + data.message)
      }
    } catch (err) {
      setUploadMessage('❌ Error uploading report')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #E0E5EC 0%, #F8F9FA 100%)' }}>
      {/* Video Section */}
      <div className="w-full h-96 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden group">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
          src="/videos/intro.mp4"
        >
          Your browser doesn't support video
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-6xl font-bold mb-4 drop-shadow-2xl">Unban Requests</h1>
          <p className="text-2xl drop-shadow-lg">Community Appeals & Reports</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header with Upload Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Community Reports</h2>
            <p className="text-gray-600 text-lg">Total Reports: {reports.length}</p>
          </div>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-6 md:mt-0 px-8 py-4 rounded-2xl font-bold text-white flex items-center gap-2 transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)'
            }}
          >
            <Upload size={24} />
            Upload Report
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-12 h-12 animate-spin text-blue-500" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-xl">No reports yet. Be the first to upload!</p>
          </div>
        ) : (
          /* Reports Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report, idx) => (
              <div
                key={idx}
                className="rounded-3xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(145deg, #ffffff, #f3f6f9)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.08), inset 1px 1px 3px rgba(255,255,255,0.8), inset -1px -1px 3px rgba(0,0,0,0.05)'
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{report.username}</h3>
                    <p className="text-sm text-gray-500">{formatDate(report.timestamp)}</p>
                  </div>
                  <div className="p-4 rounded-2xl ml-4" style={{
                    background: 'linear-gradient(145deg, #E0E5EC, #ffffff)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.08), inset 1px 1px 2px rgba(255,255,255,0.8)'
                  }}>
                    {getFileIcon(report.fileType)}
                  </div>
                </div>

                {/* Reason Badge */}
                {report.reason && (
                  <div className="mb-5">
                    <span className="inline-block px-5 py-2 rounded-full text-sm font-bold" style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      boxShadow: '0 6px 16px rgba(102, 126, 234, 0.35)'
                    }}>
                      {report.reason}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="mb-6">
                  <p className="text-gray-700 line-clamp-4 leading-relaxed">{report.details}</p>
                </div>

                {/* File Info */}
                {report.fileUrl && (
                  <div className="mb-6 p-4 rounded-2xl" style={{
                    background: 'linear-gradient(145deg, #f3f6f9, #ffffff)',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.05), inset 1px 1px 2px rgba(255,255,255,0.8)'
                  }}>
                    <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <File size={16} className="text-blue-500" />
                      {report.fileName || 'Attachment'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">📊 {report.downloadCount || 0} downloads</p>
                  </div>
                )}

                {/* Stats */}
                <div className="mb-6 flex gap-4 text-sm">
                  <div className="flex-1">
                    <p className="text-gray-500">Views</p>
                    <p className="text-2xl font-bold text-gray-900">{report.views || 0}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500">Downloads</p>
                    <p className="text-2xl font-bold text-gray-900">{report.downloadCount || 0}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => copyToClipboard(report.details, idx)}
                    className="flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                      background: copied === idx ? 
                        'linear-gradient(135deg, #4CAF50, #45a049)' :
                        'linear-gradient(145deg, #E0E5EC, #ffffff)',
                      color: copied === idx ? 'white' : '#667eea',
                      boxShadow: copied === idx ?
                        '0 8px 16px rgba(76, 175, 80, 0.3)' :
                        '0 4px 8px rgba(0,0,0,0.08), inset 1px 1px 2px rgba(255,255,255,0.8)',
                      border: '2px solid',
                      borderColor: copied === idx ? '#4CAF50' : 'transparent'
                    }}
                  >
                    <Copy size={18} />
                    {copied === idx ? 'Copied!' : 'Copy'}
                  </button>

                  {report.fileUrl && (
                    <a
                      href={report.fileUrl}
                      download={report.fileName}
                      className="flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(145deg, #E0E5EC, #ffffff)',
                        color: '#667eea',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.08), inset 1px 1px 2px rgba(255,255,255,0.8)',
                        border: '2px solid transparent'
                      }}
                    >
                      <Download size={18} />
                      Download
                    </a>
                  )}
                </div>

                {/* Email */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-600 font-semibold">📧 {report.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full" style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Upload Report</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {uploadMessage && (
              <div className="mb-4 p-4 rounded-lg" style={{
                background: uploadMessage.includes('✅') ? 
                  'linear-gradient(135deg, #4CAF50, #45a049)' :
                  'linear-gradient(135deg, #f44336, #da190b)',
                color: 'white'
              }}>
                {uploadMessage}
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Username *</label>
                <input
                  type="text"
                  value={uploadForm.username}
                  onChange={(e) => setUploadForm({ ...uploadForm, username: e.target.value })}
                  required
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="Your username"
                  style={{
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05), inset 1px 1px 2px rgba(255,255,255,0.8)'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={uploadForm.email}
                  onChange={(e) => setUploadForm({ ...uploadForm, email: e.target.value })}
                  required
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="your@email.com"
                  style={{
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05), inset 1px 1px 2px rgba(255,255,255,0.8)'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Reason (Optional)</label>
                <select
                  value={uploadForm.reason}
                  onChange={(e) => setUploadForm({ ...uploadForm, reason: e.target.value })}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
                  style={{
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05), inset 1px 1px 2px rgba(255,255,255,0.8)'
                  }}
                >
                  <option value="">Select reason...</option>
                  <option value="Mistaken Identity">Mistaken Identity</option>
                  <option value="Policy Appeal">Policy Appeal</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Ban Appeal">Ban Appeal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Details (min 50 chars) *</label>
                <textarea
                  value={uploadForm.details}
                  onChange={(e) => setUploadForm({ ...uploadForm, details: e.target.value })}
                  required
                  minLength="50"
                  rows="5"
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all resize-none"
                  placeholder="Explain your report in detail..."
                  style={{
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05), inset 1px 1px 2px rgba(255,255,255,0.8)'
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">{uploadForm.details.length} / 2000</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload File (Video/Image/PDF)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer transition-all hover:border-blue-500"
                />
                {uploadForm.file && (
                  <p className="text-sm text-green-600 mt-2">✅ {uploadForm.file.name}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)'
                }}
              >
                {uploading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload Report
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-12 text-gray-600 border-t border-gray-300">
        <p className="text-lg font-semibold">🌐 Community Reports Platform</p>
        <p className="text-sm mt-2">Share your reports safely and securely</p>
      </div>
    </div>
  )
}
