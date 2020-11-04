//index.js
//获取应用实例

import config from '../../config';
import DataBase from '../../data/dataBase.js';
var util = require('../../utils/util.js');

var app = getApp();
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");
var formId;
var xuanfuanimationTimer;
Page({
  data: {
    Upyun: config.Upyun,
    isShowMakeMoney: true,
    openFightSuccessShow: false,
    is_noShowMakeMoney:false,
    moneyDiscountShowFlag: false,
    moneyDiscount: "0.0",//累计已抵扣的余额
    oneYuanDiscriptionTitle: "免费领未成功通知",
    showendofpromotionDialog: true,
    // SmallRedHongBao: config.Upyun + 'small-iconImages/heboImg/small-thirtyRedHongBao.png',
  },

  onLoad: function (option) {

    if (!app.parent_id) {
      app.parent_id = option.user_id
    }

    if(app.globalData.channel_type == 1)
    {
      this.setData({
        channel_type: app.globalData.channel_type
      })
    }
    
    // var isShowMakeMoney = app.globalData.user.shouyecount;
    // if (isShowMakeMoney == 0)
    //   this.setData({ isShowMakeMoney: false })
    // else
    //   this.setData({ isShowMakeMoney: true })

    // //设置标题
    // if (app.globalData.oneYuanData == 0) {
    //   wx.setNavigationBarTitle({
    //     title: '衣蝠-' + app.globalData.oneYuanValue + '元抢大牌'
    //   });
    // }
    new app.ToastPannel();
    const allTypes = DataBase.getTypesData();
    const allBrand = DataBase.getBrandsData();
    const hotTitle = DataBase.gethotTitleData();

    this.setData({
      allTypes: allTypes,
      allBrandsData: allBrand,
      searchPlacehorder: hotTitle[0]
    })
    WxNotificationCenter.addNotification("testNotificationItem1Name", this.testNotificationFromItem1Fn, this);
    this.http_Landingpage();

  },
  onShow: function (){
    var that = this;
    if (app.globalData.user && app.globalData.user.userToken) {


        


      that.getOrderStatus();
      //获取会员信息
      // util.get_vip(function (data) {
      //   var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
      //   that.setData({
      //     isVip: isVip
      //   })
      // });
    }

    app.moneyPageisHide(function (data) {

      if (app.globalData.user && app.globalData.user.userToken) {
        that.setData({
          isLoginSuccess: true
        })
      }else{
        that.setData({
          isLoginSuccess: false
        })
      }


      //0不隐藏 1隐藏
      that.setData({
        is_noShowMakeMoney: data == 1 ? false : true
      })
      app.homePagetoSign = that.data.is_noShowMakeMoney;
      
    })

    util.get_vip_tofreelingPage2();//有79元免费领未领取自动跳转免费领列表页2

    //获取是否是会员
    util.get_vip(function (data) {
      var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
      var smallImage = isVip == 0 ? "smallRedHongbao_nintymoney.png" : "smallRedHongbao_hundredmoney.png";

      that.setData({
        SmallRedHongBao: config.Upyun + 'small-iconImages/heboImg/' + smallImage,
      })
      that.setData({
        suspensionHongBao_isShow: true
      })
      that.xuanfuHongBaoAnimation();
    })

    //大促销已结束
    var showendofpromotionDialog ;
    if (app.globalData.user != null) {
      showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
    }else{
      showendofpromotionDialog = app.globalData.channel_type == 1 ? false : true;
    }
    that.setData({
      showendofpromotionDialog: showendofpromotionDialog
    })
  },
  testNotificationFromItem1Fn: function (info) {
    this.http_Landingpage();
  },

  //红包摇摆动画
  xuanfuHongBaoAnimation: function () {
    this.xuanfuanimationMiddleHeaderItem = wx.createAnimation({
      duration: 2000,    // 以毫秒为单位  
      timingFunction: 'linear',
      delay: 50,
      transformOrigin: '50% 50%',
      success: function (res) {
        console.log("***************************");
      }
    });
    xuanfuanimationTimer = setInterval(function () {
      this.xuanfuanimationMiddleHeaderItem.scale(1.2).step({ duration: 300 }).rotate(-15).step({ duration: 300 }).rotate(15).step({ duration: 300 }).rotate(0).step({ duration: 300 }).scale(1.0).step({ duration: 300 });

      this.setData({
        xuanfuanimationMiddleHeaderItem: this.xuanfuanimationMiddleHeaderItem.export()  //输出动画
      });

    }.bind(this), 2000);
  },

  //请求落地页 获取微信小程序落地页开关
  http_Landingpage: function () {
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    // wx.showLoading({
    //   mask: true
    // })
    var url = config.Host + 'cfg/getCurrWxcxType?token=' + token + config.Version;
    util.http(url, this.Landingpage);
  },

  Landingpage: function (data) {
    if (data.status == 1) {
      var shouyecount = data.data;

      if (shouyecount == 0) {
        this.setData({ isShowMakeMoney: false });
      } else
        this.setData({ isShowMakeMoney: true });
      app.globalData.user["shouyecount"] = shouyecount;
    }
    //  else
    // wx.hideLoading();
  },

  //获取用户是否有拼团成功的订单
  getOrderStatus: function () {
    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var oldurl = config.Host + 'order/getOrderStatus?' + config.Version + "&token=" + token;
    util.http(oldurl, that.fightOrder_data);
  },

  fightOrder_data: function (data) {
    var that = this;
    if (data.status == 1 && data.roll == 1) {
      if (!app.isFightSuccess) {
        this.setData({
          ptSuccessUserName: data.user_name != undefined ? data.user_name : '',
          openFightSuccessShow: true
        })
        app.isFightSuccess = true;
      }else{
        util.getFightFailOrder(that.discountData);
      }
    } else {//如果没有再查看是否有退款
      util.getFightFailOrder(that.discountData);
    }
  },
  
  //拼团成功弹窗
  getFight: function () {
    wx.navigateTo({
      url: '../mine/order/order?indexid=' + 2,
    })
    this.setData({
      openFightSuccessShow: false
    })
    console.log("拼团成功");
  },
  closeFight: function () {
    this.setData({
      openFightSuccessShow: false
    })
  },

  // 搜索
  wxSerchFocus: function (e) {
    wx.navigateTo({
      url: 'shopSearch/shopSearch',
    })
  },
  //商品分类
  typeTap: function () {
    console.log('商品分类');
    wx.navigateTo({
      url: '../shouye/shopClassType/shopClassType',
    })
  },
  //赚钱页
  moneytap: function () {
    if (app.globalData.channel_type == 1) {
      wx.navigateTo({
        url: '../sign/sign',
      })
    } else {
      if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
        wx.navigateTo({
          url: '../sign/sign',
        })
      }
    }
  },

  // 分类点击
  categoryTap: function (event) {
    var id = event.currentTarget.dataset.id;
    var name = event.currentTarget.dataset.name;

    wx.navigateTo({
      url: 'shopCategoryList/shopCategoryList?' +
      "class_id=" + id +
      "&navigateTitle=" + name

    })
  },

  // 品牌点击
  onBrandTap: function (event) {
    // encodeURIComponent / decodeURIComponent：
    // 以UTF - 8编码编码所有字符串。
    var id = event.currentTarget.dataset.id;
    var name = encodeURIComponent(event.currentTarget.dataset.name);
    var pic = event.currentTarget.dataset.pic;
    var remark = encodeURIComponent(event.currentTarget.dataset.remark)

    wx.navigateTo({

      url: '../listHome/brandsDetail/brandsDetail?' +
      "class_id=" + id +
      "&navigateTitle=" + name +
      "&brandPic=" + pic +
      "&remark=" + remark
    })
  },
  // 更多品牌点击
  onMoreBrandTap: function (event) {
    console.log("onMoreBrandTap");
    wx.navigateTo({
      url: 'moreBrandsList/moreBrandsList'
    })
    // wx.navigateTo({
    //   url: '../listHome/order/confirm/confirm'
    // })
  },

  ///拼团失败退款弹窗
  discountData: function (data) {
    console.log(data);
    if (data.status == 1 && data.isFail == 1) {
      this.setData({
        moneyDiscountShowFlag: false,
        moneyDiscount: data.order_price
      })
    }
  },
  //查看订单
  getYiDouBtn: function () {
    wx.navigateTo({
      url: '../mine/order/order?indexid=' + 0,
    })
    this.setData({
      moneyDiscountShowFlag: false
    })
  },
  //点查看余额
  getYueBtn: function () {
    wx.navigateTo({
      url: '../mine/wallet/wallet',
    })
    this.setData({
      moneyDiscountShowFlag: false
    })
  },
  closeYiDouBtn: function () {
    this.setData({
      moneyDiscountShowFlag: false
    })
  },

  //任务红包
  signHongBaosubmit: function (e) {
    formId = e.detail.formId;
    if (app.globalData.user != null) {
      util.httpPushFormId(e.detail.formId);
    }
    if(app.globalData.channel_type == 1)
    {
      wx.navigateTo({
        url: '../sign/sign',
      })
    }else{
      if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
        wx.navigateTo({
          url: '../sign/sign',
        })
      }
    }
  },
  // 授权弹窗
  hongbaoclick: function (e) {
    var isxuanfu = e.currentTarget.id;
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
            util.httpPushFormId(formId);
            wx.hideLoading();

            if (isxuanfu == 'xuanfu') {
              that.showToast('90元红包已放入账户，祝您购物愉快。', 5000);
            } else if (isxuanfu == 'sign') {
              wx.navigateTo({
                url: '/pages/sign/sign',
              })
            }
          });
        }
      },
      fail: function () {

      }
    })
  },
  onHide:function(){
    clearInterval(xuanfuanimationTimer);
    this.xuanfuanimationMiddleHeaderItem.rotate(0).step().scale(1.0).step();
    this.setData({
      xuanfuanimationMiddleHeaderItem: this.xuanfuanimationMiddleHeaderItem.export(),  //输出动画
      suspensionHongBao_isShow:false
    });
  }
})
