/**
 * 商品分类枚举 - 与后端 ProductCategory 保持一致
 */
export enum ProductCategory {
  ALL = -1,         // 全部（前端专用）
  NUTRITION = 0,    // 营养保健
  DEVICE = 1,       // 健康器械
  CHECKUP = 2,      // 体检服务
  CONSULTATION = 3, // 健康咨询
  OTHER = 4         // 其他
}

/**
 * 商品分类信息
 */
export interface CategoryInfo {
  key: string
  name: string
  value: ProductCategory
}

/**
 * 商品分类映射表
 */
export const CATEGORY_MAP: Record<ProductCategory, CategoryInfo> = {
  [ProductCategory.ALL]: { key: 'all', name: '全部', value: ProductCategory.ALL },
  [ProductCategory.NUTRITION]: { key: 'nutrition', name: '营养保健', value: ProductCategory.NUTRITION },
  [ProductCategory.DEVICE]: { key: 'device', name: '健康器械', value: ProductCategory.DEVICE },
  [ProductCategory.CHECKUP]: { key: 'checkup', name: '体检服务', value: ProductCategory.CHECKUP },
  [ProductCategory.CONSULTATION]: { key: 'consultation', name: '健康咨询', value: ProductCategory.CONSULTATION },
  [ProductCategory.OTHER]: { key: 'other', name: '其他', value: ProductCategory.OTHER }
}

/**
 * 根据后端数值获取分类信息
 */
export function getCategoryInfo(value: number): CategoryInfo {
  return CATEGORY_MAP[value as ProductCategory] || CATEGORY_MAP[ProductCategory.NUTRITION]
}

/**
 * 根据前端 key 获取分类值
 */
export function getCategoryValue(key: string): ProductCategory {
  const category = Object.values(CATEGORY_MAP).find(c => c.key === key)
  return category?.value ?? ProductCategory.ALL
}

/**
 * 商品列表项
 */
export interface ProductItem {
  id: string
  name: string
  price: number
  poster: string
  sales: number
  category: number  // 后端返回的数值类型
}

/**
 * 商品详情
 */
export interface ProductDetail extends ProductItem {
  description: string
  images: string[]
  spec?: string      // 商品规格（如500g/100ml）
  origin?: string    // 商品产地
  shelfLife?: number // 保质期（月）
  stock: number
  rating: number
  reviewCount: number
}

/**
 * 排序类型
 */
export type SortType = 'none' | 'price_asc' | 'price_desc'
