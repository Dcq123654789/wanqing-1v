import { View, Map, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import CommunitySelector from './components/CommunitySelector'
import { Community } from '@/pages/home/types'
import { mockCommunities } from '@/pages/home/mockData'
import './index.scss'

const STORAGE_KEY = 'selectedCommunity'

function CommunitySelect() {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [communities] = useState<Community[]>(mockCommunities)
  const [mapContext, setMapContext] = useState<any>(null)

  // 页面显示时检查已选择的社区
  useDidShow(() => {
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
    iconPath: '',
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

      {/* 中心社区选择器 */}
      <View className="selector-container">
        <CommunitySelector
          communities={communities}
          selected={selectedCommunity}
          onChange={handleCommunityChange}
          onConfirm={handleConfirm}
        />
      </View>
    </View>
  )
}

export default CommunitySelect
