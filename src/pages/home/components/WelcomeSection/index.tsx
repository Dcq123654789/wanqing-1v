import { View, Text } from '@tarojs/components'
import { useUserStore } from '@/store/userStore'
import { useState, useEffect } from 'react'
import './index.scss'

interface WelcomeSectionProps {
  subtitle?: string
}

interface WeatherInfo {
  icon: string
  text: string
  temperature: string
}

function WelcomeSection({ subtitle = '欢迎使用晚晴' }: WelcomeSectionProps) {
  const { userInfo } = useUserStore()
  // 使用与Profile页面相同的用户名显示优先级
  const username = userInfo?.realName || userInfo?.nickname || userInfo?.username || '访客'

  // 获取时间段问候语
  const [greeting, setGreeting] = useState('早上好')
  const [dateInfo, setDateInfo] = useState('')
  const [weather, setWeather] = useState<WeatherInfo>({
    icon: '🌤️',
    text: '多云',
    temperature: '15°C'
  })

  useEffect(() => {
    // 获取当前时间段的问候语
    const hour = new Date().getHours()
    if (hour < 6) {
      setGreeting('凌晨好')
    } else if (hour < 9) {
      setGreeting('早上好')
    } else if (hour < 12) {
      setGreeting('上午好')
    } else if (hour < 14) {
      setGreeting('中午好')
    } else if (hour < 17) {
      setGreeting('下午好')
    } else if (hour < 19) {
      setGreeting('傍晚好')
    } else {
      setGreeting('晚上好')
    }

    // 获取日期信息
    const now = new Date()
    const month = now.getMonth() + 1
    const date = now.getDate()
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']
    const weekDay = weekDays[now.getDay()]

    setDateInfo(`${month}月${date}日 周${weekDay}`)

    // TODO: 这里可以接入真实的天气 API
    // 模拟天气数据
    const weatherTypes = [
      { icon: '☀️', text: '晴' },
      { icon: '🌤️', text: '多云' },
      { icon: '☁️', text: '阴' },
      { icon: '🌧️', text: '小雨' },
      { icon: '❄️', text: '雪' }
    ]
    const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)]
    setWeather({
      icon: randomWeather.icon,
      text: randomWeather.text,
      temperature: `${Math.floor(Math.random() * 20 + 5)}°C`
    })
  }, [])

  return (
    <View className="welcome-section">
      <View className="welcome-content">
        <Text className="welcome-text">{greeting}，{username} 👋</Text>
        <View className="weather-info">
          <Text className="weather-icon">{weather.icon}</Text>
          <Text className="weather-text">{dateInfo}  {weather.text}  {weather.temperature}</Text>
        </View>
      </View>
    </View>
  )
}

export default WelcomeSection
