#!/usr/bin/env node

import https from 'https'
import http from 'http'

const API_BASE = 'https://monster-studio.vercel.app'

const endpoints = [
  '/api/hello',
  '/api/test-working', 
  '/api/test-project',
  '/api/health'
]

console.log('🎬 Monster Studio - API 端点测试')
console.log('===============================')
console.log(`🌐 测试域名: ${API_BASE}`)
console.log('')

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `${API_BASE}${endpoint}`
    console.log(`🔍 测试: ${endpoint}`)
    
    const requestModule = url.startsWith('https') ? https : http
    
    const req = requestModule.get(url, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        const status = res.statusCode
        const success = status >= 200 && status < 300
        
        console.log(`   状态码: ${status}`)
        console.log(`   结果: ${success ? '✅ 成功' : '❌ 失败'}`)
        
        if (success && data) {
          try {
            const jsonData = JSON.parse(data)
            console.log(`   响应: ${jsonData.message || '无消息'}`)
          } catch (e) {
            console.log(`   响应: ${data.substring(0, 100)}...`)
          }
        }
        
        resolve({ endpoint, status, success, data })
      })
    })
    
    req.on('error', (error) => {
      console.log(`   错误: ${error.message}`)
      resolve({ endpoint, status: 0, success: false, error: error.message })
    })
    
    req.setTimeout(10000, () => {
      console.log(`   超时: 请求超时`)
      req.destroy()
      resolve({ endpoint, status: 0, success: false, error: '请求超时' })
    })
  })
}

async function runTests() {
  const results = []
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint)
    results.push(result)
    console.log('')
    
    // 等待一秒钟再测试下一个端点
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // 生成总结报告
  console.log('📊 测试总结')
  console.log('==========')
  
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  console.log(`✅ 成功: ${successful.length}/${results.length}`)
  console.log(`❌ 失败: ${failed.length}/${results.length}`)
  
  if (failed.length > 0) {
    console.log('\n失败的端点:')
    failed.forEach(r => {
      console.log(`  - ${r.endpoint} (状态码: ${r.status})`)
    })
  }
  
  if (successful.length === results.length) {
    console.log('\n🎉 所有 API 端点测试通过！')
  } else {
    console.log('\n⚠️ 部分 API 端点需要修复')
  }
}

runTests().catch(console.error) 