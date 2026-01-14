# 晚晴小程序 - Spec-Driven Development 实战案例

本文档通过晚晴小程序的实际业务场景，演示如何使用 Spec-Driven Development 流程。

---

## 案例 1：在首页添加"康复理疗"业务入口

**业务背景**：
用户在首页可以直接看到"康复理疗"服务入口，点击后进入颐养页面的康复理疗分类。

---

### Step 1: Specify（描述内容）

**命令**：
```
/speckit.specify
```

**输入**：
```
在首页的"颐养服务"区域添加"康复理疗"入口：

展示位置：首页中部，"颐养服务"标题下方
展示内容：
- 图标：医疗/康复相关图标
- 标题："康复理疗"（32rpx，加粗）
- 简介："专业康复师团队，提供个性化理疗方案"（28rpx）
- 箭头图标，表示可点击

点击行为：点击后跳转到颐养页面，自动定位到康复理疗分类

使用圆角卡片样式，白色背景，带阴影
```

**AI 生成**：`specs/004-rehabilitation-entry/spec.md`

```markdown
# Feature: 首页添加康复理疗入口

## 功能概述
在首页添加"康复理疗"服务入口，方便用户快速访问康复理疗服务。

## 展示内容
- 图标：医疗/康复相关图标
- 标题：康复理疗
- 简介：专业康复师团队，提供个性化理疗方案
- 箭头图标

## 交互设计
- 点击跳转到颐养页面
- 自动定位到康复理疗分类

## 样式要求
- 圆角卡片，白色背景，带阴影
- 标题 32rpx
- 简介 28rpx
- 适配中老年用户

## 数据需求
- 使用虚拟数据
- 图标使用项目内已有图标
```

---

### Step 2: Plan（设计方案）

**命令**：
```
/speckit.plan
```

**输入**：
```
技术方案：
1. 在 HomePage 组件中添加 ServiceEntryCard 组件
2. 使用 View 组件包裹，onClick 绑定跳转
3. 使用 flex 布局，图标在左，文字在中，箭头在右
4. 样式变量使用 $primary-color: #ff9800

跳转逻辑：
Taro.switchTab({
  url: '/pages/care/index'
})
然后通过 eventChannel 或全局状态传递参数，定位到康复分类

数据结构：
interface ServiceEntry {
  icon: string;
  title: string;
  description: string;
  route: string;
}
```

**AI 生成**：`specs/004-rehabilitation-entry/plan.md`

```markdown
# Implementation Plan

## 组件设计
创建 ServiceEntryCard 组件，复用于多个服务入口

```tsx
// src/components/ServiceEntryCard/index.tsx
interface Props {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}
```

## 样式设计
```scss
.service-entry-card {
  display: flex;
  align-items: center;
  padding: 32rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 24rpx;

  &__icon {
    width: 80rpx;
    height: 80rpx;
    margin-right: 24rpx;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 8rpx;
  }

  &__description {
    font-size: 28rpx;
    color: #666;
  }

  &__arrow {
    width: 32rpx;
    height: 32rpx;
    margin-left: 16rpx;
  }
}
```

## 页面集成
在 `src/pages/home/index.tsx` 中添加：
```tsx
import ServiceEntryCard from '../../components/ServiceEntryCard';

function HomePage() {
  const handleRehabilitationClick = () => {
    Taro.switchTab({
      url: '/pages/care/index'
    });
  };

  return (
    <View className="home">
      {/* 其他内容 */}

      <View className="service-section">
        <View className="section-title">颐养服务</View>
        <ServiceEntryCard
          icon={rehabilitationIcon}
          title="康复理疗"
          description="专业康复师团队，提供个性化理疗方案"
          onClick={handleRehabilitationClick}
        />
      </View>
    </View>
  );
}
```

## 跳转优化
使用 Zustand store 传递分类参数：
```tsx
// src/store/navigationStore.ts
interface NavigationState {
  activeCategory: string | null;
  setActiveCategory: (category: string) => void;
}

// 点击时设置分类
const handleRehabilitationClick = () => {
  useNavigationStore.getState().setActiveCategory('rehabilitation');
  Taro.switchTab({ url: '/pages/care/index' });
};

// 颐养页面监听分类
useEffect(() => {
  const category = useNavigationStore.getState().activeCategory;
  if (category === 'rehabilitation') {
    // 滚动到康复理疗位置
    scrollToCategory('rehabilitation');
  }
}, []);
```
```

---

### Step 3: Implement（直接实现）

**命令**：
```
/speckit.implement
```

**AI 会执行**：
1. 创建 `src/components/ServiceEntryCard/` 组件
2. 更新 `src/pages/home/index.tsx`
3. 创建 `src/store/navigationStore.ts`（如需要）
4. 添加相关样式

**开发者检查**：
- [ ] 组件样式是否符合设计
- [ ] 图标是否正确显示
- [ ] 点击跳转是否正常
- [ ] 颐养页面是否正确定位

---

## 案例 2：优化乐享页面的旅游业务展示

**业务背景**：
乐享页面的旅游业务展示不够清晰，需要优化布局和交互。

---

### Step 1: Specify（描述内容）

**输入**：
```
优化乐享页面的旅游业务展示：

当前问题：
1. 旅游卡片信息过多，显得拥挤
2. 价格不够突出
3. 不支持筛选

改进方案：
1. 简化卡片信息：
   - 保留：线路名称、封面图、价格、主要标签
   - 移除：详细行程、天数
2. 价格突出显示：
   - 使用橙色大字号（36rpx）
   - 右下角固定位置
3. 添加分类筛选：
   - 顶部横向滚动筛选栏
   - 分类：全部、周边游、国内游、出境游、康养游
4. 点击卡片查看详情：
   - 跳转到详情页
   - 显示完整信息
```

---

### Step 2: Plan（设计方案）

**输入**：
```
组件拆分：
1. TravelFilterBar - 分类筛选栏（顶部横向滚动）
2. TravelCard - 旅游卡片（简化版）

布局方案：
- 筛选栏：高度 80rpx，固定在顶部
- 卡片列表：两列布局，间距 16rpx
- 卡片尺寸：宽度 345rpx，高度 280rpx

样式规范：
- 筛选项选中：橙色背景，白色文字
- 价格：36rpx，橙色，加粗
- 标签：24rpx，浅色背景

数据结构：
interface TravelItem {
  id: string;
  name: string;
  coverImage: string;
  price: number;
  category: 'nearby' | 'domestic' | 'abroad' | 'wellness';
  tags: string[];
}
```

---

### Step 3: Implement（直接实现）

**命令**：
```
/speckit.implement
```

---

## 案例 3：添加订单管理功能

**业务背景**：
用户在个人中心可以查看自己的订单，包括已预订的服务。

---

### Step 1: Specify（描述内容）

**输入**：
```
在个人中心添加订单管理功能：

功能内容：
1. 订单列表页
   - 显示所有订单
   - 按状态分类：全部、待确认、已确认、已完成
   - 每个订单显示：
     * 业务名称（如"海南三亚旅游"）
     * 订单状态（不同颜色）
     * 预订时间
     * 金额（如有）

2. 订单详情
   - 点击订单查看详情
   - 显示预订信息
   - 显示订单状态
   - 支持取消订单（待确认状态）

3. 入口
   - 个人中心添加"我的订单"入口
   - 显示订单数量徽章

数据使用本地存储，暂时不接后端
```

---

### Step 2: Plan（设计方案）

**输入**：
```
技术方案：
1. 新增订单页面：src/pages/orders/index.tsx
2. 创建订单 store：src/store/orderStore.ts
3. 创建订单数据类型：src/types/order.ts

组件拆分：
- OrderCard - 订单卡片
- OrderFilter - 订单状态筛选
- OrderDetail - 订单详情（弹窗）

数据结构：
interface Order {
  id: string;
  businessId: string;
  businessName: string;
  businessType: 'travel' | 'nursing' | 'rehabilitation';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createTime: number;
  amount?: number;
  contactInfo: {
    name: string;
    phone: string;
  };
}

本地存储：
- 使用 Taro.setStorageSync 存储
- Key: 'wanqing_orders'
- 最多保留 50 条订单
```

---

### Step 3: Implement（直接实现）

**命令**：
```
/speckit.implement
```

---

## 快速开始模板

### 添加新的业务展示模块

```
/speckit.specify
在[页面名]添加[业务名称]模块：

展示内容：
- [列出要展示的信息]
- [图片/文字描述]

交互：
- [点击行为]
- [动画效果]

样式：
- [字号要求]
- [颜色要求]
- [布局方式]

数据：
- [数据来源：虚拟/真实]
- [数据条数]
```

### 优化现有功能

```
/speckit.specify
优化[页面/功能名称]：

当前问题：
- [问题1]
- [问题2]

改进方案：
- [改进1]
- [改进2]

预期效果：
- [达到的效果]
```

### 添加新页面

```
/speckit.specify
新增[页面名称]：

页面功能：
- [功能1]
- [功能2]
- [功能3]

页面结构：
- [顶部区域]
- [内容区域]
- [底部操作]

交互流程：
- [用户操作步骤1]
- [用户操作步骤2]
- [用户操作步骤3]

数据需求：
- [需要什么数据]
- [数据来源]
```

---

## 常见问题

**Q: 虚拟数据写在哪里？**
A: 推荐放在 `src/services/mockData.ts`，统一管理所有 mock 数据。

**Q: 如何确保字号适合中老年人？**
A: 正文 ≥ 28rpx（14px），标题 ≥ 32rpx（16px），重要信息 ≥ 36rpx（18px）。

**Q: 图标不够用怎么办？**
A: 使用 iconfont 或让设计师提供 SVG 图标，转换为 base64 或 image 组件。

**Q: 需要考虑 H5 端吗？**
A: 目前优先微信小程序，样式用 rpx 自动适配，H5 端后续优化。

**Q: 包太大怎么办？**
A: 压缩图片、使用分包、避免引入大型第三方库。

---

## 总结

晚晴小程序的 Spec-Driven Development：

**三个步骤**：
1. **Specify** - 说清楚要展示什么
2. **Plan** - 设计怎么展示
3. **Implement** - 快速实现

**核心原则**：
- 面向中老年用户
- 内容展示清晰
- 操作简单直观
- 快速迭代优化

**价值**：
- 减少返工
- 保证质量
- 提升效率
- 便于协作

---

**相关文档**：
- [项目 Constitution](../.specify/memory/constitution.md)
- [工作指南](./spec-driven-development-guide.md)
- [Taro 开发规范](../taro开发规范.md)
