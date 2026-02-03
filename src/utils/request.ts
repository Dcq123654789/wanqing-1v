/**
 * 统一 HTTP 请求工具
 * 基于 API 开发文档实现双Token认证机制
 * 支持 Token 自动刷新和并发请求处理
 */
import Taro from '@tarojs/taro'
import { API_BASE_URL, REQUEST_TIMEOUT, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/config'

/**
 * Token 存储在内存中（页面关闭自动清除）
 */
let memoryAccessToken: string | null = null

/**
 * 是否正在刷新 Token（防止并发刷新）
 */
let isRefreshing = false

/**
 * 等待刷新完成的请求队列
 */
let refreshSubscribers: Array<(token: string) => void> = []

/**
 * 请求配置接口
 */
export interface RequestConfig {
  /** 请求地址 */
  url: string
  /** 请求方法 */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  /** 请求头 */
  header?: Record<string, string>
  /** 请求参数 */
  data?: any
  /** 是否显示加载中提示 */
  showLoading?: boolean
  /** 加载中提示文字 */
  loadingText?: string
  /** 是否需要登录（默认需要） */
  needAuth?: boolean
  /** 是否跳过刷新Token（用于刷新接口本身） */
  skipRefresh?: boolean
}

/**
 * 响应数据接口
 */
export interface ResponseData<T = any> {
  code: number
  message: string
  data: T
  timestamp?: number
}

/**
 * Token 刷新响应
 */
interface RefreshTokenResponse {
  accessToken: string
  tokenType: string
}

// ==================== Token 管理 ====================

/**
 * 保存 AccessToken 到内存
 */
export const setAccessToken = (token: string) => {
  memoryAccessToken = token
  console.log('AccessToken 已更新到内存')
}

/**
 * 获取 AccessToken（优先从内存获取）
 */
export const getAccessToken = (): string => {
  return memoryAccessToken || ''
}

/**
 * 保存 RefreshToken 到本地存储（持久化）
 */
export const setRefreshToken = (token: string) => {
  try {
    Taro.setStorageSync(REFRESH_TOKEN_KEY, token)
    console.log('RefreshToken 已保存到本地存储')
  } catch (error) {
    console.error('保存 RefreshToken 失败:', error)
  }
}

/**
 * 获取 RefreshToken
 */
export const getRefreshToken = (): string => {
  try {
    return Taro.getStorageSync(REFRESH_TOKEN_KEY) || ''
  } catch (error) {
    console.error('获取 RefreshToken 失败:', error)
    return ''
  }
}

/**
 * 同时保存两种 Token
 * @param accessToken 访问令牌
 * @param refreshToken 刷新令牌
 */
export const setTokens = (accessToken: string, refreshToken: string) => {
  setAccessToken(accessToken)
  setRefreshToken(refreshToken)
}

/**
 * 清除所有 Token
 */
export const clearTokens = () => {
  memoryAccessToken = null
  try {
    Taro.removeStorageSync(REFRESH_TOKEN_KEY)
    console.log('所有 Token 已清除')
  } catch (error) {
    console.error('清除 Token 失败:', error)
  }
}

/**
 * 兼容旧代码的 getToken 方法
 */
export const getToken = getAccessToken

/**
 * 兼容旧代码的 setToken 方法
 */
export const setToken = setAccessToken

/**
 * 兼容旧代码的 clearToken 方法
 */
export const clearToken = clearTokens

// ==================== Token 刷新 ====================

/**
 * 订阅 Token 刷新完成事件
 */
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

/**
 * 通知所有订阅者 Token 已刷新
 */
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

/**
 * 刷新 AccessToken
 * @returns Promise<string> 新的 AccessToken
 */
export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    throw new Error('RefreshToken 不存在')
  }

  try {
    const response = await Taro.request({
      url: API_BASE_URL + '/api/auth/refresh',
      method: 'POST',
      data: { refreshToken },
      header: {
        'Content-Type': 'application/json'
      }
    })

    if (response.statusCode === 200) {
      const data = response.data as ResponseData<RefreshTokenResponse>

      if (data.code === 200 && data.data) {
        const newAccessToken = data.data.accessToken

        // 更新内存中的 AccessToken
        setAccessToken(newAccessToken)

        console.log('AccessToken 刷新成功')

        // 通知所有等待的请求
        onTokenRefreshed(newAccessToken)

        return newAccessToken
      } else {
        throw new Error(data.message || 'Token 刷新失败')
      }
    } else {
      throw new Error(`Token 刷新失败: ${response.statusCode}`)
    }
  } catch (error: any) {
    console.error('刷新 Token 失败:', error)

    // RefreshToken 也过期了，清除所有 Token
    clearTokens()

    throw error
  }
}

/**
 * 处理 Token 过期
 * 自动刷新 Token 并重试原请求
 */
const handleTokenExpired = async (
  config: RequestConfig,
  reject: (reason?: any) => void
): Promise<RequestConfig | null> => {
  const refreshToken = getRefreshToken()

  // 没有 RefreshToken，跳转登录
  if (!refreshToken) {
    console.log('RefreshToken 不存在，需要重新登录')
    clearTokens()
    redirectToLogin()
    return null
  }

  // 正在刷新，将请求加入队列
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token: string) => {
        config.header = {
          ...config.header,
          'Authorization': `Bearer ${token}`
        }
        resolve(config)
      }
    )
    })
  }

  // 开始刷新 Token
  isRefreshing = true

  try {
    const newAccessToken = await refreshAccessToken()

    // 更新当前请求的 Token
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${newAccessToken}`
    }

    isRefreshing = false

    return config
  } catch (error) {
    isRefreshing = false

    // 刷新失败，跳转登录
    clearTokens()
    redirectToLogin()

    reject(error)
    return null
  }
}

/**
 * 跳转到登录页
 */
const redirectToLogin = () => {
  Taro.showToast({
    title: '登录已过期，请重新登录',
    icon: 'none',
    duration: 2000
  })

  setTimeout(() => {
    Taro.reLaunch({
      url: '/pages/login/index'
    })
  }, 1500)
}

// ==================== 请求拦截器 ====================

/**
 * 请求拦截器（异步，支持 token 刷新）
 */
const requestInterceptor = async (config: RequestConfig): Promise<RequestConfig> => {
  // 添加通用请求头
  config.header = {
    'Content-Type': 'application/json',
    ...config.header
  }

  // 添加 Token（如果需要认证）
  // needAuth 默认为 true，需要认证；明确设置为 false 时才不需要认证
  if (config.needAuth !== false) {
    let token = getAccessToken()

    // 如果内存中没有 accessToken，尝试用 refreshToken 刷新
    if (!token) {
      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        // 没有 refreshToken，需要重新登录
        console.error('需要认证但 RefreshToken 不存在')
        redirectToLogin()
        throw new Error('未登录')
      }

      // 有 refreshToken，尝试刷新获取新 accessToken
      console.log('AccessToken 不存在，尝试用 RefreshToken 刷新')
      try {
        token = await refreshAccessToken()
        console.log('AccessToken 刷新成功')
      } catch (error) {
        console.error('刷新 Token 失败:', error)
        // 刷新失败，清除 token 并跳转登录
        clearTokens()
        redirectToLogin()
        throw new Error('Token 刷新失败，请重新登录')
      }
    }

    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }

  console.log('🚀 发起请求:', config.url, config.data)

  return config
}

// ==================== 响应拦截器 ====================

/**
 * 处理业务错误
 */
const handleBusinessError = (data: ResponseData) => {
  const errorMap: Record<number, string> = {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求错误，未找到该资源',
    500: '服务器错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时'
  }

  const message = data.message || errorMap[data.code] || '未知错误'

  console.error('❌ 业务错误:', data.code, message)

  Taro.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })

  // 401 未授权
  if (data.code === 401) {
    clearTokens()
    redirectToLogin()
  }
}

/**
 * 处理 HTTP 错误
 */
const handleHttpError = (statusCode: number) => {
  const errorMap: Record<number, string> = {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求错误，未找到该资源',
    405: '请求方法不允许',
    408: '请求超时',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时'
  }

  const message = errorMap[statusCode] || `连接错误${statusCode}`

  console.error('❌ HTTP 错误:', statusCode, message)

  Taro.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })

  // 401 未授权
  if (statusCode === 401) {
    clearTokens()
    redirectToLogin()
  }
}

// ==================== 请求方法 ====================

/**
 * 通用请求方法（支持自动刷新 Token）
 * @param config 请求配置
 * @returns Promise<ResponseData>
 */
export const request = async <T = any>(
  config: RequestConfig
): Promise<ResponseData<T>> => {
  // 显示加载中
  if (config.showLoading) {
    Taro.showLoading({
      title: config.loadingText || '加载中...',
      mask: true
    })
  }

  // 请求拦截（异步）
  let interceptedConfig = await requestInterceptor(config)

  const makeRequest = (): Promise<ResponseData<T>> => {
    return new Promise((resolve, reject) => {
      Taro.request({
        url: API_BASE_URL + interceptedConfig.url,
        method: interceptedConfig.method || 'GET',
        header: interceptedConfig.header,
        data: interceptedConfig.data,
        timeout: REQUEST_TIMEOUT
      })
        .then((response) => {
          // 隐藏加载中
          if (config.showLoading) {
            Taro.hideLoading()
          }

          const { statusCode, data } = response

          console.log('✅ 收到响应:', interceptedConfig.url, statusCode, data)

          // HTTP 状态码判断
          if (statusCode >= 200 && statusCode < 300) {
            const responseData = data as ResponseData<T>

            // 业务状态码判断
            if (responseData.code === 200) {
              resolve(responseData)
            } else {
              // 业务错误
              handleBusinessError(responseData)
              reject(responseData)
            }
          } else if (statusCode === 401) {
            // Token 过期，尝试刷新（除非是刷新接口本身）
            if (!config.skipRefresh) {
              handleTokenExpired(interceptedConfig, reject)
                .then((newConfig) => {
                  if (newConfig) {
                    // 重试请求
                    interceptedConfig = newConfig
                    makeRequest().then(resolve).catch(reject)
                  }
                })
                .catch(() => {
                  reject(response)
                })
            } else {
              handleHttpError(statusCode)
              reject(response)
            }
          } else {
            // HTTP 错误
            handleHttpError(statusCode)
            reject(response)
          }
        })
        .catch((error) => {
          // 隐藏加载中
          if (config.showLoading) {
            Taro.hideLoading()
          }

          console.error('❌ 请求失败:', error)

          Taro.showToast({
            title: '网络请求失败',
            icon: 'none',
            duration: 2000
          })

          reject(error)
        })
    })
  }

  return makeRequest()
}

/**
 * GET 请求
 */
export const get = <T = any>(
  url: string,
  data?: any,
  config?: Partial<RequestConfig>
): Promise<ResponseData<T>> => {
  return request<T>({
    url,
    method: 'GET',
    data,
    ...config
  })
}

/**
 * POST 请求
 */
export const post = <T = any>(
  url: string,
  data?: any,
  config?: Partial<RequestConfig>
): Promise<ResponseData<T>> => {
  return request<T>({
    url,
    method: 'POST',
    data,
    ...config
  })
}

/**
 * PUT 请求
 */
export const put = <T = any>(
  url: string,
  data?: any,
  config?: Partial<RequestConfig>
): Promise<ResponseData<T>> => {
  return request<T>({
    url,
    method: 'PUT',
    data,
    ...config
  })
}

/**
 * DELETE 请求
 */
export const del = <T = any>(
  url: string,
  data?: any,
  config?: Partial<RequestConfig>
): Promise<ResponseData<T>> => {
  return request<T>({
    url,
    method: 'DELETE',
    data,
    ...config
  })
}

/**
 * 文件上传
 */
export const uploadFile = (
  url: string,
  filePath: string,
  name: string = 'file',
  formData?: Record<string, string>
): Promise<any> => {
  const token = getAccessToken()

  return new Promise((resolve, reject) => {
    const uploadTask = Taro.uploadFile({
      url: API_BASE_URL + url,
      filePath,
      name,
      formData,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data)
          if (data.code === 200) {
            resolve(data)
          } else {
            handleBusinessError(data)
            reject(data)
          }
        } else {
          handleHttpError(res.statusCode)
          reject(res)
        }
      },
      fail: (error) => {
        console.error('上传失败:', error)
        Taro.showToast({
          title: '上传失败',
          icon: 'none'
        })
        reject(error)
      }
    })

    // 监听上传进度
    uploadTask.onProgressUpdate((res) => {
      console.log('上传进度:', res.progress)
    })
  })
}

// ==================== 通用 CRUD 方法 ====================

/**
 * 通用查询
 * @param entity 实体名称
 * @param params 查询参数
 */
export const query = <T = any>(
  entity: string,
  params: {
    conditions?: Record<string, any>
    pageNum?: number
    pageSize?: number
    sort?: Record<string, 'asc' | 'desc'>
    fetch?: string[]
  } = {}
): Promise<ResponseData<T>> => {
  return post<T>('/api/batch', {
    entity,
    action: 'query',
    ...params
  })
}

/**
 * 通用创建
 * @param entity 实体名称
 * @param data 要创建的数据
 */
export const create = <T = any>(
  entity: string,
  data: Record<string, any>
): Promise<ResponseData<T>> => {
  return post<T>('/api/batch', {
    entity,
    action: 'create',
    data
  })
}

/**
 * 通用更新
 * @param entity 实体名称
 * @param id 记录ID
 * @param data 要更新的数据
 */
export const update = <T = any>(
  entity: string,
  id: string,
  data: Record<string, any>
): Promise<ResponseData<T>> => {
  return post<T>('/api/batch', {
    entity,
    action: 'update',
    id,
    data
  })
}

/**
 * 通用删除
 * @param entity 实体名称
 * @param id 记录ID
 */
export const deleteItem = <T = any>(
  entity: string,
  id: string
): Promise<ResponseData<T>> => {
  return post<T>('/api/batch', {
    entity,
    action: 'delete',
    id
  })
}

export default request
