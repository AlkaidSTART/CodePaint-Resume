# CodePaint Studio UI 设计总览

> 产品名称：CodePaint Studio 招新平台  
> 产品代号：ResumeFlow  
> 文档版本：v0.3  
> 文档状态：MVP UI / UX 规范总览  
> 最后更新：2026-09-01

CodePaint Studio 招新平台由两套独立的 React UI 组成，共享一套 API、认证体系和基础设计 Token：

| UI | 应用目录 | 面向用户 | 视觉任务 |
| --- | --- | --- | --- |
| 普通用户端 | `apps/public-web` | 访客、报名者 | 介绍工作室、展示招新方向、完成报名、查看本人状态 |
| 招新成员后台 | `apps/admin-web` | 工作室招新成员 | 接收报名、解析材料、筛选、复核和跟进 |

详细规范：

- [普通用户端 UI 设计](./UI-DESIGN-USER.md)
- [招新成员后台 UI 设计](./UI-DESIGN-ADMIN.md)

---

# 1. 共享设计原则

## 1.1 视觉概念

**白纸上的蓝色批注**：白色是主画布，黑色建立秩序，淡蓝色像批注和标记，用于品牌识别、焦点和关键行动。

- 白色主背景，不使用大面积渐变；
- 黑色用于标题、正文、主按钮和结构线；
- 淡蓝色用于编号、链接、选中项、焦点和少量装饰；
- 不使用紫色渐变、玻璃拟态、漂浮光斑、机器人插画和无意义统计墙；
- 页面内容优先于装饰，真实项目图片或作品内容优先于氛围图。

## 1.2 共享色彩 Token

```text
Canvas             #FFFFFF
Surface            #F7FAFC
Surface Strong     #EEF7FF
Ink                #111111
Ink Secondary      #4B5563
Ink Tertiary       #8A96A3
Border             #DDE5EC
Border Strong      #B8C7D4
Sky                #B9E3FF
Sky Strong         #6EC5F4
Sky Ink            #075985
Success            #16803C
Warning            #A16207
Error              #C2413A
Info               #2563EB
```

淡蓝色面积不超过单个视口约 10%。状态不能只依靠颜色表达，必须同时有文字、图标或形状。

## 1.3 共享排版和尺寸

```text
"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif
```

基础间距单位为 `4px`，常用间距为 `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96`。

```text
Button       8px
Input        8px
Card         8px
Dialog       12px
Badge        9999px
```

默认使用边框和留白，不依赖阴影。Dropdown、Command、Dialog、Popover 才使用轻微阴影。

## 1.4 共享可访问性要求

- 所有操作可用键盘完成；
- Focus 使用明显的天蓝色外框；
- 表单 Label 与输入框正确关联；
- Dialog 支持 Esc 和焦点回收；
- 图标按钮有 Tooltip 和辅助文本；
- 正文与背景达到 WCAG AA；
- 动画支持 `prefers-reduced-motion`；
- 移动端文字、按钮、表单和列表不能重叠或溢出。

## 1.5 共享组件边界

共享基础组件：

```text
Button
Input
Textarea
Select
Combobox
Dialog
Sheet
Tabs
Badge
Separator
Skeleton
Toast
Tooltip
```

页面级 Layout、导航、Hero、报名内容、报名者列表、AI 复核和后台数据组件分别归属对应应用，不跨应用复制业务状态。

## 1.6 共享状态与权限

- TanStack Query 管理服务端数据；
- Zustand 只管理本地 UI 状态，例如菜单、命令面板、PDF 查看器和临时筛选条件；
- `public-web` 只能访问公开内容和当前用户资源；
- `admin-web` 所有工作台路由要求 `recruiter`；
- 前端根据角色隐藏入口，后端 API 必须再次执行认证、角色和资源归属校验。
