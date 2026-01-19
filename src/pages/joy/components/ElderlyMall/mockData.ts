import { ProductItem, ProductDetail } from './types'

// 商品分类配置
export const categoryConfig = {
  all: { name: '全部', icon: '🏪' },
  health: { name: '保健品', icon: '💊' },
  food: { name: '食品', icon: '🍎' },
  daily: { name: '日用品', icon: '🧴' },
  medical: { name: '医疗器械', icon: '🏥' }
}

// 模拟商品数据
export const mockProductList: ProductItem[] = [
  {
    id: '1',
    name: '中老年钙片 补钙健骨 100片',
    price: 89,
    poster: 'https://picsum.photos/seed/calcium/300/300',
    sales: 2345,
    category: 'health'
  },
  {
    id: '2',
    name: '深海鱼油 软胶囊 200粒',
    price: 158,
    poster: 'https://picsum.photos/seed/fishoil/300/300',
    sales: 1892,
    category: 'health'
  },
  {
    id: '3',
    name: '有机燕麦片 营养早餐 1kg',
    price: 45,
    poster: 'https://picsum.photos/seed/oatmeal/300/300',
    sales: 5621,
    category: 'food'
  },
  {
    id: '4',
    name: '老年血压计 家用医用',
    price: 299,
    poster: 'https://picsum.photos/seed/bloodpressure/300/300',
    sales: 987,
    category: 'medical'
  },
  {
    id: '5',
    name: '维生素 C 片 增强免疫力',
    price: 68,
    poster: 'https://picsum.photos/seed/vitaminc/300/300',
    sales: 3456,
    category: 'health'
  },
  {
    id: '6',
    name: '防滑拖鞋 老年安全用品',
    price: 39,
    poster: 'https://picsum.photos/seed/slippers/300/300',
    sales: 4123,
    category: 'daily'
  },
  {
    id: '7',
    name: '血糖仪 测试仪套装',
    price: 358,
    poster: 'https://picsum.photos/seed/bloodsugar/300/300',
    sales: 756,
    category: 'medical'
  },
  {
    id: '8',
    name: '黑芝麻糊 养生食品 600g',
    price: 28,
    poster: 'https://picsum.photos/seed/sesame/300/300',
    sales: 6892,
    category: 'food'
  },
  {
    id: '9',
    name: '护膝保暖 老年保健用品',
    price: 55,
    poster: 'https://picsum.photos/seed/kneebrace/300/300',
    sales: 2834,
    category: 'daily'
  },
  {
    id: '10',
    name: '胶原蛋白 延缓衰老',
    price: 198,
    poster: 'https://picsum.photos/seed/collagen/300/300',
    sales: 1567,
    category: 'health'
  }
]

// 模拟商品详情数据
export const mockProductDetailMap: { [key: string]: ProductDetail } = {
  '1': {
    id: '1',
    name: '中老年钙片 补钙健骨 100片',
    price: 89,
    poster: 'https://picsum.photos/seed/calcium/300/300',
    sales: 2345,
    category: 'health',
    description: '专为中老年人设计的钙片，富含维生素D3，促进钙吸收，增强骨骼健康。采用易吞服的片剂设计，适合日常补充。',
    images: [
      'https://picsum.photos/seed/calcium/400/400',
      'https://picsum.photos/seed/calcium2/400/400',
      'https://picsum.photos/seed/calcium3/400/400'
    ],
    specifications: {
      '品牌': '健康源',
      '规格': '100片/瓶',
      '适用人群': '中老年人',
      '保质期': '24个月',
      '储存方法': '置于阴凉干燥处'
    },
    stock: 999,
    rating: 4.8,
    reviewCount: 1234
  },
  '2': {
    id: '2',
    name: '深海鱼油 软胶囊 200粒',
    price: 158,
    poster: 'https://picsum.photos/seed/fishoil/300/300',
    sales: 1892,
    category: 'health',
    description: '选用深海鱼类提取，富含Omega-3不饱和脂肪酸，有助于调节血脂、保护心脑血管健康。',
    images: [
      'https://picsum.photos/seed/fishoil/400/400',
      'https://picsum.photos/seed/fishoil2/400/400'
    ],
    specifications: {
      '品牌': '海洋精华',
      '规格': '200粒/瓶',
      '适用人群': '成年人',
      '保质期': '24个月',
      '储存方法': '置于阴凉干燥处'
    },
    stock: 567,
    rating: 4.7,
    reviewCount: 856
  },
  '3': {
    id: '3',
    name: '有机燕麦片 营养早餐 1kg',
    price: 45,
    poster: 'https://picsum.photos/seed/oatmeal/300/300',
    sales: 5621,
    category: 'food',
    description: '精选有机燕麦，保留完整营养，富含膳食纤维，适合老年人早餐食用，易于消化吸收。',
    images: [
      'https://picsum.photos/seed/oatmeal/400/400',
      'https://picsum.photos/seed/oatmeal2/400/400'
    ],
    specifications: {
      '品牌': '田园印象',
      '规格': '1kg/袋',
      '适用人群': '所有人群',
      '保质期': '12个月',
      '储存方法': '置于阴凉干燥处'
    },
    stock: 2345,
    rating: 4.9,
    reviewCount: 2345
  },
  '4': {
    id: '4',
    name: '老年血压计 家用医用',
    price: 299,
    poster: 'https://picsum.photos/seed/bloodpressure/300/300',
    sales: 987,
    category: 'medical',
    description: '医用级血压计，大屏幕显示，操作简单，适合老年人使用。测量准确，记忆功能可储存99组数据。',
    images: [
      'https://picsum.photos/seed/bloodpressure/400/400',
      'https://picsum.photos/seed/bloodpressure2/400/400',
      'https://picsum.photos/seed/bloodpressure3/400/400'
    ],
    specifications: {
      '品牌': '康泰',
      '型号': 'KT-200',
      '测量范围': '0-300mmHg',
      '电源': '4节AA电池',
      '保修期': '1年'
    },
    stock: 234,
    rating: 4.6,
    reviewCount: 456
  },
  '5': {
    id: '5',
    name: '维生素 C 片 增强免疫力',
    price: 68,
    poster: 'https://picsum.photos/seed/vitaminc/300/300',
    sales: 3456,
    category: 'health',
    description: '高含量维生素C，增强免疫力，抗氧化，延缓衰老。每片含维生素C 100mg，满足日常所需。',
    images: [
      'https://picsum.photos/seed/vitaminc/400/400',
      'https://picsum.photos/seed/vitaminc2/400/400'
    ],
    specifications: {
      '品牌': '健康源',
      '规格': '100片/瓶',
      '适用人群': '所有人群',
      '保质期': '24个月',
      '储存方法': '置于阴凉干燥处'
    },
    stock: 1234,
    rating: 4.8,
    reviewCount: 1567
  },
  '6': {
    id: '6',
    name: '防滑拖鞋 老年安全用品',
    price: 39,
    poster: 'https://picsum.photos/seed/slippers/300/300',
    sales: 4123,
    category: 'daily',
    description: '专业防滑拖鞋，鞋底采用特殊防滑材质，有效防止老年人滑倒。柔软舒适，适合居家穿着。',
    images: [
      'https://picsum.photos/seed/slippers/400/400',
      'https://picsum.photos/seed/slippers2/400/400'
    ],
    specifications: {
      '品牌': '安心居家',
      '材质': 'EVA+棉布',
      '尺码': '均码（38-43）',
      '颜色': '灰色、棕色',
      '清洗方式': '可水洗'
    },
    stock: 3456,
    rating: 4.7,
    reviewCount: 987
  },
  '7': {
    id: '7',
    name: '血糖仪 测试仪套装',
    price: 358,
    poster: 'https://picsum.photos/seed/bloodsugar/300/300',
    sales: 756,
    category: 'medical',
    description: '医用级血糖仪，测量准确快速，只需5秒出结果。大屏幕显示，语音播报功能，适合视力不佳的老年人。',
    images: [
      'https://picsum.photos/seed/bloodsugar/400/400',
      'https://picsum.photos/seed/bloodsugar2/400/400',
      'https://picsum.photos/seed/bloodsugar3/400/400'
    ],
    specifications: {
      '品牌': '康泰',
      '型号': 'KT-G100',
      '测量范围': '1.1-33.3mmol/L',
      '电源': '2节AAA电池',
      '保修期': '2年'
    },
    stock: 189,
    rating: 4.9,
    reviewCount: 345
  },
  '8': {
    id: '8',
    name: '黑芝麻糊 养生食品 600g',
    price: 28,
    poster: 'https://picsum.photos/seed/sesame/300/300',
    sales: 6892,
    category: 'food',
    description: '精选黑芝麻研磨而成，保留天然香味和营养。富含蛋白质、维生素E，适合老年人养生食用。',
    images: [
      'https://picsum.photos/seed/sesame/400/400',
      'https://picsum.photos/seed/sesame2/400/400'
    ],
    specifications: {
      '品牌': '田园印象',
      '规格': '600g/袋',
      '适用人群': '所有人群',
      '保质期': '12个月',
      '储存方法': '置于阴凉干燥处'
    },
    stock: 5678,
    rating: 4.8,
    reviewCount: 2345
  },
  '9': {
    id: '9',
    name: '护膝保暖 老年保健用品',
    price: 55,
    poster: 'https://picsum.photos/seed/kneebrace/300/300',
    sales: 2834,
    category: 'daily',
    description: '保暖护膝，采用自发热材质，促进膝关节血液循环。适合老年人关节炎、风湿痛患者使用。',
    images: [
      'https://picsum.photos/seed/kneebrace/400/400',
      'https://picsum.photos/seed/kneebrace2/400/400'
    ],
    specifications: {
      '品牌': '安心居家',
      '材质': '纳米材料+棉布',
      '尺码': '均码',
      '颜色': '黑色',
      '清洗方式': '手洗'
    },
    stock: 1234,
    rating: 4.6,
    reviewCount: 678
  },
  '10': {
    id: '10',
    name: '胶原蛋白 延缓衰老',
    price: 198,
    poster: 'https://picsum.photos/seed/collagen/300/300',
    sales: 1567,
    category: 'health',
    description: '小分子胶原蛋白肽，易于吸收。改善皮肤弹性，减少皱纹，延缓衰老。适合爱美人士和中老年人。',
    images: [
      'https://picsum.photos/seed/collagen/400/400',
      'https://picsum.photos/seed/collagen2/400/400',
      'https://picsum.photos/seed/collagen3/400/400'
    ],
    specifications: {
      '品牌': '青春源',
      '规格': '30袋/盒',
      '适用人群': '成年人',
      '保质期': '18个月',
      '储存方法': '置于阴凉干燥处'
    },
    stock: 876,
    rating: 4.7,
    reviewCount: 567
  }
}

// 根据ID获取商品详情
export const getProductDetailById = (id: string): ProductDetail | undefined => {
  return mockProductDetailMap[id]
}
