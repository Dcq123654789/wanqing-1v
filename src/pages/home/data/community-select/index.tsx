import { View, Map, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import CommunitySelector from './components/CommunitySelector'
import { Community } from '@/pages/home/types'
import { mockCommunities } from '@/pages/home/mockData'
import PageTransitionOverlay from '@/components/PageTransitionOverlay'
import './index.scss'

const STORAGE_KEY = 'selectedCommunity'

function CommunitySelect() {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [communities] = useState<Community[]>(mockCommunities)
  const [mapContext, setMapContext] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)

  // 初始化时设置默认社区
  useEffect(() => {
    const initCommunity = () => {
      try {
        const saved = Taro.getStorageSync(STORAGE_KEY)
        if (saved) {
          setSelectedCommunity(saved)
        } else {
          // 默认选择第一个
          setSelectedCommunity(communities[0])
        }
      } catch (e) {
        console.error('读取社区信息失败:', e)
        setSelectedCommunity(communities[0])
      }

      // 延迟设置 ready 状态，让页面先渲染骨架
      setTimeout(() => setIsReady(true), 100)
    }

    initCommunity()
  }, [])

  // 页面显示时检查已选择的社区
  useDidShow(() => {
    try {
      const saved = Taro.getStorageSync(STORAGE_KEY)
      if (saved) {
        setSelectedCommunity(saved)
      }
    } catch (e) {
      console.error('读取社区信息失败:', e)
    }
  })

  // 地图加载完成
  const handleMapReady = () => {
    const ctx = Taro.createMapContext('communityMap')
    setMapContext(ctx)
  }

  // 地图标记点击
  const handleMarkerTap = (e: any) => {
    const markerId = e.markerId
    const community = communities.find(c => c.id === String(markerId))
    if (community) {
      setSelectedCommunity(community)
      // 移动地图中心到该社区
      mapContext?.moveToLocation({
        latitude: community.latitude,
        longitude: community.longitude
      })
    }
  }

  // 处理社区选择变化
  const handleCommunityChange = (community: Community) => {
    setSelectedCommunity(community)
    // 移动地图中心到选中的社区
    mapContext?.moveToLocation({
      latitude: community.latitude,
      longitude: community.longitude
    })
  }

  // 处理确认选择
  const handleConfirm = () => {
    if (!selectedCommunity) {
      Taro.showToast({
        title: '请先选择社区',
        icon: 'none'
      })
      return
    }

    try {
      Taro.setStorageSync(STORAGE_KEY, selectedCommunity)

      Taro.showToast({
        title: '选择成功',
        icon: 'success',
        duration: 1500
      })

      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (e) {
      console.error('保存社区信息失败:', e)
      Taro.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      })
    }
  }

  // 准备地图标记点
  const markers = communities.map(community => ({
    id: parseInt(community.id),
    latitude: community.latitude,
    longitude: community.longitude,
    title: community.name,
    width: 30,
    height: 30,
    customCallout: {
      content: community.name,
      display: 'BYCLICK',
      textAlign: 'center'
    }
  }))

  // 地图中心点（使用选中社区的位置）
  const mapCenter = selectedCommunity || communities[0]

  return (
    <View className="page-container">
      {/* 全局页面过渡遮罩 */}
      <PageTransitionOverlay />

      {/* 地图 */}
      <Map
        id="communityMap"
        className="community-map"
        latitude={mapCenter.latitude}
        longitude={mapCenter.longitude}
        markers={markers}
        onMarkerTap={handleMarkerTap}
        onReady={handleMapReady}
        scale={14}
        showLocation
      />

      {/* 顶部标题 */}
      <View className="page-header">
        <Text className="page-title">选择您的社区</Text>
        <Text className="page-subtitle">在地图上选择您所在的社区</Text>
      </View>

      {/* 右上角下拉选择器 */}
      <CommunitySelector
        communities={communities}
        selected={selectedCommunity}
        onChange={handleCommunityChange}
      />

      {/* 社区信息卡片 */}
      {isReady && selectedCommunity && (
        <View className="community-info-card">
          {/* 卡片头部 */}
          <View className="card-header">
            <Text className="card-title">{selectedCommunity.name}</Text>
            <Text className="card-status">服务中</Text>
          </View>

          {/* 卡片内容 */}
          <View className="card-content">
            <View className="info-row">
              <Text className="info-label">社区地址</Text>
              <Text className="info-value">{selectedCommunity.address}</Text>
            </View>
            <View className="info-row">
              <Text className="info-label">服务时间</Text>
              <Text className="info-value">全天 24 小时</Text>
            </View>
            <View className="info-row">
              <Text className="info-label">联系电话</Text>
              <Text className="info-value">400-888-8888</Text>
            </View>
          </View>

          {/* 确认按钮 */}
          <View className="card-footer">
            <View className="confirm-btn" onClick={handleConfirm}>
              <Text>确定选择</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default CommunitySelect
