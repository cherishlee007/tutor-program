# 图片资源说明文档

## 概述

本文档说明了家教中介平台微信小程序所需的图片资源及其规格要求。

## TabBar图标

### 位置
`miniprogram/images/` 目录

### 所需图标

| 文件名 | 用途 | 尺寸 | 说明 |
|--------|------|------|------|
| tab-form.png | "我要接单"未选中图标 | 81px × 81px | 灰色或浅色 |
| tab-form-active.png | "我要接单"选中图标 | 81px × 81px | 主色调（#667eea） |
| tab-orders.png | "我的"未选中图标 | 81px × 81px | 灰色或浅色 |
| tab-orders-active.png | "我的"选中图标 | 81px × 81px | 主色调（#667eea） |

### 图标设计建议

**tab-form（表单图标）**
- 建议使用编辑、填写或文档类图标
- 可以使用铅笔、表格或表单的简化图形

**tab-orders（订单图标）**
- 建议使用列表、用户或个人中心类图标
- 可以使用用户头像、列表或个人的简化图形

### 图标获取方式

1. **使用IconFont**
   - 访问 [阿里巴巴矢量图标库](https://www.iconfont.cn/)
   - 搜索相关图标
   - 下载PNG格式，调整为81×81px

2. **使用在线工具生成**
   - 访问 [App Icon Generator](https://appicon.co/)
   - 上传SVG或PNG图标
   - 生成所需尺寸

3. **自行设计**
   - 使用Figma、Sketch等设计工具
   - 导出为PNG格式
   - 确保背景透明

## 校徽图片

### 位置
云存储：`cloud://test-xxxx/school-logos/`

### 所需校徽

| 学校名称 | 文件名 | 建议尺寸 |
|----------|--------|----------|
| 南方科技大学 | sustech.png | 200px × 200px |
| 深圳大学 | szu.png | 200px × 200px |
| 深职大 | szpt.png | 200px × 200px |
| 深信大 | szti.png | 200px × 200px |
| 哈工深 | hitsz.png | 200px × 200px |
| 清华大学 | tsinghua.png | 200px × 200px |
| 北京大学 | pku.png | 200px × 200px |
| 港中文 | cuhk.png | 200px × 200px |
| 深理工 | sms.png | 200px × 200px |
| 中山大学深圳校区 | sysu-sz.png | 200px × 200px |
| 默认图标 | default.png | 200px × 200px |

### 上传步骤

1. 登录微信云开发控制台
2. 进入"云存储"
3. 创建文件夹 `school-logos`
4. 上传所有校徽图片
5. 复制每个文件的fileID
6. 更新云函数中的映射表

### 校徽获取方式

1. **学校官网**
   - 访问各学校官方网站
   - 通常在"关于我们"或"品牌标识"页面
   - 下载官方校徽

2. **维基百科**
   - 搜索学校名称
   - 下载校徽图片
   - 注意版权许可

3. **搜索引擎**
   - 搜索"学校名称 + 校徽"
   - 选择高清图片
   - 注意版权问题

## 客服二维码

### 位置
`miniprogram/images/customer-service-qr.png`

### 规格要求

- **尺寸**：500px × 500px（或更大）
- **格式**：PNG
- **内容**：企业微信或个人微信二维码
- **清晰度**：确保二维码可被识别

### 生成步骤

1. **企业微信**
   - 登录企业微信管理后台
   - 进入"我的企业" -> "二维码"
   - 下载二维码图片

2. **个人微信**
   - 打开微信 -> 我 -> 个人信息
   - 点击"我的二维码"
   - 截图或保存图片

3. **优化处理**
   - 使用图片编辑工具调整尺寸
   - 确保二维码清晰可识别
   - 可以添加边框或背景色提升美观度

## 首页背景插画

### 位置
`miniprogram/images/home-bg.png`（可选）

### 规格要求

- **尺寸**：750px × 1334px（适配iPhone 6/7/8）
- **格式**：PNG或JPG
- **风格**：教育相关、清新简约
- **透明度**：建议半透明或浅色，不影响按钮可读性

### 插画获取方式

1. **免费素材网站**
   - [Unsplash](https://unsplash.com/) - 高质量免费图片
   - [Pexels](https://www.pexels.com/) - 免费商用图片
   - [Freepik](https://www.freepik.com/) - 免费矢量图和插画

2. **AI生成**
   - 使用Midjourney、DALL-E等AI工具
   - 提示词示例："education illustration, clean style, light blue and green, minimal design"

3. **自行设计**
   - 使用Figma、Illustrator等工具
   - 设计符合品牌风格的插画

## 图片优化建议

### 1. 压缩图片
- 使用 [TinyPNG](https://tinypng.com/) 压缩PNG图片
- 使用 [Squoosh](https://squoosh.app/) 进行在线压缩
- 目标：在保证质量的前提下减小文件大小

### 2. 格式选择
- **PNG**：适合图标、logo、需要透明背景的图片
- **JPG**：适合照片、插画等不需要透明的图片
- **WebP**：如果目标用户微信版本支持，可使用WebP获得更小的文件

### 3. 尺寸适配
- TabBar图标：81×81px（微信官方推荐）
- 校徽：200×200px（足够清晰且不会太大）
- 二维码：至少500×500px（确保可识别）
- 背景图：根据实际使用场景确定

### 4. 命名规范
- 使用小写字母和连字符
- 避免中文和特殊字符
- 示例：`tab-form.png`, `customer-service-qr.png`

## 占位图方案

在正式图片准备好之前，可以使用以下占位方案：

### 1. 纯色背景
```css
.placeholder {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
  height: 100%;
}
```

### 2. Emoji图标
```xml
<text class="placeholder-icon">📚</text>
```

### 3. 在线占位图服务
```
https://via.placeholder.com/200x200?text=Logo
```

注意：生产环境应使用本地图片，避免依赖外部服务。

## 检查清单

在发布前，请确认以下图片已准备：

- [ ] tab-form.png
- [ ] tab-form-active.png
- [ ] tab-orders.png
- [ ] tab-orders-active.png
- [ ] customer-service-qr.png
- [ ] 所有校徽图片已上传到云存储
- [ ] 云函数中的校徽fileID已更新
- [ ] 所有图片经过压缩优化
- [ ] 图片命名符合规范

---

**文档版本**: 1.0.0  
**更新日期**: 2026-05-16