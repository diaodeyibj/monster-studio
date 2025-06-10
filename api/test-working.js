// 使用CommonJS格式的Vercel API测试
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
  
  // 返回简单的JSON响应
  const response = {
    message: '🎉 恭喜！API终于工作了！',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    success: true,
    note: 'CommonJS格式成功'
  }
  
  res.status(200).json(response)
} 