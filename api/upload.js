import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, x-session-id')
  res.setHeader('Access-Control-Expose-Headers', 'x-session-id')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed',
      message: '仅支持POST请求' 
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
    // 创建formidable实例
    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB限制
      multiples: false,
      filename: (name, ext, part) => {
        // 生成唯一文件名
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2)
        return `${timestamp}_${random}${ext}`
      }
    })

    // 解析上传的文件
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('文件解析错误:', err)
        return res.status(400).json({ 
          success: false, 
          error: '文件解析失败',
          message: err.message 
        })
      }

      // 获取上传的文件
      const file = files.file
      if (!file) {
        return res.status(400).json({ 
          success: false,
          error: '没有找到上传的文件',
          message: '请选择要上传的文件' 
        })
      }

      // 处理单个文件或文件数组
      const uploadedFile = Array.isArray(file) ? file[0] : file

      if (!uploadedFile) {
        return res.status(400).json({ 
          success: false,
          error: '文件上传失败',
          message: '未能获取到有效的文件数据' 
        })
      }

      // 验证文件类型
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/ogg', 'video/mov', 'video/avi'
      ]

      if (!allowedTypes.includes(uploadedFile.mimetype)) {
        return res.status(400).json({
          success: false,
          error: '不支持的文件类型',
          message: '仅支持图片和视频文件上传'
        })
      }

      // 在Vercel环境中，文件会被保存到/tmp目录
      // 但这些文件在函数执行完成后会被清理
      // 实际项目中建议使用云存储服务如AWS S3, Cloudinary等
      
      const fileInfo = {
        filename: uploadedFile.originalFilename || 'unknown',
        size: uploadedFile.size,
        mimetype: uploadedFile.mimetype,
        // 在Vercel中的临时路径
        tempPath: uploadedFile.filepath,
        // 建议的URL格式（需要配合云存储使用）
        url: `/uploads/${uploadedFile.originalFilename}`,
        uploadTime: new Date().toISOString(),
        id: path.basename(uploadedFile.filepath)
      }

      console.log('文件上传成功:', fileInfo)

      res.status(200).json({
        success: true,
        message: '文件上传成功',
        file: fileInfo,
        note: '注意：在Vercel环境中，文件存储在临时目录中，建议配置云存储服务以实现持久化存储'
      })
    })

  } catch (error) {
    console.error('文件上传失败:', error)
    res.status(500).json({ 
      success: false, 
      error: '服务器内部错误',
      message: '文件上传失败: ' + error.message 
    })
  }
}

// Vercel API配置
export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '50mb'
  },
} 