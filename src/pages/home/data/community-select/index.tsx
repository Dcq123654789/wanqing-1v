import { View, Map, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import CommunitySelector from './components/CommunitySelector'
import { Community } from '@/pages/home/types'
import PageTransitionOverlay from '@/components/PageTransitionOverlay'
import { useUserStore } from '@/store/userStore'
import { fetchCommunities } from './services/community.service'
import './index.scss'

const STORAGE_KEY = 'selectedCommunity'

function CommunitySelect() {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [communities, setCommunities] = useState<Community[]>([])
  const [mapContext, setMapContext] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取用户状态
  const { isLoggedIn, setCommunity, userInfo, initializeAuth } = useUserStore()

  // 加载社区列表
  useEffect(() => {
    // 初始化用户认证状态
    initializeAuth()

    const loadCommunities = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // 获取用户位置（用于按距离排序）
        const location = await Taro.getLocation()

        // 调用真实接口获取社区列表
        const data = await fetchCommunities({
          lat: location.latitude,
          lng: location.longitude,
          deleted: 0 // 只查询未删除的社区
        })

        setCommunities(data.communities || [])

        // 初始化选中的社区
        await initSelectedCommunity(data.communities || [])
      } catch (err: any) {
        console.error('加载社区列表失败:', err)
        setError(err?.message || '加载社区列表失败')

        // 如果获取位置失败，尝试不带位置获取社区列表
        try {
          const data = await fetchCommunities({
            deleted: 0 // 只查询未删除的社区
          })
          setCommunities(data.communities || [])
          await initSelectedCommunity(data.communities || [])
        } catch (retryErr) {
          console.error('重试加载社区列表失败:', retryErr)
        }
      } finally {
        setIsLoading(false)
        // 延迟设置 ready 状态
        setTimeout(() => setIsReady(true), 100)
      }
    }

    loadCommunities()
  }, [])

  // 初始化选中的社区
  const initSelectedCommunity = async (communityList: Community[]) => {
    if (communityList.length === 0) return

    try {
      let saved = null

      // 如果用户已登录且有社区信息，优先使用用户的社区
      if (isLoggedIn && userInfo?.communityId) {
        const userCommunity = communityList.find(c => c._id === userInfo.communityId)
        if (userCommunity) {
          saved = userCommunity
        }
      }

      // 如果用户没有社区信息，尝试从本地存储读取
      if (!saved) {
        const localSaved = Taro.getStorageSync(STORAGE_KEY)
        if (localSaved) {
          // 从本地存储读取的社区可能不在新的社区列表中
          saved = communityList.find(c => c._id === localSaved._id) || localSaved
        }
      }

      if (saved) {
        setSelectedCommunity(saved)
      } else {
        // 默认选择第一个（最近的社区）
        setSelectedCommunity(communityList[0])
      }
    } catch (e) {
      console.error('读取社区信息失败:', e)
      setSelectedCommunity(communityList[0])
    }
  }

  // 页面显示时检查已选择的社区
  useDidShow(() => {
    if (communities.length > 0) {
      initSelectedCommunity(communities)
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
    // markerId从1开始，对应数组索引（从0开始）
    const communityIndex = markerId - 1
    const community = communities[communityIndex]

    if (community) {
      console.log('点击社区标记:', community.name, markerId)
      setSelectedCommunity(community)
      // 移动地图中心到该社区
      mapContext?.moveToLocation({
        latitude: community.latitude,
        longitude: community.longitude
      })
    } else {
      console.error('未找到对应的社区:', markerId, communities.length)
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
  const handleConfirm = async () => {
    console.log('开始确认选择社区:', selectedCommunity?.name)

    if (!selectedCommunity) {
      console.log('没有选择社区')
      Taro.showToast({
        title: '请先选择社区',
        icon: 'none'
      })
      return
    }

    try {
      console.log('用户登录状态:', isLoggedIn)
      console.log('用户信息:', userInfo)

      // 如果用户已登录，将社区绑定到用户账号
      if (isLoggedIn) {
        console.log('绑定社区到用户账号:', selectedCommunity._id, selectedCommunity.name)
        await setCommunity(selectedCommunity._id, selectedCommunity.name)
        console.log('社区绑定成功')
      } else {
        console.log('用户未登录，保存到本地存储')
        // 未登录状态，只保存到本地存储
        Taro.setStorageSync(STORAGE_KEY, selectedCommunity)
        console.log('本地存储保存成功')
      }

      Taro.showToast({
        title: '选择成功',
        icon: 'success',
        duration: 1500
      })

      // 发送事件通知home页面刷新社区信息
      Taro.eventCenter.trigger('communitySelected', {
        communityId: selectedCommunity._id,
        communityName: selectedCommunity.name,
        isLoggedIn
      })

      setTimeout(() => {
        console.log('准备返回上一页')
        Taro.navigateBack()
      }, 1500)
    } catch (e: any) {
      console.error('保存社区信息失败:', e)
      Taro.showToast({
        title: e?.message || '保存失败，请重试',
        icon: 'none'
      })
    }
  }

  // 准备地图标记点
  const markers = communities.map((community, index) => ({
    id: index + 1, // 使用数组索引作为marker id（从1开始）
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
  const mapCenter = selectedCommunity || communities[0] || { latitude: 39.9042, longitude: 116.4074 }

  // 加载中状态
  if (isLoading) {
    return (
      <View className="page-container loading-container">
        <PageTransitionOverlay />
        <View className="loading-content">
          <Text className="loading-text">加载中...</Text>
        </View>
      </View>
    )
  }

  // 错误状态
  if (error && communities.length === 0) {
    return (
      <View className="page-container error-container">
        <PageTransitionOverlay />
        <View className="error-content">
          <Text className="error-icon">⚠️</Text>
          <Text className="error-title">加载失败</Text>
          <Text className="error-message">{error}</Text>
          <View className="retry-btn" onClick={() => Taro.reLaunch({ url: '/pages/home/data/community-select/index' })}>
            <Text>重试</Text>
          </View>
        </View>
      </View>
    )
  }

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
              <Text className="info-value">
                {[selectedCommunity.province, selectedCommunity.city, selectedCommunity.district, selectedCommunity.detailAddress]
                  .filter(Boolean)
                  .join('') || '暂无地址信息'}
              </Text>
            </View>
            <View className="info-row">
              <Text className="info-label">距离</Text>
              <Text className="info-value">
                {selectedCommunity.distance !== undefined
                  ? (selectedCommunity.distance < 1
                      ? `${Math.round(selectedCommunity.distance * 1000)}米`
                      : `${selectedCommunity.distance.toFixed(1)}公里`)
                  : '距离未知'}
              </Text>
            </View>
            <View className="info-row">
              <Text className="info-label">服务时间</Text>
              <Text className="info-value">全天 24 小时</Text>
            </View>
            <View className="info-row">
              <Text className="info-label">联系电话</Text>
              <Text className="info-value">{selectedCommunity.contactPhone || '400-888-8888'}</Text>
            </View>
            <View className="info-row">
              <Text className="info-label">负责人</Text>
              <Text className="info-value">{selectedCommunity.contactPerson || '暂无'}</Text>
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
