// pages/teacher-orders/teacher-orders.js
Page({
  data: {
    orders: [],
    showQRModal: false
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadOrders();
  },

  // 加载订单列表
  loadOrders() {
    wx.showLoading({
      title: '加载中...'
    });

    const openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.hideLoading();
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    wx.cloud.callFunction({
      name: 'getMyOrders',
      data: {
        openid: openid
      },
      success: (res) => {
        wx.hideLoading();
        
        if (res.result.success) {
          const orders = res.result.data.map(order => {
            // 格式化时间
            const createTime = new Date(order.createTime);
            const createTimeStr = `${createTime.getFullYear()}-${String(createTime.getMonth() + 1).padStart(2, '0')}-${String(createTime.getDate()).padStart(2, '0')} ${String(createTime.getHours()).padStart(2, '0')}:${String(createTime.getMinutes()).padStart(2, '0')}`;
            
            return {
              ...order,
              createTimeStr: createTimeStr
            };
          });
          
          this.setData({
            orders: orders
          });
        } else {
          wx.showToast({
            title: res.result.message || '加载失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
        console.error('加载订单失败:', err);
      }
    });
  },

  // 暂停接单
  pauseOrder(e) {
    const teacherId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认操作',
      content: '暂停后将无法接收新订单，是否继续？',
      confirmText: '确认暂停',
      confirmColor: '#ff4d4f',
      success: (modalRes) => {
        if (modalRes.confirm) {
          wx.showLoading({
            title: '处理中...'
          });

          wx.cloud.callFunction({
            name: 'updateStatus',
            data: {
              teacherId: teacherId,
              status: '已接单'
            },
            success: (res) => {
              wx.hideLoading();
              
              if (res.result.success) {
                wx.showToast({
                  title: '已暂停接单',
                  icon: 'success'
                });
                
                // 重新加载列表
                this.loadOrders();
              } else {
                wx.showToast({
                  title: res.result.message || '操作失败',
                  icon: 'none'
                });
              }
            },
            fail: (err) => {
              wx.hideLoading();
              wx.showToast({
                title: '网络错误',
                icon: 'none'
              });
              console.error('更新状态失败:', err);
            }
          });
        }
      }
    });
  },

  // 显示客服咨询二维码
  showConsultQR() {
    this.setData({
      showQRModal: true
    });
  },

  // 关闭二维码弹窗
  closeQRModal() {
    this.setData({
      showQRModal: false
    });
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空函数，用于阻止点击内容区域关闭弹窗
  }
});