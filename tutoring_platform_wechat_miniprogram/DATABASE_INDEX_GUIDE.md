# 数据库索引配置指南

## 概述

本文档提供了家教中介平台微信小程序云数据库的索引配置建议，以提升查询性能和降低读取成本。

## 索引配置说明

在微信云开发控制台中，为以下集合和字段创建索引：

---

## 1. teachers 集合（教员接单表）

### 单字段索引

| 字段 | 索引类型 | 说明 | 使用场景 |
|------|----------|------|----------|
| teacherId | 升序 | 唯一标识教员 | 根据ID查询详情 |
| openid | 升序 | 用户唯一标识 | 查询用户的订单 |
| status | 升序 | 接单状态 | 筛选接单中/已接单 |
| school | 升序 | 就读院校 | 按院校筛选 |
| hasExperience | 升序 | 是否有经验 | 按经验筛选 |
| minSalary | 升序 | 最小时薪 | 按时薪范围筛选 |
| maxSalary | 升序 | 最大时薪 | 按时薪范围筛选 |
| createTime | 降序 | 创建时间 | 按时间排序 |

### 复合索引

| 字段组合 | 索引类型 | 说明 | 使用场景 |
|----------|----------|------|----------|
| status + createTime | status升序, createTime降序 | 状态+时间排序 | 查询某状态的最新记录 |
| school + status | school升序, status升序 | 院校+状态 | 按院校和状态筛选 |
| openid + createTime | openid升序, createTime降序 | 用户+时间 | 查询用户订单并排序 |

### 创建步骤

1. 登录[微信云开发控制台](https://console.cloud.tencent.com/tcb)
2. 选择对应的云环境
3. 进入"数据库" -> "teachers"集合
4. 点击"索引管理"
5. 点击"添加索引"
6. 选择字段和排序方式
7. 保存

---

## 2. users 集合（用户表）

### 单字段索引

| 字段 | 索引类型 | 说明 | 使用场景 |
|------|----------|------|----------|
| openid | 升序 | 微信openid | 根据openid查询用户 |
| phone | 升序 | 手机号 | 根据手机号查询/验证 |
| createTime | 降序 | 创建时间 | 按注册时间排序 |

### 复合索引

| 字段组合 | 索引类型 | 说明 | 使用场景 |
|----------|----------|------|----------|
| openid + phone | openid升序, phone升序 | 联合查询 | 验证openid和手机号绑定 |

---

## 3. sms_codes 集合（验证码表）

### 单字段索引

| 字段 | 索引类型 | 说明 | 使用场景 |
|------|----------|------|----------|
| phone | 升序 | 手机号 | 查询该手机号的验证码 |
| expireTime | 升序 | 过期时间 | 清理过期验证码 |
| createTime | 降序 | 创建时间 | 获取最新验证码 |

### 复合索引

| 字段组合 | 索引类型 | 说明 | 使用场景 |
|----------|----------|------|----------|
| phone + expireTime | phone升序, expireTime升序 | 手机号+过期时间 | 验证验证码是否过期 |

### 数据清理建议

建议定期清理过期的验证码记录，以节省存储空间：

```javascript
// 云函数：清理过期验证码
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async () => {
  const now = new Date()
  
  // 删除已过期的验证码
  const result = await db.collection('sms_codes')
    .where({
      expireTime: db.command.lt(now)
    })
    .remove()
  
  return {
    success: true,
    deletedCount: result.stats.removed
  }
}
```

可以设置定时触发器，每天凌晨执行一次清理。

---

## 4. counters 集合（计数器表）

### 单字段索引

| 字段 | 索引类型 | 说明 | 使用场景 |
|------|----------|------|----------|
| _id | 升序 | 默认主键索引 | 根据计数器名称查询 |

此集合数据量小，无需额外索引。

---

## 索引最佳实践

### 1. 索引选择原则

- **高频查询字段**：经常被用于where条件的字段
- **排序字段**：经常被用于orderBy的字段
- **关联查询字段**：用于多表关联的字段

### 2. 避免过度索引

- 每个集合的索引数量不宜过多（建议不超过10个）
- 索引会占用存储空间
- 写入操作会变慢（需要更新索引）

### 3. 监控索引效果

- 在云开发控制台查看"慢查询日志"
- 分析哪些查询耗时较长
- 针对性地添加或优化索引

### 4. 索引命名规范

- 单字段索引：`idx_字段名`
- 复合索引：`idx_字段1_字段2`
- 例如：`idx_teacherId`, `idx_status_createTime`

---

## 性能优化建议

### 1. 查询优化

```javascript
// ✅ 好的做法：使用索引字段
db.collection('teachers')
  .where({
    status: '接单中',
    school: '清华大学'
  })
  .orderBy('createTime', 'desc')
  .get()

// ❌ 不好的做法：使用非索引字段
db.collection('teachers')
  .where({
    highlight: db.RegExp({ regexp: '优秀' })
  })
  .get()
```

### 2. 限制返回数量

```javascript
// 只获取需要的字段
db.collection('teachers')
  .field({
    teacherId: true,
    name: true,
    status: true
  })
  .limit(20)
  .get()
```

### 3. 分页加载

```javascript
// 第一页
db.collection('teachers')
  .skip(0)
  .limit(20)
  .get()

// 第二页
db.collection('teachers')
  .skip(20)
  .limit(20)
  .get()
```

---

## 索引检查清单

在部署前，请确认以下索引已创建：

- [ ] teachers.teacherId（升序）
- [ ] teachers.openid（升序）
- [ ] teachers.status（升序）
- [ ] teachers.school（升序）
- [ ] teachers.createTime（降序）
- [ ] teachers.status + createTime（复合索引）
- [ ] users.openid（升序）
- [ ] users.phone（升序）
- [ ] sms_codes.phone（升序）
- [ ] sms_codes.expireTime（升序）

---

## 常见问题

### Q: 如何查看当前索引？
A: 在云开发控制台 -> 数据库 -> 选择集合 -> 索引管理

### Q: 索引创建需要多久？
A: 通常在几秒到几分钟内完成，取决于数据量

### Q: 索引会影响写入性能吗？
A: 会有一定影响，但对于读多写少的场景，收益远大于成本

### Q: 可以删除索引吗？
A: 可以，在索引管理中点击删除即可

---

**文档版本**: 1.0.0  
**更新日期**: 2026-05-16