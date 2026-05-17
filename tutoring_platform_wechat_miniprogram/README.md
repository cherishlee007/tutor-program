# 家教中介平台微信小程序

## 项目概述

这是一个连接家长（找家教）与教员（接单学生/社会人士）的家教中介平台微信小程序。

### 技术栈
- 微信小程序原生框架（WXML + WXSS + JS）
- 微信云开发（云函数、云数据库、云存储）

### 主要功能

#### 家长端
1. **首页**：提供家长端和家教端入口
2. **教员列表**：瀑布流展示教员卡片，支持筛选（性别、院校、时间、时薪、经验）
3. **教员详情**：查看教员完整信息，支持PDF简历预览，点击咨询显示客服二维码

#### 家教端
1. **登录注册**：支持手机号密码登录、微信一键登录、短信验证码注册
2. **填写接单信息**：完整的表单提交，包括个人信息、教学科目、时薪、PDF简历上传
3. **我的订单**：查看和管理自己的接单记录，支持暂停接单

## 项目结构

```
tutoring_platform_wechat_4862/
├── miniprogram/                    # 小程序前端代码
│   ├── pages/                      # 页面目录
│   │   ├── index/                  # 首页
│   │   ├── parent-home/            # 家长端主页
│   │   ├── parent-detail/          # 家教详情页
│   │   ├── teacher-login/          # 家教端登录页
│   │   ├── teacher-register/       # 家教端注册页
│   │   ├── teacher-home/           # 家教端主页（Tab页）
│   │   ├── teacher-form/           # 填写接单信息表单
│   │   ├── teacher-orders/         # 我的订单
│   │   └── customer-service/       # 客服咨询
│   ├── images/                     # 图片资源
│   ├── app.js                      # 小程序逻辑
│   ├── app.json                    # 小程序配置
│   └── app.wxss                    # 全局样式
├── cloudfunctions/                 # 云函数目录
│   ├── login/                      # 微信一键登录
│   ├── register/                   # 用户注册
│   ├── sendSms/                    # 发送验证码
│   ├── resetPassword/              # 重置密码
│   ├── getTeacherList/             # 获取教员列表（支持筛选）
│   ├── getTeacherDetail/           # 获取教员详情
│   ├── submitTeacherForm/          # 提交教员表单
│   ├── updateStatus/               # 更新接单状态
│   └── getMyOrders/                # 获取我的订单
├── project.config.json             # 项目配置
└── README.md                       # 项目说明
```

## 快速开始

### 1. 环境准备
- 下载并安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 注册微信小程序账号，获取AppID

### 2. 配置云开发环境
1. 在微信开发者工具中打开项目
2. 点击"云开发"按钮，开通云开发服务
3. 创建云环境，记录环境ID
4. 在 `miniprogram/app.js` 中替换云环境ID：
   ```javascript
   wx.cloud.init({
     env: 'your-env-id' // 替换为你的云环境ID
   })
   ```

### 3. 上传云函数
在微信开发者工具中，右键点击 `cloudfunctions` 目录下的每个云函数文件夹，选择"上传并部署：云端安装依赖"

### 4. 创建数据库集合
在云开发控制台中创建以下集合：
- `teachers` - 教员接单表
- `users` - 用户表
- `sms_codes` - 验证码临时存储
- `counters` - 计数器（用于生成唯一teacherId）

### 5. 创建数据库索引
建议在以下字段上创建索引以提升查询性能：
- `teachers` 集合：status, school, minSalary, hasExperience, teacherId, openid
- `users` 集合：openid, phone
- `sms_codes` 集合：phone, expireTime

### 6. 上传图片资源
将校徽图片和客服二维码图片上传到云存储，并更新云函数中的fileID映射。

### 7. 运行项目
在微信开发者工具中点击"编译"即可预览小程序。

## 数据库设计

### teachers（教员接单表）
| 字段 | 类型 | 说明 |
|------|------|------|
| _id | String | 自动生成的文档ID |
| openid | String | 用户唯一标识 |
| teacherId | Number | 教员唯一数字编码（从100001开始） |
| name | String | 姓名 |
| gender | String | 性别（男/女） |
| wechat | String | 微信号 |
| qq | String | QQ号 |
| school | String | 就读院校 |
| hasExperience | String | 是否有家教经验（是/否） |
| subjects | Array | 教学科目数组 |
| grades | Array | 教学年级数组 |
| availableTime | String | 方便的时间 |
| minSalary | Number | 最小时薪 |
| maxSalary | Number | 最大时薪 |
| highlight | String | 教员亮点 |
| resumePDF | String | 简历PDF的云存储fileID |
| status | String | 状态（接单中/已接单） |
| createTime | Date | 创建时间 |
| schoolLogoUrl | String | 校徽图片URL |

### users（用户表）
| 字段 | 类型 | 说明 |
|------|------|------|
| _id | String | 自动生成的文档ID |
| openid | String | 微信openid |
| phone | String | 手机号 |
| password | String | 密码（实际应加密存储） |
| nickName | String | 昵称 |
| createTime | Date | 创建时间 |

### sms_codes（验证码表）
| 字段 | 类型 | 说明 |
|------|------|------|
| _id | String | 自动生成的文档ID |
| phone | String | 手机号 |
| code | String | 验证码 |
| expireTime | Date | 过期时间 |
| createTime | Date | 创建时间 |

### counters（计数器表）
| 字段 | 类型 | 说明 |
|------|------|------|
| _id | String | 计数器名称（如'teacherId'） |
| count | Number | 当前计数值 |

## 云函数说明

### login
处理微信一键登录，获取openid，查询或创建用户。

### register
手机号 + 验证码 + 密码注册新用户。

### sendSms
发送手机验证码（开发环境返回测试码，生产环境需接入腾讯云短信）。

### resetPassword
通过手机号 + 验证码重置密码。

### getTeacherList
获取教员列表，支持多种筛选条件（关键词、性别、院校、时间、时薪、经验）。

### getTeacherDetail
根据teacherId获取教员完整信息。

### submitTeacherForm
接收表单数据和PDF fileID，生成唯一teacherId，写入teachers集合。

### updateStatus
修改指定teacherId的status字段。

### getMyOrders
根据openid获取当前用户的所有接单记录。

## 微信小程序开发注意点

### 1. 标签系统差异
- **禁止使用HTML标签**：不能使用 `<div>`, `<p>`, `<span>` 等HTML标签
- **必须使用WXML标签**：使用 `<view>`, `<text>`, `<image>`, `<button>` 等微信小程序专用标签
- 示例：
  ```xml
  <!-- 错误 -->
  <div class="container">
    <p>Hello World</p>
  </div>
  
  <!-- 正确 -->
  <view class="container">
    <text>Hello World</text>
  </view>
  ```

### 2. 数据更新机制
- **无DOM操作**：不能使用 `document.getElementById()` 或 `window` 对象
- **使用setData更新界面**：所有界面更新必须通过 `this.setData()` 方法
- 示例：
  ```javascript
  // 错误
  document.getElementById('name').innerText = '张三'
  
  // 正确
  this.setData({
    name: '张三'
  })
  ```

### 3. 事件绑定
- **使用bindtap/catchtap**：不能使用 `onclick` 属性
- bindtap允许事件冒泡，catchtap阻止事件冒泡
- 示例：
  ```xml
  <!-- 错误 -->
  <button onclick="handleClick">点击</button>
  
  <!-- 正确 -->
  <button bindtap="handleClick">点击</button>
  ```

### 4. 样式单位
- **优先使用rpx**：rpx是响应式像素，会根据屏幕宽度自动适配
- 避免使用px，除非有特殊需求
- 示例：
  ```css
  /* 推荐 */
  .container {
    padding: 20rpx;
    font-size: 28rpx;
  }
  
  /* 不推荐 */
  .container {
    padding: 10px;
    font-size: 14px;
  }
  ```

### 5. 网络请求
- **调用云函数**：使用 `wx.cloud.callFunction()`
- **云存储上传**：使用 `wx.cloud.uploadFile()`
- **云存储下载**：使用 `wx.cloud.downloadFile()`
- 示例：
  ```javascript
  // 调用云函数
  wx.cloud.callFunction({
    name: 'login',
    data: {},
    success: (res) => {
      console.log(res.result)
    }
  })
  
  // 上传文件到云存储
  wx.cloud.uploadFile({
    cloudPath: 'resume/test.pdf',
    filePath: tempFilePath,
    success: (res) => {
      console.log(res.fileID)
    }
  })
  ```

### 6. 页面跳转
- **使用微信API**：不能使用 `<a>` 标签
- `wx.navigateTo`：保留当前页，跳转到新页面
- `wx.redirectTo`：关闭当前页，跳转到新页面
- `wx.switchTab`：跳转到TabBar页面
- `wx.reLaunch`：关闭所有页面，跳转到新页面
- 示例：
  ```javascript
  // 错误
  <a href="/pages/detail/detail">详情</a>
  
  // 正确
  wx.navigateTo({
    url: '/pages/detail/detail'
  })
  ```

### 7. PDF预览
- **两步操作**：先下载到临时文件，再打开文档
- 使用 `wx.downloadFile()` + `wx.openDocument()`
- 示例：
  ```javascript
  wx.cloud.downloadFile({
    fileID: 'cloud://xxx/resume.pdf',
    success: (res) => {
      wx.openDocument({
        filePath: res.tempFilePath,
        fileType: 'pdf',
        success: () => {
          console.log('打开成功')
        }
      })
    }
  })
  ```

### 8. 二维码长按识别
- **设置show-menu-by-longpress属性**：直接在 `<image>` 组件上设置
- 示例：
  ```xml
  <image 
    src="/images/qr.png" 
    show-menu-by-longpress="{{true}}"
  />
  ```

### 9. 瀑布流布局
- **使用CSS column-count或flex布局**：不使用复杂的第三方库
- 两列布局示例：
  ```css
  .waterfall {
    column-count: 2;
    column-gap: 20rpx;
  }
  
  .card {
    break-inside: avoid;
    margin-bottom: 20rpx;
  }
  ```

### 10. 筛选功能
- **云函数中动态构建查询条件**：使用 `db.command` 进行复合查询
- 数组字段查询使用 `_.in()`
- 示例：
  ```javascript
  const _ = db.command
  
  // 多值筛选
  whereCondition.school = _.in(['清华大学', '北京大学'])
  
  // 范围筛选
  whereCondition.minSalary = _.gte(100)
  whereCondition.maxSalary = _.lte(200)
  ```

## 注意事项

1. **云环境ID替换**：项目中所有 `test-xxxx` 需要替换为实际的云环境ID
2. **图片资源上传**：校徽图片和客服二维码需要上传到云存储并更新fileID
3. **密码安全**：当前代码中密码明文存储，生产环境应使用加密算法（如bcrypt）
4. **短信服务**：当前使用固定验证码123456，生产环境需接入腾讯云短信服务
5. **权限配置**：在云开发控制台配置数据库权限，确保数据安全
6. **性能优化**：大量数据时使用分页加载，避免一次性加载过多数据

## 常见问题

### Q: 云函数调用失败？
A: 检查云函数是否已上传部署，云环境ID是否正确配置。

### Q: 数据库查询返回空？
A: 检查数据库权限配置，确保有读取权限。

### Q: 图片无法显示？
A: 检查云存储fileID是否正确，图片是否已上传。

### Q: 真机调试正常，预览失败？
A: 检查是否使用了未授权的API，或域名配置是否正确。

## 后续优化建议

1. 接入真实的短信验证码服务（腾讯云SMS）
2. 实现密码加密存储（使用bcrypt等算法）
3. 添加图片压缩功能，减少上传流量
4. 实现消息通知功能（模板消息）
5. 添加数据统计和分析功能
6. 优化搜索算法，支持模糊匹配和拼音搜索
7. 增加评价系统，家长可以对教员进行评价
8. 实现在线聊天功能，方便家长和教员沟通

## 联系方式

如有问题，请联系开发团队。

---

**版本**: 1.0.0  
**更新日期**: 2026-05-16