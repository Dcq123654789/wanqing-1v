# 实施计划: [功能名称]

**分支**: `[###-feature-name]` | **日期**: [日期] | **规格**: [链接]
**输入**: 来自 `/specs/[###-feature-name]/spec.md` 的功能规格
**注意**: 此模板由 `/speckit.plan` 命令填充。执行工作流请参考 `.specify/templates/commands/plan.md`

## 摘要

[从功能规格中提取: 主要需求 + 来自研究的技术方案]

## 技术背景

<!--
  行动要求: 将此部分的内容替换为项目的技术细节
  此处的结构作为指导性说明，用于引导迭代过程
-->

**语言/版本**: [例如: Python 3.11, Swift 5.9, Rust 1.75 或 需要澄清]
**主要依赖**: [例如: FastAPI, UIKit, LLVM 或 需要澄清]
**存储**: [如适用, 例如: PostgreSQL, CoreData, 文件系统 或 不适用]
**测试**: [例如: pytest, XCTest, cargo test 或 需要澄清]
**目标平台**: [例如: Linux服务器, iOS 15+, WASM 或 需要澄清]
**项目类型**: [单体/Web/移动端 - 决定源码结构]
**性能目标**: [领域特定, 例如: 1000 请求/秒, 10k 行/秒, 60fps 或 需要澄清]
**约束条件**: [领域特定, 例如: p95延迟<200ms, 内存<100MB, 离线可用 或 需要澄清]
**规模/范围**: [领域特定, 例如: 1万用户, 100万行代码, 50个页面 或 需要澄清]

## 宪法检查

*门控: 必须在阶段0研究前通过。阶段1设计后再次检查。*

[基于宪法文件确定门控规则]

## 项目结构

### 文档结构 (本功能)

```text
specs/[###-feature]/
├── plan.md              # 本文件 (/speckit.plan 命令输出)
├── research.md          # 阶段0输出 (/speckit.plan 命令)
├── data-model.md        # 阶段1输出 (/speckit.plan 命令)
├── quickstart.md        # 阶段1输出 (/speckit.plan 命令)
├── contracts/           # 阶段1输出 (/speckit.plan 命令)
└── tasks.md             # 阶段2输出 (/speckit.tasks 命令 - 非 /speckit.plan 创建)
```

### 源码结构 (仓库根目录)
<!--
  行动要求: 将下面的占位符树替换为本功能的具体布局
  删除未使用的选项，并使用真实路径展开所选结构（如: apps/admin, packages/something）
  交付的计划不得包含选项标签
-->

```text
# [如不使用则删除] 选项1: 单体项目 (默认)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [如不使用则删除] 选项2: Web应用 (当检测到"前端" + "后端")
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [如不使用则删除] 选项3: 移动端 + API (当检测到 "iOS/Android")
api/
└── [同上后端结构]

ios/ 或 android/
└── [平台特定结构: 功能模块、UI流程、平台测试]
```

**结构决策**: [记录选择的结构并引用上面捕获的真实目录]

## 复杂性跟踪

> **仅当宪法检查存在违规且必须论证时填写**

| 违规项 | 为什么需要 | 拒绝更简单方案的原因 |
|-----------|------------|-------------------------------------|
| [例如: 第4个项目] | [当前需求] | [为什么3个项目不够] |
| [例如: 仓储模式] | [具体问题] | [为什么直接数据库访问不够] |
