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
            src={require('../../assets/images/backgrounds/home-bg.jpg')}
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
              <View className="feature-item feature-icon-1">
                <View className="feature-icon">🏥</View>
                <Text className="feature-text">健康管理</Text>
              </View>
              <View className="feature-item feature-icon-2">
                <View className="feature-icon">📅</View>
                <Text className="feature-text">活动预约</Text>
              </View>
              <View className="feature-item feature-icon-3">
                <View className="feature-icon">🍲</View>
                <Text className="feature-text">餐饮服务</Text>
              </View>
              <View className="feature-item feature-icon-4">
                <View className="feature-icon">🚗</View>
                <Text className="feature-text">出行服务</Text>
              </View>
            </View>
          </View>

          {/* 推荐卡片 */}
          <View className="recommend-section">
            <Text className="section-title-outside">为您推荐</Text>
            <ScrollView scrollX className="recommend-scroll">
              <View className="recommend-list">
                <View className="recommend-card">
                  <Image
                    src={require('../../assets/images/illustrations/welcome-illustration.png')}
                    className="recommend-image"
                    mode="aspectFill"
                  />
                  <View className="recommend-content">
                    <Text className="recommend-title">健康养生讲座</Text>
                    <Text className="recommend-desc">专家在线分享健康知识</Text>
                    <View className="recommend-footer">
                      <Text className="recommend-time">今天 14:00</Text>
                      <Text className="recommend-tag">免费</Text>
                    </View>
                  </View>
                </View>
                <View className="recommend-card">
                  <Image
                    src={require('../../assets/images/illustrations/activity-illustration.png')}
                    className="recommend-image"
                    mode="aspectFill"
                  />
                  <View className="recommend-content">
                    <Text className="recommend-title">文艺汇演</Text>
                    <Text className="recommend-desc">精彩表演等你来</Text>
                    <View className="recommend-footer">
                      <Text className="recommend-time">明天 10:00</Text>
                      <Text className="recommend-tag">热门</Text>
                    </View>
                  </View>
                </View>
                <View className="recommend-card">
                  <Image
                    src={require('../../assets/images/illustrations/nature-illustration.png')}
                    className="recommend-image"
                    mode="aspectFill"
                  />
                  <View className="recommend-content">
                    <Text className="recommend-title">户外采摘</Text>
                    <Text className="recommend-desc">亲近自然，快乐采摘</Text>
                    <View className="recommend-footer">
                      <Text className="recommend-time">周六 09:00</Text>
                      <Text className="recommend-tag">活动</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View className="recommend-dots">
              <View className="dot active"></View>
              <View className="dot"></View>
              <View className="dot"></View>
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
