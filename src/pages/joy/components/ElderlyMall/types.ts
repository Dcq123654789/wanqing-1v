export interface ProductItem {
  id: string
  name: string
  price: number
  poster: string
  sales: number
  category: string
}

export interface ProductDetail extends ProductItem {
  description: string
  images: string[]
  specifications: { [key: string]: string }
  stock: number
  rating: number
  reviewCount: number
}

export interface CategoryItem {
  key: string
  name: string
}
