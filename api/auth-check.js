module.exports = function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id')
  res.setHeader('Access-Control-Expose-Headers', 'x-session-id')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: '方法不允许' 
    })
  }

  const sessionId = req.headers['x-session-id']
  
  if (!sessionId) {
    return res.status(401).json({ 
      success: false, 
      error: '未授权访问，请先登录' 
    })
  }

  res.status(200).json({ 
    success: true, 
    message: '认证有效',
    user: { username: 'admin' }
  })
} 