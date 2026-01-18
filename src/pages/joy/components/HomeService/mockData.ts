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
  }
}

/**
 * 根据ID获取服务详情
 */
export const getServiceDetailById = (id: string): ServiceDetail | undefined => {
  return mockServiceDetailMap[id]
}
