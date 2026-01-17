/**
 * 列表视图组件
 * 显示社区列表
 */
import { View, Text, ScrollView } from '@tarojs/components';
import type { Community } from '../../../../types/community.types';

interface ListViewProps {
  /** 社区列表 */
  communities: Community[];
  /** 当前选择的社区 ID */
  selectedCommunityId?: string;
  /** 社区项点击事件 */
  onCommunityTap: (communityId: string) => void;
}

const ListView: React.FC<ListViewProps> = ({
  communities,
  selectedCommunityId,
  onCommunityTap,
}) => {
  const handleItemTap = (communityId: string) => {
    onCommunityTap(communityId);
  };

  return (
    <View className="list-view">
      <ScrollView scrollY className="list-scroll">
        {communities.map((community) => (
          <View
            key={community.id}
            className={`community-item ${community.id === selectedCommunityId ? 'selected' : ''}`}
            onClick={() => handleItemTap(community.id)}
          >
            <View className="community-info">
              <Text className="community-name">{community.name}</Text>
              <Text className="community-address">{community.shortAddress}</Text>
              {community.distance !== undefined && (
                <Text className="community-distance">
                  {community.distance.toFixed(1)} km
                </Text>
              )}
            </View>
            {community.id === selectedCommunityId && (
              <View className="selected-icon">✓</View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ListView;
