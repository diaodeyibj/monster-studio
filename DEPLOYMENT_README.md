# Monster Studio - Vercel 部署配置

## 项目概述
这是一个基于Vue 3 + Node.js的全栈影视制作工作室网站，已经配置为可以在Vercel平台上部署。

## 部署配置

### API 端点
项目已经转换为Vercel兼容的API结构，所有API端点位于 `/api` 目录：

- `api/login.js` - 管理员登录
- `api/logout.js` - 管理员登出
- `api/auth-check.js` - 认证状态检查
- `api/config.js` - 配置管理（GET/POST）
- `api/upload.js` - 文件上传
- `api/files.js` - 文件列表管理
- `api/batch-delete.js` - 批量删除文件
- `api/change-password.js` - 修改密码
- `api/health.js` - 健康检查

### 认证机制
由于Vercel的无状态特性，采用简化的认证机制：
- 登录成功后返回 `sessionId`
- 客户端将 `sessionId` 保存在本地存储中
- 需要认证的API通过检查请求头中的 `x-session-id` 来验证

### 文件上传限制
在Vercel环境中：
- 文件会被上传到临时目录 `/tmp`
- 文件在函数执行结束后会被清除
- 生产环境建议使用第三方存储服务（如AWS S3、Cloudinary等）

### 配置文件
- `config.json` - 网站配置数据，存储在项目根目录
- `vercel.json` - Vercel部署配置

## 本地开发

### 前端开发
```bash
npm run dev
```

### API测试
Vercel CLI可以用于本地测试API：
```bash
vercel dev
```

## 部署步骤

### 1. 初始化Git仓库
```bash
git init
git add .
git commit -m "Initial commit for Vercel deployment"
```

### 2. 推送到GitHub
```bash
git remote add origin https://github.com/your-username/monster-studio.git
git push -u origin main
```

### 3. 在Vercel中导入项目
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 选择你的GitHub仓库
4. 选择 "Vue.js" 框架预设
5. 点击 "Deploy"

### 4. 环境变量配置（可选）
在Vercel项目设置中可以添加环境变量：
- `ADMIN_PASSWORD_HASH` - 管理员密码哈希
- `NODE_ENV` - 环境标识

## 技术栈

### 前端
- Vue 3
- Vite
- Tailwind CSS
- Vue Router

### 后端
- Node.js
- Express.js（原server.cjs，现已转换为Vercel API）
- Multer（文件上传）
- bcryptjs（密码加密）

### 部署平台
- Vercel
- GitHub（代码托管）

## 注意事项

1. **Session管理**: 当前使用简化的认证机制，生产环境建议使用JWT或其他安全的认证方式。

2. **文件存储**: Vercel的临时文件存储不适合生产环境，建议集成云存储服务。

3. **数据库**: 当前使用JSON文件存储配置，大型项目建议使用数据库。

4. **CORS设置**: 所有API已配置CORS支持，允许跨域访问。

5. **错误处理**: 已添加基本的错误处理和日志记录。

## 默认登录凭据
- 管理员密码: `monster2024`

## 支持的功能
- ✅ 响应式设计
- ✅ 管理员登录/登出
- ✅ 配置管理
- ✅ 文件上传（有限制）
- ✅ 项目/团队管理
- ✅ 实时预览
- ✅ 移动端适配

## 故障排除

### API无法访问
检查：
1. `vercel.json` 配置是否正确
2. API文件是否使用正确的导出格式
3. CORS设置是否正确

### 文件上传失败
检查：
1. 文件大小是否超过限制（100MB）
2. 文件类型是否受支持
3. 是否已登录

### 认证失败
检查：
1. 本地存储中是否有 `sessionId`
2. 请求头是否包含 `x-session-id`
3. 密码是否正确 