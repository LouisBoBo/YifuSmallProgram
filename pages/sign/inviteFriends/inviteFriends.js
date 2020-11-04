// pages/sign/inviteFriends/inviteFriends.js

import config from '../../../config';
var util = require('../../../utils/util.js');
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    is_showDayReward: 0,
    is_showShareSuccess: 0,
    mSumBalance_data: 0,      //总金额
    mLimit_data: 0,           //可提现
    friendNum1: 0,            //位好友赢得余额
    friendNum2: 0,            //位好友赢得提现
    friendMoney1: 0,          //余额
    friendMoney2: 0,          //提现
    friendMyMoney1: 0,        //我获得的余额
    friendMyMoney2: 0,        //我获得的提现
    shareTitle: '',
    sharePath: '',
    shareImageUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    var dataUrl = config.Host + "wallet/myWallet?" + config.Version + "&token=" + app.globalData.user.userToken;
    util.http(dataUrl, this.myMoney)

    util.httpUpyunJson(this.shareData);
    // this.getDayReward();

    // var requestUrl = config.Upyun + "paperwork/paperwork.json";
    // util.http(requestUrl, this.shareData)

    // util.httpUpyunJson(this.shareData)

  },
  // 今日奖励 数据
  getDayReward: function () {
    var dataUrl = config.Host + "wallet/getTcToDayCount?" + config.Version + "&token=" + app.globalData.user.userToken;
    util.http(dataUrl, this.dayReward)
  },
  dayReward: function (data) {
    if (data.status == 1)
      this.setData({
        friendNum1: data.xj_num,
        friendNum2: data.ed_num,
        friendMoney1: data.f_money,
        friendMoney2: data.f_extra,
        friendMyMoney1: data.money,
        friendMyMoney2: data.extra,
      })
  },
  // 总余额、可提现
  myMoney: function (data) {
    if (data.status == 1)
      this.setData({
        mSumBalance_data: data.balance.toFixed(2),
        mLimit_data: (data.extract + data.ex_free).toFixed(2),
      })
  },
  // 去提现
  bind_tap_not: function () {
    // this.showToast("只能到App才能查看哦~", 2000);
    util.navigateTo('../../mine/wallet/Withdrawals/Withdrawals'); 
  },
  // 我要去赚赚赚
  share_toMake: function () {
    wx.navigateBack({

    })
  },
  continueShare: function () {
    this.setData({
      is_showShareSuccess: 0
    })
  },
  // 分享弹框关闭
  share_close: function () {
    this.setData({
      is_showShareSuccess: 0
    })
  },
  // 今日奖励
  dayReward_show: function () {
    // this.setData({
    //   is_showDayReward: 1
    // })
    wx.navigateTo({
      url: 'friendsReward',
    })      
  },
  dayReward_close: function () {
    this.setData({
      is_showDayReward: 0
    })
  },

  /**
   * 分享数据
   */
  shareData: function (data) {
    var vip_share_links = data.vip_share_links.text;
    var memberData = vip_share_links.split(",");

    var shareTitle = data.wxcx_share_links.title ? data.wxcx_share_links.title : "我刚领的红包也分你一个，帮我提现就能拿钱哦~";
    var share_pic = config.Upyun + (data.wxcx_share_links.icon ? (data.wxcx_share_links.icon + '?' + Math.random()): "/small-iconImages/heboImg/shareBigImage_new.jpg");

    //设置分享的文案
    this.setData({
      memberData: memberData,
      shareTitle: shareTitle,
      shareImageUrl: share_pic
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

    var that = this;
    var path = '';
    if (app.globalData.user != null && app.globalData.user.user_id != undefined) {
      path = '/pages/shouye/shouye?' + "isShareFlag=true" + "&user_id=" + app.globalData.user.user_id;
    } else {
      path = '/pages/shouye/shouye?' + "isShareFlag=true";
    }

    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {

      title: this.data.shareTitle,
      path: path,
      imageUrl: this.data.shareImageUrl,
      success: function (res) {
        // 转发成功

      },
      fail: function (res) {
        // 转发失败
      }
    }
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
})