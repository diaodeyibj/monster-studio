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

## 部署说明
本项目支持Railway、Render等支持文件上传的全栈部署平台。

## 项目结构
```
monster-studio/
├── src/                 # 前端源码
│   ├── components/      # Vue组件
│   ├── views/          # 页面组件
│   ├── router/         # 路由配置
│   └── services/       # 服务层
├── public/             # 静态资源
├── uploads/            # 上传文件存储
├── server.cjs          # 后端服务器
├── config.json         # 配置文件
└── package.json        # 项目配置
```

## 作者
**Monster Studio Team**

---
*专业影视后期制作，创造视觉震撼体验* 