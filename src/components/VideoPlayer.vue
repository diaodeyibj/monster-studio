<template>
  <div class="video-player-container">
    <!-- 播放器模态框 -->
    <div 
      v-if="isVisible" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      @click="closePlayer"
    >
      <div class="relative max-w-6xl mx-auto p-4" @click.stop>
        <!-- 关闭按钮 -->
        <button 
          @click="closePlayer"
          class="absolute -top-12 right-0 text-white/60 hover:text-white text-2xl transition-colors z-10"
        >
          ✕
        </button>
        
        <!-- 视频容器 -->
        <div class="relative bg-black rounded-lg overflow-hidden shadow-2xl">
          <video 
            ref="videoElement"
            :src="videoSrc"
            :poster="posterSrc"
            controls
            preload="metadata"
            class="w-full h-auto max-h-[80vh] object-contain"
            @loadedmetadata="onVideoLoaded"
            @loadstart="onVideoLoadStart"
            @error="onVideoError"
            @canplay="onVideoCanPlay"
          >
            您的浏览器不支持视频播放。
          </video>
          
          <!-- 加载状态 -->
          <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black/50">
            <div class="text-center text-white">
              <div class="loading-spinner mb-4"></div>
              <p class="text-sm">加载视频中...</p>
              <p class="text-xs text-gray-400 mt-2">{{ videoSrc }}</p>
            </div>
          </div>
          
          <!-- 错误状态 -->
          <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
            <div class="text-center p-6">
              <p class="text-lg mb-2">视频加载失败</p>
              <p class="text-sm text-gray-400 mb-4">{{ error }}</p>
              <div class="text-xs text-gray-500 space-y-1">
                <p>视频路径: {{ videoSrc }}</p>
                <p>建议检查:</p>
                <ul class="list-disc list-inside space-y-1 text-left mt-2">
                  <li>文件是否存在于服务器上</li>
                  <li>视频格式是否为MP4/WebM等浏览器支持的格式</li>
                  <li>网络连接是否正常</li>
                  <li>服务器是否正在运行 (http://localhost:3001)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 视频信息 -->
        <div v-if="videoInfo" class="mt-4 text-center text-white">
          <h3 class="text-xl font-light mb-2">{{ videoInfo.title }}</h3>
          <p class="text-gray-400 text-sm">{{ videoInfo.description }}</p>
          <div class="flex justify-center items-center mt-2 space-x-4 text-xs text-gray-500">
            <span>{{ videoInfo.category }}</span>
            <span>•</span>
            <span>{{ videoInfo.year }}</span>
            <span v-if="videoInfo.duration">•</span>
            <span v-if="videoInfo.duration">{{ videoInfo.duration }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    videoSrc: {
      type: String,
      required: true
    },
    posterSrc: {
      type: String,
      default: ''
    },
    videoInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: true,
      error: null
    }
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.loading = true
        this.error = null
        // 禁止页面滚动
        document.body.style.overflow = 'hidden'
      } else {
        // 恢复页面滚动
        document.body.style.overflow = ''
        // 暂停视频
        if (this.$refs.videoElement) {
          this.$refs.videoElement.pause()
          this.$refs.videoElement.currentTime = 0
        }
      }
    }
  },
  methods: {
    closePlayer() {
      this.$emit('close')
    },
    onVideoLoaded() {
      this.loading = false
      this.error = null
    },
    onVideoLoadStart() {
      this.loading = true
      this.error = null
    },
    onVideoError(event) {
      this.loading = false
      this.error = '视频文件无法加载，请检查文件路径或网络连接'
      console.error('Video loading error:', event)
    },
    onVideoCanPlay() {
      this.loading = false
      this.error = null
    }
  },
  beforeUnmount() {
    // 组件销毁时恢复页面滚动
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
.video-player-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 自定义视频控件样式 */
video::-webkit-media-controls-panel {
  background-color: rgba(0, 0, 0, 0.8);
}

video::-webkit-media-controls-play-button,
video::-webkit-media-controls-pause-button {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .video-player-container .relative.max-w-6xl {
    max-width: 95vw;
    padding: 1rem;
  }
  
  video {
    max-height: 70vh;
  }
}
</style> 