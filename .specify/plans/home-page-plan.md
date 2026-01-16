# Implementation Plan - 首页重构

---

## 技术选型

### 前端框架
- **框架**：Taro 4.0.9 + React 18
- **状态管理**：Zustand（已有 userStore）
- **路由**：Taro 路由

### UI 组件
- **基础组件**：Taro 原生组件（View, Text, Image, Swiper, ScrollView）
- **自定义组件**：项目内组件

### 数据处理
- **数据源**：虚拟数据（mockData.ts）
- **图片**：本地资源 + Unsplash 免费图片

### 其他工具
- **样式**：SCSS
- **类型检查**：TypeScript 5.2

---

## 数据模型

```typescript
// src/pages/home/types.ts

// 轮播海报
export interface Banner {
  id: string
  image: string
  title: string
  link: string
}

// 服务入口
export interface ServiceEntry {
  id: string
  icon: string
  title: string
  route: string
  type?: string
}

// 通知
export interface Notification {
  id: string
  content: string
  type: 'info' | 'activity' | 'urgent'
  link?: string
}

// 活动推荐
export interface Activity {
  id: string
  title: string
  image: string
  time: string
  location?: string
  tag: string
  link?: string
}
```

---

## Store 设计

当前使用已有的 `userStore`，无需额外 Store。

页面级状态使用 `useState` 管理：
```typescript
const [banners, setBanners] = useState<Banner[]>([])
const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
const [notifications, setNotifications] = useState<Notification[]>([])
const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0)
```

---

## 目录结构

```
src/pages/home/
├── index.tsx                    # 主页面组件
├── index.scss                   # 页面样式
├── index.config.ts              # 页面配置
├── types.ts                     # 类型定义
├── mockData.ts                  # 虚拟数据
└── components/                  # 子组件
    ├── BannerSwiper/
    │   ├── index.tsx           # 轮播组件
    │   └── index.scss          # 轮播样式
    ├── ServiceGrid/
    │   ├── index.tsx           # 服务网格组件
    │   └── index.scss          # 服务网格样式
    ├── NotificationBar/
    │   ├── index.tsx           # 通知栏组件
    │   └── index.scss          # 通知栏样式
    ├── ActivityCard/
    │   ├── index.tsx           # 活动卡片组件
    │   └── index.scss          # 活动卡片样式
    └── WelcomeSection/
        ├── index.tsx           # 欢迎区组件
        └── index.scss          # 欢迎区样式

assets/images/
├── banners/                     # 轮播图
│   ├── banner1.jpg
│   ├── banner2.jpg
│   └── banner3.jpg
├── activities/                  # 活动图片
│   ├── activity1.jpg
│   ├── activity2.jpg
│   └── activity3.jpg
└── icons/home/                  # 服务图标
    ├── icon-health.png
    ├── icon-activity.png
    ├── icon-food.png
    ├── icon-travel.png
    ├── icon-nursing.png
    ├── icon-hotel.png
    └── icon-spa.png
```

---

## 关键技术决策

### 决策 1：组件拆分策略
**选择**：将首页拆分为 5 个独立子组件
**原因**：
- 每个区域职责单一，便于维护
- 组件可复用（如 ActivityCard）
- 便于测试和优化

**权衡**：
- 优点：代码清晰，易于维护
- 缺点：文件数量增加

### 决策 2：数据管理方式
**选择**：使用虚拟数据，页面级状态管理
**原因**：
- 晚晴项目暂不接后端
- 页面数据简单，无需全局状态
- 为后续接入 API 预留接口

**权衡**：
- 优点：简单直接，学习成本低
- 缺点：数据仅在本地，刷新后重置

### 决策 3：图片加载优化
**选择**：使用 Taro Image 组件 + lazyLoad
**原因**：
- 支持懒加载，提升性能
- 自动适配不同屏幕
- 支持加载失败占位

**权衡**：
- 优点：性能好，用户体验佳
- 缺点：需要处理加载状态

### 决策 4：轮播图实现
**选择**：使用 Taro Swiper 组件
**原因**：
- 原生支持，性能好
- API 简单易用
- 自动播放和手动滑动

**权衡**：
- 优点：稳定可靠
- 缺点：定制性有限

---

## 组件设计

### BannerSwiper 组件
**职责**：展示轮播海报

**Props**：
```typescript
interface Props {
  data: Banner[]
  autoplay?: boolean
  interval?: number
  onChange?: (index: number) => void
  onItemClick?: (item: Banner) => void
}
```

**特性**：
- 自动播放，3 秒间隔
- 指示器显示当前位置
- 点击跳转到对应页面
- 图片懒加载

### ServiceGrid 组件
**职责**：展示服务入口网格

**Props**：
```typescript
interface Props {
  data: ServiceEntry[]
  columns?: number  // 默认 3
  onItemClick?: (item: ServiceEntry) => void
}
```

**特性**：
- 网格布局（2 行 × 3 列）
- 图标 + 文字
- 点击反馈效果
- 支持跳转或 Toast 提示

### NotificationBar 组件
**职责**：展示滚动通知

**Props**：
```typescript
interface Props {
  data: Notification[]
  autoplay?: boolean
  interval?: number
}
```

**特性**：
- 垂直滚动
- 自动播放
- 图标 + 文字
- 浅橙色背景

### ActivityCard 组件
**职责**：展示单个活动卡片

**Props**：
```typescript
interface Props {
  data: Activity
  onClick?: (item: Activity) => void
}
```

**特性**：
- 封面图 + 标题 + 时间 + 标签
- 圆角卡片
- 点击反馈

### WelcomeSection 组件
**职责**：展示欢迎区

**Props**：
```typescript
interface Props {
  username?: string
  subtitle?: string
}
```

**特性**：
- 用户问候
- 欢迎语
- 从 userStore 获取用户名

---

## 路由设计

```typescript
// app.config.ts
pages: [
  'pages/home/index',           // 首页
  'pages/joy/index',            // 乐享（Tab 页）
  'pages/care/index',           // 颐养（Tab 页）
  'pages/profile/index'         // 个人中心（Tab 页）
]

tabBar: {
  list: [
    { pagePath: 'pages/home/index', text: '首页' },
    { pagePath: 'pages/joy/index', text: '乐享' },
    { pagePath: 'pages/care/index', text: '颐养' },
    { pagePath: 'pages/profile/index', text: '我的' }
  ]
}
```

**跳转逻辑**：
- Tab 页面：使用 `Taro.switchTab`
- 普通页面：使用 `Taro.navigateTo`
- 功能开发中：使用 `Taro.showToast`

---

## 性能优化

### 图片优化
- 使用 `lazyLoad` 懒加载
- 图片压缩（已下载的图片已优化）
- 使用合适尺寸（轮播图 800×400，卡片 600×400）

### 渲染优化
- 使用 `React.memo` 包装子组件
- 避免不必要的重渲染
- 使用 `useCallback` 缓存事件处理函数

### 代码分割
- 组件按需加载（如需要）
- 图片资源本地化

---

## 样式规范

### 颜色系统
```scss
$primary-color: #ff9800;     // 主题色（橙色）
$bg-color: #f5f5f5;          // 背景色
$card-bg: #ffffff;           // 卡片背景
$text-primary: #333333;      // 主文字
$text-secondary: #666666;    // 次要文字
$text-light: #999999;        // 浅色文字
$notification-bg: #FFF3E0;   // 通知背景
```

### 字号系统
```scss
$font-size-sm: 28rpx;        // 14px - 最小字号
$font-size-md: 32rpx;        // 16px - 正文
$font-size-lg: 36rpx;        // 18px - 重要信息
$font-size-xl: 40rpx;        // 20px - 标题
```

### 间距系统
```scss
$spacing-xs: 16rpx;
$spacing-sm: 24rpx;
$spacing-md: 32rpx;
$spacing-lg: 48rpx;
```

### 卡片样式
```scss
.card {
  background: $card-bg;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  padding: 24rpx;

  &--press {
    transform: scale(0.95);
    transition: transform 0.1s;
  }
}
```

---

## 开发顺序

### Phase 1: 准备工作
- [x] 下载图片和图标资源
- [x] 创建 types.ts 定义类型
- [ ] 创建 mockData.ts 添加虚拟数据
- [ ] 创建组件目录结构

### Phase 2: 基础组件
- [ ] WelcomeSection 组件
- [ ] BannerSwiper 组件
- [ ] NotificationBar 组件
- [ ] ServiceGrid 组件
- [ ] ActivityCard 组件

### Phase 3: 页面实现
- [ ] 主页面组件（index.tsx）
- [ ] 整合所有子组件
- [ ] 实现交互逻辑

### Phase 4: 样式优化
- [ ] 页面样式（index.scss）
- [ ] 子组件样式
- [ ] 响应式适配
- [ ] 中老年用户适配

### Phase 5: 测试和调试
- [ ] 功能测试
- [ ] 样式检查
- [ ] 性能检查
- [ ] 兼容性检查

---

## 风险和挑战

### 风险 1：图片资源加载
**影响**：图片加载慢或失败，影响用户体验
**应对**：
- 使用懒加载
- 添加占位图
- 压缩图片大小
- 使用本地资源

### 风险 2：轮播图性能
**影响**：轮播图可能卡顿
**应对**：
- 限制轮播图数量（3-5 张）
- 使用原生 Swiper 组件
- 图片预加载

### 风险 3：中老年用户体验
**影响**：用户操作不便
**应对**：
- 大按钮、大字号
- 简单交互
- 明确反馈
- 高对比度

---

## 后续优化

- [ ] 接入真实后端 API
- [ ] 添加下拉刷新
- [ ] 添加数据缓存
- [ ] 优化动画效果
- [ ] 添加骨架屏加载
- [ ] 添加错误边界处理

---

**创建日期**：2025-01-14
**版本**：1.0.0
**作者**：Claude
