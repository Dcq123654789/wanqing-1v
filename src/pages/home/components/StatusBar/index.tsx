import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

function StatusBar() {
  // 获取系统状态栏高度
  const systemInfo = Taro.getSystemInfoSync()
  const statusBarHeight = systemInfo.statusBarHeight || 20

  const style = {
    height: `${statusBarHeight}px`
  }

  return <View className="status-bar" style={style}></View>
}

export default StatusBar
