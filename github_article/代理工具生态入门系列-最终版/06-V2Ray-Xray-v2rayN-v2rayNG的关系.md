# V2Ray、Xray、v2rayN、v2rayNG：它们到底是什么关系

V2Ray 生态的名称也容易混在一起。有人说“我用 V2Ray”，实际可能使用的是 v2rayN；有人说“我用 Xray”，实际操作的是一个支持 Xray 核心的客户端。

**核心负责连接，客户端负责管理。** 同一个客户端可以支持不同核心，名称不必一一对应。

## V2Ray 和 Project V

V2Ray 属于 Project V 生态，常见官方入口是 [v2fly/v2ray-core](https://github.com/v2fly/v2ray-core)。它提供代理核心能力，但不是一个面向所有用户的统一图形界面。

安装核心不等于拥有完整客户端。用户还需要配置、服务端和适合当前系统的管理方式。

## Xray 是什么

Xray 是另一个相关的核心项目，官方仓库是 [XTLS/Xray-core](https://github.com/XTLS/Xray-core)。它与 V2Ray 在配置和社区讨论中经常被放在一起，但不是同一个项目。

支持多核心的客户端可能允许切换 V2Ray、Xray 或其他核心。这样可以用一个界面管理不同核心，但也要求用户确认当前到底运行了哪个核心，并检查配置是否兼容；不要把“换核心”理解为只换一个显示名称。

## v2rayN 和 v2rayNG

v2rayN 是图形客户端，官方仓库为 [2dust/v2rayN](https://github.com/2dust/v2rayN)。它在 Windows 教程中很常见，但不应再只理解为 Windows 软件：本轮复核时，官方 README 已列出 Windows、Linux 和 macOS。实际安装仍要选择匹配系统与处理器架构的版本。

名称中虽然有 V2Ray，它并不等于 V2Ray 核心。官方说明列出了 Xray、sing-box 等核心支持，具体范围应查看项目的支持列表，而不是凭客户端名称推断。

v2rayNG 是 Android 平台的相关客户端，官方仓库为 [2dust/v2rayNG](https://github.com/2dust/v2rayNG)。它同样属于客户端层，具体支持范围要以当前版本说明为准。

名称相近，角色却不能混为一谈：

- v2rayN 不是 V2Ray 核心；
- v2rayNG 不是服务端；
- 客户端名称不一定等于实际运行的核心；
- 同一配置能否导入，取决于客户端和核心的兼容性。

## sing-box 为什么也会出现

sing-box 是另一套代理核心项目，官方仓库为 [SagerNet/sing-box](https://github.com/SagerNet/sing-box)。一些客户端同时支持 V2Ray、Xray、sing-box 或 Mihomo。

这不代表这些核心完全相同。它们可能支持不同协议、配置字段、路由规则和传输方式。客户端把多个核心放进同一界面，方便管理，但不会消除核心之间的差异。

## 看懂旧教程

当教程写“安装 V2Ray”时，先确认它指的是核心还是客户端；写“导入 V2Ray 配置”时，确认配置使用的协议和格式；写“换 Xray”时，确认是否只是切换核心。

碰到说法含糊的旧教程，可以带着这四个问题读：

1. 它属于客户端、核心、协议还是配置？
2. 它运行在哪个系统？
3. 它支持哪些配置和协议？
4. 项目是否仍在维护？

## 描述自己使用的环境

“使用 v2rayN”和“使用 Xray”并不矛盾：前者说的是管理界面，后者说的是界面背后运行的核心。向别人求助时，除了客户端名称，也提供系统、客户端版本、当前核心及其版本，能减少来回确认。

## 参考资料

- [V2Fly/v2ray-core](https://github.com/v2fly/v2ray-core)
- [XTLS/Xray-core](https://github.com/XTLS/Xray-core)
- [v2rayN](https://github.com/2dust/v2rayN)
- [v2rayNG](https://github.com/2dust/v2rayNG)
- [sing-box](https://github.com/SagerNet/sing-box)

