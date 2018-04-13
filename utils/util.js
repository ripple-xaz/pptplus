var g_baseUrl = 'https://www.pptx.info';


function isEmptyObject(obj) {//检测对象是否为空对象
  for (var key in obj) {
    return false;
  }
  return true;
}
function getUserKey(userData, code, callBack){//从服务端获取user_key
  wx.request({ //将用户信息保存到服务器
    url: g_baseUrl + '/pptxzs/xcxlogin.json',
    method: "POST",
    data: {
      method:'xcx_pptxzs',
      user_data: userData,
      code: code
    },
    success: res => {
      wx.setStorageSync("userData", JSON.stringify(res.data.data))
      callBack && callBack(res.data.data)
    },
    fail: err => {
    }
  })
}
var getToken = (callBack) =>{ //获取用户加密信息
    wx.login({
        success: res => {
          //微信登陆成功
          var code = res.code;
          wx.getUserInfo({//获取用户信息
            withCredentials: true,
            success: res => {
              var userData = res
              getUserKey(userData, code, callBack)
            },
            fail:err=>{
              var that = this;
              // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
              wx.getSetting({
                success: function success(res) {
                  var authSetting = res.authSetting;
                  if (!isEmptyObject(authSetting)){
                    wx.showModal({
                      title: '您还没有授权登陆',
                      content: '是否设置允许获取您的头像和昵称',
                      success:res=>{
                          if(res.confirm){  //前往设置中心
                            if (authSetting['scope.userInfo'] === false) {
                              wx.openSetting({ //打开设置中心
                                success: function success(res) {
                                  if (res.authSetting["scope.userInfo"] === true) {
                                    wx.login({
                                      success: res => {
                                        //微信登陆成功
                                        var code = res.code;
                                        wx.getUserInfo({
                                          withCredentials: true,
                                          success: res => {
                                            var userData = res
                                            getUserKey(userData, code, callBack)
                                          }
                                        })
                                      }
                                    })
                                  }
                                }
                              });
                            }
                          }
                      }
                    })
                  }
                }
              });
            }
          })
        }
    })
}
var login = (callback)=>{//普通获取用户信息
  wx.checkSession({
    success: function (res) {
      var userInfo = wx.getStorageSync('userData')
      if (userInfo){
        callback && callback()
      }else{
        getToken(callback)
      }
    },
    fail: function () {
      getToken(function (res) {//获取用户信息
        callback && callback()
      })
    }
  })
}



// qr
function getQrCode(config) {
      wx.request({
        url: g_baseUrl + '/pptxzs/qrcode.json',
        method: 'POST',
        data: {
          page: config.page,
          scene: config.pptId,
          width: 73,
          line_color: { "r": "51", "g": "144", "b": "255" }
        },
        success: function (res) {
          var qrcodeUrl = res.data.data.url
          wx.getImageInfo({ //获取图片信息，从而得到图片的临时文件
            src: config.cover,
            success: function (res) {
              var coverPath = res.path;
              var coverWidth = res.width;
              var coverHeight = res.height;
              wx.getImageInfo({
                src: qrcodeUrl,
                success: function (res) {
                  var qrCodePath = res.path
                  wx.getSystemInfo({ //获取屏幕的宽高比，从而设置当前手机canvas字体大小，宽高比
                    success: function (res) {
                      var screenWidth = res.screenWidth
                      drawImg(coverPath, coverWidth, coverHeight, qrCodePath,screenWidth)
                    },
                  })
                  
                }
              })
            }
          })
        }
      })
      function drawImg(imgUrl, pWidth, pHeight, qrcodeUrl,screenWidth) {
       
        var cWidth = screenWidth;
        var pWidth = cWidth-32;

        var rat = pWidth / 347

        var pHeight = Math.min(pWidth * rat, 210 * rat);
        var cHeight = pHeight + 400;   //canvas有个最大高度，不能做自适应

        var qrWidth = 73 * rat;
        var qrLeft = cWidth - qrWidth - 16
        var qrTop = pHeight +70

        var titleSize = 16 * rat
        var titleCount = Math.floor((screenWidth -40) / titleSize)*2

        var ctx = wx.createCanvasContext('myCanvas');
        ctx.rect(0, 0, cWidth, cHeight)
        ctx.setFillStyle('white')
        ctx.fill()

        ctx.drawImage(imgUrl, 16, 16, pWidth, pHeight);

        ctx.drawImage(config.titleImgUrl, 16, pHeight +36, 15, 15);
        
        ctx.setFontSize(titleSize)
        ctx.setFillStyle('rgba(102,102,102,1)')
        var lineheight = 20;//canvas换行
        var title = config.title
        var reg = /\.(pptx|potx|ppt|pot|pdf|pptm|potm|ppsx|ppsm|pps|ppam|ppa)$/gi
        title = title.replace(reg,'')
        title = title.length > 40 ? title.substring(0, 30) + '...' : title
        
        var croLength = 0;
        for (var i = 1; getTrueLength(title) > 0; i++) {
          var tl = cutString(title, titleCount);
          ctx.fillText(title.substr(0, tl).replace(/^\s+|\s+$/, ""), 46, i * lineheight + pHeight+30);
          title = title.substr(tl);
          croLength = i
        }
        // ctx.fillText(config.title, 46, pHeight + 44, )


        var authorHeight;
        if (croLength<=1){
          authorHeight = pHeight + 60
        }else{
          authorHeight = pHeight + 80
        }

        var authorSize = 12 * rat
        ctx.drawImage(config.autherImgUrl, 16, authorHeight , 15, 15);
        ctx.setFontSize(authorSize)
        ctx.setFillStyle('rgba(102,102,102,1)')
        ctx.fillText(config.author, 46, authorHeight+13)


        var tipSize = 9 * rat
        ctx.setFontSize(tipSize)
        ctx.setFillStyle('rgba(102,102,102,0.8)')
        ctx.fillText('长按扫码查看详情', qrLeft + 4 * rat, qrTop + qrWidth + 10)
        ctx.drawImage(qrcodeUrl, qrLeft, qrTop, qrWidth, qrWidth);

        ctx.draw(true)
        setTimeout(() => {
          toPicture()
        }, 200)

        function toPicture() {
          wx.canvasToTempFilePath({//destHeight,destWidth会使得图片被压缩
            x: 0,
            y: 0,
            width: cWidth,
            height: cHeight,
            canvasId: 'myCanvas',
            success: function (res) {
              var path = res.tempFilePath
              if (wx.saveImageToPhotosAlbum) {
                wx.getSetting({
                  success: (res) => {

                    var authSetting = res.authSetting['scope.writePhotosAlbum']
                    if (authSetting != false) {
                      wx.previewImage({
                        current: path,
                        urls: [path],
                      })
                    } else {
                      wx.showModal({
                        title: '您还没有授权',
                        content: '是否设置允许获取保存图片到相册',
                        success: res => {
                          if (!res.confirm) {
                            return
                          }
                          wx.openSetting({ //打开设置中心
                            success: function success(res) {
                              if (res.authSetting["scope.writePhotosAlbum"] === true) {
                                wx.previewImage({
                                  current: path,
                                  urls: [path],
                                })
                              }
                            }
                          });
                        }
                      })
                    }
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                })
              }
              wx.hideLoading()
            }
          }, this)
        }
        function getTrueLength(str){//获取字符串的真实长度（字节长度）
          var len = str.length, truelen = 0;
          for (var x = 0; x < len; x++) {
            if (str.charCodeAt(x) > 128) {
              truelen += 2;
            } else {
              truelen += 1;
            }
          }
          return truelen;
        }
        function cutString(str, leng){//按字节长度截取字符串，返回substr截取位置
          var len = str.length, tlen = len, nlen = 0;
          for (var x = 0; x < len; x++) {
            if (str.charCodeAt(x) > 128) {
              if (nlen + 2 < leng) {
                nlen += 2;
              } else {
                tlen = x;
                break;
              }
            } else {
              if (nlen + 1 < leng) {
                nlen += 1;
              } else {
                tlen = x;
                break;
              }
            }
          }
          return tlen;
        }
      }
}
module.exports = {
  login,getQrCode
}