/**
 * 社区详情组件
 * 显示社区的完整详细信息
 */
import { View, Text, Button } from '@tarojs/components';
import type { Community } from '../../../../types/community.types';

interface CommunityDetailProps {
  /** 社区数据 */
  community: Community;
  /** 关闭详情事件 */
  onClose?: () => void;
  /** 选择社区事件 */
  onSelect?: () => void;
}

const CommunityDetail: React.FC<CommunityDetailProps> = ({
  community,
  onClose,
  onSelect,
}) => {
  return (
    <View className="community-detail">
      <View className="detail-header">
        <Text className="detail-title">{community.name}</Text>
        {onClose && (
          <Button className="close-btn" onClick={onClose}>
            ✕
          </Button>
        )}
      </View>

      <View className="detail-content">
        <View className="detail-section">
          <Text className="section-title">基本信息</Text>
          <View className="info-item">
            <Text className="info-label">完整地址</Text>
            <Text className="info-value">{community.fullAddress}</Text>
          </View>
          <View className="info-item">
            <Text className="info-label">服务范围</Text>
            <Text className="info-value">{community.serviceRange}</Text>
          </View>
        </View>

        <View className="detail-section">
          <Text className="section-title">运营状态</Text>
          <View className={`status-badge ${community.status}`}>
            <Text className="status-text">
              {community.status === 'active' ? '✓ 运营中' : '✗ 已下线'}
            </Text>
          </View>
        </View>
      </View>

      {onSelect && community.status === 'active' && (
        <View className="detail-footer">
          <Button
            className="select-btn"
            onClick={onSelect}
          >
            选择此社区
          </Button>
        </View>
      )}
    </View>
  );
};

export default CommunityDetail;
