// pages/mine/order/freeLingShare/freeLingShare.js
import config from '../../../../config';
import ToastPannel from '../../../../common/toastTest/toastTest.js';
var util = require('../../../../utils/util.js');
var MD5 = require('../../../../utils/md5.js');
var app = getApp();
var isOnShare = false;
var shareTitle;
var sharePath;
var sharePic;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    upyconfig: config.Upyun,
    shareFightShop: 'true',
    freeLingShare: 'true'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    if(options)
    {
      var order_code = options.order_code != undefined ? options.order_code : '';
      var shareCount = wx.getStorageSync(order_code);
      if(shareCount == undefined || shareCount == '')
      {
        shareCount = 5;
        wx.setStorageSync(order_code, shareCount)
      }
      
      this.setData({
        orderstatus: options.orderstatus != undefined ? options.orderstatus : '',
        isTM: options.isTM != undefined ? options.isTM : '',
        order_code: options.order_code != undefined ? options.order_code : '',
        roll_code: options.roll_code != undefined ? options.roll_code : '',
        isSubmitOrder: options.isSubmitOrder != undefined ? options.isSubmitOrder : '',
        shareCount: shareCount
      })
    }
    this.getShopData(this.data.isSubmitOrder);
    this.getShareShop();
  },
  
  onShow:function(){
    if(isOnShare == true)
    {
      var shareCount = wx.getStorageSync(this.data.order_code);
      shareCount--;
      wx.setStorageSync(this.data.order_code, shareCount>0?shareCount:1)
      this.setData({
        shareCount: shareCount > 0 ? shareCount : 1
      })

      isOnShare = false;

      if(shareCount <= 0)//下单后去疯抢
      {
        this.shareResultHttp();
      }else{
        this.getShareShop(this.data.isSubmitOrder);
      }
    }
  },

  //商品数据
  getShopData: function (isSubmitOrder) {
    var orderShops = wx.getStorageSync('second_shopdata');

    if (!isSubmitOrder) {
      isSubmitOrder = "0"
    }

    for (var i = 0; i < orderShops.length; i++) {

      if (isSubmitOrder == '1')//下单过来的
      {
        orderShops[i].new_pic = orderShops[i].shopPic;
        orderShops[i].shop_price = orderShops[i].newOldprice;
        orderShops[i].shop_name = orderShops[i].shopName;
        orderShops[i].shop_code = orderShops[i].shopCode;
      } else {
        var shop_code = orderShops[i].shop_code;
        var shop_pic = orderShops[i].shop_pic;
        //商品图片
        var newcode = shop_code.substr(1, 3);
        var new_pic = this.data.Upyun + newcode + '/' + shop_code + '/' + shop_pic;

        orderShops[i].new_pic = new_pic;
        orderShops[i].shop_price = orderShops[i].original_price;
      }
    }

    this.setData({
      isSubmitOrder: isSubmitOrder,
      shopList: orderShops
    })

    //清空保存的数据
    setTimeout(function () {
      wx.setStorageSync('second_shopdata', '');
    }, 5000)
  },

  //商品详情
  shopDetailTap: function (e) {
    var url = "";
    var shop_code = e.currentTarget.dataset.shop_code
    if (this.data.isTM == 1) {
      url = '/pages/shouye/detail/detail?' + "shop_code=" + shop_code + "&shop_type=2";
    } else {
      url = '/pages/shouye/detail/detail?' + "shop_code=" + shop_code;
    }
    wx.navigateTo({
      url: url
    })
  },

  //分享数据
  getShareShop: function () {

    var that = this;

    var dataUrl = config.Host + "shop/shareShop" +
      "?getShop=" + "true" +
      config.Version;
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    util.http(dataUrl, function (data) {
      if (data.status == 1) {
        var shop_code = data.shop.shop_code;
        var shop_pic = data.shop.four_pic.split(",")[2];
        var shareP;
        if (data.shop.four_pic) {
          var str = data.shop.four_pic.split(",");
          if (str.length > 2) {
            shareP = str[2];
          }
        }
        var shop_code_cut = '';
        shop_code_cut = shop_code.substring(1, 4);
        sharePic = that.data.Upyun + shop_code_cut + '/' + shop_code + '/' + shareP;
        shareTitle = '点击购买👆'+'【' + data.shop.shop_name + '】' + "今日特价" + data.shop.wxcx_shop_group_price + "元！";
        sharePath = "/pages/shouye/detail/detail?shop_code=" + shop_code + "&isShareFlag=true";

        that.getCanvasPictiure(sharePic, data.shop.wxcx_shop_group_price);
      }else
        wx.hideLoading();
    })

  },

  //生成分享的合成图片
  getCanvasPictiure: function (imagesrc, price) {
    var that = this;

    util.getCanvasPictiure("shareCanvas", imagesrc,price, '商品分享',function (tempFilePath) {
      wx.hideLoading();
      if (tempFilePath != undefined && tempFilePath != null) {
        that.setData({
          tempFilePath: tempFilePath
        })
      } else {
        that.setData({
          tempFilePath: imagesrc
        })
      }
    })
  },
  /**
   * 分享完调用后台接口
  */
  shareResultHttp:function(){
    var that = this;
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    var dataUrl = config.Host + "order/updateOrderFriendsShare?" + config.Version + "&token=" + app.globalData.user.userToken + '&order_code=' + that.data.order_code;
    util.http(dataUrl, function (data) {
      wx.hideLoading();
      if (data.status == 1) 
      {
        wx.setStorageSync('oneYuan_order_code', that.data.order_code);
        wx.redirectTo({
          url : "/pages/listHome/order/oneBuyLuckPan/oneBuyLuckPanIOS?" + "order_code=" + that.data.order_code + "&FightSuccess=true"
        })
      }else{
        that.showToast(data.message, 2000);
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
    isOnShare = true;

    var that = this;
    var user_id = app.globalData.user.user_id;

    return {
      title: shareTitle,
      path: sharePath + "&user_id=" + user_id,
      imageUrl: that.data.tempFilePath
    }
  }
})