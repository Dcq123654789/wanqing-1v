import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { mockWellnessServiceList, serviceTypeConfig, statusConfig } from './mockData'
import type { WellnessServiceListItem } from './types'
import './index.scss'
import PageTransitionOverlay from "@/components/PageTransitionOverlay";
import { navigateTo } from "@/utils/navigation";

function WellnessBooking() {
  const [statusBarHeight, setStatusBarHeight] = useState(0)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [wellnessList, setWellnessList] = useState<WellnessServiceListItem[]>([])

  // 分类标签
  const tabs = [
    { key: 'all', name: '全部' },
    { key: 'medical', name: '医疗护理' },
    { key: 'rehabilitation', name: '康复训练' },
    { key: 'nursing', name: '生活照料' },
    { key: 'health', name: '健康管理' },
    { key: 'leisure', name: '休闲养生' }
  ]

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync()
    setStatusBarHeight(systemInfo.statusBarHeight || 0)

    // 初始化加载所有服务
    filterServices('all')
  }, [])

  // 页面显示时隐藏遮罩（从详情页返回时）
  useDidShow(() => {
    console.log('康养预订页面显示，开始隐藏遮罩流程')
    setTimeout(() => {
      console.log('康养预订页面触发隐藏遮罩事件')
      Taro.eventCenter.trigger('hidePageTransition')
    }, 100)
  })

  // 筛选服务
  const filterServices = (category: string) => {
    if (category === 'all') {
      setWellnessList(mockWellnessServiceList)
    } else {
      const filtered = mockWellnessServiceList.filter(item => item.category === category)
      setWellnessList(filtered)
    }
  }

  // 切换标签
  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey)
    filterServices(tabKey)
  }

  // 服务点击
  const handleServiceClick = (item: WellnessServiceListItem) => {
    const params = new URLSearchParams({
      id: item.id,
      title: encodeURIComponent(item.title),
      category: item.category,
      status: item.status
    })

    navigateTo(`/pages/joy/components/WellnessBooking/Detail/index?${params.toString()}`)
  }

  return (
    <View className="wellness-booking-page">
      <PageTransitionOverlay />

      <ScrollView scrollY className="wellness-scroll">
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

        {/* 服务列表 */}
        <View className="wellness-list">
          {wellnessList.length > 0 ? (
            wellnessList.map((item) => {
              const mainServiceType = item.serviceTypes[0]
              const serviceTypeInfo = serviceTypeConfig[mainServiceType]
              const statusInfo = statusConfig[item.status]

              return (
                <View
                  key={item.id}
                  className="wellness-card"
                  onClick={() => handleServiceClick(item)}
                >
                  <View className="card-header">
                    <Image
                      src={item.coverImage}
                      className="card-image"
                      mode="aspectFill"
                    />
                    <View
                      className="card-status-badge"
                      style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}
                    >
                      <Text className="status-text">{statusInfo.name}</Text>
                    </View>
                  </View>

                  <View className="card-content">
                    <Text className="card-title">{item.title}</Text>

                    {/* 服务类型标签 */}
                    <View className="card-service-types">
                      {item.serviceTypes.map((type) => {
                        const config = serviceTypeConfig[type]
                        return (
                          <View
                            key={type}
                            className="service-type-tag"
                            style={{ backgroundColor: `${config.color}15` }}
                          >
                            <Text className="service-type-icon">{config.icon}</Text>
                            <Text className="service-type-text" style={{ color: config.color }}>
                              {config.name}
                            </Text>
                          </View>
                        )
                      })}
                    </View>

                    {/* 亮点特色 */}
                    <View className="card-highlights">
                      {item.highlights.map((highlight, index) => (
                        <View key={index} className="highlight-item">
                          <Text className="highlight-icon">✓</Text>
                          <Text className="highlight-text">{highlight}</Text>
                        </View>
                      ))}
                    </View>

                    {/* 位置信息 */}
                    <View className="card-info">
                      <View className="info-row">
                        <Text className="info-icon">📍</Text>
                        <Text className="info-text">{item.location}</Text>
                      </View>
                    </View>

                    <View className="card-footer">
                      <Text className="card-detail-hint">查看详情 →</Text>
                    </View>
                  </View>
                </View>
              )
            })
          ) : (
            <View className="empty-state">
              <Text className="empty-icon">🏥</Text>
              <Text className="empty-text">暂无相关服务</Text>
            </View>
          )}
        </View>

        {/* 底部留白 */}
        <View className="bottom-spacer"></View>
      </ScrollView>
    </View>
  )
}

export default WellnessBooking
