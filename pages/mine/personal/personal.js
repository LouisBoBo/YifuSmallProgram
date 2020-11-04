var app = getApp();
var util = require('../../../utils/util.js');
var WxNotificationCenter = require("../../../utils/WxNotificationCenter.js");
import config from '../../../config.js';
var loginCount;
var clickCount;
var luckClickcount;
var examineClickCount;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 地址信息
    address: '',
    phone: '',
    consignee: '',
    address_id: '',
    // datalist: ["昵称", "地区", "收货地址", "我的喜好", "个性签名"],
    // datalist: ["昵称", "地区", "收货地址", "个性签名", "邀请码","我的二维码","好友奖励"],
    morelist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    loginCount = 0;
    clickCount = 0;
    luckClickcount = 0;
    examineClickCount = 0;
    this.setHeadPic();

    //监听登录成功 刷新界面
    WxNotificationCenter.addNotification("testNotificationAuthorizationName", this.testNotificationFromItem1Fn, this);
  },
  testNotificationFromItem1Fn:function(){
    this.globalLogin();
  },
  setHeadPic:function(){
    var headpic = ""
    if (app.globalData.userInfo != null) {
      headpic = (app.globalData.userInfo.avatarUrl != null) ? app.globalData.userInfo.avatarUrl : 'https://www.measures.wang/userinfo/head_pic/default.jpg'
    } else if ((app.globalData.user != null)) {
      headpic = (app.globalData.user.pic != null) ? app.globalData.user.pic : 'https://www.measures.wang/userinfo/head_pic/default.jpg'
    }
    else {
      headpic = 'https://www.measures.wang/userinfo/head_pic/default.jpg'
    }

    this.setData({
      headpic: headpic,
    })
  },
  setUserInfo:function(){
    var username = ""
    var country = ""
    var address = ""
    var person_sign = ""
    var address_id = ""
    if (app.globalData.userInfo != null) {
      username = app.globalData.userInfo.nickName;
      country = app.globalData.userInfo.country;
    }
    if (app.globalData.user != null) {
      address = (this.data.address != null && this.data.address != "") ? this.data.address : wx.getStorageSync("home_address");
      person_sign = app.globalData.user.person_sign != undefined ? app.globalData.user.person_sign : '';
    }
    if (address != null && address.length > 15) {
      address = address.substr(0, 15) + "...";
    }
    address_id = this.data.address_id;
    if (address_id != null && address_id != "") {
      this.default_addressHttp(address_id);
    }

    if (person_sign != null && person_sign != undefined && person_sign.length > 15) {
      person_sign = person_sign.substr(0, 15) + "...";
    }

    var morelist = [username, country, address, person_sign,'']
    this.setData({
      morelist: morelist,
    })

    this.setHeadPic();//头像
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    this.setUserInfo();
    //大促销已结束
    var showendofpromotionDialog;
    if (app.globalData.user != null) {
      showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
    } else {
      showendofpromotionDialog = true
    }
    var datalist = showendofpromotionDialog ? ["昵称", "地区", "收货地址", "个性签名", "邀请码", "我的二维码"] : ["昵称", "地区", "收货地址", "个性签名", "邀请码", "我的二维码", "好友奖励"];
    this.setData({
      datalist: datalist,
      showendofpromotionDialog: showendofpromotionDialog
    })
  },
  onHide:function(){
    clickCount = 0;
    luckClickcount =0;
    examineClickCount =0;
  },
  //设置收货地址
  default_addressHttp: function (address_id) {
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var url = config.Host + "address/update?is_default=1" + "&token=" + token + "&id=" + address_id + config.Version;
    util.http(url, this.addressData);
  },
  addressData: function (data) {
    if (data.status == 1) {
      wx.setStorageSync("home_address", this.data.address);
    }
  },
  moretap: function (event) {
    var index = event.currentTarget.dataset.index;
    console.log("index=" + index);
    switch (index) {
      case 0:
        luckClickcount++;
        if (luckClickcount >= 10) {
          wx.navigateTo({
            url: '/pages/mine/withdrawLimitTwo/withdrawLimitTwo'
          })
        }
        break;
      case 1:
        examineClickCount++;
        if (examineClickCount >=10){
          app.globalData.first_diamond = 1;
          wx.redirectTo({
            url: "/pages/shouye/redHongBao?shouYePage=" + "ThreePage" + '&comefrom=testExit'
          })
        }
        break;
      case 2:
        wx.navigateTo({
          url: '../../listHome/order/address/chooseAddress',
        })
        break;
      case 3:
        wx.navigateTo({
          url: '../mark/mark',
        })
        break;
      case 4:
        wx.navigateTo({
          url: '../myInviNumber/myInviNumber',
        })
        break;
      case 5:
        wx.navigateTo({
          url: "../myInviNumber/myselfQRcode",
        })
        break;
      case 6:
        wx.navigateTo({
          url: "/pages/sign/inviteFriends/memberFriendsReward",
        })
        break;

    }
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
        that.setUserInfo();
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
  testclick:function(){
    clickCount ++ ;
    if(clickCount >= 10)
    {
      wx.navigateTo({
        url: "/pages/shouye/redHongBao?shouYePage=" + "ThreePage" + '&testShare=true'//首页3
      })
    }
  }
})

