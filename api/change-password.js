import bcrypt from 'bcryptjs'

// 管理员凭据（应该从环境变量或配置文件读取）
const ADMIN_PASSWORD_HASH = '$2a$10$8K1p/a0dclxKMs/wIam9Oeuy/6gm5o3jgJ6FLnr8GHJVMqTyKBrVe' // monster2024

export default async function handler(req, res) {
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

  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ 
      success: false, 
      error: '当前密码和新密码都是必需的' 
    })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ 
      success: false, 
      error: '新密码长度不能少于6位' 
    })
  }

  try {
    // 验证当前密码
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, ADMIN_PASSWORD_HASH)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        error: '当前密码不正确' 
      })
    }

    // 生成新密码哈希
    const newPasswordHash = await bcrypt.hash(newPassword, 10)
    
    // 注意：在生产环境中，您需要将新密码哈希保存到数据库或配置文件
    console.log('新密码哈希值:', newPasswordHash)
    
    res.status(200).json({ 
      success: true, 
      message: '密码修改成功' 
    })
  } catch (error) {
    console.error('密码修改失败:', error)
    res.status(500).json({ 
      success: false, 
      error: '服务器内部错误' 
    })
  }
} 