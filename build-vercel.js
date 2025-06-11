#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🎬 Monster Studio - Vercel 构建脚本')
console.log('================================')

try {
  // 1. 运行正常的 Vite 构建
  console.log('📦 运行 Vite 构建...')
  execSync('vite build', { stdio: 'inherit' })
  
  // 2. 确保 test-api.html 存在于 dist 目录
  const testApiSrc = path.join(__dirname, 'test-api.html')
  const testApiDest = path.join(__dirname, 'dist', 'test-api.html')
  
  if (fs.existsSync(testApiSrc)) {
    console.log('📋 复制 test-api.html 到 dist 目录...')
    
    // 确保 dist 目录存在
    const distDir = path.join(__dirname, 'dist')
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true })
    }
    
    // 复制文件
    fs.copyFileSync(testApiSrc, testApiDest)
    console.log('✅ test-api.html 已复制到 dist/')
  } else {
    console.log('⚠️ test-api.html 不存在，跳过复制')
  }
  
  // 3. 验证构建结果
  console.log('\n🔍 验证构建结果...')
  const distFiles = fs.readdirSync(path.join(__dirname, 'dist'))
  console.log('dist/ 内容:', distFiles)
  
  const hasIndex = distFiles.includes('index.html')
  const hasTestApi = distFiles.includes('test-api.html')
  
  console.log(`  ${hasIndex ? '✅' : '❌'} index.html`)
  console.log(`  ${hasTestApi ? '✅' : '❌'} test-api.html`)
  
  if (hasIndex && hasTestApi) {
    console.log('\n🎉 构建成功！所有文件已准备好部署')
  } else {
    console.log('\n⚠️ 构建完成，但某些文件可能缺失')
  }
  
} catch (error) {
  console.error('❌ 构建失败:', error.message)
  process.exit(1)
} 