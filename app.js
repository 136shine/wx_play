//app.js
App({
  onLaunch: function () {},
  globalData: {
    currSong: {},
    currSongIndex: 0,
    songList: [],
    playState: 'PAUSE',
    isFirst: true,
    innerAudioContext: wx.createInnerAudioContext()
  }
})