# 🎬 Monster Studio - 影视后期制作团队官网

## 项目简介
Monster Studio是一个现代化的影视后期制作团队官网，采用Vue 3 + Node.js全栈架构，提供团队展示、作品集管理和后台管理功能。

## 核心功能
- 🎥 作品展示与视频播放
- 👥 团队成员介绍
- 📊 后台管理系统
- 📁 文件上传管理
- 🎨 响应式现代UI设计

## 技术栈
- **前端**: Vue 3 + Vite + Tailwind CSS + Vue Router
- **后端**: Node.js + Express + Multer (文件上传)
- **UI组件**: 自定义动画组件 + AnimeJS

## 快速启动

### 安装依赖
```bash
npm install
```

### 开发模式 (前后端同时启动)
```bash
npm run start
```

### 仅启动前端开发服务器
```bash
npm run dev
```

### 仅启动后端服务器
```bash
npm run server
```

### 构建生产版本
```bash
npm run build
```

## 部署到 claw.cloud

### 1. 注册与准备
- 注册并登录 [claw.cloud](https://claw.cloud)
- 绑定 GitHub 账号（推荐），或准备好本地代码

### 2. 新建项目
- 进入 claw.cloud 控制台，点击"新建项目"
- 选择"从 Git 仓库导入"或"本地上传"
- 选择你的项目仓库（如 GitHub 上的 Monster Studio）

### 3. 配置部署参数
- **构建命令**：`npm run build`
- **输出目录**：`dist`
- **Node 版本**：推荐 16.x 或 18.x
- **环境变量**：如有敏感信息（如密钥、数据库连接），在 claw.cloud 控制台"环境变量"处添加
- **路由设置**：如有，设置 `/api/*` 走 API，其他 fallback 到 `/index.html`（保证 SPA 路由可用）

### 4. 部署
- 点击"部署"或"保存并部署"
- claw.cloud 会自动拉取代码、安装依赖、构建前端、部署 API

### 5. 验证与调试
- 部署完成后，访问分配的域名，测试前端页面、API接口、文件上传等功能
- 如遇 404、API 报错等，查看 claw.cloud 的部署日志和函数日志，排查问题

### 6. 文件上传与持久化（重要）
- claw.cloud 的 Serverless 环境本地文件不持久，上传的文件建议：
  - 使用 claw.cloud 提供的对象存储服务（如有）
  - 或接入第三方云存储（如阿里云 OSS、腾讯云 COS、AWS S3）
  - 修改 `api/upload.js`、`api/files.js` 等相关代码，上传/读取文件到云存储

---

## API端点说明
- `api/login.js` - 管理员登录
- `api/logout.js` - 管理员登出
- `api/auth-check.js` - 认证状态检查
- `api/config.js` - 配置管理（GET/POST）
- `api/upload.js` - 文件上传
- `api/files.js` - 文件列表管理
- `api/batch-delete.js` - 批量删除文件
- `api/change-password.js` - 修改密码
- `api/health.js` - 健康检查

> 所有API已配置CORS支持，认证机制为sessionId（x-session-id），生产环境建议用云存储和更安全的认证方式。

---

## 项目结构
```
monster-studio/
├── src/                 # 前端源码
│   ├── components/      # Vue组件
│   ├── views/           # 页面组件
│   ├── router/          # 路由配置
│   └── services/        # 服务层
├── public/              # 静态资源
├── uploads/             # 上传文件存储（如用云存储可忽略本地）
├── api/                 # Serverless API端点
├── config.json          # 配置文件
├── package.json         # 项目配置
├── vite.config.js       # 构建配置
├── vercel.json          # Vercel部署配置（可参考claw.cloud路由设置）
└── README.md            # 项目说明
```

## 注意事项
- claw.cloud/Serverless 环境本地上传文件不持久，建议用云存储
- 环境变量、密钥等敏感信息请勿硬编码
- 如遇API 404、JSON解析错误，优先检查API路径和路由设置
- 前端API路径需与后端API文件名严格一致
- 部署后建议清理浏览器缓存，确保前端加载最新JS

## 作者
**Monster Studio Team**

---
*专业影视后期制作，创造视觉震撼体验* 