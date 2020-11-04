// pages/sign/yidouDetail/tixianDetail.js
import config from '../../../config';
var util = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    activityIndex: 0,
    curPage: 1,
    requestUrl: "",
    isEmpty: true,
    remindShow: false,
    balance: 0,         //我的余额    
    freeze_balance: 0,  //冻结余额
    extract: 0,         //提现额度：
    ex_free: 0          //提现冻结：
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      topData:
      [{ name: '新增提现' },
      { name: '已提现' },
      { name: '冻结提现' },],
    })

    var dataUrl1 = config.Host + "wallet/myWallet?" + config.Version + "&token=" + app.globalData.user.userToken;
    util.http(dataUrl1, this.myMoney)

    var dataUrl = config.Host + 'wallet/getExtractDetail?token=' + app.globalData.user.userToken + config.Version + '&order=desc&sort=add_date';
    this.data.requestUrl = dataUrl;

    dataUrl = dataUrl + "&page=" + this.data.curPage + '&type=1';
    util.http(dataUrl, this.resultData)
  },
  myMoney: function (data) {
    if (data.status == 1)
      this.setData({
        balance: data.balance.toFixed(2),
        freeze_balance: data.freeze_balance.toFixed(2),
        extract: data.extract.toFixed(2),
        ex_free: data.ex_free.toFixed(2)
      })
  },
  resultData: function (data) {
    var movies = [];
    var cutJson = {};
    for (var idx in data.data) {
      var subject = data.data[idx];
      cutJson = subject;
      if (this.data.activityIndex == 2) {
        if (subject.type == 3)
          cutJson['p_name'] = "";
        else
          cutJson['p_name'] = '订单' + subject.r_code + '冻结';
        cutJson['add_date'] = util.getMyDate(subject.add_date, '.', '');
        cutJson['num'] = subject.num.toFixed(2);
      } else {
        var num = this.data.activityIndex == 0 ? '+' : '';
        var arr = ["抽红包增加", "抽奖退款", "粉丝购物", "官方赠送", "余额提现", "官方减少", "签到", "邀请好友", "提现失败退回", "新用户注册赠送", "疯狂新衣节", "购买任务", "集赞", "集赞奖励", "抽奖", "分享返现", "余额抽奖", "好友提现奖励"]
        cutJson['p_name'] = arr[subject.type - 1];
        cutJson['add_date'] = util.getMyDate(subject.add_date, '.', '');
        cutJson['num'] = num + subject.num;
      }

      movies.push(cutJson)
    }
    var totalMovies = {}

    //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.datalist.concat(movies);
    }
    else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      datalist: totalMovies
    });

    this.data.curPage += 1;
  },
  onTapClick: function (event) {
    if (event.currentTarget.dataset.index == this.data.activityIndex)
    return;
    
    const index = event.currentTarget.dataset.index + 1;
    this.setData({ activityIndex: event.currentTarget.dataset.index })

    this.data.curPage = 1;
    this.data.datalist = {};

    // + '&token=KK1DNFVXFEH741J8RB5K';
    var baseUrl = this.data.activityIndex == 2 ? 'wallet/getExtractUnDetail?' : 'wallet/getExtractDetail?';
    var dataUrl = config.Host + baseUrl + config.Version + '&order=desc&sort=add_date' + '&token=' + app.globalData.user.userToken;
    this.data.requestUrl = dataUrl;
    this.data.isEmpty = true;
    dataUrl = dataUrl + "&page=" + this.data.curPage + ((this.data.activityIndex == 2) ? "" : ('&type=' + index));
    util.http(dataUrl, this.resultData)
  },
  tixianButtonTap: function () {
    wx.redirectTo({
      url: '../../mine/wallet/Withdrawals/Withdrawals',
    })
  },
  remindTap: function() {
    this.setData({
      remindShow: true
    });
  },
  dialog_close: function () {
    this.setData({
      remindShow: false
    });
  },
  startLuckBtn: function() {
    wx.navigateBack({
      
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
    var num = this.data.activityIndex + 1;
    var dataUrl = this.data.requestUrl + "&page=" + this.data.curPage + ((this.data.activityIndex == 2) ? "" : ('&type=' + num));
    util.http(dataUrl, this.resultData)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})