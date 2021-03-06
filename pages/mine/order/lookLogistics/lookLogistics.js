// pages/mine/order/lookLogistics/lookLogistics.js
import config from '../../../../config.js';
var util = require('../../../../utils/util.js');
var app = getApp();
var order_code = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upyconfig: config.Upyun,
    Upyun: config.Upyun,
    islogistic:true,
    logisticList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var item = wx.getStorageSync("orderitem");
    var shop_from = item.shop_from;
    var newshopname = "";
    var newshopprice = "";
    if (shop_from == 4 || shop_from == 6) {//夺宝订单
      newshopname = item.order_name;
      this.setData({
        isorderdetail: 'false',
      })
    } else {//普通订单
      newshopname = item.orderShops[0].shop_name;
      var newprice = item.orderShops[0].shop_price * 0.5 > 50 ? 50 : item.orderShops[0].shop_price * 0.5;
      newshopprice = newprice.toFixed(1);
      order_code = item.order_code;
    }
    //商品名称
    if (newshopname.length > 16) {
      newshopname = newshopname.substr(0, 16) + '... ';
    }

    if (shop_from == 4 || shop_from == 6) {//夺宝订单
      item["new_shopname"] = newshopname;
    } else {//普通订单
      item.orderShops[0]["new_shopname"] = newshopname;
      item.orderShops[0]["shop_price"] = item.orderShops[0]["original_price"];
      item.orderShops[0]["new_pic"] = config.Upyun + item.orderShops[0]["new_shop_pic"];
    }
    this.handleData(item.orderShops);
    this.logisticHttp(item);
  },

  handleData: function (data) {
    var orderlist = [];
    orderlist = data;
    var paytime = util.getMyDate(data.add_time, ".")
    this.setData({
      orderdetail: data,
      orderList: orderlist,
      orderpaytime: paytime,
    })
  },

  //获取物流数据
  logisticHttp:function(item){
    var that = this;
    util.logistic_http(item.logi_code,function(data){
      if(data.status == 1){
        var logisticList = data.data[0].lastResult.data;
        var comName = data.data[0].comName;
        var logCode = item.logi_code;
        if(logisticList){
          for (var i = 0; i < logisticList.length; i++) {
            var context = logisticList[i].context;
            //把字符串检索出来的的数字拆分
            var phone_list = checkPhone(context)
            for (var j = 0; j < phone_list.length; j++) {
              var phoneNumber = phone_list[j];
              if (phoneNumber.length == 11 || phoneNumber.length == 12 || phoneNumber.length == 13) {

                var length = phoneNumber.length;
                var index = context.indexOf(phoneNumber);

                logisticList[i]["value1"] = context.substr(0, index)
                logisticList[i]["phone"] = phoneNumber;
                logisticList[i]["value2"] = context.substr(index + length, context.length)

              }
            }
          }
        }
        
        that.setData({
          comName: comName,
          logCode: logCode,
          logisticList: logisticList
        })
      }
    });
  },

  //商品详情
  shopDetailTap:function(e){
    var item = wx.getStorageSync("orderitem");
    var shop_code = item.orderShops[0]["shop_code"];
    //免费领列表页2的订单看不到详情
    if (item.new_free != 13) {
      wx.navigateTo({
        url: '../../../shouye/detail/detail?' + "shop_code=" + shop_code,
      })
    }
  },
  //点击拨打电话
  phoneTap:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.id
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

// 正则匹配手机号码和电话号码
function checkPhone(text) {
  return text.match(/((((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\d{8})|((\d3,4|\d{3,4}-|\s)?\d{7,14}))?/g);
}