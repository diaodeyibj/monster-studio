# 🚀 Monster Studio - Vercel 部署操作步骤

## ✅ 本地准备工作已完成
- [x] 项目结构已重新整理
- [x] API路由已配置为Vercel Serverless Functions格式
- [x] 前端API调用已更新
- [x] 构建测试通过
- [x] 代码已推送到GitHub

---

## 🌐 Vercel网站部署操作

### 第1步：登录Vercel
1. 打开 https://vercel.com
2. 点击 **"Sign Up"** 或 **"Log In"**
3. 选择 **"Continue with GitHub"**
4. 授权Vercel访问你的GitHub账户

### 第2步：创建新项目
1. 在Vercel Dashboard点击 **"New Project"**
2. 在"Import Git Repository"中找到 **"monster-studio"** 仓库
3. 点击 **"Import"**

### 第3步：配置项目设置
在配置页面按以下设置：

#### 基本信息
- **Project Name:** `monster-studio`
- **Framework Preset:** 选择 **"Vite"**
- **Root Directory:** 保持 **"./"**

#### 构建配置
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

#### 环境变量
点击 **"Environment Variables"** 添加：
```
NODE_ENV = production
```

#### 高级设置
- **Node.js Version:** 选择 **"18.x"**

### 第4步：开始部署
1. 检查所有配置无误
2. 点击 **"Deploy"** 按钮
3. 等待2-5分钟完成构建和部署

### 第5步：验证部署
1. 部署完成后，访问提供的URL（格式：`https://monster-studio-xxx.vercel.app`）
2. 测试以下功能：
   - ✅ 首页加载正常
   - ✅ 导航菜单工作
   - ✅ 页面跳转正常
   - ✅ 访问 `/api/config` 返回JSON数据

---

## 🔧 可能遇到的问题

### 构建失败
- 查看Vercel的构建日志
- 确认`package.json`中的依赖是否完整

### API调用失败
- 检查浏览器开发者工具的Network标签
- 确认API路径是否正确（应该是 `/api/xxx`）

### 文件上传功能说明
⚠️ **重要提示：** Vercel对文件上传有限制：
- 文件存储在临时目录，不是持久化的
- 建议后续集成云存储服务（如Cloudinary、AWS S3）

---

## 📞 需要帮助？
如果部署过程中遇到问题，请：
1. 截图错误信息
2. 查看详细的部署指南：`VERCEL_DEPLOYMENT_GUIDE.md`
3. 检查项目构建日志 