# 企业微信抽签工具应用 🎲

![Stars](https://img.shields.io/github/stars/PluginsKers/lottery-draw-app?style=social)
![Forks](https://img.shields.io/github/forks/PluginsKers/lottery-draw-app?style=social)
![Issues](https://img.shields.io/github/issues/PluginsKers/lottery-draw-app)

一个基于Next.js的简易抽签工具，允许用户通过企业微信进入抽签界面并进行抽签。本项目旨在提供一个快速、简单的抽签解决方案，适用于团队活动、决策制定等场景。

## 🌟 项目特点

- **简易操作**：用户友好的界面，一键抽签。
- **足够的原子化**：通过自配置 `process.env.BASE_PATH` 路由兼容反代环境。
- **企业微信集成**：利用企业微信用户身份进行抽签，确保用户身份的一致性。
- **数据持久化**：使用SQLite数据库存储抽签结果，可靠地保存历史数据。

## 📂 目录结构

```shell
lottery-draw-app/              # 项目根目录
├── src                        # 源代码目录
│   ├── database               # 数据库配置和脚本
│   │   └── config.js          # 数据库配置文件
│   ├── pages                  # 页面和API路由文件
│   │   ├── api                # 存放API端点的目录
│   │   ├── _app.jsx           # Next.js的自定义App组件，用于初始化页面
│   │   ├── draws              # 抽奖相关页面的目录
│   │   ├── components         # 公共组件目录
│   │   └── setting.jsx        # 设置页面
│   └── styles                 # 样式文件目录
│       └── globals.css        # 全局样式文件
└── public/                    # 公共文件目录，如静态文件和图片

```

## 💡 灵感来源

本项目受到了日常工作中抽签决策需求的启发，旨在为团队提供一个公平、透明的决策工具。通过结合企业微信，本工具能够确保每位参与者的唯一性，使得抽签结果更加公正。

## 🚀 安装与使用

确保你已经安装了Node.js和npm（或Yarn）。

1. 克隆仓库：

    ```bash
    git clone https://github.com/PluginsKers/lottery-draw-app.git
    cd lottery-draw-app
    ```

2. 安装依赖：

    ```bash
    npm install
    # 或者使用Yarn
    yarn install
    ```

3. 启动开发服务器：

    ```bash
    npm run dev
    # 或者使用Yarn
    yarn dev
    ```

现在，打开浏览器访问`http://localhost:3006/app/lottery/setting`，开始使用抽签工具。

## ⚙️ 配置

- **环境变量**：复制 `.env.example` 为 `.env`，并根据需要配置环境变量。
- **数据库**：默认使用项目根目录下的SQLite数据库（`process.env.DB_NAME`）。你可以通过编辑 `src/database/config.js` 和后端API文件来修改数据库配置。
- **父路由**：你可以通过编辑 `process.env.BASE_PATH` 来适应不同流量的请求要求。

## 📝 开发理念

本项目采用模块化的开发方式，易于扩展和维护。通过分离前端界面和后端逻辑，我们能够快速响应需求变化并迭代新功能。同时，我们注重用户体验，致力于提供简洁直观的操作流程。

## 🌈 贡献

欢迎通过Issue报告Bug或提交Pull Request。请确保你的代码符合项目的编码风格。

## 📃 许可证

[MIT](LICENSE)
