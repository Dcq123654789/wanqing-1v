import { View, Text, Image, ScrollView, Swiper, SwiperItem, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { getServiceDetailById, categoryConfig } from '../mockData'
import type { ServiceDetail } from '../types'
import './index.scss'

function ServiceDetailPage() {
  const [serviceDetail, setServiceDetail] = useState<ServiceDetail | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')

  // 计算日期范围
  const getStartDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getEndDate = () => {
    const today = new Date()
    const twoWeeksLater = new Date(today)
    twoWeeksLater.setDate(today.getDate() + 14)
    const year = twoWeeksLater.getFullYear()
    const month = String(twoWeeksLater.getMonth() + 1).padStart(2, '0')
    const day = String(twoWeeksLater.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const startDate = getStartDate()
  const endDate = getEndDate()

  useEffect(() => {
    // 获取页面参数
    const instance = Taro.getCurrentInstance()
    const params = instance.router?.params
    const serviceId = params?.id

    if (serviceId) {
      const detail = getServiceDetailById(serviceId)
      if (detail) {
        setServiceDetail(detail)
      } else {
        // 如果没有详情数据，使用基础数据
        Taro.showToast({
          title: '服务详情加载中',
          icon: 'none'
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      }
    }
  }, [])

  // Swiper 切换事件
  const handleSwiperChange = (e: any) => {
    setCurrentImageIndex(e.detail.current)
  }

  // 日期选择变化
  const handleDateChange = (e: any) => {
    setSelectedDate(e.detail.value)
  }

  // 选择预约时间
  const handleTimeSelect = () => {
    Taro.showActionSheet({
      itemList: ['09:00-11:00', '14:00-16:00', '16:00-18:00'],
      success: (res) => {
        const times = ['09:00-11:00', '14:00-16:00', '16:00-18:00']
        setSelectedTime(times[res.tapIndex])
      }
    })
  }

  // 立即预约
  const handleBookNow = () => {
    if (!serviceDetail) return

    if (!selectedDate) {
      Taro.showToast({
        title: '请选择预约日期',
        icon: 'none'
      })
      return
    }

    if (!selectedTime) {
      Taro.showToast({
        title: '请选择预约时间',
        icon: 'none'
      })
      return
    }

    Taro.showModal({
      title: '确认预约',
      content: `预约 ${serviceDetail.name}\n日期：${selectedDate}\n时间：${selectedTime}\n费用：￥${serviceDetail.price === 0 ? '免费' : serviceDetail.price}`,
      confirmText: '确认预约',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '预约成功！',
            icon: 'success'
          })
        }
      }
    })
  }

  // 联系客服
  const handleContactService = () => {
    Taro.showToast({
      title: '正在连接客服...',
      icon: 'none'
    })
  }

  if (!serviceDetail) {
    return (
      <View className="service-detail-page">
        <View className="loading-state">
          <Text className="loading-text">加载中...</Text>
        </View>
      </View>
    )
  }

  const categoryInfo = categoryConfig[serviceDetail.category as keyof typeof categoryConfig]
  const images = serviceDetail.images || [serviceDetail.poster]

  return (
    <View className="service-detail-page">
      <ScrollView scrollY className="detail-scroll">

        {/* 服务图片轮播 */}
        <View className="service-images">
          <Swiper
            className="image-swiper"
            indicatorColor="rgba(255, 255, 255, 0.5)"
            indicatorActiveColor="#fff"
            circular
            indicatorDots
            onChange={handleSwiperChange}
          >
            {images.map((image, index) => (
              <SwiperItem key={index}>
                <Image
                  src={image}
                  className="swiper-image"
                  mode="aspectFill"
                />
              </SwiperItem>
            ))}
          </Swiper>
        </View>

        {/* 服务基本信息 */}
        <View className="service-basic-info">
          <View className="category-tag">
            <Text className="category-icon">{categoryInfo?.icon}</Text>
            <Text className="category-name">{categoryInfo?.name}</Text>
          </View>

          <View className="price-section">
            <View className="price-wrapper">
              <Text className="price-symbol">￥</Text>
              <Text className="price-value">
                {serviceDetail.price === 0 ? '免费' : serviceDetail.price}
              </Text>
            </View>
            <View className="sales-info">
              <Text className="sales-text">
                {serviceDetail.sales === 0 ? '暂无销量' : `已售 ${serviceDetail.sales} 件`}
              </Text>
            </View>
          </View>

          <Text className="service-name">{serviceDetail.name}</Text>

          {/* 评分和评价 */}
          {serviceDetail.rating && (
            <View className="service-stats">
              <View className="stat-item">
                <Text className="stat-icon">⭐</Text>
                <Text className="stat-value">{serviceDetail.rating}</Text>
                <Text className="stat-label">评分</Text>
              </View>
              {serviceDetail.reviewCount && (
                <View className="stat-item">
                  <Text className="stat-icon">💬</Text>
                  <Text className="stat-value">{serviceDetail.reviewCount}</Text>
                  <Text className="stat-label">评价</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* 预约时间选择 */}
        <View className="booking-section">
          <View className="section-title">
            <Text className="title-text">预约时间</Text>
          </View>
          <View className="booking-options">
            <View className="booking-option">
              <Text className="option-label">预约日期</Text>
              <Picker
                mode="date"
                start={startDate}
                end={endDate}
                onChange={handleDateChange}
              >
                <View className={`picker-value ${selectedDate ? 'picker-value--selected' : ''}`}>
                  <Text className="value-text">
                    {selectedDate || '请选择日期 >'}
                  </Text>
                </View>
              </Picker>
            </View>
            <View
              className={`booking-option ${selectedTime ? 'booking-option--selected' : ''}`}
              onClick={handleTimeSelect}
            >
              <Text className="option-label">预约时间</Text>
              <Text className="option-value">
                {selectedTime || '请选择 >'}
              </Text>
            </View>
          </View>
        </View>

        {/* 服务规格 */}
        {serviceDetail.specifications && (
          <View className="service-specs">
            <View className="section-title">
              <Text className="title-text">服务规格</Text>
            </View>
            <View className="specs-list">
              {Object.entries(serviceDetail.specifications).map(([key, value]) => (
                <View key={key} className="spec-item">
                  <Text className="spec-label">{key}</Text>
                  <Text className="spec-value">{value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 服务详情 */}
        <View className="service-description">
          <View className="section-title">
            <Text className="title-text">服务详情</Text>
          </View>
          <Text className="description-text">{serviceDetail.description}</Text>
        </View>

        {/* 服务须知 */}
        <View className="service-notice">
          <View className="section-title">
            <Text className="title-text">服务须知</Text>
          </View>
          <View className="notice-content">
            <View className="notice-item">
              <Text className="notice-icon">📌</Text>
              <Text className="notice-text">请提前24小时预约，以便我们安排服务人员</Text>
            </View>
            <View className="notice-item">
              <Text className="notice-icon">📌</Text>
              <Text className="notice-text">如需取消或改期，请提前4小时联系客服</Text>
            </View>
            <View className="notice-item">
              <Text className="notice-icon">📌</Text>
              <Text className="notice-text">服务人员将在预约时间前15分钟联系您</Text>
            </View>
          </View>
        </View>

        {/* 底部留白 */}
        <View className="bottom-spacer"></View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className="bottom-bar">
        <View className="contact-button" onClick={handleContactService}>
          <Text className="contact-icon">📞</Text>
          <Text className="contact-text">客服</Text>
        </View>

        <View className="book-button" onClick={handleBookNow}>
          <Text className="btn-text">立即预约</Text>
        </View>
      </View>
    </View>
  )
}

export default ServiceDetailPage
