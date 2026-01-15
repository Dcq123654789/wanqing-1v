/**
 * 乐享页面虚拟数据
 */

// 旅游线路
export interface TravelRoute {
  id: string
  name: string
  image: string
  price: number
  duration: string
  tags: string[]
  description: string
}

// 兴趣活动
export interface Activity {
  id: string
  title: string
  image: string
  time: string
  location: string
  category: 'art' | 'sports' | 'learning'
  description: string
}

// 社交聚会
export interface SocialEvent {
  id: string
  title: string
  image: string
  time: string
  location: string
  maxParticipants: number
  description: string
}

// 线上活动
export interface OnlineEvent {
  id: string
  title: string
  image: string
  time: string
  platform: string
  joinMethod: string
  description: string
}

// 旅游线路数据
export const mockTravelRoutes: TravelRoute[] = [
  {
    id: '1',
    name: '海南三亚 5 日游',
    image: require('@/assets/images/joy/travel/sanya.jpg'),
    price: 2999,
    duration: '5 天 4 晚',
    tags: ['适合老年人', '慢节奏', '海景房'],
    description: '享受阳光沙滩，专业导游陪同，入住海景酒店'
  },
  {
    id: '2',
    name: '北京古都深度游',
    image: require('@/assets/images/joy/travel/beijing.jpg'),
    price: 2580,
    duration: '4 天 3 晚',
    tags: ['文化之旅', '历史名胜', '无障碍'],
    description: '游览长城、故宫，感受五千年文化底蕴'
  },
  {
    id: '3',
    name: '江南水乡休闲游',
    image: require('@/assets/images/joy/travel/jiangnan.jpg'),
    price: 2280,
    duration: '3 天 2 晚',
    tags: ['慢节奏', '古镇风情', '美食之旅'],
    description: '漫步古镇，品味江南水乡的宁静与美好'
  }
]

// 兴趣活动数据
export const mockActivities: Activity[] = [
  {
    id: '1',
    title: '太极拳晨练活动',
    image: require('@/assets/images/joy/activity/taichi.jpg'),
    time: '每日 7:00-8:00',
    location: '中心公园广场',
    category: 'sports',
    description: '专业教练指导，强身健体，结交朋友'
  },
  {
    id: '2',
    title: '书法艺术交流',
    image: require('@/assets/images/joy/activity/calligraphy.jpg'),
    time: '每周三 14:00-16:00',
    location: '文化中心书法室',
    category: 'art',
    description: '笔墨纸砚，传承文化，陶冶情操'
  },
  {
    id: '3',
    title: '广场舞健身活动',
    image: require('@/assets/images/joy/activity/dance.jpg'),
    time: '每日 19:00-20:30',
    location: '社区活动中心',
    category: 'sports',
    description: '欢快的舞蹈，健康的身体，愉快的心情'
  }
]

// 社交聚会数据
export const mockSocialEvents: SocialEvent[] = [
  {
    id: '1',
    title: '周末茶话会',
    image: require('@/assets/images/joy/social/tea-party.jpg'),
    time: '每周六 14:00-16:00',
    location: '活动中心茶室',
    maxParticipants: 20,
    description: '品茶聊天，分享生活，结交新朋友'
  },
  {
    id: '2',
    title: '生日庆祝派对',
    image: require('@/assets/images/joy/social/birthday.jpg'),
    time: '每月 15 日 14:00',
    location: '多功能厅',
    maxParticipants: 30,
    description: '为当月寿星庆祝生日，共度欢乐时光'
  },
  {
    id: '3',
    title: '棋牌娱乐活动',
    image: require('@/assets/images/joy/social/chess.jpg'),
    time: '每周日 14:00-17:00',
    location: '棋牌室',
    maxParticipants: 16,
    description: '象棋、围棋、扑克，切磋技艺，休闲娱乐'
  }
]

// 线上活动数据
export const mockOnlineEvents: OnlineEvent[] = [
  {
    id: '1',
    title: '健康养生讲座',
    image: require('@/assets/images/joy/online/health-lecture.jpg'),
    time: '每周三 19:00-20:00',
    platform: '微信直播',
    joinMethod: '扫码进入直播间',
    description: '专业医生讲解健康知识，在线答疑解惑'
  },
  {
    id: '2',
    title: '书法远程教学',
    image: require('@/assets/images/joy/online/calligraphy-class.jpg'),
    time: '每周五 14:00-15:30',
    platform: '腾讯会议',
    joinMethod: '输入会议号加入',
    description: '线上书法教学，在家也能学习传统文化'
  },
  {
    id: '3',
    title: '歌咏交流活动',
    image: require('@/assets/images/joy/online/singing.jpg'),
    time: '每周日 19:30-21:00',
    platform: '视频会议',
    joinMethod: '群内通知链接',
    description: '在线唱歌、K歌活动，展示才艺，增进友谊'
  }
]
