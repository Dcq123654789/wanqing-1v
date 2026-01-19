import { View, Map } from '@tarojs/components'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import PageTransitionOverlay from '@/components/PageTransitionOverlay'
import type { MapMarker } from './types'
import './index.scss'

function MapView() {
  const router = useRouter()

  // 地图数据
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [markers, setMarkers] = useState<MapMarker[]>([])

  // 页面显示时隐藏遮罩
  useDidShow(() => {
    console.log('地图视图页面显示，开始隐藏遮罩流程')
    console.log('当前页面参数:', router.params)

    // 延迟一小段时间，确保页面完全渲染
    setTimeout(() => {
      console.log('地图视图页面触发隐藏遮罩事件')
      Taro.eventCenter.trigger('hidePageTransition')
    }, 100)
  })

  useEffect(() => {
    // 解析路由参数
    const params = router.params
    const lat = parseFloat(params.lat || '0')
    const lng = parseFloat(params.lng || '0')
    const name = params.name || '活动地点'

    if (lat && lng) {
      setLatitude(lat)
      setLongitude(lng)

      // 创建标记点
      setMarkers([{
        id: 1,
        latitude: lat,
        longitude: lng,
        title: name,
        width: 25,
        height: 35
      }])
    } else {
      Taro.showToast({
        title: '位置信息错误',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    }
  }, [router.params])

  if (!latitude || !longitude) {
    return <View></View>
  }

  return (
    <View className="map-view-page">
      <PageTransitionOverlay />
      {/* 地图 */}
      <Map
        id="activity-map"
        className="activity-map"
        latitude={latitude}
        longitude={longitude}
        scale={16}
        markers={markers}
        showLocation={true}
      ></Map>
    </View>
  )
}

export default MapView
