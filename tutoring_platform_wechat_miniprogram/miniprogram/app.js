// app.js - 家教中介平台主入口文件
// 微信小程序开发注意点：
// 1. 使用 wx.cloud.init() 初始化云开发环境
// 2. 全局数据通过 globalData 管理
// 3. 避免在 App 中使用 DOM 操作

App({
  onLaunch: function () {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'wx0b5b61304f47796a', // 替换为实际的云开发环境ID
        traceUser: true,
      })
    }
    
    // 检查登录状态
    this.checkLoginStatus()
  },
  
  // 检查用户登录状态
  checkLoginStatus: function() {
    const openid = wx.getStorageSync('openid')
    if (openid) {
      this.globalData.isLoggedIn = true
      this.globalData.openid = openid
    }
  },
  
  // 全局数据
  globalData: {
    isLoggedIn: false,
    openid: '',
    userInfo: null,
    // 校徽映射表（实际项目中应从云存储获取）
    schoolLogos: {
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
  }
})