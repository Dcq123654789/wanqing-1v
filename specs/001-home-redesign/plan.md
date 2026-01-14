# Implementation Plan - 首页重构

## 技术选型

- **框架**：Taro 4.0.9 + React 18
- **状态管理**：Zustand（使用现有 userStore）
- **样式**：SCSS
- **组件**：View, Text, Image, ScrollView

---

## 页面结构设计

```
┌─────────────────────────────┐
│     欢迎区（无背景图）        │
│  您好，[用户名] 👋           │
├─────────────────────────────┤
│     服务入口（2x2网格）       │
│  ┌────┐ ┌────┐             │
│  │🏥  │ │📅  │             │
│  │健康│ │活动│             │
│  ├────┤ ├────┤             │
│  │🍲  │ │🚗  │             │
│  │餐饮│ │出行│             │
│  └────┘ └────┘             │
├─────────────────────────────┤
│     活动推荐（横向滑动）      │
│  ┌──────┐ ┌──────┐         │
│  │活动1 │ │活动2 │ →        │
│  └──────┘ └──────┘         │
└─────────────────────────────┘
```

---

## 组件设计

### 1. ServiceCard（服务卡片组件）

**职责**：展示单个服务入口

**Props**：
```typescript
interface Props {
  icon: string;           // 图标（emoji）
  title: string;          // 服务名称
  route?: string;         // 跳转路径（可选）
  onClick?: () => void;   // 点击回调
}
```

**样式**：
```scss
.service-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 16rpx;
  padding: 48rpx 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;

  &:active {
    transform: scale(0.95);
  }

  &__icon {
    font-size: 80rpx;
    margin-bottom: 16rpx;
  }

  &__title {
    font-size: 32rpx;
    color: #333;
  }
}
```

### 2. ActivityCard（活动卡片组件）

**职责**：展示单个活动推荐

**Props**：
```typescript
interface Activity {
  id: string;
  title: string;
  image: string;
  time: string;
  tag: string;
}

interface Props {
  data: Activity;
  onClick?: () => void;
}
```

**样式**：
```scss
.activity-card {
  flex-shrink: 0;
  width: 560rpx;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  margin-right: 24rpx;

  &__image {
    width: 100%;
    height: 280rpx;
  }

  &__content {
    padding: 24rpx;
  }

  &__title {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 12rpx;
  }

  &__time {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 8rpx;
  }

  &__tag {
    display: inline-block;
    padding: 4rpx 12rpx;
    background: #ff9800;
    color: #fff;
    font-size: 24rpx;
    border-radius: 8rpx;
  }
}
```

---

## 数据结构

### 活动数据（虚拟数据）
```typescript
interface Activity {
  id: string;
  title: string;
  image: string;
  time: string;
  tag: string;
}

// Mock 数据
const mockActivities: Activity[] = [
  {
    id: '1',
    title: '健康养生讲座',
    image: require('@/assets/images/illustrations/welcome-illustration.png'),
    time: '今天 14:00',
    tag: '免费'
  },
  {
    id: '2',
    title: '太极拳晨练',
    image: require('@/assets/images/illustrations/activity-illustration.png'),
    time: '每日 7:00',
    tag: '热门'
  },
  {
    id: '3',
    title: '书法交流',
    image: require('@/assets/images/illustrations/community-illustration.png'),
    time: '周三 14:00',
    tag: '活动'
  }
];
```

### 服务入口配置
```typescript
interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  route?: string;
}

const services: ServiceItem[] = [
  { id: '1', icon: '🏥', title: '健康管理', route: '/pages/care/index' },
  { id: '2', icon: '📅', title: '活动预约' },
  { id: '3', icon: '🍲', title: '餐饮服务' },
  { id: '4', icon: '🚗', title: '出行服务' }
];
```

---

## 页面实现

### 布局结构
```tsx
function Home() {
  const { userInfo } = useUserStore();

  return (
    <View className="home-page">
      <ScrollView scrollY className="home-scroll">
        {/* 1. 欢迎区 */}
        <View className="welcome-section">
          <Text className="welcome-text">
            您好，{userInfo?.username || '访客'} 👋
          </Text>
        </View>

        {/* 2. 服务入口 */}
        <View className="services-section">
          <View className="services-grid">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title}
                onClick={() => handleServiceClick(service)}
              />
            ))}
          </View>
        </View>

        {/* 3. 活动推荐 */}
        <View className="activities-section">
          <Text className="section-title">为您推荐</Text>
          <ScrollView scrollX className="activities-scroll">
            <View className="activities-list">
              {mockActivities.map(activity => (
                <ActivityCard
                  key={activity.id}
                  data={activity}
                  onClick={() => handleActivityClick(activity)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
```

---

## 样式规范

### 全局样式变量（复用 variables.scss）
```scss
$primary-color: #ff9800;
$text-color: #333;
$text-light: #666;
$bg-color: #f5f5f5;
$spacing-md: 32rpx;
$spacing-lg: 48rpx;
$font-size-md: 32rpx;
$font-size-lg: 36rpx;
```

### 页面容器
```scss
.home-page {
  min-height: 100vh;
  background: $bg-color;
}

.home-scroll {
  height: 100vh;
}
```

### 欢迎区
```scss
.welcome-section {
  padding: 60rpx 32rpx 40rpx;
  background: #fff;

  &__text {
    font-size: 36rpx;
    color: $text-color;
  }
}
```

---

## 交互处理

### 服务入口点击
```typescript
const handleServiceClick = (service: ServiceItem) => {
  if (service.route) {
    Taro.switchTab({ url: service.route });
  } else {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  }
};
```

### 活动点击
```typescript
const handleActivityClick = (activity: Activity) => {
  Taro.showToast({
    title: `查看活动：${activity.title}`,
    icon: 'none'
  });
  // 后续可跳转到详情页
};
```

---

## 实现步骤

### Phase 1: 创建组件
1. 创建 `ServiceCard` 组件
2. 创建 `ActivityCard` 组件

### Phase 2: 重构页面
1. 删除现有内容（背景图、退出登录等）
2. 实现新的欢迎区
3. 实现服务入口网格
4. 实现活动推荐横向滑动

### Phase 3: 添加交互
1. 实现服务点击跳转
2. 实现活动点击反馈
3. 添加按下动画效果

---

## 文件清单

需要修改的文件：
- `src/pages/home/index.tsx` - 主页面
- `src/pages/home/index.scss` - 页面样式

需要创建的文件：
- `src/pages/home/components/ServiceCard/index.tsx` - 服务卡片组件
- `src/pages/home/components/ServiceCard/index.scss` - 服务卡片样式
- `src/pages/home/components/ActivityCard/index.tsx` - 活动卡片组件
- `src/pages/home/components/ActivityCard/index.scss` - 活动卡片样式

---

## 后续优化

- [ ] 添加下拉刷新
- [ ] 添加加载骨架屏
- [ ] 接入真实 API
- [ ] 添加活动筛选功能

---

**最后更新**：2026-01-14
**版本**：1.0.0
