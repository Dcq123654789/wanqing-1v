import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'

/**
 * 页面过渡动画 Hook
 * 用于监听页面跳转事件，自动显示/隐藏过渡遮罩
 */
export const usePageTransition = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 监听显示遮罩事件
    const handleShow = () => {
      console.log('显示页面过渡遮罩')
      setIsVisible(true)
    }

    // 监听隐藏遮罩事件
    const handleHide = () => {
      console.log('隐藏页面过渡遮罩')
      setIsVisible(false)
    }

    Taro.eventCenter.on('showPageTransition', handleShow)
    Taro.eventCenter.on('hidePageTransition', handleHide)

    return () => {
      Taro.eventCenter.off('showPageTransition', handleShow)
      Taro.eventCenter.off('hidePageTransition', handleHide)
    }
  }, [])

  return { isVisible }
}
