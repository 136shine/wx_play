import { findOne } from '../../../utils/music-api.js'
import { formatNumber, formatSongTime } from '../../../utils/util.js'
import Lyric from '../../../utils/lyric-parse.js'
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    innerAudioContext: null,
    isPlay: false,
    duration: 0,
    ftDuration: '',
    currTime: 0,
    ftCurrTime: '00:00',
    music: {},
    musicId: '',
    playMode: 'list',
    modeIcon: 'icon-play-list',
    lyricObj: null,
    // lyricLines: [],
    currLine: '',
    isShow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let musicId = null

    if (options && options.id) {
      musicId = options.id
    } else {
      console.log('ppppp')
      musicId = app.globalData.currSong.FileHash
    }
    
    this.getData(musicId)

    this.innerAudioContext = wx.createInnerAudioContext()

    // 进入该页面自动播放
    // this.handelPlay()
    this.setData({
      isPlay: true
    })
    this.innerAudioContext.autoplay = true

    //监听开始播放
    this.innerAudioContext.onPlay(() => {
      console.log('开始播放。。.....')
      this.data.lyricObj.play()
      console.log('app.globalData.currSongIndex=>-1', app.globalData.currSongIndex)
    })

    this.innerAudioContext.seek(this.innerAudioContext.currentTime)
    
    // 监听更新播放进度
    this.innerAudioContext.onTimeUpdate(() => {
      // console.log('改变播放进度。。')
      // this.innerAudioContext.seek(this.innerAudioContext.currentTime)
      this.data.lyricObj.seek(this.innerAudioContext.currentTime * 1000)

      this.setData({
        currTime: this.innerAudioContext.currentTime,
        ftCurrTime: formatSongTime(this.innerAudioContext.currentTime)
      })
    })
    // 监听播放结束
    this.innerAudioContext.onEnded(() => {
      // console.log('一曲结束。。')
      this.setData({
        isPlay: false
      })
      this.innerAudioContext.pause()
      this.data.lyricObj.stop()
      
      this.setData({
        currTime: this.data.duration,
        ftCurrTime: formatSongTime(this.data.duration),
        currLine: ''
      })

      // 一首播完后自动播放下一首
      console.log('接着下一首。。')
      console.log('app.globalData.currSongIndex=>0', app.globalData.currSongIndex)
      this.palyPrevOrNext('next')
      // this.handelPlayNext()
    })
    // 监听播放出现的错误
    this.innerAudioContext.onError((res) => {
      console.log('err=>', res.errCode, res.errMsg)
    })

    this.innerAudioContext.onPause(() => {
      console.log('暂停播放')
      this.data.lyricObj.stop()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getData: function (musicId) {
    findOne('yy/index.php', musicId).then(res => {
      console.log('music_detail-res=>', res)
      // res.data.play_url.replace(/^http$/, 'https')
      this.innerAudioContext.src =  res.data.play_url
      // console.log('this.innerAudioContext=>', this.innerAudioContext)
      // console.log('_duration=>', this.innerAudioContext.duration) ???? 获取不到
      // 监听音频进入可以播放状态的事件
      // this.innerAudioContext.onCanplay(() => {
      //   setTimeout(() => {
      //     console.log('_duration=>', this.innerAudioContext.duration); // 273.84163300000006
      //   }, 1000)
      // })  

      let singers = []
      res.data.authors.forEach(item => {
        singers.push(item.author_name)
      })

      this.setData({ singers: singers.join('、') })
      this.setData({
        music: res.data
      })

      let _duration = parseInt(res.data.timelength / 1000)
      this.setData({
        duration: _duration,
        ftDuration: formatSongTime(_duration)
      })

      // 初始化解析歌词
      this.lyricParse()
    })
  },

  handelPlay: function () {
    console.log('点击开始播放。。')
    this.setData({
      isPlay: true
    })
    this.innerAudioContext.play()
  },
  
  handelPause: function () {
    console.log('点击暂停播放。。')
    this.setData({
      isPlay: false
    })
    this.innerAudioContext.pause()
    this.data.lyricObj.stop()
  },

  handelSliderChange: function (ev) {
    console.log('slider-value=>', ev.detail.value)
    // 暂时暂停
    this.handelPause()

    // 设置拖动进度条后的值
    this.innerAudioContext.seek(ev.detail.value)
    this.setData({
      currTime: ev.detail.value,
      ftCurrTime: formatSongTime(ev.detail.value)
    })

    // 重新播放
    this.handelPlay()
  },

  // 上一首
  handelPlayPrev: function (ev) {
    console.log('上一首。。。。。')
    let index = app.globalData.currSongIndex
    index--
    this.palyPrevOrNext('prev', index)
  },

  // 下一首
  handelPlayNext: function (ev) {
    console.log('下一首。。。。。')
    let index = app.globalData.currSongIndex
    index++
    this.palyPrevOrNext('next', index)
  },

  // 切换上／下一首
  palyPrevOrNext: function (tag, index) {
    this.handelPause()

    let len = app.globalData.songList.length
    console.log(index, index === undefined)
    if (index === undefined) {
      index = app.globalData.currSongIndex
    }

    if (len < 1) {
      return
    } else if (len === 1) {
      app.globalData.currSong = app.globalData.songList[0]
    }

    if (tag === 'next') {
      // index++
      console.log(index, app.globalData.songList.length)
      if (index > app.globalData.songList.length) {
        if (this.data.playMode === 'list') {
          app.globalData.currSongIndex = index
        }
        if (this.data.playMode === 'list-all') {
          app.globalData.currSongIndex = 0
        }
      } else {
        if (this.data.playMode !== 'cycle') {
          app.globalData.currSongIndex = ++index
        }
      }
    } else {
      if (index < 0) {
        app.globalData.currSongIndex = 0
      }
    }

    console.log('app.globalData.currSongIndex=>1', app.globalData.currSongIndex)
    app.globalData.currSong = app.globalData.songList[app.globalData.currSongIndex]

    this.data.musicId = app.globalData.currSong.FileHash
    this.getData(this.data.musicId)

    setTimeout(() => {
      if (this.innerAudioContext.src) {
        this.handelPlay()
      }
    }, 2000)
  },

  // 切换播放模式
  handelChangePlayMode: function () {
    console.log('切换播放模式。。', this.data.playMode)
    let currIndex = app.globalData.currSongIndex
    if (this.data.playMode === 'list') {
      this.setData({
        playMode: 'list-all',
        modeIcon: 'icon-play-cycle'
      })
      
      return
    }
    if (this.data.playMode === 'list-all') {
      this.setData({
        playMode: 'cycle',
        modeIcon: 'icon-play-one'
      })
      // this.innerAudioContext.loop = true
      return
    }
    if (this.data.playMode === 'cycle') {
      this.setData({
        playMode: 'list',
        modeIcon: 'icon-play-list'
      })
      if (currIndex === app.globalData.songList.length) {
       return
      }
      return
    }

    console.log('icon=>', this.data.modeIcon)
  },

  // 歌词解析回调，显示正在播放的歌词
  hanlder: function({ lineNum, txt }){
    // this hanlder called when lineNum change
    console.log('lineNum, txt=>', lineNum, txt, this.data.lyricObj.lines.length)
    if (lineNum < this.data.lyricObj.lines.length) {
      this.setData({
        currLine: txt
      })
    }
  },

  // 歌词解析过程
  lyricParse: function () {
    // console.log('this.data.music.lyrics=>', this.data.music, this.data.music.lyrics)
    this.setData({
      lyricObj: new Lyric(this.data.music.lyrics, this.hanlder)
    })
      
    console.log('lyricObj=>', this.data.lyricObj)
    // this.setData({
    //   lyricLines: this.data.lyricObj.lines
    // })
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
    this.innerAudioContext.destroy()
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