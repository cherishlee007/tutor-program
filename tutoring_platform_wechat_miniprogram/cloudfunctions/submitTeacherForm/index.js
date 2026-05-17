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
      openid,
      name,
      gender,
      wechat,
      qq,
      school,
      hasExperience,
      subjects,
      grades,
      availableTime,
      minSalary,
      maxSalary,
      highlight,
      resumePDF
    } = event

    // 验证必填字段
    if (!name || !gender || !wechat || !qq || !school || 
        !subjects || subjects.length === 0 || 
        !grades || grades.length === 0 || 
        !availableTime || !minSalary || !maxSalary || 
        !highlight || !resumePDF) {
      return {
        success: false,
        message: '请填写所有必填字段'
      }
    }

    // 生成唯一的teacherId（从100001开始递增）
    const counterRes = await db.collection('counters').doc('teacherId').get().catch(() => null)
    
    let teacherId
    if (counterRes && counterRes.data) {
      // 更新计数器
      await db.collection('counters').doc('teacherId').update({
        data: {
          count: _.inc(1)
        }
      })
      teacherId = counterRes.data.count + 1
    } else {
      // 初始化计数器
      await db.collection('counters').add({
        data: {
          _id: 'teacherId',
          count: 100001
        }
      })
      teacherId = 100001
    }

    // 校徽映射表（实际使用时需要上传校徽图片到云存储并获取fileID）
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

    const schoolLogoUrl = schoolLogoMap[school] || schoolLogoMap['已毕业社会人士']

    // 插入数据到teachers集合
    const result = await db.collection('teachers').add({
      data: {
        openid: openid,
        teacherId: teacherId,
        name: name,
        gender: gender,
        wechat: wechat,
        qq: qq,
        school: school,
        hasExperience: hasExperience,
        subjects: subjects,
        grades: grades,
        availableTime: availableTime,
        minSalary: Number(minSalary),
        maxSalary: Number(maxSalary),
        highlight: highlight,
        resumePDF: resumePDF,
        status: '接单中',
        createTime: new Date(),
        schoolLogoUrl: schoolLogoUrl
      }
    })

    return {
      success: true,
      message: '提交成功',
      teacherId: teacherId,
      data: result
    }

  } catch (err) {
    console.error('提交表单失败:', err)
    return {
      success: false,
      message: '提交失败，请稍后重试'
    }
  }
}