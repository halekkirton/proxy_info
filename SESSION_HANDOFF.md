# 换机与会话恢复交接

最后整理：2026-10-19。本文件是项目交接说明，不是 Codex 原始会话存档；在新机器开新会话，要求助手先读本文件即可接续工作。

## 新机器开始

安装 Git 和 Node.js 22 或更高版本，使用你自己的 GitHub 凭据登录，然后执行：

```powershell
git clone https://github.com/toml66l/airport.git
cd airport
npm ci
npm run dev
```

打开 `http://127.0.0.1:4173/` 查看网站。若已复制完整仓库，直接进入该目录，先检查 `git status`，不要覆盖未提交修改。

将下面这段发送给新机器上的编码助手：

```text
请先读取当前项目的 SESSION_HANDOFF.md、README.md、site/EDITORIAL.md 和 humanize-writing/SKILL.md，再继续工作。先检查 Git 状态与远程提交，不要恢复用户已删除的文件，不要强制推送。文章必须遵循 humanize-writing 的适用指令；不要虚构经历、数据或引用。当前优先事项是确认远程同步及 GitHub Pages 部署，然后启动预览供我查看。
```

## 用户要求与已完成内容

- 用户要求把现有十篇中文网络工具科普文章做成 GitHub Pages 网站，可纠错、补充，但文章严格遵循 `humanize-writing`。
- 已实现首页、十篇独立文章页、分组目录、页内目录、上下篇导航、关于与免责声明、404 页面，以及响应式手机布局。
- 使用 Node.js 与 markdown-it 生成静态 HTML；不依赖数据库、外部字体、统计、广告或 CDN。JavaScript 只做阅读进度与目录高亮，禁用后仍能阅读导航。
- 已为文章补充官方资料链接，修正协议分层、VPN 与 HTTPS 边界、v2rayN 平台支持、Mihomo 与客户端关系、TUN 与全局模式等表述。
- 采用 skill 指令 12、13、21、23，保留已经自然的表达，不全量套用 25 条，不编造第一人称经历，不故意加入逻辑错误。
- 内容技术复核日期为 2026-10-18，不要仅因构建或换机就自动更新文章复核日期。

## 文件与命令

| 路径 | 用途 |
|---|---|
| `github_article/代理工具生态入门系列-最终版/` | 十篇文章的唯一正文来源 |
| `humanize-writing/SKILL.md` | 写作与润色规范，换机后也须读取 |
| `site/EDITORIAL.md` | 本轮编辑方法、事实修订与来源边界 |
| `site/config.json` | 站名、文章摘要、分组、顺序、固定网址 |
| `site/assets/` | CSS、渐进增强脚本与图标 |
| `scripts/` | 构建、预览、结构检查及浏览器检查 |
| `.github/workflows/pages.yml` | 推送 main 后构建并部署 Pages |
| `README.md` | 完整使用、部署及子路径测试说明 |

```powershell
npm run build
npm run check
npm run test:browser
```

浏览器测试使用本地 Microsoft Edge；其他环境参见 README 的 Chromium 安装说明。`dist/`、`.preview/`、`node_modules/` 均已忽略，不应提交。

## 已完成验证

- 根路径与 `/airport/` 部署子路径的构建和结构检查通过：13 个 HTML 文件、557 个内部链接，以及标题、引用、元数据和路径检查。
- 浏览器检查通过：1440、390、320 像素宽度下的 12 个正常页面、导航、404、横向溢出与脚本错误检查。
- 禁用 JavaScript 后的手机目录与文章导航检查通过。
- 已完成脚本语法检查与 `git diff --check`。
- 本地持久预览服务尚未确认启动；换机后运行 `npm run dev`，不要假定已有后台服务。

## Git 与发布状态

- 远程：`https://github.com/toml66l/airport.git`，分支：`main`。
- 网站与文章的实现提交：`9656bfe`，说明：`Build GitHub Pages guide site and refine ten articles`。
- 该提交保留了用户此前删除无用脚本、旧首页与重复文章目录的清理，不要擅自恢复。
- 此前推送曾被 GitHub 拒绝，原因是 Token 缺少 `workflow` 权限；用户表示已添加权限，后续重试遇到连接重置和连接超时。
- 上述为交接文档编写前的历史状态，不代表当前推送结果。用下面的命令核对，远程分支应包含实现提交及本交接文档所在提交：

```powershell
git status --short
git log -3 --oneline
git fetch origin
git log --oneline origin/main..HEAD
```

最后一条有输出表示本地仍有未推送提交；确认后用 `git push origin main`，不要使用 force。若网络失败，先检查网络及代理配置，不要绕过 TLS 校验或把 Token 填进远程 URL。

## 下一步

1. 确认本地提交已推送，GitHub Actions 构建是否成功；本次尚未确认线上部署完成。
2. 在仓库 Settings → Pages 中将 Source 设为 GitHub Actions，再查看 Build and deploy guide 工作流。
3. 启动本地预览，让用户先看首页和文章页，再按反馈调整设计或内容。

## 凭据边界

本文件不保存 Token、密码、认证缓存或个人 Codex 配置。新机器应通过 GitHub 登录流程或可信凭据管理器单独配置。不要将凭据加入 Git，也不要把整个个人配置目录作为公开仓库的一部分同步。
