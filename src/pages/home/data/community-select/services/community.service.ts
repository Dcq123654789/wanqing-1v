/**
 * 社区服务接口
 * 负责调用社区相关的 API（使用通用接口）
 */
import { request } from '@/utils/request'
import { API_ROUTES } from '@/config'
import type { Community } from '@/pages/home/types'

/**
 * 计算两个坐标点之间的距离（单位：公里）
 * 使用 Haversine 公式
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // 地球半径，单位：公里
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * 为社区列表添加距离信息并排序
 */
function addDistanceAndSort(communities: Community[], userLat?: number, userLng?: number): Community[] {
  if (!userLat || !userLng) {
    return communities // 如果没有用户位置，返回原顺序
  }

  return communities
    .map(community => ({
      ...community,
      distance: community.latitude && community.longitude
        ? calculateDistance(userLat, userLng, community.latitude, community.longitude)
        : Infinity // 如果社区没有坐标，距离设为无穷大
    }))
    .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity)) // 按距离升序排序
}

/**
 * 获取社区列表请求参数
 */
export interface GetCommunitiesParams {
  /** 用户纬度（用于按距离计算和排序） */
  lat?: number
  /** 用户经度（用于按距离计算和排序） */
  lng?: number
  /** 搜索半径（单位：公里） */
  radius?: number
  /** 筛选逻辑删除状态 */
  deleted?: 0 | 1 | 'all' // 0=未删除, 1=已删除
  /** 页码（从1开始） */
  page?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 社区列表响应数据
 */
export interface CommunitiesResponse {
  /** 社区列表 */
  communities: Community[]
  /** 社区总数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 缓存时间戳（毫秒） */
  cachedAt?: number
}

/**
 * 获取社区列表（使用通用接口）
 * @param params 请求参数
 * @returns Promise<CommunitiesResponse>
 */
export const fetchCommunities = async (
  params?: GetCommunitiesParams
): Promise<CommunitiesResponse> => {
  try {
    // 构建查询条件
    const conditions: any = {}
    if (params?.deleted !== undefined && params.deleted !== 'all') {
      conditions.deleted = params.deleted
    } else {
      // 默认只查询未删除的社区
      conditions.deleted = 0
    }

    // 构建排序条件（后端按创建时间降序）
    const sort: any = {
      createTime: 'desc'
    }

    const response = await request<{
      content: Community[]
      totalElements: number
      number: number  // 当前页码（从0开始）
      size: number    // 每页大小
      numberOfElements: number  // 当前页实际元素数量
      totalPages: number  // 总页数
      first: boolean   // 是否是第一页
      last: boolean    // 是否是最后一页
      empty: boolean   // 是否为空
    }>({
      url: '/api/batch', // 使用通用接口
      method: 'POST',
      data: {
        entity: 'community', // 实体名称
        action: 'query', // 操作类型
        conditions, // 查询条件
        pageNum: params?.page || 1,
        pageSize: params?.pageSize || 100, // 获取所有社区
        sort // 排序条件
        // fetch参数只用于关联实体预加载，基本类型字段不需要指定
      },
      needAuth: true // 社区列表需要登录才能访问
    })

    if (response.data) {
      // 为社区添加距离信息并排序
      const communitiesWithDistance = addDistanceAndSort(
        response.data.content || [],
        params?.lat,
        params?.lng
      )

      // 转换Spring Boot分页格式为原来的格式以保持兼容性
      return {
        communities: communitiesWithDistance,
        total: response.data.totalElements,
        page: response.data.number + 1, // Spring Boot页码从0开始，需要+1
        pageSize: response.data.size
      }
    }

    throw new Error('获取社区列表失败')
  } catch (error: any) {
    console.error('获取社区列表失败:', error)
    throw error
  }
}

/**
 * 获取社区详情（使用通用接口）
 * @param communityId 社区ID
 * @returns Promise<Community>
 */
export const fetchCommunityDetail = async (
  communityId: string
): Promise<Community> => {
  try {
    const response = await request<{
      content: Community[]
    }>({
      url: '/api/batch', // 使用通用接口
      method: 'POST',
      data: {
        entity: 'community', // 实体名称
        action: 'query', // 操作类型
        conditions: { _id: communityId }, // 查询条件
        pageSize: 1 // 只查询一条
        // fetch参数只用于关联实体预加载，基本类型字段不需要指定
      },
      needAuth: true // 社区详情需要登录才能访问
    })

    if (response.data && response.data.content && response.data.content.length > 0) {
      return response.data.content[0]
    }

    throw new Error('获取社区详情失败：社区不存在')
  } catch (error: any) {
    console.error('获取社区详情失败:', error)
    throw error
  }
}

/**
 * 记录用户选择社区（使用通用接口，用于统计）
 * @param communityId 社区ID
 * @returns Promise<void>
 */
export const selectCommunity = async (communityId: string): Promise<void> => {
  try {
    // 使用通用接口创建社区选择记录
    await request({
      url: '/api/batch',
      method: 'POST',
      data: {
        entity: 'community_selection', // 社区选择记录实体
        action: 'create',
        data: {
          communityId,
          selectedAt: new Date().toISOString(),
          // 用户ID会通过token自动获取
        }
      },
      needAuth: true
    })

    console.log('社区选择记录成功')
  } catch (error: any) {
    console.error('记录社区选择失败:', error)
    // 不抛出错误，因为这只是统计接口
  }
}
