// pages/teacher-home/teacher-home.js - 家教端主页（我要接单表单）逻辑

Page({
  data: {
    schoolOptions: [
      '南方科技大学', '深圳大学', '深职大', '深信大', '哈工深',
      '清华大学', '北京大学', '港中文', '深理工', '中山大学深圳校区', '已毕业社会人士'
    ],
    subjectOptions: ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '政治', '地理', '所有文科', '所有理科'],
    gradeOptions: ['小学', '初中', '高中'],
    
    schoolIndex: -1,
    
    formData: {
      name: '',
      gender: '',
      wechat: '',
      qq: '',
      school: '',
      hasExperience: '',
      subjects: [],
      grades: [],
      availableTime: '',
      minSalary: '',
      maxSalary: '',
      highlight: '',
      resumePDF: ''
    },
    
    submitting: false
  },

  onLoad: function (options) {
    // 检查登录状态
    //const app = getApp()
    //if (!app.globalData.isLoggedIn) {
      //wx.redirectTo({
        //url: '/pages/teacher-login/teacher-login'
      //})
    //}
  },

  // 输入处理
  onInput: function(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    
    this.setData({
      [`formData.${field}`]: value
    })
  },

  // 选择性别
  selectGender: function(e) {
    const value = e.currentTarget.dataset.value
    this.setData({
      'formData.gender': value
    })
  },

  // 选择院校
  onSchoolChange: function(e) {
    const index = e.detail.value
    const school = this.data.schoolOptions[index]
    
    this.setData({
      schoolIndex: index,
      'formData.school': school
    })
  },

  // 选择经验
  selectExperience: function(e) {
    const value = e.currentTarget.dataset.value
    this.setData({
      'formData.hasExperience': value
    })
  },

  // 切换科目选择
  toggleSubject: function(e) {
    const value = e.currentTarget.dataset.value
    const subjects = [...this.data.formData.subjects]
    
    const index = subjects.indexOf(value)
    if (index >= 0) {
      subjects.splice(index, 1)
    } else {
      subjects.push(value)
    }
    
    this.setData({
      'formData.subjects': subjects
    })
  },

  // 切换年级选择
  toggleGrade: function(e) {
    const value = e.currentTarget.dataset.value
    const grades = [...this.data.formData.grades]
    
    const index = grades.indexOf(value)
    if (index >= 0) {
      grades.splice(index, 1)
    } else {
      grades.push(value)
    }
    
    this.setData({
      'formData.grades': grades
    })
  },

  // 上传简历PDF
  uploadResume: function() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['pdf'],
      success: res => {
        const tempFilePath = res.tempFiles[0].path
        const fileName = res.tempFiles[0].name
        
        // 验证文件类型
        if (!fileName.toLowerCase().endsWith('.pdf')) {
          wx.showToast({
            title: '请选择PDF文件',
            icon: 'none'
          })
          return
        }
        
        wx.showLoading({
          title: '上传中...'
        })
        
        // 上传到云存储
        const cloudPath = `resumes/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.pdf`
        
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: tempFilePath,
          success: uploadRes => {
            wx.hideLoading()
            
            this.setData({
              'formData.resumePDF': uploadRes.fileID
            })
            
            wx.showToast({
              title: '上传成功',
              icon: 'success'
            })
          },
          fail: err => {
            wx.hideLoading()
            console.error('上传失败', err)
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            })
          }
        })
      },
      fail: err => {
        console.error('选择文件失败', err)
      }
    })
  },

  // 提交表单
  submitForm: function() {
    if (this.data.submitting) return
    
    const { formData } = this.data
    
    // 验证必填字段
    if (!formData.name || !formData.gender || !formData.wechat || 
        !formData.qq || !formData.school || !formData.hasExperience ||
        formData.subjects.length === 0 || formData.grades.length === 0 ||
        !formData.availableTime || !formData.minSalary || 
        !formData.maxSalary || !formData.resumePDF) {
      wx.showToast({
        title: '请填写所有必填字段',
        icon: 'none'
      })
      return
    }
    
    // 验证时薪
    if (Number(formData.minSalary) >= Number(formData.maxSalary)) {
      wx.showToast({
        title: '最低时薪不能大于等于最高时薪',
        icon: 'none'
      })
      return
    }
    
    this.setData({ submitting: true })
    
    wx.showLoading({
      title: '提交中...'
    })
    
    wx.cloud.callFunction({
      name: 'submitTeacherForm',
      data: formData
    }).then(res => {
      wx.hideLoading()
      this.setData({ submitting: false })
      
      if (res.result && res.result.success) {
        wx.showToast({
          title: '提交成功，等待审核',
          icon: 'success'
        })
        
        // 清空表单
        this.resetForm()
      } else {
        wx.showToast({
          title: res.result.message || '提交失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.hideLoading()
      this.setData({ submitting: false })
      console.error('提交失败', err)
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    })
  },

  // 重置表单
  resetForm: function() {
    this.setData({
      schoolIndex: -1,
      formData: {
        name: '',
        gender: '',
        wechat: '',
        qq: '',
        school: '',
        hasExperience: '',
        subjects: [],
        grades: [],
        availableTime: '',
        minSalary: '',
        maxSalary: '',
        highlight: '',
        resumePDF: ''
      }
    })
  }
})