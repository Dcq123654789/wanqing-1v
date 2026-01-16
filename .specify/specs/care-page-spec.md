# 晚晴小程序 - 颐养页面规格说明

---

## 功能概述

颐养页面是晚晴养老服务小程序的健康管理中心，为用户提供健康管理、康复理疗、用药提醒、养生指导等功能入口，展示健康数据和推荐的健康服务。

**核心目标**：帮助中老年用户管理健康，提供便捷的健康服务和养生指导。

---

## 页面结构

### 1. 顶部欢迎区
- **内容**：
  - 页面标题："颐养身心"
  - 欢迎语："专业健康管理，守护您的健康"
  - 装饰元素：健康图标（心形、十字等）
- **样式**：
  - 蓝色渐变背景（#1890ff → #40a9ff）
  - 标题字号：40rpx（20px），白色粗体
  - 副标题字号：28rpx（14px），半透明白色
  - 内边距：48rpx
  - 高度：180px

### 2. 健康数据卡片
- **内容**：
  - 标题："今日健康"
  - 日期：显示当前日期
  - 健康指标（3项）：
    1. **步数**：7,542 步
    2. **睡眠**：6.5h
    3. **血压**：120/80 mmHg
- **样式**：
  - 白色背景卡片，圆角 16rpx
  - 标题字号：36rpx，深色字体
  - 数值字号：20px，粗体显示
  - 卡片阴影：`0 4rpx 16rpx rgba(0, 0, 0, 0.08)`
  - 内边距：32rpx
  - 指标间距：分隔线或空格

### 3. 健康服务网格
- **布局**：2 行 × 2 列网格布局（共 4 个服务入口）
- **服务类型**：
  1. **在线问诊** → 跳转问诊页面
     - 图标：🩺
     - 描述："专业医生在线咨询"
  2. **用药提醒** → 显示用药列表
     - 图标：💊
     - 描述："定时提醒，关爱健康"
  3. **康复理疗** → 跳转理疗页面
     - 图标：🏥
     - 描述："专业康复，恢复健康"
  4. **养生指导** → 显示养生文章
     - 图标：🧘
     - 描述："中医养生，调理身心"

- **样式**：
  - 每个卡片：白色背景，圆角 12rpx
  - 图标：67rpx × 67rpx，圆形背景
  - 标题：32rpx，粗体
  - 描述：28rpx，次要颜色
  - 卡片间距：24rpx
  - 点击反馈：按下缩放效果
  - 背景色：浅蓝渐变背景（#e6f7ff）

### 4. 健康资讯/插图卡片
- **内容**：
  - 插图：健康相关的自然/运动场景
  - 标题："亲近自然，放松心情"
  - 描述："户外活动有益身心健康"
- **样式**：
  - 圆角卡片，16rpx
  - 高度：224px
  - 图片模式：aspectFill
  - 文字遮罩：底部渐变黑色半透明
  - 标题字号：36rpx，白色
  - 描述字号：28rpx，半透明白色

---

## 展示内容

### 虚拟数据结构

```typescript
// 健康数据
interface HealthData {
  date: string           // 当前日期
  steps: number          // 步数
  sleep: string          // 睡眠时长
  bloodPressure: string  // 血压
}

// 健康服务
interface HealthService {
  id: string
  icon: string           // emoji 或图标
  title: string
  description: string
  route: string          // 跳转路径
  type: 'consult' | 'medication' | 'rehab' | 'wellness'
}

// 健康资讯
interface WellnessTip {
  id: string
  image: string
  title: string
  description: string
  link?: string
}
```

---

## 交互设计

### 导航跳转
- **点击服务卡片**：
  - 如果页面已开发，使用 `Taro.navigateTo` 跳转
  - 如果功能开发中，显示 "功能开发中" 提示（Toast）
  - 记录用户操作日志（未来功能）

- **点击健康数据**：
  - 显示健康详情弹窗
  - 展示更多健康指标（心率、体重等）

- **点击资讯卡片**：
  - 显示资讯详情或跳转文章页

### 视觉反馈
- **点击效果**：服务卡片按下时缩放（scale: 0.98）
- **加载状态**：图片加载时显示占位背景色
- **空状态**：无数据时显示 "暂无健康数据" 提示
- **错误处理**：网络错误时显示重试按钮

---

## 样式要求

### 颜色系统（颐养专属）
```scss
// 主题色
$care-primary: #1890ff;      // 主蓝色
$care-secondary: #40a9ff;    // 浅蓝色
$care-gradient: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);

// 背景色
$care-bg: #e6f7ff;           // 浅蓝背景
$care-bg-light: #f0f9ff;     // 更浅蓝背景

// 通用颜色（复用）
$card-bg: #ffffff;           // 卡片背景
$text-primary: #333333;      // 主文字
$text-secondary: #666666;    // 次要文字
$text-light: #999999;        // 浅色文字
```

### 字号系统
```scss
$font-size-sm: 28rpx;        // 14px - 描述文字
$font-size-md: 32rpx;        // 16px - 正文
$font-size-lg: 36rpx;        // 18px - 小标题
$font-size-xl: 40rpx;        // 20px - 大标题
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
  - 内边距：32rpx
  - 背景色：#ffffff

- **服务卡片**：
  - 圆角：12rpx
  - 内边距：24rpx
  - 图标容器：67rpx × 67rpx，圆形，白色背景
  - 活动态：`:active { transform: scale(0.98) }`

- **顶部渐变区**：
  - 渐变：`linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)`
  - 高度：180px
  - 文字颜色：白色

---

## 数据需求

### 数据来源
- **当前**：使用虚拟数据（mockData）
- **未来**：接入后端 API（用户健康数据）

### 数据条目
- 健康数据：1 条（当日数据）
- 健康服务：4 个
- 健康资讯：1 条

### 数据文件
```typescript
// src/pages/care/mockData.ts
export const mockHealthData: HealthData = {
  date: '2026年1月12日',
  steps: 7542,
  sleep: '6.5h',
  bloodPressure: '120/80'
}

export const mockHealthServices: HealthService[] = [
  {
    id: '1',
    icon: '🩺',
    title: '在线问诊',
    description: '专业医生在线咨询',
    route: '/pages/consult/index',
    type: 'consult'
  },
  // ...
]

export const mockWellnessTips: WellnessTip[] = [...]
```

---

## 技术考虑

### 组件拆分（可选）
```
pages/care/
├── index.tsx                   # 主页面
├── index.scss                  # 页面样式
├── index.config.ts             # 页面配置
├── mockData.ts                 # Mock 数据
└── components/
    ├── HealthCard.tsx          # 健康数据卡片
    ├── ServiceGrid.tsx         # 服务网格
    └── WellnessCard.tsx        # 健康资讯卡片
```

### 技术要点
- 使用 Taro View、Text、Image 组件
- 使用 ScrollView 实现页面滚动
- 使用 require 或 import 引入本地图片
- 图片懒加载（lazyLoad）
- 使用 dayjs 处理日期显示（可选）

---

## 中老年用户适配

### 字体适配
- 所有文字 ≥ 28rpx（14px）
- 健康数值使用大字号（20px+）
- 服务标题使用粗体（32rpx+）
- 重要信息突出显示

### 交互适配
- 服务卡片足够大（最小 88rpx 高度）
- 点击区域宽松，避免误触
- 操作简单，直接跳转
- 清晰的视觉反馈

### 视觉适配
- 蓝色主题给人专业、可靠的感觉
- 高对比度配色
- 图标配文字说明
- 避免复杂动画

---

## 验收标准

- [ ] 页面布局符合设计要求
- [ ] 主题色使用蓝色渐变（#1890ff → #40a9ff）
- [ ] 所有图标和图片正确显示
- [ ] 健康数据展示清晰
- [ ] 服务卡片点击跳转正常
- [ ] 字号适合中老年用户（≥ 28rpx）
- [ ] 点击有明确的视觉反馈
- [ ] 无明显卡顿或加载延迟
- [ ] 代码符合 ESLint 规范
- [ ] TypeScript 类型完整
- [ ] 页面背景有装饰性元素

---

## 不包含的内容

- 不包含在线支付功能
- 不包含用户评论功能
- 不包含社交分享功能
- 不包含健康数据编辑功能（仅展示）
- 不包含推送通知功能

---

## 参考资料

### 图片资源来源
- [Unsplash - Health & Wellness](https://unsplash.com/s/photos/health)
- [Unsplash - Medical Care](https://unsplash.com/s/photos/medical)
- [Undraw - Health Illustrations](https://undraw.co/illustrations)

### 图标资源来源
- [Icons8 - Medical Icons](https://icons8.com/icons/set/medical)
- [Emoji - Health Symbols](https://emoji.gg/)

### 项目文档
- `.specify/memory/constitution.md` - 项目治理原则
- `docs/specs/home-page-spec.md` - 首页规格参考

---

**创建日期**：2026-01-15
**版本**：1.0.0
**作者**：Claude
**适用项目**：晚晴养老服务小程序
