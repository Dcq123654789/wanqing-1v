/**
 * 缓存管理器
 * 管理社区列表的本地缓存，支持 TTL 过期策略
 */
import Taro from '@tarojs/taro';
import type { Community } from '../../types/community.types';

const CACHE_KEY = 'communities_cache';
const CACHE_META_KEY = 'communities_cache_meta';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 天

/**
 * 缓存数据结构
 */
interface CacheData {
  communities: Community[];
  cachedAt: number;
}

/**
 * 缓存元数据结构
 */
interface CacheMeta {
  ttl: number;
  version: number;
}

/**
 * 获取缓存的社区列表
 * @returns 缓存的社区列表，如果不存在则返回 null
 */
export const getCachedCommunities = async (): Promise<Community[] | null> => {
  try {
    const cacheStr = await Taro.getStorageSync(CACHE_KEY);
    if (!cacheStr) return null;

    const cache: CacheData = JSON.parse(cacheStr);

    // 检查是否过期
    const metaStr = await Taro.getStorageSync(CACHE_META_KEY);
    const meta: CacheMeta = metaStr ? JSON.parse(metaStr) : { ttl: CACHE_TTL, version: 1 };

    const isExpired = Date.now() - cache.cachedAt > meta.ttl;

    if (isExpired) {
      console.log('缓存已过期');
    }

    return cache.communities;
  } catch (e) {
    console.error('读取缓存失败', e);
    return null;
  }
};

/**
 * 保存社区列表到缓存
 * @param communities 社区列表
 */
export const setCachedCommunities = async (communities: Community[]): Promise<void> => {
  try {
    const cache: CacheData = {
      communities,
      cachedAt: Date.now(),
    };

    const meta: CacheMeta = {
      ttl: CACHE_TTL,
      version: 1,
    };

    await Taro.setStorageSync(CACHE_KEY, JSON.stringify(cache));
    await Taro.setStorageSync(CACHE_META_KEY, JSON.stringify(meta));
  } catch (e) {
    console.error('保存缓存失败', e);
  }
};

/**
 * 检查缓存是否过期
 * @returns 是否过期
 */
export const isCacheExpired = async (): Promise<boolean> => {
  try {
    const cacheStr = await Taro.getStorageSync(CACHE_KEY);
    if (!cacheStr) return true;

    const cache: CacheData = JSON.parse(cacheStr);
    const metaStr = await Taro.getStorageSync(CACHE_META_KEY);
    const meta: CacheMeta = metaStr ? JSON.parse(metaStr) : { ttl: CACHE_TTL, version: 1 };

    return Date.now() - cache.cachedAt > meta.ttl;
  } catch (e) {
    return true;
  }
};

/**
 * 清除缓存
 */
export const clearCache = async (): Promise<void> => {
  try {
    await Taro.removeStorageSync(CACHE_KEY);
    await Taro.removeStorageSync(CACHE_META_KEY);
  } catch (e) {
    console.error('清除缓存失败', e);
  }
};

/**
 * 获取缓存时间戳
 * @returns 缓存时间戳，如果不存在则返回 0
 */
export const getCacheTimestamp = async (): Promise<number> => {
  try {
    const cacheStr = await Taro.getStorageSync(CACHE_KEY);
    if (!cacheStr) return 0;

    const cache: CacheData = JSON.parse(cacheStr);
    return cache.cachedAt;
  } catch (e) {
    return 0;
  }
};
