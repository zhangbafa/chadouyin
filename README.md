# liveHub

一个使用 Nuxt.js 构建的实时视频数据分析平台。

## ✨ 功能

- **视频数据统计**: 分析和展示视频的核心指标。
- **用户个人资料**: 管理用户相关信息。
- **动态仪表盘**: 提供数据概览和表单交互。
- **订阅系统**: (通过 Nuxt Layer 实现)
- **API服务**: 通过 `server/api` 提供后端接口。

## ቴክ 技术栈

- [Nuxt.js](https://nuxt.com/) - Vue.js 框架
- [Vue.js](https://vuejs.org/) - 前端框架
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [Nuxt UI](https://ui.nuxt.com/) - UI 组件库

## 🚀 快速开始

1.  **克隆仓库**

    ```bash
    git clone <your-repository-url>
    cd liveHub
    ```

2.  **安装依赖**

    ```bash
    npm install
    ```

3.  **启动开发服务器**

    在 `http://localhost:3000` 启动开发服务器。

    ```bash
    npm run dev
    ```

## 📦 可用脚本

- `npm run build`: 构建用于生产环境的应用程序。
- `npm run dev`: 启动开发服务器。
- `npm run generate`: 生成静态站点。
- `npm run preview`: 在本地预览生产构建。
- `npm run postinstall`: 在安装后准备 Nuxt 环境。

## 📁 项目结构

```
.
├── app/                # 应用核心目录
│   ├── components/     # Vue 组件
│   ├── pages/          # 页面和路由
│   └── assets/         # 静态资源
├── server/             # 后端服务
│   └── api/            # API 路由
├── layers/             # Nuxt Layers
│   └── subscribe/
├── public/             # 公共文件
├── nuxt.config.ts      # Nuxt 配置文件
└── package.json        # 项目依赖和脚本
```