module.exports = function handler(req, res) {
  try {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id')
    res.setHeader('Access-Control-Expose-Headers', 'x-session-id')
    res.setHeader('Content-Type', 'application/json')

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

    // 简单的登出处理（无状态token系统中主要靠客户端清除）
    return res.status(200).json({ 
      success: true, 
      message: '已登出' 
    })
  } catch (error) {
    console.error('Logout error:', error)
    return res.status(500).json({ 
      success: false, 
      error: '服务器内部错误: ' + error.message 
    })
  }
} 