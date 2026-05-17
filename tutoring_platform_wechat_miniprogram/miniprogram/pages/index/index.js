// pages/index/index.js - 首页逻辑（增强版）
// 包含星空背景、手风琴问答、特色展示、跳转功能

Page({
  data: {
    stars: [],          // 动态星星数据
    questions: [        // 手风琴问答列表
      {
        question: "🌟 平台的家教老师来自哪些学校？",
        answer: "教员均来自深圳七所顶尖高校：深圳大学、南方科技大学、哈尔滨工业大学（深圳）、香港中文大学（深圳）、深圳理工大学、深圳技术大学、深圳职业技术大学。学籍简历真实可查，名校学子领路提分。",
        open: false
      },
      {
        question: "🏆 如何保证师资质量？",
        answer: "所有教员经过严格筛选，包含全国奥赛金牌得主、SCI论文第一作者、专利持有者、国家级大创项目负责人等。更有高考物理98分、三年教学经验的学长，提分30+案例丰富，不只讲题更教思维。",
        open: false
      },
      {
        question: "💰 收费模式是怎样的？有无隐形消费？",
        answer: "平台仅提供推荐与对接，课程价格由家长和老师自由商定，无任何隐形收费。家长可直接查看教员信息，定价公允，同城上门绝无中介差价。",
        open: false
      },
      {
        question: "🎯 如何精准匹配到适合的老师？",
        answer: "家长可自主筛选教员信息（学校/专业/获奖/经验），也可提交需求由平台智能推送。我们支持试课沟通，同城极速对接，确保找到最适合孩子的学长导师。",
        open: false
      },
      {
        question: "📈 提分效果真的那么显著吗？",
        answer: "往期学员平均提分30+，多位学员考入理想名校；平台已收获锦旗5面及大量家长感谢信。专注初高中全科培优补弱，强基计划定制教学，效果看得见。",
        open: false
      }
    ]
  },

  onLoad: function(options) {
    console.log('首页加载完成，星空效果已启动');
    this.generateStars();
  },

  // 生成随机星星（80颗，随机位置、大小、闪烁延迟）
  generateStars: function() {
    const starsCount = 80;
    let starsArray = [];
    for (let i = 0; i < starsCount; i++) {
      let star = {
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 8 + 3,
        delay: Math.random() * 5,
        duration: Math.random() * 2 + 1.2,
      };
      starsArray.push(star);
    }
    this.setData({ stars: starsArray });
  },

  // 手风琴折叠/展开
  toggleQuestion: function(e) {
    const index = e.currentTarget.dataset.index;
    if (index === undefined) return;
    const key = `questions[${index}].open`;
    const currentState = this.data.questions[index].open;
    this.setData({
      [key]: !currentState
    });
  },

  // 跳转到家长端主页
  goToParentHome: function() {
    wx.navigateTo({
      url: '/pages/parent-home/parent-home',
      success: function(res) {
        console.log('跳转家长端成功');
      },
      fail: function(err) {
        console.error('跳转失败', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 跳转到家教端登录页
  goToTeacherLogin: function() {
    wx.switchTab({
      url: '/pages/teacher-home/teacher-home',
      success: function(res) {
        console.log('跳转家教端成功');
      },
      fail: function(err) {
        console.error('跳转失败', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  onReady: function () {
    // 页面初次渲染完成
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
});