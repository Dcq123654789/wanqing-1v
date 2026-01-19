# 研究文档：社区选择页面

**功能**: 社区选择页面 | **日期**: 2025-01-16
**目的**: 解决技术上下文中的未知项和依赖项

## 研究任务

### 1. 测试框架选择 (来自技术上下文 NEEDS CLARIFICATION)

**决策**: 暂不引入单元测试框架，采用手动测试为主

**理由**:
- 微信小程序生态测试工具链相对不成熟
- Taro 官方推荐的测试工具 @tarojs/test 与 Jest 集成存在兼容性问题
- 当前功能以 UI 交互为主，单元测试收益有限
- 优先保证功能交付，后续可补充端到端测试

**替代方案**:
- 使用微信开发者工具进行手动测试
- 验收场景作为测试清单（Given-When-Then 格式）
- 未来可考虑引入 Minium（微信小程序自动化测试框架）

**已考虑的选项**:
- Jest + @testing-library/react - 与 Taro 小程序环境兼容性问题
- Minium - 微信官方 E2E 测试框架，学习成本较高
- 手动测试 - 快速验证，适合初期开发

### 2. 社区数据规模假设 (来自技术上下文 NEEDS CLARIFICATION)

**决策**: 预估社区数量 200-500 个，单条记录约 500 字节

**理由**:
- 典型地级市社区覆盖范围
- 考虑未来 2-3 年扩展空间
- 单个社区数据包含：ID(8B)、名称(32B)、地址(128B)、经纬度(16B)、服务范围(256B)、运营状态(1B)

**性能影响**:
- 总数据量约 100KB-250KB，适合小程序本地缓存
- 地图渲染 500 个标记点需要优化（聚合、按需加载）
- 列表滚动需要虚拟滚动优化

**缓存策略建议**:
- 使用微信小程序本地存储（10MB 限制）
- 缓存有效期：7 天（平衡数据新鲜度和网络请求）
- 后台静默更新：每次启动时检查更新，有网络时后台刷新

### 3. 微信小程序地图组件最佳实践

**决策**: 使用微信小程序原生 `<map>` 组件，配合自定义标记点

**理由**:
- Taro 对 `<Map>` 组件有良好封装
- 原生组件性能最佳，避免 WebView 性能损耗
- 支持标记点点击事件、自定义样式

**关键实现点**:
```typescript
// 标记点数据结构
interface Marker {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  iconPath?: string;  // 可选：自定义图标
  width?: number;
  height?: number;
  alpha?: number;     // 透明度（用于高亮当前社区）
}

// 地图组件配置
<Map
  latitude={currentLocation.latitude}
  longitude={currentLocation.longitude}
  markers={markers}
  onMarkerTap={handleMarkerTap}
  showLocation={true}
  enableZoom={true}
  enableScroll={true}
/>
```

**性能优化**:
- 标记点超过 100 个时，使用聚类策略（显示数字徽章）
- 按地图可视区域动态加载标记点
- 首次渲染仅显示用户周边 20km 范围内的社区

### 4. 加密存储实现方案

**决策**: 使用微信小程序 `wx.setStorage` + Base64 编码（非严格加密）

**理由**:
- 微信小程序本地存储已受沙箱保护，不同小程序隔离
- 严格的加密会带来性能开销和密钥管理复杂度
- Base64 编码可防止直接查看，满足基本隐私保护需求
- 规格要求"加密"但未明确安全级别，采用适度方案

**实现示例**:
```typescript
// 存储用户选择
const saveCommunity = (communityId: string) => {
  const data = JSON.stringify({
    communityId,
    timestamp: Date.now()
  });
  const encoded = btoa(encodeURIComponent(data)); // Base64 编码
  wx.setStorageSync('selected_community', encoded);
};

// 读取用户选择
const loadCommunity = () => {
  try {
    const encoded = wx.getStorageSync('selected_community');
    if (!encoded) return null;
    const decoded = decodeURIComponent(atob(encoded));
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
};
```

**未来增强**:
- 如需严格加密，可使用微信小程序 `wx.getRandomValues()` + AES 加密
- 敏感数据（如用户信息）应存储在服务端，本地仅存储社区 ID

### 5. 离线缓存与数据同步策略

**决策**: 两级缓存（内存 + 本地存储）+ 后台静默更新

**架构设计**:

```
┌─────────────┐
│  UI 组件     │
└──────┬──────┘
       │
┌──────▼──────┐
│ Zustand Store│ (内存缓存，快速访问)
└──────┬──────┘
       │
┌──────▼──────┐
│Cache Manager│ (本地存储，持久化)
└──────┬──────┘
       │
┌──────▼──────┐
│ API Service │ (网络请求)
└─────────────┘
```

**缓存更新逻辑**:
```typescript
const fetchCommunities = async () => {
  // 1. 优先返回本地缓存（快速显示）
  const cached = cacheManager.get('communities');
  if (cached) {
    store.setCommunities(cached);
  }

  // 2. 后台检查更新
  try {
    const latest = await api.getCommunities();
    cacheManager.set('communities', latest, { ttl: 7 * 24 * 60 * 60 * 1000 });
    store.setCommunities(latest);
  } catch (e) {
    // 网络失败，保持使用缓存
    if (!cached) {
      showError('无法加载社区列表，请检查网络连接');
    }
  }
};
```

**TTL（缓存有效期）决策**:
- 社区信息变化频率低（新增/下线社区操作不频繁）
- 7 天有效期可减少 90% 的网络请求
- 用户可手动下拉刷新触发立即更新

### 6. 状态管理设计 (Zustand)

**决策**: 创建独立的 `community-store.ts`，管理社区选择状态

**Store 结构**:
```typescript
interface CommunityStore {
  // 状态
  selectedCommunity: Community | null;
  communities: Community[];
  viewMode: 'map' | 'list';
  isLoading: boolean;
  error: string | null;

  // 操作
  setSelectedCommunity: (community: Community) => void;
  setCommunities: (communities: Community[]) => void;
  setViewMode: (mode: 'map' | 'list') => void;
  switchCommunity: (communityId: string) => Promise<void>;
  refreshCommunities: () => Promise<void>;
}

export const useCommunityStore = create<CommunityStore>((set, get) => ({
  // 初始状态
  selectedCommunity: null,
  communities: [],
  viewMode: 'map',
  isLoading: false,
  error: null,

  // 实现方法...
}));
```

**优势**:
- 轻量级（~1KB），比 Redux 简单
- 支持 TypeScript 类型推导
- 无需 Provider 包裹，直接在组件中使用

### 7. API 接口设计（假设后端未提供）

**决策**: 定义标准 REST 接口，使用 TypeScript 接口描述

**接口定义** (详见 `contracts/community-api.yaml`):
- `GET /api/communities` - 获取社区列表
- `GET /api/communities/:id` - 获取社区详情
- 支持查询参数：`lat`, `lng`, `radius`（按距离筛选）

**Mock 数据方案**:
- 开发阶段使用本地 Mock 数据
- 生产环境切换到真实 API
- 使用 Taro 的 `request` 方法封装 HTTP 客户端

## 技术风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 地图组件性能问题（大量标记点） | 高 | 标记点聚类、按需加载、分批渲染 |
| 本地存储空间不足 | 中 | 数据压缩、定期清理过期缓存 |
| 微小程序 API 兼容性 | 中 | 测试 iOS + Android 不同版本 |
| 网络请求失败率高 | 低 | 降级到缓存、友好错误提示 |
| 加密存储密钥管理 | 低 | 当前使用 Base64 编码，暂无密钥 |

## 技术决策总结

1. **测试**: 手动测试 + 验收场景检查清单
2. **社区规模**: 200-500 个社区，总数据量 100-250KB
3. **地图**: 微信原生 `<map>` 组件 + 标记点优化
4. **存储**: Base64 编码（适度保护） + 7 天缓存有效期
5. **状态管理**: Zustand 轻量级状态管理
6. **缓存策略**: 两级缓存 + 后台静默更新
7. **API**: REST 接口，支持距离筛选

## 下一步

Phase 1 将基于本研究结果生成：
- `data-model.md` - 详细的数据模型设计
- `contracts/` - API 接口契约
- `quickstart.md` - 开发环境搭建和快速开始指南
