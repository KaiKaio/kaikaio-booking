# kaikaio-booking-h5

一个基于 React 的移动端记账应用，支持账单管理、数据统计、多账本等功能。

## 技术栈

- **框架**: React 18.2.0
- **构建工具**: Vite 2.1.5
- **路由管理**: React Router 6
- **状态管理**: Redux Toolkit + React-Redux
- **UI 组件库**: Zarm 3.1.5
- **样式预处理**: Less
- **HTTP 请求**: Axios
- **图表可视化**: ECharts 5.4.2
- **移动端适配**: lib-flexible + postcss-pxtorem
- **日期处理**: Day.js

## 功能特性

### 核心功能

- **账单管理**: 添加、编辑、删除账单，支持 16 种账单类型
- **数据统计**: 支出/收入统计图表，时间维度数据分析
- **多账本**: 支持创建和切换多个账本
- **用户系统**: 登录/登出、SSO 单点登录、Token 认证

### 性能优化

- 路由懒加载
- 页面保活（首页和数据页）
- 代码分割策略
- Gzip 压缩
- 静态资源 CDN 加速

## 项目结构

```
kaikaio-booking/
├── src/
│   ├── assets/          # 静态资源（字体、图片）
│   ├── components/      # 可复用组件
│   │   ├── BillItem/       # 账单项组件
│   │   ├── CustomIcon/     # 自定义图标组件
│   │   ├── Empty/          # 空状态组件
│   │   ├── Header/         # 头部组件
│   │   ├── NavBar/         # 底部导航栏组件
│   │   ├── PopupAddBill/   # 添加账单弹窗
│   │   ├── PopupDate/      # 日期选择弹窗
│   │   ├── PopupType/      # 类型选择弹窗
│   │   ├── ScrollDateSelect/  # 滚动日期选择器
│   │   ├── KeepAlivePages/ # 页面保活组件
│   │   └── WithAuth/       # 权限认证高阶组件
│   ├── config/          # 环境配置
│   ├── container/       # 页面容器
│   │   ├── Home/       # 首页 - 账单列表
│   │   ├── Data/       # 数据统计页
│   │   ├── User/       # 用户中心页
│   │   ├── Login/      # 登录页
│   │   ├── Detail/     # 账单详情页
│   │   ├── Account/    # 账户管理页
│   │   ├── About/      # 关于页面
│   │   ├── Books/      # 账本列表页
│   │   └── UserInfo/   # 用户信息页
│   ├── router/          # 路由配置
│   ├── store/           # Redux 状态管理
│   ├── utils/           # 工具函数
│   ├── App.jsx          # 应用主组件
│   ├── main.jsx         # 应用入口
│   └── index.css        # 全局样式
├── public/              # 公共静态资源
├── .env.development     # 开发环境变量
├── .env.beta            # Beta 环境变量
├── .env.release         # 生产环境变量
├── vite.config.js       # Vite 构建配置
├── postcss.config.js    # PostCSS 配置
├── nginx.conf           # Nginx 配置
├── Dockerfile           # Docker 构建文件
├── docker-compose.yml   # Docker Compose 配置
└── ecosystem.config.js  # PM2 配置文件
```

## 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动开发服务器，访问 http://localhost:3001

### 构建生产版本

```bash
# Beta 版本
npm run build:beta

# 生产版本
npm run build:release
```

### 预览构建结果

```bash
npm run serve
```

## 部署说明

### Docker 部署

```bash
# 构建镜像
docker build -t kaikaio-booking-h5 .

# 使用 Docker Compose 启动
docker-compose up -d
```

### PM2 部署

```bash
# 部署到生产环境
pm2 deploy ecosystem.config.js production setup
pm2 deploy ecosystem.config.js production
```

## 环境配置

项目支持多环境配置，通过环境变量文件管理：

| 文件 | 环境 | 说明 |
|------|------|------|
| .env.development | 开发环境 | 本地开发使用 |
| .env.beta | Beta 环境 | 测试环境使用 |
| .env.release | 生产环境 | 线上环境使用 |

### 配置说明

- `VITE_API_URL`: API 基础路径

## 路由说明

| 路径 | 页面 | 说明 |
|------|------|------|
| /login | Login | 登录页（无需认证） |
| / | Home | 首页（账单列表） |
| /data | Data | 数据统计页 |
| /user | User | 用户中心页 |
| /detail | Detail | 账单详情页 |
| /account | Account | 账户管理页 |
| /about | About | 关于页面 |
| /books | Books | 账本列表页 |
| /userinfo | UserInfo | 用户信息页 |

## 开发指南

### 组件开发

组件位于 `src/components/` 目录，每个组件独立目录管理，包含组件文件和样式文件。

### 样式开发

- 使用 Less 预处理器
- 使用 rem 单位进行移动端适配
- PostCSS 自动添加浏览器前缀

### 状态管理

使用 Redux Toolkit 进行状态管理，Slice 位于 `src/store/` 目录。

### API 请求

使用封装的 Axios 实例（`src/utils/axios.js`），自动处理：
- 请求超时
- 401 未授权跳转
- 统一错误处理

## 浏览器支持

- Chrome >= 60
- Safari >= 12
- Firefox >= 60
- Edge >= 79

## 许可证

ISC
