// pages/mine/AppMessage/AppMessage.js
var app = getApp();
var util = require('../../../utils/util.js');
var publicutil = require('../../../utils/publicUtil.js');
import config from '../../../config.js';
import ToastPannel from '../../../common/toastTest/toastTest.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    upyconfig: config.Upyun,
    showendofpromotionDialog:true,
    showkefuService:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options != undefined){
      var toKF = '';
      var kfDownloadClick = '';
      if(options.toKF == '1'){
        toKF = '4';
        kfDownloadClick = 'kfGuideDownloadAPP';
      }else if(options.toGZH == '1'){
        toKF = '9'
        kfDownloadClick = 'gzhGuideDownloadAPP';
      }else if(options.isSQXZL == '1'){
        toKF = '8'
        kfDownloadClick = 'xzlGuideDownloadAPP';
      }
      this.setData({
        toKF: toKF,
        kfDownloadClick: kfDownloadClick,
        showkefuService: (options.toKF == "1" || options.toGZH == "1" || options.isSQXZL == '1')?true:false
      })
    }
  },
  
  attentionServiceTap:function(e){
    this.setData({
      showkefuService:false
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