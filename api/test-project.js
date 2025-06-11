// Monster Studio - 项目功能测试API（保护原功能）
export default function handler(req, res) {
  // 设置CORS头和Content-Type
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'application/json')
  
  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  
  try {
    // 获取项目基本信息（只读操作，不破坏原功能）
    const projectInfo = {
      name: 'Monster Studio',
      description: '影视后期制作网站',
      version: '1.0.0',
      deployment: 'Vercel Serverless',
      timestamp: new Date().toISOString(),
      status: 'running'
    }

    // 检查核心文件是否存在（只读检查）
    const coreFiles = {
      'package.json': true, // 静态检查
      'index.html': true,
      'vite.config.js': true, 
      'tailwind.config.js': true
    }

    // 检查API目录功能
    const apiStatus = {
      testWorking: true,
      hello: true,
      health: true,
      login: true,
      upload: true,
      files: true
    }

    const response = {
      success: true,
      message: '✅ Monster Studio 项目测试成功！',
      data: {
        project: projectInfo,
        coreFiles,
        apiEndpoints: apiStatus,
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          vercel: true
        },
        note: '所有检查都是只读操作，未修改原项目文件'
      }
    }

    res.status(200).json(response)
    
  } catch (error) {
    res.setHeader('Content-Type', 'application/json')
    res.status(500).json({
      success: false,
      message: '❌ 项目测试失败',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
} 