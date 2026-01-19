import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

import { navigateTo } from "@/utils/navigation";
interface ServiceItem {
  id: string
  icon: string
  title: string
  route: string
  color?: string
}

interface ServiceStripProps {
  data?: ServiceItem[]
}

// 默认业务入口数据 - 一行5个
const defaultServiceData: ServiceItem[] = [
  {
    id: '1',
    title: '社区活动',
    icon: '🎉',
    route: '/pages/joy/components/CommunityActivity/index',
    color: '#FF6B6B'
  },
  {
    id: '2',
    title: '老年商城',
    icon: '🛒',
    route: '/pages/joy/components/ElderlyMall/index',
    color: '#4ECDC4'
  },
  {
    id: '3',
    title: '上门服务1',
    icon: '🔧',
    route: '/pages/joy/components/HomeService/index',
    color: '#45B7D1'
  },
  {
    id: '4',
    title: '健康咨询',
    icon: '👨‍⚕️',
    route: '',
    color: '#FF6B9D'
  },
  {
    id: '5',
    title: '康养预订',
    icon: '🏥',
    route: '',
    color: '#9B59B6'
  }
]

function ServiceStrip({ data = defaultServiceData }: ServiceStripProps) {

  const handleClick = (item: ServiceItem) => {
    if (!item.route) {
      Taro.showToast({
        title: '功能开发中',
        icon: 'none'
      })
      return
    }
   navigateTo( item.route); 
  }

  return (
    <View className="service-strip">
      {data.map((item) => (
        <View
          key={item.id}
          className="service-strip-item"
          onClick={() => handleClick(item)}
          hoverClassName="service-strip-item--press"
        >
          <View
            className="service-icon"
            style={{ background: `${item.color || '#FF8C00'}15` }}
          >
            <Text className="icon-emoji">{item.icon}</Text>
          </View>
          <Text className="service-title">{item.title}</Text>
        </View>
      ))}
    </View>
  )
}

export default ServiceStrip
