import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { mockProductList, categoryConfig } from './mockData'
import type { ProductItem } from './types'
import './index.scss'
import PageTransitionOverlay from "@/components/PageTransitionOverlay";
import { navigateTo } from "@/utils/navigation";
type SortType = 'none' | 'asc' | 'desc'

function ElderlyMall() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [sortType, setSortType] = useState<SortType>('none')
  const [productList, setProductList] = useState<ProductItem[]>([])

  // 商品分类
  const categories = [
    { key: 'all', name: '全部' },
    { key: 'health', name: '保健品' },
    { key: 'food', name: '食品' },
    { key: 'daily', name: '日用品' },
    { key: 'medical', name: '医疗器械' }
  ]

  useEffect(() => {
    // 初始化加载所有商品
    applyFilters()
  }, [])

  // 应用所有筛选条件（分类、搜索、排序）
  const applyFilters = () => {
    let filtered = [...mockProductList]

    // 1. 按分类筛选
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory)
    }

    // 2. 按搜索关键词筛选
    // if (searchKeyword.trim()) {
    //   const keyword = searchKeyword.toLowerCase().trim()
    //   filtered = filtered.filter(item =>
    //     item.name.toLowerCase().includes(keyword)  
    //   )
    // }

    // 3. 按价格排序
    if (sortType === 'asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortType === 'desc') {
      filtered.sort((a, b) => b.price - a.price)
    }

    setProductList(filtered)
  }

  // 搜索输入处理
  const handleSearchInput = (e: any) => {
    const keyword = e.detail.value
    setSearchKeyword(keyword)
  }

  // 搜索确认
  const handleSearchConfirm = () => {
    applyFilters()
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

  // 商品点击
  const handleProductClick = (item: ProductItem) => {
    navigateTo(`/pages/joy/components/ElderlyMall/Detail/index?id=${item.id}`);
  }

  return (
    <View className="elderly-mall-page">
      <PageTransitionOverlay />
      <ScrollView scrollY className="mall-scroll">
        {/* 搜索和排序栏 */}
        <View className="search-sort-container">
          <View className="search-box">
            <Input
              className="search-input"
              type="text"
              placeholder="搜索商品"
              value={searchKeyword}
              onInput={handleSearchInput}
              onConfirm={handleSearchConfirm}
              placeholderClass="search-placeholder"
            />
            {searchKeyword ? (
              <Text className="search-clear" onClick={() => {
                setSearchKeyword('')
                setTimeout(() => applyFilters(), 0)
              }}>✕</Text>
            ) : (
              <Text className="search-icon">🔍</Text>
            )}
          </View>
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
                  <Text className="category-text">{category.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 商品列表 */}
        <View className="product-list">
          {productList.length > 0 ? (
            <View className="product-grid">
              {productList.map((item) => (
                <View
                  key={item.id}
                  className="product-card"
                  onClick={() => handleProductClick(item)}
                  hoverClassName="product-card--press"
                >
                  {/* 商品图片 */}
                  <Image
                    src={item.poster}
                    className="product-poster"
                    mode="aspectFill"
                    lazyLoad
                  />

                  {/* 商品信息 */}
                  <View className="product-info">
                    <Text className="product-name">{item.name}</Text>

                    <View className="product-footer">
                      <View className="price-section">
                        <Text className="price-symbol">￥</Text>
                        <Text className="price-value">{item.price}</Text>
                      </View>
                      <Text className="sales-text">已售 {item.sales} 件</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="empty-state">
              <Text className="empty-icon">📦</Text>
              <Text className="empty-text">暂无商品</Text>
            </View>
          )}
        </View>

        {/* 底部留白 */}
        <View className="bottom-spacer"></View>
      </ScrollView>
    </View>
  )
}

export default ElderlyMall
