/**
 * Mock 数据
 * 用于开发和测试的模拟数据
 */
import type { Community } from '../../../types/community.types';

/**
 * Mock 社区列表数据
 */
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
  {
    id: 'comm_002',
    name: '碧水湾',
    fullAddress: '北京市海淀区yyy路456号',
    shortAddress: '海淀区yyy路',
    latitude: 39.9142,
    longitude: 116.4174,
    serviceRange: '覆盖5公里以内',
    status: 'active',
    createdAt: 1705392000000,
    updatedAt: 1705392000000,
  },
  {
    id: 'comm_003',
    name: '翠竹苑',
    fullAddress: '北京市丰台区zzz路789号',
    shortAddress: '丰台区zzz路',
    latitude: 39.8642,
    longitude: 116.3874,
    serviceRange: '覆盖4公里以内',
    status: 'active',
    createdAt: 1705392000000,
    updatedAt: 1705392000000,
  },
  {
    id: 'comm_004',
    name: '绿景家园',
    fullAddress: '北京市西城区aaa路101号',
    shortAddress: '西城区aaa路',
    latitude: 39.9242,
    longitude: 116.3774,
    serviceRange: '覆盖3公里以内',
    status: 'active',
    createdAt: 1705392000000,
    updatedAt: 1705392000000,
  },
  {
    id: 'comm_005',
    name: '锦绣华庭',
    fullAddress: '北京市东城区bbb路202号',
    shortAddress: '东城区bbb路',
    latitude: 39.9342,
    longitude: 116.4274,
    serviceRange: '覆盖6公里以内',
    status: 'active',
    createdAt: 1705392000000,
    updatedAt: 1705392000000,
  },
  {
    id: 'comm_006',
    name: '湖畔花园',
    fullAddress: '北京市朝阳区ccc路303号',
    shortAddress: '朝阳区ccc路',
    latitude: 39.8942,
    longitude: 116.4374,
    serviceRange: '覆盖4公里以内',
    status: 'active',
    createdAt: 1705392000000,
    updatedAt: 1705392000000,
  },
];

/**
 * 根据 ID 获取 Mock 社区数据
 * @param id 社区 ID
 * @returns 社区数据，如果不存在则返回 undefined
 */
export const getMockCommunityById = (id: string): Community | undefined => {
  return MOCK_COMMUNITIES.find((community) => community.id === id);
};

/**
 * 模拟 API 延迟
 * @param ms 延迟毫秒数
 * @returns Promise
 */
export const mockDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
