# Taro 小程序开发规范

## 目录
- [项目结构](#项目结构)
- [命名规范](#命名规范)
- [代码规范](#代码规范)
- [组件规范](#组件规范)
- [状态管理](#状态管理)
- [样式规范](#样式规范)
- [性能优化](#性能优化)
- [注意事项](#注意事项)

---

## 项目结构

```
src/
├── pages/              # 页面目录
│   ├── index/          # 首页
│   │   ├── index.tsx   # 页面逻辑
│   │   ├── index.config.ts # 页面配置
│   │   └── index.scss  # 页面样式
│   └── ...
├── components/         # 公共组件
│   ├── header/         # 组件目录
│   │   ├── header.tsx
│   │   ├── header.scss
│   │   └── index.ts
│   └── ...
├── services/           # API服务
├── store/              # 状态管理
├── utils/              # 工具函数
├── constants/          # 常量定义
├── assets/             # 静态资源
│   ├── images/
│   └── styles/
│       ├── variables.scss # 样式变量
│       └── mixins.scss     # 样式混入
├── app.tsx             # 应用入口
├── app.config.ts       # 全局配置
└── app.scss            # 全局样式
```

---

## 命名规范

### 文件命名
- **页面/组件文件夹**: 小写+短横线 `user-profile/`
- **页面/组件文件**: 与文件夹同名 `user-profile.tsx`
- **工具文件**: 小写+短横线 `date-utils.ts`
- **常量文件**: 小写+短横线 `api-constants.ts`

### 变量命名
```typescript
// 常量: 全大写+下划线
const MAX_COUNT = 100;
const API_BASE_URL = 'https://api.example.com';

// 变量/函数: 小驼峰
const userName = '张三';
const getUserInfo = () => {};

// 类/接口/类型: 大驼峰
interface UserInfo {}
class UserService {}
type ApiResponse = {}

// 私有变量: 下划线前缀
const _privateData = 'private';
```

### 组件命名
```tsx
// 组件名称使用大驼峰
function UserProfile() {}
const Header: React.FC = () => {};

// 文件导出使用默认导出
export default UserProfile;
```

---

## 代码规范

### TypeScript 使用
```typescript
// 1. 定义接口/类型
interface UserInfo {
  id: number;
  name: string;
  avatar?: string; // 可选属性
}

type PageState = {
  loading: boolean;
  data: UserInfo[];
};

// 2. 组件类型定义
interface Props {
  title: string;
  onSubmit?: () => void;
}

const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
  return <View>{title}</View>;
};

// 3. 使用枚举
enum Status {
  Loading = 'loading',
  Success = 'success',
  Error = 'error'
}
```

### Hooks 使用
```tsx
import { useState, useEffect } from 'react';

function UserProfile() {
  // 1. useState: 使用类型泛型
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<UserInfo[]>([]);

  // 2. useEffect: 正确处理依赖和清理
  useEffect(() => {
    fetchData();
    return () => {
      // 清理操作
    };
  }, []);

  // 3. useDidShow/useDidHide (Taro生命周期)
  useDidShow(() => {
    console.log('页面显示');
  });

  return <View>...</View>;
}
```

### 异步处理
```typescript
// 1. 使用 async/await
async function fetchData() {
  try {
    setLoading(true);
    const res = await api.getUserList();
    setData(res.data);
  } catch (error) {
    console.error('获取数据失败:', error);
    Taro.showToast({ title: '加载失败', icon: 'error' });
  } finally {
    setLoading(false);
  }
}

// 2. Promise 并行处理
async function loadAllData() {
  const [users, posts] = await Promise.all([
    api.getUsers(),
    api.getPosts()
  ]);
}
```

---

## 组件规范

### 组件定义
```tsx
// 1. 函数组件(推荐)
interface Props {
  title: string;
  visible: boolean;
  onClose: () => void;
}

const Modal: React.FC<Props> = (props) => {
  const { title, visible, onClose } = props;

  return (
    <View className={`modal ${visible ? 'modal--visible' : ''}`}>
      <View className="modal__header">{title}</View>
      <View className="modal__close" onClick={onClose}>×</View>
    </View>
  );
};

export default Modal;
```

### Props 规范
```tsx
interface Props {
  // 必填属性
  title: string;
  data: UserInfo[];

  // 可选属性
  showIcon?: boolean;
  className?: string;

  // 事件处理: on前缀
  onSubmit?: (data: any) => void;
  onCancel?: () => void;

  // 渲染函数: render前缀
  renderHeader?: () => ReactNode;
  renderItem?: (item: any) => ReactNode;
}
```

### 组件拆分原则
```tsx
// ❌ 不好: 一个组件过大
function BigComponent() {
  return (
    <View>
      {/* 500+ 行代码 */}
    </View>
  );
}

// ✅ 好: 拆分为多个小组件
function BigComponent() {
  return (
    <View>
      <Header />
      <Content />
      <Footer />
    </View>
  );
}
```

---

## 状态管理

### 本地状态
```tsx
// 1. useState: 简单状态
const [count, setCount] = useState(0);

// 2. useReducer: 复杂状态逻辑
type State = { count: number; loading: boolean };
type Action = { type: 'increment' } | { type: 'decrement' };

const [state, dispatch] = useReducer(reducer, initialState);
```

### 全局状态(推荐使用 Zustand)
```typescript
// store/userStore.ts
import { create } from 'zustand';

interface UserState {
  token: string;
  userInfo: UserInfo | null;
  setToken: (token: string) => void;
  setUserInfo: (info: UserInfo) => void;
  clearUserInfo: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: '',
  userInfo: null,
  setToken: (token) => set({ token }),
  setUserInfo: (info) => set({ userInfo: info }),
  clearUserInfo: () => set({ token: '', userInfo: null })
}));

// 使用
function Profile() {
  const { userInfo, setUserInfo } = useUserStore();
  return <View>{userInfo?.name}</View>;
}
```

---

## 样式规范

### 样式方案选择：混合方案

**原则：静态样式用 SCSS，动态样式用内联 style**

```tsx
// ✅ 推荐：混合方案
function UserProfile({ isActive, theme }) {
  const cardStyle = {
    // 动态样式用内联
    opacity: isActive ? 1 : 0.5,
    transform: `translateX(${isActive ? '0' : '10px'})`
  };

  return (
    <View className="user-card"> {/* 静态样式用 className */}
      <Text className="user-card__title">标题</Text>
      <View style={cardStyle}>
        动态内容
      </View>
    </View>
  );
}
```

### 使用场景

| 场景 | 推荐方案 | 示例 |
|------|----------|------|
| 复杂布局、固定样式 | **SCSS** | 布局、间距、颜色 |
| 动态状态变化 | **内联 style** | 显隐、位移、透明度 |
| 主题切换 | **SCSS 变量** | `className="theme-dark"` |
| 动态计算值 | **内联 style** | 宽度、位置、颜色 |

### SCSS 样式变量

```scss
// assets/styles/variables.scss
// 颜色系统
$primary-color: #1890ff;
$success-color: #52c41a;
$warning-color: #faad14;
$error-color: #f5222d;
$text-color: #333;
$text-color-secondary: #666;
$border-color: #e8e8e8;

// 间距系统
$spacing-xs: 8px;
$spacing-sm: 12px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;

// 字体
$font-size-sm: 12px;
$font-size-md: 14px;
$font-size-lg: 16px;
$font-size-xl: 18px;

// 圆角
$border-radius-sm: 4px;
$border-radius-md: 8px;
$border-radius-lg: 12px;
```

### BEM 命名规范

```scss
// 基础结构
.block {}           // 块
.block__element {}  // 元素
.block--modifier {} // 修饰符

// 实际示例
.user-card {
  padding: $spacing-md;
  background: #fff;
  border-radius: $border-radius-md;

  &__header {
    display: flex;
    align-items: center;
  }

  &__title {
    font-size: $font-size-lg;
    color: $text-color;
  }

  &__avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }

  // 修饰符
  &--dark {
    background: #333;
    .user-card__title {
      color: #fff;
    }
  }

  &--active {
    border: 2px solid $primary-color;
  }
}

// 使用
<View className="user-card user-card--active">
  <View className="user-card__header">
    <Image className="user-card__avatar" src="..." />
    <Text className="user-card__title">用户名</Text>
  </View>
</View>
```

### 嵌套规范

```scss
// ✅ 推荐：嵌套不超过3层
.card {
  &__header { }     // 1层
  &__body {         // 1层
    &__title { }    // 2层
  }
}

// ❌ 避免：嵌套过深
.card {
  &__body {
    &__content {
      &__item {     // 3层
        &__icon { } // 4层 - 太深！
      }
    }
  }
}

// 解决方案：提取新的 block
.card {
  &__body { }
}
.item-icon { }  // 独立的样式类
```

### 内联 style 规范

```tsx
// ✅ 好的做法
function MyComponent() {
  const [isVisible, setIsVisible] = useState(false);

  // 1. 抽取样式对象（可复用）
  const hiddenStyle = {
    opacity: 0,
    pointerEvents: 'none' as const
  };

  const visibleStyle = {
    opacity: 1,
    pointerEvents: 'auto' as const
  };

  // 2. 动态计算样式
  const progressStyle = {
    width: `${progress}%`,
    backgroundColor: progress > 80 ? 'green' : 'red'
  };

  return (
    <View style={isVisible ? visibleStyle : hiddenStyle}>
      <View style={progressStyle} />
    </View>
  );
}

// ❌ 避免：过多内联样式
function BadExample() {
  return (
    <View style={{
      padding: '16px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      // ... 太多样式应该写在 SCSS 中
    }}>
      内容
    </View>
  );
}
```

### 响应式单位

```tsx
// Taro 中推荐使用 rpx（750rpx = 屏幕宽度）
// 方案1: 直接在 SCSS 中使用 rpx
.container {
  width: 750rpx;      // 100% 屏幕宽度
  padding: 32rpx;     // 约 16px
  font-size: 28rpx;   // 约 14px
}

// 方案2: 使用 px（编译时自动转换）
// config/index.js 中配置
// 小程序端 px 会转换为 rpx
.button {
  width: 100px;       // 自动转换为 rpx
  height: 40px;
}

// 方案3: 运行时转换（动态计算）
function DynamicBox() {
  const boxStyle = {
    width: Taro.pxTransform(100),  // 100px -> rpx
    height: Taro.pxTransform(50)
  };

  return <View style={boxStyle} />;
}
```

### 常用布局模式

```scss
// Flex 居中
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// Flex 两端对齐
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// Flex 纵向排列
.flex-column {
  display: flex;
  flex-direction: column;
}

// 文本省略
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// 安全区域（适配刘海屏）
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## 性能优化

### 列表渲染
```tsx
// 1. 使用 key
{list.map((item) => (
  <View key={item.id}>
    {item.name}
  </View>
))}

// 2. 虚拟列表(长列表)
import { VirtualList } from '@tarojs/components';

<VirtualList
  items={largeList}
  itemSize={100}
  height={500}
  renderItem={(item) => <ViewItem data={item} />}
/>
```

### 图片优化
```tsx
// 1. 使用懒加载
<Image lazyLoad src={imageUrl} />

// 2. 压缩图片
// 使用 WebP 格式,设置合适的尺寸

// 3. 图片缓存
<Image src={imageUrl} mode="aspectFill" />
```

### 避免不必要的渲染
```tsx
// 1. 使用 useMemo
const filteredList = useMemo(() => {
  return list.filter(item => item.active);
}, [list]);

// 2. 使用 useCallback
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);

// 3. React.memo
const Item = React.memo(({ data }) => {
  return <View>{data.name}</View>;
});
```

---

## 注意事项

### 微信小程序限制
```typescript
// 1. 包大小限制
// 主包 < 2MB, 总大小 < 20MB
// 使用分包加载

// 2. API 调用限制
// 需要在微信公众平台配置域名白名单

// 3. 用户隐私保护
// 获取用户信息需要用户授权

// 4. 支付功能
// 需要企业资质,开通微信支付
```

### Taro 与 React 差异
```tsx
// 1. 使用 Taro 的组件和API
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';

// 2. 事件处理
// onClick → onTap
// onChange → onInput (输入框)

// 3. 样式
// 不支持 :active 选择器,使用 hover-class
<Button hoverClass="button-hover">点击</Button>
```

### 条件编译
```typescript
// 针对不同平台的代码
if (process.env.TARO_ENV === 'weapp') {
  // 微信小程序专属代码
  Taro.showToast({ title: '微信小程序' });
} else if (process.env.TARO_ENV === 'h5') {
  // H5专属代码
}
```

### 路由跳转
```typescript
// 1. 使用 Taro.navigateTo
Taro.navigateTo({
  url: '/pages/detail/index?id=123'
});

// 2. 传递参数
Taro.navigateTo({
  url: `/pages/detail/index?id=${id}&type=${type}`
});

// 3. 接收参数
useLoad((options) => {
  const { id, type } = options;
  console.log(id, type);
});
```

---

## 开发建议

1. **代码复用**: 提取公共组件和工具函数
2. **类型安全**: 充分利用 TypeScript 类型检查
3. **代码注释**: 复杂逻辑添加必要注释
4. **错误处理**: 统一的错误处理和提示
5. **日志记录**: 开发环境保留调试日志
6. **版本控制**: 规范的 Git 提交信息

---

## 推荐工具和库

- **状态管理**: Zustand
- **UI 组件库**: NutUI、Taro UI
- **图标**: iconfont
- **请求库**: Taro.request、axios
- **样式**: SCSS
- **代码规范**: ESLint + Prettier
