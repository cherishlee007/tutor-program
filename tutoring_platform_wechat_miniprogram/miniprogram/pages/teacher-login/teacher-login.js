// pages/teacher-login/teacher-login.js - 家教端登录页逻辑
// 微信小程序开发注意点：
// 1. 微信登录使用 wx.login 获取 code，然后调用云函数
// 2. 表单验证需要在前端进行基本校验
// 3. 登录成功后保存用户信息到全局数据和本地存储

Page({
  data: {
    phone: '',
    password: ''
  },

  onLoad: function (options) {
    // 检查是否已登录
    const app = getApp()
    if (app.globalData.isLoggedIn) {
      wx.switchTab({
        url: '/pages/teacher-home/teacher-home'
      })
    }
  },

  // 手机号输入
  onPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 密码输入
  onPasswordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 处理登录
  handleLogin: function() {
    const { phone, password } = this.data
    
    // 基本验证
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return
    }
    
    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }
    
    wx.showLoading({
      title: '登录中...'
    })
    
    // 调用登录云函数（这里使用手机号+密码登录）
    // 注意：实际项目中应该使用专门的登录云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {
        phone: phone,
        password: password,
        loginType: 'password'
      }
    }).then(res => {
      wx.hideLoading()
      
      if (res.result && res.result.success) {
        // 保存用户信息
        const app = getApp()
        app.globalData.isLoggedIn = true
        app.globalData.openid = res.result.openid
        app.globalData.userInfo = res.result.userInfo
        
        wx.setStorageSync('openid', res.result.openid)
        wx.setStorageSync('userInfo', res.result.userInfo)
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/teacher-home/teacher-home'
          })
        }, 1500)
      } else {
        wx.showToast({
          title: res.result.message || '登录失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('登录失败', err)
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
  },

  // 微信一键登录
  handleWechatLogin: function() {
    wx.showLoading({
      title: '登录中...'
    })
    
    wx.login({
      success: res => {
        if (res.code) {
          // 调用云函数进行微信登录
          wx.cloud.callFunction({
            name: 'login',
            data: {
              code: res.code,
              loginType: 'wechat'
            }
          }).then(result => {
            wx.hideLoading()
            
            if (result.result && result.result.success) {
              // 保存用户信息
              const app = getApp()
              app.globalData.isLoggedIn = true
              app.globalData.openid = result.result.openid
              app.globalData.userInfo = result.result.userInfo
              
              wx.setStorageSync('openid', result.result.openid)
              wx.setStorageSync('userInfo', result.result.userInfo)
              
              wx.showToast({
                title: '登录成功',
                icon: 'success'
              })
              
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/teacher-home/teacher-home'
                })
              }, 1500)
            } else {
              wx.showToast({
                title: result.result.message || '登录失败',
                icon: 'none'
              })
            }
          }).catch(error => {
            wx.hideLoading()
            console.error('微信登录失败', error)
            wx.showToast({
              title: '网络错误',
              icon: 'none'
            })
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        console.error('wx.login 失败', err)
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    })
  },

  // 跳转到注册页
  goToRegister: function() {
    wx.navigateTo({
      url: '/pages/teacher-register/teacher-register'
    })
  },

  // 跳转到重置密码页
  goToResetPassword: function() {
    wx.navigateTo({
      url: '/pages/teacher-reset-password/teacher-reset-password'
    })
  }
})