var app = getApp();
var person_sign = '';
var util = require('../../../utils/util.js');
import config from '../../../config';
var token
var userid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    showSR: false,
    showNoSR: false,
    showShareLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    
    if(app.globalData.user)
    {
      token = app.globalData.user.userToken;
      userid = app.globalData.user.user_id;
    }
    
    this.setData({
      user_id: userid
    })

    //查询是否已经有上级
    var that = this;
    that.loginHttp();

    //如果分享进入且没有登录 弹此框
    if(app.globalData.user == undefined || app.globalData.user == null)
    {
      if (options.isShareFlag == 'true')
      {
        that.setData({
          showShareLogin: true
        })
      }
    }
  },
  onShow: function (options) {
    // util.toAuthorizeWx(function (isSuccess) {
    //   if (isSuccess == true) {

    //   }
    // });
  },
  loginHttp:function(){
    var that = this;
    if (app.globalData.user) {
      token = app.globalData.user.userToken;
      userid = app.globalData.user.user_id;
    }
    var url = config.Host + 'user/query_userinfo?token=' + token + config.Version;
    util.http(url, function (data) {
      if (data.status == 1) {
        if (data.userinfo.parent_id) {
          that.setData({

            showSR: false,
            showNoSR: true

          })
        } else {
          that.setData({

            showSR: true,
            showNoSR: false

          })
        }
      }
    });
  },
  // 授权弹窗
  onclick: function (e) {
    var that = this;
    wx.getUserInfo({
      //允许授权 获取用户信息
      success: function (res) {
        if (!app.globalData.user) {
          wx.showLoading({
            title: '请稍后',
            mask: true,
          })
          //授权成功去登录
          app.New_userlogin(function () {
            that.loginHttp();
            wx.hideLoading();
            that.setData({
              showShareLogin:false,
              user_id: app.globalData.user.user_id
            })
          });
        }
      },
      fail: function () {

      }
    })
  },

  submitOrder: function (event) {
    util.httpPushFormId(event.detail.formId);
    var message = event.detail.value.message;
    this.checktextareaStr(message)
  },

  checktextareaStr: function (message) {
    if (message.length <= 0 || message == " ") {
      this.showToast("请输入邀请码", 3000);
    } else {
      person_sign = message;

      var url = config.Host + "user/setReferee?" + config.Version + "&token=" + token + "&userid=" + userid + "&parent_id=" + message;
      util.http(url, this.resultData);
    }


  },
  resultData: function (data) {
    this.showToast(data.message, 2000);
    var that = this;
    if (data.status == 1){
      that.setData({
        showSR: false,
        showNoSR: true
      })
    }

  },


  coyeUserID:function(){
    wx.setClipboardData({
      data: userid +"",
      success: function (res) {
  
      }
    });
  },
  showYqmTips:function(){
    this.setData({
      showTips:true
    })
  },
  colseTips:function(){
    this.setData({
      showTips: false
    })
  },
  closeVipDialog:function(){
    this.setData({
      showShareLogin:false
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    var that = this;
    var path = '';
    if (app.globalData.user != null && app.globalData.user.user_id != undefined) {
      path = '/pages/mine/myInviNumber/myInviNumber?' + "isShareFlag=true" + "&user_id=" + app.globalData.user.user_id;
    } else {
      path = 'pages/mine/myInviNumber/myInviNumber?' + "isShareFlag=true";
    }

    return {

      title: '👉请点下方，并告知我您的邀请码。',
      path: path,
      imageUrl: that.data.Upyun + '/small-iconImages/heboImg/shareflag-invitLogin.jpg',
      success: function (res) {
        // 转发成功
        this.showToast('分享成功', 2000);
      },
      fail: function (res) {
        // 转发失败
        this.showToast('分享失败', 2000);
      }
    }
  }

})