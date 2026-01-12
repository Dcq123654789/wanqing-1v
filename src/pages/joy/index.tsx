import { View, Text, Image, ScrollView } from '@tarojs/components'
import './index.scss'

function Joy() {
  return (
    <View className="joy-page">
      <ScrollView scrollY className="joy-scroll">
        {/* 头部背景 */}
        <View className="joy-header">
          <Image
            src={require('../../../assets/images/backgrounds/joy-bg.jpg')}
            className="header-bg"
            mode="aspectFill"
          />
          <View className="header-overlay">
            <Text className="page-title">乐享生活</Text>
            <Text className="page-subtitle">发现更多精彩活动</Text>
          </View>
        </View>

        {/* 内容区域 */}
        <View className="content-container">
          {/* 活动分类 */}
          <View className="category-section">
            <View className="category-item active">
              <Text className="category-text">全部</Text>
            </View>
            <View className="category-item">
              <Text className="category-text">文艺</Text>
            </View>
            <View className="category-item">
              <Text className="category-text">运动</Text>
            </View>
            <View className="category-item">
              <Text className="category-text">学习</Text>
            </View>
          </View>

          {/* 活动列表 */}
          <View className="activity-list">
            <View className="activity-card">
              <Image
                src={require('../../../assets/images/illustrations/activity-illustration.png')}
                className="activity-image"
                mode="aspectFill"
              />
              <View className="activity-info">
                <Text className="activity-title">太极拳晨练活动</Text>
                <Text className="activity-desc">专业教练指导，强身健体</Text>
                <View className="activity-meta">
                  <Text className="meta-item">📅 每日 7:00</Text>
                  <Text className="meta-item">📍 公园广场</Text>
                </View>
              </View>
            </View>

            <View className="activity-card">
              <Image
                src={require('../../../assets/images/illustrations/community-illustration.png')}
                className="activity-image"
                mode="aspectFill"
              />
              <View className="activity-info">
                <Text className="activity-title">书法艺术交流</Text>
                <Text className="activity-desc">笔墨纸砚，传承文化</Text>
                <View className="activity-meta">
                  <Text className="meta-item">📅 每周三 14:00</Text>
                  <Text className="meta-item">📍 文化中心</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Joy
