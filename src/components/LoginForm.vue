<template>
  <div class="min-h-screen bg-black flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 p-8">
      <!-- Logo -->
      <div class="text-center">
        <h1 class="text-4xl font-bold text-white mb-2">怪兽工场</h1>
        <p class="text-gray-400">Monster Studio</p>
        <p class="text-gray-500 text-sm mt-4">后台管理系统</p>
      </div>

      <!-- 登录表单 -->
      <div v-if="!isAuthenticated" class="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 class="text-xl font-semibold text-white mb-6 text-center">管理员登录</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              管理密码
            </label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="请输入管理密码"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                     text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:border-transparent"
              :disabled="loading"
            />
          </div>

          <div class="flex items-center">
            <input
              v-model="rememberMe"
              type="checkbox"
              id="remember"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-300">
              记住登录状态
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading || !password"
            class="w-full py-2 px-4 border border-transparent rounded-lg text-sm font-medium 
                   text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- 错误提示 -->
        <div v-if="error" class="mt-4 p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
          <p class="text-red-400 text-sm">{{ error }}</p>
        </div>

        <!-- 提示信息 -->
        <div class="mt-6 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
          <p class="text-blue-300 text-xs">
            <strong>默认密码：</strong>monster2024<br>
            首次登录后请及时修改密码
          </p>
        </div>
      </div>

      <!-- 密码修改表单 -->
      <div v-if="isAuthenticated && showPasswordChange" class="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 class="text-xl font-semibold text-white mb-6 text-center">修改管理密码</h2>
        
        <form @submit.prevent="handleChangePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              当前密码
            </label>
            <input
              v-model="currentPassword"
              type="password"
              required
              placeholder="请输入当前密码"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                     text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:border-transparent"
              :disabled="loading"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              新密码
            </label>
            <input
              v-model="newPassword"
              type="password"
              required
              placeholder="请输入新密码（至少6位）"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                     text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:border-transparent"
              :disabled="loading"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              确认新密码
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              placeholder="请再次输入新密码"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                     text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:border-transparent"
              :disabled="loading"
            />
          </div>

          <div class="flex space-x-3">
            <button
              type="submit"
              :disabled="loading || !currentPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 6"
              class="flex-1 py-2 px-4 border border-transparent rounded-lg text-sm font-medium 
                     text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
            >
              {{ loading ? '修改中...' : '修改密码' }}
            </button>

            <button
              type="button"
              @click="showPasswordChange = false"
              class="flex-1 py-2 px-4 border border-gray-600 rounded-lg text-sm font-medium 
                     text-gray-300 hover:bg-gray-800 transition-colors"
            >
              取消
            </button>
          </div>
        </form>

        <!-- 错误提示 -->
        <div v-if="error" class="mt-4 p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
          <p class="text-red-400 text-sm">{{ error }}</p>
        </div>

        <!-- 密码强度提示 -->
        <div class="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
          <p class="text-yellow-300 text-xs">
            <strong>密码建议：</strong><br>
            • 至少6位字符<br>
            • 包含字母和数字<br>
            • 避免使用简单密码
          </p>
        </div>
      </div>

      <!-- 登录成功后的操作 -->
      <div v-if="isAuthenticated && !showPasswordChange" class="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 class="text-xl font-semibold text-white mb-4 text-center">登录成功</h2>
        
        <div class="space-y-3">
          <button
            @click="$emit('login-success')"
            class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                   transition-colors font-medium"
          >
            进入管理后台
          </button>

          <button
            @click="showPasswordChange = true"
            class="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg 
                   transition-colors"
          >
            修改密码
          </button>

          <button
            @click="handleLogout"
            class="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg 
                   transition-colors"
          >
            退出登录
          </button>
        </div>

        <!-- 首次设置密码提示 -->
        <div v-if="needsPasswordSetup" class="mt-4 p-3 bg-orange-900/20 border border-orange-600/30 rounded-lg">
          <p class="text-orange-300 text-sm">
            <strong>⚠️ 安全提醒：</strong><br>
            您正在使用默认密码，建议立即修改密码以确保系统安全。
          </p>
        </div>
      </div>

      <!-- 成功提示 -->
      <div v-if="success" class="bg-green-900/20 border border-green-600/30 rounded-lg p-3">
        <p class="text-green-400 text-sm">{{ success }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import configService from '../services/configService.js'

export default {
  name: 'LoginForm',
  emits: ['login-success'],
  data() {
    return {
      password: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      rememberMe: false,
      loading: false,
      error: null,
      success: null,
      isAuthenticated: false,
      showPasswordChange: false,
      needsPasswordSetup: false
    }
  },
  
  async mounted() {
    // 检查是否已经登录
    await this.checkAuthStatus()
  },

  methods: {
    async checkAuthStatus() {
      try {
        const authResult = await configService.checkAuth()
        this.isAuthenticated = authResult.authenticated
        
        if (this.isAuthenticated) {
          this.clearMessages()
        }
      } catch (error) {
        console.error('检查登录状态失败:', error)
        this.isAuthenticated = false
      }
    },

    async handleLogin() {
      this.loading = true
      this.error = null
      this.success = null

      try {
        const result = await configService.login(this.password)
        
        if (result.success) {
          this.isAuthenticated = true
          this.needsPasswordSetup = result.needsPasswordSetup
          this.success = '登录成功！'
          this.password = ''
          
          // 如果需要设置密码，自动打开密码修改界面
          if (result.needsPasswordSetup) {
            setTimeout(() => {
              this.showPasswordChange = true
            }, 2000)
          }
        }
      } catch (error) {
        this.error = error.message || '登录失败'
      } finally {
        this.loading = false
      }
    },

    async handleChangePassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.error = '两次输入的密码不一致'
        return
      }

      if (this.newPassword.length < 6) {
        this.error = '新密码长度不能少于6位'
        return
      }

      this.loading = true
      this.error = null
      this.success = null

      try {
        await configService.changePassword(this.currentPassword, this.newPassword)
        
        this.success = '密码修改成功！'
        this.currentPassword = ''
        this.newPassword = ''
        this.confirmPassword = ''
        this.needsPasswordSetup = false
        
        setTimeout(() => {
          this.showPasswordChange = false
        }, 2000)
      } catch (error) {
        this.error = error.message || '密码修改失败'
      } finally {
        this.loading = false
      }
    },

    async handleLogout() {
      try {
        await configService.logout()
        this.isAuthenticated = false
        this.showPasswordChange = false
        this.needsPasswordSetup = false
        this.clearForm()
        this.success = '已安全退出'
      } catch (error) {
        console.error('退出登录失败:', error)
      }
    },

    clearForm() {
      this.password = ''
      this.currentPassword = ''
      this.newPassword = ''
      this.confirmPassword = ''
    },

    clearMessages() {
      this.error = null
      this.success = null
    }
  }
}
</script> 