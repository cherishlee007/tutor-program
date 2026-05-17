// pages/teacher-register/teacher-register.js - 家教端注册页逻辑

Page({
  data: {
    phone: '',
    code: '',
    password: '',
    confirmPassword: '',
    sending: false,
    countdown: 0
  },

  onLoad: function (options) {
    // 页面加载
  },

  // 手机号输入
  onPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 验证码输入
  onCodeInput: function(e) {
    this.setData({
      code: e.detail.value
    })
  },

  // 密码输入
  onPasswordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 确认密码输入
  onConfirmPasswordInput: function(e) {
    this.setData({
      confirmPassword: e.detail.value
    })
  },

  // 发送验证码
  sendCode: function() {
    const { phone, sending, countdown } = this.data
    
    if (sending || countdown > 0) {
      return
    }
    
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
    
    this.setData({ sending: true })
    
    wx.cloud.callFunction({
      name: 'sendSms',
      data: {
        phone: phone
      }
    }).then(res => {
      this.setData({ sending: false })
      
      if (res.result && res.result.success) {
        wx.showToast({
          title: res.result.message,
          icon: 'success'
        })
        
        // 开始倒计时
        this.startCountdown()
      } else {
        wx.showToast({
          title: res.result.message || '发送失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      this.setData({ sending: false })
      console.error('发送验证码失败', err)
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
  },

  // 开始倒计时
  startCountdown: function() {
    let count = 60
    this.setData({ countdown: count })
    
    const timer = setInterval(() => {
      count--
      if (count <= 0) {
        clearInterval(timer)
        this.setData({ countdown: 0 })
      } else {
        this.setData({ countdown: count })
      }
    }, 1000)
  },

  // 处理注册
  handleRegister: function() {
    const { phone, code, password, confirmPassword } = this.data
    
    // 验证
    if (!phone || !code || !password || !confirmPassword) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none'
      })
      return
    }
    
    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      })
      return
    }
    
    if (password.length < 6) {
      wx.showToast({
        title: '密码长度不能少于6位',
        icon: 'none'
      })
      return
    }
    
    wx.showLoading({
      title: '注册中...'
    })
    
    wx.cloud.callFunction({
      name: 'register',
      data: {
        phone: phone,
        code: code,
        password: password
      }
    }).then(res => {
      wx.hideLoading()
      
      if (res.result && res.result.success) {
        wx.showToast({
          title: '注册成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/teacher-login/teacher-login'
          })
        }, 1500)
      } else {
        wx.showToast({
          title: res.result.message || '注册失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('注册失败', err)
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
  },

  // 跳转到登录页
  goToLogin: function() {
    wx.navigateBack()
  }
})