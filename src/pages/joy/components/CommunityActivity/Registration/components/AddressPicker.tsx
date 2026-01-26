import { View, Text, Picker } from '@tarojs/components'
import { useState } from 'react'
import './AddressPicker.scss'

interface AddressPickerProps {
  value?: {
    province: string
    city: string
    district: string
  }
  onChange: (address: { province: string; city: string; district: string }) => void
}

/**
 * 地址选择器组件（省市区三级联动，类似淘宝）
 * 使用Taro原生mode="region"实现完整的省市区数据
 */
function AddressPicker({ value, onChange }: AddressPickerProps) {
  // 将value转换为Picker需要的数组格式 [province, city, district]
  const getPickerValue = () => {
    if (value?.province && value?.city && value?.district) {
      return [value.province, value.city, value.district]
    }
    return []
  }

  // 处理地址变化
  const handleAddressChange = (e: any) => {
    const [province, city, district] = e.detail.value
    onChange({
      province,
      city,
      district
    })
  }

  // 显示的地址文本
  const getDisplayText = () => {
    if (value?.province && value?.city && value?.district) {
      return `${value.province} ${value.city} ${value.district}`
    }
    return '请选择省/市/区 >'
  }

  return (
    <View className="address-picker-inline">
      <Picker
        mode="region"
        value={getPickerValue()}
        onChange={handleAddressChange}
      >
        <View className={`picker-value-inline ${value?.province ? 'picker-value--selected' : ''}`}>
          <Text className="value-text">{getDisplayText()}</Text>
        </View>
      </Picker>
    </View>
  )
}

export default AddressPicker
