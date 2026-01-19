/**
 * 社区选择页面主组件
 * 整合地图视图、列表视图、视图切换、社区选择逻辑
 */
import { useState, useEffect } from 'react';
import { View, Button, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useCommunityStore } from '../../../../store/community-store';
import MapView from './components/MapView';
import ListView from './components/ListView';
import CommunityDetail from './components/CommunityDetail';
import { MOCK_COMMUNITIES, mockDelay } from './services/mock-data';
import './index.scss';

const CommunitySelect: React.FC = () => {
  const {
    selectedCommunity,
    communities,
    viewMode,
    isLoading,
    error,
    setSelectedCommunity,
    setCommunities,
    setViewMode,
    setLoading,
    setError,
    switchCommunity,
  } = useCommunityStore();

  const [currentLocation, setCurrentLocation] = useState({
    latitude: 39.9042,
    longitude: 116.4074,
  });
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | undefined>();
  const [showDetail, setShowDetail] = useState(false);

  // 加载社区列表
  useEffect(() => {
    const loadCommunities = async () => {
      setLoading(true);
      setError(null);

      try {
        // 模拟网络延迟
        await mockDelay(500);

        // 使用 Mock 数据
        setCommunities(MOCK_COMMUNITIES);
      } catch (e) {
        setError('加载社区列表失败，请检查网络连接');
      } finally {
        setLoading(false);
      }
    };

    loadCommunities();
  }, []);

  // 获取用户位置
  useEffect(() => {
    Taro.getLocation({
      type: 'wgs84',
      success: (res) => {
        setCurrentLocation({
          latitude: res.latitude,
          longitude: res.longitude,
        });
      },
      fail: () => {
        console.warn('获取位置失败，使用默认位置');
      },
    });
  }, []);

  // 选择社区
  const handleSelectCommunity = async (communityId: string) => {
    try {
      await switchCommunity(communityId);
      const community = communities.find(c => c.id === communityId);
      if (community) {
        Taro.showToast({
          title: `已选择 ${community.name}`,
          icon: 'success',
        });

        // 跳转到首页
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/home/index',
          });
        }, 1500);
      }
    } catch (e) {
      Taro.showToast({
        title: '保存失败，请重试',
        icon: 'none',
      });
    }
  };

  // 标记点点击（地图视图）
  const handleMarkerTap = (communityId: string) => {
    setSelectedCommunityId(communityId);
    setShowDetail(true);
  };

  // 列表项点击（列表视图）
  const handleCommunityTap = (communityId: string) => {
    setSelectedCommunityId(communityId);
    const community = communities.find(c => c.id === communityId);
    if (community) {
      // 显示详情并直接选择
      handleSelectCommunity(communityId);
    }
  };

  // 切换视图模式
  const handleToggleView = () => {
    setViewMode(viewMode === 'map' ? 'list' : 'map');
  };

  // 关闭详情
  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  // 加载状态
  if (isLoading) {
    return (
      <View className="community-select loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  // 错误状态
  if (error) {
    return (
      <View className="community-select error">
        <Text>{error}</Text>
        <Button onClick={() => Taro.reLaunch({ url: '/pages/home/data/community-select/index' })}>
          重试
        </Button>
      </View>
    );
  }

  return (
    <View className="community-select">
      {/* 视图切换按钮 */}
      <View className="view-toggle">
        <Button onClick={handleToggleView} className="toggle-btn">
          切换到{viewMode === 'map' ? '列表' : '地图'}视图
        </Button>
      </View>

      {/* 地图视图 */}
      {viewMode === 'map' && (
        <MapView
          communities={communities}
          currentLocation={currentLocation}
          selectedCommunityId={selectedCommunity?.id}
          onMarkerTap={handleMarkerTap}
        />
      )}

      {/* 列表视图 */}
      {viewMode === 'list' && (
        <ListView
          communities={communities}
          selectedCommunityId={selectedCommunity?.id}
          onCommunityTap={handleCommunityTap}
        />
      )}

      {/* 社区详情浮层 */}
      {showDetail && selectedCommunityId && (
        <View className="detail-overlay">
          <View className="detail-container">
            <CommunityDetail
              community={communities.find(c => c.id === selectedCommunityId)!}
              onClose={handleCloseDetail}
              onSelect={() => handleSelectCommunity(selectedCommunityId!)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default CommunitySelect;
