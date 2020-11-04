// pages/mine/sqfh/sqfh.js
import config from '../../../config.js';
var util = require('../../../utils/util.js');
import ToastPannel from '../../../common/toastTest/toastTest.js';
var app = getApp();
var formId;
var text1=''
var text2='';
var text3='';
var clickStatus;
var clickWhether_prize;
var supName;
var servicewxh;
var kfzy = false;//是否是客服人员二次提醒用户专用
var data
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upyconfig: config.Upyun,
    Upyun: config.Upyun,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    kfzy = options.kfzy;

    if(!kfzy){

      data = JSON.parse(options.item);
      clickWhether_prize = options.clickWhether_prize
      clickStatus = options.clickStatus
      supName = options.supName + "制造商"
      // supName =  supName.replace('制造商','')
      supName = supName.replace(/制造商/g, "")
    }


    kfzy ? servicewxh = options.wxh : servicewxh = data.wxh

    if(!kfzy){
      if (clickWhether_prize == "2" && clickStatus == "2") {
        text1 = '恭喜您以会员的资格免费领走了'
      } else if (clickWhether_prize == "0" && clickStatus == "2") {
        text1 = '恭喜您免费领走了'
      }
      this.setData({
        text1: text1,
        text2: '价值' + data.price + '元的' + supName,
        text3: data.wxh
      })
    }else{
      this.setData({
        text1: "",
        text2: '心仪的商品',
        text3: servicewxh,
        kfzy: kfzy
      })
    }







  },
  /**
   * 开通会员
  */
  membersubmit: function (e) {
    if (app.globalData.user != null) {
      util.httpPushFormId(e.detail.formId);

      wx.navigateTo({
        url: '../addMemberCard/addMemberCard?memberComefrom=' + this.data.memberComefrom + '&vip_type=-1002',
      })

    }
  },


  //复制微信号
  copyWXH: function () {
    var self = this;
    wx.setClipboardData({
      data: servicewxh,
      success: function (res) {
        // self.setData({copyTip:true}),
        // wx.showModal({
        //   title: '提示',
        //   content: '复制成功',
        //   success: function (res) {
        //     if (res.confirm) {
        //       console.log('确定')
        //     } else if (res.cancel) {
        //       console.log('取消')
        //     }
        //   }
        // })
      }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})