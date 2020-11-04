import config from '../../../../config'
var util = require('../../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    UpyunConfig: config.Upyun,
    pageData: [],
    currentpage: 1,
  },
  onLoad: function (options) {
    this.special_shopHttp();
  },
  //加载更多
  onReachBottom: function (event) {
    this.special_shopHttp();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      currentpage: 1,
    })
    this.special_shopHttp();
  },
  //请求数据
  special_shopHttp: function () {
    var that = this;
    var url = config.Host + "collocationShop/moreProject?" + config.Version + "&pageSize=3" + "&curPage=" + that.data.currentpage;
    util.http(url,that.shopData);
  },

  shopData:function(data){
    wx.stopPullDownRefresh();
    if (this.data.currentpage == 1) {
      this.setData({
        collocationList: [],
        pageData: [],
      })
    }
    if (data.status == 1 && data.data.length)
    {
      var page = this.data.currentpage + 1;
      var newlistshop = this.data.pageData;
      var listshop = data.data;
      for (var i = 0; i < listshop.length; i++) {
        newlistshop.push(listshop[i]);
      }
      this.setData({
        collocationList: newlistshop,
        pageData: newlistshop,
        currentpage: page,
      })
    }
  },

  second_list_tap: function (event) {
    var code = event.currentTarget.dataset.code;
    wx.redirectTo({
      url: '../specialDetail?' + "class_code=" + code,
    })
  },
})