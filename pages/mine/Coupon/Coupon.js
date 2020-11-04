// pages/mine/Coupon/Coupon.js
var app = getApp();
var util = require('../../../utils/util.js');
var WxNotificationCenter = require("../../../utils/WxNotificationCenter.js");
import config from '../../../config.js';
import ToastPannel from '../../../common/toastTest/toastTest.js';
var loginCount;
Page({
  data: {
    Upyun: config.Upyun,
    tabs: ['未使用', '已失效'],
    tabsData: [],
    couponList:[],
    couponDiscriptionList:[],
    invalid_couponList:[],
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    activeTab: 0,
    currentPage:1,
    couponDiscriptionShowFlag:false,
  },
  onLoad: function (options) {
    new app.ToastPannel();
    loginCount = 0;
    try {
      let { tabs } = this.data;
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
      this.data.stv.windowWidth = res.windowWidth;
      this.setData({ stv: this.data.stv })
      this.tabsCount = tabs.length;
    } catch (e) {
    }

    this.httpData();

    //监听登录成功 刷新界面
    WxNotificationCenter.addNotification("testNotificationAuthorizationName", this.testNotificationFromItem1Fn, this);
  },

  testNotificationFromItem1Fn: function () {
    this.globalLogin();
  },
  httpData:function(){
    this.get_couponHttp();
    this.get_InvalidcouponHttp();
    this.get_couponDiscriptionHttp();
  },
  handlerStart(e) {
    let { clientX, clientY } = e.touches[0];
    this.startX = clientX;
    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.data.stv.tStart = true;
    this.tapStartTime = e.timeStamp;
    this.setData({ stv: this.data.stv })
  },
  handlerMove(e) {
    let { clientX, clientY } = e.touches[0];
    let { stv } = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    stv.offset += offsetX;
    if (stv.offset <= 0) {
      stv.offset = 0;
    } else if (stv.offset >= stv.windowWidth * (this.tabsCount - 1)) {
      stv.offset = stv.windowWidth * (this.tabsCount - 1);
    }
    this.setData({ stv: stv });
  },
  handlerCancel(e) {

  },
  handlerEnd(e) {
    let { clientX, clientY } = e.changedTouches[0];
    let endTime = e.timeStamp;
    let { tabs, stv, activeTab } = this.data;
    let { offset, windowWidth } = stv;
    //快速滑动
    if (endTime - this.tapStartTime <= 300) {
      //向左
      if (Math.abs(this.tapStartY - clientY) < 50) {
        if (this.tapStartX - clientX > 5) {
          if (activeTab < this.tabsCount - 1) {
            this.setData({ activeTab: ++activeTab })
          }
        } else {
          if (activeTab > 0) {
            this.setData({ activeTab: --activeTab })
          }
        }
        stv.offset = stv.windowWidth * activeTab;
      } else {
        //快速滑动 但是Y距离大于50 所以用户是左右滚动
        let page = Math.round(offset / windowWidth);
        if (activeTab != page) {
          this.setData({ activeTab: page })
        }
        stv.offset = stv.windowWidth * page;
      }
    } else {
      let page = Math.round(offset / windowWidth);
      if (activeTab != page) {
        this.setData({ activeTab: page })
      }
      stv.offset = stv.windowWidth * page;
    }
    stv.tStart = false;
    this.setData({ stv: this.data.stv })
  },
  _updateSelectedPage(page) {
    let { tabs, stv, activeTab } = this.data;
    activeTab = page;
    this.setData({ activeTab: activeTab })
    stv.offset = stv.windowWidth * activeTab;
    this.setData({ stv: this.data.stv })
  },
  handlerTabTap(e) {
    this._updateSelectedPage(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
  },

  //点击使用优惠券
  useCouponTap:function(){
    wx.switchTab({
      url: "/pages/shouye/shouye"
    })
  },
  //获取有效的优惠券
  get_couponHttp:function(){
    var token = (app.globalData.user != null) ? app.globalData.user.userToken : "";
    var url = config.Host + 'coupon/queryByPage?token=' + token + config.Version 
      + "&page=" + this.data.currentPage
      + "&Order" + "desc"
      + "&sort=" + "c_price"
      + "&maxormin=>";
    util.http(url, this.coupondata);
  },
  coupondata:function(data){
    if(data.status == 1){
      var dataJson = data.data;
      for(var i=0;i<dataJson.length;i++)
      {
        var starttime = util.getMyDate(dataJson[i].c_add_time, '.', '3');
        var endtime = util.getMyDate(dataJson[i].c_last_time, '.', '3');
        dataJson[i]["time"] = starttime + "-" + endtime;
        dataJson[i]["invalid"] = false;
      }
      
      this.setData({
        couponList: dataJson,
        tabsData: [dataJson, this.data.invalid_couponList],
      })
    }
  },

  //获取失效的优惠券
  get_InvalidcouponHttp: function () {
    var token = (app.globalData.user != null) ? app.globalData.user.userToken : "";
    var url = config.Host + 'coupon/queryByPage?token=' + token + config.Version
      + "&page=" + this.data.currentPage
      + "&Order" + "desc"
      + "&sort=" + "c_price"
      + "&maxormin=<";
    util.http(url, this.Invalidcoupondata);
  },
  Invalidcoupondata: function (data) {
    if (data.status == 1) {
      var dataJson = data.data;
      for (var i = 0; i < dataJson.length; i++) {
        var starttime = util.getMyDate(dataJson[i].c_add_time, '.', '3');
        var endtime = util.getMyDate(dataJson[i].c_last_time, '.', '3');
        dataJson[i]["time"] = starttime + "-" + endtime;
        dataJson[i]["invalid"] = true;
      }
      this.setData({
        invalid_couponList: dataJson,
        tabsData: [this.data.couponList,dataJson],
      })
    }
  },
  //获取优惠券使用说明
  get_couponDiscriptionHttp:function(){
    var token = (app.globalData.user != null) ? app.globalData.user.userToken : "";
    var url = config.Host + 'help/couponRule?token=' + token + config.Version;
    util.http(url, this.couponDiscriptiondata);
  },
  couponDiscriptiondata:function(data){
    if(data.status == 1)
    {
      var str = data.data;
      var strarr = str.split("::");
      var couponData = [];
      for(var i=0;i<strarr.length;i++)
      {
        var couponDic = {};
        var brrstr = strarr[i];
        var strbrr = brrstr.split("_");
        if(strbrr.length>=2)
        {
          couponDic.title = strbrr[0];
          couponDic.discrip = strbrr[1];
          couponData.push(couponDic);
        }
      }
      this.setData({
        couponDiscriptionList: couponData
      })
    }
  },
  closeCoupon:function(){
    this.setData({
      couponDiscriptionShowFlag: false
    })
  },
  renwushuomingTap:function(){
    this.setData({
      couponDiscriptionShowFlag:true
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
        that.httpData();
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
})