// 配置管理服务
class ConfigService {
  constructor() {
    this.config = null
    this.listeners = []
    // 修复API基础URL检测逻辑
    this.apiBaseUrl = this.getApiBaseUrl()
    this.sessionId = localStorage.getItem('monster-studio-session')
    this.init()
  }

  // 智能检测API基础URL
  getApiBaseUrl() {
    // 如果在本地开发环境 (localhost/127.0.0.1)
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' || 
        window.location.hostname === '0.0.0.0') {
      return 'http://localhost:3001/api'
    }
    
    // 生产环境或其他环境使用相对路径
    return '/api'
  }

  // 获取请求头（包含session）
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    }
    
    if (this.sessionId) {
      headers['x-session-id'] = this.sessionId
    }
    
    return headers
  }

  // 登录
  async login(password) {
    console.log('开始登录, API URL:', this.apiBaseUrl)
    
    try {
      const loginUrl = `${this.apiBaseUrl}/login`
      console.log('正在请求:', loginUrl)
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      })

      console.log('登录响应状态:', response.status)
      console.log('登录响应头:', {
        contentType: response.headers.get('content-type'),
        sessionId: response.headers.get('x-session-id')
      })

      // 检查响应是否为JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('API返回非JSON响应:', text)
        console.error('响应状态:', response.status)
        console.error('响应头:', Object.fromEntries(response.headers.entries()))
        throw new Error(`服务器响应格式错误 (${response.status}): ${text.substring(0, 200)}`)
      }

      const result = await response.json()
      console.log('登录结果:', result)
      
      if (result.success) {
        this.sessionId = result.sessionId
        localStorage.setItem('monster-studio-session', this.sessionId)
        console.log('登录成功，session已保存')
        return {
          success: true,
          needsPasswordSetup: result.needsPasswordSetup
        }
      } else {
        throw new Error(result.error || '登录失败')
      }
    } catch (error) {
      console.error('登录失败:', error)
      console.error('错误详情:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      
      // 提供更友好的错误信息
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('无法连接到服务器，请检查网络连接')
      }
      throw error
    }
  }

  // 检查登录状态
  async checkAuth() {
    try {
      if (!this.sessionId) {
        return { authenticated: false }
      }

      const response = await fetch(`${this.apiBaseUrl}/auth-check`, {
        headers: this.getHeaders()
      })

      // 检查响应是否为JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Auth check返回非JSON响应')
        this.sessionId = null
        localStorage.removeItem('monster-studio-session')
        return { authenticated: false }
      }

      const result = await response.json()
      
      // 检查是否有新的session token
      const newSessionId = response.headers.get('x-session-id')
      if (newSessionId && newSessionId !== this.sessionId) {
        this.sessionId = newSessionId
        localStorage.setItem('monster-studio-session', this.sessionId)
      }
      
      if (!result.authenticated) {
        this.sessionId = null
        localStorage.removeItem('monster-studio-session')
      }
      
      return result
    } catch (error) {
      console.error('验证登录状态失败:', error)
      this.sessionId = null
      localStorage.removeItem('monster-studio-session')
      return { authenticated: false }
    }
  }

  // 登出
  async logout() {
    try {
      if (this.sessionId) {
        await fetch(`${this.apiBaseUrl}/logout`, {
          method: 'POST',
          headers: this.getHeaders()
        })
      }
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      this.sessionId = null
      localStorage.removeItem('monster-studio-session')
    }
  }

  // 修改密码
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/change-password`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })

      const result = await response.json()
      
      if (result.success) {
        return result
      } else {
        throw new Error(result.error || '密码修改失败')
      }
    } catch (error) {
      console.error('密码修改失败:', error)
      throw error
    }
  }

  // 初始化配置
  async init() {
    try {
      // 尝试从后端API获取配置
      const response = await fetch(`${this.apiBaseUrl}/config`, {
        headers: this.getHeaders()
      })
      if (response.ok) {
        this.config = await response.json()
      } else {
        // 如果API不可用，使用本地存储
        this.config = this.getLocalConfig()
      }
    } catch (error) {
      console.warn('无法连接到后端服务，使用本地存储:', error)
      this.config = this.getLocalConfig()
    }
    this.notifyListeners()
  }

  // 获取本地配置 (后备方案)
  getLocalConfig() {
    try {
      const stored = localStorage.getItem('monster-studio-config')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('解析本地配置失败:', error)
    }
    
    return this.getDefaultConfig()
  }

  // 默认配置
  getDefaultConfig() {
    return {
      company: {
        name: '怪兽工场',
        nameEn: 'Monster Studio',
        tagline: '创造视觉奇迹，讲述非凡故事',
        taglineEn: 'Creating Visual Miracles, Telling Extraordinary Stories',
        description: '我们是一支专业的影视后期制作团队，专注于为电影、电视剧、广告和短视频提供顶级的视觉效果和后期制作服务。从概念设计到最终渲染，我们用技术和创意为每一个项目注入生命力。',
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
          description: '为电影和电视剧提供专业的视觉特效制作服务，运用最新的CGI技术创造震撼的视觉体验。'
        },
        {
          id: 2,
          title: '调色剪辑',
          icon: '🎨',
          description: '专业的调色和剪辑服务，通过精确的色彩管理和节奏把控提升作品的视觉质量和叙事效果。'
        },
        {
          id: 3,
          title: '动画制作',
          icon: '✨',
          description: '从2D手绘到3D建模，从角色动画到场景渲染，我们的动画制作让想象变为现实。'
        }
      ],
      projects: [],
      team: [],
      teamDescription: '每一个团队成员都是我们的力量来源，他们用专业技能和无限创意，为每个项目注入生命力。',
      aboutSections: [
        {
          id: 1,
          title: '公司介绍',
          content: '我们是一支专业的影视后期制作团队，专注于为电影、电视剧、广告和短视频提供顶级的视觉效果和后期制作服务。从概念设计到最终渲染，我们用技术和创意为每一个项目注入生命力。每一帧画面都承载着我们对完美的追求和对艺术的热爱。我们不仅是技术的实践者，更是视觉艺术的创造者。',
          image: '/assets/about-company.jpg',
          maxLength: 100,
          expanded: false
        },
        {
          id: 2,
          title: '我们的愿景',
          content: '我们致力于成为中国影视后期制作行业的领军者，通过不断创新的技术和无与伦比的创意，为每一个项目注入生命力。我们相信，优秀的视觉作品不仅仅是技术的展示，更是情感的传达和故事的延续。每一帧画面都承载着创作者的思想和观众的期待，我们的使命就是将这些抽象的概念转化为具象的视觉奇迹。',
          image: '/assets/about-vision.jpg',
          maxLength: 100,
          expanded: false
        }
      ],
      // 关于我们下半部分图片
      aboutBottomImage: '',
      aboutBottomImageMobile: '',
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

  // 获取配置
  getConfig() {
    return this.config || this.getDefaultConfig()
  }

  // 保存配置
  async saveConfig(config) {
    try {
      // 优先尝试保存到后端
      const response = await fetch(`${this.apiBaseUrl}/config`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(config)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('配置保存成功:', result)
        
        // 更新本地配置
        this.config = { ...config }
        
        // 同时保存到本地存储作为备份
        try {
          localStorage.setItem('monster-studio-config', JSON.stringify(config))
        } catch (localError) {
          console.warn('本地存储备份失败:', localError)
        }
        
        // 通知所有监听器
        this.notifyListeners()
        return true
      } else {
        const errorData = await response.json().catch(() => ({ message: '未知错误' }))
        throw new Error(errorData.message || '后端保存失败')
      }
    } catch (error) {
      console.error('保存到后端失败:', error)
      
      // 后备方案：保存到本地存储
      try {
        localStorage.setItem('monster-studio-config', JSON.stringify(config))
        this.config = { ...config }
        this.notifyListeners()
        console.warn('已保存到本地存储，建议检查后端服务')
        return true
      } catch (localError) {
        console.error('本地保存也失败:', localError)
        throw new Error('配置保存失败：' + error.message)
      }
    }
  }

  // 上传文件
  async uploadFile(file, type = 'images') {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const headers = {}
      if (this.sessionId) {
        headers['x-session-id'] = this.sessionId
      }

      const response = await fetch(`${this.apiBaseUrl}/upload`, {
        method: 'POST',
        headers: headers,
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        return result.url
      } else {
        const error = await response.json()
        throw new Error(error.error || '上传失败')
      }
    } catch (error) {
      console.error('文件上传失败:', error)
      throw error
    }
  }

  // 获取文件列表
  async getFiles() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/files`, {
        headers: this.getHeaders()
      })
      if (response.ok) {
        const result = await response.json()
        return result
      } else {
        const error = await response.json()
        throw new Error(error.error || '获取文件列表失败')
      }
    } catch (error) {
      console.error('获取文件列表失败:', error)
      throw error
    }
  }

  // 删除单个文件
  async deleteFile(filePath) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/files`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        body: JSON.stringify({ filePath })
      })

      if (response.ok) {
        const result = await response.json()
        return result
      } else {
        const error = await response.json()
        throw new Error(error.error || '删除文件失败')
      }
    } catch (error) {
      console.error('删除文件失败:', error)
      throw error
    }
  }

  // 批量删除文件
  async batchDeleteFiles(filePaths) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/batch-delete`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ filePaths })
      })

      if (response.ok) {
        const result = await response.json()
        return result
      } else {
        const error = await response.json()
        throw new Error(error.error || '批量删除失败')
      }
    } catch (error) {
      console.error('批量删除失败:', error)
      throw error
    }
  }

  // 重置配置
  resetConfig() {
    this.config = this.getDefaultConfig()
    this.notifyListeners()
    return this.config
  }

  // 导出配置
  exportConfig() {
    const config = this.getConfig()
    const dataStr = JSON.stringify(config, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `monster-studio-config-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 导入配置
  async importConfig(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result)
          resolve(config)
        } catch (error) {
          reject(new Error('无效的JSON文件'))
        }
      }
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsText(file)
    })
  }

  // 监听配置变化
  onConfigChange(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback)
    }
  }

  // 通知监听器
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.config)
      } catch (error) {
        console.error('配置监听器错误:', error)
      }
    })
  }
}

// 创建单例实例
const configService = new ConfigService()

export default configService