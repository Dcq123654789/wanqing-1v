import { View, Text } from '@tarojs/components'
import './PaymentSelector.scss'

interface PaymentSelectorProps {
  price: number
  balance?: number
  value: 'wechat' | 'balance'
  onChange: (method: 'wechat' | 'balance') => void
}

/**
 * 支付方式选择器组件
 */
function PaymentSelector({ price, balance = 0, value, onChange }: PaymentSelectorProps) {
  return (
    <View className="payment-selector">
      <View className="payment-header">
        <Text className="payment-title">支付方式</Text>
        <Text className="payment-amount">¥{price.toFixed(2)}</Text>
      </View>

      <View className="payment-options">
        {/* 微信支付 */}
        <View
          className={`payment-option ${value === 'wechat' ? 'payment-option--active' : ''}`}
          onClick={() => onChange('wechat')}
        >
          <View className="option-left">
            <View className="option-icon option-icon--wechat">
              <Text className="icon-text">微</Text>
            </View>
            <View className="option-info">
              <Text className="option-name">微信支付</Text>
            </View>
          </View>
          <View className={`option-radio ${value === 'wechat' ? 'option-radio--checked' : ''}`}>
            {value === 'wechat' && <Text className="radio-check">✓</Text>}
          </View>
        </View>

        {/* 余额支付 */}
        <View
          className={`payment-option ${value === 'balance' ? 'payment-option--active' : ''}`}
          onClick={() => onChange('balance')}
        >
          <View className="option-left">
            <View className="option-icon option-icon--balance">
              <Text className="icon-text">余</Text>
            </View>
            <View className="option-info">
              <Text className="option-name">余额支付</Text>
              <Text className="option-balance">当前余额：¥{balance.toFixed(2)}</Text>
            </View>
          </View>
          <View className={`option-radio ${value === 'balance' ? 'option-radio--checked' : ''}`}>
            {value === 'balance' && <Text className="radio-check">✓</Text>}
          </View>
        </View>
      </View>

      {value === 'balance' && balance < price && (
        <View className="payment-warning">
          <Text className="warning-icon">⚠️</Text>
          <Text className="warning-text">余额不足，请先充值或选择其他支付方式</Text>
        </View>
      )}
    </View>
  )
}

export default PaymentSelector
