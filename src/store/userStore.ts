import { create } from 'zustand'

interface Address {
  province: string
  city: string
  district: string
  detail: string
}

interface UserInfo {
  id: string
  username: string
  avatar?: string
  phone?: string
  name?: string
  address?: Address
  balance?: number
}

interface UserState {
  isLoggedIn: boolean
  token: string
  userInfo: UserInfo | null
  setToken: (token: string) => void
  setUserInfo: (info: UserInfo) => void
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
  isLoggedIn: false,
  token: '',
  userInfo: null,

  setToken: (token) => set({ token }),

  setUserInfo: (info) => set({ userInfo: info, isLoggedIn: true }),

  login: async (username, password) => {
    // 模拟登录请求
    return new Promise((resolve) => {
      setTimeout(() => {
        // 简单的模拟验证
        if (username && password) {
          const userInfo: UserInfo = {
            id: '1',
            username: username,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
          }
          set({
            userInfo,
            isLoggedIn: true,
            token: 'mock_token_' + Date.now()
          })
          resolve(true)
        } else {
          resolve(false)
        }
      }, 500)
    })
  },

  logout: () => {
    set({
      isLoggedIn: false,
      token: '',
      userInfo: null
    })
  }
}))
