import config from '../../../config';
var util = require('../../../utils/util.js');
var publicUtil = require('../../../utils/publicUtil.js');
import NumberAnimate from '../../../utils/NumberAnimate.js';

var app = getApp();
var token;
var order_channel;
var mSumBalance = 0; //总余额
var mLimit = 0; //总额度
var usedYidou = 0; //可用衣豆
var unUsedYidou = 0; //冻结衣豆
var usedBalance = 0; //可用余额
var unUsedBalance = 0; //冻结余额
var isRunning = false; //是否正在抽奖
var raffleType = 0; //抽中红包类型
var redPacketValue = 0; //红包金额
var isFromPaySuccess = false; //是否支付成功后
var totalAccount = 0; //支付金额 待换算为抽奖次数
var cutdown_total_micro_second = 0; //邀请好友倒计时时间
var cutdown_total_micro_second2 = 0;//抽奖倒计时时间
var balanceLottery = 0;
var balanceLotterySum = 0;

var isFromSignBalanceLottery = false;

var dataListTemp1 = [];
var dataListTemp2 = [];
var isMoving = false;
var scollTimeOut;
var scollTimePause;
var wxIsNotBind = false;
var is_invitshare = false;
var runDegs = 0;
var choujiangCount = 0;
var formId;
var tixianCouponBack = false;
var tixianCoupon_count = 1;//赠送的抽奖次数
var reRoundCount = 0;//剩余轮数
var current_roundNum =0;//当前轮数
var luck_isFinish = 0;//20次抽奖是否抽完0抽完 1没有抽完
var n1timer;
var tixianInterval;//提现定时器
var cardInterval;//引导购买提现卡定时器
// var pRatio = 1;
var animationTimer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    upyconfig:config.Upyun,
    isMad: false,


    zp_animationData: {},
    mSumBalance_data: 0.00.toFixed(2),
    mLimit_data: 0.00.toFixed(2),
    usedYidou_data: "可用衣豆：" + usedYidou,
    unUsedYidou_data: "冻结衣豆：" + unUsedYidou,
    lotterynumber: 0, //疯狂新衣节 剩余抽奖次数
    redPacketValue_data: 0, //抽中红包金额
    twofoldness_data: 1, //衣豆减半抽奖倍数
    raffleNum_data: 0, //非支付成功进来 提醒有多少次抽奖机会
    raffleType_data: 0, //抽中红包类型
    payYiDouNumber: 0, //完成订单 获得衣豆的数量
    payLotteryNumber: 0, //完成订单 疯狂新衣节 抽奖获得次数

    isBalanceLottery: false, //5次体验抽余额机会
    balanceLottery_data: 0, //体验抽余额红包的次数
    balanceLotterySum_data: 0, //体验抽余额红包的总金额
    balanceLotteryCount_data: 0, //体验抽余额红包的总次数


    notEnoughYidouShow: false, //衣豆不足
    getYuEShow: false, //如何获得余额
    getYiDouShow: false, //如何获得衣豆
    LuckWarnShow: false, //是否使用衣豆抽奖
    raffleNumShow: false, //非支付成功进来 提醒有多少次抽奖机会
    noRedPacketShow: false, //没有抽中红包
    openRedPacketShow: false, //普通抽中红包 拆红包弹窗
    // lottery_kfMoney:2.8,
    // kf_allMoney:6.8,
    redPacketOpenedShow: false, //普通抽中红包 拆红包后显示金额
    madOpenRedPacketShow: false, //疯狂新衣节 拆红包弹窗
    madRedPacketOpenedShow: false, //疯狂新衣节  拆红包后显示金额
    buyObtainYidouShow: false, //支付成功获得衣豆弹窗
    obtainMadDialogShow: false, //支付成功 疯狂新衣节 抽奖获得次数弹窗
    limitDialogShow: false, //额度说明弹窗

    balanceLotteryShow: false, //体验抽余额红包的次数弹窗
    balanceLotteryOverShow: false, //体验抽余额红包的次数用完弹窗
    noRedPacketBalanceShow: false, //抽余额红包未中红包
    openRedPacketBalanceShow: false, //体验余额抽奖 抽中红包
    redPacketOpenedBalanceShow: false, //体验余额抽奖 拆开红包后得到金额弹窗
    wxIsNotBindShow: false, //wxIsBindShow 用户未绑定微信提现账户的提示弹窗
    tixianBecomeMember: false, //用户提现过来的提示用户办会员
    zeroBuyDialogShowFlag: false, //0元购弹窗
    pagetoBecomeMember: false,
    redPacketluckOver: false,
    redPacketBecomeMember:false,
    luckOrBecomeMember:false,
    guideTixianCouponShow:false,
    invitfriendslist: ['', ''],
    newuser_draw:false,

    scrollTop1: 0,
    scrollTop2: 0,
    mListData1: [],
    mListData2: [],
    showStartTishi: false,
    type:'2',

    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},
    length: 0,
    secondimgData: ['complaint_1.png', 'complaint_2.png', 'complaint_3.png'],
    secondtextData: ['发送给朋友', '添加到我的小程序', '添加到桌面'],
    thirdimgData: ['complaint_4.png', 'complaint_5.png', 'complaint_6.png', 'complaint_7.png'],
    thirdtextData: ['浮窗', '设置', '反馈与投诉', '重新进入小程序'],
    hideTixianCard:0,//是否隐藏提现卡 0隐藏 1显示
    raffle_skipSwitch: 0,//新用户20次抽奖抽完后的跳转开关 0跳转赚钱任务 1正常跳转提现卡
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    new app.ToastPannel();

    var that = this;
    runDegs = 0;
    mSumBalance = 0;
    mLimit = 0;
    usedYidou = 0;
    unUsedYidou = 0; //可用衣豆 ，冻结衣豆
    usedBalance = 0;
    unUsedBalance = 0; //可用余额 冻结余额
    isRunning = false; //是否正在抽奖
    raffleType = 0; //抽中红包类型
    redPacketValue = 0; //红包金额
    balanceLottery = 0;
    balanceLotterySum = 0;
    dataListTemp1 = [];
    dataListTemp2 = [];
    isMoving = false;
    wxIsNotBind = false;

    order_channel = wx.getStorageSync("advent_channel")
    order_channel ? order_channel = '&order_channel=' + order_channel : ''

    choujiangCount = 0;

    if(options.type !=undefined)
    {
      that.setData({
        type:options.type
      })
    }
    if(options.comefrom != undefined){
      that.setData({
        comefrom: options.comefrom,
      })
    }
    if (options.comefrom == 'freeFight_style' || options.comefrom == 'detail_style'){
      //品牌
      var supplabelList = [];
      var basesData = wx.getStorageSync("shop_tag_basedata");
      var typelist = basesData.data.type_tag;
      var supAll = basesData.data.supp_label;
      for (var i = 0; i < supAll.length; i++) {
        var type = supAll[i].type;
        if (type == 1) {
          supplabelList.push(supAll[i]);
        }
      }
      that.setData({
        free_fightLuckDraw:true,
        isshow_freeFight:true,
        typelist: typelist,
        supplabelList: supplabelList
      })
    }
   
    if (app.globalData.user) {
      //大促销已结束
      if (app.globalData.user.showSpecialPage != 1) {
        that.setData({
          showMainPage: true,
          showendofpromotionDialog: true
        })
      } else {
        token = app.globalData.user.userToken;

        that.normal_luckdraw(true);//正常抽奖
      
        cutdown_total_micro_second = 30 * 60 * 1000;
        var picdatas = [];
        // 获取用户邀请好友状态
        util.get_selInviteInfo(function (data) {
          var inviteNum = data.data.inviteNum;
          if (data.status == 1 && data.data.upics) {

            for (var i = 0; i < inviteNum; i++) {
              if (data.data.upics[i]) {
                picdatas.push(data.data.upics[i]);
              } else {
                picdatas.push(config.Upyun + 'small-iconImages/heboImg/luck_invitButton.png')
              }
            }
          } else {
            for (var i = 0; i < inviteNum; i++) {
              picdatas.push(config.Upyun + 'small-iconImages/heboImg/luck_invitButton.png')
            }
          }
          that.setData({
            invitfriendslist: picdatas
          })
        });
        that.setData({
          showMainPage:true
        })
      }
      that.queryMadData();
    } else {
      //大促销已结束
      var showendofpromotionDialog = app.globalData.channel_type == 1 ? false : true;
      that.setData({
        newuser_draw: true,
        showMainPage: true,
        showendofpromotionDialog: showendofpromotionDialog
      })
      
      if (!that.data.showendofpromotionDialog) {
        if (!that.data.newuser_draw) {
          that.setData({
            showLoginDialog: true
          })
        } else {
          that.newuser_luckdraw();//虚拟抽奖
        }
      }
    }
    
    

    if (scollTimeOut) {
      clearInterval(scollTimeOut);
      scollTimeOut = null;
    }
    if (scollTimePause) {
      clearInterval(scollTimePause);
      scollTimePause = null;
    }
    this.hongBaoAnimation();
    this.initLimitAwardsList();
    if (!this.data.isMad || this.data.isBalanceLottery) {
      this.initYiDouAwardsList();
    }
  },
  onUnload: function() {
    if (this.data.choujiangCount <= 0) {
      wx.setStorageSync("clickCompleteTaskFinish", true);
    }
    if (animationTimer) {
      clearInterval(animationTimer);
    }
    if (tixianInterval) {
      clearInterval(tixianInterval);
    }
    if (cardInterval){
      clearInterval(cardInterval);
    }
    if (scollTimeOut){
      clearInterval(scollTimeOut);
    }
    clearTimeout(scollTimeOut);

    if (n1timer) {
      clearInterval(n1timer.interval);
      n1timer.interval = null;
    }
    console.log(n1timer.interval);
  },
  onHide:function(){
    if (n1timer) {
      clearInterval(n1timer.interval);
      n1timer.interval = null;
    }
  },
  onShow: function() {
    var that = this;
    if (is_invitshare) {
      that.showToast('分享成功，别忘记让好友点进来并微信授权哦。', 2000);
      is_invitshare = false;
    }

    util.get_vip_tofreelingPage2();//有79元免费领未领取自动跳转免费领列表页2

    if (tixianCouponBack || that.data.pagetoBecomeMember)
    {
      //购买提现卡、会员卡成功后返回
      var kttxkSuccessBack = wx.getStorageSync("KTtxkSuccessBack")
      var kvipSuccessBack = wx.getStorageSync('KvipSuccessBack')
      var kvipSuccessBack_isshow = wx.getStorageSync('KvipSuccessBack_isshow');
      if (kttxkSuccessBack == '1' || kvipSuccessBack == '1') {
        var that = this;
        token = app.globalData.user.userToken;

        //查询是否可以抽奖
        var dataUrl = config.Host + "wallet/queryUserLotteryQualification" +
          "?token=" + token +
          "&" + config.Version + '&type=' + that.data.type;

        util.http(dataUrl, function (data) {

          if (data.status == 1) {
            choujiangCount = data.data;
            luck_isFinish = data.is_finish;
            reRoundCount = data.reRoundCount;
            current_roundNum = data.current_roundNum;
            var all_count = data.all_count; //当天可以抽奖的总次数
            var all_money = (data.all_money * 1).toFixed(2); //当天累计的总抽奖金额（虚拟不可提现）

            that.setData({
              dayall_count: all_count,
              dayall_money: all_money,
              choujiangCount: choujiangCount,
              totalchoujiangCount: choujiangCount,
              redPacketValue_totaldata: all_money, //累计抽中金额
              is_vip: data.isVip != undefined ? data.isVip : 0, //0不是 1是
              maxType: data.maxType,
              toMakeMoney_page: data.toMakeMoney_page,
              freeling_raward:false,
              redPacketValue_data: 0,
              raffle_skipSwitch: data.new_raffle_skipSwitch,
              hideTixianCard: data.trial_hidden_switch
            })

            if (kttxkSuccessBack == '1')//有购买过提现卡
            {
              if (choujiangCount > 0) {
                that.setData({
                  redPacketOpenedShow: false,
                  luckOrBecomeMember: false,
                  redPacketluckOver: false,
                  tixianBecomeMember: false,
                  redPacketBecomeMember: false,
                  showStartTishi: true,
                })
              }
            } else if (kvipSuccessBack == '1' && kvipSuccessBack_isshow != '1')//有购买过会员卡
            {
              var unVipRaffleMoney = wx.getStorageSync('unVipRaffleMoney');
              var vip_price = wx.getStorageSync('vip_price');
              that.setData({
                unVipRaffleMoney: unVipRaffleMoney > 0 ? unVipRaffleMoney:90,
                vip_price: vip_price,
                becomeMemberTixianClear: true,
                redPacketOpenedShow: false,
                luckOrBecomeMember: false,
                redPacketluckOver: false,
                tixianBecomeMember: false,
                redPacketBecomeMember: false,
                comefrom: '',
              });
              wx.setStorageSync('KvipSuccessBack_isshow', 1)
            }

            var tixian_count = data.tixian_count;
            var tixianCoupon = '';
            if ((data.isVip > 0 && data.isVip != 3) || (data.isVip == 3 && data.maxType == 4))//是会员
            {
              tixianCoupon = 'giveoneTixianCoupon.png';
              tixianCoupon_count = 1;
            } else {
              //tixian_count = 1 买过一次提现卡
              tixianCoupon = tixian_count == 1 ? 'givefiftyTixianCoupon.png' : 'givefiftyTixianCoupon.png';
              tixianCoupon_count = tixian_count == 1 ? 50 : 50;
            }
            that.setData({
              tixian_count: tixian_count,
              tixianCoupon: tixianCoupon,
              tixian_twoCount: data.tixian_twoCount,
              tixianCoupon_count: tixianCoupon_count
            })

            wx.setStorageSync("KTtxkSuccessBack", 0)
            wx.setStorageSync('KvipSuccessBack', 0)
          } else {
            that.showToast(data.message, 2000);
            wx.setStorageSync("KTtxkSuccessBack", 0)
            wx.setStorageSync('KvipSuccessBack', 0)
          }
        });

      } else if (tixianCouponBack){
        var pages = getCurrentPages() //获取加载的页面
        var currentPage = pages[pages.length - 2] //获取上一页面的对象
        if (currentPage.route == "pages/sign/sign") {
          wx.navigateBack({})
        } else {
          wx.redirectTo({
            url: '/pages/sign/sign',
          })
        }

      }

      tixianCouponBack = false;
      that.setData({
        pagetoBecomeMember: false
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

    //获取是否隐藏提现卡
    util.get_shouyeSwitch('', function (swhitchdata) {
      if (swhitchdata.trial_hidden_switch) {
        that.setData({
          hideTixianCard: swhitchdata.trial_hidden_switch
        })
      }
    });

    //获取是否是会员
    util.get_vip2(function (data) {
      var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
      var showBecameMember = (((data.isVip > 0 && data.isVip != 3) || (data.isVip == 3 && data.maxType == 4)) && data.first_diamond == 0) ? true : false;
      that.setData({
        showBecameMember: showBecameMember
      })
    })
  },

  dialog_close: function() {
    this.setData({
      notEnoughYidouShow: false,
      getYuEShow: false,
      getYiDouShow: false,
      LuckWarnShow: false,
      raffleNumShow: false,
      noRedPacketShow: false,
      openRedPacketShow: false,
      redPacketOpenedShow: false,
      madOpenRedPacketShow: false,
      madRedPacketOpenedShow: false,
      buyObtainYidouShow: false,
      obtainMadDialogShow: false,
      limitDialogShow: false,
      balanceLotteryShow: false,
      balanceLotteryOverShow: false,
      noRedPacketBalanceShow: false,
      openRedPacketBalanceShow: false,
      redPacketOpenedBalanceShow: false,
      wxIsNotBindShow: false,
      becomeMemberTixianClear:false,
      becomeMemberTixianClearLast: false
    });
  },

  becomeMemberLast:function(){
    this.setData({
      becomeMemberTixianClear: false,
    })

    if (choujiangCount > 0)
    { 
      this.getLimitValue();
    }else{
      this.setData({
        becomeMemberTixianClearLast: true
      })
    }
  },
  becomeMemberLeave:function(){
    this.setData({
      becomeMemberTixianClearLast:false
    })
    wx.navigateBack({})
  },
  //正常过来抽奖
  normal_luckdraw: function (loadcomming){
    var that = this;
    token = app.globalData.user.userToken;

    //查询是否可以抽奖
    var dataUrl = config.Host + "wallet/queryUserLotteryQualification" +
      "?token=" + token +
      "&" + config.Version + '&type=' + that.data.type;

    util.http(dataUrl, function (data) {

      if (data.status == 1) {
        choujiangCount = data.data;
        luck_isFinish = data.is_finish;
        reRoundCount = data.reRoundCount;
        current_roundNum = data.current_roundNum;
        var all_count = data.all_count; //当天可以抽奖的总次数
        var all_money = (data.all_money * 1).toFixed(2); //当天累计的总抽奖金额（虚拟不可提现）
        var tixian_count = data.tixian_count;//是否购买提现卡 1是 0不是
        var expireTime = data.expireTime;//提现剩余时间
        var kvipSuccessBack_isshow = wx.getStorageSync('KvipSuccessBack_isshow');
        var kvipSuccessBack = wx.getStorageSync('KvipSuccessBack')

        if (that.data.comefrom == 'wallet') //从钱包界面过来的
        {
          that.setData({
            choujiangCount: choujiangCount,
            totalchoujiangCount: choujiangCount,
            dayall_count: all_count,
            dayall_money: all_money,
            redPacketValue_totaldata: all_money, //钱包里面累计抽中金额
            tixian_count: tixian_count,
            tixian_twoCount: data.tixian_twoCount,
            is_vip: data.isVip != undefined ? data.isVip : 0, //0不是 1是
            maxType: data.maxType,
            freeling_raward: false,
            redPacketValue_data:0,
            newuser_draw:false,
            raffle_skipSwitch: data.new_raffle_skipSwitch,
            hideTixianCard: data.trial_hidden_switch
          })
          
          if (kvipSuccessBack == '1' && kvipSuccessBack_isshow != '1')//有购买过会员卡
          {
            var unVipRaffleMoney = wx.getStorageSync('unVipRaffleMoney');
            that.setData({
              unVipRaffleMoney: unVipRaffleMoney > 0 ? unVipRaffleMoney : 90,
              becomeMemberTixianClear: true,
            });

            wx.setStorageSync('KvipSuccessBack', 0)
            wx.setStorageSync('KvipSuccessBack_isshow', 1)
          }else if (that.data.redPacketValue_totaldata > 0) //从钱包页进入没有抽中的金额或者没有抽奖次数
          {
            if(loadcomming && luck_isFinish == 0)
            {
              that.setData({
                tixianBecomeMember: true,
              })
            }else{
              if (choujiangCount <= 0) {
                that.needCountTishi();
              } else {
                //如果虚拟抽奖没结束进来就自动抽奖
                if (luck_isFinish == 1 && !that.data.free_fightLuckDraw && !loadcomming) {
                  that.getLimitValue();
                } else {
                  if (loadcomming && luck_isFinish == 1) {
                    that.showToast('请点转盘中央的“马上提现”，先完成提现。', 2000);
                  } else {
                    that.setData({
                      showStartTishi: true
                    })
                  }
                }
              }
            }
            
          } else {

            if (choujiangCount <= 0) {
              that.needCountTishi();
            } else {
              //如果虚拟抽奖没结束进来就自动抽奖
              if (luck_isFinish == 1 && !that.data.free_fightLuckDraw && !loadcomming) {
                that.getLimitValue();
              }else{
                if (loadcomming && luck_isFinish == 1) {
                  that.showToast('请点转盘中央的“马上提现”，先完成提现。', 2000);
                } else {
                  that.setData({
                    showStartTishi: true
                  })
                } 
              }
            }
          }

        } else {
          that.setData({
            dayall_count: all_count,
            dayall_money: all_money,
            choujiangCount: choujiangCount,
            totalchoujiangCount: choujiangCount,
            redPacketValue_totaldata: all_money, //累计抽中金额
            tixian_count: tixian_count,
            tixian_twoCount: data.tixian_twoCount,
            is_vip: data.isVip != undefined ? data.isVip : 0, //0不是 1是
            maxType: data.maxType,
            freeling_raward: false,
            redPacketValue_data:0,
            newuser_draw:false,
            raffle_skipSwitch: data.new_raffle_skipSwitch,
            hideTixianCard: data.trial_hidden_switch
          })

          if (kvipSuccessBack == '1' && kvipSuccessBack_isshow != '1')//有购买过会员卡
          {
            var unVipRaffleMoney = wx.getStorageSync('unVipRaffleMoney');
            that.setData({
              unVipRaffleMoney: unVipRaffleMoney > 0 ? unVipRaffleMoney : 90,
              becomeMemberTixianClear: true,
            });

            wx.setStorageSync('KvipSuccessBack', 0)
            wx.setStorageSync('KvipSuccessBack_isshow', 1)
          } else if (choujiangCount <= 0) {
            if (that.data.redPacketValue_totaldata > 0) //当日有抽中未能提现的会员提现额度时弹此框
            {
              //前置20次抽完的最后一次抽完弹窗去赚钱 必做任务最后一次抽完弹窗出引导APP的弹窗
              if (that.data.luck_isFinish == 1) {
                that.tosignOrTixian();
              } else {
                if(that.data.ftask_popup == 1){
                  that.setData({
                    redPacketluckOver: true,
                  })
                }else{
                  var pages = getCurrentPages() //获取加载的页面
                  var currentPage = pages[pages.length - 2] //获取上一页面的对象
                  if (currentPage.route == "pages/sign/sign") {
                    wx.navigateBack({})
                  } else {
                    wx.redirectTo({
                      url: '/pages/sign/sign',
                    })
                  }
                }
                
                // that.timeCountdown();
              }
            } else {
              that.needCountTishi();
            }
          } else {
            //如果虚拟抽奖没结束进来就自动抽奖
            if (luck_isFinish == 1 && !that.data.free_fightLuckDraw && !loadcomming){
              that.getLimitValue();
            } else if (!that.data.free_fightLuckDraw){
              if (loadcomming && luck_isFinish == 1){
                that.showToast('请点转盘中央的“马上提现”，先完成提现。', 2000);
              }else{
                that.setData({
                  showStartTishi: true
                })
              } 
            }
          }
        }

        //当是第一轮时查询是否要获取用户手机
        if(current_roundNum == 1){
          util.query_userinfo(function(data){
            if (data.status == 1 && data.userinfoextend){
              that.setData({
                mustBindPhoneChannel: data.userinfoextend.mustBindPhoneChannel
              })
            }
          })
        }
        var tixianCoupon = '';
        if ((data.isVip > 0 && data.isVip != 3) || (data.isVip == 3 && data.maxType == 4))//是会员
        {
          tixianCoupon = 'giveoneTixianCoupon.png';
          tixianCoupon_count = 1;
        } else {
          //tixian_count = 1 买过一次提现卡
          tixianCoupon = tixian_count == 1 ? 'givefiftyTixianCoupon.png' : 'givefiftyTixianCoupon.png';
          tixianCoupon_count = tixian_count == 1 ? 50:50;
        }
        that.setData({
          tixianCoupon_count: tixianCoupon_count,
          tixianCoupon:tixianCoupon,
          expireTime: expireTime
        })

      } else {
        that.showToast(data.message, 2000);
      }

    });
  },
  //虚拟抽奖
  newuser_luckdraw: function (btntap){
    choujiangCount = 1;
    this.setData({
      dayall_count: 1,
      dayall_money: 9.80,
      choujiangCount: 1,
      totalchoujiangCount: 1,
    })
    //自动抽奖
    this.newuser_getLimitValue(btntap);
  },
  newuser_onclick:function(e){
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
            if (app.globalData.user && app.globalData.user.userToken != undefined) //登录成功
            {
              var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
              that.setData({
                showendofpromotionDialog: showendofpromotionDialog
              })
              //如果是不带参用户直接返回赚钱页
              if (that.data.showendofpromotionDialog) {
                wx.navigateBack({})
                return;
              }

              var token = app.globalData.user.userToken;
              //同步第一次抽奖数据
              util.newuser_luckdraw(redPacketValue, function (data) {
                if (data.status == 1) {
                  that.normal_luckdraw();
                }
               
                that.setData({
                  redPacketOpenedShow: false,
                  // redPacketNotenoughOne: true,
                })
              });

              cutdown_total_micro_second = 30 * 60 * 1000;
              var picdatas = [];
              // 获取用户邀请好友状态
              util.get_selInviteInfo(function (data) {
                var inviteNum = data.data.inviteNum;
                if (data.status == 1 && data.data.upics) {

                  for (var i = 0; i < inviteNum; i++) {
                    if (data.data.upics[i]) {
                      picdatas.push(data.data.upics[i]);
                    } else {
                      picdatas.push(config.Upyun + 'small-iconImages/heboImg/luck_invitButton.png')
                    }
                  }
                } else {
                  for (var i = 0; i < inviteNum; i++) {
                    picdatas.push(config.Upyun + 'small-iconImages/heboImg/luck_invitButton.png')
                  }
                }
                that.setData({
                  invitfriendslist: picdatas
                })
              });

              that.queryMadData();
            } else if (app.globalData.user.userToken == undefined && app.globalData.channel_type == 1) {
              that.setData({
                openRedPacketShow: false
              })
              wx.navigateBack({})
            }
          });
        } else if (app.globalData.user.userToken == undefined && app.globalData.channel_type == 1) {
          that.setData({
            openRedPacketShow: false
          })
          wx.navigateBack({})
        }
      },
      fail: function () {

      }
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
              var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
              that.setData({
                
                showLoginDialog:false,
                showendofpromotionDialog: showendofpromotionDialog
              })
              if (that.data.showendofpromotionDialog) {
                wx.setStorageSync("comefrom", 'showendofpromotionDialog');
                wx.switchTab({
                  url: '/pages/shouye/shouye?comefrom=showendofpromotionDialog',
                })
                return;
              }

              wx.hideLoading();
              token = app.globalData.user.userToken;
              //查询抽奖次数
              var dataUrl = config.Host + "wallet/queryUserLotteryQualification" +
                "?token=" + token +
                "&" + config.Version + '&type=' + that.data.type;
              util.http(dataUrl, function(data) {

                if (data.status != 1) {
                  that.showToast(data.message, 2000);
                  return
                }
                choujiangCount = data.data;
                luck_isFinish = data.is_finish;
                reRoundCount = data.reRoundCount;
                current_roundNum = data.current_roundNum;
                if (choujiangCount <= 0) {
                  that.setData({
                    tixianCoupon_count:tixianCoupon_count
                  })
                  that.needCountTishi();
                  
                } else {
                  that.setData({
                    choujiangCount: choujiangCount,
                    showStartTishi: true
                  })
                }
              });

              cutdown_total_micro_second = 30 * 60 * 1000;
              var picdatas = [];
              // 获取用户邀请好友状态
              util.get_selInviteInfo(function (data) {
                var inviteNum = data.data.inviteNum;
                if (data.status == 1 && data.data.upics) {

                  for (var i = 0; i < inviteNum; i++) {
                    if (data.data.upics[i]) {
                      picdatas.push(data.data.upics[i]);
                    } else {
                      picdatas.push(config.Upyun + 'small-iconImages/heboImg/luck_invitButton.png')
                    }
                  }
                } else {
                  for (var i = 0; i < inviteNum; i++) {
                    picdatas.push(config.Upyun + 'small-iconImages/heboImg/luck_invitButton.png')
                  }
                }
                that.setData({
                  invitfriendslist: picdatas
                })
              });
            } else if (app.globalData.user.userToken == undefined && app.globalData.channel_type == 1) {
              that.showToast('不符合条件', 2000);
            } else{
              if (that.data.showendofpromotionDialog) {
                wx.setStorageSync("comefrom", 'showendofpromotionDialog');
                wx.switchTab({
                  url: '/pages/shouye/shouye?comefrom=showendofpromotionDialog',
                })
              }
            }
          });
        }else{
          if (that.data.showendofpromotionDialog) {
            wx.setStorageSync("comefrom", 'showendofpromotionDialog');
            wx.switchTab({
              url: '/pages/shouye/shouye?comefrom=showendofpromotionDialog',
            })
          }
        }
      },
      fail: function() {

      }
    })
  },

  //关闭相关弹窗时候 用户是否绑定提现微信则另一个弹窗提示
  dialog_close_toBind: function() {

    //引导开会员  redPacketValue_data == 0
    if (this.data.redPacketOpenedShow && this.data.redPacketValue_data == 0 && !this.data.newuser_draw) {
      this.setData({
        redPacketOpenedShow:false,
      })
    }else{
      this.setData({
        raffleNumShow: false,
        noRedPacketShow: false,
        redPacketOpenedShow: false,
        madRedPacketOpenedShow: false,
        luckOrBecomeMember: false,
      });
    }
  },
  dialog_close_toluck: function() {

    if (this.data.redPacketNotenoughOne){
      this.setData({
        redPacketNotenoughOne:false
      })
    }
    
    if (this.data.redPacketluckOver || this.data.tixianBecomeMember){
      cutdown_total_micro_second = 30 * 60 * 1000;
      this.countdown();
      this.setData({
        redPacketluckOver: false,
        tixianBecomeMember:false
      })

      //当是会员或者2次买提现卡后不再弹出提现卡弹窗
      if ((this.data.is_vip > 0 && this.data.is_vip != 3) || (this.data.is_vip == 3 && this.data.maxType == 4) || this.data.tixian_twoCount == 1)//是会员
      {
        // this.setData({
        //   guidebecomeMemberShow: true
        // })
      }else{
        this.setData({
          guideTixianCouponShow: true
        })
      }
    }
  },
  //成为会员
  becomeMember: function(e) {
    
    this.setData({
      pagetoBecomeMember: true
    })
    
    wx.navigateTo({
      url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=' + 'draw_vip',
    })
  },

  //提交formid
  submitFormID:function(e){
    formId = e.detail.formId;
    if (app.globalData.user != null) {
      util.httpPushFormId(e.detail.formId);
    }
  },
  confirmFormID:function(e){
    formId = e.detail.formId;
    if (app.globalData.user != null) {
      util.httpPushFormId(e.detail.formId);
    }
  },
  //0元购美衣弹窗关闭
  zeroBuyCloseClick: function() {
    this.setData({
      zeroBuyDialogShowFlag: false,
    });
  },

  //刚进来的时候的弹窗
  initDialog: function() {
    var that = this;
    if (that.data.isBalanceLottery) {
      //   setBalanceInit();
      if (balanceLottery > 0) {
        that.getBalanceLottery(1); //获得免费抽奖机会
      } else {
        that.getBalanceLottery(2); //免费抽奖机会用完
      }

    } else if (that.data.isMad) {
      //完成订单 获取疯狂抽奖次数 弹框
      if (isFromPaySuccess && totalAccount > 0) {
        that.obtainMadDialog();
      }
      that.queryMadData();
    } else {
      //完成订单 获得到衣豆数量 弹框
      if (isFromPaySuccess && totalAccount > 0) {
        if (is_guidPay) { //引导付款的 需要知道减半的倍数
          that.getTwofoldness(true);
        } else {
          that.buyObtainYidou(1);
        }
      }
    }
  },
  autoLimitDialog: function() {
    if (!isFromPaySuccess && !this.data.isBalanceLottery) {
      var Times = wx.getStorageSync("WithdrawLimitDialog");
      if (Times < 2) {
        // this.limitDialog();
        wx.setStorageSync("WithdrawLimitDialog", Times + 1);
      } else {
        this.getRaffleNum();
      }
      // wx.removeStorageSync("WithdrawLimitDialog");
    }

  },


  //疯狂新衣节 获取疯狂抽奖次数并显示在界面
  queryMadData: function() {
    var that = this;
    var dataUrl = config.Host + "signIn2_0/getCount" +
      "?token=" + token +
      "&" + config.Version;
    util.http(dataUrl, function(data) {
      if (data.status != 1) {
        return;
      }
      // console.log(res.data.data);
      that.setData({
        lotterynumber: data.LotteryNumber,
        ftask_popup: data.ftask_popup,
      });
    });
  },

  //获取转盘抽奖总次数 弹框提示
  getRaffleNum: function() {
    var that = this;
    var dataUrl = config.Host + "wallet/getRaffleNum" +
      "?token=" + token + config.Version;
    util.http(dataUrl, function(data) {
      if (data.status != 1) {
        return;
      }
      var raffleNum = data.data;
      if (raffleNum > 0) {
        that.getRaffleNumDialog(raffleNum);
      }
    });
  },

  /**
   * 开始抽奖
   */
  startLuckBtn: function(event) {

    var that = this;
    if (isRunning) {
      return;
    }
  
    that.statisticsLuck();
    //当次数用完时
    if (choujiangCount <= 0) {
      //虚拟抽奖
      if (that.data.newuser_draw){
        that.setData({
          redPacketNotenoughOne:false
        })
        that.normal_luckdraw();
        return;
      }

      if (that.data.freeling_raward)//抽中免费领
      {
        that.setData({
          luckOrBecomeMember: true
        })
        that.timeCountdown();
      } else if (reRoundCount >= 0 && that.data.redPacketOpenedShow && that.data.redPacketValue_data > 15){//如果还有轮数继续抽奖
        that.setData({
          luckOrBecomeMember: true
        })
        that.timeCountdown();
      } else if (that.data.luckOrBecomeMember) { //抽奖弹此框提示次数已经用完
        //前置20次抽完的最后一次抽完弹窗去赚钱 必做任务最后一次抽完弹窗出引导APP的弹窗
        if (that.data.luck_isFinish == 1) {
          that.tosignOrTixian();
        } else {
          if (that.data.ftask_popup == 1) {
            that.setData({
              redPacketluckOver: true,
            })
          } else {
            var pages = getCurrentPages() //获取加载的页面
            var currentPage = pages[pages.length - 2] //获取上一页面的对象
            if (currentPage.route == "pages/sign/sign") {
              wx.navigateBack({})
            } else {
              wx.redirectTo({
                url: '/pages/sign/sign',
              })
            }
          }
          // that.timeCountdown();
        }
      } else if (that.data.redPacketNotenoughOne) {
        that.setData({
          redPacketNotenoughOne: false
        })
        that.needCountTishi();
      } else if (that.data.redPacketValue_data > 0 && that.data.redPacketValue_data < 1) {
        that.setData({
          redPacketNotenoughOne: true
        })
      } else if (that.data.luckOrBecomeMember) { //离开
        wx.navigateBack({});
      } else {
        that.needCountTishi();
      }
    } else {
      if (that.data.freeling_raward)//抽中免费领
      {
        that.setData({
          luckOrBecomeMember: true
        })
        that.timeCountdown();
      } else if (that.data.free_fightLuckDraw){
        that.getLimitValue();
      } else if (that.data.redPacketOpenedShow && that.data.redPacketValue_data > 15) {
        that.setData({
          luckOrBecomeMember: true
        })
        that.timeCountdown();
      } else if (that.data.redPacketNotenoughOne){
        that.setData({
          redPacketNotenoughOne: false
        })
        that.getLimitValue();
      } else if (that.data.redPacketValue_data > 0 && that.data.redPacketValue_data < 1){
        that.setData({
          redPacketNotenoughOne: true
        })
      } else {
        that.getLimitValue();
      }
    }

    that.setData({
      redPacketOpenedShow: false,
      free_fightLuckDraw:false,
      showStartTishi:false
    });
  },

  //引导用户购买会员后的再次抽奖
  laststartLuckBtn: function(event) {

    var that = this;
    if (isRunning) {
      return;
    }

    //虚拟抽奖
    if(that.data.newuser_draw)
    {
      that.newuser_luckdraw(true);
      return;
    }
    
    that.statisticsLuck();
    //当次数用完时
    if (choujiangCount <= 0) {
      if (reRoundCount >0)
      {
        that.normal_luckdraw();
      } else if (that.data.luckOrBecomeMember) { //抽奖弹此框提示次数已经用完
        //前置20次抽完的最后一次抽完弹窗去赚钱 必做任务最后一次抽完弹窗出引导APP的弹窗
        if (that.data.luck_isFinish == 1) {
          that.tosignOrTixian();
        } else {
          if (that.data.ftask_popup == 1) {
            that.setData({
              redPacketluckOver: true,
            })
          } else {
            var pages = getCurrentPages() //获取加载的页面
            var currentPage = pages[pages.length - 2] //获取上一页面的对象
            if (currentPage.route == "pages/sign/sign") {
              wx.navigateBack({})
            } else {
              wx.redirectTo({
                url: '/pages/sign/sign',
              })
            }
          }
          // that.timeCountdown();
        }
      } else if (that.data.luckOrBecomeMember) { //离开
        wx.navigateBack({});
      } else {
        that.needCountTishi();
      }
    } else {
      that.getLimitValue();
    }

    that.setData({
      luckOrBecomeMember: false,
      redPacketOpenedShow: false
    });


  },

  //继续提现
  laststartInvitBtn: function(e) {
    cutdown_total_micro_second = 30 * 60 * 1000;
    this.countdown();
    this.setData({
      redPacketluckOver: false,
      tixianBecomeMember:false,
      getYuEShow:false
    })

    //当是会员不再弹出提现卡弹窗
    if ((this.data.is_vip > 0 && this.data.is_vip != 3) || (this.data.is_vip == 3 && this.data.maxType == 4))//是会员
    {
      // this.setData({
      //   guidebecomeMemberShow: true
      // })
    } else {
      this.tosignOrTixian();
    }
  },

  //是去跳转赚钱任务页 还是提现页
  tosignOrTixian:function(){
    if (this.data.raffle_skipSwitch == 0) {
      wx.setStorageSync('guidegotosign', true)

      var pages = getCurrentPages() //获取加载的页面
      var currentPage = pages[pages.length - 2] //获取上一页面的对象
      if (currentPage.route == "pages/sign/sign") {
        wx.navigateBack({})
      } else {
        wx.redirectTo({
          url: '/pages/sign/sign',
        })
      }
    } else if (this.data.hideTixianCard == 0 || this.data.tixian_count == 1) {
      if (this.data.tixian_count == 1) {
        wx.setStorageSync('guidegototixiancatd', true)
      }

      var pages = getCurrentPages() //获取加载的页面
      var currentPage = pages[pages.length - 2] //获取上一页面的对象
      if (currentPage.route == "pages/sign/sign") {
        wx.navigateBack({})
      } else {
        wx.redirectTo({
          url: '/pages/sign/sign',
        })
      }
    } else {

      this.setData({
        guideTixianCouponShow: true
      })
    }
  },

  //邀请好友
  guideInvit_friendsTap:function(e){
    var formId = e.detail.formId;
    if (app.globalData.user != null) {
      util.httpPushFormId(e.detail.formId);
    }
  },
  //统计抽奖次数
  statisticsLuck: function() {
    var click_id = wx.getStorageSync('luck_gdt_vid')
    var timestamp = Date.parse(new Date());
    if (click_id) {
      var clickUrl = config.Host + 'wxMarkting/marketing_order?' + config.Version +
        '&click_id=' + click_id +
        '&order_code=' + timestamp +
        "&channel=" + wx.getStorageSync("advent_channel") +
        "&token=" + app.globalData.user.userToken +
        order_channel;

      util.http(clickUrl, function(data) {
        if (data.status == 1) {
          wx.setStorageSync('luck_gdt_vid', '')
        }
      });
    }
  },
  usedYiDouAwards: function(twofoldness) {
    if (usedYidou >= 10 || unUsedYidou >= (10 / twofoldness) || usedBalance >= 10) {
      if (!wx.getStorageSync("withdraw_isWran")) {
        //抽奖提示
        this.LuckWarn(twofoldness);
        wx.setStorageSync("withdraw_isWran", true);
      } else {
        //无提示 直接开始抽奖
        this.getLimitValue(twofoldness);
      }
    } else {
      // 衣豆不足提醒
      this.notEnoughYidou();
    }
  },

  closeChoujiangTishi: function() {
    this.setData({
      showStartTishi: false
    })
  },

  //冻结衣豆抽奖 获取衣豆减半倍数
  getTwofoldness: function(is_guidPay) {
    var that = this;
    var dataUrl = config.Host + "wallet/yiDouHalve" +
      "?token=" + token + config.Version;
    util.http(dataUrl, function(data) {
      if (data.status != 1) {
        that.showToast(data.message, 2000);
        return;
      }
      if (!data.data && data.data.is_open == 1 &&
        data.data.end_date > data.now) {
        var twofoldness = 1;
        twofoldness = data.data.twofoldness;

        if (is_guidPay) {
          that.buyObtainYidou(twofoldness); //支付引导弹窗
        } else {
          that.usedYiDouAwards(twofoldness);
        }
      } else {
        if (is_guidPay) {
          that.buyObtainYidou(1); //支付引导弹窗
        } else {
          that.usedYiDouAwards(1);
        }
      }
    });
  },

  //开始抽奖
  getLimitValue: function() {
    var that = this;


    if (choujiangCount <= 0) {
      // that.showToast("活动已结束", 2000);

      that.needCountTishi();

      return
    }


    // var redPacketValue = Math.floor(Math.random() * 10 + 1);　 //输出1～10之间的随机整数
    // that.showToast(redPacketValue, 2000);

    that.setData({
      showStartTishi: false
    })

    var runningtime ;
    var lottery_kfMoney;//本轮客服抽奖金额
    var last_lotteryMoney;//上一轮客服抽奖金额 
    var kf_allMoney; //客服抽奖总金额
    var expireTime; //虚拟抽奖剩余时间

    var dataUrl = config.Host + "wallet/getnewUserRaffleMoney" +
      "?token=" + token + config.Version + '&data=' + choujiangCount;
    util.http(dataUrl, function(data) {
      if (data.status == 1) {
        isRunning = false;
        runningtime = 4200;
        redPacketValue = data.raffle_money;
        choujiangCount = data.residual_num;
        lottery_kfMoney = data.lottery_kfMoney;
        last_lotteryMoney = data.last_lotteryMoney;
        kf_allMoney = data.kf_allMoney;
        expireTime = data.expireTime;

        //标识虚拟抽奖结束
        if (luck_isFinish == 1 && reRoundCount == 0 && choujiangCount == 0) {
          wx.setStorageSync("luck_is_finish", true);

          var click_id = wx.getStorageSync('gdt_vid');
          if (click_id) {
            var clickUrl = config.Host + 'wxMarkting/v2/marketing_reservation?' + config.Version +
              '&click_id=' + click_id +
              "&channel=" + wx.getStorageSync("advent_channel");
            util.http(clickUrl, function (data) {
              if (data.status == 1) {
                wx.setStorageSync('gdt_vid', '')
              }
            });
          }
        }
        
      } else {
        if(that.data.newuser_draw){
          runningtime = 5200;
          redPacketValue = 9.80;//模拟虚假的抽奖金额
        }else{
          that.showToast(data.message, 2000);
          return;
        } 
      }

      // choujiangCount--;
      isRunning = true;

      that.setData({
        choujiangCount: choujiangCount,
        free_url: data.free_url,
        freeling_raward: false,
        luck_isFinish: luck_isFinish,
        reRoundCount:reRoundCount,
        current_roundNum: current_roundNum,
        lottery_kfMoney: lottery_kfMoney,
        last_lotteryMoney: last_lotteryMoney,
        new_kf_allMoney: kf_allMoney,
        expireTime: expireTime
      })


      var awardIndex = 0;
      if (redPacketValue >= 0 && redPacketValue < 10) {
        awardIndex = 0;
      } else if (redPacketValue >= 10 && redPacketValue < 15) {
        awardIndex = 2;
      } else if (redPacketValue >= 15 && redPacketValue < 50) {
        awardIndex = 1;
      } else if (redPacketValue >= 50 && redPacketValue < 70) {
        awardIndex = 3;
      } else if (redPacketValue >= 100 && redPacketValue < 200) {
        awardIndex = 4;
      } else if (redPacketValue >= 500 && redPacketValue < 1000) {
        awardIndex = 5;
        that.setData({
          freeling_raward:true
        })
      }
      that.roateStartLuck(awardIndex);

      // 显示抽奖结果
      setTimeout(function() {
        that.setData({
          redPacketValue_data: redPacketValue, //单次抽奖金额
          extract_money: (data.extract_money * 1).toFixed(2), //发放金额
          redPacketValue_totaldata: (data.all_money * 1).toFixed(2), //累计抽中金额
        });

        //真实抽奖金额放大多少倍
        if (data.multiple >=1)
        {
          var total_extract_money = data.multiple * data.raffle_money;
          var surplus_extract_money = (data.multiple - 1) * data.raffle_money;
          that.setData({
            multiple: data.multiple,//虚拟倍数
            surplus_day: data.day,//天数
            total_extract_money: total_extract_money.toFixed(2),//虚拟发放总金额
            surplus_extract_money: surplus_extract_money.toFixed(2),//剩余发放金额
          })
        }
        that.openRedPacket();

        isRunning = false;
      }, runningtime);
    });
  },
  //没登录第一次虚拟开始抽奖
  newuser_getLimitValue:function(btntap){
    var that = this;

    redPacketValue = 9.80;//模拟虚假的抽奖金额
    choujiangCount--;
    isRunning = true;

    that.setData({
      choujiangCount: choujiangCount,
    })

    var awardIndex = 0;
    if (redPacketValue >= 0 && redPacketValue < 10) {
      awardIndex = 0;
    } else if (redPacketValue >= 10 && redPacketValue < 15) {
      awardIndex = 2;
    } else if (redPacketValue >= 100 && redPacketValue < 200) {
      awardIndex = 4;
    } else if (redPacketValue >= 15 && redPacketValue < 50) {
      awardIndex = 1;
    } else if (redPacketValue >= 50 && redPacketValue < 70) {
      awardIndex = 3;
    } else if (redPacketValue >= 500 && redPacketValue < 1000) {
      awardIndex = 5;
    }

    //延迟1.5s转盘自动开始转
    if (!btntap){
      wx.showLoading({
        title: '请稍后',
        mask: true,
      })
    }
    var time = btntap?500:1500;
    setTimeout(function(){
      wx.hideLoading();
      that.roateStartLuck(awardIndex);
    }, time)

    // 显示抽奖结果
    setTimeout(function () {
      that.setData({
        redPacketValue_data: redPacketValue, //单次抽奖金额
        redPacketValue_totaldata: redPacketValue, //累计抽中金额
        raffle_money:redPacketValue,
        last_lotteryMoney:0,
        lottery_kfMoney: redPacketValue,
        new_kf_allMoney: redPacketValue,
        // extract_money: redPacketValue, //发放金额
        // multiple: 5,//虚拟倍数
      });

      //真实抽奖金额放大多少倍
      if (that.data.multiple >= 1) {
        var total_extract_money = that.data.multiple * that.data.raffle_money;
        var surplus_extract_money = (that.data.multiple - 1) * that.data.raffle_money;
        that.setData({
          surplus_day: 7,//天数
          total_extract_money: total_extract_money.toFixed(2),//虚拟发放总金额
          surplus_extract_money: surplus_extract_money.toFixed(2),//剩余发放金额
        })
      }

      that.openRedPacket();
      isRunning = false;
    }, 5500);
  },
  needCountTishi: function() {
    var that = this;

    if (that.data.tixian_twoCount == 1)
    {
      if((that.data.is_vip >0 && that.data.is_vip !=3) || (that.data.is_vip==3 && that.data.maxType==4)){
        // that.showToast("您今日的提现机会已用完。", 5000);
        that.setData({
          becomeMemberTixianClearLast: true
        })
      }else{
        //前置20次抽完的最后一次抽完弹窗去赚钱 必做任务最后一次抽完弹窗出引导APP的弹窗
        if (that.data.luck_isFinish == 1)
        {
          that.tosignOrTixian();
        }else{
          if (that.data.ftask_popup == 1) {
            that.setData({
              redPacketluckOver: true,
            })
          } else {
            var pages = getCurrentPages() //获取加载的页面
            var currentPage = pages[pages.length - 2] //获取上一页面的对象
            if (currentPage.route == "pages/sign/sign") {
              wx.navigateBack({})
            } else {
              wx.redirectTo({
                url: '/pages/sign/sign',
              })
            }
          }
          // that.timeCountdown();
        }
      }
    }else{
      if ((that.data.is_vip > 0 && that.data.is_vip != 3) || (that.data.is_vip == 3 && that.data.maxType == 4)) {
        that.setData({
          becomeMemberTixianClearLast: true
        })
      } else {
        // that.setData({
        //   getYuEShow: true
        // })

        if (that.data.ftask_popup == 1) {
          that.setData({
            getYuEShow: true,
          })
        } else {
          var pages = getCurrentPages() //获取加载的页面
          var currentPage = pages[pages.length - 2] //获取上一页面的对象
          if (currentPage.route == "pages/sign/sign") {
            wx.navigateBack({})
          } else {
            wx.redirectTo({
              url: '/pages/sign/sign',
            })
          }
        }
      }
    }
  },

  roateStartLuck: function(awardIndex) {
    var that = this;
    var runNum = 6;
    runDegs = runDegs + (360 - runDegs % 360) + (360 * runNum - awardIndex * (360 / 6));
    var animationRun = wx.createAnimation({
      duration: 4000,
      timingFunction: 'ease-out'
    });
    that.animationRun = animationRun;
    animationRun.rotate(runDegs).step();
    that.setData({
      zp_animationData: animationRun.export(),
    });
  },

  roateStartLuckBefor: function() {
    var that = this;
    var runNum = 18;
    var awardIndex = 3;
    runDegs = runDegs + (360 - runDegs % 360) + (360 * runNum - awardIndex * (360 / 4));
    var animationRun = wx.createAnimation({
      duration: 12000,
      timingFunction: 'ease-in'
    });
    that.animationRun = animationRun;
    animationRun.rotate(runDegs).step();
    that.setData({
      zp_animationData: animationRun.export(),
    });
  },

  
  //抽奖提醒
  LuckWarn: function(twofoldness) {
    this.setData({
      LuckWarnShow: true,
      twofoldness_data: twofoldness
    });
  },
  //抽奖提醒 确定开始抽奖
  LuckWarnRigth: function() {
    this.setData({
      LuckWarnShow: false
    });
    this.getLimitValue(this.data.twofoldness_data);
  },

  //总共有多少次抽奖机会弹窗
  getRaffleNumDialog: function(raffleNum) {
    this.setData({
      raffleNum_data: raffleNum,
      raffleNumShow: true //显示
    });
  },

  //衣豆不足弹窗
  notEnoughYidou: function() {
    this.setData({
      notEnoughYidouShow: true
    });
  },
  //如何获得余额
  getYuE: function() {
    this.setData({
      notEnoughYidouShow: false,
      getYuEShow: true
    });
  },
  getYuEBtnLeft: function() {
    this.setData({
      getYuEShow: false
    });
    this.toSignPager();
  },
  getYuEBtnRigth: function() {
    if (wx.getStorageSync("LingYUANGOUTishi_toGetYuE") == 1) {
      //0元购美衣
      this.setData({
        getYuEShow: false,
        zeroBuyDialogShowFlag: true,
      });
      wx.setStorageSync("LingYUANGOUTishi_toGetYuE", 1)
    } else {
      this.toMainPager();
    }
  },

  //0元购美衣 去0元购
  zeroBuyNowClick: function() {
    this.toMainPager();
  },
  //如何获得衣豆
  getYiDou: function() {
    this.setData({
      notEnoughYidouShow: false,
      getYiDouShow: true
    });
  },
  getYiDouBtn: function() {
    this.toMainPager();
  },

  //普通 抽中红包 拆红包弹窗显示
  openRedPacket: function() {
    this.setData({
      openRedPacketShow: true
    });
  },
  //点击拆红包按钮  
  redPacketOpened: function() {
    var that = this;

    if (n1timer != undefined) {
      clearInterval(n1timer.interval);
      n1timer.interval = null;
    }
    
    //第二轮最后一次拆红包需订阅消息
    if (luck_isFinish == 1 && current_roundNum==2 && choujiangCount == 0 && app.globalData.user != null){
      var ids = '';
      
      if (config.Host.indexOf("www.52yifu.wang") != -1)//测试环境
      {
        ids = ['SSLLEobwBCfsE8aXs89jzIsE9NNkmJxHNOSDSkpiaPo', 'VNIahV67MYiEKuhwDCCVvqdQuEZbTj1D5l7nj_TMWGk', 'vhbEjSHVOs5oCGbkhWxaAvhxzKj8fQGRDcCD2TI8vZI'];
      }else{
        ids = ['YYPs9vHnqNDTNNkhL0zJFnEqNYXBfMdVCU1hnVIm-Ow', 'MoZmyHvBikwilHNTS6u0MQvOh5faY-dwa0ogSRhMQaU', 'DC2E0pBII-4XTg-EczPnwN5jCY1B7s8YRSeoItQAMYA'];
      }

      wx.requestSubscribeMessage({
        tmplIds: ids,
        success(res) {
          var temp_id = ids[0];
          if (res[temp_id] == 'accept') { //授权成功
            console.log("accept")
            //上传ids到后台
            util.handleTempl_http(ids, function (data) {
              if (data.status == 1) { }
            })
          }

          if (that.data.extract_money > 0) 
          {
            wx.showLoading({
              title: '',
            })
            var dataUrl = config.Host + "wallet/newUserDoRaffle" +
              "?token=" + token + config.Version;
            util.http(dataUrl, function (data) {
              wx.hideLoading();
              if (data.status == 1) {
                that.setData({
                  openRedPacketShow: false,
                  redPacketOpenedShow: true
                });
              } else {
                that.setData({
                  openRedPacketShow: false,
                });
                that.showToast(data.message, 2000);
              }
            });
          } else if(that.data.lottery_kfMoney >0){
            that.setData({
              kf_allMoney: that.data.last_lotteryMoney < 0 ? 0 : that.data.last_lotteryMoney,
              openRedPacketShow: false,
              redPacketOpenedShow: true
            });

            that.timeCountdown();
          } else {
            that.setData({
              openRedPacketShow: false,
              redPacketOpenedShow: true
            });
          }
        }
      })

    } else {

      if (that.data.extract_money > 0 && !that.data.newuser_draw) 
      {
        wx.showLoading({
          title: '',
        })
        var dataUrl = config.Host + "wallet/newUserDoRaffle" +
          "?token=" + token + config.Version;
        util.http(dataUrl, function (data) { 
          wx.hideLoading();
          if(data.status == 1){
            that.setData({
              openRedPacketShow: false,
              redPacketOpenedShow: true
            });
          } else {
            that.setData({
              openRedPacketShow: false,
            });
            that.showToast(data.message, 2000);
          }
        });
      } else if (that.data.lottery_kfMoney > 0) {
        that.setData({
          kf_allMoney: that.data.last_lotteryMoney < 0 ? 0 : that.data.last_lotteryMoney,
          openRedPacketShow: false,
          redPacketOpenedShow: true
        });

        that.timeCountdown();
      } else{
        that.setData({
          openRedPacketShow: false,
          redPacketOpenedShow: true
        });
      }
    }
  },
  
  //授权获取手机
  getPhoneNumber:function(e){
    var that = this;
    var code = '';
    wx.login({
      success(res) {
        console.log(res);
        code = res.code;

        console.log(e.detail.errMsg == "getPhoneNumber:ok");
        if (e.detail.errMsg == "getPhoneNumber:ok") {
          var medata = {};
          medata.code = code;
          medata.encryptedData = encodeURI(e.detail.encryptedData);
          medata.iv = encodeURI(e.detail.iv);

          util.getPhone_http(medata, function (data) {
            if (data.status == 1) {

            }
          })

        }
      }
    })

    

    if (that.data.extract_money > 0) {
      wx.showLoading({
        title: '',
      })
      var dataUrl = config.Host + "wallet/newUserDoRaffle" +
        "?token=" + token + config.Version;
      util.http(dataUrl, function (data) {
        wx.hideLoading();
        if (data.status == 1) {
          that.setData({
            openRedPacketShow: false,
            redPacketOpenedShow: true
          });
        } else {
          that.setData({
            openRedPacketShow: false,
          });
          that.showToast(data.message, 2000);
        }
      });
    } else {
      that.setData({
        openRedPacketShow: false,
        redPacketOpenedShow: true
      });
    }
  },
  //疯狂新衣节中红包 拆红包弹窗显示
  madOpenRedPacket: function() {
    this.setData({
      madOpenRedPacketShow: true
    });
  },

  //疯狂新衣节中红包 点击拆红包
  madRedPacketOpened: function() {
    
    this.setData({
      madOpenRedPacketShow: false,
      madRedPacketOpenedShow: true
    });
  },


  //没有抽中红包
  noRedPacket: function() {
    this.setData({
      noRedPacketShow: true
    });
  },

  //支付成功 新衣节获得疯狂抽奖机会弹窗
  obtainMadDialog: function() {
    var num = Math.ceil(totalAccount / 5);
    this.setData({
      payLotteryNumber: num,
      obtainMadDialogShow: true
    });
  },

  //额度说明
  limitDialog: function() {
    this.setData({
      limitDialogShow: true
    });
  },


  //买买买去首页
  toMainPager: function() {
    wx.switchTab({
      url: '../../shouye/shouye',
    });
  },

  //去赚钱页面
  toSignPager: function() {
    
    util.backToSignPager('../sign');
  },

  bind_tap_not: function() {
    this.showToast("只能到App才能查看哦~", 2000);
  },


  bottomTap: function(e) {
    util.httpPushFormId(e.detail.formId); //表单 调用  传给后台
    // console.log(e.detail.formId);
    if (!this.data.isMad || this.data.isBalanceLottery) {
      this.getYiDou();
    } else {
      //疯狂新衣节
      this.toMainPager();
    }

  },

  backPager: function(delta) {
    wx.navigateBack({
      delta: delta
    });
  },

  /**
   * 获取数据  奖励列表   额度
   */
  initLimitAwardsList: function() {
    var that = this;

    for (var i = 0; i < 50; i++) {
      if (i % 3 == 0 && that.data.isshow_freeFight)
      {
        dataListTemp1.push(that.addToLimitList_free());
      }else{
        dataListTemp1.push(that.addToLimitList());
      }
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
  scrolltolower2: function() {
    var temp2 = this.data.mListData2;
    // for (var i in dataListTemp2) {
    //   temp2.push(dataListTemp2[i]);
    // }
    Array.prototype.push.apply(temp2, dataListTemp2);
    this.setData({
      mListData2: temp2
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


    var num = parseInt(Math.random() * (16 - 8) + 8);
    if (num == 8 || num == 15) {
      limitData["num"] = "+" + num + ".00";

    } else {
      limitData["num"] = "+" + num + util.getVirtualDecimalAwardsWithdrawal();

    }

    limitData["pic"] = config.Upyun + "defaultcommentimage/" + util.getDefaultImg();
    limitData["type"] = 1;
    limitData["content"] = "获得了提现现金";
    return limitData;
  },
  addToLimitList_free: function () {  
    
    var limitData = {};
    limitData["nname"] = util.getVirtualName() + "***" + util.getVirtualName();
    limitData["num"] = '原价' + parseInt(Math.random() * 300 + 100) + ".0";

    //随机品牌
    var randomSub = this.data.supplabelList[parseInt(Math.random() * (this.data.supplabelList.length - 1))].name;

    //随机二级类目
    var randomType2 = this.data.typelist[parseInt(Math.random() * (this.data.typelist.length - 1))].class_name;

    //x元购
    var buypriceData = ["9.9", "19.9", "29.9", ""];
    var buyprice = buypriceData[parseInt(Math.random() * (buypriceData.length - 1))];

    limitData["content"] = "免费领走了" + randomSub + randomType2;

    limitData["pic"] = config.Upyun + "defaultcommentimage/" + util.getDefaultImg();
    return limitData;
  },

  /**
   * 获取数据  奖励列表   衣豆
   */
  initYiDouAwardsList: function() {
    var that = this;
    var dataUrl = config.Host + "wallet/getNewData" +
      "?" + config.Version;
    util.http(dataUrl, function(data) {
      if (data.status != 1 || !data.data) {
        for (var i = 0; i < 50; i++) {
          dataListTemp2.push(that.addToYiDouList());
        }
        that.setData({
          mListData2: dataListTemp2
        });
        return;
      }
      var dts = data.data;
      var result2 = [];

      for (var i in dts) {
        var datas = JSON.parse(dts[i]);
        var pic = datas.pic;
        if (!pic.startsWith('http')) {
          datas["pic"] = config.Upyun + pic;
        }
        result2 = result2.concat(datas);
      }
      for (var i = 0; i < 50; i++) {
        if (i < result2.length * 2) { //前面result1.size()*2条数据互相穿插数据
          if (i % 2 == 0) {
            dataListTemp2.push(result2[i / 2]); //添加到总集合  键值和虚拟添加的键值保持一致
          } else {
            dataListTemp2.push(that.addToYiDouList());
          }
        } else {
          dataListTemp2.push(that.addToYiDouList());
        }
      }
      that.setData({
        mListData2: dataListTemp2
      });
    });
  },

  /**
   * 添加虚拟数据到 衣豆奖励集合
   * 
   */
  addToYiDouList: function() {
    var yiDouData = {};
    yiDouData["nname"] = util.getVirtualName() + "***" + util.getVirtualName();
    yiDouData["num"] = parseInt(Math.random() * (401 - 10) + 10);
    yiDouData["p_name"] = "完成订单获得衣豆";
    yiDouData["pic"] = config.Upyun + "defaultcommentimage/" + util.getDefaultImg();
    return yiDouData;
  },

  bind_tap_yidou: function() {
    
    util.navigateTo('../yidouDetail/yidouDetail');
  },

  //去提现
  bind_tap_withdraw: function() {
    wx.redirectTo({
      // url: '../../mine/wallet/wallet'
      url: '../../mine/wallet/Withdrawals/Withdrawals'
    });
  },

  //额度明细
  bind_tap_withdraw_detail: function() {
    
    util.navigateTo('../yidouDetail/tixianDetail');

    this.setData({
      redPacketOpenedShow: false,
      madRedPacketOpenedShow: false,
    });
  },

  /**
   * type  =1 获得5次抽奖机.
    type  =2 5次抽奖机会 用完
   */
  getBalanceLottery: function(type) {
    if (type == 1) {
      this.setData({
        balanceLottery_data: balanceLottery,
        balanceLotteryShow: true
      });
    } else if (type == 2) {
      var balanceLotteryCount = wx.getStorageSync("BALANCE_LOTTERY_SUM_COUNT");
      if (!balanceLotteryCount) {
        balanceLotteryCount = 0;
      }
      balanceLotterySum = wx.getStorageSync("BALANCE_LOTTERY_SUM_VALUE");
      if (!balanceLotterySum) {
        balanceLotterySum = 0;
      }
      this.setData({
        balanceLotterySum_data: balanceLotterySum.toFixed(2),
        balanceLotteryCount_data: balanceLotteryCount,
        balanceLotteryOverShow: true
      });
    }
  },

  balanceLotteryOver_btn: function() {
    this.setData({
      balanceLotteryOverShow: false
    });
    if (isFromSignBalanceLottery) {
      this.toMainPager();
    } else {
      this.backPager(1);
    }

  },
  //接通客服
  messageTap: function() {

    var dataUrl = config.Host + "signIn2_0/inspectHideTask" +
      "?token=" + token + config.Version;
    util.http(dataUrl, function(data) {});
  },
  //抽中红包 (余额抽奖)
  openRedPacketBalance: function() {
    this.setData({
      openRedPacketBalanceShow: true
    });
  },
  //点击拆红包按钮 (余额抽奖)
  redPacketOpenedBalance: function() {
    this.setData({
      openRedPacketBalanceShow: false,
      redPacketOpenedBalanceShow: true
    });
    // this.initData(true);
  },
  //没有抽中红包 (余额抽奖)
  noRedPacketBalance: function() {
    this.setData({
      noRedPacketBalanceShow: true
    });
  },

  //关闭邀请弹框
  closeInvitImage: function() {
    this.setData({
      guidebecomeMemberShow: false
    })
  },

  //引导去购买提现券
  tixiancouponTap:function(){
    tixianCouponBack = true;
    this.setData({
      guideTixianCouponShow: false,
    })

    if (cardInterval) {
      clearInterval(cardInterval);
    }
    
    if (this.data.raffle_skipSwitch == 0){
      wx.setStorageSync('guidegotosign', true)

      var pages = getCurrentPages() //获取加载的页面
      var currentPage = pages[pages.length - 2] //获取上一页面的对象
      if (currentPage.route == "pages/sign/sign") {
        wx.navigateBack({})
      } else {
        wx.redirectTo({
          url: '/pages/sign/sign',
        })
      }
    }else if (this.data.hideTixianCard == 0 || this.data.tixian_count == 1) {
      if (this.data.tixian_count == 1) {
        wx.setStorageSync('guidegototixiancatd', true)
      }

      var pages = getCurrentPages() //获取加载的页面
      var currentPage = pages[pages.length - 2] //获取上一页面的对象
      if (currentPage.route == "pages/sign/sign") {
        wx.navigateBack({})
      } else {
        wx.redirectTo({
          url: '/pages/sign/sign',
        })
      }
    }else{
      wx.navigateTo({
        url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=' + 'draw'
      })
    }
  },
  //关闭提现券弹框
  closeTixianCoupon:function(){
   
    if (tixianInterval) {
      clearInterval(tixianInterval);
    }
    if (cardInterval) {
      clearInterval(cardInterval);
    }
    this.setData({
      guideTixianCouponShow:false,
    })
  },
  closeToTX: function () {
    this.setData({
      guideTixianCouponShow: false,
    })
  },
  //邀请好友点问号
  wenhaoTap: function() {
    this.showToast('邀请好友仅限首次来衣蝠的女性用户', 2000);
  },

  to_bind_wx: function() {
    wx.navigateTo({
      url: '../../mine/wallet/wallet?withdrawToBindWx=true'
    });
    this.setData({
      wxIsNotBindShow: false,
    });
  },

  //立即提现10元
  tixianTenYuan:function(){

    wx.navigateTo({
      url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=' + 'draw_vip_tixian',
    })
  },
  
  //引导购买提现卡倒计时
  countdown: function() {
    var that = this;
    
    if (tixianInterval) {
      clearInterval(tixianInterval);
    }
    if (cardInterval){
      clearInterval(cardInterval);
    }
    if (cutdown_total_micro_second <= 0) {
      //时间截至
      that.setData({
        clock_hr: "00",
        clock_min: "00",
        clock_ss: "00",
        time: hr + ':' + min + ':' + sec
      });
      return;
    }
    cardInterval = setInterval(function () {
      cutdown_total_micro_second -= 1000;
      that.dateformat(cutdown_total_micro_second);
    }, 1000);
  },

  dateformat: function(micro_second) {

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
      time: hr + ':' + min + ':' + sec
    });
  },

  //提现倒计时
  timeCountdown:function(){
    var that = this;
    if (!cutdown_total_micro_second2){
      cutdown_total_micro_second2 = that.data.expireTime ? that.data.expireTime : 9 * 60 * 1000;
    }
    that.tixiancountdown();
    that.animationMoney();
  },
  tixiancountdown: function () {
    var that = this;

    if (tixianInterval) {
      clearInterval(tixianInterval);
    }
    if (cardInterval) {
      clearInterval(cardInterval);
    }

    tixianInterval = setInterval(function () {
      cutdown_total_micro_second2 -= 1000;

      that.tixiandateformat(cutdown_total_micro_second2);
      
      if (cutdown_total_micro_second2 <= 0) {
        cutdown_total_micro_second2 = 9 * 60 * 1000;
        if (tixianInterval) {
          clearInterval(tixianInterval);
          that.tixiancountdown();
        }
      }
    }, 1000);
  },
  tixiandateformat: function (micro_second) {

    var that = this;
    // 总秒数
    var second = Math.floor(micro_second / 100);

    // 分钟
    var min = "" + Math.floor(second / 60 / 10 % 60);
    // 秒
    var sec = "" + Math.floor(second / 10 % 60);
    // 分秒
    var sss = "" + Math.floor(second % 10); 

    if (min.length < 2) {
      min = '0' + min;
    }

    if (sec.length < 2) {
      sec = '0' + sec;
    }

    that.setData({
      clock_min: min,
      clock_ss: sec,
      time: min + ':' + sec,
    });
  },

  animationMoney:function(){

    let num1 = this.data.last_lotteryMoney<0?0:this.data.last_lotteryMoney;
    let num2 = this.data.new_kf_allMoney;
    let refreshTime = (num2*100-num1*100)/1;
    let n1 = new NumberAnimate({
      from: num1,//开始时的数字
      to:num2,//结束时的数字
      speed: 1500,// 总时间
      refreshTime: 100,// 刷新一次的时间
      decimals: 3,//小数点后的位数
      onUpdate: () => {//更新回调函数
        this.setData({
          kf_allMoney: (n1.tempValue*1).toFixed(2)
        });
      },
      onComplete: () => {//完成回调函数
        
      }
    });
    n1timer = n1;
  },
  onShareAppMessage: function(res) {
    var that = this;
    var title = '';
    var path = '';
    var imageUrl = '';
    if (res.from == 'button') {
      is_invitshare = true;
      title = "👇点击领取您的90元任务奖金！"
      if (app.globalData.user) {
        path = "/pages/sign/sign?isShareFlag=true&user_id=" + app.globalData.user.user_id + "&showSignPage=true";
      } else {
        path = "/pages/sign/sign?isShareFlag=true&showSignPage=true";
      }
      imageUrl = config.Upyun + "small-iconImages/heboImg/taskraward_shareImg.png"

    } else {
      title = '👇点击领取您的90元任务奖金！';
      imageUrl = config.Upyun + '/small-iconImages/heboImg/taskraward_shareImg.png';
      if (app.globalData.user != null && app.globalData.user.user_id != undefined) {
        path = '/pages/mine/withdrawLimitTwo/withdrawLimitTwo?' + "isShareFlag=true" + "&user_id=" + app.globalData.user.user_id;
      } else {
        path = '/pages/mine/withdrawLimitTwo/withdrawLimitTwo?' + "isShareFlag=true";
      }
    }

    return {

      title: title,
      path: path,
      imageUrl: imageUrl,
      success: function(res) {
        // 转发成功
        this.showToast('分享成功', 2000);
      },
      fail: function(res) {
        // 转发失败
        this.showToast('分享失败', 2000);
      }
    }
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
