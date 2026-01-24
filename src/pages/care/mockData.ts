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

// 养生指导内容
export interface WellnessGuide {
  id: string
  title: string
  description: string
  image: string
  videoUrl: string
  tags: string[]
  duration: string
  category: 'diet' | 'exercise' | 'mind' | 'sleep'
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
    route: '/pages/care/data/consultation/index',
    type: 'consult',
    color: '#1890ff',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)'
  },
  {
    id: '2',
    icon: '📋',
    title: '健康档案',
    description: '记录健康，守护平安',
    route: '/pages/health-record/index',
    type: 'medication',
    color: '#52c41a',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)'
  },
  {
    id: '3',
    icon: '🏥',
    title: '康复理疗',
    description: '专业康复，恢复健康',
    route: '/pages/care/data/WellnessBooking/index',
    type: 'rehab',
    color: '#fa8c16',
    gradient: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)'
  },
  {
    id: '4',
    icon: '🧘',
    title: '养生指导',
    description: '中医养生，调理身心',
    route: '/pages/care/data/wellness/index',
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
    icon: '💧',
    title: '水分补充',
    content: '建议每天饮用 1.5-2 升水，保持良好的水合状态有助于维持身体正常代谢，促进血液循环，预防便秘和肾结石。',
    importance: 'high'
  },
  {
    id: '2',
    icon: '🚶',
    title: '适量运动',
    content: '建议每天进行 30 分钟的中等强度运动，如快走、太极拳等，有助于增强心肺功能，提高身体免疫力。',
    importance: 'medium'
  },
  {
    id: '3',
    icon: '🥗',
    title: '均衡饮食',
    content: '注意饮食均衡，多摄入蔬菜水果，适量补充优质蛋白质，减少高油高盐食物的摄入。',
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
    route: '/pages/care/data/consultation/index',
    type: 'consult' as const
  },
  {
    id: '2',
    icon: '📋',
    title: '健康档案',
    description: '记录健康，守护平安',
    route: '/pages/health-record/index',
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

// 养生指导列表数据
export const mockWellnessGuides: WellnessGuide[] = [
  {
    id: '1',
    title: '春季养生：养肝护胃',
    description: '春季养肝正当时，专家教您如何通过饮食和作息调理肝胃健康',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    tags: ['饮食调理', '春季养生'],
    duration: '5:30',
    category: 'diet'
  },
  {
    id: '2',
    title: '八段锦养生操',
    description: '传统八段锦养生操，简单易学，适合老年人日常锻炼',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    tags: ['传统运动', '强身健体'],
    duration: '8:15',
    category: 'exercise'
  },
  {
    id: '3',
    title: '冥想放松：减压助眠',
    description: '学习简单冥想技巧，缓解压力，改善睡眠质量',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    tags: ['冥想', '助眠'],
    duration: '12:00',
    category: 'mind'
  },
  {
    id: '4',
    title: '太极拳入门',
    description: '太极拳基础动作教学，增强体质，提高平衡能力',
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    tags: ['太极', '入门教学'],
    duration: '15:45',
    category: 'exercise'
  },
  {
    id: '5',
    title: '健康饮食：少盐少油',
    description: '科学饮食指南，如何做到少盐少油又美味',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    tags: ['健康饮食', '营养搭配'],
    duration: '6:20',
    category: 'diet'
  },
  {
    id: '6',
    title: '睡眠质量提升技巧',
    description: '改善睡眠环境，培养良好作息习惯，提升睡眠质量',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    tags: ['睡眠', '作息调整'],
    duration: '7:50',
    category: 'sleep'
  }
]
