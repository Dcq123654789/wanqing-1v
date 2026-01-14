import { View, Text } from '@tarojs/components'
import { useUserStore } from '@/store/userStore'
import './index.scss'

interface WelcomeSectionProps {
  subtitle?: string
}

function WelcomeSection({ subtitle = '欢迎使用晚晴' }: WelcomeSectionProps) {
  const { userInfo } = useUserStore()
  const username = userInfo?.username || '访客'

  return (
    <View className="welcome-section">
      <Text className="welcome-text">您好，{username} 👋</Text>
      <Text className="welcome-subtitle">{subtitle}</Text>
    </View>
  )
}

export default WelcomeSection
