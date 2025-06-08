<template>
  <div class="team-container">
    <!-- 导航 -->
    <Navigation />
    
    <!-- 页面标题 -->
    <section class="hero-section">
      <div class="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 class="text-4xl md:text-6xl font-light text-white mb-8 tracking-wide">
          {{ pageTitle }}
        </h1>
        <div class="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-32 mx-auto mb-8"></div>
        <p class="text-lg text-gray-300 max-w-2xl mx-auto">
          {{ config.teamDescription || '每一个团队成员都是我们的力量来源，他们用专业技能和无限创意，为每个项目注入生命力。' }}
        </p>
      </div>
    </section>
    
    <!-- 团队成员照片墙 -->
    <section class="team-grid-section">
      <div class="max-w-7xl mx-auto px-6 pb-20">
        <div class="team-masonry-grid">
          <div
            v-for="(member, index) in teamMembers"
            :key="member.id"
            @click="openMemberDetail(member)"
            :class="[
              'team-member-card cursor-pointer group',
              getMemberCardClass(index)
            ]"
          >
            <div class="member-photo-container">
              <img 
                :src="member.avatar || '/assets/team/placeholder-avatar.jpg'"
                :alt="member.name"
                class="member-photo"
                @error="handleImageError"
              />
              <div class="member-overlay">
                <div class="member-info-preview">
                  <h3 class="member-name">{{ member.name }}</h3>
                  <p class="member-position">{{ member.position }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 成员详情模态框 -->
    <div 
      v-if="selectedMember" 
      class="member-detail-modal fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      @click="closeMemberDetail"
    >
      <div class="member-detail-card" @click.stop>
        <!-- 关闭按钮 -->
        <button 
          @click="closeMemberDetail"
          class="absolute -top-12 right-0 text-white/60 hover:text-white text-2xl transition-colors"
        >
          ✕
        </button>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- 成员照片 -->
          <div class="member-detail-photo">
            <img 
              :src="selectedMember.avatar || '/assets/team/placeholder-avatar.jpg'"
              :alt="selectedMember.name"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          <!-- 成员信息 -->
          <div class="member-detail-info">
            <h2 class="text-3xl font-light text-white mb-2">{{ selectedMember.name }}</h2>
            <p class="text-lg text-gray-300 mb-6">{{ selectedMember.position }}</p>
            
            <div class="member-details space-y-4">
              <div v-if="selectedMember.experience">
                <h4 class="text-sm text-gray-400 mb-1">工作经验</h4>
                <p class="text-white">{{ selectedMember.experience }}</p>
              </div>
              
              <div v-if="selectedMember.specialty">
                <h4 class="text-sm text-gray-400 mb-1">专业领域</h4>
                <p class="text-white">{{ selectedMember.specialty }}</p>
              </div>
              
              <div v-if="selectedMember.education">
                <h4 class="text-sm text-gray-400 mb-1">教育背景</h4>
                <p class="text-white">{{ selectedMember.education }}</p>
              </div>
              
              <div v-if="selectedMember.bio">
                <h4 class="text-sm text-gray-400 mb-1">个人简介</h4>
                <p class="text-white leading-relaxed">{{ selectedMember.bio }}</p>
              </div>
              
              <div v-if="selectedMember.skills && selectedMember.skills.length">
                <h4 class="text-sm text-gray-400 mb-2">技能标签</h4>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="skill in selectedMember.skills"
                    :key="skill"
                    class="px-2 py-1 bg-white/10 text-white text-xs rounded-full"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
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
  name: 'Team',
  components: {
    Navigation
  },
  data() {
    return {
      selectedMember: null,
      config: configService.getConfig(),
      pageTitle: ''
    }
  },
  computed: {
    teamMembers() {
      return this.config.team || []
    },
    pageTitle() {
      // 从导航配置中获取对应路由的标题
      const currentNav = this.config.navigation?.find(nav => nav.path === '/team')
      return currentNav?.title || '力量来源'
    }
  },
  mounted() {
    // 监听配置变化
    configService.onConfigChange((newConfig) => {
      this.config = newConfig
    })
  },
  methods: {
    openMemberDetail(member) {
      this.selectedMember = member
      document.body.style.overflow = 'hidden'
    },
    
    closeMemberDetail() {
      this.selectedMember = null
      document.body.style.overflow = ''
    },
    
    handleImageError(event) {
      event.target.src = '/assets/team/placeholder-avatar.jpg'
    },
    
    getMemberCardClass(index) {
      // 创建瀑布流效果：不同行显示不同数量和尺寸的图片
      const patterns = [
        ['large', 'medium', 'medium'],      // 第一行：1大2中
        ['medium', 'medium'],               // 第二行：2中
        ['medium', 'large', 'small'],       // 第三行：1中1大1小
        ['small', 'medium', 'medium'],      // 第四行：1小2中
        ['large', 'small'],                 // 第五行：1大1小
        ['medium', 'medium', 'medium']      // 第六行：3中
      ]
      
      let totalIndex = 0
      for (let rowIndex = 0; rowIndex < patterns.length; rowIndex++) {
        const row = patterns[rowIndex]
        if (totalIndex <= index && index < totalIndex + row.length) {
          const positionInRow = index - totalIndex
          return `${row[positionInRow]} row-${rowIndex + 1} pos-${positionInRow + 1}`
        }
        totalIndex += row.length
      }
      
      // 如果超出预定义模式，使用循环模式
      const cycleIndex = index % 6
      return ['medium', 'large', 'small', 'medium', 'large', 'medium'][cycleIndex]
    }
  },
  beforeUnmount() {
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
.team-container {
  min-height: 100vh;
  background: #000;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding-top: 80px;
}

.hero-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.team-grid-section {
  padding: 60px 0;
}

.team-masonry-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  grid-auto-rows: minmax(200px, auto);
}

.team-member-card {
  transition: transform 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

/* 不同尺寸的卡片 */
.team-member-card.large {
  grid-column: span 6;
  grid-row: span 2;
}

.team-member-card.medium {
  grid-column: span 4;
  grid-row: span 1;
}

.team-member-card.small {
  grid-column: span 2;
  grid-row: span 1;
}

.team-member-card:hover {
  transform: translateY(-8px);
}

.member-photo-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #1a1a1a;
}

.member-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.team-member-card:hover .member-photo {
  transform: scale(1.05);
}

.member-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 40px 20px 20px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.team-member-card:hover .member-overlay {
  transform: translateY(0);
}

.member-info-preview {
  color: white;
  text-align: center;
}

.member-name {
  font-size: 1.25rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
}

.member-position {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.member-detail-modal {
  padding: 2rem;
}

.member-detail-card {
  max-width: 900px;
  width: 100%;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.member-detail-photo {
  aspect-ratio: 3/4;
  border-radius: 8px;
  overflow: hidden;
  background: #2a2a2a;
}

.member-detail-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .team-container {
    padding-top: 60px;
  }
  
  .hero-section .max-w-7xl {
    padding: 60px 24px;
  }
  
  .team-masonry-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .member-detail-modal {
    padding: 1rem;
  }
  
  .member-detail-card {
    padding: 1.5rem;
  }
  
  .member-detail-card .grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .member-detail-photo {
    aspect-ratio: 16/9;
  }
}

@media (max-width: 480px) {
  .hero-section h1 {
    font-size: 2.5rem;
  }
  
  .team-masonry-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

/* 滚动条样式 */
.member-detail-card::-webkit-scrollbar {
  width: 6px;
}

.member-detail-card::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.member-detail-card::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.member-detail-card::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style> 