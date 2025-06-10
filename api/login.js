import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// 内联session管理
const SESSION_SECRET = process.env.SESSION_SECRET || 'monster-studio-secret-key-2024'

function createSessionToken(userData) {
  const sessionData = {
    user: userData,
    createdAt: Date.now(),
    expiresAt: Date.now() + (30 * 60 * 1000) // 30分钟
  }
  
  const tokenData = Buffer.from(JSON.stringify(sessionData)).toString('base64')
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(tokenData)
    .digest('hex')
  
  return `${tokenData}.${signature}`
}

// 使用Vercel推荐的Web API格式
export async function POST(request) {
  try {
    // 设置CORS头
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-session-id',
      'Access-Control-Expose-Headers': 'x-session-id',
      'Content-Type': 'application/json'
    }

    const body = await request.json()
    const { password } = body
    
    if (!password) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '请输入密码' 
      }), { status: 400, headers })
    }
    
    console.log('Login attempt with password provided')
    
    // 简单的密码验证
    const adminPassword = 'monster2024'
    
    if (password === adminPassword) {
      // 创建session token
      const sessionToken = createSessionToken({ username: 'admin' })
      
      headers['x-session-id'] = sessionToken
      return new Response(JSON.stringify({ 
        success: true, 
        message: '登录成功',
        sessionId: sessionToken,
        needsPasswordSetup: false
      }), { status: 200, headers })
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '密码错误' 
      }), { status: 401, headers })
    }
  } catch (error) {
    console.error('Login API Error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: '服务器内部错误: ' + error.message 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-session-id',
      'Access-Control-Expose-Headers': 'x-session-id'
    }
  })
} 