# 晚晴首页设计资源

## 配色方案（橙黄渐变主题）

### 主色调
```scss
// 主色：橙黄渐变
$primary-gradient: linear-gradient(135deg, #FFB347 0%, #FFCC33 100%);
$secondary-gradient: linear-gradient(135deg, #FF9800 0%, #FF5722 100%);

// 辅助色
$accent-yellow: #FFC107;
$accent-orange: #FF9800;
$accent-red: #FF5722;

// 背景色
$page-bg-top: #FFF8E1;      // 浅黄色
$page-bg-bottom: #FFFFFF;   // 白色渐变
$card-bg: #FFFFFF;

// 文字色
$text-primary: #333333;
$text-secondary: #666666;
$text-light: #999999;
$text-white: #FFFFFF;
```

### 功能卡片的配色方案
```scss
// 健康管理 - 绿色
.health-card {
  background: linear-gradient(135deg, #52C41A 0%, #73D13D 100%);
}

// 活动预约 - 蓝色
.activity-card {
  background: linear-gradient(135deg, #1890FF 0%, #40A9FF 100%);
}

// 餐饮服务 - 橙色
.food-card {
  background: linear-gradient(135deg, #FA8C16 0%, #FFA940 100%);
}

// 出行服务 - 紫色
.travel-card {
  background: linear-gradient(135deg, #722ED1 0%, #9254DE 100%);
}
```

---

## 图标资源建议

### 方案 1：使用 Emoji（简单快速）
```typescript
const emojiIcons = {
  health: '🏥',
  activity: '📅',
  food: '🍲',
  travel: '🚗',
  calendar: '📆',
  clock: '⏰',
  star: '⭐',
  heart: '❤️',
  location: '📍',
  phone: '📞',
};
```

### 方案 2：iconfont（专业定制）

**推荐 iconfont 项目**：
1. 搜索"养老"相关图标库
2. 搜索"健康"相关图标库
3. 搜索"旅游"相关图标库

**使用步骤**：
1. 访问 https://www.iconfont.cn/
2. 搜索关键词
3. 添加到项目
4. 下载字体或使用在线链接
5. 在项目中引入

### 方案 3：SVG 图标（推荐）

**优点**：
- 可自定义颜色
- 清晰度高
- 文件小

---

## 装饰元素设计

### 1. 渐变圆点装饰
```scss
.decoration-dot {
  position: absolute;
  width: 200rpx;
  height: 200rpx;
  background: radial-gradient(circle, rgba(255, 152, 0, 0.15) 0%, transparent 70%);
  border-radius: 50%;
}
```

### 2. 卡片顶部装饰线
```scss
.card-decoration {
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6rpx;
    background: linear-gradient(90deg, #FFB347, #FFCC33, #FF9800);
    border-radius: 16rpx 16rpx 0 0;
  }
}
```

### 3. 标签/徽章
```scss
.tag {
  display: inline-block;
  padding: 8rpx 16rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  font-weight: 500;

  &--hot {
    background: linear-gradient(135deg, #FF6B6B, #FF8E53);
    color: #fff;
  }

  &--new {
    background: linear-gradient(135deg, #4FACFE, #00F2FE);
    color: #fff;
  }

  &--free {
    background: linear-gradient(135deg, #FA709A, #FEE140);
    color: #fff;
  }
}
```

### 4. 波浪装饰
```scss
.wave-decoration {
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80rpx;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23FF9800'/%3E%3C/svg%3E");
    background-size: cover;
  }
}
```

---

## 插图资源

### 推荐网站

1. **undraw.co**（免费插图）
   - 风格：扁平化、现代
   - 可自定义颜色
   - SVG 格式

2. **storyset.com**
   - 风格：故事化插画
   - 适合养老、健康主题

3. **freepik.com**
   - 免费/付费
   - 素材丰富

4. **drawkit.com**
   - 手绘风格
   - 温馨、亲和

### 搜索关键词
- "elderly care"（养老）
- "healthcare"（健康）
- "travel"（旅游）
- "recreation"（娱乐）
- "wellness"（健康生活）

---

## 页面布局参考

### 顶部区域设计
```scss
.header {
  position: relative;
  background: linear-gradient(180deg, #FFB347 0%, #FFFFFF 60%);
  padding: 60rpx 32rpx 80rpx;

  // 装饰圆点
  &::before {
    content: '';
    position: absolute;
    top: 80rpx;
    right: -80rpx;
    width: 300rpx;
    height: 300rpx;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    top: 40rpx;
    left: -60rpx;
    width: 200rpx;
    height: 200rpx;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    border-radius: 50%;
  }
}
```

### 卡片设计
```scss
.feature-card {
  position: relative;
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 152, 0, 0.12);
  margin-bottom: 24rpx;
  overflow: hidden;

  // 顶部渐变装饰
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8rpx;
    background: linear-gradient(90deg, #FFB347, #FFCC33);
    border-radius: 24rpx 24rpx 0 0;
  }

  // 右下角装饰
  &::after {
    content: '';
    position: absolute;
    bottom: -40rpx;
    right: -40rpx;
    width: 160rpx;
    height: 160rpx;
    background: linear-gradient(135deg, rgba(255, 179, 71, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }
}
```

---

## 字体大小规范

```scss
// 标题
$font-size-title: 40rpx;      // 20px - 主标题
$font-size-subtitle: 36rpx;   // 18px - 副标题

// 正文
$font-size-large: 32rpx;      // 16px - 重要文字
$font-size-medium: 30rpx;     // 15px - 正文
$font-size-normal: 28rpx;     // 14px - 次要文字

// 辅助
$font-size-small: 24rpx;      // 12px - 标签、提示
```

---

## 推荐设计组合

### 组合 1：温暖活力风
- 主色：橙黄渐变
- 背景：浅黄到白色渐变
- 卡片：白色 + 彩色阴影
- 装饰：渐变圆点 + 顶部装饰线

### 组合 2：清新自然风
- 主色：绿色渐变
- 背景：浅绿到白色渐变
- 卡片：白色 + 绿色元素
- 装饰：植物插图 + 波浪线

### 组合 3：专业信赖风
- 主色：蓝色渐变
- 背景：浅蓝到白色渐变
- 卡片：白色 + 蓝色元素
- 装饰：几何图形 + 线条

---

**建议**：先从组合 1（温暖活力风）开始，符合养老服务的温馨定位。

---

**创建日期**：2026-01-14
**适用页面**：晚晴小程序首页
