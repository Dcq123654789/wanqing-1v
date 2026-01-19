# 快速开始：社区选择功能开发

**功能**: 社区选择页面 | **日期**: 2025-01-16
**前置条件**: Node.js 18+, 微信开发者工具

## 环境设置

### 1. 安装依赖

```bash
npm install
```

**已安装的关键依赖**:
- `@tarojs/taro@4.0.9` - Taro 框架
- `@tarojs/components@4.0.9` - Taro 组件库
- `react@18.2.0` - React 框架
- `zustand@4.4.7` - 状态管理

### 2. 启动开发服务器

```bash
# 微信小程序开发模式
npm run dev:weapp
```

开发服务器将输出到 `dist/` 目录。

### 3. 微信开发者工具

1. 打开微信开发者工具
2. 导入项目，选择 `dist/` 目录
3. AppID 使用测试号或自己的 AppID

## 项目结构概览

```
src/
├── pages/
│   └── community-select/        # 本功能页面
│       ├── index.tsx            # 主页面组件
│       ├── index.config.ts      # 页面配置
│       ├── components/          # 子组件
│       │   ├── MapView.tsx
│       │   ├── ListView.tsx
│       │   └── CommunityDetail.tsx
│       └── services/            # 页面服务
│           └── community.service.ts
├── services/                    # 共享服务
│   └── storage/
│       ├── encrypted-storage.ts
│       └── cache-manager.ts
├── store/                       # 状态管理
│   └── community-store.ts
└── types/                       # 类型定义
    └── community.types.ts
```

## 开发步骤

### 第一步：创建类型定义

创建 `src/types/community.types.ts`:

```typescript
export interface Community {
  id: string;
  name: string;
  fullAddress: string;
  shortAddress: string;
  latitude: number;
  longitude: number;
  serviceRange: string;
  status: 'active' | 'inactive';
  createdAt: number;
  updatedAt: number;
  distance?: number; // 可选：距离（公里）
}

export interface UserSelection {
  communityId: string;
  selectedAt: number;
  updatedAt: number;
}

export interface MapMarker {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  iconPath?: string;
  width?: number;
  height?: number;
  alpha?: number;
  isSelected?: boolean;
}

export type ViewMode = 'map' | 'list';
```

### 第二步：创建 Zustand Store

创建 `src/store/community-store.ts`:

```typescript
import { create } from 'zustand';
import type { Community, ViewMode } from '../types/community.types';

interface CommunityStore {
  // 状态
  selectedCommunity: Community | null;
  communities: Community[];
  viewMode: ViewMode;
  isLoading: boolean;
  error: string | null;

  // 操作
  setSelectedCommunity: (community: Community) => void;
  setCommunities: (communities: Community[]) => void;
  setViewMode: (mode: ViewMode) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCommunityStore = create<CommunityStore>((set) => ({
  // 初始状态
  selectedCommunity: null,
  communities: [],
  viewMode: 'map',
  isLoading: false,
  error: null,

  // 操作
  setSelectedCommunity: (community) => set({ selectedCommunity: community }),
  setCommunities: (communities) => set({ communities }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
```

### 第三步：创建加密存储服务

创建 `src/services/storage/encrypted-storage.ts`:

```typescript
import type { UserSelection } from '../../types/community.types';

const STORAGE_KEY = 'selected_community';

/**
 * 保存用户选择的社区（Base64 编码）
 */
export const saveCommunity = (communityId: string): void => {
  const data: UserSelection = {
    communityId,
    selectedAt: Date.now(),
    updatedAt: Date.now(),
  };

  const json = JSON.stringify(data);
  const encoded = btoa(encodeURIComponent(json));

  try {
    wx.setStorageSync(STORAGE_KEY, encoded);
  } catch (e) {
    console.error('保存社区选择失败', e);
    throw new Error('存储空间不足或存储失败');
  }
};

/**
 * 加载用户选择的社区
 */
export const loadCommunity = (): UserSelection | null => {
  try {
    const encoded = wx.getStorageSync(STORAGE_KEY);
    if (!encoded) return null;

    const decoded = decodeURIComponent(atob(encoded));
    return JSON.parse(decoded) as UserSelection;
  } catch (e) {
    console.error('加载社区选择失败', e);
    return null;
  }
};

/**
 * 清除用户选择的社区
 */
export const clearCommunity = (): void => {
  try {
    wx.removeStorageSync(STORAGE_KEY);
  } catch (e) {
    console.error('清除社区选择失败', e);
  }
};
```

### 第四步：创建缓存管理器

创建 `src/services/storage/cache-manager.ts`:

```typescript
import type { Community } from '../../types/community.types';

const CACHE_KEY = 'communities_cache';
const CACHE_META_KEY = 'communities_cache_meta';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 天

interface CacheData {
  communities: Community[];
  cachedAt: number;
}

interface CacheMeta {
  ttl: number;
  version: number;
}

/**
 * 获取缓存的社区列表
 */
export const getCachedCommunities = (): Community[] | null => {
  try {
    const cacheStr = wx.getStorageSync(CACHE_KEY);
    if (!cacheStr) return null;

    const cache: CacheData = JSON.parse(cacheStr);
    const metaStr = wx.getStorageSync(CACHE_META_KEY);
    const meta: CacheMeta = metaStr ? JSON.parse(metaStr) : { ttl: CACHE_TTL, version: 1 };

    // 检查是否过期
    const isExpired = Date.now() - cache.cachedAt > meta.ttl;

    return cache.communities;
  } catch (e) {
    console.error('读取缓存失败', e);
    return null;
  }
};

/**
 * 保存社区列表到缓存
 */
export const setCachedCommunities = (communities: Community[]): void => {
  try {
    const cache: CacheData = {
      communities,
      cachedAt: Date.now(),
    };

    const meta: CacheMeta = {
      ttl: CACHE_TTL,
      version: 1,
    };

    wx.setStorageSync(CACHE_KEY, JSON.stringify(cache));
    wx.setStorageSync(CACHE_META_KEY, JSON.stringify(meta));
  } catch (e) {
    console.error('保存缓存失败', e);
  }
};

/**
 * 检查缓存是否过期
 */
export const isCacheExpired = (): boolean => {
  try {
    const cacheStr = wx.getStorageSync(CACHE_KEY);
    if (!cacheStr) return true;

    const cache: CacheData = JSON.parse(cacheStr);
    const metaStr = wx.getStorageSync(CACHE_META_KEY);
    const meta: CacheMeta = metaStr ? JSON.parse(metaStr) : { ttl: CACHE_TTL, version: 1 };

    return Date.now() - cache.cachedAt > meta.ttl;
  } catch (e) {
    return true;
  }
};
```

### 第五步：创建 API 服务

创建 `src/pages/home/data/community-select/services/community.service.ts`:

```typescript
import Taro from '@tarojs/taro';
import type { Community } from '../../../types/community.types';

const BASE_URL = 'https://api.wanqing.example.com/v1';

/**
 * 获取社区列表
 */
export const fetchCommunities = async (
  params?: { lat?: number; lng?: number; radius?: number }
): Promise<Community[]> => {
  try {
    const response = await Taro.request({
      url: `${BASE_URL}/communities`,
      method: 'GET',
      data: {
        lat: params?.lat,
        lng: params?.lng,
        radius: params?.radius || 50,
        status: 'active',
        sort_by: params?.lat ? 'distance' : 'name',
      },
    });

    if (response.statusCode === 200) {
      return response.data.data.communities;
    }

    throw new Error('获取社区列表失败');
  } catch (e) {
    console.error('API 请求失败', e);
    throw e;
  }
};

/**
 * 获取社区详情
 */
export const fetchCommunityById = async (id: string): Promise<Community> => {
  try {
    const response = await Taro.request({
      url: `${BASE_URL}/communities/${id}`,
      method: 'GET',
    });

    if (response.statusCode === 200) {
      return response.data.data;
    }

    throw new Error('获取社区详情失败');
  } catch (e) {
    console.error('API 请求失败', e);
    throw e;
  }
};
```

### 第六步：创建主页面组件

创建 `src/pages/home/data/community-select/index.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { View, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useCommunityStore } from '../../store/community-store';
import { saveCommunity, loadCommunity } from '../../services/storage/encrypted-storage';
import { fetchCommunities } from './services/community.service';
import MapView from './components/MapView';
import ListView from './components/ListView';
import './index.scss';

export default function CommunitySelect() {
  const {
    communities,
    viewMode,
    isLoading,
    error,
    setCommunities,
    setViewMode,
    setLoading,
    setError,
  } = useCommunityStore();

  const [currentLocation, setCurrentLocation] = useState({
    latitude: 39.9042,
    longitude: 116.4074,
  });

  // 加载社区列表
  useEffect(() => {
    const loadCommunities = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. 尝试从缓存加载
        // const cached = getCachedCommunities();
        // if (cached) {
        //   setCommunities(cached);
        // }

        // 2. 从 API 加载最新数据
        const data = await fetchCommunities(currentLocation);
        setCommunities(data);
        // setCachedCommunities(data);
      } catch (e) {
        setError('加载社区列表失败，请检查网络连接');
      } finally {
        setLoading(false);
      }
    };

    loadCommunities();
  }, []);

  // 获取用户位置
  useEffect(() => {
    Taro.getLocation({
      type: 'wgs84',
      success: (res) => {
        setCurrentLocation({
          latitude: res.latitude,
          longitude: res.longitude,
        });
      },
      fail: () => {
        console.warn('获取位置失败，使用默认位置');
      },
    });
  }, []);

  // 选择社区
  const handleSelectCommunity = (communityId: string) => {
    const community = communities.find((c) => c.id === communityId);
    if (!community) return;

    try {
      saveCommunity(communityId);
      Taro.showToast({
        title: `已选择 ${community.name}`,
        icon: 'success',
      });

      // 跳转到首页
      setTimeout(() => {
        Taro.switchTab({
          url: '/pages/home/index',
        });
      }, 1500);
    } catch (e) {
      Taro.showToast({
        title: '保存失败，请重试',
        icon: 'none',
      });
    }
  };

  // 切换视图模式
  const handleToggleView = () => {
    setViewMode(viewMode === 'map' ? 'list' : 'map');
  };

  if (isLoading) {
    return (
      <View className="community-select loading">
        <View>加载中...</View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="community-select error">
        <View>{error}</View>
        <Button onClick={() => Taro.reLaunch({ url: '/pages/home/data/community-select/index' })}>
          重试
        </Button>
      </View>
    );
  }

  return (
    <View className="community-select">
      <View className="header">
        <Button onClick={handleToggleView}>
          切换到{viewMode === 'map' ? '列表' : '地图'}视图
        </Button>
      </View>

      {viewMode === 'map' ? (
        <MapView
          communities={communities}
          currentLocation={currentLocation}
          onSelectCommunity={handleSelectCommunity}
        />
      ) : (
        <ListView
          communities={communities}
          onSelectCommunity={handleSelectCommunity}
        />
      )}
    </View>
  );
}
```

### 第七步：创建页面配置

创建 `src/pages/home/data/community-select/index.config.ts`:

```typescript
export default definePageConfig({
  navigationBarTitleText: '选择社区',
  navigationBarBackgroundColor: '#fff',
  navigationBarTextStyle: 'black',
});
```

## Mock 数据开发

在 API 未就绪时，使用 Mock 数据开发：

```typescript
// src/pages/home/data/community-select/services/mock-data.ts
import type { Community } from '../../../types/community.types';

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'comm_001',
    name: '阳光花园',
    fullAddress: '北京市朝阳区xxx路123号',
    shortAddress: '朝阳区xxx路',
    latitude: 39.9042,
    longitude: 116.4074,
    serviceRange: '覆盖3公里以内',
    status: 'active',
    createdAt: 1705392000000,
    updatedAt: 1705392000000,
  },
  // ... 更多 Mock 数据
];

// 在 community.service.ts 中使用
export const fetchCommunities = async (): Promise<Community[]> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_COMMUNITIES;
};
```

## 测试要点

### 手动测试清单

基于规格中的验收场景：

- [ ] **首次选择社区**：
  - [ ] 打开小程序，显示社区选择页面
  - [ ] 默认显示地图视图
  - [ ] 点击标记点，显示社区详情
  - [ ] 点击"选择此社区"，保存并跳转到首页

- [ ] **自动加载已选社区**：
  - [ ] 已选择社区后，关闭并重新打开小程序
  - [ ] 自动加载上次选择的社区
  - [ ] 页面顶部显示当前社区名称

- [ ] **切换社区**：
  - [ ] 点击"切换社区"按钮
  - [ ] 显示社区选择页面，高亮当前社区
  - [ ] 选择新社区，成功切换

- [ ] **查看社区详情**：
  - [ ] 在地图视图点击标记点
  - [ ] 在列表视图点击社区项
  - [ ] 查看完整地址和服务范围

### 边界情况测试

- [ ] 网络请求失败时，显示缓存的社区列表
- [ ] 本地存储空间不足时，显示友好错误提示
- [ ] 用户定位失败时，地图仍显示所有社区
- [ ] 社区列表为空时，显示"暂无可选社区"

## 常见问题

### Q: 地图组件不显示？

**A**: 检查以下几点：
1. 确保 `app.config.ts` 中配置了定位权限：
```typescript
permission: {
  'scope.userLocation': {
    desc: '您的位置信息将用于提供周边服务'
  }
}
```
2. 检查模拟器是否支持地图组件（建议使用真机调试）

### Q: 本地存储失败？

**A**: 检查存储空间是否充足：
```typescript
try {
  wx.setStorageSync('test', 'test');
  wx.removeStorageSync('test');
} catch (e) {
  console.error('存储不可用', e);
}
```

### Q: 切换视图模式不生效？

**A**: 确保 Zustand Store 正确更新，检查组件是否订阅了 `viewMode` 状态。

## 下一步

完成基础开发后，可以：
1. 添加加载骨架屏优化体验
2. 实现下拉刷新功能
3. 添加社区搜索功能（如果需要）
4. 优化地图标记点性能（聚类、按需加载）
5. 添加单元测试和 E2E 测试

## 相关文档

- [Taro 官方文档](https://taro-docs.jd.com/)
- [微信小程序 Map 组件](https://developers.weixin.qq.com/miniprogram/dev/component/map.html)
- [Zustand 文档](https://zustand-demo.pmnd.rs/)
- [功能规格](./spec.md)
- [数据模型](./data-model.md)
- [API 契约](./contracts/community-api.yaml)
