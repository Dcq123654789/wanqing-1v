import { View, Text, ScrollView, Input, Button, Textarea } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { useUserStore } from '@/store/userStore'
import PageTransitionOverlay from '@/components/PageTransitionOverlay'
import type { RegistrationFormData, ActivityInfo } from './types'
import {
  fetchActivityDetail,
  joinActivity,
  getWechatPayParams,
  pollPaymentStatus,
  cancelRegistrationAndUpdateActivity
} from '../services/activity.service'
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
    remarks: ''
  })

  // 提交状态
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitLock = useRef(false)  // 防止快速连点
  const isUnmounted = useRef(false)  // 页面是否已卸载

  useEffect(() => {
    // 解析路由参数
    const params = router.params
    if (params.activityId) {
      loadActivityInfo(params.activityId)
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
        name: userInfo.realName || userInfo.name || '',
        phone: userInfo.phone || ''
      }))
    }

    // 页面卸载时标记
    return () => {
      isUnmounted.current = true
    }
  }, [router.params.activityId, userInfo])

  // 加载活动信息
  const loadActivityInfo = async (activityId: string) => {
    try {
      const activity = await fetchActivityDetail(activityId)

      // 检查活动状态
      if (activity.status === 'full') {
        Taro.showToast({
          title: '活动已满员',
          icon: 'none'
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
        return
      }

      if (activity.status === 'ended') {
        Taro.showToast({
          title: '活动已结束',
          icon: 'none'
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
        return
      }

      setActivityInfo({
        activityId: activity.id,
        title: activity.title,
        coverImage: Array.isArray(activity.coverImage) ? activity.coverImage[0] : activity.coverImage,
        price: activity.price || 0,
        isFree: !activity.price || activity.price === 0,
        maxParticipants: activity.maxParticipants,
        currentParticipants: activity.currentParticipants
      })
    } catch (error: any) {
      console.error('加载活动信息失败:', error)
      Taro.showToast({
        title: error?.message || '加载失败',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    }
  }

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

    return true
  }

  // 提交报名
  const handleSubmit = async () => {
    if (!activityInfo || !userInfo) return

    // 双重检查：防止快速连点
    if (isSubmitting || submitLock.current) {
      console.log('提交中，请勿重复点击')
      return
    }

    if (!validateForm()) {
      return
    }

    // 设置提交状态
    submitLock.current = true
    setIsSubmitting(true)

    try {
      console.log('开始报名流程')

      // 1. 调用报名接口
      const result = await joinActivity({
        activityId: activityInfo.activityId,
        userId: userInfo._id || userInfo.userId || '',
        userName: formData.name,
        userPhone: formData.phone,
        remarks: formData.remarks
      })

      console.log('报名成功，订单信息:', result.data)

      // 2. 检查是否需要支付
      if (result.data?.isFree === false || result.data?.needPayment === true) {
        // 需要支付，直接调起微信支付
        console.log('需要支付，调起微信支付')

        Taro.showLoading({
          title: '正在调起支付...',
          mask: true
        })

        try {
          // 获取微信支付参数
          const { wechatPayParams } = await getWechatPayParams({
            registrationId: result.data.registrationId || result.data.id,
            orderNo: result.data.orderNo
          })

          Taro.hideLoading()

          console.log('获取到支付参数，准备调起微信支付')

          // 调起微信原生支付
          await new Promise<void>((resolve, reject) => {
            Taro.requestPayment({
              timeStamp: wechatPayParams.timeStamp,
              nonceStr: wechatPayParams.nonceStr,
              package: wechatPayParams.package,
              signType: wechatPayParams.signType,
              paySign: wechatPayParams.paySign,
              success: () => {
                console.log('微信支付调用成功')
                resolve()
              },
              fail: (err) => {
                console.error('微信支付调用失败:', err)
                reject(err)
              }
            })
          })

          // 轮询查询支付状态
          Taro.showLoading({
            title: '支付确认中...',
            mask: true
          })

          try {
            const record = await pollPaymentStatus(
              result.data.registrationId || result.data.id,
              () => isUnmounted.current
            )

            Taro.hideLoading()

            // 支付成功
            Taro.showToast({
              title: '报名成功！',
              icon: 'success'
            })

            setTimeout(() => {
              // 跳转到活动详情页
              Taro.redirectTo({
                url: `/pages/joy/components/CommunityActivity/Detail/index?id=${activityInfo.activityId}`
              })
            }, 1500)
          } catch (pollError: any) {
            Taro.hideLoading()
            throw pollError
          }
        } catch (payError: any) {
          console.error('支付流程失败:', payError)

          // 判断错误类型
          let errorMessage = '支付失败'

          if (payError?.errMsg) {
            if (payError.errMsg.includes('cancel')) {
              errorMessage = '您已取消支付'
            } else if (payError.errMsg.includes('fail')) {
              errorMessage = '支付失败，请重试'
            }
          } else if (payError?.message) {
            errorMessage = payError.message
          }

          Taro.showToast({
            title: errorMessage,
            icon: 'none'
          })

          // 如果用户取消支付，删除报名记录并释放名额
          if (payError?.errMsg?.includes('cancel')) {
            try {
              await cancelRegistrationAndUpdateActivity(
                result.data.registrationId || result.data.id,
                activityInfo.activityId
              )
              console.log('已取消报名并释放名额')
            } catch (cancelError) {
              console.error('取消报名失败:', cancelError)
            }
          }
        }
      } else {
        // 免费活动，直接报名成功
        console.log('免费活动，报名成功')

        Taro.showToast({
          title: result.message || '报名成功！',
          icon: 'success'
        })

        setTimeout(() => {
          // 跳转到活动详情页
          Taro.redirectTo({
            url: `/pages/joy/components/CommunityActivity/Detail/index?id=${activityInfo.activityId}`
          })
        }, 1500)
      }
    } catch (error: any) {
      console.error('报名失败:', error)

      // 错误处理
      handleRegistrationError(error.message || '报名失败，请重试')
    } finally {
      // 延迟释放锁，防止快速连点
      setTimeout(() => {
        submitLock.current = false
        setIsSubmitting(false)
      }, 1000)
    }
  }

  // 报名错误处理
  const handleRegistrationError = (errorMessage: string) => {
    Taro.showModal({
      title: '报名失败',
      content: errorMessage,
      confirmText: '重新报名',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) {
          // 用户选择重新报名，不做任何操作，让用户重新填写
        } else {
          // 用户选择返回
          Taro.navigateBack()
        }
      }
    })
  }

  if (!activityInfo) {
    return <View></View>
  }

  return (
    <View className="activity-registration-page">
      <PageTransitionOverlay />

      <ScrollView scrollY className="registration-scroll">
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

          {/* 备注 */}
          <View className="form-item">
            <Text className="form-label">备注（选填）</Text>
            <Textarea
              className="form-textarea"
              placeholder="如有特殊需求请填写"
              value={formData.remarks}
              onInput={(e) => updateFormField('remarks', e.detail.value)}
              placeholderClass="form-placeholder"
              maxlength={200}
            />
          </View>
        </View>

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
