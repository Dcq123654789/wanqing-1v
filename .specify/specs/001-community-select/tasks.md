# Tasks: 社区选择页面

**输入**: 来自 `.specify/specs/001-community-select/` 的设计文档
**前提条件**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**测试**: 本功能采用手动测试策略（详见 research.md），不包含自动化测试任务。

**组织**: 任务按用户故事分组，以实现每个故事的独立实现和测试。

## 格式: `[ID] [P?] [Story] 描述`

- **[P]**: 可并行执行（不同文件，无依赖）
- **[Story]**: 任务所属用户故事（如 US1, US2, US3, US4）
- 包含精确的文件路径

## 路径约定

- **Taro 小程序**: `src/` 在仓库根目录
- **页面**: `src/pages/[page-name]/`
- **组件**: `src/components/` 或页面级 `components/`
- **服务**: `src/services/`
- **状态管理**: `src/store/`
- **类型**: `src/types/`

---

## Phase 1: 设置（共享基础设施）

**目的**: 项目初始化和基本结构

- [X] T001 创建社区选择功能目录结构 `src/pages/home/data/community-select/`, `src/services/storage/`, `src/types/`
- [X] T002 [P] 创建 TypeScript 类型定义 `src/types/community.types.ts` (Community, UserSelection, MapMarker, ViewMode)
- [X] T003 [P] 创建 Zustand store 模板 `src/store/community-store.ts` (状态结构定义)

---

## Phase 2: 基础（阻塞前提条件）

**目的**: 所有用户故事依赖的核心基础设施

**⚠️ 关键**: 完成此阶段前，任何用户故事工作都无法开始

- [X] T004 实现加密存储服务 `src/services/storage/encrypted-storage.ts` (saveCommunity, loadCommunity, clearCommunity)
- [X] T005 [P] 实现缓存管理器 `src/services/storage/cache-manager.ts` (getCachedCommunities, setCachedCommunities, isCacheExpired)
- [X] T006 [P] 创建 API 服务基础 `src/pages/home/data/community-select/services/community.service.ts` (fetchCommunities, fetchCommunityById, Mock 数据)
- [X] T007 完善 Zustand store 实现 `src/store/community-store.ts` (添加 actions: setSelectedCommunity, setCommunities, setViewMode 等)
- [X] T008 [P] 创建 Mock 数据 `src/pages/home/data/community-select/services/mock-data.ts` (MOCK_COMMUNITIES 测试数据)

**检查点**: 基础设施就绪 - 用户故事实现现在可以并行开始

---

## Phase 3: 用户故事 1 - 首次选择社区 (优先级: P1) 🎯 MVP

**目标**: 新用户首次打开小程序时，能够通过地图或列表选择社区，系统保存选择并跳转到主页

**独立测试**: 打开小程序 → 显示社区选择页面 → 点击社区标记点 → 选择社区 → 保存成功 → 跳转到首页

### 用户故事 1 实现

- [X] T009 [P] [US1] 创建地图视图组件 `src/pages/home/data/community-select/components/MapView.tsx` (地图标记点渲染、标记点点击处理)
- [X] T010 [P] [US1] 创建列表视图组件 `src/pages/home/data/community-select/components/ListView.tsx` (社区列表渲染、列表项点击处理)
- [X] T011 [P] [US1] 创建社区卡片组件 `src/pages/home/data/community-select/components/CommunityCard.tsx` (社区基本信息显示)
- [X] T012 [P] [US1] 创建社区详情组件 `src/pages/home/data/community-select/components/CommunityDetail.tsx` (完整地址、服务范围显示)
- [X] T013 [US1] 实现主页面组件 `src/pages/home/data/community-select/index.tsx` (整合地图/列表视图、视图切换、社区选择逻辑、位置获取、加载状态)
- [X] T014 [US1] 创建页面配置 `src/pages/home/data/community-select/index.config.ts` (导航栏标题配置)
- [X] T015 [US1] 添加页面样式 `src/pages/home/data/community-select/index.scss` (布局、视图切换按钮、加载状态、错误提示样式)
- [X] T016 [US1] 集成存储服务到主页面（调用 saveCommunity 保存用户选择）
- [X] T017 [US1] 集成 API 服务到主页面（调用 fetchCommunities 加载社区列表、缓存策略、错误处理）

**检查点**: 此时，用户故事 1 应完全功能且可独立测试

---

## Phase 4: 用户故事 2 - 自动加载已选社区 (优先级: P1)

**目标**: 用户已选择社区后，再次打开小程序时自动加载上次选择的社区，无需重复选择

**独立测试**: 选择社区 → 关闭小程序 → 重新打开 → 自动显示已选择的社区 → 页面顶部显示社区名称

### 用户故事 2 实现

- [ ] T018 [US2] 在 app.tsx 或启动逻辑中添加社区加载检查（应用启动时调用 loadCommunity）
- [ ] T019 [US2] 实现自动加载逻辑（读取本地存储、验证社区有效性、更新 Zustand store）
- [ ] T020 [US2] 处理加载失败场景（本地存储丢失、社区已下线、显示错误提示、重定向到选择页面）
- [ ] T021 [US2] 在主页面顶部显示当前社区名称（布局更新、数据绑定）

**检查点**: 此时，用户故事 1 和 2 都应独立工作

---

## Phase 5: 用户故事 3 - 切换社区 (优先级: P2)

**目标**: 用户可以从当前社区切换到其他社区，支持多社区使用场景

**独立测试**: 在首页点击"切换社区" → 打开社区选择页面 → 高亮当前社区 → 选择新社区 → 保存成功 → 显示提示消息

### 用户故事 3 实现

- [ ] T022 [US3] 在个人中心或设置页面添加"切换社区"按钮（`src/pages/profile/index.tsx` 添加按钮、样式）
- [ ] T023 [US3] 实现切换社区导航逻辑（导航到社区选择页面、传递当前社区 ID）
- [ ] T024 [US3] 在社区选择页面高亮当前社区（地图标记点高亮、列表项高亮样式）
- [ ] T025 [US3] 实现切换社区逻辑（调用 saveCommunity 更新存储、显示成功提示、跳转回首页）
- [ ] T026 [US3] 添加切换社区提示消息（Taro.showToast、消息文本定制）

**检查点**: 所有用户故事都应独立功能

---

## Phase 6: 用户故事 4 - 查看社区详情 (优先级: P2)

**目标**: 用户可以在地图或列表中查看社区的详细信息，包括完整地址和服务范围

**独立测试**: 在地图视图点击标记点 → 显示详情卡片 → 在列表视图点击社区项 → 显示详情页面 → 查看完整信息

### 用户故事 4 实现

- [ ] T027 [P] [US4] 实现地图标记点点击显示详情（MapView 组件集成 CommunityDetail、弹窗或浮层显示）
- [ ] T028 [P] [US4] 实现列表项点击跳转详情（ListView 组件导航到详情页面、传递社区 ID）
- [ ] T029 [US4] 创建独立详情页面（`src/pages/community-detail/index.tsx`、完整信息展示、返回按钮）
- [ ] T030 [US4] 添加详情页面样式 `src/pages/community-detail/index.scss` (信息卡片布局、地址和范围样式)
- [ ] T031 [US4] 创建详情页面配置 `src/pages/community-detail/index.config.ts` (导航栏配置)
- [ ] T032 [US4] 调用 API 获取社区详情（fetchCommunityById、错误处理、加载状态）

**检查点**: 所有用户故事完整功能实现

---

## Phase 7: 优化与横切关注点

**目的**: 影响多个用户故事的改进

- [ ] T033 [P] 添加加载骨架屏优化用户体验（地图和列表视图的加载占位符）
- [ ] T034 [P] 实现下拉刷新功能（Taro 下拉刷新组件、调用 fetchCommunities 刷新数据）
- [ ] T035 优化地图标记点性能（标记点聚类策略、按可视区域动态加载）
- [ ] T036 添加边界情况处理（定位失败提示、社区列表为空提示、网络超时降级到缓存）
- [ ] T037 [P] 添加错误日志记录（console.error 统一格式、关键操作日志）
- [ ] T038 [P] 代码清理和重构（提取重复逻辑、优化组件结构、TypeScript 类型完善）
- [ ] T039 按照 quickstart.md 验证所有场景（手动测试清单验证、修复发现的问题）

---

## 依赖与执行顺序

### 阶段依赖

- **设置 (Phase 1)**: 无依赖 - 可立即开始
- **基础 (Phase 2)**: 依赖设置完成 - 阻塞所有用户故事
- **用户故事 (Phase 3-6)**: 都依赖基础阶段完成
  - 用户故事 1 (P1): 可在基础完成后开始 - 无其他故事依赖
  - 用户故事 2 (P1): 可在基础完成后开始 - 共享 US1 的存储服务
  - 用户故事 3 (P2): 可在基础完成后开始 - 复用 US1 的组件和服务
  - 用户故事 4 (P2): 可在基础完成后开始 - 共享类型定义和服务
- **优化 (Phase 7)**: 依赖所有期望的用户故事完成

### 用户故事依赖

- **用户故事 1 (P1)**: 基础完成后可开始 - 独立可测试
- **用户故事 2 (P1)**: 基础完成后可开始 - 独立可测试，但共享 US1 的存储服务
- **用户故事 3 (P2)**: 基础完成后可开始 - 复用 US1 的社区选择页面组件
- **用户故事 4 (P2)**: 基础完成后可开始 - 独立可测试，共享 API 服务

### 每个用户故事内

- 类型定义 → 存储服务 → API 服务 → 组件 → 页面集成
- 并行任务标记 [P] 的可同时开发
- 非并行任务按顺序执行

### 并行机会

- **Phase 1**: T002, T003 可并行
- **Phase 2**: T005, T006, T008 可并行（T004, T007 依赖它们）
- **Phase 3 (US1)**: T009-T012 四个组件可并行开发
- **Phase 6 (US4)**: T027, T028 可并行
- **Phase 7**: T033, T034, T037, T038 可并行
- **跨用户故事**: 基础完成后，US1-US4 可由不同开发者并行开发

---

## 并行示例: 用户故事 1

```bash
# 同时启动用户故事 1 的所有组件开发:
Task T009: "创建地图视图组件 src/pages/home/data/community-select/components/MapView.tsx"
Task T010: "创建列表视图组件 src/pages/home/data/community-select/components/ListView.tsx"
Task T011: "创建社区卡片组件 src/pages/home/data/community-select/components/CommunityCard.tsx"
Task T012: "创建社区详情组件 src/pages/home/data/community-select/components/CommunityDetail.tsx"

# 然后顺序集成:
Task T013: "实现主页面组件 src/pages/home/data/community-select/index.tsx"
Task T014: "创建页面配置 src/pages/home/data/community-select/index.config.ts"
```

---

## 实施策略

### MVP 优先（仅用户故事 1）

1. 完成 Phase 1: 设置
2. 完成 Phase 2: 基础（关键 - 阻塞所有故事）
3. 完成 Phase 3: 用户故事 1
4. **停止并验证**: 独立测试用户故事 1
5. 准备好即可部署/演示

### 增量交付

1. 完成 设置 + 基础 → 基础就绪
2. 添加 用户故事 1 → 独立测试 → 部署/演示 (MVP!)
3. 添加 用户故事 2 → 独立测试 → 部署/演示
4. 添加 用户故事 3 → 独立测试 → 部署/演示
5. 添加 用户故事 4 → 独立测试 → 部署/演示
6. 每个故事都增加价值而不破坏之前的故事

### 并行团队策略

有多个开发者时：

1. 团队一起完成设置 + 基础
2. 基础完成后:
   - 开发者 A: 用户故事 1 (T009-T017)
   - 开发者 B: 用户故事 2 (T018-T021)
   - 开发者 C: 用户故事 3 (T022-T026)
3. 故事独立完成并集成

---

## 备注

- [P] 任务 = 不同文件，无依赖，可并行
- [Story] 标签将任务映射到特定用户故事以便追溯
- 每个用户故事应可独立完成和测试
- 采用手动测试策略（详见 quickstart.md 的测试清单）
- 每个任务或逻辑组后提交
- 在任何检查点停止以独立验证故事
- 避免: 模糊任务、同一文件冲突、破坏独立性的跨故事依赖

---

## 任务统计

- **总任务数**: 39 个
- **设置阶段**: 3 个
- **基础阶段**: 5 个
- **用户故事 1 (P1)**: 9 个
- **用户故事 2 (P1)**: 4 个
- **用户故事 3 (P2)**: 5 个
- **用户故事 4 (P2)**: 6 个
- **优化阶段**: 7 个

**并行任务机会**: 15 个任务标记为 [P]，可并行执行

**MVP 范围**: Phase 1-3 (T001-T017, 共 17 个任务)

**独立测试标准**:
- US1: 完整的社区选择流程（地图/列表 → 选择 → 保存 → 跳转）
- US2: 自动加载已选社区（启动 → 读取存储 → 显示社区）
- US3: 切换社区（点击切换按钮 → 选择新社区 → 保存）
- US4: 查看社区详情（点击地图/列表 → 显示详情信息）
