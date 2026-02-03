import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useUserStore } from '@/store/userStore'
import Taro from '@tarojs/taro'
import './index.scss'

function Profile() {
  const { userInfo, logout } = useUserStore()
  const [statusBarHeight, setStatusBarHeight] = useState(0)

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync()
    setStatusBarHeight(systemInfo.statusBarHeight || 0)
  }, [])

  // 将性别数字转换为可读文本
  const getGenderText = (gender?: number): string => {
    if (gender === 1) return '男'
    if (gender === 2) return '女'
    return '未知'
  }

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

  // 订单类型
  const orderTypes = [
    { id: 1, icon: '🛒', title: '商品订单', count: 3 },
    { id: 2, icon: '🛍️', title: '服务订单', count: 2 },
    { id: 3, icon: '🎭', title: '我的活动', count: 5 },
    { id: 4, icon: '✈️', title: '旅游订单', count: 1 },
  ]

  // 设置菜单
  const settingItems = [
    { id: 1, icon: '🛡️', title: '隐私政策', desc: '查看隐私条款', route: '/pages/login/privacy/index' },
    { id: 2, icon: '📄', title: '用户协议', desc: '服务使用条款', route: '/pages/login/agreement/index' },
    { id: 3, icon: '📞', title: '联系客服', desc: '在线客服', route: '/pages/profile/support' },
  ]

  const handleOrderClick = (orderType: typeof orderTypes[0]) => {
    Taro.showToast({
      title: `${orderType.title}功能开发中`,
      icon: 'none',
      duration: 2000
    })
  }

  const handleSettingClick = (item: typeof settingItems[0]) => {
    if (item.route) {
      Taro.navigateTo({
        url: item.route,
        fail: () => {
          Taro.showToast({
            title: '功能开发中',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  }

  // 点击用户信息区域，跳转到编辑页面
  const handleEditProfile = () => {
    Taro.navigateTo({
      url: '/pages/login/complete-info/index?mode=edit'
    })
  }

  return (
    <View className="profile-page">
      {/* 状态栏占位 */}
      <View className="status-bar" style={{ height: `${statusBarHeight}px` }} />

      <ScrollView scrollY className="profile-scroll">
        {/* 头部背景 */}
        <View className="profile-header">
          <Image
            src={require('../../assets/images/backgrounds/profile-bg.jpg')}
            className="header-bg"
            mode="aspectFill"
          /> 
          <View className="header-overlay" />
 
          {/* 用户信息 - 点击可编辑 */}
          <View className="user-info" onClick={handleEditProfile}>
            <Image
              src={userInfo?.avatar || require('../../assets/images/icons/icon-login-user.png')}
              className="user-avatar"
            />
            <View className="user-details">
              <Text className="user-name">{userInfo?.realName || userInfo?.nickname || userInfo?.username || '未登录'}</Text>
              <View className="user-meta">
                <Text className="user-desc">
                  {getGenderText(userInfo?.gender)} · 享受美好晚年生活
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 内容区域 */}
        <View className="content-container">
          {/* 订单列表 */}
          <View className="orders-section">
            <View className="section-header">
              <Text className="section-title">我的订单</Text> 
            </View>
            <View className="orders-grid">
              {orderTypes.map(order => (
                <View
                  key={order.id}
                  className="order-card"
                  onClick={() => handleOrderClick(order)}
                >
                  <View className="order-icon-wrapper">
                    <View className="order-icon">{order.icon}</View> 
                  </View>
                  <Text className="order-title">{order.title}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 设置菜单 */}
          <View className="settings-section">
            <Text className="section-title">设置与帮助</Text>
            <View className="settings-list">
              {settingItems.map(item => (
                <View key={item.id} className="setting-item" onClick={() => handleSettingClick(item)}>
                  <View className="setting-icon">{item.icon}</View>
                  <View className="setting-content">
                    <Text className="setting-title">{item.title}</Text>
                    <Text className="setting-desc">{item.desc}</Text>
                  </View>
                  <View className="setting-arrow">›</View>
                </View>
              ))}
            </View>
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
