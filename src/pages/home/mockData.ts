/**
 * 首页虚拟数据
 */

import { Banner, ServiceEntry, Notification, Activity } from './types'

// 轮播海报数据
export const mockBanners: Banner[] = [
  {
    id: '1',
    image: require('../../assets/images/banners/banner1.jpg'),
    title: '健康养生讲座',
    link: '/pages/care/index'
  },
  {
    id: '2',
    image: require('../../assets/images/banners/banner2.jpg'),
    title: '旅游活动推荐',
    link: '/pages/joy/index'
  },
  {
    id: '3',
    image: require('../../assets/images/banners/banner3.jpg'),
    title: '康复理疗优惠',
    link: '/pages/care/index'
  }
]

// 服务入口数据
export const mockServices: ServiceEntry[] = [
  {
    id: '1',
    icon: require('../../assets/images/icons/home/icon-health.png'),
    title: '健康管理',
    route: '/pages/care/index',
    type: 'health'
  },
  {
    id: '2',
    icon: require('../../assets/images/icons/home/icon-activity.png'),
    title: '活动预约',
    route: '',
    type: 'activity'
  },
  {
    id: '3',
    icon: require('../../assets/images/icons/home/icon-food.png'),
    title: '餐饮服务',
    route: '',
    type: 'food'
  },
  {
    id: '4',
    icon: require('../../assets/images/icons/home/icon-travel.png'),
    title: '出行服务',
    route: '/pages/joy/index',
    type: 'travel'
  },
  {
    id: '5',
    icon: require('../../assets/images/icons/home/icon-nursing.png'),
    title: '康复理疗',
    route: '/pages/care/index',
    type: 'recovery'
  },
  {
    id: '6',
    icon: require('../../assets/images/icons/home/icon-spa.png'),
    title: '更多服务',
    route: '',
    type: 'more'
  }
]

// 通知数据
export const mockNotifications: Notification[] = [
  {
    id: '1',
    content: '健康养生讲座将于今日 14:00 开始，欢迎参加',
    type: 'activity'
  },
  {
    id: '2',
    content: '太极拳晨练活动每日 7:00 准时开始',
    type: 'info'
  },
  {
    id: '3',
    content: '新增康复理疗服务，欢迎体验',
    type: 'urgent'
  }
]

// 活动推荐数据
export const mockActivities: Activity[] = [
  {
    id: '1',
    title: '健康养生讲座',
    image: require('../../assets/images/activities/activity1.jpg'),
    time: '今天 14:00',
    location: '活动中心 A 区',
    tag: '免费'
  },
  {
    id: '2',
    title: '太极拳晨练活动',
    image: require('../../assets/images/activities/activity2.jpg'),
    time: '每日 7:00',
    location: '社区广场',
    tag: '热门'
  },
  {
    id: '3',
    title: '书法艺术交流',
    image: require('../../assets/images/activities/activity3.jpg'),
    time: '周三 14:00',
    location: '文化中心',
    tag: '活动'
  },
  {
    id: '4',
    title: '健康体检服务',
    image: require('../../assets/images/activities/activity1.jpg'),
    time: '周五 9:00',
    location: '健康中心',
    tag: '服务'
  }
]
