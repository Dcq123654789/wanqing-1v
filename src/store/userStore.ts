/**
 * 用户状态管理
 * 基于 API 开发文档实现双Token认证
 */
import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { setTokens, clearTokens, getAccessToken, getRefreshToken, request, query } from '@/utils/request'
import { API_ROUTES } from '@/config'

const USER_INFO_KEY = 'user_info'

interface UserInfo {
  _id: string  // 用户主键ID，用于更新操作
  id?: string  // 兼容性字段
  userId?: string
  username?: string
  nickname?: string
  openid?: string
  avatar?: string
  phone?: string
  name?: string
  realName?: string  // 真实姓名
  gender?: number
  address?: string  // 详细地址
  birthDate?: string  // 出生日期
  province?: string  // 省份
  city?: string  // 城市
  district?: string  // 区县
  detailAddress?: string  // 详细地址（门牌等）
  balance?: number
  isNewUser?: boolean
  communityId?: string  // 绑定的社区ID
  communityName?: string  // 绑定的社区名称
}

interface LoginParams {
  type: 'wechat'
  code: string // 微信授权码
  nickname?: string
  avatar?: string
  gender?: number
}

interface UserState {
  isLoggedIn: boolean
  token: string
  userInfo: UserInfo | null
  isRefreshing: boolean  // 是否正在刷新用户信息
  lastFetchTime: number  // 上次获取用户信息的时间戳
  setToken: (token: string) => void
  setUserInfo: (info: UserInfo) => void
  login: (params: LoginParams) => Promise<boolean>
  logout: () => void
  initializeAuth: (forceRefresh?: boolean) => void  // 添加forceRefresh参数
  getCurrentUser: (forceRefresh?: boolean) => Promise<UserInfo | null>  // 添加forceRefresh参数
  updateUserInfo: (data: Partial<UserInfo>) => Promise<boolean>
  // 社区相关方法
  setCommunity: (communityId: string, communityName: string) => Promise<void>
  clearCommunity: () => void
}

/**
 * 保存用户信息到本地存储
 */
const saveUserInfo = (userInfo: UserInfo) => {
  try {
    Taro.setStorageSync(USER_INFO_KEY, JSON.stringify(userInfo))
  } catch (error) {
    console.error('保存用户信息失败:', error)
  }
}

/**
 * 从本地存储加载用户信息
 */
const loadUserInfo = (): UserInfo | null => {
  try {
    const data = Taro.getStorageSync(USER_INFO_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('加载用户信息失败:', error)
    return null
  }
}

/**
 * 清除用户信息
 */
const clearUserInfo = () => {
  try {
    Taro.removeStorageSync(USER_INFO_KEY)
  } catch (error) {
    console.error('清除用户信息失败:', error)
  }
}

/**
 * 登录响应数据
 */
interface LoginResponseData {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  // user: 用户完整信息对象
  user?: {
    _id: string
    openid?: string
    nickname?: string
    avatar?: string
    realName?: string
    phone?: string
    gender?: number
    birthDate?: string
    province?: string
    city?: string
    district?: string
    detailAddress?: string
    communityId?: string
    community?: {
      _id: string
      name?: string
    }
    createTime?: string
    updateTime?: string
    status?: number
    deleted?: number
  }
}

export const useUserStore = create<UserState>((set, get) => ({
  isLoggedIn: false,
  token: '',
  userInfo: null,
  isRefreshing: false,  // 初始化刷新状态
  lastFetchTime: 0,     // 初始化最后获取时间

  /**
    * 初始化认证状态
    * 从本地存储恢复登录信息，根据需要获取最新用户数据
    * @param forceRefresh 是否强制刷新用户信息（默认false）
    */
  initializeAuth: async (forceRefresh = false) => {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()
    const userInfo = loadUserInfo()

    console.log('初始化认证状态:', { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken, hasUserInfo: !!userInfo })

    if ((accessToken || refreshToken) && userInfo) {
      set({
        token: accessToken || refreshToken, // 优先使用accessToken
        userInfo,
        isLoggedIn: true
      })

      // 缓存策略：5分钟内不重复请求
      const CACHE_DURATION = 5 * 60 * 1000 // 5分钟
      const now = Date.now()
      const lastFetch = get().lastFetchTime
      const shouldFetch = forceRefresh || !lastFetch || (now - lastFetch > CACHE_DURATION)

      if (shouldFetch) {
        console.log('正在获取最新用户数据...')
        // 自动获取最新的用户信息，确保数据是最新的
        try {
          await get().getCurrentUser(true)  // 强制刷新
          console.log('已获取最新用户数据')
        } catch (error) {
          console.error('获取最新用户数据失败，使用本地缓存数据:', error)
          // 获取失败时继续使用本地缓存的数据
        }
      } else {
        console.log('使用缓存用户数据，距离上次获取:', Math.floor((now - lastFetch) / 1000), '秒')
      }
    } else {
      console.log('未找到登录信息')
      set({
        isLoggedIn: false,
        token: '',
        userInfo: null
      })
    }
  },

  setToken: (token) => {
    set({ token })
  },

  setUserInfo: (info) => {
    set({ userInfo: info, isLoggedIn: true })
    saveUserInfo(info)
  },

  /**
   * 微信小程序登录
   * @param params 登录参数
   * @returns Promise<boolean> 是否登录成功
   */
  login: async (params: LoginParams): Promise<boolean> => {
    try {
      if (params.type !== 'wechat') {
        console.error('不支持的登录类型:', params.type)
        return false
      }

      // 微信一键登录
      if (!params.code) {
        console.error('微信登录缺少授权码')
        return false
      }

      const response = await request<LoginResponseData>({
        url: API_ROUTES.AUTH.LOGIN,
        method: 'POST',
        data: {
          code: params.code,
          nickname: params.nickname,
          avatar: params.avatar,
          gender: params.gender
        },
        needAuth: false // 登录接口不需要token
      })

      // 处理登录成功响应
      if (response && response.data) {
        console.log('登录接口返回的完整数据:', response.data)

        // 从 response.data 中获取 token 信息
        const { accessToken, refreshToken, tokenType, expiresIn } = response.data

        // 从 response.data.user 中获取用户信息
        const userData = (response.data as any).user

        if (!accessToken || !refreshToken) {
          console.error('登录响应数据不完整，缺少 token')
          return false
        }

        if (!userData || !userData._id) {
          console.error('登录响应中缺少用户信息或用户ID')
          console.error('用户数据:', userData)
          return false
        }

        // 判断是否为新用户（根据是否有真实姓名和手机号判断）
        const isNewUser = !userData.realName || !userData.phone

        // 构建用户信息
        const userInfo: UserInfo = {
          _id: userData._id,
          id: userData._id,
          userId: userData._id,
          openid: userData.openid,
          nickname: userData.nickname,
          avatar: userData.avatar,
          realName: userData.realName,
          phone: userData.phone,
          gender: userData.gender,
          birthDate: userData.birthDate,
          province: userData.province,
          city: userData.city,
          district: userData.district,
          detailAddress: userData.detailAddress,
          isNewUser: isNewUser,
          communityId: userData.communityId,
          // 兼容两种情况：1. community.name 2. 直接的 communityName 字段
          communityName: userData.community?.name || userData.communityName || ''
        }

        console.log('构建的用户信息:', userInfo)

        // 同时保存两种Token
        setTokens(accessToken, refreshToken)

        // 更新store状态
        set({
          userInfo,
          isLoggedIn: true,
          token: accessToken // store中保存accessToken
        })

        // 持久化用户信息
        saveUserInfo(userInfo)

        const message = isNewUser ? '注册成功' : '登录成功'
        Taro.showToast({
          title: message,
          icon: 'success',
          duration: 2000
        })

         
        return true
      } else {
        console.error('登录响应格式错误')
        return false
      }
    } catch (error: any) {
      console.error('登录失败:', error)

      // 显示错误提示
      const errorMessage = error?.message || '登录失败，请重试'
      Taro.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 2000
      })

      return false
    }
  },

  /**
   * 退出登录
   */
  logout: () => {
    set({
      isLoggedIn: false,
      token: '',
      userInfo: null
    })

    // 清除所有Token和用户信息
    clearTokens()
    clearUserInfo()

    // 清除社区本地缓存
    try {
      Taro.removeStorageSync('selected_community')
      console.log('已清除社区缓存')
    } catch (error) {
      console.error('清除社区缓存失败:', error)
    }

    console.log('已退出登录')
  },

  /**
    * 设置用户社区（同步到服务端）
    */
  setCommunity: async (communityId: string, communityName: string) => {
    try {
      const { userInfo } = get()

      console.log('开始绑定社区:', { communityId, communityName })
      console.log('当前用户信息:', userInfo)

      if (!userInfo) {
        console.error('用户未登录，无法设置社区')
        return
      }

      if (!userInfo._id) {
        console.error('用户ID不存在，无法绑定社区')
        console.error('用户信息详情:', userInfo)
        return
      }

        // 使用通用接口更新用户的社区信息
        await request({
          url: '/api/batch',
          method: 'POST',
          data: {
            entity: 'wquser', // 用户实体
            action: 'update', // 更新操作
            id: userInfo._id, // 用户ID
            data: {
              communityId: communityId ,// 更新社区ID字段
              communityName: communityName
            }
          }
        })

      // 更新本地用户信息
      const updatedUserInfo: UserInfo = {
        ...userInfo,
        communityId,
        communityName
      }

      set({ userInfo: updatedUserInfo })
      saveUserInfo(updatedUserInfo)

      console.log('社区绑定成功:', communityName)
    } catch (error) {
      console.error('绑定社区失败:', error)
      throw error
    }
  },

  /**
   * 清除社区信息（本地缓存）
   */
  clearCommunity: () => {
    try {
      Taro.removeStorageSync('selected_community')
      console.log('已清除社区缓存')
    } catch (error) {
      console.error('清除社区缓存失败:', error)
    }
  },

  /**
   * 获取当前用户信息（使用通用接口查询用户实体）
   * @param forceRefresh 是否强制刷新（默认false，增加防重复请求）
   * @returns Promise<UserInfo | null>
   */
  getCurrentUser: async (forceRefresh = false): Promise<UserInfo | null> => {
    try {
      // 防重复请求：如果正在刷新且不强制刷新，等待完成
      const { isRefreshing } = get()
      if (isRefreshing && !forceRefresh) {
        console.log('正在刷新用户信息，等待完成...')
        // 等待最多5秒
        let attempts = 0
        while (get().isRefreshing && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }
        return get().userInfo
      }

      // 优先从 store 获取，如果没有则从 localStorage 加载
      let currentUserInfo = get().userInfo || loadUserInfo()

      if (!currentUserInfo?._id && !currentUserInfo?.userId) {
        console.error('用户ID不存在，无法查询用户信息')
        console.error('用户信息详情:', currentUserInfo)
        return null
      }

      const userId = currentUserInfo._id || currentUserInfo.userId

      console.log('使用通用接口查询用户信息，用户ID:', userId)

      // 设置刷新状态
      set({ isRefreshing: true })

      // 使用通用接口查询用户实体
      const response = await query<UserInfo>('wquser', {
        conditions: {
          _id: userId
        }
      })

      if (response && response.data) {
        // 通用接口返回的是数组，取第一个元素
        const userList = response.data as any
        const userInfoFromServer = Array.isArray(userList) ? userList[0] : userList

        if (!userInfoFromServer) {
          console.error('未查询到用户信息')
          set({ isRefreshing: false })
          return null
        }

        const userInfo: UserInfo = {
          ...userInfoFromServer,
          _id: userInfoFromServer._id || userInfoFromServer.id || userId,
          id: userInfoFromServer.id || userInfoFromServer._id || userId,
          userId: userInfoFromServer.userId || userInfoFromServer._id || userId,
          // 保留已有的社区信息（如果后端没有返回）
          communityId: userInfoFromServer.communityId || currentUserInfo?.communityId,
          communityName: userInfoFromServer.communityName || currentUserInfo?.communityName
        }

        console.log('获取到用户信息:', userInfo)

        // 更新store状态、最后获取时间、重置刷新状态
        set({
          userInfo,
          lastFetchTime: Date.now(),
          isRefreshing: false
        })
        saveUserInfo(userInfo)

        return userInfo
      }

      set({ isRefreshing: false })
      return null
    } catch (error) {
      console.error('获取用户信息失败:', error)
      set({ isRefreshing: false })
      return null
    }
  },

  /**
   * 更新用户信息
   * @param data 要更新的用户数据
   * @returns Promise<boolean> 是否更新成功
   */
  updateUserInfo: async (data: Partial<UserInfo>): Promise<boolean> => {
    try {
      const { userInfo } = get()

      if (!userInfo || !userInfo._id) {
        console.error('用户未登录或用户ID不存在')
        return false
      }

      // 调用更新接口
      await request({
        url: '/api/batch',
        method: 'POST',
        data: {
          entity: 'wquser',
          action: 'update',
          id: userInfo._id,
          data
        }
      })

      // 更新本地用户信息
      const updatedUserInfo: UserInfo = {
        ...userInfo,
        ...data
      }

      set({ userInfo: updatedUserInfo })
      saveUserInfo(updatedUserInfo)

      console.log('用户信息更新成功:', updatedUserInfo)
      return true
    } catch (error) {
      console.error('更新用户信息失败:', error)
      return false
    }
  }
}))
