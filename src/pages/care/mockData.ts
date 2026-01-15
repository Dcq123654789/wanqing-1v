/**
 * 颐养页面 - Mock 数据（内容丰富版）
 */

// 健康数据类型
export interface HealthData {
  date: string
  steps: number
  stepsTrend: 'up' | 'down' | 'stable'
  sleep: string
  sleepQuality: 'good' | 'normal' | 'bad'
  bloodPressure: string
  heartRate: number
}

// 快速检测项
export interface QuickTest {
  id: string
  name: string
  value: string
  unit: string
  icon: string
  color: string
  status: 'normal' | 'warning' | 'attention'
}

// 健康服务类型
export interface HealthService {
  id: string
  icon: string
  title: string
  description: string
  route?: string
  type: 'consult' | 'medication' | 'rehab' | 'wellness'
  color: string
  gradient: string
}

// 健康资讯类型
export interface HealthArticle {
  id: string
  image: string
  title: string
  description: string
  tag: string
  readTime: string
}

// 养生建议
export interface WellnessTip {
  id: string
  icon: string
  title: string
  tips: string[]
  color: string
}

// 健康小贴士
export interface HealthTip {
  id: string
  icon: string
  title: string
  content: string
  importance: 'high' | 'medium' | 'low'
}

// 今日健康数据
export const mockHealthData: HealthData = {
  date: '2026年1月15日 周四',
  steps: 7542,
  stepsTrend: 'up',
  sleep: '6.5h',
  sleepQuality: 'good',
  bloodPressure: '120/80',
  heartRate: 72
}

// 快速检测数据
export const mockQuickTests: QuickTest[] = [
  {
    id: '1',
    name: '心率',
    value: '72',
    unit: '次/分',
    icon: '❤️',
    color: '#ff4d4f',
    status: 'normal'
  },
  {
    id: '2',
    name: '体重',
    value: '65.5',
    unit: 'kg',
    icon: '⚖️',
    color: '#52c41a',
    status: 'normal'
  },
  {
    id: '3',
    name: '体温',
    value: '36.6',
    unit: '℃',
    icon: '🌡️',
    color: '#fa8c16',
    status: 'normal'
  },
  {
    id: '4',
    name: '血氧',
    value: '98',
    unit: '%',
    icon: '💧',
    color: '#1890ff',
    status: 'normal'
  }
]

// 健康服务
export const mockHealthServices: HealthService[] = [
  {
    id: '1',
    icon: '🩺',
    title: '在线问诊',
    description: '专业医生在线咨询',
    route: '/pages/consult/index',
    type: 'consult',
    color: '#1890ff',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)'
  },
  {
    id: '2',
    icon: '💊',
    title: '用药提醒',
    description: '定时提醒，关爱健康',
    type: 'medication',
    color: '#52c41a',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)'
  },
  {
    id: '3',
    icon: '🏥',
    title: '康复理疗',
    description: '专业康复，恢复健康',
    route: '/pages/rehab/index',
    type: 'rehab',
    color: '#fa8c16',
    gradient: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)'
  },
  {
    id: '4',
    icon: '🧘',
    title: '养生指导',
    description: '中医养生，调理身心',
    type: 'wellness',
    color: '#722ed1',
    gradient: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)'
  }
]

// 健康资讯
export const mockHealthArticles: HealthArticle[] = [
  {
    id: '1',
    image: '',
    title: '春季养生：多吃时令蔬菜',
    description: '春天是万物复苏的季节，多吃时令蔬菜有助于增强免疫力...',
    tag: '饮食建议',
    readTime: '3分钟',
    color: '#52c41a',
    gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)'
  },
  {
    id: '2',
    image: '',
    title: '适度运动，延年益寿',
    description: '每天坚持适量运动，可以促进血液循环，改善心肺功能...',
    tag: '运动健身',
    readTime: '5分钟',
    color: '#1890ff',
    gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)'
  }
]

// 养生建议
export const mockWellnessTips: WellnessTip[] = [
  {
    id: '1',
    icon: '🥗',
    title: '饮食建议',
    tips: ['少盐少油', '多吃蔬菜', '适量水果', '规律饮食'],
    color: '#52c41a'
  },
  {
    id: '2',
    icon: '🏃',
    title: '运动建议',
    tips: ['每日步行', '太极练习', '适量运动', '避免剧烈'],
    color: '#1890ff'
  },
  {
    id: '3',
    icon: '😴',
    title: '作息建议',
    tips: ['早睡早起', '午休半小时', '规律作息', '避免熬夜'],
    color: '#722ed1'
  }
]

// 健康小贴士
export const mockHealthTips: HealthTip[] = [
  {
    id: '1',
    icon: '💡',
    title: '今日提醒',
    content: '春季气候多变，注意保暖防寒，适时增减衣物，预防感冒。',
    importance: 'high'
  },
  {
    id: '2',
    icon: '🍵',
    title: '养生小知识',
    content: '每天喝一杯温水，有助于促进新陈代谢，清理肠胃。',
    importance: 'medium'
  },
  {
    id: '3',
    icon: '🧘',
    title: '心理健康',
    content: '保持心情愉悦，多参加社交活动，有益身心健康。',
    importance: 'medium'
  }
]

// 旧版兼容导出
export const mockHealthDataOld = {
  date: '2026年1月12日',
  steps: 7542,
  sleep: '6.5h',
  bloodPressure: '120/80'
}

export const mockHealthServicesOld = [
  {
    id: '1',
    icon: '🩺',
    title: '在线问诊',
    description: '专业医生在线咨询',
    route: '/pages/consult/index',
    type: 'consult' as const
  },
  {
    id: '2',
    icon: '💊',
    title: '用药提醒',
    description: '定时提醒，关爱健康',
    type: 'medication' as const
  },
  {
    id: '3',
    icon: '🏥',
    title: '康复理疗',
    description: '专业康复，恢复健康',
    route: '/pages/rehab/index',
    type: 'rehab' as const
  },
  {
    id: '4',
    icon: '🧘',
    title: '养生指导',
    description: '中医养生，调理身心',
    type: 'wellness' as const
  }
]

export const mockWellnessTipsOld = [
  {
    id: '1',
    image: require('@/assets/images/illustrations/nature-illustration.png'),
    title: '亲近自然，放松心情',
    description: '户外活动有益身心健康',
    link: '/pages/wellness/index'
  }
]
