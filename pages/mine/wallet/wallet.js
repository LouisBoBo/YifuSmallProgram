var app = getApp();
var util = require('../../../utils/util.js');
var WxNotificationCenter = require("../../../utils/WxNotificationCenter.js");
import config from '../../../config.js';
var loginCount;
var isVipTX = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    imagedata: ["/small-iconImages/heboImg/账户明细.png", "/small-iconImages/heboImg/支付密码.png"],
    datalist: ["账户明细", "支付密码"],
    balance: "0.0", //总余额
    extract: "30.0", //可提现额度
    ex_free: "0.0", //提现冻结
    freeze_balance: "0.0", //冻结额度

    isUpperNotitle: true,
    upperdistribution: "为确保账户安全，账户相关操作请到APP内进行",
    upperbuttontitle: "前往“衣蝠”APP",
    upperGoYiFuShow: false,
    openYifuDialogShow: false,
    showNeedTiXian: false,
    upperForwardShow: false,
    uppertittle: "请增加提现额度",
    upperdistribution_list: ["衣蝠为你准备了20元提现现金，可以马上提现", "每日完成赚钱小任务都有机会赚取到2-5元不等的提现现金", "你也可以继续参与疯抢，未抢到退还全部金额，可立即提现", "你也可以直接购买限时特价品，最低4块9还包邮哦"],
    upperbuttontitle_list: ["立即领取", "赚钱任务", "继续疯抢", "限时特价"],
    contactkefuShow:false,
    contactkefuerMembShow:false,

    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},
    length: 0,
    secondimgData: ['complaint_1.png', 'complaint_2.png', 'complaint_3.png'],
    secondtextData: ['发送给朋友', '添加到我的小程序', '添加到桌面'],
    thirdimgData: ['complaint_4.png', 'complaint_5.png', 'complaint_6.png', 'complaint_7.png'],
    thirdtextData: ['浮窗', '设置', '反馈与投诉', '重新进入小程序'],
  },

  onShow: function(options) {
    // util.toAuthorizeWx(function(isSuccess) {
    //   if (isSuccess == true) {}
    // });
    this.httpData();

    var that = this;
    wx.onUserCaptureScreen(function (res) {
      console.log('……………………………………………………用户截屏了')
      setTimeout(function () {
        that.showModal();
      }, 1000)
    })
  },



  onLoad: function(options) {

    loginCount = 0;
    new app.ToastPannel();
    // this.httpData();
    this.http_getwalletData();
    isVipTX = options.isVipTX;
    //从抽奖界面过来
    var withdrawToBindWx = options.withdrawToBindWx;

    //每天只弹一次
    // var time = wx.getStorageSync("WxBindingTime");
    // var currentTime = util.isToday(time);
    // if (currentTime != "当天" || withdrawToBindWx == "true") {
    //   this.http_getwxOpenid();
    // }

    if(options.comefrome == 'tixianstyle')
    {
      this.setData({
        contactkefuShow:true,
        redhongbaoconming:true
      })
      wx.setStorageSync('poplastTime', 5);
    }

    var that = this;
    //获取是否是会员
    util.get_vip(function (data) {
      var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
      that.setData({
        is_vip: isVip
      })
    })

    //监听登录成功 刷新界面
    WxNotificationCenter.addNotification("testNotificationAuthorizationName", this.testNotificationFromItem1Fn, this);
  },
  testNotificationFromItem1Fn:function(){
    this.globalLogin();
  },

  //钱包数据
  httpData: function() {
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var url = config.Host + 'wallet/myWallet?' + config.Version + '&token=' + token;
    util.http(url, this.handleData);
  },
  handleData: function(data) {
    if (data.status == 1) {
      this.setData({
        balance: (data.balance *1).toFixed(2),
        extract: (data.extract *1).toFixed(2),
        ex_free: (data.ex_free *1).toFixed(2),
        ext_money: (data.ext_money *1).toFixed(2),
        raffleMoney: (data.raffleMoney *1).toFixed(2),
        vip_balance: (data.vip_balance * 1).toFixed(2),
        freeze_balance: (data.freeze_balance * 1).toFixed(2),
      })
    }
  },

  //钱包数据
  http_getwalletData: function() {
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var url = config.Host + 'wallet/doDepositAgo?' + config.Version + '&token=' + token;
    util.http(url, this.walletData);
  },
  walletData: function(data) {
    if (data.status == 1) {
      var minicill_sss = data["minicill"];
      minicill_sss = minicill_sss ? minicill_sss : '4.9';
      this.setData({
        uppertittle: minicill_sss + "元起提，请增加提现额度",
      })
    }
  },
  //获取是否绑定微信
  http_getwxOpenid: function() {
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var url = config.Host + 'wallet/getWxOpenid?' + config.Version + '&token=' + token;
    util.http(url, this.getwxOpenid);
  },
  getwxOpenid: function(data) {
    if (data.status == 1) {
      var NowTime = new Date().getTime();
      wx.setStorageSync("WxBindingTime", NowTime)

      if (data.data == 0) { //0没有授权 1授权
        this.setData({
          is_showTixianView: 'true'
        })
      }
    }
  },

  loginsubmit:function(e){
    if(app.globalData.user != null)
    {
      util.httpPushFormId(e.detail.formId);
    }
  },
  //绑定微信
  addWx: function(event) {
    util.httpPushFormId(event.detail.formId);
    var message = event.detail.value.message;
    this.checktextareaStr(message)
  },
  checktextareaStr: function(message) {
    if (message.length <= 0 || message == " ") {
      this.showToast("输入姓名才能绑定~", 2000);
    } else {
      var result = this.chkstrlen(message);
      if (result == "false" || message.length > 5) {
        this.showToast("姓名有误，请重新输入", 2000);
        return;
      }
      var token = app.globalData.user.userToken;
      var open_id = app.globalData.user.wxcx_openid;
      var url = config.Host + "wallet/addWxOpenid?" + config.Version + "&token=" + token + "&openid=" + open_id + "&u_name=" + message;
      util.http(url, this.resultData);
    }
  },
  resultData: function(data) {
    this.setData({
      is_showTixianView: ''
    })
    if (data.status) {
      this.showToast(data.message, 2000);
    }
  },

  chkstrlen: function(str) {
    var strlen = "";
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) //是汉字
      {} else //不是汉字
        strlen = "false";
    }
    return strlen;
  },

  //增加提现额度
  suspendtap: function(event) {
    // wx.navigateTo({
    //   url: '../../sign/withdrawLimit/withdrawLimit',
    // })
    // this.setData({
    //   upperForwardShow: true
    // })
    // this.setData({
    //   showNeedTiXian: true
    // })
    wx.navigateTo({
      url: "/pages/sign/sign",
    })
  },
  //关闭弹框
  forwardsuccesstap: function() {

    //赚钱任务
    wx.navigateTo({
      url: '../../sign/sign',
    })

    this.setData({
      showNeedTiXian: false
    })
  },


  // 好物1元起兑
  fowardlimittap: function(e) {
    if (this.data.upperForwardShow == true) {
      switch (e.currentTarget.dataset.id) {
        case (0):
          {
            //超级分享日
            wx.navigateTo({
              url: '../../sign/inviteFriends/inviteFriends',
            })
            break;
          }
        case (1):
          {
            //赚钱任务
            wx.navigateTo({
              url: '../../sign/sign',
            })
            break;
          }
        case (2):
          {
            //APP首页
            wx.switchTab({
              url: "../../shouye/shouye",
            }) // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
            break;
          }
        case (3):
          {
            //特价商品列表
            wx.navigateTo({
              url: '../../shouye/SpecialOffer/SpecialOffer',
            })
            break;
          }
      }
    }
    this.setData({
      upperForwardShow: false,
    })
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
            that.tixiantap();
            that.httpData();
            wx.hideLoading();
          });
        }
      },
      fail: function () {

      }
    })
  },
  //提现
  tixiantap: function(event) {
    //没有登录先去登录
    if (app.globalData.user == null || app.globalData.user == undefined || app.globalData.user.userToken == undefined)
    {
      return;
    }

    //会员才能提现
    if (this.data.is_vip == 0 || this.data.is_vip == 3){
      if (this.data.redhongbaoconming)
      {
        this.setData({
          contactkefuShow: true
        })
      }else{
        // this.setData({
        //   contactkefuerMembShow: true
        // })

        //去抽奖界面提示用户购买会员才可提现
        wx.navigateTo({
          url: '/pages/mine/withdrawLimitTwo/withdrawLimitTwo?comefrom=wallet&extract='+this.data.extract,
        })

        // wx.navigateTo({
        //   url: 'Withdrawals/Withdrawals?isVipTX=' + isVipTX,
        // })
      }
      
    }else{
      wx.navigateTo({
        url: 'Withdrawals/Withdrawals?isVipTX=' + isVipTX,
      })
    }
    //暂时去掉APP引导
    // console.log("保存的信息：" + wx.getStorageSync("firsttixiantx"));
    // if (wx.getStorageSync("firsttixiantx") == true) { //非第一次提现
    //   this.setData({
    //     openYifuDialogShowTZX: true
    //   })
    // } else { //第一次提现
    //   wx.setStorageSync("firsttixiantx", true)
    //   wx.navigateTo({
    //     url: 'Withdrawals/Withdrawals',
    //   })
    // }

    
    // wx.navigateTo({
    //   url: 'Withdrawals/Withdrawals?isVipTX=' + isVipTX,
    // })


  },
  downloadsubmit: function (e) {
    var formId = e.detail.formId;
    if (formId && app.globalData.user != null) {
      util.httpPushFormId(formId);
    }
  },
  goAPPtx: function() { //引导下载APP

    // if (app.globalData.systemInfo == "ios") {

    //   console.log("ios手机")

    // wx.navigateTo({
    //   url: "../downloadapp/downloadapp"

    // });
    this.setData({
      openYifuDialogShowTZX: false,
      showIOSdownload: true,
    })


    // } else {
    //   console.log("android手机")

    //   wx.navigateTo({
    //     url: "../downloadapp/downloadapp"

    //   });

    // }

  },
  closeIOSdownload: function() {
    this.setData({
      showIOSdownload: false,
    })
  },
  //关闭提现弹框
  tixianview_close: function(event) {
    this.setData({
      is_showTixianView: ''
    })
  },
  moretap: function(event) {
    var index = event.currentTarget.dataset.index;
    if (index == 0) {
      wx.navigateTo({
        url: 'accountDetail/accountDetail',
      })
    } else
      // this.showToast("功能正在上线中...", 2000);
      this.setData({
        // upperGoYiFuShow: true
        openYifuDialogShow: true

      });
  },

  upperlimittap: function() {
    this.setData({
      upperGoYiFuShow: false,
      openYifuDialogShow: true
    })
  },

  closeToApp: function() {
    this.setData({
      openYifuDialogShow: false

    })

  },

  closeToTX: function() {
    this.setData({
      openYifuDialogShowTZX: false,
    })

    wx.navigateTo({
      url: 'Withdrawals/Withdrawals',
    })
  },

  open_yifu_iknow: function() {
    this.setData({
      openYifuDialogShow: false
    });
  },


  //自动登录
  globalLogin: function () {
    var that = this;
    wx.showLoading({
      title: '请稍后',
    })
    util.autoLogin(loginCount, function (loginfailYiFuShow, login_discribution, login_buttontitle, newloginCount) {
      loginCount = newloginCount;
      if (loginCount == 1)//登录成功
      {
        that.httpData();
      } else {
        that.setData({
          loginfailYiFuShow: loginfailYiFuShow,
          login_discribution: login_discribution,
          login_buttontitle: login_buttontitle,
        })
      }
    })
  },
  //登录失败重新登录
  loginAgainSubmit: function () {
    var that = this;

    that.setData({
      loginfailYiFuShow: false,
    })
    wx.showLoading({
      title: '请稍后',
    })
    that.globalLogin();
  },
  closeLoginPop: function () {
    this.setData({
      loginfailYiFuShow: false
    })
  },
  contactkefu:function(){
    this.setData({
      contactkefuShow: false,
      contactkefuerMembShow:false
    })
  },
  colseTips:function(){
    this.setData({
      contactkefuShow: false,
      contactkefuerMembShow:false
    })
  },
  xianjinRedsubmit:function(){
    this.setData({
      contactkefuShow: false,
      contactkefuerMembShow: false
    })
  },

  // 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认600ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();//调用显示动画
    }, 200)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800,//动画的持续时间 默认800ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 500)//先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(600).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },

  //点击反馈内容
  itemtap: function (e) {
    var clciktext = e.currentTarget.dataset.id;
    if (clciktext == "反馈与投诉") {
      console.log('clciktext=', clciktext);
      this.setData({
        hideModal: true
      })
      wx.navigateTo({
        url: '/pages/mine/Complaint/Complaint?path=/inviteFriends/memberFriendsReward',
      })
    }
  },
  //投诉分享
  complain_shareTap: function () {
    this.setData({
      hideModal: true
    })
  },
})