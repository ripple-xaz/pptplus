// dist/pages/ppt-full-screen/ppt-full-screen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picResource:[

    ],
    pptCountAnimationData: {},//ppt详情count组件动画data
    imgUrls: [
    ],
    isVertical:false,
    current:0,
    // startFirst_x:0,
    // startSecond_x: 0,
    // startFirstx_y:0,
    // startSecond_y: 0,
    // moveFirst_x: 0,
    // moveSecond_x: 0,
    // moveFirstx_y:0,
    // moveSecond_y2:0,
    // distFirst:0,
    scaleStyle:'transform: rotate(90deg) scale(1.4);'

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var picResource = JSON.parse(options.picList) 
    var imgUrls=[];
    console.log(picResource)
    picResource.forEach((v,i)=>{ //设置gif的张数
      imgUrls[i] = '../../../images/loading_01.gif'
    })
    imgUrls[0] = picResource[0]
    this.setData({
      picResource,
      imgUrls
    })
    setTimeout(()=>{
      this.chagngeImgStyle(0)
    },200)
    
  },
  swiperChange(event){
    var current = event.detail.current
    var imgUrls = this.data.imgUrls
    imgUrls[current] = this.data.picResource[current]
    this.setData({
      imgUrls
    })
    this.setData({
      current 
    })
    console.log(current)
    this.chagngeImgStyle(current)
  },
  chagngeImgStyle(current){
    var picResource = this.data.picResource;
    console.log(picResource[current])
    wx.getImageInfo({
      src: picResource[current],
      success: (res) => {   
        var isLength = (res.height/res.width) < 3/4
        console.log(isLength)
        if (isLength) {
          console.log('这是一个宽图')
          this.setData({
            isVertical: true,
            scaleStyle: 'transform: rotate(90deg) scale(1.4);'
          })
        } else {
          console.log('这是一个长图')
          this.setData({
            isVertical: false,
            scaleStyle: ''
          })
        }
      }
    })
  },
  showCount() { //触摸轮播图显示count组件 
    var animation = new wx.createAnimation({ //创建立即显示count组件动画
      duration: 0,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation;
    animation.opacity(1).backgroundColor('rgba(0,0,0,.5)').step(); //绘制显示动画
    this.setData({
      pptCountAnimationData: this.animation.export() //输出动画
    })
  },
  hideCount() { //离开轮播图隐藏count组件
    var animation = new wx.createAnimation({ //创建淡出count组件动画
      duration: 1000,
      timingFunction: "linear",
      delay: 300
    })
    this.animation = animation;
    animation.opacity(0).backgroundColor('rgba(0,0,0,0)').step();//绘制隐藏动画
    this.setData({
      pptCountAnimationData: this.animation.export() //输出动画
    })
  },
  scaleStart(event){
    var touchData = event.touches
    if (touchData.length === 2) {
      // this.startFirst_x = touchData[0].pageX;
      // this.startSecond_x = touchData[1].pageX;
      // this.startFirst_y = touchData[0].pageY;
      // this.startSecond_y = touchData[1].pageY;
      // var distFirstSquare = this.startFirst_x * this.startFirst_x + this.startFirst_y * this.startFirst_y - this.startSecond_x * this.startSecond_x + this.startSecond_y * this.startSecond_y
      // this.distFirst = Math.sqrt(distFirstSquare)
    }
  },
  scaleMove(event){
    // var touchData = event.changedTouches;
    // if(touchData.length === 2){
    //   this.moveFirst_x = touchData[0].pageX;
    //   this.moveSecond_x = touchData[1].pageX;
    //   this.moveFirst_Y = touchData[0].pageY;
    //   this.moveSecond_Y = touchData[1].pageY;
    //   var distSecondSquare = this.moveFirst_x * this.moveFirst_x + this.moveFirst_Y * this.moveFirst_Y - this.moveSecond_x * this.moveSecond_x + this.moveSecond_Y * this.moveSecond_Y
    //   var distSecond = Math.sqrt(distSecondSquare)
    //   console.log(distSecond)
    //   console.log(this.distFirst)
    //   var scale = distSecond - this.distFirst
    //   var scale_a = (1.5+scale/10)|0
    //   if (scale>0){
    //     console.log('放大')
    //     console.log(scale_a)
    //     this.scaleStyle = 'transform: rotate(90deg) scale(1.5'+scale_a+');'
    //     console.log(this.scaleStyle)
    //   }else{
    //     console.log('缩小')
    //   }
    // }
  },
  scaleEnd(e){
    console.log(e)
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