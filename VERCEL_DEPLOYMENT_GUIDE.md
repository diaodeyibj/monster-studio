# Monster Studio - Vercel 部署详细指南

## 项目概述
Monster Studio 是一个基于 Vue.js + Node.js 的影视制作公司官网，包含文件上传、内容管理等功能。本指南将详细说明如何将项目部署到 Vercel 平台。

## 项目结构说明
```
monster-studio/
├── api/                    # Vercel Serverless Functions
│   ├── [...route].js      # 主要API路由处理器
│   └── upload.js          # 文件上传处理器
├── src/                   # Vue.js 前端源码
├── public/                # 静态资源
├── uploads/               # 上传文件（Vercel中有限制）
├── dist/                  # 构建输出目录
├── package.json           # 项目依赖配置
├── vercel.json           # Vercel部署配置
├── vite.config.js        # Vite构建配置
└── config.json           # 网站内容配置文件
```

## 部署准备工作

### 1. 项目文件检查（本地操作）
**位置：** 本地开发环境 `D:\work\monster`
**目的：** 确保项目文件结构正确

执行以下检查：
- ✅ 确认 `api/` 目录存在且包含 `[...route].js` 和 `upload.js`
- ✅ 确认 `vercel.json` 配置文件存在
- ✅ 确认 `package.json` 包含 `vercel-build` 脚本
- ✅ 确认 `src/services/configService.js` API路径已更新

```powershell
# 检查关键文件是否存在
dir api\
type vercel.json
type package.json | findstr "vercel-build"
```

### 2. 依赖安装（本地操作）
**位置：** 本地开发环境
**目的：** 确保所有依赖包正确安装

```powershell
# 安装项目依赖
npm install

# 验证关键依赖
npm list formidable
npm list bcryptjs
npm list vue
```

### 3. 本地构建测试（本地操作）
**位置：** 本地开发环境
**目的：** 确保项目能够正确构建

```powershell
# 执行构建
npm run build

# 检查构建输出
dir dist\
```

## GitHub 仓库设置

### 4. 代码提交到 GitHub（本地操作）
**位置：** 本地开发环境
**目的：** 将代码推送到 GitHub 仓库供 Vercel 使用

```powershell
# 检查git状态
git status

# 添加所有更改
git add .

# 提交更改
git commit -m "准备Vercel部署: 更新API结构和配置"

# 推送到GitHub
git push origin main
```

**验证步骤：**
1. 打开 https://github.com/你的用户名/monster-studio
2. 确认最新提交包含以下文件：
   - `api/[...route].js`
   - `api/upload.js`
   - `vercel.json`
   - 更新后的 `package.json`

## Vercel 平台部署

### 5. Vercel 账户设置（Vercel网站操作）
**位置：** https://vercel.com
**目的：** 创建或登录 Vercel 账户

1. 访问 https://vercel.com
2. 点击 **"Sign Up"** 或 **"Log In"**
3. **选择 GitHub 登录** （推荐）
   - 点击 "Continue with GitHub"
   - 授权 Vercel 访问你的 GitHub 账户
4. 完成账户设置

### 6. 导入 GitHub 项目（Vercel网站操作）
**位置：** Vercel Dashboard
**目的：** 将 GitHub 仓库连接到 Vercel

1. 在 Vercel Dashboard 中点击 **"New Project"**
2. 在 "Import Git Repository" 部分：
   - 选择 **"GitHub"**
   - 找到 **"monster-studio"** 仓库
   - 点击 **"Import"**

### 7. 项目配置设置（Vercel网站操作）
**位置：** Vercel 项目配置页面
**目的：** 设置构建和部署参数

在项目导入页面进行以下配置：

#### 基本设置
- **Project Name:** `monster-studio`（或自定义名称）
- **Framework Preset:** 选择 **"Vite"**
- **Root Directory:** 保持默认 **"./"**

#### 构建设置
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

#### 环境变量设置
点击 **"Environment Variables"** 添加：
```
NODE_ENV = production
```

#### 高级设置
展开 **"Advanced"** 选项：
- **Node.js Version:** 选择 **"18.x"**
- **Enable Zero Config:** 保持开启

### 8. 开始部署（Vercel网站操作）
**位置：** Vercel 项目配置页面
**目的：** 启动首次部署

1. 检查所有配置无误后，点击 **"Deploy"**
2. 等待部署过程完成（通常需要2-5分钟）
3. 观察构建日志，确保没有错误

## 部署后配置

### 9. 验证部署结果（浏览器操作）
**位置：** 部署后的网站URL
**目的：** 确认网站功能正常

1. 访问 Vercel 提供的部署URL（格式：`https://monster-studio-xxx.vercel.app`）
2. 检查以下功能：
   - ✅ 首页正常加载
   - ✅ 导航菜单工作正常
   - ✅ 页面间跳转正常
   - ✅ API接口响应正常（访问 `/api/config`）

### 10. 设置自定义域名（可选）（Vercel网站操作）
**位置：** Vercel 项目设置页面
**目的：** 配置自定义域名

1. 在项目页面点击 **"Settings"**
2. 点击左侧 **"Domains"**
3. 点击 **"Add Domain"**
4. 输入你的域名（如：`monsterstudio.com`）
5. 按照提示配置DNS记录

### 11. 配置文件上传限制说明
**重要提示：** Vercel对文件上传有以下限制：

- **文件大小限制：** 单个请求最大50MB
- **临时存储：** 上传文件存储在 `/tmp` 目录，函数执行结束后会清理
- **持久化存储：** 需要集成第三方存储服务

**建议解决方案：**
1. 集成 Cloudinary 用于图片存储
2. 集成 AWS S3 用于视频存储
3. 更新 `api/upload.js` 实现云存储上传

## 开发和生产环境管理

### 12. 本地开发环境（本地操作）
**位置：** 本地开发环境
**目的：** 维护本地开发环境

```powershell
# 启动本地开发服务器
npm run dev:full

# 本地访问地址
# 前端: http://localhost:5173
# 后端: http://localhost:3001
```

### 13. 生产环境更新（本地→GitHub→Vercel）
**目的：** 更新生产环境代码

每次代码更新的完整流程：

1. **本地开发**（本地操作）
   ```powershell
   # 修改代码
   # 本地测试
   npm run dev:full
   ```

2. **代码提交**（本地操作）
   ```powershell
   git add .
   git commit -m "描述更改内容"
   git push origin main
   ```

3. **自动部署**（Vercel自动执行）
   - Vercel 检测到 GitHub 更新
   - 自动触发重新构建和部署
   - 可在 Vercel Dashboard 查看部署状态

## 问题排查指南

### 常见问题和解决方案

#### 1. 构建失败
**症状：** Vercel 部署时出现构建错误
**解决方案：**
- 检查本地 `npm run build` 是否成功
- 查看 Vercel 构建日志定位具体错误
- 确认所有依赖都在 `package.json` 中

#### 2. API 调用失败
**症状：** 前端无法连接后端API
**解决方案：**
- 检查 `src/services/configService.js` 中的 `apiBaseUrl` 配置
- 验证 `api/[...route].js` 文件存在且格式正确
- 在浏览器开发者工具查看网络请求

#### 3. 文件上传不工作
**症状：** 文件上传功能失效
**解决方案：**
- Vercel 环境中文件上传有限制，需要云存储方案
- 考虑集成 Cloudinary 或 AWS S3
- 更新 `api/upload.js` 实现云存储

#### 4. 环境变量问题
**症状：** 配置信息显示不正确
**解决方案：**
- 在 Vercel 项目设置中添加环境变量
- 重新部署项目以应用新的环境变量

### 调试工具

1. **Vercel 部署日志**
   - 位置：Vercel Dashboard → 项目 → Deployments
   - 用途：查看构建和部署过程的详细日志

2. **浏览器开发者工具**
   - F12 → Network 标签
   - 用途：查看API请求和响应

3. **Vercel 函数日志**
   - 位置：Vercel Dashboard → 项目 → Functions
   - 用途：查看服务器端函数执行日志

## 维护建议

1. **定期备份配置文件**
   - 定期下载 `config.json` 文件
   - 考虑使用数据库存储配置数据

2. **监控部署状态**
   - 关注 Vercel 部署通知
   - 设置网站可用性监控

3. **性能优化**
   - 启用 Vercel CDN
   - 优化图片和视频资源
   - 考虑服务端渲染(SSR)

---

## 联系支持
如果在部署过程中遇到问题，可以：
1. 查看 Vercel 官方文档：https://vercel.com/docs
2. 检查项目的构建日志和错误信息
3. 确认所有配置文件格式正确 