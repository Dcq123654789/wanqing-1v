import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import WelcomeSection from './components/WelcomeSection'
import BannerSwiper from './components/BannerSwiper'
import ServiceGrid from './components/ServiceGrid'
import NotificationBar from './components/NotificationBar'
import ActivityCard from './components/ActivityCard'
import { mockBanners, mockServices, mockNotifications, mockActivities } from './mockData'
import { Banner, ServiceEntry, Activity } from './types'
import './index.scss'

function Home() {
  // 处理轮播图点击
  const handleBannerClick = (banner: Banner) => {
    console.log('点击轮播图:', banner)
  }

  // 处理服务入口点击
  const handleServiceClick = (service: ServiceEntry) => {
    console.log('点击服务:', service)
  }

  // 处理活动点击
  const handleActivityClick = (activity: Activity) => {
    Taro.showToast({
      title: `查看活动：${activity.title}`,
      icon: 'none'
    })
  }

  return (
    <View className="home-page">
      <ScrollView scrollY className="home-scroll">
        {/* 欢迎区 */}
        <WelcomeSection />

        {/* 轮播海报 */}
        <BannerSwiper
          data={mockBanners}
          onItemClick={handleBannerClick}
        />

        {/* 通知栏 */}
        <NotificationBar data={mockNotifications} />

        {/* 服务入口 */}
        <View className="section">
          <Text className="section-title">服务中心</Text>
          <ServiceGrid
            data={mockServices}
            onItemClick={handleServiceClick}
          />
        </View>

        {/* 活动推荐 */}
        <View className="section">
          <Text className="section-title">为您推荐</Text>
          <ScrollView scrollX className="activities-scroll">
            <View className="activities-list">
              {mockActivities.map(activity => (
                <ActivityCard
                  key={activity.id}
                  data={activity}
                  onClick={handleActivityClick}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  )
}

export default Home
