// pages/listHome/order/oneBuyLuckPan/oneBuyLuckPan.js


import config from '../../../../config.js';
// var util = require('../../../utils/util.js');

// import config from '../../../../common/toastTest/toastTest.js';

var util = require('../../../../utils/util.js');
var WxNotificationCenter = require("../../../../utils/WxNotificationCenter.js");

var app = getApp();
var token;

// var isRunning = false;//是否正在抽奖


var balanceLottery = 0;
var balanceLotterySum = 0;

var isFromSignBalanceLottery = false;

var dataListTemp1 = [];
var isMoving = false;
var scollTimeOut;
var scollTimePause;
var wxIsNotBind = false;
var typelist = []; //二级类目集合
var supplabelList = []; //所有品牌集合
var firstChou = false;
var runDegs = 0;
var rotate = 0;
var WinningPrize = 1; //0中奖 1不中奖
var realyWinningPrize = 1; //真实是否中奖 0中奖 1不中奖
var winningOrder = ''; //中奖的订单
var goNextPage = false; //是否跳转下一界面
var is_luckDraw;//是否可以抽奖
var global_firstGroup;
var shouYe3Free = ''
// var pRatio = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    upyconfig: config.Upyun,
    isMad: false,
    animationData: {},
    timer: null,
    step: 0,



    icon_zhizhen: "onebuy_zhizhen.png",
    moneyDiscount: 0,
    moneyDiscountShowFlag: false,
    oneYuanDiscriptionTitle: '本轮未点中哦',
    // oneYuanDiscription:"送你至尊会员资格，可以免费再抢一轮",
    // oneYuanDiscriptionLeftButton:"免费再抢一轮",
    // oneYuanDiscriptionRightButton: "离开",

    scrollTop1: 0,
    scrollTop2: 0,
    mListData1: [],
    showGuiZe: false,
    tapshowGuiZe: false,
    showMemberGuiZe: false,
    showStopBtn: false,
    oneyuanValue: 1,
    oneyuanCount: 1,
    wxcx_shop_group_price: 1,
    type_data: '', //商品类目
    orderList: [],
    share_price: '',
    share_oldprice: '',
    share_name: '',
    //转盘相关
    playing: false, //运行开关
    translatestyle: '', //将转盘的旋转参数 保存到父容器上
    animate: '', //转盘添加动画属性的开关
    angle: 0, //转盘角度 角度区间为 [-180,180]
    systemInfo: '', //当前设备是什么系统
    showChoujiangSuccessComplete: false,
    upperMemberYiFuShow:false,//会员办卡的弹窗
    showChoujiangSuccessTitle: "我知道了",
    showChoujiangNopay:1,//0免费中奖 1普通中奖 2预中奖
  },
  onUnload: function() {
    console.log('App onHide');
    clearInterval(this.data.timer);

    //获取用户是否是第一次疯抢
    util.getOrderStatus(function(data) {
      //用户初次进入疯抢页（且疯抢不中）退出后直接跳转首页4，同时销毁当前疯抢转盘页。
      if (data.rollCount == 1 && !goNextPage && WinningPrize != 0) {
        wx.redirectTo({
          url: "/pages/shouye/redHongBao?shouYePage=" + "FourPage"
        })
      }
      goNextPage = false;
    })
  },
  onHide: function() {
    console.log('App onHide');
    clearInterval(this.data.timer);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    new app.ToastPannel();
    token = app.globalData.user.userToken;
    runDegs = 0;
    rotate = 0;
    // isRunning = false;//是否正在抽奖
    balanceLottery = 0;
    balanceLotterySum = 0;
    dataListTemp1 = [];
    isMoving = false;
    wxIsNotBind = false;
    firstChou = true;

    // this.setOneyuanCount();
    
    wx.setNavigationBarTitle({
      title: "会员免费领商品",
    })

    shouYe3Free = options.shouYe3Free;
    //如果新用户首页3下单进来弹会员免费领的弹窗
    if (options.shouYe3Free == 'true'){
      this.setData({
        showGuiZeTitle: "会员用户可免费领商品，",
        showMemberGuiZe: true,
        bigback_image: config.Upyun + '/small-iconImages/heboImg / memberfreeling_backimage',
      });
      
      var that = this;
      //获取会员信息
      util.get_vip(function (data) {
        var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
        if (isVip <= 0) {
          that.showToast('新人福利，赠送您一次会员免费领商品资格', 5000);
        }
      })
    }else{
      this.setData({
        showGuiZeTitle: "会员用户可免费领商品，",
        showGuiZe: true,
        bigback_image: config.Upyun + '/small-iconImages/qingfengpic/yiyuangou - zhuanpan',
      });
    }

    if (options.FightSuccess) {
      this.setData({
        FightSuccess: options.FightSuccess,
        ComeFromOrder: options.comeFromOrder
      })
    }
    //机器人参团成功
    if (options.machineText) {
      this.showToast(options.machineText, 5000);
    }

    wx.setStorageSync("discountShow", false);

    var basesData = wx.getStorageSync("shop_tag_basedata");
    typelist = basesData.data.type_tag;
    //  supplabelList = basesData.data.supp_label;
    // 只取type = 1的

    var basesData = wx.getStorageSync("shop_tag_basedata");
    var supAll = basesData.data.supp_label;
    for (var i = 0; i < supAll.length; i++) {
      var type = supAll[i].type;
      if (type == 1) {
        supplabelList.push(supAll[i]);
      }
    }
    console.log("品牌列表" + supplabelList)

    if (this.data.isBalanceLottery) {
      //体验抽余额红包 剩余次数
      balanceLottery = wx.getStorageSync("BALANCE_LOTTERY");
      if (!balanceLottery) {
        balanceLottery = 0;
      }
      isFromSignBalanceLottery = options.isFromSignBalanceLottery;
    }

    this.initData(false);
    // pRatio = wx.getSystemInfoSync().pixelRatio;
    if (scollTimeOut) {
      clearInterval(scollTimeOut);
      scollTimeOut = null;
    }
    if (scollTimePause) {
      clearInterval(scollTimePause);
      scollTimePause = null;
    }

    this.lotteryDrawHttp(false);
    // this.updateChoujiangResult();//后台要求初始化后方可调此接口
    this.initLimitAwardsList();

    console.log("^^^^^^^^^^^^^^^^^" + app.globalData.systemInfo);

    var WxNotificationCenter1 = require('../../../../utils/WxNotificationCenter.js');
    WxNotificationCenter1.postNotificationName("fightFresh", "fightFinish");
  },
  onShow:function(){
    is_luckDraw = true;
  },
  dialog_close: function() {
    this.setData({

    });
  },

  //设置抽奖次数
  setOneyuanCount: function() {
    var group_price = wx.getStorageSync('wxcx_shop_group_price');
    var YuanCount = 1;
    if (group_price > 0 && app.globalData.oneYuanEvery > 0) {
      YuanCount = Math.ceil(group_price / app.globalData.oneYuanEvery);
    }
    this.setData({
      oneyuanCount: YuanCount,
      oneyuanValue: group_price,
      wxcx_shop_group_price: group_price
    })
  },

  //活动规则
  dayReward_show: function() {

    if (this.data.firstGroup > 0 || shouYe3Free == 'true') {
      this.setData({
        showGuiZeTitle: "会员用户可免费领商品，",
        showMemberGuiZe: true,
      })
    }else{
      this.setData({
        showGuiZeTitle: "会员用户可免费领商品，",
        tapshowGuiZe: true,
      })
    }
  },

  initData: function(isRefresh) {
    var that = this;
    var dataUrl = config.Host + "wallet/myWallet" +
      "?token=" + token + config.Version;
    util.httpNeedLogin(dataUrl, function(data) {
      if (data.status != 1) {
        that.showToast(data.message, 2000);
        return;
      }



      that.setData({


      });




    }, this.reInitData);
  },
  reInitData: function() {
    token = app.globalData.user.userToken;
    this.initData();
  },
  //刚进来的时候的弹窗
  initDialog: function() {
    var that = this;

  },



  //抽奖结果弹窗上面的X
  dialog_close_toBind: function() {
    this.setData({
      showChoujiangComplete: false,
      showChoujiangFinish: false,
      showChoujiangSuccessComplete: false,
    });
  },

  loginsubmit: function(e) {
    console.log();
    var formId = e.detail.formId;
    if (app.globalData.user != undefined) {
      util.httpPushFormId(formId);
    }
  },

  /**
   * 开始抽奖
   */
  startLuckBtn: function(event) {
    console.log("后台返回是否可以中奖：" + realyWinningPrize);
    var that = this;
    that.dialog_close();

    if (!is_luckDraw)//如果后台还没有反馈接口请求完毕不能抽奖
    {
      return;
    }

    if(that.data.playing)
    {
      is_luckDraw = false;//归零
    }
    
    if (!firstChou && this.data.oneyuanCount < 1) { //如果已经抽过了，再点抽奖按钮就需要下单
      that.submitOrder();
      return;
    }

    if (that.data.playing) { //正在转(点击的是停)
      wx.createSelectorQuery()
        .select('.pan').fields({
          //获取转盘的transform数值matrix
          //注意：小程序版本2.1.0及以上
          computedStyle: ['transform']
        }, function(res) {
          res.transform
        })
        .exec(function(resTransform) {
          //resTransform 返回的是一个数组
          // console.log(resTransform)
          var panTransform = resTransform[0].transform
          console.log('转盘旋转参数:' + panTransform)

          //根据matrix计算角度
          //结构： matrix(0.809004, 0.587803, -0.587803, 0.809004, 0, 0)
          //注意： 角度区间为 [-180,180]
          var values = panTransform.split('(')[1].split(')')[0].split(',');
          var a = values[0];
          var b = values[1];
          var c = values[2];
          var d = values[3];
          var scale = Math.sqrt(a * a + b * b);
          var sin = b / scale;
          //点停的时候旋转的角度
          var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
          console.log('点击停的时候的角度: ' + angle);

          //预中奖270~360 正常中奖-5~5 
    
          var leftwinningAngle = that.data.firstGroup == 2 || (shouYe3Free == 'true')? 60 : 5;
          var rightwinningAngle = that.data.firstGroup == 2 || (shouYe3Free == 'true')? 0 : 5;
          if (angle >= -leftwinningAngle && angle < rightwinningAngle) { //转到了中奖区域
            console.log("转到了中奖区域")
            WinningPrize = realyWinningPrize;
            if (WinningPrize == 0) { //可以中奖
              console.log("转到了中奖区域-可以中奖")

             var needAngle =  Math.abs(angle)


              //继续转到0度--停下中奖
              //一圈360度，用时8S，那么1度所需时间为8/360
              var needTime = needAngle * (5.5 / 360)

              needTime = Math.round(needTime * 1000)
              setTimeout(function () {
                wx.createSelectorQuery().in(that).select('.pan').fields({
                  computedStyle: ['transform']
                }, function (res) {
                  res.transform
                }).exec(function (resTransform) {
                  var panTransform = resTransform[0].transform
                  var values = panTransform.split('(')[1].split(')')[0].split(',');
                  var a = values[0];
                  var b = values[1];
                  var c = values[2];
                  var d = values[3];
                  var scale = Math.sqrt(a * a + b * b);
                  var sin = b / scale;
                  var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
                  // that.showToast("中奖了", 5000);

                  //停止
                  that.setData({
                    playing: false,
                    animate: "",
                    translatestyle: 'transform: ' + panTransform,
                    angle: angle
                  })
                })
              }, needTime);








              // that.showToast("中奖了", 5000);
              // //停止动画
              // that.setData({
              //   playing: false,
              //   animate: "",
              //   translatestyle: 'transform: ' + panTransform,
              //   angle: angle
              // })

            } else { //不能中奖---继续转到6度
              console.log("转到了中奖区域-不能中奖")
              WinningPrize = 1; //点停的时候到了中奖区域，但是用户不能中奖
              //计算出转到6度所需时间
              var needAngle = 0;
              if (angle >= 0) {
                needAngle = 6 - angle;
              } else {
                needAngle = 6 + Math.abs(angle)
              }

              //一圈360度，用时8S，那么1度所需时间为8/360
              var needTime = needAngle * (5.5 / 360)

              needTime = Math.round(needTime * 1000)
              console.log("转到了中奖区域，需要继续转到不中奖区域的时间：" + needTime);
              setTimeout(function() {




                wx.createSelectorQuery().in(that).select('.pan').fields({
                  computedStyle: ['transform']
                }, function(res) {
                  res.transform
                }).exec(function(resTransform) {
                  var panTransform = resTransform[0].transform
                  var values = panTransform.split('(')[1].split(')')[0].split(',');
                  var a = values[0];
                  var b = values[1];
                  var c = values[2];
                  var d = values[3];
                  var scale = Math.sqrt(a * a + b * b);
                  var sin = b / scale;
                  var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
                  //停止
                  that.setData({
                    playing: false,
                    animate: "",
                    translatestyle: 'transform: ' + panTransform,
                    angle: angle
                  })
                })
              }, needTime);
            }
          } else { //没转到中奖区域---直接停下来
            console.log("没有转到中奖区域")
            WinningPrize = 1; //没有点中不可以中奖
            //停止动画
            that.setData({
              playing: false,
              animate: "",
              translatestyle: 'transform: ' + panTransform,
              angle: angle
            })

          }
          //显示抽奖结果
          // that.animiComplete();
          setTimeout(function() {
              //显示抽奖结果
              that.animiComplete();
            },
            1000
          );
        })

      that.setData({
        showGuiZe: false,
        tapshowGuiZe: false,
        showMemberGuiZe: false,
      })

      that.setData({
        timer: null,
        showStopBtn: false,
        // animationData: that.animationRun.export(),
        // oneyuanCount: that.data.oneyuanCount - 1,
      })


    } else { //已停止
      //归位并重新开始旋转
      that.setData({
        playing: true,
        animate: "animate",
        translatestyle: ''
      })

      that.setData({
        showChoujiangComplete: false,
        showStopBtn: true,

      });
    }

    


    // that.dialog_close();
    // // that.showToast("旋转开始", 2000);

    // if (!firstChou && this.data.oneyuanCount < 1) { //如果已经抽过了，再点抽奖按钮就需要下单
    //   that.submitOrder();
    //   return;
    // } else {
    //   //随机一个不中奖的区域1-63
    //   // that.roateStartLuck(parseInt(Math.random() * 63 + 1));

    //   setTimeout(function () {
    //     that.roateStartLuck(parseInt(Math.random() * 63 + 1));
    //   }, 10);
    // }

    // // firstChou = false;

    // that.setData({
    //   showGuiZe: false,
    //   tapshowGuiZe: false,
    // })
  },

  //我知道了去订单详情
  startLuckBtn_Iknow: function(event) {
    goNextPage = true;

    if (this.data.showChoujiangSuccessTitle == "去申请发货") {
      if (this.data.ComeFromOrder) {
        var pages = getCurrentPages();
        var currentPage = pages[pages.length - 2];
        currentPage.setData({
          indexid: 0,
          FightSuccess: true
        });

        wx.navigateBack({})
      } else {
        wx.redirectTo({
          url: '../../../mine/order/order?indexid=0' + "&FightSuccess=" + true,
        })
      }
    } else {
      winningOrder.orderstatus = "待发货";
      wx.setStorageSync("orderitem", winningOrder);
      wx.redirectTo({
        url: '../../../mine/order/orderDetail/orderDetail?item=' + winningOrder,
      })
    }

    //关闭抽奖结果弹窗
    this.setData({
      showChoujiangSuccessComplete: false,
    })
  },

  //查看余额
  lookMoney: function() {
    goNextPage = true;
    //关闭抽奖结果弹窗
    this.setData({
      showChoujiangComplete: false,
      showChoujiangFinish: false,
      moneyDiscountShowFlag: false
    })

    wx.redirectTo({
      url: '../../../mine/wallet/wallet',
    })
  },
  //再抢一次
  startLuckBtn_Again: function(event) {

    //关闭抽奖结果弹窗
    this.setData({
      showChoujiangComplete: false,
      showChoujiangFinish: false,
      moneyDiscountShowFlag: false
    })

    this.startLuckBtn();
  },

  //去APP
  goAppBtn: function() {
    this.setData({
      showChoujiangFinish: false,
    })


    // if (app.globalData.systemInfo == "ios"){

    //   console.log("ios手机")

    // wx.navigateTo({
    //   url: "../downloadapp/downloadapp"

    // });
    this.setData({
      showIOSdownload: true,
    })


    // }else{
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
  //活动规则上的开始抽奖
  activestartLuckBtn: function(event) {

    if (!this.data.playing) {
      this.startLuckBtn();
    }
    this.setData({
      showGuiZe: false,
      tapshowGuiZe: false,
      showMemberGuiZe: false,
    })
  },
  /**
   * 开始动画
   * awardIndex 停的位置，0为中奖
   */
  roateStartLuck: function(awardIndex) {
    var that = this;


    // var runNum = 6;

    // if (isRunning) {

    //   isRunning = false;
    //   if (rotate % 360 >= 355 || rotate % 360 < 6) {
    //     WinningPrize = realyWinningPrize;//点中了真实可以中奖
    //     rotate += WinningPrize==0?0:10;
    //     //当点停的时候 如果指针所转角度在355~360 或者 0~5 再向前偏移10度

    //     var animationRun = wx.createAnimation({
    //       duration: 0,
    //       timingFunction: 'linear'
    //     });
    //     animationRun.rotate(rotate).step({ duration: 300 })
    //     that.setData({
    //       animationRun: animationRun,
    //       animationData: animationRun.export(),
    //     })
    //     clearInterval(that.data.timer)

    //   } else {
    //     WinningPrize = 1;//没有点中不可以中奖
    //     var animationRun = wx.createAnimation({
    //       duration: 0,
    //       timingFunction: 'linear'
    //     });

    //     animationRun.rotate(rotate).step({ duration: 100 })
    //     that.setData({
    //       animationRun: animationRun,
    //       animationData: animationRun.export(),
    //     })
    //     clearInterval(that.data.timer)
    //   }

    //   that.animiComplete();
    //   that.setData({
    //     timer: null,
    //     showStopBtn: false,
    //     // animationData: that.animationRun.export(),
    //     oneyuanCount: that.data.oneyuanCount - 1,
    //   })

    // } else {

    //   var awardIndex = Math.random() * 64 >>> 0;
    //   isRunning = true;

    //   that.setData({
    //     showChoujiangComplete: false
    //   });

    //   //转盘分成多少份
    //   var uniform = 64;
    //   runDegs = runDegs + (360 - runDegs % 360) + (360 * runNum - awardIndex * (360 / uniform));
    //   var animationRun = wx.createAnimation({
    //     duration: 1080000,
    //     timingFunction: 'linear'
    //   });
    //   that.animationRun = animationRun;
    //   // animationRun.rotate(runDegs).step();
    //   animationRun.rotate(90000).step();
    //   that.setData({
    //     showStopBtn: true,
    //     animationData: animationRun.export(),
    //   });

    //   if (that.data.timer == null) {
    //     var timer = setInterval(function () {
    //       rotate += 1
    //       console.log('**************roate=', rotate);


    //       that.animationRun.rotate(1).step();



    //     }, 12);

    //     that.setData({
    //       timer: timer,
    //       // animationData: that.animationRun.export(),
    //     })
    //   }


    //   // // 显示抽奖结果
    //   // setTimeout(function () {
    //   //   that.animiComplete();
    //   //   isRunning = false;
    //   // }, 4200);
    // }

  },

  //获取用户是否可以中奖
  updateChoujiangResult: function() {

    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }

    var api = "order/getOrderRaffleOrNotPrize?";
    var oldurl = config.Host + api + config.Version + '&token=' + token;
    util.http(oldurl, that.ResultCallBack);

    that.top_shopType();
  },

  ResultCallBack: function(data) {
    realyWinningPrize = data.OrNotPrize;

    //预中奖/免费领一定能中奖
    if (this.data.firstGroup == 2 || shouYe3Free == 'true')
    {
      realyWinningPrize = 0;
    }
  },

  //初始化对应订单的抽奖数据
  lotteryDrawHttp: function(paysuccess) {
    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var urlApi = that.data.firstGroup > 0 ? "order/lotteryDraw2?" : "order/lotteryDraw?";
    var oldurl = config.Host + urlApi + config.Version + '&token=' + token + '&order_code=' + wx.getStorageSync("oneYuan_order_code");

    if (paysuccess == true) {
      util.http(oldurl, that.lotteryCallBack);
    } else {
      util.http(oldurl, function(data) {
        
        if (data.status == 1) {
          //初始化后获得用户是否可中奖
          that.updateChoujiangResult();

          if (that.data.firstGroup == 2 || shouYe3Free == 'true')//预中奖/免费领一定能中奖
          {
            realyWinningPrize = 0;
          }
          if (data.remainder > 0) {
            //抽奖次数
            that.setData({
              oneyuanCount: data.remainder
            })
          }

          if (data.firstGroup != undefined) {
            global_firstGroup = data.firstGroup;
          }

        } else {
          that.showToast(data.message, 2000);
        }
        
      });
    }
  },
  lotteryCallBack: function(data) {
    var that = this;
    if (data.status == 1) {

      //初始化后获得用户是否可中奖
      that.updateChoujiangResult();

      if (that.data.firstGroup == 2 || shouYe3Free == 'true')//预中奖/免费领一定能中奖
      {
        realyWinningPrize = 0;
      }

      if (data.remainder > 0) {
        //抽奖次数
        that.setData({
          oneyuanCount: data.remainder
        })
      }

      if (that.data.firstGroup > 0) {
        that.setData({
          showGuiZeTitle: "会员用户可免费领商品，",
          showMemberGuiZe:true,
        })
      } else {
        that.setData({
          showGuiZeTitle: "会员用户可免费领商品，",
          showGuiZe: true,
        })
      }

      if (data.firstGroup != undefined) {
        global_firstGroup = data.firstGroup;
      }

      //支付成功后弹规则弹窗
      firstChou = true;
      
      // that.setOneyuanCount();
      // WxNotificationCenter.postNotificationName("luckDraw", "backPage");
    } else {
      that.showToast(data.message, 2000);
    }
  },

  //反馈后台抽奖结果
  updateChoujiangStatus: function() {

    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }

    var urlApi = that.data.firstGroup > 0 ? "order/luckDraw2?" : "order/luckDraw?";
    var oldurl = config.Host + urlApi + config.Version + '&token=' + token +
      '&order_code=' + wx.getStorageSync("oneYuan_order_code") + '&whether_prize=' + WinningPrize;

    wx.showLoading({ title: '请稍后', mask: true, });
    util.http(oldurl, that.updateCallBack);
  },

  updateCallBack: function(data) {
    firstChou = false;
    is_luckDraw = false;
    if (data.status == 1) {
      wx.hideLoading();
      if (data.remainder != undefined) {
        this.setData({
          oneyuanCount: data.remainder,
          firstGroup: data.remainder < 1 ? global_firstGroup : this.data.firstGroup
        })
      }

      //中奖订单信息
      if (WinningPrize == 0) {
        winningOrder = data.order;

        var orderShops = winningOrder.orderShops;
        var shop_from = '';
        var last_time = '';
        var issue_status = '';
        var orderstaus = '';
        var change = '';
        var item = orderShops;
        var orderstatus = "";
        var ordershopstatus = "";
        var shop_pic = "";
        var shopcode = "";
        var newshopname = "";
        var pay_money = "";
        var shop_price = "";
        var orderButtonStatus = [];
        var order_shop_data = {};

        for (var j = 0; j < orderShops.length; j++) {
          shop_pic = orderShops[j].shop_pic;
          shopcode = orderShops[j].shop_code;
          shop_price = orderShops[j].shop_price;
          newshopname = orderShops[j].shop_name;
          pay_money = pay_money;
          shop_from = shop_from;

          orderShops[j].shop_price = shop_price.toFixed(1);
          if (shop_pic != null) {
            //商品图片
            var newcode = shopcode.substr(1, 3);
            var new_pic = newcode + '/' + shopcode + '/' + shop_pic;

            //商品名称
            if (newshopname.length > 9) {
              newshopname = newshopname.substr(0, 9) + '... ';
            }
            orderShops[j]["new_shop_pic"] = new_pic;
            orderShops[j]["new_shopname"] = newshopname;
          }
        }

        var that = this;

        if (orderShops.length > 0) {

          orderShops[0]["shopPrice"] = data.order.order_price;
          orderShops[0]["shopOldPrice"] = orderShops[0]["price"];
          orderShops[0]["shopName"] = orderShops[0]["shop_name"];
          orderShops[0]["brander"] = orderShops[0]["supp_label"];
          orderShops[0]["shop_from"] = data.order.shop_from;
          order_shop_data = orderShops[0];

          wx.setStorageSync("order_shop_data", order_shop_data);

          //二级类目
          var shop_code = orderShops[0]["shop_code"];
          that.top_shopType(shop_code);
        }
      } else { //未中奖弹窗

        if (this.data.oneyuanCount < 1) {
          // this.top_shopHttp();

          var that = this;
          var shopData = wx.getStorageSync("order_shop_data");
          var order_code = wx.getStorageSync("oneYuan_order_code");
          //获取会员信息
          // util.get_vip(function(data) {
          //   var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
          //   var maxType = data.maxType != undefined ? data.maxType : 999; //会员等级
          //   var rollCount = 0;
          //   //first_group = 0  普通商品，非首单 普通抽奖
          //   //first_group = 1  新用户首单，但是商品不在预先中奖的区间内，不能多次抽奖
          //   //first_group = 2  新用户首单和会员每日首单，且商品在预先中奖的区间内，可以多次抽奖
          //   if (that.data.firstGroup == 2 || that.data.firstGroup == 1) //新用户首次/每日首次 预先中奖
          //   {
          //     if (isVip <= 0) //不是会员 首次
          //     {
          //       // that.setData({
          //       //   oneYuanDiscription: "尊敬的用户，送您会员资格，可以再免费领一轮。且点中率大幅提升！",
          //       //   oneYuanDiscriptionLeftButton: "",
          //       //   oneYuanDiscriptionRightButton: "再免费领一轮",
          //       // })

          //       wx.redirectTo({
          //         url: '../../../mine/order/order?indexid=' + 0 + "&isNewUserFirstOrder=" + true,
          //       })
          //       return;
          //     } else { //是会员 每日首次
          //       if (maxType != 6) //非至尊会员
          //       {
          //         that.setData({
          //           oneYuanDiscription: "尊贵的会员用户，送你至尊会员资格，可以免费再抢一轮。且抢中率大幅提升。",
          //           oneYuanDiscriptionLeftButton: "免费再抢一轮",
          //           oneYuanDiscriptionRightButton: "离开",
          //         })
                  
          //       } else { //至尊会员
          //         that.setData({
          //           oneYuanDiscription: "尊贵的会员用户，你可继续免费领，也可离开去浏览别的商品。",
          //           oneYuanDiscriptionLeftButton: "再点一轮",
          //           oneYuanDiscriptionRightButton: "离开",
          //         })
          //       }
          //     }
          //   } else { //不是首次/不是每日首次 普通中奖
          //     if (isVip <= 0) {
          //       // that.setData({
          //       //   oneYuanDiscription: "疯抢费已退至你的衣蝠账户，将在1-2个工作日内原路退款至你的支付账户。可在我的-订单列表里随时查看退款进度，请注意查收。",
          //       //   oneYuanDiscriptionLeftButton: "退款进度",
          //       //   oneYuanDiscriptionRightButton: "再抢一轮",
          //       // })

          //       wx.redirectTo({
          //         url: '../../../mine/order/order?indexid=' + 0 + "&isNewUserFirstOrder=" + true,
          //       })
          //       return;
          //     } else {
          //       that.setData({
          //         oneYuanDiscription: "尊贵的会员用户，你可继续免费领，也可离开去浏览别的商品。",
          //         oneYuanDiscriptionLeftButton: "再点一轮",
          //         oneYuanDiscriptionRightButton: "离开",
          //       })
          //     }
          //   }
            
            
          //   that.setData({
          //     is_vip: isVip,
          //     rollCount: rollCount,
          //     moneyDiscountShowFlag: true
          //   })
          //   is_luckDraw = true;
          // })

          //2020-3-18 最新修改
          wx.redirectTo({
            url: '../../../mine/order/order?indexid=' + 0 + "&isNewUserFirstOrder=" + true,
          })
        } else {
          this.setData({
            showChoujiangComplete: true,
          });
          is_luckDraw = true;
        }

      }
      
    } else {
      is_luckDraw = true;
      wx.hideLoading();
      this.showToast(data.message, 2000);
    }

  },
  //中奖后弹框
  showChoujiangSuccess: function() {
    var shopData = wx.getStorageSync("order_shop_data");
    var brander = shopData.brander ? shopData.brander : '衣蝠';
    var discription = "";
    var share_price = shopData.shopPrice + '元';
    var share_oldprice = shopData.shopOldPrice + '元';
    var share_name = '';

    if (this.data.type_data != undefined && this.data.type_data != "" && this.data.type_data != null) {
      share_name = brander + this.data.type_data;
    } else {
      share_name = brander + shopData.shopName;
    }

    var showChoujiangSuccessTitle = "我知道了";
    var showChoujiangNopay = 1;//普通中奖
    var shop_from = shopData.shop_from;
    if (shop_from == 13)
    {
      showChoujiangSuccessTitle = '去申请发货';
      showChoujiangNopay = 0;//免费中奖
    } else if (this.data.firstGroup > 0){
      showChoujiangSuccessTitle = '去申请发货';
      showChoujiangNopay = 2;//预中奖
    } 

    this.setData({
      showChoujiangSuccessComplete: true,
      showChoujiangNopay: showChoujiangNopay,
      showChoujiangSuccessTitle: showChoujiangSuccessTitle,
      showChoujiangSuccessData: discription,
      share_price: share_price,
      share_oldprice: share_oldprice,
      share_name: share_name,
    });
  },
  //获取二级类目
  top_shopType: function(shop_code) {
    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var shopData = wx.getStorageSync("order_shop_data");
    var shopCode = shop_code ? shop_code : (shopData.shopCode ? shopData.shopCode : '');
    var oldurl = config.Host + 'shop/queryShopType2?' + config.Version + '&token=' + token + '&shop_code=' + shopCode;
    util.http(oldurl, function(data) {
      if (data.status == 1) {
        that.setData({
          type_data: data.type2
        })

        if (shop_code != undefined) {
          //获取申请发货的微信号
          util.get_WxhNumber(function(data) {
            that.setData({
              wx_number: data.wxh != undefined ? data.wxh : ""
            })
            that.showChoujiangSuccess(); //弹出用户中奖提示弹框
          });
        }
      }
      is_luckDraw = true;//可以抽奖
    });
  },
  type_data: function(data) {
    if (data.status == 1) {
      this.setData({
        type_data: data.type2
      })
    }
  },

  //抽奖结果
  animiComplete: function() {
    console.log("处理抽奖结果，是否中奖 WinningPrize：" + WinningPrize)

    //更新后台抽奖状态
    this.updateChoujiangStatus();

    //获取用户是否中奖 如果是预中奖就不用调
    if(global_firstGroup != 2)
    {
      this.updateChoujiangResult();
    }
  },

  //获取数据     1元购抢购列表
  initLimitAwardsList: function() {
    var that = this;
    for (var i = 0; i < 50; i++) {
      dataListTemp1.push(that.addToLimitList());
    }
    that.setData({
      mListData1: dataListTemp1
    });
    that.count_down();
  },


  count_down: function() {
    var that = this;
    if (scollTimeOut) {
      clearInterval(scollTimeOut);
      scollTimeOut = null;
    }
    if (isMoving) {
      return;
    }

    if (!this.data.isMad || this.data.isBalanceLottery) {
      this.setData({
        scrollTop1: this.data.scrollTop1 + 61,
        scrollTop2: this.data.scrollTop2 + 61
      });
    } else {
      this.setData({
        scrollTop1: this.data.scrollTop1 + 61
      });
    }
    scollTimeOut = setTimeout(function() {
      that.count_down();
    }, 1000)
  },
  scrolltolower1: function() {
    var temp1 = this.data.mListData1;
    // for (var i in dataListTemp1) {
    //   temp1.push(dataListTemp1[i]);
    // }\
    Array.prototype.push.apply(temp1, dataListTemp1);
    this.setData({
      mListData1: temp1
    });
  },


  out_touchend: function() {
    var that = this;
    if (isMoving) {
      isMoving = false;
      if (scollTimePause) {
        clearInterval(scollTimePause);
        scollTimePause = null;
      }
      scollTimePause = setTimeout(function() {
        that.count_down();
      }, 1500);
    }
    // console.log("out_touchend", isMoving);
  },
  out_touchmove: function() {
    isMoving = true;
    if (scollTimeOut) {
      clearInterval(scollTimeOut);
      scollTimeOut = null;
    }
    // console.log("out_touchmove", isMoving);
  },

  addToLimitList: function() {
    var limitData = {};
    limitData["nname"] = util.getVirtualName() + "***" + util.getVirtualName();
    limitData["num"] = parseInt(Math.random() * 300 + 100) + ".0";

    //随机品牌
    var randomSub = supplabelList[parseInt(Math.random() * (supplabelList.length - 1))].name;

    //随机二级类目

    var randomType2 = typelist[parseInt(Math.random() * (typelist.length - 1))].class_name;

    //x元购
    var buypriceData = ["9.9", "19.9", "29.9", ""];
    var buyprice = buypriceData[parseInt(Math.random() * (buypriceData.length - 1))];

    // limitData["content"] = buyprice + "元买走了" + randomSub + randomType2;
    limitData["content"] = "免费领走了" + randomSub + randomType2;
     
    limitData["pic"] = config.Upyun + "defaultcommentimage/" + util.getDefaultImg();
    return limitData;
  },

  // 提交订单
  submitOrder: function() {

    var that = this;

    var order_channel = wx.getStorageSync("advent_channel")
    var dataUrl = config.Host + 'order/addOrderAg?' + config.Version + '&token=' + token + '&order_code=' + wx.getStorageSync("oneYuan_order_code");
    if (order_channel)
    {
      dataUrl = config.Host + 'order/addOrderAg?' + config.Version + '&token=' + token + '&order_code=' + wx.getStorageSync("oneYuan_order_code") + '&order_channel=' + order_channel;
    }
    util.http(dataUrl, that.confirmorderResult);
    this.setData({
      dataurl: dataUrl,
      tapshowGuiZe: false
    });
  },

  // 提交订单结果
  confirmorderResult: function(data) {

    var that = this;

    if (data.status == 1) {
      this.setData({
        totalAccount: data.price
      })
      

      // wxpaycx / wapUinifiedOrder 单个;wxpaycx / wapUinifiedOrderList 多个
      var payUrl = 'wxpaycx/wapUinifiedOrderList?';
      if (data.url == 1 || this.data.buyType == 1)
        payUrl = 'wxpaycx/wapUinifiedOrder?';

      var order_code = data.order_code;
      wx.setStorageSync("oneYuan_order_code", order_code);

      if(order_code != undefined && order_code.length >0)
      {
        this.orderStatistic(order_code);
      }
      
      //保存当前1元下单的链接
      wx.setStorageSync("oneYuanOrderUrl", this.data.dataurl);

      var tri = data.tri != undefined ? data.tri : 0;
      var vip_type = data.vip_type != undefined ? data.vip_type : '';
      if (tri == 1) //去补卡
      {
        goNextPage = true;
        wx.redirectTo({
          url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=' + 'oneBuyLuckPan' + "&vip_type=" + vip_type ,
        })
        return;
      } else if (tri == 2){//去办卡
        this.setData({
          upperMemberYiFuShow:true
        })
        return;
      }

      if (Number(data.price) == 0) { //不用支付直接开始抽奖
        //支付成功后初始化抽奖信息
        this.lotteryDrawHttp(true);
        return;
      }

      //不是新用户就需要支付
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId, 3rd_session
          if (res.code) {
            var dataUrl = config.PayHost + payUrl + config.Version + "&token=" + app.globalData.user.userToken + '&order_code=' + order_code + '&order_name=我的' + '&code=' + res.code;
            util.http(dataUrl, that.orderPayResult)
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
            that.showToast('获取用户登录态失败！' + res.errMsg, 2000);
          }
        }
      })

    } else {
      this.showToast(data.message, 2000);
    }
  },

  //订单统计
  orderStatistic: function (order_code){
    var click_id = wx.getStorageSync('gdt_vid')
    if (click_id) {
      var clickUrl = config.Host + 'wxMarkting/marketing_order?' + config.Version
        + '&click_id=' + click_id
        + '&order_code=' + order_code
        + "&channel=" + wx.getStorageSync("advent_channel")
        + "&token=" + app.globalData.user.userToken
        ;

      util.http(clickUrl, function (data) { 
        if(data.status == 1)
        {
          wx.setStorageSync("gdt_vid", "")
        }
      });
    }
  },
  // 支付
  //   appId: "wxeb7839c8cbeef680"
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

          //支付成功后初始化抽奖信息
          that.lotteryDrawHttp(true);

          // //支付成功自动抽奖
          // firstChou = true;
          // that.setOneyuanCount();
          // //随机一个不中奖的区域1-63
          // that.roateStartLuck(parseInt(Math.random() * 63 + 1));
        },
        'fail': function(res) {
          that.showToast('支付失败', 2000);

          //第一次点关闭的时候弹1元购返还说明弹框 后面不用再弹
          if (wx.getStorageSync("discountShow") != true) {
            that.top_shopHttp();
          }
        }
      })
    } else {
      that.showToast(data.message, 2000);
    }

  },


  //获取可抵扣余额
  top_shopHttp: function() {
    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var oldurl = config.Host + 'order/getZeroOrderDeductible?' + config.Version + '&token=' + token;
    util.http(oldurl, that.discount_data);
  },
  discount_data: function(data) {
    if (data.status == 1) {
      this.setData({
        oneYuanDiscriptionTitle: '疯抢返还说明',
        moneyDiscountShowFlag: true,
        moneyDiscount: data.order_price.toFixed(1),
      })

      wx.setStorageSync("discountShow", true);
    }
  },

  //余额抵扣弹窗点击再抢一轮
  getYiDouBtn: function() {

    //关闭抽奖结果弹窗
    this.setData({
      showChoujiangComplete: false,
      showChoujiangFinish: false,
      moneyDiscountShowFlag: false
    })

    if (this.data.oneYuanDiscriptionRightButton == "离开"){
      wx.navigateBack({})
    } else if (this.data.oneYuanDiscriptionRightButton == "免费再抢一轮" || this.data.oneYuanDiscriptionRightButton == "再免费领一轮") {
      this.lotteryDrawHttp(true);
    } else if (this.data.oneYuanDiscriptionRightButton == "退款进度") {
      if (this.data.ComeFromOrder) {
        var pages = getCurrentPages();
        var currentPage = pages[pages.length - 2];
        currentPage.setData({
          indexid: 0,
        });

        wx.navigateBack({})
      } else {
        wx.redirectTo({
          url: '../../../mine/order/order?indexid=0' + "&FightSuccess=" + this.data.FightSuccess,
        })
      }
    } else{
      //用户如果是第一次疯抢 去首页4
      if (this.data.rollCount == 1) {
        goNextPage = true;
        wx.redirectTo({
          url: "/pages/shouye/redHongBao?shouYePage=" + "FourPage"
        })
      } else {
        this.startLuckBtn();
      }
    }
  },

  //退款进度-订单列表 //离开
  getYueBtn: function() {
    goNextPage = true;
    if (this.data.oneYuanDiscriptionLeftButton == "离开") {
      wx.navigateBack({})
    } else if (this.data.oneYuanDiscriptionLeftButton == "免费再抢一轮" || this.data.oneYuanDiscriptionRightButton == "再免费领一轮") {
      this.lotteryDrawHttp(true);
    } else if (this.data.oneYuanDiscriptionLeftButton == "退款进度") {
      if (this.data.ComeFromOrder)
      {
        var pages = getCurrentPages();
        var currentPage = pages[pages.length - 2];
        currentPage.setData({
          indexid: 0,
        });

        wx.navigateBack({})
      }else{
        wx.redirectTo({
          url: '../../../mine/order/order?indexid=0' + "&FightSuccess=" + this.data.FightSuccess,
        })
      }
    } else {
      //用户如果是第一次疯抢 去首页4
      if (this.data.rollCount == 1) {
        goNextPage = true;
        wx.redirectTo({
          url: "/pages/shouye/redHongBao?shouYePage=" + "FourPage"
        })
      } else {
        this.startLuckBtn();
      }
    }

    this.setData({
      moneyDiscountShowFlag: false
    })
  },

  //关闭弹窗
  closeYiDouBtn: function() {
    this.setData({
      moneyDiscountShowFlag: false
    })
  },
  //关闭会员弹窗
  closeNewThirty:function(){
    this.setData({
      upperMemberYiFuShow:false
    })
  },
  //去办卡
  memberSubmit:function(){
    goNextPage = true;
    wx.redirectTo({
      // url: '/pages/mine/member/member?memberComefrom=' + 'luckdraw' ,

      url:'/pages/mine/addMemberCard/addMemberCard?vip_type=-1001'
    })
    this.setData({
      upperMemberYiFuShow: false
    })
  }
})