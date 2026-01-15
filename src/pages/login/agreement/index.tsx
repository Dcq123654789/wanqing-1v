import { View, Text, ScrollView } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useState } from "react";
import "./index.scss";

// 静态内容，避免在组件内部定义
const CONTENT = (
  <>
    <View className="content-section">
      <Text className="section-title">1. 服务条款的接受</Text>
      <Text className="section-content">
        欢迎使用温暖相伴智能养老服务平台！通过访问或使用本平台，您确认您已阅读、理解并同意接受本用户协议的所有条款和条件。如果您不同意这些条款，请不要使用本平台。
      </Text>
    </View>

    <View className="content-section">
      <Text className="section-title">2. 账户注册</Text>
      <Text className="section-content">
        2.1 您在注册时必须提供真实、准确、完整的个人信息。
      </Text>
      <Text className="section-content">
        2.2 您应对您的账户和密码的安全负全部责任。
      </Text>
      <Text className="section-content">2.3 您不得将账户转让给他人使用。</Text>
    </View>

    <View className="content-section">
      <Text className="section-title">3. 用户行为规范</Text>
      <Text className="section-content">
        3.1 您在使用本平台时，必须遵守相关法律法规。
      </Text>
      <Text className="section-content">
        3.2 您不得利用本平台从事任何违法或不当活动。
      </Text>
      <Text className="section-content">
        3.3 您不得发布违法、有害、虚假、侮辱性或骚扰性的信息。
      </Text>
    </View>

    <View className="content-section">
      <Text className="section-title">4. 知识产权</Text>
      <Text className="section-content">
        本平台的所有内容，包括但不限于文字、图片、音频、视频、软件等，均受知识产权法保护。未经授权，您不得复制、修改、传播或用于商业目的。
      </Text>
    </View>

    <View className="content-section">
      <Text className="section-title">5. 免责声明</Text>
      <Text className="section-content">
        5.1 本平台按"现状"提供服务，不保证服务的连续性、及时性或无错误。
      </Text>
      <Text className="section-content">
        5.2 因不可抗力导致的服务中断，本平台不承担责任。
      </Text>
    </View>

    <View className="content-section">
      <Text className="section-title">6. 协议修改</Text>
      <Text className="section-content">
        本平台有权随时修改本协议，修改后的协议一经发布即生效。您继续使用本平台即表示同意修改后的协议。
      </Text>
    </View>

    <View className="content-section">
      <Text className="section-title">7. 联系我们</Text>
      <Text className="section-content">
        如您对本协议有任何疑问，请通过以下方式联系我们：
      </Text>
      <Text className="section-content">客服电话：400-123-4567</Text>
      <Text className="section-content">电子邮箱：service@wanqing.com</Text>
    </View>

    <View className="content-section">
      <Text className="section-title">8. 生效日期</Text>
      <Text className="section-content">
        本协议自您注册或使用本平台之日起生效。
      </Text>
    </View>
  </>
);

function Agreement() {
  const [ready, setReady] = useState(false);

  useDidShow(() => {
    // 立即显示导航栏加载动画
    Taro.showNavigationBarLoading();

    // 500ms 后显示内容
    setTimeout(() => {
      // 设置导航栏标题
      Taro.setNavigationBarTitle({
        title: "用户协议",
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
    <View className="agreement-page">
      <ScrollView scrollY className="agreement-content">
        {CONTENT}
      </ScrollView>
    </View>
  );
}

export default Agreement;
