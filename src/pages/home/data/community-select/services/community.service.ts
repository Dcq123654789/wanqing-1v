/**
 * 社区 API 服务
 * 提供社区相关的 API 接口调用
 */
import Taro from '@tarojs/taro';
import type { Community, ApiResponse } from '../../../types/community.types';

const BASE_URL = 'https://api.wanqing.example.com/v1';

/**
 * 获取社区列表
 * @param params 查询参数
 * @returns 社区列表
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
      const result = response.data as ApiResponse<{ communities: Community[] }>;
      if (result.success && result.data) {
        return result.data.communities;
      }
    }

    throw new Error('获取社区列表失败');
  } catch (e) {
    console.error('API 请求失败', e);
    throw e;
  }
};

/**
 * 获取社区详情
 * @param id 社区 ID
 * @returns 社区详情
 */
export const fetchCommunityById = async (id: string): Promise<Community> => {
  try {
    const response = await Taro.request({
      url: `${BASE_URL}/communities/${id}`,
      method: 'GET',
    });

    if (response.statusCode === 200) {
      const result = response.data as ApiResponse<Community>;
      if (result.success && result.data) {
        return result.data;
      }
    }

    throw new Error('获取社区详情失败');
  } catch (e) {
    console.error('API 请求失败', e);
    throw e;
  }
};

/**
 * 选择社区（记录用户选择行为）
 * @param communityId 社区 ID
 * @returns 选择结果
 */
export const selectCommunity = async (
  communityId: string
): Promise<{ communityId: string; selectedAt: number }> => {
  try {
    const response = await Taro.request({
      url: `${BASE_URL}/communities/${communityId}/select`,
      method: 'POST',
    });

    if (response.statusCode === 200) {
      const result = response.data as ApiResponse<{ communityId: string; selectedAt: number }>;
      if (result.success && result.data) {
        return result.data;
      }
    }

    throw new Error('选择社区失败');
  } catch (e) {
    console.error('API 请求失败', e);
    throw e;
  }
};
