<template>
  <div class="film-logo-container relative flex items-center justify-center h-screen">
    <!-- 背景粒子效果 -->
    <div class="absolute inset-0 overflow-hidden">
      <div 
        v-for="i in 50" 
        :key="i" 
        class="particle absolute w-1 h-1 bg-film-gold rounded-full"
        :style="getParticleStyle(i)"
      ></div>
    </div>
    
    <!-- 主Logo容器 -->
    <div 
      ref="logoContainer"
      class="logo-main relative cursor-pointer select-none"
      @click="triggerAnimation"
      @touchstart="handleTouch"
      @mousemove="handleMouseMove"
    >
      <!-- 胶片穿孔背景 -->
      <div class="film-background absolute inset-0 film-perforation opacity-30"></div>
      
      <!-- M字母主体 -->
      <svg 
        ref="logoSvg"
        width="300" 
        height="200" 
        viewBox="0 0 300 200" 
        class="logo-svg relative z-10"
      >
        <!-- 胶片条纹 -->
        <defs>
          <linearGradient id="filmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
            <stop offset="25%" style="stop-color:#FFA500;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#FF6B6B;stop-opacity:1" />
            <stop offset="75%" style="stop-color:#4ECDC4;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FFD700;stop-opacity:1" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- M字母路径 - 左侧 -->
        <path 
          ref="mLeft"
          d="M 40 180 L 40 40 L 80 100 L 120 40 L 120 180"
          stroke="url(#filmGradient)"
          stroke-width="8"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          filter="url(#glow)"
          class="m-path-left"
        />
        
        <!-- M字母路径 - 右侧 -->
        <path 
          ref="mRight"
          d="M 180 180 L 180 40 L 220 100 L 260 40 L 260 180"
          stroke="url(#filmGradient)"
          stroke-width="8"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          filter="url(#glow)"
          class="m-path-right"
        />
        
        <!-- 胶片孔 -->
        <g ref="filmHoles">
          <circle cx="20" cy="50" r="3" fill="#FFD700" opacity="0.7"/>
          <circle cx="20" cy="80" r="3" fill="#FFD700" opacity="0.7"/>
          <circle cx="20" cy="110" r="3" fill="#FFD700" opacity="0.7"/>
          <circle cx="20" cy="140" r="3" fill="#FFD700" opacity="0.7"/>
          <circle cx="280" cy="50" r="3" fill="#FFD700" opacity="0.7"/>
          <circle cx="280" cy="80" r="3" fill="#FFD700" opacity="0.7"/>
          <circle cx="280" cy="110" r="3" fill="#FFD700" opacity="0.7"/>
          <circle cx="280" cy="140" r="3" fill="#FFD700" opacity="0.7"/>
        </g>
      </svg>
      
      <!-- 公司名称 -->
      <div class="company-name mt-8 text-center">
        <h1 class="cinematic-font text-4xl md:text-6xl font-bold gradient-text mb-2">
          {{ companyData.nameEn }}
        </h1>
        <h2 class="text-xl md:text-2xl text-gray-300 mb-4">
          {{ companyData.name }}
        </h2>
        <p class="text-sm md:text-base text-gray-400 max-w-md mx-auto">
          {{ companyData.tagline }}
        </p>
      </div>
    </div>
    
    <!-- 交互提示 -->
    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
      <p class="text-gray-500 text-sm animate-pulse">
        点击或拖拽Logo体验交互效果
      </p>
    </div>
  </div>
</template>

<script>
import anime from 'animejs'

export default {
  name: 'FilmLogo',
  props: {
    companyData: {
      type: Object,
      default: () => ({
        name: '怪兽工场',
        nameEn: 'Monster Studio',
        tagline: '创造视觉奇迹，讲述非凡故事'
      })
    }
  },
  data() {
    return {
      isAnimating: false,
      mousePos: { x: 0, y: 0 },
      particles: []
    }
  },
  mounted() {
    this.initAnimation()
    this.animateParticles()
  },
  methods: {
    initAnimation() {
      // 初始化Logo动画
      anime({
        targets: this.$refs.logoSvg,
        scale: [0, 1],
        rotate: [180, 0],
        opacity: [0, 1],
        duration: 2000,
        easing: 'easeOutElastic(1, .8)',
        delay: 500
      })
      
      // 路径绘制动画
      const pathsLeft = this.$refs.mLeft
      const pathsRight = this.$refs.mRight
      
      if (pathsLeft && pathsRight) {
        const pathLengthLeft = pathsLeft.getTotalLength()
        const pathLengthRight = pathsRight.getTotalLength()
        
        // 设置初始状态
        pathsLeft.style.strokeDasharray = pathLengthLeft
        pathsLeft.style.strokeDashoffset = pathLengthLeft
        pathsRight.style.strokeDasharray = pathLengthRight
        pathsRight.style.strokeDashoffset = pathLengthRight
        
        // 绘制动画
        anime({
          targets: [pathsLeft, pathsRight],
          strokeDashoffset: [
            { value: 0, duration: 2000 }
          ],
          delay: anime.stagger(300, { start: 1000 }),
          easing: 'easeInOutQuart'
        })
      }
      
      // 胶片孔动画
      anime({
        targets: this.$refs.filmHoles.children,
        scale: [0, 1],
        opacity: [0, 0.7],
        delay: anime.stagger(100, { start: 2000 }),
        duration: 500,
        easing: 'easeOutBounce'
      })
    },
    
    triggerAnimation() {
      if (this.isAnimating) return
      this.isAnimating = true
      
      // 3D旋转效果
      anime({
        targets: this.$refs.logoContainer,
        rotateY: [0, 360],
        rotateX: [0, 15, 0],
        scale: [1, 1.1, 1],
        duration: 1500,
        easing: 'easeInOutCubic',
        complete: () => {
          this.isAnimating = false
        }
      })
      
      // 胶片卷动效果
      anime({
        targets: this.$refs.logoSvg,
        rotateZ: [0, 10, -10, 0],
        duration: 1500,
        easing: 'easeInOutSine'
      })
      
      // 渐变色动画
      anime({
        targets: '.gradient-text',
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        duration: 1500,
        easing: 'easeInOutQuad'
      })
    },
    
    handleMouseMove(event) {
      const rect = this.$refs.logoContainer.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (event.clientX - centerX) / rect.width
      const deltaY = (event.clientY - centerY) / rect.height
      
      // 鼠标跟随效果
      anime({
        targets: this.$refs.logoSvg,
        rotateY: deltaX * 15,
        rotateX: -deltaY * 15,
        duration: 300,
        easing: 'easeOutQuad'
      })
    },
    
    handleTouch(event) {
      event.preventDefault()
      this.triggerAnimation()
    },
    
    getParticleStyle(index) {
      const x = Math.random() * 100
      const y = Math.random() * 100
      const delay = Math.random() * 2000
      const duration = 3000 + Math.random() * 2000
      
      return {
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`
      }
    },
    
    animateParticles() {
      // 粒子浮动动画
      anime({
        targets: '.particle',
        translateY: [
          { value: -20, duration: 1000 },
          { value: 20, duration: 1000 }
        ],
        translateX: [
          { value: -10, duration: 2000 },
          { value: 10, duration: 2000 }
        ],
        opacity: [
          { value: 0.8, duration: 1000 },
          { value: 0.2, duration: 1000 }
        ],
        scale: [
          { value: 1.2, duration: 1500 },
          { value: 0.8, duration: 1500 }
        ],
        loop: true,
        direction: 'alternate',
        delay: anime.stagger(50),
        easing: 'easeInOutSine'
      })
    }
  }
}
</script>

<style scoped>
.film-logo-container {
  background: 
    radial-gradient(circle at 30% 70%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #000 0%, #1a1a1a 100%);
  perspective: 1000px;
}

.logo-main {
  transform-style: preserve-3d;
  transition: all 0.3s ease;
}

.logo-svg {
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.3));
}

.m-path-left,
.m-path-right {
  transition: all 0.3s ease;
}

.company-name h1 {
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
}

.particle {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .logo-svg {
    width: 250px;
    height: 167px;
  }
  
  .company-name h1 {
    font-size: 2.5rem;
  }
  
  .company-name h2 {
    font-size: 1.25rem;
  }
}
</style> 