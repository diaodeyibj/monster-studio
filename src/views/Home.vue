<template>
  <div class="home-container">
    <!-- 导航 -->
    <Navigation />
    
    <!-- Hero区域 -->
    <section class="hero-section">
      <FluidLogo :company-data="config.company" />
    </section>
    
    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 简介区域 -->
      <section class="intro-section">
        <div class="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 class="text-2xl md:text-3xl font-light text-white mb-8 leading-relaxed">
            {{ config.company.description }}
          </h2>
          <div class="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-32 mx-auto"></div>
        </div>
      </section>
      
      <!-- 核心能力展示 -->
      <section class="capabilities-section py-20">
        <div class="max-w-6xl mx-auto px-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div 
              v-for="service in config.services" 
              :key="service.id"
              class="capability-card group"
            >
              <div class="text-center">
                <div class="text-4xl mb-6 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                  {{ service.icon }}
                </div>
                <h3 class="text-lg font-light text-white mb-4">{{ service.title }}</h3>
                <p class="text-sm text-gray-400 leading-relaxed">{{ service.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 联系信息 -->
      <section class="contact-section py-20 border-t border-white/10">
        <div class="max-w-6xl mx-auto px-6 text-center">
          <h2 class="text-2xl font-light text-white mb-12">联系我们</h2>
          
          <div class="contact-row">
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <span class="contact-label">邮箱:</span>
              <a :href="`mailto:${config.company.contact?.email}`" class="contact-value">
                {{ config.company.contact?.email }}
              </a>
            </div>
            
            <div class="contact-divider">|</div>
            
            <div class="contact-item">
              <span class="contact-icon">📞</span>
              <span class="contact-label">电话:</span>
              <a :href="`tel:${config.company.contact?.phone}`" class="contact-value">
                {{ config.company.contact?.phone }}
              </a>
            </div>
            
            <div class="contact-divider">|</div>
            
            <div class="contact-item">
              <span class="contact-icon">💬</span>
              <span class="contact-label">微信:</span>
              <span class="contact-value">{{ config.company.contact?.wechat }}</span>
            </div>
            
            <div class="contact-divider">|</div>
            
            <div class="contact-item">
              <span class="contact-icon">📍</span>
              <span class="contact-label">地址:</span>
              <span class="contact-value">{{ config.company.contact?.address }}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <!-- 管理入口 -->
    <div class="fixed bottom-6 right-6 z-40">
      <router-link 
        to="/admin"
        class="admin-link"
        title="管理后台"
      >
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue'
import FluidLogo from '../components/FluidLogo.vue'
import configService from '../services/configService.js'

export default {
  name: 'Home',
  components: {
    Navigation,
    FluidLogo
  },
  data() {
    return {
      config: configService.getConfig()
    }
  },
  mounted() {
    // 监听配置变化
    configService.onConfigChange((newConfig) => {
      this.config = newConfig
    })
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #000;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.hero-section {
  height: 100vh;
  position: relative;
}

.main-content {
  background: linear-gradient(180deg, #000 0%, #0a0a0a 50%, #000 100%);
}

.intro-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.capability-card {
  transition: all 0.4s ease;
  padding: 2rem;
  border-radius: 0;
  position: relative;
}

.capability-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.capability-card:hover::before {
  transform: scaleX(1);
}

.contact-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.contact-item:hover {
  transform: translateY(-2px);
}

.contact-icon {
  font-size: 1.2rem;
}

.contact-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
}

.contact-value {
  color: white;
  font-size: 0.875rem;
  font-weight: 300;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-value:hover {
  color: rgba(255, 255, 255, 0.8);
}

.contact-divider {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.2);
  margin: 0 0.5rem;
}

.admin-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.admin-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-container {
    padding-top: 60px;
  }
  
  .hero-section .max-w-7xl {
    padding: 60px 24px;
  }
  
  .capabilities-section {
    padding: 60px 0;
  }
  
  .capabilities-section .grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-row {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }
  
  .contact-divider {
    display: none;
  }
  
  .contact-item {
    justify-content: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    width: 100%;
    max-width: 300px;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #000;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style> 