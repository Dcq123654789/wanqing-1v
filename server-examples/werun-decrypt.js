/**
 * 微信运动数据解密接口示例
 *
 * 这是一个 Node.js 示例代码，用于解密微信小程序的微信运动数据
 * 需要安装 crypto-js: npm install crypto-js
 *
 * 使用说明：
 * 1. 将此代码部署到你的后端服务器
 * 2. 创建一个 POST 接口 /api/werun/decrypt
 * 3. 前端调用时传递 encryptedData, iv, sessionKey
 */

const CryptoJS = require('crypto-js')

/**
 * 解密微信运动数据
 * @param {string} encryptedData - 加密数据
 * @param {string} iv - 加密向量
 * @param {string} sessionKey - 用户 session_key
 * @returns {object} 解密后的数据
 */
function decryptWerunData(encryptedData, iv, sessionKey) {
  // base64 解码
  const key = CryptoJS.enc.Base64.parse(sessionKey)
  const ivParsed = CryptoJS.enc.Base64.parse(iv)
  const encrypted = CryptoJS.enc.Base64.parse(encryptedData)

  // AES 解密
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: encrypted },
    key,
    {
      iv: ivParsed,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  )

  // 转换为 UTF-8 字符串
  const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)

  // 解析 JSON
  const result = JSON.parse(decryptedStr)

  return result
}

/**
 * Express 路由示例
 */
/*
const express = require('express')
const router = express.Router()

router.post('/api/werun/decrypt', async (req, res) => {
  try {
    const { encryptedData, iv, sessionKey } = req.body

    // 验证参数
    if (!encryptedData || !iv || !sessionKey) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      })
    }

    // 解密数据
    const decryptedData = decryptWerunData(encryptedData, iv, sessionKey)

    // 返回解密后的数据
    res.json({
      success: true,
      data: decryptedData
    })
  } catch (error) {
    console.error('解密失败：', error)
    res.status(500).json({
      success: false,
      message: '解密失败'
    })
  }
})

module.exports = router
*/

/**
 * Koa 路由示例
 */
/*
const Router = require('@koa/router')
const router = new Router()

router.post('/api/werun/decrypt', async (ctx) => {
  try {
    const { encryptedData, iv, sessionKey } = ctx.request.body

    // 验证参数
    if (!encryptedData || !iv || !sessionKey) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: '缺少必要参数'
      }
      return
    }

    // 解密数据
    const decryptedData = decryptWerunData(encryptedData, iv, sessionKey)

    // 返回解密后的数据
    ctx.body = {
      success: true,
      data: decryptedData
    }
  } catch (error) {
    console.error('解密失败：', error)
    ctx.status = 500
    ctx.body = {
      success: false,
      message: '解密失败'
    }
  }
})

module.exports = router
*/

/**
 * 云函数示例（微信小程序云开发）
 */
/*
// 云函数入口文件
const cloud = require('wx-server-sdk')
const CryptoJS = require('crypto-js')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { encryptedData, iv, sessionKey } = event

  try {
    // 解密数据
    const key = CryptoJS.enc.Base64.parse(sessionKey)
    const ivParsed = CryptoJS.enc.Base64.parse(iv)
    const encrypted = CryptoJS.enc.Base64.parse(encryptedData)

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encrypted },
      key,
      {
        iv: ivParsed,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    )

    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)
    const result = JSON.parse(decryptedStr)

    // 可选：将数据存储到数据库
    // const openid = cloud.getWXContext().openid
    // await db.collection('werun_data').add({
    //   data: {
    //     openid,
    //     stepInfoList: result.stepInfoList,
    //     createTime: new Date()
    //   }
    // })

    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('解密失败：', error)
    return {
      success: false,
      message: '解密失败'
    }
  }
}
*/

// 导出解密函数供其他模块使用
module.exports = { decryptWerunData }

/**
 * 解密后的数据结构示例：
 * {
 *   "stepInfoList": [
 *     {
 *       "timestamp": 1642243200000,
 *       "step": 8542
 *     },
 *     {
 *       "timestamp": 1642329600000,
 *       "step": 9234
 *     }
 *   ]
 * }
 *
 * stepInfoList 包含最近 30 天的步数数据
 * timestamp: 时间戳（毫秒）
 * step: 当天步数
 */
