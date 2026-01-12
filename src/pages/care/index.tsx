import { View, Text, Image, ScrollView } from '@tarojs/components'
import './index.scss'

function Care() {
  return (
    <View className="care-page">
      <ScrollView scrollY className="care-scroll">
        {/* 头部背景 */}
        <View className="care-header">
          <Image
            src={require('../../../assets/images/backgrounds/care-bg.jpg')}
            className="header-bg"
            mode="aspectFill"
          />
          <View className="header-overlay">
            <Text className="page-title">颐养身心</Text>
            <Text className="page-subtitle">健康生活，快乐每一天</Text>
          </View>
        </View>

        {/* 内容区域 */}
        <View className="content-container">
          {/* 健康数据卡片 */}
          <View className="health-card">
            <View className="health-header">
              <Text className="health-title">今日健康</Text>
              <Text className="health-date">2026年1月12日</Text>
            </View>
            <View className="health-stats">
              <View className="stat-item">
                <Text className="stat-value">7,542</Text>
                <Text className="stat-label">步数</Text>
              </View>
              <View className="stat-divider" />
              <View className="stat-item">
                <Text className="stat-value">6.5h</Text>
                <Text className="stat-label">睡眠</Text>
              </View>
              <View className="stat-divider" />
              <View className="stat-item">
                <Text className="stat-value">120/80</Text>
                <Text className="stat-label">血压</Text>
              </View>
            </View>
          </View>

          {/* 服务卡片 */}
          <View className="service-section">
            <Text className="section-title">健康服务</Text>
            <View className="service-list">
              <View className="service-item">
                <View className="service-icon">🩺</View>
                <View className="service-content">
                  <Text className="service-title">在线问诊</Text>
                  <Text className="service-desc">专业医生在线咨询</Text>
                </View>
              </View>
              <View className="service-item">
                <View className="service-icon">💊</View>
                <View className="service-content">
                  <Text className="service-title">用药提醒</Text>
                  <Text className="service-desc">定时提醒，关爱健康</Text>
                </View>
              </View>
              <View className="service-item">
                <View className="service-icon">🧘</View>
                <View className="service-content">
                  <Text className="service-title">养生指导</Text>
                  <Text className="service-desc">中医养生，调理身心</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 推荐插图 */}
          <View className="illustration-card">
            <Image
              src={require('../../../assets/images/illustrations/nature-illustration.png')}
              className="illustration-image"
              mode="aspectFill"
            />
            <View className="illustration-overlay">
              <Text className="illustration-title">亲近自然，放松心情</Text>
              <Text className="illustration-desc">户外活动有益身心健康</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Care
