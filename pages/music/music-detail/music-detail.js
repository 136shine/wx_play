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
    console.log('music-detail-options=>', options)
    
    let musicId = null

    if (options && options.id) {
      // 点击某首歌曲播放
      musicId = options.id
    } else {
      // 播放全部
      musicId = app.globalData.currSong.FileHash
    }
    
    this.getData(musicId)
    this.handelInnerAudio()

    // this.innerAudioContext = wx.createInnerAudioContext()

    // this.setData({
    //   isPlay: true
    // })
    // app.globalData.innerAudioContext.autoplay = true

    // 进入该页面自动播放
    // console.log('app.globalData.playState=>', app.globalData.playState)
    // if (app.globalData.playState === 'PAUSE') {
    //   this.setData({
    //     isPlay: true
    //   })
    //   app.globalData.innerAudioContext.autoplay = true
    //   app.globalData.playState = 'PLAY'
    // }
  },

  // 播放相关事件监听
  handelInnerAudio: function () {
    //监听开始播放
    app.globalData.innerAudioContext.onPlay(() => {
      console.log('开始播放。。.....')
      this.data.lyricObj.play()
    })

    app.globalData.innerAudioContext.seek(app.globalData.innerAudioContext.currentTime)

    // 监听更新播放进度
    app.globalData.innerAudioContext.onTimeUpdate(() => {
      // console.log('改变播放进度。。')
      // console.log('this.data.lyricObj=>', this, this.data, this.data.lyricObj)
      this.data.lyricObj.seek(app.globalData.innerAudioContext.currentTime * 1000)

      this.setData({
        currTime: app.globalData.innerAudioContext.currentTime,
        ftCurrTime: formatSongTime(app.globalData.innerAudioContext.currentTime)
      })
    })
    // 监听播放结束
    app.globalData.innerAudioContext.onEnded(() => {
      // console.log('一曲结束。。')
      this.setData({
        isPlay: false
      })
      app.globalData.innerAudioContext.pause()
      app.globalData.playState = 'PAUSE'
      this.data.lyricObj.stop()

      this.setData({
        currTime: this.data.duration,
        ftCurrTime: formatSongTime(this.data.duration),
        currLine: ''
      })

      // 一首播完后自动播放下一首
      console.log('接着下一首。。')
      this.palyPrevOrNext('next')
    })
    // 监听播放出现的错误
    app.globalData.innerAudioContext.onError((res) => {
      console.log('err=>', res.errCode, res.errMsg)
    })

    app.globalData.innerAudioContext.onPause(() => {
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
      if (app.globalData.isFirst) {
        app.globalData.innerAudioContext.src = res.data.play_url
      }
      
      // console.log('app.globalData.innerAudioContext=>', app.globalData.innerAudioContext)
      // console.log('_duration=>', app.globalData.innerAudioContext.duration) ???? 获取不到
      // 监听音频进入可以播放状态的事件
      // app.globalData.innerAudioContext.onCanplay(() => {
      //   setTimeout(() => {
      //     console.log('_duration=>', app.globalData.innerAudioContext.duration); // 273.84163300000006
      //   }, 1000)
      // })  


      this.handelParseMusic(res.data)

      // let singers = []
      // res.data.authors.forEach(item => {
      //   singers.push(item.author_name)
      // })

      // this.setData({ singers: singers.join('、') })
      // this.setData({
      //   music: res.data
      // })

      // let _duration = parseInt(res.data.timelength / 1000)
      // this.setData({
      //   duration: _duration,
      //   ftDuration: formatSongTime(_duration)
      // })

      // 初始化解析歌词
      this.lyricParse()
    })
  },

  // 歌曲信息解析
  handelParseMusic: function (data) {
    console.log('handelParseMusic-data=>', data)
    let singers = []
    data.authors.forEach(item => {
      singers.push(item.author_name)
    })

    this.setData({ singers: singers.join('、') })
    this.setData({
      music: data
    })

    let _duration = parseInt(data.timelength / 1000)
    this.setData({
      duration: _duration,
      ftDuration: formatSongTime(_duration)
    })
  },

  handelPlay: function () {
    console.log('点击开始播放。。')
    this.setData({
      isPlay: true
    })
    app.globalData.innerAudioContext.play()
    app.globalData.playState = 'PLAY'
  },
  
  handelPause: function () {
    console.log('点击暂停播放。。')
    this.setData({
      isPlay: false
    })
    app.globalData.innerAudioContext.pause()
    app.globalData.playState = 'PAUSE'
    this.data.lyricObj.stop()
  },

  handelSliderChange: function (ev) {
    console.log('slider-value=>', ev.detail.value)
    // 暂时暂停
    this.handelPause()

    // 设置拖动进度条后的值
    app.globalData.innerAudioContext.seek(ev.detail.value)
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

    app.globalData.currSong = app.globalData.songList[app.globalData.currSongIndex]

    this.data.musicId = app.globalData.currSong.FileHash
    this.getData(this.data.musicId)

    setTimeout(() => {
      if (app.globalData.innerAudioContext.src) {
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
    this.setData({
      lyricObj: new Lyric(this.data.music.lyrics, this.hanlder)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('detail-onShow.....')
    this.setData({
      isPlay: true
    })

    if (app.globalData.playState === 'PAUSE') {
      console.log('music--onShow.....')
      app.globalData.innerAudioContext.autoplay = true
      app.globalData.playState = 'PLAY'
     
    } else {
      console.log('onShow-app.globalData.innerAudioContext=>', app.globalData)
    }
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
    // app.globalData.innerAudioContext.destroy()
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