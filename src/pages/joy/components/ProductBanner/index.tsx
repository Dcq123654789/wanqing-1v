import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import './index.scss'

interface Product {
  id: string
  image: string
  name: string
  price?: string
  tag?: string
  link: string
}

interface ProductBannerProps {
  data: Product[]
  onItemClick?: (product: Product) => void
}

function ProductBanner({ data, onItemClick }: ProductBannerProps) {

  const handleClick = (item: Product) => {
    onItemClick?.(item)
  }

  return (
    <View className="product-banner">
      <Swiper
        className="product-swiper"
        indicatorDots
        indicatorColor="rgba(255, 255, 255, 0.5)"
        indicatorActiveColor="#ff6b6b"
        autoplay
        interval={3000}
        circular
      >
        {data.map((item) => (
          <SwiperItem key={item.id}>
            <View
              className="product-item"
              onClick={() => handleClick(item)}
            >
              <Image
                src={item.image}
                mode="aspectFill"
                className="product-image"
              />
              <View className="product-info">
                {item.tag && (
                  <View className="product-tag">{item.tag}</View>
                )}
                <Text className="product-name">{item.name}</Text>
                {item.price && (
                  <Text className="product-price">{item.price}</Text>
                )}
              </View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  )
}

export default ProductBanner
