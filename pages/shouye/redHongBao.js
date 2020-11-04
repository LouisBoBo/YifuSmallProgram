//获取本地化数据
import config from '../../config';
var util = require('../../utils/util.js');
var MD5 = require('../../utils/md5.js');
var base64 = require('../../utils/base64.js');
var fightUtil = require('../../utils/freeFightCutdown.js');
var showHongBao = require('../../utils/showNewuserHongbao.js');
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");
var app = getApp();
var isload;             //是否新加载界面
var isCrazyMon = false; //是否是疯狂星期一
var isautoSign = false; //是否自动跳转到赚钱页
var scrollTop = false;  //是否滑动到顶部
var isActiveShop = true;//是否活动商品
var loginCount;
var rate = 0; //分辨转换
var floatTop = 0; //悬浮高度
var formId;   //授权formId
var total_micro_second;//红包剩余时间
var animationTimer;
var xuanfuanimationTimer;
var scene ;
var redhongbaopopTimer;
var redhongbaoCutdoenTimer;
var firstComming;
var urlcomefrom;
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
    reduceMoney:0,

    uppertittle: "温馨提示",
    isUpperNotitle: true,
    loginupperdistribution: "需要您的授权才能正常使用哦！",
    loginupperbuttontitle: "授权登录",
    upperGoYiFuShow: false,
    openYifuDialogShow: false,
    openFightSuccessShow: false,
    getHongBaoSuccessShow:false,
    isQRcodeYiFuShow:false,
    redHongbaoQRcodeYiFuShow:false,
    redHongbaoNewuserShow:false,
    typePageHide: app.globalData.typePageHide,
    contactkefuShow:false,
    moneyDiscountShowFlag: false,
    moneyDiscount: "0.0",//累计已抵扣的余额
    oneYuanDiscriptionTitle: "免费领未成功通知",
    coupon:"6",//优惠券
    roll_code:'',//参团团号
    isFirst: "",
    isNew: "",

    redHongBaoImg: config.Upyun + 'small-iconImages/heboImg/free_199yuancoupon.png!450',
    SmallRedHongBao: config.Upyun + 'small-iconImages/heboImg/small-signRedHongBao.png',

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
    shouYePage:"",    //ThreePage 首页3 ；FourPage 首页4 FivePage 首页5
    scrollTop: 0,
    is_shouTime:false,
    load_timer: true,//定时器
    clock_hr: '00',//时
    clock_min: '00',//分
    clock_ss: '00',//秒
    clickLogin: true,//点击红包授权

    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},
    length: 0,
    secondimgData: ['complaint_1.png', 'complaint_2.png', 'complaint_3.png'],
    secondtextData: ['发送给朋友', '添加到我的小程序', '添加到桌面'],
    thirdimgData: ['complaint_4.png', 'complaint_5.png', 'complaint_6.png', 'complaint_7.png'],
    thirdtextData: ['浮窗', '设置', '反馈与投诉', '重新进入小程序'],
    pagestyle: 2,
  },

  onLoad: function (options) {
    loginCount = 0;
    firstComming = true;
    var that = this;
    if (!app.parent_id) {
      app.parent_id = options.user_id;
    }

    if(options){
      //进入的渠道
      if (options.adventpage) {
        wx.setStorageSync("advent_channel", '68' + options.adventpage);
      }
      //存储微信广告ID
      if (options.gdt_vid) {
        wx.setStorageSync("gdt_vid", options.gdt_vid);
      }
      //赚钱任务进来的
      if (options.comefrom) {
        this.setData({
          task_freeling: 'freeling'
        })
      }
      if (options.testShare)
      {
        this.data.testShare = options.testShare;
      }
      if(options.comefrom){
        this.data.comefrom = options.comefrom
      }
      if (app.globalData.channel_type == 1) {
        this.setData({
          channel_type: app.globalData.channel_type
        })
      }
      var changTabs = [];

      //确定是用首页3 还是首页5
      var shouyePage = options.shouYePage == "ThreePage" ? 'FivePage' : options.shouYePage
      scene = options.scene != undefined? options.scene:'';
      //扫码红包
      if (options.scene) {
        const scenea = decodeURIComponent(options.scene)
        var scenedata = scenea.split(',');
        if (scenedata.length == 3) {
          var user_id = scenedata[0];
          var shoyType = scenedata[2];
          shouyePage = 'FivePage';

          //如果是扫码进来弹框
          if (shoyType == 'QRcode') {
            this.setData({
              isQRcodeYiFuShow:true,
              redHongbaoQRcodeYiFuShow: true
            })
          }

          //保存父ID
          if (!app.parent_id) {
            app.parent_id = user_id;
          }
        }
      } else {
        // var that = this;
        // showHongBao.getShowHongbao(that, function (is_show) {
        //   if (is_show) {
        //     that.setData({
        //       redHongbaoNewuserShow: true
        //     })
        //   }
        // });
      }

      if (shouyePage == "ThreePage"){
        changTabs = [
          { id: "news", isSelect: true, title: "新人免费福利" },
        ];
      } else if (shouyePage == "FourPage"){
        changTabs = [
          { id: "hall", isSelect: true, title: "新人钜惠" },
        ];
      } else if (shouyePage == "FivePage"){
        changTabs = [
          { id: "news", isSelect: true, title: "新人钜惠" },
        ];
      }
      else{
        changTabs = [
          { id: "news", isSelect: true, title: "时尚" },
          { id: "hall", isSelect: false, title: "生活" }
        ];
      }

      setTimeout(function () {
        total_micro_second = 30 * 60 * 1000;
        that.countdown();
        that.setData({
          is_shouTime: true
        })
      }, 1000);
      
      var showFootView = app.globalData.first_diamond == 1?false:true; 
      that.setData({
        curTabId:changTabs[0].id,
        tabs: changTabs,
        shouYePage: shouyePage,
        roll_code: options.roll_code != undefined ? options.roll_code :"",
        isFirst: (options.isFirst != undefined && options.isFirst != null) ? options.isFirst:"",
        isNew: (options.isNew != undefined && options.isNew != null)? options.isNew : "",
        showFootView: showFootView
        // coupon: options.coupon,
        // getHongBaoSuccessShow:true
      })


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
        // app.shareToHomepage3()

        that.setData({
          isShareFlag: options.isShareFlag,
          user_id: options.user_id,
        })
      }
      var loginfinish = wx.getStorageSync("loginfinish")
    }, 500);

    setTimeout(function(){
      if (app.globalData.first_diamond == 1) {
        that.setData({
          freelingShowTips: true
        })
      }
    },2000)
    
    WxNotificationCenter.addNotification("testNotificationItem1Name", this.testNotificationFromItem1Fn, this);

  },
  onUnload() {
    clearTimeout(redhongbaopopTimer);//清除定时器
    clearTimeout(redhongbaoCutdoenTimer);
    this.setData({
      load_timer: false,
    })
  },
  
  //开屏红包
  kaiPingHongBaoShow:function(){
    var that = this;
    //获取是否是会员
    util.get_vip(function (data) {
      var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
      if (isVip == 0)//不是会员
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
    wx.navigateTo({
      url: '../sign/sign',
    })
  },

  loginsubmit: function (e) {
    formId = e.detail.formId;
    if(app.globalData.user != null)
    {
      util.httpPushFormId(e.detail.formId);
    }
    
    this.setData({
      upperGoYiFuShow: false,
    })
  },
  
  xianjinRedsubmit: function (e) {
    var formId = e.detail.formId;
    if (formId && app.globalData.user != null) {
      util.httpPushFormId(formId);

      this.setData({
        redHongbaoQRcodeYiFuShow: false,
        isQRcodeYiFuShow: false
      })

      clearInterval(animationTimer);
    }

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
  },
  //授权弹窗
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
          app.New_userlogin(function (data) {
            wx.hideLoading();
            if (app.globalData.user && app.globalData.user.userToken != undefined)//登录成功
            {
              var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
              that.setData({
                redHongbaoQRcodeYiFuShow: false,
                isQRcodeYiFuShow: false,
                showendofpromotionDialog: showendofpromotionDialog
              })
              
              if (that.data.showendofpromotionDialog) {
                wx.setStorageSync("comefrom", 'showendofpromotionDialog_free');
                wx.switchTab({
                  url: '/pages/shouye/shouye?comefrom=showendofpromotionDialog',
                })
              }
            } else if (app.globalData.user && app.globalData.user.userToken == undefined && app.globalData.channel_type == 1) {
              that.showToast('不符合条件', 2000);
            } else {
              that.globalLogin();
            }
          });
        }else{

          if (that.data.showendofpromotionDialog) {
            wx.setStorageSync("comefrom", 'showendofpromotionDialog_free');
            wx.switchTab({
              url: '/pages/shouye/shouye?comefrom=showendofpromotionDialog',
            })
          }
        }
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
          app.New_userlogin(function (data) {
            wx.hideLoading();
            if (app.globalData.user && app.globalData.user.userToken != undefined)//登录成功
            {
              that.setData({
                redHongbaoQRcodeYiFuShow:false,
                isQRcodeYiFuShow: false
              })

            } else {
              that.globalLogin();
            }

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

  //自动登录
  globalLogin: function () {
    var that = this;
    util.autoLogin(loginCount, function (loginfailYiFuShow, login_discribution, login_buttontitle, newloginCount) {
      wx.hideLoading();
      loginCount = newloginCount;
      if (loginCount == 1)//登录成功
      {
        that.setData({
          redHongbaoQRcodeYiFuShow: false,
          isQRcodeYiFuShow: false
        })
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
    isload = false;

    clearInterval(xuanfuanimationTimer);
    showHongBao.stoppopTimer(this, function () { })
    this.xuanfuanimationMiddleHeaderItem.rotate(0).step();
    this.setData({
      xuanfuanimationMiddleHeaderItem: this.xuanfuanimationMiddleHeaderItem.export(),  //输出动画
      suspensionHongBao_isShow:false,
      redHongbaoNewuserShow:false
    });
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
  getcoupon_http:function(){
    var that = this;
    var oldurl = config.Host + '/coupon/getRollCoupon?' + config.Version;
    util.http(oldurl, that.coupon_data);
  },
  coupon_data:function(data){
    var coupon = "6";
    var cond = "10";
    if (data.status == 1) {
      coupon = data.price > 0 ? (data.price*1).toFixed(0) : coupon;
      cond = data.cond > 0 ? (data.cond * 1).toFixed(0) : cond;
    }
    this.setData({
      coupon: coupon,
      cond:cond
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
    // wx.navigateTo({
    //   url: '../mine/wallet/Withdrawals/Withdrawals?isRed=' + 'true' + '&coupon=' + this.data.coupon + '&cond=' + (20 - this.data.coupon),
    // })
    
    // var item = event.currentTarget.dataset.item;
    // var option_type = item.option_type;
    // var shop_code = item.shop_code;

    // switch (option_type) {
    //   case 1://商品详情
    //     wx.navigateTo({
    //       url: '../shouye/detail/detail?' + "shop_code=" + shop_code,
    //     })
    //     break;
    //   case 2://邀请码
    //     break;
    //   case 3://消息盒子
    //     break;
    //   case 4://签到页
    //     break;
    //   case 5://H5活动页
    //     break;
    //   case 6://新品专区
    //     wx.navigateTo({
    //       url: '../shouye/newProductarea/newProductarea',
    //     })
    //     break;
    //   case 7://制造商
    //     this.brandsDetail(item);
    //     break;
    //   case 999://新人提现
    //     wx.navigateTo({
    //       url: '../mine/wallet/Withdrawals/Withdrawals?isRed='+'true',
    //     })
    //     break;

    // }
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
      //data 0一元购 1不是一元购
      // app.globalData.oneYuanData = data.data.wxcx_status;
      // app.globalData.typePageHide = data.data.typePageHide != undefined ? data.data.typePageHide:0;
      // app.globalData.oneYuanData = this.data.shouYePage == "FourPage"? 1:0;//首页4默认不是一元购 是活动商品
      
      app.globalData.oneYuanData = 0;
      app.globalData.typePageHide = 0;

      util.get_discountHttp(function (data) {
        if (data.status == 1) {
          var money = data.one_not_use_price.toFixed(2);
          var shop_deduction = Number(data.shop_deduction) > 1 ? 1.0 : data.shop_deduction;

          that.setData({
            reduceMoney: money,
            nRaffle_Money: data.nRaffle_Money,
            shop_deduction: shop_deduction != undefined ? shop_deduction : 0.0
          })
        }
        that.http_shoplist();
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
      if (app.globalData.oneYuanData == 0)//1元购
      {
        //正价广告商品
        var tongji_url = "default";
        var tongji_parameter = "default"
        var mUrl = config.Host + 'homePage3shop/dataShopList?' + 'pager.pageSize=30' + '&pager.curPage=' + page;

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

        if(token.length > 10)
        {
          if (app.globalData.first_diamond == 1)
          {
            url = config.Host + 'homePage2FreeShop/dataShopList?' + 'pager.pageSize=30' + '&pager.curPage=' + page + '&token=' + token;
            urlcomefrom = 'homePage2FreeShop';
          }else{
            url = config.Host + 'homePage3shop/dataShopList?' + 'pager.pageSize=30' + '&pager.curPage=' + page + '&token=' + token;
            urlcomefrom = 'homePage3shop';
          }
          that.setData({
            urlcomefrom: urlcomefrom
          })
        }else{
          url = config.Host + 'homePage3shop/dataShopList?' + 'pager.pageSize=30' + '&pager.curPage=' + page ;
        }
        url = util.Md5_httpUrl(url);
        wx.request({
          url: url + config.Version,
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
            app.globalData.first_diamond = data.first_diamond != undefined ? data.first_diamond : 0;
            if (that.data.comefrom == 'testExit') {
              app.globalData.first_diamond = 1
            }
            that.newshoplistData(data);
          },
          fail: function (error) {
            app.mtj.trackEvent('i_f_error_count', {
              i_f_name: tongji_url,
            });
          }
        })
      } else {
        //活动商品
        url = config.Host + 'shop/queryShopActivity?' + "最新" + config.Version + '&token=' + token + '&pageSize=30' + '&curPage=' + page;
        util.http(url, that.shoplistData);
      }

    } else {//生活
      //特价广告商品
      // var url = config.Host + 'shop/queryPackageList?pager.order=desc' + config.Version + '&pager.pageSize=30' + '&pager.curPage=' + page + '&p_type=0';
      var url = config.Host + 'homePage4shop/shopDataList?pager.order=desc' + config.Version + '&token=' + token + '&pager.pageSize=30' + '&pager.curPage=' + page + '&p_type=0';
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

      var isVip = data.isVip != undefined ? data.isVip : '';
      var maxType = data.maxType != undefined ? data.maxType : '';

      this.data.isVip = isVip;
      this.data.maxType = maxType;

      if (this.data.curTabId == 'news')//时尚
      {
        if (app.globalData.oneYuanData == 0)//1元购
        {
          this.remaishoplist(data.listShop);
        } else {
          this.remaishoplist(data.list);
        }
      }

      // if (!this.data.redHongbaoQRcodeYiFuShow)
      // {
      //   this.kaiPingHongBaoShow();
      // }
    } else {
      // this.showToast(data.message, 2000);
    }
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

      var isVip = data.isVip != undefined ? data.isVip : '';
      var maxType = data.maxType != undefined ? data.maxType : '';

      this.data.isVip = isVip;
      this.data.maxType = maxType; 

      if (this.data.curTabId == 'news')//时尚
      {
        if (app.globalData.oneYuanData == 0)//1元购
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

      if (app.globalData.oneYuanData == 0)//是1元购
      {
        var se_price = (obj[i].assmble_price * 1).toFixed(1);

        if (this.data.curTabId != 'news') //生活
        {
          this.data.reduceMoney = this.data.reduceMoney >= 15 ? 15 : this.data.reduceMoney;
          // se_price = shop_se_price - this.data.reduceMoney > 0 ? (shop_se_price - this.data.reduceMoney) : '0.0';

          se_price = util.get_discountPrice(shop_se_price, this.data.shop_deduction, this.data.reduceMoney, this.data.maxType);
        }else{//时尚
          if(this.data.isVip > 0)
          {
            // se_price = shop_se_price - this.data.reduceMoney > 0 ? (shop_se_price - this.data.reduceMoney) : '0.0';

            se_price = util.get_discountPrice(shop_se_price, this.data.shop_deduction, this.data.reduceMoney, this.data.maxType);
          }
        }

        obj[i].shop_se_price = (se_price*1).toFixed(1);
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
    if (app.globalData.oneYuanData == 1 || this.data.curTabId == 'hall') {
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
    
    var that = this;
    util.get_discountHttp(function (data) {
      if (data.status == 1) {
        var money = data.one_not_use_price.toFixed(2);
        var shop_deduction = Number(data.shop_deduction) > 1 ? 1.0 : data.shop_deduction;
        that.setData({
          reduceMoney: money,
          shop_deduction: shop_deduction != undefined ? shop_deduction : 0.0
        })
      }

      that.http_shoplist();
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    
    var that = this;
    util.get_discountHttp(function (data) {
      if (data.status == 1) {
        var money = data.one_not_use_price.toFixed(2);
        var shop_deduction = Number(data.shop_deduction) > 1 ? 1.0 : data.shop_deduction;
        that.setData({
          reduceMoney: money,
          shop_deduction: shop_deduction != undefined ? shop_deduction : 0.0
        })
      }

      that.setData({
        currentpage: 1
      })
      that.http_shoplist();
    });
  },
  imageTap: function (event) {
    var code = event.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../shouye/specialDetail/specialDetail?' + "class_code=" + code
    })
  },
  shopTap: function (event) {
    var shopcode = event.currentTarget.dataset.shop_code;
    var url = '../shouye/detail/detail?' + "shop_code=" + shopcode;
    if(this.data.roll_code)
    {
      url = '../shouye/detail/detail?' + "shop_code=" + shopcode + '&roll_code=' + this.data.roll_code + "&isFirst=" + this.data.isFirst + "&isNew=" + this.data.isNew + '&is_redHongBao=true';
    }
    url = url + '&shouYePage=' + this.data.shouYePage + '&poplastTime=' + this.data.poplastTime + '&homePage3ElasticFrame=' + this.data.homePage3ElasticFrame + '&comefrom=' + this.data.comefrom + '&task_freeling=' + this.data.task_freeling;
    wx.navigateTo({
      url: url,
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
  onShow: function () { //在onShow中处理新衣节弹窗
    var that = this;
    try {
      isCrazyMon = wx.getStorageSync("HASMOD")
    } catch (e) {
    }

    //获取用户最高会员等级
    util.get_vip2(function (data) {
      if (data.status == 1) {
        var maxType = data.maxType != undefined ? data.maxType : 999; //会员等级
        var showBecameMember = (((data.isVip > 0 && data.isVip != 3) || (data.isVip == 3 && data.maxType == 4)) && data.first_diamond == 0) ? true : false;

        that.setData({
          max_vipType: maxType,
          showBecameMember: showBecameMember
        })
      }
    });
    
    //大促销已结束
    if (app.globalData.user != null) {
      var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
      that.setData({
        showMainPage: true,
        showendofpromotionDialog: showendofpromotionDialog
      })
    }else{
      that.setData({
        showMainPage: true,
        showendofpromotionDialog: true
      })
    }

    if (!that.data.showendofpromotionDialog) {
      wx.onUserCaptureScreen(function (res) {
        console.log('……………………………………………………用户截屏了')
        setTimeout(function () {
          that.showModal();
        }, 1000)
      })
    }

    that.http_Landingpage2();

    that.setData({
      suspensionHongBao_isShow:false
    })
    that.xuanfuHongBaoAnimation();

    // this.http_shoplist();

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
            if (!that.data.showNewYI && !that.data.isRedShow) {
              if (app.globalData.user != null) {
                that.getOrderStatus();
              }
            }
          });
        } else {

        }
      }
    })

    if (!firstComming && that.data.homePage3ElasticFrame > 0)
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
    firstComming = false;
  },
 
  //商品详情
  first_list_tap: function (event) {
    var shopcode = event.currentTarget.dataset.shop_code;
    var url = '';
    if (this.data.curTabId == 'news')//时尚
    {
      if (this.data.roll_code)
      {
        url = '../shouye/detail/detail?' + "shop_code=" + shopcode + '&roll_code=' + this.data.roll_code + "&isFirst=" + this.data.isFirst + "&isNew=" + this.data.isNew + '&is_redHongBao=true';
      }else{
        url = '../shouye/detail/detail?' + "shop_code=" + shopcode + "&isFirst=" + this.data.isFirst + "&isNew=" + this.data.isNew
      }

      if (app.globalData.oneYuanData != 0)//活动商品
      {
        url = '../shouye/detail/detail?' + "shop_code=" + shopcode + "&isActiveShop=" + isActiveShop
      }
    } else {
      //shop_type 2特价商品 3特价广告商品
      if(this.data.roll_code)
      {
        url = '../shouye/detail/detail?' + "shop_code=" + shopcode + "&shop_type=2" + '&roll_code=' + this.data.roll_code + "&isFirst=" + this.data.isFirst + "&isNew=" + this.data.isNew + '&is_redHongBao=true';
      }else{
        if(this.data.shouYePage == 'FourPage')
        {
          url = '../shouye/detail/detail?' + "shop_code=" + shopcode + "&shop_type=3";
        }else{
          url = '../shouye/detail/detail?' + "shop_code=" + shopcode + "&shop_type=2";
        }
      }
    }
    var freelingpage2_comefrom = urlcomefrom == 'homePage2FreeShop' ? true:false;

    url = url + '&shouYePage=' + this.data.shouYePage + '&poplastTime=' + this.data.poplastTime + '&homePage3ElasticFrame=' + this.data.homePage3ElasticFrame + '&comefrom=' + this.data.comefrom + '&task_freeling=' + this.data.task_freeling + '&freelingpage2_comefrom=' + freelingpage2_comefrom;
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
  colseTips: function () {
    var that = this;
    if (that.data.contactkefuShow) {
      if (that.data.homePage3ElasticFrame == undefined || that.data.homePage3ElasticFrame <= 0) {
        if (app.globalData.user != null && app.globalData.user.userToken != undefined) {

        } else {//当用户没有登录授权时才循环弹出此框
          that.pop_redhongbao_newuser();
        }
      } else {
        that.data.poplastTime = that.data.homePage3ElasticFrame;
        that.startReportHeart();

        if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
          clearInterval(redhongbaoCutdoenTimer);
          clearTimeout(redhongbaopopTimer);//清除定时器
        } else {//当用户没有登录授权时才循环弹出此框
          redhongbaopopTimer = setTimeout(function () {
            that.setData({
              redHongbaoNewuserShow: true,
            })
          }, that.data.homePage3ElasticFrame * 1000)
        }
      }
    }
    that.setData({
      contactkefuShow: false
    })
  },
  contactkefu: function () {
    if (this.data.contactkefuShow)
    {
      //如果取到广告click_id就回传
      var click_id = wx.getStorageSync('gdt_vid');
      if (click_id) {
        var clickUrl = config.Host + 'wxMarkting/marketing_reservation?' + config.Version +
          '&click_id=' + click_id +
          "&channel=" + wx.getStorageSync("advent_channel");
        util.http(clickUrl, function (data) {
          if (data.status == 1) {
            wx.setStorageSync('gdt_vid', '')
          }
        });
      }
      this.setData({
        poplastTime:0,
        contactkefuShow: false
      })
    }
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
  closeShare:function(){
    this.setData({
      getHongBaoSuccessShow: false
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
   
    var user_id = app.globalData.user?app.globalData.user.user_id:'';
    var headpic = "https://www.measures.wang/userinfo/head_pic/default.jpg";
    if ((app.globalData.user != null)) {
      headpic = (app.globalData.user.pic != null) ? app.globalData.user.pic : 'https://www.measures.wang/userinfo/head_pic/default.jpg'
    }
    var title = "👇点击领取您的90元任务奖金！";
    var imagestr = "small-iconImages/heboImg/taskraward_shareImg.png";
    var path = '/pages/shouye/redHongBao?shouYePage=ThreePage' + "&isShareFlag=true" + "&user_id=" + user_id + "&headpic=" + headpic;
    if(scene != undefined && scene != "")
    {
      title = "199元购物红包免费抢，多平台可用，快来试试人品吧	👉";
      imagestr = "small-iconImages/heboImg/freeling_share199yuan.jpg";
      path = '/pages/shouye/redHongBao?shouYePage=ThreePage' + "&isShareFlag=true" + "&user_id=" + user_id + "&headpic=" + headpic + "&scene=" + scene;
    }else if(this.data.testShare){
      title = "90元微信红包，直接打入微信零钱，点击领取 👆";
      imagestr = "small-iconImages/heboImg/shareuserredhongbao_ninety_money.png";
      path = '/pages/shouye/redHongBao?shouYePage=ThreePage' + "&isShareFlag=true" + "&user_id=" + user_id + "&headpic=" + headpic;
    }
    return {
      title: title,
      path: path,
      imageUrl: config.Upyun + imagestr,
      success: function (res) {

      },
      fail: function (res) {
        // 转发失败
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

  closeNewThirty:function(){
    var that = this;
    if (that.data.redHongbaoNewuserShow)
    {
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
      redHongbaoQRcodeYiFuShow:false,
      redHongbaoNewuserShow:false,
      upperGoYiFuShow_task: false,
      upperGoYiFuShow_tixian: false,
      isQRcodeYiFuShow:false,
      hasJYJLdialog:false
    })
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
  
  closePop:function(){
    this.setData({
      freelingShowTips:false
    })
  },

  //红包缩放动画
  hongBaoAnimation: function () {
    var circleCount = 0;
    // 心跳的外框动画  
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 500, // 以毫秒为单位  
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
        animationMiddleHeaderItem: this.animationMiddleHeaderItem.export() //输出动画
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

  footerTap: app.footerTap
})
