import config from '../../../config';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    winHeight: 0,
    winWidth: 0,
    upyconfig: config.Upyun,
    shops: ["sfsf", "sfsf", "sfsf", "sfsf", "sfsf"],

    typeNames: ["上衣", "裤子", "裙子", "套装"],
    typeIDs: ["2", "4", "3", "7"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShoptypeList('2');
    var page = this;
    wx.getSystemInfo({
      success: function (res) {
        page.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
        })
      },
    })
  },
  switchNav: function (e) {
    var page = this;
    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      var typeid = page.data.typeIDs[e.target.dataset.current];
      page.getShoptypeList(typeid),
        page.setData({
          currentTab: e.target.dataset.current,
        });
    }
  },
  changecurrent: function (e) {
    console.log('可以滑动');
    var page = this;

    if (this.data.currentTab == e.detail.current) {
      return false;
    } else {
      var typeid = page.data.typeIDs[e.detail.current];
      page.getShoptypeList(typeid),
        page.setData({
          currentTab: e.detail.current,
        });
    }
  },
  getShoptypeList: function (event) {
    var basesData = wx.getStorageSync("shop_tag_basedata");
    var typelist = basesData.data.type_tag;
    var newshopData = [];
    for (var i = 0; i < typelist.length; i++) {
      var type = typelist[i].type;
      var class_type = typelist[i].class_type;
      if (event == type && class_type == 2) {
        var newpic = config.Upyun + typelist[i].pic;
        typelist[i]["newpic"] = newpic;
        newshopData.push(typelist[i]);
      }
    }
    this.setData({
      shopData: newshopData,
    })
  },

  shoptype_shop:function(event){
    var id = event.currentTarget.dataset.id;
    var name = event.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/shopType/shopCategoryList/shopCategoryList?' +
      "class_id=" + id +
      "&navigateTitle=" + name
    })
  }
})