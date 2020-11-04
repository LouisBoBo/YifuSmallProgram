// pages/shopType/shopSearch/SpecialShopSearch.js

import config from '../../../config';

var util = require('../../../utils/util.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    currentpage: 1,
    emptyViewShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.navigateTitle != undefined)
    {
      this.data.navigateTitle = options.navigateTitle;
      wx.setNavigationBarTitle({
        title: options.navigateTitle
      })
    }
    
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var picHeight = res.windowWidth * 9 / 6;
        var listItemHeight = (res.windowWidth * 9 / 6) * 0.96 * 0.504;
        var listItemWidth = res.windowWidth * 0.96 * 0.504;
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          picHeight: picHeight,
          listItemHeight: listItemHeight,
          listItemWidth: listItemWidth,
        });
      }
    });
    that.oneYuan_httpData();
  },

  //获取是否是一元购
  oneYuan_httpData: function () {
    var that = this;
    var url = config.Host + 'cfg/on_off_3_7?' + config.Version;
    util.http(url, that.oneYuanData);
  },
  oneYuanData: function (data) {
    var that = this;
    if (data.status == 1) {
      
      app.globalData.oneYuanData = 0; //默认是一元购

      util.get_discountHttp(function (data) {
        if (data.status == 1) {
          var money = data.one_not_use_price.toFixed(2);
          var shop_deduction = Number(data.shop_deduction) > 1 ? 1.0 : data.shop_deduction;
          that.setData({
            reduceMoney: money,
            shop_deduction: shop_deduction != undefined ? shop_deduction : 0.0
          })
        }

        that.http_shoplist();
      });
    }
  },

  //热卖列表数据
  http_shoplist: function () {
    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }

    var page = that.data.currentpage;
    var url = "";

    if (token.length > 10) {
      url = config.Host + 'shop/queryPackageList?pager.order=desc' + config.Version + '&token=' + token + '&pager.pageSize=30' + '&pager.curPage=' + page + '&p_type=0' + '&package_name=' + this.data.navigateTitle;
    } else {
      url = config.Host + 'shop/queryPackageList?pager.order=desc' + config.Version + '&pager.pageSize=30' + '&pager.curPage=' + page + '&p_type=0' + '&package_name=' + this.data.navigateTitle;
    }
    util.http(url, that.shoplistData);
  },

  //活动商品 特价商品处理数据
  shoplistData: function (data) {
    wx.stopPullDownRefresh();
    if (this.data.currentpage == 1) {
      this.data.shoplist = [];
    }
    if (data.status == 1) {

      var page = this.data.currentpage + 1;
      this.data.currentpage = page;

      var isVip = data.isVip != undefined ? data.isVip : '';
      var maxType = data.maxType != undefined ? data.maxType : '';
      this.data.isVip = isVip;
      this.data.maxVip_type = maxType;

      
      var shoplist = [];
      for (var i = 0; i < data.pList.length; i++) {

        var wxcx_shop_group_price = data.pList[i].assmble_price;

        var virtual_sales = data.pList[i].virtual_sales;
        data.pList[i].shop_list[0].virtual_sales = virtual_sales;
        data.pList[i].shop_list[0].def_pic = data.pList[i].def_pic;
        data.pList[i].shop_list[0].shop_se_price = data.pList[i].shop_se_price;
        data.pList[i].shop_list[0].wxcx_shop_group_price = wxcx_shop_group_price;
        data.pList[i].shop_list[0].assmble_price = wxcx_shop_group_price;
        shoplist.push(data.pList[i].shop_list[0]);
        console.log(shoplist);
      }
      this.remaishoplist(shoplist, wxcx_shop_group_price);
    } 
  },

  remaishoplist: function (obj, wxcx_shop_group_price) {

    for (var i = 0; i < obj.length; i++) {
      var new_clde = obj[i].shop_code.substr(1, 3);
      var new_pic = "";
      var shop_code = obj[i].shop_code;
      var newshopname = obj[i].shop_name;
      var shop_se_price = (obj[i].shop_se_price * 1).toFixed(1);

      { //生活
        new_pic = obj[i].def_pic;

        if (newshopname.length > 24) {
          newshopname = '... ' + newshopname.substr(newshopname.length - 24, 24);
        }
      }

      obj[i].def_pic = new_pic;
      obj[i].shop_code = shop_code;
      obj[i].shop_name = newshopname;

      if (this.data.currentTab == 0) {
        var discount = (obj[i].shop_se_price / obj[i].shop_price * 9).toFixed(1)
        obj[i]["discount"] = discount;
      }

      if (app.globalData.oneYuanData == 0) //是1元购
      {
        var se_price = (obj[i].assmble_price * 1).toFixed(1);
        if (this.data.curTabId != 'news') //生活
        {
          if (this.data.isVip > 0) {
            se_price = util.get_discountPrice(obj[i].shop_se_price, this.data.shop_deduction, this.data.reduceMoney, this.data.maxVip_type);
          }
        } else {//时尚
          if (this.data.isVip > 0) {
            se_price = util.get_discountPrice(obj[i].shop_se_price, this.data.shop_deduction, this.data.reduceMoney, this.data.maxVip_type);
          }
        }

        obj[i].shop_se_price = (se_price * 1).toFixed(1);
        obj[i].shop_price = shop_se_price;
        obj[i]["SupperLab"] = 0;
      } else {
        obj[i].shop_se_price = shop_se_price;
        obj[i]["SupperLab"] = 1;
      }
    }
    var all_shoplists = this.data.shoplist;
    for (var j = 0; j < obj.length; j++) {
      all_shoplists.push(obj[j]);
    }
    
    this.setData({
      emptyViewShow:all_shoplists.length>0?false:true,
      shoplist: all_shoplists,
      recommendListData: all_shoplists
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      currentpage: 1
    })
    this.oneYuan_httpData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.oneYuan_httpData();
  },

  //商品详情
  recommendShopItemClick: function (event) {
    var shopcode = event.currentTarget.dataset.shop_code;
    
    var url = '../../shouye/detail/detail?' + "shop_code=" + shopcode + "&shop_type=2"

    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})