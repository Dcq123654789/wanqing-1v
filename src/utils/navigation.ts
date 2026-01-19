import Taro from '@tarojs/taro'

/**
 * 页面跳转配置
 */
export interface NavigationOptions {
  /** 跳转延迟（毫秒），默认 50ms */
  delay?: number
  /** 跳转类型 */
  navigateType?: 'navigateTo' | 'redirectTo' | 'switchTab' | 'reLaunch'
}

/**
 * 带过渡动画的页面跳转方法
 * @param url 目标页面路径
 * @param options 跳转配置
 */
export const navigateWithTransition = (
  url: string,
  options: NavigationOptions = {}
) => {
  const {
    delay = 50,
    navigateType = 'navigateTo'
  } = options

  // 触发显示遮罩事件
  Taro.eventCenter.trigger('showPageTransition')

  // 延迟跳转，让遮罩先显示
  setTimeout(() => {
    switch (navigateType) {
      case 'navigateTo':
        Taro.navigateTo({ url })
        break
      case 'redirectTo':
        Taro.redirectTo({ url })
        break
      case 'switchTab':
        Taro.switchTab({ url })
        break
      case 'reLaunch':
        Taro.reLaunch({ url })
        break
    }

    // 注意：这里不再自动隐藏遮罩，而是让目标页面在加载完成后手动触发隐藏
  }, delay)
}

/**
 * 便捷方法：导航到普通页面
 */
export const navigateTo = (url: string, options?: Omit<NavigationOptions, 'navigateType'>) => {
  return navigateWithTransition(url, { ...options, navigateType: 'navigateTo' })
}

/**
 * 便捷方法：重定向到页面
 */
export const redirectTo = (url: string, options?: Omit<NavigationOptions, 'navigateType'>) => {
  return navigateWithTransition(url, { ...options, navigateType: 'redirectTo' })
}

/**
 * 便捷方法：切换到 Tab 页面
 */
export const switchTab = (url: string, options?: Omit<NavigationOptions, 'navigateType'>) => {
  return navigateWithTransition(url, { ...options, navigateType: 'switchTab' })
}

/**
 * 便捷方法：重启应用
 */
export const reLaunch = (url: string, options?: Omit<NavigationOptions, 'navigateType'>) => {
  return navigateWithTransition(url, { ...options, navigateType: 'reLaunch' })
}
