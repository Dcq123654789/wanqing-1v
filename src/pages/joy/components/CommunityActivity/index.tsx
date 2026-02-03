import { View, Text, Image, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState, useEffect, useCallback } from 'react'
import { categoryConfig, statusConfig } from './mockData'
import type { ActivityListItem } from './types'
import './index.scss' 
import { fetchActivities } from './services/activity.service'
function CommunityActivity() {
  const [statusBarHeight, setStatusBarHeight] = useState(0)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [activityList, setActivityList] = useState<ActivityListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allActivities, setAllActivities] = useState<ActivityListItem[]>([])

  // 分类标签
  const tabs = [
    { key: 'all', name: '全部' },
    { key: 'culture', name: '文化' },
    { key: 'sports', name: '体育' },
    { key: 'entertainment', name: '娱乐' },
    { key: 'volunteer', name: '志愿' },
    { key: 'learning', name: '学习' }
  ]

  // 加载活动数据
  const loadActivities = useCallback(async (category?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const params: any = { deleted: 0 }
      if (category && category !== 'all') {
        params.category = category
      }

      const response = await fetchActivities(params)
      const activities = response.activities || []

      if (category === 'all' || !category) {
        // 保存全部活动
        setAllActivities(activities)
        setActivityList(activities)
      } else {
        // 过滤显示
        setActivityList(activities)
      }
    } catch (err: any) {
      console.error('加载活动列表失败:', err)
      setError(err?.message || '加载活动列表失败')
      Taro.showToast({
        title: err?.message || '加载失败',
        icon: 'none'
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync()
    setStatusBarHeight(systemInfo.statusBarHeight || 0)

    // 初始化加载所有活动
    loadActivities('all')
  }, [loadActivities])

  // 页面显示时隐藏遮罩（从详情页返回时）
  useDidShow(() => {
    console.log('社区活动页面显示，开始隐藏遮罩流程')
    setTimeout(() => {
      console.log('社区活动页面触发隐藏遮罩事件')
      Taro.eventCenter.trigger('hidePageTransition')
    }, 100)
  })

  // 筛选活动（使用全部数据进行前端筛选）
  const filterActivities = (category: string) => {
    if (category === 'all') {
      setActivityList(allActivities)
    } else {
      const filtered = allActivities.filter(item => item.category === category)
      setActivityList(filtered)
    }
  }

  // 切换标签
  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey)
    // 对于分类筛选，使用前端筛选（从已加载的全部数据中筛选）
    // 如果需要实时性，可以调用 loadActivities(tabKey)
    filterActivities(tabKey)
  }

  // 重新加载数据
  const handleRetry = () => {
    loadActivities(activeTab)
  }

  // 活动点击
  const handleActivityClick = (item: ActivityListItem) => {
    const params = new URLSearchParams({
      id: item.id,
      title: encodeURIComponent(item.title),
      category: item.category,
      status: item.status
    })
    const url = `/pages/joy/components/CommunityActivity/Detail/index?${params.toString()}`
    console.log('点击活动，跳转URL:', url)
    console.log('活动ID:', item.id)

    Taro.navigateTo({
      url
    })
  }

  // 返回上一页
 

  return (
    <View className="community-activity-page"> 
      {/* 状态栏占位 */}
      <ScrollView scrollY className="activity-scroll">
        {/* 分类标签栏 */}
        <View className="tabs-container">
          <ScrollView scrollX className="tabs-scroll">
            <View className="tabs-wrapper">
              {tabs.map((tab) => (
                <View
                  key={tab.key}
                  className={`tab-item ${activeTab === tab.key ? 'tab-item--active' : ''}`}
                  onClick={() => handleTabChange(tab.key)}
                >
                  <Text className="tab-text">{tab.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 加载中状态 */}
        {isLoading && (
          <View className="loading-container">
            <Text className="loading-text">加载中...</Text>
          </View>
        )}

        {/* 错误状态 */}
        {!isLoading && error && (
          <View className="error-container">
            <Text className="error-icon">⚠️</Text>
            <Text className="error-title">加载失败</Text>
            <Text className="error-message">{error}</Text>
            <View className="retry-btn" onClick={handleRetry}>
              <Text>重新加载</Text>
            </View>
          </View>
        )}

        {/* 活动列表 */}
        {!isLoading && !error && (
          <View className="activity-list">
            {activityList.length > 0 ? (
              activityList.map((item) => {
              const categoryInfo = categoryConfig[item.category as keyof typeof categoryConfig]
              const statusInfo = statusConfig[item.status]

              return (
                <View
                  key={item.id}
                  className="activity-card"
                  onClick={() => handleActivityClick(item)}
                >
                  <View className="card-header">
                    {/* 图片轮播 */}
                    {Array.isArray(item.coverImage) && item.coverImage.length > 0 ? (
                      <Swiper
                        className="card-image-swiper"
                        indicatorDots
                        indicatorColor="rgba(255, 255, 255, 0.5)"
                        indicatorActiveColor="#fff"
                        autoplay
                        interval={3000}
                        circular
                      >
                        {item.coverImage.map((img, index) => (
                          <SwiperItem key={index}>
                            <Image
                              src={img}
                              className="card-image"
                              mode="aspectFit"
                              lazyLoad
                            />
                          </SwiperItem>
                        ))}
                      </Swiper>
                    ) : (
                      <Image
                        src={typeof item.coverImage === 'string' ? item.coverImage : item.coverImage?.[0] || ''}
                        className="card-image"
                        mode="aspectFit"
                        lazyLoad
                      />
                    )}
                    <View className="card-category-badge" style={{ backgroundColor: categoryInfo.color }}>
                      <Text className="category-icon">{categoryInfo.icon}</Text>
                    </View>
                    <View
                      className="card-status-badge"
                      style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}
                    >
                      <Text className="status-text">{statusInfo.name}</Text>
                    </View>
                  </View>

                  <View className="card-content">
                    <Text className="card-title">{item.title}</Text>

                    <View className="card-info">
                      <View className="info-row">
                        <Text className="info-icon">📅</Text>
                        <Text className="info-text">{item.time}</Text>
                      </View>
                      <View className="info-row">
                        <Text className="info-icon">📍</Text>
                        <Text className="info-text">{item.location}</Text>
                      </View>
                      <View className="info-row">
                        <Text className="info-icon">👥</Text>
                        <Text className="info-text">
                          {item.currentParticipants}/{item.maxParticipants}人
                        </Text>
                        <View
                          className="progress-bar"
                          style={{
                            width: '80rpx',
                            height: '8rpx',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4rpx',
                            marginLeft: '12rpx',
                            overflow: 'hidden'
                          }}
                        >
                          <View
                            className="progress-fill"
                            style={{
                              width: `${(item.currentParticipants / item.maxParticipants) * 100}%`,
                              height: '100%',
                              backgroundColor: item.currentParticipants >= item.maxParticipants ? '#ff4d4f' : '#52c41a'
                            }}
                          />
                        </View>
                      </View>
                    </View>

                    <View className="card-footer">
                      <View className="card-tags">
                        <Text className="tag tag-category" style={{ color: categoryInfo.color }}>
                          {categoryInfo.name}
                        </Text>
                      </View>
                      <Text className="card-detail-hint">查看详情 →</Text>
                    </View>
                  </View>
                </View>
              )
            })
          ) : (
              <View className="empty-state">
                <Text className="empty-icon">📋</Text>
                <Text className="empty-text">暂无活动</Text>
              </View>
            )}
          </View>
        )}

        {/* 底部留白 */}
        <View className="bottom-spacer"></View>
      </ScrollView>
    </View>
  )
}

export default CommunityActivity
