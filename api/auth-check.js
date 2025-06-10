import { verifySessionToken, extendSession } from './_shared/sessions.js'

export default function handler(req, res) {
  try {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id')
    res.setHeader('Access-Control-Expose-Headers', 'x-session-id')
    res.setHeader('Content-Type', 'application/json')

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

    const sessionToken = req.headers['x-session-id']
    
    if (!sessionToken) {
      return res.status(200).json({ 
        success: false,
        authenticated: false 
      })
    }
    
    const sessionData = verifySessionToken(sessionToken)
    if (!sessionData) {
      return res.status(200).json({ 
        success: false,
        authenticated: false 
      })
    }
    
    // 延长session并返回新token
    const newToken = extendSession(sessionToken)
    if (newToken) {
      res.setHeader('x-session-id', newToken)
    }

    return res.status(200).json({ 
      success: true,
      authenticated: true,
      userId: sessionData.user.username
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return res.status(500).json({ 
      success: false, 
      authenticated: false,
      error: '服务器内部错误: ' + error.message 
    })
  }
} 