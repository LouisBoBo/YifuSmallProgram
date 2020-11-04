import config from '../../../config';
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    UpyunConfig: config.Upyun,
    loadingMore: false,
    currentpage: 1,
    pageData :[],
    code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var class_code = options.class_code;
    this.setData({
      code: class_code,
    })
    this.special_shopHttp();
    this.commend_shopHttp();
  },

  //列表加载更多
  onReachBottom: function () {
    var page;
    page = this.data.currentpage + 1;

    console.log("加载更多");
    if (this.data.loadingMore) return;
    this.setData({
      currentpage: page,
    })
    this.commend_shopHttp();
  },

  //请求数据
  special_shopHttp: function () {
    var that = this;
    var newurl = config.Host + "collocationShop%20/query2?" + config.Version + "&code=" + that.data.code;
    console.log(newurl);
    util.http(newurl,that.shopdata)
  },
  shopdata: function (data) {
    if(data.status == 1)
    {
      var listshop = data.shop;
      this.newshoplist(listshop);
    }
  },

  //推荐数据
  commend_shopHttp: function () {
    var that = this;
    var url = config.Host + "shop/queryConUnLogin?" + config.Version+"&pager.curPage=" + that.data.currentpage + "&pager.pageSize=10&notType=true&pager.sort=actual_sales&pager.sort=actual_sales";
    util.http(url,that.commendData);
  },
  commendData:function(data){
    if(data.status == 1)
    {
      var listShop = data.listShop;
      this.newcommenlist(listShop)
    }
  },
  first_list_tap: function (event) {
    var shopcode = event.currentTarget.dataset.shop_code;
    wx.navigateTo({
      url: '../../shouye/detail/detail?' + "shop_code=" + shopcode,
    })
  },
  
  second_list_tap: function (event) {
    var code = event.currentTarget.dataset.code;
    var path = 'specialDetail?' + "class_code=" + code;
    var pages = getCurrentPages();
    if (pages.length >= 4) {
      wx.redirectTo({
        url: path,
      })
    } else {
      wx.navigateTo({
        url: path
      });
    }
  },
  moreSpecialTap: function () {
    var path = '../../shouye/specialDetail/moreSpecial/moreSpecial';
    var pages = getCurrentPages();
    if (pages.length >= 4) {
      wx.redirectTo({
        url: path,
      })
    } else {
      wx.navigateTo({
        url: path
      });
    }
  },

  newshoplist: function (obj) {
    console.log('-------', obj.shopList.length);
    if (obj.shopList.length) {
      for (var i = 0; i < obj.shopList.length; i++) {
        console.log('我来了000');
        var new_clde = obj.shopList[i].shop_code.substr(1, 3);
        var new_pic = new_clde + '/' + obj.shopList[i].shop_code + '/' + obj.shopList[i].def_pic;
        obj.shopList[i].def_pic = new_pic;
        var shop_se_price = (obj.shopList[i].shop_se_price).toFixed(1);
        var newshopname = obj.shopList[i].shop_name;
        if (newshopname.length > 12) {
          newshopname = '... ' + newshopname.substr(newshopname.length - 12, 12);
        }
        obj.shopList[i].shop_name = newshopname;
        obj.shopList[i].shop_se_price = shop_se_price;
      }
      this.setData({
        collocation_time: util.getMyDate(obj.add_time,'.','true'),
        collocation_name: obj.collocation_name,
        collocation_name2: obj.collocation_name2,
        headImageurl: obj.collocation_pic,
        discription: obj.collocation_remark,
        shoplist: obj.shopList,
        showSub: app.showSub,

        collocationList: obj.collocationList,
      })
    }
  },

  newcommenlist: function (obj) {
    if (obj.length) {
      for (var i = 0; i < obj.length; i++) {
        console.log('我来了000');
        var new_clde = obj[i].shop_code.substr(1, 3);
        var new_pic = new_clde + '/' + obj[i].shop_code + '/' + obj[i].def_pic;
        obj[i].def_pic = new_pic;
        var shop_se_price = (obj[i].shop_se_price).toFixed(1);
        var newshopname = obj[i].shop_name;
        if (newshopname.length > 12) {
          newshopname = '...' + newshopname.substr(newshopname.length - 12, 12);
        }
        obj[i].shop_name = newshopname;
        // obj[i].shop_se_price = shop_se_price;

        if (app.globalData.oneYuanData == 0)//是1元购
        {
          // var se_price = (app.globalData.oneYuanValue * 1).toFixed(1);
          var se_price = (obj[i].wxcx_shop_group_price * 1).toFixed(1);
          obj[i].shop_se_price = se_price;
          obj[i].shop_price = shop_se_price;
          obj[i]["SupperLab"] = 0;
        } else {
          obj[i].shop_se_price = shop_se_price;
          obj[i]["SupperLab"] = 1;
        }

      }
      
      var pageData = this.data.pageData;
      for (var j = 0; j < obj.length; j++) {
        pageData.push(obj[j]);
      }
      this.data.pageData = pageData;
      this.setData({
        commendShopList: pageData,
      })
    }
  },

  /**
 * 旋转上拉加载图标
 */
  updateRefreshIcon: function () {
    var deg = 360;
    var _this = this;

    var animation = wx.createAnimation({
      duration: 1000
    });

    var timer = setInterval(function () {
      if (!_this.data.loadingMore)
        clearInterval(timer);
      animation.rotateZ(deg).step();
      deg += 360;
      _this.setData({
        refreshAnimation: animation.export()
      })
    }, 1000);
  }
})