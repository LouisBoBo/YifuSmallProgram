// pages/listHome/order/paystyle/paystyle.js

import config from '../../../../config.js';
var util = require('../../../../utils/util.js');
var WxNotificationCenter = require("../../../../utils/WxNotificationCenter.js");
var app = getApp();
var token;
var order_code;//订单编号
var cutdown_total_micro_second;//下单倒计时时间
var cardInterval;//引导购买定时器
var paySucDialogData; //购买卡后提示信息上面的数据
var showBecameMemberTips;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payMoney: '', //订单支付价格
    wx_pay:false,  //微信支付
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    var vip_type = options.vip_type != undefined ? options.vip_type : '4';
    var vip_count = options.vip_count != undefined ? options.vip_count : '1';
    this.setData({
      vip_type: vip_type,
      vip_count: vip_count,
      orange_payprice: options.pay_price,
      pay_price: options.pay_price - 3
    })
    showBecameMemberTips = false,
    cutdown_total_micro_second = 24 *60 * 60 * 1000;
    this.countdown();
    this.queryMadData();
  },

  //获取隐藏的开关
  queryMadData: function () {
    var that = this;
    var dataUrl = config.Host + "signIn2_0/getCount" +
      "?token=" + app.globalData.user.userToken +
      "&" + config.Version;
    util.http(dataUrl, function (data) {
      if (data.status == 1) {
        that.setData({
          ftask_popup: data.ftask_popup,
          wx_pay: data.ftask_popup == 0 ? true : false,
          pay_price: data.ftask_popup == 0 ? that.data.orange_payprice : that.data.orange_payprice -3,
        })
      }
    });
  },

  //微信支付
  wxtap:function(){
    this.setData({
      wx_pay:true,
      pay_price: this.data.orange_payprice,
      showBecameMember: this.data.ftask_popup == 1 ? true : false,
    })
    // showBecameMemberTips = true;
  },
  //支付宝支付
  zfbtap:function(){
    this.setData({
      wx_pay:false,
      pay_price: this.data.orange_payprice-3
    })
  },
  //立即支付按钮
  paytap: function () {
    if (this.data.wx_pay)
    {
      this.submitOrder();
    }else{
      this.setData({
        showBecameMember: true
      })
    }
    // showBecameMemberTips = true;
  },
  closeVipDialog:function(){
    this.setData({
      showBecameMember:false
    })
  },
  /**购买会员卡提交订单*/
  submitOrder: function (e) {
    if (!app.globalData.user) {
      return
    }
    //男性用户不可下单支付
    if (app.globalData.user.gender == 1) {
      this.showToast('系统维护中，暂不支持支付', 2000);
      return;
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
      paySucDialogData = data.data;
      that.data.pay_v_code = data.v_code;
      wx.setStorageSync("paySucDialogData", data.paySucDialogData)


      if (data.actual_price <= 0) { //无需支付
        wx.hideLoading()
        //发送购买会员成功的通知
        WxNotificationCenter.postNotificationName("memberNotificationItem1Name", "becomeMemberfinish");
        wx.setStorageSync('payvipCardSuccess', "true");

        

        if (paySucDialogData) {
          var pages = getCurrentPages();
          var currentPage = pages[pages.length - 2];

          //购买会员卡成功标记
          if (that.data.vip_type != 7 && that.data.vip_type != 8 && that.data.vip_type != 9) {
            wx.setStorageSync('vipCardPaySuccess', "1");
            wx.setStorageSync('KvipSuccessBack', "1");
            wx.setStorageSync('unVipRaffleMoney', paySucDialogData.unVipRaffleMoney);
            wx.setStorageSync('vip_price', paySucDialogData.vip_price);
          }

          currentPage.isvip_paysuccess = true;
          currentPage.kaiKaVipType = that.data.vip_type;
          currentPage.paySucDialogData = paySucDialogData;
          currentPage.setData({
            paySucDialogData: paySucDialogData,
            showPaySuccessDialog: true,
            newisvip_paysuccess: true,
            newkaiKaVipType:that.data.vip_type,
            pay_v_code: that.data.pay_v_code
          })

          setTimeout(function () {
            console.log('***************买卡成功***************');
            currentPage.initVipData(that.data.vip_type);
            wx.navigateBack({})
          }, 2000)
        } 

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

          wx.hideLoading()
          //发送购买会员成功的通知
          WxNotificationCenter.postNotificationName("memberNotificationItem1Name", "becomeMemberfinish");
          wx.setStorageSync('payvipCardSuccess', "true");

          if (paySucDialogData) {
            var pages = getCurrentPages();
            var currentPage = pages[pages.length - 2];

            //购买会员卡成功标记
            if (that.data.vip_type != 7 && that.data.vip_type != 8 && that.data.vip_type != 9) {
              wx.setStorageSync('vipCardPaySuccess', "1");
              wx.setStorageSync('KvipSuccessBack', "1");
              wx.setStorageSync('unVipRaffleMoney', paySucDialogData.unVipRaffleMoney);
              wx.setStorageSync('vip_price', paySucDialogData.vip_price);
            }

            currentPage.isvip_paysuccess = true;
            currentPage.kaiKaVipType = that.data.vip_type;
            currentPage.paySucDialogData = paySucDialogData;
            currentPage.setData({
              paySucDialogData: paySucDialogData,
              showPaySuccessDialog: true,
              newisvip_paysuccess:true,
              newkaiKaVipType: that.data.vip_type,
              pay_v_code: that.data.pay_v_code
            })

            setTimeout(function () {
              console.log('***************买卡成功***************');
              currentPage.initVipData(that.data.vip_type);
              wx.navigateBack({})
            }, 2000)
          } 
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

  //下单倒计时
  countdown: function () {
    var that = this;

    if (cardInterval) {
      clearInterval(cardInterval);
    }
    if (cutdown_total_micro_second <= 0) {
      //时间截至
      that.setData({
        clock_hr: "00",
        clock_min: "00",
        clock_ss: "00",
        time: hr + ':' + min + ':' + sec
      });
      return;
    }
    cardInterval = setInterval(function () {
      cutdown_total_micro_second -= 1000;
      that.dateformat(cutdown_total_micro_second);
    }, 1000);
  },

  dateformat: function (micro_second) {

    var that = this;
    // 总秒数
    var second = Math.floor(micro_second / 1000);

    // 天数
    var day = "" + Math.floor(second / 3600 / 24);
    // 小时
    var hr = "" + Math.floor(second / 3600 % 24);
    // 分钟
    var min = "" + Math.floor(second / 60 % 60);
    // 秒
    var sec = "" + Math.floor(second % 60);


    if (hr.length < 2) {
      hr = '0' + hr;
    }

    if (min.length < 2) {
      min = '0' + min;
    }

    if (sec.length < 2) {
      sec = '0' + sec;
    }

    that.setData({
      clock_hr: hr,
      clock_min: min,
      clock_ss: sec,
      time: hr + ':' + min + ':' + sec
    });
  },
})