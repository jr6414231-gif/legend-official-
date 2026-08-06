export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { username, email, reason, details, evidence } = req.body

    if (!username || !email || !details) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    if (details.length < 50) {
      return res.status(400).json({ message: 'Explanation must be at least 50 characters' })
    }

    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email' })
    }

    console.log('Request received:', {
      username,
      email,
      reason,
      details,
      evidence,
      timestamp: new Date().toISOString()
    })

    return res.status(200).json({
      message: 'Request submitted successfully',
      success: true
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
