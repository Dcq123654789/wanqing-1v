# 晚晴小程序 - 首页规格说明

---

## 功能概述

首页是晚晴养老服务小程序的核心入口，为用户提供快速访问各类服务的入口，展示活动推荐和重要通知。

**核心目标**：让中老年用户能够快速找到所需服务，了解最新活动信息。

---

## 页面结构

### 1. 顶部欢迎区
- **内容**：
  - 用户问候："您好，{用户名}"
  - 欢迎语："欢迎使用晚晴"
  - 当前日期/天气（可选）
- **样式**：
  - 白色背景，圆角卡片
  - 标题字号：36rpx（18px）
  - 副标题字号：28rpx（14px）
  - 内边距：32rpx

### 2. 海报轮播区（Banner Swiper）
- **内容**：3-5 张轮播海报，展示：
  - 健康养生讲座
  - 旅游活动推荐
  - 敬老院服务
  - 康复理疗优惠
- **交互**：
  - 自动播放，间隔 3 秒
  - 支持手动滑动
  - 点击跳转到对应详情页
- **样式**：
  - 圆角卡片，带阴影
  - 高度：320rpx
  - 指示器：底部居中，橙色圆点

### 3. 服务入口网格
- **布局**：2 行 × 3 列网格布局（共 6 个服务入口）
- **服务类型**：
  1. **健康管理** → 跳转颐养页面
  2. **活动预约** → 显示活动列表
  3. **餐饮服务** → 显示餐饮推荐
  4. **出行服务** → 跳转乐享页面
  5. **康复理疗** → 跳转颐养页面
  6. **更多服务** → 显示所有服务

- **样式**：
  - 每个卡片：圆角白色背景
  - 图标：80rpx × 80rpx
  - 标题：32rpx
  - 卡片间距：24rpx
  - 点击反馈：按下效果

### 4. 通知栏
- **内容**：滚动显示重要通知
  - "健康养生讲座将于今日 14:00 开始"
  - "太极拳晨练活动每日 7:00 准时开始"
  - "新增康复理疗服务，欢迎体验"
- **样式**：
  - 浅橙色背景 (#FFF3E0)
  - 图标：铃铛图标
  - 字号：28rpx
  - 图标颜色：主题橙色

### 5. 活动推荐区
- **标题**："为您推荐"
- **布局**：横向滚动的卡片列表
- **卡片内容**：
  - 活动封面图（600rpx × 400rpx）
  - 活动标题
  - 活动时间/地点
  - 活动标签（免费/热门/活动）
- **交互**：点击查看活动详情
- **样式**：
  - 卡片宽度：520rpx
  - 卡片间距：24rpx
  - 圆角：16rpx
  - 标签：橙色背景，白色文字

---

## 展示内容

### 虚拟数据结构

```typescript
// 轮播海报
interface Banner {
  id: string
  image: string
  title: string
  link: string  // 跳转路径
}

// 服务入口
interface ServiceEntry {
  id: string
  icon: string
  title: string
  route: string
  type?: string  // 分类类型
}

// 通知
interface Notification {
  id: string
  content: string
  type: 'info' | 'activity' | 'urgent'
  link?: string
}

// 活动推荐
interface Activity {
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

## 交互设计

### 导航跳转
- **点击服务卡片**：
  - 如果是 Tab 页面，使用 `Taro.switchTab`
  - 如果是普通页面，使用 `Taro.navigateTo`
  - 如果功能开发中，显示 "功能开发中" 提示

- **点击轮播图**：跳转到对应的详情页或活动页

- **点击活动卡片**：显示活动详情（Toast 提示或跳转详情页）

### 视觉反馈
- **点击效果**：卡片按下时有缩放效果（scale: 0.95）
- **加载状态**：图片加载时显示占位图
- **空状态**：无数据时显示 "暂无内容" 提示

---

## 样式要求

### 颜色系统
```scss
$primary-color: #ff9800;     // 主题色（橙色）
$bg-color: #f5f5f5;          // 背景色
$card-bg: #ffffff;           // 卡片背景
$text-primary: #333333;      // 主文字
$text-secondary: #666666;    // 次要文字
$text-light: #999999;        // 浅色文字
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

### 组件样式规范
- **卡片**：
  - 圆角：16rpx
  - 阴影：`0 4rpx 16rpx rgba(0, 0, 0, 0.08)`
  - 内边距：24rpx

- **按钮**：
  - 最小高度：88rpx（44px）
  - 圆角：12rpx
  - 背景色：主题橙色

---

## 数据需求

### 数据来源
- **当前**：使用虚拟数据（mockData）
- **未来**：接入后端 API

### 数据条数
- 轮播海报：3-5 张
- 服务入口：6 个
- 通知：3 条
- 活动推荐：4-6 个

### 数据文件
```typescript
// src/pages/home/mockData.ts
export const mockBanners: Banner[] = [...]
export const mockServices: ServiceEntry[] = [...]
export const mockNotifications: Notification[] = [...]
export const mockActivities: Activity[] = [...]
```

---

## 技术考虑

### 组件拆分
```
pages/home/
├── index.tsx                # 主页面
├── index.scss               # 页面样式
├── index.config.ts          # 页面配置
└── components/
    ├── BannerSwiper.tsx     # 轮播组件
    ├── ServiceGrid.tsx      # 服务网格
    ├── NotificationBar.tsx  # 通知栏
    ├── ActivityCard.tsx     # 活动卡片
    └── WelcomeSection.tsx   # 欢迎区
```

### 技术要点
- 使用 Taro Swiper 组件实现轮播
- 使用 ScrollView 实现横向滚动
- 图片懒加载（lazyLoad）
- 使用 require 或 import 引入本地图片

---

## 中老年用户适配

### 字体适配
- 所有文字 ≥ 28rpx（14px）
- 标题使用大字号（36rpx+）
- 重要信息使用粗体

### 交互适配
- 按钮足够大（≥ 88rpx）
- 点击区域宽松
- 操作步骤简单（直接跳转）

### 视觉适配
- 高对比度配色
- 图标配文字说明
- 避免复杂动画

---

## 验收标准

- [ ] 页面布局符合设计要求
- [ ] 所有图标和图片正确显示
- [ ] 轮播图自动播放和手动滑动正常
- [ ] 服务入口点击跳转正常
- [ ] 活动卡片横向滚动流畅
- [ ] 通知栏内容清晰可读
- [ ] 字号适合中老年用户（≥ 28rpx）
- [ ] 点击有明确的视觉反馈
- [ ] 无明显卡顿或加载延迟
- [ ] 代码符合 ESLint 规范
- [ ] TypeScript 类型完整

---

## 不包含的内容

- 不包含在线支付功能
- 不包含用户评论功能
- 不包含社交分享功能
- 不包含数据统计功能
- 不包含推送通知功能

---

## 参考资料

### 图片资源来源
- [Unsplash - Senior Travel](https://unsplash.com/s/photos/senior-travel)
- [Unsplash - Elderly Care](https://unsplash.com/s/photos/elderly-care)
- [Unsplash - Active Seniors](https://unsplash.com/s/photos/active-seniors)

### 图标资源来源
- [Icons8 - Healthy & Lifestyle Icons](https://icons8.com/icons/set)

### 项目文档
- `.specify/memory/constitution.md` - 项目治理原则

---

**创建日期**：2025-01-14
**版本**：1.0.0
**作者**：Claude
**适用项目**：晚晴养老服务小程序
