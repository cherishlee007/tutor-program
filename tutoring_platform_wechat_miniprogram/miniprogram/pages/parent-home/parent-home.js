// pages/parent-home/parent-home.js - 家长端主页逻辑
// 微信小程序开发注意点：
// 1. 云函数调用使用 wx.cloud.callFunction
// 2. 数据更新必须使用 this.setData()
// 3. 页面参数通过 options 获取

Page({
  data: {
    searchKeyword: '',
    showFilterPanel: false,
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10,
    
    // 筛选条件
    filterData: {
      gender: '',
      schools: [],
      salaryRange: '',
      hasExperience: '',
      availableTime: ''
    },
    
    // 院校选项
    schoolOptions: [
      ['南方科技大学', '深圳大学', '深职大', '深信大', '哈工深', 
       '清华大学', '北京大学', '港中文', '深理工', '中山大学深圳校区', '已毕业社会人士']
    ],
    selectedSchools: [],
    
    // 教员列表数据
    teacherList: [],
    leftColumnTeachers: [],
    rightColumnTeachers: []
  },

  onLoad: function (options) {
    // 页面加载时获取教员列表
    this.loadTeacherList()
  },

  // 加载教员列表
  loadTeacherList: function(isLoadMore = false) {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    const page = isLoadMore ? this.data.page + 1 : 1
    
    wx.cloud.callFunction({
      name: 'getTeacherList',
      data: {
        keyword: this.data.searchKeyword,
        gender: this.data.filterData.gender,
        schools: this.data.filterData.schools,
        salaryRange: this.data.filterData.salaryRange,
        hasExperience: this.data.filterData.hasExperience,
        availableTime: this.data.filterData.availableTime,
        page: page,
        pageSize: this.data.pageSize
      }
    }).then(res => {
      const teachers = res.result.data || []
      const hasMore = teachers.length >= this.data.pageSize
      
      // 瀑布流分配：左右列交替添加
      let leftColumn = [...this.data.leftColumnTeachers]
      let rightColumn = [...this.data.rightColumnTeachers]
      
      if (!isLoadMore) {
        leftColumn = []
        rightColumn = []
      }
      
      teachers.forEach((teacher, index) => {
        if ((leftColumn.length + rightColumn.length) % 2 === 0) {
          leftColumn.push(teacher)
        } else {
          rightColumn.push(teacher)
        }
      })
      
      this.setData({
        teacherList: isLoadMore ? [...this.data.teacherList, ...teachers] : teachers,
        leftColumnTeachers: leftColumn,
        rightColumnTeachers: rightColumn,
        page: page,
        hasMore: hasMore,
        loading: false
      })
    }).catch(err => {
      console.error('获取教员列表失败', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
      this.setData({ loading: false })
    })
  },

  // 搜索输入
  onSearchInput: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    })
  },

  // 搜索确认
  onSearchConfirm: function() {
    this.loadTeacherList()
  },

  // 显示/隐藏筛选面板
  showFilter: function() {
    this.setData({
      showFilterPanel: !this.data.showFilterPanel
    })
  },

  // 选择性别
  selectGender: function(e) {
    const gender = e.currentTarget.dataset.value
    this.setData({
      'filterData.gender': gender
    })
  },

  // 院校选择变化
  onSchoolChange: function(e) {
    const selectedIndexes = e.detail.value
    const selectedSchools = selectedIndexes.map(index => this.data.schoolOptions[0][index])
    this.setData({
      selectedSchools: selectedIndexes,
      'filterData.schools': selectedSchools
    })
  },

  // 选择时薪范围
  selectSalaryRange: function(e) {
    const salaryRange = e.currentTarget.dataset.value
    this.setData({
      'filterData.salaryRange': salaryRange
    })
  },

  // 选择经验
  selectExperience: function(e) {
    const hasExperience = e.currentTarget.dataset.value
    this.setData({
      'filterData.hasExperience': hasExperience
    })
  },

  // 时间输入
  onTimeInput: function(e) {
    this.setData({
      'filterData.availableTime': e.detail.value
    })
  },

  // 重置筛选
  resetFilter: function() {
    this.setData({
      filterData: {
        gender: '',
        schools: [],
        salaryRange: '',
        hasExperience: '',
        availableTime: ''
      },
      selectedSchools: []
    })
  },

  // 应用筛选
  applyFilter: function() {
    this.setData({
      showFilterPanel: false,
      page: 1
    })
    this.loadTeacherList()
  },

  // 跳转到详情页
  goToDetail: function(e) {
    const teacherId = e.currentTarget.dataset.teacherId
    wx.navigateTo({
      url: `/pages/parent-detail/parent-detail?teacherId=${teacherId}`
    })
  },

  // 加载更多
  loadMore: function() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadTeacherList(true)
    }
  },

  onPullDownRefresh: function() {
    // 下拉刷新
    this.setData({ page: 1 })
    this.loadTeacherList()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function() {
    // 上拉加载更多
    this.loadMore()
  }
})