# 晚晴小程序 - 社区选择页面规格说明

---

## 功能概述

社区选择页面用于首次使用用户或需要切换社区时，选择自己所在的社区。

**核心目标**：让用户能够快速、准确地选择自己所在的社区，系统将保存用户选择以提供个性化服务。

---

## 页面结构

### 1. 页面头部
- **内容**：
  - 标题："选择您的社区"
  - 副标题："选择后我们将为您提供更精准的服务"
- **样式**：
  - 白色背景
  - 标题字号：40rpx（20px）
  - 副标题字号：28rpx（14px）
  - 内边距：48rpx 32rpx

### 2. 社区列表
- **布局**：纵向滚动的卡片列表
- **卡片内容**：
  - 社区名称（如"晚晴社区"）
  - 社区地址（如"北京市朝阳区晚晴路123号"）
  - 选中标记（右侧对勾图标）
- **交互**：
  - 点击卡片选中社区
  - 选中的卡片高亮显示（橙色边框）
  - 长按显示社区详情（可选）
- **样式**：
  - 卡片间距：24rpx
  - 圆角：16rpx
  - 选中状态：橙色边框 2rpx
  - 未选中状态：灰色边框 1rpx

### 3. 底部操作区
- **按钮**：
  - 主按钮："确认选择"（橙色渐变背景）
  - 禁用状态：未选择社区时置灰
- **样式**：
  - 固定在底部
  - 按钮高度：88rpx
  - 圆角：44rpx
  - 内边距：32rpx

---

## 展示内容

### 数据结构

```typescript
interface Community {
  id: string          // 社区ID
  name: string        // 社区名称
  address: string     // 社区地址
  latitude?: number   // 纬度（用于地图模式）
  longitude?: number  // 经度（用于地图模式）
}
```

### 虚拟数据

```typescript
// src/pages/community-select/mockData.ts
export const mockCommunities: Community[] = [
  {
    id: '1',
    name: '晚晴社区',
    address: '北京市朝阳区晚晴路123号'
  },
  {
    id: '2',
    name: '阳光花园',
    address: '北京市海淀区阳光大道456号'
  },
  {
    id: '3',
    name: '幸福家园',
    address: '北京市西城区幸福街789号'
  },
  {
    id: '4',
    name: '康乐小区',
    address: '北京市丰台区康乐路321号'
  },
  {
    id: '5',
    name: '和家园',
    address: '北京市东城区和平路654号'
  }
]
```

---

## 交互设计

### 页面跳转
- **进入**：
  - 首页引导弹窗点击"去选择社区"
  - 首页社区选择器点击切换
  - 使用 `Taro.navigateTo({ url: '/pages/community-select/index' })`

- **退出**：
  - 点击左上角返回按钮
  - 点击确认选择后返回首页

### 选择流程
1. 用户进入页面
2. 查看社区列表
3. 点击选择社区（卡片高亮）
4. 点击"确认选择"按钮
5. 保存到本地存储
6. 返回首页并更新显示

### 视觉反馈
- **点击卡片**：立即高亮选中状态
- **确认选择**：显示成功提示 Toast
- **保存成功**：自动返回首页
- **未选择点击确认**：震动提示 + Toast 警告

---

## 样式要求

### 颜色系统
```scss
$primary-color: #ff9800;     // 主题色（橙色）
$border-unselected: #e0e0e0; // 未选中边框
$border-selected: #ff9800;   // 选中边框
$bg-color: #f5f5f5;          // 页面背景
$card-bg: #ffffff;           // 卡片背景
$text-primary: #333333;      // 主文字
$text-secondary: #666666;    // 次要文字
```

### 字号系统
```scss
$font-size-title: 40rpx;     // 页面标题
$font-size-subtitle: 28rpx;  // 副标题
$font-size-community: 36rpx; // 社区名称
$font-size-address: 28rpx;   // 地址
$font-size-btn: 32rpx;       // 按钮文字
```

### 组件样式
- **社区卡片**：
  - 圆角：16rpx
  - 内边距：32rpx
  - 选中边框：2rpx solid $primary-color
  - 未选中边框：1rpx solid $border-unselected
  - 选中背景：#FFF8F0（浅橙色）

- **确认按钮**：
  - 高度：88rpx
  - 圆角：44rpx
  - 渐变背景：`linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)`
  - 文字颜色：#fff
  - 禁用状态：背景 #e0e0e0，文字 #999

---

## 数据需求

### 数据来源
- **当前**：使用虚拟数据（mockData）
- **未来**：接入后端 API，根据定位推荐附近社区

### 数据条数
- 社区列表：5-10 个社区

### 数据存储
```typescript
// 保存选择的社区
const STORAGE_KEY = 'selectedCommunity'
Taro.setStorageSync(STORAGE_KEY, community)

// 读取选择的社区
const community = Taro.getStorageSync(STORAGE_KEY)
```

---

## 技术考虑

### 组件拆分
```
pages/community-select/
├── index.tsx           # 主页面
├── index.scss          # 页面样式
├── index.config.ts     # 页面配置
└── components/
    └── CommunityCard.tsx  # 社区卡片组件
```

### 技术要点
- 使用 `useState` 管理选中状态
- 使用 `ScrollView` 实现列表滚动
- 选中的社区存储到本地
- 返回首页时传递选择的社区 ID

### 页面配置
```typescript
// src/pages/community-select/index.config.ts
export default {
  navigationBarTitleText: '选择社区',
  navigationBarBackgroundColor: '#fff',
  navigationBarTextStyle: 'black'
}
```

---

## 中老年用户适配

### 字体适配
- 所有文字 ≥ 28rpx（14px）
- 社区名称使用大字号（36rpx）
- 重要信息使用粗体

### 交互适配
- 卡片高度 ≥ 120rpx，方便点击
- 确认按钮足够大（88rpx）
- 选中状态明显（橙色边框 + 背景）
- 避免复杂操作，直接点击即可选择

### 视觉适配
- 高对比度配色
- 选中状态清晰可辨
- 避免复杂动画
- 文字简洁明了

---

## 验收标准

- [ ] 页面布局符合设计要求
- [ ] 社区列表正常显示
- [ ] 点击卡片能够正确选中
- [ ] 选中状态视觉反馈明显
- [ ] 确认按钮在未选择时置灰
- [ ] 选择后能够正确保存到本地
- [ ] 返回首页后社区名称更新
- [ ] 字号适合中老年用户（≥ 28rpx）
- [ ] 点击有明确的视觉反馈
- [ ] 代码符合 ESLint 规范
- [ ] TypeScript 类型完整

---

## 不包含的内容

- 不包含地图模式
- 不包含定位功能（预留接口）
- 不包含搜索功能
- 不包含社区详情页面
- 不包含多社区选择

---

## 参考资料

### 项目文档
- `.specify/memory/constitution.md` - 项目治理原则
- `.specify/specs/home-page-spec.md` - 首页规格说明
- `src/pages/home/index.tsx` - 首页社区检查逻辑

### 相关文件
- `src/pages/home/types.ts` - Community 类型定义
- `src/pages/home/mockData.ts` - 社区 Mock 数据

---

**创建日期**：2025-01-16
**版本**：1.0.0
**作者**：Claude
**适用项目**：晚晴养老服务小程序
