// pages/mine/addMemberCard/addMemberCard.js
import config from '../../../config.js';
var app = getApp();
var util = require('../../../utils/util.js');
var fightUtil = require('../../../utils/freeFightCutdown.js');
import ToastPannel from '../../../common/toastTest/toastTest.js';
var WxNotificationCenter = require("../../../utils/WxNotificationCenter.js");

var vipList = []; //会员卡列表
var userVipList = []; //已办会员卡列表

var checkIndex = 0;


var vip_count = 1; //要办的会员卡数量

var jump = 1; //来源  1：个人中心，2商品详情

var from_type = -1000
var from_type_name = -1000

var kaiKaVipType;

var loginCount;

var loginClick = 0;

var checkCardHave = false //当前选中的会员卡是否已经办理

// var extract = 0;//用户点用来抵扣点可提现额度


var fixMoney = 0.00; //用户点用来抵扣将奖励金



var choosePayPrice = 0; //用户选中会员卡后底部显示点支付价格


var overVipIndex; //欠费的卡的序号

var loadVipType = 5;

var comefromTXkaDialog = 0; //是否是从1提现卡、2免拼卡、3发货卡弹窗进来的、订单列表免费领按钮 5、转盘成为会员进来的


//from_type:
//   - 1抽奖次数不足且有失效的会员卡
//   -2会员卡抽奖次数但无失效会员卡，以及会员卡等级不够
//   - 3用户所有的会员卡全部作废

var isLoginSuccess = true;

var balance = 0; //用户所有的会员卡卡费


var trialcash_num = 1; //每张提现卡给的提现机会次数



var firstDiamondCard; //是否是首张钻石卡--1是首张
var firstCashcard; //是否是首张提现卡--1是首张




var raffle_money; //当日抽中的虚拟奖金  

var twoDiamondCard; //是不是要补第二张钻石卡  0不补  1补

var freeOrder; //是否有199元以下的免费领订单  0没有 1有

var pay_v_code; //下单后返还的订单号

var one_price;

var trialIsBuy; //是否二次购买过提现卡

var vip_roll_type; //申请发货需要的会员卡

var isvip_paysuccess = false; //是否买会员卡成功

var paySucDialogData; //购买卡后提示信息上面的数据

var newbie02_comefrom = false;//首日第二次刷新任务
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperH: '', //swiper高度
    nowIdx: 0, //当前swiper索引
    vipPrice: '0.00',
    freeCount: "0",
    current: 0,
    vip_count: 1,
    Upyun: config.Upyun,
    img_jian: "vip_couot_jian_end_new",
    img_jia: "vip_couot_jia_new",
    patBTname: '开通并支付',
    showInviteFriends: true,

    upyconfig: config.Upyun,
    jianglijin_name: "现金",
    messageanimationData: {},
    showPaySuccessDialog: false,

    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},
    length: 0,
    secondimgData: ['complaint_1.png', 'complaint_2.png', 'complaint_3.png'],
    secondtextData: ['发送给朋友', '添加到我的小程序', '添加到桌面'],
    thirdimgData: ['complaint_4.png', 'complaint_5.png', 'complaint_6.png', 'complaint_7.png'],
    thirdtextData: ['浮窗', '设置', '反馈与投诉', '重新进入小程序'],
  },

  //获取swiper高度
  getHeight: function(e) {
    var winWid = wx.getSystemInfoSync().windowWidth - 2 * 50; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width; //图片宽度
    var sH = winWid * imgh / imgw - 20 + "px"

    var swhpx = winWid * imgh / imgw - 20;


    this.setData({
      jiatoutop: (swhpx + 40) / 2 - 13,
      swiperH: sH //设置高度
    })
  },
  //swiper滑动事件
  swiperChange: function(e) {
    this.setData({
      nowIdx: e.detail.current,
      img_jian: "vip_couot_jian_end_new",
      img_jia: "vip_couot_jia_new",
    })
    vip_count = 1
    checkIndex = e.detail.current

    vip_count = vipList[checkIndex].purchase_num; //默认买的数量

    choosePayPrice = vipList[checkIndex].vip_num ?
      (vipList[checkIndex].arrears_price > 0 ? vipList[checkIndex].arrears_price.toFixed(2) : vipList[checkIndex].vip_price.toFixed(2)) : vipList[checkIndex].vip_price.toFixed(2);



    if (choosePayPrice <= 0) {
      choosePayPrice = 0.00
    }

    if (vipList[checkIndex].vip_code) {
      checkCardHave = true
    } else {
      checkCardHave = false

    }

    //如果用户买了半张钻石卡切到钻石卡界面均弹此框 2020-3-23修改
    if (twoDiamondCard == 1 && vipList[checkIndex].vip_type == 4 && isvip_paysuccess != true) {
      var that = this;
      if (!that.data.is_fresh) {
        var cutdowntime = 30 * 60 * 1000;
        fightUtil.countdown(that, fightUtil, cutdowntime, function(data) {
          that.setData({
            is_fresh: true,
            zuanshiDaoJishiStr: data + "后失效"
          })
        })
        that.setData({
          showBuQaunZaunShi: true,
        })
      } else {
        that.setData({
          showBuQaunZaunShi: true
        })
      }
    }
    if (isvip_paysuccess) {
      isvip_paysuccess = false;
    }


    this.setData({

      checkCardHave: checkCardHave,

      vipPrice:


        vipList[checkIndex].arrears_price > 0 ? vipList[checkIndex].arrears_price.toFixed(2) : vipList[checkIndex].vip_price.toFixed(2)

        ,

      o_price: vipList[checkIndex].original_vip_price * vip_count + "元",


      //  vipList[checkIndex].vip_num ? vipList[checkIndex].vip_balance : 



      //  vipList[checkIndex].vip_price,






      payPrice: isLoginSuccess ? "" : choosePayPrice,

      // patBTname: vipList[checkIndex].arrears_price > 0 ? '补足会员费' : '预存并开通',

      // payName: vipList[checkIndex].arrears_price > 0 ? "补足会员卡费" : "预存",


      payName: "预存",

      patBTname: from_type_name == -1 ? '开通新卡免费领美衣' : '预存并开通',

      cashabletime: vipList[checkIndex].cashabletime,

      freeCount: vipList[checkIndex].free_count,
      shopPrice: vipList[checkIndex].vip_price,
      vip_cardName: vipList[checkIndex].vip_name,
      vip_count: vip_count,



      showPay: true,

      showCount: vipList[checkIndex].arrears_price == 0 || !vipList[checkIndex].arrears_price,

    })



    //如果登录了显示的支付价格就调接口取
    if (isLoginSuccess) {
      this.getPayPrice();
    }



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    // app.globalData.first_diamond = 1;
    // wx.redirectTo({
    //   url: "/pages/shouye/redHongBao?shouYePage=" + "ThreePage"
    // })
    // return

    comefromTXkaDialog = 0;
    from_type = -1000;

    var that = this;

    //大促销已结束
    if (app.globalData.user != null) {
      var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
      that.setData({
        showMainPage: true,
        showendofpromotionDialog: showendofpromotionDialog
      })
    } else {
      that.setData({
        showMainPage: true,
        showendofpromotionDialog: true
      })
    }
    
    wx.setNavigationBarTitle({
      title: '选择会员类型',
    })
    
    // options.memberComefrom= undefined

    if (options.memberComefrom == "draw") {
      comefromTXkaDialog = 1;
    } else if (options.memberComefrom == 'freeFight') {
      // comefromTXkaDialog = 2;
    } else if (options.memberComefrom == 'deliver') {
      comefromTXkaDialog = 3;
    } else if (options.memberComefrom == 'freelingOrder') {
      comefromTXkaDialog = 4;
    } else if (options.memberComefrom == 'draw_vip') {
      comefromTXkaDialog = 5;
    } else if (options.memberComefrom == 'Fight') {
      comefromTXkaDialog = 6;
    } else if (options.memberComefrom == 'sign_tixian'){
      comefromTXkaDialog = 7;
    }

    if (options.vip_roll_type != undefined) {
      vip_roll_type = options.vip_roll_type;
    }

    if (options.memberComefrom == "mine") {
      jump = 1;
    } else {
      jump = 2;

    }

    new app.ToastPannel();
    from_type = options.vip_type
    if (options.memberComefrom == 'order') {
      from_type = -1005;
    }
    
    newbie02_comefrom = false;
    if(options.memberComefrom == 'newbie02')
    {
      newbie02_comefrom = true;
      this.showToast("非会员只能领一个任务。会员每日可领5个任务。请成为会员后再领任务并提现。", 5000);
    }
    //转盘提现10元引导进来的
    if (options.memberComefrom == "draw_vip_tixian") {
      that.showToast("成为会员后，立即提现10元！且同时享受钻石会员的四大特权！", 5000);
    }

    from_type_name = from_type
    if (from_type == -1) {
      //会员用户免费次数领完后有失效的会员卡
      // 提示：尊敬的衣蝠会员，您的会员卡费已被用于购买商品，补足会员卡费后即可继续免费领。
      // 跳失效会员卡

      // this.showToast("尊敬的衣蝠会员，您的会员卡费已被用于购买商品，补足会员卡费后即可继续免费领。", 5000);
      this.showToast("因会员卡费不足会员资格已失效，现在开通新卡立即赠送一件399元的美衣哦。", 5000);


    } else if (from_type == -2) {
      // 会员用户免费次数领完后没有失效的会员卡，以及用户有免费领次数，但是点的是有效会员卡以外的商品
      // 提示：尊敬的衣蝠会员，您的会员免费领权益不足，升级会员卡后即可继续免费领。
      // 跳899至尊卡

      this.showToast("尊敬的衣蝠会员，您今日的会员卡免费领次数已使用完，购买新的会员卡后即可继续免费领", 5000);

    } else if (from_type == -3) {
      // 会员用户因为抵扣所有的会员卡全部作废后
      // 提示：尊敬的衣蝠会员，您的会员卡费已被全额用于购买商品，请重新购买会员卡。
      // 跳59.9金卡
      this.showToast("尊敬的衣蝠会员，您的会员卡费已被全额用于购买商品，请重新购买会员卡。", 5000);

    } else if (from_type == -4) {
      // 尊敬的衣蝠会员，您当前的会员卡只能免费领" + 10000+"元以下商品，请购买高等级的会员卡免费领更多商品。

    } else if (from_type == -5) { //订单列表非会会员免费领打卡完成后点击申请发货,停留在钻石卡上面
      this.showToast("免费领是会员特权，成为会员后，即可免费发货。", 5000);

    } 

    setTimeout(function() {
      that.setData({
        isShowCustomTv: true,
      });
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
        delay: 5000,
      })
      animation.translateX(50).opacity(0).step()
      that.setData({
        messageanimationData: animation.export()
      })
    }, 2000);

    this.initVipData(-1)
  },

  initVipData: function(kaiKa_vipType) {
    fixMoney = 0.00;
    var that = this;
    checkIndex = 0
    vipList = []
    userVipList = []
    //默认购买一张卡
    vip_count = 1

    that.setData({
      vip_count: 1
    })
    var requestUrl
    if (app.globalData.user) {
      isLoginSuccess = true
      var isFromSign2Round = newbie02_comefrom ? 1 : 0;
      requestUrl = config.Host + 'userVipType/queryByVipList?token=' + app.globalData.user.userToken + '&jump=' + 1 + config.Version + '&isFromSign2Round=' + isFromSign2Round;
    } else {
      isLoginSuccess = false


      that.setData({
        showLoginDialog: true
      })


      requestUrl = config.Host + 'userVipType/queryByVipList?jump=' + 1 + config.Version;

    }
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    util.http(requestUrl, function(data) {

      if (data.status == 1) {

        balance = data.balance;

        trialcash_num = data.trialcash_num;

        twoDiamondCard = data.twoDiamondCard;
        raffle_money = data.raffle_money;


        twoDiamondCard = data.twoDiamondCard;
        trialIsBuy = data.trialIsBuy;

        firstDiamondCard = data.firstDiamondCard;
        firstCashcard = data.firstCashcard;

        vipList = data.viplist; //会员列表

        loadVipType = data.landPage;

        if (data.userVipList) {
          userVipList = data.userVipList; //已开会员列表
        }

        if (from_type == -4) { //-4的提示需要取最高会员卡的金额并提示

          var maxPrice_section = userVipList[0].price_section;

          for (var i = 0; i < userVipList.length; i++) {
            if (userVipList[i].price_section > maxPrice_section) {
              maxPrice_section = userVipList[i].price_section
            }
          }
          that.showToast("尊敬的衣蝠会员，您当前的会员卡只能免费领" + maxPrice_section + "元以下商品，请购买高等级的会员卡免费领更多商品。", 5000);
          // from_type = -1000
        }

        //整合列表
        for (var vipIndex in vipList) {


          for (var userVipIndex in userVipList) {



            if (vipList[vipIndex].vip_type == userVipList[userVipIndex].vip_type) {


              //添加vipList中不存在的数据
              vipList[vipIndex].arrears_price = userVipList[userVipIndex].arrears_price;
              vipList[vipIndex].vip_balance = userVipList[userVipIndex].vip_balance;
              vipList[vipIndex].vip_num = userVipList[userVipIndex].vip_num;
              vipList[vipIndex].vip_code = userVipList[userVipIndex].vip_code;
              vipList[vipIndex].num = userVipList[userVipIndex].num;
              vipList[vipIndex].count = userVipList[userVipIndex].count;
              vipList[vipIndex].user_vip_price = userVipList[userVipIndex].vip_price;


              vipList[vipIndex].arrears_price = vipList[vipIndex].arrears_price ? vipList[vipIndex].arrears_price : 0;



              if (vipList[vipIndex].info_url) {
                vipList[vipIndex].info_url = vipList[vipIndex].info_url + '?' + Math.random()
              }

              //添加userVipList中不存在的数据
              // userVipList[userVipIndex].url = vipList[vipIndex].url
              // userVipList[userVipIndex].vip_name = vipList[vipIndex].vip_name
              // userVipList[userVipIndex].free_count = vipList[vipIndex].free_count
              // userVipList[userVipIndex].head_url = vipList[vipIndex].head_url
              // userVipList[userVipIndex].vip_price = vipList[vipIndex].vip_price
              // userVipList[userVipIndex].info_url = vipList[vipIndex].info_url
              // userVipList[userVipIndex].cashabletime = vipList[vipIndex].cashabletime
              // userVipList[userVipIndex].free_count = vipList[vipIndex].free_count
              // userVipList[userVipIndex].free_num = vipList[vipIndex].free_num



              //处理days
              // userVipList[userVipIndex].days =
              //   userVipList[userVipIndex].context ? userVipList[userVipIndex].context + '' : ""

              vipList[vipIndex].days = userVipList[userVipIndex].context ? userVipList[userVipIndex].context + '' : ""



              //处理substance
              // userVipList[userVipIndex].substance =
              //   userVipList[userVipIndex].substance ? userVipList[userVipIndex].substance + '' : ""

              vipList[vipIndex].substance = userVipList[userVipIndex].substance ? userVipList[userVipIndex].substance + '' : ""



              var isOverVip = false //是否欠费--需要补卡
              if (vipList[vipIndex].arrears_price > 0) {
                isOverVip = true
                overVipIndex = vipIndex;
                vipList[vipIndex].isOver = true
              }

              //处理cardName
              if (isOverVip) {


                // userVipList[userVipIndex].cardName =
                //   (userVipList[userVipIndex].vip_num - 1 <= 0) ? userVipList[userVipIndex].vip_name :
                //     "已有" + userVipList[userVipIndex].vip_name + "X" + (userVipList[userVipIndex].vip_num - 1)

                vipList[vipIndex].cardName =
                  (userVipList[userVipIndex].vip_num - 1 <= 0) ? vipList[vipIndex].vip_name :
                  "已有" + vipList[vipIndex].vip_name + "X" + (userVipList[userVipIndex].vip_num - 1)



              } else {
                // userVipList[userVipIndex].cardName =
                //   userVipList[userVipIndex].vip_num > 0 ? "已有" + userVipList[userVipIndex].vip_name + "X" + userVipList[userVipIndex].vip_num : userVipList[userVipIndex].vip_name + ""

                vipList[vipIndex].cardName =
                  userVipList[userVipIndex].vip_num > 0 ? "已有" + vipList[vipIndex].vip_name + "X" + userVipList[userVipIndex].vip_num : vipList[vipIndex].vip_name + ""
              }










              //处理总金额userVipMoney
              // userVipList[userVipIndex].userVipMoney = vipList[vipIndex].vip_balance ? 
              //   '卡费￥' + vipList[vipIndex].vip_balance.toFixed(2) : ""


              // vipList[vipIndex].userVipMoney = balance && balance >0 ?
              //   '预存￥' + balance : ""

              // userVipList[userVipIndex].userVipMoney =
              //   userVipList[userVipIndex].vip_num > 0 ? '卡费￥' + userVipList[userVipIndex].vip_num * userVipList[userVipIndex].vip_price : ""


            }

            vipList[vipIndex].userVipMoney = balance && balance > 0 ?
              '已预存￥' + balance : ""


          }
          //没有办的会员卡cardName要取vip_name
          if (!vipList[vipIndex].cardName) {
            vipList[vipIndex].cardName = vipList[vipIndex].vip_name
          }

        }

        //排序，将已开通的会员的最高级别的放在前面
        //vipList中已经去掉已开卡的会员
        // for (var i = 0; i < vipList.length; i++) {
        //   if (vipList[i].vip_code) {
        //     vipList.splice(i, 1);
        //     i--;
        //   }
        // }
        //合并vipList和userVipList
        // vipList = userVipList.concat(vipList)
        var size = vipList.length

        //默认index
        var currentIndex = 0;
        for (var i = 0; i < vipList.length; i++) {
          if (vipList[i].vip_type == loadVipType) {
            currentIndex = i
          }
        }


        //开卡的默认切到金卡(没有办过卡的)
        if (from_type == -1002) {
          for (var i = 0; i < vipList.length; i++) {
            if (vipList[i].vip_type == 2) {
              currentIndex = i
            }
          }
        }

        //个人中心点进来的切到已办的最高会员不包括提现卡免拼卡发货卡
        if (jump == 1 && from_type == -1003) {
          var maxIdex = 0;
          for (var i = 0; i < vipList.length; i++) {
            var vip_type = vipList[i].vip_type;
            if (vipList[i].vip_code && vip_type != 7 && vip_type != 8 && vip_type != 9) {
              if (vipList[i].vip_type > maxIdex) {
                maxIdex = i;
                currentIndex = maxIdex
              }
            }
          }
        }


        if (from_type == -3 || from_type == -5) { //-3跳59.9（钻石）
          //找到钻石卡的index
          for (var i = 0; i < vipList.length; i++) {
            if (vipList[i].vip_type == 4) {
              currentIndex = i
            }
          }
        }



        if (from_type == -2 || from_type == -1001 || from_type == -4) { //切换到至尊会员(成为至尊会员的按钮点进来也要切到至尊会员)
          //找到至尊卡的index
          for (var i = 0; i < vipList.length; i++) {
            if (vipList[i].vip_type == 6) {
              currentIndex = i
            }
          }
        }

        if (from_type == -1005 || from_type == -1) { //切换到皇冠会员(订单列表申请发货-皇冠会员)，欠费提示也切换到皇冠卡
          //找到至尊卡的index
          for (var i = 0; i < vipList.length; i++) {
            if (vipList[i].vip_type == 5) {
              currentIndex = i
            }
          }
        }



        //开了提现卡就切到钻石卡并弹窗
        // if (kaiKa_vipType == -1) {
        //   for (var i = 0; i < vipList.length; i++) {
        //     if (vipList[i].vip_type == 7 && vipList[i].vip_code) { //刚进来，开了提现卡
        //       //切到钻石卡
        //       for (var m = 0; m < vipList.length; m++) {
        //         if (vipList[m].vip_type == 4) {
        //           that.setData({
        //             showTixiankaDialog: true
        //           })
        //           currentIndex = m;
        //           break;
        //         }
        //       }
        //     }
        //   }
        // }




        //提现卡弹窗进来的切到提现卡
        if (comefromTXkaDialog == 1 || comefromTXkaDialog == 7) {
          for (var i = 0; i < vipList.length; i++) {
            if (vipList[i].vip_type == 7) {
              currentIndex = i
            }
          }
          if (kaiKa_vipType == -1)
          {
            wx.setStorageSync('tixian_count', firstCashcard == 1 ? '0' : '1')
          }
        }

        //发货卡弹窗进来的切到发货卡
        if (comefromTXkaDialog == 3) {
          for (var i = 0; i < vipList.length; i++) {
            if (vipList[i].vip_type == 8) {
              currentIndex = i
            }
          }
        }

        //免拼卡弹窗进来的切到提现卡
        if (comefromTXkaDialog == 2) {
          for (var i = 0; i < vipList.length; i++) {
            if (vipList[i].vip_type == 9) {
              currentIndex = i
            }
          }
        }
        //订单列表免费领按钮进来并且有需要补足的钻石卡，切到钻石卡、皇冠卡、至尊卡
        if (comefromTXkaDialog == 4) {
          if (vip_roll_type > 0) {
            for (var i = 0; i < vipList.length; i++) {
              if (vipList[i].vip_type == vip_roll_type) {
                currentIndex = i
              }
            }
          }
        }


        //kaiKa_vipType 切换到刚开的卡
        //找刚开的卡的index
        if (kaiKa_vipType != -1) {
          for (var i = 0; i < vipList.length; i++) {
            if (vipList[i].vip_type == kaiKaVipType) {
              currentIndex = i
            }
          }
        }


        checkIndex = currentIndex

        //如果用户买了半张钻石卡切到钻石卡界面均弹此框 2020-3-23修改
        // if (twoDiamondCard == 1 && vipList[currentIndex].vip_type == 4 && isvip_paysuccess != true) {

        //   var cutdowntime = 30 * 60 * 1000;
        //   fightUtil.countdown(that, fightUtil, cutdowntime, function(data) {
        //     that.setData({
        //       is_fresh: true,
        //       zuanshiDaoJishiStr: data + "后失效"
        //     })
        //   })
        //   that.setData({
        //     showBuQaunZaunShi: true
        //   })
        // }

        choosePayPrice = vipList[currentIndex].vip_num ?
          (vipList[currentIndex].arrears_price > 0 ? vipList[currentIndex].arrears_price.toFixed(2) : vipList[currentIndex].vip_price.toFixed(2)) : vipList[currentIndex].vip_price.toFixed(2);




        if (choosePayPrice <= 0) {
          choosePayPrice = "0.00"
        }

        if (vipList[currentIndex].vip_code) {
          checkCardHave = true
        } else {
          checkCardHave = false
        }






        //默认张数
        vip_count = vipList[currentIndex].purchase_num;


        //办过卡的权益替换为equityYet(提现卡和钻石卡)
        for (var i = 0; i < vipList.length; i++) {
          // if (vipList[i].vip_type == 7 && firstCashcard != 1) {
          //   vipList[i].equity = vipList[i].equityYet;
          // }else if (vipList[i].vip_type == 4 && firstDiamondCard != 1) {
          //   vipList[i].equity = vipList[i].equityYet;
          // }

          //2020-7-21 何波重新修改
          if (vipList[i].vip_code)
          {
            vipList[i].equity = vipList[i].equityYet;
          }
          for (var j = 0; j < vipList[i].equity.length; j++){
            var equity_content = vipList[i].equity[j].equity_content;
            var replace = vipList[i].equity[j].replaces[0];
            if (replace && equity_content){
              //交叉合并数组
              var equity_content_arr = equity_content.split("{replace}");
              var replaces_arr = vipList[i].equity[j].replaces;
              var newArr = [];
              for(var k=0;k<equity_content_arr.length; k++)
              {
                var dic = {};
                dic.color = "black";
                dic.equity_content = equity_content_arr[k];
                newArr.push(dic);

                if(replaces_arr.length > k)
                {
                  var adddic = {};
                  adddic.color = "red";
                  adddic.equity_content = replaces_arr[k];
                  newArr.push(adddic);
                }
              }
              vipList[i].equity[j]['new_equity_content'] = newArr;
            }
          }

          
        }



        that.setData({

          zaunshiTKX: raffle_money,


          firstDiamondCard: firstDiamondCard, //是否是首张钻石卡
          firstCashcard: firstCashcard, //是否是首张提现卡

          nowIdx: currentIndex,
          vipList: vipList,
          current: currentIndex,
          o_price: vipList[currentIndex].original_vip_price * vip_count + "元",
          vip_count: vip_count,
          checkCardHave: checkCardHave,

          vipPrice: vipList[currentIndex].arrears_price > 0 ?
            vipList[currentIndex].arrears_price.toFixed(2) : vipList[currentIndex].vip_price.toFixed(2),

          payPrice: isLoginSuccess ? "" : choosePayPrice,


          payName: "预存",

          patBTname: from_type_name == -1 ? '开通新卡免费领美衣' : '预存并开通',

          cashabletime: vipList[currentIndex].cashabletime,

          freeCount: vipList[currentIndex].free_count,
          shopPrice: vipList[currentIndex].vip_price,
          vip_cardName: vipList[currentIndex].vip_name,
          showPay: true,

          showCount: vipList[currentIndex].arrears_price == 0 || !vipList[currentIndex].arrears_price,

        })


        from_type = -1000

        //如果登录了显示的支付价格就调接口取
        if (isLoginSuccess) {
          that.getPayPrice();
        } else {
          that.setData({
            fixMoney: fixMoney
          })
        }





      } else {





        that.showToast("" + data.message, 2000);


      }
      wx.hideLoading()

    })
  }, 

  //如果登录了显示的支付价格就调接口取
  getPayPrice: function() {
    var that = this;

    var dataUrl = config.Host + "userVipCard/selActualPrice?" + config.Version + "&token=" + app.globalData.user.userToken +
      '&vip_type=' + vipList[checkIndex].vip_type + "&vip_count=" + vip_count
    util.http(dataUrl, function(data) {

      choosePayPrice = data.actual_price;

      one_price = data.one_price;

      that.setData({
        one_price: one_price,
        payPrice: data.actual_price,
        jianglijin_name: data.isSupply == 1 ? "奖励金" : "现金",
        fixMoney: data.fixMoney,
        trialNum: data.trialNum,
        original_price: data.original_price
      })

      var reMoney = data.reMoney;
      // reMoney = 10;
      if (vipList[checkIndex].vip_type == 4 && reMoney > 0) {
        that.setData({
          zuanshiReMoney: reMoney,
          showZuanshiDJKtishi: true
        })
      } else {
        that.setData({
          zuanshiReMoney: reMoney,
          showZuanshiDJKtishi: false
        })
      }

      if (vipList[checkIndex].purchase_maxNum == -1 || vip_count < vipList[checkIndex].purchase_maxNum) {
        that.setData({
          img_jia: "vip_couot_jia_new",
        })
      } else {
        that.setData({
          img_jia: "vip_couot_jia_new_end",
        })
      }


      if (vip_count > vipList[checkIndex].purchase_num) {
        that.setData({
          img_jian: "vip_couot_jian_new",
        })
      } else {
        that.setData({
          img_jian: "vip_couot_jian_end_new",
        })
      }


    });

  },
  yucunTap: function() {
    this.showToast("预存款将全额返还给您至您的衣蝠钱包，可用来以会员价购买任意商品。不再支持退款哦。", 5000);
  },

  // 提交订单
  submitOrder: function(e) {
    if (!app.globalData.user) {
      return
    }
    //男性用户不可下单支付
    if (app.globalData.user.gender == 1) {
      this.showToast('系统维护中，暂不支持支付', 2000);
      return;
    }
    
    // util.httpPushFormId(e.detail.formId);
    // wx.showLoading({
    //   title: "请稍后",
    //   mask: true
    // })
    kaiKaVipType = vipList[checkIndex].vip_type

    // var dataUrl = config.Host + "userVipCard/addUserVipCard?" + config.Version + "&token=" + app.globalData.user.userToken +
    //   '&vip_type=' + vipList[checkIndex].vip_type + "&vip_count=" + vip_count

    // util.http(dataUrl, this.confirmorderResult);
    // this.setData({
    //   dataurl: dataUrl
    // });

    wx.navigateTo({
      url: '/pages/listHome/order/paystyle/paystyle?'

        // 下单用
        +
        "vip_type=" + vipList[checkIndex].vip_type //会员类型
        +
        "&vip_count=" + vip_count //会员数量

        // 展示用
        +
        "&vip_name=" + vipList[checkIndex].vip_name //会员名称
        +
        "&vip_price=" + vipList[checkIndex].vip_price //预存299元 和 299元也可全额用于购买商品
        +
        "&pay_price=" + choosePayPrice //底部支付价格
        +
        "&punch_days=" + vipList[checkIndex].punch_days //120天
        +
        "&return_money=" + vipList[checkIndex].return_money //打卡返还400元
        +
        "&price_section=" + vipList[checkIndex].price_section //1件299元美衣

        +
        "&one_price=" + one_price //单张会员卡价格
      ,
    })

  },
  // 提交订单结果
  confirmorderResult: function(data) {
    var that = this;
    if (data.status == 1) {

      paySucDialogData = data.data;


      //测试用------------------------
      // wx.hideLoading()
      // paySucDialogData = data.data;
      // if (paySucDialogData){
      //   that.setData({
      //     paySucDialogData: paySucDialogData,
      //     showPaySuccessDialog: true
      //   })
      // }else{
      //   that.showToast("2222", 5000);
      // }
      // return
      // ---------------------------------
      if (data.actual_price <= 0) { //无需支付
        wx.hideLoading()
        //发送购买会员成功的通知
        WxNotificationCenter.postNotificationName("memberNotificationItem1Name", "becomeMemberfinish");
        if (vipList[checkIndex].arrears_price && vipList[checkIndex].arrears_price > 0) {
          that.showToast("已补齐会员卡费，会员权益已恢复，会员期已相应顺延，祝您购物愉快。", 5000);

          from_type_name = -1000;

        } else {
          // that.showToast("购买成功，会员卡权益已开通，祝您购物愉快。", 5000);
        }

        //提现卡的处理
        if (kaiKaVipType == 7) {
          wx.setStorageSync('tixian_count', '');
          
          if (comefromTXkaDialog == 1 || comefromTXkaDialog == 5) { //转盘引导进来的，去转盘
            wx.setStorageSync("KTtxkSuccessBack", 1)
          }

          //如果是转盘引导提现卡进来的，返回转盘 否则跳转到转盘去抽奖
          var pages = getCurrentPages() //获取加载的页面
          var currentPage = pages[pages.length - 2] //获取上一页面的对象
          if (currentPage.route == "pages/mine/withdrawLimitTwo/withdrawLimitTwo") {
            wx.navigateBack({})
          } else {
            wx.navigateTo({
              url: '/pages/mine/withdrawLimitTwo/withdrawLimitTwo',
            })
          }
        }

        that.initVipData(kaiKaVipType)
        wx.hideLoading()

        return
      }



      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId, 3rd_session
          if (res.code) {
            var dataUrl = config.PayHost + "wxpaycx/wapUinifiedOrderList?" + config.Version + "&token=" + app.globalData.user.userToken + '&order_name=我的' + '&code=' + res.code + '&order_code=' + data.v_code;

            pay_v_code = data.v_code;
            util.http(dataUrl, that.orderPayResult)
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
            wx.hideLoading()
          }
        }
      })

    } else {


      wx.hideLoading();

      that.showToast("" + data.message, 2000);

    }
  },



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
        'success': function(res) { //支付成功


          // that.showToast("支付成功", 2000);
          wx.hideLoading()
          //发送购买会员成功的通知
          WxNotificationCenter.postNotificationName("memberNotificationItem1Name", "becomeMemberfinish");
          
          wx.showLoading({
            title: "请稍后",
            mask: true
          })
          wx.hideLoading();

          isvip_paysuccess = true;

          //购买会员卡成功标记
          if (kaiKaVipType != 7 && kaiKaVipType != 8 && kaiKaVipType != 9)
          {
            wx.setStorageSync('vipCardPaySuccess', "1");
            wx.setStorageSync('KvipSuccessBack', "1");
            wx.setStorageSync('unVipRaffleMoney', paySucDialogData.unVipRaffleMoney);
            wx.setStorageSync('vip_price', paySucDialogData.vip_price);
          }
          //道具卡和第1第2张钻石卡提示是弹窗
          if (paySucDialogData) {
 
            that.setData({
              paySucDialogData: paySucDialogData,
              showPaySuccessDialog: true
            })

          } else {
            // that.showToast("购买成功，会员卡权益已开通，祝您购物愉快。", 5000);
          }

          setTimeout(function() {
            that.initVipData(kaiKaVipType);
          }, 2000)
          return;



        },
        'fail': function(res) { //支付失败

          wx.hideLoading()
          that.showToast("支付失败", 2000);
        }
      })
      that.data.isConfirm = false;
    } else {


      that.showToast('' + data.message, 2000);


    }
  },

  closePaySucDialog: function() {
    var that = this;
    that.setData({
      showPaySuccessDialog: false
    })

    //提现卡的处理
    if (kaiKaVipType == 7) {
      wx.setStorageSync('tixian_count', '');

      if (comefromTXkaDialog == 1 || comefromTXkaDialog == 5) { //转盘引导进来的，去转盘
        wx.setStorageSync("KTtxkSuccessBack", 1)
      }

      //如果是转盘引导提现卡进来的，返回转盘 否则跳转到转盘去抽奖
      var pages = getCurrentPages() //获取加载的页面
      var currentPage = pages[pages.length - 2] //获取上一页面的对象
      if (currentPage.route == "pages/mine/withdrawLimitTwo/withdrawLimitTwo") {
        wx.navigateBack({})
      } else {
        wx.navigateTo({
          url: '/pages/mine/withdrawLimitTwo/withdrawLimitTwo',
        })
      }
      return
    }
    if (kaiKaVipType == 8) {
      if (comefromTXkaDialog == 3 || comefromTXkaDialog == 4) { //发货卡引导进来的
        wx.setStorageSync('KdeliverSuccessBack', '1')
      }
      return
    }
    if (kaiKaVipType == 9) {
      if (comefromTXkaDialog == 2 || comefromTXkaDialog == 6) { //免拼卡引导进来的
        wx.setStorageSync("KfreeSuccessBack", '1')
      }
      return
    }

    //首张钻石卡的处理
    if ((paySucDialogData.diamondNum == 0 && kaiKaVipType == 4) || (that.data.newisvip_paysuccess && that.data.newkaiKaVipType == 4)) {
      // that.getVirtualJiangLi(true); //查询虚拟抽奖
      app.globalData.first_diamond = 1;
      wx.redirectTo({
        url: "/pages/shouye/redHongBao?shouYePage=" + "ThreePage"
      })
      return
    }

    //第二张钻石卡的处理
    if ((paySucDialogData.diamondNum == 1 && kaiKaVipType == 4) || (that.data.newisvip_paysuccess && that.data.newkaiKaVipType == 4)) {
      if (that.data.newisvip_paysuccess && that.data.newkaiKaVipType == 4){
        pay_v_code = that.data.pay_v_code
      }
      that.getVirtualJiangLi(false);
      return;
    }

  },

  getVirtualJiangLi: function(first) {
    var that = this;
    var dataUrl = config.Host + "userVipCard/selCardPurchSucc?" + config.Version + "&token=" + app.globalData.user.userToken +
      '&v_code=' + pay_v_code;
    util.http(dataUrl, function(data) {
      // if (first) {
      // var raffle_money = data.raffle_money > 0 ? data.raffle_money : 90;
      // if (data.reMoney > 0) {
      //   that.showToast("预存" + data.reMoney + "元的道具卡，及会员提现的" + raffle_money +
      //     "元奖金已被抵扣。恭喜您以最优惠的价格成为钻石会员。", 5000);
      // } else {
      //   that.showToast("购买成功，会员卡权益已开通，祝您购物愉快。", 5000);
      // }
      // } else {
      //当是买第二张钻石卡如果没有可发货的订单跳转首页3免费领，否则提示
      var freeOrder = data.freeOrder;
      if (freeOrder == 1) {
        that.showToast("预存成功，免费领订单已进入待发货状态，请注意物流信息。", 5000);
      } else {
        wx.redirectTo({
          url: "/pages/shouye/redHongBao?shouYePage=" + "ThreePage"
        })
      }
      // }
    });
  },

  jiaCount: function() {
    //何波加的2019-12-19
    var vip_type = vipList[checkIndex].vip_type;
    var vip_num = vipList[checkIndex].vip_num;
    var cardName = vipList[checkIndex].vip_name + '哦';

    var purchase_num = vipList[checkIndex].purchase_num; //一次买卡张数
    var purchase_maxNum = vipList[checkIndex].purchase_maxNum; //一共可以买多少张，-1为不限制



    //首次购买提现卡只能买一张
    if (vip_type == 7 && firstCashcard == 1) {
      this.showToast("首次只能购买1张提现卡哦", 5000);

      return
    }

    //非首次买提现卡最多能买15张
    if (vip_type == 7 && (vip_num + vip_count) > 15) {

      this.showToast("只能购买15张提现卡。", 5000);

      return
    }

    if (purchase_maxNum != -1 && vip_count >= purchase_maxNum) { //超出可以购买的数量

      this.showToast("1次只能购买" + purchase_maxNum + "张" + cardName, 5000);

      return
    }



    //免拼卡前两张每次最多可买两张 第三张时每次最多可买一张 最多3张
    // if (vip_type == 9 || vip_type == 8) {

    //   if (vip_num == 0 || vip_num == undefined) {
    //     if (vip_count >= 2) {
    //       this.showToast("1次只能购买2张" + cardName, 5000);
    //       return;
    //     }else{
    //       vip_count += purchase_num;
    //     }
    //   } else {
    //     if (vip_count >= 1) {
    //       this.showToast("1次只能购买1张" + cardName, 5000);
    //       return;
    //     }
    //   }
    // } else if (vipList[checkIndex].vip_type == 4) { //钻石卡的单独处理
    //   vip_count += purchase_num;
    // } else if (vipList[checkIndex].vip_type == 7 && firstCashcard != 1) { ////已经买过提现卡的一次买5张提现卡
    //   vip_count += purchase_num;
    // } else {
    //   vip_count += purchase_num;
    // }

    vip_count += purchase_num;

    choosePayPrice = (vipList[checkIndex].vip_price * vip_count).toFixed(2)

    if (choosePayPrice <= 0) {
      choosePayPrice = "0.0"
    }



    this.setData({
      vip_count: vip_count,
      o_price: vipList[checkIndex].original_vip_price * vip_count + "元",
      payPrice: isLoginSuccess ? "" : choosePayPrice

    })


    //如果登录了显示的支付价格就调接口取
    if (isLoginSuccess) {
      this.getPayPrice();
    }

  },
  jianCount: function() {
    var that = this;

    var purchase_num = vipList[checkIndex].purchase_num; //一次买卡张数
    var purchase_maxNum = vipList[checkIndex].purchase_maxNum; //一共可以买多少张，-1为不限制

    if (vipList[checkIndex].vip_type == 7 && firstCashcard != 1) {
      if (vip_count > 5) {
        vip_count -= 5;

      } else {

        return;
      }


    } else if (vipList[checkIndex].vip_type == 4) {
      if (vip_count <= purchase_num) {
        that.showToast("第三次预存钻石卡必须2张起", 5000);
        return
      }
      vip_count -= purchase_num;


    } else if (vip_count > 1) {
      vip_count -= purchase_num;

    }

    // var o_price = 1000;

    // switch (vipList[checkIndex].vip_type) {
    //   case 4:
    //     o_price = 399 * vip_count
    //     break
    //   case 5:
    //     o_price = 699 * vip_count
    //     break
    //   case 6:
    //     o_price = 1599 * vip_count
    //     break

    // }

    choosePayPrice = (vipList[checkIndex].vip_price * vip_count).toFixed(2)

    if (choosePayPrice <= 0) {
      choosePayPrice = "0.0"
    }

    this.setData({
      o_price: vipList[checkIndex].original_vip_price * vip_count + "元",

      vip_count: vip_count,
      payPrice: isLoginSuccess ? "" : choosePayPrice

    })

    //如果登录了显示的支付价格就调接口取
    if (isLoginSuccess) {
      this.getPayPrice();
    }




  },

  type7Wenhao1Tap: function() {
    this.showToast("每日赠送1次，总计10次。", 5000);
  },
  type7Wenhao2Tap: function() {
    this.showToast("限充值" + vipList[checkIndex].vip_price + "元后的首次提现，仅限1次。", 5000);
  },


  qunyiWenhaoTap: function(event) {

    if (!vipList[checkIndex].vip_code) {

      return;
    } else if (vipList[checkIndex].vip_type == 7 && trialIsBuy == 0) {
      return;
    }

    var postitem = event.currentTarget.dataset.postitem;

    // if (vipList[checkIndex].vip_type != 7){
    //   this.showToast("限原价" + vipList[checkIndex].price_section + "元以下（含）的美衣。", 5000);
    //   return
    // }else{
    //   switch (postitem.index) {
    //     case 0:
    //         this.showToast("每日赠送1次，总计10次。", 5000);
    //       break;
    //     case 1:
    //         this.showToast("限充值" + vipList[checkIndex].vip_price + "元后的首次提现，仅限1次。", 5000);
    //       break;
    //   }
    // }


    this.showToast(postitem.wenContent, 5000);
    wen


  },
  bindLeftJiantou: function() {

    checkIndex--;
    if (checkIndex < 0) {
      checkIndex = vipList.length - 1
    }
    this.setData({
      nowIdx: checkIndex,
      current: checkIndex
    })
  },
  bindRightJiantou: function() {

    checkIndex++;
    if (checkIndex > vipList.length - 1) {
      checkIndex = 0
    }
    this.setData({
      nowIdx: checkIndex,
      current: checkIndex
    })
  },

  //邀请发货（VIP）
  toInviteFriends: function() {
    loginClick = 1;
    if (app.globalData.user) {
      wx.navigateTo({
        url: '/pages/sign/InviteFriendsFreeShop/InviteFriendsFreeShop'
      })

    }


    // checkIndex--;
    // if (checkIndex < 0) {
    //   checkIndex = 5
    // }
    // this.setData({
    //   nowIdx: checkIndex,
    //   current: checkIndex
    // })



  },
  //授权弹窗
  onclick: function(e) {

    var that = this;

    wx.getUserInfo({
      //允许授权 获取用户信息
      success: function(res) {
        if (!app.globalData.user) {
          that.globalLogin(); //重新登录
        }else{
          if (app.globalData.user != null && app.globalData.user.user_id != undefined) {

            var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
            that.setData({
              showendofpromotionDialog: showendofpromotionDialog
            })
            if (that.data.showendofpromotionDialog){
              wx.setStorageSync("comefrom", 'showendofpromotionDialog_vip');
              wx.switchTab({
                url: '/pages/shouye/shouye?comefrom=showendofpromotionDialog',
              })
            }
          }
        }
      },
      fail: function() {

      }
    })
  },
  //自动登录
  globalLogin: function() {
    var that = this;
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    util.autoLogin(loginCount, function(loginfailYiFuShow, login_discribution, login_buttontitle, newloginCount) {
      wx.hideLoading();
      loginCount = newloginCount;
      if (loginCount == 1) //登录成功
      {
        var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
        that.setData({
          showLoginDialog: false,
          showendofpromotionDialog: showendofpromotionDialog
        })

        if (app.globalData.user != null && app.globalData.user.user_id != undefined && that.data.showendofpromotionDialog) {
          wx.setStorageSync("comefrom", 'showendofpromotionDialog_vip');
          wx.switchTab({
            url: '/pages/shouye/shouye?comefrom=showendofpromotionDialog',
          })
          return;
        } else if (app.globalData.user && app.globalData.user.userToken == undefined && app.globalData.channel_type == 1) {
          that.showToast('不符合条件', 2000);
          return;
        }


        if (loginClick == 1) {
          wx.navigateTo({
            url: '/pages/sign/InviteFriendsFreeShop/InviteFriendsFreeShop'
          })
          loginClick = 0
        }
        that.initVipData(-1);
        util.get_vip_tofreelingPage2();//有79元免费领未领取自动跳转免费领列表页2
      } else {
        that.showToast('不符合条件', 2000);
      }

    })
  },
  closeInviteFriends: function() {
    this.setData({
      showInviteFriends: false
    })
  },
  txTishiTap: function() {

    if (vipList[checkIndex].vip_type == 7 || vipList[checkIndex].vip_type == 8 || vipList[checkIndex].vip_type == 9) {
      this.showToast("完成每日的赚钱任务即打卡成功。新人累计打卡15日可领" + vipList[checkIndex].return_money + "元现金。", 5000);
      return
    }

    if (checkCardHave) {
      this.setData({
        showTXtishi: true
      })
    } else {

      wx.navigateTo({
        url: '/pages/mine/addMemberCard/memberDiscription?'

          // 下单用
          +
          "vip_type=" + vipList[checkIndex].vip_type //会员类型
          +
          "&vip_count=" + vip_count //会员数量

          // 展示用
          +
          "&vip_name=" + vipList[checkIndex].vip_name //会员名称
          +
          "&vip_price=" + vipList[checkIndex].vip_price //预存299元 和 299元也可全额用于购买商品
          +
          "&pay_price=" + choosePayPrice //底部支付价格
          +
          "&punch_days=" + vipList[checkIndex].punch_days //120天
          +
          "&return_money=" + vipList[checkIndex].return_money //打卡返还400元
          +
          "&price_section=" + vipList[checkIndex].price_section //1件299元美衣

          +
          "&one_price=" + one_price //单张会员卡价格
          ,
      })
    }

  },
  colseShowTXtishi: function() {
    this.setData({
      showTXtishi: false,
      showTixiankaDialog: false,
      showTXKkaitongdialog: false,
      showBuQaunZaunShi: false,


    })
  },
  dialog_close: function() {
    this.setData({
      showBuQaunZaunShi: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    var that = this;

    if (!isvip_paysuccess && !that.data.showPaySuccessDialog) {
      util.get_vip_tofreelingPage2();//有79元免费领未领取自动跳转免费领列表页2
    }
    
    //大促销已结束
    if (app.globalData.user != null) {
      var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
      this.setData({
        showMainPage: true,
        showendofpromotionDialog: showendofpromotionDialog
      })
    } else {
      this.setData({
        showMainPage: true,
        showendofpromotionDialog: true
      })
    }

    if (wx.getStorageSync("payvipCardSuccess")) {
      // this.showToast("购买成功，会员卡权益已开通，祝您购物愉快。", 5000);
      wx.setStorageSync("payvipCardSuccess", "")
      // this.initVipData(kaiKaVipType);

      paySucDialogData = wx.getStorageSync("paySucDialogData");

      //道具卡和第1第2张钻石卡提示是弹窗
      if (paySucDialogData) {

        that.setData({
          paySucDialogData: paySucDialogData,
          showPaySuccessDialog: true
        })

      } else {
        // that.showToast("购买成功，会员卡权益已开通，祝您购物愉快。", 5000);
      }

      setTimeout(function() {
        that.initVipData(kaiKaVipType);
      }, 1000)
      return;

    }

    var that = this;
    wx.onUserCaptureScreen(function (res) {
      var pages = getCurrentPages() //获取加载的页面
      var currentPage = pages[pages.length - 1] //获取当前页面的对象
      if (currentPage.route == "pages/mine/addMemberCard/addMemberCard") {
        console.log('……………………………………………………用户截屏了')
        setTimeout(function () {
          that.showModal();
        }, 1000)
      }
    })

    //获取是否是会员
    util.get_vip2(function (data) {
      var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
      var showBecameMember = (((data.isVip > 0 && data.isVip != 3) || (data.isVip == 3 && data.maxType == 4)) && data.first_diamond == 0) ? true : false;
      that.setData({
        showBecameMember: showBecameMember
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    isvip_paysuccess = false;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    isvip_paysuccess = false;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

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
        url: '/pages/mine/Complaint/Complaint?path=/addMemberCard/addMemberCard',
      })
    }
  },

  //投诉分享
  complain_shareTap: function () {
    this.setData({
      hideModal: true
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;

    var path = '';
    if (app.globalData.user != null && app.globalData.user.user_id != undefined) {
      path = '/pages/mine/addMemberCard/addMemberCard?' + "isShareFlag=true" + "&user_id=" + app.globalData.user.user_id + "&memberComefrom=mine";
    } else {
      path = '/pages/mine/addMemberCard/addMemberCard?' + "isShareFlag=true" + "&memberComefrom=mine";
    }

    return {

      title: '👉点我立即开通VIP会员',
      path: path,
      imageUrl: that.data.Upyun + '/small-iconImages/heboImg/share_newestbuyMember.png',
      success: function(res) {
        // 转发成功
        this.showToast('分享成功', 2000);
      },
      fail: function(res) {
        // 转发失败
        this.showToast('分享失败', 2000);
      }
    }
  }
})