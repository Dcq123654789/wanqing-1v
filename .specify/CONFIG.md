# Spec Kit 配置记录

**更新时间**: 2025-01-16
**项目**: 晚晴小程序 (wanqing-1v)

## 目录结构规定

### ✅ 强制规定：所有规格文件必须在 `.specify` 目录中

**正确的路径结构**:
```
.specify/
├── specs/
│   ├── 001-community-select/
│   │   ├── spec.md
│   │   ├── plan.md
│   │   ├── research.md
│   │   ├── data-model.md
│   │   ├── quickstart.md
│   │   ├── tasks.md
│   │   └── contracts/
│   └── [其他功能分支]/
├── memory/
│   └── constitution.md
└── scripts/
    └── powershell/

src/
├── pages/
│   ├── home/          ← 主页（5个主页面之一）
│   │   ├── index.tsx
│   │   ├── index.config.ts
│   │   └── data/      ← 衍生页面放在这里
│   │       └── community-select/
│   │           ├── index.tsx
│   │           ├── index.config.ts
│   │           └── components/
│   ├── login/         ← 登录页
│   │   ├── index.tsx
│   │   └── data/
│   │       ├── agreement/
│   │       └── privacy/
│   ├── joy/           ← 乐享页
│   ├── care/          ← 颐养页
│   └── profile/       ← 个人页
├── services/          ← 共享服务
│   └── storage/
├── store/             ← 状态管理
└── types/             ← 类型定义
```

**❌ 错误的路径（已废弃）**:
```
specs/                           ← 不要在仓库根目录创建
001-community-select/

src/pages/community-select/       ← 不要直接在 pages 下创建衍生页面
```

## 已修改的脚本文件

### `.specify/scripts/powershell/common.ps1`

**修改内容**:
- 第 36 行：`Join-Path $repoRoot "specs"` → `Join-Path $repoRoot ".specify/specs"`
- 第 92 行：`Join-Path $RepoRoot "specs/$Branch"` → `Join-Path $RepoRoot ".specify/specs/$Branch"`

**影响范围**:
- 所有使用 `Get-FeatureDir` 和 `Get-FeaturePathsEnv` 函数的脚本
- 包括：`check-prerequisites.ps1`, `setup-plan.ps1`, `create-new-feature.ps1`, `update-agent-context.ps1`

## 页面架构规定

### ✅ 强制规定：衍生页面必须放在对应主页面的 data 目录下

**规则**:
- `src/pages/` 下只能有 5 个主页面：`home`, `login`, `joy`, `care`, `profile`
- 所有衍生页面（如社区选择）必须放在对应主页面的 `data/` 目录下
- 衍生页面使用场景：从一个主页面跳转到的子功能页面

**示例**:
- 社区选择页面 → `src/pages/home/data/community-select/`
- 登录协议页面 → `src/pages/login/data/agreement/`
- 隐私政策页面 → `src/pages/login/data/privacy/`

**原因**:
1. **扁平化结构**: 保持 pages 目录简洁，只有 5 个主入口
2. **逻辑归属**: 衍生页面从属于其主页面（协议从属于登录页）
3. **路由管理**: 小程序路由更容易理解和维护
4. **团队协作**: 明确哪个团队负责哪些页面的衍生功能

**判断标准**:
- ❌ 不要在 `src/pages/` 下创建新的顶级页面目录
- ✅ 如果是子功能，判断它从属于哪个主页面，放在该页面的 `data/` 下
- ✅ 例如：社区选择从属于主页（因为选择社区后进入首页），所以放在 `home/data/community-select/`

## 原因

1. **集中管理**: 所有规格和计划文件集中在 `.specify` 目录，便于管理和版本控制
2. **清晰分离**: 区分规格文件（`.specify`）和源代码（`src/`）
3. **避免冲突**: 防止与项目其他 `specs/` 目录冲突
4. **统一标准**: 与 Spec Kit 工作流设计一致

## 验证

运行以下命令验证配置：

```bash
# 检查功能文件位置
ls -la .specify/specs/001-community-select/

# 检查脚本路径
grep -n "\.specify/specs" .specify/scripts/powershell/common.ps1

# 检查页面架构（pages 下只有 5 个主页面）
ls -la src/pages/

# 检查衍生页面位置（在对应主页面的 data 目录下）
ls -la src/pages/home/data/community-select/
ls -la src/pages/login/data/agreement/
ls -la src/pages/login/data/privacy/
```

## 常见错误

### ❌ 错误 1: 在 pages 下创建新顶级页面

```bash
# 错误：创建了新的顶级页面
src/pages/community-select/  # ❌ 错误
```

**正确做法**: 放在主页面的 data 目录下
```bash
# 正确：放在 home/data 下
src/pages/home/data/community-select/  # ✅ 正确
```

### ❌ 错误 2: 规格文件放在错误位置

```bash
# 错误：在仓库根目录创建 specs
specs/001-community-select/  # ❌ 错误
```

**正确做法**: 放在 `.specify` 目录下
```bash
# 正确：放在 .specify 下
.specify/specs/001-community-select/  # ✅ 正确
```

## 注意事项

- ⚠️ 如果在仓库根目录看到 `specs/` 目录，请将其移动到 `.specify/specs/`
- ⚠️ 创建新功能时，确保文件自动创建在 `.specify/specs/` 目录中
- ✅ 所有 Spec Kit 命令（`/speckit.specify`, `/speckit.plan`, `/speckit.tasks`）现在都会使用正确的路径
