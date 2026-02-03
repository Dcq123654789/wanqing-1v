/**
 * 社区活动服务接口
 * 负责调用社区活动相关的 API（使用通用接口）
 */
import { request } from '@/utils/request'
import type { ActivityListItem, CommunityActivity } from '../types'

// 后端返回的活动数据格式
interface BackendCommunityActivity {
  _id: string
  title: string
  description: string
  coverImage: string[]
  activityStartTime: string
  activityEndTime: string
  registrationDeadlineTime: string
  locationName: string
  locationAddress: string
  latitude?: number
  longitude?: number
  maxParticipants: number
  currentParticipants: number
  organizerName: string
  organizerPhone?: string
  images: string[]
  tags: string[]
  status: number // 1=即将开始, 2=进行中, 3=已结束, 4=已满员
  category: number // 0=文化, 1=体育, 2=娱乐, 3=志愿, 4=学习
  price?: number
  createTime: string
  updateTime: string
}

// 分类映射：后端数字 → 前端字符串
const CATEGORY_MAP: Record<number, 'culture' | 'sports' | 'entertainment' | 'volunteer' | 'learning'> = {
  0: 'culture',
  1: 'sports',
  2: 'entertainment',
  3: 'volunteer',
  4: 'learning'
}

// 状态映射：后端数字 → 前端字符串
const STATUS_MAP: Record<number, 'upcoming' | 'ongoing' | 'ended' | 'full'> = {
  1: 'upcoming',
  2: 'ongoing',
  3: 'ended',
  4: 'full'
}

/**
 * 将后端数据转换为前端格式
 */
function transformActivityData(backendData: BackendCommunityActivity): CommunityActivity {
  return {
    id: backendData._id,
    title: backendData.title,
    coverImage: backendData.coverImage || [], // 保留完整的图片数组
    description: backendData.description,
    time: `${backendData.activityStartTime} - ${backendData.activityEndTime}`,
    timestamp: new Date(backendData.activityStartTime).getTime(),
    locationAddress: backendData.locationAddress || '', // 详细地址（后端原始字段）
    location: {
      name: backendData.locationName,
      address: backendData.locationAddress,
      latitude: backendData.latitude,
      longitude: backendData.longitude
    },
    maxParticipants: backendData.maxParticipants,
    currentParticipants: backendData.currentParticipants,
    organizer: {
      name: backendData.organizerName,
      avatar: '', // 后端暂无组织者头像
      phone: backendData.organizerPhone
    },
    participants: [], // 后端暂无参与者列表
    images: backendData.images || [],
    registrationDeadline: backendData.registrationDeadlineTime,
    tags: backendData.tags || [],
    status: STATUS_MAP[backendData.status] || 'upcoming',
    category: CATEGORY_MAP[backendData.category] || 'culture',
    price: backendData.price || 0
  }
}

/**
 * 获取活动列表请求参数
 */
export interface GetActivitiesParams {
  /** 活动分类 */
  category?: 'culture' | 'sports' | 'entertainment' | 'volunteer' | 'learning'
  /** 活动状态 */
  status?: 'upcoming' | 'ongoing' | 'ended' | 'full'
  /** 筛选逻辑删除状态 */
  deleted?: 0 | 1 | 'all'
  /** 页码（从1开始） */
  page?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 活动列表响应数据
 */
export interface ActivitiesResponse {
  /** 活动列表 */
  activities: ActivityListItem[]
  /** 活动总数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
}

/**
 * 获取活动列表（使用通用接口）
 * @param params 请求参数
 * @returns Promise<ActivitiesResponse>
 */
export const fetchActivities = async (
  params?: GetActivitiesParams
): Promise<ActivitiesResponse> => {
  try {
    // 构建查询条件
    const conditions: any = {
      deleted: 0 // 默认只查询未删除的活动
    }

    // 添加分类筛选
    if (params?.category) {
      conditions.category = params.category
    }

    // 添加状态筛选
    if (params?.status) {
      conditions.status = params.status
    }

    // 如果 deleted 参数明确指定，则覆盖默认值
    if (params?.deleted !== undefined && params.deleted !== 'all') {
      conditions.deleted = params.deleted
    } else if (params?.deleted === 'all') {
      delete conditions.deleted
    }

    // 构建排序条件（按创建时间降序，最新的在前）
    const sort: any = {
      createTime: 'desc'
    }

    const response = await request<{
      content: BackendCommunityActivity[]
      totalElements: number
      number: number
      size: number
      numberOfElements: number
      totalPages: number
      first: boolean
      last: boolean
      empty: boolean
    }>({
      url: '/api/batch',
      method: 'POST',
      data: {
        entity: 'communityactivity',
        action: 'query',
        conditions,
        pageNum: params?.page || 1,
        pageSize: params?.pageSize || 100,
        sort
      },
      needAuth: true
    })

    if (response.data) {
      // 转换后端数据为前端格式
      const transformedActivities = (response.data.content || []).map(transformActivityData)

      // 将完整的活动数据转换为列表项格式
      const activityList: ActivityListItem[] = transformedActivities.map((activity) => ({
        id: activity.id,
        title: activity.title,
        coverImage: activity.coverImage, // 保持数组格式
        time: activity.time,
        location: activity.location.name,
        currentParticipants: activity.currentParticipants,
        maxParticipants: activity.maxParticipants,
        status: activity.status,
        category: activity.category
      }))

      return {
        activities: activityList,
        total: response.data.totalElements,
        page: response.data.number + 1,
        pageSize: response.data.size
      }
    }

    throw new Error('获取活动列表失败')
  } catch (error: any) {
    console.error('获取活动列表失败:', error)
    throw error
  }
}

/**
 * 获取活动详情（使用通用接口）
 * @param activityId 活动ID
 * @returns Promise<CommunityActivity>
 */
export const fetchActivityDetail = async (
  activityId: string
): Promise<CommunityActivity> => {
  try {
    console.log('fetchActivityDetail 开始，activityId:', activityId)
    const response = await request<any>({
      url: '/api/batch',
      method: 'POST',
      data: {
        entity: 'communityactivity',
        action: 'query',
        conditions: { _id: activityId },
        pageSize: 1
      },
      needAuth: true
    })

    console.log('fetchActivityDetail 响应:', response.data)

    // 处理不同的响应格式
    let activities: BackendCommunityActivity[] = []

    // 格式1: { data: { content: [] } }
    if (response.data?.data?.content && Array.isArray(response.data.data.content)) {
      activities = response.data.data.content
    }
    // 格式2: { data: [] } - 直接返回数组
    else if (response.data?.data && Array.isArray(response.data.data)) {
      activities = response.data.data
    }
    // 格式3: 直接是数组（某些情况下）
    else if (Array.isArray(response.data)) {
      activities = response.data
    }

    console.log('解析后的活动数组:', activities)

    if (activities.length > 0) {
      // 转换后端数据为前端格式
      return transformActivityData(activities[0])
    }

    throw new Error('获取活动详情失败：活动不存在')
  } catch (error: any) {
    console.error('获取活动详情失败:', error)
    throw error
  }
}

/**
 * 检查用户是否已报名某个活动
 * 使用专用接口 /api/community-activity
 * @param activityId 活动ID
 * @param userId 用户ID
 * @returns Promise<boolean> - true 表示已报名
 */
export const checkUserRegistration = async (activityId: string, userId: string): Promise<boolean> => {
  try {
    const response = await request<boolean>({
      url: '/api/community-activity',
      method: 'POST',
      data: {
        activityId: activityId,
        userId: userId
      },
      needAuth: true
    })

    // response.data 直接是 boolean 值（true/false）
    const hasRegistered = !!response.data
    console.log('检查报名状态:', { activityId, userId, hasRegistered })

    return hasRegistered
  } catch (error) {
    console.error('检查报名状态失败:', error)
    return false
  }
}

/**
 * 报名请求参数
 */
export interface JoinActivityParams {
  /** 活动ID */
  activityId: string
  /** 用户ID */
  userId: string
  /** 报名人姓名 */
  userName: string
  /** 报名人手机号 */
  userPhone: string
  /** 备注 */
  remarks?: string
}

/**
 * 报名响应
 */
export interface JoinActivityResponse {
  /** 状态码 */
  code: number
  /** 消息 */
  message: string
  /** 响应数据 */
  data: {
    /** 报名记录ID */
    registrationId: string
    /** 订单号 */
    orderNo: string
    /** 活动信息 */
    activity?: {
      _id: string
      title?: string
    }
    /** 是否免费 */
    isFree?: boolean
    /** 是否需要支付 */
    needPayment?: boolean
    /** 报名记录信息 */
    registration?: {
      paymentAmount?: number
    }
    /** 支付金额 */
    paymentAmount?: number
  }
}

/**
 * 报名参加活动
 *
 * 后端需要实现的事务逻辑：
 * 1. 使用数据库事务
 * 2. 先检查是否已报名（通过唯一索引）
 * 3. 检查活动是否已满员
 * 4. 插入报名记录
 * 5. 更新活动参与人数（使用条件更新防止超卖）
 *
 * @param params 报名参数
 * @returns Promise<JoinActivityResponse>
 */
export const joinActivity = async (params: JoinActivityParams): Promise<JoinActivityResponse> => {
  try {
    console.log('开始报名，参数:', params)

    const response = await request<JoinActivityResponse['data']>({
      url: '/api/community-activity/register',
      method: 'POST',
      data: {
        activityId: params.activityId,
        userId: params.userId,
        userName: params.userName,
        userPhone: params.userPhone,
        remarks: params.remarks || ''
      },
      needAuth: true
    })

    console.log('报名响应:', response)

    // 返回完整的响应结构 { code, message, data }
    return {
      code: response.code || 200,
      message: response.message || '报名成功',
      data: response.data || {}
    }
  } catch (error: any) {
    console.error('活动报名失败:', error)

    // 处理各种错误情况
    let errorMessage = '报名失败，请重试'

    if (error?.message) {
      if (error.message.includes('已报名')) {
        errorMessage = '您已经报名过该活动'
      } else if (error.message.includes('已满员')) {
        errorMessage = '活动已满员'
      } else if (error.message.includes('已结束')) {
        errorMessage = '活动已结束'
      } else {
        errorMessage = error.message
      }
    }

    throw new Error(errorMessage)
  }
}

/**
 * 取消活动报名（使用通用接口）
 * @param activityId 活动ID
 * @returns Promise<void>
 */
export const cancelActivityRegistration = async (activityId: string): Promise<void> => {
  try {
    await request({
      url: '/api/batch',
      method: 'POST',
      data: {
        entity: 'activity_registration',
        action: 'delete',
        conditions: {
          activityId
        }
      },
      needAuth: true
    })

    console.log('取消报名成功')
  } catch (error: any) {
    console.error('取消报名失败:', error)
    throw error
  }
}

/**
 * 取消报名并更新活动参与人数
 * @param registrationId 报名记录ID
 * @param activityId 活动ID
 * @returns Promise<void>
 */
export const cancelRegistrationAndUpdateActivity = async (
  registrationId: string,
  activityId: string
): Promise<void> => {
  try {
    // 1. 删除报名记录
    await request({
      url: '/api/batch',
      method: 'POST',
      data: {
        entity: 'activityregistration',
        action: 'delete',
        id: registrationId
      },
      needAuth: true
    })

    console.log('删除报名记录成功:', registrationId)

    // 2. 更新活动参与人数（减1）
    await request({
      url: '/api/batch',
      method: 'POST',
      data: {
        entity: 'communityactivity',
        action: 'update',
        id: activityId,
        data: {
          $inc: { currentParticipants: -1 }  // 使用 $inc 操作符减1
        }
      },
      needAuth: true
    })

    console.log('更新活动参与人数成功:', activityId)
  } catch (error: any) {
    console.error('取消报名失败:', error)
    throw error
  }
}

// ==================== 报名记录（订单）相关接口 ====================

/**
 * 报名记录状态
 */
export type RegistrationStatus = 'pending' | 'paid' | 'expired' | 'cancelled'

/**
 * 报名记录数据结构
 */
export interface RegistrationRecord {
  _id: string
  activityId: string
  userId: string
  name: string
  phone: string
  detailAddress: string
  amount: number
  paymentMethod: 'wechat' | null
  status: RegistrationStatus
  orderNo: string
  wechatPayParams?: {
    timeStamp: string
    nonceStr: string
    package: string
    signType: string
    paySign: string
  }
  createdAt: number
  paidAt?: number
  expiredAt?: number
}

/**
 * 创建报名记录（订单）
 * 后端逻辑：
 * 1. 使用数据库事务
 * 2. 检查活动状态和名额（FOR UPDATE 行锁）
 * 3. 检查是否已报名（唯一索引 userId + activityId）
 * 4. 扣减名额
 * 5. 创建报名记录
 * 6. 免费活动直接 paid，付费活动返回微信支付参数
 */
export interface CreateRegistrationParams {
  activityId: string
  name: string
  phone: string
  detailAddress: string
}

export interface CreateRegistrationResponse {
  registrationId: string
  orderNo: string
  status: RegistrationStatus
  amount: number
  expiredAt?: number
  wechatPayParams?: RegistrationRecord['wechatPayParams']
}

export const createRegistration = async (
  params: CreateRegistrationParams
): Promise<CreateRegistrationResponse> => {
  try {
    console.log('创建报名记录，参数:', params)

    const response = await request<CreateRegistrationResponse>({
      url: '/api/batch',
      method: 'POST',
      data: {
        entity: 'activityregistration',
        action: 'create',
        data: params
      },
      needAuth: true
    })

    console.log('创建报名记录响应:', response.data)

    if (response.data) {
      return response.data
    }

    throw new Error('创建报名记录失败')
  } catch (error: any) {
    console.error('创建报名记录失败:', error)

    // 处理各种错误情况
    let errorMessage = '创建报名失败，请重试'

    if (error?.message) {
      if (error.message.includes('已满员') || error.code === 1001) {
        errorMessage = '活动名额已满'
      } else if (error.message.includes('已报名') || error.code === 1002) {
        errorMessage = '您已经报名过该活动'
      } else if (error.message.includes('已结束') || error.code === 1003) {
        errorMessage = '活动已结束'
      } else {
        errorMessage = error.message
      }
    }

    throw new Error(errorMessage)
  }
}

/**
 * 查询报名记录状态
 * @param registrationId 报名记录ID
 * @returns Promise<RegistrationRecord>
 */
export const queryRegistrationStatus = async (
  registrationId: string
): Promise<RegistrationRecord> => {
  try {
    const response = await request<RegistrationRecord[]>({
      url: '/api/batch',
      method: 'POST',
      data: {
        entity: 'activityregistration',
        action: 'query',
        conditions: { _id: registrationId }
      },
      needAuth: true
    })

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0]
    }

    throw new Error('报名记录不存在')
  } catch (error: any) {
    console.error('查询报名状态失败:', error)
    throw error
  }
}

/**
 * 查询用户在某个活动的报名状态
 * @param activityId 活动ID
 * @param userId 用户ID
 * @returns Promise<RegistrationRecord | null>
 */
export const queryUserRegistration = async (
  activityId: string,
  userId: string
): Promise<RegistrationRecord | null> => {
  try {
    const response = await request<RegistrationRecord[]>({
      url: '/api/batch',
      method: 'POST',
      data: {
        entity: 'activityregistration',
        action: 'query',
        conditions: {
          activityId,
          userId
        }
      },
      needAuth: true
    })

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0]
    }

    return null
  } catch (error: any) {
    console.error('查询用户报名状态失败:', error)
    return null
  }
}

/**
 * 取消报名记录（订单）
 * 后端逻辑：
 * 1. 检查订单状态（只有 pending 可以取消）
 * 2. 释放名额
 * 3. 更新状态为 cancelled
 * @param registrationId 报名记录ID
 * @returns Promise<void>
 */
export const cancelRegistration = async (registrationId: string): Promise<void> => {
  try {
    await request({
      url: '/api/batch',
      method: 'POST',
      data: {
        entity: 'activityregistration',
        action: 'update',
        id: registrationId,
        data: { status: 'cancelled' }
      },
      needAuth: true
    })

    console.log('取消报名成功')
  } catch (error: any) {
    console.error('取消报名失败:', error)
    throw error
  }
}

/**
 * 支付轮询配置
 */
export const POLLING_CONFIG = {
  maxAttempts: 20,  // 最多轮询次数
  interval: 2000,   // 轮询间隔（毫秒）
  timeout: 40000    // 总超时时间（毫秒）
}

// ==================== 微信支付相关接口 ====================

/**
 * 微信支付参数
 */
export interface WechatPayParams {
  /** 时间戳 */
  timeStamp: string
  /** 随机字符串 */
  nonceStr: string
  /** 订单详情 */
  package: string
  /** 签名类型 */
  signType: 'MD5' | 'HMAC-SHA256' | 'RSA'
  /** 签名 */
  paySign: string
}

/**
 * 获取微信支付参数请求
 */
export interface GetWechatPayParamsRequest {
  /** 报名记录ID */
  registrationId: string
  /** 订单号 */
  orderNo: string
}

/**
 * 获取微信支付参数响应
 */
export interface GetWechatPayParamsResponse {
  /** 微信支付参数 */
  wechatPayParams: WechatPayParams
  /** 订单号 */
  orderNo: string
}

/**
 * 获取微信支付参数
 * @param params 报名记录ID和订单号
 * @returns Promise<GetWechatPayParamsResponse>
 */
export const getWechatPayParams = async (
  params: GetWechatPayParamsRequest
): Promise<GetWechatPayParamsResponse> => {
  try {
    console.log('获取微信支付参数，参数:', params)

    const response = await request<{
      code: number
      message: string
      data: WechatPayParams
    }>({
      url: '/api/wechat/pay/params',
      method: 'POST',
      data: {
        registrationId: params.registrationId,
        orderNo: params.orderNo
      },
      needAuth: true
    })

    console.log('获取微信支付参数响应:', response.data)

    if (response.data) {
      // 处理两种可能的响应格式：
      // 1. { data: { data: { ...payParams } } }
      // 2. { data: { ...payParams, totalAmount, outTradeNo } }
      const payData = response.data.data || response.data

      const wechatPayParams: WechatPayParams = {
        timeStamp: payData.timeStamp,
        nonceStr: payData.nonceStr,
        package: payData.package,
        signType: payData.signType || 'RSA',
        paySign: payData.paySign
      }

      return {
        wechatPayParams,
        orderNo: payData.outTradeNo || params.orderNo
      }
    }

    throw new Error('获取支付参数失败')
  } catch (error: any) {
    console.error('获取微信支付参数失败:', error)
    throw error
  }
}

/**
 * 轮询查询支付状态
 * @param registrationId 报名记录ID
 * @param onAbort 中断回调函数
 * @returns Promise<RegistrationRecord>
 */
export const pollPaymentStatus = async (
  registrationId: string,
  onAbort?: () => boolean
): Promise<RegistrationRecord> => {
  return new Promise((resolve, reject) => {
    let attempts = 0
    let timeoutId: NodeJS.Timeout

    const poll = async () => {
      // 检查是否需要中断
      if (onAbort && onAbort()) {
        reject(new Error('轮询已中断'))
        return
      }

      attempts++

      try {
        const record = await queryRegistrationStatus(registrationId)

        // 检查支付状态
        if (record.status === 'paid') {
          console.log('支付成功')
          resolve(record)
          return
        }

        if (record.status === 'cancelled' || record.status === 'expired') {
          console.log('订单已取消或过期')
          reject(new Error(record.status === 'cancelled' ? '订单已取消' : '订单已过期'))
          return
        }

        // 继续轮询
        if (attempts < POLLING_CONFIG.maxAttempts) {
          timeoutId = setTimeout(poll, POLLING_CONFIG.interval)
        } else {
          reject(new Error('支付超时，请稍后在"我的活动"中查看'))
        }
      } catch (error) {
        reject(error)
      }
    }

    poll()

    // 清理函数
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  })
}
