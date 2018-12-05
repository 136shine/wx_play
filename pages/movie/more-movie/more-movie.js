import { findBytype, findOne } from '../../../utils/movie-api.js'
// pages/movie/more-movie/more-movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options=>', options)
    findBytype(options.category).then(res => {
      console.log('_data==>', res)
      this.setData({
        movies: res.subjects
      })
    })
    console.log('movies=>', movies)
  },
  bindGoDetail(e) {
    let movieId = e.currentTarget.dataset.movieid
    console.log('movieId=>', e)
    wx.navigateTo({
      url: "../movie-detail/movie-detail?movieId=" + movieId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    findBytype('in_theaters', 2).then(res => {
      console.log('in_theaters_data==>?', res.subjects)
      this.setData({
        movies: [...this.data.movies, ...res.subjects]
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})