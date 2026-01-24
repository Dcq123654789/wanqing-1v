/**
 * 社区选择功能相关类型定义
 * @module community.types
 */

/**
 * 社区实体（与后端Community实体对应）
 */
export interface Community {
  /** 社区唯一标识符 */
  _id: string;
  /** 社区编码 */
  code?: string;
  /** 社区名称 */
  name: string;
  /** 省份 */
  province?: string;
  /** 城市 */
  city?: string;
  /** 区/县 */
  district?: string;
  /** 详细地址 */
  detailAddress?: string;
  /** 纬度 */
  latitude?: number;
  /** 经度 */
  longitude?: number;
  /** 联系人 */
  contactPerson?: string;
  /** 联系电话 */
  contactPhone?: string;
  /** 社区描述 */
  description?: string;
  /** 逻辑删除标记 */
  deleted?: number;
  /** 距离用户的距离（单位：公里，可选，由前端计算） */
  distance?: number;
  /** 创建时间戳 */
  createTime?: string;
  /** 更新时间戳 */
  updateTime?: string;
}

/**
 * 用户选择记录
 */
export interface UserSelection {
  /** 用户选择的社区 ID */
  communityId: string;
  /** 选择时间戳（毫秒） */
  selectedAt: number;
  /** 最后更新时间戳（毫秒） */
  updatedAt: number;
}

/**
 * 地图标记点
 */
export interface MapMarker {
  /** 标记点唯一 ID */
  id: number;
  /** 纬度 */
  latitude: number;
  /** 经度 */
  longitude: number;
  /** 标题 */
  title: string;
  /** 自定义图标路径（可选） */
  iconPath?: string;
  /** 图标宽度（像素，可选） */
  width?: number;
  /** 图标高度（像素，可选） */
  height?: number;
  /** 透明度（0-1，可选） */
  alpha?: number;
  /** 是否为当前选中的社区（可选） */
  isSelected?: boolean;
}

/**
 * 视图模式
 */
export type ViewMode = 'map' | 'list';

/**
 * 社区列表响应
 */
export interface CommunityList {
  /** 社区数组 */
  communities: Community[];
  /** 总数 */
  total: number;
  /** 缓存时间戳（可选） */
  cachedAt?: number;
}

/**
 * 排序方式
 */
export type SortBy = 'distance' | 'name' | 'created_at';

/**
 * API 响应基础类型
 */
export interface ApiResponse<T = any> {
  /** 是否成功 */
  success: boolean;
  /** 数据 */
  data?: T;
  /** 错误信息 */
  error?: {
    /** 错误代码 */
    code: string;
    /** 错误消息 */
    message: string;
    /** 错误详情（可选） */
    details?: Record<string, any>;
  };
}
