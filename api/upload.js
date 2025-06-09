const formidable = require('formidable')
const fs = require('fs')
const path = require('path')

module.exports = async function handler(req, res) {
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
    return res.status(405).json({ error: 'Method not allowed' })
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
    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB
    })

    const [fields, files] = await form.parse(req)
    const file = files.file?.[0] || files.file

    if (!file) {
      return res.status(400).json({ error: '没有上传文件' })
    }

    // 由于Vercel的限制，我们将返回临时文件信息
    // 实际项目中可能需要使用云存储服务如AWS S3, Cloudinary等
    
    const fileInfo = {
      filename: file.originalFilename,
      size: file.size,
      mimetype: file.mimetype,
      // 在Vercel环境中，文件会被保存到临时目录
      path: `/tmp/${path.basename(file.filepath)}`,
      url: `/uploads/${file.originalFilename}` // 这个URL在Vercel中可能无法直接访问
    }

    res.json({
      success: true,
      message: '文件上传成功',
      file: fileInfo
    })

  } catch (error) {
    console.error('文件上传失败:', error)
    res.status(500).json({ 
      success: false, 
      error: '文件上传失败: ' + error.message 
    })
  }
}

// 配置对象需要单独导出
module.exports.config = {
  api: {
    bodyParser: false,
  },
} 