import { View, Text, ScrollView, Input, Button, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import { navigateTo } from '@/utils/navigation'
import PageTransitionOverlay from '@/components/PageTransitionOverlay'
import PaymentSelector from './components/PaymentSelector'
import type { RegistrationFormData, PaymentMethod, ActivityInfo } from './types'
import { getActivityById } from '../mockData'
import './index.scss'

function ActivityRegistration() {
  const router = useRouter()
  const { userInfo } = useUserStore()

  // 活动信息
  const [activityInfo, setActivityInfo] = useState<ActivityInfo | null>(null)

  // 表单数据
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    phone: '',
    detailAddress: ''
  })

  // 支付方式
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'balance'>('wechat')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // 解析路由参数
    const params = router.params
    if (params.activityId) {
      // 通过 activityId 获取完整活动信息
      const activity = getActivityById(params.activityId)
      if (activity) {
        setActivityInfo({
          activityId: activity.id,
          title: activity.title,
          coverImage: activity.coverImage,
          price: activity.price || 0,
          isFree: !activity.price || activity.price === 0
        })
      } else {
        Taro.showToast({
          title: '活动不存在',
          icon: 'none'
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      }
    } else {
      Taro.showToast({
        title: '参数错误',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    }

    // 自动填充用户信息
    if (userInfo) {
      setFormData(prev => ({
        ...prev,
        name: userInfo.name || '',
        phone: userInfo.phone || '',
        detailAddress: userInfo.address?.detail || ''
      }))
    }
  }, [router.params.activityId, userInfo])

  // 更新表单字段
  const updateFormField = <K extends keyof RegistrationFormData>(
    field: K,
    value: RegistrationFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 表单验证
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Taro.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return false
    }

    // 手机号验证
    const phoneReg = /^1[3-9]\d{9}$/
    if (!formData.phone.trim()) {
      Taro.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false
    }
    if (!phoneReg.test(formData.phone)) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return false
    }

    // 详细地址验证
    if (!formData.detailAddress.trim()) {
      Taro.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return false
    }

    return true
  }

  // 提交报名
  const handleSubmit = async () => {
    if (!activityInfo) return

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // 免费活动直接报名
      if (activityInfo.isFree) {
        await handleFreeRegistration()
      } else {
        // 收费活动需要支付
        await handlePaidRegistration()
      }
    } catch (error) {
      console.error('报名失败:', error)
      Taro.showToast({
        title: '报名失败，请重试',
        icon: 'none'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 免费活动报名
  const handleFreeRegistration = async () => {
    if (!activityInfo) return

    // TODO: 调用免费活动报名接口
    // await registrationApi({
    //   activityId: activityInfo.activityId,
    //   ...formData
    // })

    // 模拟接口调用
    await new Promise(resolve => setTimeout(resolve, 500))

    Taro.showToast({
      title: '报名成功',
      icon: 'success'
    })

    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  // 收费活动报名
  const handlePaidRegistration = async () => {
    if (!activityInfo) return

    const price = activityInfo.price || 0

    if (paymentMethod === 'balance') {
      // 余额支付
      const balance = userInfo?.balance || 0

      if (balance < price) {
        Taro.showToast({
          title: '余额不足',
          icon: 'none'
        })
        return
      }

      // TODO: 调用余额支付接口
      // await balancePayApi({
      //   activityId: activityInfo.activityId,
      //   amount: price,
      //   ...formData
      // })

      // 模拟支付
      await new Promise(resolve => setTimeout(resolve, 500))

      Taro.showToast({
        title: '支付成功',
        icon: 'success'
      })

      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } else {
      // 微信支付
      try {
        // TODO: 调用微信支付
        // await Taro.requestPayment({
        //   timeStamp: '',
        //   nonceStr: '',
        //   package: '',
        //   signType: 'MD5',
        //   paySign: ''
        // })

        // 模拟支付流程
        await Taro.showModal({
          title: '模拟支付',
          content: `确认支付 ¥${price.toFixed(2)}？`,
          confirmText: '确认支付'
        })

        // 模拟支付成功
        await new Promise(resolve => setTimeout(resolve, 500))

        // TODO: 支付成功后调用报名接口
        // await registrationApi({
        //   activityId: activityInfo.activityId,
        //   ...formData
        // })

        Taro.showToast({
          title: '报名成功',
          icon: 'success'
        })

        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } catch (error: any) {
        if (error.errMsg !== 'showModal:fail cancel') {
          console.error('支付失败:', error)
          Taro.showToast({
            title: '支付失败',
            icon: 'none'
          })
        }
      }
    }
  }

  if (!activityInfo) {
    return <View></View>
  }

  return (
    <View className="activity-registration-page">
      <PageTransitionOverlay />

      <ScrollView scrollY className="registration-scroll">
        {/* 活动信息卡片 */}
        <View className="activity-info-card">
          {activityInfo.coverImage && (
            <Image
              src={activityInfo.coverImage}
              className="activity-cover"
              mode="aspectFill"
            />
          )}
          <View className="activity-info-content">
            <Text className="activity-title">{activityInfo.title}</Text>
            <View className="activity-meta">
              {activityInfo.isFree ? (
                <Text className="activity-price activity-price--free">免费</Text>
              ) : (
                <Text className="activity-price">¥{(activityInfo.price || 0).toFixed(2)}</Text>
              )}
            </View>
          </View>
        </View>

        {/* 报名表单 */}
        <View className="form-section">
          <View className="section-title">
            <Text className="title-text">报名信息</Text>
          </View>

          {/* 姓名 */}
          <View className="form-item">
            <Text className="form-label">姓名</Text>
            <Input
              className="form-input"
              type="text"
              placeholder="请输入您的姓名"
              value={formData.name}
              onInput={(e) => updateFormField('name', e.detail.value)}
              placeholderClass="form-placeholder"
            />
          </View>

          {/* 手机号 */}
          <View className="form-item">
            <Text className="form-label">手机号</Text>
            <Input
              className="form-input"
              type="number"
              maxlength={11}
              placeholder="请输入手机号"
              value={formData.phone}
              onInput={(e) => updateFormField('phone', e.detail.value)}
              placeholderClass="form-placeholder"
            />
          </View>

          {/* 详细地址 */}
          <View className="form-item">
            <Text className="form-label">详细地址</Text>
            <Input
              className="form-input"
              type="text"
              placeholder="请输入您的详细地址"
              value={formData.detailAddress}
              onInput={(e) => updateFormField('detailAddress', e.detail.value)}
              placeholderClass="form-placeholder"
            />
          </View>
        </View>

        {/* 支付方式选择（仅收费活动） */}
        {!activityInfo.isFree && (
          <PaymentSelector
            price={activityInfo.price || 0}
            balance={userInfo?.balance}
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
        )}

        {/* 底部留白 */}
        <View className="bottom-spacer"></View>
      </ScrollView>

      {/* 底部提交按钮 */}
      <View className="submit-footer">
        <View className="footer-info">
          <Text className="footer-label">总计：</Text>
          {activityInfo.isFree ? (
            <Text className="footer-price footer-price--free">免费</Text>
          ) : (
            <Text className="footer-price">¥{(activityInfo.price || 0).toFixed(2)}</Text>
          )}
        </View>
        <Button
          className={`submit-button ${isSubmitting ? 'submit-button--disabled' : ''}`}
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? '提交中...' : activityInfo.isFree ? '立即报名' : '提交报名'}
        </Button>
      </View>
    </View>
  )
}

export default ActivityRegistration
