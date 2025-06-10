import crypto from 'crypto'

// 在无状态环境中，我们使用JWT令牌来存储session信息
// 这是一个简化的实现，生产环境应该使用Redis或数据库

const SESSION_SECRET = process.env.SESSION_SECRET || 'monster-studio-secret-key-2024'

// 简单的内存存储作为后备（仅用于开发）
let memoryStore = new Map()

// 生成session ID
export function generateSessionId() {
  return crypto.randomBytes(32).toString('hex')
}

// 创建session令牌
export function createSessionToken(userData) {
  const sessionData = {
    user: userData,
    createdAt: Date.now(),
    expiresAt: Date.now() + (30 * 60 * 1000) // 30分钟
  }
  
  // 简单的编码方式（生产环境应使用JWT）
  const tokenData = Buffer.from(JSON.stringify(sessionData)).toString('base64')
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(tokenData)
    .digest('hex')
  
  return `${tokenData}.${signature}`
}

// 验证session令牌
export function verifySessionToken(token) {
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

// 延长session有效期
export function extendSession(token) {
  const sessionData = verifySessionToken(token)
  if (!sessionData) {
    return null
  }
  
  // 创建新的token with extended expiry
  return createSessionToken(sessionData.user)
}

// 内存存储的辅助函数（开发环境使用）
export function setMemorySession(sessionId, data) {
  memoryStore.set(sessionId, {
    ...data,
    expiresAt: Date.now() + (30 * 60 * 1000)
  })
}

export function getMemorySession(sessionId) {
  const session = memoryStore.get(sessionId)
  if (!session) {
    return null
  }
  
  if (Date.now() > session.expiresAt) {
    memoryStore.delete(sessionId)
    return null
  }
  
  return session
}

export function deleteMemorySession(sessionId) {
  memoryStore.delete(sessionId)
} 