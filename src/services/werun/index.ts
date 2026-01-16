import Taro from '@tarojs/taro'

/**
 * 微信运动数据类型
 */
export interface WerunStepInfo {
  timestamp: number
  step: number
}

export interface WerunData {
  stepInfoList: WerunStepInfo[]
}

export interface WerunResponse {
  encryptedData: string
  iv: string
}

/**
 * 微信运动服务
 */
class WerunService {
  /**
   * 检查微信运动授权状态
   */
  async checkAuth(): Promise<boolean> {
    try {
      const setting = await Taro.getSetting()
      return !!setting.authSetting['scope.werun']
    } catch (e) {
      console.error('检查授权失败：', e)
      return false
    }
  }

  /**
   * 请求微信运动授权
   */
  async authorize(): Promise<boolean> {
    try {
      // 先尝试直接获取数据，会自动弹出授权
      await this.getWerunData()
      return true
    } catch (e) {
      // 如果失败，引导用户打开设置
      const res = await Taro.showModal({
        title: '需要微信运动权限',
        content: '需要您授权微信运动才能获取步数数据，用于健康管理',
        confirmText: '去设置',
        cancelText: '取消'
      })
      if (res.confirm) {
        Taro.openSetting()
        return false
      }
      return false
    }
  }

  /**
   * 获取加密的微信运动数据
   */
  async getWerunData(): Promise<WerunResponse> {
    try {
      const res = await Taro.getWeRunData()
      return {
        encryptedData: res.encryptedData,
        iv: res.iv
      }
    } catch (e) {
      console.error('获取微信运动数据失败：', e)
      throw new Error('获取微信运动数据失败')
    }
  }

  /**
   * 解密微信运动数据（需要后端支持）
   * @param encryptedData 加密数据
   * @param iv 加密向量
   * @param sessionKey 用户 session_key（从登录接口获取）
   */
  async decryptWerunData(
    encryptedData: string,
    iv: string,
    sessionKey: string
  ): Promise<WerunData> {
    try {
      // 调用后端接口解密
      const res = await Taro.request({
        url: '你的后端API/api/werun/decrypt',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${Taro.getStorageSync('token') || ''}`
        },
        data: {
          encryptedData,
          iv,
          sessionKey
        }
      })

      if (res.statusCode === 200 && res.data) {
        return res.data as WerunData
      }
      throw new Error('解密失败')
    } catch (e) {
      console.error('解密微信运动数据失败：', e)
      throw new Error('解密微信运动数据失败')
    }
  }

  /**
   * 获取今日步数
   * @param sessionKey 用户 session_key
   */
  async getTodaySteps(sessionKey?: string): Promise<number> {
    try {
      // 检查授权
      const isAuth = await this.checkAuth()
      if (!isAuth) {
        await this.authorize()
        // 用户可能在设置页面，返回模拟数据
        return 0
      }

      // 获取加密数据
      const { encryptedData, iv } = await this.getWerunData()

      // 如果没有 sessionKey 或后端接口，返回模拟数据
      if (!sessionKey) {
        console.warn('缺少 sessionKey，返回模拟步数')
        return this.getMockSteps()
      }

      // 解密数据
      const werunData = await this.decryptWerunData(encryptedData, iv, sessionKey)

      // 获取最新一天的步数（今日步数）
      if (werunData.stepInfoList && werunData.stepInfoList.length > 0) {
        const todayData = werunData.stepInfoList[werunData.stepInfoList.length - 1]
        return todayData.step
      }

      return 0
    } catch (e) {
      console.error('获取今日步数失败：', e)
      // 返回模拟数据
      return this.getMockSteps()
    }
  }

  /**
   * 获取模拟步数（用于测试）
   */
  getMockSteps(): number {
    // 生成 3000-15000 之间的随机步数
    return Math.floor(Math.random() * 12000) + 3000
  }

  /**
   * 获取最近 N 天的步数
   * @param days 天数
   * @param sessionKey 用户 session_key
   */
  async getRecentSteps(days: number = 7, sessionKey?: string): Promise<WerunStepInfo[]> {
    try {
      const isAuth = await this.checkAuth()
      if (!isAuth) {
        await this.authorize()
        return []
      }

      const { encryptedData, iv } = await this.getWerunData()

      if (!sessionKey) {
        return this.getMockRecentSteps(days)
      }

      const werunData = await this.decryptWerunData(encryptedData, iv, sessionKey)
      const stepList = werunData.stepInfoList || []

      // 返回最近 N 天的数据
      return stepList.slice(-days)
    } catch (e) {
      console.error('获取最近步数失败：', e)
      return this.getMockRecentSteps(days)
    }
  }

  /**
   * 获取模拟最近步数（用于测试）
   */
  getMockRecentSteps(days: number = 7): WerunStepInfo[] {
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    const result: WerunStepInfo[] = []

    for (let i = days - 1; i >= 0; i--) {
      result.push({
        timestamp: now - i * dayMs,
        step: Math.floor(Math.random() * 12000) + 3000
      })
    }

    return result
  }
}

export default new WerunService()
