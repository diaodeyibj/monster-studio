import bcrypt from 'bcryptjs'
import { generateSessionId, createSessionToken } from './_shared/sessions.js'

export default function handler(req, res) {
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

    if (req.method !== 'POST') {
      return res.status(405).json({ 
        success: false, 
        error: 'Method not allowed' 
      })
    }

    // 确保请求体存在
    if (!req.body) {
      return res.status(400).json({ 
        success: false, 
        error: '请求体为空' 
      })
    }

    const { password } = req.body
    
    if (!password) {
      return res.status(400).json({ 
        success: false, 
        error: '请输入密码' 
      })
    }
    
    console.log('Login attempt with password provided')
    
    // 简单的密码验证
    const adminPassword = 'monster2024'
    
    if (password === adminPassword) {
      // 创建session token
      const sessionToken = createSessionToken({ username: 'admin' })
      
      res.setHeader('x-session-id', sessionToken)
      return res.status(200).json({ 
        success: true, 
        message: '登录成功',
        sessionId: sessionToken,
        needsPasswordSetup: false
      })
    } else {
      return res.status(401).json({ 
        success: false, 
        error: '密码错误' 
      })
    }
  } catch (error) {
    console.error('Login API Error:', error)
    return res.status(500).json({ 
      success: false, 
      error: '服务器内部错误: ' + error.message 
    })
  }
} 