/**
 * 康养预订模拟数据
 */
import type { WellnessService, WellnessServiceListItem } from './types'

// 完整的康养服务数据
export const mockWellnessServices: WellnessService[] = [
  {
    id: '1',
    title: '阳光康养中心',
    coverImage: require('@/assets/images/joy/activity/calligraphy.jpg'),
    description: '阳光康养中心是一家集医疗、康复、护理、休闲于一体的现代化康养机构，拥有专业的医护团队和先进的设施设备，为长者提供全方位的康养服务。',
    serviceTypes: ['medical', 'rehabilitation', 'nursing'],
    facilities: ['专业医疗室', '康复训练中心', '24小时护理站', '营养餐厅', '健身房', '图书阅览室', '心理咨询室'],
    location: {
      name: '阳光康养中心',
      address: '晚晴社区服务中心东侧 500米',
      latitude: 39.9042,
      longitude: 116.4074
    },
    contact: {
      phone: '400-888-9999',
      wechat: 'yangguang wellness'
    },
    images: [
      require('@/assets/images/joy/activity/calligraphy.jpg'),
      require('@/assets/images/joy/activity/taichi.jpg'),
      require('@/assets/images/joy/activity/dance.jpg')
    ],
    highlights: [
      '专业医疗团队24小时值守',
      '个性化康复方案定制',
      '营养膳食科学搭配',
      '丰富文娱活动安排'
    ],
    tags: ['医疗护理', '康复训练', '专业团队'],
    status: 'available',
    category: 'medical',
    openingHours: '周一至周日 08:00-18:00',
    bookingNotice: '请提前3天预约，需提供身份证和健康证明'
  },
  {
    id: '2',
    title: '绿城康复护理院',
    coverImage: require('@/assets/images/joy/activity/taichi.jpg'),
    description: '绿城康复护理院专注于康复护理服务，配备先进康复设备和专业康复师团队，为中风、骨折术后等患者提供专业的康复训练和护理服务。',
    serviceTypes: ['rehabilitation', 'nursing'],
    facilities: ['康复训练大厅', '物理治疗室', '作业治疗室', '言语治疗室', '中医理疗室', '护理病房'],
    location: {
      name: '绿城康复护理院',
      address: '社区健康路88号'
    },
    contact: {
      phone: '400-666-8888'
    },
    images: [
      require('@/assets/images/joy/activity/taichi.jpg')
    ],
    highlights: [
      '一对一康复训练指导',
      '中西医结合治疗',
      '护理员持证上岗',
      '家属探视便捷'
    ],
    tags: ['康复训练', '专业护理', '中西医结合'],
    status: 'limited',
    category: 'rehabilitation',
    openingHours: '周一至周六 08:30-17:30',
    bookingNotice: '需携带病历资料，康复师评估后制定方案'
  },
  {
    id: '3',
    title: '康乐养老社区',
    coverImage: require('@/assets/images/joy/activity/dance.jpg'),
    description: '康乐养老社区提供居家式养老服务，打造温馨舒适的居住环境，让长者在熟悉的社区环境中享受专业照护和丰富的晚年生活。',
    serviceTypes: ['nursing', 'leisure'],
    facilities: ['舒适客房', '活动中心', '棋牌室', '影音室', '花园庭院', '餐厅', '洗衣房'],
    location: {
      name: '康乐养老社区',
      address: '社区花园路123号'
    },
    contact: {
      phone: '400-999-7777',
      wechat: 'kangle community'
    },
    images: [
      require('@/assets/images/joy/activity/dance.jpg')
    ],
    highlights: [
      '居家式温馨环境',
      '24小时生活照料',
      '每日文娱活动',
      '定期健康体检'
    ],
    tags: ['居家养老', '生活照料', '文娱活动'],
    status: 'available',
    category: 'nursing',
    openingHours: '全天24小时服务',
    bookingNotice: '可提供短期试住体验'
  },
  {
    id: '4',
    title: '健康管理中心',
    coverImage: require('@/assets/images/joy/online/calligraphy-class.jpg'),
    description: '健康管理中心提供全面的健康管理和养生保健服务，包括健康体检、养生咨询、中医调理等服务，帮助长者建立健康的生活方式。',
    serviceTypes: ['health'],
    facilities: ['体检中心', '中医诊室', '营养咨询室', '健康档案室', '养生讲座厅'],
    location: {
      name: '健康管理中心',
      address: '社区服务中心2楼'
    },
    contact: {
      phone: '400-555-6666'
    },
    images: [
      require('@/assets/images/joy/online/calligraphy-class.jpg')
    ],
    highlights: [
      '专业健康评估',
      '个性化养生方案',
      '定期健康监测',
      '专家养生讲座'
    ],
    tags: ['健康管理', '养生保健', '中医调理'],
    status: 'available',
    category: 'health',
    openingHours: '周一至周五 09:00-17:00',
    bookingNotice: '建议空腹进行体检'
  },
  {
    id: '5',
    title: '悠享休闲康养会所',
    coverImage: require('@/assets/images/joy/social/chess.jpg'),
    description: '悠享休闲康养会所专注于为长者提供高品质的休闲养生服务，包括温泉疗养、按摩理疗、茶艺书法等活动，让长者享受轻松愉快的康养时光。',
    serviceTypes: ['leisure', 'health'],
    facilities: ['温泉泡池', '按摩理疗室', '茶艺室', '书法室', '棋牌室', '健身房', '休息区'],
    location: {
      name: '悠享休闲康养会所',
      address: '社区休闲广场南侧'
    },
    contact: {
      phone: '400-444-5555',
      wechat: 'youxiang wellness'
    },
    images: [
      require('@/assets/images/joy/social/chess.jpg')
    ],
    highlights: [
      '天然温泉疗养',
      '专业按摩服务',
      '丰富休闲活动',
      '优雅舒适环境'
    ],
    tags: ['休闲养生', '温泉疗养', '文化活动'],
    status: 'limited',
    category: 'leisure',
    openingHours: '周一至周日 10:00-22:00',
    bookingNotice: '需提前预约，高峰期可能需要排队'
  },
  {
    id: '6',
    title: '博爱医疗护理站',
    coverImage: require('@/assets/images/joy/online/health-lecture.jpg'),
    description: '博爱医疗护理站提供基础医疗和护理服务，包括常见病诊治、慢性病管理、伤口护理、用药指导等，为社区长者的健康保驾护航。',
    serviceTypes: ['medical', 'nursing'],
    facilities: ['诊疗室', '输液室', '处置室', '药房', '观察室'],
    location: {
      name: '博爱医疗护理站',
      address: '社区服务街45号'
    },
    contact: {
      phone: '400-333-4444'
    },
    images: [
      require('@/assets/images/joy/online/health-lecture.jpg')
    ],
    highlights: [
      '全科医生坐诊',
      '医保定点单位',
      '上门护理服务',
      '慢病管理跟踪'
    ],
    tags: ['基础医疗', '护理服务', '医保定点'],
    status: 'full',
    category: 'medical',
    openingHours: '周一至周日 08:00-20:00',
    bookingNotice: '需携带医保卡和既往病历'
  }
]

// 列表数据（简化版）
export const mockWellnessServiceList: WellnessServiceListItem[] = mockWellnessServices.map(item => ({
  id: item.id,
  title: item.title,
  coverImage: item.coverImage,
  serviceTypes: item.serviceTypes,
  location: item.location.name,
  status: item.status,
  category: item.category,
  highlights: item.highlights.slice(0, 2) // 只取前两个亮点
}))

// 根据ID获取服务详情
export function getWellnessServiceById(id: string): WellnessService | undefined {
  return mockWellnessServices.find(service => service.id === id)
}

// 服务类型配置
export const serviceTypeConfig = {
  medical: { name: '医疗护理', icon: '🏥', color: '#FF6B6B' },
  rehabilitation: { name: '康复训练', icon: '🏃', color: '#4ECDC4' },
  nursing: { name: '生活照料', icon: '🛏️', color: '#FF6B9D' },
  health: { name: '健康管理', icon: '💊', color: '#9B59B6' },
  leisure: { name: '休闲养生', icon: '🌸', color: '#45B7D1' }
}

// 状态配置
export const statusConfig = {
  available: { name: '可预订', color: '#52c41a', bgColor: '#f6ffed' },
  limited: { name: '名额有限', color: '#faad14', bgColor: '#fffbe6' },
  full: { name: '已满', color: '#ff4d4f', bgColor: '#fff1f0' }
}
