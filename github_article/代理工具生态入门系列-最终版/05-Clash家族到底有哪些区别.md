# Clash 家族到底有哪些区别：Clash、Meta、Mihomo 与客户端

“我用 Clash。”这句话很常见，但它可能指核心、客户端、配置格式，甚至只是泛指一类代理工具。

理解 Clash 家族，先记住两个词：**核心**和**客户端**。

## Clash 是什么

早期 Clash 项目把代理核心、规则系统和配置生态结合起来，影响了很多后续客户端和教程。由于名称传播很广，网上仍然有大量文章直接把不同项目都叫作 Clash。

但项目名称、仓库状态和社区分支会变化。看到旧教程时，不能只看标题里的“Clash”，要核对它实际调用的核心、配置格式和项目来源。

## Clash Meta 和 Mihomo

Clash Meta 是社区发展出来的分支名称，后来项目使用 Mihomo 这个名称。今天看到“Meta”或“Mihomo”，通常是在说同一条社区发展脉络中的核心生态。

Mihomo 更接近核心，不是一个固定的桌面界面。它负责解析配置、执行规则、处理代理组和建立连接。

官方仓库：

- [MetaCubeX/mihomo](https://github.com/MetaCubeX/mihomo)

## Clash Verge Rev 是什么

[Clash Verge Rev](https://github.com/clash-verge-rev/clash-verge-rev) 是桌面客户端。它提供图形界面，帮助用户管理配置、选择模式和查看连接状态。按本轮复核时的官方说明，它内置 Mihomo 核心，并提供相应的核心更新与版本切换能力。

把这两个名字放在一起看，关系就清楚了：

- Clash Verge Rev 是客户端；
- Mihomo 是该客户端内置并调用的核心；
- 两者可以分别更新；
- 核心更新与切换范围，以客户端当前版本文档为准；
- 配置能否使用，取决于配置格式和核心支持范围。

所以，把 Clash Verge Rev 直接叫作“Clash 核心”，就把管理界面和负责连接的程序混在了一起。

## FlClash 等客户端

FlClash 是另一个跨平台图形客户端项目。它和 Clash Verge Rev 都属于客户端层，但平台支持、界面、核心集成和维护节奏可能不同。

挑选客户端时，除了界面是否顺手，还要看：

- 支持哪些操作系统；
- 调用哪些核心；
- 是否支持目标配置；
- 是否仍在维护；
- 需要哪些系统权限；
- 是否有公开文档和日志。

## 为什么同名工具体验不同

主要有四个原因：

1. 后台运行的核心不同；
2. 核心和客户端版本不同；
3. 配置、规则、DNS 和代理组不同；
4. 操作系统的网络权限和代理机制不同。

所以，别人说“这个 Clash 好用”，至少还要追问：哪个客户端？哪个核心？哪个版本？什么系统？使用的配置来自哪里？

## 判断一个 Clash 项目的方法

不要只看下载量和搜索结果。先看官方仓库、版本发布、文档、问题区和权限说明。项目是否开源是一项参考，实际分发包是否来自官方渠道同样重要。

最关键的结论是：

> **Mihomo 更接近核心，Clash Verge Rev 和 FlClash 更接近客户端，“Clash”本身可能只是一个宽泛称呼。**

## 参考资料

- [Clash Verge Rev](https://github.com/clash-verge-rev/clash-verge-rev)
- [Mihomo](https://github.com/MetaCubeX/mihomo)
- [FlClash](https://github.com/chen08209/FlClash)

