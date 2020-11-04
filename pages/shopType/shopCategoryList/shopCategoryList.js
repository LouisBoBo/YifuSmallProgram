import config from '../../../config';

var util = require('../../../utils/util.js');

var app = getApp();

Page({
  data: {

    Upyun: config.Upyun,
    activityIndex: 0,
    topData: [],
    curPage: 1,

    class_id: '',
    type1: '',
    style: '',
    datalist: {},
    navigateTitle: "",
    requestUrl: "",
    isEmpty: true,
    reduceMoney:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {

    this.setData({
      topData:
      [{ name: '最新', str: "pager.sort=audit_time&pager.order=desc" },
      { name: '热销', str: "pager.sort=virtual_sales&pager.order=desc" },
      { name: '价格↑', str: "pager.sort=shop_se_price&pager.order=asc" },
      { name: '价格↓', str: "pager.sort=shop_se_price&pager.order=desc" }],
    })

    app.globalData.oneYuanData = 0; //默认是一元购
    
    var navigateTitle = options.navigateTitle;
    var class_id = options.class_id;
    var type1 = options.type1;
    var style = options.style;

    this.data.style = style;
    this.data.type1 = type1;
    this.data.class_id = class_id;
    this.data.navigateTitle = navigateTitle;
    var dataUrl = "";
    var baseUrl = "shop/queryConUnLogin?";
    if (app.globalData.user != null&&app.globalData.user.userToken != undefined )
      baseUrl = 'shop/queryCondition?token=' + app.globalData.user.userToken;

    if (style) {
      dataUrl = config.Host + baseUrl + config.Version + "&style=" + style;
    }
    else if (type1) {
      dataUrl = config.Host + baseUrl + config.Version + "&type1=" + type1;
    }
    else if (class_id) {
      dataUrl = config.Host + baseUrl + config.Version + "&class_id=" + class_id;
    } else
      dataUrl = config.Host + baseUrl + config.Version + "&shop_name=" + navigateTitle;

    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
    this.data.requestUrl = dataUrl;

    var that = this;
    util.get_discountHttp(function (data) {
      
      if (data.status == 1) {
        var money = data.one_not_use_price.toFixed(2);
        var shop_deduction = Number(data.shop_deduction) > 1 ? 1.0 : data.shop_deduction;
        that.setData({
          reduceMoney: money,
          shop_deduction: shop_deduction != undefined ? shop_deduction : 0.0
        })
      }

      util.http(dataUrl, that.processDoubanData)
    });
    
  },

  processDoubanData: function (moviesDouban) {
    var movies = [];
    var shop_code_cut = '';
    var cutJson = {};
    var isVip = moviesDouban.isVip != undefined ? moviesDouban.isVip : '';
    var maxType = moviesDouban.maxType != undefined ? moviesDouban.maxType : '';

    this.data.isVip = isVip;
    this.data.maxType = maxType;

    for (var idx in moviesDouban.listShop) {
      var subject = moviesDouban.listShop[idx];
      shop_code_cut = subject.shop_code.substring(1, 4);
      cutJson = subject;
      cutJson["cut_shop_code"] = shop_code_cut;
      var shop_se_price = (subject.shop_se_price).toFixed(1);
      // cutJson["shop_se_price"] = shop_se_price;

      //何波修改2018-4-4
      if (app.globalData.oneYuanData == 0)//是1元购
      {
        var se_price = (subject.assmble_price * 1).toFixed(1);

        if (this.data.isVip > 0) //如果是会员 列表价格=单独购买价-抵扣价格
        {
          // se_price = cutJson.shop_se_price - this.data.reduceMoney > 0 ? (cutJson.shop_se_price - this.data.reduceMoney) : '0.0';

          se_price = util.get_discountPrice(cutJson.shop_se_price, this.data.shop_deduction, this.data.reduceMoney, this.data.maxType);

        }

        cutJson.shop_se_price = (se_price * 1).toFixed(1);
        cutJson.shop_price = shop_se_price;
      } else {
        cutJson.shop_se_price = shop_se_price;
        cutJson.supp_label = '';
      }

      movies.push(cutJson)
    }

    var totalMovies = {}

    //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.datalist.concat(movies);
    }
    else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      showSub:app.showSub,
      datalist: totalMovies
    });


    this.data.curPage += 1;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh()
  },

  onTapClick: function (event) {
    const index = event.currentTarget.dataset.index;
    this.setData({ activityIndex: index })

    var dataUrl = '';
    var baseUrl = "shop/queryConUnLogin?";
    if (app.globalData.user != null&&app.globalData.user.userToken != undefined )
      baseUrl = 'shop/queryCondition?token=' + app.globalData.user.userToken;

    if (this.data.style) {
      dataUrl = config.Host + baseUrl + config.Version + "&style=" + this.data.style;
    }
    else if (this.data.type1) {
      dataUrl = config.Host + baseUrl + config.Version + "&type1=" + this.data.type1;
    }
    else if (this.data.class_id) {
      dataUrl = config.Host + baseUrl + config.Version + "&class_id=" + this.data.class_id;
    } else
      dataUrl = config.Host + baseUrl + config.Version + "&shop_name=" + this.data.navigateTitle;

    var refreshUrl = '';
    if (index == 0) {
      refreshUrl = dataUrl;
    }else
      refreshUrl = dataUrl + "&" + this.data.topData[index].str;

    this.data.requestUrl = refreshUrl;

    refreshUrl = refreshUrl + "&pager.curPage=1" ;


    this.data.curPage = 1;
    this.data.datalist = {};
    this.data.isEmpty = true;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl + "&pager.curPage=" + this.data.curPage;
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl +
      "&pager.curPage=1";
    this.data.curPage = 1;
    this.data.datalist = {};
    this.data.isEmpty = true;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  // 商品点击  进入详情
  toShopDetailClick: function (event) {
    if (app.globalData.user != null && app.globalData.user.userToken != undefined)
      util.httpPushFormId(event.detail.formId);
    var shop_code = event.currentTarget.dataset.code;
    var path = "../../../../../../shouye/detail/detail?" + "shop_code=" + shop_code;

    wx.navigateTo({
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})