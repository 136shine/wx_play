import { findByKeyword, findOne } from '../../utils/music-api.js'
import { formatNumber } from '../../utils/util.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topHeight: '300rpx',
    isStartChange: false,
    musics: [],
  },

  startScroll: function (ev) {
    console.log('startScroll-ev=>', ev)
    if (ev.detail.deltaY < -4) {
      this.setData({
        topHeight: (300 * 0.7) + 'rpx',
        isStartChange: true
      })
    }
  },
  onScrollLower: function (ev) {
    console.log('onScrollLower-ev=>', ev)
  },

  // 播放全部
  handelPlayAll: function (ev) {
    if (this.data.musics && this.data.musics.length > 0) {
      app.globalData.currSong = this.data.musics[0]
      app.globalData.currSongIndex = this.data.musics[0].index
    }
    console.log('app.globalData.currSong=>', app.globalData.currSong)
    wx.navigateTo({
      url: 'music-detail/music-detail',
    })
  },

  handelGoDetail: function (ev) {
    console.log('detail=>', ev)
    let musicId = ev.currentTarget.dataset.id
    let musicIndex = Number(ev.currentTarget.dataset.index)

    if (this.data.musics && this.data.musics.length > 0) {
      app.globalData.currSong = this.data.musics[musicIndex-1]
      app.globalData.currSongIndex = musicIndex-1
    }
    wx.navigateTo({
      url: "music-detail/music-detail?id=" +musicId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    findByKeyword('song_search_v2', 1, 20, '剑三').then(res => {
      let lists = res.data.lists
      lists.forEach((item, index)=>{
        item.index = formatNumber(index + 1)
      })
      // console.log('list_res=>', res)
      this.setData({
        musics: lists
      })

      if (this.data.musics && this.data.musics.length > 0) {
        app.globalData.songList = this.data.musics
      }
      console.log('musics=>', this.data.musics)
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