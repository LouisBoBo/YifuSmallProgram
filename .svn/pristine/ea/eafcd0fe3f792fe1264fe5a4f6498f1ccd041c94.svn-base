// pages/shopType/moreBrandsList/moreBrandsList.js

import config from '../../../config';
import DataBase from '../../../data/dataBase.js';


Page({

  /**
   * 页面的初始数据
   */
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const allBrand = DataBase.getBrandsData();
    this.setData({
      Upyun: config.Upyun,
      allBrandsData: allBrand,
    })
  },

  onBrandTap: function (event) {
    // var id = event.currentTarget.dataset.id;
    // var name = event.currentTarget.dataset.name;
    // var pic = event.currentTarget.dataset.pic;
    var brand = event.currentTarget.dataset.brand;
    var name = encodeURIComponent(brand.name);
    var remark = encodeURIComponent(brand.remark)

    wx.redirectTo({
      url: '../../listHome/brandsDetail/brandsDetail?' +
      "class_id=" + brand.id +
      "&navigateTitle=" + name +
      "&brandPic=" + brand.pic +
      "&remark=" + remark
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