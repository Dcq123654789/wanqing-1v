import { View, Text, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import { Community } from '@/pages/home/types'
import './index.scss'

interface CommunitySelectorProps {
  communities: Community[]
  selected: Community | null
  onChange: (community: Community) => void
}

function CommunitySelector({
  communities,
  selected,
  onChange
}: CommunitySelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // 切换下拉列表显示状态
  const toggleDropdown = () => {
    setIsExpanded(!isExpanded)
  }

  // 选择社区
  const handleSelectCommunity = (community: Community) => {
    setIsExpanded(false)
    onChange(community)
  }

  return (
    <View className="community-selector">
      {/* 下拉选择框 */}
      <View className="selector-dropdown" onClick={toggleDropdown}>
        <Text className="selector-value">{selected?.name || '请选择社区'}</Text>
        <Text className={`selector-arrow ${isExpanded ? 'expanded' : ''}`}>▼</Text>
      </View>

      {/* 下拉列表 */}
      {isExpanded && (
        <View className="dropdown-list-wrapper">
          <ScrollView scrollY className="dropdown-list">
            {communities.map((community) => (
              <View
                key={community._id}
                className={`dropdown-item ${selected?._id === community._id ? 'active' : ''}`}
                onClick={() => handleSelectCommunity(community)}
              >
                <Text className="item-name">{community.name}</Text>
                {selected?._id === community._id && (
                  <Text className="item-check">✓</Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

export default CommunitySelector
