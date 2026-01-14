import { View, Text, Image } from '@tarojs/components'
import { Activity } from '../../types'
import './index.scss'

interface Props {
  data: Activity
  onClick?: (item: Activity) => void
}

function ActivityCard({ data, onClick }: Props) {
  const handleClick = () => {
    onClick?.(data)
  }

  return (
    <View
      className="activity-card"
      onClick={handleClick}
      hoverClassName="activity-card--press"
    >
      <Image
        src={data.image}
        className="activity-card__image"
        mode="aspectFill"
        lazyLoad
      />
      <View className="activity-card__content">
        <Text className="activity-card__title">{data.title}</Text>
        <View className="activity-card__meta">
          <Text className="activity-card__time">🕐 {data.time}</Text>
          {data.location && (
            <Text className="activity-card__location">📍 {data.location}</Text>
          )}
        </View>
        <View className="activity-card__tag">{data.tag}</View>
      </View>
    </View>
  )
}

export default ActivityCard
