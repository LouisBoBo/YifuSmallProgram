var app = getApp();
var person_sign = '';
var util = require('../../../utils/util.js');
import config from '../../../config';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    var oldperson_sign = ""
    if (app.globalData.user != null)
    {
      oldperson_sign = app.globalData.user.person_sign;
    }
    if (oldperson_sign != null && oldperson_sign.length <= 0) {
      oldperson_sign = "个性签名...";
    }
    this.setData({
      oldperson_sign: oldperson_sign
    })
  },
  onShow: function (options) {
    // util.toAuthorizeWx(function (isSuccess) {
    //   if (isSuccess == true) {

    //   }
    // });
  },
  submitOrder: function (event) {
    util.httpPushFormId(event.detail.formId);
    var message = event.detail.value.message;
    this.checktextareaStr(message)
  },

  checktextareaStr: function (message) {
    if (message.length <= 0 || message == " ") {
      this.showToast("没有新内容哦~", 2000);
    } else {
      person_sign = message;
      var token = app.globalData.user.userToken;
      var userid = app.globalData.user.user_id;
      var url = config.Host + "user/update_userinfo?" + config.Version + "&token=" + token + "&userid=" + userid + "&person_sign=" + message + "&form_id=" + "110";
      util.http(url, this.resultData);
    }
  },
  resultData: function (data) {
    if (data.status == 1) {
      this.showToast("保存成功", 2000);
      app.globalData.user.person_sign = person_sign;
      wx.setStorageSync("3rd_session", app.globalData.user);

      setTimeout(this.goback, 1000);

    } else {
      this.showToast(data.message, 2000);
    }
  },
  goback: function () {
    wx.navigateBack();
  }
})