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
    const { openid } = event

    // 验证参数
    if (!openid) {
      return {
        success: false,
        message: '缺少openid参数'
      }
    }

    // 查询该用户的所有接单记录，按创建时间倒序排列
    const result = await db.collection('teachers')
      .where({
        openid: openid
      })
      .orderBy('createTime', 'desc')
      .get()

    return {
      success: true,
      message: '查询成功',
      data: result.data,
      total: result.data.length
    }

  } catch (err) {
    console.error('查询订单失败:', err)
    return {
      success: false,
      message: '查询失败，请稍后重试'
    }
  }
}