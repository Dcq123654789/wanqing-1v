import { useState } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import "./index.scss";

function Privacy() {
  const [ready, setReady] = useState(false);

  useDidShow(() => {
    // 立即显示导航栏加载动画
    Taro.showNavigationBarLoading();

    // 500ms 后显示内容
    setTimeout(() => {
      // 设置导航栏标题
      Taro.setNavigationBarTitle({
        title: "隐私政策",
      });

      // 隐藏导航栏加载动画
      Taro.hideNavigationBarLoading();

      // 显示页面内容
      setReady(true);

      // 页面内容显示完成后通知登录页面隐藏跳转遮罩
      setTimeout(() => {
        Taro.eventCenter.trigger("hidePageTransition");
      }, 100);
    }, 500);
  });

  // 初始状态显示空白加载页
  if (!ready) {
    return <View className="loading-page"></View>;
  }

  return (
    <View className="privacy-page">
      <ScrollView scrollY className="privacy-content">
        <View className="content-section">
          <Text className="section-title">引言</Text>
          <Text className="section-content">
            温暖相伴智能养老服务平台（以下简称"我们"）非常重视用户的隐私保护。本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。使用我们的服务即表示您同意本隐私政策的条款。
          </Text>
        </View>

        <View className="content-section">
          <Text className="section-title">1. 信息收集</Text>
          <Text className="section-content">
            1.1 您提供的信息：包括注册时提供的姓名、电话号码、微信授权信息等。
          </Text>
          <Text className="section-content">
            1.2 自动收集的信息：包括设备信息、IP地址、位置信息、使用日志等。
          </Text>
          <Text className="section-content">
            1.3 第三方信息：包括通过微信等第三方平台获取的授权信息。
          </Text>
        </View>

        <View className="content-section">
          <Text className="section-title">2. 信息使用</Text>
          <Text className="section-content">2.1 提供和维护服务功能。</Text>
          <Text className="section-content">2.2 改进和优化用户体验。</Text>
          <Text className="section-content">2.3 发送重要通知和更新信息。</Text>
          <Text className="section-content">
            2.4 进行数据分析，以改进我们的产品和服务。
          </Text>
        </View>

        <View className="content-section">
          <Text className="section-title">3. 信息共享</Text>
          <Text className="section-content">
            3.1 除法律要求外，我们不会与第三方共享您的个人信息。
          </Text>
          <Text className="section-content">
            3.2 我们可能与服务提供商共享必要信息以提供服务。
          </Text>
          <Text className="section-content">
            3.3 在合并、收购或资产转让时，信息可能随之转移。
          </Text>
        </View>

        <View className="content-section">
          <Text className="section-title">4. 信息存储</Text>
          <Text className="section-content">
            4.1 您的个人信息将存储在安全的服务器上。
          </Text>
          <Text className="section-content">
            4.2 我们采取合理的技术措施保护信息安全。
          </Text>
          <Text className="section-content">
            4.3 数据保留期限仅在实现目的所需的最短时间内。
          </Text>
        </View>

        <View className="content-section">
          <Text className="section-title">5. 您的权利</Text>
          <Text className="section-content">5.1 访问和查看您的个人信息。</Text>
          <Text className="section-content">5.2 更正不准确的信息。</Text>
          <Text className="section-content">
            5.3 删除您的账户和相关个人信息。
          </Text>
          <Text className="section-content">5.4 撤销已给予的授权。</Text>
        </View>

        <View className="content-section">
          <Text className="section-title">6. Cookie 使用</Text>
          <Text className="section-content">
            我们使用 Cookie 和类似技术来改善用户体验。您可以通过浏览器设置控制
            Cookie，但这可能影响某些功能的使用。
          </Text>
        </View>

        <View className="content-section">
          <Text className="section-title">7. 儿童隐私保护</Text>
          <Text className="section-content">
            我们的服务面向成年用户。我们不会故意收集未满18周岁未成年人的个人信息。如果我们发现此类信息，将立即删除。
          </Text>
        </View>

        <View className="content-section">
          <Text className="section-title">8. 政策更新</Text>
          <Text className="section-content">
            我们可能随时更新本隐私政策。更新后的政策将在平台上发布，并在发布后生效。您继续使用服务即表示同意更新后的政策。
          </Text>
        </View>

        <View className="content-section">
          <Text className="section-title">9. 联系我们</Text>
          <Text className="section-content">
            如您对本隐私政策有任何疑问或意见，请通过以下方式联系我们：
          </Text>
          <Text className="section-content">客服电话：400-123-4567</Text>
          <Text className="section-content">电子邮箱：privacy@wanqing.com</Text>
          <Text className="section-content">
            联系地址：北京市朝阳区XX路XX号
          </Text>
        </View>

        <View className="content-section">
          <Text className="section-title">10. 生效日期</Text>
          <Text className="section-content">
            本隐私政策自2024年1月1日起生效。
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default Privacy;
