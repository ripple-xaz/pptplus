let aldstat = require("./utils/ald-stat.js");
let Util = require('./utils/util.js');
let isIpx = false, windowHeight = 0, windowWidth=0;

wx.getSystemInfo({
  success: function(res) {
    let reg = /iphone\sx/gi
    isIpx = reg.test(res.model)?true:false;
    windowWidth = res.windowWidth
    windowHeight = res.windowHeight
  }
})
App({
    globalData:{
      g_baseUrl: "https://www.pptx.info",
      isIpx: isIpx,
      windowWidth: windowWidth,
      windowHeight: windowHeight
    },
    showModal(tit,cnt,callBack){
      wx.showModal({
        title: tit,
        content: cnt,
        showCancel: true,
        success: function (res) { 
          callBack && callBack()
        }
      })
    },
    showLoading(tit){
      wx.showLoading({
        title: tit
      })
    }
   
})