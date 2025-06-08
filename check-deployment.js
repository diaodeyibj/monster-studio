#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

console.log('🔍 Monster Studio - Vercel 部署前检查\n')

let hasErrors = false

// 检查文件是否存在
function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}`)
    return true
  } else {
    console.log(`❌ ${description} - 文件不存在: ${filePath}`)
    hasErrors = true
    return false
  }
}

// 检查目录是否存在
function checkDirectory(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    console.log(`✅ ${description}`)
    return true
  } else {
    console.log(`❌ ${description} - 目录不存在: ${dirPath}`)
    hasErrors = true
    return false
  }
}

// 检查JSON文件内容
function checkJsonContent(filePath, description, requiredKeys = []) {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    let missing = []
    
    requiredKeys.forEach(key => {
      if (!(key in content)) {
        missing.push(key)
      }
    })
    
    if (missing.length === 0) {
      console.log(`✅ ${description}`)
      return true
    } else {
      console.log(`❌ ${description} - 缺少字段: ${missing.join(', ')}`)
      hasErrors = true
      return false
    }
  } catch (error) {
    console.log(`❌ ${description} - JSON格式错误: ${error.message}`)
    hasErrors = true
    return false
  }
}

console.log('📁 检查项目结构:')
checkDirectory('api', 'API目录存在')
checkFile('api/[...route].js', 'API路由处理器存在')
checkFile('api/upload.js', '文件上传处理器存在')
checkDirectory('src', '前端源码目录存在')
checkFile('vercel.json', 'Vercel配置文件存在')

console.log('\n📦 检查配置文件:')
checkJsonContent('package.json', 'package.json格式正确', ['name', 'dependencies', 'scripts'])
checkJsonContent('vercel.json', 'vercel.json格式正确', ['version', 'builds', 'routes'])

// 检查package.json中的关键依赖和脚本
if (fs.existsSync('package.json')) {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    
    // 检查关键依赖
    const requiredDeps = ['vue', 'express', 'bcryptjs', 'formidable']
    const missingDeps = requiredDeps.filter(dep => !pkg.dependencies || !pkg.dependencies[dep])
    
    if (missingDeps.length === 0) {
      console.log('✅ 关键依赖包完整')
    } else {
      console.log(`❌ 缺少依赖包: ${missingDeps.join(', ')}`)
      hasErrors = true
    }
    
    // 检查构建脚本
    if (pkg.scripts && pkg.scripts.build && pkg.scripts['vercel-build']) {
      console.log('✅ 构建脚本配置正确')
    } else {
      console.log('❌ 缺少必要的构建脚本 (build, vercel-build)')
      hasErrors = true
    }
  } catch (error) {
    console.log(`❌ 读取package.json失败: ${error.message}`)
    hasErrors = true
  }
}

console.log('\n🔧 检查API文件语法:')
// 简单检查API文件是否包含必要的导出
try {
  const apiContent = fs.readFileSync('api/[...route].js', 'utf8')
  if (apiContent.includes('module.exports')) {
    console.log('✅ API路由文件包含正确的导出')
  } else {
    console.log('❌ API路由文件缺少模块导出')
    hasErrors = true
  }
} catch (error) {
  console.log(`❌ 读取API文件失败: ${error.message}`)
  hasErrors = true
}

try {
  const uploadContent = fs.readFileSync('api/upload.js', 'utf8')
  if (uploadContent.includes('module.exports') && uploadContent.includes('formidable')) {
    console.log('✅ 文件上传API配置正确')
  } else {
    console.log('❌ 文件上传API配置有问题')
    hasErrors = true
  }
} catch (error) {
  console.log(`❌ 读取上传API文件失败: ${error.message}`)
  hasErrors = true
}

console.log('\n🌐 检查前端API配置:')
try {
  const configServiceContent = fs.readFileSync('src/services/configService.js', 'utf8')
  if (configServiceContent.includes('process.env.NODE_ENV === \'production\'')) {
    console.log('✅ 前端API路径配置正确')
  } else {
    console.log('❌ 前端API路径未配置生产环境')
    hasErrors = true
  }
} catch (error) {
  console.log(`❌ 读取前端服务文件失败: ${error.message}`)
  hasErrors = true
}

console.log('\n' + '='.repeat(50))
if (hasErrors) {
  console.log('❌ 检查发现问题，请修复后再部署')
  process.exit(1)
} else {
  console.log('✅ 所有检查通过，项目准备就绪!')
  console.log('\n📋 下一步操作:')
  console.log('1. git add .')
  console.log('2. git commit -m "准备Vercel部署"')
  console.log('3. git push origin main')
  console.log('4. 在Vercel网站导入GitHub仓库')
  console.log('\n📖 详细部署步骤请参考: VERCEL_DEPLOYMENT_GUIDE.md')
} 