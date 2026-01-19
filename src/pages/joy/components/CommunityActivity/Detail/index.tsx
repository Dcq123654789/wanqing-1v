import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { getActivityById, categoryConfig, statusConfig } from '../mockData'
import type { CommunityActivity } from '../types'
import './index.scss'
import PageTransitionOverlay from '@/components/PageTransitionOverlay'
import { navigateTo } from '@/utils/navigation'

function ActivityDetail() {
  const router = useRouter()
  const [activity, setActivity] = useState<CommunityActivity | null>(null)
  const [loading, setLoading] = useState(true)

  // 页面显示时隐藏遮罩
  useDidShow(() => {
    console.log('活动详情页面显示，开始隐藏遮罩流程')
    console.log('当前页面参数:', router.params)

    // 延迟一小段时间，确保页面完全渲染
    setTimeout(() => {
      console.log('活动详情页面触发隐藏遮罩事件')
      Taro.eventCenter.trigger('hidePageTransition')
    }, 100)
  })

  useEffect(() => {
    const activityId = router.params.id
    if (activityId) {
      const activityData = getActivityById(activityId)
      if (activityData) {
        setActivity(activityData)
      } else {
        Taro.showToast({
          title: '活动不存在',
          icon: 'none'
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      }
    } else {
      Taro.showToast({
        title: '参数错误',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    }
    setLoading(false)
  }, [router.params.id])

  // 拨打电话
  const handleCall = (phone?: string) => {
    if (!phone) {
      Taro.showToast({
        title: '暂无联系电话',
        icon: 'none'
      })
      return
    }
    Taro.makePhoneCall({
      phoneNumber: phone
    })
  }

  // 查看地图
  const handleViewMap = () => {
    if (!activity) return
    if (activity.location.latitude && activity.location.longitude) {
      const params = new URLSearchParams({
        lat: activity.location.latitude.toString(),
        lng: activity.location.longitude.toString(),
        name: activity.location.name,
        address: activity.location.address
      })
      navigateTo(`/pages/joy/components/CommunityActivity/MapView/index?${params.toString()}`)
    } else {
      Taro.showToast({
        title: '暂无位置信息',
        icon: 'none'
      })
    }
  }

  // 报名活动
  const handleRegister = () => {
    if (!activity) return

    if (activity.status === 'full') {
      Taro.showToast({
        title: '活动已满员',
        icon: 'none'
      })
      return
    }

    if (activity.status === 'ended') {
      Taro.showToast({
        title: '活动已结束',
        icon: 'none'
      })
      return
    }

    // 跳转到报名页面，只传递 activityId
    navigateTo(`/pages/joy/components/CommunityActivity/Registration/index?activityId=${activity.id}`)
  }


  if (!activity) {
    return (
      <View className="activity-detail-page">
        <PageTransitionOverlay />
        <View className="error-state">
          <Text className="error-icon">😕</Text>
          <Text className="error-text">活动不存在</Text>
        </View>
      </View>
    )
  }

  const categoryInfo = categoryConfig[activity.category]
  const statusInfo = statusConfig[activity.status]
  const progress = (activity.currentParticipants / activity.maxParticipants) * 100

  return (
    <View className="activity-detail-page">
      <PageTransitionOverlay />
      <ScrollView scrollY className="detail-scroll">
        {/* 封面图 */}
        <View className="detail-cover">
          <Image
            src={activity.coverImage}
            className="cover-image"
            mode="aspectFill"
          />
          <View className="cover-overlay">
            <View
              className="status-badge"
              style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}
            >
              <Text className="status-text">{statusInfo.name}</Text>
            </View>
          </View>
        </View>

        {/* 主要信息 */}
        <View className="detail-main">
          {/* 标题 */}
          <View className="detail-title-section">
            <Text className="detail-title">{activity.title}</Text>
            <View className="detail-category" style={{ color: categoryInfo.color }}>
              <Text className="category-icon">{categoryInfo.icon}</Text>
              <Text className="category-text">{categoryInfo.name}</Text>
            </View>
          </View>

          {/* 标签 */}
          {activity.tags.length > 0 && (
            <View className="detail-tags">
              {activity.tags.map((tag, index) => (
                <View key={index} className="tag-item" style={{ color: categoryInfo.color }}>
                  <Text className="tag-text">#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 活动描述 */}
          <View className="detail-section">
            <View className="section-title">
              <Text className="title-icon">📝</Text>
              <Text className="title-text">活动介绍</Text>
            </View>
            <Text className="description-text">{activity.description}</Text>
          </View>

          {/* 活动信息 */}
          <View className="detail-section">
            <View className="section-title">
              <Text className="title-icon">ℹ️</Text>
              <Text className="title-text">活动信息</Text>
            </View>
            <View className="info-list">
              <View className="info-item">
                <Text className="info-label">📅 活动时间</Text>
                <Text className="info-value">{activity.time}</Text>
              </View>
              <View className="info-item">
                <Text className="info-label">📍 活动地点</Text>
                <View className="info-value-row">
                  <Text className="info-value">{activity.location.name}</Text>
                  <Text className="info-link" onClick={handleViewMap}>
                    查看地图 →
                  </Text>
                </View>
              </View>
              <View className="info-item">
                <Text className="info-label">🏢 详细地址</Text>
                <Text className="info-value info-value-small">{activity.location.address}</Text>
              </View>
              <View className="info-item">
                <Text className="info-label">⏰ 报名截止</Text>
                <Text className="info-value">{activity.registrationDeadline}</Text>
              </View>
              <View className="info-item">
                <Text className="info-label">👥 参与人数</Text>
                <View className="participants-info">
                  <View className="progress-container">
                    <Text className="info-value">
                      {activity.currentParticipants}/{activity.maxParticipants}人
                    </Text>
                    <View className="progress-bar-wrapper">
                      <View
                        className="progress-bar-fill"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: activity.currentParticipants >= activity.maxParticipants ? '#ff4d4f' : '#52c41a'
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* 组织者信息 */}
          <View className="detail-section">
            <View className="section-title">
              <Text className="title-icon">👤</Text>
              <Text className="title-text">组织者</Text>
            </View>
            <View className="organizer-card">
              <Image
                src={activity.organizer.avatar}
                className="organizer-avatar"
              />
              <View className="organizer-info">
                <Text className="organizer-name">{activity.organizer.name}</Text>
                {activity.organizer.phone && (
                  <Text className="organizer-phone" onClick={() => handleCall(activity.organizer.phone)}>
                    📞 联系组织者
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* 底部留白 */}
          <View className="bottom-spacer"></View>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className="detail-footer">
        <View className="footer-actions">
          <View
            className={`action-btn action-btn--primary ${activity.status === 'full' || activity.status === 'ended' ? 'action-btn--disabled' : ''}`}
            onClick={handleRegister}
          >
            <Text className="action-text">
              {activity.status === 'full' ? '已满员' : activity.status === 'ended' ? '已结束' : '立即报名'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ActivityDetail
