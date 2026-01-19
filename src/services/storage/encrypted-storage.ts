/**
 * 加密存储服务
 * 使用 Base64 编码对用户选择的社区进行加密存储
 */
import Taro from '@tarojs/taro';
import type { UserSelection } from '../../types/community.types';

const STORAGE_KEY = 'selected_community';

/**
 * 保存用户选择的社区（Base64 编码）
 * @param communityId 社区 ID
 * @throws {Error} 当存储失败时抛出错误
 */
export const saveCommunity = async (communityId: string): Promise<void> => {
  const data: UserSelection = {
    communityId,
    selectedAt: Date.now(),
    updatedAt: Date.now(),
  };

  const json = JSON.stringify(data);
  const encoded = btoa(encodeURIComponent(json));

  try {
    await Taro.setStorageSync(STORAGE_KEY, encoded);
  } catch (e) {
    console.error('保存社区选择失败', e);
    throw new Error('存储空间不足或存储失败');
  }
};

/**
 * 加载用户选择的社区
 * @returns 用户选择记录，如果不存在或解析失败则返回 null
 */
export const loadCommunity = async (): Promise<UserSelection | null> => {
  try {
    const encoded = await Taro.getStorageSync(STORAGE_KEY);
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
export const clearCommunity = async (): Promise<void> => {
  try {
    await Taro.removeStorageSync(STORAGE_KEY);
  } catch (e) {
    console.error('清除社区选择失败', e);
  }
};

/**
 * 检查是否存在已选择的社区
 * @returns 是否存在已选择的社区
 */
export const hasSelectedCommunity = async (): Promise<boolean> => {
  try {
    const encoded = await Taro.getStorageSync(STORAGE_KEY);
    return !!encoded;
  } catch (e) {
    return false;
  }
};
