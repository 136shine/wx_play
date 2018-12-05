const myaudio = wx.createInnerAudioContext();
Page({

  data: {
    isplay: false,//是否播放
  },
  onLoad: function () {
    console.log('onLoad.....')
  },
  onShow: function () {
    // myaudio.src = "http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46"
    myaudio.src = "http://fs.w.kugou.com/201812041802/21be2a3d5ec52e9d448439ac242231fe/G040/M00/0A/0F/CJQEAFYqiOiAGM8FAELc6LLlvXk807.mp3"

  },
  //播放
  play: function () {

    myaudio.play();
    console.log(myaudio.duration);
    this.setData({ isplay: true });
  },
  // 停止
  stop: function () {
    myaudio.pause();
    this.setData({ isplay: false });
  }



})
