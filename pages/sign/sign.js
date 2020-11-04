// pages/sign/sign.js
// var postData = require('../../data/sign_data.js')

import config from '../../config';

var util = require('../../utils/util.js');

var publicUtil = require('../../utils/publicUtil.js');
var fightUtil = require('../../utils/freeFightCutdown.js');

var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");


var app = getApp();
//**分享X件商品 */
var shareXShopType = 1; //1分享正价商品 2 分享搭配商品 3 分享赢提现（新）4分享赢提现（老）
var shareXShop_signIndext; //SignFragment.signIndex
var shareXShop_doValue; // SignFragment.doValue;
var shareXShop_doNum; //SignFragment.doNum
var shareXShop_jiangliName;
var shareXShop_jiangliValue; //SignFragment.jiangliValue
var shareXShop_complete; //签到任务完成状态 默认false
//**分享X件商品 */
var shareOneOnePrice = "1.0";
var fillSignData = []; //列表填充数据（最后填充使用）
var jiangliList; //奖励列表数据
var signTaskListData; //赚钱列表数据
var mTask_type;
var biZuoList = []; //额外任务列表taskClass = 1
var eWaiList = []; //必做任务列表taskClass = 2
var monthList = []; //每月任务列表taskClass = 3
var tiXianList = []; //提现任务列表taskClass = 4
var jiZanList = []; //积攒任务列表taskClass = 5
var supriseList = []; //惊喜任务列表taskClass = 6

var dataListTemp1 = []; //泡泡数据
var dataListTemp2 = [];

var mingriTask = []; //明日任务

var isShareGo = false
var isDownAppGo = false;



var toTastcount_jignxi = 0; //明日任务中超级惊喜任务数量
var toTastcount_tixian = 0; //明日任务中提现任务数量
var toTastcount_bizuo = 0; //明日任务中必做任务数量
var toTastcount_ewai = 0; //明日任务额外任务数量

var isOldShareTX = false; //是否点击了老分享赢提现

//奖励部分的显示不是显示
var isShowjingxi_tou = false;
var isShowbizuo_tou = false;
var isShowtixian_tou = false;
var isShoweWai_tou = false;

var whetherTask = 1 //是否可以做任务 0不可做任务 1可做任务

//老分享赢提现相关
var txClickTaskList; //老分享赢提现任务信息
var flagMax = 10; //分享满多少次给一次机会
var branchCount = 0; //获得到1元提现的次数
var forcelookLimitNum = 0; //已经分享数
var singvalue; // 每分享singvalue可调签到接口
var shareCount = 10; //分享图标上显示的次数
var shareTotalCount = 10; //分享上限(分享总数)
var doNeedCount = "-1"; // 点击时拿到当前任务的status ，------当前任务需要做的剩余次数
// -------------------------------------------------------------
var sharemeiyichuandaback = false; //是否是分享穿搭回来

var payPrice = -1; //支付成功回来

var lotterynumber = 0; //新衣节剩余抽奖次数

var chouJiangComleteYet = 0; //是否抽完奖过

var clockInToday = 0; //当天是否已经打卡

var canShowCanTuanTask = 0; //是否可以显示参团任务

var jinrizhuan = "竟然没有";
var yuE = "0.00";
var keTiXian = "0.00";
var tiXianZhong = "0.00";
var yiTiXian= "0.00";

var userDataData = {}; //用户数据（各类数据，积分优惠券等）
var token;

var showSignCalenderTishi = false

var current_date = ""; //用户当天任务

var user_id;
//赚钱背景
var pagerShow; //所有背景页面权重顺序： - 1默认，1疯狂星期一，2超级分享日(提成)，3购买余额奖励翻倍（每月惊喜任务），4超级0元购，5千元红包雨


var isCrazyMon = false; // 是否是疯狂星期一
var haslingyuangou = false; //是否有零元购
var hasFriendTicheng = false; //是否有提成任务
var hasMeiyuejingxi = false; //是否有每月惊喜任务
var hasQianuyuanhongbao = false; //是否有千元红包

var singBg = "bgbg_sign.png";

//从.json中获取的文案的数据源
var jsonTextData;

var isBizuoComplete = false; //必做任务是否已经做完

var showBGWord = false;
var BGWord = "sign_ticheng_bg_word.png";

var BGWordWidth = "350rpx";
var BGWordHeight = "175rpx";
var maomi_margin_top = "0rpx";
var isLoginSucess = false;

var balance; //老分享赢提现能购获得的总钱数

var isMiniSigning = false;

var isTastComplete = false; //是否是完成任务后点击回来的----需要唤醒必做和额外任务的第一个未完成的任务

var fenZhongTask; //分钟数的整个任务

var EndTime = 1;
var NowTime;
var total_micro_second;

var startDaKaMs; //第一次打卡成功的毫秒值。

var completList = []; //已完成的任务列表

var unLoginJiangli = 0; //未登录获得的奖励

var usefulRollData; //用户的开团情况

var yaoqingCanTuanIndex = -1; //邀请参团任务的序号

var yaoQingCanTaunGo = false; //没有邀请到两个人或没有有效团点击弹窗上的按钮跳出去

// var zhiDingClick = false;

// 总秒数
var second;
// 天数
var day;
// 小时
var hr;
// 分钟
var min;
// 秒
var sec;

var h5money = 0; //用户在H5赚的钱

var isShareFlag = false; //是否是通过分享跳进来的
var shareUserId = ""; //分享者的user_id

var signRload = false;


var firstLogin = false; //分享的商品详情跳到赚钱者的用户信息：新老用户 ： true-新用户，false-老用户



//浏览分钟倒计时的四种情况：没有开始分钟任务：-1; 刚进来（回来）OnShow：1;点击的是自己已经开始的任务：2;点击的是其他的分钟数：3
var browseMinCase = 0;
var formId = "";
var loginCount = 0;

var nowyear;
var nowMonth;
var nowDay; //当前的时间毫秒
var nowTime_daka;
var startSignDay = -1

var showCalender = false;


var unLogintType40Click = false;

var current_status_data; // -1(一般不会有) 0 1 -----当前任务是否全部做完
var allNumber; // 全部次数-------------------------剩余可以抽奖的次数
var hasTrailNum; //提现卡情况
var is_fast_raffle; // 0 1-----是否抽完过
var unVipRaffleMoney;//会员提现金额
var raffleFixedMoney;
var animationTimer;
var hasDiamondOrVip;//是否是会员或者钻石卡
var is_showUnlock_tishi = false;//解锁提示
var is_showLuckFinish_tishi = false;//完成抽奖做任务提示
var scollTimeOut;
var scrolltolower_count;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAllWhitePage: true,
    days: [],
    signUp: [],
    cur_year: 0,
    cur_month: 0,
    count: 0,
    weekHeight: 650,
    Upyun: config.Upyun,
    upyconfig: config.Upyun,
    showModalStatusBg: false, //分享蒙层
    showModalStatus: false, //其他分享是否显示
    share_x_shop_swiper_img: "",
    shareXShopType_data: 1, //shareXShopType = 1;//1分享正价商品 2 分享搭配商品 3 分享赢提现（新）4分享赢提现（老）

    // maomi_bg: isLoginSucess ? "bg_zhaocaimiao_login_ed_new.png" : "bg_zhaocaimiao_no_login_new.png",
    maomi_bg: "bg_zhaocaimiao_login_ed_new.png",

    showSignPage: true,
    shareTitle: "",
    sharePath: "",
    shareImageUrl: "",

    maomi_height: "270rpx",
    signBG: singBg,

    signComplete: false,

    jinrizhuan: "竟然没有",
    yuE: "0.00",
    keTiXian: "0.00",
    tiXianZhong: "0.00",
    yiTiXian: "0.00",


    isShowjingxi_tou: false,
    isShowbizuo_tou: false,
    isShowtixian_tou: false,
    isShoweWai_tou: false,
    showOldShareTixian: false,
    hasJYJLdialog: false,

    // 气泡
    isBubbleShow: false,
    bubbleData: {},
    popanimationData: '',

    // 滚动气泡
    scrollTop: 0,

    scrollTop1: 0,
    showInviteFriends: true,
    keTiXian: "0.00",
    yiTiXian: "0.00",

    tiXianZhong: "0.00",
    guidefightCouponShow: false,
    taskBackTishiCount: 20, //测试用
    clickCompleteTaskBackTishi: false,
    isBuyTixianCouponShow:false,
    

    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},
    length: 0,
    secondimgData: ['complaint_1.png', 'complaint_2.png', 'complaint_3.png'],
    secondtextData: ['发送给朋友', '添加到我的小程序', '添加到桌面'],
    thirdimgData: ['complaint_4.png', 'complaint_5.png', 'complaint_6.png', 'complaint_7.png'],
    thirdtextData: ['浮窗', '设置', '反馈与投诉', '重新进入小程序'],
    fromApp:0,
    ftask_popup:0,//新用户完成第一天任务弹框控制开关
    is_vip:0,
  },
  zhidingTap: function () { //置顶点击--签掉置顶任务(置顶衣蝠小程序，关注公众号，下载APP 共用)
    signZHIding(this)
  },

  //首日完成任务去转盘
  fistSignComplestTap: function () {
    if (this.data.ftask_popup == 0) {
      if(allNumber > 0){
        wx.navigateTo({
          url: '../mine/withdrawLimitTwo/withdrawLimitTwo?type=1',
        })
      }
      
      if (allNumber <= 0) {
        this.setData({
          showFrirstDayCopleteDialog: false,
        })
      }
    }
  },

  joinWXQdialogTap: function () {
    this.setData({
      showJoinWXQ: false
    })

    wx.setStorageSync("isHomePageThreeGo", true);


  },

  attentionServiceTap: function () {
    this.setData({
      showService: false
    })
    // isDownAppGo = true;

    // 2020-5-20何波修改 只要点了去芝麻客服任务自动完成
    var that = this;
    setTimeout(function () {
      signZHIding(that);
    }, 3000)
  },
  fromAPPFinishTaskTap:function(){
    this.setData({
      showFinishTask:false,
      showBecameMember:false
    })
  },
  dwongloadTap: function () {
    this.setData({
      showDwongload: false
    })
    isDownAppGo = true;
  },
  //邀请提成相关（VIP）
  toInviteFriends: function () {

    if (isLoginSucess) {
      wx.navigateTo({
        // url: '/pages/sign/inviteFriends/memberInviteFriends',
        url: '/pages/sign/InviteFriendsFreeShop/InviteFriendsFreeShop',

      })
    }

  },
  closeInviteFriends: function () {
    this.setData({
      showInviteFriends: false
    })
  },



  //红包相关
  closeNewThirty: function () {
    this.setData({
      hasJYJLdialog: false,
    })
  },
  //共用
  closeVipDialog: function () {
    this.setData({
      showGetVipDialog: false,
      showNoPageDialog: false,
      showJoinWXQ: false,
      showSecondDayTishi: false,
      clickCompleteTaskBackTishi: false,
      showKaituanTishi: false,
      showYaoqingCantuanTishi: false,
      showYaoqingCantuanBackTishi: false,
      showService: false,
      showDwongload: false,
      showGoFinishTaskDialog:false,
    })

    //当没有买提现卡引导进来弹此框，此时解锁提示不出，关闭此框时再出提示
    if (this.data.isBuyTixianCouponShow){
      this.setData({
        isBuyTixianCouponShow: false
      })
      if(is_showUnlock_tishi){
        this.showToast("解锁新任务啦，完成后可以再去提现！", 3000);
        is_showUnlock_tishi = false;
      }else if(is_showLuckFinish_tishi)
      {
        var first_comming = wx.getStorageSync('first_comming')
        if(!first_comming)
        {
          // this.showToast("完成赚钱小任务，可再去提现现金哦。", 3000);
          is_showLuckFinish_tishi = false;
        }
      }
    }

    //如果用户此时关闭此弹窗，则直接进入转盘页。
    if (this.data.showFinishTask){
      wx.navigateTo({
        url: '../mine/withdrawLimitTwo/withdrawLimitTwo?type=1',
      })
      this.setData({
        showFinishTask:false
      })
    }

    //引导下载APP
    if (this.data.showFrirstDayCopleteDialog){
      if(allNumber >0){
        wx.navigateTo({
          url: '../mine/withdrawLimitTwo/withdrawLimitTwo?type=1',
        })
      }
      
      if(allNumber <= 0){
        this.setData({
          showFrirstDayCopleteDialog: false,
        })
      }
    }
  },
  //去开通Vip
  goToGetVip: function () {


    if (wx.getStorageSync("showVipGuide")) {
      wx.navigateTo({
        url: '../mine/addMemberCard/addMemberCard',
      })
    } else {
      wx.setStorageSync('showVipGuide', true)
      wx.navigateTo({
        url: '../mine/member/member?memberComefrom=' + "mine",
      })
    }


    this.setData({
      showGetVipDialog: false,
    })
  },
  catTap:function (){
    wx.navigateTo({
      url: '../mine/addMemberCard/addMemberCard',
    })
  },
  sharetap: function () { //分享任务弹窗分享按钮点击

    if (shareXShopType == 1 || shareXShopType == 2 || shareXShopType == 3 || shareXShopType == 4) {
      isShareGo = true
    }

  },

  moneysubmit: function (e) {

    formId = e.detail.formId;
    if (app.globalData.user != undefined) {
      util.httpPushFormId(formId);
      this.setData({
        hasJYJLdialog: false,
      })
    }
  },

  /**
   * 授权弹窗 2018-11-4 何波修改
   */
  onclick: function (e) {
    var that = this;
    wx.getUserInfo({
      //允许授权 获取用户信息
      success: function (res) {
        that.setData({
          hasJYJLdialog: false,
        })
        if (!app.globalData.user) { 
          wx.showLoading({
            title: '请稍后',
            mask: true,
          })
          //授权成功去登录
          app.New_userlogin(function () {
            util.httpPushFormId(formId);
            wx.hideLoading();
            var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
            that.setData({
              showendofpromotionDialog: showendofpromotionDialog
            })
            if (that.data.showendofpromotionDialog) {
              wx.setStorageSync("comefrom", 'showendofpromotionDialog');
              wx.switchTab({
                url: '/pages/shouye/shouye?comefrom=showendofpromotionDialog',
              })
              return;
            }

            that.setData({
              isShowAuthorization: true,
              showLoginDialog:false
            })

            token = app.globalData.user.userToken;
            that.getCanSign();

            that.onShow(); //登录成功重新刷新
            WxNotificationCenter.postNotificationName("testNotificationAuthorizationName", "loginfinish");

            
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
      fail: function () {

      }
    })
  },

  //拼团失败退款弹窗
  discountData: function (data) {
    var that = this;
    if (data.status == 1 && data.isFail == 1) {

      var cutdowntime = 30 * 60 * 1000;
      fightUtil.countdown(that, fightUtil, cutdowntime, function (data) {
        that.setData({
          is_fresh: true,
          time: data
        })
      })
      that.setData({
        guidefightCouponShow: true
      })
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
    wx.navigateTo({
      url: '/pages/mine/addMemberCard/addMemberCard'
    })
  },

  //匹配判断当月与当月哪些日子签到打卡
  onJudgeSign: function () {
    var that = this;
    var signs = that.data.signUp;
    var daysArr = that.data.days;
    for (var i = 0; i < signs.length; i++) {
      // var current = new Date(signs[i].date.replace(/-/g, "/"));
      // var year = current.getFullYear();
      // var month = current.getMonth() + 1;
      // var day = current.getDate();
      // day = parseInt(day);
      for (var j = 0; j < daysArr.length; j++) {
        //找到今天所在位置
        if (nowyear == that.cur_year && nowMonth == that.cur_month && nowDay == daysArr[j]) {
          daysArr[j].isNowDay = true;
        }

        //年月日相同并且已打卡
        if (daysArr[j].date && daysArr[j].date == signs[i]) {
          daysArr[j].isSign = true;
        }
      }
    }

    //找到今天所在位置
    for (var j = 0; j < daysArr.length; j++) {
      if (nowyear == that.data.cur_year && nowMonth == that.data.cur_month && nowDay == daysArr[j].date) {
        daysArr[j].isNowDay = true;
      } else {
        daysArr[j].isNowDay = false;

      }

      //起始签到位置如果在当前所选月份，找出起始位置
      if (startSignDay != -1 && startSignDay == daysArr[j].date) {
        daysArr[j].isStartDay = true;
      } else {
        daysArr[j].isStartDay = false;

      }


      //定位漏签的  (第一次打卡到今天之前只要是未打卡的都是漏打的)
      if (daysArr[j].isSign != true) {
        var dateStr = that.data.cur_year + "/" + "" + that.data.cur_month + "/" + daysArr[j].date + " " + "0:00";



        var dateMS = Date.parse(new Date(dateStr));

        // var dateMS = formatTimeStamp(dateStr);


        // console.log("每天的时间戳" + dateMS)

        if (startDaKaMs > 0) {
          if (daysArr[j].isNowDay != true && (dateMS > startDaKaMs && dateMS <= nowTime_daka)) {
            daysArr[j].isLouQian = true;
          }
        }


      }



      // if (startSignDay != -1 ) { //当前月份有起始打卡日期
      //   // daysArr[j].isStartDay = true;


      // } else {//当前月份无起始打卡日期 （用时间戳判断）
      //   if(startDaKaMs > 0 ){ //有打卡日期，但不是在当期显示的月份
      //     if (nowTime_daka > startDaKaMs){ 
      //       if (daysArr[j].isStartDay == false){


      //         daysArr[j].isLouQian = true;



      //       }else{
      //         daysArr[j].isLouQian = false;

      //       }
      //     }
      //   }else{ //从未打过卡（不用处理）
      //   }
      // }


    }


    that.setData({
      days: daysArr,
    });
    if (!showCalender) {
      showCalender = true;
      that.setData({
        showCalender,
      })
    }
    showSignCalenderTishi = true;
    that.setData({
      showSignCalenderTishi
    })

  },




  // 切换控制年月，上一个月，下一个月
  handleCalendar: function (e) {

    showSignCalenderTishi = false;
    this.setData({
      showSignCalenderTishi
    })

    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;

    var rowCount = 5; //当前日历行数 


    let newMonth;
    let newYear;

    if (handle === 'prev') {
      newMonth = cur_month - 1;
      newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
    } else {
      newMonth = cur_month + 1;
      newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }


    }
    this.calculateEmptyGrids(newYear, newMonth);
    this.calculateDays(newYear, newMonth);
    this.setData({
      cur_year: newYear,
      cur_month: newMonth,
      showMonth: numToEnMonth(newMonth),
    })
    //计算当前月份1日是星期几
    var week = util.getDateWeek(newYear + "-" + newMonth + "-1")
    //计算出当月行数
    var m_days = this.getThisMonthDays(newYear, newMonth);
    if (week == 5) {
      rowCount = m_days <= 30 ? 5 : 6
    } else if (week == 6) {
      rowCount = m_days <= 29 ? 5 : 6
    }
    // wx.showToast({
    //   title:  + rowCount+' 行 ',
    //   icon: 'success',
    //   duration: 2000
    // })
    this.setData({
      weekHeight: rowCount == 6 ? 730 : 650
    })
    this.onGetSignUp();
  },

  //获取当前用户该任务的签到数组
  onGetSignUp: function () {
    var that = this;
    // var Task_User = Bmob.Object.extend("task_user");
    // var q = new Bmob.Query(Task_User);
    // q.get(that.data.objectId, {
    //   success: function (result) {
    //     that.setData({
    //       signUp: result.get("signUp"),
    //       count: result.get("score")
    //     });
    //     //获取后就判断签到情况


    // var shopData = wx.getStorageSync('shopData')
    // shopData['newOldprice'] = shopData.shopOldPrice;
    // tempShopData = []
    // tempShopData.push(shopData);

    var reQuestMon = this.data.cur_month;

    if ((this.data.cur_month + "").length < 2) {
      reQuestMon = "0" + this.data.cur_month;
    }

    if (isLoginSucess) {
      var requestUrl = config.Host + 'clockIn/queryList?date=' +
        (this.data.cur_year + "" + reQuestMon) +
        "&token=" + app.globalData.user.userToken +
        config.Version;
      util.http(requestUrl, function (data) {
        if (data.status == 1) {

          //......模拟的数据↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓..

          // data.data.list = [11,15,16];
          // if (reQuestMon == "06"){
          //   data.data.list = [15,16]
          // }
          // if (reQuestMon == "07") {
          //   data.data.list = []
          // }
          // if (that.data.cur_month < 6){
          //   data.data.list = []
          // }
          // if (that.data.cur_month > 8) {
          //   data.data.list = []
          // }
          // data.data.clock_in_start_date = 1560219258000;

          //........模拟的数据↑↑↑↑↑↑↑↑↑↑↑↑↑↑...........



          if (data.data.clock_in_start_date) {
            startDaKaMs = data.data.clock_in_start_date;

            //获取当前年月和已签年月对比
            if ((that.data.cur_year + "" + reQuestMon) == getYearAndMonth(data.data.clock_in_start_date)) {
              //取出当月已签的序号
              startSignDay = geyDateIndex(data.data.clock_in_start_date);
            } else {
              startSignDay = -1;
            }


          } else { //当月没有签到
            startSignDay = -1;
            startDaKaMs = -1;
          }




          if (data.data.list) {
            var signUp = data.data.list;
            that.setData({
              signUp,
            })
          } else {
            that.setData({
              signUp: []
            })
          }
          that.onJudgeSign();

        } else {
          that.showToast(data.message, 1500);

        }
      })
    } else {
      that.onJudgeSign();

    }








    //   },
    //   error: function (object, error) {
    //   }
    // });
  },


  // 获取当月共多少天
  getThisMonthDays: function (year, month) {
    return new Date(year, month, 0).getDate()
  },

  // 获取当月第一天星期几
  getFirstDayOfWeek: function (year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },

  // 计算当月1号前空了几个格子，把它填充在days数组的前面
  calculateEmptyGrids: function (year, month) {
    var that = this;
    //计算每个月时要清零
    that.setData({
      days: []
    });
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        var obj = {
          date: null,
          isSign: false
        }
        that.data.days.push(obj);
      }
      // this.setData({
      //   days: that.data.days
      // });
      //清空
    } else {
      this.setData({
        days: []
      });
    }
  },


  // 绘制当月天数占的格子，并把它放到days数组中
  calculateDays: function (year, month) {
    var that = this;
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      var obj = {
        date: i,
        isSign: false
      }
      that.data.days.push(obj);
    }
    // this.setData({
    //   days: that.data.days
    // });
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    
    loginCount = 0;

    completList = []; //测试用
    if (!app.parent_id) {
      app.parent_id = options.user_id
    }

    if (!app.globalData.showSignPage) {
      this.setData({
        singBg: "bgbg_sign.png",
        maomi_margin_top: "0rpx",
        showNoPageDialog: true,
        showSignPage: false
      })
      return;
    }
    
    if (options.fromApp){
      this.setData({
        fromApp: options.fromApp
      })
      //从APP引导过来没有登录出登录框
      if(!app.globalData.user){
        this.setData({
          showLoginDialog: true
        })
      }
    }

    if (options.user_id) {
      // app.shareToHomepage3()
      this.globalLogin(); //如果是点分享链接进来需自动登录
    }

    if (options.needDK == 1) {
      this.showToast("完成当天任务后即可免费领美衣~", 3000);
    }

    if (null != app.globalData.user && app.globalData.user.userToken != undefined) {
      token = app.globalData.user.userToken;
      this.getCanSign();
    }

    if (options.comefrom){
      this.setData({
        comefrom:options.comefrom
      })
    }
    if (options.comefrom == 'hongbaostyle') {
      wx.setStorageSync('poplastTime', 5);
    } 
    if (options.comefrom == 'deliver_fightstyle'){
      //买完第二张发货卡和免拼卡后导入赚钱页弹此框
      var that = this;
      setTimeout(function () {
        that.setData({
          showGoFinishTaskDialog: true
        })
      }, 3000)
    }

    wx.setStorageSync('commingSign', true); //记录用户进入过赚钱页


    // 取消此弹窗
    // if (options.isPush == "true") {
    //   this.setData({
    //     hasJYJLdialog: true
    //   })
    // }

    // this.getUserData();
    // 弹出气泡提示
    var that = this;

    signRload = true;
    // zhiDingClick = false;
    // if(isShareFlag){
    //   WxNotificationCenter.addNotification("testNotificationItem1Name", this.testNotificationFromItem1Fn, this);
    // }
    forcelookLimitNum = 0;


    isShareFlag = options.isShareFlag;
    shareUserId = options.user_id;

    firstLogin = options.firstLogin;



    //如果是从分享的商品详情跳进来的处理
    if (firstLogin != null && firstLogin != "" && firstLogin != undefined) {
      console.log("firstLogin:", firstLogin);
      initShopShare(that, firstLogin);
    }



    var animationRun = wx.createAnimation({
      timingFunction: 'ease-out',
      delay: 2000
    })
    animationRun.translateX(-320).step();

    setInterval(function () {
      animationRun.translateX(0).step().translateX(-320).step();
      that.setData({
        // isBubbleShow: true, 
        bubbleData: util.getBubbleRemindData(),
        popanimationData: animationRun.export(),
      })
    }, 5000)

    //处理泡泡
    // initPaoPao(that);

    that.hongBaoAnimation();
    // 调用应用实例的方法获取全局数据
    // let app = getApp();
    // toast组件实例

    // 是否有拼团失败的订单
    util.getFightFailOrder(that.discountData);

    that.initLimitAwardsList();
    

  },
  initCalender() {
    showCalender = false;
    // -----日历相关-----
    //获取当前年月  
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;

    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);

    var rowCount = 5; //当前月份的行数
    //计算当前月份1日是星期几
    var week = util.getDateWeek(cur_year + "-" + cur_month + "-1")
    //计算出当月行数
    var m_days = this.getThisMonthDays(cur_year, cur_month);
    if (week == 5) {
      rowCount = m_days <= 30 ? 5 : 6
    } else if (week == 6) {
      rowCount = m_days <= 29 ? 5 : 6
    }
    nowyear = cur_year;
    nowMonth = cur_month;
    nowDay = date.getDate();
    nowTime_daka = new Date().getTime();

    this.setData({
      cur_year,
      cur_month,
      showMonth: numToEnMonth(cur_month),
      weeks_ch,
      rowCount
    })
    //获取当前用户当前任务的签到状态
    this.onGetSignUp();

  },
  // 自动滚动气泡
  count_down: function () {
    var that = this;

    this.setData({
      scrollTop: this.data.scrollTop1 + 61
    });
    setTimeout(function () {
      that.count_down();
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  initPage: function () {
    var that = this;


    console.log("SIGN_onShow");

    if (!app.globalData.showSignPage) {
      this.setData({
        singBg: "bgbg_sign.png",
        maomi_margin_top: "0rpx"
      })
      return;
    }


    var that = this;








    // this.setData({
    //   showDakaChenggongBackTishi: true
    // })

    //如果开始过分钟任务就不清空数据
    var tempTime = -1;
    try {
      tempTime = wx.getStorageSync("MIN_BEGIN_MIN_ETime")
    } catch (e) {}
    var tempFZ = tempTime == -1 || tempTime == undefined || tempTime == "";
    if (tempFZ) { //没有开始过分钟任务
      biZuoList = [];
      eWaiList = [];
      tiXianList = [];
      jiZanList = [];
      supriseList = [];
      monthList = [];
      isOldShareTX = false;
    }






    if (null != app.globalData.user && app.globalData.user.userToken != undefined) {
      token = app.globalData.user.userToken;
      user_id = app.globalData.user.user_id;
      isLoginSucess = true;
      //不显示登录授权 2018-11-4 何波修改
      that.setData({
        isLoginSucess: isLoginSucess,
        isShowAuthorization: false
      })


      that.setData({
        jinrizhuan_marginTop: "110rpx",
      })

    } else {
      isLoginSucess = false;

      //未登录完成任务列表处理unLoginCompelteList
      var tempList = wx.getStorageSync("unLoginCompelteList");
      var tempUnLoginJiangli = wx.getStorageSync("unLoginJiangli")
      if (tempList) {
        completList = tempList;


        if (tempUnLoginJiangli) {
          unLoginJiangli = wx.getStorageSync("unLoginJiangli");
          if (unLoginJiangli > 0) {
            that.setData({


              // maomi_bg: "bg_zhaocaimiao_login_ed_new.png",

              jinrizhuan_marginTop: "140rpx",
              showCenterTop: Number(unLoginJiangli) > 0,
              showCenter66: (Number(userDataData.today_money) > 0 && (app.signData.current_date + "").indexOf("newbie") != -1) ? true : false,
              jinrizhuan: Number(unLoginJiangli).toFixed(2)
            })
          } else {
            that.setData({
              jinrizhuan_marginTop: "110rpx",
            })
          }
        } else {
          that.setData({
            jinrizhuan_marginTop: "110rpx",
          })
        }



        var unLoginCompelteList = wx.getStorageSync("unLoginCompelteList");
        var indexIds = "";

        for (var i = 0; i < unLoginCompelteList.length; i++) {
          indexIds += (unLoginCompelteList[i].index_id + ",")
        }

        console.log("已完成任务的序号：" + indexIds)

      }




      //显示登录授权 2018-11-4 何波修改
      that.setData({
        isLoginSucess: isLoginSucess,
        isShowAuthorization: false
      })
    }

    console.log("token：", token);

    console.log("isShareFlag", isShareFlag);

    console.log("shareUserId", shareUserId);


    // token = "QPGL94Y406TLHBJL5HHX";
    // user_id = "944094";
    // isLoginSucess = true;

    wx.showNavigationBarLoading();
    //从本地取出当前页面的显示背景

    h5money = wx.getStorageSync("h5money");


    try {
      isCrazyMon = wx.getStorageSync("HASMOD")
    } catch (e) {}

    // console.log("isCrazyMon:" + isCrazyMon)


    try {
      hasFriendTicheng = wx.getStorageSync("HASTICHENG")
    } catch (e) {}


    try {
      hasMeiyuejingxi = wx.getStorageSync("HASMEIYUEJINGXI")
    } catch (e) {}


    try {
      haslingyuangou = wx.getStorageSync("HALINGYUANGOU")
    } catch (e) {}


    try {
      hasQianuyuanhongbao = wx.getStorageSync("HAQIANYUANHONGBAO")
    } catch (e) {}


    this.setData({ //设置新衣节中间那块的展示
      isCrazyMon: isCrazyMon
    })

    //确定背景
    if (isCrazyMon) { //新衣节
      pagerShow = 1;
    } else {
      if (hasFriendTicheng) { //好友提成
        pagerShow = 2;
      } else {
        if (hasMeiyuejingxi) { //每月惊喜
          pagerShow = 3;
        } else {
          if (haslingyuangou) { //0元购
            pagerShow = 4;
          } else {
            if (hasQianuyuanhongbao) { //千元红包
              pagerShow = 5;
            } else {
              pagerShow = -1;
            }
          }
        }
      }
    }
    //新用户，首日和次日进入赚钱任务页，赚钱任务页的背景均显示为普通的背景图。（不管当日配置的是什么任务）
    if (isLoginSucess) {
      var add_date = app.globalData.user.add_date; //注册时间
      var nowTime = new Date().getTime(); // 当前时间




      if (undefined != add_date && "" != add_date && null != add_date) {
        add_date = new Date(add_date).getTime();



        // add_date = Date.parse(new Date(add_date));
        // add_date = add_date / 1000;
        //2014-07-10 10:21:12的时间戳为：1404958872 

        console.log("注册时间：", add_date);
        console.log("现在的时间", nowTime);

        if (nowTime - add_date < 48 * 60 * 1000) {
          isCrazyMon = false;
          pagerShow = -1;
        }
      }
    }



    showBGWord = false;
    maomi_margin_top = "0rpx"

    // pagerShow = 2;
    switch (pagerShow) {

      case -1: //默认
        singBg = "bgbg_sign.png"
        maomi_margin_top = "0rpx"
        break;
      case 1: //新衣节

        showBGWord = true;
        singBg = "bg_mad_monday.png";
        BGWord = "xinyijieword.png";
        BGWordWidth = "330rpx";
        BGWordHeight = "134rpx"
        maomi_margin_top = "0rpx"

        break;
      case 2: //分享日(好友提成)
        showBGWord = true;
        singBg = "sign_ticheng_bg.jpg";
        BGWord = "sign_ticheng_bg_word.png";
        BGWordWidth = "350rpx";
        BGWordHeight = "175rpx"
        maomi_margin_top = "0rpx"
        break;
      case 3: //购买余额奖励翻倍（每月惊喜）
        showBGWord = true;
        singBg = "meiyue_jignxi_bg.png";
        BGWord = "meiyue_jignxi_bg_text.png";
        BGWordWidth = "330rpx";
        BGWordHeight = "134rpx"
        maomi_margin_top = "0rpx"

        break;
      case 4: //超级0元购


        showBGWord = true;
        singBg = "signlingyuangou_bg.png";
        BGWord = "icon_lingyuan_bg.png";
        BGWordWidth = "333rpx";
        BGWordHeight = "134rpx"
        maomi_margin_top = "0rpx"

        break;
      case 5: //5千元红包雨
        showBGWord = false;
        singBg = "sign_qian_bg.jpg";
        maomi_margin_top = "270rpx"

        break;
      default:
        singBg = "bgbg_sign"
        break;
    }
    this.setData({
      signBG: singBg
    })

    // this.getUserData();
    // 清空老数据
    // biZuoList.splice(0, biZuoList.length);
    // eWaiList.splice(0, eWaiList.length);
    // tiXianList.splice(0, tiXianList.length);
    // jiZanList.splice(0, jiZanList.length);
    // supriseList.splice(0, supriseList.length);
    // monthList.splice(0, monthList.length);
    // isOldShareTX = false;
    // completList.splice(0, completList.length);


    // biZuoList = [];
    // eWaiList = [];
    // tiXianList = [];
    // jiZanList = [];
    // supriseList = [];
    // monthList = [];
    // isOldShareTX = false;
    // completList = [];



    toTastcount_jignxi = 0; //明日任务中超级惊喜任务数量
    toTastcount_tixian = 0; //明日任务中提现任务数量
    toTastcount_bizuo = 0; //明日任务中必做任务数量
    toTastcount_ewai = 0; //明日任务额外任务数量


    //如果是分享跳进来的处理
    if (isLoginSucess && isShareFlag && shareUserId != null && shareUserId != "" && shareUserId != undefined) {
      bindShareUser(shareUserId); //绑定分享分享者信息
    }

    //获取夺宝号并弹出
    var duobaoNumber = "";
    try {
      duobaoNumber = wx.getStorageSync("InCode")
    } catch (e) {}
    if (duobaoNumber != "" && undefined != duobaoNumber) {
      wx.showModal({
        title: '任务完成!',
        content: '参与成功~\r\n你的夺宝号为' + duobaoNumber + "\r\n听说买件美衣可以增加运气哦~快来选购吧",
        confirmText: "买买买",
        cancelText: "做任务",
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: "/pages/shouye/shouye"
            })
          }
        }
      })
      wx.setStorageSync("InCode", "");
    }


    try {
      sharemeiyichuandaback = wx.getStorageSync("sharemeiyichuandaback")
    } catch (e) {}
    if (sharemeiyichuandaback) { //分享穿搭完成过来的
      var minTask = wx.getStorageSync('SIGN-TASK');
      var showText = minTask.jiangliValue + minTask.jiangliDanWei + minTask.jiangliContent + "奖励已经存入账户，赶紧去买买买吧~";
      // wx.showModal({
      //   title: '任务完成!',
      //   content: showText,
      //   showCancel: false,
      //   confirmColor: "#FF3F8B"
      // });
      this.setData({
        signFinishShow: true,
        signFinishDialog: {
          top_tilte: "任务完成!",
          tilte: "分享成功~",
          contentText: showText,
          oneBtnText: "继续做任务",
          isOneBtn: true,
        },
      });
      wx.setStorageSync("sharemeiyichuandaback", false);

    }


    //签掉任务的处理↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    //处理分钟数任务进来或者回来
    //取出过期时间
    var ETime = -1;
    try {
      ETime = wx.getStorageSync("MIN_BEGIN_MIN_ETime")
    } catch (e) {}
    var tempFZ = ETime == -1 || ETime == undefined || ETime == "";






    if (isDownAppGo) {
      signZHIding(that);


    } else
    if (isShareGo) { //处理分享任务回调不走的问题
      this.signShareTask()
    } else
      // if (isLoginSucess) {
      if (wx.getStorageSync("isHomePageThreeGo")) { //处理免费领美衣任务
        signZHIding(that); //使用置顶任务的签到就行

      }
    // }
    else
      //开始过分钟任务
      // if (isLoginSucess) {
      if (!tempFZ) {
        initOnshowFZtask(this);
        this.getJsonText();

      }


    // 

    //签掉任务的处理↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    else {
      //获取json和整个任务的数据
      this.getJsonText();
    }





    // if (!tempFZ) { //开始过分钟任务
    //   initOnshowFZtask(this);
    // } else
    //   //处理分享任务回调不走的问题
    //   // if (isLoginSucess) {
    //   if (isShareGo) {
    //     this.signShareTask()
    //   }
    //   // }
    //   else
    //     //处理免费领美衣任务
    //     // if (isLoginSucess) {
    //     if (isHomePageThreeGo) {
    //       signZHIding(that); //使用置顶任务的签到就行
    //     }
    //     // 

    //     //签掉任务的处理↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    //     else {
    //       //获取json和整个任务的数据
    //       this.getJsonText();
    //     }






    try {
      payPrice = wx.getStorageSync("payPrice")
    } catch (e) {}
    if (payPrice > 0) { //支付成功回来
      var minTask = wx.getStorageSync('SIGN-TASK');
      wx.setStorageSync("payPrice", -1);
    }

  },




  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    
    util.get_vip_tofreelingPage2();//有79元免费领未领取自动跳转免费领列表页2
    
    //大促销已结束
    if (app.globalData.user != null) {
      var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
      that.setData({
        showMainPage: true,
        showendofpromotionDialog: showendofpromotionDialog
      })
    } else {
      var showendofpromotionDialog = (app.globalData.channel_type == 1 || that.data.fromApp == '1') ? false : true;
      that.setData({
        showMainPage: true,
        showendofpromotionDialog: showendofpromotionDialog
      })
    }

    if(!that.data.showendofpromotionDialog)
    {
      if (null != app.globalData.user && app.globalData.user.userToken != undefined) {
        var token = app.globalData.user.userToken;
        //能否提前抽奖
        var dataUrl = config.Host + "wallet/judgeUserFirstIntoRaffle" +
          "?token=" + token + config.Version;
        util.http(dataUrl, function (data) {
          if (data.status == 1) {
            //如果用户20次没抽完且不是会员导向转盘页抽奖
            if (data.data.is_finish == 1)
            {
              //待验证
              if (that.data.is_vip != 1){
                wx.navigateTo({
                  url: '/pages/mine/withdrawLimitTwo/withdrawLimitTwo?type=1&isFirstChongJiang=1' + '&comefrom=' + that.data.comefrom,
                })
                return;
              }
            } else {
              that.initPage();
              that.setData({
                showAllWhitePage: false
              })

              //用户抽完奖且不是会员第一次进赚钱弹如下提示
              var first_comming = wx.getStorageSync('first_comming');
              var tixian_count = wx.getStorageSync('tixian_count');
              if (((that.data.is_vip == 0) || (that.data.is_vip == 3 && that.data.maxType != 4)) && !first_comming && !tixian_count && app.signData.current_date == "newbie01" && !that.data.isBuyTixianCouponShow){
                // that.showToast('完成赚钱小任务，可再去提现现金哦', 3000);
              }
            }
          } else {
            that.showToast(data.message, 3000);
          }

        });
      } else if (that.data.fromApp == '1'){
        that.initPage();
        that.setData({
          showAllWhitePage: false
        })
      } else {

        //能否提前抽奖
        var dataUrl = config.Host + "wallet/newRaffleIsExist?" + config.Version;
        util.http(dataUrl, function (data) {
          if (data.status == 1) {
            if (data.isExist == 1){
              wx.navigateTo({
                url: '/pages/mine/withdrawLimitTwo/withdrawLimitTwo?type=1&isFirstChongJiang=1',
              })
              return;
            }else{
              that.initPage();
              that.setData({
                showAllWhitePage: false
              })
            }
          } else {
            that.showToast(data.message, 3000);
          }
        });
      }
    }else{
      that.initPage();
      that.setData({
        showAllWhitePage: false
      })
    }
    
    var that = this;
    if (!that.data.showendofpromotionDialog){
      wx.onUserCaptureScreen(function (res) {
        console.log('……………………………………………………用户截屏了')
        setTimeout(function () {
          that.showModal();
        }, 1000)
      })
    }

    var luck_is_finish = wx.getStorageSync('luck_is_finish');
    if (luck_is_finish) {
      is_showLuckFinish_tishi = true;
      wx.setStorageSync('luck_is_finish', false);
    }

    var guidegototixiancatd = wx.getStorageSync('guidegototixiancatd');
    var guidegotosign = wx.getStorageSync('guidegotosign');

    //首次进赚钱任务出任务说明弹框
    var first_comming = wx.getStorageSync('first_comming');
    if (!first_comming && that.data.fromApp != '1') {
      wx.setStorageSync('first_comming', true)

      this.setData({
        showSignSM: true
      })
    }

    if(!showSignSM){
      if (guidegototixiancatd || guidegotosign) {
        // if (guidegototixiancatd == true) {
        //   this.showToast("完成任务后，可再去提现50次！", 3000);
        //   wx.setStorageSync('guidegototixiancatd', false);
        // } else if (guidegotosign == true) {
        //   this.showToast("完成任务后，可再去提现50次！", 3000);
        //   wx.setStorageSync('guidegotosign', false);
        // }

        this.data.showFinishTask_tishi = true;
        is_showUnlock_tishi = false;
        is_showLuckFinish_tishi = false;
        return;
      } else {
        this.data.showFinishTask_tishi = false;
      }
    }
    
    //是否是购买提现卡引导过来
    var tixian_count = wx.getStorageSync('tixian_count');
    if (tixian_count != undefined && tixian_count != '') {
      that.setData({
        tixian_count: tixian_count,
        isBuyTixianCouponShow: true
      })
      wx.setStorageSync('tixian_count', '')
    }else{
      if (is_showUnlock_tishi) {
        that.showToast("解锁新任务啦，完成后可以再去提现！", 3000);
        is_showUnlock_tishi = false;
      } else if (is_showLuckFinish_tishi) {
        var first_comming = wx.getStorageSync('first_comming');
        if (!first_comming) {
          // this.showToast("完成赚钱小任务，可再去提现现金哦。", 3000);
          is_showLuckFinish_tishi = false;
        }
      }
    }
  },


  initTishiDialog: function () {

    var that = this;

    //优先级： 弹窗1 ———— 轻提示 —————弹窗2

    //每天只弹一次(弹窗1)
    var nowDataString = new Date().toDateString();

    var lastDialogDate = wx.getStorageSync('Sign-nowDataString');

    if (lastDialogDate == nowDataString) { //说明弹窗1已经弹过了

      //轻提示
      var dataUrlRefresh1 = config.Host + "signIn2_0/taskteFreshFlag" +
        "?token=" + token + config.Version;
      util.http(dataUrlRefresh1, function (data) {
        if (data.data == 1 && (app.signData.current_date + "").indexOf("newbie") != -1) {
          if (!that.data.isBuyTixianCouponShow) {
            if (!that.data.showFinishTask_tishi){
              that.showToast("解锁新任务啦，完成后可以再去提现！", 3000);
            }
          } else{
            is_showUnlock_tishi = true;
          }
          wx.setStorageSync("clickCompleteTaskFinish", false);
        } else {
          //弹窗2
          if (current_status_data == 1 && wx.getStorageSync("clickCompleteTask") && wx.getStorageSync("clickCompleteTaskFinish") && data.data != 1) {
            wx.setStorageSync("clickCompleteTask", false)
            wx.setStorageSync("clickCompleteTaskFinish", false)

            that.setData({
              taskBackTishiCount: jsonTextData.zengsong20.text, //完成任务从转盘回来提示获得提现机会次数
              clickCompleteTaskBackTishi: true
            })
          } else {
            wx.setStorageSync("clickCompleteTaskFinish", false);
          }
        }
      });

      return;
    }


    var dataUrl = config.Host + "signIn2_0/getCount" +
      "?token=" + token +
      "&" + config.Version;
    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = dataUrl;

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

    dataUrl = util.Md5_httpUrl(dataUrl);
    wx.request({
      url: dataUrl,
      method: 'GET',
      //请求传参
      data: {},
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        app.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
      },
      complete: function (res) {
        if (res == null || res.data == null) {} else {

          app.signData.isVip = res.data.isVip;

          clockInToday = res.data.clockInToday;


          if (res.data.current_date) {
            current_date = res.data.current_date;
            var dayCount = 5; //默认



            // //↓↓↓↓↓↓↓↓↓模拟的数据↓↓↓↓↓↓↓↓↓↓↓
            // //模拟到了明天第一次进赚钱
            // clockInToday = 0;
            // current_date = "newbie04"
            // //↑↑↑↑↑↑↑↑↑↑↑↑↑模拟的数据↑↑↑↑↑↑↑↑↑↑↑↑↑

            var isFristDayTask = current_date == "newbie01"; //是否为第一天的任务



            //不是第一天， 且当天没有打卡，说明是从第二天开始的 
            if (!isFristDayTask && clockInToday != 1 && (current_date + "").indexOf("newbie") != -1) {
              var day = current_date.substring(current_date.length - 2);
              var dayNum = Number(day);
              dayCount = 15 - (dayNum - 1) + "";

              if (dayCount > 0 && dayNum > 1) {
                that.setData({
                  dayStr: dayCount,
                  showSecondDayTishi: true
                })
                wx.setStorageSync('Sign-nowDataString', nowDataString)
                wx.setStorageSync("SECOND_SIGN_DAKA_TISHI", new Date().getTime());
                wx.setStorageSync("clickCompleteTaskFinish", false);
                //消费掉任务的刷新情况
                var dataUrlRefresh = config.Host + "signIn2_0/taskteFreshFlag" +
                  "?token=" + token + config.Version;
                util.http(dataUrlRefresh, function (data) {});

              } else {
                //轻提示
                var dataUrlRefresh1 = config.Host + "signIn2_0/taskteFreshFlag" +
                  "?token=" + token + config.Version;
                util.http(dataUrlRefresh1, function (data) {
                  if (data.data == 1 && (app.signData.current_date + "").indexOf("newbie") != -1) {
                    if (!that.data.isBuyTixianCouponShow) {
                      if (!that.data.showFinishTask_tishi) {
                        that.showToast("解锁新任务啦，完成后可以再去提现！", 3000);
                      }
                    } else {
                      is_showUnlock_tishi = true;
                    }
                    wx.setStorageSync("clickCompleteTaskFinish", false);

                  } else {
                    //弹窗2
                    if (current_status_data == 1 && wx.getStorageSync("clickCompleteTask") && wx.getStorageSync("clickCompleteTaskFinish") && data.data != 1) {
                      wx.setStorageSync("clickCompleteTask", false)
                      wx.setStorageSync("clickCompleteTaskFinish", false)

                      that.setData({
                        taskBackTishiCount: jsonTextData.zengsong20.text, //完成任务从转盘回来提示获得提现机会次数
                        clickCompleteTaskBackTishi: true
                      })
                    } else {
                      wx.setStorageSync("clickCompleteTaskFinish", false);
                    }
                  }
                });
              }


            } else {

              //轻提示
              var dataUrlRefresh1 = config.Host + "signIn2_0/taskteFreshFlag" +
                "?token=" + token + config.Version;
              util.http(dataUrlRefresh1, function (data) {
                if (data.data == 1 && (app.signData.current_date + "").indexOf("newbie") != -1) {
                  if(!that.data.isBuyTixianCouponShow){
                    if (!that.data.showFinishTask_tishi) {
                      that.showToast("解锁新任务啦，完成后可以再去提现！", 3000);
                    }
                  } else {
                    is_showUnlock_tishi = true;
                  }
                  wx.setStorageSync("clickCompleteTaskFinish", false);

                } else {
                  //弹窗2
                  if (current_status_data == 1 && wx.getStorageSync("clickCompleteTask") && wx.getStorageSync("clickCompleteTaskFinish") && data.data != 1) {
                    wx.setStorageSync("clickCompleteTask", false)
                    wx.setStorageSync("clickCompleteTaskFinish", false)

                    that.setData({
                      taskBackTishiCount: 20, //完成任务从转盘回来提示获得提现机会次数
                      clickCompleteTaskBackTishi: true
                    })
                  } else {
                    wx.setStorageSync("clickCompleteTaskFinish", false);
                  }
                }
              });
            }

          }
        }
      },

      fail: function (error) {
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
        });
      }
    })






    //  //每天只弹一次
    //  var time = wx.getStorageSync("SECOND_SIGN_DAKA_TISHI");
    //  if (util.isToday(time) != "当天") {
    //    var dataUrl = config.Host + "signIn2_0/getCount" +
    //      "?token=" + token +
    //      "&" + config.Version;
    //    var tongji_url = "default";
    //    var tongji_parameter = "default"
    //    var mUrl = dataUrl;

    //    if (mUrl) {
    //      var tepm = mUrl.split("?");
    //      tongji_url = mUrl.split("?")[0]
    //      tongji_url = tongji_url.replace(config.Host, "");
    //      tongji_url = tongji_url.replace(config.PayHost, "")
    //      tongji_url = tongji_url.replace("//", "/")

    //      tongji_parameter = mUrl.substring(mUrl.indexOf("?") + 1, mUrl.length - 1)

    //      if (!tongji_url) {
    //        tongji_url = "default"
    //      }
    //      if (!tongji_parameter) {
    //        tongji_parameter = "default"
    //      }
    //    }

    //    dataUrl = util.Md5_httpUrl(dataUrl);
    //    wx.request({
    //      url: dataUrl,
    //      method: 'GET',
    //      //请求传参
    //      data: {},
    //      header: {
    //        "Content-Type": "json"
    //      },
    //      success: function (res) {
    //        app.mtj.trackEvent('i_f_success_count', {
    //          i_f_name: tongji_url,
    //        });
    //      },
    //      complete: function (res) {
    //        if (res == null || res.data == null) {} else {

    //          app.signData.isVip = res.data.isVip;
    //          if (res.data.isVip != 1 && res.data.current_date) {
    //            current_date = res.data.current_date;
    //            var dayCount = 5;
    //            //测试用
    //            // current_date = "1233"

    //            if ((current_date + "").indexOf("newbie") != -1) {
    //              var day = current_date.substring(current_date.length - 2);
    //              var dayNum = Number(day);
    //              dayCount = 15 - (dayNum - 1) + "";

    //              if (dayNum > 1) {
    //                that.setData({
    //                  dayStr: dayCount,
    //                  showSecondDayTishi: true
    //                })
    //                wx.setStorageSync("SECOND_SIGN_DAKA_TISHI", new Date().getTime())
    //              }


    //            } else {
    //              that.setData({
    //                dayStr: dayCount,
    //                showSecondDayTishi: true
    //              })
    //              wx.setStorageSync("SECOND_SIGN_DAKA_TISHI", new Date().getTime())
    //            }

    //          }
    //        }
    //      },

    //      fail: function (error) {
    //        app.mtj.trackEvent('i_f_error_count', {
    //          i_f_name: tongji_url,
    //        });
    //      }
    //    })
    //  }






    // //弹窗2
    // if (wx.getStorageSync("clickCompleteTask") && wx.getStorageSync("clickCompleteTaskFinish")) {
    //   wx.setStorageSync("clickCompleteTask", false)
    //   wx.setStorageSync("clickCompleteTaskFinish", false)

    //   that.setData({
    //     taskBackTishiCount: jsonTextData.zengsong20.text, //完成任务从转盘回来提示获得提现机会次数
    //     clickCompleteTaskBackTishi: true
    //   })
    // }





    // //轻提示
    // var dataUrl = config.Host + "signIn2_0/taskteFreshFlag" +
    //   "?token=" + token + config.Version;
    // util.http(dataUrl, function (data) {
    //   if (data.data == 1) {
    //     that.showToast("解锁新任务啦，完成后可以再去提现！", 3000);
    //   }
    // });




  },

  //跳转提现卡页面
  completeTastTastToZhuanpanBackGoTixianVip:function(){
    this.setData({
      isBuyTixianCouponShow:false
    })
    wx.navigateTo({
      url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=' + 'sign_tixian'
    })
  },
  completeTastTastToZhuanpanBackGoKefu: function () {
    this.setData({
      clickCompleteTaskBackTishi: false
    })

    var dataUrl = config.Host + "signIn2_0/inspectHideTask" +
      "?token=" + token + config.Version;
    util.http(dataUrl, function (data) {});
  },

  signShareTask: function () {
    var that = this
    isShareGo = false
    if (shareXShopType == 4) {
      this.setData({
        showModalStatusBg: true,
        showOldShareTixian: true

      });
    } else {
      this.setData({
        showModalStatusBg: false,
        showModalStatus: false,

      });
    }



    if (shareXShopType == 1) {
      var shareNum = 1
      if (wx.getStorageSync("SIGN-TASK").task_type != 32) {
        shareNum = parseInt(shareXShop_doValue.split(",")[1]);
      }
      that.signShareXShop(shareNum); //分享X件商品 
    } else if (shareXShopType == 2) {
      var shareNum = parseInt(shareXShop_doValue.split(",")[0]);
      that.signShareXShop(shareNum); //分享X件搭配
    } else if (shareXShopType == 3) { //新分享赢提现

      that.setData({
        signFinishShow: true,
        signFinishDialog: {
          top_tilte: "任务完成！",
          tilte: "分享成功~",
          contentText: "好友来做赚钱任务或购买美衣后，你就能得到奖励哦。",
          leftText: "继续分享",
          rigthText: "继续做任务"
        },
      });


    } else if (shareXShopType == 4) { //老分享赢提现
      if (txClickTaskList.complete) {
        that.showToast("今日的分享次数已到达上限，明天再来吧~", 3000);
      } else {
        that.oldGetTXcomplete();
      }
    }

    util.task_share_Statistics("qdfx", "702", "7"); //赚钱任务分享成功统计

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // if(isShareFlag){
    //   WxNotificationCenter.addNotification("testNotificationItem1Name", this);
    // }


    //清除之前的数据
    // biZuoList = [];
    // eWaiList = [];
    // tiXianList = [];
    // jiZanList = [];
    // supriseList = [];
    // monthList = [];
    // isOldShareTX = false;
    // completList = [];
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(scollTimeOut);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //新增滚动列表
  /**
   * 获取数据  奖励列表   额度
   */
  initLimitAwardsList: function () {
    var that = this;
    scrolltolower_count = 30;

    var signNum = ['52', '67', '83', '72', '55', '59', '92', '102', '33', '61', '39', '65', '76', '73', '53', '83', '92', '87', '95', '112', '101', '93', '121', '117', '105', '35', '58', '62', '55', '71'];

    var signMoney = ['92.56', '119.26', '147.74', '128.16', '97.9', '105.02', '163.76', '181.56', '58.74', '108.58', '69.42', '115.7', '135.28', '129.94', '94.34', '147.74', '163.76', '154.86', '169.1', '199.36', '179.78', '165.54', '215.38', '208.26', '186.9', '62.3', '103.24', '110.36', '97.9', '126.38'];

    for (var i = 0; i < scrolltolower_count; i++) {
      dataListTemp2.push(that.addToLimitList2(signNum[i],signMoney[i]));
    }
    that.setData({
      mListData1: dataListTemp2
    });
  },

  addToLimitList2: function (signNum, signMoney) {
    var limitData = {};
    
    limitData["nname"] = util.getVirtualName() + "***" + util.getVirtualName();
    limitData["pic"] = config.Upyun + "defaultcommentimage/" + util.getDefaultImg();
    limitData["type"] = 1;
    limitData["content"] = "累计领取" + signNum + "个任务";
    limitData["num"] = "+" + signMoney;

    return limitData;
  },
 

  

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // },


  getJsonText1: function () {
    var that = this;
    var requestUrl = '';
    var jsonParames = {};
    requestUrl = config.Upyun + "paperwork/paperwork.json";
    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = requestUrl;

    if (mUrl) {
      var tepm = mUrl.split("?");
      tongji_url = mUrl.split("?")[0]
      tongji_url = tongji_url.replace(config.Host, "");
      tongji_url = tongji_url.replace(config.PayHost, "")
      tongji_url = tongji_url.replace(config.Upyun, "")

      tongji_url = tongji_url.replace("//", "/")

      tongji_parameter = mUrl.substring(mUrl.indexOf("?") + 1, mUrl.length - 1)

      if (!tongji_url) {
        tongji_url = "default"
      }
      if (!tongji_parameter) {
        tongji_parameter = "default"
      }
    }
    requestUrl = util.Md5_httpUrl(requestUrl);
    wx.request({
      url: requestUrl,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        app.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
      },

      complete: function (res) {
        jsonTextData = res.data;



        //处理赚钱任务提示弹窗
        // initSignHint(that);




        if (isLoginSucess) {
          publicUtil.getBalanceNum(function (isSHow) {
            that.getCompleteList();
          });
        } else {
          that.getSignListData();

        }
      },
      fail: function (error) {
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })

  },


  getJsonText: function () {
    var that = this;

    if (!isLoginSucess) {
      that.getJsonText1();
      return
    } else {
      var dataUrl = config.Host + "wallet/noviceNewbieTask" +
        "?token=" + token + config.Version;
      util.http(dataUrl, function (data) {
        that.getJsonText1();
      })
    }
  },

  //获取用户数据

  getUserData: function () {
    var that = this;
    var dataUrl = config.Host + "signIn2_0/getCount" +
      "?token=" + token +
      "&" + config.Version;
    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = dataUrl;

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

    dataUrl = util.Md5_httpUrl(dataUrl);


    wx.request({

      url: dataUrl,

      method: 'GET',
      //请求传参
      data: {},
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        app.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
      },

      complete: function (res) {
        if (res == null || res.data == null) {} else {
          userDataData = res.data;
          if (res.data.shareCount == undefined || null == res.data.shareCount || res.data.shareCount == 'null') {
            userDataData["shareCount"] = "0";
          }
          if (res.data.shareMoneyCount == undefined) {
            userDataData["shareMoneyCount"] = "0.0";
          }

          if (res.data.LotteryNumber == undefined) {
            userDataData["lotterynumber"] = 0;
          }

          if (res.data.topWx == undefined) {
            userDataData["topWx "] = 0;
          }


          app.signData.current_date = res.data.current_date;
          app.signData.isVip = res.data.isVip;
          lotterynumber = userDataData.LotteryNumber;

          chouJiangComleteYet = res.data.nRaffle_status; //是否抽完奖过

          clockInToday = userDataData.clockInToday;



          current_status_data = userDataData.current_status_data;
          allNumber = userDataData.allNumber;
          hasTrailNum = userDataData.hasTrailNum;
          is_fast_raffle = userDataData.is_fast_raffle;
          unVipRaffleMoney = userDataData.unVipRaffleMoney;
          raffleFixedMoney = userDataData.raffleFixedMoney;


          hasDiamondOrVip = userDataData.hasDiamondOrVip;




          console.log("lotterynumber:" + lotterynumber)
          that.setData({

            jinriyifan: "今日已返" + userDataData.todayReturnMoney + "万元",
            leijiyifan: "累计已返" + userDataData.cumReturnMoney + "万元",
            leijitixian: "累计提现" + userDataData.cumWitMoney + "万元",
            ftask_popup: userDataData.ftask_popup,
          });
          if (res.data.yc_task == 1) {
            canShowCanTuanTask = 1;

          } else {
            canShowCanTuanTask = 0;

          }


          var current_date = res.data.current_date + "";
          if (current_date == "newbie01" && unLogintType40Click) {
            unLogintType40Click = false;
            if (clockInToday == 1) {
              wx.navigateTo({
                url: '../mine/withdrawLimitTwo/withdrawLimitTwo?type=1',
              })
              wx.setStorageSync("clickCompleteTask", true);
            } else {
              that.showToast("您还未完成当前全部的賺钱任务。", 3000)
            }

          }

          that.initTishiDialog();
          that.getSignListData();

          //获取是否是会员
          util.get_vip2(function (data) {
            var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
            var showBecameMember = (((data.isVip > 0 && data.isVip != 3) || (data.isVip == 3 && data.maxType == 4)) && data.first_diamond == 0) ? true : false;
            showBecameMember = (app.signData.current_date + "").indexOf("newbie") == -1 ? showBecameMember : false;
            that.setData({
              showBecameMember: showBecameMember
            })

            //如果有剩余抽奖次数自动跳转抽奖
            if (allNumber > 0 && !showBecameMember && !that.data.showFrirstDayCopleteDialog) {
              that.setData({
                showFrirstDayCopleteDialog: true
              })
            }
            if(allNumber <=0){
              that.setData({
                showFrirstDayCopleteDialog: false
              })
            }
          })
        }
      },

      fail: function (error) {
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })
  },


  //第二天任务提示点击知道了
  secondDayKnowTap: function () {

    this.setData({
      showSecondDayTishi: false
    })
    if (whetherTask != 1) {
      this.setData({
        showGetVipDialog: true
      })
    }
  },



  //查询是否可以做任务
  getCanSign: function () {
    var that = this;
    var dataUrl = config.Host + "signIn2_0/getCount" +
      "?token=" + token +
      "&" + config.Version;
    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = dataUrl;

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

    dataUrl = util.Md5_httpUrl(dataUrl);
    wx.request({
      url: dataUrl,
      method: 'GET',
      //请求传参
      data: {},
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        app.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
      },
      complete: function (res) {
        if (res == null || res.data == null) {} else {

          var isVip = res.data.isVip;
          var current_date = res.data.current_date + "";
          var clock_in_count = res.data.clock_in_count;

          if (clock_in_count >=10 && isVip != 1) { //打卡10天且不是会员不能做任务
            whetherTask = 0;
          } else {
            whetherTask = 1;
          }

          that.setData({
            is_vip: isVip,
            maxType: res.data.maxType,
            vip_type: res.data.vip_type,
          })
        }
      },

      fail: function (error) {
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
        });
      }
    })
  },


  //获取任务列表
  getSignListData: function () {
    var that = this;

    var dataUrl = "";
    if (isLoginSucess) {
      dataUrl = config.Host + "signIn2_0/siLogTaskList" +
        "?token=" + token +
        "&" + config.Version;
    } else {
      dataUrl = config.Host + "signIn2_0/siTaskList" +
        "?" + config.Version;
    }

    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = dataUrl;

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
    dataUrl = util.Md5_httpUrl(dataUrl);



    wx.request({
      url: dataUrl,
      method: 'POST',
      //请求传参
      data: {},
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        app.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });


      },
      fail: function (error) {
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      },

      complete: function (res) {
        // console.log("请求完成", res);


        signTaskListData = res.data.daytaskList; //取出接口中赚钱列表数据（整个任务列表）
        jiangliList = res.data.taskList;

        //填充各任务
        that.initList(signTaskListData, res);
        //获取明日任务数量
        that.initMingriCount(res);


        //确定赚钱任务背景图
        that.initSignBG(res.data);

        //去掉小程序暂时不做的任务
        that.removeTaskNotShow(biZuoList);
        that.removeTaskNotShow(eWaiList);
        that.removeTaskNotShow(tiXianList);

        // console.log("未过滤之前supriseList:", supriseList);

        that.removeTaskNotShow(supriseList);


        //将每月惊喜任务栏中的每月惊喜任务挪到超级惊喜任务中
        for (var monIndex in monthList) {
          if (monthList[monIndex].task_type == 24) {

            monthList[monIndex]["task_class"] = 6;
            supriseList.push(monthList[monIndex]);
          }
        }
        //判断各个板块任务头是否显示
        if (biZuoList.length > 0) {
          isShowbizuo_tou = true;
        } else {
          isShowbizuo_tou = false;
        }

        if (eWaiList.length > 0) {
          isShoweWai_tou = true;
        } else {
          isShoweWai_tou = false;
        }

        if (tiXianList.length > 0) {
          isShowtixian_tou = true;
        } else {
          isShowtixian_tou = false;
        }
        if (supriseList.length > 0) {
          isShowjingxi_tou = true;
        } else {
          isShowjingxi_tou = false;
        }


        for (var bIndex in biZuoList) {
          if (biZuoList[bIndex].complete) {
            isBizuoComplete = true;
            break;
          }
        }

        // console.log("biZuoList111111", biZuoList);
        // if (biZuoList.length > 0) {
        //   //处理必做任务的提示头
        //   biZuoList[0]["showZhiShiTou"] = true;
        //   biZuoList[0]["tasktouImg"] = "small-iconImages/ad_pic/bizuo_icon.png";
        //   biZuoList[0]["tasktouImgWidth"] = "300rpx";
        // }

        //未登录用户数据处理
        if (!isLoginSucess) {
          userDataData["bCount"] = "0.0";
          userDataData["iCount"] = 0;
          userDataData["cCount"] = 0;
        }

        //处理明日任务

        var mingriList = [];

        if (toTastcount_jignxi > 0) {
          var temp = {
            count: toTastcount_jignxi,
            miaoshu: "超级惊喜任务",
            danwei: "个"
          };
          mingriList.push(temp);
        }


        if (toTastcount_tixian > 0) {
          var temp = {
            count: toTastcount_tixian,
            miaoshu: "惊喜提现任务",
            danwei: "个"
          };
          mingriList.push(temp);
        }


        if (toTastcount_bizuo > 0) {
          var temp = {
            count: toTastcount_bizuo,
            miaoshu: "必做任务",
            danwei: "个"
          };
          mingriList.push(temp);
        }

        if (toTastcount_ewai > 0) {
          var temp = {
            count: toTastcount_ewai,
            miaoshu: "额外任务",
            danwei: "个"
          };
          mingriList.push(temp);
        }




        var mingriJLtemp = {
          count: 50,
          miaoshu: "最高奖励",
          danwei: "元"
        };
        mingriList.push(mingriJLtemp);

        if (isLoginSucess) {
          that.setData({
            jinrizhuan: Number(userDataData.today_money) == 0 || !isLoginSucess ? "竟然没有" : Number(userDataData.today_money).toFixed(2),
            showCenterTop: Number(userDataData.today_money) > 0,
            showCenter66: (Number(userDataData.today_money) > 0 && (app.signData.current_date + "").indexOf("newbie") != -1)?true:false
          })
        }

        var maskisvip = ((that.data.isVip > 0 && that.data.isVip != 3) || (that.data.isVip == 3 && that.data.maxType == 4))?true:false;

        //新完成全部任务去提现 是否需要删除的问题(没有抽完过或者任务已做完且抽完过但抽奖次数没有了，删除这个任务)
        // if (!isLoginSucess || is_fast_raffle != 1 ||
        //    (is_fast_raffle == 1 && current_status_data == 1 && allNumber <= 0 && hasDiamondOrVip != 1))
        //已修改为未登录或者新手任务全删除 （任务不变）
        if ((!isLoginSucess || (app.signData.current_date + "").indexOf("newbie") != -1) && !maskisvip){
          for (var tempIndex = 0; tempIndex < biZuoList.length; tempIndex++) {
            if (biZuoList[tempIndex].task_type == 46) {
              biZuoList.splice(tempIndex, 1);
              continue;
            }
          }
        }

        //当天任务没做完 并且 如果买了会员或者钻石卡就删除”老完成全部任务去提现“ 或者是会员任务
        // if (hasDiamondOrVip == 1) 
        //已修改为未登录或者新手任务是会员及首日首批任务 （任务变化）
        if (!isLoginSucess || app.signData.current_date == "newbie01" || maskisvip){
          for (var tempIndex = 0; tempIndex < biZuoList.length; tempIndex++) {
            if (biZuoList[tempIndex].task_type == 40) {
              biZuoList.splice(tempIndex, 1);
              continue;
            }
          }
        }



        //62、将“邀请2位好友参团”任务位置固定在“完成全部任务，立即提现到微信”上面。
        var temp43Task;
        for (var tempIndex = 0; tempIndex < biZuoList.length; tempIndex++) {
          if (biZuoList[tempIndex].task_type == 43) {
            temp43Task = biZuoList[tempIndex];
            biZuoList.splice(tempIndex, 1);
            console.log("1111111111111")
            continue;
          }
        }
        if (temp43Task) {
          biZuoList.push(temp43Task)
        }

        //将“新完成全部任务，立即提现到微信”放到倒数第二个 type=46 （任务不变）
        var temp46Task;
        for (var tempIndex = 0; tempIndex < biZuoList.length; tempIndex++) {
          if (biZuoList[tempIndex].task_type == 46) {
            temp46Task = biZuoList[tempIndex];
            biZuoList.splice(tempIndex, 1);
            continue;
          }
        }
        if (temp46Task) {
          biZuoList.push(temp46Task)
        }


        //将“完成全部任务，立即提现到微信”放到最后1个 type=40 （任务变化）
        var temp40Task;
        for (var tempIndex = 0; tempIndex < biZuoList.length; tempIndex++) {
          if (biZuoList[tempIndex].task_type == 40) {
            temp40Task = biZuoList[tempIndex];
            biZuoList.splice(tempIndex, 1);
            console.log("222222222")
            continue;
          }
        }
        if (temp40Task) {
          biZuoList.push(temp40Task)
        }



        that.setData({

          isLoginSucess,
          maomi_height: isLoginSucess ? "360rpx" : "270rpx",
          // maomi_bg: isLoginSucess ? "bg_zhaocaimiao_login_ed_new.png" : "bg_zhaocaimiao_no_login_new.png",
          biZuoList: biZuoList,
          eWaiList: eWaiList,
          tiXianList: tiXianList,
          jiZanList: jiZanList,
          supriseList: supriseList,
          userDataData: userDataData,



          // jinrizhuan: Number(userDataData.today_money) == 0 || !isLoginSucess ? "竟然没有" : Number(userDataData.today_money).toFixed(2),
          // showCenterTop: Number(userDataData.today_money) > 0,


          yuE: isLoginSucess ? Number(userDataData.bCount).toFixed(2) : "0.00",
          keTiXian: isLoginSucess ? Number(userDataData.withdrawal_money).toFixed(2) : "0.00",
          yiTiXian: isLoginSucess ? Number(userDataData.succMoney).toFixed(2) : "0.00",

          tiXianZhong: isLoginSucess ? Number(userDataData.desing).toFixed(2) : "0.00",


          isShowjingxi_tou,
          isShowbizuo_tou,
          isShowtixian_tou,
          isShoweWai_tou,



          mingriJingxi: toTastcount_jignxi,
          mingriTixian: toTastcount_tixian,
          mingriBizuo: toTastcount_bizuo,
          mingriEwai: toTastcount_ewai,
          mingriJiangli: "最高奖励50元",

          mingriList: mingriList,

          showYuGao: true,
          showBGWord: showBGWord,
          BGWord: BGWord,
          BGWordWidth: BGWordWidth,
          BGWordHeight: BGWordHeight,
          maomi_margin_top: maomi_margin_top,
          showFanxian: pagerShow == 4 && isLoginSucess,
          task_page_margin_top: isLoginSucess ? "70rpx" : "20rpx",


          showTwoPaopao: isCrazyMon || pagerShow == 2



        });

        if (isLoginSucess) {

          //找到邀请参团任务的index和Day
          for (var i = 0; i < biZuoList.length; i++) {
            if (biZuoList[i].task_type == 43) {
              yaoqingCanTuanIndex = biZuoList[i].index;
            }else{
              yaoqingCanTuanIndex = -1;
            }
          }

          //点击邀请参团任务回来的提示是否邀请成功
          if (wx.getStorageSync("yaoQingCanTaunGo")) {
            that.setData({
              showYaoqingCantuanBackTishi: true
            })

            wx.setStorageSync("yaoQingCanTaunGo", false);
          }
        }

        //打卡日历
        that.initCalender();


        if (isLoginSucess && isTastComplete) { //一键做下个任务
          zidongCiickNextTask(that);
        }


        // if (zhiDingClick) { //用户点击过置顶任务，并且直接回到了赚钱 --调用签到接口

        //   signZHIding(that);
        // }

        // //如果是从分享的商品详情跳进来的处理
        // if (isLoginSucess && firstLogin != null && firstLogin != "" && firstLogin != undefined) {
        //   console.log("firstLogin:", firstLogin);
        //   initShopShare(that, firstLogin);
        // }


        if (res == null || res.data == null) {}
      },

      fail: function (error) {

      }
    })

    wx.hideNavigationBarLoading();

  },

  removeTaskNotShow: function (xiaoTaskList) {

    for (var i = 0; i < xiaoTaskList.length; i++) {


      var type = xiaoTaskList[i].task_type;
      var task_class = xiaoTaskList[i].task_class;

      //需要展示的任务
      var needShow = type == 27 || type == 28 || type == 2 || type == 4 ||
        type == 5 || type == 13 || type == 7 || type == 8 || type == 19 ||
        type == 20 || type == 25 || type == 24 || type == 26 ||
        (type == 6 && task_class == 4) || type == 30 || type == 31 ||
        type == 999 || type == 12 || type == 14 || type == 35 ||
        type == 36 || type == 37 || type == 38 || type == 39 ||
        type == 40 || type == 41 || type == 32 || type == 42 ||
        type == 43 || type == 44 || type == 45 || type == 33 ||
        type == 46;
      if (!needShow) {
        xiaoTaskList.splice(i, 1);
        i--;

      }
    }
  },

  //处理赚钱任务背景

  initSignBG: function (allData) {
    try {
      wx.setStorageSync("HASMOD", allData.isMonday)
    } catch (e) {}


    var hasTicheng = false;
    if (allData.sup_day == 1 || allData.fri_win == 1) {
      hasTicheng = true;
    }
    try {
      wx.setStorageSync("HASTICHENG", hasTicheng)
    } catch (e) {}

    try {
      wx.setStorageSync("HASMEIYUEJINGXI", allData.monthly == 1 ? true : false)
    } catch (e) {}


    try {
      wx.setStorageSync("HALINGYUANGOU", allData.zero_buy == 1 ? true : false)
    } catch (e) {}


    try {
      wx.setStorageSync("HAQIANYUANHONGBAO", allData.red_rain == 1 ? true : false)
    } catch (e) {}



  },


  //任务的点击处理
  bindItemViewTap: function (event) {
    var that = this;




    // if (!isLoginSucess) {
    // util.toAuthorizeWx(function(isSuccess) {
    //   if (isSuccess) {
    //     that.onShow();
    //   }
    // });
    // return; 
    // }

    //点击的任务序号
    var postId = event.currentTarget.dataset.postid;
    var posclass = event.currentTarget.dataset.posclass;
    var postitem = event.currentTarget.dataset.postitem;

    if (!isLoginSucess) {
      if (postitem.task_type == 40) {
        unLogintType40Click = true;
      }
      return
    }


    if (whetherTask == undefined || whetherTask == 0) {
      that.setData({
        showGetVipDialog: true
      })
      return;
    }

    //首日二次刷新任务不是会员 点击跳转钻石卡界面
    if (app.signData.current_date == "newbie02" && ((that.data.is_vip == 0) || (that.data.is_vip == 3 && that.data.maxType != 4))){
      wx.navigateTo({
        url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=' + 'newbie02'
      })
      return;
    }

    //需要登录才能做的任务return掉  固定task_type == 40
    // if (!isLoginSucess && postitem.task_type == 40) {

    //   unLogintType40Click = true;

    //   return
    // }

    var fillSignData;


    switch (posclass) {
      case 1: //必做
        fillSignData = biZuoList;
        break
      case 2: //额外
        fillSignData = eWaiList;
        break
      case 4: //提现
        fillSignData = tiXianList;
        break
      case 5: //积攒
        fillSignData = jiZanList;
        break
      case 6: //惊喜
        fillSignData = supriseList;
        break
      default:
        fillSignData = [];
        break;

    }


    for (var mIndex in fillSignData) {
      if (postId == fillSignData[mIndex].index) {
        //点击的任务对象
        var value = fillSignData[mIndex].value;
        var jingliName = fillSignData[mIndex].jingliName;
        var shopsName = fillSignData[mIndex].shopsName;
        var index = fillSignData[mIndex].index;
        var num = fillSignData[mIndex].num;
        var task_type = fillSignData[mIndex].task_type;
        var task_class = fillSignData[mIndex].task_class;

        var shopsbanner = fillSignData[mIndex].shopsbanner;

        mTask_type = task_type;
        //保存任务的vaule到本地
        wx.setStorageSync("SIGN-TASK-VALUE", value);
        //保存整个任务对象
        wx.setStorageSync("SIGN-TASK", fillSignData[mIndex]);
        console.log("SIGN-TASK", fillSignData[mIndex]);

        isOldShareTX = false;

        var doTypeM = task_type;


        // //必做任务未做完且点击的是不是必做任务，提示要先完成必做任务
        // if (task_class != 1 && !isBizuoComplete && doTypeM != 15 && doTypeM != 6 && doTypeM != 24 && doTypeM != 999 && doTypeM != 28 && doTypeM != 30 && doTypeM != 31 && doTypeM != 32) {
        //   that.showToast("请先完成必做任务才能做其他任务哦。", 1500);
        //   return;
        // }
        //完成后还可以点击进入的任务
        if (fillSignData[mIndex].complete) {
          //完成后还可以点击进入的任务,以下任务完成后也可以点击
          if (doTypeM != 2 && doTypeM != 4 && doTypeM != 5 && doTypeM != 1 && doTypeM != 9 &&
            doTypeM != 11 && doTypeM != 16 && doTypeM != 17 && doTypeM != 18 && doTypeM != 25) {
            return;
          }
        }

        //H5  判断    >1可展示    >2可完成
        //必须在H5端完成的任务不能点击----相关任务9257---按照H5的
        // if (fillSignData[mIndex].task_h5 <= 2) {
        //   that.showToast("此任务只能在APP端完成哦~", 1500);
        //   return;
        // }





        switch (task_type) {

          case 999: //新衣节

            if (lotterynumber > 0) {
              wx.navigateTo({
                url: 'withdrawLimit/withdrawLimit',
              })
            } else {
              this.setData({
                showNewYI: true
              })
            }

            break;
          case 2: //1分夺宝
            wx.navigateTo({
              url: 'indianaList/indianaList',
            })
            break;
          case 3: //加X件商品到购物车
            wx.showModal({
              title: '赚钱任务说明',
              content: "将喜欢的衣服加入购物车，即可完成任务喔！",
              success: function (res) {
                if (res.confirm) {

                }
              }
            })
            break;
          case 4: //浏览X件商品

            var mVale = value.replace(new RegExp("=", "gm"), "#");
            var mmVale = mVale.replace(new RegExp("&", "gm"), "$");


            var where = fillSignData[mIndex].value.split(",")[0];

            console.log("where", where);

            if (where == "collection=shop_activity") { //活动商品
              // //将任务对象传给下个界面
              wx.navigateTo({
                url: "signActiveShop/signActiveShop?" +
                  "value=" + mmVale +
                  "&jingliName=" + jingliName +
                  "&shopsName=" + shopsName +
                  "&index=" + index +
                  "&num=" + num +
                  "&task_type=" + task_type +
                  "&shopsbanner=" + shopsbanner
              })
            } else if (where == "collection=collocation_shop") { //搭配

              wx.navigateTo({
                url: "../shouye/collocationList/collocation?" +
                  "value=" + mmVale +
                  "&jingliName=" + jingliName +
                  "&shopsName=" + shopsName +
                  "&index=" + index +
                  "&num=" + num +
                  "&task_type=" + task_type +
                  "&shopsbanner=" + shopsbanner
              })
            } else {
              // //将任务对象传给下个界面
              wx.navigateTo({

                url: "../../pages/listHome/lookShopListHome/lookshop?" +
                  "value=" + mmVale +
                  "&jingliName=" + jingliName +
                  "&shopsName=" + shopsName +
                  "&index=" + index +
                  "&num=" + num +
                  "&task_type=" + task_type +
                  "&shopsbanner=" + shopsbanner
              })
            }




            break;
          case 5: //浏览X分钟商品

            if (fillSignData[mIndex].complete) { //如果任务已经完成，直接进入即可

              var mVale = fillSignData[mIndex].value.replace(new RegExp("=", "gm"), "#");
              var mmVale = mVale.replace(new RegExp("&", "gm"), "$");
              // //将任务对象传给下个界面
              var where = fillSignData[mIndex].value.split(",")[0];
              if (where == "share=myq") { //密友圈
                wx.navigateTo({
                  url: 'qutfitList/qutfitList?' +
                    "&task_type=5",
                })
              } else if (where == "collection=shop_activity") { //活动商品
                wx.navigateTo({
                  url: "signActiveShop/signActiveShop?" +
                    "value=" + mmVale +
                    "&jingliName=" + fillSignData[mIndex].jingliName +
                    "&shopsName=" + fillSignData[mIndex].shopsName +
                    "&index=" + fillSignData[mIndex].index +
                    "&num=" + fillSignData[mIndex].num +
                    "&task_type=5" +
                    "&shopsbanner=" + fillSignData[mIndex].shopsbanner
                });
              } else if (where == "collection=collocation_shop") { //搭配
                wx.navigateTo({
                  url: "../shouye/collocationList/collocation?" +
                    "value=" + mmVale +
                    "&jingliName=" + fillSignData[mIndex].jingliName +
                    "&shopsName=" + fillSignData[mIndex].shopsName +
                    "&index=" + fillSignData[mIndex].index +
                    "&num=" + fillSignData[mIndex].num +
                    "&task_type=5" +
                    "&shopsbanner=" + fillSignData[mIndex].shopsbanner
                });
              } else if (where == "collection=csss_shop") { //专题
                wx.navigateTo({
                  url: "specialTask/specialTask?" +
                    "value=" + mmVale +
                    "&jingliName=" + fillSignData[mIndex].jingliName +
                    "&shopsName=" + fillSignData[mIndex].shopsName +
                    "&index=" + fillSignData[mIndex].index +
                    "&num=" + fillSignData[mIndex].num +
                    "&task_type=5" +
                    "&shopsbanner=" + fillSignData[mIndex].shopsbanner
                });
              } else if (where == "collection=shopping_page") { //购物页
                // wx.navigateTo({
                //   url: "../shouye/collocationList/collocation?" +
                //   "value=" + mmVale +
                //   "&jingliName=" + fillSignData[mIndex].jingliName +
                //   "&shopsName=" + fillSignData[mIndex].shopsName +
                //   "&index=" + fillSignData[mIndex].index +
                //   "&num=" + fillSignData[mIndex].num +
                //   "&task_type=5" +
                //   "&shopsbanner=" + fillSignData[mIndex].shopsbanner
                // });



                wx.navigateTo({
                  url: '../shopType/shopTypeSign/shopTypeSign',
                })

              } else {
                wx.navigateTo({
                  url: "../../pages/listHome/lookShopListHome/lookshop?" +
                    "value=" + mmVale +
                    "&jingliName=" + fillSignData[mIndex].jingliName +
                    "&shopsName=" + fillSignData[mIndex].shopsName +
                    "&index=" + fillSignData[mIndex].index +
                    "&num=" + fillSignData[mIndex].num +
                    "&task_type=5" +
                    "&shopsbanner=" + fillSignData[mIndex].shopsbanner
                });
              }
            } else {
              var beginIndex = -1;
              try {
                beginIndex = wx.getStorageSync("MIN_BEGIN_MIN_INDEX")
              } catch (e) {}

              // console.log("beginIndex:" + beginIndex);
              if (beginIndex == -1 || beginIndex === undefined || beginIndex === "") { //没有开始过分钟任务
                browseMinCase = -1;
                NowTime = new Date().getTime(); // 当前时间
                EndTime = fillSignData[mIndex].value.split(",")[1];
                EndTime = NowTime + (EndTime * 60 * 1000); //确定过期时间

                total_micro_second = EndTime - NowTime; //计时时间

                // 总秒数
                second = Math.floor(total_micro_second / 1000);
                // 天数
                day = Math.floor(second / 3600 / 24);
                // 小时
                hr = Math.floor(second / 3600 % 24);
                // 分钟
                min = Math.floor(second / 60 % 60);
                // 秒
                sec = Math.floor(second % 60);
                this.setData({

                  showBrowseMin: true, //是否弹出浏览分钟提示
                  browseMinCase: browseMinCase,
                  show2bt: false,
                  minCount: fillSignData[mIndex].value.split(",")[1], //浏览分钟数
                  top_tilte: "任务提示",
                  browseName: fillSignData[mIndex].shopsName,
                  mm: min < 10 ? "0" + min : min, //分
                  ss: sec < 10 ? "0" + sec : sec, //秒
                })

              } else { //开始过分钟任务




                total_micro_second = wx.getStorageSync("MIN_BEGIN_MIN_ETime") - new Date().getTime();


                if (signRload) {
                  countdown(that, true);
                }

                //点击的是已经开始的自己的任务
                if (beginIndex == fillSignData[mIndex].index) {
                  browseMinCase = 2;
                  this.setData({
                    show2bt: false,
                    top_tilte: "任务正在进行中...",
                    browseMinCase: browseMinCase,
                    minCount: wx.getStorageSync('SIGN-TASK-MM').value.split(",")[1], //浏览分钟数
                    browseName: wx.getStorageSync('SIGN-TASK-MM').shopsName,
                  })
                  // countdown(that)
                } else { //点击的是别的分钟数任务
                  browseMinCase = 3;
                  // countdown(that)
                  this.setData({
                    show2bt: false,
                    top_tilte: "任务提示",
                    browseMinCase: browseMinCase,
                    minCount: wx.getStorageSync('SIGN-TASK-MM').value.split(",")[1], //浏览分钟数
                    browseName: wx.getStorageSync('SIGN-TASK-MM').shopsName,
                  })

                }

                that.setData({ //未结束
                  showBrowseMin: true,
                })

              }
            }




            break;
          case 6: //购买X件商品

            // if (fillSignData[mIndex].task_class == 4) {//购买赢提现
            // wx.navigateTo({
            // url: "../../pages/listHome/lookShopListHome/lookshop?" +
            // "value=" + mmVale +
            // "&jingliName=" + fillSignData[mIndex].jingliName +
            // "&shopsName=" + fillSignData[mIndex].shopsName +
            // "&shopsbanner=" + fillSignData[mIndex].shopsbanner
            // });
            // }

            var txClickTaskList = wx.getStorageSync('SIGN-TASK');


            var showText = "只需购买" + txClickTaskList.value.split(",")[1] + "件" + txClickTaskList.shopsName + "商品即可完成任务，获得提现额度！提现额度在订单完结后（不可退货退款）才能使用哦~若同时购买多件商品，以购买的第一件为完成任务商品！"

            that.setData({
              signFinishShow: true,
              signFinishDialog: {
                top_tilte: "购买任务说明",
                contentText: showText,
                oneBtnText: "买买买",
                isOneBtn: true,
              },
            });






            break;
          case 7: //分享X件商品

            shareXShopType = 1; //1分享正价商品 2 分享搭配商品
            shareXShop_signIndext = index; //SignFragment.signIndex
            shareXShop_doValue = value; // SignFragment.doValue;
            shareXShop_doNum = num; //SignFragment.doNum
            shareXShop_jiangliName = fillSignData[mIndex].jiangliDanWei + fillSignData[mIndex].jiangliContent;
            shareXShop_jiangliValue = fillSignData[mIndex].jiangliValue; //SignFragment.jiangliValue
            shareXShop_complete = fillSignData[mIndex].complete;

            this.tosharexshop();
            break;
          case 8: // 分享X套搭配购

            shareXShopType = 2; //1分享正价商品 2 分享搭配商品 3 分享赢提现（新）
            shareXShop_signIndext = index; //SignFragment.signIndex
            shareXShop_doValue = value; // SignFragment.doValue;
            shareXShop_doNum = num; //SignFragment.doNum


            shareXShop_jiangliName = fillSignData[mIndex].jiangliDanWei + fillSignData[mIndex].jiangliContent;
            shareXShop_jiangliValue = fillSignData[mIndex].jiangliValue; //SignFragment.jiangliValue
            shareXShop_complete = fillSignData[mIndex].complete;



            this.tosharexshop();

            break;
          case 10: // 设置喜好
            break;
          case 11: //去精选推荐挑美衣
            break;
          case 12:
            wx.navigateTo({
              url: 'qutfitList/qutfitList?' +
                "&task_type=12"
            })
            break;
          case 13: // 分享XX件品质美衣

            wx.navigateTo({
              url: "shareQshop/shareQshop"
            });
            break;


          case 14: //  分享XX条热门穿搭话题
            wx.navigateTo({
              url: 'qutfitList/qutfitList?' +
                "&task_type=14"
            })


            break;
          case 19: //浏览赢提现



            var mVale = value.replace(new RegExp("=", "gm"), "#");
            var mmVale = mVale.replace(new RegExp("&", "gm"), "$");


            var where = fillSignData[mIndex].value.split(",")[0];

            console.log("where", where);

            if (where == "share=myq") {
              wx.navigateTo({
                url: 'qutfitList/qutfitList?' +
                  "&task_type=12"
              })
            } else if (where == "collection=shop_activity") { //活动商品
              // //将任务对象传给下个界面
              wx.navigateTo({
                url: "signActiveShop/signActiveShop?" +
                  "value=" + mmVale +
                  "&jingliName=" + jingliName +
                  "&shopsName=" + shopsName +
                  "&index=" + index +
                  "&num=" + num +
                  "&task_type=" + task_type +
                  "&shopsbanner=" + shopsbanner
              })
            } else if (where == "collection=collocation_shop") { //搭配

              wx.navigateTo({
                url: "../shouye/collocationList/collocation?" +
                  "value=" + mmVale +
                  "&jingliName=" + jingliName +
                  "&shopsName=" + shopsName +
                  "&index=" + index +
                  "&num=" + num +
                  "&task_type=" + task_type +
                  "&shopsbanner=" + shopsbanner
              })
            } else {
              // //将任务对象传给下个界面
              wx.navigateTo({

                url: "../../pages/listHome/lookShopListHome/lookshop?" +
                  "value=" + mmVale +
                  "&jingliName=" + jingliName +
                  "&shopsName=" + shopsName +
                  "&index=" + index +
                  "&num=" + num +
                  "&task_type=" + task_type +
                  "&shopsbanner=" + shopsbanner
              })
            }
            break;









            break;
          case 20: //分享赢提现（老）
            isOldShareTX = true;
            shareXShopType = 4;

            // this.toshareGetTixian();


            shareXShop_signIndext = index; //SignFragment.signIndex
            shareXShop_doValue = value; // SignFragment.doValue;
            shareXShop_doNum = num; //SignFragment.doNum
            shareXShop_jiangliName = fillSignData[mIndex].jiangliDanWei + fillSignData[mIndex].jiangliContent;
            shareXShop_jiangliValue = fillSignData[mIndex].jiangliValue; //SignFragment.jiangliValue
            shareXShop_complete = fillSignData[mIndex].complete;

            this.tosharexshop();



            break;
          case 21: //一元夺宝（提现额度夺宝）


            wx.navigateTo({
              url: 'indianaList/indianaList',
            })

            break;

          case 24: //每月惊喜任务


            this.setData({
              meiyueTishiShow: true,
            });


            break;

          case 25: //分享赢提现（新）
            shareXShopType = 3; //1分享正价商品 2 分享搭配商品 3 分享赢提现（新）
            shareXShop_signIndext = index; //SignFragment.signIndex
            shareXShop_doValue = value; // SignFragment.doValue;
            shareXShop_doNum = num; //SignFragment.doNum
            shareXShop_jiangliName = fillSignData[mIndex].jiangliDanWei + fillSignData[mIndex].jiangliContent;
            shareXShop_jiangliValue = fillSignData[mIndex].jiangliValue; //SignFragment.jiangliValue
            shareXShop_complete = fillSignData[mIndex].complete;

            this.tosharexshop();

            break;
          case 26: //抽奖转盘

            wx.navigateTo({
              url: 'withdrawLimit/withdrawLimit?isBalanceLottery=true&isFromSignBalanceLotter=true',
            })


            break;

          case 27: //余额抽提现
            wx.navigateTo({
              url: 'withdrawLimit/withdrawLimit',
            })
            break;

          case 28: //超级0元购
            this.setData({
              zeroBuyDialogShowFlag: true
            })
            break;
          case 30: //超级分享日

            wx.navigateTo({
              url: 'inviteFriends/inviteFriends',
            })

            break;
          case 31: //好友赢提现
            wx.navigateTo({
              url: 'inviteFriends/inviteFriends',
            })

            break;

          case 32: //分享赚钱任务页
            shareXShopType = 1; //1分享正价商品 2 分享搭配商品
            shareXShop_signIndext = index; //SignFragment.signIndex
            shareXShop_doValue = value; // SignFragment.doValue;
            shareXShop_doNum = num; //SignFragment.doNum
            shareXShop_jiangliName = fillSignData[mIndex].jiangliDanWei + fillSignData[mIndex].jiangliContent;
            shareXShop_jiangliValue = fillSignData[mIndex].jiangliValue; //SignFragment.jiangliValue
            shareXShop_complete = fillSignData[mIndex].complete;

            this.tosharexshop();
            break;

          case 33: //关注服务号

            this.setData({
              showService: true
            })
            break;
          case 35: //置顶衣蝠小程序
            that.setData({
              yindaoPic: "sign_addxcx_new.png",
              showZhiding: true
            })

            break;

          case 36: //关注公众号-和35共用
            // that.setData({
            //   yindaoPic: "guide_app5.png",
            //   showZhiding: true
            // })

            this.setData({
              showService: true
            })
            break;
          case 37: //下载APP-和35共用
            // that.setData({
            //   yindaoPic: "guide_app4.png",
            //   showZhiding: true
            // })

            this.setData({
              showDwongload: true
            })

            break;
          case 38: //免费领一件美衣

            // if (!isLoginSucess) {
            wx.navigateTo({
              url: '/pages/shouye/redHongBao?shouYePage=ThreePage' + "&comefrom=sign",
            })
            // } else {
            //   //查询是否有免费领订单，如果有就签任务，没有就去首页3
            //   that.getNewUserFreeOrder();
            // }


            break;

          case 39: //邀请两位好友  ---接通客服

            wx.setStorageSync("isHomePageThreeGo", true); //使用跳首页3的判断就行了


            break;
          case 40: //完成全部任务，立即提现到微信 （任务变化的）

            console.log("点击了40的任务...")
            
            if (is_fast_raffle != 1 && current_status_data != 1) { //没抽完过（新手第一天且当天么没有做完）
              that.showToast("您还未完成当前全部的賺钱任务。", 3000)

              return;
            }

            if (that.data.fromApp == '1') {
              that.setData({
                showFinishTask: true
              })
              return;
            }

            if (hasTrailNum == 1) {
              wx.navigateTo({
                url: '../mine/withdrawLimitTwo/withdrawLimitTwo?type=1&firstCashCardCountUseUp=1',
              })
            } else {
              wx.navigateTo({
                url: '../mine/withdrawLimitTwo/withdrawLimitTwo?type=1',
              })
            }
            wx.setStorageSync("clickCompleteTask", true);

            break;

          case 46: //新完成全部任务，立即提现到微信 （任务不变）

            console.log("点击了46的任务...")
            
            if (current_status_data == 1) {
              wx.navigateTo({
                url: '../mine/withdrawLimitTwo/withdrawLimitTwo?type=1',
              })
              wx.setStorageSync("clickCompleteTask", true);
            } else {
              that.showToast("您还未完成当前全部的賺钱任务。", 3000)
              return;
            }

            if (that.data.fromApp == '1') {
              that.setData({
                showFinishTask: true
              })
              return;
            }

            break;

          case 41: //加入衣蝠福利群 
            this.setData({
              showJoinWXQ: true
            })

            break;

          case 42: //拼团一件热卖美衣 
            this.setData({
              kaituanStr: "开团免费，成团后才付费。快去挑选您心仪的美衣开团吧！",
              showKaituanTishi: true
            })
            break;
          case 43: //邀请2位好友参团 
            this.goPinTuanDetail(false);
            break;

          case 44: //订阅奖金到账通知 首次
            var ids = '';
            if (config.Host.indexOf("www.52yifu.wang") != -1)//测试环境
            {
              ids = ['SSLLEobwBCfsE8aXs89jzIsE9NNkmJxHNOSDSkpiaPo', 'VNIahV67MYiEKuhwDCCVvqdQuEZbTj1D5l7nj_TMWGk','vhbEjSHVOs5oCGbkhWxaAvhxzKj8fQGRDcCD2TI8vZI'];
            } else {
              ids = ['YYPs9vHnqNDTNNkhL0zJFnEqNYXBfMdVCU1hnVIm-Ow', 'MoZmyHvBikwilHNTS6u0MQvOh5faY-dwa0ogSRhMQaU', 'DC2E0pBII-4XTg-EczPnwN5jCY1B7s8YRSeoItQAMYA'];
            }
            this.handleTempl(ids, 'jiangjin');
            break;

          case 45: //订阅大促特价通知 二次
            var ids = '';
            if (config.Host.indexOf("www.52yifu.wang") != -1)//测试环境
            {
              ids = ['NQsz8TY22JsN3P17SwXvsKpdPD5wbKfdJmweFa_WVlQ', '0dQpUqwoxxjkNTADm3ibwKfeusrqfx_8sAJv6NQWWic','G3kGLpr-RhSXy7A3M9WwjM-fp7Xvfs35itOHfKIgbgs'];
            } else {
              ids = ['JKwFiV8D8I61aVuvSAmLWe6ENI74bgTRwjOIZR5x6co', 'oAz9IWzAchfjS2-QBuzB9yqSJ38z9uoVu0VrTpVYQRQ', '6goIKlq2XrIWqwznxX0SKh_MXk1O5aFlj6TODcm17f8'];
            }
            this.handleTempl(ids, 'chuxiao');
            break;

          default:
            break;
        }


        break;


      }
    }

  },
  //订阅消息处理
  handleTempl: function (ids, str) {
    var that = this;
    wx.requestSubscribeMessage({
      tmplIds: ids,
      success(res) {
        console.log("订阅消息res=" + res)
        var temp_id = ids[0];
        if (res[temp_id] == 'accept') { //授权成功
          console.log("accept")

          //上传ids到后台
          util.handleTempl_http(ids, function (data) {
            if (data.status == 1) {
              signZHIding(that); //使用置顶任务的签到就行
            }
          })
        } else {
          console.log("notaccept")
          var substr = str == 'jiangjin' ? "奖金到账" : "大促销降价";
          that.showToast('请点允许，订阅' + substr + '通知后，即可完成任务。', 1500)
        }
      }
    })
  },
  goKaituan: function () {
    wx.navigateTo({
      url: "../../pages/listHome/hotShopListTK/hotShopListTK?"
    })

    if (wx.getStorageSync('SIGN-TASK').task_type == 42) {


      wx.setStorageSync("isHomePageThreeGo", true);





    }
    this.setData({
      showKaituanTishi: false
    })
  },




  goPinTuanDetail: function (isSignBack) {
    wx.setStorageSync("yaoQingCanTaunGo", false);
    wx.showNavigationBarLoading();
    //去最新的拼团详情
    var that = this;
    var dataUrl = config.Host + "order/getUserLatelyRoll" +
      "?token=" + token + config.Version;
    util.http(dataUrl, function (data) {

      usefulRollData = data.data;
      var lastTuanStatus = Number(usefulRollData.status);


      switch (lastTuanStatus) {

        case 1: //没有有效的团
          that.setData({
            canTuanStr: "您还没有拼团订单，请先挑选一件心仪美衣拼团。",
            canTuanBTnStr: "去拼团",
            showYaoqingCantuanTishi: true,
          })
          break;
        case 2: //开了团，但是还没有邀请2个人

          var canTuanStr = "邀请两位好友参团您任意拼团单，即可完成任务，并额外获得1次提现机会哦。参团免费哦。成团后才付费。";
          if (isSignBack) {
            canTuanStr = "您还未邀请两位好友参团。"
          }

          that.setData({
            canTuanStr: canTuanStr,
            canTuanBTnStr: "去邀请好友",
            showYaoqingCantuanTishi: true,
          })

          break;
        case 3: //开了团，已经邀请了2个人(此时需要签掉这个任务)

          that.signCanYaoQingCanTan();

          break;
      }
      wx.hideNavigationBarLoading()

    });

  },

  yaoQingCanTuanDiaologTap: function () {

    switch (Number(usefulRollData.status)) {
      case 1:
        wx.navigateTo({
          url: "../../pages/listHome/hotShopListTK/hotShopListTK?"
        })
        wx.setStorageSync("yaoQingCanTaunGo", true);

        break;
      case 2:
        wx.navigateTo({
          url: "../../pages/shouye/fightDetail/fightDetail?&code=" + usefulRollData.roll_code,
        })
        wx.setStorageSync("yaoQingCanTaunGo", true);
        break;
      case 3:
        // type = 1 代表是从赚钱进转盘  用于统计
        wx.navigateTo({
          url: '../mine/withdrawLimitTwo/withdrawLimitTwo?type=1',
        })
        break;
    }
    this.setData({
      showYaoqingCantuanTishi: false,
    })
  },

  yaoQingCanTuanBackDiaologTap: function () {
    this.goPinTuanDetail(true);
    this.setData({
      showYaoqingCantuanBackTishi: false
    })
  },


  //签到邀请参团的任务
  signCanYaoQingCanTan: function () {

    if (yaoqingCanTuanIndex < 0 || biZuoList[yaoqingCanTuanIndex].complete) {
      return;
    }

    var that = this;

    var signUrl = config.Host + "signIn2_0/signIning" +
      "?token=" + token +
      "&index_id=" + yaoqingCanTuanIndex +
      "&day=" + wx.getStorageSync("SIGN_DAY") + config.Version;

    util.http(signUrl, function (data) {
      // if (status == 1) {
      //   that.onShow();
      // }

      that.setData({
        canTuanStr: "恭喜完成任务，增加1次提现机会。",
        canTuanBTnStr: "立即去提现",
        showYaoqingCantuanTishi: true,
      })
      that.onShow();


    });
  },

  getNewUserFreeOrder: function () {

    wx.showNavigationBarLoading();

    var that = this;
    var dataUrl = config.Host + "order/queryUserFreeOrder" +
      "?token=" + token +
      "&" + config.Version;
    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = dataUrl;

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

    dataUrl = util.Md5_httpUrl(dataUrl);


    wx.request({

      url: dataUrl,

      method: 'GET',
      //请求传参
      data: {},
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        app.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
      },
      complete: function (res) {
        if (res == null || res.data == null) {} else {
          if (res.data.freeOrder == 1) { //有免费领订单
            signZHIding(that); //使用置顶任务的签到就行
          } else {
            wx.navigateTo({
              url: '/pages/shouye/redHongBao?shouYePage=ThreePage' + "&comefrom=sign",
            })
          }

          wx.hideNavigationBarLoading()
        }
      },

      fail: function (error) {
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",


        });

        wx.hideNavigationBarLoading()
      }
    })

  },

  //计算明日任务数量
  initMingriCount: function (res) {

    for (var index in res.data.tomorrowTaskList) {
      switch (res.data.tomorrowTaskList[index].task_class) {
        case 1: //必做
          toTastcount_bizuo++;
          break
        case 2: //额外
          toTastcount_ewai++;
          break
        case 4: //提现
          toTastcount_tixian++;
          break
        case 5: //积攒
          break
        case 6: //惊喜
          toTastcount_jignxi++;
          break
        default:
          break;
      }
    }
  },

  initList: function (signTaskListData, res) {


    //去掉不能在APP展示的任务--按H5走
    for (var i = 0; i < signTaskListData.length; i++) {
      var task_h5 = signTaskListData[i].task_h5;
      if (task_h5 <= 1) {
        signTaskListData.splice(i, 1);
        i--;
      }
    }
    //如果用户未下单去掉幸运转盘的任务
    for (var i = 0; i < signTaskListData.length; i++) {
      if (wx.getStorageSync("IS_AREADY_BUY" + user_id) == true) {
        if (signTaskListData[i].task_type == 26) {
          signTaskListData.splice(i, 1);
          i--;
        }
      }
    }

    //如果用户没有点击转盘接通客服按钮就去掉参团的任务type = 43 (未登录也不显示)

    if (canShowCanTuanTask == 0) {
      for (var i = 0; i < signTaskListData.length; i++) {
        if (signTaskListData[i].task_type == 43) {
          signTaskListData.splice(i, 1);
          i--;
        }
      }
    }


    /**
     * 处理任务覆盖关系：
     * 任务之间的覆盖并存关系：小程序：新衣节覆盖每月惊喜
     */
    if (isCrazyMon) {
      removeTaskFG(signTaskListData, 24)
    }

    //当topWx ==0时去掉置顶任务

    if (userDataData.topWx == 0) {
      removeTaskFG(signTaskListData, 35)

    }

    //清除之前的数据
    biZuoList = [];
    eWaiList = [];
    tiXianList = [];
    jiZanList = [];
    supriseList = [];
    monthList = [];
    isOldShareTX = false;

    //处理任务名
    for (var index in signTaskListData) {
      var getNum = signTaskListData[index].num; //需要做的任务次数 --需要签几次


      var doValue = signTaskListData[index].value;
      var completIcon; //浏览商品任务完成后的图标
      var shopsName; //浏览任务商品区域名
      var shopsbanner; //浏览任务商品区banner图
      var taskIcon; //任务图标



      for (var groupIndex in res.data.shopGroupList) {
        if (signTaskListData[index].icon == res.data.shopGroupList[groupIndex].id) {
          completIcon = res.data.shopGroupList[groupIndex].icon;
          shopsName = res.data.shopGroupList[groupIndex].app_name;
          shopsbanner = res.data.shopGroupList[groupIndex].banner;
        }
      }

      var type = signTaskListData[index].task_type;
      var taskName;

      switch (type) {
        case 2:
          taskName = "去抽奖";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_duobao_new.png";

          break;
        case 3: //"加X件商品到购物车"
          taskName = "加" + getNum + "件商品到购物车";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_gouwuche_sign.png";
          break;
        case 4:
          taskName = "浏览" + getNum * doValue.split(",")[1] + "件" + "【" + shopsName + "】";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_liulan_sign.png";
          break;
        case 5:
          taskName = "浏览" + "【" + shopsName + "】" + getNum * doValue.split(",")[1] + "分钟";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_liulan_sign.png";
          break;
        case 6:

          if (signTaskListData[index].task_class == 4) {
            taskName = "购买赢提现";
          } else {
            taskName = "购买" + getNum + "件" + "【" + shopsName + "】";
          }
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_shoping_normal.png";

          break;
        case 7:

          var shareShopCount = doValue.split(",")[1]; //分享任务一次签到需要分享几次




          var where = doValue.split(",")[0];
          if (where == "share=spellGroup" || where == "share=h5money" || where == "share=indiana") {
            taskName = shopsName;
          } else {
            taskName = "分享" + shareShopCount + "件" + "【" + shopsName + "】";
          }





          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_fenxiang_nom.png";

          break;
        case 8: // 分享X套搭配购
          taskName = "分享" + getNum + "套" + "【时尚搭配】";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_fenxiang_nom.png";

          break;

          // case 9: // 分享X套搭配购
          //   taskName = "分享X件商品"
          //   break;

        case 10: // 设置喜好
          taskName = "设置喜好";

          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/set_like_icon.png";

          break;
        case 11: //去精选推荐挑美衣
          taskName = "去精选推荐挑美衣";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_meiyi.png";

          break;
        case 12:
          taskName = "浏览" + getNum * doValue.split(",")[0] + "条热门穿搭";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_liulan_sign.png";

          break;

        case 13: // 分享XX件品质美衣
          taskName = "分享" + getNum + "件品质美衣";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_fenxiang_nom.png";
          break;

        case 14: //分享XX条热门穿搭话题
          taskName = "分享" + getNum + "条【SHOW社区话题】";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_fenxiang_nom.png";
          break;
        case 19:
          taskName = "浏览赢提现";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_liulan_sign.png";

          break;
        case 20: //分享赢提现（老）
          taskName = "分享赢提现";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_fenxiang_nom.png";

          break;
        case 21: //一元夺宝（提现额度夺宝）
          taskName = "抽奖赢提现";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_duobao_new.png";

          break;
        case 24:
          taskName = jsonTextData.myjlfbrwjlwa.text;
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_fan2.png";

          break;
        case 25: //分享赢提现（新）
          taskName = "分享赢提现";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_fenxiang_nom.png";

          break;

        case 26: //抽奖转盘

          taskName = "幸运转盘";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_choujiang.png";

          break;
        case 27: //余额抽提现

          taskName = "余额抽提现";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_choujiang.png";

          break;


        case 28:
          taskName = "超级0元购";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_lingyuangou.png";
          break;

        case 30:
          taskName = "超级分享日";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_fenxiangri.png";
          break;

        case 31:
          taskName = "好友赢提现";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_fenxiangri.png";
          break;

        case 32:
          taskName = "分享赚钱任务页";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_fenxiangri.png";
          break;
        case 33: //关注服务号
          taskName = "关注衣蝠公众号";
          signTaskListData[index]["taskIcon"] = "small-iconImages/qingfengpic/guanzhu_gzh.png";
          break;

        case 35: //置顶衣蝠小程序
          taskName = "添加衣蝠到我的小程序";
          signTaskListData[index]["taskIcon"] = "small-iconImages/qingfengpic/sign_dingzhi.png";
          break;
        case 36: //关注衣蝠公众号
          taskName = "关注衣蝠公众号";
          signTaskListData[index]["taskIcon"] = "small-iconImages/qingfengpic/guanzhu_gzh.png";
          break;
        case 37: //下载衣蝠APP
          taskName = "下载衣蝠APP";
          signTaskListData[index]["taskIcon"] = "small-iconImages/qingfengpic/sign_download_app.png";
          break;

        case 38: //免费领一件美衣
          taskName = "免费领一件美衣";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_lingyuangou.png";
          break;

        case 39: //邀请两位好友
          taskName = "邀请两位好友";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_fenxiang_nom.png";
          break;

        case 40: //完成全部任务，立即提现到微信
          taskName = "完成全部任务，立即提现到微信";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_choujiang.png";
          break;

        case 46: //新完成全部任务，立即提现到微信
          taskName = "完成全部任务，立即提现到微信";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_choujiang.png";
          break;

        case 41: //加入衣蝠福利群
          taskName = "加微信客服为好友";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_jizan.png";
          break;

        case 42: //拼团一件热卖美衣
          taskName = "拼团一件热卖美衣";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_pintuan.png";
          break;

        case 43: //邀请2位好友参团
          taskName = "邀请2人参团，奖励提现1次";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/icon_pintuan.png";
          break;
        case 44: //订阅任务
          taskName = "订阅奖金到账通知";
          signTaskListData[index]["taskIcon"] = "small-iconImages/heboImg/Subscribe_first.png";
          break;
        case 45: //订阅任务
          taskName = "订阅大促特价通知";
          signTaskListData[index]["taskIcon"] = "small-iconImages/heboImg/Subscribe_first.png";
          break;

        default:
          taskName = "未知任务";
          signTaskListData[index]["taskIcon"] = "small-iconImages/ad_pic/set_like_icon.png";

          break;


      }
      //处理奖励
      var jingliName; //奖励全名

      var jingliCount; //奖励数量

      var jiangliContent; //奖励内容

      var jiangliDanWei; //奖励单位

      var showJia = true; //加号是否显示
      var showDanwei = true; //单位是否显示
      var showJiangliContent = true; //奖励内容是否显示
      var showJiangliCount = true; //奖励数量是否显示





      var getType = 1;
      var getValue = 1;
      var t_id = signTaskListData[index].t_id;
      for (var jingliIndex in jiangliList) {
        if (t_id == jiangliList[jingliIndex].t_id) {
          getType = jiangliList[jingliIndex].type_id; //奖励ID
          getValue = jiangliList[jingliIndex].value;

          jingliCount = getValue * getNum;


          // 奖励
          switch (getType) {
            case 1: // 补签卡
              break;
            case 2: // 0元疯抢
              break;
            case 3: // 优惠券
              jingliName = "+" + getValue * getNum + "元优惠券"

              showJia = true;
              showDanwei = true;
              showJiangliContent = true;

              jiangliContent = "优惠券";
              jiangliDanWei = "元"
              break;
            case 4: // 积分
              jingliName = "+" + getValue * getNum + "积分"


              jiangliContent = "积分";
              jiangliDanWei = ""

              showJia = true;
              showDanwei = false;
              showJiangliContent = true;


              break;
            case 5: // 现金
              jingliName = "+" + getValue * getNum + "元余额"


              jiangliContent = "余额";
              jiangliDanWei = "元"

              showJia = true;
              showDanwei = true;
              showJiangliContent = false;

              break;
            case 6: // 开店
              break;
            case 7: // 夺宝
              jingliName = "夺宝"
              jingliCount = "Iphone7"
              showJia = false;
              showDanwei = false;
              showJiangliContent = false;


              break;
            case 8: // 余额翻倍
              break;
            case 9: // 开启积分变金币
              break;
            case 10: // 开启优惠券升级金券
              break;
            case 11: // 衣豆
              break;
            case 12: // 提现额度
              jingliName = "+" + getValue * getNum + "元提现额度"


              jiangliContent = "提现额度";
              jiangliDanWei = "元"
              showJia = true;
              showDanwei = true;
              showJiangliContent = true;


              break;
            default:
              break;
          }
        }

      }

      var taskNameColor = "#405f80"; //是否加红
      var taskNameFontWeight = "normal"; //是否加粗

      var showJiangliContentFontSize = "22rpx";

      //特殊处理任务名称或奖励
      if (type == 28) {
        showJia = false;
        showDanwei = false;
        jingliCount = jsonTextData.cj0yg.text1;
        jiangliContent = jsonTextData.cj0yg.text2;
        // console.log("jiangliContent11111111111", jiangliContent);

        taskNameColor = "#ff3f8b";
        taskNameFontWeight = "bold";
        showJiangliContentFontSize = "27rpx";
        showJiangliContent = true;

      } else if (type == 24) {
        showJia = false;
        showDanwei = false;
        showJiangliCount = false;
        showJiangliContent = false;
        taskNameColor = "#ff3f8b";
        taskNameFontWeight = "bold";
      } else if (type == 25) { //新分享赢提现
        showJia = true;
        showDanwei = true;
        showJiangliCount = true;
        showJiangliContent = true;
        jingliCount = 50;
        jiangliDanWei = "元";
        jiangliContent = "提现额度";
      } else if (type == 26) {
        showJia = true;
        showDanwei = true;
        jiangliDanWei = "元";

        showJiangliCount = true;
        jingliCount = jsonTextData.cjjxrwqcj.text;

        showJiangliContent = false;

      } else if (type == 27) { //余额抽提现
        showJia = true;
        showDanwei = true;
        showJiangliCount = true;
        showJiangliContent = true;
        jingliCount = "5-50";
        jiangliDanWei = "元";
        jiangliContent = "随机提现额度";
      } else if (type == 6) {
        taskNameColor = "#ff3f8b";
        taskNameFontWeight = "bold";
        showJia = true;
        showDanwei = true;
        showJiangliCount = true;
        showJiangliContent = true;
        jingliCount = "2-60";
        jiangliDanWei = "元";
        jiangliContent = "随机提现额度";

      } else if (type == 30) { //超级分享日
        for (var groupIndex in res.data.shopGroupList) {
          if (res.data.shopGroupList[groupIndex].id == 37) {
            jingliCount = res.data.shopGroupList[groupIndex].value;
          }
        };
        jiangliDanWei = "元/人";
        showJiangliContent = false;
        showJia = true;
        showDanwei = true;
        taskNameColor = "#ff3f8b";
        taskNameFontWeight = "bold";
      } else if (type == 31) { //好友赢提现
        for (var groupIndex in res.data.shopGroupList) {
          if (res.data.shopGroupList[groupIndex].id == 38) {
            jingliCount = res.data.shopGroupList[groupIndex].value;
          }
        };
        jiangliDanWei = "元";
        jiangliContent = "提现额度";
        showJia = true;
        showDanwei = true;
        showJiangliContent = true;

        taskNameColor = "#ff3f8b";
        taskNameFontWeight = "bold";
      } else if (type == 2) {
        for (var groupIndex in res.data.shopGroupList) {
          if (res.data.shopGroupList[groupIndex].id == 28) {
            jingliCount = res.data.shopGroupList[groupIndex].value;
          }
        };
        showJiangliContent = false;
        showDanwei = false;
        showJia = false;
      } else if (type == 999) { //新衣节

        showJia = false;
        showDanwei = false;
        jingliCount = "100%中奖";
        jiangliContent = jsonTextData.cj0yg.text2;

        taskNameColor = "#ff3f8b";
        taskNameFontWeight = "bold";
        showJiangliContentFontSize = "27rpx";
        showJiangliContent = true;

      } else if (type == 35) {

        // taskNameColor = "#ff3f8b";
        // taskNameFontWeight = "bold";
      } else if (type == 40) { //完成全部任务，接通客服提现
        showJia = false;
        showDanwei = true;
        showJiangliCount = true;
        showJiangliContent = true;
        jingliCount = unVipRaffleMoney ? unVipRaffleMoney : 90;
        jiangliDanWei = "元";
        jiangliContent = "提现到微信";

        taskNameColor = "#ff3f8b";
        taskNameFontWeight = "bold";

        taskName = "您有" + unVipRaffleMoney + "元可提现，立即去提现"
        // if (hasTrailNum == 2) {//只要买过两次提现卡就该成这个
        //   taskName = "您有" + unVipRaffleMoney + "元可提现，立即去提现"
        // }
        // else{
        //   if (is_fast_raffle == 1 && hasDiamondOrVip != 1) { //抽完过


        //     if (hasTrailNum == 1) {
        //       // taskName = "赠送50次提现机会，立即提现"
        //       taskName = "您有" + unVipRaffleMoney + "元可以提现"
        //     } else if (hasTrailNum == 2) {
        //       taskName = "您有" + unVipRaffleMoney + "元可提现，立即去提现"
        //     } else {
        //       jingliCount = raffleFixedMoney;
        //       taskName = "赠送50次提现机会，立即提现"
        //     }

        //   }else{
        //     jingliCount = raffleFixedMoney;
        //   }

        // }

   





      } else if (type == 46) { //新完成全部任务，接通客服提现
        showJia = false;
        showDanwei = true;
        showJiangliCount = true;
        showJiangliContent = true;
        jingliCount = 90;
        jiangliDanWei = "元";
        jiangliContent = "提现到微信";

        taskNameColor = "#ff3f8b";
        taskNameFontWeight = "bold";

        //只需处理抽完过的情况，没有抽完的话 这个任务会被删除---只处理点击就可以，名称不用修改




      } else if (type == 43) { //开团和邀请参团
        showJia = false;
        showDanwei = true;
        showJiangliCount = true;
        showJiangliContent = true;
        jingliCount = 90;
        jiangliDanWei = "元";
        jiangliContent = "提现到微信";
      }


      var jiangliColor = "#ff3f8b";
      //处理任务指示头
      var showZhiShiTou = false;
      var tasktouImg = "small-iconImages/ad_pic/bizuo_icon.png";
      var tasktouImgWidth = "300rpx";

      if (type == 999) { //新衣节
        showZhiShiTou = true;
        tasktouImg = "small-iconImages/ad_pic/mondonghua_tishi.png"
        tasktouImgWidth = "300rpx"
      }
      if (type == 6) { //购买任务
        showZhiShiTou = true;
        tasktouImgWidth = "300rpx"

        if (signTaskListData[index].task_class == 4) { //购买赢提现
          tasktouImg = "small-iconImages/ad_pic/surprise_tx_tou.png";
        } else { //其他购买
          tasktouImg = "small-iconImages/ad_pic/paopao_ewai.png";
        }
      }

      if (type == 24) { //每月惊喜任务
        showZhiShiTou = true;
        tasktouImg = "small-iconImages/ad_pic/liangbaijian.png"
        tasktouImgWidth = "180rpx"
      }

      //将所有任务奖励标记为5-50
      if (type != 40 && type != 46 && (app.signData.current_date + "").indexOf("newbie") != -1){
        jingliCount = '5-50'
      }

      var temp = {

        showZhiShiTou,
        tasktouImg,
        tasktouImgWidth,

        jiangliColor: jiangliColor,
        jingliCount: jingliCount,
        jiangliContent: jiangliContent,
        jiangliDanWei: jiangliDanWei,

        showJia: showJia,
        showDanwei: showDanwei,
        showJiangliCount: showJiangliCount,
        showJiangliContent: showJiangliContent,

        jiangliID: getType,
        jiangliValue: getValue,
        shopsName: shopsName,
        shopsbanner: shopsbanner,
        taskIcon: signTaskListData[index].taskIcon,
        completIcon: completIcon,

        index: signTaskListData[index].index,
        status: signTaskListData[index].status,
        num: signTaskListData[index].num,
        task_class: signTaskListData[index].task_class,
        task_h5: signTaskListData[index].task_h5,
        task_type: signTaskListData[index].task_type,
        value: signTaskListData[index].value,
        taskName: taskName,

        taskNameFontWeight: taskNameFontWeight,
        taskNameColor: taskNameColor,
        showJiangliContentFontSize: showJiangliContentFontSize,
      }




      switch (signTaskListData[index].task_class) {
        case 1: //必做
          biZuoList.push(temp);
          break
        case 2: //额外
          eWaiList.push(temp);
        case 3: //每月任务
          monthList.push(temp);
          break;
          break
        case 4: //提现
          tiXianList.push(temp);
          break
        case 5: //积攒
          jiZanList.push(temp);
          break
        case 6: //惊喜
          supriseList.push(temp);
          break
        default:
          break;
      }
    }
    // 如果有星期一的任务手动加上
    if (isCrazyMon) {
      var crazyTemp = {
        completIcon: "sign_in/icon/20170808zMBpzvXz.png",
        index: -999,
        jiangliColor: "#ff3f8b",
        jiangliContent: "最高1000元",
        jiangliDanWei: "",
        jiangliID: 3,
        jiangliValue: 5,
        jingliCount: lotterynumber > 0 ? "剩余" + lotterynumber + "次" : "100%中奖",
        num: 1,
        shopsName: "",
        shopsbanner: undefined,
        showDanwei: true,
        showJia: false,
        showJiangliContent: true,
        showJiangliContentFontSize: "22rpx",
        showJiangliCount: true,
        showZhiShiTou: true,
        status: undefined,
        taskIcon: "small-iconImages/ad_pic/icon_monday.png",
        taskName: "疯狂新衣节",
        taskNameColor: "#ff3f8b",
        taskNameFontWeight: "bold",
        task_class: 6,
        task_h5: 3,
        task_type: 999,
        tasktouImg: "small-iconImages/ad_pic/mondonghua_tishi.png",
        tasktouImgWidth: "300rpx",
        value: "0",
      }
      supriseList.push(crazyTemp);
    }

    // console.log("supriseList新衣节增加之后", supriseList);
    //处理完成任务 --包含未登录的
    // if (isLoginSucess) {
    this.handlingList(biZuoList);
    this.handlingList(eWaiList);
    this.handlingList(tiXianList);
    this.handlingList(jiZanList);
    this.handlingList(supriseList);
    // }



    // var isComplete = false;
    // if (isComplete && (type == 4 || type == 5)) {
    //   taskIcon = completIcon;
    // } else {
    //   taskIcon = signTaskListData[index].icon;
    // }

  },
  //处理完成任务列表并排序
  handlingList: function (dataList) {

    if (undefined != completList && completList.length > 0) {

      var tempCompteList = []; //临时存放已完成的任务列表
      if (completList.length > 0 && dataList.length > 0) {
        for (var j = 0; j < completList.length; j++) {
          for (var i = 0; i < dataList.length; i++) {
            if (completList[j].index_id == dataList[i].index && completList[j].status == 0) { //通过序号确定哪个是已完成的

              dataList[i]["status"] = completList[j].status;
              //保存已完成的任务
              tempCompteList.push(dataList[i]);
              dataList.splice(i, 1);
              i--;
            } else {
              dataList[i]["complete"] = false;
            }

          }
        }
      }

      for (var t_index in tempCompteList) {
        tempCompteList[t_index]["complete"] = true;
      }
      //将临时保存的完成列表和已经删除了完成列表的列表合并
      // dataList = dataList.concat(tempCompteList);
      // console.log("dataList--- ", dataList);
      Array.prototype.push.apply(dataList, tempCompteList);

    }

    //处理浏览任务的图标显示
    for (var rIndex in dataList) {
      if (dataList[rIndex].complete && (dataList[rIndex].task_type == 4 || dataList[rIndex].task_type == 5)) {
        dataList[rIndex]["taskIcon"] = dataList[rIndex].completIcon;
        dataList[rIndex]["taskName"] = "继续" + dataList[rIndex]["taskName"];

      }
    }

    //处理奖励颜色

    for (var rIndex in dataList) {
      if (dataList[rIndex].complete) {
        dataList[rIndex]["jiangliColor"] = "#d5d5d5";
      } else {
        dataList[rIndex]["jiangliColor"] = "#ff3f8b";

      }
    }

  },


  dialog_close_mini: function () {
    this.setData({
      showBrowseMin: false
    });
  },

  //浏览分钟数的--去浏览美衣点击 
  btn_one: function () {
    //测试  开始计时----
    // countdown(this);

    var fenZhongTask;
    if (browseMinCase == -1) { //未开始过任务
      try {
        fenZhongTask = wx.getStorageSync('SIGN-TASK')
      } catch (e) {}
    } else { //已经开始过
      try {
        fenZhongTask = wx.getStorageSync('SIGN-TASK-MM')
      } catch (e) {}
    }

    var mVale = fenZhongTask.value.replace(new RegExp("=", "gm"), "#");
    var mmVale = mVale.replace(new RegExp("&", "gm"), "$");
    // //将任务对象传给下个界面
    var where = fenZhongTask.value.split(",")[0];



    // if (where == "share=myq") {
    //   wx.navigateTo({
    //     url: 'qutfitList/qutfitList?'+
    //     "&task_type=5" 
    //     ,
    //   })
    // } else {
    //   wx.navigateTo({

    //     url: "../../pages/listHome/lookShopListHome/index?" +
    //     "value=" + mmVale +
    //     "&jingliName=" + fenZhongTask.jingliName +
    //     "&shopsName=" + fenZhongTask.shopsName +
    //     "&index=" + fenZhongTask.index +
    //     "&num=" + fenZhongTask.num +
    //     "&task_type=5" +
    //     "&shopsbanner=" + fenZhongTask.shopsbanner
    //   });

    console.log("WHERE:", where);
    this.setData({
      showBrowseMin: false
    });


    //未开始的需要保存
    if (browseMinCase == -1) {

      console.log("保存了过期时间-----------------");
      var NowTime = new Date().getTime(); // 当前时间
      var EndTime = fenZhongTask.value.split(",")[1];
      EndTime = NowTime + (EndTime * 60 * 1000); //确定过期时间

      //保存分钟专用的任务在本地，单独处理
      wx.setStorageSync("SIGN-TASK-MM", fenZhongTask);
      //保存已经开始的分钟数的idex和过期时间
      wx.setStorageSync("MIN_BEGIN_MIN_INDEX", fenZhongTask.index);
      wx.setStorageSync("MIN_BEGIN_MIN_ETime", EndTime);
      console.log("保存了过期时间-----------------", EndTime);

    }



    if (where == "share=myq") { //密友圈
      wx.navigateTo({
        url: 'qutfitList/qutfitList?' +
          "&task_type=5",
      })
    } else if (where == "collection=shop_activity") { //活动商品
      wx.navigateTo({
        url: "signActiveShop/signActiveShop?" +
          "value=" + mmVale +
          "&jingliName=" + fenZhongTask.jingliName +
          "&shopsName=" + fenZhongTask.shopsName +
          "&index=" + fenZhongTask.index +
          "&num=" + fenZhongTask.num +
          "&task_type=5" +
          "&shopsbanner=" + fenZhongTask.shopsbanner
      });
    } else if (where == "collection=collocation_shop") { //搭配
      wx.navigateTo({
        url: "../shouye/collocationList/collocation?" +
          "value=" + mmVale +
          "&jingliName=" + fenZhongTask.jingliName +
          "&shopsName=" + fenZhongTask.shopsName +
          "&index=" + fenZhongTask.index +
          "&num=" + fenZhongTask.num +
          "&task_type=5" +
          "&shopsbanner=" + fenZhongTask.shopsbanner
      });
    } else if (where == "collection=csss_shop") { //专题



      wx.navigateTo({
        url: "specialTask/specialTask"
      })

    } else if (where == "collection=shopping_page") { //购物页
      // wx.navigateTo({
      //   url: "../shouye/collocationList/collocation?" +
      //   "value=" + mmVale +
      //   "&jingliName=" + fillSignData[mIndex].jingliName +
      //   "&shopsName=" + fillSignData[mIndex].shopsName +
      //   "&index=" + fillSignData[mIndex].index +
      //   "&num=" + fillSignData[mIndex].num +
      //   "&task_type=5" +
      //   "&shopsbanner=" + fillSignData[mIndex].shopsbanner
      // });



      wx.navigateTo({
        url: '../shopType/shopTypeSign/shopTypeSign',
      })

    } else {
      wx.navigateTo({
        url: "../../pages/listHome/lookShopListHome/lookshop?" +
          "value=" + mmVale +
          "&jingliName=" + fenZhongTask.jingliName +
          "&shopsName=" + fenZhongTask.shopsName +
          "&index=" + fenZhongTask.index +
          "&num=" + fenZhongTask.num +
          "&task_type=5" +
          "&shopsbanner=" + fenZhongTask.shopsbanner
      });
    }




    // //未开始的需要保存
    // if (browseMinCase == -1) {

    //   console.log("保存了过期时间-----------------");
    //   var NowTime = new Date().getTime();// 当前时间
    //   var EndTime = fenZhongTask.value.split(",")[1];
    //   EndTime = NowTime + (EndTime * 60 * 1000);  //确定过期时间

    //   //保存分钟专用的任务在本地，单独处理
    //   wx.setStorageSync("SIGN-TASK-MM", fenZhongTask);
    //   //保存已经开始的分钟数的idex和过期时间
    //   wx.setStorageSync("MIN_BEGIN_MIN_INDEX", fenZhongTask.index);
    //   wx.setStorageSync("MIN_BEGIN_MIN_ETime", EndTime);
    //   console.log("保存了过期时间-----------------", EndTime);

    // }
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
      url: 'newYiListPage/newYiListPage',
    })
  },

  closeIOSdownload: function () {
    this.setData({
      showIOSdownload: false,
    })
  },
  closeToTX: function () {
    this.setData({
      showIOSdownload: false,
    })
  },

  meiyuetishiClose: function () {
    this.setData({
      meiyueTishiShow: false,
      oldShareTXShow: false
    })
  },
  //每月惊喜任务提示--买买买
  meiyuegotap: function () {
    this.setData({
      meiyueTishiShow: false,
      oldShareTXShow: false
    })

    var txClickTaskList = wx.getStorageSync('SIGN-TASK');
    var lingYuanTask;
    lingYuanTask = wx.getStorageSync('SIGN-TASK')
    var where = lingYuanTask.value.split(",")[0];
    var mVale = lingYuanTask.value.replace(new RegExp("=", "gm"), "#");
    var mmVale = mVale.replace(new RegExp("&", "gm"), "$");
    if (where == "share=myq") { //密友圈
      wx.navigateTo({
        url: 'qutfitList/qutfitList?'
      })
    } else if (where == "collection=shop_activity") { //活动商品
      wx.navigateTo({
        url: "signActiveShop/signActiveShop?" +
          "value=" + mmVale +
          "&jingliName=" + lingYuanTask.jingliName +
          "&shopsName=" + lingYuanTask.shopsName +
          "&index=" + lingYuanTask.index +
          "&num=" + lingYuanTask.num
        // "&shopsbanner=" + lingYuanTask.shopsbanner
      });
    } else if (where == "collection=collocation_shop") { //搭配
      wx.navigateTo({
        url: "../shouye/collocationList/collocation?" +
          "value=" + mmVale +
          "&jingliName=" + lingYuanTask.jingliName +
          "&shopsName=" + lingYuanTask.shopsName +
          "&index=" + lingYuanTask.index +
          "&num=" + lingYuanTask.num +
          "&shopsbanner=" + lingYuanTask.shopsbanner
      });
    } else if (where == "collection=csss_shop") { //专题
      wx.navigateTo({
        url: "specialTask/specialTask"
      })

    } else if (where == "collection=shopping_page") { //购物页

      wx.navigateTo({
        url: '../shopType/shopTypeSign/shopTypeSign',
      })

    } else if (where == "collection=shop_home") { //首页
      wx.switchTab({
        url: '../shouye/shouye',
      });
    } else {
      wx.navigateTo({
        url: "../../pages/listHome/lookShopListHome/lookshop?" +
          "value=" + mmVale +
          "&jingliName=" + lingYuanTask.jingliName +
          "&shopsName=" + lingYuanTask.shopsName +
          "&index=" + lingYuanTask.index +
          "&num=" + lingYuanTask.num +
          "&shopsbanner=" + lingYuanTask.shopsbanner
      });
    }
  },

  //新衣节弹窗活动详情点击
  newYIxiangqingTap: function () {

    this.setData({
      showNewYI: false
    })
    wx.navigateTo({
      url: 'newYiHDXQ/newYiHDXQ',
    })
  },


  catcjtap_zhidingshou: function () {

    // var that = this;

    // that.setData({
    //   showZhiding: false
    // })




    // var signUrl = config.Host + "signIn2_0/signIning" +
    //   "?token=" + token +
    //   "&index_id=" + wx.getStorageSync('SIGN-TASK').index +
    //   "&day=" + wx.getStorageSync("SIGN_DAY") + config.Version;
    // signUrl = util.Md5_httpUrl(signUrl);

    // //分享完成赚钱任务接口
    // wx.request({
    //   url: signUrl,//签到接口
    //   data: {},
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },

    //   complete: function (res) {
    //     // console.log("签到提示信息：" + res.data.message);
    //     // that.showToast("签到提示信息：" , res.data.message, 3000)
    //   },
    //   success: function (res) {
    //     // console.log(res);
    //     if (res.data.status != 1 || res.statusCode != 200) {
    //       return;
    //     }
    //     //刷新数据
    //     that.onShow();
    //     var minTask = wx.getStorageSync('SIGN-TASK');
    //     var showText = minTask.jiangliValue + minTask.jiangliDanWei + minTask.jiangliContent + "奖励已经存入账户，赶紧去买买买吧~";
    //     // var showText = shareXShop_jiangliValue * shareXShop_doNum + shareXShop_jiangliName + "奖励已经存入账户，赶紧去买买买吧~";
    //     wx.showModal({
    //       title: '任务完成!',
    //       content: showText,
    //       confirmColor: "#FF3F8B"
    //     });

    //   }
    // })



  },

  //任务完成左边按钮
  btn_left: function () {
    if (mTask_type == 25 && shareXShopType == 3) { //新分享赢提现 继续分享按钮
      this.setData({
        signFinishShow: false,
      });
      this.tosharexshop();
    } else {
      this.setData({
        signFinishShow: false,
      });
    }
  },
  //任务完成右边按钮
  btn_rigth: function () {
    this.setData({
      signFinishShow: false,
    });
  },
  //任务完成提示关闭按钮
  dialog_close: function () {
    this.setData({
      signFinishShow: false,
    });
  },
  //任务完成仅一个红色按钮
  signfinish_btn_one: function () {
    this.setData({
      signFinishShow: false,
    });

    //购买任务--买买买
    if (wx.getStorageSync('SIGN-TASK').task_type == 6) { //购买任务
      var txClickTaskList = wx.getStorageSync('SIGN-TASK');
      var lingYuanTask;
      lingYuanTask = wx.getStorageSync('SIGN-TASK')
      var where = lingYuanTask.value.split(",")[0];
      var mVale = lingYuanTask.value.replace(new RegExp("=", "gm"), "#");
      var mmVale = mVale.replace(new RegExp("&", "gm"), "$");
      if (where == "share=myq") { //密友圈
        wx.navigateTo({
          url: 'qutfitList/qutfitList?'
        })
      } else if (where == "collection=shop_activity") { //活动商品
        wx.navigateTo({
          url: "signActiveShop/signActiveShop?" +
            "value=" + mmVale +
            "&jingliName=" + lingYuanTask.jingliName +
            "&shopsName=" + lingYuanTask.shopsName +
            "&index=" + lingYuanTask.index +
            "&num=" + lingYuanTask.num
          // "&shopsbanner=" + lingYuanTask.shopsbanner
        });
      } else if (where == "collection=collocation_shop") { //搭配
        wx.navigateTo({
          url: "../shouye/collocationList/collocation?" +
            "value=" + mmVale +
            "&jingliName=" + lingYuanTask.jingliName +
            "&shopsName=" + lingYuanTask.shopsName +
            "&index=" + lingYuanTask.index +
            "&num=" + lingYuanTask.num +
            "&shopsbanner=" + lingYuanTask.shopsbanner
        });
      } else if (where == "collection=csss_shop") { //专题
        wx.navigateTo({
          url: "specialTask/specialTask"
        })

      } else if (where == "collection=shopping_page") { //购物页

        wx.navigateTo({
          url: '../shopType/shopTypeSign/shopTypeSign',
        })

      } else if (where == "collection=shop_home") { //首页
        wx.switchTab({
          url: '../shouye/shouye',
        });
      } else {
        wx.navigateTo({
          url: "../../pages/listHome/lookShopListHome/lookshop?" +
            "value=" + mmVale +
            "&jingliName=" + lingYuanTask.jingliName +
            "&shopsName=" + lingYuanTask.shopsName +
            "&index=" + lingYuanTask.index +
            "&num=" + lingYuanTask.num +
            "&shopsbanner=" + lingYuanTask.shopsbanner
        });
      }
    }
  },

  //任务说明点击
  renwushuomingTap: function () {

    //测试用
    // wx.navigateTo({
    //   // url: "../../pages/listHome/order/oneBuyLuckPan/oneBuyLuckPanIOS"
    //   // url: "../../pages/shouye/fightDetail/fightDetail"
    //   // url: "../../pages/shouye/redHongBao?shouYePage=" + "FourPage"//首页3、4
    //   // url: "RobotShare/RobotShare"
    //   // url:'shareQshop/shareQshop'
    //   url: "../../pages/shouye/advent"
    // });

    // this.setData({

    //   showZhiding: true
    // })

    this.setData({
      showSignSM: true
    })


    // var showText = "抽中的提现额度与" + payPrice + "元购衣款已返现至账户余额，处于冻结状态，交易成功后即可解冻。";
    // wx.showModal({
    //   title: '温馨提示',
    //   content: showText,
    //   showCancel: false,
    //   confirmColor: "#FF3F8B"
    // });

    // var showText = "抽中的提现额度与" + 1 + "元购衣款已返现至账户余额，处于冻结状态，交易成功后即可解冻。";
    // // wx.showModal({
    // //   title: '温馨提示',
    // //   content: showText,
    // //   showCancel: false,
    // //   confirmColor: "#FF3F8B"
    // // });

    // this.setData({
    //   signFinishShow: true,
    //   signFinishDialog: {
    //     top_tilte: "温馨提示",
    //     // tilte: "任务完成~",
    //     contentText: showText,
    //     oneBtnText: "继续做任务",
    //     isOneBtn: true,
    //   },
    // });

  },
  //查看详情点击
  chakanxiangqingTap: function () {
    // wx.navigateTo({
    //   url: 'webViewTest/webViewTest',
    // })


    if (whetherTask == undefined || whetherTask == 0) {
      that.setData({
        showGetVipDialog: true
      })
      return;
    }




    wx.navigateTo({
      url: 'inviteFriends/inviteFriends',
    })
  },

  //关闭分享X件弹窗-提现
  bindTapcCloseShareTX: function () {
    this.setData({
      showSignSM: false,
      zeroBuyDialogShowFlag: false,
      showModalStatusBg: false,
      showOldShareTixian: false,
      showSignHint: false
    })
  },


  //加提现额度的点击
  andTX: function () {
    var that = this;
    if (isLoginSucess) {


      if (whetherTask == undefined || whetherTask == 0) {
        that.setData({
          showGetVipDialog: true
        })
        return;
      }





      wx.navigateTo({
        url: 'withdrawLimit/withdrawLimit',
      })



    } else {
      // util.toAuthorizeWx(function(isSuccess) {
      //   if (isSuccess) {
      //     that.onShow();
      //   }
      // });
    }
  },
  //赚钱提示--去做任务点击
  btnLeftSignhint: function () {

    this.setData({
      showSignHint: false
    })

  },
  //赚钱提示--去0元购衣点击
  btnRigthSignhint: function () {
    var that = this;
    wx.setStorageSync("LINGYUAN-TYPE", -1);
    that.setData({
      showSignHint: false
    })


    this.setData({
      zeroBuyDialogShowFlag: true
    })






    // wx.showModal({
    //   title: '超级0元购',
    //   showCancel: true,
    //   confirmText: "购买美衣",
    //   cancelText: "先看看",
    //   content: '1.购买美衣立即返全部金额入账户余额，还能抽取最高1000元提现红包大奖。\r\n2.1-3个月内每日登录衣蝠并完成全部任务，即可，通过惊喜提现任务及抽奖任务全额提现。相当于在衣蝠买美衣永远白送。\r\n3.如3个月未能全额提现，且用户每日登陆衣蝠并完成全部任务，平台将按首月返10%，次月返20%，第三个月返30%的比例把首单购衣款打入提现额度。48小时内到账！',
    //   success: function (res) {
    //     wx.switchTab({
    //       url: '/pages/shouye/shouye',
    //       success: function (res) { },
    //       fail: function (res) { },
    //       complete: function (res) { },
    //     })
    //   }
    // })


  },

  zeroBuyNowClick: function () { //0元购弹窗上立即购买
    this.setData({
      zeroBuyDialogShowFlag: false
    })


    var txClickTaskList = wx.getStorageSync('SIGN-TASK');
    if (txClickTaskList.task_type == 28 && wx.getStorageSync('LINGYUAN-TYPE') != -1) { //零元购任务点击弹窗

      // // //将任务对象传给下个界面
      // var where = fillSignData[mIndex].value.split(",")[0];
      // if (where == "share=myq") {
      //   wx.navigateTo({
      //     url: 'qutfitList/qutfitList',
      //   })
      // } else {
      //   wx.navigateTo({
      //     url: "../../pages/listHome/lookShopListHome/index?" +
      //     "value=" + mmVale +
      //     "&jingliName=" + txClickTaskList.jingliName +
      //     "&shopsName=" + txClickTaskList.shopsName +
      //     "&index=" + txClickTaskList.index +
      //     "&num=" + txClickTaskList.num +
      //     "&task_type=5" +
      //     "&shopsbanner=" + txClickTaskList.shopsbanner
      //   });
      // }


      var lingYuanTask;
      lingYuanTask = wx.getStorageSync('SIGN-TASK')
      var where = lingYuanTask.value.split(",")[0];



      var mVale = lingYuanTask.value.replace(new RegExp("=", "gm"), "#");
      var mmVale = mVale.replace(new RegExp("&", "gm"), "$");


      if (where == "share=myq") { //密友圈
        wx.navigateTo({
          url: 'qutfitList/qutfitList?'
        })
      } else if (where == "collection=shop_activity") { //活动商品
        wx.navigateTo({
          url: "signActiveShop/signActiveShop?" +
            "value=" + mmVale +
            "&jingliName=" + lingYuanTask.jingliName +
            "&shopsName=" + lingYuanTask.shopsName +
            "&index=" + lingYuanTask.index +
            "&num=" + lingYuanTask.num
          // "&shopsbanner=" + lingYuanTask.shopsbanner
        });
      } else if (where == "collection=collocation_shop") { //搭配
        wx.navigateTo({
          url: "../shouye/collocationList/collocation?" +
            "value=" + mmVale +
            "&jingliName=" + lingYuanTask.jingliName +
            "&shopsName=" + lingYuanTask.shopsName +
            "&index=" + lingYuanTask.index +
            "&num=" + lingYuanTask.num +
            "&shopsbanner=" + lingYuanTask.shopsbanner
        });
      } else if (where == "collection=csss_shop") { //专题
        wx.navigateTo({
          url: "specialTask/specialTask"
        })

      } else if (where == "collection=shopping_page") { //购物页

        wx.navigateTo({
          url: '../shopType/shopTypeSign/shopTypeSign',
        })

      } else if (where == "collection=shop_home") { //首页
        wx.switchTab({
          url: '../shouye/shouye',
        });
      } else { //热卖

        wx.navigateTo({
          url: "../../pages/listHome/lookShopListHome/lookshop?" +
            "value=" + mmVale +
            "&jingliName=" + lingYuanTask.jingliName +
            "&shopsName=" + "热卖" +
            "&index=" + lingYuanTask.index +
            "&num=" + lingYuanTask.num
          // "&shopsbanner=" + lingYuanTask.shopsbanner
        });
      }



    } else { //其他地方的跳转首页（APP是专题列表）
      wx.switchTab({
        url: '/pages/shouye/shouye',
        success: function (res) {},
        fail: function (res) {},
        complete: function (res) {},
      })

    }
  },
  zeroBuyCloseClick: function () {
    this.setData({
      zeroBuyDialogShowFlag: false
    })
  },


  bindtap_yue: function () { //余额、可提现点击

    wx.navigateTo({
      url: '../../pages/mine/wallet/wallet',
    })

  },

  bindtap_tixianzhong: function () { //提现中
    wx.navigateTo({
      url: '../mine/wallet/accountDetail/accountDetail?activityIndex=1',

    })
  },

  yifu_open: function () { //APP引导打开点击

    // if (app.globalData.systemInfo == "ios") {
    this.setData({
      // openYifuDialogShow: true
      showIOSdownload: true
    })
    // } else {
    //   wx.navigateTo({
    //     url: "../mine/downloadapp/downloadapp"
    //   });
    // }

  },


  open_yifu_iknow: function () { //APP引导知道了点击
    this.setData({
      openYifuDialogShow: false
    })
  },


  //获取用户已完成任务列表
  getCompleteList: function () {
    var that = this;

    var dataUrl = config.Host + "signIn2_0/userTaskList" +
      "?token=" + token +
      "&" + config.Version;


    util.httpNeedLogin(dataUrl,
      //返回正常数据
      function (res) {
        if (res.status == 1) {
          //保存签到的day
          try {
            wx.setStorageSync('SIGN_DAY', res.day);
          } catch (e) {}

          //清除之前的数据
          biZuoList = [];
          eWaiList = [];
          tiXianList = [];
          jiZanList = [];
          supriseList = [];
          monthList = [];
          isOldShareTX = false;


          completList = res.taskList;


          that.getUserData(); //获取用户信息


        } else {
          that.showToast(res.message, 1500)

        }

      },
      //重新登录刷数据
      function () {
        that.onShow();

      }
    )
  },
  // getDakaStatus: function () { //查询是否已打卡
  //   var that = this;
  //   var dataUrl = config.Host + "clockIn/clockInTodayByUserId?" + config.Version + "&token=" + token;
  //   util.http(dataUrl, function (data) {
  //     if (data.data == 1) {
  //       nowDayisDaka = true
  //     }
  //     that.getUserData(); //获取用户信息

  //   });

  // },



  upperlimittap: function () { //老分享赢提现完成任务提示上的继续按钮
    this.setData({
      oldShareTXShow: false
    })
  },

  //-------------------------自动登录-------------------------//
  //自动登录
  globalLogin: function () {
    var that = this;
    util.autoLogin(loginCount, function (loginfailYiFuShow, login_discribution, login_buttontitle, newloginCount) {
      loginCount = newloginCount;
      if (loginCount == 1) //登录成功
      {
        that.onShow();
      } else if (app.globalData.user == null && app.globalData.channel_type == 1) {
        that.showToast('不符合条件', 2000);
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

  //-----------------------------------------------分享相关--------------------------------------------------------------------------


  // 分享X件商品 分享X搭配 新分享赢提现--老分享赢提现
  tosharexshop: function () {
    // sharType = 2;
    var that = this;
    var randomImg;

    that.setData({
      //新分享赢提现和分享X件 界面文案不同 区分
      shareXShopType_data: shareXShopType
    });
    forcelookLimitNum = 0; //如果用户重新点了老分享赢提现的任务，之前的分享数就清零

    // var txClickTaskList;
    try {
      txClickTaskList = wx.getStorageSync('SIGN-TASK')
    } catch (e) {}

    //确定老分享赢提现的计数
    /**
     * 
     * //老分享赢提现相关
var branchCount = 0;//获得到1元提现的次数
var forcelookLimitNum = 0;//已经分享数
var shareCount = 10;//分享图标上显示的次数
var shareTotalCount = 10;//分享上限(分享总数)
var doNeedCount = "-1"; // 点击时拿到当前任务的status ，------当前任务需要做的剩余次数
// -------------------------------------------------------------
       
     */
    if (shareXShopType == 4) {
      this.setData({
        showOldShareTixian: true,
      });

      try {
        doNeedCount = txClickTaskList.status;
        singvalue = Number(txClickTaskList.value.split(",")[1]);
      } catch (e) {}
      flagMax = singvalue;
      // console.log("singvalue", singvalue);


      if (doNeedCount == undefined) { //没有做过
        shareTotalCount = txClickTaskList.num * singvalue;
      } else { //之前已经做过
        shareTotalCount = doNeedCount * singvalue;
      }

      // console.log("shareTotalCount", shareTotalCount);
      shareCount = singvalue - (forcelookLimitNum % singvalue);



      balance = txClickTaskList.jiangliValue * txClickTaskList.num;

      this.setData({
        shareCount: shareCount,
        branchCount: branchCount,
        tXshareEcount: txClickTaskList.value.split(",")[1],
        tXshareEmoney: txClickTaskList.jiangliValue,
        tXnum: txClickTaskList.num


      })
    } else {
      // wx.removeStorageSync(shareXShop_signIndext + "shareXShopNum");



      randomImg = Math.floor(Math.random() * 5 + 1);
      this.setData({
        showModalStatusBg: true,
        showModalStatus: true,
        share_x_shop_swiper_img: config.Upyun + "small-iconImages/share_x_shop_img" + randomImg + ".jpg"
      });

    }

    var shareTo = "";
    shareTo = shareXShop_doValue.split(",")[0].split("=")[1];

    if (shareXShopType == 1 || shareXShopType == 3 || shareXShopType == 4) { //正价商品 或者 新分享赢提现 或老分享赢提现
      // console.log("shareTo", shareTo);


      // shareTo = "h5money";

      if (shareTo == "h5money") { //赚钱页


        // var randomImg = Math.floor(Math.random() * 3 + 1);

        // //设置分享的文案
        // that.setData({
        //   // shareTitle: jsonTextData.h5money.title,

        //   shareTitle: "我刚领的红包也分你一个，帮我提现就能拿钱哦~",

        //   // sharePath: "/pages/sign/sign?isShareFlag=true&user_id=" + user_id,
        //   // sharePath: "/pages/sign/sign?isShareFlag=true&goto=sign&user_id=" + user_id,

        //   sharePath: '/pages/shouye/shouye?' + "isShareFlag=true" + "&user_id=" + user_id + "&headpic=" + app.globalData.user.pic,

        //   // shareImageUrl: config.Upyun + jsonTextData.h5money.icon

        //   // shareImageUrl: config.Upyun + "small-iconImages/qingfengpic/sign_money_" + randomImg + ".png"
        //   shareImageUrl: config.Upyun + "small-iconImages/heboImg/shareBigImage_new.jpg"

        // });
        wx.showLoading({
          title: '请稍后',
          mask: true,
        })
        util.httpUpyunJson(function (data) {

          var shareTitle = data.wxcx_share_links.title ? data.wxcx_share_links.title : "我刚领的红包也分你一个，帮我提现就能拿钱哦~";
          var share_pic = config.Upyun + (data.wxcx_share_links.icon ? (data.wxcx_share_links.icon + '?' + Math.random()) : "/small-iconImages/heboImg/shareBigImage_new.jpg");
          var path = '';
          if (app.globalData.user != null && app.globalData.user.user_id != undefined) {
            path = '/pages/shouye/shouye?' + "isShareFlag=true" + "&user_id=" + app.globalData.user.user_id;
          } else {
            path = '/pages/shouye/shouye?' + "isShareFlag=true";
          }
          //设置分享的文案
          that.setData({
            shareTitle: shareTitle,
            shareImageUrl: share_pic,
            sharePath: path,

          });
          wx.hideLoading()
        })




      } else if (shareTo == "indiana") { //夺宝
        this.getDuobaoShare();
      } else {
        wx.showLoading({
          title: '请稍后',
          mask: true,
        })
        var dataUrl = config.Host + "shop/shareShop" +
          // "?token=" + token +
          "?getShop=" + "true" +
          "&" + shareXShop_doValue.split(",")[0] + config.Version;

        //转码
        dataUrl = encodeURI(dataUrl);
        var tongji_url = "default";
        var tongji_parameter = "default"
        var mUrl = dataUrl;

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

        dataUrl = util.Md5_httpUrl(dataUrl);


        wx.request({
          url: dataUrl,
          data: {},
          header: {
            'content-type': 'application/json' // 默认值
          },

          success: function (res) {
            // 来自页面内转发按钮
            // console.log(res.target)
            app.mtj.trackEvent('i_f_error_count', {
              i_f_name: tongji_url,
              // i_f_from: "10",
            });

            console.log("sharedataUrl", dataUrl);
            console.log("res.data----:", res.data);
            var shop_code = res.data.shop.shop_code;
            var shop_pic = res.data.shop.four_pic.split(",")[2];

            var shop_rebate = res.data.shop.shop_rebate; //折扣

            // var share_pic = config.Upyun + shop_code.substring(1, 4) + "/" + shop_code + "/" + shop_pic;


            //分享图的拼接
            var def_pic = res.data.shop.def_pic;
            if (res.data.shop.four_pic) {
              var str = res.data.shop.four_pic.split(",");
              if (str.length > 2) {
                def_pic = str[2];
              }
            }
            var shop_code_cut = '';
            shop_code_cut = shop_code.substring(1, 4);
            var share_pic = that.data.Upyun + shop_code_cut + '/' + shop_code + '/' + def_pic



            var supp_label = res.data.shop.supp_label;
            var shop_se_price = res.data.shop.shop_se_price;
            shareOneOnePrice = res.data.shop.assmble_price != undefined ? res.data.shop.assmble_price: res.data.shop.wxcx_shop_group_price;
            // shop_se_price = shop_se_price * shop_rebate;
            // shop_se_price = Number(shop_se_price).toFixed(0);

            //设置正价商品分享图片和页面路径
            that.setData({
              sharePath: "/pages/mine/toexamine_test/toexamine_test?shop_code=" + shop_code + "&isShareFlag=true&user_id=" + user_id +
                "&isSign=false" + '&shareFrom=signPage',
              shareImageUrl: share_pic
            });

            that.getCanvasPictiure(share_pic, shareOneOnePrice, res.data.shop.shop_name, shop_se_price, shop_code);
            // that.geType2SuppLabe(supp_label, shop_se_price, shop_code);
          },
          fail: function (error) {
            app.mtj.trackEvent('i_f_error_count', {
              i_f_name: tongji_url,
              // i_f_from: "10",
            });
          }
        })
      }
    } else if (shareXShopType == 2) { //搭配商品
      var dataUrl = config.Host + "collocationShop/getLink" +
        "?token=" + token + config.Version;

      var tongji_url = "default";
      var tongji_parameter = "default"
      var mUrl = dataUrl;

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


      dataUrl = util.Md5_httpUrl(dataUrl);

      wx.request({

        // url: config.Host + "collocationShop/getLink?realm=943405&version=V1.31&channel=8&appVersion=V3.6.0",
        url: dataUrl,

        data: {},
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {

          app.mtj.trackEvent('i_f_success_count', {
            i_f_name: tongji_url,
          });

          var collocation_code = res.data.code; //先获取搭配编号
          that.getCollocationShop(collocation_code);
        },
        fail: function (error) {
          app.mtj.trackEvent('i_f_error_count', {
            i_f_name: tongji_url,
            // i_f_from: "10",
          });
        }
      })
    }
  },

  //生成分享的合成图片
  getCanvasPictiure: function (share_pic, price, shop_name, shop_se_price, shop_code) {
    var that = this;
    wx.showLoading({
      title: '请稍后',
      mask: true,
    });
    util.getCanvasPictiure("shareCanvas", share_pic, price, '商品分享', function (tempFilePath) {

      wx.hideLoading()
      if (tempFilePath != undefined && tempFilePath != null) {
        that.setData({
          shareImageUrl: tempFilePath
        })
      } else {
        that.setData({
          shareImageUrl: share_pic
        })
      }

      that.geType2SuppLabe(shop_name, shop_se_price, shop_code);
    })
  },

  //获取要分享的搭配商品
  getCollocationShop: function (collocation_code) {
    var that = this;
    var dataUrl = config.Host + "collocationShop/query" +
      "?code=" + collocation_code +
      "&token=" + token + config.Version;
    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = dataUrl;

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

    dataUrl = util.Md5_httpUrl(dataUrl);

    wx.request({
      // url: config.Host + "collocationShop/query?version=V1.31&code=" + collocation_code + "&token=HV9PUQCK4YADN34MQ05S&channel=8&appVersion=V3.6.0",
      url: dataUrl,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
          app.mtj.trackEvent('i_f_success_count', {
            i_f_name: tongji_url,
          });
          // 来自页面内转发按钮
          // console.log(res.target)
          var shop_code = res.data.shop.collocation_shop[0].shop_code; //第一件商品商品编号
          // console.log(shop_code);
          var share_pic = config.Upyun + res.data.shop.collocation_pic; //搭配商品主图
          // var supp_label = res.data.shop.supp_label;
          var shop_se_price = res.data.shop.collocation_shop[0].shop_se_price; //第一件商品商品价格

          // var shop_rebate = res.data.shop.shop_rebate; //折扣

          // shop_se_price = shop_se_price * shop_rebate;


          //设置搭配分享图片和页面路径
          that.setData({
            sharePath: "/pages/shouye/detail/collocationDetail/collocationDetail?code=" + collocation_code + "&isShareFlag=true&user_id=" + user_id,

            shareImageUrl: share_pic
          });
          that.geType2SuppLabe("", shop_se_price, shop_code);
        }

        ,
      fail: function (error) {
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })
  },

  //获取二级类目
  geType2SuppLabe: function (supp_label, shop_se_price, shop_code) {
    var that = this;
    var dataUrl = config.Host + "shop/queryShopType2" +
      "?token=" + token +
      "&shop_code=" + shop_code + config.Version;
    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = dataUrl;

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
    dataUrl = util.Md5_httpUrl(dataUrl);

    wx.request({
      url: dataUrl,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        app.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
        // 来自页面内转发按钮
        // console.log(res.target)
        if (typeof (supp_label) == 'undefined' || supp_label == "null" || !supp_label) {
          var supp_label_id = res.data.supp_label_id;
        }

        if (typeof (supp_label) == 'undefined' || supp_label == "null" || !supp_label) {
          supp_label = "衣蝠";
        }
        var type2 = res.data.type2;
        if (!type2) {
          type2 = "美衣";
        }

        // var str1 = jsonTextData.wxdddfx.title.replace('\$\{replace\}', supp_label);
        // var str2 = str1.replace('\$\{replace\}', type2);
        // var str3 = str2.replace('\$\{replace\}', '' + shop_se_price);
        // var str4 = str3.replace('\$\{replace\}', '' + shop_se_price);

        //何波修改2018-5-3
        // var shareJson = '快来' + shareOneOnePrice + '元拼' + '【' + supp_label + '正品' + type2 + '】,' + '专柜价' + shop_se_price + '元!';
        var shareTitle = '点击购买👆' + '【' + supp_label + '】' + "今日特价" + shareOneOnePrice + "元！";
        //设置分享的文案
        that.setData({
          // shareTitle: supp_label + "品牌" + type2 + "仅售" + shop_se_price + "元，次月返" + shop_se_price + "元,等于0元",
          // shareTitle: str4,

          shareTitle: shareTitle
        });

        wx.hideLoading()

      },
      fail: function (error) {
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    });
  },

  getDuobaoShare: function () {
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    var that = this;
    var dataUrl = config.Host + "shop/getIndianaLink" +
      "?token=" + token + config.Version;

    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = dataUrl;

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
    dataUrl = util.Md5_httpUrl(dataUrl);

    wx.request({
      url: dataUrl,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        app.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
        var shop_code = res.data.shop.shop_code;
        var shop_pic = res.data.shop.def_pic;
        var share_pic = config.Upyun + shop_code.substring(1, 4) + "/" + shop_code + "/" + shop_pic;


        var title = jsonTextData.indiana_yf.title;
        title = title.replace("\$\{replace\}", res.data.shop.shop_name);


        //设置分享的文案
        that.setData({
          shareTitle: title,
          sharePath: "/pages/shouye/detail/centsIndianaDetail/centsDetail?shop_code=" + shop_code +
            "&isShareFlag=true&user_id=" + user_id,
          shareImageUrl: share_pic
        });

        wx.hideLoading()

      },
      fail: function (error) {
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }

    });
  },





  bindTapcCloseShare: function () {
    this.setData({
      showModalStatusBg: false,
      showModalStatus: false
    })


  },
  //分享赢提现按钮上面的去提现点击
  goTX: function () {
    // this.showToast("提现功能暂未开放~", 1500)

    wx.navigateTo({
      // url: '../../mine/wallet/wallet'
      url: '../mine/wallet/Withdrawals/Withdrawals'
    });
  },


  // bindTapSharexshop: function () {
  //   console.log("bindTapSharexshop");

  // },

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
        url: '/pages/mine/Complaint/Complaint?path=/sign/sign',
      })
    }
  },

  //投诉分享
  complain_shareTap: function () {
    this.setData({
      hideModal: true
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

  onShareAppMessage: function (res) {

    // if (shareXShopType == 4) {
    //   this.setData({
    //     showModalStatusBg: true,
    //     showOldShareTixian: true

    //   });
    // } else {
    //   this.setData({
    //     showModalStatusBg: false,
    //     showModalStatus: false,

    //   });
    // }


 
    var that = this;

    if (wx.getStorageSync("SIGN-TASK").task_type == 32) {
      this.data.shareTitle = "👇点击领取您的90元任务奖金！"
      if (app.globalData.user) {
        this.data.sharePath = "/pages/mine/toexamine_test/toexamine_test?isShareFlag=true&user_id=" + app.globalData.user.user_id + "&showSignPage=true";
      } else {
        this.data.sharePath = "/pages/mine/toexamine_test/toexamine_test?isShareFlag=true&showSignPage=true";

      }
      this.data.sharePath = this.data.sharePath + '&shareFrom=signPage'
      this.data.shareImageUrl = config.Upyun + "small-iconImages/heboImg/taskraward_shareImg.png"
    }

    if (res.from === 'button') {
      return {




        title: this.data.shareTitle,
        path: this.data.sharePath,
        imageUrl: this.data.shareImageUrl,
        success: function (res) {




        },
        fail: function (res) {
          // 转发失败
        }
      };

    } else {
      // 来自右上角转发按钮
      return {
        title: '',
        path: '/pages/sign/sign',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }

  },

  //老分想赢提现分享成功后的处理
  oldGetTXcomplete: function () {

    var that = this;



    console.log("每次调接口需要的分享次数：", singvalue);
    console.log("需要再分享", singvalue - ((forcelookLimitNum + 1) % singvalue));




    if (forcelookLimitNum % singvalue + 1 < singvalue) { //1-9次---无须调签到接口

      var needShareCount = singvalue - (forcelookLimitNum % singvalue + 1);


      // var showText = "再分享" + needShareCount + "次即可赢得" + txClickTaskList.jiangliValue + "元提现额度,继续努力~";



      var showText = "分享成功，再分享" + needShareCount + "次即可得提现现金";
      // var showText = "分享成功，再分享" + shareTotalCount  + "次即可得提现现金";





      this.showToast(showText, 3000);

      forcelookLimitNum = forcelookLimitNum + 1;

      console.log("已分享次数：", forcelookLimitNum);


      shareCount = shareCount - 1;

      if (shareCount <= 0) { //分享数
        shareCount = flagMax; //每分享成功一次，shareCount减1
      }
      //更新图标上的数量
      this.setData({
        shareCount: shareCount,
      })
    } else { //第10次了，可以调用签到接口
      console.log("第10次了");

      that.signSharTX();

    }
  },

  signSharTX: function () {
    var that = this;

    console.log("开始调用老分享赢提现签到接口")





    var signUrl = config.Host + "signIn2_0/signIning" +
      "?token=" + token +
      "&share=" + "true" +
      "&index_id=" + txClickTaskList.index +
      "&day=" + wx.getStorageSync("SIGN_DAY") + config.Version;
    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = signUrl;

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
    signUrl = util.Md5_httpUrl(signUrl);


    //分享完成赚钱任务接口
    wx.request({
      url: signUrl, //签到接口
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },


      complete: function (res) {
        console.log("签到提示信息：" + res.data.message);
        // that.showToast("签到提示信息：" , res.data.message, 3000)

      },


      success: function (res) {
        app.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });

        // console.log(res);
        if (res.data.status != 1 || res.statusCode != 200) {
          that.showToast(res.data.message, 4000);

          return;
        }
        forcelookLimitNum = forcelookLimitNum + 1;
        if (forcelookLimitNum < shareTotalCount) {




          // var showText = txClickTaskList.jiangliValue + "元提现额度已经存入您的余额，再分享" + singvalue + "次可再赢得" + txClickTaskList.jiangliValue + "元提现额度，继续努力~";




          var showText = "分享成功，再分享" + singvalue + "次即可得提现现金";
          // var showText = "分享成功，再分享" + shareTotalCount  + "次即可得提现现金";



          that.showToast(showText, 3000)
          //图标上分享数重置
          shareCount = singvalue;
          //提现数加1
          branchCount++;



          if (doNeedCount == branchCount) {
            that.setData({
              showModalStatusBg: false,
              showOldShareTixian: false
            });
          }
          //更新图标上的数量
          that.setData({
            shareCount: shareCount,
            branchCount: branchCount
          })
        } else { //已经拿到全部奖励 ----关掉分享弹窗






          that.setData({
            showModalStatusBg: false,
            showOldShareTixian: false
          });

          // that.setData({
          //   oldShareTXShow: true,
          //   balance: balance
          // });

          if (res.data.clock_in_status == 1 && app.signData.current_date == "newbie01") { //新用户第一天打卡成功
            that.setData({
              showFrirstDayCopleteDialog: true
            })
          } else {
            that.setData({
              uppertittle: "温馨提示",
              upperdistribution: "今日分享次数已达上限，有新朋友点击分享链接后，你即可得提现现金奖励，" + balance + "元封顶。",
              upperbuttontitle: "继续做任务",
              oldShareTXShow: true,
            });
          }



          //清除之前的数据
          biZuoList = [];
          eWaiList = [];
          tiXianList = [];
          jiZanList = [];
          supriseList = [];
          monthList = [];
          isOldShareTX = false;

          that.onShow();
        }
      },
      fail: function (error) {
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })
  },
  //计数分享件数 并调用赚钱任务接口
  signShareXShop: function (shareNum) {

    var that = this;


    //shareNum-- 每次签到需要分享的次数
    //shareXShop_doNum----需要签到的次数
    //num--分享成功的次数
    //shareSignSucCount 签到成功的次数

    if (shareXShop_complete) {
      return;
    }
    var num = 0;
    var shareSignSucCount = 0;


    var shareXShopNumKey = shareXShop_signIndext + "shareXShopNum";
    num = wx.getStorageSync(shareXShopNumKey); //取出之前分享的次数

    var shareXShopSignCountKey = shareXShop_signIndext + "shareSignSucCount";
    shareSignSucCount = wx.getStorageSync(shareXShopSignCountKey); //取出之前签到的次数

    //不是同一天就直接return
    var dataString = new Date().toDateString();
    if (!num || wx.getStorageSync("share_now_time") !== dataString) {
      num = 0;
    }

    if (!shareSignSucCount || wx.getStorageSync("share_now_time") !== dataString) {
      shareSignSucCount = 0;
    }


    num++;
    wx.setStorageSync("share_now_time", dataString);

    if (num < shareNum) { // 小于要求的分享次数
      // if (shareXShop_doNum > 1) {
      var showText = "再分享" + (shareNum - num) + "件可完成任务喔~";
      // console.log(showText);
      this.showToast(showText, 4000);
      wx.setStorageSync(shareXShopNumKey, num); //保存分享次数
      that.onShow();
      return;
      // }
    }

    //未登录的模拟签到--修改完成列表并刷新
    if (!isLoginSucess) {

      var completeTask = {};
      completeTask.index_id = shareXShop_signIndext;
      completeTask.status = 0;
      completList.push(completeTask);
      wx.setStorageSync("unLoginCompelteList", completList);

      unLoginJiangli += shareXShop_jiangliValue;

      wx.setStorageSync("unLoginJiangli", unLoginJiangli);


      //清除之前的数据
      biZuoList = [];
      eWaiList = [];
      tiXianList = [];
      jiZanList = [];
      supriseList = [];
      monthList = [];
      isOldShareTX = false;

      that.onShow();

      var showText = "任意好友点击后，任务奖励即到账。";
      that.setData({
        signFinishShow: true,
        signFinishDialog: {
          top_tilte: "任务完成!",
          tilte: "分享成功~",
          contentText: showText,
          oneBtnText: "继续做任务",
          isOneBtn: true,
        },
      });


      return
    }


    var signUrl = config.Host + "signIn2_0/signIning" +
      "?token=" + token +
      "&share=" + "true" +
      "&index_id=" + shareXShop_signIndext +
      "&day=" + wx.getStorageSync("SIGN_DAY") + config.Version;
    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = signUrl;

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

    signUrl = util.Md5_httpUrl(signUrl);


    //分享完成赚钱任务接口
    wx.request({
      url: signUrl, //签到接口
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },


      complete: function (res) {
        console.log("签到提示信息：" + res.data.message);
      },

      success: function (res) {
          app.mtj.trackEvent('i_f_success_count', {
            i_f_name: tongji_url,
          });

          // console.log(res);
          if (res.data.status != 1 || res.statusCode != 200) {
            that.showToast(res.data.message, 4000);

            return;
          }

          shareSignSucCount++;
          if (shareXShop_doNum > shareSignSucCount) { //需要签多次

            var showText = "分享成功奖励" +
              shareXShop_jiangliValue + shareXShop_jiangliName + "，还有" + (shareXShop_doNum - shareSignSucCount) + "次机会喔~";
            that.showToast(showText, 4000);

            var shareXShopNumKey = shareXShop_signIndext + "shareXShopNum";
            //重置分享的次数num
            wx.setStorageSync(shareXShopNumKey, 0)

            var shareXShopSignCountKey = shareXShop_signIndext + "shareSignSucCount";
            wx.setStorageSync(shareXShopSignCountKey, shareSignSucCount)

            that.onShow();
          } else { //完成任务


            // }




            //   if (num < shareNum) {
            //     var showText = "分享成功奖励" +
            //       shareXShop_jiangliValue + shareXShop_jiangliName + "，还有" + (shareNum - num) + "次机会喔~";
            //       that.showToast(showText, 4000);



            //     var shareXShopNumKey = shareXShop_signIndext + "shareXShopNum";

            //     wx.setStorageSync(shareXShopNumKey, 0)
            //     that.onShow();


            //   } else if (num >= shareNum) 


            // { //任务完成
            shareXShop_complete = true;

            //清除之前的数据
            biZuoList = [];
            eWaiList = [];
            tiXianList = [];
            jiZanList = [];
            supriseList = [];
            monthList = [];
            isOldShareTX = false;

            var shareXShopNumKey = shareXShop_signIndext + "shareXShopNum";
            wx.setStorageSync(shareXShopNumKey, 0)


            var shareXShopSignCountKey = shareXShop_signIndext + "shareSignSucCount";
            wx.setStorageSync(shareXShopSignCountKey, 0)

            that.onShow();

            // var showText = shareXShop_jiangliValue * shareXShop_doNum + shareXShop_jiangliName + "奖励已经存入账户，赶紧去买买买吧~";

            // wx.showModal({
            //   title: '任务完成!',
            //   content: showText,
            //   confirmColor: "#FF3F8B",
            //   confirmText: "做任务"
            // });

            var showText = "任意好友点击后，任务奖励即到账。";

            // that.setData({
            //   signFinishShow: true,
            //   signFinishDialog: {
            //     top_tilte: "任务完成！",
            //     tilte: "分享成功~",
            //     contentText: showText,
            //     leftText: "确定",
            //     rigthText: "继续做任务"
            //   },
            // });

            if (res.data.clock_in_status == 1 && app.signData.current_date == "newbie01") { //新用户第一天打卡成功
              that.setData({
                showFrirstDayCopleteDialog: true
              })
            } else {
              that.setData({
                signFinishShow: true,
                signFinishDialog: {
                  top_tilte: "任务完成!",
                  tilte: "分享成功~",
                  contentText: showText,
                  oneBtnText: "继续做任务",
                  isOneBtn: true,
                },
              });
            }
            // wx.removeStorageSync(shareXShopNumKey);
          }
        }


        ,
      fail: function (error) {
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }

    })
  },

  // testNotificationFromItem1Fn: function (info) {
  //   var that = this;
  //   if (info == "loginsuccess") {
  //     //刷新数据
  //     that.onShow();
  //   } else {

  //   }
  // },


  scrolltolower1: function () { //两行泡泡的监听
    var temp1 = this.data.mListData1;
    Array.prototype.push.apply(temp1, dataListTemp1);
    this.setData({
      mListData1: temp1
    });
  },
})


//onShow分钟的处理
function initOnshowFZtask(that) {
  console.log("111111111111111111111");


  //取出过期时间
  var ETime = -1;
  try {
    ETime = wx.getStorageSync("MIN_BEGIN_MIN_ETime")
  } catch (e) {}

  console.log("MIN_BEGIN_MIN_ETime", ETime);
  if (ETime == -1 || ETime == undefined || ETime == "") { //没有开始过分钟任务
    console.log("333333333333333333");

  } else



  {
    //两种情况---1：过期时间已到（调签到接口）；2过期时间未到（开始计时，计时完成调用签到接口）
    var NowTime = new Date().getTime(); // 当前时间
    var suTime = NowTime - ETime;
    if (suTime >= 0) { //1


      //调用签到接口
      if (!isMiniSigning) {
        fzSigning(that);
      }

    } else { //2---计时，并且时间到了后调用签到接口

      console.log("22222222222222222222222");

      total_micro_second = wx.getStorageSync("MIN_BEGIN_MIN_ETime") - new Date().getTime();
      var cued = wx.getStorageSync("countdownUseED");
      if (!cued || cued == "" || cued == undefined) {
        browseMinCase = 1;
        countdown(that, false);
        //为了保证1个分钟数任务只能调用countdown一次，保存值到本地
        wx.setStorageSync("countdownUseED", true);
        // console.log("countdown被调用了111111111111111111111111111111111")

      }
    }

  }
}


function countdown(that, isReLoad) {

  if ("" == wx.getStorageSync("MIN_BEGIN_MIN_ETime")) {
    return;
  }

  // if (total_micro_second < 0) {
  //   return;
  // }

  /**
   * browseMinCase：
   * 浏览分钟倒计时的四种情况：
   *    没有开始分钟任务：-1;  --这里不存在这种情况
   *    刚进来（回来）OnShow：1;
   *    点击的是自己已经开始的任务：2;
   *    点击的是其他的分钟数：3
   */


  // 总秒数
  second = Math.floor(total_micro_second / 1000);
  // 天数
  day = Math.floor(second / 3600 / 24);
  // 小时
  hr = Math.floor(second / 3600 % 24);
  // 分钟
  min = Math.floor(second / 60 % 60);
  // 秒
  sec = Math.floor(second % 60);

  if (!isReLoad) {
    console.log('剩余时间：' + total_micro_second);
    console.log("剩余分：", min);
    console.log("剩余秒：", sec);
  } else {
    console.log('isReLoad剩余时间：' + total_micro_second);
    console.log("isReLoad剩余分：", min);
    console.log("isReLoad剩余秒：", sec);
  }


  //处理两种弹窗 ：点击的是自己已经开始的任务---点击的是其他的分钟数
  that.setData({ //未结束
    // showBrowseMin: true,
    browseMinCase: browseMinCase,
    show2bt: false,
    minCount: wx.getStorageSync('SIGN-TASK-MM').value.split(",")[1], //浏览分钟数---测试用
    // top_tilte: "任务提示",
    browseName: wx.getStorageSync('SIGN-TASK-MM').shopsName,
    mm: min < 10 ? "0" + min : min, //分
    ss: sec < 10 ? "0" + sec : sec, //秒
  })

  setTimeout(function () {


    if (!isReLoad) {
      total_micro_second -= 1000;
    }
    if (total_micro_second < 0) {
      that.setData({ //时间到
        showBrowseMin: false, //是否弹出浏览分钟提示
      });
      //调用签到接口完成任务------------
      if (!isReLoad) {
        if (!isMiniSigning) {
          fzSigning(that);
        }
      }
    } else {
      countdown(that, isReLoad);
    }
  }, 1000)
}


//分钟签到
function fzSigning(that) {

  that.setData({
    showBrowseMin: false
  });

  console.log("分钟签到接口被调用了111111111111")

  //清清除之前保存的相关分钟的数据
  // wx.setStorageSync("SIGN-TASK-MM", "");
  // wx.setStorageSync("MIN_BEGIN_MIN_INDEX", "");
  // wx.setStorageSync("MIN_BEGIN_MIN_ETime", "");
  // wx.setStorageSync("countdownUseED", false)





  //未登录的模拟签到--修改完成列表并刷新
  if (!isLoginSucess) {
    var minTask = wx.getStorageSync('SIGN-TASK-MM')

    var completeTsk = {};
    completeTsk.index_id = wx.getStorageSync("MIN_BEGIN_MIN_INDEX");
    completeTsk.status = 0;
    completList.push(completeTsk);

    wx.setStorageSync("unLoginCompelteList", completList);

    unLoginJiangli += minTask.jiangliValue;

    wx.setStorageSync("unLoginJiangli", unLoginJiangli);

    //清除之前的数据
    isMiniSigning = false;


    //清除之前的数据
    biZuoList = [];
    eWaiList = [];
    tiXianList = [];
    jiZanList = [];
    supriseList = [];
    monthList = [];
    isOldShareTX = false;



    // var showText = minTask.jiangliValue + minTask.jiangliDanWei + minTask.jiangliContent + "奖励已经存入账户，赶紧去买买买吧~";

    var showText = "恭喜您完成本任务。" + minTask.jiangliValue + "元奖金已经存入账户，完成所有任务可提现哦。";




    //清清除之前保存的相关分钟的数据
    wx.setStorageSync("SIGN-TASK-MM", "");
    wx.setStorageSync("MIN_BEGIN_MIN_INDEX", "");
    wx.setStorageSync("MIN_BEGIN_MIN_ETime", "");
    wx.setStorageSync("countdownUseED", false)

    that.setData({
      signFinishShow: true,
      signFinishDialog: {
        top_tilte: "任务完成!",
        tilte: "任务完成~",
        contentText: showText,
        oneBtnText: "继续做任务",
        isOneBtn: true,
      },
    });

    //刷新数据
    that.onShow();

    return
  }


  var signUrl = config.Host + "signIn2_0/signIning" +
    "?token=" + token +
    "&share=" + "false" +
    "&index_id=" + wx.getStorageSync("MIN_BEGIN_MIN_INDEX") +
    "&day=" + wx.getStorageSync("SIGN_DAY") + config.Version;
  var tongji_url = "default";
  var tongji_parameter = "default"
  var mUrl = signUrl;

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
  signUrl = util.Md5_httpUrl(signUrl);

  isMiniSigning = true;
  //分享完成赚钱任务接口
  wx.request({
    url: signUrl, //签到接口
    data: {},
    header: {
      'content-type': 'application/json' // 默认值
    },

    complete: function (res) {
      console.log("签到接口调用-完成，信息：", res.data);
      isMiniSigning = false;


      //清除之前的数据
      biZuoList = [];
      eWaiList = [];
      tiXianList = [];
      jiZanList = [];
      supriseList = [];
      monthList = [];
      isOldShareTX = false;
    },

    success: function (res) {
      console.log(res);
      app.mtj.trackEvent('i_f_success_count', {
        i_f_name: tongji_url,
      });
      // if (res.data.status != 1 || res.statusCode != 200) {
      //   return;
      // }
      console.log("签到接口调用-成功，信息：", res.data);

      if (res.data.status != 1) {
        that.showToast(res.data.message, 4000);

        return;
      }

      console.log("签到接口调用-成功，status == 1信息：", res.data);

      var minTask = wx.getStorageSync('SIGN-TASK-MM');

      console.log("minTask:", minTask);


      var showText = "恭喜您完成本任务。" + minTask.jiangliValue + "元奖金已经存入账户，完成所有任务可提现哦。";
      // var showText = minTask.jiangliValue + minTask.jiangliDanWei + minTask.jiangliContent + "奖励已经存入账户，赶紧去买买买吧~";


      console.log("showText:", showText);


      // var showText = shareXShop_jiangliValue * shareXShop_doNum + shareXShop_jiangliName + "奖励已经存入账户，赶紧去买买买吧~";

      // wx.showModal({
      //   title: '任务完成!',
      //   content: showText,
      //   confirmColor: "#FF3F8B"
      // });

      //清清除之前保存的相关分钟的数据
      wx.setStorageSync("SIGN-TASK-MM", "");
      wx.setStorageSync("MIN_BEGIN_MIN_INDEX", "");
      wx.setStorageSync("MIN_BEGIN_MIN_ETime", "");
      wx.setStorageSync("countdownUseED", false)

      //清除之前的数据
      biZuoList = [];
      eWaiList = [];
      tiXianList = [];
      jiZanList = [];
      supriseList = [];
      monthList = [];
      isOldShareTX = false;

      //刷新数据
      that.onShow();



      // that.setData({
      //   signFinishShow: true,
      //   signFinishDialog: {
      //     top_tilte: "任务完成！",
      //     tilte: "任务完成~",
      //     contentText: showText,
      //     leftText: "确定",
      //     rigthText: "继续做任务"
      //   },
      // });

      if (res.data.clock_in_status == 1 && app.signData.current_date == "newbie01") { //新用户第一天打卡成功
        that.setData({
          showFrirstDayCopleteDialog: true
        })
      } else {
        that.setData({
          signFinishShow: true,
          signFinishDialog: {
            top_tilte: "任务完成!",
            tilte: "任务完成~",
            contentText: showText,
            oneBtnText: "继续做任务",
            isOneBtn: true,
          },
        });
      }
      isMiniSigning = false;

    },
    fail: function (error) {
      app.mtj.trackEvent('i_f_error_count', {
        i_f_name: tongji_url,
        // i_f_from: "10",
      });
    }

  })
}


function removeTaskFG(xiaoTaskList, delType) {

  for (var i = 0; i < xiaoTaskList.length; i++) {
    var t_type = xiaoTaskList[i].task_type;
    if (delType == t_type) {
      xiaoTaskList.splice(i, 1);
      i--;
    }
  }
}

//绑定分享这信息
function bindShareUser(shareUserId) {
  util.bindRelationship(shareUserId, token);
}


//一键做下个任务
function zidongCiickNextTask(that) {

}

function initSignHint(that) {

  var lingYuanMoneyUrl = config.Host + "wallet/getZeroCount" +
    "?token=" + token + config.Version;
  var tongji_url = "default";
  var tongji_parameter = "default"
  var mUrl = lingYuanMoneyUrl;

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

  lingYuanMoneyUrl = util.Md5_httpUrl(lingYuanMoneyUrl);


  wx.request({
    url: lingYuanMoneyUrl, //签到接口
    data: {},
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {

      app.mtj.trackEvent('i_f_success_count', {
        i_f_name: tongji_url,
      });

      if (res.data.status != 1 || res.statusCode != 200) {
        return;
      }
      var lingyuangouMoney = res.data.data;
      //赚钱提示。每天只弹一次
      var time = wx.getStorageSync("SIGNTISHITOAST");
      if (util.isToday(time) != "当天") {

        var text = jsonTextData.qdrwyd.text.split(",");

        //处理title
        var title = jsonTextData.qdrwyd.title.replace('\$\{replace\}', lingyuangouMoney);
        //处理title1
        var title1 = jsonTextData.qdrwyd.title1.replace('\$\{replace\}', text[1]);
        title1 = title1.replace('\$\{replace\}', text[2]);

        that.setData({
          // showSignHint: true,
          showSignHint: false, //3.7.0版本去掉此弹窗
          signHintTitle: title,
          signHintTitle1: title1,
          h5money,
          lingyuangouMoney
        })
        wx.setStorageSync("h5money", -1)
        wx.setStorageSync("SIGNTISHITOAST", new Date().getTime())
      }
    },
    fail: function (error) {
      app.mtj.trackEvent('i_f_error_count', {
        i_f_name: tongji_url,
        // i_f_from: "10",
      });
    }
  })
}

function signZHIding(that) {

  // zhiDingClick = false;
  isDownAppGo = false;

  that.setData({
    showZhiding: false
  })

  wx.setStorageSync("isHomePageThreeGo", false);


  //未登录的模拟签到--修改完成列表并刷新
  if (!isLoginSucess) {
    var minTask = wx.getStorageSync('SIGN-TASK');

    var completeTsk = {};
    completeTsk.index_id = wx.getStorageSync('SIGN-TASK').index;
    completeTsk.status = 0;
    completList.push(completeTsk);

    wx.setStorageSync("unLoginCompelteList", completList);

    unLoginJiangli += minTask.jiangliValue;

    wx.setStorageSync("unLoginJiangli", unLoginJiangli);

    //清除之前的数据
    biZuoList = [];
    eWaiList = [];
    tiXianList = [];
    jiZanList = [];
    supriseList = [];
    monthList = [];
    isOldShareTX = false;


    that.onShow();


    var showText = ""
    // if (wx.getStorageSync("SIGN-TASK").task_type == 38 ||
    //   wx.getStorageSync("SIGN-TASK").task_type == 39 ||
    //   wx.getStorageSync("SIGN-TASK").task_type == 40 ||
    //   wx.getStorageSync("SIGN-TASK").task_type == 41
    // ) {
    showText = "恭喜您完成本任务。" + minTask.jiangliValue + "元奖金已经存入账户，完成所有任务可提现哦。";

    // } else {
    //   showText = minTask.jiangliValue + minTask.jiangliDanWei + minTask.jiangliContent + "奖励已经存入账户，赶紧去买买买吧~";

    // }


    that.setData({
      signFinishShow: true,
      signFinishDialog: {
        top_tilte: "任务完成!",
        tilte: "任务完成~",
        contentText: showText,
        oneBtnText: "继续做任务",
        isOneBtn: true,
      },
    });

    return
  }












  var signUrl = config.Host + "signIn2_0/signIning" +
    "?token=" + token +
    "&index_id=" + wx.getStorageSync('SIGN-TASK').index +
    "&day=" + wx.getStorageSync("SIGN_DAY") + config.Version;
  var tongji_url = "default";
  var tongji_parameter = "default"
  var mUrl = signUrl;

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
  signUrl = util.Md5_httpUrl(signUrl);

  //分享完成赚钱任务接口
  wx.request({
    url: signUrl, //签到接口
    data: {},
    header: {
      'content-type': 'application/json' // 默认值
    },

    complete: function (res) {
      // console.log("签到提示信息：" + res.data.message);
      // that.showToast("签到提示信息：" , res.data.message, 3000)
    },
    success: function (res) {
      app.mtj.trackEvent('i_f_success_count', {
        i_f_name: tongji_url,
      });

      // console.log(res);
      if (res.data.status != 1 || res.statusCode != 200) {
        that.showToast(res.data.message, 4000);
        return;
      }
      //刷新数据
      that.onShow();
      var minTask = wx.getStorageSync('SIGN-TASK');



      var showText = "恭喜您完成本任务。" + minTask.jiangliValue + "元奖金已经存入账户，完成所有任务可提现哦。";


      // var showText = minTask.jiangliValue + minTask.jiangliDanWei + minTask.jiangliContent + "奖励已经存入账户，赶紧去买买买吧~";
      // var showText = shareXShop_jiangliValue * shareXShop_doNum + shareXShop_jiangliName + "奖励已经存入账户，赶紧去买买买吧~";
      // wx.showModal({
      //   title: '任务完成!',
      //   content: showText,
      //   confirmColor: "#FF3F8B"
      // });



      // var showText = "任意好友点击后，任务奖励即到账。";

      // that.setData({
      //   signFinishShow: true,
      //   signFinishDialog: {
      //     top_tilte: "任务完成！",
      //     tilte: "任务完成~",
      //     contentText: showText,
      //     leftText: "确定",
      //     rigthText: "继续做任务"
      //   },
      // });


      if (res.data.clock_in_status == 1 && app.signData.current_date == "newbie01") { //新用户第一天打卡成功
        that.setData({
          showFrirstDayCopleteDialog: true
        })
      } else {
        that.setData({
          signFinishShow: true,
          signFinishDialog: {
            top_tilte: "任务完成!",
            tilte: "任务完成~",
            contentText: showText,
            oneBtnText: "继续做任务",
            isOneBtn: true,
          },
        });
      }


    },
    fail: function (error) {
      app.mtj.trackEvent('i_f_error_count', {
        i_f_name: tongji_url,
        // i_f_from: "10",
      });
    }
  })
}

//处理从分享的商品详情
function initShopShare(that, firstLogin) {
  // that.showToast("11111111111111111111111", 1500);

  // that.showToast("本商品为特价商品，完成3个衣蝠赚钱小任务即可购买。", 6000);


  console.log("开始处理商品详情过来的", firstLogin);

  console.log("shareShopToast2", wx.getStorageSync("shareShopToast2"));


  //取出之前第二个提示的否已经弹出,如果已经弹出过第二个弹窗就直接弹出第二个弹窗，后不做其他处理
  if (wx.getStorageSync("shareShopToast2")) {
    that.showToast("今日未获得特价资格，每日都有一次随机抽中的机会，明天加油吧。", 4000);
    return;
  }

  console.log("shareShop2MinEND", wx.getStorageSync("shareShop2MinEND"));

  // if (firstLogin == false || firstLogin == "false") 
  // { //老用户并且之前的计时时间未到过，弹出第一个提示
  if (!wx.getStorageSync("shareShop2MinEND")) {
    console.log("9999999999999999");
    that.showToast("本商品为特价商品，完成3个衣蝠赚钱小任务即可购买。", 4000);
  }
  // }

  //如果之前的两分钟已经到了，重新通过商品分享过来的，不管新老用户，直接弹出第二个提示
  if (wx.getStorageSync("shareShop2MinEND")) {
    that.showToast("今日未获得特价资格，每日都有一次随机抽中的机会，明天加油吧。", 4000);
    //保存弹出过第二个提示的标志
    wx.setStorageSync("shareShopToast2", true);
    return;
  }


  console.log("计时开始");

  //新老用户都计时两分钟
  setTimeout(function () {
    //时间到后保存标志
    wx.setStorageSync("shareShop2MinEND", true);
  }, 2 * 60 * 1000)

}


//获取泡泡数据
function addToLimitList() {
  var limitData = {};
  limitData["nname"] = util.getVirtualName() + "***" + util.getVirtualName();
  limitData["num"] = parseInt(Math.random() * (901 - 10) + 10) + util.getVirtualDecimalAwardsWithdrawal();
  limitData["pic"] = config.Upyun + "defaultcommentimage/" + util.getDefaultImg();
  limitData["type"] = isCrazyMon ? 1 : 2;
  return limitData;
}



function initPaoPao(that) {
  for (var i = 0; i < 50; i++) { //模拟50条数据
    dataListTemp1.push(addToLimitList());
  }

  that.setData({
    mListData1: dataListTemp1
  });
  // that.count_down();
  console.log("dataListTemp1", dataListTemp1);

  twoPaopaoScroll(that);


}

function twoPaopaoScroll(that) {
  //每秒滚动一次
  setTimeout(
    function () {
      that.setData({
        scrollTop1: that.data.scrollTop1 + 50
      });

      twoPaopaoScroll(that);
    },
    1000
  )
}

//通过时间戳获取年月
function getYearAndMonth(data) {
  var date = new Date(data);
  var Y = date.getFullYear() + '';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '';
  var D = date.getDate() + '';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();

  return Y + "" + M
}

//通过时间戳获取天的序号
function geyDateIndex(data) {
  var date = new Date(data);
  var Y = date.getFullYear() + '';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '';
  var D = date.getDate() + '';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return D
}

function numToEnMonth(cur_month) {
  var enMonth = "";
  switch (cur_month) {
    case 1:
      enMonth = "January";
      break;
    case 2:
      enMonth = "February";
      break
    case 3:
      enMonth = "March";
      break
    case 4:
      enMonth = "April";
      break
    case 5:
      enMonth = "May";
      break
    case 6:
      enMonth = "June";
      break
    case 7:
      enMonth = "July";
      break
    case 8:
      enMonth = "August";
      break
    case 9:
      enMonth = "September";
      break
    case 10:
      enMonth = "October";
      break
    case 11:
      enMonth = "November";
      break
    case 12:
      enMonth = "December";
      break


  }
  return enMonth
}


//封装函数(data格式为2017-11-11)
function formatTimeStamp(date, time = '0:0:0') {
  return Date.parse(new Date('${data} ${time}')) || Date.parse(new Date(`${data.replace(/-/g, '/')} ${time}`))
}