#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🎬 Monster Studio - 部署前检查')
console.log('=' * 50)

// 检查必要的文件
const requiredFiles = [
  'package.json',
  'vercel.json', 
  'index.html',
  'vite.config.js',
  'tailwind.config.js',
  'server.cjs'
]

const requiredDirs = [
  'src',
  'public',
  'api',
  'uploads'
]

const apiFiles = [
  'api/test-working.js',
  'api/test-project.js',
  'api/health.js',
  'api/login.js',
  'api/upload.js',
  'api/files.js'
]

let allGood = true

console.log('📁 检查核心文件...')
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file))
  console.log(`  ${exists ? '✅' : '❌'} ${file}`)
  if (!exists) allGood = false
})

console.log('\n📂 检查目录结构...')
requiredDirs.forEach(dir => {
  const exists = fs.existsSync(path.join(__dirname, dir))
  console.log(`  ${exists ? '✅' : '❌'} ${dir}/`)
  if (!exists) allGood = false
})

console.log('\n🔌 检查 API 端点...')
apiFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file))
  console.log(`  ${exists ? '✅' : '❌'} ${file}`)
  if (!exists) allGood = false
})

// 检查 package.json 配置
console.log('\n📦 检查 package.json 配置...')
try {
  const packagePath = path.join(__dirname, 'package.json')
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  const hasVercelBuild = packageContent.scripts && packageContent.scripts['vercel-build']
  console.log(`  ${hasVercelBuild ? '✅' : '❌'} vercel-build 脚本`)
  
  const hasNodeEngine = packageContent.engines && packageContent.engines.node
  console.log(`  ${hasNodeEngine ? '✅' : '❌'} Node.js 版本要求`)
  
  if (!hasVercelBuild || !hasNodeEngine) allGood = false
  
} catch (error) {
  console.log('  ❌ 无法解析 package.json')
  allGood = false
}

// 检查 vercel.json 配置
console.log('\n⚙️ 检查 Vercel 配置...')
try {
  const vercelPath = path.join(__dirname, 'vercel.json')
  const vercelContent = JSON.parse(fs.readFileSync(vercelPath, 'utf8'))
  
  const hasBuilds = vercelContent.builds && vercelContent.builds.length > 0
  console.log(`  ${hasBuilds ? '✅' : '❌'} 构建配置`)
  
  const hasRoutes = vercelContent.routes && vercelContent.routes.length > 0
  console.log(`  ${hasRoutes ? '✅' : '❌'} 路由配置`)
  
  if (!hasBuilds || !hasRoutes) allGood = false
  
} catch (error) {
  console.log('  ❌ 无法解析 vercel.json')
  allGood = false
}

// 生成报告
console.log('\n' + '=' * 50)
if (allGood) {
  console.log('🎉 所有检查通过！项目已准备好部署')
  console.log('\n📋 下一步:')
  console.log('1. 运行: git add .')
  console.log('2. 运行: git commit -m "准备部署到 Vercel"')
  console.log('3. 运行: git push origin main')
  console.log('4. 在 Vercel 中连接 GitHub 仓库并部署')
  console.log('\n🧪 本地测试:')
  console.log('- 运行: npm run build')
  console.log('- 打开: test-api.html 进行 API 测试')
} else {
  console.log('❌ 发现问题，请先修复后再继续部署')
  process.exit(1)
}

console.log('\n🔒 原项目保护状态: ✅ 所有测试都是安全的只读操作') 