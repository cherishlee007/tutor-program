# 微信小程序开发核心注意点清单

> 本文档总结了微信小程序开发与普通HTML5网页开发的关键区别，帮助开发者避免常见误区。

## 一、标签系统差异（最重要）

### ❌ 错误做法
```html
<!-- HTML5写法 - 在小程序中无效 -->
<div class="container">
  <p>欢迎使用家教平台</p>
  <span class="highlight">热门教员</span>
  <a href="/pages/detail/detail">查看详情</a>
</div>
```

### ✅ 正确做法
```xml
<!-- WXML写法 - 小程序专用 -->
<view class="container">
  <text>欢迎使用家教平台</text>
  <text class="highlight">热门教员</text>
  <navigator url="/pages/detail/detail">查看详情</navigator>
</view>
```

### 常用标签对照表
| HTML5标签 | WXML标签 | 说明 |
|-----------|----------|------|
| `<div>` | `<view>` | 容器视图 |
| `<p>` | `<text>` | 文本内容 |
| `<span>` | `<text>` | 行内文本 |
| `<img>` | `<image>` | 图片 |
| `<input>` | `<input>` | 输入框（用法略有不同） |
| `<button>` | `<button>` | 按钮 |
| `<a>` | `<navigator>` | 页面跳转 |
| `<form>` | `<form>` | 表单 |
| `<textarea>` | `<textarea>` | 多行文本输入 |

---

## 二、数据更新机制

### ❌ 错误做法
```javascript
// DOM操作 - 小程序中不存在document和window对象
document.getElementById('username').innerText = '张三'
this.name = '李四' // 直接赋值不会触发界面更新
```

### ✅ 正确做法
```javascript
// 使用setData更新数据并触发界面渲染
this.setData({
  username: '张三',
  userInfo: {
    name: '李四',
    age: 25
  }
})

// 更新数组中的某一项
const items = this.data.items
items[0].checked = true
this.setData({
  items: items
})
```

### 注意事项
1. **setData是异步的**：不要立即读取刚设置的值
2. **避免频繁调用**：合并多次更新为一次setData调用
3. **不要传递大量数据**：单次setData数据量建议不超过1MB

---

## 三、事件绑定

### ❌ 错误做法
```xml
<!-- onclick在小程序中无效 -->
<button onclick="handleClick">点击</button>
<div onmouseover="handleHover">悬停</div>
```

### ✅ 正确做法
```xml
<!-- 使用bindtap或catchtap -->
<button bindtap="handleClick">点击</button>

<!-- catchtap阻止事件冒泡 -->
<view catchtap="handleParent">
  <button bindtap="handleChild">子元素点击</button>
</view>

<!-- 传递参数 -->
<view bindtap="handleItem" data-id="{{item.id}}" data-name="{{item.name}}">
  {{item.title}}
</view>
```

```javascript
// 接收参数
handleItem(e) {
  const id = e.currentTarget.dataset.id
  const name = e.currentTarget.dataset.name
  console.log(id, name)
}
```

### 常用事件类型
- `bindtap` / `catchtap`：点击事件
- `bindinput`：输入框输入事件
- `bindchange`：选择器改变事件
- `bindsubmit`：表单提交事件
- `bindtouchstart` / `bindtouchend`：触摸事件

---

## 四、样式单位

### ❌ 不推荐做法
```css
/* 使用px - 无法适配不同屏幕 */
.container {
  padding: 10px;
  font-size: 14px;
  width: 300px;
}
```

### ✅ 推荐做法
```css
/* 使用rpx - 响应式像素，自动适配屏幕 */
.container {
  padding: 20rpx;
  font-size: 28rpx;
  width: 600rpx;
}

/* 设计稿750px宽时，1rpx = 1px */
/* iPhone 6/7/8: 750rpx = 375px */
/* iPhone X: 750rpx = 375px */
```

### 单位换算
- **rpx**：responsive pixel，响应式像素
- 基准：屏幕宽度固定为750rpx
- 例如：设计稿上100px的元素，写成100rpx

---

## 五、网络请求与云开发

### ❌ 错误做法
```javascript
// 使用axios或fetch - 小程序不支持
import axios from 'axios'
axios.get('/api/users')

// 使用localStorage - 小程序中使用wx.setStorageSync
localStorage.setItem('token', 'xxx')
```

### ✅ 正确做法
```javascript
// 调用云函数
wx.cloud.callFunction({
  name: 'getTeacherList',
  data: {
    gender: '男',
    schools: ['清华大学', '北京大学']
  },
  success: (res) => {
    console.log(res.result)
  },
  fail: (err) => {
    console.error(err)
  }
})

// 本地存储
wx.setStorageSync('token', 'xxx')
const token = wx.getStorageSync('token')

// 上传文件到云存储
wx.chooseMessageFile({
  count: 1,
  type: 'file',
  success: (res) => {
    wx.cloud.uploadFile({
      cloudPath: `resume/${Date.now()}.pdf`,
      filePath: res.tempFiles[0].path,
      success: (uploadRes) => {
        console.log(uploadRes.fileID)
      }
    })
  }
})
```

---

## 六、页面跳转

### ❌ 错误做法
```xml
<!-- a标签在小程序中无效 -->
<a href="/pages/detail/detail?id=123">查看详情</a>
```

### ✅ 正确做法
```javascript
// 保留当前页，跳转到新页面（可返回）
wx.navigateTo({
  url: '/pages/detail/detail?id=123'
})

// 关闭当前页，跳转到新页面（不可返回）
wx.redirectTo({
  url: '/pages/home/home'
})

// 跳转到TabBar页面
wx.switchTab({
  url: '/pages/teacher-home/teacher-home'
})

// 关闭所有页面，跳转到新页面
wx.reLaunch({
  url: '/pages/index/index'
})

// 返回上一页
wx.navigateBack({
  delta: 1
})
```

---

## 七、PDF预览

### 实现步骤
```javascript
// 1. 从云存储下载文件
wx.cloud.downloadFile({
  fileID: 'cloud://test-xxxx/resume/123.pdf',
  success: (res) => {
    // 2. 打开文档
    wx.openDocument({
      filePath: res.tempFilePath,
      fileType: 'pdf', // 指定文件类型
      showMenu: true,  // 显示右上角菜单
      success: () => {
        console.log('打开成功')
      },
      fail: (err) => {
        console.error('打开失败', err)
      }
    })
  },
  fail: (err) => {
    console.error('下载失败', err)
  }
})
```

### 注意事项
1. 必须先下载到临时文件路径
2. 支持的文件类型：doc, xls, ppt, pdf, docx, xlsx, pptx
3. iOS和Android表现可能略有差异

---

## 八、二维码长按识别

### ✅ 正确做法
```xml
<!-- 设置show-menu-by-longpress属性 -->
<image 
  src="/images/customer-service-qr.png" 
  mode="aspectFit"
  show-menu-by-longpress="{{true}}"
/>
```

### 注意事项
1. 仅支持jpg、png格式图片
2. 用户长按后会弹出识别选项
3. 不需要额外编写识别逻辑

---

## 九、瀑布流布局

### 方案一：CSS column-count
```css
.waterfall {
  column-count: 2;
  column-gap: 20rpx;
}

.card {
  break-inside: avoid; /* 防止卡片被分割 */
  margin-bottom: 20rpx;
  background: white;
  border-radius: 16rpx;
}
```

### 方案二：Flex两列布局
```xml
<view class="waterfall">
  <view class="column">
    <view wx:for="{{leftCards}}" wx:key="id" class="card">
      <!-- 卡片内容 -->
    </view>
  </view>
  <view class="column">
    <view wx:for="{{rightCards}}" wx:key="id" class="card">
      <!-- 卡片内容 -->
    </view>
  </view>
</view>
```

```css
.waterfall {
  display: flex;
  gap: 20rpx;
}

.column {
  flex: 1;
}

.card {
  margin-bottom: 20rpx;
  background: white;
  border-radius: 16rpx;
}
```

---

## 十、筛选功能实现

### 云函数中动态构建查询条件
```javascript
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event) => {
  const { gender, schools, minSalary, maxSalary } = event
  
  // 构建查询条件
  let whereCondition = {}
  
  // 单值筛选
  if (gender) {
    whereCondition.gender = gender
  }
  
  // 多值筛选（数组）
  if (schools && schools.length > 0) {
    whereCondition.school = _.in(schools)
  }
  
  // 范围筛选
  if (minSalary) {
    whereCondition.minSalary = _.gte(minSalary)
  }
  if (maxSalary) {
    whereCondition.maxSalary = _.lte(maxSalary)
  }
  
  // 模糊搜索
  if (keyword) {
    whereCondition.name = db.RegExp({
      regexp: keyword,
      options: 'i' // 不区分大小写
    })
  }
  
  // 执行查询
  const result = await db.collection('teachers')
    .where(whereCondition)
    .orderBy('createTime', 'desc')
    .get()
  
  return {
    success: true,
    data: result.data
  }
}
```

---

## 十一、表单验证

### 前端验证
```javascript
// 在提交前进行验证
submitForm() {
  const { formData } = this.data
  
  // 必填项验证
  if (!formData.name) {
    wx.showToast({ title: '请输入姓名', icon: 'none' })
    return
  }
  
  // 格式验证
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(formData.phone)) {
    wx.showToast({ title: '手机号格式不正确', icon: 'none' })
    return
  }
  
  // 长度验证
  if (formData.password.length < 6) {
    wx.showToast({ title: '密码长度不能少于6位', icon: 'none' })
    return
  }
  
  // 调用云函数提交
  wx.cloud.callFunction({
    name: 'submitTeacherForm',
    data: formData,
    success: (res) => {
      if (res.result.success) {
        wx.showToast({ title: '提交成功', icon: 'success' })
      }
    }
  })
}
```

### 云函数二次验证
```javascript
// 云函数中也要进行验证（防止绕过前端）
exports.main = async (event) => {
  const { name, phone, password } = event
  
  // 验证必填字段
  if (!name || !phone || !password) {
    return { success: false, message: '请填写所有必填字段' }
  }
  
  // 验证手机号格式
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(phone)) {
    return { success: false, message: '手机号格式不正确' }
  }
  
  // 继续处理...
}
```

---

## 十二、状态管理

### 通过云数据库字段控制状态
```javascript
// 更新状态
wx.cloud.callFunction({
  name: 'updateStatus',
  data: {
    teacherId: 100001,
    status: '已接单'
  },
  success: (res) => {
    if (res.result.success) {
      // 重新查询列表以获取最新状态
      this.loadTeacherList()
    }
  }
})

// 家长端重新查询列表
loadTeacherList() {
  wx.cloud.callFunction({
    name: 'getTeacherList',
    data: {},
    success: (res) => {
      this.setData({
        teachers: res.result.data
      })
    }
  })
}
```

---

## 十三、UI设计规范

### 清新现代化风格
```css
/* 主色调：浅绿/淡蓝渐变 */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 圆角卡片 */
.card {
  background: white;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

/* 柔和阴影 */
.shadow {
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

/* 按钮样式 */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12rpx;
  padding: 24rpx;
  font-size: 32rpx;
}

/* 状态标签 */
.status-badge {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.status-available {
  background: #e6f7ff;
  color: #1890ff;
}

.status-taken {
  background: #fff1f0;
  color: #ff4d4f;
}
```

---

## 十四、常见错误及解决方案

### 错误1：页面空白
**原因**：JS语法错误或setData失败  
**解决**：检查控制台报错，确保setData参数正确

### 错误2：云函数调用超时
**原因**：云函数执行时间过长  
**解决**：优化代码逻辑，减少数据库查询次数

### 错误3：图片不显示
**原因**：fileID错误或权限问题  
**解决**：检查云存储文件是否存在，确认访问权限

### 错误4：样式不生效
**原因**：使用了HTML标签或px单位  
**解决**：改用WXML标签和rpx单位

### 错误5：事件不触发
**原因**：使用了onclick而非bindtap  
**解决**：改用bindtap或catchtap

---

## 十五、性能优化建议

1. **减少setData调用次数**：合并多次更新
2. **避免setData大数据**：单次不超过1MB
3. **图片优化**：压缩图片，使用webp格式
4. **懒加载**：长列表使用分页加载
5. **云函数优化**：减少数据库查询，使用索引
6. **缓存策略**：合理使用本地存储

---

## 十六、调试技巧

### 1. 控制台调试
```javascript
console.log('数据:', this.data)
console.error('错误:', err)
```

### 2. 真机调试
- 微信开发者工具 -> 真机调试
- 可以查看真机上的日志和网络请求

### 3. 云函数日志
- 云开发控制台 -> 云函数 -> 日志
- 查看云函数执行日志和错误信息

### 4. 数据库查询测试
- 云开发控制台 -> 数据库
- 可以直接执行查询语句测试

---

## 总结

微信小程序开发与HTML5开发的核心区别：

1. **标签系统**：WXML vs HTML
2. **数据更新**：setData vs DOM操作
3. **事件绑定**：bindtap vs onclick
4. **样式单位**：rpx vs px
5. **网络请求**：wx.cloud.callFunction vs fetch/axios
6. **页面跳转**：wx.navigateTo vs a标签
7. **存储方式**：wx.setStorageSync vs localStorage

掌握这些核心区别，就能快速上手微信小程序开发！

---

**文档版本**: 1.0.0  
**更新日期**: 2026-05-16  
**适用框架**: 微信小程序原生框架