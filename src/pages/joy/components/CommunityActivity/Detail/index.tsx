import { View, Text, Image, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { categoryConfig, statusConfig } from '../mockData'
import type { CommunityActivity } from '../types'
import './index.scss'
import { fetchActivityDetail, checkUserRegistration } from '../services/activity.service'
import { useUserStore } from '@/store/userStore'

function ActivityDetail() {
  const router = useRouter()
  const [activity, setActivity] = useState<CommunityActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasRegistered, setHasRegistered] = useState(false)  // 是否已报名

  // 获取用户信息
  const { userInfo } = useUserStore()

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
    const loadActivityDetail = async () => {
      const activityId = router.params.id
      console.log('详情页 router.params:', router.params)
      console.log('详情页 activityId:', activityId)

      if (!activityId) {
        setError('参数错误')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        console.log('开始获取活动详情, ID:', activityId)

        // 获取活动详情
        const activityData = await fetchActivityDetail(activityId)
        console.log('获取到的活动数据:', activityData)
        setActivity(activityData)

        // 检查用户是否已报名（需要传入用户ID）
        if (userInfo?._id) {
          const registered = await checkUserRegistration(activityId, userInfo._id)
          console.log('用户报名状态:', registered)
          setHasRegistered(registered)
        } else {
          console.log('用户未登录，无法检查报名状态')
          setHasRegistered(false)
        }
      } catch (err: any) {
        console.error('加载活动详情失败:', err)
        setError(err?.message || '加载活动详情失败')
        Taro.showToast({
          title: err?.message || '加载失败',
          icon: 'none'
        })
      } finally {
        setLoading(false)
      }
    }

    loadActivityDetail()
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
        lat: activity.location.latitude,
        lng: activity.location.longitude,
        name: activity.locationAddress,
        address: activity.locationAddress
      })
      console.log('数据', activity)
      console.log('params', params)

      Taro.navigateTo({
        url: `/pages/joy/components/CommunityActivity/MapView/index?${params.toString()}`
      })
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

    // 检查是否已报名
    if (hasRegistered) {
      Taro.showToast({
        title: '您已经报名过该活动',
        icon: 'none'
      })
      return
    }

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

    // 跳转到报名页面
    Taro.navigateTo({
      url: `/pages/joy/components/CommunityActivity/Registration/index?activityId=${activity.id}`
    })
  }


  // 加载中状态
  if (loading) {
    return (
      <View className="activity-detail-page"> 
        <View className="loading-state">
          <Text className="loading-text">加载中...</Text>
        </View>
      </View>
    )
  }

  // 错误状态
  if (error || !activity) {
    return (
      <View className="activity-detail-page"> 
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
      <ScrollView scrollY className="detail-scroll">
        {/* 封面图 */}
        <View className="detail-cover">
          {/* 图片轮播 */}
          {Array.isArray(activity.coverImage) && activity.coverImage.length > 0 ? (
            <Swiper
              className="cover-image-swiper"
              indicatorDots
              indicatorColor="rgba(255, 255, 255, 0.5)"
              indicatorActiveColor="#fff"
              autoplay
              interval={3000}
              circular
            >
              {activity.coverImage.map((img, index) => (
                <SwiperItem key={index}>
                  <Image
                    src={img}
                    className="cover-image"
                    mode="aspectFit"
                    lazyLoad
                  />
                </SwiperItem>
              ))}
            </Swiper>
          ) : (
            <Image
              src={typeof activity.coverImage === 'string' ? activity.coverImage : activity.coverImage?.[0] || ''}
              className="cover-image"
              mode="aspectFit"
              lazyLoad
            />
          )}
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
                  <Text className="info-value">{activity.locationAddress}</Text>
                  <Text className="info-link" onClick={handleViewMap}>
                    查看地图 →
                  </Text>
                </View>
              </View>
              <View className="info-item">
                <Text className="info-label">🏢 详细地址</Text>
                <Text className="info-value info-value-small">{activity.locationAddress}</Text>
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
              <View className="organizer-info">
                <Text className="organizer-name">姓名 :{activity.organizer.name}</Text>
                {activity.organizer.phone && (
                  <Text className="organizer-phone" onClick={() => handleCall(activity.organizer.phone)}>
                    📞: {activity.organizer.phone} 联系组织者
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
            className={`action-btn action-btn--primary ${hasRegistered || activity.status === 'full' || activity.status === 'ended' ? 'action-btn--disabled' : ''}`}
            onClick={handleRegister}
          >
            <Text className="action-text">
              {hasRegistered ? '已报名' : activity.status === 'full' ? '已满员' : activity.status === 'ended' ? '已结束' : '立即报名'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ActivityDetail
