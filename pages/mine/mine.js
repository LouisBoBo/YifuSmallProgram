import config from '../../config';
var util = require('../../utils/util.js');
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");
import ToastPannel from '../../common/toastTest/toastTest.js';
var app = getApp();
var utoken = '';
var loginCount;
var loginClick; //1个人信息 2钱包 3卡券 4订单 5成为至尊会员
var otherClick;
var otherClickindex;
var like_count = 0;
var isVipTX = 0; //是否是会员，提现专用  0：不是
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: '0.00',
    coupon_sum: '0.00',
    vip_balance: '0.00',
    upyconfig: config.Upyun,
    Upyun: config.Upyun,
    openYifuDialogShow: false,

    moneyDiscountShowFlag: false,
    moneyDiscount: "0.0", //累计已抵扣的余额
    oneYuanDiscriptionTitle: "免费领未成功通知",
    showInviteFriends: true,
    invitCode: '',

    orderlist: ["待付款", "待发货", "待收货", "待评价", "退款售后"],
    orderimage: ["small-iconImages/heboImg/个人中心_icon_daifukuan.png", "small-iconImages/heboImg/个人中心_icon_daifahuo.png", "small-iconImages/heboImg/个人中心_icon_daishouhuo.png", "small-iconImages/heboImg/个人中心_icon_daipingjia.png", "small-iconImages/heboImg/个人中心_icon_tuikuan.png"],

    // otherlist: ["消息", "穿搭", "蜜友", "收藏", "最爱", "足迹", "照片", "好友奖励"],
    // oldotherimage: ["small-iconImages/heboImg/个人中心_消息.png", "small-iconImages/heboImg/个人中心_穿搭.png", "small-iconImages/heboImg/个人中心_蜜友.png", "small-iconImages/heboImg/个人中心_收藏.png", "small-iconImages/heboImg/个人中心_最爱.png", "small-iconImages/heboImg/个人中心_足迹.png", "small-iconImages/heboImg/个人中心_照片.png", ""],
    // newotherimage: ["small-iconImages/heboImg/个人中心_消息.png", "small-iconImages/heboImg/个人中心_穿搭.png", "small-iconImages/heboImg/个人中心_蜜友.png", "small-iconImages/heboImg/个人中心_收藏.png", "small-iconImages/heboImg/个人中心_最爱.png", "small-iconImages/heboImg/个人中心_足迹.png", "small-iconImages/heboImg/个人中心_照片.png", "small-iconImages/heboImg/个人中心_好友奖励.png"],



    otherlist: ["会员", "佣金", "最爱", "足迹", "消息", "穿搭", "密友", "收藏"],
    oldotherimage: ["minecenter-member.png", "个人中心_好友奖励.png", "个人中心_最爱.png", "个人中心_足迹.png", "个人中心_消息.png", "个人中心_穿搭.png", "个人中心_蜜友.png", "个人中心_收藏.png"],
    newotherimage: ["minecenter-member.png", "个人中心_好友奖励.png", "个人中心_最爱.png", "个人中心_足迹.png", "个人中心_消息.png", "个人中心_穿搭.png", "个人中心_蜜友.png", "个人中心_收藏.png"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    new app.ToastPannel();
    loginCount = 0;
    loginClick = 0;
    otherClick = false;
    otherClickindex = 0;
    this.globalLogin();
  },
  onShow: function(options) {

    this.setData({
      showInviteFriends: true,

    })
    var headpic = ""
    var username = "登录/注册"
    var person_sign = ""

    if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
      headpic = (app.globalData.user.pic != null) ? app.globalData.user.pic : 'https://www.measures.wang/userinfo/head_pic/default.jpg'
      username = app.globalData.user.nickname
    } else {
      headpic = 'https://www.measures.wang/userinfo/head_pic/default.jpg'
    }
    if (app.globalData.user != null && app.globalData.user.person_sign != null) {
      person_sign = app.globalData.user.person_sign
      if (person_sign.length > 30) {
        person_sign = person_sign.substr(0, 29) + "...";
      }
    }

    if (!username) {
      username = ""
    }

    if (username.length > 0) {
      username = username.length > 10 ? (username.substr(0, 10) + '...') : username;
    }
    this.setData({
      headpic: headpic,
      username: username,
      phone: person_sign,
    })
    this.getdataHttp();

    if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
      // util.get_discountHttp(this.discountData);
      util.getFightFailOrder(this.discountData);
      //不显示登录授权 2018-11-4 何波修改
      this.setData({
        isShowAuthorization: false,
        invitCode:app.globalData.user.user_id
      })
    } else {
      //显示登录授权 2018-11-4 何波修改
      this.setData({
        isShowAuthorization: true
      })
    }

    util.get_vip_tofreelingPage2();//有79元免费领未领取自动跳转免费领列表页2

    //大促销已结束
    var showendofpromotionDialog ;
    if (app.globalData.user != null) {
      showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
    } else {
      showendofpromotionDialog = true
    }

    var otherimage = showendofpromotionDialog ? this.data.oldotherimage:this.data.newotherimage;
    this.setData({
      otherimage: otherimage,
      showendofpromotionDialog: showendofpromotionDialog
    })
  },

  memberdata: function(data) {
    if (data.status == 1) {

    }
  },
  getdataHttp: function() {
    var token = (app.globalData.user != null) ? app.globalData.user.userToken : "";
    if (token) {
      var url = config.Host + 'user/count?token=' + token + config.Version;
      util.http(url, this.maindata);

      // util.httpNeedLogin(url, this.maindata, this.onShow());

    }

  },
  maindata: function(data) {
    var that = this;
    if (data.status == 1) {
      console.log(data);

      //已改成显示提现额度
      // var balance = data.balance.toFixed(2);
      var balance = data.extract.toFixed(2);
      var coupon_sum = data.coupon_sum.toFixed(2);
      //待付款pay_count待发货send_count待收货furl_count待评价ass_count退款中refund_count
      var pay_count = data.pay_count;
      var send_count = data.send_count;
      var furl_count = data.furl_count;
      var ass_count = data.ass_count;
      var refund_count = data.change_count;
      var vip_balance = data.vip_balance.toFixed(2);
      var showExtMoney = data.showExtMoney ? data.showExtMoney.toFixed(2):'0.00';
      like_count = data.like_count
      var lablelist = [pay_count, send_count, furl_count, ass_count, refund_count];

      var vip_url = "";
      var vip_name = "";
      var vip_type = "";
      if (data.vipData != undefined) {

        isVipTX = data.vipData.vip_type != undefined ? data.vipData.vip_type : 0;


        vip_url = data.vipData.head_url != undefined ? data.vipData.head_url : "";
        vip_name = data.vipData.vip_name != undefined ? data.vipData.vip_name : "";
        vip_type = data.vipData.vip_type != undefined ? data.vipData.vip_type : "";
      }

      if (vip_type < 0) {
        vip_name = "会员卡失效";
      } else if (vip_type == 0) {
        vip_name = "成为会员";
      }

      this.setData({
        balance: balance,
        coupon_sum: coupon_sum,
        lablelist: lablelist,
        vip_url: vip_url,
        vip_type: vip_type,
        mark: vip_name,
        vip_balance: vip_balance,
        showExtMoney: showExtMoney
        // firstLogin: app.globalData.user.firstLogin
      })

      var currentTime = util.isToday(app.globalData.user.add_date);
      //当天注册标识新人当是第二天去掉新人的标识
      that.setData({
        firstLogin: currentTime == '以前的日期' ? false : true
      })
      
    } else if (data.status == 10030) {
      //清除用户信息
      app.globalData.user = null;
      wx.setStorageSync("3rd_session", "");
      app.New_userlogin(function(data) {
        if (app.globalData.user && app.globalData.user.userToken != undefined) //登录成功
        {
          that.onShow();

        } else {
          that.globalLogin();
        }
      });
    } else {
      this.showToast(data.message, 2000);

    }
  },
  //个人资料
  personaltap: function(event) {
    loginClick = 1;
    if (app.globalData.user && app.globalData.user.userToken != undefined) {
      wx.navigateTo({
        url: '../mine/personal/personal',
      })
    }
  },
  //钱包
  walettap: function(event) {
    
    loginClick = 2;

    if (app.globalData.user && app.globalData.user.userToken != undefined) {
      //大促销已结束
      if (!this.data.showendofpromotionDialog) {
        wx.navigateTo({
          url: '../mine/wallet/wallet?isVipTX=' + isVipTX,
        })
      } else {
        wx.navigateTo({
          url: '/pages/mine/wallet/accountDetail/accountDetail',
        })
      }
      
    }
  },
  //卡券
  cardtap: function(event) {


    loginClick = 3;
    if (app.globalData.user && app.globalData.user.userToken != undefined) {
      wx.navigateTo({
        url: '../mine/Coupon/Coupon',
      })
    }
  },
  //我的订单
  ordertap: function(event) {
    loginClick = 4;
    var index = event.currentTarget.dataset.index;
    if (app.globalData.user && app.globalData.user.userToken != undefined) {

      if (index < 5) //订单
      {
        wx.navigateTo({
          url: '../mine/order/order?indexid=' + index,
        })
      } else { //售后

        this.setData({
          openYifuDialogShow: true
        });
      }
    }
  },

  //邀请提成相关（VIP）
  toInviteFriends: function() {
    loginClick = 5;
    if (app.globalData.user && app.globalData.user.userToken != undefined) {
      wx.navigateTo({
        // url: '/pages/sign/inviteFriends/memberInviteFriends',

        url: '/pages/sign/InviteFriendsFreeShop/InviteFriendsFreeShop',


      })
    }
  },

  /**
   * 成为会员
   */
  meMemberTap: function(e) {
    var mark = e.currentTarget.dataset.mark;
    if (app.globalData.user && app.globalData.user.userToken != undefined) {
      // var url = mark == "成为会员" ? '../mine/member/member?memberComefrom=' + "mine" : '../mine/addMemberCard/addMemberCard?memberComefrom=' + "mine" + '&vip_type=' + '-1003';

      var url = '';
      if (mark == '成为会员') {
        if (wx.getStorageSync("showVipGuide")) {
          url = '../mine/addMemberCard/addMemberCard?memberComefrom=' + "mine" + '&vip_type=' + '-1003'
        } else {
          wx.setStorageSync('showVipGuide', true)
          // url = '../mine/member/member?memberComefrom=' + "mine"
          url = '../mine/addMemberCard/addMemberCard?memberComefrom=' + "mine" + '&vip_type=' + '-1003'
        }
      } else {
        url = '../mine/addMemberCard/addMemberCard?memberComefrom=' + "mine" + '&vip_type=' + '-1003'
      }
      wx.navigateTo({
        url: url,
      })
    }
  },
  othertap: function(event) {
    otherClick = true;
    var index = event.currentTarget.dataset.index;
    otherClickindex = index;
    this.otherToPage(index);
  },

  otherToPage: function(index) {
    if (app.globalData.user && app.globalData.user.userToken != undefined) {
      if (index == 1) {
        wx.navigateTo({
          url: '../mine/addMemberCard/addMemberCard?memberComefrom=' + "mine" + '&vip_type=' + '-1003'
        })
      } else if(index == 3){
        wx.navigateTo({
          url: 'MyLove/MyLove?likeCount=' + like_count, //我的最爱
        })
      } 
      else {
        this.setData({
          openYifuDialogShow: true
        });
      }
    }
  },
  closeInviteFriends: function() {
    this.setData({
      showInviteFriends: false
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // previewImage:function(){
  //   wx.previewImage({
  //     current: "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MjM5MzQ3OTQwMA==&scene=124#wechat_redirect", // 当前显示图片的http链接   
  //     urls: "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MjM5MzQ3OTQwMA==&scene=124#wechat_redirect" // 需要预览的图片http链接列表   
  //   })
  //   wx.getImageInfo({// 获取图片信息（此处可不要）
  //     src: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MjM5MzQ3OTQwMA==&scene=124#wechat_redirect',
  //     success: function (res) {
  //       console.log(res.width)
  //       console.log(res.height)
  //     }
  //   })
  // },

  open_yifu_iknow: function() {
    this.setData({
      openYifuDialogShow: false
    });

    // wx.navigateTo({
    //   url: '../mine/downloadapp/downloadapp',
    // })
    // return;
  },
  save: function() {
    var that = this;
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: function(res) {

        wx.getImageInfo({
          src: 'https://www.measures.wang/small-iconImages/heboImg/small-fiftyRedHongBao.png',
          success: function(sres) {
            console.log(sres.path);
            wx.saveImageToPhotosAlbum({
              filePath: sres.path,
              success: function(fres) {
                console.log(fres);

                that.showToast("保存成功", 3000);

              }
            })
          }

        })
      }

    })
  },

  downloadsubmit: function(e) {
    var formId = e.detail.formId;
    if (formId && app.globalData.user != null) {
      util.httpPushFormId(formId);
    }
  },

  goAPPtx: function(e) { //引导下载APP

    // if (app.globalData.systemInfo == "ios") {

    //   console.log("ios手机")

    this.setData({
      openYifuDialogShow: false,
      showIOSdownload: true,
    })


    // } else {
    //   console.log("android手机")

    //   wx.navigateTo({
    //     url: "downloadapp/downloadapp"

    //   });

    // }

  },

  closeToTX: function() {
    this.setData({
      openYifuDialogShow: false
    })
  },
  closeIOSdownload: function() {
    this.setData({
      showIOSdownload: false
    })
  },


  //拼团失败退款弹窗
  discountData: function(data) {
    console.log(data);
    if (data.status == 1 && data.isFail == 1) {
      this.setData({
        moneyDiscountShowFlag: false,
        moneyDiscount: data.order_price
      })
    }
  },
  //查看订单
  getYiDouBtn: function() {
    wx.navigateTo({
      url: '../mine/order/order?indexid=' + 0,
    })
    this.setData({
      moneyDiscountShowFlag: false
    })
  },
  //点查看余额
  getYueBtn: function() {
    wx.navigateTo({
      url: '../mine/wallet/wallet?isVipTX=' + isVipTX,
    })
    this.setData({
      moneyDiscountShowFlag: false
    })
  },
  //关闭
  closeYiDouBtn: function() {
    this.setData({
      moneyDiscountShowFlag: false
    })
  },

  //授权弹窗
  onclick: function(e) {
    var that = this;
    wx.getUserInfo({
      //允许授权 获取用户信息
      success: function(res) {
        if (!app.globalData.user) {
          wx.showLoading({
            title: '请稍后',
            mask: true,
          })
          //授权成功去登录
          app.New_userlogin(function(data) {
            wx.hideLoading();
            if (app.globalData.user && app.globalData.user.userToken != undefined) //登录成功
            {
              that.onShow();
              if (otherClick) {
                var token = (app.globalData.user != null) ? app.globalData.user.userToken : "";
                var url = config.Host + 'user/count?token=' + token + config.Version;
                util.http(url, function(data) {
                  if (data.status == 1) {
                    like_count = data.like_count;
                    that.otherToPage(otherClickindex);
                  }
                });
                otherClick = false;
              } else {
                that.gotoNextPage();
              }
              //大促销已结束
              var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
              
              var otherimage = showendofpromotionDialog ? that.data.oldotherimage : this.data.newotherimage;
              that.setData({
                otherimage: otherimage,
                showendofpromotionDialog: showendofpromotionDialog
              })
            } else if (app.globalData.user && app.globalData.user.userToken == undefined && app.globalData.channel_type == 1){
              that.showToast('不符合条件', 2000);
            } else {
              that.globalLogin();
            }
          });
        } else if (app.globalData.user && app.globalData.user.userToken == undefined && app.globalData.channel_type == 1) {
          that.showToast('不符合条件', 2000);
        }
      },
      fail: function() {

      }
    })
  },


  //自动登录
  globalLogin: function() {
    var that = this;
    util.autoLogin(loginCount, function(loginfailYiFuShow, login_discribution, login_buttontitle, newloginCount) {
      wx.hideLoading();
      loginCount = newloginCount;
      if (loginCount == 1) //登录成功
      {
        that.onShow();
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
  loginAgainSubmit: function() {
    var that = this;

    that.setData({
      loginfailYiFuShow: false,
    })
    wx.showLoading({
      title: '请稍后',
    })
    that.globalLogin();
  },
  closeLoginPop: function() {
    this.setData({
      loginfailYiFuShow: false
    })
  },
  gotoNextPage: function() {

    var url = '';
    switch (loginClick) {
      case 1:
        url = '../mine/personal/personal' //个人资料
        break;
      case 2:
        url = '../mine/wallet/wallet?isVipTX=' + isVipTX //钱包
        break;
      case 3:
        url = '../mine/Coupon/Coupon' //卡券
        break;
      case 4:
        url = '../mine/order/order?indexid=0' //订单
        break;
      case 5:
        url = '/pages/sign/InviteFriendsFreeShop/InviteFriendsFreeShop'
        break;
    }

    wx.navigateTo({
      url: url,
    })
  },
  //复制邀请码
  copycodeTap: function () {
    var that = this;
    var content = app.globalData.user.user_id+'';
    wx.setClipboardData({
      data: content,
      success: function (res) {

      }
    });
  },
})