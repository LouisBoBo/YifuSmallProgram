// pages/listHome/shopCart/shopCart.js
import config from '../../../config';
var util = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    datalist: {},
    haveSelected: false,    //是否有选择商品
    isAllSelected: false,    //是否全选商品
    allPayMoney: '0.0',       //合计价格
    reduceMoney: '0.0',        //节省价格
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();

    var dataUrl = config.Host + "shopCart/queryCart?" + config.Version + "&token=DDBLDSAJFO174TK18FM5";// + app.globalData.user.userToken;
    util.http(dataUrl, this.shopCartData)
  },
  shopCartData:function (data) {
    var movies = [];
    var shop_code_cut = '';
    var cutJson = {};
    for (var idx in data.shop_list) {
      var subject = data.shop_list[idx];
      shop_code_cut = subject.shop_code.substring(1, 4);
      cutJson = subject;
      cutJson["shopPic"] = shop_code_cut + '/' + subject.shop_code+'/'+subject.def_pic;
      cutJson['shop_price'] = subject.shop_price.toFixed(2);
      cutJson['shop_se_price'] = subject.shop_se_price.toFixed(2);
      cutJson['isSelected'] = false;
      movies.push(cutJson)
    }
    this.setData({
      datalist: movies
    });
  },

  // 减  商品数量
  btnReduceClick: function(e){
    var shopitem = e.currentTarget.dataset.shopitem;
    var index = e.currentTarget.dataset.index;

    if (shopitem.shop_num>=2){
      this.data.datalist[index].shop_num = shopitem.shop_num - 1;
      this.setData({ datalist: this.data.datalist })
    }
 
  },
  // 加  商品数量
  btnAddClick: function(e){
    var shopitem = e.currentTarget.dataset.shopitem;
    var index = e.currentTarget.dataset.index;

    if (shopitem.shop_num <= 1){
      this.data.datalist[index].shop_num = shopitem.shop_num + 1;
      this.setData({ datalist: this.data.datalist })
    }else
      this.showToast('抱歉数量有限', 2000);
  },
  // 删除商品
  btnDeleteClick: function(e){
    // this.showToast('删除商品', 2000);
    var index = e.currentTarget.dataset.index;
    this.data.datalist.splice(index, 1);
    this.setData({ datalist: this.data.datalist});
  },
  // 单选商品
  shopSelectClick: function(e){
    var shopitem = e.currentTarget.dataset.shopitem;
    var index = e.currentTarget.dataset.index;
    this.data.datalist[index].isSelected = !shopitem.isSelected;
    this.setData({ datalist: this.data.datalist });
  },
  // 全选商品
  allSelectTap:function() {

  },
  // 结算
  toOrderClick:function() {

  },
  // 去逛逛
  addShopsClick:function(){

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
  // onShareAppMessage: function () {
  
  // }
})