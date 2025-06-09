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

  // 在Vercel中，我们无法真正删除session，只是返回成功
  // 实际的session管理应该在客户端清除sessionId

  res.status(200).json({ 
    success: true, 
    message: '退出登录成功' 
  })
} 