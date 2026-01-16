import { View, Text, ScrollView } from '@tarojs/components'
import { Community } from '@/pages/home/types'
import './index.scss'

interface CommunitySelectorProps {
  communities: Community[]
  selected: Community | null
  onChange: (community: Community) => void
  onConfirm: () => void
}

function CommunitySelector({
  communities,
  selected,
  onChange,
  onConfirm
}: CommunitySelectorProps) {
  return (
    <View className="community-selector">
      {/* 社区名称显示 */}
      <View className="selector-display" onClick={() => {}}>
        <Text className="selector-name">{selected?.name || '请选择社区'}</Text>
        <Text className="selector-arrow">▼</Text>
      </View>

      {/* 社区列表（可滚动） */}
      <View className="selector-list-wrapper">
        <ScrollView scrollY className="selector-list">
          {communities.map((community) => (
            <View
              key={community.id}
              className={`selector-item ${selected?.id === community.id ? 'active' : ''}`}
              onClick={() => onChange(community)}
            >
              <Text className="item-name">{community.name}</Text>
              {selected?.id === community.id && (
                <Text className="item-check">✓</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 确认按钮 */}
      <View className="selector-confirm" onClick={onConfirm}>
        <Text className="confirm-text">确认选择</Text>
      </View>
    </View>
  )
}

export default CommunitySelector
