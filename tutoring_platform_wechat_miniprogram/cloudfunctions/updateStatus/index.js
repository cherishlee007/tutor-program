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
    const { teacherId, status } = event

    // 验证参数
    if (!teacherId || !status) {
      return {
        success: false,
        message: '缺少必要参数'
      }
    }

    // 验证状态值
    if (status !== '接单中' && status !== '已接单') {
      return {
        success: false,
        message: '无效的状态值'
      }
    }

    // 查询记录是否存在
    const queryResult = await db.collection('teachers').where({
      teacherId: teacherId
    }).get()

    if (queryResult.data.length === 0) {
      return {
        success: false,
        message: '未找到对应的家教记录'
      }
    }

    // 更新状态
    const updateResult = await db.collection('teachers').where({
      teacherId: teacherId
    }).update({
      data: {
        status: status,
        updateTime: new Date()
      }
    })

    return {
      success: true,
      message: '状态更新成功',
      data: updateResult
    }

  } catch (err) {
    console.error('更新状态失败:', err)
    return {
      success: false,
      message: '更新失败，请稍后重试'
    }
  }
}