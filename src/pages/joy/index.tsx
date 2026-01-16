import { View, Text, Image, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { mockTravelRoutes, mockProducts } from './mockData'
import type { TravelRoute, Product } from './mockData'
import ServiceStrip from './components/ServiceStrip'
import ProductBanner from './components/ProductBanner'
import './index.scss'

function Joy() {
  const [statusBarHeight, setStatusBarHeight] = useState(0)

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync()
    setStatusBarHeight(systemInfo.statusBarHeight || 0)
  }, [])

  // 处理商品点击
  const handleProductClick = (product: Product) => {
    console.log("点击商品:", product)
    Taro.showToast({
      title: `查看${product.name}`,
      icon: "none",
    })
  }

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

        {/* 业务入口条 */}
        <ServiceStrip />

        {/* 热门商品轮播图 */}
        <View className="content-section">
          <View className="section-header">
            <Text className="section-title">热门商品</Text>
            <Text className="section-icon">🛍️</Text>
          </View>
          <ProductBanner data={mockProducts} onItemClick={handleProductClick} />
        </View>

        {/* 精选旅游轮播图 */}
        <View className="content-section">
          <View className="section-header">
            <Text className="section-title">精选旅游</Text>
            <Text className="section-icon">✈️</Text>
          </View>
          <View className="travel-swiper-container">
            <Swiper
              className="travel-swiper"
              autoplay
              interval={4000}
              circular
              indicatorDots
              indicatorColor="rgba(255, 255, 255, 0.5)"
              indicatorActiveColor="#FF8C00"
            >
              {mockTravelRoutes.map((route) => (
                <SwiperItem key={route.id}>
                  <View
                    className="travel-swiper-item"
                    onClick={() => handleTravelClick(route)}
                  >
                    <Image
                      src={route.image}
                      className="travel-swiper-image"
                      mode="aspectFill"
                    />
                    <View className="travel-swiper-overlay">
                      <Text className="travel-swiper-title">{route.name}</Text>
                      <Text className="travel-swiper-desc">{route.description}</Text>
                      <View className="travel-swiper-footer">
                        <Text className="travel-swiper-price">¥{route.price}起</Text>
                        <Text className="travel-swiper-duration">⏱ {route.duration}</Text>
                      </View>
                      <View className="travel-swiper-tags">
                        {route.tags.map((tag, index) => (
                          <Text key={index} className="travel-tag">{tag}</Text>
                        ))}
                      </View>
                    </View>
                  </View>
                </SwiperItem>
              ))}
            </Swiper>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Joy
