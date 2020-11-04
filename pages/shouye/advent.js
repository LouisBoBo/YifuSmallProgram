//获取本地化数据
import config from '../../config';
var util = require('../../utils/util.js');
var MD5 = require('../../utils/md5.js');
var base64 = require('../../utils/base64.js');
var showHongBao = require('../../utils/showNewuserHongbao.js');
var fightUtil = require('../../utils/freeFightCutdown.js');
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");
var app = getApp();
var isload;             //是否新加载界面
var isCrazyMon = false; //是否是疯狂星期一
var isautoSign = false; //是否自动跳转到赚钱页
var scrollTop = false;  //是否滑动到顶部
var isActiveShop = true;//是否活动商品
var firstCommint;
var rate = 0; //分辨转换
var floatTop = 0; //悬浮高度
var formId;   //授权formId
var total_micro_second;//红包剩余时间

var coupon //新人优惠券
var is_newShouquan = true; //是否重新授权
var is_Transaction = false; //是否有交易记录
var getNewUserOrder_END = false;
var animationTimer;
var xuanfuanimationTimer;
var thirtyTimer;
var oneYuanData;//0是1元购
var advent_channel; //广告渠道
var redhongbaopopTimer;
var redhongbaoCutdoenTimer;
Page({
  data: {
    aph: 0,
    lastX: 0,
    lastY: 0,
    shopcode: 0,
    upyconfig: config.Upyun,
    UpyunConfig: config.Upyun,
    newarr: [],
    pageData: [],
    currentpage: 1,
    Upyun: config.Upyun,
    isShowMakeMoney: true,
    isShareFlag: false,
    user_id: "",
    Coloropacity: 1,

    uppertittle: "温馨提示",
    isUpperNotitle: true,
    loginupperdistribution: "需要您的授权才能正常使用哦！",
    loginupperbuttontitle: "授权登录",
    upperGoYiFuShow: false,
    hasJYJLdialog: false,
    openYifuDialogShow: false,
    openFightSuccessShow: false,
    getHongBaoSuccessShow: false,
    typePageHide: app.globalData.typePageHide,
    redHongbaoNewuserShow:false,
    suspensionHongBao_isShow: false,
    moneyDiscountShowFlag: false,
    moneyDiscount: "0.0",//累计已抵扣的余额
    oneYuanDiscriptionTitle: "免费领未成功通知",
    coupon: "6",//优惠券
    is_showPage:false,//是否显示界面
    orderlist: ["首页", "购物", "我的"],
    pathlist: ["shouye", "../../pages/shopType/shopType", "../../pages/mine/mine"],
    orderimage: ["../../iconImages/tarbarImages/icon_home.png", "../../iconImages/tarbarImages/icon_shoping_normal.png", "../../iconImages/tarbarImages/icon_wode_normal.png"],

    // 设置tab的数量
    tabs: [
      // { id: "news", isSelect: true, title: "时尚" },
      // { id: "hall", isSelect: false, title: "生活" }
    ], //tabbar数组
    curTabId: "news", //当前tabid
    isShowFloatTab: false, //是否显示悬浮tab
    shouYePage: "",    //ThreePage 首页3 ；FourPage 首页4
    scrollTop: 0,
    is_shouTime: false,
    load_timer: true,//定时器
    clock_hr: '00',//时
    clock_min: '00',//分
    clock_ss: '00',//秒
    clickLogin: true,//点击红包授权
  },

  onLoad: function (options) {

    app.WUSHIredPackageShow = false;
    app.showThirtyEd = false;
    getNewUserOrder_END = false
    firstCommint = true;
    var that = this;
    if (!app.parent_id) {
      app.parent_id = options.user_id
    }
    if (options) {
     
      thirtyTimer = setTimeout(function () {
        total_micro_second = 30 * 60 * 1000;
        that.countdown();
        that.setData({
          is_shouTime: true
        })
      }, 1000);

      //首页2进入的渠道
      if (options.adventpage){
        advent_channel = '68' + options.adventpage;
        wx.setStorageSync("advent_channel", '68' + options.adventpage);
      }

      //存储微信广告ID
      if (options.gdt_vid){
        wx.setStorageSync("gdt_vid",options.gdt_vid);
        wx.setStorageSync("luck_gdt_vid", options.gdt_vid);
        app.globalData.showSignPage = true;
      }

      if (app.globalData.channel_type == 1) {
        this.setData({
          channel_type: app.globalData.channel_type
        })
      }
    }

    //清空赚钱分钟相关数据
    wx.setStorageSync("SIGN-TASK-MM", "");
    wx.setStorageSync("MIN_BEGIN_MIN_INDEX", "");
    wx.setStorageSync("MIN_BEGIN_MIN_ETime", "");
    wx.setStorageSync("countdownUseED", false)

    ////////////////////
    new app.ToastPannel();
    this.oneYuan_httpData();
    this.top_shopHttp();
    this.getScrollTop();
    this.getcoupon_http();
    this.hongBaoAnimation();
    
    isload = true;
    var that = this;
    setTimeout(function () {
      console.log("2222222222222222222222222222", options.user_id);
      if (options.isShareFlag || options.user_id) {
        that.setData({
          isShareFlag: options.isShareFlag,
          user_id: options.user_id,
        })
      }
      var loginfinish = wx.getStorageSync("loginfinish")
    }, 500);

    WxNotificationCenter.addNotification("testNotificationItem1Name", this.testNotificationFromItem1Fn, this);

  },

  //红包动画
  hongBaoAnimation: function () {
    var circleCount = 0;
    // 心跳的外框动画  
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 500,    // 以毫秒为单位  
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) {
        console.log("***************************");
      }
    });
    animationTimer = setInterval(function () {
      if (circleCount % 2 == 0) {
        this.animationMiddleHeaderItem.scale(1.15).step();
      } else {
        this.animationMiddleHeaderItem.scale(1.0).step();
      }

      this.setData({
        animationMiddleHeaderItem: this.animationMiddleHeaderItem.export()  //输出动画
      });

      circleCount++;
      if (circleCount == 1000) {
        circleCount = 0;
      }
    }.bind(this), 500);
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

  onUnload() {
    this.setData({
      load_timer: false,
    })
    app.showThirtyEd = true;
    // wx.setStorageSync('poplastTime', '');//倒计时间清空
    clearInterval(redhongbaoCutdoenTimer);
    clearTimeout(redhongbaopopTimer);//清除定时器
  },
  //开屏红包
  kaiPingHongBaoShow: function () {
    var that = this;
    //获取是否是会员
    util.get_vip(function (data) {
      var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
      if (isVip == 1)//不是会员
      {
        //非新人非会员 提现余额
        if (!app.globalData.user.firstLogin)//非新人
        {
          if (that.data.nRaffle_Money > 0) {
            var cutdowntime = 24 * 60 * 60 * 1000;
            fightUtil.countdown(that, fightUtil, cutdowntime, function (data) {
              that.setData({
                is_fresh: true,
                time: data
              })
            })

            that.setData({
              upperGoYiFuShow_tixian: true
            })
            return;
          } else if (that.data.nRaffle_Money == 0) {
            that.setData({
              upperGoYiFuShow_task: true
            })
            return;
          }
        }

        showHongBao.getShowHongbao(that, function (is_show) {
          if (is_show) {
            that.setData({
              redHongbaoNewuserShow: true
            })
          }
        });

      } else {
        that.setData({
          hasJYJLdialog: true,
        })
      }
    })
  },
  //任务红包
  signHongBaosubmit: function (e) {
    formId = e.detail.formId;
    if (app.globalData.user != null) {
      util.httpPushFormId(e.detail.formId);
    }
    if (this.data.shouYePage == "ThreePage") {
      wx.navigateTo({
        url: '../sign/sign',
      })
    } else {
      util.get_TrancactionRecord(function (Transaction_record) {
        if (Transaction_record)//有交易记录去赚钱
        {
          wx.navigateTo({
            url: '../sign/sign',
          })
        } else {//没有交易记录首页3
          wx.navigateTo({
            url: 'redHongBao?shouYePage=ThreePage&coupon=' + coupon,
          })
        }
      });
    }
  },

  //30-50元红包点存入我的帐户
  xianjinRedsubmit: function (e) {
    formId = e.detail.formId;
    if (formId && app.globalData.user != null) {
      util.httpPushFormId(formId);
    }
    this.setData({
      upperGoYiFuShow: false,
    })

    if (this.data.redHongbaoNewuserShow) {
      
      if (app.globalData.channel_type == 1)//渠道进入
      {
        this.setData({
          redHongbaoNewuserShow: false
        })
      } else {
        if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
          this.setData({
            redHongbaoNewuserShow: false
          })
        }
      }
      showHongBao.clickHongbao(this, function (is_show) { })
    } else if (this.data.upperGoYiFuShow_task) {
      this.setData({
        upperGoYiFuShow_task: false,
      })
      showHongBao.clickHongbao(this, function (is_show) { })
    } else if (this.data.upperGoYiFuShow_tixian) {
      this.setData({
        upperGoYiFuShow_tixian: false
      })
      wx.navigateTo({
        url: '/pages/mine/withdrawLimitTwo/withdrawLimitTwo'
      })
    }
    else{
      wx.navigateTo({
        url: 'redHongBao?shouYePage=ThreePage&coupon=' + coupon,
      })
    }
    
    //统计用户点领的次数
    app.mtj.trackEvent('get_red_envelope', {
      user_id: app.globalData.user_id ? app.globalData.user_id : '',
    });
    // clearInterval(animationTimer);
  },

  //50元任务红包点领
  hasJYJLsubmit: function (e) {
    formId = e.detail.formId;
    if (formId && app.globalData.user != null) {
      util.httpPushFormId(formId);
    }
  },
  hasJYJLtoSign: function () {
    wx.navigateTo({
      url: '../sign/sign',
    })
    this.setData({
      hasJYJLdialog: false
    })
    clearInterval(animationTimer);
  },

  //红包相关
  closeNewThirty: function () {
    
    var that = this;
    if (that.data.redHongbaoNewuserShow) {
      that.setData({
        redHongbaoNewuserShow: false
      })
      showHongBao.loopShowHongbao(that, showHongBao, function (is_show) {
        if (is_show) {
          that.setData({
            redHongbaoNewuserShow: true
          })
        }
      })

    }
    that.setData({
      upperGoYiFuShow: false,
      hasJYJLdialog: false,
      redHongbaoNewuserShow: false,
      upperGoYiFuShow_task: false,
      upperGoYiFuShow_tixian: false,
      NewUserShareBackRedPackage: false
    })
    // clearInterval(animationTimer);
  },

  //关闭会员弹框
  hasJYJLtoSign: function () {
    wx.navigateTo({
      url: '../sign/sign',
    })
    this.setData({
      hasJYJLdialog: false
    })
  },

  //每秒减一次
  startReportHeart: function () {
    var that = this;
    var poplastTime = that.data.poplastTime;
    redhongbaoCutdoenTimer = setTimeout(function () {
      poplastTime--;
      that.data.poplastTime = poplastTime;
      wx.setStorageSync('poplastTime', that.data.poplastTime);
      that.startReportHeart()
    }, 1000)
  },

  loginsubmit: function (e) {
    formId = e.detail.formId;
    if (app.globalData.user != null) {
      util.httpPushFormId(e.detail.formId);
    }

    this.setData({
      upperGoYiFuShow: false,
    })
  },
  //授权弹窗
  onclick: function (e) {
    var that = this;
    that.setData({
      upperGoYiFuShow: false,
    })

    wx.getUserInfo({
      //允许授权 获取用户信息
      success: function (res) {
        app.New_userlogin(function () {
          that.http_Landingpage2();
          if (formId) {
            util.httpPushFormId(formId);
          }
        });
      },
      fail: function () {

      }
    })
  },

  hongbaoclick: function (e) {
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
            that.http_Landingpage2();
            util.httpPushFormId(formId);
            wx.hideLoading();

            if (that.data.redHongbaoNewuserShow) {
              that.redHongClick();
              that.setData({
                redHongbaoNewuserShow: false
              })
            }
          });
        }
      },
      fail: function () {

      }
    })
  },
  //红包点领
  redHongClick: function () {
    //去提现
    // wx.navigateTo({
    //   url: '/pages/mine/wallet/wallet?comefrome=tixianstyle',
    // })
    if (app.homePagetoSign == true) {
      wx.navigateTo({
        url: '/pages/sign/sign',
      })
    }
  },
  /**
   * 获得滑动导致悬浮开始的高度
   * @return {[type]} [description]
   */
  getScrollTop: function () {
    var that = this;
    if (wx.canIUse('getSystemInfo.success.screenWidth')) {
      wx: wx.getSystemInfo({
        success: function (res) {
          rate = res.screenWidth / 750;
          floatTop = 400 * rate;
          that.setData({
            scrollTop: 400 * res.screenWidth / 750,
            scrollHeight: res.screenHeight / (res.screenWidth / 750) - 128,
          });
        }
      });
    }
  },

  /**
    * 生命周期函数--监听页面加载
    */
  onPageScroll: function (event) {
    var scrollTop = event.scrollTop;
    if (scrollTop >= floatTop && !this.data.isShowFloatTab) {
      this.setData({
        isShowFloatTab: true,
      });
    } else if (scrollTop < floatTop && this.data.isShowFloatTab) {
      this.setData({
        isShowFloatTab: false,
      });
    }
  },

  /**
    * 点击tab切换
    * @param  {[type]} event 
    * @return {[type]}       
    */
  clickTab: function (event) {
    var id = event.detail.id;
    this.data.curTabId = id;
    scrollTop = true;

    for (var i = 0; i < this.data.tabs.length; i++) {
      if (id == this.data.tabs[i].id) {
        this.data.tabs[i].isSelect = true;
      } else {
        this.data.tabs[i].isSelect = false;
      }
    }

    this.setData({
      tabs: this.data.tabs,
      curTabId: this.data.curTabId,
      currentpage: 1,
    });

    //更新数据，第一次点击或者为空的时候加载重新加载数据
    this.http_shoplist();
  },

  onHide: function (options) {
    WxNotificationCenter.removeNotification("testNotificationItem1Name", this);
    wx.setStorageSync("loginfinish", "false")

    clearInterval(xuanfuanimationTimer);
    clearInterval(redhongbaoCutdoenTimer);
    clearTimeout(redhongbaopopTimer);//清除定时器
    showHongBao.stoppopTimer(this, function () { })

    this.xuanfuanimationMiddleHeaderItem.rotate(0).step();
    this.setData({
      xuanfuanimationMiddleHeaderItem: this.xuanfuanimationMiddleHeaderItem.export(),  //输出动画
      suspensionHongBao_isShow:false
    });

    isload = false;
    app.showThirtyEd = true;
  },

  testNotificationFromItem1Fn: function (info) {
    console.log("!!!!!!!!!!!!isShareFlag=", this.data.isShareFlag);
    //如果是分享进入的 自动跳转到赚钱页
    if (this.data.isShareFlag == true) {
      console.log("4444444444444444444444");
      // wx.navigateTo({
      //   url: '../sign/sign?isShareFlag=' + this.data.isShareFlag + "&user_id=" + this.data.user_id,
      // })
    } else {
      console.log("555555555555555555555555");
      //跳转到赚钱页面
      this.http_Landingpage();
      // this.http_shoplist();
    }
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
    console.log('**************data=', data);
    if (data.status == 1) {
      var shouyecount = data.data;
      console.log('**************shouyecount=', shouyecount);
      if (shouyecount == 0) {
        console.log('**************shouyecount11111=', shouyecount);
        this.setData({
          isShowMakeMoney: false,
        });
      } else {
        console.log('**************shouyecount22222=', shouyecount);
        var that = this;
        setTimeout(function () {
          that.setData({
            isShowMakeMoney: true,
          });
          console.log('**************isShowMakeMoney=', that.data.isShowMakeMoney);
          isautoSign = true;

        }, 500);
      }

      app.globalData.user["shouyecount"] = shouyecount;

      if (shouyecount == 1) {
        // var pages = getCurrentPages();
        // var prevPage = pages[pages.length - 1];
        // if (prevPage.route == "pages/shouye/shouye") {
        // wx.navigateTo({
        //   url: '../sign/sign',
        // })
        // wx.hideLoading();
        // }
      }
    }
    //  else
    // wx.hideLoading();

  },

  //获取优惠券
  getcoupon_http: function () {
    var that = this;
    var oldurl = config.Host + '/coupon/getRollCoupon?' + config.Version;
    util.http(oldurl, that.coupon_data);
  },
  coupon_data: function (data) {
    var coupon = "6";
    var cond = "10";
    if (data.status == 1) {
      coupon = data.price > 0 ? (data.price * 1).toFixed(0) : coupon;
      cond = data.cond > 0 ? (data.cond * 1).toFixed(0) : cond;
    }
    this.setData({
      coupon: coupon,
      cond: cond
    })
  },
  //轮播数据
  top_shopHttp: function () {
    var that = this;
    var oldurl = config.Host + 'shop/queryOption?' + config.Version;
    util.http(oldurl, that.top_shop_data);
  },
  top_shop_data: function (data) {
    if (data.status == 1) {
      var listshop = data.topShops;
      this.setData({
        swiperlist: listshop,
      })
    }
  },
  //轮播图点击事件
  swipertap: function (event) {
    console.log(event);
    if (this.data.shouYePage == "") {
      wx.navigateTo({
        url: '../mine/wallet/Withdrawals/Withdrawals?isRed=' + 'true' + '&coupon=' + this.data.coupon + '&cond=' + (20 - this.data.coupon),
      })
    } else {
      var item = event.currentTarget.dataset.item;
      var option_type = item.option_type;
      var shop_code = item.shop_code;

      switch (option_type) {
        case 1://商品详情
          wx.navigateTo({
            url: '../shouye/detail/detail?' + "shop_code=" + shop_code,
          })
          break;
        case 2://邀请码
          break;
        case 3://消息盒子
          break;
        case 4://签到页
          break;
        case 5://H5活动页
          break;
        case 6://新品专区
          wx.navigateTo({
            url: '../shouye/newProductarea/newProductarea',
          })
          break;
        case 7://制造商
          this.brandsDetail(item);
          break;
      }
    }
  },

  //制造商详情
  brandsDetail: function (item) {
    //获取制造商数据
    var basesData = wx.getStorageSync("shop_tag_basedata");

    var brandlist = basesData.data.supp_label;
    var branddetail = "";
    for (var i = 0; i < brandlist.length; i++) {
      var brand = brandlist[i];
      if (brand.id == item.shop_code) {
        branddetail = brand;
      }
    }
    if (branddetail != "") {
      var id = branddetail.id;
      var name = branddetail.name;
      var pic = branddetail.pic;
      var remark = branddetail.remark;
      wx.navigateTo({
        url: '../listHome/brandsDetail/brandsDetail?' +
          "class_id=" + id +
          "&navigateTitle=" + name +
          "&brandPic=" + pic +
          "&remark=" + remark
      })
    }
  },

  //获取是否是一元购
  oneYuan_httpData: function () {
    var that = this;
    var url = config.Host + 'cfg/on_off_3_7?' + config.Version;
    util.http(url, that.oneYuanData);
  },
  oneYuanData: function (data) {
    var that = this;
    if (data.status == 1) {
      //获取首页2、首页3开关
      util.get_shouyeSwitch(advent_channel,function (swhitchdata) {
        // cashOnDelivery = 1 是货到付款 0不是
        var cashOnDelivery = swhitchdata.cashOnDelivery != undefined ? swhitchdata.cashOnDelivery : '1';
        // homePage2to3 = 0是首页2 1是首页3或者首页5
        var shouyeSwitch = swhitchdata.homePage2to3 != undefined ? swhitchdata.homePage2to3 : '1';
        var Page = shouyeSwitch == '0' ? "TwoPage" : "FivePage";
        // 0不跳转，1跳转首页1
        var homePage3toPage = swhitchdata.homePage3toPage != undefined ? swhitchdata.homePage3toPage : '0';
        that.setData({
          shouYePage: Page,
          cashOnDelivery: cashOnDelivery,
          nRaffle_Money: data.nRaffle_Money,
          shouyeSwitch: shouyeSwitch,
          homePage3toPage: homePage3toPage
        })

        if (that.data.shouYePage == "FivePage")//首页5
        {
          oneYuanData = 0;
          app.globalData.typePageHide = 0;

          wx.setNavigationBarTitle({
            title: '新人钜惠',
          })

          that.setData({
            typePageHide: app.globalData.typePageHide,
            tabs: [
              { id: "news", isSelect: true, title: "新人钜惠" }
            ],
          })
        } 
        else if (that.data.shouYePage == "ThreePage")//首页3
        {
          oneYuanData = 0;
          app.globalData.typePageHide = 0;

          wx.setNavigationBarTitle({
            title: '新人钜惠',
          })

          that.setData({
            typePageHide: app.globalData.typePageHide,
            tabs: [
              { id: "news", isSelect: true, title: "新人免费福利" }
            ],
          })
        } else {//首页2
          oneYuanData = data.data.wxcx_status != undefined ? data.data.wxcx_status : 0;
          app.globalData.typePageHide = data.data.typePageHide != undefined ? data.data.typePageHide : 0;

          var typePagebottomHeigh = app.globalData.typePageHide == 1 ? 0 : 45;
          wx.setNavigationBarTitle({
            title: '品牌女装特卖',
          })
          clearTimeout(thirtyTimer);
          // 设置tab的数量
          if (oneYuanData != 0) {

            if (!that.data.tabs.length) {
              that.setData({
                tabs: [
                  { id: "news", isSelect: true, title: "时尚" }
                ],
              })
            }

            that.setData({
              curTabId: that.data.curTabId ? that.data.curTabId : "news",
              NotshowFightCount: true,
              typePageHide: app.globalData.typePageHide,
              typePagebottomHeigh: typePagebottomHeigh,
            })
          } else {
            if (!that.data.tabs.length)
            {
              that.setData({
                tabs: [
                  { id: "news", isSelect: true, title: "时尚" },
                  { id: "hall", isSelect: false, title: "生活" }
                ],
              })
            }
            that.setData({
              curTabId: that.data.curTabId ? that.data.curTabId : "news",
              NotshowFightCount: false,
              typePageHide: app.globalData.typePageHide,
              typePagebottomHeigh: typePagebottomHeigh,
            })
          }
        }
        that.http_shoplist();

        //只在首页3设置homePage3toPage == 1时才跳转首页
        if (homePage3toPage == 1 && shouyeSwitch != '0'){
          that.setData({
            is_showPage: false
          })
          wx.switchTab({
            url: '/pages/shouye/shouye',
          })
          return;
        }else{
          that.setData({
            is_showPage: true
          })
        }

        //如果不是首页2弹此框
        // if (shouyeSwitch != 0){
        //   showHongBao.getShowHongbao(that, function (is_show) {
        //     if (is_show) {
        //       that.setData({
        //         redHongbaoNewuserShow: true
        //       })
        //     }
        //   });
        // }
      });
    }
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
      this.setData({
        openFightSuccessShow: true
      })
    } else {//如果没有再查看是否有退款
      util.get_discountHttp(that.discountData);
    }
  },

  //热卖列表数据
  http_shoplist: function () {
    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }

    var typename = '热卖';
    var type1 = '1';
    var page = that.data.currentpage;
    var url = "";

    if (that.data.curTabId == 'news')//时尚
    {
      if (oneYuanData == 0)//1元购
      {
        //热卖商品
        var tongji_url = "default";
        var tongji_parameter = "default"

        var mUrl = config.Host + 'shop/queryConUnLogin?' + 'pager.pageSize=30' + '&pager.curPage=' + page + '&code=1' + '&type_name=' + typename + '&type1=' + type1;
        if (this.data.shouYePage == "ThreePage" || this.data.shouYePage == "FivePage") {
          //正价广告商品
          mUrl = config.Host + 'homePage3shop/dataShopList?' + 'pager.pageSize=30' + '&pager.curPage=' + page;
        }

        if (mUrl) {
          var tepm = mUrl.split("?");
          tongji_url = mUrl.split("?")[0]
          tongji_url = tongji_url.replace(config.Host, "");
          tongji_url = tongji_url.replace(config.PayHost, "")
          tongji_url = tongji_url.replace("//", "/")

          tongji_parameter = mUrl.substring(mUrl.indexOf("?") + 1, mUrl.length - 1)

          if (!tongji_url) {
            tongji_url = "default"
          }
          if (!tongji_parameter) {
            tongji_parameter = "default"
          }
        }
        mUrl = util.Md5_httpUrl(mUrl);
        wx.request({
          url: mUrl + config.Version,
          data: {
           
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@' + res.data.listShop);

            app.mtj.trackEvent('i_f_success_count', {
              i_f_name: tongji_url,
            });

            var data = res.data;
            that.newshoplistData(data);
          },
          fail: function (error) {
            app.mtj.trackEvent('i_f_error_count', {
              i_f_name: tongji_url,
              // i_f_from: "10",
            });
          }
        })
      } else {
        //活动商品
        url = config.Host + 'shop/queryShopActivity?' + "最新" + config.Version + '&token=' + token + '&pageSize=30' + '&curPage=' + page;
        util.http(url, that.shoplistData);
      }

    } else {//生活

      var url = config.Host + 'shop/queryPackageList?pager.order=desc' + config.Version + '&pager.pageSize=30' + '&pager.curPage=' + page + '&p_type=0';
      util.http(url, that.shoplistData);
    }


  },

  //热卖商品数据处理
  newshoplistData: function (data) {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@' + data.listShop);
    wx.stopPullDownRefresh();
    if (this.data.currentpage == 1) {
      this.data.shoplist = [];
    }
    if (data.status == 1) {

      var page = this.data.currentpage + 1;
      this.data.currentpage = page;

      if (this.data.curTabId == 'news')//时尚
      {
        if (oneYuanData == 0)//1元购
        {
          this.remaishoplist(data.listShop);
        } else {
          this.remaishoplist(data.list);
        }
      }

      // if (this.data.shouyeSwitch != 0 && this.data.homePage3toPage !=1) {
      //   this.kaiPingHongBaoShow();
      // }
    } else {
      // this.showToast(data.message, 2000);
    }

    //查看用户是否授权 未授权弹新人30元弹窗
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {

          is_newShouquan = false;
          this.getNewUserOrder(false)

        } else {

          if (!app.showThirtyEd) {
            if (this.data.typePageHide == 0) {
              this.setData({
                // upperGoYiFuShow: true,
                // suspensionHongBao_isShow: true
              })
              // app.showThirtyEd = true
            }
          }
        }
      }
    })
  },

  //活动商品 特价商品处理数据
  shoplistData: function (data) {
    wx.stopPullDownRefresh();
    if (this.data.currentpage == 1) {
      this.data.shoplist = [];
    }
    if (data.status == 1) {

      var page = this.data.currentpage + 1;
      this.data.currentpage = page;

      if (this.data.curTabId == 'news')//时尚
      {
        if (oneYuanData == 0)//1元购
        {
          console.log('正常商品' + data.listShop);
          this.remaishoplist(data.listShop);
        } else {
          console.log('活动商品' + data.list);
          this.remaishoplist(data.list);
        }
      } else {

        var shoplist = [];
        for (var i = 0; i < data.pList.length; i++) {
          // this.remaishoplist(data.pList[i].shop_list, data.pList[i].code, data.pList[i].wxcx_shop_group_price, data.pList[i].def_pic, data.pList[i].shop_se_price);

          var wxcx_shop_group_price = data.pList[i].wxcx_shop_group_price;

          var virtual_sales = data.pList[i].virtual_sales;
          data.pList[i].shop_list[0].virtual_sales = virtual_sales;
          data.pList[i].shop_list[0].def_pic = data.pList[i].def_pic;
          data.pList[i].shop_list[0].shop_se_price = data.pList[i].shop_se_price;
          data.pList[i].shop_list[0].wxcx_shop_group_price = wxcx_shop_group_price;
          shoplist.push(data.pList[i].shop_list[0]);
          console.log(shoplist);
        }
        this.remaishoplist(shoplist, wxcx_shop_group_price);
      }
    } else {
    }
  },

  remaishoplist: function (obj, wxcx_shop_group_price) {

    for (var i = 0; i < obj.length; i++) {
      var new_clde = obj[i].shop_code.substr(1, 3);
      var new_pic = "";
      var shop_code = obj[i].shop_code;
      var newshopname = obj[i].shop_name;
      var shop_se_price = (obj[i].shop_se_price * 1).toFixed(1);

      if (this.data.curTabId == 'news')//时尚
      {
        new_pic = new_clde + '/' + obj[i].shop_code + '/' + obj[i].def_pic;
        shop_code = obj[i].shop_code;


        if (app.showSub) {
          if (newshopname.length > 12) {
            newshopname = '... ' + newshopname.substr(newshopname.length - 12, 12);
          }

        } else {
          if (newshopname.length > 24) {
            newshopname = '... ' + newshopname.substr(newshopname.length - 24, 24);
          }
        }

      } else {//生活
        new_pic = obj[i].def_pic;

        if (newshopname.length > 24) {
          newshopname = '... ' + newshopname.substr(newshopname.length - 24, 24);
        }
      }

      obj[i].def_pic = new_pic;
      obj[i].shop_code = shop_code;
      obj[i].shop_name = newshopname;

      if (this.data.currentTab == 0) {
        var discount = (obj[i].shop_se_price / obj[i].shop_price * 9).toFixed(1)
        obj[i]["discount"] = discount;
      }

      if (oneYuanData == 0)//是1元购
      {
        var se_price = (obj[i].wxcx_shop_group_price * 1).toFixed(1);

        if (this.data.curTabId != 'news') //生活
        {
          se_price = shop_se_price > 0 ? shop_se_price : 0.0;
        } 

        obj[i].shop_se_price = se_price;
        obj[i].shop_price = shop_se_price;
        obj[i]["SupperLab"] = 0;
      } else {
        obj[i].shop_se_price = shop_se_price;
        obj[i]["SupperLab"] = 1;
      }
    }
    var all_shoplists = this.data.shoplist;
    for (var j = 0; j < obj.length; j++) {
      all_shoplists.push(obj[j]);
    }
    //如果不是赚钱页 赚钱入口隐藏
    if (oneYuanData == 1 || this.data.curTabId == 'hall') {
      this.setData({
        Coloropacity: "0",
      })
    } else {
      this.setData({
        Coloropacity: "1",
      })
    }
    this.setData({
      shoplist: all_shoplists,
      showSub: app.showSub

    })

    //切换列表时 列表滑动到顶部
    if (scrollTop == true) {
      if (this.data.isShowFloatTab == true) {
        wx.pageScrollTo({
          scrollTop: this.data.scrollTop
        })
        scrollTop = false;
      }
    }
  },

  //列表数据
  list_shopHttp: function () {
    var that = this;
    var url = config.Host + "collocationShop/queryShopCondition?type=2" + config.Version + '&pager.curPage=' + that.data.currentpage + "&pager.pageSize=10";
    util.http(url, that.collocationShopData);
  },

  collocationShopData: function (data) {
    wx.stopPullDownRefresh();
    if (this.data.currentpage == 1) {
      console.log(data);
      this.setData({
        postlist: [],
        pageData: [],
      })
    }
    if (data.status == 1) {
      var page = this.data.currentpage + 1;
      this.setData({
        currentpage: page,
        tabs: this.data.tabs,
        curTabId: this.data.curTabId,
      })
      var listshop = data.listShop;
      this.newshoplist(listshop);
    } else {
      this.showToast(data.message, 2000);
    }
  },

  //列表加载更多
  onReachBottom: function () {
    this.http_shoplist();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      currentpage: 1
    })
    this.http_shoplist();
  },
  imageTap: function (event) {
    var code = event.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../shouye/specialDetail/specialDetail?' + "class_code=" + code
    })
  },
  shopTap: function (event) {
    var shopcode = event.currentTarget.dataset.shop_code;
    wx.navigateTo({
      url: '../shouye/detail/detail?' + "shop_code=" + shopcode + '&homePage3ElasticFrame=' + this.data.homePage3ElasticFrame,
    })
  },
  //商品分类
  typeTap: function () {
    console.log('商品分类');
    wx.navigateTo({
      url: '../shouye/shopClassType/shopClassType',
      // url:'../shouye/indianaRecord/indianaRecord',
    })
  },

  //搜索
  searchClickEvent: function () {
    console.log('商品搜索');
    wx.navigateTo({
      url: '../shopType/shopSearch/shopSearch',
    })
  },
  //赚钱页
  moneytap: function () {
    wx.navigateTo({
      url: '../sign/sign',
    })
  },
  wxSerchFocus: function () {
    wx.navigateTo({
      url: '../shopType/shopSearch/shopSearch',
    })
  },
  searchInputEvent: function () {

  },
  //重新处理数据
  newshoplist: function (obj) {
    var that = this;
    for (var k = 0; k < obj.length; k++) {
      var shops = obj[k];
      if (shops.shop_type_list.length) {
        var shop_type_lists = shops.shop_type_list[0].list;
        for (var i = 0; i < shop_type_lists.length; i++) {
          var newshopname = shop_type_lists[i].shop_name;
          if (newshopname.length > 6) {
            newshopname = '... ' + newshopname.substr(newshopname.length - 6, 6);
          }

          var code = shop_type_lists[i].shop_code.substr(1, 3);
          var new_pic = code + '/' + shop_type_lists[i].shop_code + '/' + shop_type_lists[i].def_pic;

          var shop_se_price = (shop_type_lists[i].shop_se_price).toFixed(1);
          obj[k].shop_type_list[0].list[i].shop_name = newshopname;
          obj[k].shop_type_list[0].list[i]["new_def_pic"] = new_pic;
          obj[k].shop_type_list[0].list[i]["new_shop_se_price"] = shop_se_price;
        }
      }
    }
    var pageData = this.data.pageData;
    for (var j = 0; j < obj.length; j++) {
      pageData.push(obj[j]);
    }
    this.setData({
      postlist: pageData,
      pageData: pageData,
    })
  },
  //请求落地页 获取微信小程序落地页开关
  http_Landingpage2: function () {
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
      var url = config.Host + 'cfg/getCurrWxcxType?token=' + token + config.Version;
      util.http(url, this.Landingpage2);
    }
  },

  Landingpage2: function (data) {
    if (data.status == 1) {
      var shouyecount = data.data;

      if (shouyecount == 0) {
        this.setData({ isShowMakeMoney: false });
      } else
        this.setData({ isShowMakeMoney: true });
      app.globalData.user["shouyecount"] = shouyecount;
      isautoSign = false;
    }
  },
  onShow: function () { //在onShow中处理新衣节弹窗
    var that = this;
    try {
      isCrazyMon = wx.getStorageSync("HASMOD")
    } catch (e) {
    }
    that.http_Landingpage2();

    that.setData({
      suspensionHongBao_isShow:false
    })
    that.xuanfuHongBaoAnimation();
    util.httpUpyunJson(this.shareData)

    // isCrazyMon =  true;
    //新衣节弹窗自动弹出，每天只弹一次
    var time = wx.getStorageSync("XINYIJIEZIDONGTANCHU");
    if (util.isToday(time) != "当天" && isCrazyMon) {
      that.setData({
        showNewYI: true
      })
      wx.setStorageSync("XINYIJIEZIDONGTANCHU", new Date().getTime())
    } else {//红包弹框
      var showtime = wx.getStorageSync("redshow");
      var token = "";
      if (app.globalData.user != null) {
        token = app.globalData.user.userToken;
      }
      if (util.isToday(showtime) != "当天" && isautoSign == false && token != null && token != "") {
        wx.setStorageSync("redshow", new Date().getTime());
        that.setData({
          isRedShow: true
        })
      }
    }

    //查看用户是否授权 未授权弹授权提示弹窗
    wx.getSetting({
      success: res => {
        // console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

          app.New_userlogin(function () {
            that.http_Landingpage2();
            that.xuanfu_image();
            if (!that.data.showNewYI && !that.data.isRedShow) {
              if (app.globalData.user != null) {
                that.getOrderStatus();
              }
            }
          });
        } else {
          that.xuanfu_image();
        }
      }
    })

    
    if (!firstCommint && that.data.shouYePage != 'TwoPage' && that.data.homePage3ElasticFrame > 0)
    {
      if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
        return;
      }
      showHongBao.getShowHongbao(that, function (is_show) {
        if (is_show) {
          that.setData({
            redHongbaoNewuserShow: true
          })
        }
      });
    }
    firstCommint = false;
  },

  xuanfu_image: function () {
    var that = this;
    //悬浮小图标
    util.get_TrancactionRecord(function (Transaction_record) {
      if (that.data.shouYePage == "ThreePage")//首页3
      {
        that.setData({
          SmallRedHongBao: config.Upyun + 'small-iconImages/heboImg/small-signRedHongBao.png',
        })
      }else{
        that.setData({
          SmallRedHongBao: config.Upyun + 'small-iconImages/heboImg/small-signRedHongBao.png',
        })
      }
    });
  },
  //商品详情
  first_list_tap: function (event) {
    var shopcode = event.currentTarget.dataset.shop_code;
    var url = '';
    if (this.data.curTabId == 'news')//时尚
    {
      url = '../shouye/detail/detail?' + "shop_code=" + shopcode
      if (oneYuanData != 0)//活动商品
      {
        url = '../shouye/detail/detail?' + "shop_code=" + shopcode + "&isActiveShop=" + isActiveShop + '&cashOnDelivery=' + this.data.cashOnDelivery
      }
    } else {
      url = '../shouye/detail/detail?' + "shop_code=" + shopcode + "&shop_type=2"
    }
    var advent2_comefrom = this.data.shouYePage == "FivePage" ? true : false;
    url = url + '&shouYePage=' + this.data.shouYePage + '&homePage3ElasticFrame=' + this.data.homePage3ElasticFrame + '&advent2_comefrom=' + advent2_comefrom;
    wx.navigateTo({
      url: url,
    })
  },
  //新衣节关闭按钮
  newYiCloseTap: function () {
    this.setData({
      showNewYI: false
    })
  },
  //新衣节弹窗-获取抽奖机会点击
  newYIgoTap: function () {
    wx.navigateTo({
      url: '../sign/newYiListPage/newYiListPage',
    })
  },
  //新衣节弹窗活动详情点击
  newYIxiangqingTap: function () {

    this.setData({
      showNewYI: false
    })
    wx.navigateTo({
      url: '../sign/newYiHDXQ/newYiHDXQ',
    })
  },

  //红包弹窗点击
  redtap: function () {
    this.setData({
      isRedShow: false
    })
    wx.navigateTo({
      url: '../sign/sign',
    })
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

    util.get_discountHttp(this.discountData);
  },

  //拼团失败退款弹窗
  discountData: function (data) {
    console.log(data);
    if (data.status == 1 && data.isFail == 1) {
      this.setData({
        moneyDiscountShowFlag: true,
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

  //红包倒计时
  countdown: function () {
    var that = this;
    that.dateformat(total_micro_second);
    if (total_micro_second <= 0 || this.data.load_timer == false) {
      //时间截至
      that.setData({
        clock_hr: "00",
        clock_min: "00",
        clock_ss: "00",
      });
      clearTimeout(thirtyTimer);

      return;
    }

    setTimeout(function () {
      total_micro_second -= 1000;
      that.countdown();
    }
      , 1000)
  },

  dateformat: function (micro_second) {

    var that = this;
    // 总秒数
    var second = Math.floor(micro_second / 1000);

    // 天数
    var day = "" + Math.floor(second / 3600 / 24);
    // 小时
    var hr = "" + Math.floor(second / 3600 % 24);
    // 分钟
    var min = "" + Math.floor(second / 60 % 60);
    // 秒
    var sec = "" + Math.floor(second % 60);

    if (hr.length < 2) {
      hr = '0' + hr;
    }

    if (min.length < 2) {
      min = '0' + min;
    }

    if (sec.length < 2) {
      sec = '0' + sec;
    }
    that.setData({
      clock_hr: hr,
      clock_min: min,
      clock_ss: sec,
    });
  },

  //分享弹窗
  sharesubmit: function (e) {
    this.setData({
      getHongBaoSuccessShow: false
    })
    formId = e.detail.formId;
    util.httpPushFormId(formId);
  },
  //关闭分享弹窗
  closeShare: function () {
    this.setData({
      getHongBaoSuccessShow: false
    })
  },

  /**
   * 分享数据
   */
  shareData: function (data) {
    var shareTitle = data.wxcx_share_links.title ? data.wxcx_share_links.title : "我刚领的红包也分你一个，帮我提现就能拿钱哦~";
    var share_pic = config.Upyun + (data.wxcx_share_links.icon ? (data.wxcx_share_links.icon + '?' + Math.random()) : "/small-iconImages/heboImg/shareBigImage_new.jpg");

    //设置分享的文案
    this.setData({
      shareTitle: shareTitle,
      shareImageUrl: share_pic
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {


    var that = this;
    that.setData({
      upperGoYiFuShow: false,
      newUserredPacageShow: false

    })

    var path = '';
    if (app.globalData.user != null && app.globalData.user.user_id != undefined) {
      path = '/pages/shouye/shouye?' + "isShareFlag=true" + "&user_id=" + app.globalData.user.user_id;
    } else {
      path = '/pages/shouye/shouye?' + "isShareFlag=true";
    }

    if (app.globalData.user) { //授权过
      var user_id = app.globalData.user.user_id;
      var token = app.globalData.user.userToken;
      var headpic = config.Upyun + "small-iconImages/ad_pic/gerenzhongxin_morentouxiang_bg.png"
      if (app.globalData.user != null) {
        headpic = app.globalData.user.pic
      }

      return {
        title: this.data.shareTitle,
        path: path,
        imageUrl: this.data.shareImageUrl,
        success: function (res) {
          
        },
        fail: function (res) {
          
        }
      }
    } else {

      var headpic = config.Upyun + "small-iconImages/ad_pic/gerenzhongxin_morentouxiang_bg.png"

      return {
        title: this.data.shareTitle,
        path: path,
        imageUrl: this.data.shareImageUrl,
        success: function (res) {
          
        },
        fail: function (res) {
        
        }
      }
    }

  },

  //滑动开始事件
  handletouchtart: function (event) {
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY
  },

  //滑动移动事件
  handletouchmove: function (event) {

    console.log("*****************", event.touches[0]);
    var currentX = event.touches[0].pageX
    var currentY = event.touches[0].pageY
    var clientY = event.touches[0].clientY
    var tx = currentX - this.data.lastX
    var ty = currentY - this.data.lastY

    //将当前坐标进行保存以进行下一次计算
    var aaa = currentY / 500
    var text = ""
    if (ty < -14) {
      text = "向上滑动"
    } else {
      text = "向下滑动"
      if (currentY - clientY < 100) {
        aaa = 0;
      }
    }
    this.setData({
      aph: aaa
    });
  },

  //模拟tab
  tabtap: function (e) {
    console.log('ok');
    var index = e.currentTarget.dataset.index;
    var path = this.data.pathlist[index];
    wx.switchTab({
      url: path,
    })
  },
  getNewUserOrder: function (newShouquan) {
    if (getNewUserOrder_END || app.showThirtyEd) {
      return;
    }

    //newShouquan新授权
    var that = this;

    if (app.globalData.user != null) {
      var token = app.globalData.user.userToken;
      var dataUrl = config.Host + "order/getNewUserOrder" +
        "?token=" + token +
        "&" + config.Version;


      util.http(dataUrl, function (data) {
        getNewUserOrder_END = true

        coupon = data.coupon;

        if (data.count != 0) { //有交易记录---是否是授权过来的做区分
          is_Transaction = true;
          if (newShouquan) { //新授权
            that.setData({
              makeMoneyHongBaoSuccessShow: true
            })
          } else { //之前授权过

            if (!app.WUSHIredPackageShow) {
              if (that.data.typePageHide == 0) {
                that.setData({
                  // hasJYJLdialog: true,
                  // suspensionHongBao_isShow: true
                })
                app.WUSHIredPackageShow = true
              }
            }

          }
        } else { //没有交易记录 ----分享完，分享完成后领取8元优惠券-然后去首页4      
          is_Transaction = false;
          if (newShouquan) {
            that.setData({
              coupon: coupon,
              getHongBaoSuccessShow: true
            })
          } else {

            if (!app.showThirtyEd) {
              if (that.data.typePageHide == 0) {
                that.setData({
                  // upperGoYiFuShow: true,
                  // suspensionHongBao_isShow: true
                })
                // app.showThirtyEd = true
              }

            }

          }
        }
      })
    }
  },

  footerTap: app.footerTap
})
