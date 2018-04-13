// dist/pages/ppt-schedule/ppt-schedule.js
var app = getApp();
var globalData = app.globalData; //全局data
const g_baseUrl = globalData.g_baseUrl //全局域名
Page({

  /**
   * 页面的初始数据
   */
  data: {

    scene:'',//场景
    pageLoading:true,
    roleId:'',
    meetingIntro:{
        // pptType: 'meeting',
        // cover: '/images/2.png',
        // head: '/images/2.png',
        // title: '未来城市轨道交通发展趋势',
        // clickCount: '2.54W',
        // score: '4.2分',
        // id: 0,
        // address: '武汉市光谷世贸中心',
        // duration: '2018/02/23 - 2018/02/25'
    },
    dayTabIdx:0,
    daySessionIdx:0,
    pptScheduleSessionSholdHeight:'',//会议日程展示区应该有的高度
    durationDays: [ //会议持续时间，以天为单位计算
      // {
      //   date: '12月23日'
      // }
    ],
    pptScheduleSessions: [//以二维素组计算,会议每天的ppt内容,
      // [//第一个数组代表第一天
      //   {
      //     duration: '20:30-21:30',
      //     sessionType: 'speak',
      //     slicedppts: [
      //       {
      //         mold: '主会场',
      //         title: '罗辑思维2017-2018跨年演讲(上)',
      //         speaker: 'ripple',
      //         id: 0
      //       }
      //     ]
      //   }
      // ]
    ]
  },
  navToPptInfo(event){
    var pptId = event.currentTarget.dataset.pptid
    wx.navigateTo({
      url: '/dist/pages/ppt-info/ppt-info?pptId='+pptId
    })
  },
  getPptAddress(event) { //获取会议类型ppt的会议地址
    var dataSet = event.currentTarget.dataset;
    console.log(dataSet)
    var latitude = dataSet.latitude || 30.4717;
    var longitude = dataSet.longitude || 114.4214;
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
    })
  },
  // changeDayTab(event){
  //   var idx = event.currentTarget.dataset.idx;
  //   console.log(idx)
  //   this.setData({
  //     daySessionIdx:idx,
  //     dayTabIdx: idx
  //   })
  // },
  goLastDay(){
    var idx = this.data.daySessionIdx;
    idx = Math.min(this.data.durationDays.length - 1, Math.max(0, idx - 1))
    console.log(idx)
    this.setData({
      daySessionIdx: idx,
      dayTabIdx: idx
    })
  },
  goNextDay(){
    var idx = this.data.daySessionIdx;
    idx = Math.min(this.data.durationDays.length - 1, Math.max(0, idx + 1))
    console.log(idx)
    this.setData({
      daySessionIdx: idx,
      dayTabIdx: idx
    })
  },
  daySessionChange(event){
    var idx = event.detail.current;
    var dayTabIdx = this.data.dayTabIdx;
    this.setData({
      dayTabIdx: idx
    })
   
      this.getPptScheduleSession('#daySession' + idx)
  
  },
  createImg (){
    wx.showLoading({
      title: '正在生成...',
    })
    var that = this
    var meetingInfo = this.data.meetingIntro
    var cover = meetingInfo.cover
    var title = meetingInfo.title
    var duration = meetingInfo.meetingDuration.timeStart + meetingInfo.meetingDuration.timeEnd
    var location = meetingInfo.address
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene)
    console.log(scene)
    this.setData({
      scene
    })
    var roleId =options.roleId;
    var that = this;
    wx.request({
      url: "https://www.pptx.info" + '/pptxzs/ppttemp.json?temp_id=5a546bf31937336372f6d3db&temp_key=kfskdfksdhfkds',
      method: "GET",
      success(res) {
        var dataList = JSON.parse(res.data.data)
        console.log(dataList)
        var meeting;
        dataList.forEach((v,i)=>{
          if (v.roleId == roleId){
            meeting = v
          }
        })
        console.log(meeting)
        var info = meeting.info;//会议全部信息
        var meetingHead= info.meetingHeader;//会议头部信息
        var meetingBody = info.schedulesDays;//会议日程信息
  
        
        that.setData({
          meetingIntro:{ //会议头部信息
            cover: info.cover,//会议封面图
            title: meetingHead.title.length > 18 ? meetingHead.title.substring(0, 18) + '..' : meetingHead.title,//会议名称
            address: meetingHead.address,//会议地址
            meetingDuration: meetingHead.meetingDuration,//会议持续时间，显示在头部
            latlng: meetingHead.latlng//会议经纬度
          },
          durationDays: meetingHead.durationDays,//会议持续时间，显示在中间tab栏
          pptScheduleSessions : meetingBody,//会议所有天的总详情
          roleId:roleId
        })
        setTimeout(() => {
          that.getPptScheduleSession('#daySession0')
          that.setData({
            pageLoading: false
          })
        },300)
      } 
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  getPptScheduleSession(nodeType){
    var that = this;
    wx.createSelectorQuery().select('#daySession0').boundingClientRect(
      function (rect) {
      // var height = rect.height > 323 ? rect.height :323;
      var height =  rect.height;
      that.setData({
        pptScheduleSessionSholdHeight: height + 'px'
      })
     
    }).exec()
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
      title: this.data.meetingIntro.title,
      path: '/dist/pages/ppt-schedule/ppt-schedule?roleId='+this.data.roleId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})