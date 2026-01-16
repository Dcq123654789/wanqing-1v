# 乐享页面资源清单

---

## 图片需求列表

### 1. 顶部头图背景（1张）
- **位置**：页面顶部
- **尺寸**：750 x 360 px（宽高比约 2:1）
- **风格**：风景、旅游、老年人活动场景
- **关键词**：elderly travel, happy seniors, active lifestyle
- **建议场景**：老年人在旅游景点、户外活动的欢乐场景

---

### 2. 旅游线路封面图（3张）

#### 2.1 海南三亚 5 日游
- **尺寸**：750 x 420 px（16:9）
- **内容**：海滩、椰树、蓝色海景
- **关键词**：sanya beach, tropical, hainan island
- **色调**：蓝色、暖色调

#### 2.2 北京周边游
- **尺寸**：750 x 420 px
- **内容**：长城、故宫、颐和园等景点
- **关键词**：great wall, forbidden city, beijing
- **色调**：红色、灰色、历史感

#### 2.3 江南水乡游
- **尺寸**：750 x 420 px
- **内容**：水乡、古镇、小桥流水
- **关键词**：water town, zhouzhuang, wuzhen
- **色调**：青色、白色、宁静

---

### 3. 兴趣活动封面图（3张）

#### 3.1 太极拳晨练
- **尺寸**：750 x 420 px
- **内容**：老年人在公园打太极
- **关键词**：elderly tai chi, morning exercise, seniors
- **色调**：绿色、自然、活力

#### 3.2 书法艺术交流
- **尺寸**：750 x 420 px
- **内容**：老年人写书法、毛笔字
- **关键词**：calligraphy, chinese art, elderly writing
- **色调**：墨色、红色、文雅

#### 3.3 广场舞活动
- **尺寸**：750 x 420 px
- **内容**：老年人跳广场舞
- **关键词**：square dance, group dance, happy seniors
- **色调**：多彩、欢乐

---

### 4. 社交聚会封面图（3张）

#### 4.1 周末茶话会
- **尺寸**：750 x 420 px
- **内容**：老年人围坐喝茶聊天
- **关键词**：tea party, seniors gathering, social
- **色调**：暖色、温馨

#### 4.2 生日派对
- **尺寸**：750 x 420 px
- **内容**：老年人生日庆祝
- **关键词**：birthday party, elderly celebration
- **色调**：粉色、喜庆

#### 4.3 棋牌娱乐
- **尺寸**：750 x 420 px
- **内容**：下棋、打牌等娱乐活动
- **关键词**：chess, card game, mahjong, seniors
- **色调**：自然、休闲

---

### 5. 线上活动封面图（3张）

#### 5.1 健康养生讲座
- **尺寸**：750 x 420 px
- **内容**：医生讲解健康知识、在线直播
- **关键词**：health lecture, online course, doctor
- **色调**：白色、蓝色、专业

#### 5.2 书法直播课
- **尺寸**：750 x 420 px
- **内容**：线上书法教学
- **关键词**：online calligraphy, virtual class
- **色调**：墨色、雅致

#### 5.3 歌唱交流活动
- **尺寸**：750 x 420 px
- **内容**：线上合唱、K歌活动
- **关键词**：singing, karaoke, online music
- **色调**：多彩、欢乐

---

## 文件命名规范

```
src/assets/images/joy/
├── header-bg.jpg              # 顶部头图背景
├── travel/
│   ├── sanya.jpg              # 海南三亚
│   ├── beijing.jpg            # 北京周边
│   └── jiangnan.jpg           # 江南水乡
├── activity/
│   ├── taichi.jpg             # 太极拳
│   ├── calligraphy.jpg        # 书法
│   └── dance.jpg              # 广场舞
├── social/
│   ├── tea-party.jpg          # 茶话会
│   ├── birthday.jpg           # 生日会
│   └── chess.jpg              # 棋牌
└── online/
    ├── health-lecture.jpg     # 健康讲座
    ├── calligraphy-class.jpg  # 书法课
    └── singing.jpg            # 歌唱活动
```

---

## 图片下载建议

### 推荐网站
1. **Unsplash**（免费，高质量）
   - https://unsplash.com
2. **Pexels**（免费，中文搜索）
   - https://www.pexels.com/zh-cn/
3. **Pixabay**（免费，大量资源）
   - https://pixabay.com/zh/

### 搜索关键词（英文）
- elderly travel
- senior citizens activities
- happy seniors
- tai chi
- calligraphy
- tea party
- birthday elderly
- online learning

### 图片要求
- **格式**：JPG 或 PNG
- **尺寸**：建议宽度 750px 或以上
- **文件大小**：每张图片 < 500KB（优化加载速度）
- **版权**：使用免费商用图片

---

## 临时占位方案

如果暂时无法下载图片，可以使用以下方案：

### 方案 1：纯色占位
```typescript
image: require('@/assets/images/joy/placeholder-travel.png')
```

### 方案 2：使用 Unsplash 源地址（开发阶段）
```typescript
image: 'https://images.unsplash.com/photo-xxx'
```

### 方案 3：使用渐变色块
```scss
.placeholder {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}
```

---

**创建日期**：2025-01-15
**适用页面**：乐享页面
