/**
 * 用户状态管理
 * 基于 API 开发文档实现双Token认证
 */
import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { setTokens, clearTokens, getAccessToken, getRefreshToken, request } from '@/utils/request'
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
  gender?: number
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
  setToken: (token: string) => void
  setUserInfo: (info: UserInfo) => void
  login: (params: LoginParams) => Promise<boolean>
  logout: () => void
  initializeAuth: () => void
  getCurrentUser: () => Promise<UserInfo | null>
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
  userId: string
  nickname: string
  avatar: string
  isNewUser: boolean
  communityId?: string  // 用户绑定的社区ID
  communityName?: string  // 用户绑定的社区名称
}

export const useUserStore = create<UserState>((set, get) => ({
  isLoggedIn: false,
  token: '',
  userInfo: null,

  /**
    * 初始化认证状态
    * 从本地存储恢复登录信息
    */
  initializeAuth: () => {
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
      console.log('已恢复登录状态')
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
        const { accessToken, refreshToken, userId, nickname, avatar, isNewUser, communityId, communityName } = response.data

        if (!accessToken || !refreshToken) {
          console.error('登录响应数据不完整')
          return false
        }

        // 构建用户信息（包含社区信息）
        const userInfo: UserInfo = {
          _id: userId,  // 主键ID，用于更新操作
          id: userId,   // 兼容性字段
          userId,
          nickname,
          avatar,
          isNewUser,
          communityId,
          communityName
        }

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

        console.log('登录成功:', nickname)
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
            communityId: communityId // 更新社区ID字段
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
   * 获取当前用户信息
   * @returns Promise<UserInfo | null>
   */
  getCurrentUser: async (): Promise<UserInfo | null> => {
    try {
      const response = await request<UserInfo>({
        url: API_ROUTES.AUTH.USER_INFO,
        method: 'GET'
      })

      if (response && response.data) {
        const userInfoFromServer = response.data

        // 确保_id字段存在，如果后端没有返回，则使用已有的userId
        const currentUserInfo = get().userInfo
        const userInfo: UserInfo = {
          ...userInfoFromServer,
          _id: userInfoFromServer._id || userInfoFromServer.id || currentUserInfo?._id || '',
          id: userInfoFromServer.id || userInfoFromServer._id || currentUserInfo?.id || '',
          // 保留已有的社区信息
          communityId: userInfoFromServer.communityId || currentUserInfo?.communityId,
          communityName: userInfoFromServer.communityName || currentUserInfo?.communityName
        }

        console.log('获取到用户信息:', userInfo)

        // 更新store状态
        set({ userInfo })
        saveUserInfo(userInfo)

        return userInfo
      }

      return null
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }
}))
