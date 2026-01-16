# 社区选择页面 - 实现方案

---

## 方案概述

实现社区选择页面，采用**列表选择模式**，用户点击卡片选择社区后确认保存。

**页面路径**：`/pages/community-select/index`

---

## 页面布局设计

### 整体结构
```
┌────────────────────────────────────┐
│        页面头部（标题+副标题）         │
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │    社区卡片 1（未选中）        │  │
│  ├──────────────────────────────┤  │
│  │    社区卡片 2（选中） ✓        │  │
│  ├──────────────────────────────┤  │
│  │    社区卡片 3（未选中）        │  │
│  └──────────────────────────────┘  │
│           ↓ 可滚动               │
│                                    │
│  ┌──────────────────────────────┐  │
│  │    社区卡片 N（未选中）        │  │
│  └──────────────────────────────┘  │
├────────────────────────────────────┤
│        固定底部（确认按钮）          │
└────────────────────────────────────┘
```

### 布局实现
- **外层容器**：`View.page-container`，灰色背景 `#f5f5f5`
- **头部**：`View.page-header`，白色背景，固定在顶部
- **列表区**：`ScrollView.community-list`，占据剩余空间
- **底部**：`View.page-footer`，白色背景，固定在底部

---

## 组件拆分

### 主页面组件
**文件**：`src/pages/community-select/index.tsx`

**职责**：
- 管理选中状态（`selectedId`）
- 处理社区选择逻辑
- 处理确认保存
- 与首页通信（使用 EventChannel 或全局存储）

### 社区卡片组件
**文件**：`src/pages/community-select/components/CommunityCard.tsx`

**Props**：
```typescript
interface CommunityCardProps {
  community: Community
  selected: boolean
  onClick: (community: Community) => void
}
```

**职责**：
- 显示社区信息（名称、地址）
- 显示选中状态
- 处理点击事件

---

## 数据流设计

### 数据来源
```typescript
// 复用首页的 mock 数据
import { mockCommunities } from '@/pages/home/mockData'
```

### 状态管理
```typescript
const [selectedId, setSelectedId] = useState<string>('')
const [communities, setCommunities] = useState<Community[]>(mockCommunities)
```

### 数据持久化
```typescript
const handleConfirm = () => {
  if (!selectedId) {
    Taro.showToast({ title: '请先选择社区', icon: 'none' })
    return
  }

  const selected = communities.find(c => c.id === selectedId)
  Taro.setStorageSync('selectedCommunity', selected)

  Taro.showToast({
    title: '选择成功',
    icon: 'success',
    duration: 1500
  })

  setTimeout(() => {
    Taro.navigateBack()
  }, 1500)
}
```

---

## 样式详细设计

### 页面容器
```scss
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}
```

### 页面头部
```scss
.page-header {
  background: #fff;
  padding: 48rpx 32rpx 32rpx;
  flex-shrink: 0;

  .page-title {
    font-size: 40rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 12rpx;
  }

  .page-subtitle {
    font-size: 28rpx;
    color: #666;
    line-height: 1.5;
  }
}
```

### 社区列表
```scss
.community-list {
  flex: 1;
  padding: 24rpx 32rpx;
  overflow-y: auto;
}
```

### 社区卡片
```scss
.community-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s;

  // 未选中状态
  border: 1rpx solid #e0e0e0;

  // 选中状态
  &.selected {
    border: 2rpx solid #ff9800;
    background: #fff8f0;
  }

  &:active {
    transform: scale(0.98);
  }
}

.community-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
}

.community-address {
  font-size: 28rpx;
  color: #666;
  line-height: 1.4;
}

.selected-icon {
  position: absolute;
  top: 32rpx;
  right: 32rpx;
  font-size: 40rpx;
  color: #ff9800;
}
```

### 底部操作区
```scss
.page-footer {
  background: #fff;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  flex-shrink: 0;
  border-top: 1rpx solid #f0f0f0;
}

.confirm-button {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.9;
    transform: scale(0.98);
  }

  &.disabled {
    background: #e0e0e0;
    color: #999;
  }
}
```

---

## 文件结构

```
src/pages/community-select/
├── index.tsx              # 主页面组件
├── index.scss             # 页面样式
├── index.config.ts        # 页面配置
├── mockData.ts            # （可选）独立 mock 数据
└── components/
    └── CommunityCard.tsx  # 社区卡片组件
    └── CommunityCard.scss # 卡片样式
```

---

## 与首页的集成

### 首页跳转
```typescript
// src/pages/home/index.tsx
const handleGoToSelect = () => {
  Taro.navigateTo({
    url: '/pages/community-select/index'
  })
}
```

### 返回首页
社区选择页面使用 `Taro.navigateBack()` 返回，首页需要监听页面显示事件刷新社区名称：

```typescript
// src/pages/home/index.tsx
useEffect(() => {
  // 监听页面显示
  const onShow = () => {
    checkSelectedCommunity()
  }

  Taro.eventCenter.on('pageShow', onShow)
  return () => {
    Taro.eventCenter.off('pageShow', onShow)
  }
}, [])

// 或使用 Taro 的生命周期
useDidShow(() => {
  checkSelectedCommunity()
})
```

---

## 实现步骤

1. **创建页面文件结构**
   - 创建 `src/pages/community-select/` 目录
   - 创建 `index.tsx`、`index.scss`、`index.config.ts`

2. **创建社区卡片组件**
   - 创建 `components/CommunityCard.tsx`
   - 实现卡片 UI 和交互

3. **实现主页面逻辑**
   - 导入 mock 数据
   - 实现状态管理
   - 实现选择和确认逻辑

4. **添加页面样式**
   - 复用橙色主题色
   - 实现选中状态样式
   - 适配中老年用户

5. **配置页面路由**
   - 在 `src/app.config.ts` 中注册页面

6. **连接首页**
   - 更新首页跳转逻辑
   - 实现返回后刷新

---

## 技术要点

- 使用 `flex` 布局实现头部、列表、底部的三层结构
- 使用 `ScrollView` 的 `scrollY` 属性实现纵向滚动
- 使用条件渲染实现选中状态显示
- 使用 `Taro.setStorageSync` 持久化数据
- 使用 `useDidShow` 生命周期监听页面显示

---

## 注意事项

1. **安全区域适配**：底部按钮需要适配刘海屏
   ```scss
   padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
   ```

2. **空状态处理**：如果社区列表为空，显示空状态提示

3. **错误处理**：存储失败时给用户提示

4. **性能优化**：列表数据较少（<20），不需要虚拟列表

---

**方案版本**：1.0
**创建日期**：2025-01-16
