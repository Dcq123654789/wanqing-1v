import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { mockServiceList, categoryConfig } from './mockData'
import type { HomeService, SortType } from './types'
import './index.scss'

function HomeService() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [sortType, setSortType] = useState<SortType>('none')
  const [serviceList, setServiceList] = useState<HomeService[]>([])

  // 分类列表
  const categories = Object.values(categoryConfig)

  useEffect(() => {
    // 初始化加载所有服务
    applyFilters()
  }, [])

  // 应用所有筛选条件（分类、排序）
  const applyFilters = () => {
    let filtered = [...mockServiceList]

    // 1. 按分类筛选
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory)
    }

    // 2. 按价格排序
    if (sortType === 'asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortType === 'desc') {
      filtered.sort((a, b) => b.price - a.price)
    }

    setServiceList(filtered)
  }

  // 切换分类
  const handleCategoryChange = (categoryKey: string) => {
    setActiveCategory(categoryKey)
    // 延迟执行以确保状态更新完成
    setTimeout(() => applyFilters(), 0)
  }

  // 切换价格排序
  const handleSortToggle = () => {
    const newSortType: SortType = sortType === 'none' ? 'asc' : sortType === 'asc' ? 'desc' : 'none'
    setSortType(newSortType)
    setTimeout(() => applyFilters(), 0)

    // 显示提示
    const sortText = newSortType === 'asc' ? '价格从低到高' : newSortType === 'desc' ? '价格从高到低' : '取消排序'
    Taro.showToast({
      title: sortText,
      icon: 'none',
      duration: 1500
    })
  }

  // 获取排序按钮文本
  const getSortButtonText = () => {
    if (sortType === 'asc') return '价格↑'
    if (sortType === 'desc') return '价格↓'
    return '价格排序'
  }

  // 获取价格显示文本
  const getPriceText = (price: number) => {
    return price === 0 ? '免费' : `¥${price}`
  }

  // 获取销量显示文本
  const getSalesText = (sales: number) => {
    return sales === 0 ? '暂无销量' : `已售 ${sales} 件`
  }

  // 服务卡片点击
  const handleServiceClick = (item: HomeService) => {
    Taro.showToast({
      title: `查看${item.name}`,
      icon: 'none'
    })
    // TODO: 跳转到服务详情页
    // Taro.navigateTo({
    //   url: `/pages/joy/components/HomeService/Detail/index?id=${item.id}`
    // })
  }

  // 图片加载错误处理
  const handleImageError = (e: any) => {
    console.log('Image load error:', e)
    // 可以在这里设置默认占位图
  }

  return (
    <View className="home-service-page">
      <ScrollView scrollY className="service-scroll">
        {/* 排序按钮栏 */}
        <View className="sort-container">
          <View
            className={`sort-button ${sortType !== 'none' ? 'sort-button--active' : ''}`}
            onClick={handleSortToggle}
          >
            <Text className="sort-text">{getSortButtonText()}</Text>
          </View>
        </View>

        {/* 分类标签栏 */}
        <View className="categories-container">
          <ScrollView scrollX className="categories-scroll">
            <View className="categories-wrapper">
              {categories.map((category) => (
                <View
                  key={category.key}
                  className={`category-item ${activeCategory === category.key ? 'category-item--active' : ''}`}
                  onClick={() => handleCategoryChange(category.key)}
                >
                  <Text className="category-text">
                    {category.icon && <Text className="category-icon">{category.icon}</Text>}
                    {category.name}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 服务列表 */}
        <View className="service-list">
          {serviceList.length > 0 ? (
            <View className="service-grid">
              {serviceList.map((item) => (
                <View
                  key={item.id}
                  className="service-card"
                  onClick={() => handleServiceClick(item)}
                  hoverClassName="service-card--press"
                >
                  {/* 服务图片 */}
                  <Image
                    src={item.poster}
                    className="service-poster"
                    mode="aspectFill"
                    lazyLoad
                    onError={handleImageError}
                  />

                  {/* 服务信息 */}
                  <View className="service-info">
                    <Text className="service-name">{item.name}</Text>

                    <View className="service-footer">
                      <View className="price-section">
                        <Text className="price-symbol">￥</Text>
                        <Text className="price-value">{item.price === 0 ? '免费' : item.price}</Text>
                      </View>
                      <Text className="sales-text">{getSalesText(item.sales)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="empty-state">
              <Text className="empty-icon">📦</Text>
              <Text className="empty-text">暂无服务</Text>
            </View>
          )}
        </View>

        {/* 底部留白 */}
        <View className="bottom-spacer"></View>
      </ScrollView>
    </View>
  )
}

export default HomeService
