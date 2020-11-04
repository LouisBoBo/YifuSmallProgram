//获取本地化数据
import config from '../../../config';
var util = require('../../../utils/util.js');
var MD5 = require('../../../utils/md5.js');
var base64 = require('../../../utils/base64.js');

var WxNotificationCenter = require("../../../utils/WxNotificationCenter.js");
var app = getApp();

var isCrazyMon = false; // 是否是疯狂星期一

Page({
  data: {
    shopcode: 0,
    upyconfig: config.Upyun,
    newarr: [],
    pageData: [],
    currentpage: 1,
    Upyun: config.Upyun,
    isShowMakeMoney: true
  },

  onLoad: function (options) {



    new app.ToastPannel();
    this.list_shopHttp();
  },

  //列表数据
  list_shopHttp: function () {
    var that = this;
    var url = config.Host + "collocationShop/queryShopCondition?type=2" + config.Version + '&pager.curPage=' + that.data.currentpage + "&pager.pageSize=10";
    util.http(url, that.collocationShopData);
  },
  collocationShopData: function (data) {
    wx.stopPullDownRefresh();
    if (this.data.currentpage == 1) {
      console.log(data);
      this.setData({
        postlist: [],
        pageData: [],
      })
    }
    if (data.status == 1) {
      var page = this.data.currentpage + 1;
      this.setData({
        currentpage: page,
      })
      var listshop = data.listShop;
      this.newshoplist(listshop);
    } else {
      this.showToast(data.message, 2000);
    }
  },

  //列表加载更多
  onReachBottom: function () {
    this.list_shopHttp();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      currentpage: 1
    })
    this.list_shopHttp();
  },
  imageTap: function (event) {
    var code = event.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../../shouye/specialDetail/specialDetail?' + "class_code=" + code
    })
  },
  shopTap: function (event) {
    var shopcode = event.currentTarget.dataset.shop_code;
    wx.navigateTo({
      url: '../../shouye/detail/detail?' + "shop_code=" + shopcode,
    })
  },
  
  //重新处理数据
  newshoplist: function (obj) {
    var that = this;
    for (var k = 0; k < obj.length; k++) {
      var shops = obj[k];
      if (shops.shop_type_list.length) {
        var shop_type_lists = shops.shop_type_list[0].list;
        for (var i = 0; i < shop_type_lists.length; i++) {
          var newshopname = shop_type_lists[i].shop_name;
          if (newshopname.length > 6) {
            newshopname = '... ' + newshopname.substr(newshopname.length - 6, 6);
          }

          var code = shop_type_lists[i].shop_code.substr(1, 3);
          var new_pic = code + '/' + shop_type_lists[i].shop_code + '/' + shop_type_lists[i].def_pic;

          var shop_se_price = (shop_type_lists[i].shop_se_price).toFixed(1);
          obj[k].shop_type_list[0].list[i].shop_name = newshopname;
          obj[k].shop_type_list[0].list[i]["new_def_pic"] = new_pic;
          obj[k].shop_type_list[0].list[i]["new_shop_se_price"] = shop_se_price;
        }
      }
    }
    var pageData = this.data.pageData;
    for (var j = 0; j < obj.length; j++) {
      pageData.push(obj[j]);
    }
    this.setData({
      postlist: pageData,
      pageData: pageData,
    })
  },
  onShow: function () { //在onShow中处理新衣节弹窗
    try {
      isCrazyMon = wx.getStorageSync("HASMOD")
    } catch (e) {
    }


    // isCrazyMon =  true;
    //新衣节弹窗自动弹出，每天只弹一次
    var time = wx.getStorageSync("XINYIJIEZIDONGTANCHU");
    if (util.isToday(time) != "当天" && isCrazyMon) {
      this.setData({
        showNewYI: true
      })
      wx.setStorageSync("XINYIJIEZIDONGTANCHU", new Date().getTime())
    }

  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})