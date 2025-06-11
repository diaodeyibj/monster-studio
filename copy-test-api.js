import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 确保 test-api.html 被复制到 dist 目录
const srcFile = path.join(__dirname, 'test-api.html')
const destFile = path.join(__dirname, 'dist', 'test-api.html')

if (fs.existsSync(srcFile)) {
  // 确保 dist 目录存在
  const distDir = path.dirname(destFile)
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true })
  }
  
  // 复制文件
  fs.copyFileSync(srcFile, destFile)
  console.log('✅ test-api.html 已复制到 dist/')
} else {
  console.log('⚠️ test-api.html 不存在')
} 