// pages/sign/signActiveShop/signAntivityShop.js
// 赚钱页活动商品 
import config from '../../../config';
var util = require('../../../utils/util.js');
var app = getApp();
var token;
var task_type;
var isComplete;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UpyunConfig: config.Upyun,
    isNotScan: false,//false 是赚钱任务 true 不是赚钱任务
    activityIndex: 0,
    shopsbanner: "",
    isShowHeadPic: false,
    explainDialogShow:false,
    explainDialogRedText:"浏览完指定数量商品即可完成任务~",
    topData: [{ name: '最新', str: "sort=add_time&order=desc" },
    { name: '价格↑', str: "sort=shop_se_price&order=asc" },
    { name: '价格↓', str: "sort=shop_se_price&order=desc" }],
    currentpage: 1,
    shoplist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var signTask = wx.getStorageSync("SIGN-TASK");
    isComplete = signTask.complete;

    var banner = options.shopsbanner;
    // var banner = "signIn2/banner/20170914n2v53DYW.jpg";
    if (banner && (banner.endsWith("png") || banner.endsWith("jpg"))) {
      this.setData({
        isShowHeadPic: true,
        shopsbanner: banner
      });
    }
    task_type = options.task_type;
    if (task_type){
      //有 task_type 说明是浏览任务
      this.setData({
        isNotScan:false
      });
    }else{
       //没有 task_type 说明是不是浏览任务
      this.setData({
        isNotScan: true
      });
    }

    if (task_type == 5) {
      this.setData({
        explainDialogRedText: "浏览美衣达到指定时间即可完成任务~",
      });
    } else {
      this.setData({
        explainDialogRedText: "浏览完指定数量商品即可完成任务~",
      });
    }

    this.http_shoplist();
    this.autoDialog();
  },

  http_shoplist: function () {
    var url = config.Host + 'shop/queryShopActivity?' +
      this.data.topData[this.data.activityIndex].str +
      config.Version +
      '&token=' + token +
      '&pageSize=10' +
      '&curPage=' + this.data.currentpage;
    util.httpNeedLogin(url, this.shoplistData,function(){
      if (app.globalData.user != null) {
        token = app.globalData.user.userToken;
      }
      this.http_shoplist();
    });
  },

  shoplistData: function (data) {
    wx.stopPullDownRefresh();
    if (this.data.currentpage == 1) {
      this.data.shoplist = [];
    }
    if (data.status == 1) {
      var page = this.data.currentpage + 1;
      this.data.currentpage = page;
      this.newshoplist(data.list);
    } else {
      this.showToast(data.message, 2000);
    }
  },
  newshoplist: function (obj) {
    var all_shoplists = this.data.shoplist;
    for (var i in obj) {
      var new_clde = obj[i].shop_code.substr(1, 3);
      var new_pic = new_clde + '/' + obj[i].shop_code + '/' + obj[i].def_pic;
      obj[i].def_pic = new_pic;
      var shop_se_price = (obj[i].shop_se_price).toFixed(1);
      var newshopname = obj[i].shop_name;
      if (newshopname.length > 12) {
        newshopname = '... ' + newshopname.substr(newshopname.length - 12, 12);
      }
      var discount = (obj[i].shop_se_price / obj[i].shop_price * 10).toFixed(1)
      obj[i]["discount"] = discount;
      obj[i].shop_name = newshopname;
      obj[i].shop_se_price = shop_se_price;
      obj[i].shop_price = obj[i].shop_price.toFixed(1);//原价

      if (app.globalData.oneYuanData == 0)//是1元购
      {
        // var se_price = (app.globalData.oneYuanValue * 1).toFixed(1);
        var se_price = (obj[i].shop_se_price * 1).toFixed(1);
        obj[i].shop_se_price = se_price;
        obj[i].shop_price = shop_se_price;
        obj[i]["SupperLab"] = 0;
      } else {
        obj[i].shop_se_price = shop_se_price;
        obj[i]["SupperLab"] = 1;
      }

      all_shoplists.push(obj[i]);
    }

    this.setData({
      shoplist: all_shoplists,
      showSub: app.showSub

    })
  },

  onTapClick: function (event) {
    var that = this;
    var index = event.currentTarget.dataset.index;
    that.setData({
      currentpage: 1,
      activityIndex: index
    })
    this.http_shoplist();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      currentpage: 1,
    })
    this.http_shoplist();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.http_shoplist();
  },
  
  autoDialog:function(){
    if ((task_type == 4 || task_type == 5 || task_type ==19)
      && !this.data.isNotScan && !isComplete){
      var time = wx.getStorageSync("signActiveDialogTime");
      var currentTime = util.isToday(time);
      if (currentTime != "当天") {
        this.setData({
          explainDialogShow: true,
        });
        var NowTime = new Date().getTime();
        wx.setStorageSync("signActiveDialogTime", NowTime)
      }
    }
  },
  explain_dialog_close:function(){
    this.setData({
      explainDialogShow:false,
    });
  },
  taskExplainTap:function(){
    this.setData({
      explainDialogShow: true,
    });
  },

  first_list_tap: function (event) {
    var shop_code = event.currentTarget.dataset.shop_code;
    var path = "../../shouye/detail/detail?shop_code=" + shop_code+"&isSignActiveShop=true";
    if ("19" == task_type && !isComplete) {
      //浏览赢提现
      wx.navigateTo({
        url: path + "&isForceLookLimit=true"
      });
    } else if ("4" == task_type && !isComplete) {
      //浏览X件商品
      wx.navigateTo({
        url: path + "&isForceLook=true"
      });
    } else {
      wx.navigateTo({
        url: path
      });
    }
  }

})