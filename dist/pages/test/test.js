// dist/pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isScroll:true,
    imgsrc:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.downloadFile({
      url: 'https://cos-bi-ppt-1252899312.cos.ap-shanghai.myqcloud.com/pptxzs/image/2018-02-26/wuJ2nac4oibskz7Q', //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
       console.log(res)
        that.setData({
          imgsrc: res.tempFilePath
        })
      }
    })
  },
  stopScroll(e){
    console.log(e)
    this.setData({
      isScroll:false
    })
    setTimeout(()=>{
      this.setData({
        isScroll: true
      })
    },500)
  },
  setScrollRight(event){
    // console.log(event.detail.scrollLeft)
    // if(event.detail.scrollLeft<=50){
    //  this.setData({
    //    scrollLeft:0
    // })
    // }
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