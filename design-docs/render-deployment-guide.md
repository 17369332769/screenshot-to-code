# screenshot-to-code Render 部署文档

本文说明如何把当前仓库的前端和后端都部署到 `Render`，并解释为什么这套方式适合当前项目。

适用范围：

- 前端部署到 `Render Static Site`
- 后端部署到 `Render Web Service`
- 前后端都在 `Render` 上托管

配套蓝图文件已经加入仓库：

- [render.yaml](/Users/czy/Documents/screenshot-to-code/render.yaml)

## 1. 方案结论

这个项目当前最适合的 Render 方案是：

- 前端：`Static Site`
- 后端：`Web Service`
- 后端额外挂一个 `Persistent Disk`

原因：

- 前端是 `React + Vite`，构建后是静态资源
- 后端是 `FastAPI`
- 后端依赖 `WebSocket /generate-code`
- 后端会把项目数据、设计系统和本地资源写到磁盘

所以它不是“纯静态站”，也不是“纯 serverless 函数”，而是标准的“静态前端 + 常驻后端服务”。

## 2. 仓库和服务划分

### 前端

目录：

- `frontend/`

运行特点：

- 用 `Vite` 构建
- 通过环境变量读取后端地址
- 使用 `BrowserRouter`

相关配置：

- [frontend/package.json](/Users/czy/Documents/screenshot-to-code/frontend/package.json)
- [frontend/src/config.ts](/Users/czy/Documents/screenshot-to-code/frontend/src/config.ts)
- [frontend/src/main.tsx](/Users/czy/Documents/screenshot-to-code/frontend/src/main.tsx)

### 后端

目录：

- `backend/`

运行特点：

- `FastAPI + uvicorn`
- 提供 HTTP API
- 提供 WebSocket
- 本地文件持久化

相关配置：

- [backend/main.py](/Users/czy/Documents/screenshot-to-code/backend/main.py)
- [backend/config.py](/Users/czy/Documents/screenshot-to-code/backend/config.py)
- [backend/routes/generate_code.py](/Users/czy/Documents/screenshot-to-code/backend/routes/generate_code.py)
- [backend/routes/accounts.py](/Users/czy/Documents/screenshot-to-code/backend/routes/accounts.py)
- [backend/routes/design_systems.py](/Users/czy/Documents/screenshot-to-code/backend/routes/design_systems.py)
- [backend/uploaded_assets/store.py](/Users/czy/Documents/screenshot-to-code/backend/uploaded_assets/store.py)

## 3. Render 上为什么要分成两个服务

虽然你说的是“都部署到 Render”，但在 Render 里仍然建议拆成两个服务：

1. 一个 `Static Site`
2. 一个 `Web Service`

这不是“分平台部署”，而是“同平台内按职责拆服务”。

这样做的好处：

- 前端静态资源用最适合的托管方式
- 后端保留常驻服务能力
- 前端和后端可以独立发布
- 后端挂磁盘更自然
- 配置更符合 Render 的产品模型

## 4. 部署前准备

### 4.1 你需要准备什么

- 一个 `Render` 账号
- 仓库已推送到 GitHub
- 至少一个可用的模型 Key

至少准备以下 Key 中的一个：

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`

没有任何模型 Key 时：

- 后端虽然能启动
- 但 `/api/readyz` 会返回 `not_ready`
- 实际生成代码功能不可用

### 4.2 后端持久化是必须的

当前项目会在本地写这些内容：

- `users.json`
- `projects.json`
- `design-systems.json`
- `local-assets/*`

所以后端一定要挂 `Persistent Disk`。

## 5. 推荐的 Render 服务结构

建议使用两个服务：

### 服务 1：后端

- Service type：`Web Service`
- Name：`screenshot-to-code-backend`
- Root Directory：`backend`

### 服务 2：前端

- Service type：`Static Site`
- Name：`screenshot-to-code-frontend`
- Root Directory：`frontend`

## 6. 方式一：用仓库里的 render.yaml

仓库已经新增了：

- [render.yaml](/Users/czy/Documents/screenshot-to-code/render.yaml)

它定义了：

- 一个后端 `Web Service`
- 一个前端 `Static Site`
- 后端健康检查
- 后端持久化磁盘
- 前端 SPA 重写规则
- 必要的环境变量占位

你可以在 Render 控制台用蓝图方式导入。

### 6.1 蓝图大致包含什么

后端：

- `runtime: python`
- `rootDir: backend`
- `buildCommand: uvx poetry install`
- `startCommand: uvx poetry run uvicorn main:app --host 0.0.0.0 --port $PORT`
- `healthCheckPath: /api/healthz`
- `disk: /var/data/screenshot-to-code`

前端：

- `runtime: static`
- `rootDir: frontend`
- `buildCommand: pnpm install --frozen-lockfile && pnpm build-hosted`
- `staticPublishPath: dist`
- SPA fallback rewrite 到 `/index.html`

## 7. 方式二：在 Render 控制台手动创建

如果你不想直接用蓝图，也可以手动创建。

### 7.1 创建后端 Web Service

在 Render 控制台：

1. 打开 [https://dashboard.render.com/](https://dashboard.render.com/)
2. 点击 `New`
3. 选择 `Web Service`
4. 连接 GitHub 仓库
5. 选择仓库：`screenshot-to-code`

然后填写：

- `Name`: `screenshot-to-code-backend`
- `Root Directory`: `backend`
- `Runtime`: `Python`
- `Branch`: 你要部署的分支
- `Build Command`:

```bash
uvx poetry install
```

- `Start Command`:

```bash
uvx poetry run uvicorn main:app --host 0.0.0.0 --port $PORT
```

- `Health Check Path`:

```text
/api/healthz
```

### 7.2 给后端添加磁盘

在后端服务配置里添加 `Persistent Disk`：

- `Mount Path`:

```text
/var/data/screenshot-to-code
```

- `Size`: 建议先 `5 GB`

### 7.3 后端环境变量

至少配置这些：

```bash
IS_PROD=true
ALLOWED_CORS_ORIGINS=https://screenshot-to-code-frontend.onrender.com
SCREENSHOT_TO_CODE_DATA_DIR=/var/data/screenshot-to-code
LOCAL_ASSET_DIR=/var/data/screenshot-to-code/local-assets

OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GEMINI_API_KEY=...
```

可选：

```bash
OPENAI_BASE_URL=
QUICKROUTER_IMAGE_API_KEY=
QUICKROUTER_IMAGE_BASE_URL=https://api.quickrouter.ai/v1
QUICKROUTER_IMAGE_MODEL=gpt-image-2-all
RUNNINGHUB_API_KEY=
RUNNINGHUB_BASE_URL=https://www.runninghub.cn
RUNNINGHUB_IMAGE_MODEL=rhart-image-g-2-official/text-to-image
IS_DEBUG_ENABLED=false
PROMPT_REPORTS_ENABLED=false
```

说明：

- `ALLOWED_CORS_ORIGINS` 必须填前端域名，不是后端域名
- 三个模型 Key 不必全填，但至少一个要有效
- `SCREENSHOT_TO_CODE_DATA_DIR` 用来存 JSON 数据
- `LOCAL_ASSET_DIR` 用来存保留的上传资源

### 7.4 创建前端 Static Site

在 Render 控制台：

1. 点击 `New`
2. 选择 `Static Site`
3. 连接同一个 GitHub 仓库
4. 选择仓库：`screenshot-to-code`

填写：

- `Name`: `screenshot-to-code-frontend`
- `Root Directory`: `frontend`
- `Build Command`:

```bash
pnpm install --frozen-lockfile && pnpm build-hosted
```

- `Publish Directory`:

```text
dist
```

### 7.5 前端环境变量

创建后端服务成功后，会得到后端域名，例如：

```text
https://screenshot-to-code-backend.onrender.com
```

前端环境变量应填：

```bash
VITE_HTTP_BACKEND_URL=https://screenshot-to-code-backend.onrender.com
VITE_WS_BACKEND_URL=wss://screenshot-to-code-backend.onrender.com
VITE_IS_DEPLOYED=true
```

可选：

```bash
VITE_PICO_BACKEND_FORM_SECRET=
```

这个变量只用于前端订阅表单；如果你不用该功能，可以留空。

## 8. 为什么前端要加 SPA 回退

前端使用的是 `BrowserRouter`：

- [frontend/src/main.tsx](/Users/czy/Documents/screenshot-to-code/frontend/src/main.tsx)

这意味着像这些路径：

- `/evals`
- `/evals/single`
- `/evals/pairwise`
- `/evals/best-of-n`
- `/evals/run`
- `/evals/openai-input-compare`
- `/evals/prompt-reports`

如果直接刷新页面，静态托管平台可能会返回 404。

所以在 `render.yaml` 里我已经加了：

- 把所有未知路径 rewrite 到 `/index.html`

这样前端路由刷新时不会炸掉。

## 9. 后端上线后的检查方法

### 9.1 基础健康检查

打开：

```text
https://你的后端域名/api/healthz
```

应返回：

```json
{"status":"ok"}
```

### 9.2 模型就绪检查

打开：

```text
https://你的后端域名/api/readyz
```

如果至少一个模型 Key 有效，应该返回：

- `status: "ready"`

### 9.3 WebSocket 检查

前端正常开始生成代码，说明浏览器可以连接：

```text
wss://你的后端域名/generate-code
```

### 9.4 资源持久化检查

执行一次生成并保存后，重启后端服务，再确认这些内容还在：

- 历史项目
- 设计系统
- 本地上传资源

## 10. 自定义域名建议

你后续可以在 Render 上绑定自定义域名，例如：

- 前端：`app.example.com`
- 后端：`api.example.com`

绑定自定义域名后，把环境变量改成：

前端：

```bash
VITE_HTTP_BACKEND_URL=https://api.example.com
VITE_WS_BACKEND_URL=wss://api.example.com
VITE_IS_DEPLOYED=true
```

后端：

```bash
ALLOWED_CORS_ORIGINS=https://app.example.com
```

## 11. 当前项目在 Render 上的已知风险

### 11.1 账户 Cookie 配置较偏本地开发

当前登录接口代码里设置的是：

- `secure=False`

位置：

- [backend/routes/accounts.py](/Users/czy/Documents/screenshot-to-code/backend/routes/accounts.py)

这意味着：

- 本地开发没问题
- 正式 HTTPS 环境下，如果你要启用登录能力，最好再复查 Cookie 行为

建议上线前重点检查：

- Cookie 是否应该改成 `secure=True`
- `samesite` 是否符合你的前后端域名关系

### 11.2 文件存储仍然是单机模型

虽然 Render 持久化盘能满足当前项目，但它仍然是“单机本地存储”的思路。

这意味着：

- 更适合单实例或低复杂度部署
- 如果以后要横向扩多实例，需要迁移到数据库和对象存储

### 11.3 前端 lint 目前有仓库现存问题

本次整理文档时，我重新跑过检查：

- 后端测试通过
- 后端 pyright 无错误
- 前端 lint 失败，但失败项来自仓库现存 TS/ESLint 问题，不是本次新增文档造成的

## 12. 本地验证命令

### 12.1 后端

```bash
cd backend
uvx poetry env use /opt/homebrew/bin/python3.10
uvx poetry install
IS_PROD=true \
ALLOWED_CORS_ORIGINS=http://localhost:5173 \
SCREENSHOT_TO_CODE_DATA_DIR=$HOME/.screenshot-to-code \
LOCAL_ASSET_DIR=$HOME/.screenshot-to-code/local-assets \
OPENAI_API_KEY=your-key \
uvx poetry run uvicorn main:app --host 0.0.0.0 --port 7001
```

### 12.2 前端

```bash
cd frontend
pnpm install
VITE_HTTP_BACKEND_URL=http://127.0.0.1:7001 \
VITE_WS_BACKEND_URL=ws://127.0.0.1:7001 \
VITE_IS_DEPLOYED=true \
pnpm build-hosted
pnpm preview --host 0.0.0.0
```

## 13. 最终建议

对这个项目来说，“前后端都放 Render” 是完全合理的，而且是当前最省事的一条路。

推荐你按这个顺序做：

1. 创建后端 `Web Service`
2. 挂持久化磁盘
3. 配后端环境变量和模型 Key
4. 部署前端 `Static Site`
5. 配前端环境变量指向后端域名
6. 用 `/api/healthz` 和 `/api/readyz` 验证

如果你后面想把实际部署流程彻底自动化，可以继续在这个仓库基础上增加：

- Render Blueprint 全量配置
- 自定义域名说明
- 上线后的 Cookie 调整
- 外部数据库 / 对象存储改造
