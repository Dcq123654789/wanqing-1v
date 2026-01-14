# 晚晴养老服务小程序 - 项目治理原则

## 项目概述

**晚晴**是一个面向中老年用户的养老服务小程序，提供旅游、敬老院、康复、疗养等业务展示和入口。

---

## 核心设计原则

### 1. 中老年用户优先 ⭐

**字体设计**
- 基础字号：16px（小程序默认较小，需放大）
- 重要信息：18-20px
- 标题：20-24px
- 避免使用小字体（< 14px）

**交互设计**
- 按钮足够大（最小 44x44px，推荐 60x60px 以上）
- 点击区域宽松，避免误触
- 操作步骤简单，不超过 3 步
- 避免复杂手势（滑动、长按等）

**视觉设计**
- 高对比度配色，避免灰暗
- 重要信息用醒目颜色（橙色/红色）
- 图标配文字，不单独用图标
- 减少动画效果，避免眩晕

### 2. 页面设计要丰富多彩 🎨

**色彩设计**
- ✅ 使用渐变色、暖色调营造温馨氛围
- ✅ 不同页面使用不同主题色
  - 首页：橙黄色渐变（温暖、活力）
  - 乐享：绿色渐变（健康、自然）
  - 颐养：蓝色渐变（专业、信任）
  - 个人：紫色渐变（尊贵、品质）
- ✅ 使用卡片阴影、圆角、边框等增加层次感
- ❌ 避免大面积纯白背景
- ❌ 避免单调的平面设计

**内容丰富**
- 使用插图、图标点缀页面
- 添加装饰性元素（圆点、波浪线、几何图形）
- 使用表情符号（emoji）增加亲和力
- 背景添加纹理或图案

**细节点缀**
- 卡片悬停效果
- 按钮渐变背景
- 图标外圈装饰
- 标签、徽章元素
- 底部装饰线

### 3. 参考优秀设计 💡

**参考来源**
- 其他养老服务小程序
- 旅游类 App（携程、去哪儿）
- 健康类 App（Keep、薄荷健康）
- 电商小程序（有赞、微店）

**学习重点**
- 色彩搭配方案
- 卡片设计风格
- 交互动画效果
- 信息层级展示

### 4. 功能简洁直观
- 页面结构清晰，一眼看懂
- 避免隐藏菜单和复杂导航
- 关键功能突出显示
- 文字描述通俗易懂，不用专业术语

### 5. 性能稳定可靠
- 页面加载快速，网络慢也要能显示基本内容
- 图片懒加载和压缩
- 异常情况有明确提示
- 避免白屏和卡顿

---

## 技术栈规范

### 当前技术栈
- **框架**：Taro 4.0.9 + React 18
- **语言**：TypeScript 5.2
- **状态管理**：Zustand 4.4
- **样式**：SCSS
- **平台**：微信小程序（优先）+ H5

### 推荐扩展
- **网络请求**：暂用虚拟数据，后续接入真实 API
- **图片处理**：Taro Image 组件 + 懒加载
- **日期处理**：dayjs（如需要）
- **表单验证**：简单验证用原生，复杂场景考虑库
- **图标方案**：emoji + iconfont + SVG

### 不推荐
- ❌ 不引入大型 UI 库（NutUI、Taro UI），避免包过大
- ❌ 不使用复杂的状态管理方案
- ❌ 不引入不必要的第三方库

---

## 页面主题色方案

### 首页 - 橙黄渐变（温暖活力）
```scss
$home-primary: #ff9800;
$home-secondary: #ff5722;
$home-gradient: linear-gradient(135deg, #ff9800 0%, #ff5722 100%);
$home-bg: #fff8e1;
```

### 乐享 - 绿色渐变（健康自然）
```scss
$joy-primary: #52c41a;
$joy-secondary: #73d13d;
$joy-gradient: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
$joy-bg: #f6ffed;
```

### 颐养 - 蓝色渐变（专业信任）
```scss
$care-primary: #1890ff;
$care-secondary: #40a9ff;
$care-gradient: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
$care-bg: #e6f7ff;
```

### 个人中心 - 紫色渐变（尊贵品质）
```scss
$profile-primary: #722ed1;
$profile-secondary: #9254de;
$profile-gradient: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
$profile-bg: #f9f0ff;
```

---

## 开发流程（更新版）

### 完整开发流程

#### 第 1 步：确定页面内容需求
- 列出页面要展示的所有内容
- 明确信息优先级
- 确定用户操作流程

#### 第 2 步：确定使用技术
- 选择合适的组件
- 确定数据结构
- 规划状态管理

#### 第 3 步：准备设计资源
- 下载/准备图标（iconfont、emoji）
- 下载/准备插图（illustrations）
- 准备背景图、装饰图
- 确定配色方案

**资源获取渠道**：
- iconfont.cn（图标）
- undraw.co（插图）
- storyset.com（插图）
- freepik.com（素材）

#### 第 4 步：开始开发
- 搭建页面框架
- 实现核心功能
- 添加样式和细节
- 优化交互效果

#### 第 5 步：自测验证
- 功能完整性测试
- 用户体验测试
- 性能测试
- 兼容性测试

---

## 页面设计规范

### 卡片设计标准
```scss
.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);

  // 装饰元素
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4rpx;
    background: linear-gradient(90deg, #ff9800, #ff5722);
    border-radius: 16rpx 16rpx 0 0;
  }
}
```

### 按钮设计标准
```scss
.button {
  background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%);
  color: #fff;
  border-radius: 48rpx;
  padding: 24rpx 48rpx;
  box-shadow: 0 8rpx 16rpx rgba(255, 152, 0, 0.3);

  &:active {
    transform: scale(0.95);
    box-shadow: 0 4rpx 8rpx rgba(255, 152, 0, 0.2);
  }
}
```

### 背景装饰示例
```scss
.page-bg {
  background: linear-gradient(180deg, #ff9800 0%, #ffffff 30%);

  // 添加装饰性圆点
  &::after {
    content: '';
    position: absolute;
    top: 100rpx;
    right: -50rpx;
    width: 200rpx;
    height: 200rpx;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    border-radius: 50%;
  }
}
```

---

## 目录结构规范

```
src/
├── pages/                  # 页面
│   ├── login/             # 登录页
│   ├── home/              # 首页
│   ├── joy/               # 乐享
│   ├── care/              # 颐养
│   └── profile/           # 个人中心
│       └── components/    # 页面私有组件
├── components/            # 公共组件
│   ├── NavigationBar/
│   ├── BusinessCard/
│   └── PosterSwiper/
├── store/                 # 状态管理
│   └── userStore.ts
├── services/              # API 服务
│   └── mockData.ts        # Mock 数据
├── utils/                 # 工具函数
├── constants/             # 常量
├── types/                 # TypeScript 类型
├── assets/                # 静态资源
│   ├── images/
│   │   ├── backgrounds/   # 背景图
│   │   ├── icons/         # 图标
│   │   ├── illustrations/ # 插图
│   │   └── decorations/   # 装饰元素 ⭐ 新增
│   └── styles/
│       ├── variables.scss
│       └── mixins.scss
├── app.tsx
├── app.config.ts
└── app.scss
```

---

## 质量标准

### 代码质量
- [ ] TypeScript 类型完整，无 any
- [ ] 组件 Props 有明确类型定义
- [ ] 符合 ESLint 规范
- [ ] 关键业务逻辑有注释
- [ ] 组件不超过 300 行

### 用户体验（新增）
- [ ] 字号适合中老年人（≥ 28rpx）
- [ ] 按钮足够大（≥ 88rpx）
- [ ] 页面色彩丰富、有层次感
- [ ] 有装饰性元素点缀
- [ ] 卡片有阴影、圆角效果
- [ ] 交互有反馈动画

### 性能
- [ ] 首屏加载 < 2 秒
- [ ] 图片懒加载
- [ ] 无明显卡顿
- [ ] 包大小合理（主包 < 1.5MB）

---

## 设计资源推荐

### 图标资源
- iconfont.cn（阿里巴巴图标库）
- flaticon.com
- icons8.com

### 插图资源
- undraw.co（免费插图）
- storyset.com（故事插图）
- freepik.com（免费素材）
- drawkit.com（插画包）

### 配色灵感
- coolors.co（配色方案生成）
- adobe.com/color（配色工具）
- gradienthunt.co（渐变色库）

### 参考案例
- 携程小程序
- 去哪儿小程序
- Keep 小程序
- 有赞小程序

---

## 特殊注意事项

### 中老年用户适配
1. **字号**：所有文字 ≥ 28rpx（14px）
2. **间距**：留白充足，避免拥挤
3. **颜色**：对比度高，避免浅色
4. **反馈**：每次操作都有明确反馈
5. **容错**：误操作可撤销或二次确认

### 微信小程序限制
- 包大小：主包 < 2MB，总包 < 20MB
- 使用分包加载（如需要）
- 图片资源优化（压缩、webp）
- 避免 canvas 性能问题

---

**最后更新**：2026-01-14
**版本**：2.0.0
**适用项目**：晚晴养老服务小程序
**更新内容**：增加页面色彩和设计规范，更新开发流程
