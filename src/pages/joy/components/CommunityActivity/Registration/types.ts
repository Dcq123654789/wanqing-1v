/**
 * 报名页面类型定义
 */

// 表单数据
export interface RegistrationFormData {
  name: string
  phone: string
  remarks: string
}

// 支付方式
export type PaymentMethod = 'wechat' | 'balance' | null

// 活动信息（从路由参数获取）
export interface ActivityInfo {
  activityId: string
  title: string
  coverImage?: string
  price?: number
  isFree: boolean
  maxParticipants?: number
  currentParticipants?: number
}

// 报名响应数据
export interface JoinActivityResult {
  code: number
  message: string
  data: {
    orderNo: string
    activity?: {
      _id: string
      title?: string
    }
    isFree?: boolean
    needPayment?: boolean
    registration?: {
      paymentAmount?: number
    }
    paymentAmount?: number
  }
}
