// pages/sign/indiana/indianaList.js
import config from '../../../config';
var util = require('../../../utils/util.js');

var ShopTypeEnum;
var app = getApp();
var token;
var task_type;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    isShowPrice : false,
    isShowIcon:false,
    curPage: 1,
    pageSize: 10,
    datalist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var signTask = wx.getStorageSync("SIGN-TASK");
    task_type = signTask.task_type;



    new app.ToastPannel();
    token = app.globalData.user.userToken;

    if (task_type == 2) {
      ShopTypeEnum = "indiana";//普通夺宝（可一分钱参与多宝）
      this.setData({
        isShowPrice: false,
        isShowIcon: true,
      });
    } else if (task_type == 21) {
      ShopTypeEnum = "indiana_one";//一元夺宝（夺宝奖励提现额度）
      this.setData({
        isShowPrice: false,
        isShowIcon: false,
      });
    }else {
      ShopTypeEnum = "indiana";//普通夺宝（可一分钱参与多宝）
      this.setData({
        isShowPrice: false,
        isShowIcon: true,
      });
    }
    this.initData();
  },
  initData: function () {
    var dataUrl = config.Host + "shop/queryIndianaList" +
      "?token=" + token +
      "&curPage=" + this.data.curPage +
      "&pageSize=" + this.data.pageSize +
      "&ShopTypeEnum=" + ShopTypeEnum + config.Version;
    console.log(dataUrl);
    util.httpNeedLogin(dataUrl, this.cutShopCode,this.reLoadCallBack);
  },
  reLoadCallBack:function(){
    token = app.globalData.user.userToken;
    this.initData();
  },
  cutShopCode: function (data) {
    wx.stopPullDownRefresh();
    console.log(data.data);
    var that = this;
    var shop_code_cut = '';
    var cutJson = {};
    var dataListTemp = that.data.curPage == 1 ? [] : that.data.datalist;
    for (var i in data.data) {
      shop_code_cut = data.data[i].shop_code.substring(1, 4);
      cutJson = data.data[i];
      cutJson["show_def_pic"] = config.Upyun + shop_code_cut + "/" + cutJson.shop_code + "/" + cutJson.def_pic ;
      dataListTemp.push(cutJson)
    }
    that.setData({
      datalist: dataListTemp
    })
  },

  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      curPage: 1,
    })
    that.initData();
  },

  onReachBottom: function () {
    var that = this;
    that.setData({
      curPage: that.data.curPage + 1
    })
    that.initData();
  },
  shoplist_tap :function(event){
    var shop_code = event.currentTarget.dataset.shop_code;
    console.log(shop_code);
    wx.navigateTo({
      url: '../../shouye/detail/centsIndianaDetail/centsDetail?shop_code=' + shop_code
    })
  }
})