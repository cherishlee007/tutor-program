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
    const openid = wxContext.OPENID
    const appid = wxContext.APPID
    const unionid = wxContext.UNIONID

    // 查询用户是否存在
    const userResult = await db.collection('users').where({
      openid: openid
    }).get()

    let user
    if (userResult.data.length > 0) {
      // 用户已存在，返回用户信息
      user = userResult.data[0]
    } else {
      // 用户不存在，创建新用户
      const newUser = {
        openid: openid,
        phone: '',
        password: '',
        nickName: '',
        createTime: new Date()
      }
      
      const addResult = await db.collection('users').add({
        data: newUser
      })
      
      user = {
        _id: addResult._id,
        ...newUser
      }
    }

    return {
      success: true,
      message: '登录成功',
      data: {
        openid: openid,
        appid: appid,
        unionid: unionid,
        userId: user._id,
        phone: user.phone,
        nickName: user.nickName
      }
    }

  } catch (err) {
    console.error('登录失败:', err)
    return {
      success: false,
      message: '登录失败，请稍后重试'
    }
  }
}