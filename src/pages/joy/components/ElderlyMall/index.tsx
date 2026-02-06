import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect, useMemo, useCallback } from 'react'
import type { ProductItem, SortType } from './types'
import { CATEGORY_MAP, getCategoryValue, ProductCategory } from './types'
import type { PageResponse } from '@/utils/request'
import { getProductListByBatch } from '@/services/api'
import './index.scss'
import PageTransitionOverlay from "@/components/PageTransitionOverlay"
import { navigateTo } from "@/utils/navigation"

function ElderlyMall() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [sortType, setSortType] = useState<SortType>('none')
  const [allProducts, setAllProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // 商品分类列表
  const categories = useMemo(() => Object.values(CATEGORY_MAP), [])

  // 初始化加载商品
  useEffect(() => {
    fetchAllProducts()
  }, [])

  // 从后端获取所有商品
  const fetchAllProducts = async () => {
    setLoading(true)
    try {
      const response = await getProductListByBatch({
        keyword: '',
        page: 1,
        pageSize: 100,
        sort: { createTime: 'desc' }
      })

      if (response.code === 200 && response.data) {
        const pageData = response.data as PageResponse<any>
        const dataList = pageData.content || []

        const products: ProductItem[] = dataList.map((item: any) => ({
          id: item._id,
          name: item.name,
          price: Number(item.price),
          poster: item.poster,
          sales: item.sales || 0,
          category: item.category ?? ProductCategory.ALL
        }))

        setAllProducts(products)
      } else {
        Taro.showToast({
          title: response.message || '加载失败',
          icon: 'none'
        })
        setAllProducts([])
      }
    } catch (error) {
      console.error('获取商品列表失败:', error)
      Taro.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none',
        duration: 2000
      })
      setAllProducts([])
    } finally {
      setLoading(false)
    }
  }

  // 使用 useMemo 进行前端过滤，避免闭包问题
  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    // 1. 按分类筛选
    if (activeCategory !== 'all') {
      const categoryValue = getCategoryValue(activeCategory)
      result = result.filter(item => item.category === categoryValue)
    }

    // 2. 按搜索关键词筛选
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim()
      result = result.filter(item =>
        item.name.toLowerCase().includes(keyword)
      )
    }

    // 3. 按价格排序
    if (sortType === 'price_asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortType === 'price_desc') {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [allProducts, activeCategory, searchKeyword, sortType])

  // 搜索输入处理
  const handleSearchInput = useCallback((e: any) => {
    const keyword = e.detail.value
    setSearchKeyword(keyword)
  }, [])

  // 执行搜索
  const handleSearch = useCallback(() => {
    // 过滤会自动通过 useMemo 更新，这里可以添加搜索反馈
    if (searchKeyword.trim()) {
      console.log('搜索关键词:', searchKeyword)
    }
  }, [searchKeyword])

  // 清除搜索
  const handleClearSearch = useCallback(() => {
    setSearchKeyword('')
  }, [])

  // 切换分类
  const handleCategoryChange = useCallback((categoryKey: string) => {
    setActiveCategory(categoryKey)
  }, [])

  // 切换价格排序
  const handleSortToggle = useCallback(() => {
    setSortType(prev => {
      const next: SortType = prev === 'none' ? 'price_asc' : prev === 'price_asc' ? 'price_desc' : 'none'

      // 显示提示
      const sortTextMap: Record<SortType, string> = {
        'none': '取消排序',
        'price_asc': '价格从低到高',
        'price_desc': '价格从高到低'
      }
      Taro.showToast({
        title: sortTextMap[next],
        icon: 'none',
        duration: 1500
      })

      return next
    })
  }, [])

  // 获取排序按钮文本
  const getSortButtonText = useCallback(() => {
    if (sortType === 'price_asc') return '价格↑'
    if (sortType === 'price_desc') return '价格↓'
    return '价格排序'
  }, [sortType])

  // 商品点击
  const handleProductClick = useCallback((item: ProductItem) => {
    navigateTo(`/pages/joy/components/ElderlyMall/Detail/index?id=${item.id}`)
  }, [])

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
              placeholderClass="search-placeholder"
            />
            {searchKeyword ? (
              <Text className="search-clear" onClick={handleClearSearch}>✕</Text>
            ) : (
              <Text className="search-icon">🔍</Text>
            )}
          </View>
          <View className="search-button" onClick={handleSearch}>
            <Text className="search-button-text">搜索</Text>
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
          {loading ? (
            <View className="loading-state">
              <Text className="loading-text">加载中...</Text>
            </View>
          ) : filteredProducts.length > 0 ? (
            <View className="product-grid">
              {filteredProducts.map((item) => (
                <View
                  key={item.id}
                  className="product-card"
                  onClick={() => handleProductClick(item)}
                  hoverClassName="product-card--press"
                >
                  <Image
                    src={item.poster}
                    className="product-poster"
                    mode="aspectFill"
                    lazyLoad
                  />
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
