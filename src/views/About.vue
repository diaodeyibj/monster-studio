<template>
  <div class="about-container">
    <!-- 导航 -->
    <Navigation />
    
    <!-- 页面标题 -->
    <section class="hero-section">
      <div class="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 class="text-4xl md:text-6xl font-light text-white mb-8 tracking-wide">
          {{ pageTitle }}
        </h1>
        <div class="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-32 mx-auto"></div>
      </div>
    </section>
    
    <!-- 主要内容 -->
    <main class="main-content">
      <!-- 内容区块 -->
      <section class="content-sections">
        <div 
          v-for="(section, index) in aboutSections" 
          :key="section.id"
          :class="[
            'content-section',
            { 'reverse': index % 2 === 1 }
          ]"
        >
          <div class="max-w-7xl mx-auto px-6 py-20">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <!-- 文字内容 -->
              <div :class="{ 'order-2': index % 2 === 1 }">
                <h2 class="text-3xl font-light text-white mb-8">{{ section.title }}</h2>
                <div class="text-content">
                  <p 
                    v-if="!section.expanded && section.content.length > section.maxLength"
                    class="text-lg text-gray-300 leading-relaxed mb-6"
                  >
                    {{ section.content.substring(0, section.maxLength) }}...
                    <button 
                      @click="showContentModal(section)"
                      class="text-blue-400 hover:text-blue-300 ml-2 underline transition-colors"
                    >
                      更多
                    </button>
                  </p>
                  <p 
                    v-else
                    class="text-lg text-gray-300 leading-relaxed mb-6"
                  >
                    {{ section.content }}
                    <button 
                      v-if="section.content.length > section.maxLength && section.expanded"
                      @click="toggleExpanded(section.id)"
                      class="text-blue-400 hover:text-blue-300 ml-2 underline transition-colors"
                    >
                      收起
                    </button>
                  </p>
                </div>
              </div>
              
              <!-- 图片内容 -->
              <div :class="{ 'order-1': index % 2 === 1 }">
                <div class="image-container">
                  <img 
                    :src="section.image || '/assets/placeholder-about.jpg'"
                    :alt="section.title"
                    class="section-image"
                    @error="handleImageError"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 简化的下半部分 - 单一图片展示 -->
      <section class="bottom-section py-20 border-t border-white/10">
        <div class="max-w-6xl mx-auto px-6">
          <div class="bottom-image-container">
            <!-- PC端图片 -->
            <img 
              v-if="config.aboutBottomImage"
              :src="config.aboutBottomImage"
              alt="关于我们详情"
              class="bottom-image desktop-image hidden md:block"
              @error="handleBottomImageError"
            />
            
            <!-- 移动端图片 -->
            <img 
              v-if="config.aboutBottomImageMobile"
              :src="config.aboutBottomImageMobile"
              alt="关于我们详情"
              class="bottom-image mobile-image md:hidden"
              @error="handleBottomImageErrorMobile"
            />
            
            <!-- 占位符 -->
            <div v-if="!config.aboutBottomImage && !config.aboutBottomImageMobile" class="placeholder-content">
              <div class="placeholder-icon">
                <svg width="64" height="64" fill="rgba(255,255,255,0.3)" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </div>
              <p class="text-gray-400 text-center mt-4">请在后台上传图片</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <!-- 内容详情模态框 -->
    <div 
      v-if="selectedContent" 
      class="content-modal fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      @click="closeContentModal"
    >
      <div class="content-modal-card" @click.stop>
        <!-- 关闭按钮 -->
        <button 
          @click="closeContentModal"
          class="absolute -top-12 right-0 text-white/60 hover:text-white text-2xl transition-colors"
        >
          ✕
        </button>
        
        <div class="modal-content">
          <h2 class="text-2xl font-light text-white mb-6">{{ selectedContent.title }}</h2>
          <div class="max-h-96 overflow-y-auto">
            <p class="text-gray-300 leading-relaxed">{{ selectedContent.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue'
import configService from '../services/configService.js'

export default {
  name: 'About',
  components: {
    Navigation
  },
  data() {
    return {
      config: configService.getConfig(),
      selectedContent: null
    }
  },
  computed: {
    aboutSections() {
      // 从配置中读取关于我们的内容，如果没有则使用默认值
      return this.config.aboutSections || [
        {
          id: 1,
          title: '公司介绍',
          content: this.config.company.description || '我们是一支专业的影视后期制作团队，专注于为电影、电视剧、广告和短视频提供顶级的视觉效果和后期制作服务。从概念设计到最终渲染，我们用技术和创意为每一个项目注入生命力。',
          image: '/assets/about-company.jpg',
          maxLength: 100,
          expanded: false
        },
        {
          id: 2,
          title: '我们的愿景',
          content: this.config.vision || '我们致力于成为中国影视后期制作行业的领军者，通过不断创新的技术和无与伦比的创意，为每一个项目注入生命力。我们相信，优秀的视觉作品不仅仅是技术的展示，更是情感的传达和故事的延续。每一帧画面都承载着创作者的思想和观众的期待。',
          image: '/assets/about-vision.jpg',
          maxLength: 100,
          expanded: false
        }
      ]
    },
    pageTitle() {
      // 从导航配置中获取对应路由的标题
      const currentNav = this.config.navigation?.find(nav => nav.path === '/about')
      return currentNav?.title || '关于我们'
    }
  },
  mounted() {
    // 监听配置变化
    configService.onConfigChange((newConfig) => {
      this.config = newConfig
    })
  },
  methods: {
    toggleExpanded(id) {
      const section = this.aboutSections.find(s => s.id === id)
      if (section) {
        section.expanded = !section.expanded
      }
    },
    handleImageError(event) {
      event.target.src = '/assets/placeholder-about.jpg'
    },
    handleBottomImageError(event) {
      event.target.src = '/assets/placeholder-about-bottom.jpg'
    },
    handleBottomImageErrorMobile(event) {
      event.target.src = '/assets/placeholder-about-bottom-mobile.jpg'
    },
    showContentModal(section) {
      this.selectedContent = section
    },
    closeContentModal() {
      this.selectedContent = null
    }
  }
}
</script>

<style scoped>
.about-container {
  min-height: 100vh;
  background: #000;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding-top: 80px;
}

.hero-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.main-content {
  background: linear-gradient(180deg, #000 0%, #0a0a0a 50%, #000 100%);
}

.content-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.image-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.section-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.image-container:hover .section-image {
  transform: scale(1.05);
}

.bottom-section {
  background: linear-gradient(180deg, #0a0a0a 0%, #000 100%);
}

.bottom-image-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #1a1a1a;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 16px;
}

.desktop-image {
  min-height: 400px;
  object-fit: cover;
}

.mobile-image {
  min-height: 300px;
  object-fit: cover;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.3);
}

.placeholder-icon {
  margin-bottom: 1rem;
}

.content-modal {
  padding: 2rem;
}

.content-modal-card {
  max-width: 800px;
  width: 100%;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  max-height: 80vh;
  overflow: hidden;
}

.modal-content {
  overflow-y: auto;
  max-height: 100%;
}

.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about-container {
    padding-top: 60px;
  }
  
  .hero-section .max-w-7xl {
    padding: 60px 24px;
  }
  
  .content-section .grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .section-image {
    height: 250px;
  }
  
  .bottom-image-container {
    min-height: 300px;
    border-radius: 12px;
  }
  
  .bottom-image {
    border-radius: 12px;
  }
  
  .placeholder-content {
    padding: 2rem 1rem;
  }
}

@media (max-width: 480px) {
  .hero-section h1 {
    font-size: 2.5rem;
  }
  
  .section-image {
    height: 200px;
  }
  
  .bottom-image-container {
    min-height: 250px;
    border-radius: 8px;
  }
  
  .bottom-image {
    border-radius: 8px;
  }
}
</style> 