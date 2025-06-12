// Vercel serverless 环境中的配置API
// 使用 Vercel KV 存储（如果已配置）或提供默认配置

// 默认配置
function getDefaultConfig() {
  return {
    company: {
      name: '怪兽工场',
      nameEn: 'Monster Studio',
      tagline: '创造视觉奇迹，讲述非凡故事',
      taglineEn: 'Creating Visual Wonders, Telling Extraordinary Stories',
      description: '专业的视觉特效制作公司，致力于为客户提供最优质的视觉内容创作服务。',
      founded: '2020',
      location: '上海',
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
        nameEn: 'Visual Effects',
        description: '电影级视觉特效制作',
        descriptionEn: 'Cinema-quality visual effects production',
        icon: '🎬'
      },
      {
        id: 2,
        name: '动画制作',
        nameEn: 'Animation',
        description: '高质量动画内容创作',
        descriptionEn: 'High-quality animation content creation',
        icon: '🎭'
      },
      {
        id: 3,
        name: '后期制作',
        nameEn: 'Post Production',
        description: '专业影视后期处理',
        descriptionEn: 'Professional film and video post-processing',
        icon: '🎨'
      }
    ],
    projects: [
      {
        id: 1,
        title: '示例项目',
        titleEn: 'Sample Project',
        description: '这是一个示例项目展示',
        descriptionEn: 'This is a sample project showcase',
        category: 'VFX',
        year: '2023',
        client: '客户公司',
        image: '/images/projects/sample.jpg',
        tags: ['视觉特效', '后期制作']
      }
    ],
    team: [
      {
        id: 1,
        name: '张导演',
        nameEn: 'Director Zhang',
        role: '视觉特效总监',
        roleEn: 'VFX Supervisor',
        description: '拥有15年视觉特效制作经验，参与过多部知名影片制作',
        descriptionEn: 'With 15 years of VFX experience, participated in multiple renowned film productions',
        image: '/images/team/director.jpg',
        social: {
          email: 'zhang@monsterstudio.com',
          linkedin: '#'
        }
      }
    ],
    status: 'success',
    timestamp: new Date().toISOString(),
    environment: 'vercel-serverless',
    version: '1.0.0'
  }
}

// 尝试使用 Vercel KV 存储（如果已配置）
async function getStoredConfig() {
  try {
    // 如果配置了 Vercel KV
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const response = await fetch(`${process.env.KV_REST_API_URL}/get/site-config`, {
        headers: {
          'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.result ? JSON.parse(data.result) : null
      }
    }
    
    // 如果没有配置 KV 或获取失败，返回 null
    return null
  } catch (error) {
    console.error('获取存储配置失败:', error)
    return null
  }
}

async function saveConfig(config) {
  try {
    // 如果配置了 Vercel KV
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const response = await fetch(`${process.env.KV_REST_API_URL}/set/site-config`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        return { success: true, message: '配置保存成功' }
      }
    }
    
    // 如果没有配置 KV，返回提示信息
    return { 
      success: false, 
      message: '请配置 Vercel KV 存储以启用配置保存功能',
      note: '当前配置仅在浏览器会话中有效'
    }
  } catch (error) {
    console.error('保存配置失败:', error)
    return { 
      success: false, 
      message: '保存配置失败: ' + error.message 
    }
  }
}

export default async function handler(req, res) {
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
      // 尝试获取存储的配置，如果失败则返回默认配置
      const storedConfig = await getStoredConfig()
      const config = storedConfig || getDefaultConfig()
      
      // 添加存储状态信息
      config.storageInfo = {
        hasKVStorage: !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN),
        usingStoredConfig: !!storedConfig,
        message: storedConfig ? '使用已存储的配置' : '使用默认配置'
      }
      
      res.status(200).json(config)
      
    } else if (req.method === 'POST') {
      // 简单认证检查
      const sessionId = req.headers['x-session-id']
      if (!sessionId) {
        return res.status(401).json({ 
          success: false, 
          error: '未授权访问，请先登录' 
        })
      }
      
      const configData = req.body
      const result = await saveConfig(configData)
      
      res.status(result.success ? 200 : 400).json(result)
      
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