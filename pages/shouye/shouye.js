//获取本地化数据
import config from '../../config';
var util = require('../../utils/util.js');
var fightUtil = require('../../utils/freeFightCutdown.js');
var MD5 = require('../../utils/md5.js');
var base64 = require('../../utils/base64.js');
var showHongBao = require('../../utils/showNewuserHongbao.js');
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");
var app = getApp();
var isload; //是否新加载界面
var isCrazyMon = false; //是否是疯狂星期一
var isautoSign = false; //是否自动跳转到赚钱页
var scrollTop = false; //是否滑动到顶部
var isActiveShop = true; //是否活动商品
var is_newShouquan = true; //是否重新授权
var is_Transaction = false; //是否有交易记录
var is_discount = false; //是否有退款
var coupon; //新人优惠券
var firstCommint;
var getNewUserOrder_END = false;

var shareBackheadpic; //新人红包引导人的头像

var rate = 0; //分辨转换
var floatTop = 0; //悬浮高度
var formId; //授权formId
var is_goShare; //去分享
var loginCount = 0;//登录次数
var animationTimer;
var xuanfuanimationTimer;
var moneyTixianShowCount = 0;

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
    is_noShowMakeMoney:false,
    isShareFlag: false,
    user_id: "",
    Coloropacity: 1,
    coupon: "",
    reduceMoney:0,

    uppertittle: "温馨提示",
    isUpperNotitle: true,
    loginupperdistribution: "需要您的授权才能正常使用哦！",
    login_discribution:"请尝试再次登录",
    login_buttontitle:"再次登录",
    loginupperbuttontitle: "授权登录",
    loginfailYiFuShow:false,
    upperGoYiFuShow: false,
    openYifuDialogShow: false,
    openFightSuccessShow: false,
    upperMemberYiFuShow:false,
    typePageHide: app.globalData.typePageHide,

    NewThirtyDialogHide: false,
    moneyDiscountShowFlag: false,
    moneyDiscount: "0.0", //累计已抵扣的余额
    oneYuanDiscriptionTitle: "免费领未成功通知",
    suspensionHongBao_isShow: false,
    contactkefuShow:false,
    showendofpromotionDialog:true,
    // getHongBaoSuccessShow: false,
    // makeMoneyHongBaoSuccessShow: false,

    // SmallRedHongBao: config.Upyun + 'small-iconImages/heboImg/small-thirtyRedHongBao.png',
    // 设置tab的数量
    // tabs: [{
    //     id: "news",
    //     isSelect: true,
    //     title: "女装"
    //   },
    //   {
    //     id: "hall",
    //     isSelect: false,
    //     title: "搭配"
    //   }
    // ], //tabbar数组

    tabs: [{
      id: "news",
      isSelect: true,
      title: "猜你喜欢"
    },
    ], //tabbar数组

    curTabId: "news", //当前tabid
    isShowFloatTab: false, //是否显示悬浮tab

    scrollTop: 0,
    clickLogin:true,//点击红包授权
    guidefightCouponShow:false
  },

  onLoad: function(options) {
    getNewUserOrder_END = false
    app.WUSHIredPackageShow = false;
    app.JieliHongbaoShowEd = false;
    app.showThirtyEd = false;
    app.isFightSuccess = false;
    loginCount = 0;
    shareBackheadpic = options.headpic;
    firstCommint = true;

    // shareBackheadpic = "111";
    if (shareBackheadpic) {
      this.setData({
        shareBackheadpic: shareBackheadpic,
      })
    }

    console.log("shareBackheadpic=" + shareBackheadpic)

    if (app.globalData.roll_code)
    {
      console.log("***************code3=" + app.globalData.roll_code);
      this.data.roll_code = app.globalData.roll_code;
      app.globalData.roll_code = '';
    }else{
      this.data.roll_code = '';
    }

    if (!app.parent_id) {
      app.parent_id = options.user_id
    }

    //首页2进入的渠道
    // options.scene = 'v_type=6810'//测试用
    const scene = options.scene?decodeURIComponent(options.scene):'v_type='
    if(options.scene !=undefined)
    {
      app.globalData.channel_type = 1;
      this.setData({
        channel_type: app.globalData.channel_type
      })
    }
    wx.setStorageSync("v_type_channel", scene);

    
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
    this.hongBaoAnimation();
    this.globalLogin();

    // this.xuanfuHongBaoAnimation();

    if (options.user_id) {
      this.shareLoginSetting()
    }

    isload = true;
    var that = this;
    setTimeout(function() {
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
    WxNotificationCenter.addNotification("memberNotificationItem1Name", this.testNotificationFromItem3Fn, this);
  },

  //红包缩放动画
  hongBaoAnimation: function() {
    var circleCount = 0;
    // 心跳的外框动画  
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 500, // 以毫秒为单位  
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function(res) {
        console.log("***************************");
      }
    });
    animationTimer = setInterval(function() {
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
  xuanfuHongBaoAnimation: function() {

    this.xuanfuanimationMiddleHeaderItem = wx.createAnimation({
      duration: 2000, // 以毫秒为单位  
      timingFunction: 'linear',
      delay: 50,
      transformOrigin: '50% 50%',
      success: function(res) {
        console.log("***************************");
      }
    });
    xuanfuanimationTimer = setInterval(function() {

      this.xuanfuanimationMiddleHeaderItem.scale(1.2).step({
        duration: 300
      }).rotate(-15).step({
        duration: 300
      }).rotate(15).step({
        duration: 300
      }).rotate(0).step({
        duration: 300
      }).scale(1.0).step({
        duration: 300
      });

      this.setData({
        xuanfuanimationMiddleHeaderItem: this.xuanfuanimationMiddleHeaderItem.export() //输出动画
      });
    }.bind(this), 2000);
  },
  /**
   * 获得滑动导致悬浮开始的高度
   * @return {[type]} [description]
   */
  getScrollTop: function() {
    var that = this;
    if (wx.canIUse('getSystemInfo.success.screenWidth')) {
      wx: wx.getSystemInfo({
        success: function(res) {
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
  onPageScroll: function(event) {
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
  clickTab: function(event) {
    var id = event != undefined ? event.detail.id : '';
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
    // this.http_shoplist();



    var that = this;

    if (app.globalData.user != null) {
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

    }else{
      that.http_shoplist();

    }











  },

  onHide: function(options) {
    WxNotificationCenter.removeNotification("testNotificationItem1Name", this);
    wx.setStorageSync("loginfinish", "false")

    clearInterval(xuanfuanimationTimer);

    this.xuanfuanimationMiddleHeaderItem.rotate(0).step().scale(1.0).step();
    this.setData({
      xuanfuanimationMiddleHeaderItem: this.xuanfuanimationMiddleHeaderItem.export(), //输出动画
      suspensionHongBao_isShow:false,
      upperGoYiFuShow:false
    });

    isload = false;
    this.setData({
      newUserredPacageShow: false,
      xuanfuanimationMiddleHeaderItem:''
    })

    showHongBao.stoppopTimer(this, function () { })
  },

  testNotificationFromItem1Fn: function(info) {
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

  //购买会员成功后刷新会员界面
  testNotificationFromItem3Fn:function(info){
    console.log("6666666666666666666成为会员");
    this.oneYuan_httpData();
  },
  //请求落地页 获取微信小程序落地页开关
  http_Landingpage: function() {
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

  Landingpage: function(data) {
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
        setTimeout(function() {
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

  //轮播数据
  top_shopHttp: function() {
    var that = this;
    var oldurl = config.Host + 'shop/queryOption?' + config.Version;
    util.http(oldurl, that.top_shop_data);
  },
  top_shop_data: function(data) {
    if (data.status == 1) {
      var listshop = data.topShops;
      this.setData({
        swiperlist: listshop,
      })
    }
  },
  //轮播图点击事件
  swipertap: function(event) {
    console.log(event);
    var item = event.currentTarget.dataset.item;
    var option_type = item.option_type;
    var shop_code = item.shop_code;

    switch (option_type) {
      case 1: //商品详情
        wx.navigateTo({
          url: '../shouye/detail/detail?' + "shop_code=" + shop_code + '&unvip_roll_code=' + this.data.roll_code + '&homePage3ElasticFrame=' + this.data.homePage3ElasticFrame,
        })
        break;
      case 2: //邀请码
        break;
      case 3: //消息盒子
        break;
      case 4: //签到页
        break;
      case 5: //H5活动页
        break;
      case 6: //新品专区
        wx.navigateTo({
          url: '../shouye/newProductarea/newProductarea',
        })
        break;
      case 7: //制造商
        this.brandsDetail(item);
        break;

    }
  },

  //制造商详情
  brandsDetail: function(item) {
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
  oneYuan_httpData: function() {
    var that = this;
    var url = config.Host + 'cfg/on_off_3_7?' + config.Version;
    util.http(url, that.oneYuanData);
  },
  oneYuanData: function(data) {
    var that = this;
    if (data.status == 1) {
      //data 0一元购 1不是一元购
      // app.globalData.oneYuanData = data.data.wxcx_status;
      // app.globalData.typePageHide = data.data.typePageHide != undefined ? data.data.typePageHide:0;

      app.globalData.oneYuanData = 0; //默认是一元购
      app.globalData.typePageHide = 0;

      util.get_discountHttp(function(data){
        if(data.status == 1)
        {
          var money = data.one_not_use_price.toFixed(2);
          var shop_deduction = Number(data.shop_deduction) > 1 ? 1.0 : data.shop_deduction; 
          var is_pop = data.is_pop;
          var nRaffle_Money = data.nRaffle_Money;
          that.setData({
            reduceMoney:money,
            nRaffle_Money: nRaffle_Money,
            shop_deduction: shop_deduction != undefined ? shop_deduction :0.0,
          })
        }

        that.setData({
          currentpage: 1
        })
        that.http_shoplist();
      });
    }
  },
  //获取用户是否有拼团成功的订单
  // getOrderStatus: function() {
  //   var that = this;
  //   var token = "";
  //   if (app.globalData.user != null) {
  //     token = app.globalData.user.userToken;
  //   }
  //   var oldurl = config.Host + 'order/getOrderStatus?' + config.Version + "&token=" + token;
  //   util.http(oldurl, that.fightOrder_data);
  // },
  // fightOrder_data: function(data) {

  //   var that = this;

  //   if (data.status == 1 && data.roll == 1) { //拼团成功
  //     if (!app.isFightSuccess) {
  //       that.setData({
  //         ptSuccessUserName: data.user_name != undefined ? data.user_name : '',
  //         openFightSuccessShow: true
  //       })
  //       app.isFightSuccess = true;
  //     }else{
  //       //获取是否有拼团失败的订单
  //       if (!that.data.upperGoYiFuShow && !that.data.openFightSuccessShow && !that.data.hasJYJLdialog) {
  //         util.getFightFailOrder(that.discountData);
  //       }
  //     }

  //   } else {
  //     //获取是否有拼团失败的订单
  //     if (!that.data.upperGoYiFuShow && !that.data.openFightSuccessShow && !that.data.hasJYJLdialog) {
  //       util.getFightFailOrder(that.discountData);
  //     }

  //     if (!shareBackheadpic) {
  //       that.getNewUserOrder(false)
  //     }
  //   }
  // },

  //获取是否弹出奖励金的弹窗
  getRawardMoneyStatus: function () {
    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var oldurl = config.Host + 'userVipCard/rewardDrawPop?' + config.Version + "&token=" + token;
    util.http(oldurl, that.rawardMoney_data);
  },
  rawardMoney_data:function(data){
    var that = this;
    
    //会员奖励金弹窗 当有拼团成功 拼团失败的弹窗时不弹
    if (data.status == 1 && data.is_pop >0 && app.globalData.moneyTixianShowCount == 0) {
      that.setData({
        rawardMoney: data.draw,
        oneYuanDiscriptionTitle: data.is_pop == 2?'奖励金清0':'恭喜您',
        openFightSuccessShow:true
      })
      app.globalData.moneyTixianShowCount += 1;
    }else{
      //获取是否有拼团失败的订单
      if (!that.data.upperGoYiFuShow && !that.data.openFightSuccessShow && !that.data.hasJYJLdialog) {
        util.getFightFailOrder(that.discountData);
      }
      // if (!shareBackheadpic) {
      //   that.getNewUserOrder(false)
      // }
    }
  },

  //热卖列表数据
  http_shoplist: function() {
    var that = this;
    var token = "";
    if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
      token = app.globalData.user.userToken;
    }

    var typename = '热卖';
    var type1 = '1';
    var page = that.data.currentpage;
    var url = "";

    if (that.data.curTabId == 'news') //时尚
    {
      if (app.globalData.oneYuanData == 0) //1元购
      {
        //热卖商品
        // url = config.Host + 'shop/queryConUnLogin?code=1' + '&type_name=' + typename + config.Version + '&type1=' + type1 + '&pager.pageSize=30' + '&pager.curPage=' + page;
        var tongji_url = "default";
        var tongji_parameter = "default"
        var mUrl = config.Host + 'shop/queryConUnLogin?' + 'pager.pageSize=30' + '&pager.curPage=' + page;

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
          url = config.Host + 'shop/queryConUnLogin?' + 'pager.pageSize=30' + '&pager.curPage=' + page + '&token=' + token ;
        }else{
          url = config.Host + 'shop/queryConUnLogin?' + 'pager.pageSize=30' + '&pager.curPage=' + page;
        }
        url = util.Md5_httpUrl(url);
        wx.request({
          url: url + config.Version,
          data: {
            code: '1',
            type_name: typename,
            type1: type1,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@' + res.data.listShop);
            app.mtj.trackEvent('i_f_success_count', {
              i_f_name: tongji_url,
            });

            var data = res.data;
            that.newshoplistData(data);
          },
          fail: function(error) {
            app.mtj.trackEvent('i_f_error_count', {
              i_f_name: tongji_url,
              // i_f_from: "10",
            });
          }
        })
      } else {
        //活动商品
        
        if (token.length > 10) {
          url = config.Host + 'shop/queryShopActivity?' + "最新" + config.Version + '&token=' + token + '&pageSize=30' + '&curPage=' + page;
        }else{
          url = config.Host + 'shop/queryShopActivity?' + "最新" + config.Version + '&pageSize=30' + '&curPage=' + page;
        }
        util.http(url, that.shoplistData);
      }

    } else { //生活

      if(token.length > 10)
      {
        url = config.Host + 'shop/queryPackageList?pager.order=desc' + config.Version + '&token=' + token + '&pager.pageSize=30' + '&pager.curPage=' + page + '&p_type=0';
      }else{
        url = config.Host + 'shop/queryPackageList?pager.order=desc' + config.Version + '&pager.pageSize=30' + '&pager.curPage=' + page + '&p_type=0';
      }
      util.http(url, that.shoplistData);
    }
  },

  //热卖商品数据处理
  newshoplistData: function(data) {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@' + data.listShop);
    var that = this;
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
      this.setData({
        isVip: isVip
      })
      this.data.maxVip_type = maxType;

      if (this.data.curTabId == 'news') //时尚
      {
        if (app.globalData.oneYuanData == 0) //1元购
        {
          this.remaishoplist(data.listShop);
        } else {
          this.remaishoplist(data.list);
        }
      }

      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {

            console.log("MMMMMMMMMMMMMMMMis_newShouquan=" + is_newShouquan);
            is_newShouquan = false;

            if (shareBackheadpic) {
              that.getNewUserOrder(false)

            }

          } else {
            if (shareBackheadpic) {

              if (!app.JieliHongbaoShowEd) {
                that.setData({


                  jl_openType: "share",
                  jl_bindtap: "",
                  NewUserShareBackRedPackage_bg: config.Upyun + "small-iconImages/qingfengpic/newuser_share_back_new3.png",
                  newUserredPacageShow: true
                })
                app.JieliHongbaoShowEd = true
              }

            } else {

              if (!app.showThirtyEd) {
                showHongBao.getShowHongbao(that, function (is_show) {
                  if (is_show) {
                    if (app.globalData.channel_type == 1) {
                      wx.navigateTo({
                        url: '../sign/sign',
                      })
                    }else{
                      that.setData({
                        upperGoYiFuShow: true
                      })
                    }
                  }
                });

                app.showThirtyEd = true
              }
            }
          }
        }
      })

    } else {
      // this.showToast(data.message, 2000);
    }

    //不登录且不是渠道过来的弹此框
    var upperGoYiFuShow_unlogin = app.globalData.channel_type != 1?true:false;
    if (app.globalData.user != null) {
      upperGoYiFuShow_unlogin = false;
    }
    this.setData({
      pagestyle:3,
      upperGoYiFuShow_unlogin: upperGoYiFuShow_unlogin
    })

  },

  //活动商品 特价商品处理数据
  shoplistData: function(data) {
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
      this.data.maxVip_type = maxType;

      if (this.data.curTabId == 'news') //时尚
      {
        if (app.globalData.oneYuanData == 0) //1元购
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

          var wxcx_shop_group_price = data.pList[i].assmble_price;

          var virtual_sales = data.pList[i].virtual_sales;
          data.pList[i].shop_list[0].virtual_sales = virtual_sales;
          data.pList[i].shop_list[0].def_pic = data.pList[i].def_pic;
          data.pList[i].shop_list[0].shop_se_price = data.pList[i].shop_se_price;
          data.pList[i].shop_list[0].wxcx_shop_group_price = wxcx_shop_group_price;
          data.pList[i].shop_list[0].assmble_price = wxcx_shop_group_price;
          shoplist.push(data.pList[i].shop_list[0]);
          console.log(shoplist);
        }
        this.remaishoplist(shoplist, wxcx_shop_group_price);
      }
    } else {}
  },

  remaishoplist: function(obj, wxcx_shop_group_price) {

    for (var i = 0; i < obj.length; i++) {
      var new_clde = obj[i].shop_code.substr(1, 3);
      var new_pic = "";
      var shop_code = obj[i].shop_code;
      var newshopname = obj[i].shop_name;
      var shop_se_price = (obj[i].shop_se_price * 1).toFixed(1);

      if (this.data.curTabId == 'news') //时尚
      {
        new_pic = new_clde + '/' + obj[i].shop_code + '/' + obj[i].def_pic;
        shop_code = obj[i].shop_code;

        if (app.showSub) {
          if (newshopname.length > 12) {
            newshopname = '... ' + newshopname.substr(newshopname.length - 12, 12);
          }

        } else {
          if (newshopname.length > 24) {
            newshopname = '...' + newshopname.substr(newshopname.length - 24, 24);
          }
        }

      } else { //生活
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

      if (app.globalData.oneYuanData == 0) //是1元购
      {
        var se_price = (obj[i].assmble_price * 1).toFixed(1);
        if (this.data.curTabId != 'news') //生活
        {
          if (this.data.isVip > 0) {
            se_price = util.get_discountPrice(obj[i].shop_se_price, this.data.shop_deduction, this.data.reduceMoney, this.data.maxVip_type);
          }
        } else {//时尚
          if (this.data.isVip > 0) {
            se_price = util.get_discountPrice(obj[i].shop_se_price, this.data.shop_deduction, this.data.reduceMoney,this.data.maxVip_type);
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
  list_shopHttp: function() {
    var that = this;
    var url = config.Host + "collocationShop/queryShopCondition?type=2" + config.Version + '&pager.curPage=' + that.data.currentpage + "&pager.pageSize=10";
    util.http(url, that.collocationShopData);
  },

  collocationShopData: function(data) {
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
  onReachBottom: function() {

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
  onPullDownRefresh: function() {
  
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
  imageTap: function(event) {
    var code = event.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../shouye/specialDetail/specialDetail?' + "class_code=" + code ,
    })
  },
  shopTap: function(event) {
    var shopcode = event.currentTarget.dataset.shop_code;
    wx.navigateTo({
      url: '../shouye/detail/detail?' + "shop_code=" + shopcode + '&unvip_roll_code=' + this.data.roll_code + '&homePage3ElasticFrame=' + this.data.homePage3ElasticFrame,
    })
  },
  //商品分类
  typeTap: function() {
    console.log('商品分类');
    //测试用
    wx.navigateTo({
      url: '../shouye/shopClassType/shopClassType',
      // url: '/pages/listHome/hotShopListTK/hotShopListTK'
      // url: '/pages/sign/signActiveShop/signActiveShop'
      // url:'/pages/shopType/shopSearch/SpecialShopSearch'
      // url: '/pages/listHome/lookShopListHome/lookshop'
      // url: '../shouye/newProductarea/newProductarea'
      // url:'/pages/shouye/SpecialOffer/SpecialOffer'

      // url:'/pages/shouye/advent?adventpage=25'
      // url:'/pages/mine/myInviNumber/myInviNumber'
      // url:'/pages/mine/withdrawLimitTwo/withdrawLimitTwo'
      // url: "../../pages/shouye/redHongBao?shouYePage=" + "ThreePage"
      // url:'/pages/shouye/fightDetail/fightDetail'
      // url:'/pages/sign/sign?fromApp=1'
      // url:'/pages/mine/toexamine_test/toexamine_test?showSignPage=false'
      // url:'/pages/sign/inviteFriends/memberFriendsReward'
      // url:'/pages/mine/addMemberCard/addMemberCard'
      // url: "/pages/shouye/detail/detail?" + "shop_code=hIAT2021838252"
      // url:"/pages/mine/Complaint/Complaint?path=pages/shouye/shouye"
      // url:"/pages/mine/AppMessage/AppMessage"
      // url:'/pages/mine/addMemberCard/memberDiscription'
    })
  },

  //搜索
  searchClickEvent: function() {
    console.log('商品搜索');
    wx.navigateTo({
      url: '../shopType/shopSearch/shopSearch',
    })
  },
  //赚钱页
  moneytap: function() {
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
  wxSerchFocus: function() {
    wx.navigateTo({
      url: '../shopType/shopSearch/shopSearch',
    })
  },
  searchInputEvent: function() {

  },
  //重新处理数据
  newshoplist: function(obj) {
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
  http_Landingpage2: function() {
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
      var url = config.Host + 'cfg/getCurrWxcxType?token=' + token + config.Version;
      util.http(url, this.Landingpage2);
    }
  },

  Landingpage2: function(data) {
    if (data.status == 1) {
      var shouyecount = data.data;

      if (shouyecount == 0) {
        this.setData({
          isShowMakeMoney: false
        });
      } else
        this.setData({
          isShowMakeMoney: true
        });
      app.globalData.user["shouyecount"] = shouyecount;
      isautoSign = false;
    }
  },

  onShow: function (option) { //在onShow中处理新衣节弹窗

    var that = this;
    try {
      isCrazyMon = wx.getStorageSync("HASMOD")
    } catch (e) {}
    
    that.http_Landingpage2();
    that.xuanfu_image();
    app.moneyPageisHide(function (data) {


      if (app.globalData.user && app.globalData.user.userToken) {
        that.setData({
          isLoginSuccess: true
        })
      } else {
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
    this.setData({
      suspensionHongBao_isShow:true
    })
    this.xuanfuHongBaoAnimation();
    util.httpUpyunJson(this.shareData)

    //新衣节弹窗自动弹出，每天只弹一次
    var time = wx.getStorageSync("XINYIJIEZIDONGTANCHU");
    if (util.isToday(time) != "当天" && isCrazyMon) {
      that.setData({
        showNewYI: true
      })
      wx.setStorageSync("XINYIJIEZIDONGTANCHU", new Date().getTime())
    } else { //红包弹框
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

    //如果是分享回来直接跳转到首页3
    if (is_goShare) {
      wx.navigateTo({
        url: 'redHongBao?shouYePage=ThreePage&coupon=' + coupon,
      })
      is_goShare = false;
    }

    //获取是否有拼团失败的订单
    if (!that.data.upperGoYiFuShow && !that.data.openFightSuccessShow && !that.data.hasJYJLdialog)
    {
      util.getFightFailOrder(that.discountData);
    }

    //弹出红包弹框
    if (!firstCommint && that.data.homePage3ElasticFrame > 0)
    {
      if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
        return;
      }
      showHongBao.getShowHongbao(that, function (is_show) {
        if (is_show) {
          if (app.globalData.channel_type == 1) {
            wx.navigateTo({
              url: '../sign/sign',
            })
          } else {
            that.setData({
              upperGoYiFuShow: true
            })
          }
        }
      });
    }
    firstCommint = false;

    util.get_vip_tofreelingPage2();//有79元免费领未领取自动跳转免费领列表页2
    
    //大促销已结束
    var showendofpromotionDialog ;
    if(app.globalData.user != null)
    {
      showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
    }else{
      showendofpromotionDialog = app.globalData.channel_type == 1 ? false : true;
    }
    that.setData({
      showendofpromotionDialog: showendofpromotionDialog
    })

    //大促引导过来的
    if(app.globalData.user != null && app.globalData.user.userToken != undefined)
    {
      var come_from = wx.getStorageSync('comefrom')
      if (come_from == 'showendofpromotionDialog_free') {
        this.showToast('90元无门槛券已到账，祝您购物愉快', 4000);
        wx.setStorageSync('comefrom', '')
      } else if (come_from == 'showendofpromotionDialog_vip') {
        this.showToast('恭喜成为VIP会员，祝您购物愉快。', 4000);
        wx.setStorageSync('comefrom', '')
      } else if (come_from == 'showendofpromotionDialog') {
        this.showToast('90元下单立减金已到账，祝您购物愉快', 4000);
        wx.setStorageSync('comefrom', '')
      }
    }

    //不登录且不是渠道过来的弹此框
    if (app.globalData.user != null) {
      this.setData({
        upperGoYiFuShow_unlogin: false
      })
    }
    
  },
  xuanfu_image: function() {
    var that = this;
    //悬浮小图标
    util.get_userOrderRoll48Hours(function (userOrderRoll48Hours){
      if (userOrderRoll48Hours == 1)
      {
        that.setData({
          SmallRedHongBao: config.Upyun + 'small-iconImages/heboImg/small-madjobRedHongBao.png',
        })
      }else{
        // util.get_TrancactionRecord(function (Transaction_record) {
        //   if (Transaction_record) //有交易记录
        //   {
        //     that.setData({
        //       SmallRedHongBao: config.Upyun + 'small-iconImages/heboImg/small-fiftyRedHongBao.png',
        //     })
        //   } else { //没有交易记录
        //     that.setData({
        //       SmallRedHongBao: config.Upyun + 'small-iconImages/heboImg/freeling_newsamll.png',
        //     })
        //   }
        // });

        //获取是否是会员
        util.get_vip(function (data) {
          var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
          var smallImage = isVip == 0 ? "smallRedHongbao_nintymoney.png" :"smallRedHongbao_hundredmoney.png";
          that.setData({
            SmallRedHongBao: config.Upyun + 'small-iconImages/heboImg/' + smallImage,
          })
        })
      }

    })
  },
  //商品详情
  first_list_tap: function(event) {
    var shopcode = event.currentTarget.dataset.shop_code;
    var url = '';
    if (this.data.curTabId == 'news') //时尚
    {
      url = '../shouye/detail/detail?' + "shop_code=" + shopcode + '&unvip_roll_code=' + this.data.roll_code;
      if (app.globalData.oneYuanData != 0) //活动商品
      {
        url = '../shouye/detail/detail?' + "shop_code=" + shopcode + "&isActiveShop=" + isActiveShop
      }
    } else {
      url = '../shouye/detail/detail?' + "shop_code=" + shopcode + "&shop_type=2"
    }
    wx.navigateTo({
      url: url + '&homePage3ElasticFrame=' + this.data.homePage3ElasticFrame,
    })
  },
  //新衣节关闭按钮
  newYiCloseTap: function() {
    this.setData({
      showNewYI: false
    })
  },
  //新衣节弹窗-获取抽奖机会点击
  newYIgoTap: function() {
    wx.navigateTo({
      url: '../sign/newYiListPage/newYiListPage',
    })
  },
  //新衣节弹窗活动详情点击
  newYIxiangqingTap: function() {

    this.setData({
      showNewYI: false
    })
    wx.navigateTo({
      url: '../sign/newYiHDXQ/newYiHDXQ',
    })
  },

  //红包弹窗点击
  redtap: function() {
    this.setData({
      isRedShow: false
    })
    wx.navigateTo({
      url: '../sign/sign',
    })
  },

  //拼团成功弹窗--立即去提现
  getFight: function() {

    wx.navigateTo({
      url: '../mine/order/order?indexid=' + 2,
    })
    this.setData({
      openFightSuccessShow: false
    })
  },
  closeFight: function() {
    this.setData({
      openFightSuccessShow: false
    })
  },

  //拼团失败退款弹窗
  discountData: function(data) {
    var that = this;
    if (data.status == 1 && data.isFail == 1) {

      var cutdowntime = 30 * 60 * 1000;
      fightUtil.countdown(that, fightUtil, cutdowntime, function (data) {
        that.setData({
          is_fresh:true,
          time: data
        })
      })
      that.setData({
        guidefightCouponShow: true
      })
    } 

    if (!shareBackheadpic && !that.data.guidefightCouponShow) {
      that.getNewUserOrder(false)
    }
  },
  //关闭免拼卡弹框
  closeFreeFightCoupon: function () {
    this.setData({
      guidefightCouponShow: false
    })
  },
  //去购买免拼卡
  freeFightcouponTap: function () {
    this.setData({
      guidefightCouponShow: false
    })
    
    //查询是否有虚拟抽奖
    util.newuser_luckdraw_query(function (data) {
      if (data.status == 1) {
        if (data.data.is_finish == 1) {//虚拟抽奖
          wx.navigateTo({
            url: '/pages/sign/sign?comefrom=' + 'freeFight_style'
          })
        } else {
          wx.navigateTo({
            url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=freeFight'
          })
        }
      }
    })
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
      url: '../mine/wallet/wallet',
    })
    this.setData({
      moneyDiscountShowFlag: false
    })
    
  },
  //资金明细
  zijingmingxiBtn:function(){
    wx.navigateTo({
      url: '../mine/wallet/accountDetail/accountDetail?activityIndex=3',
    })
    this.setData({
      openFightSuccessShow: false
    })
  },
  //成为会员
  becomeMenberBtn:function(){
    wx.navigateTo({
      url: '../mine/addMemberCard/addMemberCard'
    })
    this.setData({
      openFightSuccessShow: false
    })
  },
  //立即去提现
  closeTixianBtn:function(){
    wx.navigateTo({
      url: '/pages/sign/inviteFriends/memberFriendsReward',
    })
    this.setData({
      moneyDiscountShowFlag: false,
      openFightSuccessShow: false,
      upperGoYiFuShow: false,
      hasJYJLdialog: false
    })
  },
  colseTips:function(){
    this.setData({
      contactkefuShow:false
    })
  },
  contactkefu:function(){
    this.setData({
      contactkefuShow: false
    })
  },
  closeYiDouBtn: function() {
    this.setData({
      moneyDiscountShowFlag: false,
      openFightSuccessShow:false,
      upperGoYiFuShow:false,
      hasJYJLdialog:false
    })
  },

  //滑动开始事件
  handletouchtart: function(event) {
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY
  },

  //滑动移动事件
  handletouchmove: function(event) {

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

  //红包相关
  closeNewThirty: function() {
    var that = this;
   
    if (that.data.upperGoYiFuShow) {
      that.setData({
        upperGoYiFuShow: false
      })
      showHongBao.loopShowHongbao(that, showHongBao, function (is_show) {
        if (is_show) {
          if (app.globalData.channel_type == 1) {
            wx.navigateTo({
              url: '../sign/sign',
            })
          } else {
            that.setData({
              upperGoYiFuShow: true
            })
          }
        }
      })
    }

    that.setData({
      hasJYJLdialog: false,
      upperGoYiFuShow:false,
      upperGoYiFuShow_task: false,
      upperGoYiFuShow_tixian: false,
      NewUserShareBackRedPackage: false,
      upperMemberYiFuShow: false,
      upperGoYiFuShow_unlogin:false,
    })
    // clearInterval(animationTimer);
  },

  goNewHomePage: function() {
    wx.navigateTo({
      url: 'redHongBao?shouYePage=ThreePage',
    })
    this.setData({
      showNewThirtyDialog: false,
      upperGoYiFuShow: false

    })
    clearInterval(animationTimer);
  },

  //红包点领
  redHongClick:function(){

    wx.navigateTo({
      url: '/pages/sign/sign',
    })

    // if (app.homePagetoSign == true){
    //   this.showToast('90元红包已放入账户，祝您购物愉快。', 5000);
    // }
  },
  
  //30-50元红包点存入我的帐户
  xianjinRedsubmit: function(e) {
    formId = e.detail.formId;
    if (formId && app.globalData.user != null) {
      util.httpPushFormId(formId);
    }

    if (this.data.upperGoYiFuShow) {

      if (app.globalData.channel_type == 1)//渠道进入
      {
        this.setData({
          upperGoYiFuShow: false
        })
      }else{
        if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
          this.setData({
            upperGoYiFuShow: false
          })
        }
      }
      showHongBao.clickHongbao(this, function (is_show) { })
    }
    else if(this.data.upperGoYiFuShow_task)
    {
      this.setData({
        upperGoYiFuShow_task: false,
      })
      showHongBao.clickHongbao(this, function (is_show) { })
    } else if (this.data.upperGoYiFuShow_tixian)
    {
      this.setData({
        upperGoYiFuShow_tixian: false
      })
      wx.navigateTo({
        url: '/pages/sign/sign'
      })
    }
    
    //统计用户点领的次数
    app.mtj.trackEvent('get_red_envelope', {
      user_id: app.globalData.user_id ? app.globalData.user_id : '',
    });
    // clearInterval(animationTimer);
  },
  
  //用户首次疯抢完且未有单独购买成交订单
  memberSubmit:function(e){
    formId = e.detail.formId;
    if (formId && app.globalData.user != null) {
      util.httpPushFormId(formId);
    }
    this.setData({
      upperMemberYiFuShow: false,
    })
    wx.navigateTo({
      url: "/pages/shouye/redHongBao?shouYePage=" + "FourPage"
    })
  },
  loginsubmit: function(e) {
    is_goShare = true;

    if (shareBackheadpic) {
      if (this.data.jl_openType != "share") {
        is_goShare = false
      }
    }

    this.setData({
      NewThirtyDialogHide: true
    })

    formId = e.detail.formId;
    if (formId && app.globalData.user != null) {
      util.httpPushFormId(formId);
    }
    if (shareBackheadpic) {
      // this.getNewUserOrder(is_newShouquan);
    } else {

      if (!is_newShouquan && !is_Transaction) //不是重新授权且没有交易记录
      {
        this.setData({
          // getHongBaoSuccessShow: true
        })
      } else {
        this.getNewUserOrder(is_newShouquan);
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
            util.get_vip_tofreelingPage2();
            that.oneYuan_httpData();
            that.xuanfu_image();
            
            wx.hideLoading();

            if (isxuanfu == 'xuanfu')
            {
              that.redHongClick();
            }else if(isxuanfu == 'sign'){
              wx.navigateTo({
                url: '/pages/sign/sign',
              })
            }else{
              is_newShouquan = true;

              if (that.data.upperGoYiFuShow_unlogin) {
          
                var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
                that.setData({
                  upperGoYiFuShow_unlogin: false,
                  showendofpromotionDialog: showendofpromotionDialog
                })
                if (that.data.showendofpromotionDialog) {
                  if (app.globalData.user != null && app.globalData.user.userToken != undefined)
                  {
                    that.showToast('90元下单立减金已到账，祝您购物愉快', 4000);
                  }
                }else{
                  that.redHongClick();
                }
              } else if (that.data.upperGoYiFuShow){
                that.setData({
                  upperGoYiFuShow: false,
                })
                that.redHongClick();
              }
            }
            
            
          });
        }
      },
      fail: function () {

      }
    })
  },

  getNewUserOrder: function(newShouquan) {

    if (getNewUserOrder_END || app.showThirtyEd) {
      return
    }

    //newShouquan新授权
    var that = this;

    if (app.globalData.user != null) {
      var token = app.globalData.user.userToken;
      var dataUrl = config.Host + "order/getNewUserOrder" +
        "?token=" + token +
        config.Version;

      util.http(dataUrl, function(data) {
        getNewUserOrder_END = true
        coupon = data.coupon;
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXdata=" + data + newShouquan);
        var nRaffle_Money = data.nRaffle_Money;
        that.setData({
          nRaffle_Money: nRaffle_Money
        })
        if (data.count != 0) { //有交易记录---是否是授权过来的做区分
          is_Transaction = true;
          if (newShouquan) { //新授权
            that.setData({
              // makeMoneyHongBaoSuccessShow: true
            })
          } else { //之前授权过

            if (shareBackheadpic) {
              that.setData({
                // makeMoneyHongBaoSuccessShow: true
              })
            } else {
              if (!app.WUSHIredPackageShow && !that.data.guidefightCouponShow) {

                util.get_userOrderRoll48Hours(function (userOrderRoll48Hours){
                  //用户首次疯抢完且未有单独购买成交订单48小时内访问小程序弹框
                  if (userOrderRoll48Hours == 1)
                  {
                    that.setData({
                      upperMemberYiFuShow: true,
                    })
                  }else{
                    
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
                        if (app.globalData.channel_type == 1) {
                          wx.navigateTo({
                            url: '../sign/sign',
                          })
                        } else {
                          that.setData({
                            upperGoYiFuShow: true
                          })
                        }

                        app.showThirtyEd = true
                      } else {
                        that.setData({
                          hasJYJLdialog: true,
                        })
                      }
                    })
                    
                    app.WUSHIredPackageShow = true
                  }
                })
                
              }
            }
          }
        } else { //没有交易记录 ----分享完，分享完成后领取8元优惠券-然后去首页4      
          is_Transaction = false;
          if (newShouquan) {
            that.setData({
              coupon: coupon,
              // getHongBaoSuccessShow: true
            })
          } else {

            if (shareBackheadpic) {
              that.setData({
                // getHongBaoSuccessShow: true
              })
            } else {
              if (!app.showThirtyEd && !that.data.guidefightCouponShow) {

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
                    if (app.globalData.channel_type == 1) {
                      wx.navigateTo({
                        url: '../sign/sign',
                      })
                    } else {
                      that.setData({
                        upperGoYiFuShow: true
                      })
                    }
                    app.showThirtyEd = true
                  } else {
                    that.setData({
                      hasJYJLdialog: true,
                    })
                  }
                })
              }
            }


          }
        }

        if (shareBackheadpic) {
          if (!app.JieliHongbaoShowEd) {
            that.setData({

              jl_openType: (data.status == 1) ? "" : "share",
              jl_bindtap: (data.status == 1) ? "jl_goSign" : "",
              NewUserShareBackRedPackage_bg: config.Upyun + "small-iconImages/qingfengpic/newuser_share_back_new2.png!450",
              newUserredPacageShow: true
            })
            app.JieliHongbaoShowEd = true
          }
        }

      })

    }

  },
  jl_goSign: function() {
    this.setData({
      newUserredPacageShow: false
    })
    wx.navigateTo({
      url: '/pages/sign/sign',
    })
  },

  //50元任务弹窗
  makeMoneysubmit: function(e) {
    formId = e.detail.formId;
    util.httpPushFormId(formId);

    this.setData({
      // makeMoneyHongBaoSuccessShow: false
    })

    wx.navigateTo({
      url: '/pages/sign/sign',
    })
  },

  //分享弹窗
  sharesubmit: function(e) {
    is_goShare = true;

    formId = e.detail.formId;
    util.httpPushFormId(formId);

    this.setData({
      // getHongBaoSuccessShow: false
    })
  },
  //关闭分享弹窗
  closeShare: function() {
    this.setData({
      // getHongBaoSuccessShow: false,
      // makeMoneyHongBaoSuccessShow: false
    })
  },
  //关闭领到30元红包弹窗
  closeThirtyHongBao: function() {
    this.setData({
      // getHongBaoSuccessShow: false
    })
    //点存入我的帐户是分享不用跳转
    wx.navigateTo({
      url: 'redHongBao?shouYePage=ThreePage&coupon=' + coupon,
    })
  },

  /**
   * 分享数据
   */
  shareData: function (data) {
    var shareTitle = data.wxcx_share_links.title ? data.wxcx_share_links.title :"我刚领的红包也分你一个，帮我提现就能拿钱哦~";
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
  onShareAppMessage: function() {

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
        success: function(res) {
          
        },
        fail: function(res) {
          
        }
      }
    } else {

      // var headpic = "https://www.measures.wang/userinfo/head_pic/default.jpg";
      var headpic = config.Upyun + "small-iconImages/ad_pic/gerenzhongxin_morentouxiang_bg.png"

      return {
        title: this.data.shareTitle,
        path: path,
        imageUrl: this.data.shareImageUrl,
        success: function(res) {
          
        },
        fail: function(res) {
          
        }
      }
    }


  },
  //发新人优惠券
  getNewUserEight: function(token) {

    // var that = this;
    // var dataUrl = config.Host + "coupon/giveNewCoupon" +
    //   "?token=" + token +
    //   "&" + config.Version;


    // util.http(dataUrl, function(data) {
    //   if (data.status == 1) {
    //     //111111111111111111111
    wx.navigateTo({
      url: 'redHongBao?shouYePage=ThreePage&coupon=' + coupon,
    })
    //   }
    // });



  },
  closeRedPackageShareBack: function() {
    this.setData({
      newUserredPacageShow: false
    })
  },

  //50元任务红包点领
  hasJYJLsubmit: function(e) {
    formId = e.detail.formId;
    if (formId && app.globalData.user != null) {
      util.httpPushFormId(formId);
    }
  },
  hasJYJLtoSign: function() {
    wx.navigateTo({
      url: '../sign/sign',
    })
    this.setData({
      hasJYJLdialog: false
    })
    clearInterval(animationTimer);
  },

  //任务红包
  signHongBaosubmit: function(e) {
    formId = e.detail.formId;
    if (app.globalData.user != null) {
      util.httpPushFormId(e.detail.formId);
    }

    if(app.globalData.channel_type == 1)//渠道进入
    {
      wx.navigateTo({
        url: '../sign/sign',
      })
    }else{
      if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
        util.get_userOrderRoll48Hours(function (userOrderRoll48Hours) {
          if (userOrderRoll48Hours == 1) {
            wx.navigateTo({
              url: 'redHongBao?shouYePage=FourPage',
            })
          } else {

            wx.navigateTo({
              url: '../sign/sign',
            })
          }
        })
      }
    }
  },

  shareLoginSetting: function() {

    var that = this;
    //查看用户是否授权 未授权弹授权提示弹窗
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) { //授权过


          if (!app.globalData.user) { //拿不到用户信息-去登录
            //登录成功回调
            app.New_userlogin(function() {

              app.queryJY(function(noJY) { //noJY:没有交易记录
                if (noJY) {
                  // wx.navigateTo({
                  //   url: '/pages/shouye/redHongBao?shouYePage=ThreePage',
                  // })
                }
              })
            });
          } else { //拿了到用户信息-去查询
            app.queryJY(function(noJY) { //noJY:没有交易记录
              if (noJY) {
                // wx.navigateTo({
                //   url: '/pages/shouye/redHongBao?shouYePage=ThreePage',
                // })
              }
            })
          }

        } else { //未授权
          // wx.navigateTo({
          //   url: '/pages/shouye/redHongBao?shouYePage=ThreePage',
          // })
        }
      }
    })
  },

  //自动登录
  globalLogin: function () {
    var that = this;
    util.autoLogin(loginCount, function (loginfailYiFuShow, login_discribution, login_buttontitle, newloginCount) {
      loginCount = newloginCount;
      if (loginCount == 1)//登录成功
      {
        var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
        that.setData({
          showendofpromotionDialog: showendofpromotionDialog,
          isLoginSuccess:true
        })

        util.get_vip_tofreelingPage2();
        that.http_Landingpage2();
        that.xuanfu_image();
        if (!that.data.showNewYI && !that.data.isRedShow) {
          if (app.globalData.user != null) {
            that.oneYuan_httpData();
            that.getRawardMoneyStatus();

            // that.getOrderStatus();
            // that.http_query_new8();
          }
        }
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
 
  footerTap: app.footerTap
})