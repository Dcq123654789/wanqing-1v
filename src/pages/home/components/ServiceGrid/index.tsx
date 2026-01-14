import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { ServiceEntry } from '../../types'
import './index.scss'

interface ServiceGridProps {
  data: ServiceEntry[]
  columns?: number
  onItemClick?: (item: ServiceEntry) => void
}

function ServiceGrid({ data, columns = 3, onItemClick }: ServiceGridProps) {
  const handleClick = (item: ServiceEntry) => {
    onItemClick?.(item)

    if (!item.route) {
      Taro.showToast({
        title: '功能开发中',
        icon: 'none'
      })
      return
    }

    // 判断是否是 Tab 页面
    const tabPages = ['/pages/joy/index', '/pages/care/index', '/pages/profile/index']
    if (tabPages.includes(item.route)) {
      Taro.switchTab({ url: item.route })
    } else {
      Taro.navigateTo({ url: item.route })
    }
  }

  return (
    <View className="service-grid">
      {data.map((item) => (
        <View
          key={item.id}
          className="service-item"
          onClick={() => handleClick(item)}
          hoverClassName="service-item--press"
        >
          <Image src={item.icon} mode="aspectFit" className="service-icon" />
          <Text className="service-title">{item.title}</Text>
        </View>
      ))}
    </View>
  )
}

export default ServiceGrid
