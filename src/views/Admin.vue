<template>
  <div class="min-h-screen bg-black text-white">
    <!-- 登录界面 -->
    <LoginForm 
      v-if="!isAuthenticated" 
      @login-success="handleLoginSuccess"
    />
    
    <!-- 管理界面 -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- 头部 -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold">怪兽工场后台管理</h1>
          <p class="text-gray-400 mt-2">Monster Studio Admin Panel</p>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- 用户信息和操作 -->
          <div class="flex items-center space-x-2 text-sm text-gray-400">
            <span>👤 管理员</span>
            <span>|</span>
            <button 
              @click="showPasswordModal = true"
              class="text-blue-400 hover:text-blue-300 transition-colors"
            >
              修改密码
            </button>
            <span>|</span>
            <button 
              @click="handleLogout"
              class="text-red-400 hover:text-red-300 transition-colors"
            >
              退出登录
            </button>
          </div>
          
          <!-- 保存状态 -->
          <div class="flex items-center space-x-4">
            <div v-if="hasChanges" class="text-yellow-400 text-sm">
              ⚠️ 有未保存的更改
            </div>
            <button
              @click="saveConfig"
              :disabled="saving || !hasChanges"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 
                     disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {{ saving ? '保存中...' : '保存配置' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 导航 -->
      <Navigation />
      
      <!-- 头部 -->
      <header class="admin-header">
        <div class="max-w-7xl mx-auto px-6 py-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-light text-white mb-2">内容管理</h1>
              <p class="text-gray-400">实时编辑网站内容，修改后立即生效</p>
            </div>
            <div class="flex items-center space-x-4">
              <button 
                @click="resetToDefaults"
                class="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 transition-colors"
              >
                重置默认
              </button>
              <button 
                @click="exportConfig"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                导出配置
              </button>
              <input
                ref="fileInput"
                type="file"
                accept=".json"
                @change="handleFileImport"
                class="hidden"
              />
              <button 
                @click="$refs.fileInput.click()"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                导入配置
              </button>
            </div>
          </div>
        </div>
      </header>

      <div class="flex">
        <!-- 侧边栏 -->
        <aside class="w-64 bg-gray-900 min-h-screen border-r border-gray-700">
          <nav class="p-6">
            <div class="space-y-2">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3',
                  activeTab === tab.id 
                    ? 'bg-white text-black' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                ]"
              >
                <span class="text-lg">{{ tab.icon }}</span>
                <span>{{ tab.name }}</span>
              </button>
            </div>
          </nav>
        </aside>

        <!-- 主内容区 -->
        <main class="flex-1 p-8 overflow-y-auto max-h-screen">
          <!-- 公司信息 -->
          <div v-if="activeTab === 'company'" class="space-y-8">
            <div class="bg-gray-900 rounded-lg p-6">
              <h2 class="text-xl font-medium mb-6">基本信息</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium mb-2">公司中文名</label>
                  <input
                    v-model="config.company.name"
                    type="text"
                    class="form-input"
                    @input="markAsChanged"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">公司英文名</label>
                  <input
                    v-model="config.company.nameEn"
                    type="text"
                    class="form-input"
                    @input="markAsChanged"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">中文标语</label>
                  <input
                    v-model="config.company.tagline"
                    type="text"
                    class="form-input"
                    @input="markAsChanged"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">英文标语</label>
                  <input
                    v-model="config.company.taglineEn"
                    type="text"
                    class="form-input"
                    @input="markAsChanged"
                  />
                </div>
              </div>
              
              <div class="mt-6">
                <label class="block text-sm font-medium mb-2">公司描述</label>
                <textarea
                  v-model="config.company.description"
                  rows="4"
                  class="form-input"
                  @input="markAsChanged"
                ></textarea>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label class="block text-sm font-medium mb-2">成立年份</label>
                  <input
                    v-model="config.company.founded"
                    type="text"
                    class="form-input"
                    @input="markAsChanged"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">所在城市</label>
                  <input
                    v-model="config.company.location"
                    type="text"
                    class="form-input"
                    @input="markAsChanged"
                  />
                </div>
              </div>
            </div>

            <!-- 联系信息 -->
            <div class="bg-gray-900 rounded-lg p-6">
              <h2 class="text-xl font-medium mb-6">联系信息</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium mb-2">邮箱地址</label>
                  <input
                    v-model="config.company.contact.email"
                    type="email"
                    class="form-input"
                    @input="markAsChanged"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">联系电话</label>
                  <input
                    v-model="config.company.contact.phone"
                    type="text"
                    class="form-input"
                    @input="markAsChanged"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">微信号</label>
                  <input
                    v-model="config.company.contact.wechat"
                    type="text"
                    class="form-input"
                    @input="markAsChanged"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">公司地址</label>
                  <input
                    v-model="config.company.contact.address"
                    type="text"
                    class="form-input"
                    @input="markAsChanged"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 菜单管理 -->
          <div v-if="activeTab === 'menu'" class="space-y-8">
            <div class="bg-gray-900 rounded-lg p-6">
              <h2 class="text-xl font-medium mb-6">主导航菜单</h2>
              <div class="space-y-4">
                <div
                  v-for="(menuItem, index) in config.navigation"
                  :key="menuItem.id"
                  class="bg-gray-800 rounded-lg p-4"
                >
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-white">菜单 {{ index + 1 }}</h3>
                    <button
                      @click="removeMenuItem(index)"
                      class="text-red-400 hover:text-red-300 text-sm px-3 py-1 border border-red-400 rounded hover:bg-red-400/10 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium mb-2">菜单名称</label>
                      <input
                        v-model="menuItem.name"
                        type="text"
                        class="form-input"
                        @input="markAsChanged"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-2">路由路径</label>
                      <input
                        v-model="menuItem.path"
                        type="text"
                        class="form-input bg-gray-800 cursor-not-allowed"
                        readonly
                        title="路由路径不可修改，避免页面错误"
                        @input="markAsChanged"
                      />
                      <p class="text-xs text-gray-500 mt-1">路径不可修改，避免页面显示错误</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-2">页面标题</label>
                      <input
                        v-model="menuItem.title"
                        type="text"
                        placeholder="显示在页面顶部的标题"
                        class="form-input"
                        @input="markAsChanged"
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  @click="addMenuItem"
                  class="w-full px-4 py-3 border-2 border-dashed border-gray-600 text-gray-400 rounded-lg hover:border-gray-500 hover:text-gray-300 transition-colors"
                >
                  + 添加菜单项
                </button>
              </div>
            </div>
          </div>

          <!-- 服务项目 -->
          <div v-if="activeTab === 'services'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-medium">服务项目</h2>
              <button
                @click="addService"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加服务
              </button>
            </div>
            
            <div class="space-y-4">
              <div
                v-for="(service, index) in config.services"
                :key="service.id"
                class="bg-gray-900 rounded-lg p-6"
              >
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-lg font-medium">服务 {{ index + 1 }}</h3>
                  <button
                    @click="removeService(index)"
                    class="text-red-400 hover:text-red-300 text-sm px-3 py-1 border border-red-400 rounded hover:bg-red-400/10 transition-colors"
                  >
                    删除
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-2">服务名称</label>
                    <input
                      v-model="service.title"
                      type="text"
                      class="form-input"
                      @input="markAsChanged"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">图标 (Emoji)</label>
                    <input
                      v-model="service.icon"
                      type="text"
                      placeholder="如: 🎬"
                      class="form-input"
                      @input="markAsChanged"
                    />
                  </div>
                </div>
                
                <div class="mt-4">
                  <label class="block text-sm font-medium mb-2">服务描述</label>
                  <textarea
                    v-model="service.description"
                    rows="3"
                    class="form-input"
                    @input="markAsChanged"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- 作品管理 -->
          <div v-if="activeTab === 'projects'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-medium">作品项目</h2>
              <button
                @click="addProject"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加项目
              </button>
            </div>
            
            <div class="space-y-4">
              <div
                v-for="(project, index) in config.projects"
                :key="project.id"
                class="bg-gray-900 rounded-lg p-6"
              >
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-lg font-medium">项目 {{ index + 1 }}</h3>
                  <button
                    @click="removeProject(index)"
                    class="text-red-400 hover:text-red-300 text-sm px-3 py-1 border border-red-400 rounded hover:bg-red-400/10 transition-colors"
                  >
                    删除
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-2">项目标题</label>
                    <input
                      v-model="project.title"
                      type="text"
                      class="form-input"
                      @input="markAsChanged"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">分类</label>
                    <select
                      v-model="project.category"
                      class="form-input"
                      @change="markAsChanged"
                    >
                      <option value="movie-trailer">电影预告</option>
                      <option value="tv-trailer">电视剧预告</option>
                      <option value="mv">MV</option>
                      <option value="epk">EPK</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">年份</label>
                    <input
                      v-model="project.year"
                      type="text"
                      class="form-input"
                      @input="markAsChanged"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">时长</label>
                    <input
                      v-model="project.duration"
                      type="text"
                      placeholder="如: 2:30"
                      class="form-input"
                      @input="markAsChanged"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">封面图片路径</label>
                    <div class="upload-tips mb-3 p-3 bg-purple-900/20 border border-purple-600/30 rounded-lg">
                      <p class="text-purple-300 text-xs mb-1">🎬 视频封面建议：</p>
                      <ul class="text-purple-300 text-xs space-y-1">
                        <li>• 推荐尺寸：1920×1080像素（16:9比例）</li>
                        <li>• 最小尺寸：1280×720像素</li>
                        <li>• 文件格式：JPG、PNG</li>
                        <li>• 文件大小：不超过3MB</li>
                        <li>• 画面清晰，能够代表视频内容</li>
                      </ul>
                    </div>
                    <div class="flex items-center space-x-4">
                      <input
                        v-model="project.poster"
                        type="text"
                        placeholder="/assets/videos/poster.jpg"
                        class="form-input flex-1"
                        @input="markAsChanged"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        @change="handleImageUpload($event, project, 'poster')"
                        class="hidden"
                        :ref="`posterInput-${project.id}`"
                      />
                      <button
                        @click="$refs[`posterInput-${project.id}`][0].click()"
                        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        上传封面
                      </button>
                    </div>
                    <div v-if="project.poster" class="mt-2">
                      <img 
                        :src="project.poster" 
                        alt="封面预览" 
                        class="w-24 h-16 object-cover rounded border"
                        @error="handleImageError"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">视频文件路径</label>
                    <div class="upload-tips mb-3 p-3 bg-orange-900/20 border border-orange-600/30 rounded-lg">
                      <p class="text-orange-300 text-xs mb-1">🎥 视频文件建议：</p>
                      <ul class="text-orange-300 text-xs space-y-1">
                        <li>• 推荐格式：MP4（H.264编码）</li>
                        <li>• 分辨率：1920×1080或1280×720</li>
                        <li>• 文件大小：不超过100MB</li>
                        <li>• 帧率：24fps或30fps</li>
                        <li>• 建议长度：30秒-5分钟</li>
                      </ul>
                    </div>
                    <div class="flex items-center space-x-4">
                      <input
                        v-model="project.videoSrc"
                        type="text"
                        placeholder="/assets/videos/video.mp4"
                        class="form-input flex-1"
                        @input="markAsChanged"
                      />
                      <input
                        type="file"
                        accept="video/*"
                        @change="handleVideoUpload($event, project, 'videoSrc')"
                        class="hidden"
                        :ref="`videoInput-${project.id}`"
                      />
                      <button
                        @click="$refs[`videoInput-${project.id}`][0].click()"
                        class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        上传视频
                      </button>
                    </div>
                  </div>
                </div>
                
                <div class="mt-4">
                  <label class="block text-sm font-medium mb-2">项目描述</label>
                  <textarea
                    v-model="project.description"
                    rows="3"
                    class="form-input"
                    @input="markAsChanged"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- 团队管理 -->
          <div v-if="activeTab === 'team'" class="space-y-6">
            <!-- 团队描述 -->
            <div class="bg-gray-900 rounded-lg p-6">
              <h2 class="text-xl font-medium mb-6">团队描述</h2>
              <div>
                <label class="block text-sm font-medium mb-2">"力量来源"标题下方描述文字</label>
                <textarea
                  v-model="config.teamDescription"
                  rows="3"
                  placeholder="每一个团队成员都是我们的力量来源，他们用专业技能和无限创意，为每个项目注入生命力。"
                  class="form-input"
                  @input="markAsChanged"
                ></textarea>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-medium">团队成员</h2>
              <button
                @click="addTeamMember"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加成员
              </button>
            </div>
            
            <div class="space-y-4">
              <div
                v-for="(member, index) in config.team"
                :key="member.id"
                class="bg-gray-900 rounded-lg p-6"
              >
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-lg font-medium">成员 {{ index + 1 }}</h3>
                  <button
                    @click="removeMember(index)"
                    class="text-red-400 hover:text-red-300 text-sm px-3 py-1 border border-red-400 rounded hover:bg-red-400/10 transition-colors"
                  >
                    删除
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-2">姓名</label>
                    <input
                      v-model="member.name"
                      type="text"
                      class="form-input"
                      @input="markAsChanged"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">职位</label>
                    <input
                      v-model="member.position"
                      type="text"
                      class="form-input"
                      @input="markAsChanged"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">工作经验</label>
                    <input
                      v-model="member.experience"
                      type="text"
                      class="form-input"
                      @input="markAsChanged"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">专业领域</label>
                    <input
                      v-model="member.specialty"
                      type="text"
                      class="form-input"
                      @input="markAsChanged"
                    />
                  </div>
                  <div class="col-span-2">
                    <label class="block text-sm font-medium mb-2">头像路径</label>
                    <div class="upload-tips mb-3 p-3 bg-cyan-900/20 border border-cyan-600/30 rounded-lg">
                      <p class="text-cyan-300 text-xs mb-1">👤 头像图片建议：</p>
                      <ul class="text-cyan-300 text-xs space-y-1">
                        <li>• 推荐尺寸：400×400像素（正方形）</li>
                        <li>• 最小尺寸：200×200像素</li>
                        <li>• 文件格式：JPG、PNG</li>
                        <li>• 文件大小：不超过1MB</li>
                        <li>• 人像清晰，背景简洁</li>
                      </ul>
                    </div>
                    <div class="flex items-center space-x-4">
                      <input
                        v-model="member.avatar"
                        type="text"
                        placeholder="/assets/team/member.jpg"
                        class="form-input flex-1"
                        @input="markAsChanged"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        @change="handleImageUpload($event, member, 'avatar')"
                        class="hidden"
                        :ref="`avatarInput-${member.id}`"
                      />
                      <button
                        @click="$refs[`avatarInput-${member.id}`][0].click()"
                        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        上传头像
                      </button>
                    </div>
                    <div v-if="member.avatar" class="mt-2">
                      <img 
                        :src="member.avatar" 
                        alt="头像预览" 
                        class="w-16 h-16 object-cover rounded-full border"
                        @error="handleImageError"
                      />
                    </div>
                  </div>
                </div>
                
                <div class="mt-4">
                  <label class="block text-sm font-medium mb-2">个人简介</label>
                  <textarea
                    v-model="member.bio"
                    rows="3"
                    class="form-input"
                    @input="markAsChanged"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- 关于我们管理 -->
          <div v-if="activeTab === 'about'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-medium">关于我们内容</h2>
              <button
                @click="addAboutSection"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加内容区块
              </button>
            </div>
            
            <!-- 关于我们内容区块 -->
            <div class="space-y-4">
              <div
                v-for="(section, index) in config.aboutSections"
                :key="section.id"
                class="bg-gray-900 rounded-lg p-6"
              >
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-lg font-medium">内容区块 {{ index + 1 }}</h3>
                  <button
                    @click="removeAboutSection(index)"
                    class="text-red-400 hover:text-red-300 text-sm px-3 py-1 border border-red-400 rounded hover:bg-red-400/10 transition-colors"
                  >
                    删除
                  </button>
                </div>
                
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-2">标题</label>
                    <input
                      v-model="section.title"
                      type="text"
                      class="form-input"
                      @input="markAsChanged"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium mb-2">内容</label>
                    <textarea
                      v-model="section.content"
                      rows="4"
                      class="form-input"
                      @input="markAsChanged"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium mb-2">配图</label>
                    <div class="upload-tips mb-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                      <p class="text-yellow-300 text-xs mb-1">📷 上传建议：</p>
                      <ul class="text-yellow-300 text-xs space-y-1">
                        <li>• 推荐尺寸：800×600像素（4:3比例）</li>
                        <li>• 文件格式：JPG、PNG</li>
                        <li>• 文件大小：不超过2MB</li>
                      </ul>
                    </div>
                    <div class="flex items-center space-x-4">
                      <input
                        v-model="section.image"
                        type="text"
                        placeholder="/assets/about-image.jpg"
                        class="form-input flex-1"
                        @input="markAsChanged"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        @change="handleImageUpload($event, section, 'image')"
                        class="hidden"
                        :ref="`imageInput-${section.id}`"
                      />
                      <button
                        @click="$refs[`imageInput-${section.id}`][0].click()"
                        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        上传图片
                      </button>
                    </div>
                    <div v-if="section.image" class="mt-2">
                      <img 
                        :src="section.image" 
                        alt="预览" 
                        class="w-24 h-16 object-cover rounded border"
                        @error="handleImageError"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 下半部分图片上传 -->
            <div class="bg-gray-900 rounded-lg p-6">
              <h2 class="text-xl font-medium mb-6">下半部分图片</h2>
              <div class="space-y-6">
                <!-- PC端图片 -->
                <div>
                  <label class="block text-sm font-medium mb-2">PC端图片</label>
                  <div class="upload-tips mb-3 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                    <p class="text-blue-300 text-xs mb-1">🖥️ PC端图片建议：</p>
                    <ul class="text-blue-300 text-xs space-y-1">
                      <li>• 推荐尺寸：1920×600像素（横屏宽屏比例）</li>
                      <li>• 最小尺寸：1200×400像素</li>
                      <li>• 文件格式：JPG、PNG、WebP</li>
                      <li>• 文件大小：不超过5MB</li>
                      <li>• 适合详细信息展示，文字清晰度高</li>
                    </ul>
                  </div>
                  <div class="flex items-center space-x-4">
                    <input
                      v-model="config.aboutBottomImage"
                      type="text"
                      placeholder="/assets/about-bottom-pc.jpg"
                      class="form-input flex-1"
                      @input="markAsChanged"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      @change="handleBottomImageUpload($event, 'desktop')"
                      class="hidden"
                      ref="bottomImageDesktop"
                    />
                    <button
                      @click="$refs.bottomImageDesktop.click()"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      上传PC图片
                    </button>
                  </div>
                  <div v-if="config.aboutBottomImage" class="mt-3">
                    <img 
                      :src="config.aboutBottomImage" 
                      alt="PC端预览" 
                      class="w-full max-w-md h-32 object-cover rounded border"
                      @error="handleImageError"
                    />
                    <p class="text-xs text-gray-400 mt-1">PC端预览</p>
                  </div>
                </div>

                <!-- 移动端图片 -->
                <div>
                  <label class="block text-sm font-medium mb-2">移动端图片</label>
                  <div class="upload-tips mb-3 p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
                    <p class="text-green-300 text-xs mb-1">📱 移动端图片建议：</p>
                    <ul class="text-green-300 text-xs space-y-1">
                      <li>• 推荐尺寸：750×1000像素（竖屏比例3:4）</li>
                      <li>• 最小尺寸：375×500像素</li>
                      <li>• 文件格式：JPG、PNG、WebP</li>
                      <li>• 文件大小：不超过3MB</li>
                      <li>• 字体较大，便于手机阅读</li>
                    </ul>
                  </div>
                  <div class="flex items-center space-x-4">
                    <input
                      v-model="config.aboutBottomImageMobile"
                      type="text"
                      placeholder="/assets/about-bottom-mobile.jpg"
                      class="form-input flex-1"
                      @input="markAsChanged"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      @change="handleBottomImageUpload($event, 'mobile')"
                      class="hidden"
                      ref="bottomImageMobile"
                    />
                    <button
                      @click="$refs.bottomImageMobile.click()"
                      class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      上传移动图片
                    </button>
                  </div>
                  <div v-if="config.aboutBottomImageMobile" class="mt-3">
                    <img 
                      :src="config.aboutBottomImageMobile" 
                      alt="移动端预览" 
                      class="w-32 h-40 object-cover rounded border"
                      @error="handleImageError"
                    />
                    <p class="text-xs text-gray-400 mt-1">移动端预览</p>
                  </div>
                </div>
                
                <!-- 使用提示 -->
                <div class="upload-tips p-4 bg-gray-800 border border-gray-600 rounded-lg">
                  <p class="text-gray-300 text-sm mb-2">💡 使用提示：</p>
                  <ul class="text-gray-400 text-sm space-y-1">
                    <li>• 如果只上传PC端图片，移动端会自动适应显示</li>
                    <li>• 建议同时上传两张图片以获得最佳显示效果</li>
                    <li>• 图片内容可以是：公司介绍、核心价值观、荣誉成就等</li>
                    <li>• 支持带文字的设计图片，也可以是纯图像内容</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 文件管理 -->
          <div v-if="activeTab === 'files'" class="space-y-6">
            <!-- 头部统计和操作 -->
            <div class="bg-gray-900 rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-medium">文件管理</h2>
                <div class="flex items-center space-x-4">
                  <button
                    @click="refreshFiles"
                    :disabled="loadingFiles"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {{ loadingFiles ? '加载中...' : '刷新列表' }}
                  </button>
                  <button
                    v-if="selectedFiles.length > 0"
                    @click="batchDeleteFiles"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    删除选中 ({{ selectedFiles.length }})
                  </button>
                </div>
              </div>
              
              <!-- 统计信息 -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-gray-800 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-blue-400">{{ fileStats.total }}</div>
                  <div class="text-sm text-gray-400">文件总数</div>
                </div>
                <div class="bg-gray-800 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-green-400">{{ formatFileSize(fileStats.totalSize) }}</div>
                  <div class="text-sm text-gray-400">总大小</div>
                </div>
                <div class="bg-gray-800 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-purple-400">{{ selectedFiles.length }}</div>
                  <div class="text-sm text-gray-400">已选择</div>
                </div>
              </div>
            </div>

            <!-- 文件列表 -->
            <div class="bg-gray-900 rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium">上传文件列表</h3>
                <div class="flex items-center space-x-4">
                  <label class="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      :checked="files.length > 0 && selectedFiles.length === files.length"
                      @change="toggleSelectAll"
                      class="rounded border-gray-600 bg-gray-800 text-blue-600"
                    />
                    <span>全选</span>
                  </label>
                  <select
                    v-model="fileFilter"
                    @change="filterFiles"
                    class="form-input w-auto"
                  >
                    <option value="all">所有文件</option>
                    <option value="images">图片文件</option>
                    <option value="videos">视频文件</option>
                  </select>
                </div>
              </div>

              <!-- 加载状态 -->
              <div v-if="loadingFiles" class="text-center py-8">
                <div class="loading-spinner mx-auto mb-4"></div>
                <p class="text-gray-400">加载文件列表中...</p>
              </div>

              <!-- 文件表格 -->
              <div v-else-if="filteredFiles.length > 0" class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-gray-700">
                      <th class="text-left py-3 px-2">选择</th>
                      <th class="text-left py-3 px-2">预览</th>
                      <th class="text-left py-3 px-2">文件名</th>
                      <th class="text-left py-3 px-2">类型</th>
                      <th class="text-left py-3 px-2">大小</th>
                      <th class="text-left py-3 px-2">上传时间</th>
                      <th class="text-left py-3 px-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="file in filteredFiles"
                      :key="file.path"
                      class="border-b border-gray-800 hover:bg-gray-800/50"
                    >
                      <td class="py-3 px-2">
                        <input
                          type="checkbox"
                          :value="file.path"
                          v-model="selectedFiles"
                          class="rounded border-gray-600 bg-gray-800 text-blue-600"
                        />
                      </td>
                      <td class="py-3 px-2">
                        <div class="w-12 h-12 bg-gray-800 rounded overflow-hidden">
                          <img
                            v-if="isImageFile(file.type)"
                            :src="file.url"
                            :alt="file.name"
                            class="w-full h-full object-cover"
                            @error="handleFilePreviewError"
                          />
                          <div
                            v-else
                            class="w-full h-full flex items-center justify-center text-gray-400 text-xs"
                          >
                            {{ getFileIcon(file.type) }}
                          </div>
                        </div>
                      </td>
                      <td class="py-3 px-2">
                        <div class="max-w-48 truncate" :title="file.name">{{ file.name }}</div>
                        <div class="text-xs text-gray-500 truncate" :title="file.path">{{ file.path }}</div>
                      </td>
                      <td class="py-3 px-2">
                        <span class="px-2 py-1 bg-gray-700 rounded text-xs">{{ file.type.toUpperCase() }}</span>
                      </td>
                      <td class="py-3 px-2 text-gray-400">{{ formatFileSize(file.size) }}</td>
                      <td class="py-3 px-2 text-gray-400">{{ formatDate(file.modified) }}</td>
                      <td class="py-3 px-2">
                        <div class="flex items-center space-x-2">
                          <button
                            @click="previewFile(file)"
                            class="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 border border-blue-400 rounded hover:bg-blue-400/10 transition-colors"
                          >
                            预览
                          </button>
                          <button
                            @click="deleteFile(file.path)"
                            class="text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-400 rounded hover:bg-red-400/10 transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 空状态 -->
              <div v-else class="text-center py-12">
                <div class="text-gray-400 text-lg mb-2">📁</div>
                <p class="text-gray-400">{{ fileFilter === 'all' ? '暂无上传文件' : '暂无此类型文件' }}</p>
                <p class="text-gray-500 text-sm mt-2">通过其他标签页上传图片或视频后，会在这里显示</p>
              </div>
            </div>

            <!-- 文件清理建议 -->
            <div class="bg-gray-900 rounded-lg p-6">
              <h3 class="text-lg font-medium mb-4">文件管理建议</h3>
              <div class="space-y-3 text-sm text-gray-300">
                <div class="flex items-start space-x-2">
                  <span class="text-yellow-400">⚠️</span>
                  <p>定期清理未使用的文件可以节省服务器存储空间</p>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-blue-400">💡</span>
                  <p>删除文件前请确认该文件不再被网站使用，否则可能导致图片或视频无法显示</p>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-green-400">✅</span>
                  <p>建议保留近期上传的文件，删除时间较久且确认不再使用的文件</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 系统管理 -->
          <div v-if="activeTab === 'system'" class="space-y-8">
            <!-- 密码管理 -->
            <div class="bg-gray-900 rounded-lg p-6">
              <h2 class="text-xl font-medium mb-6">密码管理</h2>
              <div class="max-w-md">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium mb-2">当前密码</label>
                    <input
                      v-model="passwordForm.currentPassword"
                      type="password"
                      placeholder="请输入当前密码"
                      class="form-input"
                      :disabled="passwordLoading"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium mb-2">新密码</label>
                    <input
                      v-model="passwordForm.newPassword"
                      type="password"
                      placeholder="请输入新密码（至少6位）"
                      class="form-input"
                      :disabled="passwordLoading"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium mb-2">确认新密码</label>
                    <input
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      placeholder="请再次输入新密码"
                      class="form-input"
                      :disabled="passwordLoading"
                    />
                  </div>
                  
                  <div class="flex space-x-4">
                    <button
                      @click="changePassword"
                      :disabled="passwordLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      {{ passwordLoading ? '修改中...' : '修改密码' }}
                    </button>
                    
                    <button
                      @click="resetPasswordForm"
                      :disabled="passwordLoading"
                      class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:cursor-not-allowed"
                    >
                      重置表单
                    </button>
                  </div>
                </div>
                
                <!-- 密码强度提示 -->
                <div class="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                  <p class="text-yellow-300 text-sm mb-2">
                    <strong>🔒 密码安全建议：</strong>
                  </p>
                  <ul class="text-yellow-300 text-sm space-y-1">
                    <li>• 至少包含6个字符</li>
                    <li>• 建议包含字母、数字和特殊字符</li>
                    <li>• 避免使用过于简单的密码</li>
                    <li>• 定期更换密码以确保安全</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <!-- 系统设置 -->
            <div class="bg-gray-900 rounded-lg p-6">
              <h2 class="text-xl font-medium mb-6">系统设置</h2>
              
              <div class="space-y-4">
                <div class="p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                    <p class="text-green-400 font-medium">系统运行状态：正常</p>
                  </div>
                  <p class="text-sm text-gray-400 mt-1">后台管理系统运行正常，所有功能可用</p>
                </div>
                
                <div class="p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                  <h3 class="text-lg font-medium mb-3">配置管理</h3>
                  <div class="flex flex-wrap gap-3">
                    <button 
                      @click="exportConfig" 
                      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      导出配置
                    </button>
                    <label class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors cursor-pointer">
                      导入配置
                      <input type="file" accept=".json" @change="handleFileImport" class="hidden" />
                    </label>
                    <button 
                      @click="resetToDefaults" 
                      class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                    >
                      恢复默认设置
                    </button>
                  </div>
                  <p class="text-sm text-gray-400 mt-2">
                    导出：备份当前配置到本地文件 | 导入：从本地文件恢复配置 | 恢复：重置为系统默认配置
                  </p>
                </div>
                
                <div class="p-4 bg-purple-900/20 border border-purple-600/30 rounded-lg">
                  <h3 class="text-lg font-medium mb-2">系统信息</h3>
                  <div class="text-sm text-gray-400 space-y-1">
                    <p>版本：Monster Studio v1.0</p>
                    <p>更新时间：{{ new Date().toLocaleString() }}</p>
                    <p>管理员：Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- 状态提示 -->
    <div 
      v-if="message"
      :class="[
        'fixed bottom-6 right-6 px-6 py-3 rounded-lg text-white shadow-lg transition-all duration-300 z-50',
        message.type === 'success' ? 'bg-green-600' : 'bg-red-600'
      ]"
    >
      {{ message.text }}
    </div>
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue'
import LoginForm from '../components/LoginForm.vue'
import configService from '../services/configService.js'

export default {
  name: 'Admin',
  components: {
    Navigation,
    LoginForm
  },
  data() {
    return {
      isAuthenticated: false,
      showPasswordModal: false,
      activeTab: 'company',
      saving: false,
      hasChanges: false,
      message: null,
      tabs: [
        { id: 'company', name: '公司信息', icon: '🏢' },
        { id: 'menu', name: '菜单管理', icon: '📋' },
        { id: 'services', name: '服务项目', icon: '⚙️' },
        { id: 'projects', name: '作品管理', icon: '🎬' },
        { id: 'team', name: '团队成员', icon: '👥' },
        { id: 'about', name: '关于我们', icon: '📖' },
        { id: 'files', name: '文件管理', icon: '📁' },
        { id: 'system', name: '系统管理', icon: '🔧' }
      ],
      config: configService.getConfig(),
      // 文件管理相关数据
      files: [],
      selectedFiles: [],
      loadingFiles: false,
      fileStats: {
        total: 0,
        totalSize: 0
      },
      fileFilter: 'all',
      // 密码管理相关数据
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordLoading: false
    }
  },
  computed: {
    filteredFiles() {
      if (this.fileFilter === 'all') {
        return this.files
      }
      return this.files.filter(file => {
        if (this.fileFilter === 'images') {
          return this.isImageFile(file.type)
        }
        if (this.fileFilter === 'videos') {
          return file.type.startsWith('video/')
        }
        return true
      })
    }
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'files' && this.files.length === 0) {
        this.refreshFiles()
      }
    }
  },
  methods: {
    // 登录相关方法
    async handleLoginSuccess() {
      this.isAuthenticated = true
      // 重新加载配置
      await this.reloadConfig()
    },

    async handleLogout() {
      try {
        await configService.logout()
        this.isAuthenticated = false
        this.showPasswordModal = false
        this.showMessage('已安全退出', 'success')
      } catch (error) {
        console.error('退出登录失败:', error)
      }
    },

    async checkAuthOnMount() {
      try {
        const authResult = await configService.checkAuth()
        this.isAuthenticated = authResult.authenticated
      } catch (error) {
        console.error('检查登录状态失败:', error)
        this.isAuthenticated = false
      }
    },

    markAsChanged() {
      this.hasChanges = true
    },
    
    async saveConfig() {
      this.saving = true
      try {
        await configService.saveConfig(this.config)
        this.hasChanges = false
        this.showMessage('配置保存成功！', 'success')
      } catch (error) {
        console.error('保存失败:', error)
        this.showMessage(error.message || '保存失败，请重试', 'error')
      } finally {
        this.saving = false
      }
    },
    
    exportConfig() {
      configService.exportConfig()
      this.showMessage('配置文件已导出', 'success')
    },
    
    async handleFileImport(event) {
      const file = event.target.files[0]
      if (!file) return
      
      try {
        const newConfig = await configService.importConfig(file)
        this.config = newConfig
        this.hasChanges = false
        this.showMessage('配置导入成功！', 'success')
      } catch (error) {
        this.showMessage(`导入失败: ${error.message}`, 'error')
      }
      
      // 清空文件输入
      event.target.value = ''
    },
    
    resetToDefaults() {
      if (confirm('确定要重置为默认配置吗？这将丢失所有自定义设置。')) {
        this.config = configService.resetConfig()
        this.hasChanges = true
        this.showMessage('已重置为默认配置', 'success')
      }
    },
    
    // 服务管理
    addService() {
      const newService = {
        id: Date.now(),
        title: '',
        titleEn: '',
        description: '',
        icon: '',
        technologies: []
      }
      this.config.services.push(newService)
      this.markAsChanged()
    },
    
    removeService(index) {
      if (confirm('确定要删除这个服务项目吗？')) {
        this.config.services.splice(index, 1)
        this.markAsChanged()
      }
    },

    // 项目管理
    addProject() {
      const newProject = {
        id: Date.now(),
        title: '',
        category: 'movie-trailer',
        year: new Date().getFullYear().toString(),
        duration: '',
        poster: '',
        videoSrc: '',
        description: ''
      }
      this.config.projects.push(newProject)
      this.markAsChanged()
    },
    
    removeProject(index) {
      if (confirm('确定要删除这个项目吗？')) {
        this.config.projects.splice(index, 1)
        this.markAsChanged()
      }
    },
    
    // 团队管理
    addTeamMember() {
      const newMember = {
        id: Date.now(),
        name: '',
        position: '',
        experience: '',
        specialty: '',
        education: '',
        bio: '',
        skills: [],
        avatar: ''
      }
      this.config.team.push(newMember)
      this.markAsChanged()
    },
    
    removeMember(index) {
      if (confirm('确定要删除这个团队成员吗？')) {
        this.config.team.splice(index, 1)
        this.markAsChanged()
      }
    },
    
    // 关于我们管理
    addAboutSection() {
      const newSection = {
        id: Date.now(),
        title: '新内容区块',
        content: '请在此输入内容...',
        image: '/assets/placeholder-about.jpg'
      }
      if (!this.config.aboutSections) {
        this.config.aboutSections = []
      }
      this.config.aboutSections.push(newSection)
      this.markAsChanged()
    },
    
    removeAboutSection(index) {
      if (confirm('确定要删除这个内容区块吗？')) {
        this.config.aboutSections.splice(index, 1)
        this.markAsChanged()
      }
    },

    // 文件上传处理
    async handleImageUpload(event, item, field) {
      const file = event.target.files[0]
      if (!file) return
      
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        this.showMessage('请选择图片文件', 'error')
        return
      }
      
      // 验证文件大小 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showMessage('图片文件不能超过5MB', 'error')
        return
      }
      
      try {
        // 使用配置服务上传文件
        const imageUrl = await configService.uploadFile(file, 'images')
        item[field] = imageUrl
        this.markAsChanged()
        this.showMessage('图片上传成功', 'success')
      } catch (error) {
        console.error('图片上传失败:', error)
        this.showMessage(`图片上传失败: ${error.message}`, 'error')
      }
    },
    
    // 视频上传处理
    async handleVideoUpload(event, item, field) {
      const file = event.target.files[0]
      if (!file) return
      
      // 验证文件类型
      if (!file.type.startsWith('video/')) {
        this.showMessage('请选择视频文件', 'error')
        return
      }
      
      // 验证文件大小 (100MB)
      if (file.size > 100 * 1024 * 1024) {
        this.showMessage('视频文件不能超过100MB', 'error')
        return
      }
      
      try {
        // 显示上传进度
        this.showMessage('视频上传中，请稍候...', 'success')
        
        // 使用配置服务上传文件
        const videoUrl = await configService.uploadFile(file, 'videos')
        item[field] = videoUrl
        this.markAsChanged()
        this.showMessage('视频上传成功', 'success')
      } catch (error) {
        console.error('视频上传失败:', error)
        this.showMessage(`视频上传失败: ${error.message}`, 'error')
      }
    },
    
    handleImageError(event) {
      event.target.src = '/assets/placeholder-about.jpg'
    },
    
    showMessage(text, type = 'success') {
      this.message = { text, type }
      setTimeout(() => {
        this.message = null
      }, 3000)
    },

    // 菜单管理
    addMenuItem() {
      const newMenuItem = {
        id: Date.now(),
        name: '',
        path: '',
        title: ''
      }
      this.config.navigation.push(newMenuItem)
      this.markAsChanged()
    },
    
    removeMenuItem(index) {
      if (confirm('确定要删除这个菜单项吗？')) {
        this.config.navigation.splice(index, 1)
        this.markAsChanged()
      }
    },

    async handleBottomImageUpload(event, type) {
      const file = event.target.files[0]
      if (!file) return
      
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        this.showMessage('请选择图片文件', 'error')
        return
      }
      
      // 验证文件大小 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showMessage('图片文件不能超过5MB', 'error')
        return
      }
      
      try {
        // 使用配置服务上传文件
        const imageUrl = await configService.uploadFile(file, 'images')
        if (type === 'desktop') {
          this.config.aboutBottomImage = imageUrl
        } else {
          this.config.aboutBottomImageMobile = imageUrl
        }
        this.markAsChanged()
        this.showMessage('图片上传成功', 'success')
      } catch (error) {
        console.error('图片上传失败:', error)
        this.showMessage(`图片上传失败: ${error.message}`, 'error')
      }
    },
    
    // 重新加载配置
    async reloadConfig() {
      try {
        await configService.init()
        this.config = configService.getConfig()
        this.hasChanges = false
        console.log('配置重新加载成功')
      } catch (error) {
        console.error('配置重新加载失败:', error)
        this.showMessage('配置加载失败，请刷新页面重试', 'error')
      }
    },

    // 文件管理相关方法
    async refreshFiles() {
      this.loadingFiles = true
      try {
        const result = await configService.getFiles()
        this.files = result.files || []
        this.fileStats = {
          total: result.total || 0,
          totalSize: result.totalSize || 0
        }
        this.showMessage('文件列表刷新成功', 'success')
      } catch (error) {
        console.error('获取文件列表失败:', error)
        this.showMessage('获取文件列表失败: ' + error.message, 'error')
      } finally {
        this.loadingFiles = false
      }
    },

    async batchDeleteFiles() {
      if (this.selectedFiles.length === 0) {
        this.showMessage('请先选择要删除的文件', 'error')
        return
      }
      
      if (confirm(`确定要删除选中的 ${this.selectedFiles.length} 个文件吗？此操作不可恢复。`)) {
        try {
          const result = await configService.batchDeleteFiles(this.selectedFiles)
          this.selectedFiles = []
          this.showMessage(result.message || '批量删除完成', 'success')
          await this.refreshFiles()
        } catch (error) {
          console.error('批量删除失败:', error)
          this.showMessage('批量删除失败: ' + error.message, 'error')
        }
      }
    },

    filterFiles() {
      // 筛选功能通过计算属性实现，这里不需要额外操作
    },

    isImageFile(type) {
      return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(type.toLowerCase())
    },

    getFileIcon(type) {
      const typeMap = {
        'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️', 'webp': '🖼️', 'svg': '🖼️',
        'mp4': '🎥', 'avi': '🎥', 'mov': '🎥', 'wmv': '🎥', 'flv': '🎥', 'webm': '🎥',
        'pdf': '📄', 'doc': '📄', 'docx': '📄', 'txt': '📄',
        'zip': '📦', 'rar': '📦', '7z': '📦'
      }
      return typeMap[type.toLowerCase()] || '📁'
    },

    formatFileSize(size) {
      if (size < 1024) return size + ' B'
      if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
      if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB'
      return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return '今天'
      if (diffDays === 2) return '昨天'
      if (diffDays <= 7) return `${diffDays}天前`
      
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    previewFile(file) {
      // 在新窗口中打开文件
      window.open(file.url, '_blank')
    },

    async deleteFile(filePath) {
      if (confirm('确定要删除这个文件吗？此操作不可恢复。')) {
        try {
          await configService.deleteFile(filePath)
          this.showMessage('文件删除成功', 'success')
          // 从选中列表中移除
          this.selectedFiles = this.selectedFiles.filter(path => path !== filePath)
          await this.refreshFiles()
        } catch (error) {
          console.error('删除文件失败:', error)
          this.showMessage('删除文件失败: ' + error.message, 'error')
        }
      }
    },

    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedFiles = this.filteredFiles.map(file => file.path)
      } else {
        this.selectedFiles = []
      }
    },

    handleFilePreviewError(event) {
      event.target.src = '/assets/placeholder-file.jpg'
    },

    // 密码管理相关方法
    async changePassword() {
      // 验证表单
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.showMessage('两次输入的密码不一致', 'error')
        return
      }

      if (this.passwordForm.newPassword.length < 6) {
        this.showMessage('新密码长度不能少于6位', 'error')
        return
      }

      this.passwordLoading = true

      try {
        // 调用configService的changePassword方法
        await configService.changePassword(
          this.passwordForm.currentPassword, 
          this.passwordForm.newPassword
        )
        
        this.showMessage('密码修改成功！', 'success')
        this.resetPasswordForm()
      } catch (error) {
        console.error('密码修改失败:', error)
        this.showMessage(error.message || '密码修改失败', 'error')
      } finally {
        this.passwordLoading = false
      }
    },

    resetPasswordForm() {
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  async mounted() {
    // 首先检查登录状态
    await this.checkAuthOnMount()
    
    // 只有登录后才加载配置和文件列表
    if (this.isAuthenticated) {
      // 监听配置变化
      configService.onConfigChange((newConfig) => {
        this.config = newConfig
      })
      
      // 重新加载最新配置
      await this.reloadConfig()
      
      // 如果当前在文件管理标签页，则加载文件列表
      if (this.activeTab === 'files') {
        this.refreshFiles()
      }
    }
  }
}
</script>

<style scoped>
.admin-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding-top: 80px;
}

.admin-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #1f1f1f;
  border: 1px solid #404040;
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: #666;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1f1f1f;
}

::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-container {
    padding-top: 60px;
  }
  
  .flex {
    flex-direction: column;
  }
  
  aside {
    width: 100%;
    min-height: auto;
  }
  
  .admin-header .flex {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .admin-header .flex > div:last-child {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }
}

/* 上传建议样式 */
.upload-tips {
  font-family: inherit;
}

.upload-tips ul {
  list-style: none;
  padding-left: 0;
}

.upload-tips li {
  position: relative;
  padding-left: 0;
}

/* 加载动画样式 */
.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 文件管理表格样式 */
.file-table th {
  background: rgba(255, 255, 255, 0.05);
}

.file-table td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 文件预览缩略图 */
.file-preview {
  transition: transform 0.2s ease;
}

.file-preview:hover {
  transform: scale(1.1);
}
</style> 