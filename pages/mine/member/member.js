// pages/mine/member/member.js
import config from '../../../config.js';
var util = require('../../../utils/util.js');
import ToastPannel from '../../../common/toastTest/toastTest.js';
var app = getApp();
var formId;
var loginCount;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upyconfig: config.Upyun,
    Upyun: config.Upyun,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    loginCount = 0;
    if (!app.parent_id && options.user_id) {
      app.parent_id = options.user_id
    }
    if (options.memberComefrom)
    {
      this.setData({
        memberComefrom: options.memberComefrom
      })
    }
  },
  /**
   * 开通会员
  */
  membersubmit: function (e) {
    if (app.globalData.user != null) {
      util.httpPushFormId(e.detail.formId);
      var vip_type = this.data.memberComefrom == 'luckdraw' ? '-1001' : '-1002';
      if(this.data.memberComefrom == 'order')
      {
        vip_type = '-1005';
      }
      wx.navigateTo({
        url: '../addMemberCard/addMemberCard?memberComefrom=' + this.data.memberComefrom + '&vip_type=' + vip_type,
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
          that.globalLogin();//重新登录
        }
      },
      fail: function () {

      }
    })
  },

  //自动登录
  globalLogin: function () {
    var that = this;
    wx.showLoading({
      title: '请稍后',
    })
    util.autoLogin(loginCount, function (loginfailYiFuShow, login_discribution, login_buttontitle, newloginCount) {
      loginCount = newloginCount;
      if (loginCount == 1)//登录成功
      {
        wx.navigateTo({
          url: '../addMemberCard/addMemberCard?memberComefrom=' + that.data.memberComefrom + '&vip_type=-1002',
        })
      } else {
        that.setData({
          loginfailYiFuShow: loginfailYiFuShow,
          login_discribution: login_discribution,
          login_buttontitle: login_buttontitle,
        })
      }
    })
  },
  //登录失败重新登录
  loginAgainSubmit: function () {
    var that = this;

    that.setData({
      loginfailYiFuShow: false,
    })
    wx.showLoading({
      title: '请稍后',
    })
    that.globalLogin();
  },
  closeLoginPop: function () {
    this.setData({
      loginfailYiFuShow: false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    
    var path = '';
    if (app.globalData.user != null && app.globalData.user.user_id != undefined) {
      path = '/pages/mine/member/member?' + "isShareFlag=true" + "&user_id=" + app.globalData.user.user_id;
    } else {
      path = '/pages/mine/member/member?' + "isShareFlag=true";
    }

    return {

      // title: '衣蝠至尊会员，会员资格免费，每月赠送美衣，更可赚千元奖金！',
      // path: path,
      // imageUrl: that.data.Upyun + '/small-iconImages/heboImg/share_member.jpg',

      title: '👉点我立即开通VIP会员',
      path: path,
      imageUrl: that.data.Upyun + '/small-iconImages/heboImg/share_newestbuyMember.png',
      success: function (res) {
        // 转发成功
        this.showToast('分享成功', 2000);
      },
      fail: function (res) {
        // 转发失败
        this.showToast('分享失败', 2000);
      }
    }
  }
})