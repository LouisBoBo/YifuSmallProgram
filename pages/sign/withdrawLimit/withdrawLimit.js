import config from '../../../config';
var util = require('../../../utils/util.js');
var publicUtil = require('../../../utils/publicUtil.js');

var app = getApp();
var token;

var mSumBalance = 0;//总余额
var mLimit = 0;//总额度
var usedYidou = 0; //可用衣豆
var unUsedYidou = 0;//冻结衣豆
var usedBalance = 0; //可用余额
var unUsedBalance = 0;//冻结余额
var isRunning = false;//是否正在抽奖
var raffleType = 0;//抽中红包类型
var redPacketValue = 0;//红包金额
var isFromPaySuccess = false;//是否支付成功后
var totalAccount = 0;//支付金额 待换算为抽奖次数

var balanceLottery = 0;
var balanceLotterySum = 0;

var isFromSignBalanceLottery = false;

var dataListTemp1 = [];
var dataListTemp2 = [];
var isMoving = false;
var scollTimeOut;
var scollTimePause;
var wxIsNotBind=false;

var runDegs=0;
// var pRatio = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    isMad: false,
    animationData:{},
    mSumBalance_data: 0.00.toFixed(2),
    mLimit_data: 0.00.toFixed(2),
    usedYidou_data: "可用衣豆：" + usedYidou,
    unUsedYidou_data: "冻结衣豆：" + unUsedYidou,
    lotterynumber: 0,//疯狂新衣节 剩余抽奖次数
    redPacketValue_data: 0,//抽中红包金额
    twofoldness_data: 1,//衣豆减半抽奖倍数
    raffleNum_data: 0,//非支付成功进来 提醒有多少次抽奖机会
    raffleType_data: 0,//抽中红包类型
    payYiDouNumber: 0,//完成订单 获得衣豆的数量
    payLotteryNumber: 0,//完成订单 疯狂新衣节 抽奖获得次数

    isBalanceLottery: false,//5次体验抽余额机会
    balanceLottery_data: 0,//体验抽余额红包的次数
    balanceLotterySum_data: 0,//体验抽余额红包的总金额
    balanceLotteryCount_data: 0,//体验抽余额红包的总次数


    notEnoughYidouShow: false,//衣豆不足
    getYuEShow: false,//如何获得余额
    getYiDouShow: false,//如何获得衣豆
    LuckWarnShow: false,//是否使用衣豆抽奖
    raffleNumShow: false,//非支付成功进来 提醒有多少次抽奖机会
    noRedPacketShow: false,//没有抽中红包
    openRedPacketShow: false,//普通抽中红包 拆红包弹窗
    redPacketOpenedShow: false,//普通抽中红包 拆红包后显示金额
    madOpenRedPacketShow: false,//疯狂新衣节 拆红包弹窗
    madRedPacketOpenedShow: false,//疯狂新衣节  拆红包后显示金额
    buyObtainYidouShow: false,//支付成功获得衣豆弹窗
    obtainMadDialogShow: false,//支付成功 疯狂新衣节 抽奖获得次数弹窗
    limitDialogShow: false,//额度说明弹窗

    balanceLotteryShow: false,//体验抽余额红包的次数弹窗
    balanceLotteryOverShow: false,//体验抽余额红包的次数用完弹窗
    noRedPacketBalanceShow: false,//抽余额红包未中红包
    openRedPacketBalanceShow: false,//体验余额抽奖 抽中红包
    redPacketOpenedBalanceShow: false,//体验余额抽奖 拆开红包后得到金额弹窗
    wxIsNotBindShow: false,//wxIsBindShow 用户未绑定微信提现账户的提示弹窗
    zeroBuyDialogShowFlag:false,//0元购弹窗

    scrollTop1: 0,
    scrollTop2: 0,
    mListData1: [],
    mListData2: []
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    token = app.globalData.user.userToken;
    runDegs = 0;
    mSumBalance = 0;
    mLimit = 0;
    usedYidou = 0;
    unUsedYidou = 0;//可用衣豆 ，冻结衣豆
    usedBalance = 0;
    unUsedBalance = 0;//可用余额 冻结余额
    isRunning = false;//是否正在抽奖
    raffleType = 0;//抽中红包类型
    redPacketValue = 0;//红包金额
    balanceLottery = 0;
    balanceLotterySum = 0;
    dataListTemp1 = [];
    dataListTemp2 = [];
    isMoving = false;
    wxIsNotBind = false;
    isFromPaySuccess = options.isFromPaySuccess;
    if (isFromPaySuccess) {
      totalAccount = options.totalAccount;
    }

    try {
      var mad = wx.getStorageSync("HASMOD")//获取疯狂新衣节
      if (!mad) {
        mad = false;
      }
    } catch (e) {
      mad = false;
    }

    this.setData({
      isMad: mad,
      isBalanceLottery: options.isBalanceLottery,
      // isMad: true
    });
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
    if (scollTimePause){
      clearInterval(scollTimePause);
      scollTimePause = null; 
    }
    this.initLimitAwardsList();
    if (!this.data.isMad || this.data.isBalanceLottery) {
      this.initYiDouAwardsList();
    }

    if (!this.data.isBalanceLottery) {
      this.getWxIsNotBind();
    }
    // publicUtil.getBalanceNum(this.isShowRed);

      
  },
  // isShowRed: function (isShowRed){
  //   console.log("getBalanceNum_boolean", isShowRed)
  // },
  dialog_close: function () {
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
      wxIsNotBindShow:false,
    });
  },

  //关闭相关弹窗时候 用户是否绑定提现微信则另一个弹窗提示
  dialog_close_toBind: function () {
    this.setData({
      raffleNumShow: false,
      noRedPacketShow: false,
      redPacketOpenedShow: false,
      madRedPacketOpenedShow: false,
    });
    if (wxIsNotBind) {
      // this.setData({
      //   wxIsNotBindShow: true,
      // });
    }
  },
  //0元购美衣弹窗关闭
  zeroBuyCloseClick: function () {
    this.setData({
      zeroBuyDialogShowFlag: false,
    });
  },

  initData: function (isRefresh) {
    var that = this;
    var dataUrl = config.Host + "wallet/myWallet" +
      "?token=" + token + config.Version;
    util.httpNeedLogin(dataUrl, function (data) {
      if (data.status != 1) {
        that.showToast(data.message, 2000);
        return;
      }

      usedYidou = data.peas;//可用衣豆 
      unUsedYidou = data.peas_free;// 冻结衣豆
      usedBalance = data.balance; //可用余额 
      unUsedBalance = data.freeze_balance;// 冻结余额
      mSumBalance = usedBalance + unUsedBalance;
      mLimit = data.extract + data.ex_free;

      that.setData({
        mSumBalance_data: mSumBalance.toFixed(2),
        mLimit_data: mLimit.toFixed(2),
        usedYidou_data: "可用衣豆：" + usedYidou,
        unUsedYidou_data: "冻结衣豆：" + unUsedYidou,
      });


      if (!isRefresh) {
        that.autoLimitDialog();
        that.initDialog();
      }

    }, this.reInitData);
  },
  reInitData:function(){
    token = app.globalData.user.userToken;
    this.initData();
  },
  //刚进来的时候的弹窗
  initDialog: function () {
    var that = this;
    if (that.data.isBalanceLottery) {
      //   setBalanceInit();
      if (balanceLottery > 0) {
        that.getBalanceLottery(1);//获得免费抽奖机会
      } else {
        that.getBalanceLottery(2);//免费抽奖机会用完
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
        if (is_guidPay) {//引导付款的 需要知道减半的倍数
          that.getTwofoldness(true);
        } else {
          that.buyObtainYidou(1);
        }
      }
    }
  },
  autoLimitDialog: function () {
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
  queryMadData: function () {
    var that = this;
    var dataUrl = config.Host + "signIn2_0/getCount" +
      "?token=" + token +
      "&" + config.Version;
    util.http(dataUrl, function (data) {
      if (data.status != 1) {
        return;
      }
      // console.log(res.data.data);
      that.setData({
        lotterynumber: data.LotteryNumber
      });
    });
  },

  //获取转盘抽奖总次数 弹框提示
  getRaffleNum: function () {
    var that = this;
    var dataUrl = config.Host + "wallet/getRaffleNum" +
      "?token=" + token + config.Version;
    util.http(dataUrl, function (data) {
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
  startLuckBtn: function (event) {
    // console.log(event);
    var that = this;
    that.dialog_close();
    if (isRunning) {
      return;
    }
    if (that.data.isBalanceLottery) {
      if (balanceLottery > 0) {
        that.getBalanceValue();
      } else {
        that.getBalanceLottery(2);//提示次数使用完了
      }
    } else if (that.data.isMad && that.data.lotterynumber > 0) {//疯狂新衣节
      that.getLimitValue(1);
    } else {
      //先获取衣豆是否减半抽奖 再使用多少个衣豆抽奖
      if (usedYidou >= 10) {
        //优先可用衣豆 可用衣豆不参与衣豆减半抽奖活动
        that.usedYiDouAwards(1);

      } else if (unUsedYidou > 0) {
        // 可用衣豆用完 使用冻结衣豆 要获取是否衣豆减半抽奖
        //false 是抽奖 不是引导支付之后的弹框
        that.getTwofoldness(false);
      } else if (usedBalance >= 10) {//新增使用非冻结余额抽提现额度
        that.usedYiDouAwards(1);
      } else {
        // 衣豆不足提醒
        that.notEnoughYidou();
      }

    }
  },

  usedYiDouAwards: function (twofoldness) {
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


  //冻结衣豆抽奖 获取衣豆减半倍数
  getTwofoldness: function (is_guidPay) {
    var that = this;
    var dataUrl = config.Host + "wallet/yiDouHalve" +
      "?token=" + token + config.Version;
    util.http(dataUrl, function (data) {
      if (data.status != 1) {
        that.showToast(data.message, 2000);
        return;
      }
      if (!data.data && data.data.is_open == 1 &&
        data.data.end_date > data.now) {
        var twofoldness = 1;
        twofoldness = data.data.twofoldness;

        if (is_guidPay) {
          that.buyObtainYidou(twofoldness);//支付引导弹窗
        } else {
          that.usedYiDouAwards(twofoldness);
        }
      } else {
        if (is_guidPay) {
          that.buyObtainYidou(1);//支付引导弹窗
        } else {
          that.usedYiDouAwards(1);
        }
      }
    });
  },

  //开始抽奖
  getLimitValue: function (twofoldness) {
    var that = this;
    isRunning = true;
    raffleType = 0;//重置抽中红包类型
    redPacketValue = 0;///重置前一次的抽奖金额
    that.roateStartLuckBefor();

    // wx.showLoading({
    //   title: '抽奖中……',
    // })
    var dataUrl = config.Host + "wallet/doRaffle" +
      "?token=" + token + config.Version;
    util.http(dataUrl, function (data) {
      console.log("data---------->", data);
      if (data.status != 1) {
        isRunning = false;
        if (data.status == 201) {
          //衣豆或余额不足
          // wx.hideLoading();
          that.notEnoughYidou();
        }else{
          // setTimeout(function () {
          //   // wx.hideLoading();
          //   isRunning = false;
          //   that.showToast(data.message, 2000);
          // }, 300);
          that.showToast(data.message, 2000);
        }
        return;
      }
      
      if (data.status == 1) {
        //获取抽奖结果
        if (that.data.isMad && that.data.lotterynumber > 0) {//是疯狂星期一 并且剩余次数大于0  扣除剩余次数
          that.setData({
            lotterynumber: that.data.lotterynumber - 1
          });
        } else if (usedYidou >= 10) {//优先使用可用衣豆 扣除可用衣豆
          usedYidou = usedYidou - 10;
          that.setData({
            usedYidou_data: "可用衣豆：" + usedYidou,
          });
        } else if (unUsedYidou >= (10 / twofoldness)) {// 没有可用衣豆 扣除冻结衣豆
          unUsedYidou = unUsedYidou - (10 / twofoldness);
          that.setData({
            unUsedYidou_data: "冻结衣豆：" + unUsedYidou,
          });

        } else if (usedBalance >= 10) {//使用非冻结余额抽奖
          usedBalance = usedBalance - 10;//减少可用余额 下次抽奖判断可用余额
          mSumBalance = mSumBalance - 10;//可用余额减少 对应总余额也减少
          that.setData({
            mSumBalance_data: mSumBalance.toFixed(2),
          });
        }

        raffleType = data.t;//抽中红包类型
        redPacketValue = data.raffle;//红包金额

      } 

      var awardIndex = 0;
      //先处理未中奖
      if (redPacketValue <= 0){
        awardIndex = 7; //未中奖
      }else{ //中奖
      //如果中的是余额，固定到1-50
        //先确定中奖类型
        if (raffleType == 1) {//抽中的是余额
          awardIndex = 0;
        }else{ //中的是提现
          if (redPacketValue >= 0.01 && redPacketValue < 1) {
            awardIndex = 6;
          } else if (redPacketValue >= 1 && redPacketValue < 3) {
            awardIndex = 5;
          } else if (redPacketValue >= 3 && redPacketValue < 5) {
            awardIndex = 4;
          } else if (redPacketValue >= 5 && redPacketValue < 10) {
            awardIndex = 3;
          } else if (redPacketValue >= 10 && redPacketValue < 20) {
            awardIndex = 2;
          } else if (redPacketValue >= 20 && redPacketValue < 50) {
            awardIndex = 1
          } else {
            awardIndex = 7; 
          }
        }

      }



      that.roateStartLuck(awardIndex);

      // 显示抽奖结果
      setTimeout(function () {
        if (redPacketValue > 0) {
          that.setData({
            raffleType_data: raffleType,//抽中的额度
            redPacketValue_data: redPacketValue //抽奖金额
          });
          if (that.data.isMad) {
            that.madOpenRedPacket();
          } else {
            that.openRedPacket();
          }
        } else {
          that.noRedPacket();
        }
        // wx.hideLoading();
        isRunning = false;
      }, 4200);
    });
  },

  roateStartLuck: function (awardIndex) {
    var that = this;
    var runNum =6;
    runDegs = runDegs + (360 - runDegs % 360) + (360 * runNum - awardIndex * (360 / 8));
    var animationRun = wx.createAnimation({
      duration:4000,
      timingFunction: 'ease-out'
    });
    that.animationRun = animationRun;
    animationRun.rotate(runDegs).step();
    that.setData({
      animationData: animationRun.export(),
    });
  },

  roateStartLuckBefor: function () {
    var that = this;
    var runNum =18;
    var awardIndex = 7;
    runDegs = runDegs + (360 - runDegs % 360) + (360 * runNum - awardIndex * (360 / 8));
    var animationRun = wx.createAnimation({
      duration: 12000,
      timingFunction: 'ease-in'
    });
    that.animationRun = animationRun;
    animationRun.rotate(runDegs).step();
    that.setData({
      animationData: animationRun.export(),
    });
  },

  //抽奖提醒
  LuckWarn: function (twofoldness) {
    this.setData({
      LuckWarnShow: true,
      twofoldness_data: twofoldness
    });
  },
  //抽奖提醒 确定开始抽奖
  LuckWarnRigth: function () {
    this.setData({
      LuckWarnShow: false
    });
    this.getLimitValue(this.data.twofoldness_data);
  },

  //总共有多少次抽奖机会弹窗
  getRaffleNumDialog: function (raffleNum) {
    this.setData({
      raffleNum_data: raffleNum,
      raffleNumShow: true //显示
    });
  },

  //衣豆不足弹窗
  notEnoughYidou: function () {
    this.setData({
      notEnoughYidouShow: true
    });
  },
  //如何获得余额
  getYuE: function () {
    this.setData({
      notEnoughYidouShow: false,
      getYuEShow: true
    });
  },
  getYuEBtnLeft: function () {
    this.setData({
      getYuEShow: false
    });
    this.toSignPager();
  },
  getYuEBtnRigth: function () {
    if (wx.getStorageSync("LingYUANGOUTishi_toGetYuE")==1) {
     //0元购美衣
     this.setData({
       getYuEShow:false,
       zeroBuyDialogShowFlag: true,
     });
      wx.setStorageSync("LingYUANGOUTishi_toGetYuE", 1)
    } else {
      this.toMainPager();
    }
  },

  //0元购美衣 去0元购
  zeroBuyNowClick:function(){
    this.toMainPager();
  },
  //如何获得衣豆
  getYiDou: function () {
    this.setData({
      notEnoughYidouShow: false,
      getYiDouShow: true
    });
  },
  getYiDouBtn: function () {
    this.toMainPager();
  },

  //普通 抽中红包 拆红包弹窗显示
  openRedPacket: function () {
    this.setData({
      openRedPacketShow: true
    });
  },
  //点击拆红包按钮  
  redPacketOpened: function () {
    this.setData({
      openRedPacketShow: false,
      redPacketOpenedShow: true
    });
    this.initData(true);
  },

  //疯狂新衣节中红包 拆红包弹窗显示
  madOpenRedPacket: function () {
    this.setData({
      madOpenRedPacketShow: true
    });
  },

  //疯狂新衣节中红包 点击拆红包
  madRedPacketOpened: function () {
    this.setData({
      madOpenRedPacketShow: false,
      madRedPacketOpenedShow: true
    });
    this.initData(true);
  },


  //没有抽中红包
  noRedPacket: function () {
    this.setData({
      noRedPacketShow: true
    });
  },

  //支付成功 获得衣豆弹窗
  buyObtainYidou: function (twofoldness) {
    var num = Math.ceil(totalAccount);
    this.setData({
      payYiDouNumber: num,
      twofoldness_data: twofoldness,
      buyObtainYidouShow: true
    });

  },

  //支付成功 新衣节获得疯狂抽奖机会弹窗
  obtainMadDialog: function () {
    var num = Math.ceil(totalAccount / 5);
    this.setData({
      payLotteryNumber: num,
      obtainMadDialogShow: true
    });
  },

  //额度说明
  limitDialog: function () {
    this.setData({
      limitDialogShow: true
    });
  },


  //买买买去首页
  toMainPager: function () {
    wx.switchTab({
      url: '../../shouye/shouye',
    });
  },

  //去赚钱页面
  toSignPager: function () {
    util.backToSignPager('../sign');
  },

  bind_tap_not: function () {
    this.showToast("只能到App才能查看哦~", 2000);
  },


  bottomTap: function (e) {
    util.httpPushFormId(e.detail.formId);//表单 调用  传给后台
    // console.log(e.detail.formId);
    if (!this.data.isMad || this.data.isBalanceLottery) {
      this.getYiDou();
    } else {
      //疯狂新衣节
      this.toMainPager();
    }
  },

  backPager: function (delta) {
    wx.navigateBack({
      delta: delta
    });
  },

	/**
	 * 获取数据  奖励列表   额度
	 */
  initLimitAwardsList: function () {
    var that = this;
    var dataUrl = config.Host + "wallet/extractNewData" +
      "?" + config.Version;
    util.http(dataUrl, function (data) {
      if (data.status != 1 || !data.data) {
        for (var i = 0; i < 50; i++) {
          dataListTemp1.push(that.addToLimitList());
        }
        that.setData({
          mListData1: dataListTemp1
        });
        that.count_down();
        return;
      }
      var dts = data.data;
      var result1 = [];

      for (var i in dts) {
        var datas = JSON.parse(dts[i]);
        var pic = datas.pic;
        if (!pic.startsWith('http')) {
          datas["pic"] = config.Upyun + pic;
        }
        result1 = result1.concat(datas);
      }
      for (var i = 0; i < 50; i++) {
        if (i < result1.length * 2) { //前面result1.size()*2条数据互相穿插数据
          if (i % 2 == 0) {
            dataListTemp1.push(result1[i / 2]);//添加到总集合  键值和虚拟添加的键值保持一致
          } else {
            dataListTemp1.push(that.addToLimitList());
          }
        } else {
          dataListTemp1.push(that.addToLimitList());
        }
      }
      that.setData({
        mListData1: dataListTemp1
      });
      that.count_down();
    });
  },

  count_down: function () {
    var that = this;
    if (scollTimeOut) {
      clearInterval(scollTimeOut);
      scollTimeOut = null;
    }
    if (isMoving){
      return;
    }

    if (!this.data.isMad || this.data.isBalanceLottery) {
      this.setData({
        scrollTop1: this.data.scrollTop1 +61,
        scrollTop2: this.data.scrollTop2 + 61
      });
    } else {
      this.setData({
        scrollTop1: this.data.scrollTop1 + 61
      });
    }
    scollTimeOut = setTimeout(function () {
      that.count_down();
    },1000)
  },
  scrolltolower1: function () {
    var temp1 = this.data.mListData1;
    // for (var i in dataListTemp1) {
    //   temp1.push(dataListTemp1[i]);
    // }\
    Array.prototype.push.apply(temp1, dataListTemp1);
    this.setData({
      mListData1: temp1
    });
  },
  scrolltolower2: function () {
    var temp2 = this.data.mListData2;
    // for (var i in dataListTemp2) {
    //   temp2.push(dataListTemp2[i]);
    // }
    Array.prototype.push.apply(temp2, dataListTemp2);
    this.setData({
      mListData2: temp2
    });
  },

  out_touchend:function(){
    var that = this;
    if (isMoving) {
      isMoving = false;
      if (scollTimePause) {
        clearInterval(scollTimePause);
        scollTimePause = null;
      }
      scollTimePause = setTimeout(function () {
        that.count_down();
      }, 1500);
    }
    // console.log("out_touchend", isMoving);
  },
  out_touchmove:function(){
    isMoving = true;
    if (scollTimeOut) {
      clearInterval(scollTimeOut);
      scollTimeOut=null;
    }
    // console.log("out_touchmove", isMoving);
  },

  addToLimitList: function () {
    var limitData = {};
    limitData["nname"] = util.getVirtualName() + "***" + util.getVirtualName();
    limitData["num"] = parseInt(Math.random() * (50 - 20) + 20) + util.getVirtualDecimalAwardsWithdrawal();
    limitData["pic"] = config.Upyun + "defaultcommentimage/" + util.getDefaultImg();
    limitData["type"] = 1;
    return limitData;
  },

  /**
   * 获取数据  奖励列表   衣豆
   */
  initYiDouAwardsList: function () {
    var that = this;
    var dataUrl = config.Host + "wallet/getNewData" +
      "?" + config.Version;
    util.http(dataUrl, function (data) {
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
            dataListTemp2.push(result2[i / 2]);//添加到总集合  键值和虚拟添加的键值保持一致
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
  addToYiDouList: function () {
    var yiDouData = {};
    yiDouData["nname"] = util.getVirtualName() + "***" + util.getVirtualName();
    yiDouData["num"] = parseInt(Math.random() * (401 - 10) + 10);
    yiDouData["p_name"] = "完成订单获得衣豆";
    yiDouData["pic"] = config.Upyun + "defaultcommentimage/" + util.getDefaultImg();
    return yiDouData;
  },

  bind_tap_yidou:function(){
    util.navigateTo('../yidouDetail/yidouDetail');
  },

  //去提现
  bind_tap_withdraw:function(){
    wx.redirectTo({
      // url: '../../mine/wallet/wallet'
      url: '../../mine/wallet/Withdrawals/Withdrawals'
    }); 
  },

  //额度明细
  bind_tap_withdraw_detail:function(){
   
    util.navigateTo('../yidouDetail/tixianDetail');

    this.setData({
      redPacketOpenedShow: false,
      madRedPacketOpenedShow: false,
    });
  },

  ////////////////////////////体验抽余额红包//////////////////////////////////////////////
  //  使用免费机会抽余额红包 接口
  getBalanceValue: function () {
    var that = this;
    isRunning = true;
    redPacketValue = 0;///重置前一次的抽奖金额

    // wx.showToast({
    //   title: '抽奖中……',
    //   icon: 'loading',
    //   duration: 2000
    // });
    // wx.showLoading({
    //   title: '抽奖中……',
    // })
    var dataUrl = config.Host + "order/doRaffle" +
      "?token=" + token + config.Version;
    util.http(dataUrl, function (data) {
      console.log("data---->", data);
      if (data.status != 1) {
        // setTimeout(function () {
        //   // wx.hideLoading();
        //   isRunning = false;
        //   that.showToast(data.message, 2000);
        // }, 100);
        isRunning = false;
        that.showToast(data.message, 2000);
        return;
      }
      
      if (data.status == 1) {
        //获取抽奖结果
        if (balanceLottery > 0) {//是虚拟抽奖  扣除剩余次数
          balanceLottery--;
          wx.setStorageSync("BALANCE_LOTTERY", balanceLottery)//剩余次数
        }

        redPacketValue = data.data;//红包金额
        //保存当日抽中的总数
        balanceLotterySum = wx.getStorageSync("BALANCE_LOTTERY_SUM_VALUE");
        if (!balanceLotterySum) {
          balanceLotterySum = 0;
        }
        balanceLotterySum += redPacketValue;
        wx.setStorageSync("BALANCE_LOTTERY_SUM_VALUE", balanceLotterySum)//当前抽中的总金额

      }

      var awardIndex = 0;
      if (redPacketValue >= 0.01 && redPacketValue < 5) {
        awardIndex = 6;
      } else if (redPacketValue >= 5 && redPacketValue < 10) {
        awardIndex = 5;
      } else if (redPacketValue >= 10 && redPacketValue < 50) {
        awardIndex = 4;
      } else if (redPacketValue >= 50 && redPacketValue < 100) {
        awardIndex = 3;
      } else if (redPacketValue >= 100 && redPacketValue < 200) {
        awardIndex = 2;
      } else if (redPacketValue >= 200 && redPacketValue < 500) {
        awardIndex = 1
      } else if (redPacketValue >= 500 && redPacketValue <= 1000) {
        awardIndex = 0;
      } else {
        awardIndex = 7;
      }
      that.roateStartLuck(awardIndex);

      //显示抽奖结果
      setTimeout(function () {
        if (redPacketValue > 0) {
          that.setData({
            redPacketValue_data: redPacketValue //抽奖金额
          });
          that.openRedPacketBalance();
        } else {
          that.noRedPacketBalance();
        }
        // wx.hideLoading();
        isRunning = false;
      }, 4200);
    });
  },

  /**
   * type  =1 获得5次抽奖机.
    type  =2 5次抽奖机会 用完
   */
  getBalanceLottery: function (type) {
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

  balanceLotteryOver_btn: function () {
    this.setData({
      balanceLotteryOverShow: false
    });
    if (isFromSignBalanceLottery) {
      this.toMainPager();
    } else {
      this.backPager(1);
    }

  },
  //抽中红包 (余额抽奖)
  openRedPacketBalance: function () {
    this.setData({
      openRedPacketBalanceShow: true
    });
  },
  //点击拆红包按钮 (余额抽奖)
  redPacketOpenedBalance: function () {
    this.setData({
      openRedPacketBalanceShow: false,
      redPacketOpenedBalanceShow: true
    });
    this.initData(true);
  },
  //没有抽中红包 (余额抽奖)
  noRedPacketBalance: function () {
    this.setData({
      noRedPacketBalanceShow: true
    });
  },

  ////////////////////////////体验抽余额红包///////////////////////////////////////////

  //用户是否绑定提现微信
  getWxIsNotBind: function () {
    var that = this;
    var dataUrl = config.Host + "wallet/getWxOpenid" +
      "?token=" + token +
      "&" + config.Version;
    util.http(dataUrl, function (data) {
      console.log("getWxIsNotBind", data);
      if (data.status != 1) {
        return;
      }
      if (data.data==1) {//1已经绑定 0 未绑定
        wxIsNotBind = false;
      } else {
        wxIsNotBind = true;
      }
    });
  },

  to_bind_wx:function(){
    wx.navigateTo({
      url: '../../mine/wallet/wallet?withdrawToBindWx=true'
    }); 
    this.setData({
      wxIsNotBindShow: false,
    });
  },

})