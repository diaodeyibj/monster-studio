const crypto = require('crypto')

// 内联session管理
const SESSION_SECRET = process.env.SESSION_SECRET || 'monster-studio-secret-key-2024'

function verifySessionToken(token) {
  if (!token) {
    return null
  }
  
  try {
    const [tokenData, signature] = token.split('.')
    if (!tokenData || !signature) {
      return null
    }
    
    // 验证签名
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(tokenData)
      .digest('hex')
    
    if (signature !== expectedSignature) {
      return null
    }
    
    // 解析数据
    const sessionData = JSON.parse(Buffer.from(tokenData, 'base64').toString())
    
    // 检查过期时间
    if (Date.now() > sessionData.expiresAt) {
      return null
    }
    
    return sessionData
  } catch (error) {
    console.error('Session verification error:', error)
    return null
  }
}

function extendSession(token) {
  const sessionData = verifySessionToken(token)
  if (!sessionData) {
    return null
  }
  
  // 创建新token
  const newSessionData = {
    user: sessionData.user,
    createdAt: Date.now(),
    expiresAt: Date.now() + (30 * 60 * 1000)
  }
  
  const tokenData = Buffer.from(JSON.stringify(newSessionData)).toString('base64')
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(tokenData)
    .digest('hex')
  
  return `${tokenData}.${signature}`
}

module.exports = function handler(req, res) {
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