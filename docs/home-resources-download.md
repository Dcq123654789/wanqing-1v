# 首页资源下载指南

## 首页需要的资源清单

### 📋 图标资源（4个服务入口）

| 功能 | Emoji | iconfont 搜索词 | SVG 代码 |
|------|-------|----------------|---------|
| 健康管理 | 🏥 | 医疗、健康、医疗护理 | 见下方 |
| 活动预约 | 📅 | 日历、活动、预约 | 见下方 |
| 餐饮服务 | 🍲 | 餐饮、美食、食物 | 见下方 |
| 出行服务 | 🚗 | 出行、交通、车辆 | 见下方 |

### 🎨 装饰插图（3-5个）

| 位置 | 类型 | 搜索关键词 | 推荐网站 |
|------|------|-----------|---------|
| 顶部装饰 | SVG 图形 | decoration, circle, dot | 自定义（代码见下方）|
| 活动推荐卡 | 插图 | elderly, activity, travel | undraw.co, storyset.com |
| 空状态插图 | 插图 | empty, illustration | undraw.co |

### 🖼️ 背景图

| 位置 | 尺寸 | 类型 | 来源 |
|------|------|------|------|
| 顶部背景 | 750x400rpx | 渐变/CSS 生成 | CSS 渐变（推荐）|
| 活动卡片 | 560x280rpx | 照片/插图 | storyset.com |

---

## 方案一：使用 SVG 代码（推荐 ✅）

**优点**：无需下载，直接嵌入代码，可自定义颜色

### 装饰性圆点 SVG
```html
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="rgba(255, 152, 0, 0.1)"/>
  <circle cx="100" cy="100" r="60" fill="rgba(255, 152, 0, 0.15)"/>
  <circle cx="100" cy="100" r="40" fill="rgba(255, 152, 0, 0.2)"/>
</svg>
```

### 服务图标 SVG

#### 健康管理图标
```html
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="28" fill="#52C41A" opacity="0.1"/>
  <path d="M32 16 L32 48 M24 24 L40 40 M24 40 L40 24" stroke="#52C41A" stroke-width="4" stroke-linecap="round"/>
  <circle cx="32" cy="32" r="8" fill="#52C41A"/>
</svg>
```

#### 活动预约图标
```html
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="28" fill="#1890FF" opacity="0.1"/>
  <rect x="16" y="16" width="32" height="32" rx="4" fill="none" stroke="#1890FF" stroke-width="3"/>
  <path d="M24 24 L40 24 M24 32 L40 32 M24 40 L32 40" stroke="#1890FF" stroke-width="3" stroke-linecap="round"/>
</svg>
```

#### 餐饮服务图标
```html
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="28" fill="#FA8C16" opacity="0.1"/>
  <ellipse cx="32" cy="36" rx="16" ry="8" fill="none" stroke="#FA8C16" stroke-width="3"/>
  <path d="M20 28 L20 36 Q20 44 32 44 Q44 44 44 36 L44 28" fill="none" stroke="#FA8C16" stroke-width="3"/>
  <path d="M18 28 L46 28" stroke="#FA8C16" stroke-width="3" stroke-linecap="round"/>
</svg>
```

#### 出行服务图标
```html
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="28" fill="#722ED1" opacity="0.1"/>
  <path d="M16 36 L16 44 Q16 48 20 48 L44 48 Q48 48 48 44 L48 36 Q48 32 44 32 L20 32 Q16 32 16 36 Z" fill="none" stroke="#722ED1" stroke-width="3"/>
  <circle cx="22" cy="48" r="4" fill="#722ED1"/>
  <circle cx="42" cy="48" r="4" fill="#722ED1"/>
  <path d="M20 32 L22 24 Q24 16 32 16 Q40 16 42 24 L44 32" fill="none" stroke="#722ED1" stroke-width="3"/>
</svg>
```

---

## 方案二：使用 iconfont（专业定制）

### 步骤：

#### 1. 访问 iconfont
打开：https://www.iconfont.cn/

#### 2. 搜索图标
依次搜索以下关键词并添加到项目：

| 关键词 | 预期结果 |
|--------|---------|
| 医疗 | 找到医疗相关图标 |
| 日历预约 | 找到日历图标 |
| 餐饮美食 | 找到餐饮图标 |
| 交通出行 | 找到车辆图标 |
| 养老服务 | 找到养老相关图标 |

#### 3. 创建项目
- 点击"图标管理" → "我的项目"
- 创建新项目"晚晴小程序"
- 设置项目颜色：#FF9800（橙色）

#### 4. 下载图标
- 选择需要的图标
- 点击"下载" → "下载 PNG"
- 选择尺寸：128x128 或 256x256
- 下载到项目：`src/assets/images/icons/`

---

## 方案三：使用免费插图网站

### undraw.co（推荐 ⭐）

**网址**：https://undraw.co/

**搜索关键词**：
- "elderly"（老年）
- "healthcare"（健康）
- "activity"（活动）
- "travel"（旅游）
- "wellness"（健康生活）

**下载步骤**：
1. 打开网站
2. 搜索关键词
3. 选择插图
4. 点击下载（SVG 或 PNG）
5. 自定义颜色为橙色 #FF9800
6. 保存到 `src/assets/images/illustrations/`

### storyset.com

**网址**：https://storyset.com/

**特点**：
- 故事化插图
- 可自定义颜色
- 适合养老主题

**下载步骤**：
1. 注册账号（免费）
2. 搜索 "elderly care" 或 "senior"
3. 选择插图
4. 编辑颜色
5. 下载 PNG 或 SVG

---

## 方案四：使用现有项目资源

你的项目已经有插图，可以复用：

```
src/assets/images/illustrations/
├── activity-illustration.png  ✅ 已有
├── community-illustration.png ✅ 已有
├── nature-illustration.png     ✅ 已有
└── welcome-illustration.png    ✅ 已有
```

**建议**：先用现有的插图，后续可以逐步替换。

---

## 方案五：使用 CDN 在线资源（快速测试）

### Font Awesome（图标库）

```html
<!-- 在 index.html 中引入 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

使用方式：
```tsx
<View className="icon">
  <Text className="fa-solid fa-hospital"></Text>
</View>
```

常用图标类名：
- `fa-solid fa-hospital`（医院）
- `fa-solid fa-calendar-days`（日历）
- `fa-solid fa-utensils`（餐饮）
- `fa-solid fa-car`（车辆）
- `fa-solid fa-heart`（爱心）
- `fa-solid fa-star`（星星）

---

## 推荐的快速方案（组合使用） ⚡

### 阶段 1：快速开发（今天）
- ✅ 使用 Emoji 图标（最快）
- ✅ 使用现有插图
- ✅ 使用 CSS 渐变装饰

### 阶段 2：优化设计（明天）
- ⬇ 下载 iconfont 图标
- ⬇ 下载 undraw 插图
- ⬇ 优化 SVG 装饰

### 阶段 3：专业定制（后续）
- ⬇ 设计师定制插图
- ⬇ 制作品牌图标
- ⬇ 统一视觉规范

---

## 资源下载清单（复制使用）

### iconfont 快速链接
- 主页：https://www.iconfont.cn/
- 搜索"养老"：https://www.iconfont.cn/search/index?searchType=icon&q=%E5%85%BB%E8%80%81
- 搜索"医疗"：https://www.iconfont.cn/search/index?searchType=icon&q=%E5%8C%BB%E7%96%97

### 插图网站快速链接
- undraw：https://undraw.co/
- storyset：https://storyset.com/
- freepik：https://www.freepik.com/
- unblast：https://unblast.com/

### 配色网站
- coolors：https://coolors.co/
- adobe color：https://color.adobe.com/zh/create/color-wheel
- gradient hunt：https://gradienthunt.co/

---

## 下一步

**选择方案**：
1. **最快**：使用 Emoji + 现有插图 → 立即开始开发 ✅
2. **推荐**：下载 iconfont 图标（10分钟） → 开始开发
3. **专业**：下载 undraw 插图（30分钟） → 开始开发

**你想选哪个方案？** 我建议先用方案 1（Emoji）快速开发，然后再逐步替换为专业图标。

---

**创建日期**：2026-01-14
**适用页面**：晚晴小程序首页
