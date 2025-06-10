// 最简单的Vercel API测试
export default function handler(req, res) {
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
    message: '恭喜！API正常工作了！',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    success: true
  }
  
  res.status(200).json(response)
} 