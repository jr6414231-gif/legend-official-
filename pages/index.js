import React, { useState } from 'react'
import { Lock } from 'lucide-react'

export default function Home() {
  const [page, setPage] = useState('home')
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminPass, setAdminPass] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    reason: '',
    details: '',
    evidence: ''
  })
  
  const [message, setMessage] = useState('')
  const [requests, setRequests] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/submit-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setMessage('✅ Request submitted successfully!')
        setFormData({
          username: '',
          email: '',
          reason: '',
          details: '',
          evidence: ''
        })
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('❌ Error: ' + data.message)
      }
    } catch (err) {
      setMessage('❌ Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    
    if (adminPass === 'admin123') {
      setIsAdmin(true)
      setAdminPass('')
      
      try {
        const res = await fetch('/api/get-requests')
        const data = await res.json()
        setRequests(data.requests || [])
      } catch (err) {
        console.error('Error fetching requests:', err)
      }
    } else {
      setMessage('❌ Invalid password')
      setTimeout(() => setMessage(''), 2000)
    }
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <nav className="bg-slate-800 p-4 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-lg md:text-2xl font-bold text-cyan-400">📋 Unban Reports</h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setPage('home')
                setIsAdmin(false)
                setMessage('')
              }}
              className={`px-3 md:px-4 py-2 rounded transition-all text-sm md:text-base ${
                page === 'home'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              Form
            </button>
            <button
              onClick={() => setPage('admin')}
              className={`px-3 md:px-4 py-2 rounded transition-all text-sm md:text-base ${
                page === 'admin'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-4">
        
        {page === 'home' && (
          <div className="bg-slate-800 rounded-lg p-6 mt-6 border border-slate-700">
            <h2 className="text-3xl font-bold mb-4 text-cyan-400">Unban Request</h2>
            <p className="text-slate-400 mb-6">Submit your appeal</p>

            {message && (
              <div className="mb-4 p-3 bg-slate-700 rounded border border-slate-600">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Username *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  placeholder="Your username"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Ban Reason (if known)</label>
                <select
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">Select reason...</option>
                  <option value="mistaken">Mistaken Identity</option>
                  <option value="appeal">Policy Appeal</option>
                  <option value="technical">Technical Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Explanation (min 50 chars) *</label>
                <textarea
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                  required
                  minLength="50"
                  rows="5"
                  className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  placeholder="Explain why you should be unbanned..."
                />
                <p className="text-xs text-slate-400 mt-1">{formData.details.length} / 2000</p>
              </div>

              <div>
                <label className="block mb-2 font-medium">Evidence (optional)</label>
                <textarea
                  value={formData.evidence}
                  onChange={(e) =>
                    setFormData({ ...formData, evidence: e.target.value })
                  }
                  rows="3"
                  className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  placeholder="Any proof..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 p-3 rounded font-bold transition-all"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        )}

        {page === 'admin' && !isAdmin && (
          <div className="bg-slate-800 rounded-lg p-6 mt-6 text-center border border-slate-700">
            <Lock className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
            <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
            
            {message && (
              <div className="mb-4 p-3 bg-red-600 rounded">
                {message}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-cyan-500 focus:outline-none"
                placeholder="Enter password"
              />
              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 rounded font-bold"
              >
                Login
              </button>
            </form>

            <p className="text-slate-400 text-sm mt-4">
              Demo: <code className="bg-slate-900 px-2 py-1 rounded">admin123</code>
            </p>
          </div>
        )}

        {page === 'admin' && isAdmin && (
          <div className="bg-slate-800 rounded-lg p-6 mt-6 border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Admin Dashboard</h2>
              <button
                onClick={() => {
                  setIsAdmin(false)
                  setAdminPass('')
                  setPage('home')
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded font-bold text-sm"
              >
                Logout
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-700 p-4 rounded">
                <p className="text-slate-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-cyan-400">{requests.length}</p>
              </div>
              <div className="bg-slate-700 p-4 rounded">
                <p className="text-slate-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="bg-slate-700 p-4 rounded">
                <p className="text-slate-400 text-sm">Date</p>
                <p className="text-sm font-bold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {requests.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No requests</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Username</th>
                      <th className="px-4 py-2 text-left hidden md:table-cell">Email</th>
                      <th className="px-4 py-2 text-left">Reason</th>
                      <th className="px-4 py-2 text-left hidden md:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req, idx) => (
                      <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="px-4 py-2">{req.username}</td>
                        <td className="px-4 py-2 hidden md:table-cell text-slate-400 text-xs">{req.email}</td>
                        <td className="px-4 py-2 text-cyan-300">{req.reason || 'N/A'}</td>
                        <td className="px-4 py-2 hidden md:table-cell text-slate-400 text-xs">
                          {new Date(req.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
