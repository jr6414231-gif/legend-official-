export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // TODO: Fetch from Firebase
    // For now, return empty array
    const requests = []

    return res.status(200).json({
      requests: requests,
      success: true
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
