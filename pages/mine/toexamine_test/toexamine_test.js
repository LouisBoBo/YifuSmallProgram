// pages/mine/toexamine_test/toexamine_test.js
import config from '../../../config.js';
var util = require('../../../utils/util.js');
var showHongBao = require('../../../utils/showNewuserHongbao.js');
var app = getApp();
var animationTimer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upyconfig: config.Upyun,
    Upyun: config.Upyun,
    redHongBaoImg: config.Upyun + 'small-iconImages/heboImg/free_199yuancoupon.png!450',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.parent_id) {
      app.parent_id = options.user_id;
    }
    
    this.hongBaoAnimation();

    var pagestyle = '3';//1赚钱页面 2商品详情页 3免费领列表
    var navtitle = '新人钜惠';
    if(options.showSignPage == 'true')
    {
      pagestyle = '1';
      navtitle = '活动奖励';
    } else if (options.showDetailPage == 'true')
    {
      pagestyle = '2';
      navtitle = '商品详情';
    }
    wx.setNavigationBarTitle({
      title: navtitle,
    })
    var shareComeFromRedHongBao;  
    if (app.globalData.user != null && app.globalData.user.userToken != undefined)//登录
    {
      shareComeFromRedHongBao = false;

      var url = '';
      if (pagestyle == '1') {
        url = "/pages/sign/sign?isShareFlag=true&user_id=" + app.globalData.user.user_id + "&showSignPage=true";
      } else if(pagestyle == '2'){
        url = "/pages/shouye/detail/detail?shop_code=" + options.shop_code + "&isShareFlag=true&user_id=" + app.globalData.user.user_id;
      } else {
        url = "/pages/shouye/redHongBao?shouYePage=ThreePage" + "&isShareFlag=true" + "&user_id=" + app.globalData.user.user_id;
      }
      wx.redirectTo({
        url: url,
      })
    }else{//非登录
      shareComeFromRedHongBao = true;
    }
    
    this.setData({
      shareComeFromRedHongBao: shareComeFromRedHongBao,
      pagestyle: pagestyle,
      shop_code: options.shop_code,
      clickLogin:true,
      notClose:true
    })
  },

  //红包缩放动画
  hongBaoAnimation: function () {
    var circleCount = 0;
    // 心跳的外框动画  
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 1000, // 以毫秒为单位  
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) {
        console.log("***************************");
      }
    });
    animationTimer = setInterval(function () {
      if (circleCount % 2 == 0) {
        this.animationMiddleHeaderItem.scale(1.15).step();
      } else {
        this.animationMiddleHeaderItem.scale(1.0).step();
      }

      this.setData({
        animationMiddleHeaderItem: this.animationMiddleHeaderItem.export() //输出动画
      });

      circleCount++;
      if (circleCount == 1000) {
        circleCount = 0;
      }
    }.bind(this), 1000);
  },

  //30-50元红包点存入我的帐户
  xianjinRedsubmit: function (e) {
    var that = this;
    if (that.data.shareComeFromRedHongBao) {

      var url = '';
      if (that.data.pagestyle == '1') {
        url = "/pages/sign/sign?isShareFlag=true&user_id=" + app.globalData.user.user_id + "&showSignPage=true";
      } else if (that.data.pagestyle == '2') {
        url = "/pages/shouye/detail/detail?shop_code=" + options.shop_code + "&isShareFlag=true&user_id=" + app.globalData.user.user_id;
      } else {
        url = "/pages/shouye/redHongBao?shouYePage=ThreePage" + "&isShareFlag=true" + "&user_id=" + app.globalData.user.user_id;
      }
      wx.redirectTo({
        url: url,
      })
    }
    
    //统计用户点领的次数
    app.mtj.trackEvent('get_red_envelope', {
      user_id: app.globalData.user_id ? app.globalData.user_id : '',
    });
    // clearInterval(animationTimer);
  },

  hongbaoclick: function (e) {
    var that = this;
    wx.getUserInfo({
      //允许授权 获取用户信息
      success: function (res) {
        if (!app.globalData.user) {
          wx.showLoading({
            title: '请稍后',
            mask: true,
          })

          wx.setStorageSync('showSpecialPage', '1');
          //授权成功去登录
          app.New_userlogin(function () {
            wx.hideLoading();
            // app.moneyPageisHide(function (data) { })

            if (that.data.shareComeFromRedHongBao) {
              that.setData({
                shareComeFromRedHongBao: false
              })
              var url ='';
              if(that.data.pagestyle == '1')
              {
                url = "/pages/sign/sign?isShareFlag=true&user_id=" + app.globalData.user.user_id + "&showSignPage=true"
              }else if(that.data.pagestyle == '2')
              {
                url = "/pages/shouye/detail/detail?shop_code=" + that.data.shop_code + "&isShareFlag=true&user_id=" + app.globalData.user.user_id;
              }
              else{
                url = "/pages/shouye/redHongBao?shouYePage=ThreePage" + "&isShareFlag=true" + "&user_id=" + app.globalData.user.user_id;
              } 
              wx.redirectTo({
                url: url,
              })
            }
          });
        }
      },
      fail: function () {

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
  onShareAppMessage: function () {

  }
})