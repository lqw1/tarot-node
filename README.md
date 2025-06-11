# Express.js API Server

这是一个基于 Express.js 的 Node.js API 服务器项目。

## 项目结构

```
.
├── src/
│   ├── app.js        # Express 应用配置
│   └── server.js     # 服务器入口文件
├── .env              # 环境变量配置
├── .gitignore        # Git 忽略文件
├── package.json      # 项目依赖配置
└── README.md         # 项目说明文档
```

## 安装

```bash
npm install
```

## 运行

开发环境：
```bash
npm run dev
```

生产环境：
```bash
npm start
```

## 环境变量

在 `.env` 文件中配置以下环境变量：

- `PORT`: 服务器端口号（默认：3000）
- `NODE_ENV`: 运行环境（development/production） 