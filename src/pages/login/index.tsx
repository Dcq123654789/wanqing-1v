/**
 * 登录页面
 * 支持微信小程序一键登录
 */
import React, { useState } from "react";
import { View, Image, Button, Text } from "@tarojs/components";
import Taro, { useDidShow, useLoad } from "@tarojs/taro";
import { useUserStore } from "@/store/userStore";
import "./index.scss";

interface LoginState {
  loading: boolean;
  agreed: boolean;
  pageTransition: boolean;
}

interface WechatUserInfo {
  nickName: string;
  avatarUrl: string;
  gender: number;
}

function Login() {
  const [state, setState] = useState<LoginState>({
    loading: false,
    agreed: true,
    pageTransition: false,
  });

  const { login, isLoggedIn, initializeAuth, getCurrentUser } = useUserStore();

  /**
   * 检查登录状态并跳转到首页
   */
  const checkLoginAndRedirect = () => {
    if (isLoggedIn) {
      console.log('用户已登录，跳转到首页');
      setTimeout(() => {
        Taro.switchTab({
          url: "/pages/home/index",
        });
      }, 100);
      return true;
    }
    return false;
  };

  /**
   * 页面加载时检查登录状态
   */
  useLoad(() => {
    console.log('登录页面加载');
    // 注意：initializeAuth() 已在 App 启动时调用，这里不需要重复调用
    checkLoginAndRedirect();
  });

  /**
   * 页面显示时再次检查
   */
  useDidShow(() => {
    // 如果是从其他页面返回，隐藏跳转遮罩
    if (state.pageTransition) {
      setState((prev) => ({ ...prev, pageTransition: false }));
    }

    // 再次检查登录状态
    checkLoginAndRedirect();
  });

  /**
   * 跳转到用户协议
   */
  const handleGoToAgreement = () => {
    setState((prev) => ({ ...prev, pageTransition: true }));

    setTimeout(() => {
      Taro.navigateTo({
        url: "/pages/login/agreement/index",
      });

      setTimeout(() => {
        setState((prev) => ({ ...prev, pageTransition: false }));
      }, 1200);
    }, 50);
  };

  /**
   * 跳转到隐私政策
   */
  const handleGoToPrivacy = () => {
    setState((prev) => ({ ...prev, pageTransition: true }));

    setTimeout(() => {
      Taro.navigateTo({
        url: "/pages/login/privacy/index",
      });

      setTimeout(() => {
        setState((prev) => ({ ...prev, pageTransition: false }));
      }, 1200);
    }, 50);
  };

  /**
   * 获取微信用户信息
   * 注意：新版小程序需要用户主动授权才能获取头像和昵称
   */
  const getWechatUserInfo = async (): Promise<WechatUserInfo | null> => {
    return new Promise((resolve) => {
      // 尝试获取用户信息
      Taro.getUserInfo({
        success: (res) => {
          console.log('获取用户信息成功:', res);
          resolve({
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
            gender: res.userInfo.gender,
          });
        },
        fail: (err) => {
          console.log('获取用户信息失败（用户拒绝或未授权）:', err);
          // 用户拒绝授权，返回null，使用默认信息
          resolve(null);
        },
      });
    });
  };

  /**
   * 微信一键登录
   */
  const handleWechatLogin = async () => {
    // 检查是否同意协议
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
      // 第一步：获取微信登录code
      console.log('开始微信登录...');
      const loginRes = await Taro.login({
        provider: "weixin",
      });

      if (!loginRes.code) {
        throw new Error('获取微信授权码失败');
      }

      console.log('获取微信code成功:', loginRes.code);

      // 第二步：尝试获取用户信息（可选）
      let userInfo: WechatUserInfo | null = null;
      try {
        userInfo = await getWechatUserInfo();
      } catch (err) {
        console.log('获取用户信息失败，将使用默认信息');
      }

      // 第三步：调用后端登录接口
      // 注意：不传递微信头像和昵称，避免覆盖用户已设置的自定义头像
      // 后端会返回数据库中保存的用户完整信息
      const success = await login({
        type: 'wechat',
        code: loginRes.code,
        // nickname: userInfo?.nickName,  // 不传递，避免覆盖
        // avatar: userInfo?.avatarUrl,    // 不传递，避免覆盖
        // gender: userInfo?.gender,       // 不传递，避免覆盖
      });

      if (success) {
        // 登录成功
        console.log('登录成功，准备跳转');

        // 重新获取最新的用户信息
        const currentUserInfo = useUserStore.getState().userInfo;
        const isNewUser = currentUserInfo?.isNewUser || false;

        console.log('用户信息:', currentUserInfo, '是否新用户:', isNewUser);

        if (isNewUser) {
          // 新用户：跳转到完善信息页面
          Taro.showToast({
            title: "欢迎加入晚晴",
            icon: "success",
            duration: 1500,
          });

          setTimeout(() => {
            Taro.redirectTo({
              url: "/pages/login/complete-info/index",
            });
          }, 1500);
        } else {
          // 老用户：initializeAuth() 已经自动获取了最新用户信息，直接进入首页
          Taro.showToast({
            title: "登录成功",
            icon: "success",
            duration: 1500,
          });

          setTimeout(() => {
            Taro.switchTab({
              url: "/pages/home/index",
            });
          }, 1500);
        }
      } else {
        // 登录失败
        console.error('登录失败');
        Taro.showToast({
          title: "登录失败，请重试",
          icon: "none",
          duration: 2000,
        });
      }
    } catch (error: any) {
      console.error("微信登录异常:", error);

      // 根据错误类型显示不同的提示
      let errorMessage = "登录失败，请重试";

      if (error.errMsg) {
        if (error.errMsg.includes('auth deny')) {
          errorMessage = "您拒绝了授权";
        } else if (error.errMsg.includes('network')) {
          errorMessage = "网络连接失败";
        } else if (error.errMsg.includes('timeout')) {
          errorMessage = "请求超时";
        }
      }

      Taro.showToast({
        title: errorMessage,
        icon: "none",
        duration: 2000,
      });
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <View className="login-page">
      {/* 页面跳转时的全屏loading遮罩 */}
      {state.pageTransition && <View className="page-transition-overlay" />}

      {/* 背景图片 */}
      <View className="login-background">
        <Image
          src={require("../../assets/images/backgrounds/login-bg.png")}
          className="bg-image"
          mode="aspectFill"
        />
        <View className="bg-overlay" />
      </View>

      {/* 登录内容 */}
      <View className="login-container">
        <View className="login-content">
          <View className="login-footer">
            {/* 欢迎文案 */}
            <View className="welcome-section">
              <Text className="app-slogan">温暖相伴，幸福晚年</Text>
              <Text className="welcome-desc">智能养老服务平台</Text>
            </View>

            {/* 微信登录按钮 */}
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

            {/* 协议勾选 */}
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
