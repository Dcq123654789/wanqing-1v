import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Notification } from '../../types'
import './index.scss'

interface NotificationBarProps {
  data: Notification[]
  autoplay?: boolean
  interval?: number
}

function NotificationBar({ data, autoplay = true, interval = 3000 }: NotificationBarProps) {
  // 使用 useState 管理当前通知索引
  const [currentIndex, setCurrentIndex] = useState(0)

  // 自动滚动
  useEffect(() => {
    if (!autoplay || data.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoplay, interval, data.length])

  const handleScroll = (e: any) => {
    const scrollTop = e.detail.scrollTop
    const itemHeight = 56 // rpx 转 px 大约值
    const index = Math.round(scrollTop / itemHeight)
    if (index !== currentIndex) {
      setCurrentIndex(index % data.length)
    }
  }

  if (data.length === 0) return null

  return (
    <View className="notification-bar">
      <View className="notification-icon">📢</View>
      <View className="notification-content">
        <ScrollView
          scrollY
          className="notification-scroll"
          scrollIntoView={`item-${currentIndex}`}
          scrollWithAnimation
          onScroll={handleScroll}
        >
          {data.map((item, index) => (
            <View
              key={item.id}
              id={`item-${index}`}
              className="notification-item"
            >
              <Text className={`notification-text notification-text--${item.type}`}>
                {item.content}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

export default NotificationBar
