import { View, Text, Picker } from '@tarojs/components'
import { useState } from 'react'
import { getProvinces, getCitiesByProvince, getDistrictsByCity } from '@/data/regionData'
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
 * 地址选择器组件（省市区三级联动）
 */
function AddressPicker({ value, onChange }: AddressPickerProps) {
  const [provinceIndex, setProvinceIndex] = useState<number>(0)
  const [cityIndex, setCityIndex] = useState<number>(0)
  const [districtIndex, setDistrictIndex] = useState<number>(0)

  const provinces = getProvinces()
  const currentProvince = value?.province || provinces[0]
  const cities = getCitiesByProvince(currentProvince)
  const currentCity = value?.city || cities[0]
  const districts = getDistrictsByCity(currentProvince, currentCity)
  const currentDistrict = value?.district || districts[0]

  // 处理省份选择
  const handleProvinceChange = (e: any) => {
    const index = e.detail.value
    const province = provinces[index]
    const cityList = getCitiesByProvince(province)
    const districtList = getDistrictsByCity(province, cityList[0])

    setProvinceIndex(index)
    setCityIndex(0)
    setDistrictIndex(0)

    onChange({
      province,
      city: cityList[0],
      district: districtList[0]
    })
  }

  // 处理城市选择
  const handleCityChange = (e: any) => {
    const index = e.detail.value
    const city = cities[index]
    const districtList = getDistrictsByCity(currentProvince, city)

    setCityIndex(index)
    setDistrictIndex(0)

    onChange({
      province: currentProvince,
      city,
      district: districtList[0]
    })
  }

  // 处理区县选择
  const handleDistrictChange = (e: any) => {
    const index = e.detail.value
    const district = districts[index]

    setDistrictIndex(index)

    onChange({
      province: currentProvince,
      city: currentCity,
      district
    })
  }

  return (
    <View className="address-picker">
      <View className="picker-row">
        <Text className="picker-label">省/直辖市</Text>
        <Picker
          mode="selector"
          range={provinces}
          value={provinceIndex}
          onChange={handleProvinceChange}
        >
          <View className={`picker-value ${value?.province ? 'picker-value--selected' : ''}`}>
            <Text className="value-text">{currentProvince}</Text>
            <Text className="picker-arrow">▼</Text>
          </View>
        </Picker>
      </View>

      <View className="picker-row">
        <Text className="picker-label">城市</Text>
        <Picker
          mode="selector"
          range={cities}
          value={cityIndex}
          onChange={handleCityChange}
        >
          <View className={`picker-value ${value?.city ? 'picker-value--selected' : ''}`}>
            <Text className="value-text">{currentCity}</Text>
            <Text className="picker-arrow">▼</Text>
          </View>
        </Picker>
      </View>

      <View className="picker-row">
        <Text className="picker-label">区/县</Text>
        <Picker
          mode="selector"
          range={districts}
          value={districtIndex}
          onChange={handleDistrictChange}
        >
          <View className={`picker-value ${value?.district ? 'picker-value--selected' : ''}`}>
            <Text className="value-text">{currentDistrict}</Text>
            <Text className="picker-arrow">▼</Text>
          </View>
        </Picker>
      </View>
    </View>
  )
}

export default AddressPicker
