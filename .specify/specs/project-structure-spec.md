# 项目结构规范

## 目录组织原则

项目采用清晰的分层结构，便于维护和扩展。

## pages 目录结构

```
src/pages/
├── login/           # 登录相关页面
│   ├── index.tsx                    # 登录主页
│   ├── index.scss
│   ├── index.config.ts
│   ├── agreement/                   # 用户协议页面（衍生页面）
│   │   ├── index.tsx
│   │   ├── index.scss
│   │   └── index.config.ts
│   └── privacy/                     # 隐私政策页面（衍生页面）
│       ├── index.tsx
│       ├── index.scss
│       └── index.config.ts
├── home/           # 首页（主功能）
│   ├── index.tsx
│   ├── index.scss
│   ├── index.config.ts
│   └── [衍生页面文件夹]/
├── joy/            # 乐享（主功能）
│   ├── index.tsx
│   ├── index.scss
│   ├── index.config.ts
│   └── [衍生页面文件夹]/
├── care/           # 颐养（主功能）
│   ├── index.tsx
│   ├── index.scss
│   ├── index.config.ts
│   └── [衍生页面文件夹]/
└── profile/        # 个人中心（主功能）
    ├── index.tsx
    ├── index.scss
    ├── index.config.ts
    └── [衍生页面文件夹]/
```

## 文件组织规则

### 1. pages 文件夹层级

- **一级目录**：只放置登录页面和四个主功能页面
  - `login/` - 登录相关
  - `home/` - 首页
  - `joy/` - 乐享
  - `care/` - 颐养
  - `profile/` - 个人中心

### 2. 衍生页面放置规则

- 所有从主页面衍生的子页面，都放在对应主功能文件夹内部
- 例如：登录页面的用户协议和隐私政策页面，放在 `login/` 文件夹下的 `agreement/` 和 `privacy/` 子文件夹中

### 3. 页面文件组成

每个页面必须包含三个文件：
- `index.tsx` - 页面逻辑和 UI
- `index.scss` - 页面样式
- `index.config.ts` - 页面配置（导航栏等）

### 4. 命名规范

- 文件夹名：使用小写字母和连字符，如 `user-profile`
- 文件名：统一使用 `index.tsx`、`index.scss`、`index.config.ts`
- 组件名：使用 PascalCase，如 `UserProfile`

## 路由配置规则

在 `src/app.config.ts` 中注册页面时：

```typescript
pages: [
  'pages/login/index',
  'pages/home/index',
  'pages/joy/index',
  'pages/care/index',
  'pages/profile/index',
  // 衍生页面放在主功能路径下
  'pages/login/agreement/index',
  'pages/login/privacy/index',
  'pages/home/sub-page/index',  // 示例：home 的衍生页面
]
```

## 页面跳转规范

使用 Taro.navigateTo 进行页面跳转时：

```typescript
// 同一功能下的页面跳转
Taro.navigateTo({
  url: '/pages/login/agreement/index',
});

// 跨功能跳转（尽量减少）
Taro.switchTab({
  url: '/pages/home/index',
});
```

## 好处

1. **清晰的层级关系**：一眼就能看出哪些页面属于哪个功能模块
2. **便于维护**：相关文件集中管理
3. **易于扩展**：新增衍生页面时，在对应文件夹下创建即可
4. **避免命名冲突**：不同功能下的同名页面不会冲突

## 示例场景

假设需要在"个人中心"页面添加"我的订单"和"设置"页面：

```
profile/
├── index.tsx              # 个人中心主页
├── index.scss
├── index.config.ts
├── orders/                # 我的订单（衍生页面）
│   ├── index.tsx
│   ├── index.scss
│   └── index.config.ts
└── settings/              # 设置（衍生页面）
    ├── index.tsx
    ├── index.scss
    └── index.config.ts
```

路由配置：
```typescript
'pages/profile/orders/index',
'pages/profile/settings/index',
```
