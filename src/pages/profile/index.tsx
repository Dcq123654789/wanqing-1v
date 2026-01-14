import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useUserStore } from '@/store/userStore'
import Taro from '@tarojs/taro'
import './index.scss'

function Profile() {
  const { userInfo, logout } = useUserStore()

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout()
          Taro.reLaunch({
            url: '/pages/login/index'
          })
        }
      }
    })
  }

  const menuItems = [
    { id: 1, icon: '👤', title: '个人信息', desc: '编辑个人资料' },
    { id: 2, icon: '⚙️', title: '设置', desc: '应用设置' },
    { id: 3, icon: '❓', title: '帮助与反馈', desc: '常见问题' },
    { id: 4, icon: '📞', title: '联系我们', desc: '客服热线' },
  ]

  return (
    <View className="profile-page">
      <ScrollView scrollY className="profile-scroll">
        {/* 头部背景 */}
        <View className="profile-header">
          <Image
            src={require('../../assets/images/backgrounds/profile-bg.jpg')}
            className="header-bg"
            mode="aspectFill"
          />
          <View className="header-overlay" />

          {/* 用户信息 */}
          <View className="user-info">
            <Image
              src={userInfo?.avatar || require('../../assets/images/icons/icon-login-user.png')}
              className="user-avatar"
            />
            <Text className="user-name">{userInfo?.username || '未登录'}</Text>
            <Text className="user-desc">享受美好晚年生活</Text>
          </View>
        </View>

        {/* 内容区域 */}
        <View className="content-container">
          {/* 数据统计 */}
          <View className="stats-card">
            <View className="stat-item">
              <Text className="stat-value">128</Text>
              <Text className="stat-label">活动</Text>
            </View>
            <View className="stat-divider" />
            <View className="stat-item">
              <Text className="stat-value">56</Text>
              <Text className="stat-label">关注</Text>
            </View>
            <View className="stat-divider" />
            <View className="stat-item">
              <Text className="stat-value">32</Text>
              <Text className="stat-label">收藏</Text>
            </View>
          </View>

          {/* 菜单列表 */}
          <View className="menu-section">
            {menuItems.map(item => (
              <View key={item.id} className="menu-item">
                <View className="menu-icon">{item.icon}</View>
                <View className="menu-content">
                  <Text className="menu-title">{item.title}</Text>
                  <Text className="menu-desc">{item.desc}</Text>
                </View>
                <View className="menu-arrow">›</View>
              </View>
            ))}
          </View>

          {/* 退出登录按钮 */}
          <View className="logout-section">
            <Text className="logout-button" onClick={handleLogout}>退出登录</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Profile
