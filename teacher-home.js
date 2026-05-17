// pages/teacher-home/teacher-home.js - 家教端主页（我要接单表单）逻辑

Page({
  data: {
    schoolOptions: [
      '南方科技大学', '深圳大学', '深职大', '深信大', '哈工深',
      '清华大学', '北京大学', '港中文', '深理工', '中山大学深圳校区', '已毕业社会人士'
    ],
    // ✅ 修正：字段名改为 subjectOptions / gradeOptions，与 WXML 中的 wx:for 匹配
    subjectOptions: [
      { name: '语文', selected: false },
      { name: '数学', selected: false },
      { name: '英语', selected: false },
      { name: '物理', selected: false },
      { name: '化学', selected: false },
      { name: '生物', selected: false },
      { name: '历史', selected: false },
      { name: '政治', selected: false },
      { name: '地理', selected: false },
      { name: '所有文科', selected: false },
      { name: '所有理科', selected: false }
    ],
    gradeOptions: [
      { name: '小学', selected: false },
      { name: '初中', selected: false },
      { name: '高中', selected: false }
    ],
    

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
  // 判断科目是否选中
  isSubjectSelected: function(subject) {
    return this.data.formData.subjects.includes(subject);
  },

  // 判断年级是否选中
  isGradeSelected: function(grade) {
    return this.data.formData.grades.includes(grade);
  },
  // 选择经验
  selectExperience: function(e) {
    const value = e.currentTarget.dataset.value
    this.setData({
      'formData.hasExperience': value
    })
  },

  // ✅ 教学科目：通过索引修改对象属性，绝对可靠
  toggleSubject(e) {
    const index = e.currentTarget.dataset.index;
    const subjectOptions = this.data.subjectOptions.map((item, i) => {
      if (i === index) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });

    const subjects = subjectOptions
      .filter(item => item.selected)
      .map(item => item.name);

    this.setData({
      subjectOptions: subjectOptions,
      'formData.subjects': subjects
    });
  },
  
    // ✅ 教学年级：同上
  toggleGrade(e) {
    const index = e.currentTarget.dataset.index;
    const gradeOptions = this.data.gradeOptions.map((item, i) => {
      if (i === index) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });

    const grades = gradeOptions
      .filter(item => item.selected)
      .map(item => item.name);

    this.setData({
      gradeOptions: gradeOptions,
      'formData.grades': grades
    });
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