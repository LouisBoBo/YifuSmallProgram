// pages/mine/addMemberCard/memberDiscription.js
import config from '../../../config.js';
var app = getApp();
var util = require('../../../utils/util.js');
import ToastPannel from '../../../common/toastTest/toastTest.js';
var WxNotificationCenter = require("../../../utils/WxNotificationCenter.js");
var loginCount;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    video_isplaying: false,
    videoSrc: 'https://www.incursion.wang/freeBuy/Video/20190812175713.mp4',
    ruleData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    loginCount = 0;
    new app.ToastPannel();
    
    var vip_type = options.vip_type != undefined ? options.vip_type : '4';
    var vip_count = options.vip_count != undefined ? options.vip_count : '1';
    var vip_name = options.vip_name != undefined ? options.vip_name : '钻石卡';
    var vip_price = options.vip_price != undefined ? options.vip_price : '299';
    var pay_price = options.pay_price != undefined ? (options.pay_price*1).toFixed(1) : '299';
    var punch_days = (options.punch_days != undefined && options.punch_days != 'undefined')? options.punch_days : '120';
    var return_money = (options.return_money != undefined && options.return_money != 'undefined')? options.return_money : '400';
    var price_section = (options.price_section != undefined && options.price_section != 'undefined')?options.price_section : '199';
    var one_price = options.one_price != undefined ? options.one_price : '0';


    this.setData({
      ruleData: ["预存" + one_price + "元成为衣蝠" + vip_name + "会员", "每天来衣蝠完成赚钱任务，即完成当日打卡", "打卡满" + punch_days + "天，可领取" + return_money + "元可提现奖金", "成为" + vip_name + "会员还可免费发货一件" + price_section + "元美衣哦"],
      titleicons: ['small-iconImages/heboImg/titleicon_one.png', 'small-iconImages/heboImg/titleicon_two.png', 'small-iconImages/heboImg/titleicon_three.png', 'small-iconImages/heboImg/titleicon_four.png'],
      imagetext: '完成打卡返' + return_money + '元奖金 | ' + punch_days + '天',
      bottomtext: '￥' + pay_price + '/',
      sharetext: punch_days + '天全勤分享',
      rawardlist: [return_money + '元现金', price_section + '元美衣'],
      rawardimage: ['small-iconImages/heboImg/member_cashlogo.png', 'small-iconImages/heboImg/member_meiyilogo.png'],
      vip_type: vip_type,
      vip_count: vip_count,
      vip_name: vip_name,
      vip_price: vip_price,
      pay_price: pay_price,
      punch_days: punch_days,
      return_money: return_money,
      price_section: price_section
    })
  
    util.httpUpyunJson(this.videoData)
  },
  onShow: function (options) {
    //大促销已结束
    if (app.globalData.user != null) {
      var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
      this.setData({
        showMainPage: true,
        showendofpromotionDialog: showendofpromotionDialog
      })
    } else {
      this.setData({
        showMainPage: true,
        showendofpromotionDialog: true
      })
    }
  },
  videoData: function (data) {
    if (data.VipInfo)
    {
      var mp4src = data.VipInfo.icon;
      var videoSrc = config.Upyun + mp4src;
      this.setData({
        videoSrc: videoSrc
      })
    }
  },
  
  /**购买会员卡提交订单*/
  buyVipCard: function (e) {
    if (!app.globalData.user) {
      return
    }
    //男性用户不可下单支付
    if (app.globalData.user.gender == 1) {
      this.showToast('系统维护中，暂不支持支付', 2000);
      return;
    }
    
    if(e)
    {
      util.httpPushFormId(e.detail.formId);
    }
    
    wx.showLoading({
      title: "请稍后",
      mask: true
    })
    
    var dataUrl = config.Host + "userVipCard/addUserVipCard?" + config.Version + "&token=" + app.globalData.user.userToken +
      '&vip_type=' + this.data.vip_type + "&vip_count=" + this.data.vip_count

    util.http(dataUrl, this.confirmorderResult);
    this.setData({
      dataurl: dataUrl
    });

  },

  // 提交订单结果
  confirmorderResult: function (data) {
    var that = this;
    if (data.status == 1) {

      wx.setStorageSync("paySucDialogData", data.paySucDialogData)


      if (data.actual_price <= 0) { //无需支付
        wx.hideLoading()
        //发送购买会员成功的通知
        WxNotificationCenter.postNotificationName("memberNotificationItem1Name", "becomeMemberfinish");
        wx.setStorageSync('payvipCardSuccess', "true");
        wx.navigateBack({
          
        })
        return
      }
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId, 3rd_session
          if (res.code) {
            var dataUrl = config.PayHost + "wxpaycx/wapUinifiedOrderList?" + config.Version + "&token=" + app.globalData.user.userToken + '&order_name=我的' + '&code=' + res.code + '&order_code=' + data.v_code;
            util.http(dataUrl, that.orderPayResult)
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
            wx.hideLoading()
          }
        }
      })

    } else {

      wx.hideLoading()
      that.showToast("" + data.message, 2000);
    }
  },

  //支付处理
  orderPayResult: function (data) {

    var that = this;
    if (data.status == 1) {

      var xml = data.xml;
      wx.requestPayment({
        'timeStamp': xml.timeStamp + "",
        'nonceStr': xml.nonceStr,
        'package': xml.package,
        'signType': xml.signType,
        'paySign': xml.paySign,
        'success': function (res) { //支付成功

          // that.showToast("支付成功", 2000);
          wx.hideLoading()
          //发送购买会员成功的通知
          WxNotificationCenter.postNotificationName("memberNotificationItem1Name", "becomeMemberfinish");
          wx.setStorageSync('payvipCardSuccess', "true");
          wx.navigateBack({

          })
        },
        'fail': function (res) { //支付失败

          wx.hideLoading()
          that.showToast("支付失败", 2000);
        }
      })
      that.data.isConfirm = false;
    } else {
      that.showToast('' + data.message, 2000);
    }
  },

  /**播放视频*/
  videoplay: function (e) {
     
    var videoContext = wx.createVideoContext('video', this);
    videoContext.requestFullScreen();//执行全屏方法 
    videoContext.play()

    this.setData({
      videoContext: videoContext,
    })
  },
  
  /**监听是否全屏*/
  screenChange:function(e){
    var fullScreen = e.detail.fullScreen //值true为进入全屏，false为退出全屏
    if (!fullScreen) { //退出全屏
      this.setData({
        fullScreen: false
      })
      this.data.videoContext.pause()
    } else { //进入全屏
      this.setData({
        fullScreen: true
      })
    }
  },
  
  //授权弹窗
  onclick: function (e) {
    var that = this;
    wx.getUserInfo({
      //允许授权 获取用户信息
      success: function (res) {
        if (!app.globalData.user) {
          wx.showLoading({
            title: '请稍后',
            mask: true,
          })
          //授权成功去登录
          app.New_userlogin(function (data) {
            wx.hideLoading();
            if (app.globalData.user && app.globalData.user.userToken != undefined)//登录成功
            {
              var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
              // that.setData({
              //   showendofpromotionDialog: showendofpromotionDialog
              // })
              if (showendofpromotionDialog) {
                wx.setStorageSync("comefrom", 'showendofpromotionDialog_vip');
                wx.switchTab({
                  url: '/pages/shouye/shouye?comefrom=showendofpromotionDialog',
                })
              }else{
                wx.redirectTo({
                  url: '/pages/mine/addMemberCard/addMemberCard',
                })
              }
            } else{
              that.globalLogin();
            }
          });
        }else{
          that.buyVipCard();
        }
      },
      fail: function () {

      }
    })
  },

  //自动登录
  globalLogin: function () {
    var that = this;
    util.autoLogin(loginCount, function (loginfailYiFuShow, login_discribution, login_buttontitle, newloginCount) {
      wx.hideLoading();
      loginCount = newloginCount;
      if (loginCount == 1)//登录成功
      {
        var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
        // that.setData({
        //   showendofpromotionDialog: showendofpromotionDialog
        // })
        if (showendofpromotionDialog) {
          wx.setStorageSync("comefrom", 'showendofpromotionDialog_vip');
          wx.switchTab({
            url: '/pages/shouye/shouye?comefrom=showendofpromotionDialog',
          })
        }else{
          wx.redirectTo({
            url: '/pages/mine/addMemberCard/addMemberCard',
          })
        }
      } else {
        that.setData({
          loginfailYiFuShow: loginfailYiFuShow,
          login_discribution: login_discribution,
          login_buttontitle: login_buttontitle,
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})