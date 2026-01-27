import { View, Text, ScrollView } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useState, useEffect } from "react";
import HeaderSection from "./components/HeaderSection";
import NotificationBar from "./components/NotificationBar";
import QuickNav from "./components/QuickNav";
import BannerSwiper from "./components/BannerSwiper";
import PageTransitionOverlay from "@/components/PageTransitionOverlay";
import { navigateTo } from "@/utils/navigation";
import { mockBanners, mockNotifications } from "./mockData";
import { Banner, Community } from "./types";
import { useUserStore } from "@/store/userStore";
import "./index.scss";

const STORAGE_KEY = "selectedCommunity";

function Home() {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [currentCommunity, setCurrentCommunity] = useState<Community | null>(
    null
  );
  const [showGuideModal, setShowGuideModal] = useState(false);

  // 获取用户状态
  const { isLoggedIn, userInfo } = useUserStore();

  // 初始化：检查是否有选择的社区
  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync();
    setStatusBarHeight(systemInfo.statusBarHeight || 0);

    checkSelectedCommunity();
  }, [userInfo]); // 监听用户信息变化

  // 页面显示时重新检查社区（从社区选择页返回时刷新）
  useDidShow(() => {
    console.log('home 页面显示，隐藏遮罩')
    Taro.eventCenter.trigger('hidePageTransition')
    checkSelectedCommunity();
  });

  // 监听社区选择事件
  useEffect(() => {
    const handleCommunitySelected = (data: any) => {
      console.log('接收到社区选择事件:', data)
      // 延迟一点时间确保数据已保存
      setTimeout(() => {
        checkSelectedCommunity();
      }, 500)
    }

    // 监听社区选择完成事件
    Taro.eventCenter.on('communitySelected', handleCommunitySelected)

    return () => {
      Taro.eventCenter.off('communitySelected', handleCommunitySelected)
    }
  }, [])

  // 检查本地存储的社区
  const checkSelectedCommunity = () => {
    try {
      console.log('检查已选择的社区，用户信息:', userInfo)
      let community = null;

      // 优先从用户信息中获取社区（已登录用户）
      if (userInfo?.communityId && userInfo?.communityName) {
        community = {
          id: userInfo.communityId,
          name: userInfo.communityName
        };
        console.log('从用户信息中获取社区:', community)
      } else {
        // 用户没有绑定社区，尝试从本地存储读取（未登录用户）
        const saved = Taro.getStorageSync(STORAGE_KEY);
        if (saved) {
          community = saved;
          console.log('从本地存储中获取社区:', community)
        }
      }

      if (community) {
        console.log('设置当前社区:', community)
        setCurrentCommunity(community);
        setShowGuideModal(false); // 隐藏引导弹窗
      } else {
        console.log('没有找到已选择的社区，显示引导弹窗')
        // 没有选择过社区，显示引导弹窗
        setShowGuideModal(true);
      }
    } catch (e) {
      console.error("读取社区信息失败:", e);
      setShowGuideModal(true);
    }
  };

  // 处理社区切换 - 使用新的跳转方法
  const handleCommunityChange = () => {
    navigateTo("/pages/home/data/community-select/index");
  }; 

  // 处理活动点击
  const handleBannerClick = (banner: Banner) => {
    console.log("点击活动:", banner);
  };

  // 处理通知点击
  const handleNotificationClick = () => {
    Taro.showToast({
      title: "查看通知详情",
      icon: "none",
    });
  };

  // 跳转到社区选择页面 - 使用新的跳转方法
  const handleGoToSelect = () => {
    setShowGuideModal(false);
    navigateTo("/pages/home/data/community-select/index");
  };

  return (
    <View className="home-page">
      <PageTransitionOverlay />
      {/* 状态栏占位 */}
      <View className="status-bar" style={{ height: `${statusBarHeight}px` }} />

      {/* 全局页面过渡遮罩 */}

      {/* 顶部区域（包含状态栏、导航栏和欢迎区） */}
      <View className="home-header">
        <HeaderSection
          communityName={currentCommunity?.name || "请选择社区"}
          onCommunityChange={handleCommunityChange}
        />
      </View>

      {/* 可滚动内容区 */}
      <ScrollView scrollY className="home-scroll">
        {/* 通知栏 */}
        <View className="notification-wrapper">
          <NotificationBar
            data={mockNotifications}
            onClick={handleNotificationClick}
          />
        </View>

        {/* 快捷导航栏（8宫格） */}
        <View className="section">
          <Text className="section-title">快捷服务</Text>
          <QuickNav />
        </View>

        {/* 精彩活动轮播图 */}
        <View className="section">
          <Text className="section-title">精彩活动</Text>
          <BannerSwiper data={mockBanners} onItemClick={handleBannerClick} />
        </View>
      </ScrollView>

      {/* 首次选择社区引导弹窗 */}
      {showGuideModal && (
        <View className="guide-modal" onClick={() => setShowGuideModal(false)}>
          <View
            className="guide-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <View className="guide-modal-icon">🏘️</View>
            <Text className="guide-modal-title">欢迎来到晚晴</Text>
            <Text className="guide-modal-desc">
              请先选择您所在的社区，以便为您提供更精准的服务
            </Text>
            <View className="guide-modal-buttons">
              <View
                className="guide-modal-btn guide-modal-btn-primary"
                onClick={handleGoToSelect}
              >
                <Text>去选择社区</Text>
              </View>
              <View
                className="guide-modal-btn guide-modal-btn-secondary"
                onClick={() => setShowGuideModal(false)}
              >
                <Text>稍后再说</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

export default Home;
