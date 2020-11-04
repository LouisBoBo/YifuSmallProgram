import config from '../../../config.js';
var util = require('../../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    currentpage: 1,
    type1: '',
    UpyunConfig: config.Upyun,

    titlelist: ["热卖", "上衣", "裤子", "裙子", "套装"],
    type1s: ["1", "2", "4", "3", "7"]
  },
  onShow: function (options) {
    // util.toAuthorizeWx(function (isSuccess) {
    //   if (isSuccess == true) {

    //   }
    // });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    // this.http_shoplist();
  },
  onReady: function (options) {
    this.oneYuan_httpData();
  },
  //列表加载更多
  onReachBottom: function () {
    this.http_shoplist();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      currentpage: 1,
    })
    this.http_shoplist();
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

      app.globalData.oneYuanData = 0;
      app.globalData.typePageHide = 0;

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
  http_shoplist: function () {
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var typename = this.data.titlelist[this.data.currentTab];
    var type1 = this.data.type1s[this.data.currentTab];
    var page = this.data.currentpage;
    var url = config.Host + 'shop/queryCondition?code=1' + '&type_name=' + typename + config.Version + '&token=' + token + '&type1=' + type1 + '&pager.pageSize=30' + '&pager.curPage=' + page;
    util.http(url, this.shoplistData);

  },

  shoplistData: function (data) {
    wx.stopPullDownRefresh();
    if (this.data.currentpage == 1) {
      this.data.shoplist = [];
    }
    if (data.status == 1) {
      var isVip = data.isVip != undefined ? data.isVip : '';
      var maxType = data.maxType != undefined ? data.maxType : '';

      this.data.isVip = isVip;
      this.data.maxType = maxType;

      var page = this.data.currentpage + 1;
      this.data.currentpage = page;
      this.newshoplist(data.listShop);
    } else {
      this.showToast(data.message, 2000);
    }
  },
  newshoplist: function (obj) {
    for (var i = 0; i < obj.length; i++) {
      var new_clde = obj[i].shop_code.substr(1, 3);
      var new_pic = new_clde + '/' + obj[i].shop_code + '/' + obj[i].def_pic;
      obj[i].def_pic = new_pic;
      var shop_se_price = (obj[i].shop_se_price).toFixed(1);
      var newshopname = obj[i].shop_name;
      if (newshopname.length > 12) {
        newshopname = '... ' + newshopname.substr(newshopname.length - 12, 12);
      }
      if (this.data.currentTab == 0)
      {
        var discount = (obj[i].shop_se_price / obj[i].shop_price * 9).toFixed(1)
        obj[i]["discount"] = discount;
      }
      
      obj[i].shop_name = newshopname;
      // obj[i].shop_se_price = shop_se_price;

      if (app.globalData.oneYuanData == 0)//是1元购
      {
        var se_price = (obj[i].assmble_price * 1).toFixed(1);
        if (this.data.isVip > 0) {
          se_price = util.get_discountPrice(shop_se_price, this.data.shop_deduction, this.data.reduceMoney, this.data.maxType);
        }

        obj[i].shop_se_price = se_price;
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
      shoplist: all_shoplists,
      showSub: app.showSub
    })
  },
  //切换菜单
  switchNav: function (e) {
    var page = this;
    var currenttab = e.target.dataset.current;
    if (this.data.currentTab == currenttab) {
      return false;
    } else {
      var current = e.target.dataset.current;
      page.setData({
        currentTab: current,
        currentpage: 1,
        shoplist: [],
      });
      this.http_shoplist();
    }
  },
  //商品详情
  first_list_tap: function (event) {
    var shopcode = event.currentTarget.dataset.shop_code;
    wx.navigateTo({
      url: '../../shouye/detail/detail?' + "shop_code=" + shopcode,
    })
  }
})