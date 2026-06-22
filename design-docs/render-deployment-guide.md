# screenshot-to-code Render 部署文档

本文基于当前仓库和已经跑通的 Render 线上部署整理，目标是把前端和后端都部署到 Render，并说明这次实际验证过的配置。

配套蓝图文件：

- [render.yaml](/Users/czy/Documents/screenshot-to-code/render.yaml)

当前已跑通的线上地址：

- 前端：[https://screenshot-to-code-frontend-9hne.onrender.com](https://screenshot-to-code-frontend-9hne.onrender.com)
- 后端：[https://screenshot-to-code-backend-py310.onrender.com](https://screenshot-to-code-backend-py310.onrender.com)

## 1. 部署结论

这个项目当前最合适、也已经验证可用的 Render 方案是：

- 前端：`Static Site`
- 后端：`Web Service`
- 同一个 GitHub 仓库，两个 Render 服务

原因很直接：

- `frontend/` 是 `Vite` 静态构建产物
- `backend/` 是常驻运行的 `FastAPI + uvicorn`
- 后端需要 HTTP API 和 WebSocket
- 前端和后端都放在 Render 上，但仍然应该按服务职责拆开

这不是“分平台部署”，而是“同平台内拆成两个最匹配的 Render 服务”。

## 2. 这次实际跑通的配置

### 前端服务

- Render 类型：`Static Site`
- 名称：`screenshot-to-code-frontend`
- URL：`https://screenshot-to-code-frontend-9hne.onrender.com`
- Build Command：

```bash
cd frontend && pnpm install --frozen-lockfile && pnpm build-hosted
```

- Publish Directory：

```text
frontend/dist
```

前端环境变量：

```bash
VITE_HTTP_BACKEND_URL=https://screenshot-to-code-backend-py310.onrender.com
VITE_WS_BACKEND_URL=wss://screenshot-to-code-backend-py310.onrender.com
VITE_IS_DEPLOYED=true
```

可选：

```bash
VITE_PICO_BACKEND_FORM_SECRET=
```

### 后端服务

- Render 类型：`Web Service`
- 名称：`screenshot-to-code-backend-py310`
- URL：`https://screenshot-to-code-backend-py310.onrender.com`
- Runtime：`Python`
- Plan：`free`
- Region：`Singapore`

Build Command：

```bash
cd backend && poetry install --no-interaction --no-ansi
```

Start Command：

```bash
cd backend && poetry run uvicorn main:app --host 0.0.0.0 --port $PORT
```

后端环境变量：

```bash
PYTHON_VERSION=3.10.20
POETRY_VERSION=2.3.2
IS_PROD=true
ALLOWED_CORS_ORIGINS=https://screenshot-to-code-frontend-9hne.onrender.com
SCREENSHOT_TO_CODE_DATA_DIR=/tmp/screenshot-to-code
LOCAL_ASSET_DIR=/tmp/screenshot-to-code/local-assets
```

模型和三方服务相关变量按需填写：

```bash
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
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

## 3. 这次踩过的几个关键坑

### 3.1 Render 上不能照搬本地的 `uvx poetry`

本地仓库根据开发机环境，推荐用：

```bash
uvx poetry run ...
```

但 Render 的构建环境里没有 `uvx`，直接这样写会失败。

所以在 Render 上，已经验证可用的是直接使用：

```bash
poetry install --no-interaction --no-ansi
poetry run uvicorn ...
```

再通过环境变量固定 Poetry 版本：

```bash
POETRY_VERSION=2.3.2
```

### 3.2 必须固定 Python 3.10

项目后端在本地是 Poetry 管理，目标版本是 Python 3.10+。这次在 Render 上如果不显式固定版本，曾落到较新的 Python 3.14，导致依赖安装和构建行为不稳定。

已经验证可用的配置是：

```bash
PYTHON_VERSION=3.10.20
```

### 3.3 免费版不能直接写 `/var/data`

项目原先更像“有持久盘”的部署思路，但这次实际跑通的是 Render 免费版 `Web Service`。免费版这里没有给我们当前服务直接可写的持久挂载目录，因此写 `/var/data` 会触发权限错误。

这次真正可用的解决方式是改成：

```bash
SCREENSHOT_TO_CODE_DATA_DIR=/tmp/screenshot-to-code
LOCAL_ASSET_DIR=/tmp/screenshot-to-code/local-assets
```

这代表：

- 服务可以正常运行
- `/api/healthz` 和 `/api/readyz` 可以通过
- 但数据是临时的
- 服务重启、重建或迁移后，这些文件可能消失

## 4. 免费版与生产版的区别

当前仓库里的 `render.yaml` 对齐的是“已经验证可跑通的免费版配置”，适合：

- 先把站点跑起来
- 先验证产品流程
- 先对外演示

但它不是最稳妥的生产持久化方案，因为后端文件落在 `/tmp`，属于临时存储。

如果你后面要做更稳定的正式环境，建议升级成带持久盘的方案，或者把本地文件存储迁移出去，例如：

- 用户和项目元数据迁到数据库
- 上传资源迁到对象存储

## 5. 为什么在 Render 里仍然要拆前后端

虽然两边都部署在 Render，但还是建议拆成两个服务：

- 前端是静态资源，最适合 `Static Site`
- 后端要常驻运行，最适合 `Web Service`
- 前端和后端可以独立重新部署
- 前端只负责构建和托管静态文件
- 后端单独管理环境变量、运行时和日志

所以“都部署到 Render”并不等于“合并成一个服务”。

## 6. 用仓库里的 `render.yaml` 部署

仓库里已经提供：

- [render.yaml](/Users/czy/Documents/screenshot-to-code/render.yaml)

这个蓝图现在对齐的是实际可用配置，包含：

- 一个 Python 后端 `Web Service`
- 一个前端 `Static Site`
- 前端 SPA 重写规则
- 后端 Python / Poetry 版本固定
- 后端临时存储目录配置
- 必要环境变量占位

使用方式：

1. 把仓库推到 GitHub
2. 登录 [Render Dashboard](https://dashboard.render.com/)
3. 选择 `New` -> `Blueprint`
4. 选择这个仓库
5. Render 读取仓库根目录下的 `render.yaml`
6. 补全 `sync: false` 的环境变量
7. 创建服务并等待构建完成

## 7. 在 Render 控制台手动创建

如果你不想直接用蓝图，也可以手动配。

### 7.1 创建后端

1. 打开 [Render Dashboard](https://dashboard.render.com/)
2. 点击 `New`
3. 选择 `Web Service`
4. 连接 GitHub 仓库
5. 选择当前仓库

填写：

- `Name`: `screenshot-to-code-backend-py310`
- `Branch`: `main`
- `Runtime`: `Python`
- `Build Command`: `cd backend && poetry install --no-interaction --no-ansi`
- `Start Command`: `cd backend && poetry run uvicorn main:app --host 0.0.0.0 --port $PORT`

然后添加环境变量：

```bash
PYTHON_VERSION=3.10.20
POETRY_VERSION=2.3.2
IS_PROD=true
ALLOWED_CORS_ORIGINS=https://你的前端域名.onrender.com
SCREENSHOT_TO_CODE_DATA_DIR=/tmp/screenshot-to-code
LOCAL_ASSET_DIR=/tmp/screenshot-to-code/local-assets
```

再补上至少一个可用模型 Key：

```bash
OPENAI_API_KEY=...
```

没有任何模型 Key 时：

- 服务能启动
- 但 `/api/readyz` 不会处于可用状态
- 生成代码功能无法正常使用

### 7.2 创建前端

1. 点击 `New`
2. 选择 `Static Site`
3. 连接同一个 GitHub 仓库
4. 选择当前仓库

填写：

- `Name`: `screenshot-to-code-frontend`
- `Build Command`: `cd frontend && pnpm install --frozen-lockfile && pnpm build-hosted`
- `Publish Directory`: `frontend/dist`

环境变量：

```bash
VITE_HTTP_BACKEND_URL=https://你的后端域名.onrender.com
VITE_WS_BACKEND_URL=wss://你的后端域名.onrender.com
VITE_IS_DEPLOYED=true
```

### 7.3 SPA 回退

前端使用 `BrowserRouter`，所以 Render 需要把未知路径回退到 `/index.html`。仓库里的 `render.yaml` 已经包含这条 rewrite 规则。

如果你是手动建站，也需要在 Static Site 里配置等价规则，否则刷新类似 `/evals` 这类前端路由时可能 404。

## 8. 上线后的检查方法

后端健康检查：

```text
https://你的后端域名/api/healthz
```

期望响应：

```json
{"status":"ok"}
```

后端就绪检查：

```text
https://你的后端域名/api/readyz
```

如果至少一个模型 Key 有效，应该能返回可用状态。

这次线上实际验证结果：

- `https://screenshot-to-code-backend-py310.onrender.com/api/healthz` 返回 `{"status":"ok"}`
- `https://screenshot-to-code-backend-py310.onrender.com/api/readyz` 返回 `ready`

前端访问检查：

- 打开前端首页
- 发起一次生成请求
- 确认浏览器能成功连接后端 WebSocket

## 9. 当前部署的已知限制

### 9.1 后端数据不是持久化的

当前免费版方案把数据写在 `/tmp`，因此这些内容都可能在服务重启后消失：

- 用户数据 JSON
- 项目数据 JSON
- 设计系统数据
- 本地上传资源

### 9.2 Cookie / 登录能力最好单独复查

如果你后面要正式启用账户登录，建议复查生产环境 Cookie 行为，尤其是：

- `secure`
- `samesite`
- 前后端域名分离时的跨站行为

相关代码位置：

- [backend/routes/accounts.py](/Users/czy/Documents/screenshot-to-code/backend/routes/accounts.py)

### 9.3 前端 lint 当前有仓库既有问题

这次整理部署文档前后，我重新验证过：

- 后端测试通过
- 后端 `pyright` 通过
- 前端 `pnpm lint` 失败，但属于仓库已有问题，不是这次 Render 配置修改引入的

## 10. 本地对照验证命令

后端：

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

前端：

```bash
cd frontend
pnpm install
VITE_HTTP_BACKEND_URL=http://127.0.0.1:7001 \
VITE_WS_BACKEND_URL=ws://127.0.0.1:7001 \
VITE_IS_DEPLOYED=true \
pnpm build-hosted
pnpm preview --host 0.0.0.0
```

## 11. 清理失败服务

这次部署过程中创建过两个失败的后端服务：

- `screenshot-to-code-backend`
- `screenshot-to-code-backend-app`

我已经确认当前可用的 Render MCP 只有创建、更新、查服务、查部署等能力，没有“删除服务”的 MCP 工具。

如果你要清理它们，需要在 Render 控制台手动删除：

1. 打开对应服务页面
2. 进入 `Settings`
3. 选择 `Delete Service`

当前保留的正式服务建议是：

- 前端：`screenshot-to-code-frontend`
- 后端：`screenshot-to-code-backend-py310`
