import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Banner } from '../../types'
import './index.scss'

interface BannerSwiperProps {
  data: Banner[]
  autoplay?: boolean
  interval?: number
  onChange?: (index: number) => void
  onItemClick?: (item: Banner) => void
}

function BannerSwiper({
  data,
  autoplay = true,
  interval = 3000,
  onChange,
  onItemClick
}: BannerSwiperProps) {
  const handleChange = (e: any) => {
    const index = e.detail.current
    onChange?.(index)
  }

  const handleClick = (item: Banner) => {
    onItemClick?.(item)
    if (item.link) {
      // 判断是否是 Tab 页面
      const tabPages = ['/pages/joy/index', '/pages/care/index', '/pages/profile/index']
      if (tabPages.includes(item.link)) {
        Taro.switchTab({ url: item.link })
      } else {
        Taro.navigateTo({ url: item.link })
      }
    }
  }

  return (
    <View className="banner-swiper">
      <Swiper
        className="banner-container"
        autoplay={autoplay}
        interval={interval}
        circular
        indicatorDots
        indicatorColor="rgba(255, 255, 255, 0.5)"
        indicatorActiveColor="#ff9800"
        onChange={handleChange}
      >
        {data.map((item) => (
          <SwiperItem key={item.id}>
            <View className="banner-item" onClick={() => handleClick(item)}>
              <Image
                src={item.image}
                mode="aspectFill"
                className="banner-image"
                lazyLoad
              />
              <View className="banner-title">{item.title}</View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  )
}

export default BannerSwiper
