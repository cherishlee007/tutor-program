// pages/parent-detail/parent-detail.js - 家教详情页逻辑
// 微信小程序开发注意点：
// 1. PDF预览使用 wx.downloadFile + wx.openDocument
// 2. 页面参数通过 onLoad 的 options 获取
// 3. 弹窗显示通过数据控制

Page({
  data: {
    teacherId: '',
    teacherInfo: {},
    showModal: false,
    loading: true
  },

  onLoad: function (options) {
    // 获取页面参数
    const teacherId = options.teacherId
    if (teacherId) {
      this.setData({ teacherId: teacherId })
      this.loadTeacherDetail(teacherId)
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  // 加载教员详情
  loadTeacherDetail: function(teacherId) {
    this.setData({ loading: true })
    
    wx.cloud.callFunction({
      name: 'getTeacherDetail',
      data: {
        teacherId: parseInt(teacherId)
      }
    }).then(res => {
      if (res.result && res.result.data) {
        this.setData({
          teacherInfo: res.result.data,
          loading: false
        })
      } else {
        wx.showToast({
          title: '未找到该教员',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    }).catch(err => {
      console.error('获取教员详情失败', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
      this.setData({ loading: false })
    })
  },

  // 查看PDF简历
  viewResume: function() {
    if (!this.data.teacherInfo.resumePDF) {
      wx.showToast({
        title: '暂无简历',
        icon: 'none'
      })
      return
    }
    
    wx.showLoading({
      title: '加载中...'
    })
    
    // 下载PDF文件
    wx.cloud.downloadFile({
      fileID: this.data.teacherInfo.resumePDF,
      success: res => {
        // 打开PDF文档
        wx.openDocument({
          filePath: res.tempFilePath,
          fileType: 'pdf',
          success: () => {
            wx.hideLoading()
          },
          fail: err => {
            console.error('打开PDF失败', err)
            wx.hideLoading()
            wx.showToast({
              title: '打开失败',
              icon: 'none'
            })
          }
        })
      },
      fail: err => {
        console.error('下载PDF失败', err)
        wx.hideLoading()
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        })
      }
    })
  },

  // 显示咨询弹窗
  showConsultModal: function() {
    this.setData({
      showModal: true
    })
  },

  // 隐藏咨询弹窗
  hideConsultModal: function() {
    this.setData({
      showModal: false
    })
  },

  onReady: function () {
    // 页面渲染完成
  },

  onShow: function () {
    // 页面显示
  },

  onHide: function () {
    // 页面隐藏
  },

  onUnload: function () {
    // 页面卸载
  }
})