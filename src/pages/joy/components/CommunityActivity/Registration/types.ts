/**
 * 报名页面类型定义
 */

// 表单数据
export interface RegistrationFormData {
  name: string
  phone: string
  detailAddress: string
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
}
