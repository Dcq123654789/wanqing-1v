import { View, Text } from '@tarojs/components'
import { Community } from '@/pages/home/types'
import './index.scss'

interface CommunityCardProps {
  community: Community
  selected: boolean
  onClick: (community: Community) => void
}

function CommunityCard({ community, selected, onClick }: CommunityCardProps) {
  return (
    <View
      className={`community-card ${selected ? 'selected' : ''}`}
      onClick={() => onClick(community)}
    >
      <Text className="community-name">{community.name}</Text>
      <Text className="community-address">{community.address}</Text>
      {selected && <Text className="selected-icon">✓</Text>}
    </View>
  )
}

export default CommunityCard
