# 会话恢复与项目交接

最后整理：2026-10-20。本文件记录可恢复工作的项目状态、用户决定和未来规划，不是原始聊天逐字存档。恢复时以实际文件与 Git 状态为准，不把规划当成已发布内容。

## 给接续助手

2026-10-21 更新：当前本地工作目录为 `D:\seo\proxy_info`，Windows PowerShell 环境，不沿用下段历史 macOS 路径或 `rtk` 前缀要求。用户明确要求简单的逐版手工发布，不做 `published` 开关系统。当前整理为 V1：首页＋01＋关于，后续按 `site/RELEASE_PLAN.md` 执行。旧的“10 篇全部构建”和旧验证结果只代表历史版本；本次未提交、未推送，也未核实 Pages 线上状态。

V1 本次验证：根路径与 `/proxy_info/` 子路径的 build、check 均通过，3 个正常页面＋404、68 条内部链接；1440/390/320 三种宽度浏览器回归和无 JS 手机目录、01 → 关于导航通过，未发布的 02 地址返回 404。截图已检查；`git diff --check` 通过（仅有 Windows 行尾提示）。已安装依赖，最终 dist 恢复为根路径本地预览构建。私有仓库入口、查看原文和私有 Issues 入口已隐藏；官方参考链接保留。尚无线上部署结果。

先读本文件、README.md、site/EDITORIAL.md、humanize-writing/SKILL.md、site/CONTENT_ROADMAP.md 和 site/config.json。检查 Git 状态后再操作，保留未提交修改，不强制推送，不恢复用户已删除的旧脚本。当前目录为 /Users/mrren/CodeBuddy/proxy_info；遵循适用的 AGENTS.md，其中引用 /Users/mrren/.codex/RTK.md，当前环境的 shell 命令需以 rtk 为前缀。

用户重视直接完成工作，避免重复确认已授权的常规操作。文章必须自然、准确，不编造经历、测试、数据或来源，不保证 AI 检测结果。不要把历史 Token、密码或个人配置写入文件、提交或远程地址。

## 当前项目与版本

- 站名：科学上网入门手册，已替换“网络工具入门手册”。
- 当前远程：https://github.com/toml66l/proxy_info.git；分支 main。
- 本地最新提交：6ecb7e2，Import airport guide site；此前已成功推送初始导入。此次未联网重新核对远程分支。
- 用户已于 2026-10-20 要求通过本地 HTTP 代理 127.0.0.1:7897 提交并推送当前页面、SEO、文章、关键词 CSV 与路线图。提交号和远程同步情况应通过 git log、git status 与远程查询确认，不依赖本文静态记录。
- Git 网络操作长期规则：拉取、远程查询、提交后的推送均通过本地 HTTP 代理 `http://127.0.0.1:7897`；优先使用单次命令参数（例如 `git -c http.proxy=http://127.0.0.1:7897 pull`、`git -c http.proxy=http://127.0.0.1:7897 push`），不要修改 Git 全局代理配置。
- 旧恢复文件中的 airport 仓库、9656bfe 提交及早期推送失败记录已被当前状态替代，不应继续作为当前部署依据。
- GitHub Actions、Pages 真实线上部署结果尚未确认，不应宣称已经上线。

## 网站实现与路径

Node.js 22+ 与 markdown-it 构建静态站；无数据库或前端框架。首页、十篇文章、关于页共 12 个正常页面，另有 404。具有分组目录、页内目录、上下篇、移动端布局、阅读进度与目录高亮；禁用 JavaScript 后仍可阅读导航。纸白与墨绿视觉已获用户认可，不需另起设计。

| 路径 | 用途 |
|---|---|
| github_article/代理工具生态入门系列-最终版/ | 01–10 Markdown 为唯一正文来源 |
| humanize-writing/SKILL.md | 用户明确指定的写作规范 |
| site/EDITORIAL.md | 编辑规则、技术修订与本轮逐篇记录 |
| site/config.json | 站名、SEO、分组、固定 URL、推广入口与复核日期 |
| site/about.md | 关于、隐私和使用边界 |
| site/assets/ | 样式、图标和渐进增强脚本 |
| scripts/build.mjs | Markdown 转 HTML 与元数据生成 |
| scripts/serve.mjs | 本地预览，可通过 PORT 指定端口 |
| scripts/check.mjs | 页面、链接、锚点、引用和元数据检查 |
| scripts/browser-check.mjs | 桌面、移动端与无 JS 检查 |
| .github/workflows/pages.yml | main 分支的 Pages 构建部署 |
| KeywordStats_2026_10_20.csv | Bing 下载的关键词、趋势与印象数 |
| site/CONTENT_ROADMAP.md | 104 个编号选题及分站候选方案 |

构建输出 dist/，与 node_modules/、.preview/ 一样被 Git 忽略。不要直接编辑生成 HTML。无外部字体、CDN、统计、评论或广告脚本。用户已说不用管脚本，.codebuddy/memory 中的旧脚本不是本次工作目标。

## 用户已确定的商业与编辑方向

目标是自然搜索引流，经自己的 GitHub 推荐页面导向机场服务，赚取推广佣金。站内不会直接放机场链接，用户提供的是 GitHub 页面地址；该地址目前仍未提供，具体机场、套餐和资料以后再定。

用户明确不希望加可见的佣金说明，不要在后续编辑中擅自恢复。保留已有链接 sponsored 属性；不能伪造独立测评、实测经历或性能保证。

首页与第 07、09 篇已有独立服务信息区域。site/config.json 的 promotion.url 为空时显示“机场与订阅服务整理将在 GitHub 发布，目前尚未开放入口。”；填入完整 HTTPS github.com 页面后显示按钮，构建会校验 URL。源码仓库入口与推荐入口分开。首页“不推荐服务 · 不贩卖焦虑”已改为“先懂原理 · 再选服务”，页脚使用“科普内容与服务信息分开”。

不推广免费机场、免费节点或免费试用。用户认为免费服务在需要时不可用的代价很高，这是选择方向，不应冒充作者亲身故事，也不能推断所有免费服务都差。识别“永久免费且无限速”等不可靠承诺的提醒可以保留。

## Bing SEO 与页面描述

主要目标搜索引擎是 Bing，承接真实长尾需求，不过度优化。参考根目录 CSV（UTF-8 BOM，关键字/趋势/印象数）；印象数不是搜索量、竞争度或排名保证。品牌导航、招聘、节日等无关词，以及空格和拼写变体不堆砌。

已按主题融入机场订阅、机场节点、机场 VPN、代理机场、Clash 订阅兼容、机场测速、机场测评、性价比机场、按量计费机场等词。不做缺乏实测的排行和比较。文章各有 description，卡片 summary 独立；首页也已有 description，用户了解后表示有就算了，不必为加长而加长。

首页 seoTitle 为“代理、VPN、Clash 与订阅配置入门｜科学上网入门手册”。已有 canonical、OG、Twitter 摘要、sitemap、robots；404 noindex 且无 canonical。只有设置真实 SITE_URL 才生成正式站点地址。

用户担心没有外链时难以收录。此前讨论过 Bing Webmaster Tools、提交 sitemap、URL 检查与 IndexNow，尚未实际配置；独立域名也未选定。不能保证收录或收益，不把多站当作必然提升排名的方法。

## 十篇文章的定位与本轮复查

当前十篇保留为入门主站：01 基础概念；02 代理/VPN/Tor；03 工具生态；04 协议；05 Clash/Mihomo；06 V2Ray/Xray/客户端；07 配置订阅节点规则；08 基础排查；09 安全可靠性与服务选择；10 隐私法律边界。固定 URL 不变，不因分站规划迁移这十篇。进阶配置、企业部署与游戏内容以后另站承接。

2026-10-20 已逐篇润色，遵循 skill 指令 12、13、21、23：削减重复铺垫、框架词、口号和整套比喻，调整长短句与段落衔接，把关键词放进实际相关的讨论。第 02 篇标题缓和训诫语气，第 10 篇修正对象列举的歧义；技术关系、限制与参考资料保留。逐篇修改见 EDITORIAL。

没有全套使用 25 条，不添加虚构第一人称，不故意制造逻辑错误，不承诺其他 AI 无法识别。此前技术复核日期仍为 2026-10-18；此次表达复查不等于重新在线验证全部资料，不自动刷新 reviewed。

重要技术边界：HTTP CONNECT 与 SOCKS5 能力看实现；VPN 隧道和 HTTPS 不同层；核心、客户端、协议、配置、服务不可混称；Clash Verge Rev 内置 Mihomo，切换范围随版本；v2rayN 官方已列 Windows/Linux/macOS；全局模式仅处理进入核心的流量，TUN 范围仍受权限、路由、排除规则影响；状态成功不等于全部目标可达；技术来源不是具体法律依据。

## 多站与后续选题

用户明确倾向多个独立站点，分散 Bing 不收录、失去展示或搜索表现下降的风险，不希望所有主题揉进一个 GitHub 页面。候选分工：

1. 当前站：科学上网入门、服务选择与基础排查。
2. 客户端与进阶代理：Clash/Mihomo/sing-box、Proxifier、代理链、DNS、开发环境。
3. 自建网络与企业 VPN：远程接入、WireGuard/OpenVPN、企业权限和运维。
4. 游戏网络与加速器：延迟、抖动、丢包、NAT、游戏场景与加速器判断。

账号、仓库、域名、最终拆分与上线节奏未确定。各站应有独立内容，不复制铺站或批量互链；多站可能增加维护成本，也不能保证收录。

路线图共 104 个编号选题，前 38 项较详细，后续部分较简略；是选题和提纲，不是已完成文章。包括自建机场、自建 VPN、Clash 负载均衡、二层代理/代理链、Proxifier、ltproxy、企业 VPN、游戏加速、路由器与开发环境。ltproxy 具体指哪个项目尚不明确，需要用户提供项目地址后再写，不能凭名称猜测。

候选优先五篇：Proxifier、二层代理/代理链、Clash 负载均衡、自建 VPN 的 WireGuard/OpenVPN、机场测速如何理解。并非已经承诺的发布排期。

自建内容必须讲经济风险：VPS 或 IP 买后不可用、线路不合适、年付锁定和退款受限、流量/备用机/换 IP 额外支出、时间成本、迁移重购与剩余套餐损失。即使初始可用，后续仍可能出现 IP、端口或连接被封锁或限制；不能保证一次搭建长期可用，也不能把所有断连直接归因于封锁。

## 本地预览与部署

此前 4713 出现停止和 404，排查后用户确认可用。默认端口仍是 4173；延续这次查看时使用 4713，不应假定后台进程一直存在。先检查端口，避免重复启动或杀掉无关进程。

macOS/zsh 示例（当前环境命令前加 rtk）：

```sh
rtk npm ci
rtk proxy env PORT=4713 node scripts/serve.mjs
```

打开 http://127.0.0.1:4713/。普通预览在启动时构建，编辑后需再次 build；需要监听时可用 --watch，但此前受环境监听限制出现过 EMFILE。启动监听服务可能需要环境授权。不要把 HTTP 200 当成页面正确，必要时在浏览器确认标题和正文。

部署可选两条路线，无须再用 Jekyll 将 Markdown 转 HTML：

- 源码仓库走 Actions：Settings → Pages → Source 选 GitHub Actions，main 推送触发已有工作流，读取真实 Pages base URL，构建检查后上传 dist。
- 手工发布：先按实际地址重建，把 dist 的全部内容（包括 .nojekyll）放到发布仓库的分支根目录，Pages 选 Deploy from a branch 与该分支 / (root)。不需要把 dist 文件夹本身套在外层。注意不要将源码仓库整棵目录误当发布产物，也不要与 Actions 配置混用。

仓库站点发布前示例：

```sh
rtk proxy env SITE_URL=https://toml66l.github.io/proxy_info npm run build
rtk npm run check
```

用户名主页或自定义域名应换成真实地址。当前 dist 已恢复为根路径本地预览构建，不能不重建就当作 /proxy_info/ 正式发布包。README 已同步更正旧 /airport/ 示例。

## 验证与下一步

## 分批发布计划

详细执行清单以 `site/RELEASE_PLAN.md` 为准，其中包括固定 URL、基线配置恢复方式、每版卡片/快捷入口数量及检查项。以下为简要版本；推送须以当次用户授权为准，不将旧发布授权当作永久授权。

每次增量发布同步更新根目录 `README.md` 和 `site/PROFILE_README.md` 的公开内容；个人主页仓库如另建，需单独同步。用户随后明确 About 基本固定：`site/GITHUB_ABOUT.md` 是长期介绍，包含当前主旨与明确标为规划的后续方向，不随 V1–V6 重写。未来专题可能分站，不等于都在当前 Pages 发布。仅主旨变化或事实需纠正时修改 Description；发布时核对 Website，不放未发布页面链接、凭据或未经确认的推广地址。

当前采用手工、低复杂度的分批发布方式，不引入 `published` 字段或自动草稿系统。文章正文继续全部保存在私有仓库中；每一版只调整 `site/config.json`、`scripts/build.mjs`、`scripts/check.mjs` 和 `scripts/browser-check.mjs` 中的公开页面与入口，然后构建、检查、提交并推送。

### 第 1 版：干净首发

- 公开页面：首页、关于页、第 01 篇《翻墙是什么：新手先建立一张网络工具地图》。
- 首页入口：只保留“从第一篇开始”、第 01 篇卡片和关于页；删除指向第 03、08、09、10 篇的快捷入口。
- 文章入口：第 01 篇只显示返回目录和关于页，不出现未发布文章的下一篇链接。
- 检查目标：3 个正常页面、1 个文章页、404、无站内失效链接。

### 第 2 版：基础对照

- 新增页面：第 02 篇《代理、VPN、Tor 的区别》。
- 新增入口：首页第 02 篇卡片；第 01 篇下一篇指向第 02 篇；第 02 篇上一篇指向第 01 篇。
- 同步更新：首页文章数量、基础认知阶段入口、文章目录和检查页面数量。

### 第 3 版：工具生态

- 新增页面：第 03 篇《代理工具生态总览》、第 04 篇《代理协议详解》。
- 新增入口：首页工具生态分组、第 02 篇到第 03 篇、第 03 篇到第 04 篇的连续导航。
- 继续保持：未发布的第 05～10 篇不出现在首页快捷入口、文章侧栏和分页中。

### 第 4 版：客户端与核心

- 新增页面：第 05 篇《Clash 家族有哪些区别》、第 06 篇《V2Ray 与 Xray 的关系》。
- 新增入口：工具生态分组完整显示，前后篇导航接入第 05、06 篇。
- 检查重点：Clash、Mihomo、v2rayN 等外部参考链接和移动端目录。

### 第 5 版：配置与排查

- 新增页面：第 07 篇《配置、订阅、节点与规则》、第 08 篇《连接后打不开网页怎么办》。
- 新增入口：首页配置与排查分组，以及“连接后还是打不开”的快捷入口。
- 服务信息区：第 07 篇按原设计显示服务信息占位，但在 `promotion.url` 为空时不增加外部推荐按钮。

### 第 6 版：安全与边界

- 新增页面：第 09 篇《如何判断网络工具是否安全可靠》、第 10 篇《隐私、法律与使用边界》。
- 新增入口：首页安全与边界分组、安全快捷入口和首页隐私边界提示。
- 发布后：全站恢复完整 10 篇目录，检查脚本恢复为 12 个正常页面和 10 个文章页。

### 每次发布的固定操作

1. 按本计划只开放当前版本规定的文章，并删除尚未开放文章的首页入口、快捷入口和分页入口。
2. 更新首页数量、分组文案、文章侧栏和 `scripts/check.mjs` / `scripts/browser-check.mjs` 的数量断言。
3. 执行 `npm ci`（依赖未安装时）、`npm run build`、`npm run check`，必要时执行 `npm run test:browser`。
4. 使用 `git add`、`git commit`，再以 `git -c http.proxy=http://127.0.0.1:7897 push` 推送；不修改 Git 全局代理。
5. 推送后确认 GitHub Actions 构建成功，再检查页面地址和本版新增入口。

下次用户说“发布第 N 版”时，按本节对应版本执行，不重新设计发布机制，也不提前开放后续文章。

本轮根路径与 /proxy_info/ 均已 build、check 通过：13 HTML、557 内部链接，以及标题、引用、元数据、锚点与子路径检查。随后恢复根路径 dist。本轮浏览器回归也已通过：1440/390/320 宽度的 12 个正常页面、导航、404、无横向溢出、无脚本错误，以及禁用 JavaScript 的手机目录与文章导航。首次因沙箱禁止监听 4187 失败，获环境授权后重跑通过。git diff --check 通过。

接续工作优先：

1. 如用户要看页面，先确认 4713 可见内容；如要发布，确认正式 SITE_URL、Git 工作区和部署方式。
2. 用户提供 GitHub 推荐页面后配置 promotion.url；机场细节待用户决定。
3. 确认分站与选题优先级后再写新文章，必要时澄清 ltproxy。
4. 获得正式站点后再进行 Bing 验证和索引排查，不把未收录直接归因于“降权”。

发布授权：用户已要求推送当前项目，使用单次命令的 http.proxy=http://127.0.0.1:7897，不必修改全局代理配置。不要保存或沿用聊天里的明文凭据；需要远程操作时使用安全登录或凭据管理器。

## 2026-10-22：自定义域名与第一阶段页面发布

- 页面已发布到 `fiamitaa/fiamitaa`，当前只包含第一阶段静态页面：首页、关于页、第 01 篇文章、404、页面资源、`README.md`、`CNAME`、`robots.txt` 和 `sitemap.xml`。没有把源码、Markdown 正文、构建脚本或 GitHub Actions 放入该页面仓库。
- GitHub Pages 自定义域名为 `ladderer.win`。绑定自定义域名后，页面必须按根路径构建；资源地址使用 `/assets/`，文章地址使用 `/articles/<slug>/`，不能继续使用 `/fiamitaa/` 前缀。正确入口为 `https://ladderer.win/`。
- 页面仓库已加入 `CNAME`（内容为 `ladderer.win`），并生成 `https://ladderer.win/sitemap.xml`，当前包含首页、`/articles/what-is-network-proxy/` 和 `/about/`。`robots.txt` 已指向该 sitemap。
- 页面页脚已加入 GitHub 个人主页入口，目标为 `https://github.com/fiamitaa`。源码构建配置中的 `repository` 也应保持该地址，不再使用 `fiamitaa/fiamitaa` 仓库地址作为展示链接。
- 自定义域名构建应通过环境变量 `SITE_URL=https://ladderer.win` 生成；项目仓库的 GitHub Pages 工作流仍按源码构建方式运行。若继续维护 `fiamitaa/fiamitaa` 的纯静态页面，需从当前源码重新生成 dist 后再同步，避免手工页面与源码分离。
- 最近源码仓库提交：`a140c10 Link footer to GitHub profile`；页面仓库最近提交：`9b00a62 Link pages to GitHub profile`。页面仓库工作区在本次记录时有 4 个静态 HTML 文件的未提交修改，链接地址已在提交 `9b00a62` 中改为个人主页；剩余未提交修改为把入口文字从“GitHub 仓库 ↗”改为“GitHub 主页 ↗”；下次继续推送前先检查并提交这些修改。
- 本机 Node 曾出现 `libllhttp.9.3.dylib` 缺失，导致页面仓库目录中无法直接运行 npm 构建；源码仓库的 `npm run check` 曾正常通过。需要重新构建时先确认 Node/npm 运行环境，再执行 `npm run build`、`npm run check`。
- 远程操作继续使用单次参数 `-c http.proxy=http://127.0.0.1:7897`，不要把 token 写入项目、文档、`.gitignore` 或 Git 配置。此前会话中的 token 已用于推送，不应继续明文保存或复用。

- 文案最新约束：`site/GITHUB_ABOUT.md` 仅保存单段 Description；围绕十篇已有文章，突出少数重点，自然融入 Bing 关键词，不罗列全部主题、不写未来规划。根目录 README 使用同一风格，保留简短主题介绍、少量 emoji 和阅读入口，不强调文章数量。后续用户另给的机场推荐 About 属于其他用途，与本站无关，仅在聊天中交付，未写入项目。
- 关于页重复 h1 已通过构建脚本移除 Markdown 首行一级标题解决。域名修复时曾用未设置 SITE_URL 的构建结果发布，随后单独更新 sitemap；因此下一次正式发布必须显式设置 SITE_URL=https://ladderer.win，检查 canonical、og:url 和文章结构化数据，不能仅凭 sitemap 存在认定这些元数据已齐全。
- 本节为最新状态，优先于上文尚未发布、仅使用 Actions 或其他旧发布描述；用户明确要求页面仓库保留 README，其余仅发布静态产物。此次只更新本地恢复文档，未提交推送。


## 2026-10-22：第二阶段本地完成（最新状态）

- 本次用户要求按计划修改第二阶段页面；已开放第 02 篇《代理、VPN、Tor 的区别》，地址 `/articles/proxy-vpn-tor/`。当前仅公开 01、02：首页两张卡片、一个基础认知分组，正常页面共 4 个，另有 404。
- 首页、桌面侧栏、手机目录、01 → 02 → 关于页的导航均已同步；第 03～10 篇未生成，也未加入 sitemap 或文章入口。沿用原正文及自然融入关键词的 description，不改写技术复核日期。
- README 与个人主页原稿增加第二篇阅读入口，全部公开链接使用 https://ladderer.win；未强调文章数量。About 保持稳定，不添加未来规划或本轮文章清单。其他用途的机场推荐 About 仍只在聊天中交付。
- 保留最近要求：正式域名根路径构建、页脚 GitHub 主页 https://github.com/fiamitaa、sitemap 与 robots、README，以及静态页面仓库只放发布产物的约束。源码仓库与页面仓库继续分开维护。
- 构建及静态检查通过：4 个正常页面加 404、103 个内部链接；浏览器检查通过 1440/390/320 宽度、第二篇表格、前后篇、未发布页面 404、无横向溢出及脚本错误，关闭 JavaScript 的手机目录和 01 → 02 导航也通过。Playwright 自带 Chromium 缺失，使用本机 Chrome：BROWSER_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'。
- 检查脚本会导入构建脚本并重新生成 dist，因此运行 check/test:browser 时也要传 SITE_URL=https://ladderer.win，避免清掉 sitemap 或丢失 canonical。最终 dist 应再次确认 build-info 中 siteUrl 正确、sitemap 为四项。
- 本轮仅完成本地修改与验证，未提交、未推送，线上仍是第一阶段。未同步 /tmp/fiamitaa-target；该目录此前四个 HTML 的本地修改仍需在正式发布时核对。下一步如用户要求发布，再从正式域名构建结果同步静态页面，保留 README/CNAME，排除 build-info、源码、凭据等，然后分别提交推送两仓库；远程操作继续使用本地 7897 代理。
- 后续按 V3 开放 03、04；以 site/RELEASE_PLAN.md 的批次和本节最新状态为准，不采用上文旧的完整站检查数量或 Actions 发布结论。
