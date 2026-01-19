import { View, Text, Image, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { getWellnessServiceById, serviceTypeConfig, statusConfig } from '../mockData'
import type { WellnessService } from '../types'
import './index.scss'
import PageTransitionOverlay from "@/components/PageTransitionOverlay";

function WellnessDetail() {
  const [service, setService] = useState<WellnessService | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const instance = Taro.getCurrentInstance()
    const params = instance.router?.params

    if (params?.id) {
      const serviceData = getWellnessServiceById(params.id)
      if (serviceData) {
        setService(serviceData)
      } else {
        Taro.showToast({
          title: '服务不存在',
          icon: 'none'
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      }
    }
  }, [])

  // 拨打电话
  const handleCall = () => {
    if (!service) return

    Taro.showModal({
      title: '拨打电话',
      content: `确定拨打 ${service.contact.phone} 吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.makePhoneCall({
            phoneNumber: service.contact.phone
          })
        }
      }
    })
  }

  // 预订服务
  const handleBooking = () => {
    if (!service) return

    if (service.status === 'full') {
      Taro.showToast({
        title: '该服务已满员',
        icon: 'none'
      })
      return
    }

    Taro.showModal({
      title: '预订确认',
      content: `确定要预订「${service.title}」吗？`,
      success: (res) => {
        if (res.confirm) {
          // TODO: 调用预订接口
          Taro.showToast({
            title: '预订成功',
            icon: 'success'
          })
        }
      }
    })
  }

  if (!service) {
    return (
      <View className="wellness-detail-page">
        <View className="loading-state">
          <Text>加载中...</Text>
        </View>
      </View>
    )
  }

  const statusInfo = statusConfig[service.status]

  return (
    <View className="wellness-detail-page">
      <PageTransitionOverlay />

      <ScrollView scrollY className="detail-scroll">
        {/* 状态栏占位 */}
        <View style={{ height: Taro.getSystemInfoSync().statusBarHeight || 0 }} />

        {/* 图片轮播 */}
        <View className="image-swiper">
          <ScrollView
            scrollX
            className="swiper-container"
            scrollWithAnimation
            onPageScroll={(e) => {
              const index = Math.round(e.detail.scrollLeft / 750) // 750rpx = 100%
              setCurrentImageIndex(index)
            }}
          >
            {service.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                className="swiper-image"
                mode="aspectFill"
              />
            ))}
          </ScrollView>

          {/* 图片指示器 */}
          {service.images.length > 1 && (
            <View className="image-indicator">
              <Text className="indicator-text">
                {currentImageIndex + 1}/{service.images.length}
              </Text>
            </View>
          )}

          {/* 返回按钮 */}
          <View className="back-button" onClick={() => Taro.navigateBack()}>
            <Text className="back-icon">←</Text>
          </View>
        </View>

        {/* 主要内容 */}
        <View className="detail-content">
          {/* 标题和状态 */}
          <View className="header-section">
            <View className="title-row">
              <Text className="service-title">{service.title}</Text>
              <View
                className="status-badge"
                style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}
              >
                <Text className="status-text">{statusInfo.name}</Text>
              </View>
            </View>

            {/* 服务类型标签 */}
            <View className="service-types">
              {service.serviceTypes.map((type) => {
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
          </View>

          {/* 简介 */}
          <View className="section">
            <Text className="section-title">服务简介</Text>
            <Text className="description-text">{service.description}</Text>
          </View>

          {/* 亮点特色 */}
          <View className="section">
            <Text className="section-title">亮点特色</Text>
            <View className="highlights-list">
              {service.highlights.map((highlight, index) => (
                <View key={index} className="highlight-item">
                  <Text className="highlight-icon">✓</Text>
                  <Text className="highlight-text">{highlight}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 设施服务 */}
          <View className="section">
            <Text className="section-title">设施服务</Text>
            <View className="facilities-grid">
              {service.facilities.map((facility, index) => (
                <View key={index} className="facility-item">
                  <Text className="facility-icon">🏢</Text>
                  <Text className="facility-text">{facility}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 位置信息 */}
          <View className="section">
            <Text className="section-title">位置信息</Text>
            <View className="location-info">
              <View className="location-row">
                <Text className="location-icon">📍</Text>
                <Text className="location-text">{service.location.name}</Text>
              </View>
              <View className="location-row">
                <Text className="location-icon">📮</Text>
                <Text className="location-address">{service.location.address}</Text>
              </View>
            </View>
          </View>

          {/* 营业时间 */}
          <View className="section">
            <Text className="section-title">营业时间</Text>
            <Text className="time-text">{service.openingHours}</Text>
          </View>

          {/* 联系方式 */}
          <View className="section">
            <Text className="section-title">联系方式</Text>
            <View className="contact-info">
              <View className="contact-row">
                <Text className="contact-icon">📞</Text>
                <Text className="contact-text">{service.contact.phone}</Text>
                <View className="contact-button" onClick={handleCall}>
                  <Text className="contact-button-text">拨打</Text>
                </View>
              </View>
              {service.contact.wechat && (
                <View className="contact-row">
                  <Text className="contact-icon">💬</Text>
                  <Text className="contact-text">{service.contact.wechat}</Text>
                </View>
              )}
            </View>
          </View>

          {/* 预订须知 */}
          <View className="section">
            <Text className="section-title">预订须知</Text>
            <Text className="notice-text">{service.bookingNotice}</Text>
          </View>

          {/* 底部留白 */}
          <View className="bottom-spacer"></View>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className="bottom-bar">
        <View className="bar-content">
          <View className="price-info">
            <Text className="price-label">预订服务</Text>
            <Text className="price-desc">查看详情并预订</Text>
          </View>
          <Button
            className="booking-button"
            onClick={handleBooking}
            disabled={service.status === 'full'}
          >
            立即预订
          </Button>
        </View>
      </View>
    </View>
  )
}

export default WellnessDetail
