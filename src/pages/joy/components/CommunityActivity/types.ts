/**
 * 社区活动类型定义
 */

// 参与者
export interface Participant {
  id: string
  name: string
  avatar: string
  joinTime: string
}

// 活动状态
export type ActivityStatus = 'upcoming' | 'ongoing' | 'ended' | 'full'

// 社区活动
export interface CommunityActivity {
  id: string
  title: string
  coverImage: string
  description: string
  time: string
  timestamp: number
  location: {
    name: string
    address: string
    latitude?: number
    longitude?: number
  }
  maxParticipants: number
  currentParticipants: number
  organizer: {
    name: string
    avatar: string
    phone?: string
  }
  participants: Participant[]
  images: string[]
  registrationDeadline: string
  tags: string[]
  status: ActivityStatus
  category: 'culture' | 'sports' | 'entertainment' | 'volunteer' | 'learning'
}

// 活动列表项（简化版）
export interface ActivityListItem {
  id: string
  title: string
  coverImage: string
  time: string
  location: string
  currentParticipants: number
  maxParticipants: number
  status: ActivityStatus
  category: string
}
