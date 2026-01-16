import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface TopNavBarProps {
  communityName?: string
  unreadCount?: number
  onCommunityChange?: () => void
  onScan?: () => void
  onNotification?: () => void
}

function TopNavBar({
  communityName = '晚晴社区',
  unreadCount = 0,
  onCommunityChange,
  onScan,
  onNotification
}: TopNavBarProps) {

  const handleScan = () => {
    onScan?.()
    Taro.scanCode({
      success: (res) => {
        console.log('扫码结果:', res)
        Taro.showToast({
          title: '扫码成功',
          icon: 'success'
        })
      },
      fail: () => {
        Taro.showToast({
          title: '扫码失败',
          icon: 'none'
        })
      }
    })
  }

  const handleNotification = () => {
    onNotification?.()
    Taro.showToast({
      title: '消息中心',
      icon: 'none'
    })
  }

  return (
    <View className="top-nav-bar">
      {/* 社区选择 */}
      <View className="nav-community" onClick={onCommunityChange}>
        <Text className="community-name">{communityName}</Text>
        <Text className="arrow-icon">▼</Text>
      </View>

      {/* 右侧按钮组 */}
      <View className="nav-actions">
        {/* 扫一扫 */}
        <View className="nav-btn" onClick={handleScan}>
          <Text className="scan-icon">📷</Text>
        </View>

        {/* 消息 */}
        <View className="nav-btn" onClick={handleNotification}>
          <Text className="notification-icon">🔔</Text>
          {unreadCount > 0 && (
            <View className="unread-dot"></View>
          )}
        </View>
      </View>
    </View>
  )
}

export default TopNavBar
