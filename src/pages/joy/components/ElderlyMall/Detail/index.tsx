import { View, Text, Image, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import type { ProductDetail } from '../types'
import { getCategoryInfo, ProductCategory } from '../types'
import type { PageResponse } from '@/utils/request'
import { query } from '@/utils/request'
import './index.scss'
import PageTransitionOverlay from '@/components/PageTransitionOverlay'

function ProductDetail() {
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // 页面显示时隐藏遮罩并刷新数据
  useDidShow(() => {
    setTimeout(() => {
      Taro.eventCenter.trigger('hidePageTransition')
    }, 100)

    // 每次页面显示时重新获取商品详情，确保库存数据是最新的
    const instance = Taro.getCurrentInstance()
    const params = instance.router?.params
    const productId = params?.id

    if (productId) {
      fetchProductDetail(productId)
    }
  })

  useEffect(() => {
    // 初次加载时也获取数据
    const instance = Taro.getCurrentInstance()
    const params = instance.router?.params
    const productId = params?.id

    if (productId) {
      fetchProductDetail(productId)
    }
  }, [])


  // 从后端获取商品详情
  const fetchProductDetail = async (id: string) => {
    try {
      const response = await query<any>('product', {
        conditions: { _id: id, status: 1 },
        pageNum: 1,
        pageSize: 1
      })

      if (response.code === 200 && response.data) {
        const pageData = response.data as PageResponse<any>
        const dataList = pageData.content || []

        if (dataList.length > 0) {
          const item = dataList[0]

          const detail: ProductDetail = {
            id: item._id,
            name: item.name,
            price: Number(item.price),
            poster: item.poster,
            sales: item.sales || 0,
            category: item.category ?? ProductCategory.NUTRITION,
            description: item.description || '',
            images: (item.images && item.images.length > 0) ? item.images : [item.poster],
            spec: item.spec || undefined,
            origin: item.origin || undefined,
            shelfLife: item.shelfLife || undefined,
            stock: item.stock || 0,
            rating: Number(item.rating) || 0,
            reviewCount: item.reviewCount || 0
          }
          setProductDetail(detail)
        } else {
          showNotFoundError()
        }
      } else {
        showNotFoundError()
      }
    } catch (error) {
      console.error('获取商品详情失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    }
  }

  const showNotFoundError = () => {
    Taro.showToast({
      title: '商品不存在',
      icon: 'none'
    })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

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

    // 构建订单数据
    const orderData = {
      productId: productDetail.id,
      name: productDetail.name,
      poster: productDetail.poster,
      price: productDetail.price,
      spec: productDetail.spec,
      stock: productDetail.stock
    }

    // 跳转到订单确认页面
    Taro.navigateTo({
      url: `/pages/joy/components/ElderlyMall/OrderConfirm/index?product=${encodeURIComponent(JSON.stringify(orderData))}&quantity=${quantity}`
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

  // 获取分类显示名称
  const categoryInfo = getCategoryInfo(productDetail.category)

  return (
    <View className="product-detail-page">
      <PageTransitionOverlay />
      <ScrollView scrollY className="detail-scroll">
        {/* 商品图片轮播 */}
        <View className="product-images">
          <Swiper
            className="product-swiper"
            indicatorDots
            indicatorColor="rgba(255, 255, 255, 0.5)"
            indicatorActiveColor="#fff"
            autoplay={productDetail.images.length > 1}
            interval={3000}
            circular
            onChange={(e) => {
              setCurrentImageIndex(e.detail.current)
            }}
          >
            {productDetail.images.map((image, index) => (
              <SwiperItem key={index}>
                <Image
                  src={image}
                  className="main-image"
                  mode="aspectFit"
                />
              </SwiperItem>
            ))}
          </Swiper>
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

        {/* 商品分类 */}
        <View className="product-category-section">
          <View className="section-title">
            <Text className="title-text">商品分类</Text>
          </View>
          <View className="category-tag">
            <Text className="category-tag-text">{categoryInfo.name}</Text>
          </View>
        </View>

        {/* 商品规格 */}
        {(productDetail.spec || productDetail.origin || productDetail.shelfLife) && (
          <View className="product-specs">
            <View className="section-title">
              <Text className="title-text">商品规格</Text>
            </View>
            <View className="specs-list">
              {productDetail.spec && (
                <View className="spec-item">
                  <Text className="spec-label">规格</Text>
                  <Text className="spec-value">{productDetail.spec}</Text>
                </View>
              )}
              {productDetail.origin && (
                <View className="spec-item">
                  <Text className="spec-label">产地</Text>
                  <Text className="spec-value">{productDetail.origin}</Text>
                </View>
              )}
              {productDetail.shelfLife && (
                <View className="spec-item">
                  <Text className="spec-label">保质期</Text>
                  <Text className="spec-value">{productDetail.shelfLife}个月</Text>
                </View>
              )}
            </View>
          </View>
        )}

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
