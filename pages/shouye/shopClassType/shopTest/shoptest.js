// pages/shouye/shopClassType/shopTest/shoptest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    winHeight: 0,
    winWidth: 0,
    typeNames: ["上衣", "裤子", "裙子", "套装"],
    shopData: ["d", "d", "d"],
    shoplist: ["1", "2", "3", "1", "2", "3", "1", "2", "3", "1", "2", "3", "1", "2"],
    shoplist1: ["1", "2", "3", "1", "2", "3", "1", "2", "3", "1", "2", "3", "1", "2"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    wx.getSystemInfo({
      success: function (res) {
        page.setData({
          winWidth: res.windowWidth ,
          winHeight: page.data.shoplist.length*210,
          winHeight: res.windowHeight,
        })
      },
    })
  },

  onReachBottom: function () {
    var list = ["1", "2", "3", "1", "2", "3", "1", "2", "3", "1", "2", "3", "1", "2", "3", "1", "2", "3", "1", "2", "3", "1", "2", "3", "1", "2", "3"]
    this.setData({
      winHeight: list.length * 210,
      shoplist: list,
    })
  },
  
})