import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { post, query } from '@/utils/request'
import { useUserStore } from '@/store/userStore'
import './index.scss'
import PageTransitionOverlay from '@/components/PageTransitionOverlay'

// 省市区 code 转名称映射（简化版，实际应该从地区数据中获取）
const getProvinceName = (code: string) => {
  const provinces: Record<string, string> = {
    '11': '北京市', '12': '天津市', '13': '河北省', '14': '山西省', '15': '内蒙古自治区',
    '21': '辽宁省', '22': '吉林省', '23': '黑龙江省', '31': '上海市', '32': '江苏省',
    '33': '浙江省', '34': '安徽省', '35': '福建省', '36': '江西省', '37': '山东省',
    '41': '河南省', '42': '湖北省', '43': '湖南省', '44': '广东省', '45': '广西壮族自治区',
    '46': '海南省', '50': '重庆市', '51': '四川省', '52': '贵州省', '53': '云南省',
    '54': '西藏自治区', '61': '陕西省', '62': '甘肃省', '63': '青海省', '64': '宁夏回族自治区',
    '65': '新疆维吾尔自治区'
  }
  return provinces[code] || code
}

const getCityName = (provinceCode: string, cityCode: string) => {
  // 简化处理，实际应该查询完整地区数据
  const cities: Record<string, string> = {
    '21': '辽宁', '34': '安徽'
  }
  return cities[cityCode] || cityCode
}

const getDistrictName = (districtCode: string) => {
  return districtCode
}

// tag code 转名称
const getTagName = (tag: number) => {
  const tags: Record<number, string> = {
    1: '家',
    2: '公司',
    3: '学校'
  }
  return tags[tag] || ''
}

interface AddressInfo {
  _id?: string
  receiverName: string
  receiverPhone: string
  province: string
  city: string
  district: string
  detailAddress: string
  isDefault?: number
  tag?: number
  status?: number
}

interface ProductOrderData {
  productId: string
  name: string
  poster: string
  price: number
  spec?: string
  stock: number
}

interface SubmitOrderResponse {
  orderId: string
  orderNo: string
  totalAmount: number
  expireTime: number
  signature: string
  timestamp: number
  payParams: {
    timeStamp: string
    nonceStr: string
    package: string
    signType: string
    paySign: string
    outTradeNo: string
    totalAmount: number
  }
}

function OrderConfirm() {
  const { userInfo } = useUserStore()
  const [product, setProduct] = useState<ProductOrderData | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [address, setAddress] = useState<AddressInfo | null>(null)
  const [addressList, setAddressList] = useState<AddressInfo[]>([])
  const [remark, setRemark] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const instance = Taro.getCurrentInstance()
    const params = instance.router?.params

    if (params) {
      const productData = params.product ? JSON.parse(decodeURIComponent(params.product)) : null
      const qty = params.quantity ? parseInt(params.quantity) : 1

      if (productData) {
        setProduct(productData)
        setQuantity(qty)
      }
    }

    // 加载用户地址列表
    loadAddressList()
  }, [])

  // 加载用户地址列表
  const loadAddressList = async () => {
    try {
      const response = await query<any>('useraddress', {
        conditions: { userId: userInfo?.id || '' },
        sort: { isDefault: 'desc', usedCount: 'desc' }
      })

      if (response.code === 200 && response.data) {
        // data 直接是数组
        const list = Array.isArray(response.data) ? response.data : []
        setAddressList(list)

        // 自动选择默认地址
        const defaultAddress = list.find((addr: AddressInfo) => addr.isDefault === 1)
        if (defaultAddress) {
          setAddress(defaultAddress)
        } else if (list.length > 0) {
          setAddress(list[0])
        }
      }
    } catch (error) {
      console.error('加载地址列表失败:', error)
    }
  }
  
  // 计算总价
  const totalPrice = product ? product.price * quantity : 0

  // 选择收货地址
  const handleSelectAddress = () => {
    if (addressList.length === 0) {
      Taro.showToast({
        title: '暂无收货地址',
        icon: 'none'
      })
      return
    }

    // 显示地址选择列表
    const addressItems = addressList.map((addr, index) => {
      const provinceName = getProvinceName(addr.province)
      const cityName = getCityName(addr.province, addr.city)
      const districtName = getDistrictName(addr.district)
      const tagName = getTagName(addr.tag || 0)
      const fullAddress = `${provinceName}${cityName}${districtName}${addr.detailAddress}`

      return {
        name: addr.receiverName,
        phone: addr.receiverPhone,
        tag: tagName,
        address: fullAddress,
        displayText: `${addr.receiverName} ${addr.receiverPhone} ${tagName ? '[' + tagName + ']' : ''}\n${fullAddress}`,
        selected: address?._id === addr._id
      }
    })

    Taro.showActionSheet({
      itemList: addressItems.map(item => item.displayText),
      success: (res) => {
        if (res.tapIndex >= 0 && res.tapIndex < addressList.length) {
          setAddress(addressList[res.tapIndex])
        }
      }
    })
  }

  // 提交订单
  const handleSubmitOrder = async () => {
    // 验证收货地址
    if (!address || !address.receiverName || !address.receiverPhone || !address.detailAddress) {
      Taro.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }

    if (!product) return

    setSubmitting(true)

    try {
      // 使用项目封装的 post 方法，自动带上 token
      const fullAddress = `${getProvinceName(address.province)}${getCityName(address.province, address.city)}${getDistrictName(address.district)}${address.detailAddress}`

      const response = await post('/api/mall/order/submit', {
        userId: userInfo?.id || '',
        receiverName: address.receiverName,
        receiverPhone: address.receiverPhone,
        receiverAddress: fullAddress,
        remark: remark,
        items: [{
          productId: product.productId,
          quantity: quantity
        }]
      }, {
        showLoading: true,
        loadingText: '提交订单中...'
      })

      if (response.code === 200) {
        Taro.showToast({
          title: '订单创建成功',
          icon: 'success',
          duration: 1500
        })

        // 返回首页
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/joy/components/ElderlyMall/index'
          })
        }, 1500)
      } else {
        throw new Error(response.message || '订单创建失败')
      }
    } catch (error: any) {
      console.error('创建订单失败:', error)
      Taro.showToast({
        title: error.message || '订单创建失败',
        icon: 'none'
      })
    } finally {
      setSubmitting(false)
    }
  }

  // 数量增加
  const handleIncrease = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1)
    } else {
      Taro.showToast({
        title: '库存不足',
        icon: 'none'
      })
    }
  }

  // 数量减少
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (!product) {
    return (
      <View className="order-confirm-page">
        <View className="loading-state">
          <Text>加载中...</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="order-confirm-page">
      <PageTransitionOverlay />
      <ScrollView scrollY className="scroll-container">
        {/* 收货地址 */}
        <View className="address-section" onClick={handleSelectAddress}>
          {address ? (
            <View className="address-card">
              <View className="address-info">
                <View className="address-header">
                  <Text className="receiver-name">{address.receiverName}</Text>
                  <Text className="receiver-phone">{address.receiverPhone}</Text>
                  {address.tag && (
                    <Text className="address-tag">{getTagName(address.tag)}</Text>
                  )}
                </View>
                <Text className="address-detail">
                  {getProvinceName(address.province)}{getCityName(address.province, address.city)}{getDistrictName(address.district)}{address.detailAddress}
                </Text>
              </View>
              <Text className="address-arrow">›</Text>
            </View>
          ) : (
            <View className="address-card address-card--empty">
              <View className="address-empty">
                <Text className="empty-text">请选择收货地址</Text>
                <Text className="empty-arrow">›</Text>
              </View>
            </View>
          )}
        </View>

        {/* 商品信息 */}
        <View className="product-section">
          <View className="section-header">
            <Text className="section-title">商品信息</Text>
          </View>

          <View className="product-card">
            <Image
              src={product.poster}
              className="product-image"
              mode="aspectFill"
            />

            <View className="product-info">
              <Text className="product-name">{product.name}</Text>

              {product.spec && (
                <Text className="product-spec">规格: {product.spec}</Text>
              )}

              <View className="product-footer">
                <View className="price-wrapper">
                  <Text className="price-symbol">￥</Text>
                  <Text className="price-value">{product.price}</Text>
                </View>

                <View className="quantity-selector">
                  <Text className="quantity-btn" onClick={handleDecrease}>-</Text>
                  <Text className="quantity-value">{quantity}</Text>
                  <Text className="quantity-btn" onClick={handleIncrease}>+</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 商品数量 */}
          <View className="product-meta">
            <View className="meta-item">
              <Text className="meta-label">购买数量</Text>
              <Text className="meta-value">{quantity} 件</Text>
            </View>
            <View className="meta-item">
              <Text className="meta-label">库存</Text>
              <Text className="meta-value">{product.stock} 件</Text>
            </View>
          </View>
        </View>

        {/* 价格明细 */}
        <View className="price-section">
          <View className="section-header">
            <Text className="section-title">价格明细</Text>
          </View>

          <View className="price-list">
            <View className="price-item">
              <Text className="price-label">商品金额</Text>
              <Text className="price-value">￥{product.price * quantity}</Text>
            </View>
            <View className="price-item">
              <Text className="price-label">运费</Text>
              <Text className="price-value">免运费</Text>
            </View>
          </View>
        </View>

        {/* 订单备注 */}
        <View className="remark-section">
          <View className="section-header">
            <Text className="section-title">订单备注</Text>
          </View>
          <View className="remark-input" onClick={() => {
            // TODO: 实现备注输入
          }}>
            <Text className="remark-placeholder">{remark || '选填，对本次订单的说明'}</Text>
          </View>
        </View>

        {/* 底部留白 */}
        <View className="bottom-spacer"></View>
      </ScrollView>

      {/* 底部结算栏 */}
      <View className="bottom-bar">
        <View className="total-section">
          <Text className="total-label">合计:</Text>
          <View className="total-price-wrapper">
            <Text className="total-symbol">￥</Text>
            <Text className="total-value">{totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        <View
          className={`submit-button ${submitting ? 'submit-button--loading' : ''}`}
          onClick={handleSubmitOrder}
        >
          <Text className="submit-text">{submitting ? '提交中...' : '提交订单'}</Text>
        </View>
      </View>
    </View>
  )
}

export default OrderConfirm
