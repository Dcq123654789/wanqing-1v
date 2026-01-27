# 文件上传接口文档

## 接口信息

- **接口路径**: `/api/upload`
- **请求方法**: `POST`
- **Content-Type**: `multipart/form-data`
- **接口描述**: 上传文件到阿里云OSS，支持图片、文档、文本和压缩包

## 请求参数

### Headers

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Content-Type | String | 是 | 固定值: `multipart/form-data` |

### Body (form-data)

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | File | 是 | 要上传的文件 |

## 文件限制

### 支持的文件类型

- **图片**: jpg, jpeg, png, gif, bmp, webp
- **文档**: pdf, doc, docx, xls, xlsx, ppt, pptx
- **文本**: txt, md, csv
- **压缩包**: zip, rar, 7z

### 文件大小限制

- 最大文件大小: **10MB**

## 响应格式

### 成功响应

**状态码**: 200

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "url": "https://your-bucket.oss-cn-hangzhou.aliyuncs.com/uploads/2026-01-26/abc123def456.jpg",
    "fileName": "example.jpg",
    "size": 102400
  },
  "timestamp": 1705901400000
}
```

### 响应字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 响应状态码，200表示成功 |
| message | String | 响应消息 |
| data | Object | 文件信息 |
| data.url | String | 文件访问URL |
| data.fileName | String | 原始文件名 |
| data.size | Long | 文件大小（字节） |
| timestamp | Long | 响应时间戳 |

### 错误响应

**状态码**: 200

```json
{
  "code": 500,
  "message": "文件不能为空",
  "data": null,
  "timestamp": 1705901400000
}
```

### 常见错误信息

| 错误信息 | 说明 |
|----------|------|
| 文件不能为空 | 未上传文件或文件为空 |
| 文件大小超过限制（最大10MB） | 文件大小超过10MB |
| 文件名格式不正确 | 文件名没有扩展名 |
| 不支持的文件类型: xxx | 上传的文件类型不在允许列表中 |
| 文件上传失败: xxx | OSS上传失败 |

## 使用示例

### cURL

```bash
curl -X POST http://localhost:8080/api/upload \
  -F "file=@/path/to/your/file.jpg"
```

### JavaScript (Fetch)

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:8080/api/upload', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => {
    if (data.code === 200) {
      console.log('文件URL:', data.data.url);
    } else {
      console.error('上传失败:', data.message);
    }
  });
```

### JavaScript (Axios)

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

axios.post('http://localhost:8080/api/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
  .then(response => {
    const { data } = response.data;
    console.log('文件URL:', data.url);
  })
  .catch(error => {
    console.error('上传失败:', error);
  });
```

### Java (OkHttp)

```java
OkHttpClient client = new OkHttpClient();

RequestBody requestBody = new MultipartBody.Builder()
    .setType(MultipartBody.FORM)
    .addFormDataPart("file", "file.jpg",
        RequestBody.create(MediaType.parse("multipart/form-data"),
            new File("path/to/file.jpg")))
    .build();

Request request = new Request.Builder()
    .url("http://localhost:8080/api/upload")
    .post(requestBody)
    .build();

Response response = client.newCall(request).execute();
```

## 文件存储规则

- 文件会按照日期自动分类存储: `uploads/YYYY-MM-DD/`
- 文件名会自动转换为UUID，避免文件名冲突
- 完整路径示例: `uploads/2026-01-26/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.jpg`

## 注意事项

1. 确保上传文件大小不超过10MB
2. 检查文件类型是否在支持列表中
3. 建议在前端也做文件类型和大小验证
4. 文件URL有效期取决于OSS配置
5. 上传成功后请妥善保存返回的文件URL

## Swagger文档

启动项目后访问: `http://localhost:8080/swagger-ui.html`
