// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const { phone, code, newPassword } = event

    // 验证参数
    if (!phone || !code || !newPassword) {
      return {
        success: false,
        message: '请填写所有必填字段'
      }
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return {
        success: false,
        message: '手机号格式不正确'
      }
    }

    // 验证新密码长度
    if (newPassword.length < 6) {
      return {
        success: false,
        message: '密码长度不能少于6位'
      }
    }

    // 验证验证码
    // 查询该手机号的验证码记录
    const smsResult = await db.collection('sms_codes').where({
      phone: phone
    }).orderBy('createTime', 'desc').limit(1).get()

    if (smsResult.data.length === 0) {
      return {
        success: false,
        message: '请先获取验证码'
      }
    }

    const smsRecord = smsResult.data[0]
    const now = new Date()

    // 检查验证码是否过期
    if (now > smsRecord.expireTime) {
      return {
        success: false,
        message: '验证码已过期，请重新获取'
      }
    }

    // 检查验证码是否正确（简化版：固定验证码123456）
    if (code !== '123456' && code !== smsRecord.code) {
      return {
        success: false,
        message: '验证码错误'
      }
    }

    // 查找用户
    const userResult = await db.collection('users').where({
      phone: phone
    }).get()

    if (userResult.data.length === 0) {
      return {
        success: false,
        message: '该手机号未注册'
      }
    }

    // 更新密码
    await db.collection('users').doc(userResult.data[0]._id).update({
      data: {
        password: newPassword, // 实际项目中应加密存储
        updateTime: new Date()
      }
    })

    // 删除已使用的验证码
    await db.collection('sms_codes').doc(smsRecord._id).remove()

    return {
      success: true,
      message: '密码重置成功'
    }

  } catch (err) {
    console.error('重置密码失败:', err)
    return {
      success: false,
      message: '重置失败，请稍后重试'
    }
  }
}