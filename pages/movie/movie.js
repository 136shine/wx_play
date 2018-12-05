import { findBytype, findOne } from '../../utils/movie-api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheatersData: {
      title: '',
      subjects: []
    },
    comingSoonData: {
      title: '',
      subjects: []
    },
    top250Data: {
      title: '',
      subjects: []
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    findBytype('in_theaters', 1, 3).then(res => {
      console.log('in_theaters_data==>?', res.subjects)
      this.setData({
        inTheatersData: res
      })
      // this.data.inTheatersData.title = res.title
      // this.data.inTheatersData.subjects = res.subjects
    })
    findBytype('coming_soon', 1, 3).then(res => {
      console.log('coming_soon_data==>?', res.subjects)
      this.setData({
        comingSoonData: res
      })
      // this.data.comingSoonData.title = res.title
      // this.data.comingSoonData.subjects = res.subjects
    })
    findBytype('top250', 1, 3).then(res => {
      console.log('top250_data==>?', res.subjects)
      this.setData({
        top250Data: res
      })
      // this.data.top250Data.title = res.title
      // this.data.top250Data.subjects = res.subjects
    })
    
  },

  bindLoadMore(e) {
    let category = e.currentTarget.dataset.category
    let _category = ''
    
    switch (category) {
      case "即将上映的电影": {
        _category = 'coming_soon';
        break;
      }
      case "豆瓣电影Top250": {
        _category = 'top250';
        break;
      }
      default: {
        _category = 'in_theaters';
        break;
      }
    }
 
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + _category
    })
  },

  bindGoDetail(e) {
    let movieId = e.currentTarget.dataset.movieid
    console.log('movieId=>', e)
    wx.navigateTo({
      url: "movie-detail/movie-detail?movieId=" + movieId
    })
  },

  bindSearchMovie: function (e) {
    console.log('kkk', this.data.searchVal)
    
  },
  bindKeyInput: function (e) {
    this.setData({
      searchVal: e.detail.value
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})