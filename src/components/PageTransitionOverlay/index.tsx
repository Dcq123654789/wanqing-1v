import { View } from '@tarojs/components'
import { usePageTransition } from '@/hooks/usePageTransition'
import './index.scss'

/**
 * 页面过渡遮罩组件
 * 在页面跳转时显示全屏白色遮罩，提升用户体验
 *
 * @example
 * ```tsx
 * // 在任何页面中使用
 * import PageTransitionOverlay from '@/components/PageTransitionOverlay'
 *
 * function MyPage() {
 *   return (
 *     <View>
 *       <PageTransitionOverlay />
 *       {/* 页面内容 *\/}
 *     </View>
 *   )
 * }
 * ```
 */
function PageTransitionOverlay() {
  const { isVisible } = usePageTransition()

  if (!isVisible) return null

  return <View className="page-transition-overlay" />
}

export default PageTransitionOverlay
