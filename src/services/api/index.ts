/**
 * API 服务示例
 * 展示如何使用 request 工具封装业务接口
 */
import { get, post, put, del, uploadFile, setToken } from '@/utils/request'
import { API_ROUTES } from '@/config'

/**
 * 登录接口
 * @param code 微信登录 code
 */
export const login = (code: string) => {
  return post(API_ROUTES.AUTH.LOGIN, { code })
}

/**
 * 登出接口
 */
export const logout = () => {
  return post(API_ROUTES.AUTH.LOGOUT)
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return get(API_ROUTES.AUTH.GET_USER_INFO)
}

/**
 * 获取社区列表
 */
export const getCommunityList = () => {
  return get(API_ROUTES.COMMUNITY.LIST)
}

/**
 * 获取活动列表
 * @param params 查询参数
 */
export const getActivityList = (params?: {
  category?: string
  status?: string
  page?: number
  pageSize?: number
}) => {
  return get(API_ROUTES.ACTIVITY.LIST, params)
}

/**
 * 获取活动详情
 * @param id 活动 ID
 */
export const getActivityDetail = (id: string) => {
  return get(`${API_ROUTES.ACTIVITY.DETAIL}/${id}`)
}

/**
 * 参加活动
 * @param activityId 活动 ID
 * @param data 报名信息
 */
export const joinActivity = (activityId: string, data: {
  name: string
  phone: string
  remark?: string
}) => {
  return post(`${API_ROUTES.ACTIVITY.JOIN}/${activityId}`, data)
}

/**
 * 获取商品列表
 * @param params 查询参数
 */
export const getProductList = (params?: {
  category?: string
  keyword?: string
  page?: number
  pageSize?: number
}) => {
  return get(API_ROUTES.MALL.PRODUCT_LIST, params)
}

/**
 * 获取商品详情
 * @param id 商品 ID
 */
export const getProductDetail = (id: string) => {
  return get(`${API_ROUTES.MALL.PRODUCT_DETAIL}/${id}`)
}

/**
 * 获取服务列表
 * @param params 查询参数
 */
export const getServiceList = (params?: {
  category?: string
  page?: number
  pageSize?: number
}) => {
  return get(API_ROUTES.SERVICE.LIST, params, {
    showLoading: true,
    loadingText: '加载中...'
  })
}

/**
 * 获取服务详情
 * @param id 服务 ID
 */
export const getServiceDetail = (id: string) => {
  return get(`${API_ROUTES.SERVICE.DETAIL}/${id}`, undefined, {
    showLoading: true
  })
}

/**
 * 预订服务
 * @param serviceId 服务 ID
 * @param data 预订信息
 */
export const bookService = (serviceId: string, data: {
  appointmentTime: string
  name: string
  phone: string
  address: string
  remark?: string
}) => {
  return post(`${API_ROUTES.SERVICE.BOOK}/${serviceId}`, data, {
    showLoading: true,
    loadingText: '提交中...'
  })
}

/**
 * 获取康养服务列表
 * @param params 查询参数
 */
export const getWellnessList = (params?: {
  category?: string
  page?: number
  pageSize?: number
}) => {
  return get(API_ROUTES.WELLNESS.LIST, params)
}

/**
 * 获取康养服务详情
 * @param id 服务 ID
 */
export const getWellnessDetail = (id: string) => {
  return get(`${API_ROUTES.WELLNESS.DETAIL}/${id}`)
}

/**
 * 预订康养服务
 * @param serviceId 服务 ID
 * @param data 预订信息
 */
export const bookWellness = (serviceId: string, data: {
  appointmentTime: string
  name: string
  phone: string
  idCard?: string
  remark?: string
}) => {
  return post(`${API_ROUTES.WELLNESS.BOOK}/${serviceId}`, data, {
    showLoading: true,
    loadingText: '预订中...'
  })
}

/**
 * 创建在线问诊
 * @param data 问诊信息
 */
export const createConsultation = (data: {
  department: string
  doctorId?: string
  symptoms: string
  images?: string[]
  remark?: string
}) => {
  return post(API_ROUTES.CONSULTATION.CREATE, data, {
    showLoading: true,
    loadingText: '提交中...'
  })
}

/**
 * 获取用户订单列表
 * @param params 查询参数
 */
export const getUserOrders = (params?: {
  status?: string
  page?: number
  pageSize?: number
}) => {
  return get(API_ROUTES.USER.ORDERS, params)
}

/**
 * 上传图片
 * @param filePath 本地文件路径
 */
export const uploadImage = (filePath: string) => {
  return uploadFile(API_ROUTES.UPLOAD.IMAGE, filePath, 'file')
}

/**
 * 更新用户资料
 * @param data 用户资料
 */
export const updateUserProfile = (data: {
  name?: string
  avatar?: string
  phone?: string
  idCard?: string
}) => {
  return put(API_ROUTES.USER.UPDATE_PROFILE, data)
}
