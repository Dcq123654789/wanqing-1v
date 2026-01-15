import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import {
  mockTravelRoutes,
  mockActivities,
  mockSocialEvents,
  mockOnlineEvents
} from './mockData'
import type { TravelRoute, Activity, SocialEvent, OnlineEvent } from './mockData'
import './index.scss'

function Joy() {
  const [statusBarHeight, setStatusBarHeight] = useState(0)

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync()
    setStatusBarHeight(systemInfo.statusBarHeight || 0)
  }, [])

  // 处理旅游线路点击
  const handleTravelClick = (route: TravelRoute) => {
    Taro.showToast({
      title: `查看详情：${route.name}`,
      icon: 'none',
      duration: 2000
    })
    // TODO: 跳转到详情页
    // Taro.navigateTo({
    //   url: `/pages/joy/travel-detail/index?id=${route.id}`
    // })
  }

  // 处理兴趣活动点击
  const handleActivityClick = (activity: Activity) => {
    Taro.showToast({
      title: `查看详情：${activity.title}`,
      icon: 'none',
      duration: 2000
    })
    // TODO: 跳转到详情页
    // Taro.navigateTo({
    //   url: `/pages/joy/activity-detail/index?id=${activity.id}`
    // })
  }

  // 处理社交聚会点击
  const handleSocialClick = (event: SocialEvent) => {
    Taro.showToast({
      title: `查看详情：${event.title}`,
      icon: 'none',
      duration: 2000
    })
    // TODO: 跳转到详情页
    // Taro.navigateTo({
    //   url: `/pages/joy/social-detail/index?id=${event.id}`
    // })
  }

  // 处理线上活动点击
  const handleOnlineClick = (event: OnlineEvent) => {
    Taro.showToast({
      title: `查看详情：${event.title}`,
      icon: 'none',
      duration: 2000
    })
    // TODO: 跳转到详情页
    // Taro.navigateTo({
    //   url: `/pages/joy/online-detail/index?id=${event.id}`
    // })
  }

  return (
    <View className="joy-page">
      {/* 状态栏占位 */}
      <View className="status-bar" style={{ height: `${statusBarHeight}px` }} />

      <ScrollView scrollY className="joy-scroll">
        {/* 顶部头图区 */}
        <View className="joy-header">
          <Image
            src={require('../../assets/images/joy/header-bg.jpg')}
            className="header-bg"
            mode="aspectFill"
          />
          <View className="header-overlay">
            <Text className="page-title">乐享生活</Text>
            <Text className="page-subtitle">发现更多精彩活动</Text>
          </View>
        </View>

        {/* 精选旅游区 */}
        <View className="content-section">
          <View className="section-header">
            <Text className="section-title">精选旅游</Text>
            <Text className="section-icon">✈️</Text>
          </View>
          <View className="card-list">
            {mockTravelRoutes.map((route) => (
              <View
                key={route.id}
                className="travel-card"
                onClick={() => handleTravelClick(route)}
              >
                <Image
                  src={route.image}
                  className="card-image"
                  mode="aspectFill"
                />
                <View className="card-content">
                  <View className="card-header">
                    <Text className="card-title">{route.name}</Text>
                    <Text className="card-price">¥{route.price}起</Text>
                  </View>
                  <Text className="card-desc">{route.description}</Text>
                  <View className="card-meta">
                    <Text className="meta-text">⏱ {route.duration}</Text>
                    <View className="tag-list">
                      {route.tags.map((tag, index) => (
                        <Text key={index} className="tag">{tag}</Text>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 兴趣活动区 */}
        <View className="content-section">
          <View className="section-header">
            <Text className="section-title">兴趣活动</Text>
            <Text className="section-icon">🎨</Text>
          </View>
          <View className="card-list">
            {mockActivities.map((activity) => (
              <View
                key={activity.id}
                className="activity-card"
                onClick={() => handleActivityClick(activity)}
              >
                <Image
                  src={activity.image}
                  className="card-image"
                  mode="aspectFill"
                />
                <View className="card-content">
                  <Text className="card-title">{activity.title}</Text>
                  <Text className="card-desc">{activity.description}</Text>
                  <View className="card-meta">
                    <Text className="meta-text">📅 {activity.time}</Text>
                    <Text className="meta-text">📍 {activity.location}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 社交聚会区 */}
        <View className="content-section">
          <View className="section-header">
            <Text className="section-title">社交聚会</Text>
            <Text className="section-icon">👥</Text>
          </View>
          <View className="card-list">
            {mockSocialEvents.map((event) => (
              <View
                key={event.id}
                className="social-card"
                onClick={() => handleSocialClick(event)}
              >
                <Image
                  src={event.image}
                  className="card-image"
                  mode="aspectFill"
                />
                <View className="card-content">
                  <Text className="card-title">{event.title}</Text>
                  <Text className="card-desc">{event.description}</Text>
                  <View className="card-meta">
                    <Text className="meta-text">📅 {event.time}</Text>
                    <Text className="meta-text">📍 {event.location}</Text>
                    <Text className="meta-text">👥 限{event.maxParticipants}人</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 线上活动区 */}
        <View className="content-section">
          <View className="section-header">
            <Text className="section-title">线上活动</Text>
            <Text className="section-icon">💻</Text>
          </View>
          <View className="card-list">
            {mockOnlineEvents.map((event) => (
              <View
                key={event.id}
                className="online-card"
                onClick={() => handleOnlineClick(event)}
              >
                <Image
                  src={event.image}
                  className="card-image"
                  mode="aspectFill"
                />
                <View className="card-content">
                  <Text className="card-title">{event.title}</Text>
                  <Text className="card-desc">{event.description}</Text>
                  <View className="card-meta">
                    <Text className="meta-text">📅 {event.time}</Text>
                    <Text className="meta-text">💻 {event.platform}</Text>
                    <Text className="meta-text">🔗 {event.joinMethod}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Joy
