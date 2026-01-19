import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { mockActivityList, categoryConfig, statusConfig } from './mockData'
import type { ActivityListItem } from './types'
import './index.scss'
import PageTransitionOverlay from "@/components/PageTransitionOverlay";
import { navigateTo } from "@/utils/navigation";
function CommunityActivity() {
  const [statusBarHeight, setStatusBarHeight] = useState(0)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [activityList, setActivityList] = useState<ActivityListItem[]>([])

  // 分类标签
  const tabs = [
    { key: 'all', name: '全部' },
    { key: 'culture', name: '文化' },
    { key: 'sports', name: '体育' },
    { key: 'entertainment', name: '娱乐' },
    { key: 'volunteer', name: '志愿' },
    { key: 'learning', name: '学习' }
  ]

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync()
    setStatusBarHeight(systemInfo.statusBarHeight || 0)

    // 初始化加载所有活动
    filterActivities('all')
  }, [])

  // 筛选活动
  const filterActivities = (category: string) => {
    if (category === 'all') {
      setActivityList(mockActivityList)
    } else {
      const filtered = mockActivityList.filter(item => item.category === category)
      setActivityList(filtered)
    }
  }

  // 切换标签
  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey)
    filterActivities(tabKey)
  }

  // 活动点击
  const handleActivityClick = (item: ActivityListItem) => {
    const params = new URLSearchParams({
      id: item.id,
      title: encodeURIComponent(item.title),
      category: item.category,
      status: item.status
    })

    navigateTo(`/pages/joy/components/CommunityActivity/Detail/index?${params.toString()}`);
  }

  // 返回上一页
 

  return (
    <View className="community-activity-page">
      <PageTransitionOverlay />
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

        {/* 活动列表 */}
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
                    <Image
                      src={item.coverImage}
                      className="card-image"
                      mode="aspectFill"
                    />
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

        {/* 底部留白 */}
        <View className="bottom-spacer"></View>
      </ScrollView>
    </View>
  )
}

export default CommunityActivity
