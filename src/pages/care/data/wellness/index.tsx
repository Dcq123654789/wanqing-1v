import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState, useEffect } from "react";
import "./index.scss";
import { mockWellnessGuides, WellnessGuide } from "../../mockData";

// 状态类型
type PageState = "loading" | "success" | "empty" | "error";

// 默认封面图（图片加载失败时使用）
const DEFAULT_COVER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect fill='%23f5f0ff' width='800' height='450'/%3E%3Ctext fill='%23722ed1' font-family='Arial' font-size='48' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E养生指导%3C/text%3E%3C/svg%3E";

function WellnessGuidePage() {
  const [pageState, setPageState] = useState<PageState>("loading");
  const [guides, setGuides] = useState<WellnessGuide[]>([]);
  const [error, setError] = useState<string>("");

  // 模拟数据加载
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setPageState("loading");

      // 模拟网络请求延迟
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 加载数据
      const data = mockWellnessGuides;

      if (data.length === 0) {
        setPageState("empty");
      } else {
        setGuides(data);
        setPageState("success");
      }
    } catch (err) {
      console.error("加载养生指导失败:", err);
      setError("加载失败，请稍后重试");
      setPageState("error");
    }
  };

  // 处理图片加载错误
  const handleImageError = (e: any) => {
    console.log("图片加载失败，使用默认图片");
    e.target.src = DEFAULT_COVER;
  };

  // 处理养生指导卡片点击
  const handleGuideClick = (guide: WellnessGuide) => {
    Taro.showModal({
      title: guide.title,
      content: guide.description,
      confirmText: "播放视频",
      cancelText: "关闭",
      success: (res) => {
        if (res.confirm && guide.videoUrl) {
          // 跳转到视频播放页面或直接播放
          Taro.showToast({
            title: "播放视频功能开发中",
            icon: "none",
            duration: 2000,
          });
        }
      },
    });
  };

  // 重新加载
  const handleRetry = () => {
    loadData();
  };

  // 渲染骨架屏
  const renderSkeleton = () => (
    <>
      {[1, 2, 3].map((item) => (
        <View key={item} className="skeleton-card">
          <View className="skeleton-cover" />
          <View className="skeleton-content">
            <View className="skeleton-title" />
            <View className="skeleton-description" />
            <View className="skeleton-tags">
              <View className="skeleton-tag" />
              <View className="skeleton-tag" />
            </View>
          </View>
        </View>
      ))}
    </>
  );

  // 渲染空状态
  const renderEmpty = () => (
    <View className="empty-state">
      <Text className="empty-icon">📭</Text>
      <Text className="empty-title">暂无养生指导内容</Text>
      <Text className="empty-description">
        敬请期待更多养生指导视频
      </Text>
    </View>
  );

  // 渲染错误状态
  const renderError = () => (
    <View className="error-state">
      <Text className="error-icon">⚠️</Text>
      <Text className="error-title">加载失败</Text>
      <Text className="error-message">{error}</Text>
      <View className="retry-button" onClick={handleRetry}>
        <Text>重新加载</Text>
      </View>
    </View>
  );

  return (
    <View className="wellness-guide-page">
      <ScrollView scrollY className="wellness-scroll">
        {/* 养生指导列表 */}
        <View className="wellness-list">
          {pageState === "loading" && renderSkeleton()}

          {pageState === "success" &&
            guides.map((guide) => (
              <View
                key={guide.id}
                className="wellness-card"
                onClick={() => handleGuideClick(guide)}
              >
                {/* 视频封面 */}
                <View className="card-cover">
                  <Image
                    src={guide.image}
                    className="cover-image"
                    mode="aspectFill"
                    lazyLoad
                    onError={handleImageError}
                  />
                  <View className="play-overlay">
                    <View className="play-button">
                      {/* 使用 SVG 图标替代文本符号 */}
                      <Text className="play-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M6 4l10 6-10 6V4z" />
                        </svg>
                      </Text>
                    </View>
                  </View>
                  <View className="duration-badge">
                    <Text className="duration-text">{guide.duration}</Text>
                  </View>
                </View>

                {/* 内容信息 */}
                <View className="card-content">
                  <Text className="card-title">{guide.title}</Text>
                  <Text className="card-description">{guide.description}</Text>

                  {/* 标签 */}
                  <View className="card-tags">
                    {guide.tags.map((tag, index) => (
                      <View key={index} className="tag-item">
                        <Text className="tag-text">{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}

          {pageState === "empty" && renderEmpty()}

          {pageState === "error" && renderError()}
        </View>

        {/* 底部留白 */}
        <View className="bottom-spacer"></View>
      </ScrollView>
    </View>
  );
}

export default WellnessGuidePage;
