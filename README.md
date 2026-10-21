# 科学上网入门手册

一个为十篇中文科普文章制作的 GitHub Pages 静态站点。纸白与墨绿配色、分组阅读目录、独立文章页，不依赖前端框架，也不需要数据库。

换机器或开启新会话时，先读 [会话恢复交接文档](SESSION_HANDOFF.md)，其中记录了已完成工作、验证结果与待办事项。

当前为分批发布第 1 版：首页、第 01 篇和关于页。完整正文继续保留在仓库，后续按 [六版发布计划](site/RELEASE_PLAN.md) 逐批增加页面和入口，不使用发布开关或草稿系统。

## 本地看效果

需要 Node.js 22 或更高版本。在当前仓库目录执行：

```powershell
npm ci
npm run dev
```

浏览器打开 `http://127.0.0.1:4173/`。修改文章或 `site/` 文件后会重新生成页面，刷新浏览器即可。按 `Ctrl+C` 停止预览。

```powershell
npm run build
npm run check
npm run preview
```

`build` 生成 `dist/`，`check` 校验页面结构、站内链接、锚点、引用区域与部署子路径，`preview` 启动本地服务器。不要直接双击生成的 HTML；站点资源与导航需要通过 HTTP 服务器访问。

## 发布到 GitHub Pages

1. 在 GitHub 仓库的 `Settings → Pages → Build and deployment → Source` 选择 **GitHub Actions**。
2. 将本项目更改推送到 `main`。工作流位于 `.github/workflows/pages.yml`，也支持手动运行。
3. 在 `Actions` 中查看 **Build and deploy guide**；构建检查通过后才部署。
4. 使用部署任务输出的地址访问网站。首次启用 Pages 后，可以在 Actions 中重新运行工作流。

不需要切换到 `gh-pages` 分支，不要将发布目录设置成文章源目录。工作流只上传生成的 `dist/`，不会发布技能文件、工作记录或整个仓库文件树。

部署时通过 `actions/configure-pages` 读取真实站点地址：仓库站点的 `/proxy_info/` 子路径、自定义域名与用户首页都由同一份模板处理。更换仓库、分支或所有者后，同步修改 `site/config.json` 的仓库信息和工作流分支。

参考：[GitHub 官方自定义 Pages 工作流说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 模拟仓库子路径

```powershell
$env:SITE_URL='https://toml66l.github.io/proxy_info'
npm run build
npm run check
npm run preview
```

此时本地地址为 `http://127.0.0.1:4173/proxy_info/`。恢复根路径预览前执行：

```powershell
Remove-Item Env:SITE_URL -ErrorAction SilentlyContinue
npm run dev
```

有 `SITE_URL` 时构建会输出 canonical、站点地图和 robots 的站点地图地址；不设置时是本地预览模式，不会伪造正式站点地址。也可以单独设置 `BASE_PATH=/proxy_info` 测试子路径。

## 内容在哪里改

```text
github_article/代理工具生态入门系列-最终版/  唯一的文章正文来源
site/config.json                           站名、摘要、分组、顺序与固定网址
site/about.md                              关于、隐私与免责声明
site/assets/                               样式、少量渐进增强脚本、图标
scripts/build.mjs                          Markdown 转独立 HTML 页面
scripts/serve.mjs                          本地静态服务器与文件监听
scripts/check.mjs                          构建产物检查
.github/workflows/pages.yml                 Pages 构建与部署
```

正文不需要 YAML 头部。每篇保留一个 `#` 标题，用 `##`、`###` 组织章节；构建时自动生成本文目录。表格在小屏幕可横向滚动。无 JavaScript 仍能阅读、使用章节目录和跳转上下篇。

`site/config.json` 中的 `reviewed` 是人工内容复核日期，不是部署日期。实际复核后才更新，不能为了让文章看起来新而每天自动修改。

文章编辑遵循 `humanize-writing/SKILL.md`。具体执行边界与本轮修订重点见 `site/EDITORIAL.md`。完整资料来源放在各篇文末。

## 浏览器回归检查

安装依赖后，若本机有 Microsoft Edge：

```powershell
npm run test:browser
```

其他环境可先执行 `npx playwright install chromium` 再运行。可用 `BROWSER_PATH` 指定浏览器可执行文件。

检查覆盖桌面与手机的页面加载、横向溢出、文章数量、目录、上下篇导航和 404；截图保存于已忽略的 `.preview/`。不自动访问第三方服务。

## 说明

站点不接入统计、广告、外部字体或评论服务。外部参考链接与托管平台仍有各自的隐私政策。项目没有替文章声明未经授权的内容许可；若要开放转载，应由权利人另行明确授权范围。

## 服务信息入口与 SEO

首页以及配置、安全相关文章末尾预留服务信息区域。在 `site/config.json` 的 `promotion.url` 填写完整的 HTTPS GitHub 推荐页面地址即可显示按钮；空值时仅显示整理中提示。`promotion.label` 和 `promotion.description` 控制入口文案。源码入口与推荐入口独立。

`seoTitle` 控制首页搜索标题；文章使用各自真实标题，并分别维护搜索描述 description 与卡片摘要 summary，不添加关键词堆砌。正式构建使用 `SITE_URL` 设置真实部署地址，生成 canonical 与 sitemap。404 保持 noindex 且不输出 canonical。
