//index.js
//获取应用实例
const app = getApp()

Page({
  data: {},
  //组件事件处理函数
  bindGoApp: function(e) {
    console.log('sss', e)
    wx.switchTab({
      url: '../movie/movie'
    })
  },

  // 页面生命周期回调函数
  onLoad: function () {
    console.log('onLoad....')
  },
  onShow: function () {
    console.log('onShow....')
  },
  onReady: function () {
    console.log('onReady....')
  },
  onHide: function () {
    console.log('onHide....')
  },
  onUnload: function () {
    console.log('onUnload....')
  },

  // 页面事件处理函数
  // 监听用户滚动页面事件
  onPageScroll: function () {
    console.log('onPageScroll....')
  },
  // 监听用户下拉刷新事件
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh....')
  },
  // 监听用户上拉触底事件
  onReachBottom: function () {
    console.log('onReachBottom....')
  },
  // 监听用户转发事件
  onShareAppMessage: function () { 
    console.log('onShareAppMessage....')
  },
  // 点击tab时触发
  onTabItemTap: function () {
    console.log('onTabItemTap....')
  },
  // 小程序屏幕旋转时触发
  onResize: function () {
    console.log('onResize....')
  }
})
