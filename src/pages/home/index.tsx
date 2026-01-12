import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useUserStore } from '@/store/userStore'
import './index.scss'

function Home() {
  const { userInfo, logout } = useUserStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <View className="home-page">
      <ScrollView scrollY className="home-scroll">
        {/* 头部背景 */}
        <View className="home-header">
          <Image
            src={require('../../../assets/images/backgrounds/home-bg.jpg')}
            className="header-bg"
            mode="aspectFill"
          />
          <View className="header-overlay">
            <Text className="greeting">您好，{userInfo?.username || '访客'} 👋</Text>
            <Text className="date-text">欢迎使用晚晴</Text>
          </View>
        </View>

        {/* 主要内容卡片 */}
        <View className="content-container">
          {/* 功能卡片 */}
          <View className="card-section">
            <Text className="section-title">快捷服务</Text>
            <View className="feature-grid">
              <View className="feature-item">
                <View className="feature-icon feature-icon-1">🏥</View>
                <Text className="feature-text">健康管理</Text>
              </View>
              <View className="feature-item">
                <View className="feature-icon feature-icon-2">📅</View>
                <Text className="feature-text">活动预约</Text>
              </View>
              <View className="feature-item">
                <View className="feature-icon feature-icon-3">🍲</View>
                <Text className="feature-text">餐饮服务</Text>
              </View>
              <View className="feature-item">
                <View className="feature-icon feature-icon-4">🚗</View>
                <Text className="feature-text">出行服务</Text>
              </View>
            </View>
          </View>

          {/* 推荐卡片 */}
          <View className="card-section">
            <Text className="section-title">为您推荐</Text>
            <View className="recommend-card">
              <Image
                src={require('../../../assets/images/illustrations/welcome-illustration.png')}
                className="recommend-image"
                mode="aspectFill"
              />
              <View className="recommend-content">
                <Text className="recommend-title">健康养生讲座</Text>
                <Text className="recommend-desc">专家在线分享健康知识，提升生活质量</Text>
                <View className="recommend-footer">
                  <Text className="recommend-time">今天 14:00</Text>
                  <Text className="recommend-tag">免费</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 登出按钮 */}
          <View className="logout-section">
            <Text className="logout-button" onClick={handleLogout}>退出登录</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Home
