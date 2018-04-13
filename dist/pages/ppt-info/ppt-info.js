// pages/index/index.js
var pptInfo = require('../../../data/ppt-info.js') //ppt详情静态数据
var util = require('../../../utils/util.js') //获取用户登陆授权
var app = getApp();
var globalData = app.globalData; //全局data
const g_baseUrl = globalData.g_baseUrl //全局域名
var avarageWidth = 0; //每个星星的平均宽度（物理像素）

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageLoading: true,
    windowWidth:0,//屏幕宽度
    userInfo:{},//储存在本地的用户信息
    pptId: 0,  //当前页面ppt的id
    /**
     *pptInfo头部信息 
     */
    pptUrl:'',//ppt在服务器的地址
    pptInfoHeadData: { 
      // title: '未来城市轨道交通发展趋势',
      // creatorImg: '/images/2.png',
      // creatorName: 'ripple',
      // pubTime: '2017/12/19',
      // clickCount: 2182,
      // collectCount: 285
    },
    checkPptCollect:false,//是否收藏
    /**
     *ppt轮播图动画 
     */
    cover:'',
    styleListenByScorll:'position:absolute;',
    pptCountAnimationData: {},//ppt详情count组件动画data
    current: 0, //轮播图当前显示的的index
    pptUrl:'',//ppt元文件路径
    swiperList: { //ppt轮播图滑块数据
      circular: true,
      duration: 600,
      imgList: []
    },
    imgSwiperHeight:'height:210px;',
    /**
     *tab选项卡，底部内容区域 
     */ 
    extendMarginTop:'margin-top:420rpx;',
    extendIdx: 0, //扩展内容个tab选项卡索引
    tabCurrentIdx:0,//tab选项卡索引
    pptInfoTab:pptInfo.pptInfoTab,  //tab选项卡信息
    swiperHeight:'473rpx',
    comentPage:false,
    comments:[],//评论
    pptIntro: '',//ppt简介
    comments:[ //所有评论列表
      // {
      //   headImg: '/images/1.png',
      //   nickName: 'Yong Funy',
      //   content: '静眼观世界，触探人生路',
      //   checkPraise: false,
      //   praiseNum: 133,
      //   time: '2017/12/19',
      //   id: 0,
      //   animationData:{},
      //   animationExtraData: {}
      // }
    ],
    commentContent:'',//评论内容
    score:{
      scoreNum: 4,//ppt评分
      scoreImg: '/images/point_4.png'//评分背图片
    }
  },
  /**
   *ppt收藏 
   */
  pptCollect (event){
    var that = this;
    var data = this.data;
    var checkPptCollect = data.checkPptCollect;
    var userInfo = data.userInfo;
    console.log(userInfo)

    if(!wx.getStorageSync('userData')){
      util.login(collect)
      return
    }else{
      collect()
    }
    function collect(){
      if (checkPptCollect) {
        request(false)
      } else {
        request(true)
      }
      function request(action) {
        var userInfo = JSON.parse(wx.getStorageSync('userData'))
        wx.request({
          url: g_baseUrl + '/pptxzs/collectppt.json?user_id=' + userInfo.user_id + '&user_key=' + userInfo.user_key,
          data: {
            collect: action,
            ppt_id: data.pptId
          },
          method: "POST",
          success: function (res) {
            var data = res.data
            if (data.ret === 0) {
              checkPptCollect = !checkPptCollect
              wx.showToast({
                title: checkPptCollect ? '收藏成功' : '取消收藏',
                icon:'success'
              })
              that.setData({
                checkPptCollect
              })
            } else {
              wx.showModal({
                content: data.msg,
                showCancel:true
              })
            }
          }
        })
      }
    }
   
   
  },
  /**
   *自定义函数，ppt轮播图部分 
   */
  showCount (){ //触摸轮播图显示count组件 
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
  hideCount (){ //离开轮播图隐藏count组件
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
  swiperChange (event) {//监听轮播图变化，给count组件当前index赋值
    var current = event.detail.current
    this.setData({
      current
    })
    var imgUrls = this.data.swiperList.imgList
    imgUrls[current] = this.data.picResource[current]
    this.setData({
      swiperList:{
        circular: true,
        duration: 600,
        imgList: imgUrls
      }
    })
    this.chagngeSwiperStyle(this.data.picResource[current])
  },
  pptFullScreen(event){
    var pptUrl = this.data.pptUrl;
    wx.showLoading({
      title: '正在加载文件...'
    })
    if(!pptUrl){
      wx.showToast({
        title: '准备ppt中，敬请期待...'
      })
      return
    }


    wx.downloadFile({
      url: pptUrl,
      success: function (res) {
        wx.hideLoading()
        wx.openDocument({
          filePath: res.tempFilePath,
          success: function (res) {
          },
          fail(err){
           wx.showToast({
             title: err
           })
          }
        })
      }
    })

    // var picList = this.data.picResource;
    // picList = JSON.stringify(picList)
    // wx.navigateTo({
    //   url: "/dist/pages/ppt-full-screen/ppt-full-screen?picList=" + picList,
    // })
    
  },
  priewSwiperImg(){
    var picList = this.data.picResource;
    wx.previewImage({
      current: picList[0], // 当前显示图片的http链接
      urls: picList // 需要预览的图片http链接列表
    })
  },
  /**
   *tab切换，展示详情
   */ 
  changeIntro (event){ 
    var idx = event.currentTarget.dataset.idx;//改变当前currentIdx为触发事件的Idx从而改变Tab模板样式
    this.setData({
      extendIdx:idx,
      tabCurrentIdx:idx
    })
  },
  /**
   *左右滑动内容区域，改变tab索引 
   */
  extendChange (event){
    switch (event.detail.current){
      case 0 :
        this.setData({
          comentPage: false
        })
        this.getRect('#ppt-info-intro');//改变底部content区域高度
        break;
      case 1:
        this.setData({
          comentPage:true
        })
        this.getRect('#ppt-info-comment');
        break;
      case 2:
        this.setData({
          comentPage: false
        })
        this.getRect('#ppt-info-score');
        break;
    }
    this.setData({
      tabCurrentIdx:event.detail.current
    })
  },
  /**
   *滚动加载更多评论
   */
  loadMoreComment (){
  },
  praise (event){ //点赞
    var dataSet = event.currentTarget.dataset//将dataset储存为变量
    var id = dataSet.id; //获取当前评论id
    if ('NAN' === id){ //阻止对自己刚发的评论点赞
      return
    }
    var idx = dataSet.idx; //获取当前评论索引
    var checkPraise = dataSet.checkpraise;//是否已经被点赞
    var comments = this.data.comments;//所有评论
    var animationExtraData = wx.createAnimation({//创建加1特效
      duration:1000
    })
    animationExtraData.opacity(1).step({//加1第一步，使得不透明度为1
      duration:100
    })
    animationExtraData.opacity(0).bottom('80rpx').step({//加1第二步，使加1向上位移
      duration:1000
    })
    animationExtraData.bottom('10rpx').step({ //变为初始状态，便于二次点赞重复相同动画
      duration: 0
    })
    var animationData = wx.createAnimation({//创建点赞放大特效
      duration: 1000
    })
    animationData.scale(1.5).step({
      duration:400
    })
    animationData.scale(.8).step({
      duration:150
    })
    animationData.scale(1).step({//动画最后一步还原，使得下次点击重复执行相同动画
      duration:150
    })
    comments.forEach(v =>{ //将已经加载有动画的对象清空
      v.animationExtraData = {};
      v.animationData = {};
    })
    if(!checkPraise){
      comments[idx].checkPraise = true ;//切换当前点赞状态
      comments[idx].praiseNum = comments[idx].praiseNum + 1;
      comments[idx].animationExtraData = animationExtraData.export();//输出当前动画到当前操作对象
      comments[idx].animationData = animationData.export();//输出当前动画到当前操作对象
    }else{
      comments[idx].checkPraise = false; //切换当前点赞状态

      comments[idx].praiseNum = comments[idx].praiseNum - 1;
    }

    this.setData({
      comments
    })
    // wx.request({ 向服务端发送点赞请求

    // })
  },
  getComment (event){
    var commentContent = event.detail.value;//当前所有评论
    this.setData({
      commentContent
    })
  },
  comment(event){
    var userData = wx.getStorage('userData')
    if (!userData){
      this.getRightThroughUser(this.renderComment)
    }else{
      this.renderComment(userData)
    }
  },
  renderComment(userData) { //渲染评论到评论区
    var comment = this.data.commentContent;
    var newCommentContent = {
      headImg: userData.avatarUrl,
      nickName: userData.nickName,
      content: comment ,
      checkPraise: false,
      praiseNum: 0,
      time: '1分钟前',
      id: 'NAN'
    }
    if (!comment){ //评论为空时不发送
      return
    }
    var comments = this.data.comments; //当前所有评论
    comments.push(newCommentContent)
    comments.forEach(v =>{ //将已经加载有动画的对象清空
      v.animationExtraData = {};
      v.animationData = {};
    })
    this.setData({
      comments
    })
    setTimeout(() => { //异步获取变化后的评论高度，在setData阶段的时候getRect()函数已经执行
      this.getRect('#ppt-info-comment');//重新初始化extend内容区高度
    },300)

    // wx.request({//向服务端发送评论

    // })
  },
  /**
   *打分
   */ 
  scoreStart (event){//触摸打分
    this.checkScorePosition(event)
  },
  scoreMove (event){//滑动打分
    this.checkScorePosition(event)
  },
  scoreEnd(event){
   
  },
  getPptPics(pptId) {//根据pptId获取ppt信息
    var userData = wx.getStorageSync('userData');
    var url='';
    if (userData){
      url =  '&user_id=' + JSON.parse(userData).user_id + '&user_key=' + JSON.parse(userData).user_key 
    }else{

    }
  
    wx.request({
      url: g_baseUrl + '/pptxzs/pptpicfile.json?ppt_id=' + pptId + url,
      method: "GET",
      success: (res) => {
        var pptInfo = res.data.data.ppt
        var picResource = pptInfo.pic_list//图片url数组
        var reg = /\.(pptx|potx|ppt|pot|pdf|pptm|potm|ppsx|ppsm|pps|ppam|ppa)$/gi
        var imgUrls = [];
        picResource.forEach((v, i) => { //设置gif的张数
          imgUrls[i] = '../../../images/loading_01.gif'
        })
      
        var cover = pptInfo.cover ? pptInfo.cover : picResource[0] ||'https://cos-bi-ppt-1252899312.cos.ap-shanghai.myqcloud.com/pptxzs/ppt/2018-02-02/m6Acnef92Fs8EG5J.jpg';//ppt封面图，如果没有选择ppt的第一张图
        var pptUrl = pptInfo.url
        var pptInfoHeadData={
            title: pptInfo.title.replace(reg,''),
            creatorImg: pptInfo.auth_head || pptInfo.owner_head,
            creatorName: pptInfo.auth_name || pptInfo.owner_name,
            pubTime: pptInfo.create_time.split(' ')[0],
            // clickCount: 2182,
            // collectCount: 285
        }
        imgUrls[0] = picResource[0]
        this.setData({
          // swiperList: {
          //   circular: true,
          //   duration: 600,
          //   imgList: imgUrls
          // },
          pptInfoHeadData,
          cover,
          picResource,//文件解析后的图片地址
          pptUrl,
          pptIntro: pptInfo.desc,
          checkPptCollect: pptInfo.collect
        })
        this.chagngeSwiperStyle(cover)
      }
    })
  },
  chagngeSwiperStyle(url) { //获取原ppt图片的高度,用来让swiper高度自适应
    wx.getImageInfo({
      src: url,
      success: (res) => {
        var ratio = res.height / res.width
        var windowWidth = this.data.windowWidth
        var height = windowWidth * (res.height / res.width)
        // height = height<210?210:height
        this.setData({
          imgSwiperHeight: 'height:' + height + 'px;'
          ,
          extendMarginTop:'margin-top:' + height +'px;'
        }) 
        setTimeout(() => {
          this.setData({
            pageLoading: false
          })
        }, 200)
      }
    })
  },
  /**
   *设置extend内容区的高度
   */ 
  getRect (nodeId) {
    var that = this;
    wx.createSelectorQuery().select(nodeId).boundingClientRect(function (rect) {
      var height = rect.height < 236 ? 236 : rect.height;
      that.setData({
        swiperHeight: height*2 + 'rpx'
      })
    }).exec()
  },
  getScoreWidth (){ //获取星星物理像素宽度
    wx.createSelectorQuery().select('#score').boundingClientRect(function (rect) {
     avarageWidth = rect.width / 5  //5为有5颗星星
    }).exec()
  },
  getPptHeadHeight (){//获取ppt头部高度，用来滚动隐藏ppt头部
    var that = this;
    wx.createSelectorQuery().select('#head-container').boundingClientRect(function (rect) {
      that.setData({
        pptHeadHeight : rect.height
      })
    }).exec()
  },
  checkScorePosition(event){ //滑动评分方法
    var offsetLeft = event.currentTarget.offsetLeft;//星星距离屏幕左边距离
    var eventData = event.touches;
    if (1 === eventData.length) {
      var starDis1 = avarageWidth; //星星1的位置
      var starDis2 = avarageWidth * 2; //星星2的位置
      var starDis3 = avarageWidth * 3;  //星星3的位置
      var starDis4 = avarageWidth * 4;  //星星4的位置
      var starDis5 = avarageWidth * 5;  //星星5的位置

      var leftLength = eventData[0].clientX - offsetLeft; //鼠标到星星左边距离
      var scoreRange = 0; //星星评分等级
      if (leftLength > 0 && leftLength < avarageWidth) { //根据用户点击在屏幕的位置，获取用户想要的评分
        scoreRange = 0
      } else if (leftLength >= starDis1 && leftLength < starDis2) {
        scoreRange = 1
      } else if (leftLength >= starDis2 && leftLength < starDis3) {
        scoreRange = 2;
      } else if (leftLength >= starDis3 && leftLength < starDis4) {
        scoreRange = 3;
      } else if (leftLength >= starDis4 && leftLength < starDis5) {
        scoreRange = 4;
      } else {
        return
      }
      switch (scoreRange) { //根据评分等级改变背景图和评分数
        case 0: // 1星
          this.setData({
            score: {
              scoreNum: 1,
              scoreImg: '/images/point_1.png'
            }
          })
          break;

        case 1:// 2星
          this.setData({
            score: {
              scoreNum: 2,
              scoreImg: '/images/point_2.png'
            }
          })
          break;

        case 2:// 3星
          this.setData({
            score: {
              scoreNum: 3,
              scoreImg: '/images/point_3.png'
            }
          })
          break;

        case 3:// 4星
          this.setData({
            score: {
              scoreNum: 4,
              scoreImg: '/images/point_4.png'
            }
          })
          break;

        case 4:// 5星
          this.setData({
            score: {
              scoreNum: 5,
              scoreImg: '/images/point_5.png'
            }
          })
          break;
      }
    }
  },
  onPageScroll :function(scrollData){ //滚动改变ppt轮播图定位超过头部高度为fixed，低于头部高度为absolute
    var styleListenByScorll = scrollData.scrollTop > this.data.pptHeadHeight ? 'position:fixed;top:0;' : 'position:absolute;';//监听滚动距离，改变ppt轮播图的定位
    this.setData({
      styleListenByScorll
    })
  },
  commentToSevice(data){ //发送评论到服务端，在关闭页面时执行
    wx.request({
      url:'',
      data:data,
      method:'POST',
      dataType:'json',
      success: res =>{
      },
      fail: err =>{
      }
    })
  },
  getSystemInfo(){
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowWidth: res.windowWidth
        })
      }
    })
  },
  /*
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    console.log(options)
    var pptId = options.scene ? decodeURIComponent(options.scene) : options.pptId;
    console.log(pptId) 
    this.setData({
      pptId
    })
    this.getPptPics(pptId)
    // this.getPptInfoData(pptId); //获取ppt信息
    this.getSystemInfo();//获取屏幕信息
  },
  onShow:function(){
    this.setData({
      userInfo:JSON.parse(wx.getStorageSync('userData')||'{}')
    })
  },
  onHide :function(){
    console.log('页面被关闭')
  },
  onShareAppMessage:function(res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.pptInfoHeadData.title,
      path: '/dist/pages/ppt-info/ppt-info?pptId=' + this.data.pptId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  createImg() {
    wx.showLoading({
      title: '正在生成...',
    })
    var that = this
    var data = this.data
    var pptInfo = data.pptInfoHeadData

    var cover = data.cover
    var title = pptInfo.title
    var author = pptInfo.creatorName
    var pptId = data.pptId
    var titleImgUrl = '../../../images/ppt-1_03.png';
    var autherImgUrl = '../../../images/ppt-1_06.png';

    var page = "dist/pages/ppt-info/ppt-info";
    var config = {
      cover, title, author, pptId, titleImgUrl, autherImgUrl, page
    };

    util.getQrCode(config)

  }
})