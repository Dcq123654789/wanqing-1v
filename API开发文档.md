# API 开发文档

> 本文档面向前端开发者，详细说明微信小程序登录接口和通用接口的使用方法

## 目录
- [认证机制说明](#认证机制说明)
- [登录接口](#登录接口)
- [Token管理接口](#token管理接口)
- [通用接口说明](#通用接口说明)
- [错误处理](#错误处理)
- [完整代码示例](#完整代码示例)

---

## 认证机制说明

### 双Token机制
本系统采用 **JWT 双Token认证**机制：

| Token类型 | 有效期 | 用途 | 存储建议 |
|-----------|--------|------|----------|
| **AccessToken** | 7天 | 访问需要认证的接口 | 内存（全局变量/状态管理） |
| **RefreshToken** | 30天 | 刷新AccessToken | 持久化存储（localStorage） |

### 工作流程

```
┌─────────────┐
│  微信登录    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  1. wx.login() 获取code         │
│  2. 调用 /api/auth/login        │
│  3. 获取 accessToken + refreshToken │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  存储Token                      │
│  - accessToken → 内存           │
│  - refreshToken → localStorage  │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  发起业务请求                    │
│  - 携带 Authorization: Bearer {accessToken} │
└──────┬──────────────────────────┘
       │
       ├─── Token有效 ──→ 继续请求
       │
       └─── Token过期(401) ──→
              │
              ▼
     ┌─────────────────────┐
     │ 使用refreshToken     │
     │ 调用 /api/auth/refresh│
     └─────────┬───────────┘
               │
               ▼
     ┌─────────────────────┐
     │ 获取新的accessToken  │
     │ 重试原请求           │
     └─────────────────────┘
```

### Token存储规范

```javascript
// ✅ 推荐做法
const appState = {
  accessToken: 'xxx',        // 存在内存中，关闭页面清除
  user: { userId: '123' }
}
localStorage.setItem('refreshToken', 'xxx')  // 持久化

// ❌ 不推荐做法
localStorage.setItem('accessToken', 'xxx')   // XSS攻击风险
```

---

## 登录接口

### 微信小程序一键登录

#### 基本信息
- **接口地址**：`POST /api/auth/login`
- **Content-Type**：`application/json`
- **是否需要认证**：否

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| code | String | ✅ 必填 | 通过 `wx.login()` 获取的临时登录凭证 |
| nickname | String | 可选 | 用户昵称，建议传递以提升用户体验 |
| avatar | String | 可选 | 用户头像URL，建议传递 |
| gender | Integer | 可选 | 性别：0=未知，1=男，2=女 |

#### 请求示例
```json
{
  "code": "071abc2w3def456GHI7jkl8MNOpqrST",
  "nickname": "张三",
  "avatar": "https://thirdwx.qlogo.cn/...",
  "gender": 1
}
```

#### 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| accessToken | String | 访问令牌，7天有效，用于后续请求认证 |
| refreshToken | String | 刷新令牌，30天有效，用于获取新accessToken |
| tokenType | String | 固定值 "Bearer" |
| expiresIn | Long | AccessToken过期时间（秒），默认 604800（7天） |
| userId | String | 用户唯一标识 |
| nickname | String | 用户昵称 |
| avatar | String | 用户头像URL |
| isNewUser | Boolean | 是否为新用户（首次登录） |

#### 成功响应
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjM0Iiwib3BlbmlkIjoi...",
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjM0Iiwib3BlbmlkIjoi...",
    "tokenType": "Bearer",
    "expiresIn": 604800,
    "userId": "1234567890",
    "nickname": "张三",
    "avatar": "https://example.com/avatar.jpg",
    "isNewUser": true
  },
  "timestamp": 1705901400000
}
```

#### 错误响应
```json
{
  "code": 400,
  "message": "code不能为空"
}
```

```json
{
  "code": 500,
  "message": "获取微信OpenID失败，请检查code是否有效"
}
```

---

## Token管理接口

### 1. 刷新访问令牌

#### 基本信息
- **接口地址**：`POST /api/auth/refresh`
- **是否需要认证**：否

#### 请求参数
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| refreshToken | String | ✅ 必填 | 登录时返回的refreshToken |

#### 请求示例
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjM0Iiwib3BlbmlkIjoi..."
}
```

#### 成功响应
```json
{
  "code": 200,
  "message": "Token刷新成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjM0Iiwib3BlbmlkIjoi...",
    "tokenType": "Bearer"
  }
}
```

#### 错误响应
```json
{
  "code": 401,
  "message": "刷新令牌无效或已过期"
}
```

### 2. 验证Token

#### 基本信息
- **接口地址**：`POST /api/auth/validate`
- **是否需要认证**：否

#### 请求参数
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| token | String | ✅ 必填 | 完整的token（支持带或不带Bearer前缀） |

#### 请求示例
```json
{
  "token": "Bearer eyJhbGciOiJIUzI1NiJ9..."
}
```

或
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

#### 成功响应
```json
{
  "code": 200,
  "message": "Token有效",
  "data": {
    "valid": true,
    "userId": "1234567890",
    "openid": "oXXXX-XXXXXXXXXXXXXXXXXXXX"
  }
}
```

### 3. 获取当前用户信息

#### 基本信息
- **接口地址**：`GET /api/auth/user/info`
- **是否需要认证**：是，需要携带 `Authorization: Bearer {accessToken}`

#### 请求示例
```javascript
// 微信小程序
wx.request({
  url: 'https://api.example.com/api/auth/user/info',
  method: 'GET',
  header: {
    'Authorization': `Bearer ${accessToken}`
  }
})
```

#### 成功响应
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "_id": "1234567890",
    "openid": "oXXXX-XXXXXXXXXXXXXXXXXXXX",
    "nickname": "张三",
    "avatar": "https://example.com/avatar.jpg",
    "gender": 1,
    "createTime": "2024-01-01T00:00:00",
    "updateTime": "2024-01-01T00:00:00"
  }
}
```

### 4. 退出登录

#### 基本信息
- **接口地址**：`POST /api/auth/logout`
- **是否需要认证**：否

#### 说明
客户端删除本地存储的Token即可，可选调用此接口用于日志记录。

#### 成功响应
```json
{
  "code": 200,
  "message": "退出成功"
}
```

---

## 通用接口说明

### 通用CRUD接口

#### 基本信息
- **接口地址**：`POST /api/batch`
- **Content-Type**：`application/json`
- **是否需要认证**：是，需要携带 `Authorization: Bearer {accessToken}`

#### 通用参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| entity | String | ✅ 必填 | 实体名称（如：`wquser`） |
| action | String | ✅ 必填 | 操作类型：`create`/`query`/`update`/`delete` |

### 1. Create（创建）

#### 参数说明
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| data | Object | ✅ 必填 | 要创建的数据对象 |

#### 请求示例
```json
{
  "entity": "wquser",
  "action": "create",
  "data": {
    "nickname": "李四",
    "avatar": "https://example.com/avatar.jpg",
    "gender": 1
  }
}
```

#### 成功响应
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "_id": "1234567890",
    "nickname": "李四",
    "avatar": "https://example.com/avatar.jpg",
    "gender": 1,
    "createTime": "2024-01-01T00:00:00"
  }
}
```

### 2. Query（查询）

#### 参数说明
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| conditions | Object | 可选 | 查询条件（字段名: 值） |
| pageNum | Integer | 可选 | 页码，默认1 |
| pageSize | Integer | 可选 | 每页数量，默认10 |
| sort | Object | 可选 | 排序，如 `{"createTime": "desc"}` |
| fetch | Array | 可选 | 指定返回字段，如 `["avatar", "nickname"]` |

#### 请求示例

**简单查询（分页）**
```json
{
  "entity": "wquser",
  "action": "query",
  "pageNum": 1,
  "pageSize": 20,
  "sort": {
    "createTime": "desc"
  }
}
```

**条件查询**
```json
{
  "entity": "wquser",
  "action": "query",
  "conditions": {
    "gender": 1
  },
  "pageNum": 1,
  "pageSize": 10
}
```

**指定返回字段**
```json
{
  "entity": "wquser",
  "action": "query",
  "fetch": ["nickname", "avatar"],
  "pageNum": 1,
  "pageSize": 10
}
```

#### 成功响应
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "_id": "1234567890",
        "nickname": "张三",
        "avatar": "https://example.com/avatar.jpg"
      }
    ],
    "total": 100,
    "pageNum": 1,
    "pageSize": 10,
    "pages": 10
  }
}
```

### 3. Update（更新）

#### 参数说明
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | String | ✅ 必填 | 要更新的记录ID |
| data | Object | ✅ 必填 | 要更新的字段和值 |

#### 请求示例
```json
{
  "entity": "wquser",
  "action": "update",
  "id": "1234567890",
  "data": {
    "nickname": "王五",
    "avatar": "https://example.com/new-avatar.jpg"
  }
}
```

#### 成功响应
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "_id": "1234567890",
    "nickname": "王五",
    "avatar": "https://example.com/new-avatar.jpg",
    "updateTime": "2024-01-01T00:00:00"
  }
}
```

### 4. Delete（删除）

#### 参数说明
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | String | ✅ 必填 | 要删除的记录ID |

#### 请求示例
```json
{
  "entity": "wquser",
  "action": "delete",
  "id": "1234567890"
}
```

#### 成功响应
```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 错误处理

### 统一响应格式

#### 成功响应
```json
{
  "code": 200,
  "message": "操作成功",
  "data": { /* 业务数据 */ },
  "timestamp": 1705901400000
}
```

#### 错误响应
```json
{
  "code": 400,
  "message": "错误描述信息",
  "timestamp": 1705901400000
}
```

### 常见错误码

| HTTP状态码 | 说明 | 处理建议 |
|-----------|------|----------|
| 200 | 请求成功 | 正常处理响应数据 |
| 400 | 请求参数错误 | 检查请求参数格式和必填项 |
| 401 | Token无效或已过期 | 使用refreshToken刷新，或跳转登录页 |
| 404 | 接口不存在 | 检查接口地址是否正确 |
| 500 | 服务器内部错误 | 联系后端或稍后重试 |

### Token过期处理流程

```javascript
async function handleRequest(config) {
  try {
    return await axios(config)
  } catch (error) {
    if (error.response?.status === 401) {
      // Token过期，尝试刷新
      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        try {
          // 获取新Token
          const { data } = await axios.post('/api/auth/refresh', { refreshToken })

          // 保存新Token
          saveAccessToken(data.data.accessToken)

          // 重新发起原请求
          config.headers.Authorization = `Bearer ${data.data.accessToken}`
          return await axios(config)

        } catch (refreshError) {
          // RefreshToken也过期了，跳转登录
          clearAllTokens()
          window.location.href = '/login'
          throw new Error('登录已过期，请重新登录')
        }
      }
    }
    throw error
  }
}
```

---

## 完整代码示例

### 微信小程序完整实现

#### 1. 请求封装（utils/request.js）
```javascript
// utils/request.js
const BASE_URL = 'http://localhost:8080'

/**
 * 发起请求
 * @param {Object} options 请求配置
 * @returns {Promise}
 */
function request(options) {
  const accessToken = getApp()?.globalData?.accessToken

  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...(accessToken && !options.url.includes('/auth/login') ? {
          'Authorization': `Bearer ${accessToken}`
        } : {})
      },
      success: (res) => {
        // Token过期处理
        if (res.data && res.data.code === 401) {
          handleTokenExpired()
            .then(() => {
              // 重试原请求
              request(options).then(resolve).catch(reject)
            })
            .catch(() => {
              // 刷新失败，跳转登录
              wx.redirectTo({ url: '/pages/login/login' })
              reject(res)
            })
          return
        }
        resolve(res)
      },
      fail: reject
    })
  })
}

/**
 * 处理Token过期
 * @returns {Promise}
 */
function handleTokenExpired() {
  const refreshToken = wx.getStorageSync('refreshToken')
  if (!refreshToken) {
    return Promise.reject('No refresh token')
  }

  return request({
    url: '/api/auth/refresh',
    method: 'POST',
    data: { refreshToken }
  }).then(res => {
    if (res.data.code === 200) {
      // 更新AccessToken
      getApp().globalData.accessToken = res.data.data.accessToken
    } else {
      throw new Error('Refresh failed')
    }
  })
}

module.exports = { request }
```

#### 2. 登录页面（pages/login/login.js）
```javascript
// pages/login/login.js
const { request } = require('../../utils/request')

Page({
  data: {
    loading: false
  },

  /**
   * 微信一键登录
   */
  onLogin() {
    this.setData({ loading: true })

    // 1. 获取微信登录code
    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          // 2. 直接使用code登录（用户信息可后续更新）
          this.loginToServer(loginRes.code)
        } else {
          wx.showToast({ title: '获取code失败', icon: 'none' })
          this.setData({ loading: false })
        }
      },
      fail: () => {
        wx.showToast({ title: '登录失败', icon: 'none' })
        this.setData({ loading: false })
      }
    })
  },

  /**
   * 调用后端登录接口
   */
  loginToServer(code) {
    wx.request({
      url: 'http://localhost:8080/api/auth/login',
      method: 'POST',
      data: {
        code: code
        // nickname, avatar, gender 可选
      },
      success: (res) => {
        this.setData({ loading: false })

        if (res.data.code === 200) {
          const { accessToken, refreshToken, userId, isNewUser } = res.data.data

          // 保存Token
          getApp().globalData.accessToken = accessToken
          wx.setStorageSync('refreshToken', refreshToken)
          wx.setStorageSync('userId', userId)

          wx.showToast({
            title: isNewUser ? '注册成功' : '登录成功',
            icon: 'success'
          })

          // 跳转到首页
          setTimeout(() => {
            wx.switchTab({ url: '/pages/index/index' })
          }, 1500)
        } else {
          wx.showToast({ title: res.data.message || '登录失败', icon: 'none' })
        }
      },
      fail: () => {
        this.setData({ loading: false })
        wx.showToast({ title: '网络错误', icon: 'none' })
      }
    })
  }
})
```

#### 3. 用户列表页面（pages/users/users.js）
```javascript
// pages/users/users.js
const { request } = require('../../utils/request')

Page({
  data: {
    users: [],
    loading: false,
    pageNum: 1,
    pageSize: 20,
    hasMore: true
  },

  onLoad() {
    this.loadUsers()
  },

  /**
   * 加载用户列表
   */
  loadUsers() {
    if (this.data.loading || !this.data.hasMore) return

    this.setData({ loading: true })

    request({
      url: '/api/batch',
      method: 'POST',
      data: {
        entity: 'wquser',
        action: 'query',
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        sort: { createTime: 'desc' }
      }
    }).then(res => {
      if (res.data.code === 200) {
        const list = res.data.data.list || []
        this.setData({
          users: this.data.pageNum === 1 ? list : [...this.data.users, ...list],
          loading: false,
          hasMore: list.length >= this.data.pageSize,
          pageNum: this.data.pageNum + 1
        })
      }
    }).catch(() => {
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  /**
   * 创建用户
   */
  createUser(userData) {
    return request({
      url: '/api/batch',
      method: 'POST',
      data: {
        entity: 'wquser',
        action: 'create',
        data: userData
      }
    }).then(res => {
      if (res.data.code === 200) {
        wx.showToast({ title: '创建成功', icon: 'success' })
        this.setData({ users: [], pageNum: 1 })
        this.loadUsers()
      }
      return res
    })
  },

  /**
   * 更新用户
   */
  updateUser(userId, userData) {
    return request({
      url: '/api/batch',
      method: 'POST',
      data: {
        entity: 'wquser',
        action: 'update',
        id: userId,
        data: userData
      }
    }).then(res => {
      if (res.data.code === 200) {
        wx.showToast({ title: '更新成功', icon: 'success' })
        // 刷新列表
        this.setData({ users: [], pageNum: 1 })
        this.loadUsers()
      }
      return res
    })
  },

  /**
   * 删除用户
   */
  deleteUser(userId) {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该用户吗？',
      success: (modalRes) => {
        if (modalRes.confirm) {
          request({
            url: '/api/batch',
            method: 'POST',
            data: {
              entity: 'wquser',
              action: 'delete',
              id: userId
            }
          }).then(res => {
            if (res.data.code === 200) {
              wx.showToast({ title: '删除成功', icon: 'success' })
              // 刷新列表
              this.setData({ users: [], pageNum: 1 })
              this.loadUsers()
            }
          })
        }
      }
    })
  },

  /**
   * 上拉加载更多
   */
  onReachBottom() {
    this.loadUsers()
  }
})
```

#### 4. app.js 全局配置
```javascript
// app.js
App({
  globalData: {
    accessToken: null,
    user: null
  },

  onLaunch() {
    this.checkLoginStatus()
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const refreshToken = wx.getStorageSync('refreshToken')
    const userId = wx.getStorageSync('userId')

    if (refreshToken && userId) {
      // 有refreshToken，尝试刷新accessToken
      this.refreshAccessToken()
    }
  },

  /**
   * 刷新AccessToken
   */
  refreshAccessToken() {
    const refreshToken = wx.getStorageSync('refreshToken')

    if (!refreshToken) {
      this.redirectToLogin()
      return
    }

    wx.request({
      url: 'http://localhost:8080/api/auth/refresh',
      method: 'POST',
      data: { refreshToken },
      success: (res) => {
        if (res.data.code === 200) {
          this.globalData.accessToken = res.data.data.accessToken
        } else {
          // 刷新失败，跳转登录
          this.redirectToLogin()
        }
      },
      fail: () => {
        this.redirectToLogin()
      }
    })
  },

  /**
   * 跳转登录页
   */
  redirectToLogin() {
    wx.removeStorageSync('refreshToken')
    wx.removeStorageSync('userId')
    this.globalData.accessToken = null
    wx.redirectTo({ url: '/pages/login/login' })
  }
})
```

### Vue.js + Axios 完整实现

#### 1. Axios配置（api/index.js）
```javascript
// api/index.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000
})

// 请求拦截器：自动添加Token
api.interceptors.request.use(config => {
  const accessToken = sessionStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// 响应拦截器：处理Token过期
api.interceptors.response.use(
  response => response.data,
  async error => {
    const originalRequest = error.config

    // Token过期，尝试刷新
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')

        if (refreshToken) {
          const { data } = await axios.post('http://localhost:8080/api/auth/refresh', {
            refreshToken
          })

          // 保存新Token
          sessionStorage.setItem('accessToken', data.accessToken)

          // 重新发起原请求
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // RefreshToken过期，清除数据并跳转登录
        localStorage.removeItem('refreshToken')
        sessionStorage.removeItem('accessToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
```

#### 2. 登录方法（api/auth.js）
```javascript
// api/auth.js
import api from './index'

/**
 * 微信登录
 */
export function login(code, userInfo = {}) {
  return api.post('/api/auth/login', {
    code,
    ...userInfo
  })
}

/**
 * 刷新Token
 */
export function refreshToken(refreshToken) {
  return api.post('/api/auth/refresh', { refreshToken })
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser() {
  return api.get('/api/auth/user/info')
}

/**
 * 退出登录
 */
export function logout() {
  return api.post('/api/auth/logout')
}
```

#### 3. 通用CRUD方法（api/crud.js）
```javascript
// api/crud.js
import api from './index'

/**
 * 通用查询
 */
export function query(entity, params = {}) {
  return api.post('/api/batch', {
    entity,
    action: 'query',
    ...params
  })
}

/**
 * 通用创建
 */
export function create(entity, data) {
  return api.post('/api/batch', {
    entity,
    action: 'create',
    data
  })
}

/**
 * 通用更新
 */
export function update(entity, id, data) {
  return api.post('/api/batch', {
    entity,
    action: 'update',
    id,
    data
  })
}

/**
 * 通用删除
 */
export function deleteItem(entity, id) {
  return api.post('/api/batch', {
    entity,
    action: 'delete',
    id
  })
}
```

#### 4. Vue组件使用示例（views/Users.vue）
```vue
<template>
  <div>
    <h1>用户管理</h1>

    <!-- 用户列表 -->
    <el-table :data="users" v-loading="loading">
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="avatar" label="头像">
        <template #default="{ row }">
          <el-avatar :src="row.avatar" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="editUser(row)">编辑</el-button>
          <el-button type="danger" @click="deleteUser(row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @current-change="handlePageChange"
      :current-page="pageNum"
      :page-size="pageSize"
      :total="total"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { query, create, update, deleteItem } from '@/api/crud'

const users = ref([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

/**
 * 加载用户列表
 */
const loadUsers = async () => {
  loading.value = true
  try {
    const res = await query('wquser', {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      sort: { createTime: 'desc' }
    })

    users.value = res.data.list || []
    total.value = res.data.total || 0
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

/**
 * 创建用户
 */
const createUser = async (userData) => {
  try {
    await create('wquser', userData)
    ElMessage.success('创建成功')
    loadUsers()
  } catch (error) {
    ElMessage.error('创建失败')
  }
}

/**
 * 编辑用户
 */
const editUser = (user) => {
  // 实现编辑逻辑
}

/**
 * 更新用户
 */
const updateUser = async (id, userData) => {
  try {
    await update('wquser', id, userData)
    ElMessage.success('更新成功')
    loadUsers()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

/**
 * 删除用户
 */
const deleteUser = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '确认删除')
    await deleteItem('wquser', id)
    ElMessage.success('删除成功')
    loadUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 分页变化
 */
const handlePageChange = (page) => {
  pageNum.value = page
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>
```

---

## 注意事项

### 安全建议
1. **HTTPS传输**：生产环境必须使用HTTPS
2. **Token存储**：RefreshToken建议加密存储
3. **Token更新**：每次刷新后及时更新本地Token
4. **错误处理**：妥善处理各类异常情况

### 用户体验优化
1. **静默刷新**：在Token即将过期时提前刷新
2. **重试机制**：网络失败时自动重试
3. **友好提示**：明确的错误提示和引导

### 开发调试
- **API文档地址**：`http://localhost:8080/doc.html` (Knife4j)
- **Swagger UI**：`http://localhost:8080/swagger-ui.html`

### 常见问题

**Q: 为什么AccessToken不持久化存储？**
A: 为了降低XSS攻击风险，AccessToken仅存在内存中，页面关闭自动清除。

**Q: RefreshToken过期了怎么办？**
A: RefreshToken有效期为30天，过期后需要用户重新登录。

**Q: 如何判断Token即将过期？**
A: 可以在本地记录Token的过期时间，每次请求前检查剩余时间。

**Q: 并发请求时Token过期如何处理？**
A: 建议使用刷新锁机制，确保同一时间只有一个刷新请求。
