import config from '../../../config';
var util = require('../../../utils/util.js');
import ToastPannel from '../../../common/toastTest/toastTest.js';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    Upyun: config.Upyun,
    datalist: {},
    currentpage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (!app.parent_id && options.user_id) {
      app.parent_id = options.user_id
    }

    new app.ToastPannel();
    this.getDayReward();
    this.getRewardList();
    util.httpUpyunJson(this.shareData);
  },

  //列表加载更多
  onReachBottom: function () {
    this.getRewardList();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      currentpage: 1,
    })
    this.getDayReward();
    this.getRewardList();
  },
  // 今日奖励 数据
  getDayReward: function () {
    var dataUrl = config.Host + "wallet/getExtremeToDayCount?" + config.Version + "&token=" + app.globalData.user.userToken;
    util.http(dataUrl, this.dayReward)
  },

  // 好友奖励明细
  getRewardList: function () {
    var dataUrl = config.Host + "wallet/getExtremeTiChengInfo?" + config.Version + "&token=" + app.globalData.user.userToken + "&page=" + this.data.currentpage;
    util.http(dataUrl, this.dayRewardList)
  },
  dayReward: function (data) {
    wx.stopPullDownRefresh();
    if (data.status == 1) {
      var ext_num = data.data.ext_num ? data.data.ext_num : "0";
      var ext_now = data.data.ext_now ? (1 * data.data.ext_now).toFixed(0) : "0";
      var ext_yet = data.data.ext_yet ? (1 * data.data.ext_yet).toFixed(0) : "0";

      this.setData({
        ext_num: ext_num,
        ext_now: ext_now,
        ext_yet: ext_yet,
      })
    } else {
      this.showToast(data.message, 2000);
    }
  },
  dayRewardList: function (data) {

    if (this.data.currentpage == 1) {
      this.data.datalist = [];
    }

    if (data.status == 1) {

      var movies = this.data.datalist;
      var cutJson = {};
      var page = this.data.currentpage + 1;

      for (var idx in data.data) {
        var subject = data.data[idx];
        cutJson = subject;
        var pic = subject.pic;
        if (pic) {
          var fdStart = subject.pic.indexOf("http");
          if (fdStart == 0)
            cutJson['pic'] = pic;
          else
            cutJson['pic'] = config.Upyun + pic;
        }
        movies.push(cutJson)
      }

      this.setData({
        datalist: movies,
        currentpage: page
      });
    } else {
      this.showToast(data.message, 2000);
    }
  },

  /**
   * 分享数据
   */
  shareData: function (data) {
    var vip_share_links = data.vip_share_links.text;
    var memberData = vip_share_links.split(",");

    var shareTitle = data.wxcx_share_links.title ? data.wxcx_share_links.title : "我刚领的红包也分你一个，帮我提现就能拿钱哦~";
    var share_pic = config.Upyun + (data.wxcx_share_links.icon ? (data.wxcx_share_links.icon + '?' + Math.random()) : "/small-iconImages/heboImg/shareBigImage_new.jpg");

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
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {

      title: that.data.shareTitle,
      path: '/pages/shouye/shouye?' + "isShareFlag=true" + "&user_id=" + app.globalData.user.user_id,
      imageUrl: that.data.shareImageUrl,
      success: function (res) {
        // 转发成功
        that.showToast('分享成功', 2000);
      },
      fail: function (res) {
        // 转发失败
        that.showToast('分享失败', 2000);
      }
    }
  },
})