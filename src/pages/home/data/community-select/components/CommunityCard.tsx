import { View, Text } from '@tarojs/components'
import { Community } from '@/pages/home/types'
import './index.scss'

interface CommunityCardProps {
  community: Community
  selected: boolean
  onClick: (community: Community) => void
}

function CommunityCard({ community, selected, onClick }: CommunityCardProps) {
  // 构造地址字符串
  const formatAddress = (community: Community) => {
    const parts = [community.province, community.city, community.district, community.detailAddress].filter(Boolean)
    return parts.join('') || '地址未设置'
  }

  return (
    <View
      className={`community-card ${selected ? 'selected' : ''}`}
      onClick={() => onClick(community)}
    >
      <Text className="community-name">{community.name}</Text>
      <Text className="community-address">{formatAddress(community)}</Text>
      {selected && <Text className="selected-icon">✓</Text>}
    </View>
  )
}

export default CommunityCard
