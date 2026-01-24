/**
 * 康养预订类型定义
 */

// 服务类型
export type ServiceType = 'medical' | 'rehabilitation' | 'nursing' | 'health' | 'leisure'

// 预订状态
export type BookingStatus = 'available' | 'limited' | 'full'

// 康养服务详情
export interface WellnessService {
  id: string
  title: string
  coverImage: string
  description: string
  serviceTypes: ServiceType[] // 康养院的服务类型
  facilities: string[] // 设施列表
  location: {
    name: string
    address: string
    latitude?: number
    longitude?: number
  }
  contact: {
    phone: string
    wechat?: string
  }
  images: string[]
  highlights: string[] // 亮点特色
  tags: string[]
  status: BookingStatus
  category: ServiceType
  openingHours: string // 营业时间
  bookingNotice: string // 预订须知
}

// 列表项（简化版）
export interface WellnessServiceListItem {
  id: string
  title: string
  coverImage: string
  serviceTypes: ServiceType[] // 康养院的服务类型
  location: string
  status: BookingStatus
  category: ServiceType
  highlights: string[] // 亮点特色
}
