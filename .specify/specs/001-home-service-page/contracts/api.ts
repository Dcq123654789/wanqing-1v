# API Contracts: 上门服务页面

**Feature**: 上门服务页面
**Date**: 2026-01-18
**Status**: Mock (未来对接真实 API)

## Overview

本文档定义上门服务页面的 API 接口契约。当前版本使用 Mock 数据，未来需要对接后端 API 时参考此文档。

## Base URL

**Current**: Mock data (本地)
**Future**: `https://api.example.com/api/v1` (待定)

## Endpoints

### 1. 获取服务列表

**Endpoint**: `GET /services`

**Description**: 获取所有上门服务列表，支持分类筛选和排序

**Request Parameters**:

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| category | string | No | 服务分类标识 | "cleaning" |
| sort | string | No | 排序方式: "asc", "desc" | "asc" |
| limit | number | No | 返回数量限制 | 20 |
| offset | number | No | 偏移量（分页） | 0 |

**Response** (200 OK):

```typescript
{
  "code": 0,
  "message": "success",
  "data": {
    "services": [
      {
        "id": "service-001",
        "name": "专业家政清洁",
        "poster": "https://cdn.example.com/images/cleaning.jpg",
        "price": 128,
        "sales": 234,
        "category": "cleaning",
        "description": "专业的家庭清洁服务..."
      }
    ],
    "total": 15,
    "hasMore": false
  }
}
```

**Error Responses**:

- 400 Bad Request: 参数错误
- 500 Internal Server Error: 服务器错误

### 2. 获取服务详情

**Endpoint**: `GET /services/{id}`

**Description**: 获取指定服务的详细信息

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | 服务 ID |

**Response** (200 OK):

```typescript
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "service-001",
    "name": "专业家政清洁",
    "poster": "https://cdn.example.com/images/cleaning.jpg",
    "price": 128,
    "sales": 234,
    "category": "cleaning",
    "description": "专业的家庭清洁服务，包含清洁工具...",
    "images": [
      "https://cdn.example.com/images/cleaning-1.jpg",
      "https://cdn.example.com/images/cleaning-2.jpg"
    ],
    "specifications": {
      "服务时长": "2小时",
      "服务人数": "2人",
      "服务区域": "市区范围内"
    },
    "rating": 4.8,
    "reviewCount": 156
  }
}
```

**Error Responses**:

- 404 Not Found: 服务不存在
- 500 Internal Server Error: 服务器错误

### 3. 获取分类列表

**Endpoint**: `GET /services/categories`

**Description**: 获取所有服务分类

**Response** (200 OK):

```typescript
{
  "code": 0,
  "message": "success",
  "data": {
    "categories": [
      {
        "key": "all",
        "name": "全部",
        "icon": "🏠"
      },
      {
        "key": "cleaning",
        "name": "家政清洁",
        "icon": "🧹"
      },
      {
        "key": "repair",
        "name": "维修服务",
        "icon": "🔧"
      },
      {
        "key": "care",
        "name": "护理照护",
        "icon": "💊"
      },
      {
        "key": "life",
        "name": "生活服务",
        "icon": "🛒"
      }
    ]
  }
}
```

## TypeScript Interfaces

```typescript
// 通用响应结构
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 服务列表响应
interface ServiceListResponse {
  services: HomeService[]
  total: number
  hasMore: boolean
}

// 服务详情响应
interface ServiceDetailResponse extends ServiceDetail {}

// 分类列表响应
interface CategoryListResponse {
  categories: ServiceCategory[]
}
```

## Mock Data Implementation

当前版本使用本地 Mock 数据，数据定义在 `mockData.ts`:

```typescript
// 获取服务列表 (模拟 API)
export const getServices = async (
  params?: { category?: string; sort?: 'asc' | 'desc' }
): Promise<ServiceListResponse> => {
  // Mock 实现
  return Promise.resolve({
    services: mockServiceList,
    total: mockServiceList.length,
    hasMore: false
  })
}

// 获取服务详情 (模拟 API)
export const getServiceDetail = async (
  id: string
): Promise<ServiceDetail> => {
  const detail = mockServiceDetailMap[id]
  if (!detail) {
    throw new Error('Service not found')
  }
  return Promise.resolve(detail)
}
```

## Future Integration Notes

当对接真实 API 时需要考虑：

1. **错误处理**: 添加网络错误、超时处理
2. **加载状态**: 显示加载指示器
3. **缓存策略**: 考虑本地缓存服务列表
4. **分页加载**: 如果服务数量很多，实现分页或无限滚动
5. **环境变量**: API Base URL 通过环境变量配置

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 0 | success | 成功 |
| 1001 | Invalid parameter | 参数错误 |
| 1002 | Service not found | 服务不存在 |
| 1003 | Category not found | 分类不存在 |
| 5000 | Internal server error | 服务器内部错误 |
