const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

// 简单的内存session存储（生产环境应使用Redis等）
const sessions = new Map()

// 生成随机session ID
function generateSessionId() {
  return crypto.randomBytes(32).toString('hex')
}

// 验证session中间件
function requireAuth(req, res, next) {
  const sessionId = req.headers['x-session-id']
  
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ 
      success: false, 
      error: '未授权访问，请先登录' 
    })
  }
  
  const session = sessions.get(sessionId)
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId)
    return res.status(401).json({ 
      success: false, 
      error: '登录已过期，请重新登录' 
    })
  }
  
  // 延长session有效期
  session.expiresAt = Date.now() + (30 * 60 * 1000) // 30分钟
  next()
}

// 配置文件路径
const CONFIG_FILE = path.join(process.cwd(), 'config.json')

// 读取配置文件
function readConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('读取配置文件失败:', error)
  }
  
  // 返回默认配置
  return {
    company: {
      name: '怪兽工场',
      nameEn: 'Monster Studio',
      tagline: '创造视觉奇迹，讲述非凡故事',
      contact: {
        email: 'contact@monsterstudio.com',
        phone: '+86 138 0013 8000'
      }
    },
    navigation: [
      { id: 1, name: '我们所做的', path: '/work', title: '我们所做的' },
      { id: 2, name: '关于我们', path: '/about', title: '关于我们' },
      { id: 3, name: '力量来源', path: '/team', title: '力量来源' }
    ],
    services: [],
    projects: [],
    team: []
  }
}

// 保存配置文件
function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
    return true
  } catch (error) {
    console.error('保存配置文件失败:', error)
    return false
  }
}

const app = express()

// 中间件
app.use(cors({
  origin: true,
  credentials: true,
  exposedHeaders: ['x-session-id']
}))
app.use(express.json())

// API路由处理
module.exports = function handler(req, res) {
  const { route } = req.query
  const routePath = Array.isArray(route) ? route.join('/') : route

  // 处理不同的API路由
  switch (routePath) {
    case 'config':
      if (req.method === 'GET') {
        const config = readConfig()
        res.json(config)
      } else {
        res.status(405).json({ error: 'Method not allowed' })
      }
      break

    case 'login':
      if (req.method === 'POST') {
        const { password } = req.body
        
        // 简单的密码验证（实际应用中应该使用环境变量）
        const adminPassword = 'monster2024'
        
        if (password && bcrypt.compareSync(password, bcrypt.hashSync(adminPassword, 10))) {
          const sessionId = generateSessionId()
          const expiresAt = Date.now() + (30 * 60 * 1000) // 30分钟
          
          sessions.set(sessionId, {
            expiresAt,
            userId: 'admin'
          })
          
          res.setHeader('x-session-id', sessionId)
          res.json({ 
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
      break

    case 'admin/config':
      if (req.method === 'PUT') {
        // 验证session
        const sessionId = req.headers['x-session-id']
        if (!sessionId || !sessions.has(sessionId)) {
          return res.status(401).json({ 
            success: false, 
            error: '未授权访问，请先登录' 
          })
        }

        const config = req.body
        if (saveConfig(config)) {
          res.json({ 
            success: true, 
            message: '配置保存成功' 
          })
        } else {
          res.status(500).json({ 
            success: false, 
            error: '保存配置失败' 
          })
        }
      } else {
        res.status(405).json({ error: 'Method not allowed' })
      }
      break

    default:
      res.status(404).json({ error: 'API endpoint not found' })
  }
} 