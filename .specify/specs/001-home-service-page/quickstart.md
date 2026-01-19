# Quickstart: 上门服务页面

**Feature**: 上门服务页面
**Date**: 2026-01-18

## Overview

本文档提供上门服务页面的快速开始指南，包括组件使用、集成步骤和常见问题。

## Prerequisites

- Taro 4.0.9+
- React 18.2.0+
- TypeScript 5.2.0+

## File Structure

```
src/pages/joy/components/HomeService/
├── index.tsx            # 主组件
├── index.scss           # 样式文件
├── index.config.ts      # Taro 页面配置
├── types.ts             # 类型定义
└── mockData.ts          # Mock 数据
```

## Integration Steps

### Step 1: 创建组件文件

创建组件目录和文件：

```bash
mkdir -p src/pages/joy/components/HomeService
cd src/pages/joy/components/HomeService
touch index.tsx index.scss index.config.ts types.ts mockData.ts
```

### Step 2: 定义类型 (types.ts)

```typescript
export interface HomeService {
  id: string
  name: string
  poster: string
  price: number
  sales: number
  category: string
  description?: string
}

export interface ServiceDetail extends HomeService {
  images?: string[]
  specifications?: { [key: string]: string }
  rating?: number
  reviewCount?: number
}

export type SortType = 'none' | 'asc' | 'desc'
```

### Step 3: 创建 Mock 数据 (mockData.ts)

参考 `data-model.md` 创建模拟数据，包含至少 10 个服务项目，涵盖各个分类。

### Step 4: 实现主组件 (index.tsx)

核心功能：

1. **状态管理**:
   ```typescript
   const [activeCategory, setActiveCategory] = useState<string>('all')
   const [sortType, setSortType] = useState<SortType>('none')
   const [serviceList, setServiceList] = useState<HomeService[]>([])
   ```

2. **分类筛选**:
   ```typescript
   const handleCategoryChange = (categoryKey: string) => {
     setActiveCategory(categoryKey)
     applyFilters()
   }
   ```

3. **价格排序**:
   ```typescript
   const handleSortToggle = () => {
     const newSortType: SortType =
       sortType === 'none' ? 'asc' : sortType === 'asc' ? 'desc' : 'none'
     setSortType(newSortType)
     applyFilters()
   }
   ```

4. **筛选和排序逻辑**:
   ```typescript
   const applyFilters = () => {
     let filtered = [...mockServiceList]

     // 按分类筛选
     if (activeCategory !== 'all') {
       filtered = filtered.filter(item => item.category === activeCategory)
     }

     // 按价格排序
     if (sortType === 'asc') {
       filtered.sort((a, b) => a.price - b.price)
     } else if (sortType === 'desc') {
       filtered.sort((a, b) => b.price - a.price)
     }

     setServiceList(filtered)
   }
   ```

5. **UI 结构**:
   - 分类标签栏 (横向滚动)
   - 排序按钮
   - 服务网格 (两列布局)
   - 空状态提示

### Step 5: 样式实现 (index.scss)

参考 ElderlyMall 的样式，特别注意：

- **两列网格布局**:
  ```scss
  .service-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 16px;
  }
  ```

- **服务卡片**:
  ```scss
  .service-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  ```

- **分类标签栏** (横向滚动):
  ```scss
  .categories-scroll {
    white-space: nowrap;
    overflow-x: auto;
  }
  ```

### Step 6: 配置页面 (index.config.ts)

```typescript
export default definePageConfig({
  navigationBarTitleText: '上门服务'
})
```

### Step 7: 集成到乐享生活页面

在 `src/pages/joy/index.tsx` 中添加入口：

```tsx
import HomeService from './components/HomeService'

// 在 ServiceStrip 中添加上门服务入口
// 或直接在页面中添加 HomeService 组件
```

## Component Usage Example

```tsx
import HomeService from './components/HomeService'

function Joy() {
  return (
    <View className="joy-page">
      {/* 其他内容 */}

      {/* 上门服务区块 */}
      <View className="content-section">
        <View className="section-header">
          <Text className="section-title">上门服务</Text>
          <Text className="section-icon">🏠</Text>
        </View>
        <HomeService />
      </View>
    </View>
  )
}
```

## Key Features

### 1. 分类筛选

用户点击分类标签，自动筛选并显示对应分类的服务：

```typescript
const categories = [
  { key: 'all', name: '全部' },
  { key: 'cleaning', name: '家政清洁' },
  { key: 'repair', name: '维修服务' },
  { key: 'care', name: '护理照护' },
  { key: 'life', name: '生活服务' }
]
```

### 2. 价格排序

三态排序按钮：无排序 → 升序 → 降序 → 无排序（循环）

```typescript
const getSortButtonText = () => {
  if (sortType === 'asc') return '价格↑'
  if (sortType === 'desc') return '价格↓'
  return '价格排序'
}
```

### 3. 服务卡片

显示内容：
- 海报图片 (1:1 比例)
- 服务名称
- 价格（免费服务显示"免费"）
- 销量

点击卡片跳转到详情页（预留接口）。

### 4. 空状态处理

当筛选结果为空时显示友好提示：

```tsx
<View className="empty-state">
  <Text className="empty-icon">📦</Text>
  <Text className="empty-text">暂无服务</Text>
</View>
```

## Accessibility (无障碍)

针对老年用户的优化：

- **大字体**: 基准字体大小至少 16px
- **高对比度**: 使用清晰的色彩对比
- **清晰反馈**: 点击态、加载态明确
- **简化操作**: 减少操作步骤，直观易用

## Testing

手动测试清单：

- [ ] 页面正常加载，显示所有服务
- [ ] 点击分类标签，正确筛选服务
- [ ] 点击排序按钮，价格正确排序
- [ ] 点击服务卡片，显示 Toast 提示
- [ ] 空分类下显示空状态提示
- [ ] 图片加载失败时显示占位图
- [ ] 免费服务显示"免费"而非价格
- [ ] 销量为 0 时显示合适文案
- [ ] 分类标签栏可横向滚动

## Common Issues

### Q: 图片加载失败怎么办？

A: 使用 Taro Image 的 `onError` 事件处理：

```tsx
<Image
  src={item.poster}
  onError={() => {
    // 替换为默认占位图
  }}
/>
```

### Q: 如何处理大量服务数据？

A: 考虑使用虚拟滚动或分页加载。Taro 支持虚拟列表组件。

### Q: 如何对接真实 API？

A: 参考 `contracts/api.ts`，将 `mockServiceList` 替换为 API 调用，添加加载状态和错误处理。

## Next Steps

1. ✅ 完成基础组件实现
2. ⏳ 实现服务详情页（Detail 组件）
3. ⏳ 对接真实后端 API
4. ⏳ 添加服务预约功能
5. ⏳ 添加搜索功能

## References

- [ElderlyMall 组件](../../ElderlyMall/) - 参考实现
- [Taro 官方文档](https://taro-docs.jd.com/)
- [Data Model](../data-model.md) - 数据模型定义
- [API Contracts](../contracts/api.ts) - API 接口定义
