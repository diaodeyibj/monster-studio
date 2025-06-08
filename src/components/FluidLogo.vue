<template>
  <div class="fluid-logo-container relative flex items-center justify-center h-screen">
    <!-- 主Logo容器 -->
    <div 
      ref="logoContainer"
      class="logo-main relative cursor-pointer select-none flex flex-col items-center"
      @click="triggerAnimation"
    >
      <!-- 单个M字母Logo -->
      <div class="relative logo-content text-center">
        <svg 
          ref="logoSvg"
          width="300" 
          height="280" 
          viewBox="0 0 300 280" 
          class="logo-svg relative z-10 mx-auto"
        >
          <defs>
            <!-- 黑色金属渐变 -->
            <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#4a4a4a;stop-opacity:1" />
              <stop offset="25%" style="stop-color:#2a2a2a;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#000000;stop-opacity:1" />
              <stop offset="75%" style="stop-color:#1a1a1a;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#404040;stop-opacity:1" />
            </linearGradient>
            
            <!-- 金属质感高光 -->
            <linearGradient id="metalHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#666666;stop-opacity:0" />
              <stop offset="40%" style="stop-color:#aaaaaa;stop-opacity:0.7" />
              <stop offset="50%" style="stop-color:#ffffff;stop-opacity:0.9" />
              <stop offset="60%" style="stop-color:#aaaaaa;stop-opacity:0.7" />
              <stop offset="100%" style="stop-color:#666666;stop-opacity:0" />
            </linearGradient>
            
            <!-- 立体感阴影渐变 -->
            <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#000000;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#000000;stop-opacity:0.3" />
            </linearGradient>
          </defs>
          
          <!-- 立体阴影层 -->
          <path 
            d="M 52 242 
               L 52 62
               C 52 57, 57 52, 62 52
               L 92 52
               C 97 52, 102 57, 102 62
               L 152 182
               L 202 62
               C 202 57, 207 52, 212 52
               L 242 52
               C 247 52, 252 57, 252 62
               L 252 242
               C 252 247, 247 252, 242 252
               L 212 252
               C 207 252, 202 247, 202 242
               L 202 122
               L 172 192
               C 169 199, 165 202, 152 202
               C 139 202, 135 199, 132 192
               L 102 122
               L 102 242
               C 102 247, 97 252, 92 252
               L 62 252
               C 57 252, 52 247, 52 242 Z"
            fill="url(#shadowGradient)"
            opacity="0.6"
          />
          
          <!-- 主要的M字母路径 -->
          <path 
            ref="mPath"
            d="M 50 240 
               L 50 60
               C 50 55, 55 50, 60 50
               L 90 50
               C 95 50, 100 55, 100 60
               L 150 180
               L 200 60
               C 200 55, 205 50, 210 50
               L 240 50
               C 245 50, 250 55, 250 60
               L 250 240
               C 250 245, 245 250, 240 250
               L 210 250
               C 205 250, 200 245, 200 240
               L 200 120
               L 170 190
               C 167 197, 163 200, 150 200
               C 137 200, 133 197, 130 190
               L 100 120
               L 100 240
               C 100 245, 95 250, 90 250
               L 60 250
               C 55 250, 50 245, 50 240 Z"
            fill="url(#metalGradient)"
            class="m-letter"
          />
          
          <!-- 金属高光层 -->
          <path 
            d="M 50 240 
               L 50 60
               C 50 55, 55 50, 60 50
               L 90 50
               C 95 50, 100 55, 100 60
               L 150 180
               L 200 60
               C 200 55, 205 50, 210 50
               L 240 50
               C 245 50, 250 55, 250 60
               L 250 240
               C 250 245, 245 250, 240 250
               L 210 250
               C 205 250, 200 245, 200 240
               L 200 120
               L 170 190
               C 167 197, 163 200, 150 200
               C 137 200, 133 197, 130 190
               L 100 120
               L 100 240
               C 100 245, 95 250, 90 250
               L 60 250
               C 55 250, 50 245, 50 240 Z"
            fill="url(#metalHighlight)"
            opacity="0.6"
          />
        </svg>
        
        <!-- 公司名称 - 居中排版 -->
        <div class="company-name mt-8 text-center">
          <h1 class="text-4xl md:text-5xl font-light tracking-widest text-white mb-4">
            {{ companyData.name || '怪兽工场' }}
          </h1>
          <h2 class="text-xl md:text-2xl font-light tracking-wide text-gray-400 mb-6">
            {{ companyData.nameEn?.toUpperCase() || 'MONSTER STUDIO' }}
          </h2>
          <div class="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-48 mx-auto mb-8"></div>
          <p class="text-lg md:text-xl text-gray-300 font-light mb-4">
            {{ companyData.tagline || '创造视觉奇迹，讲述非凡故事' }}
          </p>
          <p class="text-base md:text-lg text-gray-400 font-light italic">
            {{ companyData.taglineEn || 'Creating Visual Miracles, Telling Extraordinary Stories' }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- 滚动提示 -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2">
      <div class="scroll-indicator">
        <div class="scroll-line"></div>
        <p class="text-gray-400 text-xs mt-4 tracking-wide">SCROLL</p>
      </div>
    </div>
  </div>
</template>

<script>
import anime from 'animejs'

export default {
  name: 'FluidLogo',
  props: {
    companyData: {
      type: Object,
      default: () => ({
        name: '怪兽工场',
        nameEn: 'Monster Studio',
        tagline: '创造视觉奇迹，讲述非凡故事',
        taglineEn: 'Creating Visual Miracles, Telling Extraordinary Stories'
      })
    }
  },
  data() {
    return {
      isAnimating: false
    }
  },
  mounted() {
    this.initAnimation()
  },
  methods: {
    initAnimation() {
      // Logo入场动画
      anime.timeline()
        .add({
          targets: this.$refs.logoSvg,
          scale: [0.8, 1],
          opacity: [0, 1],
          translateY: [50, 0],
          duration: 2000,
          easing: 'easeOutCubic'
        })
        .add({
          targets: '.company-name',
          translateY: [40, 0],
          opacity: [0, 1],
          duration: 1800,
          easing: 'easeOutCubic'
        }, '-=1200')
        .add({
          targets: '.scroll-indicator',
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 1200,
          easing: 'easeOutCubic'
        }, '-=800')
    },
    
    triggerAnimation() {
      if (this.isAnimating) return
      this.isAnimating = true
      
      // 简单的金属光泽效果
      anime({
        targets: this.$refs.mPath,
        scale: [1, 1.05, 1],
        duration: 1200,
        easing: 'easeInOutSine',
        complete: () => {
          this.isAnimating = false
        }
      })
    }
  }
}
</script>

<style scoped>
.fluid-logo-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #000000;
}

.logo-main {
  z-index: 10;
  width: 100%;
  max-width: 600px;
}

.logo-content {
  width: 100%;
}

.logo-svg {
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.8)) drop-shadow(0 4px 8px rgba(255, 255, 255, 0.1));
  transition: all 0.3s ease;
}

.logo-svg:hover {
  filter: drop-shadow(0 12px 30px rgba(0, 0, 0, 0.9)) drop-shadow(0 6px 12px rgba(255, 255, 255, 0.15));
  transform: translateY(-2px);
}

.m-letter {
  transition: all 0.3s ease;
}

.company-name {
  width: 100%;
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, #666, transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
  50% { opacity: 1; transform: scaleY(1.2); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .logo-svg {
    width: 200px;
    height: 180px;
  }
  
  .company-name h1 {
    font-size: 2.5rem;
  }
  
  .company-name h2 {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .logo-svg {
    width: 160px;
    height: 140px;
  }
  
  .company-name h1 {
    font-size: 2rem;
  }
  
  .company-name h2 {
    font-size: 1rem;
  }
}
</style> 