/**
 * 社区卡片组件
 * 显示社区基本信息的卡片
 */
import { View, Text } from '@tarojs/components';
import type { Community } from '../../../../types/community.types';

interface CommunityCardProps {
  /** 社区数据 */
  community: Community;
  /** 是否显示详情 */
  showDetail?: boolean;
  /** 点击事件 */
  onClick?: () => void;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  showDetail = false,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <View className="community-card" onClick={handleClick}>
      <View className="card-header">
        <Text className="community-name">{community.name}</Text>
        <View className={`status-badge ${community.status}`}>
          <Text className="status-text">
            {community.status === 'active' ? '运营中' : '已下线'}
          </Text>
        </View>
      </View>

      <View className="card-body">
        <View className="info-row">
          <Text className="info-label">地址：</Text>
          <Text className="info-value">{showDetail ? community.fullAddress : community.shortAddress}</Text>
        </View>

        {showDetail && (
          <View className="info-row">
            <Text className="info-label">服务范围：</Text>
            <Text className="info-value">{community.serviceRange}</Text>
          </View>
        )}

        {community.distance !== undefined && (
          <View className="info-row">
            <Text className="info-label">距离：</Text>
            <Text className="info-value">{community.distance.toFixed(1)} km</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CommunityCard;
