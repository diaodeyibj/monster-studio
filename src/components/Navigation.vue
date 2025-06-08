<template>
  <nav class="navigation-container">
    <!-- 主导航 -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <router-link to="/" class="logo-link">
            <span class="text-2xl font-light tracking-widest text-white">MONSTER</span>
          </router-link>
          
          <!-- 桌面菜单 -->
          <div class="hidden md:flex items-center space-x-12">
            <router-link 
              v-for="item in menuItems" 
              :key="item.path"
              :to="item.path"
              class="nav-item"
              :class="{ 'active': $route.path === item.path }"
            >
              {{ item.name }}
            </router-link>
          </div>
          
          <!-- 移动端菜单按钮 -->
          <button 
            @click="toggleMobileMenu"
            class="md:hidden text-white hover:text-gray-300 transition-colors"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 移动端菜单 -->
    <transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-40 md:hidden">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="toggleMobileMenu"></div>
        <div class="fixed top-0 right-0 w-64 h-full bg-black border-l border-white/10">
          <div class="pt-20 p-6">
            <div class="space-y-6">
              <router-link 
                v-for="item in menuItems" 
                :key="item.path"
                :to="item.path"
                @click="toggleMobileMenu"
                class="block text-white hover:text-gray-300 transition-colors text-lg font-light tracking-wide"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script>
import configService from '../services/configService.js'

export default {
  name: 'Navigation',
  data() {
    return {
      mobileMenuOpen: false,
      config: configService.getConfig()
    }
  },
  computed: {
    menuItems() {
      return this.config.navigation || [
        { name: '我们所做的', path: '/work' },
        { name: '关于我们', path: '/about' },
        { name: '力量来源', path: '/team' }
      ]
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    }
  },
  mounted() {
    // 监听路由变化关闭移动端菜单
    this.$router.afterEach(() => {
      this.mobileMenuOpen = false
    })
    
    // 监听配置变化
    configService.onConfigChange((newConfig) => {
      this.config = newConfig
    })
  }
}
</script>

<style scoped>
.navigation-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.logo-link {
  transition: all 0.3s ease;
}

.logo-link:hover {
  opacity: 0.8;
}

.nav-item {
  position: relative;
  color: #ffffff;
  font-weight: 300;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 8px 0;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #ffffff;
  transition: width 0.3s ease;
}

.nav-item:hover,
.nav-item.active {
  color: #ffffff;
}

.nav-item:hover::after,
.nav-item.active::after {
  width: 100%;
}

/* 移动端菜单过渡动画 */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from .fixed.right-0,
.mobile-menu-leave-to .fixed.right-0 {
  transform: translateX(100%);
}
</style> 