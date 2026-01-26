/**
 * 自定义图标组件
 * 使用 Unicode 符号作为图标
 */
import React from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

interface IconProps {
  name: string
  size?: number | string
  color?: string
  className?: string
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#333', className = '' }) => {
  // 图标映射表
  const iconMap: Record<string, string> = {
    'success': '✓',
    'photograph': '📷',
    'contact': '👤',
    'phone-o': '📱',
    'clock-o': '⏰',
    'like-o': '♡',
    'like': '♥',
    'location-o': '📍',
    'info-o': 'ℹ️',
    'warning-o': '⚠️',
    'error': '✖',
    'edit': '✏️',
    'delete': '🗑️',
    'share': '📤',
    'star': '⭐',
    'star-o': '☆',
    'home-o': '🏠',
    'search': '🔍',
    'close': '✕',
    'plus': '＋',
    'minus': '−',
    'checked': '☑',
    'check': '☑',
    'arrow-left': '←',
    'arrow-right': '→',
    'arrow-up': '↑',
    'arrow-down': '↓',
  }

  const iconChar = iconMap[name] || name

  return (
    <View className={`custom-icon ${className}`}>
      <Text style={{ fontSize: size, color }}>{iconChar}</Text>
    </View>
  )
}

export default Icon
