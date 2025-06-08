<template>
  <div class="work-container">
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
    
    <!-- 项目分类 -->
    <section class="categories-section">
      <div class="max-w-7xl mx-auto px-6">
        <div class="category-tabs">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="activeCategory = category.id"
            :class="[
              'category-tab',
              { 'active': activeCategory === category.id }
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </section>
    
    <!-- 作品展示 - 简化版横向滑动 -->
    <section class="projects-section">
      <div class="max-w-7xl mx-auto px-6 pb-20">
        <div class="projects-container" v-if="filteredProjects.length > 0">
          <!-- 导航按钮 -->
          <button 
            @click="slideLeft"
            class="nav-button nav-left"
            :disabled="currentIndex === 0"
          >
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          
          <button 
            @click="slideRight"
            class="nav-button nav-right"
            :disabled="currentIndex >= filteredProjects.length - visibleCount"
          >
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
          
          <!-- 项目列表容器 -->
          <div class="projects-wrapper" ref="projectsWrapper">
            <div class="projects-track" :style="trackStyle">
              <div
                v-for="project in filteredProjects"
                :key="project.id"
                @click="playVideo(project)"
                class="project-item cursor-pointer"
              >
                <!-- 项目封面 -->
                <div class="project-cover">
                  <img 
                    :src="project.poster || '/assets/placeholder-video.jpg'"
                    :alt="project.title"
                    class="project-image"
                    @error="handleImageError"
                  />
                  
                  <!-- 播放按钮覆盖层 -->
                  <div class="project-overlay">
                    <div class="play-button">
                      <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <!-- 项目信息 -->
                  <div class="project-info">
                    <h3 class="project-title">{{ project.title }}</h3>
                    <p class="project-meta">{{ project.year }} • {{ project.duration || '2:30' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 进度指示器 -->
          <div class="pagination-dots">
            <div 
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page - 1)"
              :class="['dot', { 'active': currentPage === page - 1 }]"
            ></div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-else class="empty-state">
          <p class="text-gray-500 text-center text-lg">暂无{{ currentCategoryName }}作品</p>
        </div>
      </div>
    </section>
    
    <!-- 视频播放器 -->
    <VideoPlayer 
      :is-visible="videoPlayerVisible"
      :video-src="currentVideo.src"
      :poster-src="currentVideo.poster"
      :video-info="currentVideo.info"
      @close="closeVideoPlayer"
    />
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue'
import VideoPlayer from '../components/VideoPlayer.vue'
import configService from '../services/configService.js'

export default {
  name: 'Work',
  components: {
    Navigation,
    VideoPlayer
  },
  data() {
    return {
      activeCategory: 'all',
      videoPlayerVisible: false,
      currentVideo: {
        src: '',
        poster: '',
        info: {}
      },
      categories: [
        { id: 'all', name: '全部' },
        { id: 'movie-trailer', name: '电影预告' },
        { id: 'tv-trailer', name: '电视剧预告' },
        { id: 'mv', name: 'MV' },
        { id: 'epk', name: 'EPK' }
      ],
      config: configService.getConfig(),
      currentIndex: 0,
      visibleCount: 4 // PC端显示4个，移动端响应式调整
    }
  },
  computed: {
    filteredProjects() {
      const projects = this.config.projects || []
      if (this.activeCategory === 'all') {
        return projects
      }
      return projects.filter(project => project.category === this.activeCategory)
    },
    currentCategoryName() {
      const category = this.categories.find(cat => cat.id === this.activeCategory)
      return category ? category.name : '全部'
    },
    trackStyle() {
      const translateX = -(this.currentIndex * (100 / this.visibleCount))
      return {
        transform: `translateX(${translateX}%)`,
        transition: 'transform 0.5s ease-in-out'
      }
    },
    totalPages() {
      return Math.ceil(this.filteredProjects.length / this.visibleCount)
    },
    currentPage() {
      return Math.floor(this.currentIndex / this.visibleCount)
    },
    pageTitle() {
      // 从导航配置中获取对应路由的标题
      const currentNav = this.config.navigation?.find(nav => nav.path === '/work')
      return currentNav?.title || '我们所做的'
    }
  },
  mounted() {
    // 监听配置变化
    configService.onConfigChange((newConfig) => {
      this.config = newConfig
    })
    
    // 响应式调整显示数量
    this.updateVisibleCount()
    window.addEventListener('resize', this.updateVisibleCount)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateVisibleCount)
  },
  methods: {
    updateVisibleCount() {
      if (window.innerWidth < 768) {
        this.visibleCount = 1 // 移动端显示1个
      } else if (window.innerWidth < 1024) {
        this.visibleCount = 2 // 平板显示2个
      } else {
        this.visibleCount = 4 // PC端显示4个
      }
      
      // 重置当前索引
      this.currentIndex = 0
    },
    
    slideLeft() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    },
    
    slideRight() {
      if (this.currentIndex < this.filteredProjects.length - this.visibleCount) {
        this.currentIndex++
      }
    },
    
    goToPage(page) {
      this.currentIndex = page * this.visibleCount
    },
    
    playVideo(project) {
      this.currentVideo = {
        src: project.videoSrc,
        poster: project.poster,
        info: {
          title: project.title,
          description: project.description,
          category: this.getCategoryName(project.category),
          year: project.year,
          duration: project.duration
        }
      }
      this.videoPlayerVisible = true
    },
    
    closeVideoPlayer() {
      this.videoPlayerVisible = false
      this.currentVideo = {
        src: '',
        poster: '',
        info: {}
      }
    },
    
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId)
      return category ? category.name : categoryId
    },
    
    handleImageError(event) {
      event.target.src = '/assets/placeholder-video.jpg'
    }
  },
  watch: {
    activeCategory() {
      // 切换分类时重置到第一页
      this.currentIndex = 0
    }
  }
}
</script>

<style scoped>
.work-container {
  min-height: 100vh;
  background: #000;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding-top: 80px;
}

.hero-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.categories-section {
  padding: 40px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.category-tabs {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.category-tab {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 300;
}

.category-tab:hover {
  border-color: rgba(255, 255, 255, 0.4);
  color: white;
}

.category-tab.active {
  background: white;
  color: black;
  border-color: white;
}

.projects-section {
  padding: 60px 0;
}

.projects-container {
  position: relative;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.nav-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-left {
  left: -25px;
}

.nav-right {
  right: -25px;
}

.projects-wrapper {
  overflow: hidden;
  margin: 0 40px;
}

.projects-track {
  display: flex;
  width: calc(100% * var(--total-items));
}

.project-item {
  flex: 0 0 25%; /* PC端每个项目占25%宽度 */
  padding: 0 12px;
}

.project-cover {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #1a1a1a;
  aspect-ratio: 16/9;
  transition: transform 0.3s ease;
}

.project-cover:hover {
  transform: translateY(-8px);
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-cover:hover .project-image {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-cover:hover .project-overlay {
  opacity: 1;
}

.play-button {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.play-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.project-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 40px 20px 20px;
  color: white;
}

.project-title {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.project-meta {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.5);
}

.dot.active {
  background: white;
  transform: scale(1.2);
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .project-item {
    flex: 0 0 50%; /* 平板每个项目占50% */
  }
}

@media (max-width: 768px) {
  .work-container {
    padding-top: 60px;
  }
  
  .hero-section .max-w-7xl {
    padding: 60px 24px;
  }
  
  .category-tabs {
    gap: 1rem;
  }
  
  .category-tab {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  
  .projects-wrapper {
    margin: 0 20px;
  }
  
  .nav-left {
    left: -10px;
  }
  
  .nav-right {
    right: -10px;
  }
  
  .project-item {
    flex: 0 0 100%; /* 移动端每个项目占100% */
    padding: 0 8px;
  }
  
  .play-button {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .hero-section h1 {
    font-size: 2.5rem;
  }
  
  .projects-wrapper {
    margin: 0 10px;
  }
  
  .nav-button {
    width: 40px;
    height: 40px;
  }
}
</style> 