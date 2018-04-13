// dist/pages/my-ppt/my-ppt.js
var pptInfo = require('../../../data/ppt-info.js') //ppt详情静态数据
var util = require('../../../utils/util.js') //获取用户登陆授权
var app = getApp();
const globalData = app.globalData;
const g_baseUrl = app.globalData.g_baseUrl //全局域名

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isIpx: getApp().globalData.isIpx,//检测是否为iPx
    screenHeight:0,//屏幕高度
    bottomTouch:true,//是否触摸底部更多按钮
    isScroll:true,//是否允许滚动
    isScrollLoadingMore:true,//是否滚动加载更多
    isShowMask:true,//是否显示弹窗
    operateListIdx:0,//当前操作的item的索引
    pptId:0,//
    moreLists:[//每个item的更多操作
      {
        text:'生成图片'
      },
      {
        text: '删除'
      }
    ],
    isLoadingMore:true,//滚动加载更多
    extendScroll:[],//左滑动删除
    // 
    pageLoading: true,
    userInfo: { //用户信息
      headimgurl:'',
      nickname:'未登录'
    },
    tabCurrentIdx: 0,//tab选项卡索引
    myMidTab: pptInfo.myCenterMidTab,//选项卡数据中间
    myPptList:[ //我的ppt列表信息
    ],
    myPptCollect: [ //我的收藏ppt列表信息
    ],
    pptListPageNum:0,
    pptCollectPageNum:0
  },
  /**
   * 自定义js
   */
  navToPptInfo (event) { //进入ppt详情页面
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/dist/pages/ppt-info/ppt-info?pptId='+id,
    })
  },
  changeTab (event) { //改变tab选项
    var idx = event.currentTarget.dataset.idx || 0;
    var extendChangeLeft;//extend内容区域相对于父容器的左便宜
    var tabCurrentIdx = this.data.tabCurrentIdx;
    this.setData(
      {
        tabCurrentIdx : idx,
        isScrollLoadingMore: true
      }
    )
    if (tabCurrentIdx != idx) {//切换时候刷新
     setTimeout(()=>{
       this.refreshList()
     },100) 
    }
    var moreLists = this.data.moreLists
    if (idx===0){
      moreLists[1].text = '删除'
      this.setData({
        moreLists
      })
    }else if(idx===1){
      moreLists[1].text = '取消收藏'
      this.setData({
        moreLists
      })
    }else if(idx === 2){
     
    }
   
  },
  moreItemTap(tapIndex) {//点击tap栏，触发生成图片、和删除ppt、取消收藏
    var data = this.data;
    let idx = tapIndex;
    var operateListIdx = data.operateListIdx;
    var tabCurrentIdx = data.tabCurrentIdx
   
    var userInfo = data.userInfo
    var userId = userInfo.user_id;
    var userKey = userInfo.user_key;
    var pptId = data.pptId;
    if (tabCurrentIdx === 0){ //处于我的ppt的时候
      var myPptList = data.myPptList; //测试用的回调

      if (idx===0){//按的第一个生成图片
        pptInfo = myPptList[operateListIdx]
        var cover = pptInfo.cover
        var title = pptInfo.title
        var author = pptInfo.author
        var pptId = data.pptId
        var titleImgUrl = '../../../images/ppt-1_03.png';
        var autherImgUrl = '../../../images/ppt-1_06.png';
        var page = "dist/pages/ppt-info/ppt-info";
        var config = {
          cover, title, author, pptId, titleImgUrl, autherImgUrl, page
        };
      
        createImg(config)
      } else if (idx === 1) {//按的第二个删除
        wx.showModal({
          title: '是否永久删除此文件',
          content: '删除后不可以恢复',
          success:(res)=>{
            if(res.confirm){
              deleteItem(cb)
            }
          }
        })
        function cb(){//删除后的回调
          myPptList.splice(operateListIdx, 1)
          that.setData({
            myPptList
          })
        }
      }
    } 
    else if (tabCurrentIdx === 1){
      var myPptCollect = data.myPptCollect; //测试用的回调
      if (idx === 0) {
        pptInfo = myPptCollect[operateListIdx]
        var cover = pptInfo.cover
        var title = pptInfo.title
        var author = pptInfo.author
        var titleImgUrl = '../../../images/ppt-1_03.png';
        var autherImgUrl = '../../../images/ppt-1_06.png';
        var page = "dist/pages/ppt-info/ppt-info";
        var config = {
          cover, title, author, pptId, titleImgUrl, autherImgUrl,page
        };

        createImg(config)
      } else if (idx === 1) {

       
        cancelCollect(cb)
        function cb() {
          myPptCollect.splice(operateListIdx, 1)
          that.setData({
            myPptCollect
          })
        }
      }
    }
 
    var that = this
    function deleteItem(callback){
      wx.request({
        url: g_baseUrl + '/pptxzs/pptpicfile.json?user_id=' + userId + '&user_key=' + userKey ,
        method: 'DELETE',
        data: {
          ppt_id: pptId
        },
        success: res => {
          callback && callback()
        }
      })
    }
    function cancelCollect(callback){//取消收藏
      wx.request({
        url: g_baseUrl + '/pptxzs/collectppt.json?user_id=' + userId + '&user_key=' + userKey ,
        data: {
          collect: false,
          ppt_id:pptId
        },
        method: "POST",
        success: function (res) {
          var data = res.data
          if (data.ret === 0) {
            callback && callback()
          } else {
            wx.showModal({
              content: data.msg
            })
          }
        }
      })
    }
    function createImg() {
      wx.showLoading({
        title: '正在生成...',
      })
      util.getQrCode(config)
    }
  },
  showMoreList(event){//点击三个点‘...’出现弹窗

    var data = this.data
    var dataSet = event.currentTarget.dataset;
    var tabCurrentIdx = data.tabCurrentIdx
    var idx = dataSet.idx; //ppt列表当前项索引
    var pptId = dataSet.id; //ppt列表当前id

    this.setData({
      operateListIdx: idx,
      pptId
    })

    if(tabCurrentIdx === 0){
      var isShowMask = this.data.isShowMask;
      wx.showActionSheet({
        itemList: ['生成图片', '删除'],
        success: res => {
          this.moreItemTap(res.tapIndex)
        }
      })
      
    } else if (tabCurrentIdx === 1){
      var isShowMask = this.data.isShowMask;
      this.setData({
        operateListIdx: idx,
        pptId
      })
      wx.showActionSheet({
        itemList: ['生成图片', '取消收藏'],
        success: res => {
          this.moreItemTap(res.tapIndex)
        }
      })
    }
  },
  getMyPptList(pageNum,api){ //获取我的ppt列表
    var userData = JSON.parse(wx.getStorageSync('userData'))
    this.setData({
      userInfo: userData
    })
    var data = this.data
    wx.request({
      url: g_baseUrl + '/pptxzs/'+api+'.json?user_id=' + userData.user_id + '&user_key=' + userData.user_key,
        method:'GET',
        data:{
          'page_size': 10,
          'page_num': pageNum
        },
        success:res=>{
          var ppt_list = res.data.data.ppt_list;
          if (!ppt_list.length && pageNum>0){
              this.setData({
                isScrollLoadingMore:false
              })
          }
          var arr=[];
          ppt_list.forEach((v,i)=>{
            var picList = v.pic_list||[]
            var cover = v.cover || picList[0] || 'https://cos-bi-ppt-1252899312.cos.ap-shanghai.myqcloud.com/pptxzs/ppt/2018-02-02/m6Acnef92Fs8EG5J.jpg'
            arr[i] = {
              title: v.title,
              imgsrc: "/images/ppt-logo.png",
              time: v.create_time.split(' ')[0],
              id:v.ppt_id,
              prop: api === 'pptpicfile'?'list':'collect',
              isShowMoreList:true,
              author: v.auth_name || v.owner_name,
              head: v.auth_head || v.owner_head,
              cover
            }
          })
        
          if (api === 'pptpicfile'){
            var pptList = data.myPptList
            if (pageNum===0){
              pptList=arr
            }else{
              pptList.push(...arr)
            }
            
            var pptListPageNum = data.pptListPageNum + 1
            this.setData({
              myPptList: pptList,
              pptListPageNum
            })
          }else{
            var pptList = data.myPptCollect
            if (pageNum === 0) {
              pptList = arr
            } else {
              pptList.push(...arr)
            }
            var pptCollectPageNum = data.pptCollectPageNum + 1
            this.setData({
              myPptCollect: pptList,
              pptCollectPageNum
            })
          }
         
        },
        complete:res=>{
          wx.stopPullDownRefresh()
          this.setData({
            isLoadingMore: true
          })
        }
      })
  },
  login(){//点击头像登陆
    var that = this
    util.login(function () {
      that.getMyPptList(0, 'pptpicfile')
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (){
    var that = this
    util.login(function(){
      that.getMyPptList(0, 'pptpicfile')
    })
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        var screenHeight = this.data.screenHeight
        screenHeight = res.screenHeight
        this.setData({screenHeight})
      },
    })
  },
  loadingMore:function(){ //上拉加载
    var data = this.data
    console.log(data.isScrollLoadingMore)
    if (!data.isScrollLoadingMore){//如果滚动到底部，不让加载
      return
    }


    if (data.tabCurrentIdx === 0){
      this.setData({
        isLoadingMore:false
      })
      this.getMyPptList(this.data.pptListPageNum, 'pptpicfile')
    } else if (data.tabCurrentIdx === 1) {
      this.setData({
        isLoadingMore: false
      })
      this.getMyPptList(this.data.pptCollectPageNum, 'collectppt')
    }
  },
  refreshList:function(){ //下拉刷新
    var tabCurrentIdx = this.data.tabCurrentIdx
    if (tabCurrentIdx===0){
      this.setData({
        pptListPageNum: 0
      })
      this.getMyPptList(0, 'pptpicfile')
    } else if (tabCurrentIdx === 1){
      this.setData({
        pptCollectPageNum: 0
      })
      this.getMyPptList(0, 'collectppt')
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'PPT小助手',
      path: 'dist/pages/my-ppt/my-ppt',
      success: function (res) {
        console.log(res)
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onShow(){
   
  }
})