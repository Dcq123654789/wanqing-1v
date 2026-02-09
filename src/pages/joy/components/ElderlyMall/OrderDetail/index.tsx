import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { get, post } from '@/utils/request'
import './index.scss'
import PageTransitionOverlay from '@/components/PageTransitionOverlay'

interface OrderItem {
  productId: string
  productName: string
  productPrice: number
  quantity: number
  subtotal: number
}

interface OrderDetailData {
  orderId: string
  orderNo: string
  userId: string
  status: number
  statusDesc: string
  totalAmount: number
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  remark: string
  createTime: string
  payTime: string
  items: OrderItem[]
}

function OrderDetail() {
  const [orderId, setOrderId] = useState<string>('')
  const [orderDetail, setOrderDetail] = useState<OrderDetailData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const instance = Taro.getCurrentInstance()
    const params = instance.router?.params

    if (params?.orderId) {
      setOrderId(params.orderId)
      fetchOrderDetail(params.orderId)
    }
  }, [])

  // 从后端获取订单详情
  const fetchOrderDetail = async (id: string) => {
    setLoading(true)

    try {
      const response = await get<OrderDetailData>(`/api/mall/order/detail/${id}`)

      const data = response.data as OrderDetailData

      // 格式化时间
      if (data.createTime) {
        data.createTime = formatTime(data.createTime)
      }
      if (data.payTime) {
        data.payTime = formatTime(data.payTime)
      }

      setOrderDetail(data)
    } catch (error: any) {
      console.error('获取订单详情失败:', error)
      // 错误已经在 request 工具中统一处理
    } finally {
      setLoading(false)
    }
  }

  // 格式化时间
  const formatTime = (timeStr: string): string => {
    try {
      const date = new Date(timeStr)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      const second = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    } catch {
      return timeStr
    }
  }

  // 查看物流
  const handleViewLogistics = () => {
    Taro.showToast({
      title: '查看物流',
      icon: 'none'
    })
  }

  // 联系客服
  const handleContactService = () => {
    Taro.showToast({
      title: '联系客服',
      icon: 'none'
    })
  }

  // 确认收货
  const handleConfirmReceipt = () => {
    Taro.showModal({
      title: '确认收货',
      content: '请确认已收到商品',
      success: (res) => {
        if (res.confirm) {
          // TODO: 调用确认收货接口
          Taro.showToast({
            title: '已确认收货',
            icon: 'success'
          })
          // 重新获取订单详情
          if (orderId) {
            fetchOrderDetail(orderId)
          }
        }
      }
    })
  }

  // 取消订单
  const handleCancelOrder = () => {
    Taro.showModal({
      title: '取消订单',
      content: '确定要取消此订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await post(`/api/mall/order/cancel/${orderId}`, {
              reason: '用户主动取消'
            })

            Taro.showToast({
              title: '订单已取消',
              icon: 'success'
            })

            // 重新获取订单详情
            if (orderId) {
              fetchOrderDetail(orderId)
            }
          } catch (error: any) {
            // 错误已经在 request 工具中统一处理
          }
        }
      }
    })
  }

  // 申请售后
  const handleAfterSale = () => {
    Taro.showToast({
      title: '申请售后',
      icon: 'none'
    })
  }

  // 再次购买
  const handleBuyAgain = () => {
    Taro.navigateBack()
  }

  // 获取订单状态文本和图标
  const getOrderStatusInfo = () => {
    if (!orderDetail) return { icon: '○', text: '加载中...', tip: '' }

    switch (orderDetail.status) {
      case 0: // 待支付
        return { icon: '⏰', text: '待支付', tip: '订单将在15分钟后自动取消' }
      case 1: // 已支付
        return { icon: '✓', text: '订单已支付', tip: '商家正在为您准备商品' }
      case 2: // 已发货
        return { icon: '🚚', text: '已发货', tip: '商品正在配送中' }
      case 3: // 已完成
        return { icon: '★', text: '订单已完成', tip: '感谢您的购买' }
      case 4: // 已取消
        return { icon: '✕', text: '订单已取消', tip: '订单已取消' }
      default:
        return { icon: '○', text: '未知状态', tip: '' }
    }
  }

  if (loading) {
    return (
      <View className="order-detail-page">
        <View className="loading-state">
          <Text>加载中...</Text>
        </View>
      </View>
    )
  }

  if (!orderDetail) {
    return (
      <View className="order-detail-page">
        <View className="error-state">
          <Text>订单不存在</Text>
        </View>
      </View>
    )
  }

  const statusInfo = getOrderStatusInfo()

  return (
    <View className="order-detail-page">
      <PageTransitionOverlay />

      <ScrollView scrollY className="scroll-container">
        {/* 订单状态 */}
        <View className="status-section">
          <View className="status-icon">{statusInfo.icon}</View>
          <Text className="status-text">{statusInfo.text}</Text>
          {statusInfo.tip && <Text className="status-tip">{statusInfo.tip}</Text>}
        </View>

        {/* 收货地址 */}
        <View className="address-section">
          <View className="address-header">
            <Text className="address-icon">📍</Text>
            <Text className="address-title">收货信息</Text>
          </View>
          <View className="address-content">
            <Text className="receiver-info">
              {orderDetail.receiverName} {orderDetail.receiverPhone}
            </Text>
            <Text className="receiver-address">{orderDetail.receiverAddress}</Text>
          </View>
        </View>

        {/* 商品信息 */}
        <View className="product-section">
          <View className="section-title">商品信息</View>

          {orderDetail.items?.map((item, index) => (
            <View key={index} className="product-card">
              <Image
                src={`https://via.placeholder.com/200?text=${encodeURIComponent(item.productName)}`}
                className="product-image"
                mode="aspectFill"
              />

              <View className="product-info">
                <Text className="product-name">{item.productName}</Text>
                <Text className="product-quantity">数量: {item.quantity}</Text>
                <Text className="product-price">￥{item.productPrice.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 订单信息 */}
        <View className="order-info-section">
          <View className="section-title">订单信息</View>

          <View className="info-list">
            <View className="info-item">
              <Text className="info-label">订单编号</Text>
              <View className="info-value-wrapper">
                <Text className="info-value">{orderDetail.orderNo}</Text>
                <Text
                  className="copy-button"
                  onClick={() => {
                    Taro.setClipboardData({ data: orderDetail.orderNo })
                    Taro.showToast({ title: '已复制', icon: 'success' })
                  }}
                >
                  复制
                </Text>
              </View>
            </View>
            <View className="info-item">
              <Text className="info-label">订单状态</Text>
              <Text className="info-value">{orderDetail.statusDesc}</Text>
            </View>
            {orderDetail.createTime && (
              <View className="info-item">
                <Text className="info-label">下单时间</Text>
                <Text className="info-value">{orderDetail.createTime}</Text>
              </View>
            )}
            {orderDetail.payTime && (
              <View className="info-item">
                <Text className="info-label">支付时间</Text>
                <Text className="info-value">{orderDetail.payTime}</Text>
              </View>
            )}
            {orderDetail.remark && (
              <View className="info-item">
                <Text className="info-label">订单备注</Text>
                <Text className="info-value">{orderDetail.remark}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 价格明细 */}
        <View className="price-section">
          <View className="section-title">价格明细</View>

          <View className="price-list">
            <View className="price-item">
              <Text className="price-label">商品金额</Text>
              <Text className="price-value">￥{orderDetail.totalAmount.toFixed(2)}</Text>
            </View>
            <View className="price-item">
              <Text className="price-label">运费</Text>
              <Text className="price-value">免运费</Text>
            </View>
            <View className="price-item total">
              <Text className="price-label">实付款</Text>
              <Text className="price-value total-amount">￥{orderDetail.totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* 底部留白 */}
        <View className="bottom-spacer"></View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className="bottom-bar">
        <View className="action-buttons">
          {orderDetail.status === 0 && (
            // 待支付状态
            <>
              <View className="action-btn secondary" onClick={handleContactService}>
                <Text className="action-text">联系客服</Text>
              </View>
              <View className="action-btn primary" onClick={handleCancelOrder}>
                <Text className="action-text">取消订单</Text>
              </View>
            </>
          )}

          {orderDetail.status === 1 && (
            // 已支付状态
            <>
              <View className="action-btn secondary" onClick={handleViewLogistics}>
                <Text className="action-text">查看物流</Text>
              </View>
              <View className="action-btn secondary" onClick={handleContactService}>
                <Text className="action-text">联系客服</Text>
              </View>
              <View className="action-btn primary" onClick={handleConfirmReceipt}>
                <Text className="action-text">确认收货</Text>
              </View>
            </>
          )}

          {orderDetail.status === 2 && (
            // 已发货状态
            <>
              <View className="action-btn secondary" onClick={handleViewLogistics}>
                <Text className="action-text">查看物流</Text>
              </View>
              <View className="action-btn secondary" onClick={handleContactService}>
                <Text className="action-text">联系客服</Text>
              </View>
              <View className="action-btn primary" onClick={handleConfirmReceipt}>
                <Text className="action-text">确认收货</Text>
              </View>
            </>
          )}

          {orderDetail.status === 3 && (
            // 已完成状态
            <>
              <View className="action-btn secondary" onClick={handleAfterSale}>
                <Text className="action-text">申请售后</Text>
              </View>
              <View className="action-btn primary" onClick={handleBuyAgain}>
                <Text className="action-text">再次购买</Text>
              </View>
            </>
          )}

          {orderDetail.status === 4 && (
            // 已取消状态
            <>
              <View className="action-btn secondary" onClick={handleContactService}>
                <Text className="action-text">联系客服</Text>
              </View>
              <View className="action-btn primary" onClick={handleBuyAgain}>
                <Text className="action-text">再次购买</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  )
}

export default OrderDetail
