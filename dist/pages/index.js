// pages/index/index.js
Page({
  /**
   * 
   * 
   * 页面的初始数据
   * 
   * 
   */
  data: {
    pageLoading:true,
    pptList:[

    ]
  },
  navToPptInfo (event){//点击图片跳转页面
    var dataSet = event.currentTarget.dataset;
    var pptId = dataSet.pptid;
    var roleId = dataSet.roleid;
  
    var role = dataSet.role;
    if ('person' === role){ //当点击的是个人页面的时候，会跳转到个人ppt页面
      wx.navigateTo({
        url: '/dist/pages/ppt-info/ppt-info?pptId=' + pptId,
      })
      } else if ('meeting' === role){ //当点击的是会议ppt的时候，会跳转到会议日程页面
      wx.navigateTo({
        url: '/dist/pages/ppt-schedule/ppt-schedule?roleId=' + roleId,
      })
    }
  },
  getPptAddress(event){ //获取会议类型ppt的会议地址
    var dataSet = event.currentTarget.dataset;
    var latitude = dataSet.latitude || 30.4717;
    var longitude = dataSet.longitude || 114.4214;
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: "https://www.pptx.info" +'/pptxzs/ppttemp.json?temp_id=5a546bf31937336372f6d3db&temp_key=kfskdfksdhfkds',
      success:(res)=>{
        var pptList = JSON.parse(res.data.data)
        var newpptlist = pptList.filter((v,i)=>{
          return !v.private
        })
        this.setData({
          pptList: newpptlist
        })
        setTimeout(()=>{
          this.setData({
            pageLoading:false
          })
        },200)
      }
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '首页',
      path: '/dist/pages/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})