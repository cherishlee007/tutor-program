// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const {
      keyword,        // 关键词搜索（ID、姓名、学校）
      gender,         // 性别筛选
      schools,        // 院校数组筛选
      availableTime,  // 时间关键词
      minSalaryRange, // 时薪范围：<100, 100-200, >200
      hasExperience   // 是否有经验：是/否
    } = event

    // 构建查询条件
    let whereCondition = {}

    // 关键词搜索
    if (keyword) {
      // 尝试将关键词转换为数字（teacherId）
      const keywordNum = Number(keyword)
      
      whereCondition = _.or([
        {
          teacherId: _.eq(isNaN(keywordNum) ? -1 : keywordNum)
        },
        {
          name: db.RegExp({
            regexp: keyword,
            options: 'i'
          })
        },
        {
          school: db.RegExp({
            regexp: keyword,
            options: 'i'
          })
        }
      ])
    }

    // 性别筛选
    if (gender) {
      whereCondition.gender = gender
    }

    // 院校筛选（多选）
    if (schools && schools.length > 0) {
      whereCondition.school = _.in(schools)
    }

    // 时间关键词匹配
    if (availableTime) {
      whereCondition.availableTime = db.RegExp({
        regexp: availableTime,
        options: 'i'
      })
    }

    // 时薪范围筛选
    if (minSalaryRange) {
      switch (minSalaryRange) {
        case '<100':
          whereCondition.maxSalary = _.lt(100)
          break
        case '100-200':
          whereCondition.minSalary = _.gte(100)
          whereCondition.maxSalary = _.lte(200)
          break
        case '>200':
          whereCondition.minSalary = _.gt(200)
          break
      }
    }

    // 家教经验筛选
    if (hasExperience) {
      whereCondition.hasExperience = hasExperience
    }

    // 执行查询，按创建时间倒序
    const result = await db.collection('teachers')
      .where(whereCondition)
      .orderBy('createTime', 'desc')
      .limit(100) // 限制返回数量
      .get()

    // 处理数据，只返回必要字段
    const teachers = result.data.map(item => ({
      _id: item._id,
      teacherId: item.teacherId,
      name: item.name,
      school: item.school,
      subjects: item.subjects,
      grades: item.grades,
      availableTime: item.availableTime,
      minSalary: item.minSalary,
      maxSalary: item.maxSalary,
      status: item.status,
      schoolLogoUrl: item.schoolLogoUrl,
      createTime: item.createTime
    }))

    return {
      success: true,
      message: '查询成功',
      data: teachers,
      total: teachers.length
    }

  } catch (err) {
    console.error('查询教员列表失败:', err)
    return {
      success: false,
      message: '查询失败，请稍后重试'
    }
  }
}