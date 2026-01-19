/**
 * 通义千问 API 服务
 * 文档：https://help.aliyun.com/zh/model-studio/qwen-api-reference
 */
import Taro from '@tarojs/taro';

// API 配置
const QWEN_CONFIG = {
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: 'sk-d15f9ac7d66347e984cdbcc6ba532e19',
  model: 'qwen-turbo',
  temperature: 0.5, // 医疗建议使用中等创造性
  maxTokens: 2000,
};

// 聊天消息类型
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// API 响应类型
interface QwenResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// API 错误类型
interface QwenError {
  code?: string;
  message: string;
}

/**
 * 医疗助手的系统提示词（简化版）
 */
const MEDICAL_SYSTEM_PROMPT = `你是一位专业的健康咨询助手。请提供简洁、专业的健康建议。
重要：不做确诊，严重症状建议及时就医。回答仅供参考，不能替代专业医生诊断。`;

/**
 * 调用通义千问 API
 */
async function callQwenAPI(messages: ChatMessage[]): Promise<string> {
  try {
    const requestData = {
      model: QWEN_CONFIG.model,
      messages: messages,
      temperature: QWEN_CONFIG.temperature,
      max_tokens: QWEN_CONFIG.maxTokens,
    };

    console.log('请求参数:', JSON.stringify(requestData, null, 2));

    const response = await Taro.request({
      url: `${QWEN_CONFIG.baseURL}/chat/completions`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_CONFIG.apiKey}`,
      },
      data: requestData,
    });

    console.log('响应状态:', response.statusCode);
    console.log('响应数据:', response.data);

    // 检查 HTTP 状态码
    if (response.statusCode !== 200) {
      const errorData: QwenError = response.data as QwenError;
      console.error('API 错误详情:', response.statusCode, response.data);
      throw new Error(errorData.message || JSON.stringify(response.data) || `HTTP ${response.statusCode}: 请求失败`);
    }

    const data: QwenResponse = response.data as QwenResponse;

    // 提取回复内容
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }

    throw new Error('API 返回数据格式错误');
  } catch (error: any) {
    console.error('通义千问 API 调用失败:', error);
    throw error;
  }
}

/**
 * 医疗健康咨询
 * @param question 用户的问题
 * @param history 聊天历史（可选，用于上下文连贯）
 * @returns AI 的回复
 */
export async function healthConsultation(
  question: string,
  history: Array<{ type: 'user' | 'assistant'; content: string }> = []
): Promise<string> {
  // 构建消息列表
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: MEDICAL_SYSTEM_PROMPT,
    },
    // 转换历史消息格式：type -> role
    ...formatMessagesToAPI(history).slice(-10), // 只保留最近10条历史，避免超出token限制
    {
      role: 'user',
      content: question,
    },
  ];

  try {
    const response = await callQwenAPI(messages);
    return response;
  } catch (error: any) {
    // 返回友好的错误提示
    if (error.message.includes('401')) {
      throw new Error('API密钥无效，请检查配置');
    } else if (error.message.includes('429')) {
      throw new Error('请求过于频繁，请稍后再试');
    } else if (error.message.includes('network')) {
      throw new Error('网络连接失败，请检查网络');
    } else {
      throw new Error('服务暂时不可用，请稍后再试');
    }
  }
}

/**
 * 获取对话历史（用于上下文）
 * @param messages 消息列表
 * @returns 格式化后的对话历史
 */
export function getConversationHistory(
  messages: Array<{ type: 'user' | 'assistant'; content: string }>
): ChatMessage[] {
  return messages.map((msg) => ({
    role: msg.type === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));
}

/**
 * 将页面消息格式转换为API消息格式（内部使用）
 */
function formatMessagesToAPI(
  messages: Array<{ type: 'user' | 'assistant'; content: string }>
): ChatMessage[] {
  return messages.map((msg) => ({
    role: msg.type === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));
}

// 导出配置（供调试使用）
export const QWEN_API_CONFIG = QWEN_CONFIG;
