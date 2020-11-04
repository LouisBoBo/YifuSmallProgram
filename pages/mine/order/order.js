import config from '../../../config.js';
var util = require('../../../utils/util.js');
var WxNotificationCenter = require("../../../utils/WxNotificationCenter.js");
import ToastPannel from '../../../common/toastTest/toastTest.js';
var fightUtil = require('../../../utils/freeFightCutdown.js');

var app = getApp();
var orderItem;

var chouJiangUrl;
var formId;
var fistChoujiangBack = false;

var firstChoujiang = true;
var is_goTiXianDetail = false;
var is_backFresh = false;
//96小时-机器人拼团成功专用
var ptSuccessOrder_code = "111"
var ptSuccesRoll_code = "111"
var loginCount;

var clickWhether_prize; //当前点击的中奖

var clickStatus; //当前点击的订单状态

var servicewxh //客服微信号

var zhouJiangMZclick = false; //引导用户抽去APP抽奖的蒙层是否点击过

var isClickVip = 0 //点击申请发货时是否是Vip

var vipMaxType = 0; //用户最高的vip等级


var nRaffle_status = 0;//抽奖发生了变化（1时）

var isNewUserFirstOrder = false;

var vip_roll_type;//发货需要的会员卡

var xuanfuanimationTimer;
//shop_from 商品来源.0,普通商品.1,0元购.2会员商品,3活动商品4夺宝5新的活动商品 6.1分钱夺宝 7新拼团,8额度夺宝,9拼团夺宝,10.再来一单  11.拼团一元购 12.特价广告商品13.会员免费领
Page({

  /**
  //  * 页面的初始数据//////////
   */
  data: {
    currentTab: 0,
    currentpage: 1,
    isConfirm: false,
    upyconfig: config.Upyun,
    Upyun: config.Upyun,
    isorderdetail: 'false',
    openYifuDialogShow: false,
    moneyDiscountShowFlag: false,
    openRefundFailShow: false,
    moneyDiscount: 0,
    discountitem: "",
    oneYuanDiscriptionTitle: '疯抢退款说明',
    oneyuanValue: 1,
    shareTitle: "",
    orderList: [],
    titlelist: ["全部", "待付款", "待发货", "待收货", "待评价"],
    fightSuccess_fail_isShow: false,
    openFightSuccessShow: false,
    ptSuccessUserName: '',
    upperMemberYiFuShow: false,
    showFirstChoujiangBackDialog: false,
    guidedeliverCouponShow:false,
    guidedeliverCouponImg: '2',//1申请发货 2未抽中
    delivery_time:'',//发货时间
    opendeliveryCardShow:false,//完成任务赠送发货卡
    is_deliver:true,
    is_click_orders:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    new app.ToastPannel();
    var index = options.indexid;
    isNewUserFirstOrder = options.isNewUserFirstOrder;
    loginCount = 0;
    this.setData({
      currentTab: index,
      currentpage: 1,
    })

    zhouJiangMZclick = false
    // this.setData({
    //   sqFHshow: true

    // })

    var first_shopdata = wx.getStorageSync("first_shopdata");
    if (first_shopdata && isNewUserFirstOrder) {
      this.setData({
        fromShopData: first_shopdata,
        showLXKF: true
      })

      wx.setStorageSync("first_shopdata", "")
      // isNewUserFirstOrder = false;
    }




    // if (!is_backFresh) //当是抽奖界面返回时不需要重新请求列表
    // {
    //   this.getOrderList();
    // }

    this.setData({
      oneyuanValue: app.globalData.oneYuanValue,
      // oneYuanDiscriptionTitle: app.globalData.oneYuanValue + '元购返还说明',
    });

    if (options.FightSuccess) {
      this.setData({
        FightSuccess: options.FightSuccess
      })
    }

    //清除点击的订单
    var click_orders = wx.getStorageSync('click_orders')
    for (var i = 0; i < click_orders.length; i++) {
      var click_order_code = click_orders[i];
      wx.setStorageSync(click_order_code, '')
    }

    WxNotificationCenter.addNotification("testNotificationAuthorizationName", this.testNotificationFromItem1Fn, this);

  },
  onUnload: function() {
    if (this.data.FightSuccess) {
      //获取用户是否是第一次疯抢
      util.getOrderStatus(function(data) {
        if (data.rollCount == 1) {
          wx.navigateTo({
            url: "/pages/shouye/redHongBao?shouYePage=" + "FourPage"
          })
        }
      })

      wx.setStorageSync("FightSuccess", true)
      this.setData({
        FightSuccess: false
      })
    }
  },

  onShow: function() {
    var fightSuccess = wx.getStorageSync('FightSuccess');
    //当是退款详情回来的弹拼单成功提示用户去提现的弹窗
    if (is_goTiXianDetail == true || fightSuccess == true) {
      this.getcoupon_http();
    }

    if (is_backFresh) //当是抽奖界面返回时需要刷新列表
    {
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      }

      this.setData({
        currentTab: 0,
        currentpage: 1,
      })

      this.getOrderList();
      is_backFresh = false;

      var that = this;
      //第二次抽完奖退出来弹会员框
      // util.get_LuckDraw(function(luckDraw) {
      //   if (luckDraw == true && !this.data.fightSuccess_fail_isShow && !this.data.showFirstChoujiangBackDialog) {
      //     that.setData({
      //       upperMemberYiFuShow: true
      //     })
      //   }
      // })
    }else{
      this.setData({
        currentpage: 1,
      })
      this.getOrderList();
    }
    
    this.loginSetting();

    //发货卡购买成功后返回弹发货卡张数的弹框
    var kdeliverSuccessBack = wx.getStorageSync('KdeliverSuccessBack')
    if (kdeliverSuccessBack == '1') {
      var that = this;
      var currentItem = that.data.orderList[0];
      var order_code = currentItem.order_code;
      util.get_daojuNumber(order_code,function (data) {
        var send_num = data.deliveryCardNum;
        var isDeliver = data.isDeliver;
        var picdatas = [];
        for (var j = 0; j < 3; j++) {
          if (send_num > j) {
            picdatas.push(config.Upyun + 'small-iconImages/heboImg/free_deliver.png')
          } else {
            picdatas.push(config.Upyun + 'small-iconImages/heboImg/luck_invitButton.png')
          }
        }
        if (isDeliver == 1 || send_num == 0) {
          that.setData({
            guidedeliverCouponShow: false
          })
        } else {
          that.setData({
            send_num: send_num,
            cardslist: picdatas,
            guidedeliverCouponShow: true
          })
        }
      })
      
      wx.setStorageSync('KdeliverSuccessBack', '');
    }

    //免拼卡购买成功后返回弹免拼卡张数的弹框
    var kfreeSuccessBack = wx.getStorageSync('KfreeSuccessBack')
    if (kfreeSuccessBack == '1') {
      var that = this;
      var currentItem = that.data.orderList[0];
      var order_code = currentItem.order_code;
      util.get_daojuNumber(order_code,function (data) {
        var free_num = data.freeCardNum;
        var isDeliver = data.isDeliver;
        var picdatas = [];
        for (var j = 0; j < 3; j++) {
          if (free_num > j) {
            picdatas.push(config.Upyun + 'small-iconImages/heboImg/free_fight.png')
          } else {
            picdatas.push(config.Upyun + 'small-iconImages/heboImg/luck_invitButton.png')
          }
        }
        if (isDeliver == 1 || free_num == 0) {
          that.setData({
            guideFightDeliverShow: false
          })
        } else {
          that.setData({
            free_num: free_num,
            cardslist: picdatas,
            guideFightDeliverShow: true
          })
        }
      })

      wx.setStorageSync('KfreeSuccessBack', '');
    }

    //购买会员卡后引导买会员卡的弹框关闭
    var kvipCardSuccessBack = wx.getStorageSync('vipCardPaySuccess')
    if (kvipCardSuccessBack == '1' && this.data.guidedeliverCouponShow){
      this.setData({
        guidedeliverCouponShow:false
      })
      wx.setStorageSync('vipCardPaySuccess', '');
    }

    if (this.data.isgotoMemberFromdeliver) {
      this.setData({
        isgotoMemberFromdeliver: false
      })
      //只要有免拼卡、发货卡不弹此框
      // if (this.data.send_num < 1 && this.data.free_num < 1 && !this.data.guidedeliverCouponShow) {
      //   var opendeliveryCardShow = (this.data.isVip > 0 && this.data.isVip != 3) || (this.data.isVip == 3 && vipMaxType == 4) ? false : true;
      //   this.setData({
      //     opendeliveryCardShow: opendeliveryCardShow,
      //   })
      // }
    }

    var that = this;
    //获取是否是会员
    util.get_vip(function (data) {
      var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
      var smallImage = isVip == 0 ? "smallRedHongbao_nintymoney.png" : "smallRedHongbao_hundredmoney.png";

      that.setData({
        SmallRedHongBao: config.Upyun + 'small-iconImages/heboImg/' + smallImage,
      })
      
      //如果是大促不展示
      if (app.globalData.user.showSpecialPage == 1) {
        that.setData({
          suspensionHongBao_isShow: true
        })
        that.xuanfuHongBaoAnimation();
      }
    })
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
  //任务红包
  signHongBaosubmit: function (e) {
    
    if (app.globalData.channel_type == 1) {
      wx.navigateTo({
        url: '../../sign/sign',
      })
    } else {
      if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
        wx.navigateTo({
          url: '../../sign/sign',
        })
      }
    }
  },

  testNotificationFromItem1Fn: function(info) {
    var that = this;
    // that.setData({
    //   currentTab: 0,
    //   currentpage: 1
    // })
    // that.getOrderList();
    that.globalLogin();
  },

  //获取优惠券
  getcoupon_http: function() {
    var that = this;
    var oldurl = config.Host + '/coupon/getRollCoupon?' + config.Version;
    util.http(oldurl, that.coupon_data);
  },
  coupon_data: function(data) {
    var coupon = "6";
    if (data.status == 1) {
      coupon = data.price > 0 ? (data.price * 1).toFixed(0) : coupon;
      this.getFightOrderStatus();
    }
    this.setData({
      coupon: coupon,
    })
  },
  //获取用户是否有拼团成功的订单
  getFightOrderStatus: function() {
    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var oldurl = config.Host + 'order/getOrderStatus?' + config.Version + "&token=" + token;
    util.http(oldurl, that.fightOrder_data);
  },
  fightOrder_data: function(data) {

    var that = this;
    //首次拼团疯抢才弹此框
    if (data.status == 1 && data.rollCount == 1) {
      var time = wx.getStorageSync("FightPopTime");
      var currentTime = util.isToday(time);
      //当是第二天清零弹出次数
      if (currentTime == '以前的日期') {
        wx.setStorageSync("popCount", '');
      }

      var popcount = wx.getStorageSync("popCount");
      if (currentTime != '当天' || popcount < 11) {

        that.setData({
          fightSuccess_fail_isShow: false,
        })

        //弹过后清除条件
        is_goTiXianDetail = false;
        wx.setStorageSync('FightSuccess', false);

        var NowTime = new Date().getTime();
        wx.setStorageSync("FightPopTime", NowTime);
        wx.setStorageSync("popCount", popcount + 1);

      }
    }
  },

  getOrderListData: function() {

    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var url = config.Host + 'order/getBuyOrder?token=' + token + config.Version + '&status=' + this.data.currentTab + '&page=' + this.data.currentpage + '&order=desc';

    console.log(url);

    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    util.http(url, this.httpOrderdata);
  },



  //订单列表数据
  getOrderList: function() {
    var that = this;
    // //先查用户vip情况
    // util.get_vip(function(data) {
    //   vipMaxType = data.maxType;
      that.getOrderListData()

    // })





  },
  httpOrderdata: function(data) {
    wx.hideLoading()
    wx.stopPullDownRefresh();
    if (this.data.currentpage == 1) {
      this.data.orderList = [];
      vipMaxType = data.maxType;
      nRaffle_status = data.nRaffle_status;
      if (!nRaffle_status){
        nRaffle_status = 0;
      }
      // nRaffle_status = 1;//测试
      this.setData({
        clockIn: data.clockIn,
        isVip:data.isVip,
        vipMaxType: data.maxType
      });

    }
    if (data.status == 1) {
      var page = this.data.currentpage + 1;
      var send_num = data.send_num;
      var free_num = data.free_num;
      var datalist = data.orders;

      if (data.dayEndTime >0)
      {
        this.setData({
          dayEndTime: data.dayEndTime//免费领订单刷新时间
        })
      }
      
      this.setData({
        current_date: data.current_date,//任务日期
        now: data.now,//当前时间
        send_num: send_num,
        free_num: free_num,
      })

      var pageData = this.data.orderList;
      for (var j = 0; j < datalist.length; j++) {
        pageData.push(datalist[j]);
      }
      var orderlist = [];
      for (var i = 0; i < pageData.length; i++) {
        //订单状态
        var shop_from = pageData[i].shop_from;
        var last_time = pageData[i].last_time;
        var issue_status = pageData[i].issue_status;
        var orderstaus = pageData[i].status;
        var whether_prize = pageData[i].whether_prize;

        var change = pageData[i].change;
        var item = pageData[i];
        var orderstatus = "";
        var ordershopstatus = "";
        var shop_pic = "";
        var shopcode = "";
        var newshopname = "";
        var pay_money = "";
        var shop_price = "";
        // var shop_from = "";
        var orderButtonStatus = [];
        if (pageData[i].orderShops.length > 0) {
          ordershopstatus = pageData[i].orderShops[0].status;
        }
        if (shop_from == 4 || shop_from == 6) { //夺宝订单
          orderstatus = this.getIndianaStatus(last_time, issue_status);
          orderButtonStatus = this.getButtonStatusFromOrderStatus(orderstaus, item);
          shop_pic = pageData[i].order_pic;
          shopcode = pageData[i].bak;
          newshopname = pageData[i].order_name;

          if (shop_pic != null) {
            //商品图片
            var newcode = shopcode.substr(1, 3);
            var new_pic = newcode + '/' + shopcode + '/' + shop_pic;

            //商品名称
            if (newshopname.length > 9) {
              newshopname = newshopname.substr(0, 9) + '... ';
            }
            pageData[i]["new_shop_pic"] = new_pic;
            pageData[i]["new_shopname"] = newshopname;
          }

        } else { //其他商品订单
          orderstatus = this.getOrderStatus(item,orderstaus, ordershopstatus, change, shop_from, whether_prize, pageData[i].new_free);
          orderButtonStatus = this.getButtonStatusFromOrderStatus(orderstaus, item, shop_from);
          var orderShops = pageData[i].orderShops;
          for (var j = 0; j < orderShops.length; j++) {
            shop_pic = pageData[i].orderShops[j].shop_pic;
            shopcode = pageData[i].orderShops[j].shop_code;
            shop_price = pageData[i].orderShops[j].shop_price;
            newshopname = pageData[i].orderShops[j].shop_name;
            pay_money = pageData[i].pay_money;
            shop_from = pageData[i].shop_from;

            // if (pageData[i].orderShops[j].original_price){
            //   shop_price = pageData[i].orderShops[j].original_price

            // }


            pageData[i].orderShops[j].shop_price = (shop_price * 1).toFixed(1);
            if (shop_pic != null) {
              //商品图片
              var newcode = shopcode.substr(1, 3);
              var new_pic = newcode + '/' + shopcode + '/' + shop_pic;

              //商品名称
              if (newshopname.length > 9) {
                newshopname = newshopname.substr(0, 9) + '... ';
              }
              pageData[i].orderShops[j]["new_shop_pic"] = new_pic;
              pageData[i].orderShops[j]["new_shopname"] = newshopname;
            }
          }
        }
        pageData[i]["orderstatus"] = orderstatus;
        pageData[i]["orderButtonStatus"] = orderButtonStatus;
        pageData[i]["send_num"] = send_num;
        orderlist.push(pageData[i]);
      }
      var vipMaxVipName = "钻石会员"
      if (vipMaxType == 4) {
        vipMaxVipName = "钻石会员"
      } else if (vipMaxType == 5) {
        vipMaxVipName = "皇冠会员"
      }

      this.setData({
        vipMaxVipName: vipMaxVipName,
        orderList: orderlist,
        currentpage: page,
        orderstatus: orderstatus != undefined ? orderstatus : '',
      })

      var FightSuccess = wx.getStorageSync('FightSuccess');
      //如果拼单成功提示用户去提现弹窗出现 此弹窗不弹
      if (this.fistChoujiangBack && FightSuccess != true) {
        this.setData({
          showFirstChoujiangBackDialog: true
        })

        this.fistChoujiangBack = false
      }

      //如果是免费领订单过来的 且不是新手任务第一天弹此框
      // if (isNewUserFirstOrder && this.data.current_date != 'newbie01')
      //免费领未抽中从转盘过来的
      if (isNewUserFirstOrder) 
      {
        var currentItem = this.data.orderList[0];
        vip_roll_type = currentItem.vip_roll_type;

        var picdatas = [];
        for (var j = 0; j < 3; j++) {
          if (this.data.send_num > j) {
            picdatas.push(config.Upyun + 'small-iconImages/heboImg/free_deliver.png')
          } else {
            picdatas.push(config.Upyun + 'small-iconImages/heboImg/luck_invitButton.png')
          }
        }
        this.setData({
          cardslist: picdatas,
          guidedeliverCouponImg: 2,
          guidedeliverCouponShow: true
        })
        isNewUserFirstOrder = false;
      }


      var that = this;
      var cuttime = that.data.dayEndTime - that.data.now;
      clearTimeout(fightUtil.countDownTimer);
      fightUtil.countdown(that, fightUtil, cuttime, function (data) {
        that.setData({
          is_fresh:true,
          cutdowntime: data
        })
      })
    }
  },
  //夺宝订单状态
  getIndianaStatus: function(last_time, issue_status) {
    var statusstr = "";
    var NowTime = new Date().getTime();
    var total_micro_second = last_time - NowTime || [];
    if (total_micro_second <= 0) {
      statusstr = "已过期";
    } else {
      switch (issue_status) {
        case 0:
          statusstr = "参与中";
          break;
        case 1:
          statusstr = "退款";
          break;
        case 2:
          statusstr = "退款";
          break;
        case 3:
          statusstr = "中奖";
          break;
        case 4:
          statusstr = "未中奖";
          break;
      }
    }
    return statusstr;
  },
  //订单状态
  getOrderStatus: function (itemm,status, ordershopstatus, change, shop_from, whether_prize, new_free) {
    var statusstr = "";
    if (ordershopstatus == "0") {
      switch (status) {
        case 1:
          statusstr = "待付款";
          if (shop_from == 11) { //拼团人已满，未付款
            statusstr = "拼团中";
          }
          break;
        case 2:
          statusstr = "待发货";
          if (whether_prize == 2) { //中奖订单.预中奖显示'申请发货中'
            statusstr = "申请发货中";
          }

          if (new_free == 1) {
            statusstr = "申请发货中";
          }

          if (whether_prize == 3) {
            statusstr = "待发货";
          }

          if (shop_from == 11 && itemm.is_roll !=3) { //拼团人已满，已付款
            statusstr = "拼团中";
          }

          if (shop_from == 0 && whether_prize == 9)//免拼卡 发货卡
          {
            statusstr = "待发货";
          }
          break;
        case 3:
          statusstr = "待收货";
          break;
        case 4:
          statusstr = "待评价";
          break;
        case 5:
          statusstr = "已评价";
          break;
        case 6:
          if (shop_from == 10) {
            statusstr = "免费领未点中";
          } else
            statusstr = "交易成功";
          break;
        case 7:
          statusstr = "延长收货";
          break;
        case 8:
          statusstr = "退款成功";
          break;
        case 9:
          if (shop_from == 13) {
            statusstr = "订单关闭";
          } else {
            statusstr = "取消订单";
          }
          break;
        case 10:
          statusstr = "订单已过期";
          break;
        case 11: //拼团人未满
          statusstr = "拼团中";
          break;
        case 12:
          // statusstr = "待疯抢";  
          statusstr = "待免费领"; //待疯抢-名称改为免费领

          break;
        case 13:
          statusstr = "拼团失败";
          break;
        case 14:
          statusstr = "免费领未点中";
          break;
        case 15: //申请关闭拼团-已过96小时
          statusstr = "拼团中";
          break;
        case 16: //客服关闭拼团
          statusstr = "拼团关闭";
          break;
        case 17:
          statusstr = "待发货";
          if (whether_prize == 2) { //中奖订单.预中奖显示'申请发货中'
            statusstr = "申请发货中";

          }
          if (new_free == 1) {
            statusstr = "申请发货中";
          }
          break;
        case 21:
          statusstr = "分享中";

          break;
      }
    } else if (ordershopstatus == "4") {
      if (shop_from == 10) {
        statusstr = "疯抢未抢到";
      } else
        statusstr = "交易成功";
    } else {
      var str1 = "";
      var str2 = "";
      switch (change) {
        case 1:
          str1 = "换货";
          break;
        case 2:
          str1 = "退货";
          break;
        case 3:
          str1 = "退款";
          break;
      }

      switch (ordershopstatus) {
        case "1":
          str2 = "处理中";
          break;
        case "2":
          str2 = "被拒绝";
          break;
        case "3":
          str2 = "已成功";
          break;
        case "4":
          str2 = "已取消";
          break;
      }
      statusstr = str1 + str2;
    }

    return statusstr;
  },
  //订单处理按钮
  getButtonStatusFromOrderStatus: function(status, item, shop_from) {
    var buttonLisr = [];
    var timestamp = Date.parse(new Date());
    if (item.last_time <= timestamp) {
      buttonLisr = ["删除订单"];
    }
    //测试数据
    // status = 17;
    // item.whether_prize = 2;
    switch (status) {
      case 1:
        if (item.lasttime <= item.requestNow_time) {
          buttonLisr = ["删除订单"];
        } else {
          buttonLisr = ["联系卖家", "取消订单", "付款"];
        }
        //拼团中-人已满未付款
        if (shop_from == 11) {
          buttonLisr = ["去付款"];

        }

        break;
      case 2:
        buttonLisr = ["提醒发货"];

        if (item.pay_status == 1 && item.orderShopStatus == 0 && item.orderShopStatus != nil && item.status == 1) {
          buttonLisr = ["联系卖家", "删除订单", "付款"];
        } else if (item.issue_status == 4) {
          buttonLisr = ["删除订单"];
        }

        //中奖处理
        //whether_prize 直接中奖：0， 普通订单1， 预先中奖2
        if (item.shop_from == 10 || item.shop_from == 11 || shop_from == 13) {


          if (item.whether_prize == 0) { //直接中奖订单
            buttonLisr = ["申请发货"];
            if (item.is_roll == 3) {
              buttonLisr = ["提醒发货"];
            }
          }


          if (item.whether_prize == 2) { //预先中奖

            if (item.new_free == 1) { //新用户首单

              // if (nRaffle_status == 1){
              //   buttonLisr = ["申请发货"];

              // }else{
              //   buttonLisr = ["去赚钱任务"];
              // }
              
              // 2019-12-24 何波修改
              if (this.data.isVip > 0 && this.data.isVip !=3)//是会员
              {
                buttonLisr = (this.data.clockIn == 1) ? ["申请发货"] : ["去赚钱任务"];
              }else{
                buttonLisr = ["申请发货"];
              }
            } else {
              buttonLisr = ["申请发货"];
            }

          }

        }


        //拼团中-人已满已付款
        if (shop_from == 11 && item.is_roll != 3) {
          buttonLisr = ["已付款"];
        }

        if(item.is_freeDelivery == 1){
          buttonLisr = ["点击免费发货"];
        }
        
        break;
      case 3:
        buttonLisr = ["查看物流", "确认收货"];
        break;
      case 4:
        buttonLisr = ["删除订单", "评价订单"];
        break;
      case 5:
        buttonLisr = ["删除订单", "追加评价"];
        if (item.shop_from == 4 || item.shop_from == 6) {
          buttonLisr = ["删除订单"];
        } else {
          buttonLisr = ["删除订单", "追加评价"];
        }
        break;
      case 6:
        buttonLisr = ["删除订单"];
        break;
      case 7:
        buttonLisr = ["查看物流", "确认收货"];
        break;
      case 8:
        buttonLisr = ["钱款去向"];
        break;
      case 9:
        buttonLisr = ["删除订单"];
        break;
      case 11:
        buttonLisr = ["邀请好友拼团"];
        break;

      case 12:
        buttonLisr = ["立即免费领"];
        break;

        // check: 0 1 2 3 4
        // 1. 退款关闭        0
        // 2. 部分退款成功      1
        // 3.全部退款成功    2
        // 4.退款中  3
        // 5.退款失败 4

      case 13:
        // if (item.check == 3) {
        //   buttonLisr = ["删除订单", "退款成功"];
        // } else if (item.check == 11 || item.check == 2) {
        //   buttonLisr = ["退款失败"];
        // } else if (item.check >= 0) {
        //   buttonLisr = ["退款中"];
        // } else {
        //   buttonLisr = ["删除订单"];
        // }


        if (item.is_free == 4) {
          buttonLisr = ["删除订单"];
        } else {
          if (item.check == 0) {
            buttonLisr = ["删除订单", "退款关闭"];
          } else if (item.check == 1) {
            buttonLisr = ["退款成功"];
          } else if (item.check == 2) {
            buttonLisr = ["退款成功"];
          } else if (item.check == 3) {
            buttonLisr = ["退款中"];
          } else if (item.check == 4) {
            buttonLisr = ["退款失败"];
          } else {
            // if (item.is_FightShow==1)
            // {
            //   buttonLisr = ((this.data.isVip > 0 && this.data.isVip != 3) || (this.data.isVip == 3 && this.data.maxType ==4)) ? ["删除订单"] : ["删除订单", "使用免拼卡直接发货"];
            // }else{
            //   buttonLisr = ["删除订单"];
            // }

            buttonLisr = ["删除订单"];
          }
        }
        break;
      case 14:
        // if (item.check == 3) {
        //   buttonLisr = ["删除订单", "退款成功"];
        // } else if (item.check == 11 || item.check == 2) {
        //   buttonLisr = ["退款失败"];
        // } else if (item.check >= 0) {
        //   buttonLisr = ["退款中"];
        // } else {
        //   buttonLisr = ["删除订单"];
        // }

        if (item.is_free == 4) {
          buttonLisr = ["删除订单"];
        } else {
          if (item.check == 0) {
            buttonLisr = ["删除订单", "退款关闭"];
          } else if (item.check == 1) {
            buttonLisr = ["退款成功"];
          } else if (item.check == 2) {
            buttonLisr = ["退款成功"];
          } else if (item.check == 3) {
            buttonLisr = ["退款中"];
          } else if (item.check == 4) {
            buttonLisr = ["退款失败"];
          } else {
            buttonLisr = ["删除订单"];
          }
        }
        break;

      case 15: //96小时已过
        buttonLisr = ["申请关闭拼团"];
        break
      case 16: //客服关闭拼团

        if (item.is_free == 4) {
          buttonLisr = ["删除订单"];
        } else {
          if (item.check == 0) {
            buttonLisr = ["删除订单", "退款关闭"];
          } else if (item.check == 1) {
            buttonLisr = ["退款成功"];
          } else if (item.check == 2) {
            buttonLisr = ["退款成功"];
          } else if (item.check == 3) {
            buttonLisr = ["退款中"];
          } else if (item.check == 4) {
            buttonLisr = ["退款失败"];
          } else {
            buttonLisr = ["删除订单"];
          }
        }

        break

      case 17: //中奖订单-申请退款


        if (item.whether_prize == 2) {

          if (item.new_free == 1) { //新用户首单
            // buttonLisr = ["关闭订单","成为会员", "联系客服发货"];

            buttonLisr = ["关闭订单", "成为会员", "接通微信客服"];



          } else {
            buttonLisr = ["关闭订单", "申请发货"];

          }
        } else {
          buttonLisr = ["关闭订单"];
        }
        break

      case 21:
        buttonLisr = ["分享好友免费领"];
        break
    }

    return buttonLisr;
  },
  //列表加载更多
  onReachBottom: function() {
    this.getOrderList();
  },
  //下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      currentpage: 1,
    })
    this.getOrderList();
  },

  //切换菜单
  switchNav: function(e) {
    var page = this;
    var currenttab = e.currentTarget.dataset.current;
    if (this.data.currentTab == currenttab) {
      return false;
    } else {
      var current = app.globalData.user ? e.currentTarget.dataset.current : 0;
      page.setData({
        currentTab: current,
        currentpage: 1,
      });

      if (app.globalData.user) {
        this.getOrderList();
      }
    }
  },

  //随便逛逛
  gobuytap: function(event) {
    wx.switchTab({
      url: '../../../pages/shouye/shouye',
    })
  },
  //订单详情
  orderdetailTap: function(event) {
    var item = event.currentTarget.dataset.item;
    wx.setStorageSync("orderitem", item);
    wx.setStorageSync("oneYuan_order_code", item.order_code);
    wx.setStorageSync("wxcx_shop_group_price", item.order_price);

    if (item.shop_from == 11 && item.is_roll !=3 ){
      url = '../../../pages/shouye/fightDetail/fightDetail?item=' + item + '&code=' + item.roll_code + "&isTM=" + item.isTM + "&status=" + item.status + '&is_FightShow=' + item.is_FightShow;
      wx.navigateTo({
        url: url,
      })
      return;
    }


    if (item.shop_from == '11' || item.shop_from == '10') {
      var url = 'orderDetail/orderDetail?item=' + item;

      if (item.status == 12) { //待疯抢

        chouJiangUrl = '../../../pages/listHome/order/oneBuyLuckPan/oneBuyLuckPanIOS?' + "order_code=" + item.order_code + "&FightSuccess=true" + "&comeFromOrder=true";
        if (wx.getStorageSync("NOT_FIRST-GO-ZHUANPAN")) { //非第一次

          if (zhouJiangMZclick) {

            wx.navigateTo({
              url: chouJiangUrl,
            })

          } else {
            this.setData({
              openYifuDialogShowFQ: true,
            })

          }


        } else { //第一次
          is_backFresh = true;
          wx.navigateTo({
            url: chouJiangUrl,
          })
          wx.setStorageSync("NOT_FIRST-GO-ZHUANPAN", true);
          this.fistChoujiangBack = true;
        }

        return

      } else if (item.status == 11 || item.status == 13 || item.status == 15) { //拼团不成功
        url = '../../../pages/shouye/fightDetail/fightDetail?item=' + item + '&code=' + item.roll_code + "&isTM=" + item.isTM + "&status=" + item.status;
        wx.navigateTo({
          url: url,
        })
      } else if (item.status == 14) { //疯抢未抢中
        url = 'orderDetail/orderDetail?item=' + item;
        wx.navigateTo({
          url: url,
        })
      } else {
        wx.navigateTo({
          url: 'orderDetail/orderDetail?item=' + item,
        })
      }

    } else {
      wx.navigateTo({
        url: 'orderDetail/orderDetail?item=' + item,
      })
    }
  },

  //处理按钮添加formid
  fightsubmit: function(e) {
    var formId = e.detail.formId;
    if (formId && app.globalData.user != null) {
      util.httpPushFormId(formId);
    }
  },
  //待付款
  foothandleviewtap: function(event) {
    var that = this
    var item = event.currentTarget.dataset.item;
    orderItem = item;
    var title = event.currentTarget.dataset.title;
    if (title == "付款") {
      this.payOrder(item);
    } else if (title == "取消订单") {
      this.cancleOrder(item);
    } else if (title == "删除订单") {
      this.deleateOrder(item);
    } else if (title == "联系卖家") {

    } else if (title == "邀请好友拼团") {
      wx.navigateTo({
        url: '../../../pages/shouye/fightDetail/fightDetail?item=' + item + '&code=' + item.roll_code + "&isTM=" + item.isTM + "&status=" + item.status,
      })
    } else if (title == "会员免费领" || title == "立即免费领") {

      wx.setStorageSync("oneYuan_order_code", item.order_code);
      wx.setStorageSync("wxcx_shop_group_price", item.order_price);
    
      chouJiangUrl = '../../../pages/listHome/order/oneBuyLuckPan/oneBuyLuckPanIOS?' + "order_code=" + item.order_code + "&FightSuccess=true" + "&comeFromOrder=true";
      if (wx.getStorageSync("NOT_FIRST-GO-ZHUANPAN")) { //非第一次


        if (zhouJiangMZclick) {

          wx.navigateTo({
            url: chouJiangUrl,
          })

        } else {
          this.setData({
            openYifuDialogShowFQ: true,
          })

        }




      } else { //第一次
        is_backFresh = true;
        wx.navigateTo({
          url: chouJiangUrl,
        })
        wx.setStorageSync("NOT_FIRST-GO-ZHUANPAN", true);
        this.fistChoujiangBack = true;
      }
    } else if (title == "申请关闭拼团") {
      this.ptSuccessOrder_code = item.order_code
      this.ptSuccesRoll_code = item.roll_code
      wx.setStorageSync("oneYuan_order_code", item.order_code);

      that.setData({
        openGetJiqiDialog: true
      })

      // wx.showLoading({
      //   title: '请稍后',
      //   mask: true,
      // })
      // setTimeout(function() {
      //   wx.hideLoading()
      //   //召唤机器人参团
      //   that.callRobot()
      // }, 2000)



    } else if (title == "退款中" || title == "退款成功" || title == "退款关闭") {
      is_goTiXianDetail = true;

      if (item.check == 3 && !item.business_code) { //48小时提现未到，模拟提现中
        wx.navigateTo({
          url: '../../../pages/mine/wallet/accountDetail/ForwardDetail?' +
            "business_code=" + item.business_code +
            "&check=" + item.check +
            "&t_type=" + "-1" +
            "&isVirtualTKZ=" + true +
            "&order_price=" + item.order_price +
            "&draw_time=" + item.draw_time


            ,
        })
      } else {
        wx.navigateTo({
          url: '../../../pages/mine/wallet/accountDetail/ForwardDetail?' +
            "business_code=" + item.business_code +
            "&check=" + item.check +
            "&t_type=" + "-1",
        })
      }



    } else if (title == "退款失败") {
      this.setData({
        openRefundFailShow: true
      })
    } else if (title == "申请发货") {
      
      //2020-3-18最新修改
      var picdatas = [];
      for (var j = 0; j < 3; j++) {
        if (this.data.send_num > j) {
          picdatas.push(config.Upyun + 'small-iconImages/heboImg/free_deliver.png')
        } else {
          picdatas.push(config.Upyun + 'small-iconImages/heboImg/luck_invitButton.png')
        }
      }
      this.setData({
        cardslist:picdatas,
        guidedeliverCouponImg: 2,
        guidedeliverCouponShow: true
      })
      vip_roll_type = item.vip_roll_type;
      wx.setStorageSync(item.order_code, 'true');
      this.data.is_click_orders.push(item.order_code);
      wx.setStorageSync('click_orders', this.data.is_click_orders);

    } else if (title == "申请退款") {
      // that.showToast('申请退款', 2000);

      that.reFundOrder(item);



    } else if (title == "关闭订单") {

      that.colseOrder(item);
    } else if (title == "了解会员") {

      if (wx.getStorageSync("showVipGuide")) {
        wx.navigateTo({
          url: '../addMemberCard/addMemberCard',
        })
      } else {
        wx.setStorageSync('showVipGuide', true)
        wx.navigateTo({
          // url: '../member/member?memberComefrom=' + "mine",
          url: '../addMemberCard/addMemberCard?memberComefrom=mine',
        })
      }




    } else if (title == "成为会员") {

      // wx.navigateTo({
      //   url: '../member/member?memberComefrom=' + "order",
      // })


      if (wx.getStorageSync("showVipGuide")) {
        wx.navigateTo({
          url: '../addMemberCard/addMemberCard?memberComefrom=' + "order",
        })
      } else {
        wx.setStorageSync('showVipGuide', true)
        wx.navigateTo({
          // url: '../member/member?memberComefrom=' + "order",
          url: '../addMemberCard/addMemberCard?memberComefrom=' + "order",
        })
      }



    } else if (title == "建群分享好友") {
      wx.setStorageSync("first_shopdata", item.orderShops);


      wx.navigateTo({
        url: "/pages/shouye/shareFightDetail/shareFightDetail?" +
          "&isTM=" + item.isTM
      })


    } else if (title == "分享群聊") {
      wx.setStorageSync("first_shopdata", item.orderShops);


      wx.navigateTo({
        url: "/pages/shouye/shareGroupChat/shareGroupChat?" +
          "&isTM=" + item.isTM
      })


    } else if (title == "分享好友免费领") {
      wx.setStorageSync("second_shopdata", item.orderShops);


      wx.navigateTo({
        url: "/pages/mine/order/freeLingShare/freeLingShare?" +
          "isTM=" + item.isTM +
          "&order_code=" + item.order_code +
          "&FightSuccess=true" +
          "&comeFromOrder=true"

      })


    } else if (title == "去赚钱任务") {
      wx.navigateTo({
        url: '../../../pages/sign/sign',
      })
    } else if (title == "点击免费发货") {

      var token = app.globalData.user.userToken;
      var order_code = item.order_code;
      var url = config.Host + "order/uptOrderFreeDelivery?token=" + token + config.Version + "&order_code=" + order_code;
      util.http(url, function(data){
        if(data.status == 1){
          that.setData({
            currentpage: 1,
          })
          that.getOrderList();

        }else{
          that.showToast(data.message, 2000);

        }
      });

 

    }else if (title == "去付款") {
      wx.navigateTo({
        url: '../../../pages/shouye/fightDetail/fightDetail?code=' + item.roll_code + "&isTM=" + item.isTM + "&status=" + item.status,
      })

    } else if (title == "已付款") {
      wx.navigateTo({
        url: '../../../pages/shouye/fightDetail/fightDetail?code=' + item.roll_code + "&isTM=" + item.isTM + "&status=" + item.status,
      })
    } else if (title == "使用免拼卡直接发货") {
      vip_roll_type = item.vip_roll_type;
      
      //查询是否有虚拟抽奖
      util.newuser_luckdraw_query(function (data) {
        if (data.status == 1) {
          if (data.data.is_finish == 1) {//虚拟抽奖
            wx.navigateTo({
              // url: '/pages/mine/withdrawLimitTwo/withdrawLimitTwo?comefrom=' + 'freeFight_style'
              url: '/pages/sign/sign?comefrom=' + 'freeFight_style'
            })
          } else {
            wx.navigateTo({
              url: '../../../pages/shouye/fightDetail/fightDetail?code=' + item.roll_code + "&isTM=" + item.isTM + "&status=" + item.status + '&is_FightShow=' + item.is_FightShow,
            })
          }
        }
      })
    } else if (title == '查看物流'){
      wx.setStorageSync("orderitem", item);
      wx.navigateTo({
        url: '/pages/mine/order/lookLogistics/lookLogistics',
      })
    }
    else {
      this.setData({
        openYifuDialogShow: true
      })
    }
  },
  dialogGoChoujiang: function() { //抽奖弹窗按钮点击


    this.setData({
      openYifuDialogShow: false,
      openYifuDialogShowFQ: false,

      showIOSdownload: true,
    })



  },
  // 支付回调
  // appId: "wxeb7839c8cbeef680"
  // nonceStr: "zr73uq589vbk59tlntcri8a1dgxkk44w"
  // package: "prepay_id=wx2017112416500900940db3290184964231"
  // paySign: "2DADDBA31784C2D2271FA0343A1B10AD"
  // signType: "MD5"
  // timeStamp: 1511858924066
  orderPayResult: function(data) {
    var that = this;
    if (data.status == 1) {
      var xml = data.xml;
      wx.requestPayment({
        'timeStamp': xml.timeStamp + "",
        'nonceStr': xml.nonceStr,
        'package': xml.package,
        'signType': xml.signType,
        'paySign': xml.paySign,
        'success': function(res) {
          that.setData({ //刷新列表
            currentpage: 1,
          })
          var shop = orderItem.orderShops[0];
          if (shop.shop_from != 10 && shop.shop_from != 11 && shop.shop_from != 4 && shop.shop_from != 6) {
            //普通订单到订单详情界面
            wx.redirectTo({
              url: 'orderDetail/orderDetail?isNormalBuy=' + 'true',
            })
          } else {
            that.getOrderList();
          }

        },
        'fail': function(res) {
          that.showToast('支付失败', 2000);
        }
      })
      that.data.isConfirm = false;
    } else {
      that.showToast(data.message, 2000);
      that.data.isConfirm = false;
    }
  },
  //付款
  payOrder: function(item) {
    var that = this;
    //男性用户不可下单支付
    if (app.globalData.user.gender == 1) {
      that.showToast('系统维护中，暂不支持支付', 2000);
      return;
    }
    wx.setStorageSync("orderitem", item);

    var order_code = item.order_code;
    console.log("order_code=", order_code);

    var fdStart = order_code.indexOf("G");
    var payUrl = 'wxpaycx/wapUinifiedOrder?';
    if (fdStart == 0) {
      payUrl = 'wxpaycx/wapUinifiedOrderList?';
    }

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId, 3rd_session
        if (res.code) {
          var dataUrl = config.PayHost + payUrl + config.Version + "&token=" + app.globalData.user.userToken + '&order_code=' + order_code + '&order_name=我的' + '&code=' + res.code;
          util.http(dataUrl, that.orderPayResult)
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
          that.showToast('获取用户登录态失败！' + res.errMsg, 2000);
          that.data.isConfirm = false;
        }
      }
    })
  },
  //取消订单
  cancleOrder: function(item) {
    var token = app.globalData.user.userToken;
    var order_code = item.order_code;
    var url = config.Host + "order/escOrder?token=" + token + config.Version + "&order_code=" + order_code;
    util.http(url, this.cancleOrderdata);
  },
  cancleOrderdata: function(data) {
    if (data.status == 1) {
      this.setData({
        currentpage: 1,
      })
      this.getOrderList();
      this.showToast("取消成功", 2000);
    } else {
      this.showToast("取消失败", 2000);
    }
  },

  //删除订单
  deleateOrder: function(item) {
    var token = app.globalData.user.userToken;
    var order_code = item.order_code;
    var url = config.Host + "order/delOrder?token=" + token + config.Version + "&order_code=" + order_code;
    util.http(url, this.deleateOrderdata);
  },
  deleateOrderdata: function(data) {
    if (data.status == 1) {
      this.setData({
        currentpage: 1,
      })
      this.getOrderList();
      this.showToast("删除成功", 2000);
    } else {
      this.showToast("删除失败", 2000);
    }
  },
  //申请发货
  sqfh: function(item) {

    var that = this
    clickWhether_prize = item.whether_prize;
    clickStatus = item.status;

    wx.setStorageSync("SQFH_SHOP_ITEM", item)

    //查询是否是会员
    //获取会员信息
    util.get_vip(function(data) {
      var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是

      isClickVip = isVip
      //测试
      // clickWhether_prize = 2
      // clickStatus = 2

      wx.setStorageSync("orderitem", data);
      var token = app.globalData.user.userToken;
      var order_code = item.order_code;
      var url = config.Host + "order/applySendOrderTips?token=" + token + config.Version

        +
        "&order_code=" + order_code +
        "&bak=" + item.bak;



      util.http(url, that.sqfhData);


    })





  },
  sqfhData: function(data) {
    if (data.status == 1) {




      //
      // var url =  '../sqfh/sqfh?memberComefrom=' + "mine";
      // wx.navigateTo({
      //   url: url,
      // })




      var supName = wx.getStorageSync("SQFH_SHOP_ITEM").order_name;
      //查询品牌
      var basesData = wx.getStorageSync("shop_tag_basedata");

      var supperlabList = basesData.data.supp_label;
      for (var i = 0; i < supperlabList.length; i++) {
        var supperid = supperlabList[i]["id"];
        if (data.label == supperid) {
          var supp_label = supperlabList[i]["name"];
          if (supp_label != undefined) {
            supName = supp_label + data.type2
          }
          break;
        }
      }

      servicewxh = data.wxh


      if (clickStatus == 17 && clickWhether_prize == 2) { //无需客服发货的单独处理
        this.setData({
          supName: supName,
          clickWhether_prize: clickWhether_prize,
          sqfhData: data,
          sqFHshow: true,
          clickStatus: clickStatus,
          isClickVip: isClickVip
        })

      } else {

        var item = JSON.stringify(data);


        var url = '../sqfh/sqfh?clickWhether_prize=' + clickWhether_prize +
          "&clickStatus=" + clickStatus +
          "&supName=" + supName +
          "&item=" + item

        wx.navigateTo({
          url: url,
        })
      }








    } else {
      this.showToast("申请失败", 2000);
    }
  },


  //关闭订单
  colseOrder: function(item) {
    var that = this;
    var token = app.globalData.user.userToken;
    var order_code = item.order_code;
    var url = config.Host + "order/closeTemporaryRollOrder?token=" + token + config.Version + "&order_code=" + item.order_code;
    util.http(url, function(data) {

      if (data.status == 1) {
        that.setData({
          currentpage: 1,
        })
        that.getOrderList();
        that.showToast("关闭订单成功", 2000);

      } else {
        that.showToast("关闭订单失败", 2000);
      }

    });
  },

  //申请退款
  reFundOrder: function(item) {
    var token = app.globalData.user.userToken;
    var order_code = item.order_code;
    var url = config.Host + "order/refundTemporaryRollOrder?token=" + token + config.Version + "&order_code=" + item.order_code;
    util.http(url, this.reFundOrderrdata);
  },
  reFundOrderrdata: function(data) {
    if (data.status == 1) {
      this.setData({
        currentpage: 1,
      })
      this.getOrderList();
      this.showToast("申请成功", 2000);





    } else {
      this.showToast("申请失败", 2000);
    }
  },

  //分享好友拼团
  shareOrder: function(item) {
    console.log("分享好友拼团");
  },
  //关闭下载弹框
  open_yifu_iknow: function() {
    this.setData({
      openYifuDialogShow: false,
      openYifuDialogShowFQ: false

    });
  },


  //获取可抵扣余额
  top_shopHttp: function(item) {
    var that = this;
    that.setData({
      discount_clickItem: item
    })
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var oldurl = config.Host + 'order/getZeroOrderDeductible?' + config.Version + '&token=' + token;
    util.http(oldurl, that.discount_data);
  },
  discount_data: function(data) {
    if (data.status == 1) {
      var one_deductible = Number(this.data.discountitem.one_deductible);
      var title = one_deductible > 0 ? "余额抵扣说明" : "疯抢退款说明";

      this.setData({
        oneYuanDiscriptionTitle: title,
        moneyDiscountShowFlag: true,
        // moneyDiscount: (data.order_price * 1).toFixed(1), 
        moneyDiscount: (data.one_not_use_price * 1).toFixed(1),
      })
    }
  },

  //抵扣弹框
  discountClick: function(event) {
    var item = event.currentTarget.dataset.item;
    wx.setStorageSync("orderitem", item);
    if (item.is_free == 4) {
      wx.navigateTo({
        url: 'orderDetail/orderDetail?item=' + item,
      })
      return
    }


    this.data.discountitem = item;
    if ((item.orderstatus == '免费领未点中' || item.orderstatus == '拼团失败') && item.orderstatus != '待发货') {
      this.top_shopHttp(item);
    } else if (item.one_deductible > 0) {
      this.top_shopHttp(item);
    } else {
      wx.setStorageSync("orderitem", item);
      wx.setStorageSync("oneYuan_order_code", item.order_code);
      wx.setStorageSync("wxcx_shop_group_price", item.order_price);
      if (item.shop_from == '11' || item.shop_from == '10') {

        var url = 'orderDetail/orderDetail?item=' + item;

        if (item.status == 12) {

          chouJiangUrl = '../../../pages/listHome/order/oneBuyLuckPan/oneBuyLuckPanIOS?' + "order_code=" + item.order_code + "&FightSuccess=true" + "&comeFromOrder=true";
          if (wx.getStorageSync("NOT_FIRST-GO-ZHUANPAN")) { //非第一次
            this.setData({
              openYifuDialogShowFQ: true,
            })
          } else { //第一次
            is_backFresh = true;
            wx.navigateTo({
              url: chouJiangUrl,
            })
            wx.setStorageSync("NOT_FIRST-GO-ZHUANPAN", true);
            this.fistChoujiangBack = true;
          }

          return;

        } else if (item.status == 11 || item.status == 13 || item.status == 15) {
          url = '../../../pages/shouye/fightDetail/fightDetail?item=' + item + '&code=' + item.roll_code + "&isTM=" + item.isTM + "&status=" + item.status;
        } else if (item.status == 14) {
          url = 'orderDetail/orderDetail?item=' + item;
        }

        wx.navigateTo({
          url: url,
        })

      } else {
        wx.navigateTo({
          url: 'orderDetail/orderDetail?item=' + item,
        })
      }
    }
  },
  //余额抵扣弹窗点击去赚余额 关闭
  getMoneyBtn: function() {
    this.setData({
      moneyDiscountShowFlag: false
    })
    wx.navigateTo({
      url: "../../sign/sign",
    })
  },
  //余额抵扣弹窗点击知道了 关闭
  getYiDouBtn: function() {
    this.setData({
      moneyDiscountShowFlag: false
    })
  },

  //余额抵扣弹窗点击查看余额 关闭
  getYueBtn: function() {
    wx.navigateTo({
      url: '../../mine/wallet/wallet',
    })
    this.setData({
      moneyDiscountShowFlag: false
    })
  },

  //余额抵扣弹窗点击退款进度 关闭
  getRefundSchedule: function(event) {
    if (this.data.discount_clickItem.check >= 0) //进度
    {
      is_goTiXianDetail = true;
      wx.navigateTo({
        url: '../../../pages/mine/wallet/accountDetail/ForwardDetail?' + "business_code=" + this.data.discount_clickItem.business_code,
      })
    } else { //老的订单 查看余额
      wx.navigateTo({
        url: '../../mine/wallet/wallet',
      })
    }

    this.setData({
      moneyDiscountShowFlag: false
    })
  },
  closeYiDouBtn: function() {
    this.setData({
      moneyDiscountShowFlag: false
    })
  },







  //获取二级类目
  top_shopTypeHttp: function(shop) {
    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var oldurl = config.Host + 'shop/queryShopType2?' + config.Version + '&token=' + token + '&shop_code=' + shop.shop_code;
    util.http(oldurl, that.type_data);
  },
  type_data: function(data) {
    if (data.status == 1) {
      var shop = orderItem.orderShops[0];
      var supp_label = '衣蝠';
      if (shop.supp_label) {
        supp_label = shop.supp_label;
      }

      var sharemoney = app.globalData.oneYuanFree > 0 ? '0' : this.data.wxcx_shop_group_price;

      // var shareJson = '快来' + this.data.wxcx_shop_group_price + '元拼' + '【' + supp_label + '正品' + data.type2 + '】,' + '专柜价' + shop.shop_price + '元!';
      // if (shop_type == 2) {
      //   shareJson = '快来' + this.data.wxcx_shop_group_price + '元拼' + '【' + this.data.shop.shop_name + '】,' + '原价' + shop.shop_price + '元!';
      // }
      this.data.shareTitle = "";
    }
  },

  onShareAppMessage: function(res) {
    var shop = orderItem ? orderItem.orderShops[0] : this.data.orderList[0].orderShops[0];
    var shop_code = shop.shop_code;
    var share_pic = shop.new_shop_pic + '!450';
    var shop_name = shop.shop_name;
    var supp_label = shop.supp_label ? shop.supp_label : "衣蝠";
    var user_id = '';

    if (app.globalData.user) {
      user_id = app.globalData.user.user_id
    }

    var shareTitle = '点击购买👆' + '【' + shop.shop_name + '】' + "今日特价" + shop.shop_price + "元！";

    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }

    return {
      title: shareTitle,
      path: '/pages/shouye/detail/detail?shop_code=' + this.data.shop_code + "&isShareFlag=true" + "&user_id=" + user_id,
      imageUrl: that.data.Upyun + share_pic,
      success: function(res) {
        // that.setData({ isOneShowShare: false })
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },

  closeToTX: function() {
    this.setData({
      openYifuDialogShow: false
    })
  },

  closeToTXFQ: function() {

    this.setData({
      openYifuDialogShowFQ: false
    })

    is_backFresh = true;
    wx.navigateTo({
      url: chouJiangUrl,
    })
    wx.setStorageSync("NOT_FIRST-GO-ZHUANPAN", true);
  },
  closeIOSdownload: function() {
    zhouJiangMZclick = true
    this.setData({
      showIOSdownload: false
    })
  },

  colseFirstChouJiangBackDialog: function() {
    this.setData({
      showFirstChoujiangBackDialog: false,
      showIOSdownload: true,

    })
  },

  downloadsubmit: function(e) {
    var formId = e.detail.formId;
    if (formId && app.globalData.user != null) {
      util.httpPushFormId(formId);
    }
  },
  goAPPtx: function() { //引导下载APP

    // if (app.globalData.systemInfo == "ios") {

    //   console.log("ios手机")

    this.setData({
      openYifuDialogShow: false,
      openYifuDialogShowFQ: false,

      showIOSdownload: true,
    })


    // } else {
    //   console.log("android手机")

    //   wx.navigateTo({
    //     url: "downloadapp/downloadapp"

    //   });

    // }

  },
  //去赚钱
  goToMoney: function() {
    this.setData({
      fightSuccess_fail_isShow: false,
      opendeliveryCardShow:false
    })
    wx.navigateTo({
      url: '../../../pages/sign/sign',
    })
  },
  goTiXian: function() {
    this.setData({
      openRefundFailShow: false,
      fightSuccess_fail_isShow: false
    })

    wx.navigateTo({
      url: '../../../pages/mine/wallet/Withdrawals/Withdrawals',
    })
  },
  closePop: function() {
    this.setData({
      openRefundFailShow: false,
      opendeliveryCardShow:false,
      fightSuccess_fail_isShow: false
    })
  },
  //是否授权
  loginSetting: function() {
    var that = this;
    //查看用户是否授权 未授权弹授权提示弹窗
    wx.getSetting({
      success: res => {
        var authSetting = false;
        if (res.authSetting['scope.userInfo'] || app.globalData.user) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          authSetting = true;
        } else {
          authSetting = false;
        }

        that.setData({
          authSetting: authSetting,
        })
      }
    })
  },
  // 提交formId
  loginsubmit: function(e) {
    formId = e.detail.formId;
  },
  //授权弹窗
  onclick: function(e) {
    var that = this;
    wx.getUserInfo({
      //允许授权 获取用户信息
      success: function(res) {
        that.orderHttp();
        that.setData({
          authSetting: true,
        })
      },
      fail: function() {

      }
    })
  },

  //登录成功回调
  orderHttp: function() {
    var that = this;
    app.New_userlogin(function() {
      //授权登录成功
      that.getOrderList();

      // 提交formId
      if (formId) {
        util.httpPushFormId(formId);
      }
    });
  },
  onHide: function() {
    if (this.data.FightSuccess) {
      wx.setStorageSync("FightSuccess", true)
      this.setData({
        FightSuccess: false
      })
    }
    clearInterval(xuanfuanimationTimer);
    this.xuanfuanimationMiddleHeaderItem.rotate(0).step().scale(1.0).step();
    this.setData({
      xuanfuanimationMiddleHeaderItem: this.xuanfuanimationMiddleHeaderItem.export(),  //输出动画
      suspensionHongBao_isShow: false
    });
  },
  //召唤机器人参团
  callRobot: function() {
    var that = this;

    that.setData({
      openGetJiqiDialog: false

    })
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    setTimeout(function() {
      wx.hideLoading()
      //召唤机器人参团
      var oldurl = config.Host + 'order/addOrderFake?' + config.Version + "&token=" + app.globalData.user.userToken + "&roll_code=" + that.ptSuccesRoll_code + "&order_code=" + that.ptSuccessOrder_code;
      util.http(oldurl, function(data) {
        if (data.status == 1) { //参团成功
          //刷新列表
          that.setData({
            currentpage: 1,
          })
          that.getOrderList();


          var machineText = data.userName + "已参团，拼团成功，现在可以立即疯抢，1折带走商品！"

          is_backFresh = true;
          var zhuanPanUrl = '../../../pages/listHome/order/oneBuyLuckPan/oneBuyLuckPanIOS?' + "order_code=" + that.ptSuccessOrder_code + "&FightSuccess=true" + "&machineText=" + machineText + "&comeFromOrder=true";
          wx.navigateTo({
            url: zhuanPanUrl
          })
          //弹出拼团成功提示
          // that.setData({
          //   ptSuccessUserName: data.userName,
          //   // ptSuccessUserName: "小白",

          //   openFightSuccessShow: true
          // })


        }
      });


    }, 2000)





  },
  closeFight: function() {
    this.setData({
      openFightSuccessShow: false,
      openGetJiqiDialog: false,
      sqFHshow: false

    })
  },

  getFight: function() {
    this.setData({
      openGetJiqiDialog: false,
      openFightSuccessShow: false
    })
    is_backFresh = true;
    var zhuanPanUrl = '../../../pages/listHome/order/oneBuyLuckPan/oneBuyLuckPanIOS?' + "order_code=" + this.ptSuccessOrder_code + "&FightSuccess=true" + "&comeFromOrder=true";
    wx.navigateTo({
      url: zhuanPanUrl
    })
  },
  //领取会员
  memberSubmit: function(e) {
    formId = e.detail.formId;
    if (formId && app.globalData.user != null) {
      util.httpPushFormId(formId);
    }
    this.setData({
      upperMemberYiFuShow: false,
    })



    if (wx.getStorageSync("showVipGuide")) {
      wx.navigateTo({
        url: '../addMemberCard/addMemberCard',
      })
    } else {
      wx.setStorageSync('showVipGuide', true)
      wx.navigateTo({
        // url: '../member/member?memberComefrom=' + "mine",
        url: '../addMemberCard/addMemberCard?memberComefrom=mine',
      })
    }


  },
  closeNewThirty: function() {
    this.setData({
      upperMemberYiFuShow: false,
    })
  },

  //自动登录
  globalLogin: function() {
    var that = this;
    wx.showLoading({
      title: '请稍后',
    })
    util.autoLogin(loginCount, function(loginfailYiFuShow, login_discribution, login_buttontitle, newloginCount) {
      loginCount = newloginCount;
      if (loginCount == 1) //登录成功
      {
        that.setData({
          currentTab: 0,
          currentpage: 1
        })
        that.getOrderList();
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

  goToVip: function() {


    wx.navigateTo({
      url: '../addMemberCard/addMemberCard?&vip_type=' + (isClickVip == 0 ? -1005 : -1001),
    })

    this.setData({
      sqFHshow: false

    })

  },

  //成为会员
  membercouponTap:function(){
    // this.setData({
    //   guidedeliverCouponShow:false
    // })
    wx.navigateTo({
      url: '../addMemberCard/addMemberCard?memberComefrom=freelingOrder',
    })
  },
  //发货卡发货
  delivercouponTap:function(){
    this.setData({
      isgotoMemberFromdeliver: true,
      // guidedeliverCouponShow: false
    })
    wx.navigateTo({
      url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=deliver'
    })
  },
  //关闭发货弹框
  closeTixianCoupon:function(){
    this.setData({
      guidedeliverCouponShow: false,
    })
    //只要有免拼卡、发货卡不弹此框
    // if (this.data.send_num < 1 && this.data.free_num < 1) {
    //   var opendeliveryCardShow = (this.data.isVip > 0 && this.data.isVip != 3) || (this.data.isVip == 3 && vipMaxType == 4) ? false : true;
    //   this.setData({
    //     opendeliveryCardShow: opendeliveryCardShow,
    //   })
    // }
  },
  closeShowLXKF: function() {
    this.setData({
      showLXKF: false
    })
  },

  //发货卡
  fight_deliver_lingtap: function () {
    this.setData({
      isgotoMemberFromdeliver: true,
      // guidedeliverCouponShow: false,
      // guideFightDeliverShow:false
    })

    if (this.data.guideFightDeliverShow)//免拼卡弹框
    {
      if (this.data.free_num > 1) {
        wx.navigateTo({
          url: '/pages/sign/sign?comefrom=deliver_fightstyle',
        })
      } else {
        wx.navigateTo({
          url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=freeFight'
        })
      }
    } else {
      if (this.data.send_num > 1) {
        wx.navigateTo({
          url: '/pages/sign/sign?comefrom=deliver_fightstyle',
        })
      } else {
        wx.navigateTo({
          url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=deliver'
        })
      }
    }
  },

  //成为会员
  fight_deliver_memebertap: function () {
    this.setData({
      // guidedeliverCouponShow: false,
      // guideFightDeliverShow:false
    })
    if ((this.data.isVip > 0 && this.data.isVip != 3) || (this.data.isVip == 3 && vipMaxType == 4))//是会员或者是半张钻石卡
    {
      wx.navigateTo({
        url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=freelingOrder&vip_roll_type=' + vip_roll_type
      })
    }else{
      wx.navigateTo({
        url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=freelingOrder' 
      })
    }
  },

  //关闭发货卡发货弹框
  closeInvitImage: function () {
    this.setData({
      guidedeliverCouponShow: false,
      guideFightDeliverShow:false
    })

    //只要有免拼卡、发货卡不弹此框
    // if (this.data.send_num < 1 && this.data.free_num < 1) {
    //   var opendeliveryCardShow = (this.data.isVip > 0 && this.data.isVip != 3) || (this.data.isVip == 3 && vipMaxType == 4)?false:true;
    //   this.setData({
    //     opendeliveryCardShow: opendeliveryCardShow,
    //   })
    // }
  },
  
  //复制微信号
  copyWXH: function() {

    var self = this;
    wx.setClipboardData({
      data: servicewxh,
      success: function(res) {
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

  }
})