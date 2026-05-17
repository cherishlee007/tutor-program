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
    const { phone, code, password } = event

    // 验证参数
    if (!phone || !code || !password) {
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

    // 验证密码长度
    if (password.length < 6) {
      return {
        success: false,
        message: '密码长度不能少于6位'
      }
    }

    // 验证验证码（简化版：固定验证码123456）
    // 实际项目中应从sms_codes集合查询并验证
    if (code !== '123456') {
      return {
        success: false,
        message: '验证码错误'
      }
    }

    // 检查手机号是否已注册
    const existUser = await db.collection('users').where({
      phone: phone
    }).get()

    if (existUser.data.length > 0) {
      return {
        success: false,
        message: '该手机号已注册'
      }
    }

    // 创建新用户
    const openid = wxContext.OPENID
    
    // 检查该openid是否已绑定其他手机号
    const existOpenid = await db.collection('users').where({
      openid: openid
    }).get()

    if (existOpenid.data.length > 0 && existOpenid.data[0].phone) {
      return {
        success: false,
        message: '该微信已绑定其他手机号'
      }
    }

    // 如果openid已存在但无手机号，则更新；否则创建新用户
    let result
    if (existOpenid.data.length > 0) {
      // 更新现有用户
      result = await db.collection('users').doc(existOpenid.data[0]._id).update({
        data: {
          phone: phone,
          password: password, // 实际项目中应加密存储
          updateTime: new Date()
        }
      })
    } else {
      // 创建新用户
      result = await db.collection('users').add({
        data: {
          openid: openid,
          phone: phone,
          password: password, // 实际项目中应加密存储
          nickName: '',
          createTime: new Date()
        }
      })
    }

    return {
      success: true,
      message: '注册成功',
      data: {
        openid: openid,
        phone: phone
      }
    }

  } catch (err) {
    console.error('注册失败:', err)
    return {
      success: false,
      message: '注册失败，请稍后重试'
    }
  }
}