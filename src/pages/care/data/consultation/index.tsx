import { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Input, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import { healthConsultation, getConversationHistory } from "@/services/qwen";

// 消息类型
interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function Consultation() {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "您好！我是智能健康助手，有什么健康问题可以咨询我。",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync();
    setStatusBarHeight(systemInfo.statusBarHeight || 0);
  }, []);

  // 滚动到底部
  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          top: 1000000,
          animated: true,
        });
      }
    }, 100);
  };

  // 发送消息
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) {
      Taro.showToast({
        title: "请输入问题",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // 获取对话历史（排除欢迎消息）
      const conversationHistory = messages
        .filter((msg) => msg.id !== "1")
        .map((msg) => ({
          type: msg.type,
          content: msg.content,
        }));

      // 调用通义千问API
      const response = await healthConsultation(text, conversationHistory);

      // 添加AI回复
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("AI问诊失败:", error);

      // 显示错误提示
      Taro.showToast({
        title: error.message || "服务暂时不可用",
        icon: "none",
        duration: 3000,
      });

      // 添加错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "抱歉，我现在无法回答您的问题。请稍后再试，或直接咨询专业医生。",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理输入框变化
  const handleInputChange = (e: any) => {
    setInputText(e.detail.value);
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <View className="consultation-page"> 
      {/* 消息列表区域 */}
      <ScrollView 
        ref={scrollViewRef}
        scrollY
        className="message-container"
        scrollIntoView="message-last"
        scrollTop={99999}
      >
        <View className="message-list">
          {messages.map((message) => (
            <View
              key={message.id}
              className={`message-item message-${message.type}`}
            >
              <View className="message-content-wrapper">
                {message.type === "assistant" && (
                  <View className="avatar avatar-assistant">
                    <Text className="avatar-text">👨‍⚕️</Text>
                  </View>
                )}
                <View className="message-bubble">
                  <Text className="message-text">{message.content}</Text>
                  <Text className="message-time">
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
                {message.type === "user" && (
                  <View className="avatar avatar-user">
                    <Text className="avatar-text">👤</Text>
                  </View>
                )}
              </View>
            </View>
          ))}

          {/* 加载中提示 */}
          {isLoading && (
            <View className="message-item message-assistant">
              <View className="message-content-wrapper">
                <View className="avatar avatar-assistant">
                  <Text className="avatar-text">👨‍⚕️</Text>
                </View>
                <View className="message-bubble">
                  <View className="typing-indicator">
                    <Text className="typing-dot">●</Text>
                    <Text className="typing-dot">●</Text>
                    <Text className="typing-dot">●</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View id="message-last" style={{ height: "20px" }} />
        </View>
      </ScrollView>

      {/* 底部输入区域 */}
      <View className="input-area">
        <View className="input-wrapper">
          <Input
            className="message-input"
            placeholder="请输入您的健康问题..."
            value={inputText}
            onInput={handleInputChange}
            placeholderClass="input-placeholder"
            confirmType="send"
            onConfirm={handleSend}
            maxlength={500}
            disabled={isLoading}
          />
          <Button
            className="send-button"
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Text className="send-button-text">
              {isLoading ? "发送中" : "发送"}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default Consultation;
