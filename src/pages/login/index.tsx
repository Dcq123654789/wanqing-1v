import React, { useState } from "react";
import { View, Image, Button, Text } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useUserStore } from "@/store/userStore";
import "./index.scss";

interface LoginState {
  loading: boolean;
  agreed: boolean;
  pageTransition: boolean;
}

function Login() {
  const [state, setState] = useState<LoginState>({
    loading: false,
    agreed: true,
    pageTransition: false,
  });

  const { login } = useUserStore();

  // 监听页面跳转完成事件
  useDidShow(() => {
    // 如果是从其他页面返回，隐藏跳转遮罩
    if (state.pageTransition) {
      setState((prev) => ({ ...prev, pageTransition: false }));
    }
  });

  // 监听目标页面加载完成事件
  React.useEffect(() => {
    const handleHideTransition = () => {
      console.log("收到隐藏遮罩事件");
      setState((prev) => ({ ...prev, pageTransition: false }));
    };

    Taro.eventCenter.on("hidePageTransition", handleHideTransition);

    return () => {
      Taro.eventCenter.off("hidePageTransition", handleHideTransition);
    };
  }, []);

  // 跳转到用户协议
  const handleGoToAgreement = () => {
    setState((prev) => ({ ...prev, pageTransition: true }));

    // 延迟跳转，让loading遮罩先显示
    setTimeout(() => {
      Taro.navigateTo({
        url: "/pages/login/agreement/index",
      });

      // 页面跳转完成后延迟隐藏遮罩，确保新页面完全加载
      setTimeout(() => {
        setState((prev) => ({ ...prev, pageTransition: false }));
      }, 1200);
    }, 50);
  };

  // 跳转到隐私政策
  const handleGoToPrivacy = () => {
    setState((prev) => ({ ...prev, pageTransition: true }));

    // 延迟跳转，让loading遮罩先显示
    setTimeout(() => {
      Taro.navigateTo({
        url: "/pages/login/privacy/index",
      });

      // 页面跳转完成后延迟隐藏遮罩，确保新页面完全加载
      setTimeout(() => {
        setState((prev) => ({ ...prev, pageTransition: false }));
      }, 1200);
    }, 50);
  };

  // 微信一键登录
  const handleWechatLogin = async () => {
    if (!state.agreed) {
      Taro.showToast({
        title: "请先阅读并同意用户协议和隐私政策",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    try {
      // 调用微信登录
      const res = await Taro.login({
        provider: "weixin",
      });

      if (res.code) {
        // TODO: 将 res.code 发送到后端服务器，换取用户信息
        // 这里暂时使用本地登录模拟
        const success = await login("wechat_user", res.code);

        if (success) {
          Taro.showToast({
            title: "登录成功",
            icon: "success",
          });

          setTimeout(() => {
            Taro.switchTab({
              url: "/pages/home/index",
            });
          }, 1000);
        } else {
          Taro.showToast({
            title: "登录失败",
            icon: "error",
          });
        }
      } else {
        Taro.showToast({
          title: "微信授权失败",
          icon: "none",
        });
      }
    } catch (error) {
      console.error("微信登录失败:", error);
      Taro.showToast({
        title: "登录失败",
        icon: "error",
      });
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <View className="login-page">
      {/* 页面跳转时的全屏loading遮罩 */}
      {state.pageTransition && <View className="page-transition-overlay" />}
      <View className="login-background">
        <Image
          src={require("../../assets/images/backgrounds/login-bg.png")}
          className="bg-image"
          mode="aspectFill"
        />
        <View className="bg-overlay" />
      </View>

      <View className="login-container">
        <View className="login-content">
          <View className="login-footer">
            <View className="welcome-section">
              <Text className="app-slogan">温暖相伴，幸福晚年</Text>
              <Text className="welcome-desc">智能养老服务平台</Text>
            </View>
            <Button
              className={`wechat-login-button ${
                state.loading ? "loading" : ""
              } ${!state.agreed ? "disabled" : ""}`}
              onClick={handleWechatLogin}
              disabled={state.loading || !state.agreed}
            >
              <Image
                src={require("../../assets/images/icons/icon-wechat.png")}
                className="wechat-icon"
              />
              <Text className="wechat-login-text">
                {state.loading ? "登录中..." : "微信一键登录"}
              </Text>
            </Button>

            <View className="agreement-section">
              <View
                className={`checkbox ${state.agreed ? "checked" : ""}`}
                onClick={() =>
                  setState((prev) => ({ ...prev, agreed: !prev.agreed }))
                }
              >
                {state.agreed && <Text className="checkbox-icon">✓</Text>}
              </View>
              <Text className="footer-text">
                我已阅读并同意
                <Text className="link-text" onClick={handleGoToAgreement}>
                  《用户协议》
                </Text>
                和
                <Text className="link-text" onClick={handleGoToPrivacy}>
                  《隐私政策》
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Login;
