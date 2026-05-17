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
    const { phone } = event

    // 验证参数
    if (!phone) {
      return {
        success: false,
        message: '请输入手机号'
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

    // 生成6位随机验证码
    const code = String(Math.floor(Math.random() * 900000) + 100000)
    
    // 设置过期时间（5分钟后）
    const expireTime = new Date(Date.now() + 5 * 60 * 1000)

    // 存储验证码到数据库（简化版，实际应使用专门的短信服务）
    // 先删除该手机号的旧验证码
    await db.collection('sms_codes').where({
      phone: phone
    }).remove()

    // 添加新验证码
    await db.collection('sms_codes').add({
      data: {
        phone: phone,
        code: code,
        expireTime: expireTime,
        createTime: new Date()
      }
    })

    // 模拟发送短信（实际项目中应调用腾讯云短信API）
    console.log(`【家教平台】您的验证码是：${code}，5分钟内有效。`)

    // 开发环境下直接返回验证码（方便测试）
    return {
      success: true,
      message: '验证码已发送',
      // 注意：生产环境中不应返回验证码，这里仅用于开发测试
      testCode: code
    }

  } catch (err) {
    console.error('发送验证码失败:', err)
    return {
      success: false,
      message: '发送失败，请稍后重试'
    }
  }
}