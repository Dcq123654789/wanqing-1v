import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { getProductDetailById, categoryConfig } from '../mockData'
import type { ProductDetail } from '../types'
import './index.scss'

function ProductDetail() {
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    // 获取页面参数
    const instance = Taro.getCurrentInstance()
    const params = instance.router?.params
    const productId = params?.id

    if (productId) {
      const detail = getProductDetailById(productId)
      if (detail) {
        setProductDetail(detail)
      } else {
        Taro.showToast({
          title: '商品不存在',
          icon: 'none'
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      }
    }
  }, [])

 

  // 数量减少
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // 数量增加 
  const handleIncrease = () => {
    if (productDetail && quantity < productDetail.stock) {
      setQuantity(quantity + 1)
    } else {
      Taro.showToast({
        title: '库存不足',
        icon: 'none'
      })
    }
  }

  // 立即购买
  const handleBuyNow = () => {
    if (!productDetail) return

    Taro.showToast({
      title: `购买${quantity}件，总计￥${productDetail.price * quantity}`,
      icon: 'none',
      duration: 2000
    })
  }

  if (!productDetail) {
    return (
      <View className="product-detail-page">
        <View className="loading-state">
          <Text>加载中...</Text>
        </View>
      </View>
    )
  }

  const categoryInfo = categoryConfig[productDetail.category as keyof typeof categoryConfig]

  return (
    <View className="product-detail-page">
      <ScrollView scrollY className="detail-scroll">
       

        {/* 商品图片轮播 */}
        <View className="product-images">
          <Image
            src={productDetail.images[currentImageIndex] || productDetail.poster}
            className="main-image"
            mode="aspectFit"
          />
          {productDetail.images.length > 1 && (
            <View className="image-indicators">
              {productDetail.images.map((_, index) => (
                <View
                  key={index}
                  className={`indicator ${currentImageIndex === index ? 'indicator--active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </View>
          )}
        </View>

        {/* 商品基本信息 */}
        <View className="product-basic-info">
          <View className="price-section">
            <View className="price-wrapper">
              <Text className="price-symbol">￥</Text>
              <Text className="price-value">{productDetail.price}</Text>
            </View>
            <View className="stock-info">
              <Text className="stock-text">库存 {productDetail.stock} 件</Text>
            </View>
          </View>

          <Text className="product-name">{productDetail.name}</Text>

          <View className="product-stats">
            <View className="stat-item">
              <Text className="stat-icon">⭐</Text>
              <Text className="stat-value">{productDetail.rating}</Text>
              <Text className="stat-label">评分</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-icon">💬</Text>
              <Text className="stat-value">{productDetail.reviewCount}</Text>
              <Text className="stat-label">评价</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-icon">🛒</Text>
              <Text className="stat-value">{productDetail.sales}</Text>
              <Text className="stat-label">已售</Text>
            </View>
          </View>
        </View>

        {/* 商品规格 */}
        <View className="product-specs">
          <View className="section-title">
            <Text className="title-text">商品规格</Text>
          </View>
          <View className="specs-list">
            {Object.entries(productDetail.specifications).map(([key, value]) => (
              <View key={key} className="spec-item">
                <Text className="spec-label">{key}</Text>
                <Text className="spec-value">{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 商品详情 */}
        <View className="product-description">
          <View className="section-title">
            <Text className="title-text">商品详情</Text>
          </View>
          <Text className="description-text">{productDetail.description}</Text>
        </View>

        {/* 底部留白 */}
        <View className="bottom-spacer"></View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className="bottom-bar">
        <View className="quantity-selector">
          <Text
            className={`quantity-btn ${quantity <= 1 ? 'quantity-btn--disabled' : ''}`}
            onClick={handleDecrease}
          >
            -
          </Text>
          <Text className="quantity-value">{quantity}</Text>
          <Text
            className={`quantity-btn ${quantity >= productDetail.stock ? 'quantity-btn--disabled' : ''}`}
            onClick={handleIncrease}
          >
            +
          </Text>
        </View>

        <View className="buy-button" onClick={handleBuyNow}>
          <Text className="btn-text">立即购买</Text>
        </View>
      </View>
    </View>
  )
}

export default ProductDetail
