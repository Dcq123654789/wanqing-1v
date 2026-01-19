import { HomeService, ServiceDetail, ServiceCategory } from './types'

/**
 * 服务分类配置
 */
export const categoryConfig: { [key: string]: ServiceCategory } = {
  all: { key: 'all', name: '全部', icon: '🏠' },
  cleaning: { key: 'cleaning', name: '家政清洁', icon: '🧹' },
  repair: { key: 'repair', name: '维修服务', icon: '🔧' },
  care: { key: 'care', name: '护理照护', icon: '💊' },
  life: { key: 'life', name: '生活服务', icon: '🛒' }
}

/**
 * 模拟上门服务列表数据
 */
export const mockServiceList: HomeService[] = [
  {
    id: '1',
    name: '专业家政清洁服务',
    poster: 'https://picsum.photos/seed/cleaning1/300/300',
    price: 128,
    sales: 234,
    category: 'cleaning',
    description: '专业的家庭清洁服务，包含客厅、卧室、厨房等区域的深度清洁'
  },
  {
    id: '2',
    name: '家电维修上门服务',
    poster: 'https://picsum.photos/seed/repair1/300/300',
    price: 88,
    sales: 567,
    category: 'repair',
    description: '专业维修师傅上门，修理各类家用电器，快速解决故障'
  },
  {
    id: '3',
    name: '老人护理照护',
    poster: 'https://picsum.photos/seed/care1/300/300',
    price: 200,
    sales: 123,
    category: 'care',
    description: '专业护理人员提供日常生活照护、陪伴聊天等服务'
  },
  {
    id: '4',
    name: '家庭管道疏通',
    poster: 'https://picsum.photos/seed/repair2/300/300',
    price: 150,
    sales: 890,
    category: 'repair',
    description: '快速疏通家庭各类管道，包括厨房下水道、马桶等'
  },
  {
    id: '5',
    name: '深度保洁服务',
    poster: 'https://picsum.photos/seed/cleaning2/300/300',
    price: 298,
    sales: 456,
    category: 'cleaning',
    description: '全屋深度保洁，包括玻璃清洁、油烟机清洗等'
  },
  {
    id: '6',
    name: '生活代购服务',
    poster: 'https://picsum.photos/seed/life1/300/300',
    price: 30,
    sales: 1567,
    category: 'life',
    description: '代购日常生活用品、药品等，贴心上门配送'
  },
  {
    id: '7',
    name: '空调清洗服务',
    poster: 'https://picsum.photos/seed/cleaning3/300/300',
    price: 168,
    sales: 789,
    category: 'cleaning',
    description: '专业空调清洗消毒，去除异味，保证健康'
  },
  {
    id: '8',
    name: '水电维修服务',
    poster: 'https://picsum.photos/seed/repair3/300/300',
    price: 120,
    sales: 678,
    category: 'repair',
    description: '家庭水电线路维修、开关插座更换等服务'
  },
  {
    id: '9',
    name: '康复理疗服务',
    poster: 'https://picsum.photos/seed/care2/300/300',
    price: 180,
    sales: 234,
    category: 'care',
    description: '专业康复师提供按摩、理疗等健康服务'
  },
  {
    id: '10',
    name: '搬家服务',
    poster: 'https://picsum.photos/seed/life2/300/300',
    price: 0,
    sales: 345,
    category: 'life',
    description: '专业搬家团队，提供打包、搬运、拆装一条龙服务'
  },
  {
    id: '11',
    name: '月嫂保姆服务',
    poster: 'https://picsum.photos/seed/care3/300/300',
    price: 5800,
    sales: 89,
    category: 'care',
    description: '专业月嫂提供母婴护理服务，经验丰富'
  },
  {
    id: '12',
    name: '门窗维修服务',
    poster: 'https://picsum.photos/seed/repair4/300/300',
    price: 100,
    sales: 456,
    category: 'repair',
    description: '门窗维修更换、密封条更换、锁具维修等'
  }
]

/**
 * 模拟服务详情数据
 */
export const mockServiceDetailMap: { [key: string]: ServiceDetail } = {
  '1': {
    id: '1',
    name: '专业家政清洁服务',
    poster: 'https://picsum.photos/seed/cleaning1/300/300',
    price: 128,
    sales: 234,
    category: 'cleaning',
    description: '专业的家庭清洁服务，包含客厅、卧室、厨房等区域的深度清洁。我们的清洁团队经过专业培训，使用环保清洁用品，确保您的家居环境干净整洁。',
    images: [
      'https://picsum.photos/seed/cleaning1/400/400',
      'https://picsum.photos/seed/cleaning1-2/400/400',
      'https://picsum.photos/seed/cleaning1-3/400/400'
    ],
    specifications: {
      '服务时长': '4小时',
      '服务人数': '2人',
      '服务范围': '市区范围内',
      '服务时间': '周一至周日 8:00-18:00'
    },
    rating: 4.8,
    reviewCount: 156
  },
  '2': {
    id: '2',
    name: '家电维修上门服务',
    poster: 'https://picsum.photos/seed/repair1/300/300',
    price: 88,
    sales: 567,
    category: 'repair',
    description: '专业维修师傅上门，修理各类家用电器，快速解决故障。支持冰箱、空调、洗衣机、电视等各类家电维修。',
    images: [
      'https://picsum.photos/seed/repair1/400/400',
      'https://picsum.photos/seed/repair1-2/400/400'
    ],
    specifications: {
      '服务时长': '视故障情况而定',
      '服务范围': '市区范围内',
      '保修期': '维修后30天'
    },
    rating: 4.6,
    reviewCount: 234
  },
  '3': {
    id: '3',
    name: '老人护理照护',
    poster: 'https://picsum.photos/seed/care1/300/300',
    price: 200,
    sales: 123,
    category: 'care',
    description: '专业护理人员提供日常生活照护、陪伴聊天等服务。我们的护理员都经过专业培训，有丰富的护理经验，为老人提供贴心周到的照护服务。',
    images: [
      'https://picsum.photos/seed/care1/400/400',
      'https://picsum.photos/seed/care1-2/400/400',
      'https://picsum.photos/seed/care1-3/400/400'
    ],
    specifications: {
      '服务时长': '8小时',
      '服务人数': '1人',
      '服务范围': '市区范围内',
      '服务时间': '周一至周日 8:00-20:00'
    },
    rating: 4.9,
    reviewCount: 89
  },
  '4': {
    id: '4',
    name: '家庭管道疏通',
    poster: 'https://picsum.photos/seed/repair2/300/300',
    price: 150,
    sales: 890,
    category: 'repair',
    description: '快速疏通家庭各类管道，包括厨房下水道、马桶、地漏等。专业设备，高效疏通，避免管道损坏。',
    images: [
      'https://picsum.photos/seed/repair2/400/400',
      'https://picsum.photos/seed/repair2-2/400/400'
    ],
    specifications: {
      '服务时长': '1-2小时',
      '服务范围': '市区范围内',
      '保修期': '疏通后7天'
    },
    rating: 4.7,
    reviewCount: 456
  },
  '5': {
    id: '5',
    name: '深度保洁服务',
    poster: 'https://picsum.photos/seed/cleaning2/300/300',
    price: 298,
    sales: 456,
    category: 'cleaning',
    description: '全屋深度保洁，包括玻璃清洁、油烟机清洗、消毒柜清洁等。使用专业清洁设备和环保清洁剂，让您的家焕然一新。',
    images: [
      'https://picsum.photos/seed/cleaning2/400/400',
      'https://picsum.photos/seed/cleaning2-2/400/400',
      'https://picsum.photos/seed/cleaning2-3/400/400'
    ],
    specifications: {
      '服务时长': '6小时',
      '服务人数': '3人',
      '服务范围': '市区范围内',
      '服务时间': '周一至周日 8:00-18:00'
    },
    rating: 4.8,
    reviewCount: 234
  },
  '6': {
    id: '6',
    name: '生活代购服务',
    poster: 'https://picsum.photos/seed/life1/300/300',
    price: 30,
    sales: 1567,
    category: 'life',
    description: '代购日常生活用品、药品等，贴心上门配送。只需告知需求，我们为您采购并送货上门，省时省力。',
    images: [
      'https://picsum.photos/seed/life1/400/400',
      'https://picsum.photos/seed/life1-2/400/400'
    ],
    specifications: {
      '服务时长': '2小时内送达',
      '服务范围': '社区3公里内',
      '服务时间': '周一至周日 9:00-21:00'
    },
    rating: 4.5,
    reviewCount: 678
  },
  '7': {
    id: '7',
    name: '空调清洗服务',
    poster: 'https://picsum.photos/seed/cleaning3/300/300',
    price: 168,
    sales: 789,
    category: 'cleaning',
    description: '专业空调清洗消毒，去除异味，保证健康。高温蒸汽清洗，彻底清除细菌和灰尘，让空调吹出健康风。',
    images: [
      'https://picsum.photos/seed/cleaning3/400/400',
      'https://picsum.photos/seed/cleaning3-2/400/400',
      'https://picsum.photos/seed/cleaning3-3/400/400'
    ],
    specifications: {
      '服务时长': '1小时/台',
      '服务人数': '1人',
      '服务范围': '市区范围内',
      '服务时间': '周一至周日 9:00-18:00'
    },
    rating: 4.7,
    reviewCount: 345
  },
  '8': {
    id: '8',
    name: '水电维修服务',
    poster: 'https://picsum.photos/seed/repair3/300/300',
    price: 120,
    sales: 678,
    category: 'repair',
    description: '家庭水电线路维修、开关插座更换等服务。专业电工持证上岗，安全可靠，快速解决水电问题。',
    images: [
      'https://picsum.photos/seed/repair3/400/400',
      'https://picsum.photos/seed/repair3-2/400/400'
    ],
    specifications: {
      '服务时长': '视故障情况而定',
      '服务范围': '市区范围内',
      '保修期': '维修后30天'
    },
    rating: 4.6,
    reviewCount: 234
  },
  '9': {
    id: '9',
    name: '康复理疗服务',
    poster: 'https://picsum.photos/seed/care2/300/300',
    price: 180,
    sales: 234,
    category: 'care',
    description: '专业康复师提供按摩、理疗等健康服务。针对颈肩腰腿痛、关节炎等常见问题，提供专业康复方案。',
    images: [
      'https://picsum.photos/seed/care2/400/400',
      'https://picsum.photos/seed/care2-2/400/400',
      'https://picsum.photos/seed/care2-3/400/400'
    ],
    specifications: {
      '服务时长': '1小时',
      '服务人数': '1人',
      '服务范围': '市区范围内',
      '服务时间': '周一至周六 9:00-18:00'
    },
    rating: 4.9,
    reviewCount: 123
  },
  '10': {
    id: '10',
    name: '搬家服务',
    poster: 'https://picsum.photos/seed/life2/300/300',
    price: 0,
    sales: 345,
    category: 'life',
    description: '专业搬家团队，提供打包、搬运、拆装一条龙服务。经验丰富的搬运工，专业搬家车辆，确保您的物品安全抵达。',
    images: [
      'https://picsum.photos/seed/life2/400/400',
      'https://picsum.photos/seed/life2-2/400/400',
      'https://picsum.photos/seed/life2-3/400/400'
    ],
    specifications: {
      '服务时长': '视搬家物品数量而定',
      '服务人数': '3-5人',
      '服务范围': '同城范围内',
      '服务时间': '周一至周日 8:00-20:00'
    },
    rating: 4.7,
    reviewCount: 167
  },
  '11': {
    id: '11',
    name: '月嫂保姆服务',
    poster: 'https://picsum.photos/seed/care3/300/300',
    price: 5800,
    sales: 89,
    category: 'care',
    description: '专业月嫂提供母婴护理服务，经验丰富。包括产妇护理、新生儿护理、月子餐制作等全套服务。',
    images: [
      'https://picsum.photos/seed/care3/400/400',
      'https://picsum.photos/seed/care3-2/400/400',
      'https://picsum.photos/seed/care3-3/400/400'
    ],
    specifications: {
      '服务时长': '26天（一个月）',
      '服务人数': '1人',
      '服务范围': '住家服务',
      '服务时间': '24小时照护'
    },
    rating: 4.9,
    reviewCount: 67
  },
  '12': {
    id: '12',
    name: '门窗维修服务',
    poster: 'https://picsum.photos/seed/repair4/300/300',
    price: 100,
    sales: 456,
    category: 'repair',
    description: '门窗维修更换、密封条更换、锁具维修等。专业维修师傅，快速解决各类门窗问题，确保家庭安全。',
    images: [
      'https://picsum.photos/seed/repair4/400/400',
      'https://picsum.photos/seed/repair4-2/400/400'
    ],
    specifications: {
      '服务时长': '1-2小时',
      '服务范围': '市区范围内',
      '保修期': '维修后30天'
    },
    rating: 4.6,
    reviewCount: 189
  }
}

/**
 * 根据ID获取服务详情
 */
export const getServiceDetailById = (id: string): ServiceDetail | undefined => {
  return mockServiceDetailMap[id]
}
