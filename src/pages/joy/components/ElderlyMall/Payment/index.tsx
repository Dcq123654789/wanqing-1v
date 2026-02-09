import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { query } from '@/utils/request'
import './index.scss'
import PageTransitionOverlay from '@/components/PageTransitionOverlay'

function Payment() {
  const [orderId, setOrderId] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)
  const [expireTime, setExpireTime] = useState<number>(0)
  const [selectedMethod, setSelectedMethod] = useState<string>('wechat')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(1 * 60) // 1分钟倒计时

  useEffect(() => {
    const instance = Taro.getCurrentInstance()
    const params = instance.router?.params

    if (params) {
      setOrderId(params.orderId || '')
      setAmount(params.amount ? parseFloat(params.amount) : 0)
      const expire = params.expireTime ? parseInt(params.expireTime) : 0
      setExpireTime(expire)

      // 计算倒计时秒数
      if (expire > 0) {
        const seconds = Math.max(0, expire - Math.floor(Date.now() / 1000))
        setCountdown(seconds)
      }
    }

    // 开始倒计时
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 订单超时处理
  const handleTimeout = () => {
    Taro.showToast({
      title: '订单已超时',
      icon: 'none',
      duration: 2000
    })
    setTimeout(() => {
      Taro.redirectTo({
        url: '/pages/joy/components/ElderlyMall/index'
      })
    }, 2000)
  }

  // 格式化倒计时
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 选择支付方式
  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method)
  }

  // 确认支付
  const handleConfirmPay = async () => {
    if (countdown <= 0) {
      Taro.showToast({
        title: '订单已超时',
        icon: 'none'
      })
      return
    }

    setLoading(true)

    try {
      // 调用后端支付接口
      const response = await query<any>('order', {
        action: 'pay_custom',
        conditions: { _id: orderId }
      })

      if (response.code === 200 || response.success) {
        Taro.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })

        // 返回首页
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/joy/components/ElderlyMall/index'
          })
        }, 2000)
      } else {
        throw new Error(response.message || '支付失败')
      }
    } catch (error: any) {
      console.error('支付失败:', error)
      Taro.showToast({
        title: error.message || '支付失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 取消支付
  const handleCancelPay = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要取消支付吗？订单将在1分钟后自动取消。',
      success: (res) => {
        if (res.confirm) {
          Taro.navigateBack()
        }
      }
    })
  }

  return (
    <View className="payment-page">
      <PageTransitionOverlay />

      {/* 倒计时提示 */}
      <View className="countdown-bar">
        <Text className="countdown-text">
          支付剩余时间: {formatCountdown(countdown)}
        </Text>
      </View>

      {/* 金额信息 */}
      <View className="amount-section">
        <Text className="amount-label">支付金额</Text>
        <View className="amount-wrapper">
          <Text className="amount-symbol">￥</Text>
          <Text className="amount-value">{amount.toFixed(2)}</Text>
        </View>
      </View>

      {/* 支付方式 */}
      <View className="payment-methods">
        <View className="methods-title">选择支付方式</View>

        {/* 微信支付 */}
        <View
          className={`payment-method ${selectedMethod === 'wechat' ? 'payment-method--active' : ''}`}
          onClick={() => handleSelectMethod('wechat')}
        >
          <View className="method-left">
            <View className="method-icon wechat-icon">💬</View>
            <Text className="method-name">微信支付</Text>
          </View>
          <View className={`method-check ${selectedMethod === 'wechat' ? 'method-check--active' : ''}`}>
            {selectedMethod === 'wechat' && <Text className="check-icon">✓</Text>}
          </View>
        </View>

        {/* 支付宝支付 */}
        <View
          className={`payment-method ${selectedMethod === 'alipay' ? 'payment-method--active' : ''}`}
          onClick={() => handleSelectMethod('alipay')}
        >
          <View className="method-left">
            <View className="method-icon alipay-icon">💰</View>
            <Text className="method-name">支付宝</Text>
          </View>
          <View className={`method-check ${selectedMethod === 'alipay' ? 'method-check--active' : ''}`}>
            {selectedMethod === 'alipay' && <Text className="check-icon">✓</Text>}
          </View>
        </View>

        {/* 余额支付 */}
        <View
          className={`payment-method ${selectedMethod === 'balance' ? 'payment-method--active' : ''}`}
          onClick={() => handleSelectMethod('balance')}
        >
          <View className="method-left">
            <View className="method-icon balance-icon">💳</View>
            <Text className="method-name">余额支付</Text>
            <Text className="method-desc">余额不足</Text>
          </View>
          <View className={`method-check ${selectedMethod === 'balance' ? 'method-check--active' : ''}`}>
            {selectedMethod === 'balance' && <Text className="check-icon">✓</Text>}
          </View>
        </View>
      </View>

      {/* 支付说明 */}
      <View className="payment-tips">
        <Text className="tips-title">支付说明</Text>
        <Text className="tips-item">• 请在1分钟内完成支付，否则订单将自动取消</Text>
        <Text className="tips-item">• 下单时已锁定库存，超时未支付将自动释放</Text>
        <Text className="tips-item">• 支付过程中请勿关闭页面</Text>
        <Text className="tips-item">• 如遇支付问题，请联系客服</Text>
      </View>

      {/* 底部按钮 */}
      <View className="bottom-bar">
        <View className="cancel-button" onClick={handleCancelPay}>
          <Text className="cancel-text">取消支付</Text>
        </View>
        <View
          className={`confirm-button ${loading ? 'confirm-button--loading' : ''}`}
          onClick={handleConfirmPay}
        >
          <Text className="confirm-text">{loading ? '支付中...' : `确认支付 ￥${amount.toFixed(2)}`}</Text>
        </View>
      </View>
    </View>
  )
}

export default Payment
