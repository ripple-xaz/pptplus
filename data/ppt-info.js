var pptInfoTab = { //评论详情tab页面
  texts:[
    {
      text:'简介',
      idx:0
    }
    // ,
    // {
    //   text:'评论(6)',
    //   idx:1
    // },
    // {
    //   text:'评分(4.7)',
    //   idx:2
    // }
    ]
};
var myCenterMidTab = {
  tabItems: [
    {
      img: "/images/my-ppt_01.png",
      activeImg: "/images/my-ppt_02.png",
      text: '我的PPT',
      idx:0
    }
    ,
    {
      img: "/images/my_collection_01.png",
      activeImg: "/images/my_collection_02.png",
      text: '我的收藏',
      idx: 1
    }
    ,
    {
      img: "/images/my-upload_01.png",
      activeImg: "/images/my-upload_02.png",
      text: '上传PPT',
      idx:2
    }
  ]
}

module.exports = {
  pptInfoTab, myCenterMidTab
}