/**
 * 社区活动模拟数据
 */
import type { CommunityActivity, ActivityListItem } from './types'

// 完整的活动数据
export const mockActivities: CommunityActivity[] = [
  {
    id: '1',
    title: '社区书法交流活动',
    coverImage: require('@/assets/images/joy/activity/calligraphy.jpg'),
    description: '邀请社区书法爱好者共同交流学习，传承中华优秀传统文化。活动将邀请专业书法老师现场指导，大家可自带作品交流心得。',
    time: '2024-01-20 14:00-16:00',
    timestamp: 1705749600000,
    location: {
      name: '社区文化活动中心',
      address: '晚晴社区服务中心 2 楼书法室',
      latitude: 39.9042,
      longitude: 116.4074
    },
    maxParticipants: 20,
    currentParticipants: 15,
    organizer: {
      name: '王老师',
      avatar: require('@/assets/images/illustrations/activity-illustration.png'),
      phone: '138****8888'
    },
    participants: [
      { id: 'p1', name: '张阿姨', avatar: require('@/assets/images/illustrations/welcome-illustration.png'), joinTime: '2024-01-15 10:30' },
      { id: 'p2', name: '李叔叔', avatar: require('@/assets/images/illustrations/community-illustration.png'), joinTime: '2024-01-15 11:20' },
      { id: 'p3', name: '赵奶奶', avatar: require('@/assets/images/illustrations/nature-illustration.png'), joinTime: '2024-01-15 14:00' },
      { id: 'p4', name: '刘阿姨', avatar: require('@/assets/images/illustrations/activity-illustration.png'), joinTime: '2024-01-16 09:15' },
      { id: 'p5', name: '陈爷爷', avatar: require('@/assets/images/illustrations/welcome-illustration.png'), joinTime: '2024-01-16 15:30' }
    ],
    images: [
      require('@/assets/images/joy/activity/calligraphy.jpg'),
      require('@/assets/images/joy/activity/taichi.jpg'),
      require('@/assets/images/joy/activity/dance.jpg')
    ],
    registrationDeadline: '2024-01-19 18:00',
    tags: ['书法', '文化交流', '免费'],
    status: 'upcoming',
    category: 'culture'
  },
  {
    id: '2',
    title: '太极拳晨练活动',
    coverImage: require('@/assets/images/joy/activity/taichi.jpg'),
    description: '每日清晨太极拳晨练，专业教练指导，强身健体，结交朋友。适合各个年龄段的居民参与。',
    time: '每日 07:00-08:00',
    timestamp: 1705713600000,
    location: {
      name: '中心公园广场',
      address: '社区中心公园东门广场'
    },
    maxParticipants: 30,
    currentParticipants: 28,
    organizer: {
      name: '张教练',
      avatar: require('@/assets/images/illustrations/community-illustration.png'),
      phone: '139****6666'
    },
    participants: [
      { id: 'p6', name: '孙大爷', avatar: require('@/assets/images/illustrations/nature-illustration.png'), joinTime: '2024-01-10 08:00' },
      { id: 'p7', name: '周阿姨', avatar: require('@/assets/images/illustrations/activity-illustration.png'), joinTime: '2024-01-11 07:30' }
    ],
    images: [
      require('@/assets/images/joy/activity/taichi.jpg')
    ],
    registrationDeadline: '长期有效',
    tags: ['健身', '太极拳', '户外'],
    status: 'ongoing',
    category: 'sports'
  },
  {
    id: '3',
    title: '广场舞健身活动',
    coverImage: require('@/assets/images/joy/activity/dance.jpg'),
    description: '欢快的舞蹈，健康的身体，愉快的心情。欢迎喜欢跳舞的朋友加入我们！',
    time: '每日 19:00-20:30',
    timestamp: 1705740000000,
    location: {
      name: '社区活动中心广场',
      address: '社区活动中心门前广场'
    },
    maxParticipants: 50,
    currentParticipants: 45,
    organizer: {
      name: '刘老师',
      avatar: require('@/assets/images/illustrations/nature-illustration.png')
    },
    participants: [],
    images: [
      require('@/assets/images/joy/activity/dance.jpg')
    ],
    registrationDeadline: '长期有效',
    tags: ['广场舞', '健身', '娱乐'],
    status: 'ongoing',
    category: 'entertainment'
  },
  {
    id: '4',
    title: '智能手机使用培训',
    coverImage: require('@/assets/images/joy/online/calligraphy-class.jpg'),
    description: '教会老年人使用智能手机，包括微信、支付宝、健康码等日常应用。志愿者一对一教学。',
    time: '每周三 14:00-16:00',
    timestamp: 1706008800000,
    location: {
      name: '社区培训教室',
      address: '社区服务中心 3 楼 301 教室'
    },
    maxParticipants: 15,
    currentParticipants: 15,
    organizer: {
      name: '志愿者小李',
      avatar: require('@/assets/images/illustrations/activity-illustration.png'),
      phone: '137****5555'
    },
    participants: [
      { id: 'p8', name: '钱奶奶', avatar: require('@/assets/images/illustrations/community-illustration.png'), joinTime: '2024-01-12 10:00' }
    ],
    images: [
      require('@/assets/images/joy/online/calligraphy-class.jpg')
    ],
    registrationDeadline: '2024-01-24 12:00',
    tags: ['学习', '智能设备', '志愿者'],
    status: 'full',
    category: 'learning'
  },
  {
    id: '5',
    title: '社区清洁志愿服务',
    coverImage: require('@/assets/images/joy/social/chess.jpg'),
    description: '组织志愿者参与社区环境清洁活动，共建美好家园。提供清洁工具和志愿者服务证明。',
    time: '每周六 09:00-11:00',
    timestamp: 1705862400000,
    location: {
      name: '社区各个角落',
      address: '晚晴社区全域'
    },
    maxParticipants: 40,
    currentParticipants: 12,
    organizer: {
      name: '社区居委会',
      avatar: require('@/assets/images/illustrations/welcome-illustration.png'),
      phone: '010-12345678'
    },
    participants: [
      { id: 'p9', name: '吴叔叔', avatar: require('@/assets/images/illustrations/activity-illustration.png'), joinTime: '2024-01-13 16:00' }
    ],
    images: [
      require('@/assets/images/joy/social/chess.jpg')
    ],
    registrationDeadline: '2024-01-26 08:00',
    tags: ['志愿服务', '环保', '公益'],
    status: 'upcoming',
    category: 'volunteer'
  },
  {
    id: '6',
    title: '健康养生讲座',
    coverImage: require('@/assets/images/joy/online/health-lecture.jpg'),
    description: '邀请专业医生讲解健康养生知识，包括饮食、运动、疾病预防等内容。现场提供健康咨询服务。',
    time: '2024-01-25 14:00-16:00',
    timestamp: 1706188800000,
    location: {
      name: '社区多功能厅',
      address: '社区服务中心 1 楼多功能厅'
    },
    maxParticipants: 60,
    currentParticipants: 8,
    organizer: {
      name: '社区卫生院',
      avatar: require('@/assets/images/illustrations/nature-illustration.png'),
      phone: '010-87654321'
    },
    participants: [],
    images: [
      require('@/assets/images/joy/online/health-lecture.jpg')
    ],
    registrationDeadline: '2024-01-24 18:00',
    tags: ['健康', '讲座', '医疗'],
    status: 'upcoming',
    category: 'learning'
  }
]

// 列表数据（简化版）
export const mockActivityList: ActivityListItem[] = mockActivities.map(item => ({
  id: item.id,
  title: item.title,
  coverImage: item.coverImage,
  time: item.time,
  location: item.location.name,
  currentParticipants: item.currentParticipants,
  maxParticipants: item.maxParticipants,
  status: item.status,
  category: item.category
}))

// 根据ID获取活动详情
export function getActivityById(id: string): CommunityActivity | undefined {
  return mockActivities.find(activity => activity.id === id)
}

// 分类配置
export const categoryConfig = {
  culture: { name: '文化活动', icon: '🎨', color: '#FF6B6B' },
  sports: { name: '体育健身', icon: '🏃', color: '#4ECDC4' },
  entertainment: { name: '娱乐休闲', icon: '🎵', color: '#FF6B9D' },
  volunteer: { name: '志愿服务', icon: '🤝', color: '#9B59B6' },
  learning: { name: '学习培训', icon: '📚', color: '#45B7D1' }
}

// 状态配置
export const statusConfig = {
  upcoming: { name: '即将开始', color: '#52c41a', bgColor: '#f6ffed' },
  ongoing: { name: '进行中', color: '#1890ff', bgColor: '#e6f7ff' },
  ended: { name: '已结束', color: '#999999', bgColor: '#f5f5f5' },
  full: { name: '已满员', color: '#ff4d4f', bgColor: '#fff1f0' }
}
