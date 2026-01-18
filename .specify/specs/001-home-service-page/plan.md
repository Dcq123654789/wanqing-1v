# Implementation Plan: 上门服务页面

**Branch**: `001-home-service-page` | **Date**: 2026-01-18 | **Spec**: [spec.md](../spec.md)
**Input**: Feature specification from `/specs/001-home-service-page/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

开发一个上门服务页面，参考现有的老年商品商城（ElderlyMall）组件设计。该功能为老年用户提供上门服务浏览、筛选和查看详情的能力。技术方案采用 Taro + React 组件架构，复用现有的商品页面模式，使用两列网格布局展示服务卡片，支持分类筛选和价格排序功能。

## Technical Context

**Language/Version**: TypeScript 5.2.0
**Primary Dependencies**:
  - Taro 4.0.9 (微信小程序框架)
  - React 18.2.0 (UI框架)
  - Zustand 4.4.7 (状态管理，可选)

**Storage**: Mock data (内存数据，暂无后端集成)
**Testing**: 手动测试（暂无自动化测试配置）
**Target Platform**: 微信小程序 (WeApp)
**Project Type**: Mobile (小程序)
**Performance Goals**:
  - 服务卡片渲染时间 < 100ms
  - 分类切换响应时间 < 500ms
  - 图片懒加载优化

**Constraints**:
  - 必须适配老年人用户（大字体、高对比度）
  - 图片使用占位服务（picsum.photos）
  - 需要处理网络图片加载失败的边界情况

**Scale/Scope**:
  - 预计 10-20 个服务项目
  - 4-6 个服务分类
  - 单一页面 + 详情页导航

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

项目中暂未配置宪法文件（constitution.md 为模板），因此无需进行宪法约束检查。

## Project Structure

### Documentation (this feature)

```text
specs/001-home-service-page/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/pages/joy/components/HomeService/
├── index.tsx            # 主组件 - 上门服务列表页面
├── index.scss           # 样式文件
├── index.config.ts      # Taro 页面配置
├── types.ts             # TypeScript 类型定义
├── mockData.ts          # 模拟数据（服务列表和分类）
└── Detail/              # 服务详情页（可选，后续迭代）
    ├── index.tsx
    ├── index.scss
    └── index.config.ts
```

**Structure Decision**:
- 采用与 ElderlyMall 相同的组件结构
- 主页面位于 `src/pages/joy/components/HomeService/`
- 详情页预留 `Detail/` 目录，在后续迭代中实现
- 所有相关文件（组件、样式、数据、类型）组织在同一目录下

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

无宪法约束违规，此部分不适用。
