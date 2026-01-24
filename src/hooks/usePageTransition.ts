import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'

/**
 * 页面过渡动画 Hook
 * 用于监听页面跳转事件，自动显示/隐藏过渡遮罩
 */
export const usePageTransition = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    console.log('usePageTransition hook 初始化')

    // 延迟注册事件监听器，避免页面初始化时的干扰
    const timer = setTimeout(() => {
      console.log('注册事件监听器')

    // 监听显示遮罩事件
    const handleShow = () => {
      console.log('✅ 收到显示遮罩事件，设置遮罩为显示状态', new Date().toISOString())
      setIsVisible(true)
    }

    // 监听隐藏遮罩事件
    const handleHide = () => {
      console.log('✅ 收到隐藏遮罩事件，设置遮罩为隐藏状态', new Date().toISOString())
      setIsVisible(false)
    }

      Taro.eventCenter.on('showPageTransition', handleShow)
      Taro.eventCenter.on('hidePageTransition', handleHide)

      // 存储清理函数的引用
      const cleanup = () => {
        console.log('移除事件监听器')
        Taro.eventCenter.off('showPageTransition', handleShow)
        Taro.eventCenter.off('hidePageTransition', handleHide)
      }

      // 将清理函数存储在 window 上，以便后续清理
      ;(window as any).__pageTransitionCleanup = cleanup
    }, 500) // 延迟 500ms 注册，避免初始化干扰

    return () => {
      clearTimeout(timer)
      // 执行清理函数
      if ((window as any).__pageTransitionCleanup) {
        ;(window as any).__pageTransitionCleanup()
      }
    }
  }, [])

  // 添加调试信息
  useEffect(() => {
    console.log('PageTransition 状态变化:', isVisible)
  }, [isVisible])

  return { isVisible }
}
