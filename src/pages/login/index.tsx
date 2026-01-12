import { useState } from 'react'
import { View, Image, Input, Button, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useUserStore } from '@/store/userStore'
import './index.scss'

interface LoginState {
  username: string
  password: string
  showPassword: boolean
  loading: boolean
}

function Login() {
  const [state, setState] = useState<LoginState>({
    username: '',
    password: '',
    showPassword: false,
    loading: false
  })

  const { login } = useUserStore()

  const handleUsernameChange = (e: any) => {
    setState(prev => ({ ...prev, username: e.detail.value }))
  }

  const handlePasswordChange = (e: any) => {
    setState(prev => ({ ...prev, password: e.detail.value }))
  }

  const togglePasswordVisibility = () => {
    setState(prev => ({ ...prev, showPassword: !prev.showPassword }))
  }

  const handleLogin = async () => {
    const { username, password } = state

    if (!username.trim()) {
      Taro.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return
    }

    if (!password.trim()) {
      Taro.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }

    setState(prev => ({ ...prev, loading: true }))

    try {
      const success = await login(username, password)

      if (success) {
        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        })

        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/home/index'
          })
        }, 1000)
      } else {
        Taro.showToast({
          title: '登录失败',
          icon: 'error'
        })
      }
    } catch (error) {
      Taro.showToast({
        title: '登录失败',
        icon: 'error'
      })
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  return (
    <View className="login-page">
      <View className="login-background">
        <Image
          src={require('../../../assets/images/backgrounds/login-bg.jpg')}
          className="bg-image"
          mode="aspectFill"
        />
        <View className="bg-overlay" />
      </View>

      <View className="login-container">
        <View className="login-header">
          <Image
            src={require('../../../assets/images/icons/icon-logo.png')}
            className="logo"
          />
          <Text className="app-name">晚晴</Text>
          <Text className="app-slogan">温暖相伴，幸福晚年</Text>
        </View>

        <View className="login-form">
          <View className="form-item">
            <View className="input-wrapper">
              <Image
                src={require('../../../assets/images/icons/icon-login-user.png')}
                className="input-icon"
              />
              <Input
                className="input-field"
                placeholder="请输入用户名"
                value={state.username}
                onInput={handleUsernameChange}
                placeholderClass="input-placeholder"
              />
            </View>
          </View>

          <View className="form-item">
            <View className="input-wrapper">
              <Image
                src={require('../../../assets/images/icons/icon-password.png')}
                className="input-icon"
              />
              <Input
                className="input-field"
                placeholder="请输入密码"
                password={!state.showPassword}
                value={state.password}
                onInput={handlePasswordChange}
                placeholderClass="input-placeholder"
              />
              <Image
                src={require(`../../../assets/images/icons/icon-eye${state.showPassword ? '-off' : ''}.png`)}
                className="eye-icon"
                onClick={togglePasswordVisibility}
              />
            </View>
          </View>

          <Button
            className={`login-button ${state.loading ? 'loading' : ''}`}
            onClick={handleLogin}
            disabled={state.loading}
          >
            {state.loading ? '登录中...' : '登录'}
          </Button>
        </View>

        <View className="login-footer">
          <Text className="footer-text">登录即表示同意《用户协议》和《隐私政策》</Text>
        </View>
      </View>
    </View>
  )
}

export default Login
