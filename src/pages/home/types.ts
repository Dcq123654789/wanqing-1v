/**
 * 首页数据类型定义
 */

// 轮播海报
export interface Banner {
  id: string
  image: string
  title: string
  link: string
}

// 服务入口
export interface ServiceEntry {
  id: string
  icon: string
  title: string
  route: string
  type?: string
}

// 通知
export interface Notification {
  id: string
  content: string
  type: 'info' | 'activity' | 'urgent'
  link?: string
}

// 活动推荐
export interface Activity {
  id: string
  title: string
  image: string
  time: string
  location?: string
  tag: string
  link?: string
}

// 社区
export interface Community {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  coverImage?: string
}
