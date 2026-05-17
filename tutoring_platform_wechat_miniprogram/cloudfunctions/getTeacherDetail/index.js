// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 校徽映射表
const schoolLogoMap = {
  '南方科技大学': 'cloud://cloud1-1gag4ck977a850c8.636c-cloud1-1gag4ck977a850c8-1387694307/school-logos/default.png',
  '深圳大学': 'cloud://cloud1-1gag4ck977a850c8.636c-cloud1-1gag4ck977a850c8-1387694307/school-logos/szu.png',
  '深职大': 'cloud://cloud1-1gag4ck977a850c8.636c-cloud1-1gag4ck977a850c8-1387694307/school-logos/szpt.png',
  '深信大': 'cloud://cloud1-1gag4ck977a850c8.636c-cloud1-1gag4ck977a850c8-1387694307/school-logos/szti.png',
  '哈工深': 'cloud://cloud1-1gag4ck977a850c8.636c-cloud1-1gag4ck977a850c8-1387694307/school-logos/hitsz.png',
  '清华大学': 'cloud://cloud1-1gag4ck977a850c8.636c-cloud1-1gag4ck977a850c8-1387694307/school-logos/tsinghua.png',
  '北京大学': 'cloud://cloud1-1gag4ck977a850c8.636c-cloud1-1gag4ck977a850c8-1387694307/school-logos/pku.png',
  '港中文': 'cloud://cloud1-1gag4ck977a850c8.636c-cloud1-1gag4ck977a850c8-1387694307/school-logos/cuhk.png',
  '深理工': 'cloud://cloud1-1gag4ck977a850c8.636c-cloud1-1gag4ck977a850c8-1387694307/school-logos/sms.png',
  '中山大学深圳校区': 'cloud://cloud1-1gag4ck977a850c8.636c-cloud1-1gag4ck977a850c8-1387694307/school-logos/sysu-sz.png',
  '已毕业社会人士': 'cloud://cloud1-1gag4ck977a850c8.636c-cloud1-1gag4ck977a850c8-1387694307/school-logos/default.png'
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const { teacherId } = event

    // 验证参数
    if (!teacherId) {
      return {
        success: false,
        message: '缺少teacherId参数'
      }
    }

    // 查询教员详细信息
    const result = await db.collection('teachers')
      .where({
        teacherId: Number(teacherId)
      })
      .get()

    if (result.data.length === 0) {
      return {
        success: false,
        message: '未找到该教员信息'
      }
    }

    const teacher = result.data[0]

    // 确保有校徽URL
    const schoolLogoUrl = teacher.schoolLogoUrl || schoolLogoMap[teacher.school] || schoolLogoMap['已毕业社会人士']

    return {
      success: true,
      message: '查询成功',
      data: {
        ...teacher,
        schoolLogoUrl: schoolLogoUrl
      }
    }

  } catch (err) {
    console.error('查询教员详情失败:', err)
    return {
      success: false,
      message: '查询失败，请稍后重试'
    }
  }
}