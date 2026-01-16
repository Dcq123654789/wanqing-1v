import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface QuickNavItem {
  id: string
  title: string
  icon: string
  route: string
  color?: string
}

interface QuickNavProps {
  data?: QuickNavItem[]
}

// 默认的8个服务入口
const defaultQuickNavData: QuickNavItem[] = [
  {
    id: '1',
    title: '社区活动',
    icon: '🎉',
    route: '/pages/joy/index',
    color: '#FF6B6B'
  },
  {
    id: '2',
    title: '老年商城',
    icon: '🛒',
    route: '',
    color: '#4ECDC4'
  },
  {
    id: '3',
    title: '上门服务',
    icon: '🔧',
    route: '/pages/care/index',
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
  },
  {
    id: '6',
    title: '旅游报名',
    icon: '✈️',
    route: '',
    color: '#3498DB'
  },
  {
    id: '7',
    title: '养生课堂',
    icon: '📚',
    route: '',
    color: '#1ABC9C'
  },
  {
    id: '8',
    title: '更多服务',
    icon: '⋯️',
    route: '',
    color: '#95A5A6'
  }
]

function QuickNav({ data = defaultQuickNavData }: QuickNavProps) {

  const handleClick = (item: QuickNavItem) => {
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
    <View className="quick-nav">
      <View className="quick-nav-grid">
        {data.map((item) => (
          <View
            key={item.id}
            className="quick-nav-item"
            onClick={() => handleClick(item)}
            hoverClassName="quick-nav-item--press"
          >
            <View
              className="quick-nav-icon"
              style={{ background: `${item.color || '#FF8C00'}15` }}
            >
              <Text className="icon-emoji">{item.icon}</Text>
            </View>
            <Text className="quick-nav-title">{item.title}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default QuickNav
