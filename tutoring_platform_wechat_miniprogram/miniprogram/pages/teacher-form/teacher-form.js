// pages/teacher-form/teacher-form.js
Page({
  data: {
    formData: {
      name: '',
      gender: '男',
      wechat: '',
      qq: '',
      school: '',
      hasExperience: '否',
      subjects: [],
      grades: [],
      availableTime: '',
      minSalary: '',
      maxSalary: '',
      highlight: '',
      resumePDF: ''
    },
    schoolList: [
      '南方科技大学',
      '深圳大学',
      '深职大',
      '深信大',
      '哈工深',
      '清华大学',
      '北京大学',
      '港中文',
      '深理工',
      '中山大学深圳校区',
      '已毕业社会人士'
    ],
    schoolIndex: -1,
    subjectList: ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '政治', '地理', '所有文科', '所有理科'],
    gradeList: ['小学', '初中', '高中'],
    submitting: false
  },

  onLoad() {
    // 检查登录状态
    const openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/teacher-login/teacher-login'
        });
      }, 1500);
    }
  },

  // 姓名输入
  onNameInput(e) {
    this.setData({
      'formData.name': e.detail.value
    });
  },

  // 性别选择
  onGenderChange(e) {
    this.setData({
      'formData.gender': e.detail.value
    });
  },

  // 微信号输入
  onWechatInput(e) {
    this.setData({
      'formData.wechat': e.detail.value
    });
  },

  // QQ号输入
  onQqInput(e) {
    this.setData({
      'formData.qq': e.detail.value
    });
  },

  // 院校选择
  onSchoolChange(e) {
    const index = e.detail.value;
    this.setData({
      schoolIndex: index,
      'formData.school': this.data.schoolList[index]
    });
  },

  // 家教经验选择
  onExperienceChange(e) {
    this.setData({
      'formData.hasExperience': e.detail.value
    });
  },

  // 科目选择
  onSubjectTap(e) {
    const subject = e.currentTarget.dataset.subject;
    const subjects = this.data.formData.subjects;
    const index = subjects.indexOf(subject);
    
    if (index > -1) {
      subjects.splice(index, 1);
    } else {
      subjects.push(subject);
    }
    
    this.setData({
      'formData.subjects': subjects
    });
  },

  // 年级选择
  onGradeTap(e) {
    const grade = e.currentTarget.dataset.grade;
    const grades = this.data.formData.grades;
    const index = grades.indexOf(grade);
    
    if (index > -1) {
      grades.splice(index, 1);
    } else {
      grades.push(grade);
    }
    
    this.setData({
      'formData.grades': grades
    });
  },

  // 方便时间输入
  onTimeInput(e) {
    this.setData({
      'formData.availableTime': e.detail.value
    });
  },

  // 最小时薪输入
  onMinSalaryInput(e) {
    this.setData({
      'formData.minSalary': e.detail.value
    });
  },

  // 最大时薪输入
  onMaxSalaryInput(e) {
    this.setData({
      'formData.maxSalary': e.detail.value
    });
  },

  // 亮点输入
  onHighlightInput(e) {
    this.setData({
      'formData.highlight': e.detail.value
    });
  },

  // 选择PDF文件
  choosePDF() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['pdf'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].path;
        const fileName = res.tempFiles[0].name;
        
        // 验证是否为PDF文件
        if (!fileName.toLowerCase().endsWith('.pdf')) {
          wx.showToast({
            title: '请选择PDF文件',
            icon: 'none'
          });
          return;
        }
        
        wx.showLoading({
          title: '上传中...'
        });
        
        // 上传到云存储
        wx.cloud.uploadFile({
          cloudPath: `resume/${Date.now()}_${fileName}`,
          filePath: tempFilePath,
          success: (uploadRes) => {
            this.setData({
              'formData.resumePDF': uploadRes.fileID
            });
            wx.hideLoading();
            wx.showToast({
              title: '上传成功',
              icon: 'success'
            });
          },
          fail: (err) => {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            });
            console.error('上传失败:', err);
          }
        });
      },
      fail: (err) => {
        console.error('选择文件失败:', err);
      }
    });
  },

  // 移除PDF
  removePDF() {
    this.setData({
      'formData.resumePDF': ''
    });
  },

  // 表单验证
  validateForm() {
    const { formData } = this.data;
    
    if (!formData.name) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return false;
    }
    if (!formData.wechat) {
      wx.showToast({ title: '请输入微信号', icon: 'none' });
      return false;
    }
    if (!formData.qq) {
      wx.showToast({ title: '请输入QQ号', icon: 'none' });
      return false;
    }
    if (!formData.school) {
      wx.showToast({ title: '请选择院校', icon: 'none' });
      return false;
    }
    if (formData.subjects.length === 0) {
      wx.showToast({ title: '请选择教学科目', icon: 'none' });
      return false;
    }
    if (formData.grades.length === 0) {
      wx.showToast({ title: '请选择教学年级', icon: 'none' });
      return false;
    }
    if (!formData.availableTime) {
      wx.showToast({ title: '请输入方便的时间', icon: 'none' });
      return false;
    }
    if (!formData.minSalary || !formData.maxSalary) {
      wx.showToast({ title: '请输入时薪范围', icon: 'none' });
      return false;
    }
    if (Number(formData.minSalary) >= Number(formData.maxSalary)) {
      wx.showToast({ title: '最小时薪应小于最大时薪', icon: 'none' });
      return false;
    }
    if (!formData.highlight) {
      wx.showToast({ title: '请输入个人亮点', icon: 'none' });
      return false;
    }
    if (!formData.resumePDF) {
      wx.showToast({ title: '请上传PDF简历', icon: 'none' });
      return false;
    }
    
    return true;
  },

  // 提交表单
  submitForm() {
    if (!this.validateForm()) {
      return;
    }
    
    this.setData({ submitting: true });
    
    const openid = wx.getStorageSync('openid');
    const { formData } = this.data;
    
    // 调用云函数提交表单
    wx.cloud.callFunction({
      name: 'submitTeacherForm',
      data: {
        openid: openid,
        name: formData.name,
        gender: formData.gender,
        wechat: formData.wechat,
        qq: formData.qq,
        school: formData.school,
        hasExperience: formData.hasExperience,
        subjects: formData.subjects,
        grades: formData.grades,
        availableTime: formData.availableTime,
        minSalary: Number(formData.minSalary),
        maxSalary: Number(formData.maxSalary),
        highlight: formData.highlight,
        resumePDF: formData.resumePDF
      },
      success: (res) => {
        this.setData({ submitting: false });
        
        if (res.result.success) {
          wx.showToast({
            title: '提交成功，等待审核',
            icon: 'success',
            duration: 2000
          });
          
          // 清空表单
          this.setData({
            formData: {
              name: '',
              gender: '男',
              wechat: '',
              qq: '',
              school: '',
              hasExperience: '否',
              subjects: [],
              grades: [],
              availableTime: '',
              minSalary: '',
              maxSalary: '',
              highlight: '',
              resumePDF: ''
            },
            schoolIndex: -1
          });
          
          // 跳转到我的订单页面
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/teacher-home/teacher-home'
            });
          }, 2000);
        } else {
          wx.showToast({
            title: res.result.message || '提交失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        this.setData({ submitting: false });
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
        console.error('提交失败:', err);
      }
    });
  }
});