// Vercel serverless 环境中的默认配置
function getDefaultConfig() {
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
    services: [
      {
        id: 1,
        name: '视觉特效',
        description: '电影级视觉特效制作'
      },
      {
        id: 2,
        name: '动画制作',
        description: '高质量动画内容创作'
      },
      {
        id: 3,
        name: '后期制作',
        description: '专业影视后期处理'
      }
    ],
    projects: [
      {
        id: 1,
        title: '示例项目',
        description: '这是一个示例项目',
        category: 'VFX'
      }
    ],
    team: [
      {
        id: 1,
        name: '团队成员',
        role: '视觉特效总监',
        description: '拥有丰富的视觉特效制作经验'
      }
    ],
    status: 'success',
    timestamp: new Date().toISOString(),
    environment: 'vercel-serverless'
  }
}

export default function handler(req, res) {
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
      const config = getDefaultConfig()
      res.status(200).json(config)
    } else if (req.method === 'POST') {
      // Vercel serverless 环境说明
      res.status(200).json({ 
        success: false, 
        message: 'Vercel serverless 环境不支持配置写入',
        note: '配置数据存储在代码中，如需修改请更新代码',
        currentConfig: getDefaultConfig()
      })
    } else {
      res.status(405).json({ 
        success: false,
        error: 'Method not allowed',
        allowedMethods: ['GET', 'POST']
      })
    }
  } catch (error) {
    console.error('Config API Error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error: ' + error.message 
    })
  }
} 