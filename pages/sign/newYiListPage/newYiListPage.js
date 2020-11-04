// pages/sign/newYiListPage/newYiListPage.js

import config from '../../../config.js';
var util = require('../../../utils/util.js');

var app = getApp();
var token;


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
    console.log("app--" + app);
    token = app.globalData.user.userToken;


    var dataUrl = config.Host + "shop/queryOption?type=6" +
      "&token=" + token +
      "&" + config.Version;


    util.httpNeedLogin(dataUrl,
      //返回正常数据
      function (res) {
        if (res.status == 1) {
          that.setData({
            newYiList: res.crazyMonday
          })
        } else {
          this.showToast(res.message, 1500)
        }

      },
      //重新登录刷数据
      function () {
        that.onShow();

      }
    )


  },
  //列表点击
  bindNewYiItemTap: function (event) {


    var postoptiontype = event.currentTarget.dataset.postoptiontype;
    // var postUrl = event.currentTarget.dataset.postUrl;

    //用postoption_type在shopGroupList中查value 在转换后传给下个界面

    var shopGroupList = wx.getStorageSync("shopGroupList");

    console.log("postoptiontype:" + postoptiontype);
    console.log("shopGroupList:" + shopGroupList);
    var value;
    var shopsbanner;
    var shopsName;
    for (var sgIndex in shopGroupList) {
      if (postoptiontype == shopGroupList[sgIndex].id) {
        value = shopGroupList[sgIndex].value;
        shopsbanner = shopGroupList[sgIndex].banner;
        shopsName = shopGroupList[sgIndex].app_name;
      }
    }

    console.log("value:" + value);


    var mVale = value.replace(new RegExp("=", "gm"), "#");
    var mmVale = mVale.replace(new RegExp("&", "gm"), "$");

    //这里需要传shopsName，shopsbanner,mmVale
    // wx.navigateTo({

    //   url: "../../listHome/lookShopListHome/index?&shopsbanner=" + shopsbanner +
    //   "&value=" + mmVale+
    //   "&shopsName="+shopsName

    // });



    var where = value;
    if (where == "share=myq") { //密友圈
      wx.navigateTo({
        url: 'qutfitList/qutfitList?'
      })
    } else if (where == "collection=shop_activity") { //活动商品
      wx.navigateTo({
        url: "../signActiveShop/signActiveShop?" +
        "value=" + mmVale +
        "&shopsName=" + shopsName +
        "&shopsbanner=" + shopsbanner

      });
    } else if (where == "collection=collocation_shop") { //搭配
      wx.navigateTo({
        url: "../../shouye/collocationList/collocation?" +
        "value=" + mmVale +
        "&shopsName=" + shopsName +
        "&shopsbanner=" + shopsbanner
      });
    } else {


      wx.navigateTo({

        url: "../../listHome/lookShopListHome/lookshop?&shopsbanner=" + shopsbanner +
        "&value=" + mmVale +
        "&shopsName=" + shopsName

      });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})