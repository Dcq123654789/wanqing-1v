import { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'
import {
  mockHealthData,
  mockQuickTests,
  mockHealthServices,
  mockHealthArticles,
  mockWellnessTips,
  mockHealthTips,
  HealthService,
  QuickTest
} from './mockData'

function Care() {
  const [statusBarHeight, setStatusBarHeight] = useState(0)

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync()
    setStatusBarHeight(systemInfo.statusBarHeight || 0)
  }, [])

  // 处理服务卡片点击
  const handleServiceClick = (service: HealthService) => {
    if (!service.route) {
      Taro.showToast({
        title: '功能开发中',
        icon: 'none',
        duration: 2000
      })
      return
    }

    Taro.navigateTo({
      url: service.route,
      fail: () => {
        Taro.showToast({
          title: '页面开发中',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

  // 处理健康数据点击
  const handleHealthClick = () => {
    Taro.showModal({
      title: '健康详情',
      content: `今日步数：${mockHealthData.steps} 步\n睡眠时长：${mockHealthData.sleep}\n血压：${mockHealthData.bloodPressure} mmHg\n心率：${mockHealthData.heartRate} 次/分`,
      showCancel: false,
      confirmText: '知道了'
    })
  }

  // 处理快速检测项点击
  const handleQuickTestClick = (test: QuickTest) => {
    Taro.showModal({
      title: `${test.name}详情`,
      content: `您的${test.name}为 ${test.value} ${test.unit}\n状态：${test.status === 'normal' ? '正常' : '需要注意'}`,
      showCancel: false,
      confirmText: '知道了'
    })
  }

  // 处理健康资讯点击
  const handleArticleClick = (article: any) => {
    Taro.showToast({
      title: '查看文章：' + article.title,
      icon: 'none',
      duration: 2000
    })
  }

  return (
    <View className="care-page">
      {/* 状态栏占位 */}
      <View className="status-bar" style={{ height: `${statusBarHeight}px` }} />

      <ScrollView scrollY className="care-scroll">
        {/* 顶部欢迎区 */}
        <View className="welcome-header">
          <View className="welcome-content">
            <Text className="welcome-title">颐养身心</Text>
            <Text className="welcome-subtitle">专业健康管理，守护您的健康</Text>
          </View>
          <View className="welcome-decoration">
            <Text className="decoration-icon">💚</Text>
          </View>
        </View>

        {/* 健康数据大卡片 */}
        <View className="health-hero-card" onClick={handleHealthClick}>
          <View className="health-hero-header">
            <View className="health-title-section">
              <Text className="health-hero-title">今日健康</Text>
              <Text className="health-hero-date">{mockHealthData.date}</Text>
            </View>
            <View className="trend-badge">
              <Text className="trend-icon">📈</Text>
              <Text className="trend-text">较昨日上升</Text>
            </View>
          </View>
          <View className="health-hero-stats">
            <View className="hero-stat-item">
              <View className="stat-icon-wrapper blue">👟</View>
              <View className="stat-content">
                <Text className="hero-stat-value">{mockHealthData.steps.toLocaleString()}</Text>
                <Text className="hero-stat-label">步数</Text>
              </View>
              <Text className="stat-trend up">↑</Text>
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
                <Text className="hero-stat-value">{mockHealthData.bloodPressure}</Text>
                <Text className="hero-stat-label">血压</Text>
              </View>
              <Text className="stat-status normal">正常</Text>
            </View>
          </View>
        </View>

        {/* 快速检测区 */}
        <View className="quick-test-section">
          <Text className="section-title">快速检测</Text>
          <View className="quick-test-grid">
            {mockQuickTests.map((test) => (
              <View
                key={test.id}
                className="quick-test-card"
                style={{ borderColor: test.color }}
                onClick={() => handleQuickTestClick(test)}
              >
                <View className="test-icon" style={{ backgroundColor: test.color + '20' }}>
                  <Text className="test-emoji">{test.icon}</Text>
                </View>
                <Text className="test-name">{test.name}</Text>
                <View className="test-value-row">
                  <Text className="test-value" style={{ color: test.color }}>
                    {test.value}
                  </Text>
                  <Text className="test-unit">{test.unit}</Text>
                </View>
                <View className="test-status">
                  <Text className="status-dot" />
                  <Text className="status-text">{test.status === 'normal' ? '正常' : '注意'}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 健康服务网格 */}
        <View className="service-grid-section">
          <Text className="section-title">健康服务</Text>
          <View className="service-grid">
            {mockHealthServices.map((service) => (
              <View
                key={service.id}
                className="service-card"
                style={{ background: service.gradient }}
                onClick={() => handleServiceClick(service)}
              >
                <View className="service-icon">{service.icon}</View>
                <Text className="service-title">{service.title}</Text>
                <Text className="service-desc">{service.description}</Text>
                <View className="service-arrow">→</View>
              </View>
            ))}
          </View>
        </View>

        {/* 健康资讯卡片 */}
        <View className="article-section">
          <Text className="section-title">健康资讯</Text>
          <View className="article-list">
            {mockHealthArticles.map((article) => (
              <View
                key={article.id}
                className="article-card"
                onClick={() => handleArticleClick(article)}
              >
                {article.image ? (
                  <Image
                    src={article.image}
                    className="article-image"
                    mode="aspectFill"
                    lazyLoad
                  />
                ) : (
                  <View
                    className="article-image-placeholder"
                    style={{ background: article.gradient || '#1890ff' }}
                  >
                    <Text className="placeholder-icon">📰</Text>
                  </View>
                )}
                <View className="article-content">
                  <View className="article-header">
                    <Text
                      className="article-tag"
                      style={{ color: article.color, backgroundColor: article.color + '20' }}
                    >
                      {article.tag}
                    </Text>
                    <Text className="article-read-time">{article.readTime}</Text>
                  </View>
                  <Text className="article-title">{article.title}</Text>
                  <Text className="article-desc">{article.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 养生建议 */}
        <View className="wellness-tips-section">
          <Text className="section-title">养生建议</Text>
          <View className="wellness-tips-list">
            {mockWellnessTips.map((tip) => (
              <View
                key={tip.id}
                className="wellness-tip-card"
                style={{ borderLeftColor: tip.color }}
              >
                <View className="tip-icon-wrapper" style={{ backgroundColor: tip.color + '15' }}>
                  <Text className="tip-icon">{tip.icon}</Text>
                </View>
                <View className="tip-content">
                  <Text className="tip-title" style={{ color: tip.color }}>
                    {tip.title}
                  </Text>
                  <View className="tip-tags">
                    {tip.tips.map((t, index) => (
                      <Text key={index} className="tip-tag">
                        {t}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 健康小贴士 */}
        <View className="health-tips-section">
          {mockHealthTips.map((tip) => (
            <View
              key={tip.id}
              className={`health-tip-card importance-${tip.importance}`}
            >
              <View className="tip-header">
                <Text className="tip-big-icon">{tip.icon}</Text>
                <Text className="tip-head-title">{tip.title}</Text>
                {tip.importance === 'high' && <View className="urgent-badge">重要</View>}
              </View>
              <Text className="tip-body-text">{tip.content}</Text>
            </View>
          ))}
        </View>

        {/* 底部间距 */}
        <View className="bottom-spacer" />
      </ScrollView>
    </View>
  )
}

export default Care
