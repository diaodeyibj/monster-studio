// Monster Studio - 项目功能测试API（保护原功能）
const path = require('path')
const fs = require('fs')

module.exports = function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
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
      'package.json': checkFileExists('../package.json'),
      'index.html': checkFileExists('../index.html'),
      'vite.config.js': checkFileExists('../vite.config.js'),
      'tailwind.config.js': checkFileExists('../tailwind.config.js')
    }

    // 检查API目录功能
    const apiStatus = {
      testWorking: checkFileExists('./test-working.js'),
      health: checkFileExists('./health.js'),
      login: checkFileExists('./login.js'),
      upload: checkFileExists('./upload.js'),
      files: checkFileExists('./files.js')
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
    res.status(500).json({
      success: false,
      message: '❌ 项目测试失败',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}

// 安全的文件存在检查函数（只读）
function checkFileExists(filePath) {
  try {
    const resolvedPath = path.resolve(__dirname, filePath)
    return fs.existsSync(resolvedPath)
  } catch (error) {
    return false
  }
} 