// 上门服务类型定义

/**
 * 上门服务实体
 * 代表一个可预约的上门服务项目
 */
export interface HomeService {
  id: string
  name: string
  poster: string
  price: number
  sales: number
  category: string
  description?: string
}

/**
 * 服务详情
 * 服务的完整信息，用于详情页展示
 */
export interface ServiceDetail extends HomeService {
  images?: string[]
  specifications?: { [key: string]: string }
  rating?: number
  reviewCount?: number
}

/**
 * 服务分类
 */
export interface ServiceCategory {
  key: string
  name: string
  icon?: string
}

 