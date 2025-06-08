const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const app = express()
const PORT = 3001

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

// 中间件
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  exposedHeaders: ['x-session-id']
}))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// 确保上传目录存在
const uploadDirs = ['uploads/images', 'uploads/videos', 'uploads/team']
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// 配置multer用于文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 根据文件类型自动选择上传目录
    let type = req.body.type
    if (!type) {
      // 根据文件MIME类型自动判断
      if (file.mimetype.startsWith('image/')) {
        type = 'images'
      } else if (file.mimetype.startsWith('video/')) {
        type = 'videos'
      } else {
        type = 'images' // 默认
      }
    }
    
    const uploadPath = `uploads/${type}`
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB限制
  },
  fileFilter: function (req, file, cb) {
    // 检查文件类型
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true)
    } else {
      cb(new Error('只允许上传图片和视频文件'))
    }
  }
})

// 配置文件路径
const CONFIG_FILE = path.join(__dirname, 'config.json')

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
      taglineEn: 'Creating Visual Miracles, Telling Extraordinary Stories',
      description: '我们是一支专业的影视后期制作团队，专注于为电影、电视剧、广告和短视频提供顶级的视觉效果和后期制作服务。',
      founded: '2020',
      location: '北京',
      contact: {
        email: 'contact@monsterstudio.com',
        phone: '+86 138 0013 8000',
        wechat: 'MonsterStudio2020',
        address: '北京市朝阳区创意园区'
      }
    },
    navigation: [
      { id: 1, name: '我们所做的', path: '/work', title: '我们所做的' },
      { id: 2, name: '关于我们', path: '/about', title: '关于我们' },
      { id: 3, name: '力量来源', path: '/team', title: '力量来源' }
    ],
    services: [
      {
        id: 1,
        title: '视觉特效',
        icon: '🎬',
        description: '为电影和电视剧提供专业的视觉特效制作服务'
      },
      {
        id: 2,
        title: '调色剪辑',
        icon: '🎨',
        description: '专业的调色和剪辑服务，提升作品视觉质量'
      },
      {
        id: 3,
        title: '动画制作',
        icon: '✨',
        description: '创意动画制作，让想象变为现实'
      }
    ],
    projects: [],
    team: [],
    teamDescription: '每一个团队成员都是我们的力量来源，他们用专业技能和无限创意，为每个项目注入生命力。',
    aboutSections: [],
    valuesHtml: {
      html: `
        <h3 style="text-align: center; margin-bottom: 4rem; font-size: 1.5rem; color: white;">核心价值观</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
          <div style="text-align: center;">
            <div style="width: 4rem; height: 4rem; margin: 0 auto 1.5rem; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">🎯</div>
            <h4 style="font-size: 1.125rem; color: white; margin-bottom: 1rem;">专业精神</h4>
            <p style="color: #9ca3af; font-size: 0.875rem; line-height: 1.6;">我们坚持最高的专业标准，每一个项目都精益求精，追求完美的视觉呈现。</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 4rem; height: 4rem; margin: 0 auto 1.5rem; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">🚀</div>
            <h4 style="font-size: 1.125rem; color: white; margin-bottom: 1rem;">创新驱动</h4>
            <p style="color: #9ca3af; font-size: 0.875rem; line-height: 1.6;">拥抱新技术，探索新可能。我们始终站在行业前沿，用创新推动视觉艺术的发展。</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 4rem; height: 4rem; margin: 0 auto 1.5rem; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">🤝</div>
            <h4 style="font-size: 1.125rem; color: white; margin-bottom: 1rem;">合作共赢</h4>
            <p style="color: #9ca3af; font-size: 0.875rem; line-height: 1.6;">与客户建立长期合作关系，深度理解项目需求，共同创造令人惊艳的视觉作品。</p>
          </div>
        </div>
      `,
      css: ''
    },
    achievementsHtml: {
      html: `
        <h3 style="text-align: center; margin-bottom: 4rem; font-size: 1.5rem; color: white;">荣誉成就</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
          <div style="padding: 1.5rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; text-align: center; background: rgba(255,255,255,0.02);">
            <div style="margin-bottom: 1rem; font-size: 2rem;">🏆</div>
            <h4 style="font-size: 1.125rem; color: white; margin-bottom: 0.5rem;">最佳视觉效果奖</h4>
            <p style="color: #9ca3af; font-size: 0.875rem; margin-bottom: 0.25rem;">第38届金鸡奖</p>
            <p style="color: #6b7280; font-size: 0.75rem;">2023</p>
          </div>
          <div style="padding: 1.5rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; text-align: center; background: rgba(255,255,255,0.02);">
            <div style="margin-bottom: 1rem; font-size: 2rem;">🎬</div>
            <h4 style="font-size: 1.125rem; color: white; margin-bottom: 0.5rem;">优秀后期制作团队</h4>
            <p style="color: #9ca3af; font-size: 0.875rem; margin-bottom: 0.25rem;">中国电影节</p>
            <p style="color: #6b7280; font-size: 0.75rem;">2022</p>
          </div>
          <div style="padding: 1.5rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; text-align: center; background: rgba(255,255,255,0.02);">
            <div style="margin-bottom: 1rem; font-size: 2rem;">✨</div>
            <h4 style="font-size: 1.125rem; color: white; margin-bottom: 0.5rem;">创新技术应用奖</h4>
            <p style="color: #9ca3af; font-size: 0.875rem; margin-bottom: 0.25rem;">北京影视协会</p>
            <p style="color: #6b7280; font-size: 0.75rem;">2021</p>
          </div>
        </div>
      `,
      css: ''
    },
    achievements: [
      {
        title: '最佳视觉效果奖',
        event: '第38届金鸡奖',
        year: '2023'
      },
      {
        title: '优秀后期制作团队',
        event: '中国电影节',
        year: '2022'
      },
      {
        title: '创新技术应用奖',
        event: '北京影视协会',
        year: '2021'
      }
    ]
  }
}

// 保存配置文件
function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('保存配置文件失败:', error)
    return false
  }
}

// API路由

// 登录API
app.post('/api/login', async (req, res) => {
  try {
    const { password } = req.body
    
    if (!password) {
      return res.status(400).json({ 
        success: false, 
        error: '请输入密码' 
      })
    }
    
    const config = readConfig()
    const storedPassword = config.adminPassword
    
    // 如果没有设置密码，使用默认密码
    const defaultPassword = 'monster2024'
    const passwordToCheck = storedPassword || defaultPassword
    
    let isValid = false
    if (storedPassword) {
      // 如果存储的是加密密码
      if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$')) {
        isValid = await bcrypt.compare(password, storedPassword)
      } else {
        // 兼容明文密码（首次设置时）
        isValid = password === storedPassword
      }
    } else {
      // 使用默认密码
      isValid = password === defaultPassword
    }
    
    if (isValid) {
      const sessionId = generateSessionId()
      sessions.set(sessionId, {
        userId: 'admin',
        expiresAt: Date.now() + (30 * 60 * 1000) // 30分钟
      })
      
      res.json({ 
        success: true, 
        message: '登录成功',
        sessionId: sessionId,
        needsPasswordSetup: !storedPassword
      })
    } else {
      res.status(401).json({ 
        success: false, 
        error: '密码错误' 
      })
    }
  } catch (error) {
    console.error('登录失败:', error)
    res.status(500).json({ 
      success: false, 
      error: '登录失败: ' + error.message 
    })
  }
})

// 验证登录状态
app.get('/api/auth-check', (req, res) => {
  const sessionId = req.headers['x-session-id']
  
  if (!sessionId || !sessions.has(sessionId)) {
    return res.json({ 
      success: false,
      authenticated: false 
    })
  }
  
  const session = sessions.get(sessionId)
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId)
    return res.json({ 
      success: false,
      authenticated: false 
    })
  }
  
  // 延长session
  session.expiresAt = Date.now() + (30 * 60 * 1000)
  
  res.json({ 
    success: true,
    authenticated: true,
    userId: session.userId
  })
})

// 登出API
app.post('/api/logout', (req, res) => {
  const sessionId = req.headers['x-session-id']
  
  if (sessionId && sessions.has(sessionId)) {
    sessions.delete(sessionId)
  }
  
  res.json({ 
    success: true, 
    message: '已登出' 
  })
})

// 修改密码API
app.post('/api/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: '新密码长度不能少于6位' 
      })
    }
    
    const config = readConfig()
    const storedPassword = config.adminPassword
    
    // 验证当前密码
    if (storedPassword && currentPassword) {
      let isValidCurrent = false
      if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$')) {
        isValidCurrent = await bcrypt.compare(currentPassword, storedPassword)
      } else {
        isValidCurrent = currentPassword === storedPassword
      }
      
      if (!isValidCurrent) {
        return res.status(401).json({ 
          success: false, 
          error: '当前密码错误' 
        })
      }
    }
    
    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // 保存新密码
    config.adminPassword = hashedPassword
    const success = saveConfig(config)
    
    if (success) {
      res.json({ 
        success: true, 
        message: '密码修改成功' 
      })
    } else {
      res.status(500).json({ 
        success: false, 
        error: '密码保存失败' 
      })
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    res.status(500).json({ 
      success: false, 
      error: '修改密码失败: ' + error.message 
    })
  }
})

// 获取配置 - 需要登录
app.get('/api/config', requireAuth, (req, res) => {
  const config = readConfig()
  res.json(config)
})

// 保存配置 - 需要登录
app.post('/api/config', requireAuth, (req, res) => {
  const success = saveConfig(req.body)
  if (success) {
    res.json({ success: true, message: '配置保存成功' })
  } else {
    res.status(500).json({ success: false, message: '配置保存失败' })
  }
})

// 文件上传 - 需要登录
app.post('/api/upload', requireAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有文件被上传' })
    }

    // 根据文件类型自动选择目录
    let type = req.body.type
    if (!type) {
      if (req.file.mimetype.startsWith('image/')) {
        type = 'images'
      } else if (req.file.mimetype.startsWith('video/')) {
        type = 'videos'
      } else {
        type = 'images'
      }
    }

    // 返回相对路径，不包含域名和端口
    const relativePath = `/uploads/${type}/${req.file.filename}`
    
    res.json({
      success: true,
      url: relativePath,  // 改为相对路径
      fullUrl: `http://localhost:${PORT}${relativePath}`,  // 完整URL用于调试
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      type: type
    })
  } catch (error) {
    console.error('文件上传失败:', error)
    res.status(500).json({ error: '文件上传失败' })
  }
})

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 文件管理API

// 获取上传文件列表 - 需要登录
app.get('/api/files', requireAuth, (req, res) => {
  try {
    // 确保返回JSON格式
    res.setHeader('Content-Type', 'application/json')
    
    const uploadPath = path.join(__dirname, 'uploads')
    const files = []
    
    // 递归扫描文件
    function scanDirectory(dirPath, relativePath = '') {
      if (!fs.existsSync(dirPath)) return
      
      const items = fs.readdirSync(dirPath)
      items.forEach(item => {
        const fullPath = path.join(dirPath, item)
        const relativeFilePath = path.join(relativePath, item).replace(/\\/g, '/')
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath, relativeFilePath)
        } else {
          files.push({
            name: item,
            path: relativeFilePath,
            size: stat.size,
            created: stat.birthtime,
            modified: stat.mtime,
            type: item.split('.').pop().toLowerCase(),
            url: `/uploads/${relativeFilePath}`  // 使用相对路径
          })
        }
      })
    }
    
    scanDirectory(uploadPath)
    
    // 按修改时间倒序排序
    files.sort((a, b) => new Date(b.modified) - new Date(a.modified))
    
    const result = {
      success: true,
      files: files,
      total: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0)
    }
    
    console.log('返回文件列表，共', files.length, '个文件')
    res.json(result)
  } catch (error) {
    console.error('获取文件列表失败:', error)
    res.status(500).json({ 
      success: false,
      error: '获取文件列表失败: ' + error.message,
      files: [],
      total: 0,
      totalSize: 0
    })
  }
})

// 删除文件 - 使用更简单的方式 - 需要登录
app.delete('/api/files', requireAuth, (req, res) => {
  try {
    const filePath = req.query.path // 从查询参数获取路径
    if (!filePath) {
      return res.status(400).json({ error: '缺少文件路径参数' })
    }
    
    const fullPath = path.join(__dirname, 'uploads', filePath)
    
    // 安全检查：确保文件在uploads目录内
    const uploadPath = path.join(__dirname, 'uploads')
    if (!fullPath.startsWith(uploadPath)) {
      return res.status(400).json({ error: '非法的文件路径' })
    }
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: '文件不存在' })
    }
    
    fs.unlinkSync(fullPath)
    
    res.json({
      success: true,
      message: '文件删除成功',
      deletedFile: filePath
    })
  } catch (error) {
    console.error('删除文件失败:', error)
    res.status(500).json({ error: '删除文件失败' })
  }
})

// 批量删除文件 - 需要登录
app.post('/api/files/batch-delete', requireAuth, (req, res) => {
  try {
    const { files } = req.body
    if (!Array.isArray(files)) {
      return res.status(400).json({ error: '无效的文件列表' })
    }
    
    const deletedFiles = []
    const errors = []
    
    files.forEach(filePath => {
      try {
        const fullPath = path.join(__dirname, 'uploads', filePath)
        
        // 安全检查
        const uploadPath = path.join(__dirname, 'uploads')
        if (!fullPath.startsWith(uploadPath)) {
          errors.push({ file: filePath, error: '非法的文件路径' })
          return
        }
        
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath)
          deletedFiles.push(filePath)
        } else {
          errors.push({ file: filePath, error: '文件不存在' })
        }
      } catch (error) {
        errors.push({ file: filePath, error: error.message })
      }
    })
    
    res.json({
      success: true,
      message: `成功删除 ${deletedFiles.length} 个文件`,
      deletedFiles,
      errors
    })
  } catch (error) {
    console.error('批量删除文件失败:', error)
    res.status(500).json({ error: '批量删除文件失败' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
  console.log(`📁 文件上传目录: ${path.join(__dirname, 'uploads')}`)
  console.log(`⚙️  配置文件位置: ${CONFIG_FILE}`)
}) 