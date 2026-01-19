/**
 * 地图视图组件
 * 显示社区标记点的地图
 */
import { useEffect, useState } from 'react';
import { View, Map } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { MapMarker, Community } from '../../../../types/community.types';

interface MapViewProps {
  /** 社区列表 */
  communities: Community[];
  /** 当前用户位置 */
  currentLocation: { latitude: number; longitude: number };
  /** 当前选择的社区 ID */
  selectedCommunityId?: string;
  /** 标记点点击事件 */
  onMarkerTap: (communityId: string) => void;
}

const MapView: React.FC<MapViewProps> = ({
  communities,
  currentLocation,
  selectedCommunityId,
  onMarkerTap,
}) => {
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    // 将社区转换为地图标记点
    const newMarkers: MapMarker[] = communities.map((community, index) => ({
      id: index + 1,
      latitude: community.latitude,
      longitude: community.longitude,
      title: community.name,
      iconPath: '/assets/images/marker.png',
      width: 24,
      height: 24,
      alpha: community.id === selectedCommunityId ? 1.0 : 0.7,
      isSelected: community.id === selectedCommunityId,
    }));

    setMarkers(newMarkers);
  }, [communities, selectedCommunityId]);

  const handleMarkerTap = (e: any) => {
    const markerId = e.detail.markerId;
    const community = communities[markerId - 1];
    if (community) {
      onMarkerTap(community.id);
    }
  };

  return (
    <View className="map-view">
      <Map
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
        markers={markers}
        onMarkerTap={handleMarkerTap}
        showLocation={true}
        enableZoom={true}
        enableScroll={true}
        style={{ width: '100%', height: '100vh' }}
      />
    </View>
  );
};

export default MapView;
