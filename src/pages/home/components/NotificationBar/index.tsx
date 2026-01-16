import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Notification } from '../../types'
import './index.scss'

interface NotificationBarProps {
  data: Notification[]
  autoplay?: boolean
  interval?: number
  onClick?: () => void
}

function NotificationBar({ data, autoplay = true, interval = 4000, onClick }: NotificationBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // 自动轮播
  useEffect(() => {
    if (!autoplay || data.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoplay, interval, data.length])

  if (data.length === 0) return null

  const currentNotification = data[currentIndex]

  return (
    <View className="notification-bar" onClick={onClick}>
      <View className="notification-icon">🔔</View>
      <View className="notification-divider"></View>
      <View className="notification-content">
        <Text className={`notification-text notification-text--${currentNotification.type}`}>
          {currentNotification.content}
        </Text>
      </View>
    </View>
  )
}

export default NotificationBar
