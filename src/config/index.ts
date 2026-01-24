/**
 * API 配置文件
 * 统一管理所有接口地址
 */

/** API 基础地址 */
export const API_BASE_URL = 'http://localhost:8080'

/** 请求超时时间（毫秒） */
export const REQUEST_TIMEOUT = 30000

/** Token 存储键名 */
export const ACCESS_TOKEN_KEY = 'access_token'
export const REFRESH_TOKEN_KEY = 'refresh_token'
export const TOKEN_KEY = ACCESS_TOKEN_KEY // 兼容旧代码

/**
 * API 路由配置
 */
export const API_ROUTES = {
  // ========== 登录相关 ==========
  AUTH: {
    LOGIN: '/api/auth/login', // 微信小程序登录
    REFRESH: '/api/auth/refresh', // 刷新Token
    VALIDATE: '/api/auth/validate', // 验证Token
    LOGOUT: '/api/auth/logout', // 登出
    USER_INFO: '/api/auth/user/info', // 获取用户信息
  },

  // ========== 通用CRUD接口 ==========
  BATCH: '/api/batch', // 通用增删改查接口

  // ========== 社区相关 ==========
  COMMUNITY: {
    LIST: '/communities', // 社区列表
    DETAIL: '/communities', // 社区详情
  },

  // ========== 活动相关 ==========
  ACTIVITY: {
    LIST: '/activity/list', // 活动列表
    DETAIL: '/activity/detail', // 活动详情
    JOIN: '/activity/join', // 参加活动
    CANCEL: '/activity/cancel', // 取消活动
  },

  // ========== 商城相关 ==========
  MALL: {
    PRODUCT_LIST: '/mall/products', // 商品列表
    PRODUCT_DETAIL: '/mall/product/detail', // 商品详情
    CART: '/mall/cart', // 购物车
    ORDER: '/mall/order', // 订单
  },

  // ========== 服务相关 ==========
  SERVICE: {
    LIST: '/service/list', // 服务列表
    DETAIL: '/service/detail', // 服务详情
    BOOK: '/service/book', // 预订服务
  },

  // ========== 康养相关 ==========
  WELLNESS: {
    LIST: '/wellness/list', // 康养服务列表
    DETAIL: '/wellness/detail', // 康养服务详情
    BOOK: '/wellness/book', // 预订康养服务
  },

  // ========== 颐养/咨询相关 ==========
  CONSULTATION: {
    LIST: '/consultation/list', // 咨询列表
    DETAIL: '/consultation/detail', // 咨询详情
    CREATE: '/consultation/create', // 创建咨询
  },

  // ========== 用户相关 ==========
  USER: {
    PROFILE: '/user/profile', // 个人资料
    UPDATE_PROFILE: '/user/profile/update', // 更新资料
    ADDRESS: '/user/address', // 地址列表
    FAVORITES: '/user/favorites', // 收藏列表
    ORDERS: '/user/orders', // 订单列表
    // BIND_COMMUNITY: '/user/community/bind', // 绑定社区（使用通用接口）
  },

  // ========== 上传相关 ==========
  UPLOAD: {
    IMAGE: '/upload/image', // 上传图片
    FILE: '/upload/file', // 上传文件
  },
}

export default API_ROUTES
