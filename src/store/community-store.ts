/**
 * 社区选择状态管理
 * 使用 Zustand 进行轻量级状态管理
 */
import { create } from 'zustand';
import type { Community, ViewMode } from '../types/community.types';
import { saveCommunity, loadCommunity as loadCommunityFromStorage } from '../services/storage/encrypted-storage';
import { fetchCommunities as fetchCommunitiesApi } from '../pages/home/data/community-select/services/community.service';
import { getCachedCommunities, setCachedCommunities } from '../services/storage/cache-manager';

/**
 * 社区状态管理接口
 */
interface CommunityStore {
  // ========== 状态 ==========
  /** 当前选择的社区 */
  selectedCommunity: Community | null;
  /** 社区列表 */
  communities: Community[];
  /** 视图模式 */
  viewMode: ViewMode;
  /** 加载状态 */
  isLoading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 最后获取时间 */
  lastFetchTime: number;

  // ========== 操作 ==========
  /** 设置当前选择的社区 */
  setSelectedCommunity: (community: Community) => void;
  /** 设置社区列表 */
  setCommunities: (communities: Community[]) => void;
  /** 设置视图模式 */
  setViewMode: (mode: ViewMode) => void;
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void;
  /** 设置错误信息 */
  setError: (error: string | null) => void;
  /** 切换社区 */
  switchCommunity: (communityId: string) => Promise<void>;
  /** 刷新社区列表 */
  refreshCommunities: () => Promise<void>;
  /** 从缓存加载 */
  loadFromCache: () => Promise<void>;
  /** 从存储加载已选择的社区 */
  loadSelectedCommunity: () => Promise<void>;
}

/**
 * 创建社区状态管理 store
 */
export const useCommunityStore = create<CommunityStore>((set, get) => ({
  // ========== 初始状态 ==========
  selectedCommunity: null,
  communities: [],
  viewMode: 'map',
  isLoading: false,
  error: null,
  lastFetchTime: 0,

  // ========== 操作实现 ==========
  setSelectedCommunity: (community) => set({ selectedCommunity: community }),

  setCommunities: (communities) => set({
    communities,
    lastFetchTime: Date.now()
  }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  switchCommunity: async (communityId) => {
    const { communities } = get();
    const community = communities.find(c => c.id === communityId);

    if (!community) {
      set({ error: `社区 ${communityId} 不存在` });
      return;
    }

    try {
      // 保存到本地存储
      await saveCommunity(communityId);
      set({
        selectedCommunity: community,
        error: null
      });
    } catch (error) {
      set({ error: '保存社区选择失败' });
    }
  },

  refreshCommunities: async () => {
    set({ isLoading: true, error: null });

    try {
      // 从 API 获取最新社区列表
      const communities = await fetchCommunitiesApi();
      set({ communities, lastFetchTime: Date.now() });

      // 更新缓存
      await setCachedCommunities(communities);
    } catch (error) {
      set({ error: '刷新社区列表失败' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadFromCache: async () => {
    try {
      // 从缓存加载社区列表
      const cached = await getCachedCommunities();
      if (cached) {
        set({ communities: cached });
      }
    } catch (error) {
      console.error('从缓存加载失败', error);
    }
  },

  loadSelectedCommunity: async () => {
    try {
      const selection = await loadCommunityFromStorage();
      if (selection) {
        const { communities } = get();
        const community = communities.find(c => c.id === selection.communityId);
        if (community) {
          set({ selectedCommunity: community });
        }
      }
    } catch (error) {
      console.error('加载已选社区失败', error);
    }
  },
}));
