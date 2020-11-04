// pages/mine/myInviNumber/myselfQRcode.js
var app = getApp();
var util = require('../../../utils/util.js');
import config from '../../../config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_id = app.globalData.user.user_id;
    var page = 'pages/shouye/redHongBao';
    var str = user_id + ',' + 'ThreePage' + ',' + 'QRcode';

    //圆形小程序二维码
    // var scene = encodeURIComponent(str);
    // var qrcodeimg = config.Host + "wxcxPush/getQRCode?" + config.Version + "&scene=" + scene + '&page=' + page;

    // this.setData({
    //   qrcodeimg: qrcodeimg,
    //   user_id: user_id
    // })
    // this.cretCanvasQRcode(qrcodeimg);

    //普通小程序二维码
    var scenePage = 'pages/shouye/redHongBao?scene=' + str;
    //获取个人二维码
    util.get_qrcodehttp(scenePage,function(data){
      if(data.status == 1)
      {
        var imageurl = config.Upyun + data.imgUrl;
        that.setData({
          qrcodeimg: imageurl,
        })
        // that.cretCanvasQRcode(imageurl);
        that.cretNewCanvasQRcode(imageurl);
      }
    })
  },


  //保存二维码
  saveQRcode:function(e){
    var that = this;
    var first = wx.getStorageSync('first');
    wx.getSetting({
      success(res) {
        // 进行授权检测，未授权则进行弹层授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveCanvasQRcode();
            },
            // 拒绝授权时，则进入手机设置页面，可进行授权设置
            fail() {
              if (first == undefined || first == '' || first == null)
              {
                wx.setStorageSync('first', '1');
              }else{
                wx.showModal({
                  title: '是否授权使用相册',
                  content: '需要使用您的相册，请确认授权，否则相册功能将无法使用',
                  success: function (tip) {
                    if (tip.confirm) {
                      wx.openSetting({
                        success: function (data) {
                          if (data.authSetting["scope.writePhotosAlbum"] == true) {
                            //授权成功之后，再调用保存图片
                            that.saveCanvasQRcode();
                          } else {
                            wx.showToast({
                              title: '授权失败',
                              icon: 'success',
                              duration: 1000
                            })
                          }
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        } else {
          // 已授权则直接进行保存图片
          that.saveCanvasQRcode()
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },

  //生成合成的二维码
  cretCanvasQRcode: function (qrcodeimg){
    const wxGetImageInfo = wx.getImageInfo({
      src: qrcodeimg,
      success(res) {
        //二维码
        const ctx = wx.createCanvasContext('shareCanvas')
        ctx.drawImage(res.path, 0, 0, 100, 110)

        wx.getImageInfo({
          src: config.Upyun + 'small-iconImages/heboImg/newqrcodde_smallredhongbao.png',
          success(res) {
            // logo
            const qrImgSize = 25
            ctx.drawImage(res.path, (100 - qrImgSize) / 2, (110 - qrImgSize) / 2-6.5, qrImgSize, qrImgSize)
            ctx.setTextAlign('center')
            ctx.stroke()
            ctx.draw()
          }
        })
      }
    })
  },
  //生成新的合成二维码
  cretNewCanvasQRcode: function (qrcodeimg) {
    var that = this;
    const wxGetImageInfo = wx.getImageInfo({
      src: config.Upyun + 'small-iconImages/heboImg/newmyself_spacehongbao.png!450',
      success(res) {
        //背景图
        const ctx = wx.createCanvasContext('newshareCanvas')
        ctx.drawImage(res.path, 0, 0, 323, 421)

        wx.getImageInfo({
          src: qrcodeimg,
          success(res) {
            //二维码
            ctx.drawImage(res.path, (323-100)/2, 280, 100, 110)

            wx.getImageInfo({
              src: config.Upyun + 'small-iconImages/heboImg/newqrcodde_smallredhongbao.png',
              success(res) {
                // logo
                const qrImgSize = 25
                ctx.drawImage(res.path, (323 - qrImgSize) / 2, 273+(110-qrImgSize)/2, qrImgSize, qrImgSize)

                wx.getImageInfo({
                  src: config.Upyun + 'small-iconImages/heboImg/newmyself_qrcodehongbao.png',
                  success(res) {
                    // 遮挡
                    const spaceWidth = 110;
                    const spaceHeigh = 20;

                    ctx.drawImage(res.path, (323 - spaceWidth) / 2, 375, spaceWidth, spaceHeigh)
                    ctx.setTextAlign('center')
                    ctx.stroke()
                    ctx.draw()

                    that.setData({
                      showBtn:true
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  },

  //保存合成的二维码
  saveCanvasQRcode:function(){
    wx.canvasToTempFilePath({
      canvasId: 'newshareCanvas',
      success(res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            wx.showToast({
              title: '保存失败',
              icon: 'success',
              duration: 2000
            })
          },
          complete(res) {
            console.log(res);
          }
        })
      }
    })
  },

  //下载图片进度条
  get_QRcode: function (codepage) {
    var that = this;
    var user_id = (app.globalData.user != null && app.globalData.user != undefined) ? app.globalData.user.user_id : '';

    var str = user_id + ',' + 'ThreePage' + ',' + 'QRcode';

    var scene = encodeURIComponent(str);

    var imgSrc = config.Host + "wxcxPush/getQRCode?" + config.Version + "&scene=" + scene + '&page=' + codepage;
    imgSrc = 'https://www.incursion.wang/small-iconImages/heboImg/myself_QRcode.png';
    console.log('imgSrc=' + imgSrc);
    const downloadTask = wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            wx.showToast({
              title: '保存失败',
              icon: 'success',
              duration: 2000
            })
          },
          complete(res) {
            console.log(res);
          }
        })
      }
    })
    downloadTask.onProgressUpdate((res) => {
      var progress = '';
      if (res.progress === 100) {
        progress = '';
      } else {
        progress = res.progress + '%';
      }

      that.setData({
        progress: progress
      })
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var user_id = app.globalData.user.user_id;
    var page = 'pages/shouye/redHongBao';
    var str = user_id + ',' + 'ThreePage' + ',' + 'QRcode';

    //普通小程序二维码
    var path = 'pages/shouye/redHongBao?scene=' + str;
    return {
      title: '199元购物红包免费抢，多平台可用，快来试试人品吧	👉',
      path: path,
      imageUrl: config.Upyun + 'small-iconImages/heboImg/freeling_share199yuan.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})