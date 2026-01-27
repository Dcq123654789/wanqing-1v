import { useState, useEffect } from "react";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import {
  mockHealthData,
  mockHealthServices,
  HealthService,
} from "./mockData";
import werunService from "@/services/werun";

// 步数转卡路里消耗（老年人按每步0.04卡路里计算）
const calculateCalories = (steps: number): number => {
  return Math.round(steps * 0.04);
};

// 步数目标（每日目标）
const STEP_TARGET = 8000;

function Care() {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [todaySteps, setTodaySteps] = useState<number>(mockHealthData.steps);
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);

  // 计算卡路里消耗
  const calories = calculateCalories(todaySteps);
  // 计算步数目标完成百分比
  const stepProgress = Math.min((todaySteps / STEP_TARGET) * 100, 100);

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync();
    setStatusBarHeight(systemInfo.statusBarHeight || 0);

    // 加载微信运动步数
    loadWerunSteps();
  }, []);

  /**
   * 加载微信运动步数
   */
  const loadWerunSteps = async () => {
    setIsLoadingSteps(true);
    try {
      // 获取用户的 sessionKey（从登录信息中获取）
      const sessionKey = Taro.getStorageSync('sessionKey') || '';

      // 获取今日步数
      const steps = await werunService.getTodaySteps(sessionKey);
      setTodaySteps(steps);

      // 如果获取成功且不是模拟数据，显示提示
      if (steps > 0) {
        console.log('今日步数：', steps);
      }
    } catch (error) {
      console.error('加载步数失败：', error);
      // 保持使用模拟数据
    } finally {
      setIsLoadingSteps(false);
    }
  };

  /**
   * 刷新步数
   */
  const refreshSteps = async () => {
    Taro.showLoading({ title: '获取中...' });
    await loadWerunSteps();
    Taro.hideLoading();
    Taro.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500
    });
  };

  // 处理服务卡片点击
  const handleServiceClick = (service: HealthService) => {
    if (!service.route) {
      Taro.showToast({
        title: "功能开发中",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    Taro.navigateTo({
      url: service.route,
      fail: () => {
        Taro.showToast({
          title: "页面开发中",
          icon: "none",
          duration: 2000,
        });
      },
    });
  };

  // 处理健康数据点击
  const handleHealthClick = () => {
    Taro.showModal({
      title: "健康详情",
      content: `今日步数：${todaySteps} 步\n睡眠时长：${mockHealthData.sleep}\n血压：${mockHealthData.bloodPressure} mmHg\n心率：${mockHealthData.heartRate} 次/分`,
      showCancel: false,
      confirmText: "知道了",
    });
  };

  return (
    <View className="care-page">
      {/* 状态栏占位 */}
      <View className="status-bar" style={{ height: `${statusBarHeight}px` }} />

      <ScrollView scrollY className="care-scroll">
        {/* 顶部欢迎区 */}
        <View className="welcome-header">
          <Image
            src={require('../../assets/images/backgrounds/care-bg.jpg')}
            className="welcome-bg"
            mode="aspectFill"
          />
          <View className="welcome-overlay" />
          <View className="welcome-content">
            <Text className="welcome-title">颐养身心</Text>
            <Text className="welcome-subtitle">专业健康管理，守护您的健康</Text>
          </View>
          <View className="welcome-decoration">
            <Text className="decoration-icon">💚</Text>
            <Text className="decoration-circle decoration-circle-1"></Text>
            <Text className="decoration-circle decoration-circle-2"></Text>
            <Text className="decoration-circle decoration-circle-3"></Text>
          </View>
        </View>

        {/* 健康数据大卡片 */}
        <View className="health-hero-card" onClick={handleHealthClick}>
          <View className="health-hero-header">
            <View className="health-title-section">
              <Text className="health-hero-title">今日健康</Text>
              <Text className="health-hero-date">{mockHealthData.date}</Text>
            </View>
            <View className="trend-badge" onClick={(e) => { e.stopPropagation(); refreshSteps(); }}>
              <Text className="trend-icon">{isLoadingSteps ? '⏳' : '🔄'}</Text>
              <Text className="trend-text">{isLoadingSteps ? '加载中' : '刷新'}</Text>
            </View>
          </View>

          {/* 步数进度条 */}
          <View className="step-progress-section">
            <View className="progress-header">
              <Text className="progress-label">今日目标</Text>
              <Text className="progress-value">{Math.round(stepProgress)}%</Text>
            </View>
            <View className="progress-bar-bg">
              <View
                className="progress-bar-fill"
                style={{ width: `${stepProgress}%` }}
              />
            </View>
            <Text className="progress-detail">
              {todaySteps.toLocaleString()} / {STEP_TARGET.toLocaleString()} 步
            </Text>
          </View>

          <View className="health-hero-stats">
            <View className="hero-stat-item">
              <View className="stat-icon-wrapper blue">👟</View>
              <View className="stat-content">
                <Text className="hero-stat-value">
                  {todaySteps.toLocaleString()}
                </Text>
                <Text className="hero-stat-label">步数</Text>
              </View>
              <Text className="stat-trend up">↑</Text>
            </View>
            <View className="hero-stat-divider" />
            <View className="hero-stat-item">
              <View className="stat-icon-wrapper orange">🔥</View>
              <View className="stat-content">
                <Text className="hero-stat-value">{calories}</Text>
                <Text className="hero-stat-label">千卡</Text>
              </View>
              <Text className="stat-badge burn">消耗</Text>
            </View>
            <View className="hero-stat-divider" />
            <View className="hero-stat-item">
              <View className="stat-icon-wrapper purple">😴</View>
              <View className="stat-content">
                <Text className="hero-stat-value">{mockHealthData.sleep}</Text>
                <Text className="hero-stat-label">睡眠</Text>
              </View>
              <Text className="stat-quality good">优质</Text>
            </View>
            <View className="hero-stat-divider" />
            <View className="hero-stat-item">
              <View className="stat-icon-wrapper red">❤️</View>
              <View className="stat-content">
                <Text className="hero-stat-value">
                  {mockHealthData.bloodPressure}
                </Text>
                <Text className="hero-stat-label">血压</Text>
              </View>
              <Text className="stat-status normal">正常</Text>
            </View>
          </View>
        </View>

        {/* 健康服务网格 */}
        <View className="service-grid-section">
          <Text className="section-title">健康服务</Text>
          <View className="service-grid">
            {mockHealthServices.map((service, index) => (
              <View
                key={service.id}
                className="service-card"
                style={{
                  background: service.gradient,
                  '--delay': `${index * 0.2}s`
                } as any}
                onClick={() => handleServiceClick(service)}
              >
                <View className="service-icon">{service.icon}</View>
                <Text className="service-title">{service.title}</Text>
                <Text className="service-desc">{service.description}</Text>
              </View>
            ))}
          </View>
        </View> 
      </ScrollView>
    </View>
  );
}

export default Care;
