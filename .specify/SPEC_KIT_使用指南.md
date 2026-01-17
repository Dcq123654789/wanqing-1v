# Spec Kit 使用指南

> **规范驱动开发（Spec-Driven Development）**工具包 - 让 AI 更好地帮您开发高质量软件

---

## 📖 什么是 Spec-Driven Development？

**传统开发**：先写代码，规格说明只是临时的脚手架

**规范驱动开发**：
- ✅ 先定义**做什么**和**为什么**，再定义**怎么做**
- ✅ 规格说明是**可执行的**，直接生成实现
- ✅ 多步迭代而非一次生成所有代码
- ✅ 强调意图驱动和质量把控

---

## 🚀 快速开始

### 前置条件

- ✅ Git 仓库
- ✅ 已安装 `.specify/` 目录
- ✅ AI 编程助手（Claude Code、Cursor、Copilot 等）

---

## 📋 完整开发流程

```
1. Constitution（可选）  → 2. Specify → 3. Clarify → 4. Plan → 5. Tasks → 6. Implement
   建立项目原则            定义需求    澄清需求    技术设计    任务分解    执行实施
```

---

## 🎯 第 1 步：建立项目原则（可选）

### 命令
```bash
/speckit.constitution
```

### 作用
为项目设定开发原则，AI 在后续所有步骤中都会遵循这些原则。

### 示例输入
```
创建项目原则，包含：
- 代码质量：TypeScript 严格模式，ESLint 规则
- 测试标准：核心功能必须有单元测试
- 用户体验：响应式设计，无障碍支持
- 性能要求：首屏加载 < 2秒
- 治理规则：简单优于复杂，YAGNI 原则
```

### 生成文件
`.specify/memory/constitution.md`

### 何时使用
- 项目刚开始时
- 需要更新开发原则时

---

## 📝 第 2 步：创建功能规格说明（核心）

### 命令
```bash
/speckit.specify
```

### 作用
将您的需求转换为结构化的功能规格文档。

### 示例输入

**❌ 不好的输入**：
```
做一个用户登录页面
```

**✅ 好的输入**：
```
开发用户登录功能，包含以下场景：

1. 用户可以通过手机号+验证码登录
2. 用户可以通过微信授权登录
3. 登录成功后保存用户信息到本地
4. 支持"记住我"功能，7天内免登录
5. 登录失败时显示错误提示
6. 新用户需要先同意隐私协议

用户场景：
- 新用户首次登录，需要获取手机号和授权
- 老用户登录，直接进入首页
- 用户网络异常时，显示友好提示
```

### 关键要点
- ✅ 描述**做什么**和**为什么**
- ✅ 描述用户场景和故事
- ✅ 按优先级排序（P1 最重要，P2 次之...）
- ❌ 不要提到技术栈（那是第 4 步的事）
- ❌ 不要说"用 React 实现"

### 生成文件
`.specify/specs/XXX-feature-name/spec.md`

包含内容：
- 📋 用户故事（User Stories）- 按优先级 P1, P2, P3
- ✅ 验收场景（Acceptance Scenarios）- Given/When/Then 格式
- 📝 功能需求（Functional Requirements）- FR-001, FR-002...
- 🎯 成功标准（Success Criteria）- 可衡量的指标
- ⚠️ 边界情况（Edge Cases）- 错误处理、边界条件

### 用户故事模板
```markdown
### User Story 1 - [标题] (Priority: P1)

[描述用户旅程]

**Why this priority**: [为什么这个优先级]

**Independent Test**: [如何独立测试]

**Acceptance Scenarios**:
1. **Given** [初始状态], **When** [操作], **Then** [预期结果]
2. **Given** [初始状态], **When** [操作], **Then** [预期结果]
```

### 何时使用
- 每个新功能开发时
- 功能需要重大改动时

---

## 🔍 第 3 步：澄清需求（推荐）

### 命令
```bash
/speckit.clarify
```

### 作用
AI 会针对规格说明中的模糊点提问，确保需求完整清晰。

### 示例对话
```
AI: "用户登录失败时，是否需要限制重试次数？"
您: "需要，同一手机号 5 次失败后锁定 30 分钟"

AI: "微信授权登录失败时，是否降级到手机号登录？"
您: "是的，提供降级选项"

AI: "用户信息包含哪些字段？"
您: "手机号、昵称、头像、创建时间"
```

### 生成内容
答案会自动记录到 `spec.md` 的 Clarifications 章节

### 何时使用
- 规格说明创建后，生成技术计划前
- 需求有不确定的地方

### 何时跳过
- 快速原型验证
- 功能非常简单明确

---

## 🏗️ 第 4 步：生成技术实施计划

### 命令
```bash
/speckit.plan
```

### 作用
根据功能规格，生成技术架构和实施计划。

### 示例输入
```
技术栈：
- 前端：Taro + React + TypeScript
- 状态管理：Zustand
- 样式：Sass
- API：RESTful API，后续可能接入 GraphQL
- 数据存储：本地使用 Taro.setStorageSync

架构要求：
- 组件化开发，组件可复用
- 类型安全，使用 TypeScript 严格模式
- 错误处理统一
- 支持后续国际化
```

### 生成文件
在 `.specify/specs/XXX-feature-name/` 目录下生成：

1. **plan.md** - 技术实施计划
   - 架构设计
   - 技术栈选择
   - 目录结构
   - 关键技术决策

2. **data-model.md** - 数据模型
   - 实体定义
   - 关系图
   - API 契约

3. **research.md** - 技术调研
   - 第三方库选择
   - 版本信息
   - 实现细节

### 何时使用
- 功能规格确认后
- 需要技术设计文档时

---

## ✅ 第 5 步：生成任务清单

### 命令
```bash
/speckit.tasks
```

### 作用
将技术计划拆解为可执行的任务列表，按依赖关系排序。

### 生成文件
`.specify/specs/XXX-feature-name/tasks.md`

### 任务结构
```markdown
## User Story 1: [标题]

### 1.1 [任务名称]
**File**: `src/components/xxx.tsx`
**Dependencies**: 无
**Description**: 任务描述
**Acceptance**: 验收标准

### 1.2 [任务名称] [P]
**File**: `src/utils/xxx.ts`
**Dependencies**: 无
**Description**: 可与 1.1 并行执行
**Acceptance**: 验收标准

### 1.3 [任务名称]
**File**: `src/pages/xxx.tsx`
**Dependencies**: 1.1, 1.2
**Description**: 依赖前面的任务
**Acceptance**: 验收标准
```

### 标记说明
- **[P]** = 可并行执行（Parallel）
- **Dependencies** = 依赖的前置任务

### 何时使用
- 技术计划确认后
- 准备开始实施前

---

## 🚀 第 6 步：执行实施

### 命令
```bash
/speckit.implement
```

### 作用
AI 按照任务清单自动执行，编写代码、运行命令。

### AI 会做什么
1. 解析 `tasks.md` 文件
2. 按顺序执行任务
3. 创建文件、编写代码
4. 遵循 TDD（如果要求测试）
5. 处理错误和重试

### 您需要做什么
- ✅ 确保本地环境已配置好（Node.js、依赖包等）
- ✅ 监控执行过程
- ✅ 测试生成的功能
- ❌ 不需要手动写代码

### 执行后验证
```bash
# 运行项目
npm run dev:weapp

# 检查控制台错误
# 手动测试所有功能
```

### 何时使用
- 任务清单确认后
- 准备好开始编码时

---

## 🔧 其他命令

### `/speckit.analyze`
**作用**：分析规格、计划、任务之间的一致性和完整性

**何时使用**：
- 生成任务清单后，执行实施前
- 想要检查是否有遗漏或冲突

**检查内容**：
- ✅ 规格说明的所有需求是否覆盖
- ✅ 技术计划是否支持所有功能
- ✅ 任务清单是否完整
- ⚠️ 发现不一致的地方

---

### `/speckit.checklist`
**作用**：生成质量检查清单

**何时使用**：
- 功能完成后
- 代码审查前
- 想要确保质量时

**生成内容**：
- 需求完整性检查
- 代码质量检查
- 用户体验检查
- 测试覆盖检查

---

## 💡 最佳实践

### 1. 需求描述要点
✅ **好的做法**：
- 描述用户场景和故事
- 说明为什么需要这个功能
- 考虑边界情况和错误处理
- 按优先级排序

❌ **避免**：
- 只说"做一个登录页面"
- 在规格阶段提技术栈
- 忘记错误处理场景
- 所有功能都是 P1 优先级

### 2. 优先级排序原则
- **P1**：核心功能，没有它产品不可用
- **P2**：重要功能，显著提升体验
- **P3**：锦上添花的功能

**示例**：
```
P1: 用户可以成功登录
P2: 支持"记住我"功能
P3: 登录页面有动画效果
```

### 3. 用户故事独立性
每个用户故事应该是：
- ✅ 可独立开发的
- ✅ 可独立测试的
- ✅ 可独立部署的
- ✅ 可独立演示的

### 4. 与 AI 互动技巧
- 🔄 **迭代优化**：不要期望一次生成完美规格
- 📝 **明确反馈**：具体说明哪里不对，如何改
- ❓ **主动提问**：遇到不确定的地方主动问 AI
- ✅ **验收标准**：每个功能都要有清晰的验收标准

### 5. 技术计划注意事项
- 🏗️ 遵循项目的 constitution 原则
- 🧩 考虑现有代码的复用
- 📦 选择成熟稳定的库
- 🔮 为后续扩展留空间

---

## 📂 目录结构

执行完整流程后，目录结构如下：

```
.specify/
├── memory/
│   └── constitution.md              # 项目原则（可选）
├── specs/
│   └── 001-community-select/        # 功能目录
│       ├── spec.md                  # 功能规格
│       ├── plan.md                  # 技术计划
│       ├── data-model.md            # 数据模型
│       ├── research.md              # 技术调研
│       ├── tasks.md                 # 任务清单
│       └── checklists/              # 检查清单
├── templates/                       # 模板文件
└── scripts/                         # 辅助脚本
```

---

## 🎯 实战示例

### 示例：社区选择页面

#### 1️⃣ Specify 阶段
```bash
/speckit.specify
```

**输入**：
```
开发社区选择功能：

用户故事：
1. (P1) 用户可以在地图上查看所有社区位置并选择
2. (P1) 用户可以从列表中选择社区
3. (P2) 用户可以搜索社区名称
4. (P2) 选择后保存到本地，下次自动加载
5. (P3) 查看社区详情（地址、电话等）

验收场景：
- Given 用户打开选择页面, When 点击地图标记, Then 该社区被选中
- Given 用户选择社区后, When 点击确认, Then 保存并返回上一页
- Given 用户再次打开, When 有已保存的社区, Then 自动选中
```

#### 2️⃣ Clarify 阶段
```bash
/speckit.clarify
```

AI 会问：数据来源？地图服务商？搜索算法？...

#### 3️⃣ Plan 阶段
```bash
/speckit.plan
```

**输入**：
```
技术栈：Taro + React + TypeScript
地图：微信小程序原生 Map 组件
存储：Taro.setStorageSync
数据：Mock 数据（后续接入 API）
```

#### 4️⃣ Tasks 阶段
```bash
/speckit.tasks
```

生成任务清单，包含：
1. 创建类型定义
2. 创建 Mock 数据
3. 实现 CommunityCard 组件
4. 实现 CommunitySelector 组件
5. 实现主页面逻辑
6. 添加地图功能
7. 实现本地存储
8. 样式优化

#### 5️⃣ Implement 阶段
```bash
/speckit.implement
```

AI 自动执行所有任务！

---

## ⚡ 快速参考卡片

| 阶段 | 命令 | 输入重点 | 生成文件 |
|------|------|----------|----------|
| 1. 原则 | `/speckit.constitution` | 开发原则、质量标准 | constitution.md |
| 2. 需求 | `/speckit.specify` | 用户故事、场景（**不要提技术栈**） | spec.md |
| 3. 澄清 | `/speckit.clarify` | 回答 AI 提问 | 更新 spec.md |
| 4. 设计 | `/speckit.plan` | 技术栈、架构要求 | plan.md, data-model.md, research.md |
| 5. 任务 | `/speckit.tasks` | （自动从 plan 生成） | tasks.md |
| 6. 实施 | `/speckit.implement` | （自动执行 tasks） | 代码文件 |

---

## ❓ 常见问题

### Q1：可以跳过某些步骤吗？
**A**：可以
- Constitution 可选，但建议在项目初期建立
- Clarify 可选，但推荐使用以减少返工
- 必须：Specify → Plan → Tasks → Implement

### Q2：需求变更怎么办？
**A**：
1. 更新 `spec.md`
2. 运行 `/speckit.plan` 更新技术计划
3. 运行 `/speckit.tasks` 重新生成任务
4. 运行 `/speckit.implement` 执行变更

### Q3：可以只生成不执行吗？
**A**：可以
- 运行到 `/speckit.tasks` 步骤
- 手动查看 `tasks.md`
- 自己实施或让 AI 部分实施

### Q4：支持哪些 AI 助手？
**A**：
- ✅ Claude Code（推荐）
- ✅ Cursor
- ✅ GitHub Copilot
- ✅ Windsurf
- ✅ Qwen Code
- ✅ 其他支持自定义技能的助手

---

## 📚 延伸阅读

- [Spec Kit 官方文档](https://github.com/sekmet/github-spec-kit)
- [规范驱动开发完整方法论](https://github.com/github/spec-kit/blob/main/docs/spec-driven-development.md)
- [详细步骤指南](https://github.com/github/spec-kit/blob/main/docs/detailed-walkthrough.md)

---

## 🎓 总结

**Spec Kit 核心理念**：
> 先定义清楚"做什么"和"为什么"，再让 AI 帮您实现"怎么做"

**记住**：
- 🎯 在 Specify 阶段，专注需求而非技术
- 🔄 把它当作迭代过程，不是一次性的
- ✅ 好的规格 = 好的实现
- 📖 遇到问题先查本文档

---

**版本**: 1.0
**更新日期**: 2025-01-16
**适用项目**: 晚晴小程序（Taro + React + TypeScript）
