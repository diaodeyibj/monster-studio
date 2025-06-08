const fs = require('fs')
const path = require('path')

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

    if (req.method === 'GET') {
      const config = readConfig()
      res.status(200).json(config)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Config API Error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error: ' + error.message 
    })
  }
} 