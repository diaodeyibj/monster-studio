module.exports = function handler(req, res) {
  try {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id')
    res.setHeader('Content-Type', 'application/json')
    
    // 处理OPTIONS预检请求
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      headers: {
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type']
      },
      environment: process.env.NODE_ENV || 'unknown',
      deployment: process.env.VERCEL_ENV || 'unknown'
    }

    return res.status(200).json(health)
  } catch (error) {
    console.error('Health check error:', error)
    return res.status(500).json({ 
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
} 