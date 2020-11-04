// pages/shopType/shopSearchTM/shopSearchTM.js
// import TitleData from '../../../data/dataBase.js';

var WxSearchTM = require('../wxSearchTM/wxSearchTM.js')
var TitleData = require('../../../data/dataBase.js')


Page({

  /**
   * 页面的初始数据
   */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //初始化的时候渲染WxSearchTMdata

    const hotTitleData = ["连衣裙款式", "上衣款式", "版型", "短袖", "两件套", "短裤", "长裙", "中长裙", "裤子版型", "超短裤", "裙子版型", "上衣组合形式"];
    WxSearchTM.init(that, 43, hotTitleData, true);
    WxSearchTM.initMindKeys(hotTitleData);

    var title = hotTitleData[0];
    this.setData({
      searchPlacehorder: title,
    })
  },
  wxSearchFn: function (e) {
    var that = this
    WxSearchTM.wxSearchAddHisKey(that);
    // console.log('wxSearchFn');
    if (this.data.searchName != undefined)
      //正价
      // wx.redirectTo({
      //   url: '../shopCategoryList/shopCategoryList?' +
      //   "&navigateTitle=" + this.data.searchName
      // })

      //特价
      wx.navigateTo({
        url: '../shopSearch/SpecialShopSearch?' + "&navigateTitle=" + this.data.searchName
      })
  },
  wxSearchInput: function (e) {
    var that = this
    WxSearchTM.wxSearchInput(e, that);
    console.log('WxSearchTMInput');
    this.setData({
      searchName: e.detail.value
    })
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearchTM.wxSearchFocus(e, that);
    console.log('wxSerchFocus');
  },
  wxSearchBlur: function (e) {
    // var that = this
    // WxSearchTM.wxSearchBlur(e, that);
    console.log('wxSearchBlur');
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearchTM.wxSearchKeyTap(e, that);
    var name = e.currentTarget.dataset.key;
    console.log('wxSearchTap---', name)
    // wx.redirectTo({
    //   url: '../shopCategoryList/shopCategoryList?' +
    //   "&navigateTitle=" + name
    // })
    wx.navigateTo({
      url: '../shopSearch/SpecialShopSearch?' + "&navigateTitle=" + name
    })
    //特价
    // wx.redirectTo({
    //   url: 'SpecialShopSearch?' + "&navigateTitle=" + name
    // })
    var that = this
    WxSearchTM.wxSearchAddHisKey(that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearchTM.wxSearchDeleteKey(e, that);
    console.log('wxSearchDeleteKey');
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearchTM.wxSearchDeleteAll(that);
    console.log('wxSearchDeleteAll');
  },
  wxSearchTap: function (e) {
    // var that = this
    // WxSearch.wxSearchHiddenPancel(that);

    console.log('wxSearchTap');
  },
  searchTMtap:function(){
    wx.navigateTo({
      url: '../shopSearchTM/shopSearchTM'
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})