const fs = require('fs')
const path = require('path')

// 获取文件列表
function getFilesList() {
  const files = []
  const uploadDirs = ['uploads/images', 'uploads/videos', 'uploads/team']
  
  uploadDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const dirFiles = fs.readdirSync(dir)
      dirFiles.forEach(file => {
        const filePath = path.join(dir, file)
        const stats = fs.statSync(filePath)
        if (stats.isFile()) {
          files.push({
            name: file,
            path: `/${filePath.replace(/\\/g, '/')}`,
            type: dir.split('/')[1],
            size: stats.size,
            lastModified: stats.mtime.toISOString()
          })
        }
      })
    }
  })
  
  return files
}

module.exports = function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id')
  res.setHeader('Access-Control-Expose-Headers', 'x-session-id')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // 简单的认证检查
  const sessionId = req.headers['x-session-id']
  if (!sessionId) {
    return res.status(401).json({ 
      success: false, 
      error: '未授权访问，请先登录' 
    })
  }

  try {
    if (req.method === 'GET') {
      // 获取文件列表
      const files = getFilesList()
      res.status(200).json({
        success: true,
        files: files
      })
    } else if (req.method === 'DELETE') {
      // 删除单个文件
      const { filePath } = req.body

      if (!filePath) {
        return res.status(400).json({
          success: false,
          error: '文件路径是必需的'
        })
      }

      // 安全检查：确保文件路径在uploads目录内
      const normalizedPath = path.normalize(filePath.replace(/^\//, ''))
      if (!normalizedPath.startsWith('uploads/')) {
        return res.status(400).json({
          success: false,
          error: '无效的文件路径'
        })
      }

      if (fs.existsSync(normalizedPath)) {
        fs.unlinkSync(normalizedPath)
        res.status(200).json({
          success: true,
          message: '文件删除成功'
        })
      } else {
        res.status(404).json({
          success: false,
          error: '文件不存在'
        })
      }
    } else if (req.method === 'POST' && req.url?.includes('batch-delete')) {
      // 批量删除文件
      const { filePaths } = req.body

      if (!Array.isArray(filePaths) || filePaths.length === 0) {
        return res.status(400).json({
          success: false,
          error: '文件路径数组是必需的'
        })
      }

      const results = []
      filePaths.forEach(filePath => {
        try {
          const normalizedPath = path.normalize(filePath.replace(/^\//, ''))
          if (normalizedPath.startsWith('uploads/') && fs.existsSync(normalizedPath)) {
            fs.unlinkSync(normalizedPath)
            results.push({ path: filePath, success: true })
          } else {
            results.push({ path: filePath, success: false, error: '文件不存在或路径无效' })
          }
        } catch (error) {
          results.push({ path: filePath, success: false, error: error.message })
        }
      })

      res.status(200).json({
        success: true,
        message: '批量删除操作完成',
        results: results
      })
    } else {
      res.status(405).json({ 
        success: false, 
        error: '方法不允许' 
      })
    }
  } catch (error) {
    console.error('文件操作失败:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
} 