// pages/shouye/detail/collocationDetail/collocationDetail.js
import config from '../../../../config';
var util = require('../../../../utils/util.js');
var WxNotificationCenter = require('../../../../utils/WxNotificationCenter.js');
var app = getApp();

var task_type;
var isComplete;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    code: '',
    activityIndex: 0,
    topData: [],
    shop: {},
    datalist: {},
    taglist: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    if (!app.parent_id) {
      app.parent_id = options.user_id
    }


    if (options.user_id && app.globalData.user && app.globalData.user.userToken) {
      util.bindRelationship(options.user_id, app.globalData.user.userToken);//绑定用户上下级关系
    } 
    if (options.user_id){
    WxNotificationCenter.addNotification("testNotificationItem1Name", function(){
      if (app.globalData.user && app.globalData.user.userToken){
      util.bindRelationship(options.user_id, app.globalData.user.userToken);//绑定用户上下级关系
      }
    }, this);
    }
  
    task_type = options.task_type;
    var signTask = wx.getStorageSync("SIGN-TASK");
    isComplete = signTask.complete;
    
    this.data.code = options.code; //'CS20171101cRbQKwFp';//
    var dataUrl = config.Host + "collocationShop/queryUnLogin?" + config.Version + "&code=" + options.code;
    util.http(dataUrl, this.shopData)

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
  },

  // 搭配详情数据
  shopData: function (data) {
    if (data.status == 1) {

      var shop = data.shop;
      shop['add_time'] = util.getMyDate(shop.add_time, '.', '3');

      var collocation_shop = shop.collocation_shop;
      var movies = [];
      var shop_code_cut = '';
      var cutJson = {};
      for (var idx in collocation_shop) {
        var subject = collocation_shop[idx];
        cutJson = subject;
        var shop_se_price = (subject.shop_se_price).toFixed(1);
        cutJson["shop_se_price"] = shop_se_price;
        if (idx == 0)
          cutJson['shop_x'] = ((1 - subject.shop_x) * 100).toFixed(1) + '%';
        if (idx == 1)
          cutJson['shop_x'] = ((subject.shop_x) * 100).toFixed(1) + '%';

        cutJson['shop_y'] = ((subject.shop_y) * 100).toFixed(1) + '%';
        movies.push(cutJson)
      }
      this.setData({
        taglist: movies
      });

      var arr1 = shop.type_relation_ids.split(",");

      var basesData = wx.getStorageSync("shop_tag_basedata");
      var titleDataTemp = [];
      var recommendTitleData = [];
      if (basesData) {
        titleDataTemp = basesData.data.shop_type;
      }
      if (titleDataTemp.length) {
        for (var j = 0; j < arr1.length; j++) {
          for (var i = 0; i < titleDataTemp.length; i++) {
            if (titleDataTemp[i].parent_id == 0 && titleDataTemp[i].id == arr1[j]) {
              var titleDic = {};
              titleDic['name'] = titleDataTemp[i].type_name;
              titleDic['id'] = titleDataTemp[i].id;
              recommendTitleData.push(titleDic);
            }
          }
        }
      }
      this.setData({
        topData: recommendTitleData,
      })
      if(recommendTitleData.length){
        var token = (app.globalData.user != null && app.globalData.user.userToken != undefined) ? app.globalData.user.userToken : '';
        var dataUrl = config.Host + "collocationShop/queryShopList?" + config.Version + "&type_id=" + this.data.topData[0].id + "&code=" + this.data.code + "&token=" + token;
        util.http(dataUrl, this.shoplist)
      }
   

      this.setData({
        shop: data.shop
      })
    }
  },

  // 商品列表数据 
  shoplist: function (data) {
    if (data.status == 1) {
      var movies = [];
      var shop_code_cut = '';
      var cutJson = {};
      for (var idx in data.listShop) {
        var subject = data.listShop[idx];
        shop_code_cut = subject.shop_code.substring(1, 4);
        cutJson = subject;
        cutJson["cut_shop_code"] = shop_code_cut;
        var shop_se_price = (subject.shop_se_price).toFixed(1);
        // cutJson["shop_se_price"] = shop_se_price;

        //何波修改2018-4-4
        if (app.globalData.oneYuanData == 0)//是1元购
        {
          // var se_price = app.globalData.oneYuanValue;
          var se_price = (subject.wxcx_shop_group_price * 1).toFixed(1);
          cutJson.shop_se_price = (se_price * 1).toFixed(1);
          cutJson.shop_price = shop_se_price;
        } else {
          cutJson.shop_se_price = shop_se_price;
          cutJson.supp_label = '';
        }
        movies.push(cutJson)
      }
      this.setData({
        datalist: movies,
        showSub: app.showSub
      });
    }
  },
  // 列表分类  类型点击
  onTapClick: function (event) {
    if (event.currentTarget.dataset.index == this.data.activityIndex)
      return;

    this.setData({ activityIndex: event.currentTarget.dataset.index })
    this.data.datalist = {};

    var token = (app.globalData.user != null && app.globalData.user.userToken != undefined) ? app.globalData.user.userToken : '';
    var dataUrl = config.Host + "collocationShop/queryShopList?" + config.Version + "&type_id=" + this.data.topData[this.data.activityIndex].id + "&code=" + this.data.code + "&token=" + token;
    util.http(dataUrl, this.shoplist)
  },
  //标签点击
  tagClick: function (event) {
    
    if (event.currentTarget.dataset.code) {
      var path = '../detail?shop_code=' + event.currentTarget.dataset.code;
      if ("19" == task_type && !isComplete) {
        //浏览赢提现
        wx.redirectTo({
          url: path + "&isForceLookLimit=true"
        });
      } else if ("4" == task_type && !isComplete) {
        //浏览X件商品
        wx.redirectTo({
          url: path + "&isForceLook=true"
        });
      } else {
        wx.redirectTo({
          url: path
        });
      }
    }
  },
  // 商品点击  进入详情
  toShopDetailClick: function (event) {
    if (app.globalData.user != null && app.globalData.user.userToken != undefined)
      util.httpPushFormId(event.detail.formId);
    var shop_code = event.currentTarget.dataset.code;
    var path = "../detail?" + "shop_code=" + shop_code;

    wx.redirectTo({
      url: path
    });
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
  // onShareAppMessage: function () {

  // }
})