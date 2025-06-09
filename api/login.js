const bcrypt = require('bcryptjs')
const crypto = require('crypto')

// 生成随机session ID
function generateSessionId() {
  return crypto.randomBytes(32).toString('hex')
}

// 简单的内存session存储
let sessions = new Map()

function createSession(sessionId, userData) {
  const session = {
    user: userData,
    expiresAt: Date.now() + (30 * 60 * 1000) // 30分钟
  }
  sessions.set(sessionId, session)
  return session
}

module.exports = function handler(req, res) {
  try {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id')
    res.setHeader('Access-Control-Expose-Headers', 'x-session-id')
    res.setHeader('Content-Type', 'application/json')
    
    // 处理OPTIONS预检请求
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }

    if (req.method === 'POST') {
      const { password } = req.body
      
      console.log('Login attempt:', { password: password ? '***' : 'empty' })
      
      // 简单的密码验证
      const adminPassword = 'monster2024'
      
      if (password && password === adminPassword) {
        const sessionId = generateSessionId()
        createSession(sessionId, { username: 'admin' })
        
        res.setHeader('x-session-id', sessionId)
        res.status(200).json({ 
          success: true, 
          message: '登录成功',
          sessionId 
        })
      } else {
        res.status(401).json({ 
          success: false, 
          error: '密码错误' 
        })
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Login API Error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error: ' + error.message 
    })
  }
} 