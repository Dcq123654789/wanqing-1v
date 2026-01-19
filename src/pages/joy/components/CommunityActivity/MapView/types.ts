/**
 * 地图页面类型定义
 */

// 地图标记点
export interface MapMarker {
  id: number
  latitude: number
  longitude: number
  title: string
  iconPath?: string
  width?: number
  height?: number
  alpha?: number
  callout?: {
    content: string
    color?: string
    fontSize?: number
    borderRadius?: number
    bgColor?: string
    padding?: number
    display?: 'ALWAYS' | 'BYCLICK'
    textAlign?: 'center'
  }
  label?: {
    content: string
    color?: string
    fontSize?: number
    x?: number
    y?: number
    borderWidth?: number
    borderColor?: string
    bgColor?: string
    padding?: number
    textAlign?: 'left' | 'center' | 'right'
  }
}

// 地图中心位置
export interface MapCenter {
  latitude: number
  longitude: number
}
