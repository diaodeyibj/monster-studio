import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id')
  res.setHeader('Access-Control-Expose-Headers', 'x-session-id')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: '方法不允许' 
    })
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
  } catch (error) {
    console.error('批量删除文件失败:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
} 