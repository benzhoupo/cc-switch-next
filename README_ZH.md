[English](README.md) | 中文

## 为什么选择 CC Switch Next？

CC Switch Next 是 [CC Switch](https://github.com/farion1231/cc-switch) 的一个分支，是一个管理 AI 编程工具的桌面 GUI。它提供可视化界面来导入和切换 API 供应商，内置 50+ 预设，以及统一的 MCP/Skills 管理。

### CC Switch Next 的新特性

- **omp (Oh My Pi) 支持** — 完整接入 omp 编程代理，包括供应商管理、MCP 同步和 YAML 配置处理
- **精简供应商列表** — 移除杂牌代理商，仅保留知名品牌和平台
- **扩展多工具覆盖** — 支持 8 个工具：Claude Code、Claude Desktop、Codex、Gemini CLI、OpenCode、OpenClaw、Hermes 和 Oh My Pi

**核心功能：**

- **可视化供应商管理** — 50+ 预设覆盖各大 AI 平台（Anthropic、OpenAI、Google、DeepSeek、Kimi、智谱等）；一键切换
- **统一 MCP 与 Skills** — 单一面板管理支持的多个工具的 MCP 服务器和 Skills，双向同步
- **代理与故障转移** — 本地代理热切换、格式转换、自动故障转移与熔断
- **会话管理器** — 浏览、搜索和恢复支持的会话来源
- **系统托盘快速切换** — 托盘菜单直接切换，无需打开完整应用
- **用量追踪** — 支出、请求和 Token 趋势图表，自定义模型定价
- **云同步** — 通过 Dropbox、OneDrive、iCloud 或 WebDAV 跨设备同步
- **Deep Link 导入** — `ccswitch://` URL 机制一键导入供应商、MCP、提示词和技能
- **跨平台** — 基于 Tauri 2 构建，支持 Windows、macOS、Linux
- **原子写入** — 所有配置变更使用临时文件 + 重命名防止损坏

## 界面预览

|                  主界面                   |                  添加供应商                  |
| :---------------------------------------: | :------------------------------------------: |
| ![主界面](assets/screenshots/main-en.png) | ![添加供应商](assets/screenshots/add-en.png) |

## 功能特性

### 供应商管理

- **8 个支持工具，50+ 预设** — Claude Code、Claude Desktop、Codex、Gemini CLI、OpenCode、OpenClaw、Hermes、omp
- **通用供应商** — 一份配置同步到 Claude Code、Codex 和 Gemini CLI
- 一键切换、系统托盘快速访问、拖拽排序、导入导出

### MCP、Prompts 与 Skills

- **统一 MCP 面板** — 管理 Claude、Codex、Gemini、OpenCode、Hermes 和 omp 的 MCP 服务器，双向同步
- **Prompts** — Markdown 编辑器，跨应用同步（CLAUDE.md / AGENTS.md / GEMINI.md），回填保护
- **Skills** — 从 GitHub 仓库或 ZIP 文件一键安装，自定义仓库管理，支持软连接和文件复制

### 用量与成本追踪

- **用量仪表盘** — 跨供应商追踪支出、请求数和 Token 用量，趋势图表、详细请求日志和自定义模型定价

### 会话管理器与工作区

- 浏览、搜索和恢复支持的会话来源
- **工作区编辑器**（OpenClaw）— 编辑 Agent 文件（AGENTS.md、SOUL.md 等），支持 Markdown 预览

### 系统与平台

- **云同步** — 自定义配置目录（Dropbox、OneDrive、iCloud、坚果云、NAS）及 WebDAV 服务器同步
- **Deep Link** (`ccswitch://`) — 通过 URL 一键导入供应商、MCP 服务器、提示词和技能
- 深色 / 浅色 / 跟随系统主题、开机自启、自动更新、原子写入、自动备份、国际化（简中/繁中/英/日）

## 常见问题

<details>
<summary><strong>CC Switch Next 支持哪些 AI 工具？</strong></summary>

CC Switch Next 支持八个工具：**Claude Code**、**Claude Desktop**、**Codex**、**Gemini CLI**、**OpenCode**、**OpenClaw**、**Hermes** 和 **omp**。每个工具都有专属的供应商预设和配置管理。

</details>

<details>
<summary><strong>切换供应商后需要重启终端吗？</strong></summary>

大多数工具需要重启终端或 CLI 工具才能使更改生效。例外的是 **Claude Code**，它目前支持供应商数据的热切换，无需重启。

</details>

<details>
<summary><strong>切换供应商之后我的插件配置怎么不见了？</strong></summary>

CC Switch Next 使用"通用配置片段"功能，在不同的供应商之间传递 Key 和请求地址之外的通用数据，您可以在"编辑供应商"菜单的"通用配置面板"里，点击"从当前供应商提取"，把所有的通用数据提取到通用配置中，之后在新建"供应商"的时候，只要勾选"写入通用配置"（默认勾选），就会把插件等数据写入到新的供应商配置中。您的所有配置项都会保存在运行本软件的时候，第一次导入的默认供应商里面，不会丢失。

</details>

<details>
<summary><strong>为什么总有一个正在激活中的供应商无法删除？</strong></summary>

本软件的设计原则是"最小侵入性"，即使卸载本软件，也不会影响应用的正常使用。

所以系统总会保留一个正在激活中的配置，因为如果将所有配置全部删除，该应用将无法正常使用。如果你不经常使用某个对应的应用，可以在设置中关掉该应用的显示。如果你想切换回官方登录，可以参考下条。

</details>

<details>
<summary><strong>如何切换回官方登录？</strong></summary>

可以在预设供应商里面添加一个官方供应商。切换过去之后，执行一遍 Log out / Log in 流程，之后便可以在官方供应商和第三方供应商之间随意切换。CodeX 可以在不同官方供应商之间进行切换，方便多个 Plus 或者 Team 账号之间切换。

</details>

<details>
<summary><strong>我的数据存储在哪里？</strong></summary>

- **数据库**：`~/.cc-switch/cc-switch.db`（SQLite — 供应商、MCP、提示词、技能）
- **本地设置**：`~/.cc-switch/settings.json`（设备级 UI 偏好设置）
- **备份**：`~/.cc-switch/backups/`（自动轮换，保留最近 10 个）
- **SKILLS**：`~/.cc-switch/skills/`（默认通过软链接连接到对应应用）
- **技能备份**：`~/.cc-switch/skill-backups/`（卸载前自动创建，保留最近 20 个）

</details>

## 快速开始

### 基本使用

1. **添加供应商**：点击"添加供应商" → 选择预设或创建自定义配置
2. **切换供应商**：
   - 主界面：选择供应商 → 点击"启用"
   - 系统托盘：直接点击供应商名称（立即生效）
3. **生效方式**：重启终端或对应的 CLI 工具以应用更改（CLaude Code 无需重启）
4. **恢复官方登录**：添加"官方登录"预设，重启 CLI 工具后按照其登录/OAuth 流程操作

### MCP、Prompts、Skills 与会话

- **MCP**：点击"MCP"按钮 → 通过模板或自定义配置添加服务器 → 切换各应用同步开关
- **Prompts**：点击"Prompts" → 使用 Markdown 编辑器创建预设 → 激活后同步到 live 文件
- **Skills**：点击"Skills" → 浏览 GitHub 仓库 → 一键安装到支持的应用
- **会话**：点击"Sessions" → 浏览、搜索和恢复支持的会话来源

> **注意**：首次启动可以手动导入现有 CLI 工具配置作为默认供应商。

## 下载

从 [Releases](https://github.com/benzhoupo/cc-switch-next/releases) 页面下载最新的 Windows 安装包。

- `CC Switch Next_x.x.x_x64-setup.exe`（NSIS 安装包）

### 系统要求

- **Windows**：Windows 10 及以上

<details>
<summary><strong>架构总览</strong></summary>

### 设计原则

```
┌─────────────────────────────────────────────────────────────┐
│                    前端 (React + TS)                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │ Components  │  │    Hooks     │  │  TanStack Query  │    │
│  │   （UI）     │──│ （业务逻辑）   │──│   （缓存/同步）    │    │
│  └─────────────┘  └──────────────┘  └──────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │ Tauri IPC
┌────────────────────────▼────────────────────────────────────┐
│                  后端 (Tauri + Rust)                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │  Commands   │  │   Services   │  │  Models/Config   │    │
│  │ （API 层）   │──│  （业务层）    │──│    （数据）       │    │
│  └─────────────┘  └──────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**核心设计模式**

- **SSOT**（单一事实源）：所有数据存储在 `~/.cc-switch/cc-switch.db`（SQLite）
- **双层存储**：SQLite 存储可同步数据，JSON 存储设备级设置
- **双向同步**：切换时写入 live 文件，编辑当前供应商时从 live 回填
- **原子写入**：临时文件 + 重命名模式防止配置损坏
- **并发安全**：Mutex 保护的数据库连接避免竞态条件
- **分层架构**：清晰分离（Commands → Services → DAO → Database）

**核心组件**

- **ProviderService**：供应商增删改查、切换、回填、排序
- **McpService**：MCP 服务器管理、导入导出、live 文件同步
- **ProxyService**：本地 Proxy 模式，支持热切换和格式转换
- **SessionManager**：全应用会话历史浏览
- **ConfigService**：配置导入导出、备份轮换
- **SpeedtestService**：API 端点延迟测量

</details>

<details>
<summary><strong>开发指南</strong></summary>

### 环境要求

- Node.js 18+
- pnpm 8+
- Rust 1.85+
- Tauri CLI 2.8+

### 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式（热重载）
pnpm dev

# 类型检查
pnpm typecheck

# 代码格式化
pnpm format

# 检查代码格式
pnpm format:check

# 运行前端单元测试
pnpm test:unit

# 监听模式运行测试（推荐开发时使用）
pnpm test:unit:watch

# 构建应用
pnpm build

# 构建调试版本
pnpm tauri build --debug
```

### Rust 后端开发

```bash
cd src-tauri

# 格式化 Rust 代码
cargo fmt

# 运行 clippy 检查
cargo clippy

# 运行后端测试
cargo test

# 运行特定测试
cargo test test_name

# 运行带测试 hooks 的测试
cargo test --features test-hooks
```

### 测试说明

**前端测试**：

- 使用 **vitest** 作为测试框架
- 使用 **MSW (Mock Service Worker)** 模拟 Tauri API 调用
- 使用 **@testing-library/react** 进行组件测试

**运行测试**：

```bash
# 运行所有测试
pnpm test:unit

# 监听模式（自动重跑）
pnpm test:unit:watch

# 带覆盖率报告
pnpm test:unit --coverage
```

### 技术栈

**前端**：React 18 · TypeScript · Vite · TailwindCSS 3.4 · TanStack Query v5 · react-i18next · react-hook-form · zod · shadcn/ui · @dnd-kit

**后端**：Tauri 2.8 · Rust · serde · tokio · thiserror · tauri-plugin-updater/process/dialog/store/log

**测试**：vitest · MSW · @testing-library/react

</details>

<details>
<summary><strong>项目结构</strong></summary>

```
├── src/                        # 前端 (React + TypeScript)
│   ├── components/
│   │   ├── providers/          # 供应商管理
│   │   ├── mcp/                # MCP 面板
│   │   ├── prompts/            # Prompts 管理
│   │   ├── skills/             # Skills 管理
│   │   ├── sessions/           # 会话管理器
│   │   ├── proxy/              # Proxy 模式面板
│   │   ├── openclaw/           # OpenClaw 配置面板
│   │   ├── settings/           # 设置（终端/备份/关于）
│   │   ├── deeplink/           # Deep Link 导入
│   │   ├── env/                # 环境变量管理
│   │   ├── universal/          # 跨应用配置
│   │   ├── usage/              # 用量统计
│   │   └── ui/                 # shadcn/ui 组件库
│   ├── hooks/                  # 自定义 hooks（业务逻辑）
│   ├── lib/
│   │   ├── api/                # Tauri API 封装（类型安全）
│   │   └── query/              # TanStack Query 配置
│   ├── locales/                # 翻译 (zh/zh-TW/en/ja)
│   ├── config/                 # 预设 (providers/mcp)
│   └── types/                  # TypeScript 类型定义
├── src-tauri/                  # 后端 (Rust)
│   └── src/
│       ├── commands/           # Tauri 命令层（按领域）
│       ├── services/           # 业务逻辑层
│       ├── database/           # SQLite DAO 层
│       ├── proxy/              # Proxy 模块
│       ├── session_manager/    # 会话管理
│       ├── deeplink/           # Deep Link 处理
│       └── mcp/                # MCP 同步模块
├── tests/                      # 前端测试
└── assets/                     # 截图 & 合作商资源
```

</details>

## 贡献

欢迎提交 Issue 反馈问题和建议！

提交 PR 前请确保：

- 通过类型检查：`pnpm typecheck`
- 通过格式检查：`pnpm format:check`
- 通过单元测试：`pnpm test:unit`

新功能开发前，欢迎先开 Issue 讨论实现方案，不适合项目的功能性 PR 有可能会被关闭。

<div align="center">
  <img src="assets/deepseek-v4.svg" width="24" height="24" alt="DeepSeek V4" />
  <br/>
  <strong>Assisted by: DeepSeek V4</strong>
</div>

## License

MIT © benzhoupo
