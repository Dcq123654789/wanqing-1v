import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useUserStore } from '@/store/userStore'
import { useState, useEffect } from 'react'
import StatusBar from '../StatusBar'
import './index.scss'

interface HeaderSectionProps {
  communityName?: string
  onCommunityChange?: () => void
}

function HeaderSection({
  communityName = '晚晴社区',
  onCommunityChange
}: HeaderSectionProps) {
  const { userInfo } = useUserStore()
  const username = userInfo?.username || '访客'
  const [greeting, setGreeting] = useState('早上好')

  useEffect(() => {
    // 获取当前时间段的问候语
    const hour = new Date().getHours()
    if (hour < 6) {
      setGreeting('凌晨好')
    } else if (hour < 9) {
      setGreeting('早上好')
    } else if (hour < 12) {
      setGreeting('上午好')
    } else if (hour < 14) {
      setGreeting('中午好')
    } else if (hour < 17) {
      setGreeting('下午好')
    } else if (hour < 19) {
      setGreeting('傍晚好')
    } else {
      setGreeting('晚上好')
    }
  }, [])

  return (
    <View className="header-section">
      {/* 背景图片 */}
      <Image
        src={require('@/assets/images/backgrounds/home-bg.jpg')}
        className="header-bg"
        mode="aspectFill"
      />

      {/* 橙色透明覆盖层 */}
      <View className="header-overlay">
        {/* 状态栏占位 */}
        <StatusBar />

        {/* 导航栏和欢迎区 */}
        <View className="header-content">
          {/* 顶部导航栏 */}
          <View className="top-nav-bar">
            {/* 社区选择 */}
            <View className="nav-community" onClick={onCommunityChange}>
              <Text className="community-name">{communityName}</Text>
              <Text className="arrow-icon">▼</Text>
            </View>
          </View>

          {/* 欢迎语 */}
          <View className="welcome-text">
            <Text>{greeting}，{username} 👋</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default HeaderSection
