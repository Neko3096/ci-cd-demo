# ci-cd-demo

实验三 / 实验四使用的前后端示例工程：React + Vite 前端、Node + TypeScript + Express 后端，
由 GitHub Actions 完成检查、构建、Pages 发布与阿里云 ECS 部署。

## 目录

```
.github/workflows/ci.yml          # 前后端 lint + test + build
.github/workflows/static.yml      # 前端构建并发布到 GitHub Pages
.github/workflows/deploy-ecs.yml  # 构建前后端并部署到阿里云 ECS
deploy/cicd-demo.service          # ECS 上的 systemd 单元
deploy/cicd-demo.nginx.conf       # ECS 上的 Nginx 站点配置
apps/backend                      # Node + TypeScript + Express
apps/frontend                     # React + Vite
```

## 后端 apps/backend

| 用途 | 命令 |
| --- | --- |
| 安装 | `npm ci`（首次生成锁文件用 `npm install`） |
| 开发 | `npm run dev` |
| 检查 | `npm run lint`、`npm run typecheck` |
| 测试 | `npm test` |
| 编译 | `npm run build` → `dist/server.js` |
| 启动 | `npm start` |

接口：`GET /api/hello`、`GET /health`、`GET /api/version`，默认监听 `127.0.0.1:3000`。

## 前端 apps/frontend

| 用途 | 命令 |
| --- | --- |
| 安装 | `npm ci`（首次生成锁文件用 `npm install`） |
| 开发 | `npm run dev`（`/api` 代理到 127.0.0.1:3000） |
| 检查 | `npm run lint`、`npm run typecheck` |
| 测试 | `npm test` |
| 打包 | `npm run build` → `dist/` |

## 本地联调

```bash
# 终端 1
cd apps/backend && npm install && npm run dev

# 终端 2
cd apps/frontend && npm install && npm run dev
```

浏览器打开 `http://localhost:5173`，页面应显示 `Hello from ECS backend`。

## 提交前自检

```bash
cd apps/backend  && npm run lint && npm test && npm run build
cd apps/frontend && npm run lint && npm run typecheck && npm test && npm run build
```
