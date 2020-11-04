// pages/mine/wallet/accountDetail/RefundDetail.js

import config from '../../../../config';
var util = require('../../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    dataList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var datalist = [];
    var item = JSON.parse(options.item);
    console.log(options.item);

    var titles = ["订单编号:", "退款金额:", "退款时间:", "退至钱包金额:"];
    var contents = [item.order_code, Number(item.money), item.add_time, Number(item.money)];
    for (var i = 0; i < titles.length; i++) {
      var data = {};

      data.tittle = titles[i];
      data.content = contents[i];
      datalist.push(data);
    }

    this.setData({
      dataList: datalist,
    });

    this.getStatus(item);
  },

  //获取当前状态
  getStatus: function (item) {
    var image = [];
    var content = "";

    if (item.check == 0) {
      image = ["开始", "提交到银行0", "到账0"];
      content = "处理中";
    } else if (item.check == 2 || item.check == 4 || item.check == 6 || item.check == 7 || item.check == 8 || item.check == 9) {
      image = ["开始", "提交到银行0", "到账0"];
      content = item.check == 2 ? "失败" : "处理中";
    } else if (item.check == 3 || item.check == 10) {
      if (item.check == 3) {
        image = ["开始", "提交到银行", "到账"];
        content = "成功";
      } else {
        image = ["开始", "提交到银行", "到账0"];
        content = "处理中";
      }
    } else if (item.check == 11) {
      image = ["开始", "提交到银行0", "到账0"];
      content = "失败";
      this.setData({
        tixianAgain: true
      })
    } else {
      image = ["开始", "提交到银行", "到账0"];
      content = "处理中";
    }

    this.setData({
      images: image,
      content: content,
    })
  },

  //重新申请提现
  tixiantap: function () {
    wx.navigateTo({
      url: '../Withdrawals/Withdrawals',
    })
  }
})