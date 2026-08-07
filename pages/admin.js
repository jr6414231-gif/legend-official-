import React, { useState, useEffect } from 'react'
import { LogOut, Trash2, CheckCircle, XCircle, Edit2, BarChart3, Users, FileText } from 'lucide-react'

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [password, setPassword] = useState('')
  
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [statsMessage, setStatsMessage] = useState('')
  
  const [selectedReport, setSelectedReport] = useState(null)
  const [editingStatus, setEditingStatus] = useState('')

  useEffect(() => {
    if (isLoggedIn) {
      fetchReports()
    }
  }, [isLoggedIn])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsLoggedIn(true)
      setPassword('')
      setStatsMessage('✅ Admin logged in successfully!')
      setTimeout(() => setStatsMessage(''), 2000)
    } else {
      setStatsMessage('❌ Invalid password')
      setTimeout(() => setStatsMessage(''), 2000)
    }
  }

  const fetchReports = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/get-admin-reports')
      const data = await res.json()
      setReports(data.reports || [])
    } catch (err) {
      setStatsMessage('❌ Error fetching reports')
    } finally {
      setLoading(false)
    }
  }

  const deleteReport = async (reportId) => {
    if (confirm('Are you sure? This cannot be undone.')) {
      try {
        const res = await fetch(`/api/delete-report?id=${reportId}`, {
          method: 'DELETE'
        })
        
        if (res.ok) {
          setStatsMessage('✅ Report deleted!')
          fetchReports()
        }
      } catch (err) {
        setStatsMessage('❌ Error deleting report')
      }
    }
  }

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const res = await fetch('/api/update-report-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status: newStatus })
      })
      
      if (res.ok) {
        setStatsMessage('✅ Status updated!')
        setSelectedReport(null)
        fetchReports()
      }
    } catch (err) {
      setStatsMessage('❌ Error updating status')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Panel</h2>
          
          {statsMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-600 text-white text-sm">
              {statsMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              placeholder="Enter admin password"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all"
            >
              Login
            </button>
          </form>

          <p className="text-slate-400 text-center text-sm mt-4">
            Demo: <code className="bg-slate-900 px-2 py-1 rounded text-cyan-400">admin123</code>
          </p>
        </div>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-cyan-400">🔐 Admin Panel</h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Messages */}
        {statsMessage && (
          <div className="mb-6 p-4 rounded-lg" style={{
            background: statsMessage.includes('✅') ? 
              'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(69, 160, 73, 0.2))' :
              'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(218, 25, 11, 0.2))',
            borderLeft: `4px solid ${statsMessage.includes('✅') ? '#4CAF50' : '#f44336'}`
          }}>
            <p>{statsMessage}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Reports</p>
                <p className="text-4xl font-bold text-cyan-400">{reports.length}</p>
              </div>
              <FileText className="w-12 h-12 text-slate-600" />
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending</p>
                <p className="text-4xl font-bold text-yellow-400">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-slate-600" />
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Approved</p>
                <p className="text-4xl font-bold text-green-400">
                  {reports.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-slate-600" />
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold">All Reports</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : reports.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No reports found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-slate-600">
                  <tr>
                    <th className="px-6 py-4 text-left">Username</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Reason</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, idx) => (
                    <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 font-medium">{report.username}</td>
                      <td className="px-6 py-4 text-slate-400">{report.email}</td>
                      <td className="px-6 py-4">{report.reason || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          report.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                          report.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {report.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-bold transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-8 max-w-2xl w-full">
            <h3 className="text-2xl font-bold mb-6">{selectedReport.username}</h3>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">Status</label>
              <select
                value={editingStatus || selectedReport.status}
                onChange={(e) => setEditingStatus(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="mb-6">
              <p className="text-sm text-slate-400 mb-2">Details:</p>
              <p className="text-white bg-slate-700/50 p-4 rounded-lg max-h-40 overflow-y-auto">
                {selectedReport.details}
              </p>
            </div>

            {selectedReport.fileUrl && (
              <div className="mb-6">
                <a
                  href={selectedReport.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  📎 View Attachment
                </a>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => updateReportStatus(selectedReport.id, editingStatus || selectedReport.status)}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-bold transition-all"
              >
                Save Changes
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
