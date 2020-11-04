import config from '../../../config';
import ToastPannel from '../../../common/toastTest/toastTest.js';
//获取本地化数据
// var postdata = require('../../../data/shouyedata.js');
var app = getApp();
var token = null;
var publicUtil = require('../../../utils/publicUtil.js');
var showHongBao = require('../../../utils/showNewuserHongbao.js');
var util = require('../../../utils/util.js');
var WxNotificationCenter = require('../../../utils/WxNotificationCenter.js');
//浏览件数相关//
var firstCome; //第一次滑到底时候 防止来回滑动计算次数
var firstFresh;//第一次刷新
var isForceLook;
var isForceLookLimit;
var xShop_complete;
var task_type;
var xShop_signIndex;
var xShop_doValue;
var xShop_doNum;
var xShop_jiangliName;
var xShop_jiangliValue;
var xShop_shopsName;
var singvalue;
var shop_type; //1普通商品 2特价商品 3特价广告商品 4正价广告商品
//浏览件数相关//
var isActiveShop = false; //虚拟是否活动商品
var isFight = false; //是否参团
var total_micro_second; //开团剩余时间
var cutdown_total_micro_second; //倒计时时间

var buttonClcik; //1分享 2单独购买 3疯抢 4最爱
var formId;
var loginCount;
var oneYuanData = 0;//0是1元购
var xuanfuanimationMiddleHeaderItem;
var shop_likeClick = false;
var moneyTixianShowCount = 0;
var animationTimer;
var redhongbaonotshow;
var redhongbaopopTimer;
var redhongbaoCutdoenTimer;
var countdownTimer;
Page({

  data: {
    uppertittle: '温馨提示',
    upperdistribution: "本商品为特价商品，完成1个衣蝠赚钱小任务即可以特价购买。更享受0元购特权，购买美衣返还全部购衣款入账户余额",
    upperbuttontitle: "去衣蝠赚钱小任务赚钱",

    loginupperdistribution: "需要您的授权才能正常使用哦！",
    loginupperbuttontitle: "授权登录",
    isUpperNotitle: true,

    contactMsgPath: "", //卡片消息路径

    picLink: '', //拼接了又盘云和商品编号的链接
    shop_code: '',
    showDialog: false,
    noDataFlag: true,
    starCount: 0,
    postlist: {},
    evaluateList: {},
    evaluateData: [], //评价数据集合
    shop_attr: '', //商品属性拼接字符串
    sizeData: [], //商品尺码数据
    strShopTag: '', //该商品商品标签字符串
    shopTagData: [], //商品标签数据
    shopAttrData: [], //商品属性数据
    stockTypeData: [], //商品库存分类表
    stockColorData: [], //商品库存颜色
    stockSizeData: [], //商品库存尺寸
    stockPicData: [], ////商品库存图片
    stockNameData: [], //商品属性名
    stockTitleNameData: [], //商品标题属性名

    selectIndexs: [], //选中的角标
    selectColor_SizeIds: [], //选中的属性
    stockColorSizeData: [], //商品库存颜色尺寸

    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},
    length: 0,
    secondimgData: ['complaint_1.png', 'complaint_2.png', 'complaint_3.png'],
    secondtextData: ['发送给朋友', '添加到我的小程序', '添加到桌面'],
    thirdimgData: ['complaint_4.png', 'complaint_5.png', 'complaint_6.png', 'complaint_7.png'],
    thirdtextData: ['浮窗', '设置', '反馈与投诉', '重新进入小程序'],

    stockImage: '',
    stockCount: 0, //库存个数
    stockPrice: 0, //库存价格
    colorIndex: 0, //选中的颜色角标
    sizeIndex: 0, //选中的尺寸角标
    coloe_sizeIndex: 0, //选择的颜色或尺寸角标
    stock_type_id: '', //库存id
    type_data: '', //二级类目
    selectColorId: '', //选中颜色id
    selectSizeId: '', //选中尺寸id
    isFirst: "",
    isNew: "",

    buyCount: 1, //购买数量
    Upyun: config.Upyun,
    upyconfig: config.Upyun,
    Version: '',
    Channel: "",
    shop: {},
    shop_name: '',
    shop_se_price: '0.0',
    shop_price: '0.0',
    save_money: 0,
    discount: 0.0,
    discount_reduceMoney: 0.0,
    reduceMoney: '0.0', //已抵扣余额
    topData: [],
    activityIndex: 0,
    imagePathData: [], //详情图片路径集合
    shop_pic: '', //详情页图片集合
    eva_count: 0, //评论数
    zeroOrderNum: 0, //0元购订单数量
    progress_color: "100",
    progress_type: '100',
    progress_work: '100',
    progress_cost: '100',
    curPage: 1,
    pageSize: 10,
    strLongTag: '', //长标签
    fristShortTag: '', //第一个短标签
    screenHeight: 0,
    screenWidth: 0,
    picHeight: 0,
    bigpicHeight: 0,
    listItemHeight: 0,
    listItemWidth: 0,
    is_look: false,
    zeroBuyDialogShowFlag: false,
    moneyDiscountShowFlag: false,
    moneyDiscount: "0.0", //累计已抵扣的余额
    oneYuanDiscriptionTitle: "余额抵扣说明",
    getYiDouShow: false, //如何获得衣豆
    isOneYuanClick: false, //是否点击1元购
    isfreeLingClick: false, //是否点击免费领
    oneyuanValue: 1,
    wxcx_shop_group_price: 0, //特价
    spaceName: "",
    moneyDiscount: {
      tilte: "余额抵扣说明",
      contentText: "余额不仅可以提现，还可以下单时抵扣10%的商品价（活动商品除外）", //任务完成弹窗 具体类容
      leftText: "知道了",
      rigthText: "去赚余额",
      shop_like: false,
      shop_likeimage: 'shop_newaddunlike'
    },

    scanTipsShow: false,
    signFinishShow: false, //任务完成弹窗是否显示
    signFinishDialog: {
      top_tilte: "", //任务完成弹窗 顶部标题
      tilte: "", //任务完成弹窗 标题
      contentText: "", //任务完成弹窗 具体类容
      leftText: "", //任务完成弹窗 左边按钮
      rigthText: "" //任务完成弹窗 右边按钮
    },


    sharePicLink: '',
    isShowShare: false, //分享弹窗
    isOneShowShare: false, //1元购分享弹窗
    isOneShowMoney: app.globalData.oneYuanValue > 0 ? app.globalData.oneYuanValue : 1, //
    shareJson: '', //后台获取的分享标题
    shareTitle: '', //分享处理后的标题
    adData: [], //顶部轮播广告
    adDataAll: [], //全部广告
    isSHowAdFlag: false, //是否显示顶部广告轮播
    isShowJoinGroup: false, //是否显示参团
    isShowOpenGroup: false, //是否显示开团
    getRandomTempData: [],
    detailHeight: 0,
    isShowRedPacked: false, //悬浮红包
    isShowFuWuchengluo: false, //服务承诺
    redHongbaoNewuserShow: false,//15元新人红包
    firstredHongbaoNewuserShow: false,
    shareComeFromRedHongBao:false,
    signAdData: ['sign_ad1.png', 'sign_ad2.png', 'sign_ad3.png', 'sign_ad4.png', 'sign_ad5.png'], //底部签到图片链接
    signBottomLink: '',
    isShowSignBottomAd: false,
    isShareFlag: false, //分享出去直接跳进来的
    isFreelingShareFlag:false,//分享免费领
    isFreelingShareCount:3,//免费领分享次数
    fristDistance: 1000,
    startDis: 0,
    endDis: 0,

    recommendTitleData: [],
    recommendListData: [],
    recommendPage: 1,
    recommend_type_name: '热卖',
    recommend_type1: '6',
    currentTab: 0, //推荐点击的条目

    isShowCustomTv: false,
    isSignActiveShop: false, //true代表活动商品
    haveCounts: 3, //活动商品剩余件数

    xuanfu_animationData: {},

    isFixFlag: false,
    isRecommendFix: false,
    recommendLoadFlag: true,
    evaluateLoadMore: true,
    isNewUserShow: false,
    isNewUserFlag: false,
    isOreadyToken: false,

    isSignClose: false, //控制zhuanqian开关

    bottomOneYuan: false, //控制购买方式
    bottomBtnTv: '0.0',
    bottomBtnTv1: '赚￥0.0',
    returnOneText: '1折购买',
    bottomOneBtnTv: '0.0',
    bottomOneBtnTv1: "拼团疯抢",
    roll_code: '', //参团团号
    open_roll_code: '', //开团团号
    rnum: '', //拼团剩余人数
    userPic: '', //团长头像
    fightUserid: '', //团长id
    nowtime: '', //参团当前时间
    timeout: '', //参团结束时间
    SurplusTime: '', //剩余时间

    load_timer: true, //定时器
    start_time: '', //开始时间
    end_time: '', //结束时间
    openGroup_outTime: '', //时分秒
    clock_hr: '', //时
    clock_min: '', //分
    clock_ss: '', //秒

    fightSuccess_fail_isShow: false,
    upperMemberYiFuShow: false,
    supplementMemberShow: false,
    member_discribution: '尊敬的衣蝠会员，您的会员费已被用于购买商品，请补足会员费。',
    member_buttontitle: '补足会员费',
    supply_isShow: false, //是否展示品牌
    is_redHongBao: false,
    shouYePage: '',     //商品是否来自首页3
    shop_deduction: 0.9,//商品抵扣百分比
    images: {},
    inputInvitNumberIsShow: true,
    contactkefuShow: false,
    guidebecomeMemberShow: false,
    guidebecomeMemberImage: '',
    isShowNOGroup:false,
    fightCount:'4',//几人拼团
    isKT:false,//是否开团
    task_freeling:'',//免费领任务
    swiperlist:['','','',''],
    clickLogin: true,//点击红包授权
    is_vip:0,//0不是会员 >0是会员
    delivery_time:'',//发货时间
    freelingpage2_comefrom:'',//从哪个界面过来的
    first_diamond:0,
  },

  onUnload() {
    clearTimeout(redhongbaopopTimer);
    clearTimeout(redhongbaoCutdoenTimer);

    this.setData({
      load_timer: false,
    })
  },

  onHide: function () {
    clearTimeout(redhongbaopopTimer);
    clearTimeout(redhongbaoCutdoenTimer);
    clearTimeout(countdownTimer);
    showHongBao.stoppopTimer(this, function () { })
    wx.hideLoading()
  },
  onLoad: function (option) {
    firstFresh = true;
    loginCount = 0;

    if (option.isShareFlag) {
      this.shareLoginSetting();
      buttonClcik = 0;
      this.globalLogin();
      app.shop_type_tagData();
    }

    if (!app.parent_id) {
      app.parent_id = option.user_id;
    }

    console.log("option.isSign----", option)
    var that = this;
    if (option.user_id && app.globalData.user && app.globalData.user.userToken) {
      util.bindRelationship(option.user_id, app.globalData.user.userToken); //绑定用户上下级关系
    }
    if (option.user_id) {
      WxNotificationCenter.addNotification("testNotificationItem1Name", function () {
        if (app.globalData.user && app.globalData.user.userToken) {
          util.bindRelationship(option.user_id, app.globalData.user.userToken); //绑定用户上下级关系
        }
      }, this);
    }
    // if (option.isNewUserFlag) {
    //   this.data.isNewUserFlag = true;
    // }
    if (option.showSignPage) {
      app.globalData.showSignPage = option.showSignPage;
    }

    if (option.homePage3ElasticFrame != undefined && option.homePage3ElasticFrame != 'undefined') {
      this.data.homePage3ElasticFrame = option.homePage3ElasticFrame;
      this.setData({
        redhongbaocanPop: true
      })
    }
    //是否虚拟活动商品
    if (option.isActiveShop == "true") {
      isActiveShop = true;
      oneYuanData = 1;
    } else {
      isActiveShop = false;
    }
    //是否活动商品 货到付款
    if (option.cashOnDelivery) {
      this.setData({
        cashOnDelivery: option.cashOnDelivery
      })
    }
    // if (option.isSign) { //分享赢提现
    //   this.data.isNewUserFlag = true;
    // }
    //是否拼团任务进来
    if (option.isKT){
      this.setData({
        isKT: option.isKT
      })
    }
    //是否从免费领列表页2过来的
    if (option.freelingpage2_comefrom == 'true')
    {
      this.setData({
        isFreelingShareCount:0,
        freelingpage2_comefrom: option.freelingpage2_comefrom
      })
    }else if(option.advent2_comefrom == 'true'){
      this.setData({
        advent2_comefrom: option.advent2_comefrom
      })
    }
    //赚钱任务进来的
    if (option.comefrom) {
      this.setData({
        comefrom: option.comefrom
      })
      
      //免费领任务进来的
      if (option.task_freeling) {
        this.setData({
          task_freeling: option.task_freeling
        })
      }
    }

    if (app.globalData.channel_type == 1)
    {
      this.setData({
        channel_type: app.globalData.channel_type
      })
    }
    
    this.data.isShareFlag = option.isShareFlag;
    // if (option.isShareFlag){
    //   app.shareToHomepage3()

    // }
    shop_type = option.shop_type;

    wx.createSelectorQuery();
    if (option.isSignActiveShop) {
      this.data.isSignActiveShop = option.isSignActiveShop;
    }
    var returnOneText = (option.roll_code && option.is_redHongBao != 'true') ? "一键参团" : this.data.returnOneText;
    var returnTwoText = this.data.returnTwoText ? this.data.returnTwoText : (this.data.wxcx_shop_group_price * 1).toFixed(1);
    this.setData({
      isSignActiveShop: this.data.isSignActiveShop,
      bottomOneBtnTv: returnTwoText,
      bottomOneBtnTv1: returnOneText,
      fightbottomOneBtnTv: this.data.assmble_price != undefined ? this.data.assmble_price : '',
      oneyuanValue: this.data.wxcx_shop_group_price,
      typePageHide: option.isShareFlag == true ? 0 : app.globalData.typePageHide,
      isActiveShop: option.isShareFlag == true ? false : isActiveShop,
      supply_isShow: app.showSub,
      isFirst: option.isFirst != undefined ? option.isFirst : '',
      isNew: option.isNew != undefined ? option.isNew : '',
      is_redHongBao: option.is_redHongBao != undefined ? true : false,
      shop_type: shop_type != undefined ? shop_type : 1,
    });

    app.ToastPannel();
    this.redMoney_popCount();
    this.getRcommendTitleData();
    this.hongBaoAnimation();
    var that = this;
    //数据库同步成功通知
    WxNotificationCenter.addNotification("shopNotificationItem1Name", function () {
      //获取商品一级类目
      that.getRcommendTitleData();
      //刷新详情下面的列表
      that.data.recommendPage = 1;
      that.getData(5, function (data) {
        that.dealBackData(5, data);
      });
      that.setData({
        isActiveShop: option.isShareFlag == true ? false : isActiveShop,
        typePageHide: option.isShareFlag == true ? 0 : app.globalData.typePageHide
      })
      console.log('^^^^^^^^^^^^^^^^^^^^^isActiveShop', that.data.isActiveShop);
    }, this);

    // //是否是第二次抽奖回来
    // WxNotificationCenter.addNotification("luckDraw", function(){
    //   util.get_LuckDraw(function (luckDraw) {
    //     if (luckDraw == true) {
    //       that.setData({
    //         upperMemberYiFuShow: true
    //       })
    //     } 
    //   })
    // }, that)

    that.data.shop_code = option.shop_code;

    if (this.data.isSignActiveShop) {
      var count = wx.getStorageSync("ssss" + option.shop_code);
      if (count) {
        this.setData({
          haveCounts: count
        })
      } else {
        var s = Math.floor(Math.random() * 25 + 3);
        wx.setStorageSync("ssss" + option.shop_code, s);
        this.setData({
          haveCounts: s
        });
      }
    }


    var rand = parseInt(Math.random() * 5);
    this.data.signBottomLink = this.data.signAdData[rand];
    if (null != app.globalData.user) {
      token = app.globalData.user.userToken;
    } else {
      token = null;
    }
    this.setData({
      token: token
    })
    isForceLookLimit = option.isForceLookLimit;
    isForceLook = option.isForceLook;
    if (!this.data.isShareFlag) {
      if (null != this.data.token) {
        publicUtil.getBalanceNum(function (isSHow) {
          if (isSHow) {
            that.setData({
              isShowRedPacked: true
            })
          } else {
            that.setData({
              isShowRedPacked: false
            })
          }
        });
      } else {
        this.setData({
          isShowRedPacked: true
        })
      }
    }
    //浏览X件任务
    if (isForceLook || isForceLookLimit) {
      // that.setData({ is_look: true });
      firstCome = true;
      var signTask = wx.getStorageSync("SIGN-TASK");

      xShop_complete = signTask.complete;
      task_type = signTask.task_type;
      xShop_signIndex = signTask.index;
      xShop_doValue = signTask.value;
      xShop_doNum = signTask.num;
      xShop_jiangliName = signTask.jiangliDanWei + signTask.jiangliContent;
      xShop_jiangliValue = signTask.jiangliValue;
      xShop_shopsName = signTask.shopsName;

      try {
        singvalue = parseInt(xShop_doValue.split(",")[1])
      } catch (e) {
        singvalue = parseInt(xShop_doNum);
      }
      var dataString = new Date().toDateString();
      var saveDay = wx.getStorageSync("scanshop_tips_day");
      if (saveDay != dataString) {
        that.setData({
          is_look: false, //侧边浏览先不显示
          scanTipsShow: true
        });
        wx.setStorageSync("scanshop_tips_day", dataString);
      } else {
        that.setData({
          is_look: true,
          scanTipsShow: false
        });
      }
    }

    //详情相关接口调用
    this.setData({
      signBottomLink: this.data.signBottomLink,
      starCount: 5,
      Version: config.Version,
      // Channel: config.ChannelPost,
      activityIndex: 0,

      // topData:
      // [{ name: '详情', },
      // { name: '参数', },
      // { name: '评价', },
      // ],

      adDataAll: [{
        link: 'icon_duobao_new',
        name: '0元团购',
        award: 'IPHONE X',
        id: 0
      },
      {
        link: 'icon_fenxiangri',
        name: '超级分享日',
        award: '150元/人',
        id: 0
      },
      {
        link: 'icon_honbaoyu',
        name: '千元红包雨 ',
        award: '1000个',
        id: 0
      },
      {
        link: 'icon_liulan_sign',
        name: '浏览2分钟超值特价 ',
        award: '5.0',
        id: 1
      },
      {
        link: 'icon_liulan_sign',
        name: '浏览2分钟SHOW社区',
        award: '5.0',
        id: 1
      },
      {
        link: 'icon_fenxiang_nom',
        name: '分享1件时尚穿搭',
        award: '5.0',
        id: 1
      },
      {
        link: 'icon_liulan_sign',
        name: '浏览1分钟冬装特卖',
        award: '3.0',
        id: 1
      },
      {
        link: 'icon_liulan_sign',
        name: '浏览2篇穿搭话题 ',
        award: '3.0',
        id: 1
      },
      {
        link: 'icon_fenxiang_nom',
        name: '分享1件冬日毛衣',
        award: '2.0',
        id: 1
      },
      {
        link: 'icon_liulan_sign',
        name: '浏览2件新款卫衣',
        award: '3.0',
        id: 1
      },
      {
        link: 'icon_gouwuche_sign',
        name: '加1件商品到购物车',
        award: '3.0',
        id: 1
      }
      ]
    })
    var that = this;
    if (shop_type == 2 || shop_type == 3) {
      this.setData({
        topData: [{
          name: '商品详情',
        }],
        isShowFuWuchengluo: false,
      })
    } else {
      this.setData({
        topData: [{
          name: '详情',
        },
        {
          name: '参数',
        },
        {
          name: '评价',
        },
        ],
        isShowFuWuchengluo: true,
      })
    }
    this.getData(0, function (data) {
      that.dealBackData(0, data);
    });
    this.getData(3, function (data) {
      that.dealBackData(3, data);
    });
    this.getDataJson(4, function (data) {
      that.dealBackData(4, data);
    });

    if (app.globalData.user && app.globalData.user.userToken) {
      this.getData(6, function (data) { //开关
        that.dealBackData(6, data);
      });
    } else {
      WxNotificationCenter.addNotification("testNotificationItem1Name_isSignClose", function () {
        if (app.globalData.user && app.globalData.user.userToken) {
          that.getData(6, function (data) { //开关
            that.dealBackData(6, data);
          });
        }
      }, this);
    }
    this.getTopAdData();
    this.getRawardMoneyStatus();
    // this.get_discountHttp();

    wx.getSystemInfo({
      success: function (res) {
        var picHeight = res.windowWidth * 9 / 6;
        var bigpicHeight = res.windowWidth * 7 / 6;
        var listItemHeight = (res.windowWidth * 9 / 6) * 0.96 * 0.504;
        var listItemWidth = res.windowWidth * 0.96 * 0.504;
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          bigpicHeight: bigpicHeight,
          picHeight: picHeight,
          listItemHeight: listItemHeight,
          listItemWidth: listItemWidth,
        });
      }
    });

    if (option.roll_code) {

      this.setData({
        roll_code: option.roll_code,
      })
      isFight = false;
    }
    //是否有非会员用户拼团
    // if (option.unvip_roll_code) {
    //   this.setData({
    //     unvip_roll_code: option.unvip_roll_code,
    //   })
    // }

    //列表是否是首页3
    if (option.shouYePage) {
      this.setData({
        shouYePage: option.shouYePage
      })
    }

  },
  onShow: function (option) {
    var that = this;
    isFight = false;

    var FightSuccess = wx.getStorageSync('FightSuccess');
    //当是退款详情回来的弹拼单成功提示用户去提现的弹窗
    if (FightSuccess == true) {
      that.getcoupon_http();
    }

    if (firstFresh == false) {
      that.oneYuan_httpData();
    }
    firstFresh = false;

    //免费领分享次数
    if (that.data.isFreelingShareFlag == true)
    {
      if (that.data.isFreelingShareCount <= 1){//4次分享完后即可免费领
        // that.oneBuyClick(); 

        that.setData({
          showDialog: true,
        });
        if (that.data.stockTypeData.length == 0) {
          that.getData(2, function (data) {
            that.dealBackData(2, data);
          });
        } else {
          that.showNewShopStock(that.data.selectIndexs, that.data.selectColor_SizeIds);
        }
      }else{
        that.getShareShop(function(success){
          if(success){
            that.setData({
              isShowShare: true
            })
          }
        });
      }

      that.setData({
        isFreelingShareFlag: false,
        isFreelingShareCount: that.data.isFreelingShareCount - 1,
      })
    }

    //获取非会员用户拼团信息
    if (that.data.unvip_roll_code) {
      that.get_unvip_fightInfoHttp();
    }

    if (app.globalData.user != null && app.globalData.user.userToken != undefined) {

    }else{
      if (that.data.shouYePage != 'TwoPage') {
        showHongBao.getShowHongbao(that, function (is_show) {
          if (is_show) {
            that.setData({
              firstredHongbaoNewuserShow: false
            })
          }
        });
      }
    }

    //大促销已结束
    var showendofpromotionDialog;
    if (app.globalData.user != null) {
      showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
    } else {
      showendofpromotionDialog = app.globalData.channel_type == 1 ? false : true;
    }
    that.setData({
      showendofpromotionDialog: showendofpromotionDialog
    })

    
    if (!that.data.showendofpromotionDialog) {
      wx.onUserCaptureScreen(function (res) {
        console.log('……………………………………………………用户截屏了')
        setTimeout(function () {
          that.showModal();
        }, 1000)
      })
    }
  },

  //免费领分享数据
  getShareShop: function (callBack) {

    var that = this;

    var dataUrl = config.Host + "shop/shareShop" +
      "?getShop=" + "true" +
      config.Version;
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    util.http(dataUrl, function (data) {
      if (data.status == 1) {
        var shop_code = data.shop.shop_code;
        var shop_pic = data.shop.four_pic.split(",")[2];
        var shareP;
        if (data.shop.four_pic) {
          var str = data.shop.four_pic.split(",");
          if (str.length > 2) {
            shareP = str[2];
          }
        }
        var shop_code_cut = '';
        shop_code_cut = shop_code.substring(1, 4);
        var sharePic = that.data.Upyun + shop_code_cut + '/' + shop_code + '/' + shareP;
        var shareTitle = '点击购买👆' + '【' + data.shop.shop_name + '】' + "今日特价" + data.shop.assmble_price + "元！";

        var sharepath = '';
        if (app.globalData.user != null && app.globalData.user.user_id != undefined) {
          sharepath = '/pages/mine/toexamine_test/toexamine_test?shouYePage=ThreePage' + "&isShareFlag=true" + "&user_id=" + app.globalData.user.user_id;
        } else {
          sharepath = '/pages/mine/toexamine_test/toexamine_test?shouYePage=ThreePage' + "&isShareFlag=true";
        }

        that.setData({
          freeling_shareTitle: shareTitle,
          freeling_sharePath: sharepath,
        });

        that.freelinggetCanvasPictiure(sharePic, data.shop.assmble_price,callBack);
      } else
        wx.hideLoading();
    })

  },

  //生成分享的合成图片
  freelinggetCanvasPictiure: function (imagesrc, price ,callBack) {
    var that = this;

    util.getCanvasPictiure("shareCanvas", imagesrc, price, '商品分享', function (tempFilePath) {
      wx.hideLoading();
      if (tempFilePath != undefined && tempFilePath != null) {
        that.setData({
          freeling_shareImageUrl: tempFilePath
        })
      } else {
        that.setData({
          freeling_shareImageUrl: imagesrc
        })
      }
      callBack(true);
    })
  },
  //获取30元红包弹出时间和次数
  redMoney_popCount: function () {
    var that = this;
    var noMemberHomePage3ElasticFrame = wx.getStorageSync('noMemberHomePage3ElasticFrame');
    if ((noMemberHomePage3ElasticFrame != undefined && noMemberHomePage3ElasticFrame != '') || noMemberHomePage3ElasticFrame == '0') {
      this.data.noMemberHomePage3ElasticFrame = noMemberHomePage3ElasticFrame;
      return;
    }
    util.get_shouyeSwitch('', function (swhitchdata) {
      var homePage3ElasticFrame = swhitchdata.homePage3ElasticFrame != undefined ? swhitchdata.homePage3ElasticFrame : '';
      var noMemberHomePage3ElasticFrame = swhitchdata.noMemberHomePage3ElasticFrame != undefined ? swhitchdata.noMemberHomePage3ElasticFrame : '';

      wx.setStorageSync('noMemberHomePage3ElasticFrame', noMemberHomePage3ElasticFrame);
      that.setData({
        homePage3ElasticFrame: homePage3ElasticFrame,
        noMemberHomePage3ElasticFrame: noMemberHomePage3ElasticFrame
      })

    });
  },
  //获取是否有免费
  freeText_httpData: function () {
    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var url = config.Host + 'shop/query?token=' + token + config.Version + "&code=" + this.data.shop_code;
    util.http(url, that.freeTextData);
  },
  freeTextData: function (data) {
    var that = this;
    if (data.status == 1) {
      var returnTwoText = data.vipFreeText ? data.vipFreeText : (that.data.wxcx_shop_group_price * 1).toFixed(1);
    }
  },
  //获取用户相关信息
  userInfo_httpData: function () {
    var that = this;
    var returnTwoText = "";
    var t = that.data.shop_code ? 2 : 1;
    var page3 = 0;
    // if (that.data.comefrom == 'sign' && ((that.data.shouYePage == 'ThreePage' || that.data.shouYePage == 'FivePage'))){
    //   page3 = 1;
    // }
    //获取会员信息
    util.get_VipUserIfon(that.data.shop_code, t, page3, function (data) {
      if (data.status == 1) {
        var is_buy = data.is_buy != undefined ? data.is_buy : "";
        var vip_type = data.vip_type != undefined ? data.vip_type : "";
        var is_vip = data.isVip != undefined ? data.isVip : "";
        var is_vipPage = data.vip_page != undefined ? data.vip_page : "";
        var first_group = data.first_group != undefined ? data.first_group : "";
        var vip_free = data.vip_free != undefined ? data.vip_free : "";
        var ordervip_free = data.vip_free != undefined ? data.vip_free : "";
        var free_page = data.free_page != undefined ? data.free_page : "";

        if (is_vip > 0) {
          if (that.data.roll_code.length > 0 && that.data.rnum > 0 && that.data.SurplusTime > 0 && !that.data.is_redHongBao) {
            returnTwoText = "免费参团";
          } 
          // else if (is_vip == 1) {
          //   returnTwoText = "会员免费领";
          // }
        }
        else {
          //非会员界面 且不是活动商品 不是特价商品 不是首页3 显示会员免费领 + 2人拼团
          // if (shop_type != 2 && shop_type != 3 && that.data.isActiveShop == false && that.data.shouYePage != 'ThreePage') 
          if (that.data.isActiveShop == false && that.data.shouYePage != 'ThreePage') {
            vip_free = '2';//会员免费领 + 2人拼团
          }
        }


        //当是会员免费领、特价商品、首页3商品默认会员界面
        // if (vip_free == 1 || shop_type == 2 || shop_type == 3 ||that.data.shouYePage == 'ThreePage')
        if (vip_free == 1 || that.data.shouYePage == 'ThreePage') {
          is_vipPage = '1';//1是会员页面  0不是会员页面 
        }

        that.setData({
          is_vip: is_vip,//0不是 1是
          is_buy: is_buy,
          vip_type: vip_type,
          vip_free: vip_free, //1\2会员免费领 0不是会员免费领
          ordervip_free: ordervip_free,//1会员免费领 0不是会员免费领
          free_page: free_page,
          is_vipPage: is_vipPage,//1是会员页面  0不是会员页面 
          first_group: first_group,//否是首单， 0不是，1是
          returnTwoText: returnTwoText
        })
      } else {
        //当是特价商品 首页3商品默认会员界面
        // if (shop_type == 2 || shop_type == 3 || that.data.shouYePage == 'ThreePage')
        if (that.data.shouYePage == 'ThreePage') {
          that.setData({
            is_vip: 0,//0不是 1是 2会员失效
            vip_type: '0',
            is_vipPage: '1',//1是会员页面  0不是会员页面 
          })
        }

        //当时首页3默认会员免费领 
        if (that.data.shouYePage == 'ThreePage') {
          that.setData({
            vip_free: '1',//会员免费领
          })
        }
        else if (that.data.shouYePage == 'FivePage') {
          that.setData({
            vip_free: '1',//会员免费领 + 2人拼团
          })
        }
        else if (that.data.isActiveShop == false) {
          that.setData({
            vip_free: '2',//会员免费领 + 2人拼团
          })
        }
        

        that.setData({
          returnTwoText: returnTwoText
        })
      }

      


      that.get_discountHttp();
    })

    //获取用户是否完成当天任务
    var dataUrl = config.Host + "clockIn/clockInTodayByUserId?" + config.Version + "&token=" + token;
    util.http(dataUrl, function (data) {
      if (data.data == 1) {
        that.setData({
          nowDayisDaka:true
        })
      }
    });
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
      oneYuanData = this.data.isActiveShop ? 1 : 0;
    }

    if (that.data.roll_code.length > 8) {
      that.get_fightInfoHttp(); //参团信息
    } else {
      that.get_openGroupInfoHttp(); //开团信息
    }

    if (!that.data.roll_code || that.data.roll_code == undefined){
      //获取用户最高会员等级
      util.get_vip2(function (data) {
        if (data.status == 1) {
          var maxType = data.maxType != undefined ? data.maxType : 999; //会员等级
          var showBecameMember = (((data.isVip > 0 && data.isVip != 3) || (data.isVip == 3 && data.maxType == 4)) && data.first_diamond == 0) ? true : false;

          that.setData({
            is_vip:data.isVip,
            max_vipType: maxType,
            first_diamond: data.first_diamond,
            showBecameMember: showBecameMember
          })
        }
      });
    }
  },

  //获取参团信息
  get_fightInfoHttp: function () {
    var that = this;
    var token = "";
    if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
      token = app.globalData.user.userToken;
    }
    var oldurl = config.Host + '/order/getRollInfo?' + config.Version + '&token=' + token + '&roll_code=' + that.data.roll_code;
    util.http(oldurl, that.fight_data);

  },
  fight_data: function (data) {
    if (data.status == 1) {
      var isShowJoinGroup = (this.data.roll_code.length > 0 && data.rnum > 0 && data.time > 0 && !this.data.is_redHongBao) ? true : false;
      
      var userid = data.fight_userid;
      var picData = data.userPic;
      var fightcount = data.count;
      var rollNum = data.rollNum;
      var is_twice = data.is_twice;//是否有参团 0没有 1有
      var userPicList = [];
      for (var i = 0; i < fightcount; i++) {
        if (picData[i]) {

          var fdStart = picData[i].indexOf("http");
          if (fdStart == 0)
            picData[i] = picData[i];
          else {
            picData[i] = config.Upyun + picData[i];
          }
          userPicList.push(picData[i]);
        } else {
          userPicList.push('../../../iconImages/icon_question_mark.png');
        }
      }

      var returnOneText = ((this.data.roll_code.length > 0 && data.rnum > 0 && data.time > 0 && !this.data.is_redHongBao) ? "一键参团" : this.data.returnOneText);
      var returnTwoText = this.data.returnTwoText ? this.data.returnTwoText : (this.data.wxcx_shop_group_price * 1).toFixed(1);

      this.setData({
        rnum: data.rnum,
        SurplusTime: data.time,
        fightUserid: userid,
        fightCount:data.count,
        userPic: userPicList,
        isShowJoinGroup: isShowJoinGroup,
        rollNum: rollNum,
        is_twice: is_twice
        // bottomOneBtnTv: returnTwoText,
        // bottomOneBtnTv1: returnOneText,
      })

      // if (isFight == true) {
      //   //在团状态结束（即拼团成功，团过期，或者人已满的情况下）参团的人点一键参团，等同于点拼团疯抢，直接进入拼团流程
      //   this.buyOrder();
      // }


    } else {
      this.showToast(data.message, 2000);
      this.setData({
        bottomOneBtnTv1: this.data.returnOneText,
      })

    }

    this.userInfo_httpData();//获取用户信息
  },

  //获取非会员用户拼团信息
  get_unvip_fightInfoHttp: function () {
    var that = this;
    var token = "";
    if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
      token = app.globalData.user.userToken;
    }
    var oldurl = config.Host + '/order/getRollInfo?' + config.Version + '&token=' + token + '&roll_code=' + that.data.unvip_roll_code;
    util.http(oldurl, that.unvip_fight_data);

  },
  unvip_fight_data: function (data) {
    var that = this;
    if (data.rnum <= 0 || data.time <= 0 || data.status != 1)//如果拼团时间过期或者人数满roll_code置空
    {
      that.data.unvip_roll_code = '';
    }
  },
  //获取开团信息
  get_openGroupInfoHttp: function () {
    var that = this;
    var token = "";
    if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
      token = app.globalData.user.userToken;
    }
    var oldurl = config.Host + '/order/getUserRollOrder?' + config.Version + '&token=' + token;
    util.http(oldurl, that.open_data);
  },
  open_data: function (data) {
    if (data.status == 1 ) {    
      
      var userPicList = [];
      if(data.userPic != undefined)
      {
        var picData = data.userPic;
        for (var i = 0; i < this.data.fightCount; i++) {
          if (picData[i]) {
            userPicList.push(picData[i]);
          } else {
            userPicList.push('../../../iconImages/icon_question_mark.png');
          }
        }
      }
      //通栏不是会员情况下显示 如果是会员且是开团也可显示
      var isShowOpenGroup = false;
      if (data.roll_code && this.data.shouYePage != 'FivePage')
      {
        if (data.is_vip > 0 && data.is_vip != 3)
        {
          if(this.data.isKT)
          {
            isShowOpenGroup = true
          }
        }else{
          isShowOpenGroup = true
        }
      }
      this.setData({
        isShowOpenGroup: isShowOpenGroup,
        userPic: userPicList,
        start_time: data.stratTime != undefined ? data.stratTime:"",
        end_time: data.endTime != undefined ? data.endTime:'',
        SurplusTime: data.time != undefined ? data.time:'',
        fightCount: data.count != undefined ? data.count:'',
        open_roll_code: data.roll_code != undefined ? data.roll_code:'',
        shortCount: data.rnum != undefined ? data.rnum:'',
        isShowNOGroup: (data.rollNum == 0 && this.data.shouYePage != 'FivePage' && data.is_vip == 0)?true:false
      });

      var NowTime = Number(this.data.start_time) || [];
      var EndTime = Number(this.data.end_time) || [];
      total_micro_second = this.data.SurplusTime || [];
      total_micro_second = total_micro_second*1.8;
      this.countdown();
    }
    this.userInfo_httpData();//获取用户信息
  },

  //获取虚拟拼团数据
  getFictitiousDatas:function(){
    var fictitiousPic = [];
    var success_groupPic = {};
    var fail_groupPic = {};

    for(var i=0; i<100; i++)
    {
      var userPic = [];
      for(var j=0; j<4;j++)
      {
        userPic.push(config.Upyun + "defaultcommentimage/" + util.getDefaultImg()); 
      }
      success_groupPic['userPic'] = userPic;
      success_groupPic['success'] = true;

      fictitiousPic.push(success_groupPic);
    }

    for(var k=0; k<10;k++)
    {
      var userPic = [];
      for (var j = 0; j < 4; j++) {
        if (j == 3) {
          userPic.push('../../../iconImages/icon_question_mark.png');
        } else {
          userPic.push(config.Upyun + "defaultcommentimage/" + util.getDefaultImg());
        }
      }

      var num = Math.floor(Math.random() * (0 - 99) + 99);
      var dic = fictitiousPic[num];
      dic.userPic = userPic;
      dic.success = false;

      // fictitiousPic[num] = dic;

      // fictitiousPic[num].userPic = userPic;
      // fictitiousPic[num].success = false;
    }

    total_micro_second = 10*60*1000;
    this.countdown();
    this.setData({
      swiperlist: fictitiousPic
    })
  },
  //拼团倒计时
  countdown: function () {
    var that = this;

    that.dateformat(total_micro_second);
    if (total_micro_second <= 0 || this.data.load_timer == false) {

      //时间截至
      that.setData({
        clock_hr: "00",
        clock_min: "00",
        clock_ss: "00",
        isShowOpenGroup: false,
        openGroup_outTime: '00' + ':' + '00' + ':' + '00'
      });
      return;
    }

    countdownTimer=setTimeout(function () {
      total_micro_second -= 1000;
      that.countdown();
    }, 555)
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
    var openGroup_outTime = hr + ':' + min + ':' + sec;

    that.setData({
      clock_hr: hr,
      clock_min: min,
      clock_ss: sec,
      openGroup_outTime: openGroup_outTime,
    });
  },

  invitFriendTap: function () {
    wx.navigateTo({
      url: '../fightDetail/fightDetail?' + "code=" + this.data.open_roll_code + "&isFromDetail=" + true,
    })
  },
  fictitiousinvitFriendTap:function(){
    var that = this;
    wx.showLoading({ title: '请稍后', mask: true, })
    setTimeout(function () {
      wx.hideLoading();
      that.showToast('该团已满',2000);
    }, 1000);
  },
  getRcommendTitleData: function () {
    var basesData = wx.getStorageSync("shop_tag_basedata");
    var titleDataTemp = [];
    var recommendTitleData = [];
    if (basesData) {
      titleDataTemp = basesData.data.shop_type;
    }
    if (titleDataTemp) {
      for (var i = 0; i < titleDataTemp.length; i++) {
        if (titleDataTemp[i].parent_id == 0 && titleDataTemp[i].is_show == 1) {
          var str = (titleDataTemp[i].ico).split(',')[0];
          var str1 = str.split('/')[2].split('.')[0];
          titleDataTemp[i]['link'] = this.data.Upyun + 'small-iconImages/zzq/' + str1;
          recommendTitleData.push(titleDataTemp[i]);
        }
      }
    }
    var by = function (name) { //数组排序函数
      return function (o, p) {
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
          a = parseInt(o[name]);
          b = parseInt(p[name]);
          if (a === b) {
            return 0;
          }
          if (typeof a === typeof b) {
            return a < b ? -1 : 1;
          }
          return typeof a < typeof b ? -1 : 1;
        } else {
          throw ("error");
        }
      }
    }
    recommendTitleData.sort(by("sequence"));
    this.setData({
      recommendTitleData: recommendTitleData,
    })
    if (recommendTitleData.length > 0) {
      this.data.recommend_type_name = recommendTitleData[0].type_name;
      this.data.recommend_type1 = recommendTitleData[0].id;
    }

  },
  dealBackData(flag, data) { //处理接口返回的数据
    var that = this;
    if (flag == 0) {
      console.log('^^^^^^^^^^^^^^^^^^^^^^详情数据=' + data);

      if (data.status != 1) {
        this.setData({
          noDataFlag: true
        });
        this.showToast(data.message, 2000);
      } else {
        this.setData({
          noDataFlag: false
        });
        if (shop_type != 2 && shop_type != 3) {
          that.data.topData[2].name = '评价(' + data.eva_count + ')';
          this.setData({
            eva_count: data.eva_count
          });
        }
        var path = "detail?shop_code=" + data.shop.shop_code;

        //查询该件商品是否加过喜好
        var shop_like = false;
        var shop_likeimage = "shop_newaddunlike";
        var like_id = data.like_id;
        if (like_id) {
          shop_like = like_id == that.data.shop_code ? true : false;
          shop_likeimage = like_id == that.data.shop_code ? "shop_newaddlike" : "shop_newaddunlike";
        }

        that.setData({
          postlist: data,
          shop: data.shop,
          shop_name: data.shop.shop_name,
          shop_pic: data.shop.shop_pic,
          // eva_count: data.eva_count,
          // zeroOrderNum: data.zeroOrderNum,
          topData: that.data.topData,
          shop_attr: data.shop.shop_attr,
          shopAttrData: data.attrList,
          strShopTag: data.shop.shop_tag,
          returnOneText: data.returnOneText,
          // returnTwoText: data.vipFreeText,
          // wxcx_shop_group_price: data.shop.wxcx_shop_group_price,
          wxcx_shop_group_price: data.shop.assmble_price,
          oneyuanValue: data.shop.wxcx_shop_group_price,
          contactMsgPaht: path,
          showShopData: true,
          memberdiscount: data.discount != undefined ? data.discount : '',
          shop_likeimage: shop_likeimage,
          shop_like: shop_like,
          assmble_price: data.shop.assmble_price,
          delivery_time: data.shop.advance_sale_days,
        })

        this.cutShopCode();
        this.ForDight();
        this.getImagePath();
        this.getShopAttrData();
        this.getShopTagData();
        this.toshareData(false);

        // var animation2 = wx.createAnimation({
        //   duration: 1000,
        //   timingFunction: 'ease',
        // })
        // animation2.translateX(-50).opacity(1).step()
        // that.setData({
        //   animationData: animation2.export()
        // })
        setTimeout(function () {
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
            xuanfu_animationData: animation.export()
          })
        }, 2000);

        setTimeout(function () {
          that.setData({
            isShowCustomTv: false,
          });
        }, 8000);
      }
      // this.get_discountHttp();
      this.oneYuan_httpData();
      this.queryMultipleNodes();
    } else if (flag == 1) {
      var dealData = that.dateFormat(data.comments);
      for (var i = 0; i < dealData.length; i++) {
        var pic = dealData[i].pic;
        var picData = [];
        if (pic != null && '' != pic) {
          picData = pic.split(",");
          dealData[i]['pic_data'] = picData;
        }
        try {
          if (dealData[i].suppComment != undefined && dealData[i].suppComment != null) {
            dealData[i]['frist_replay'] = (dealData[i].suppComment)[0].supp_content;
          }
          if (dealData[i].suppEndComment != undefined && dealData[i].suppEndComment != null) {
            dealData[i]['second_replay'] = (dealData[i].suppEndComment)[0].supp_content;
          }
          if (dealData[i].comment != undefined && dealData[i].comment != null) {
            dealData[i]['second_judge'] = (dealData[i].comment)[0].content;
            var pic2 = (dealData[i].comment)[0].pic;
            var picData2 = [];
            if (pic2 != null && '' != pic2 && pic2 != undefined) {
              picData2 = pic2.split(",");
              dealData[i]['pic_data2'] = picData2;
            }
          }
        } catch (e) {

        }
      }
      that.setData({
        evaluateData: dealData,
      })
    } else if (flag == 2) {
      that.data.stockTypeData = data.stocktype;
      // this.getStockTypeSizeColor();
      this.getNewStockTypeSizeColor();
    } else if (flag == 3) {
      var sharePicLink;
      if (data.data == undefined || data.data.pic == undefined) {
        sharePicLink = that.data.Upyun + "small-iconImages/zzq/icon_share_defalut.png";
      } else {
        sharePicLink = that.data.Upyun + data.data.pic;
      }
      that.setData({
        sharePicLink: sharePicLink,
      })
    } else if (flag == 4) { //获取分享文案
      that.data.shareJson = data.wxcx_wxdddfx.title;
    } else if (flag == 5) { //获取推荐列表
      if (data.status == 1) {
        var isVip = data.isVip != undefined ? data.isVip : '';
        // this.data.is_vipPage = isVip;

        if (this.data.recommendPage == 1) {
          this.data.recommendListData = [];
        }
        var page = this.data.recommendPage + 1;
        this.data.recommendPage = page;
        this.newshoplist(data.listShop);
      } else {
        this.showToast(data.message, 2000);
      }
      this.data.recommendLoadFlag = true;
    } else if (flag == 6) { //开关，控制zhuanqian入口
      // console.log("%%%%%%%%%%%%%%", data)
      if (data.data == 0) {
        // var paymoney = (this.data.shop.shop_se_price - this.data.reduceMoney).toFixed(1);

        var paymoney = this.get_discountPrice(this.data.shop.shop_se_price, this.data.reduceMoney);
        var rawardMoney = this.data.shop.shop_se_price * 0.5 > 50 ? 50 : this.data.shop.shop_se_price * 0.5;
        this.setData({
          isSignClose: true,
          bottomBtnTv: (paymoney > 0 ? paymoney : 0.01),
          bottomBtnTv1: '赚￥' + rawardMoney.toFixed(1),
        })
      } else {
        if (this.data.isShareFlag) {
          this.setData({
            isShowRedPacked: true
          })
        }
      }
    }
  },
  newshoplist: function (obj) {
    for (var i = 0; i < obj.length; i++) {
      var new_clde = obj[i].shop_code.substr(1, 3);
      var new_pic = new_clde + '/' + obj[i].shop_code + '/' + obj[i].def_pic;
      obj[i].def_pic = new_pic;
      var shop_se_price = 0.0;
      if (this.data.isNewUserFlag) {
        // shop_se_price = ((obj[i].shop_se_price) * (this.data.shop.shop_rebate) * 1).toFixed(0);
        shop_se_price = ((obj[i].shop_se_price) * 1).toFixed(0);
      } else {
        shop_se_price = (obj[i].shop_se_price).toFixed(1);
      }
      var newshopname = obj[i].shop_name;
      if (newshopname.length > 24) {
        newshopname = '... ' + newshopname.substr(newshopname.length - 24, 24);
      }
      if (this.data.currentTab == 0) {
        var discount;
        if (this.data.isNewUserFlag) {
          // discount = ((obj[i].shop_se_price) * (this.data.shop.shop_rebate) * 1 / obj[i].shop_price * 10).toFixed(0);

          discount = ((obj[i].shop_se_price) * 1 / obj[i].shop_price * 10).toFixed(0);
        } else {
          discount = (obj[i].shop_se_price / obj[i].shop_price * 10).toFixed(1);
          obj[i].shop_price = (obj[i].shop_price * 1).toFixed(1);
        }

        obj[i]["discount"] = discount;
      }
      if (this.data.isNewUserFlag) {
        obj[i].shop_price = (obj[i].shop_price * 1).toFixed(0);
      } else {
        obj[i].shop_price = (obj[i].shop_price * 1).toFixed(1);
      }
      obj[i].shop_name = newshopname;
      obj[i].shop_se_price = shop_se_price;

      //何波修改2018-4-4
      if (oneYuanData == 0) //是1元购
      {
        var se_price = (obj[i].assmble_price * 1).toFixed(1);
        if (this.data.is_vipPage == 1) //如果是会员界面 列表价格=单独购买价-抵扣价格
        {
          // se_price = obj[i].shop_se_price - this.data.reduceMoney > 0 ? (obj[i].shop_se_price - this.data.reduceMoney) : '0.0';

          se_price = this.get_discountPrice(obj[i].shop_se_price, this.data.orangereduceMoney);
        }

        obj[i].shop_price = obj[i].shop_se_price;
        obj[i].shop_se_price = (se_price * 1).toFixed(1);
      } else {
        obj[i].shop_se_price = shop_se_price;
        obj[i].supp_label = '';
      }
    }
    var all_shoplists = this.data.recommendListData;
    for (var j = 0; j < obj.length; j++) {
      all_shoplists.push(obj[j]);
    }
    this.setData({
      recommendListData: all_shoplists,
    })
  },
  queryMultipleNodes() {
    const that = this
    setTimeout(() => {
      wx.createSelectorQuery().select('.shop-detail-out').fields({
        dataset: true,
        size: true,
        scrollOffset: true,
        properties: ['scrollX', 'scrollY']
      }, function (res) {
        that.setData({
          detailHeight: res.height
        })
        console.log("res.height", that.data.detailHeight);
      }).exec()
    }, 300)

  },
  getTopAdData: function () { //获取顶部广告轮播数据
    var that = this;
    // 循环N次生成随机数 
    for (var i = 0; i < 1000; i++) {
      // 只生成4个随机数 
      if (that.data.getRandomTempData.length < 4) {
        that.generateRandom();
      } else {
        break;
      }
    }
    for (var i = 0; i < that.data.getRandomTempData.length; i++) {
      that.data.adData.push(that.data.adDataAll[that.data.getRandomTempData[i]])
    }
    this.setData({
      adData: that.data.adData,
    });
  },
  // 生成随机数的方法 
  generateRandom: function () {
    var that = this;
    var rand = parseInt(Math.random() * 11);
    for (var i = 0; i < that.data.getRandomTempData.length; i++) {
      if (that.data.getRandomTempData[i] == rand) {
        return;
      }
    }
    that.data.getRandomTempData.push(rand);
  },
  handletouchStart: function (event) {
    this.data.startDis = event.touches[0].clientY;
  },
  handletouchmove: function (event) {

    console.log('event', event)
    let pageX = event.touches[0].pageX;
    let pageY = event.touches[0].clientY;
    var temp = pageY - this.data.startDis;
    if (temp != 0) {
      this.data.fristDistance = this.data.fristDistance + temp;
    }


    //屏幕边界判断
    if (pageX < 30 || pageY < 30)
      return;
    if (pageX > this.data.screenWidth - 30)
      return;
    if (pageY > this.data.screenHeight - 30)
      return;
    this.setData({
      ballTop: event.touches[0].pageY - 30,
      ballLeft: event.touches[0].pageX - 30,
    });
  },

  getShopTagData: function () { //获得商品标签的数据
    // shopTagData
    var that = this;
    var arrTemp = [];
    var arrTag = [];
    var strTemp = '';
    arrTag = this.data.strShopTag.split(',');
    var shopTagAll = [];
    shopTagAll = wx.getStorageSync("shop_tag_basedata").data.shop_tag;
    for (var i = 0; i < arrTag.length; i++) {
      for (var j = 0; j < shopTagAll.length; j++) {
        if (arrTag[i] == shopTagAll[j].id) {
          if (shopTagAll[j].tag_name.endsWith('含)')) {
            if ('10' == shopTagAll[j].parent_id) {
              strTemp = "主面料成份含量:" + shopTagAll[j].tag_name;
            } else {
              strTemp = "羽绒服充绒量:" + shopTagAll[j].tag_name;
            }

          } else {
            arrTemp.push(shopTagAll[j]);
          }
          break;
        }
      }
    }
    var fristShortTag = '';
    if (arrTemp.length > 0) {
      if (strTemp) {
        fristShortTag = arrTemp[0].tag_name;
        arrTemp.shift();
      }
    }
    this.setData({
      shopTagData: arrTemp,
      strLongTag: strTemp,
      fristShortTag: fristShortTag
    })
    // var by = function (name) {//数组排序函数
    //   return function (o, p) {
    //     var a, b;
    //     if (typeof o === "object" && typeof p === "object" && o && p) {
    //       a = parseInt(o[name]);
    //       b = parseInt(p[name]);
    //       if (a === b) { return 0; }
    //       if (typeof a === typeof b) { return a < b ? -1 : 1; }
    //       return typeof a < typeof b ? -1 : 1;
    //     }
    //     else { throw ("error"); }
    //   }
    // }
    // arrTemp.sort(by("sequence"));
  },
  showShopStock: function (colorId, sizeId) { //显示商品的库存
    var that = this;
    var dataTemp = [];
    dataTemp = that.data.stockTypeData;
    if (colorId != -1 && sizeId != -1) {
      for (var i = 0; i < dataTemp.length; i++) {
        var color_size = "";
        if (colorId) {
          color_size = colorId;
        }
        if (sizeId) {
          color_size = colorId + ":" + sizeId;
        }
        var sType = dataTemp[i];
        if (sType.color_size == color_size) {

          var stock = sType.stock;
          var price = sType.price;

          var shopPic = that.data.Upyun + that.data.shop.shop_code.substring(1, 4) + '/' + that.data.shop.shop_code + '/' + that.data.shop.def_pic;
          var image = '';
          if (shop_type == 2 || shop_type == 3) {
            image = sType.attr_pic ? (that.data.picLink + sType.attr_pic) : shopPic;
          } else {
            image = sType.pic ? (that.data.picLink + sType.pic) : shopPic;
          }

          that.data.stock_type_id = sType.id;
          if (that.data.isOneYuanClick) //1元购
          {
            // var se_price = app.globalData.oneYuanValue;
            var se_price = that.data.wxcx_shop_group_price;
            price = (se_price * 1).toFixed(1);
            if (app.globalData.oneYuanFree > 0) //新用户0元购
            {
              price = '0.0';
            }
          } else {

            if (that.data.isActiveShop == true) {
              price = price;
            } else {
              // price = (price * that.data.shop_deduction - that.data.reduceMoney > 0) ? (price * that.data.shop_deduction - that.data.reduceMoney).toFixed(1) : 0.00;

              price = that.get_discountPrice(price, that.data.reduceMoney);

            }
          }
          that.setData({
            stockCount: stock,
            stockPrice: price,
            stockImage: image
          })

          break;
        }
      }
    }
  },
  getStockTypeSizeColor: function () { //得到该商品的颜色和尺码
    var that = this;
    var dataTemp = [];
    dataTemp = that.data.stockTypeData;
    var arrColorList = [];
    var arrSizeList = [];
    var arrNameList = [];
    var selectIndexs = [];
    var selectColor_SizeIds = [];

    var colorIds = [];
    var listPic = [];
    var sizeIds = [];
    var shopAttrData = that.data.shopAttrData;
    for (var i = 0; i < dataTemp.length; i++) {
      var sType = dataTemp[i];
      var color_size = sType.color_size;
      var arrColorSize = color_size.split(":");
      //根据id查询颜色名字
      for (var j = 0; j < shopAttrData.length; j++) {
        if (arrColorSize[0] == shopAttrData[j].id) { //查询颜色
          var flag = false;
          for (var z = 0; z < arrColorList.length; z++) { //如果有则不加入
            if (shopAttrData[j].attr_name == arrColorList[z].name) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            var jsons = {};
            jsons['name'] = shopAttrData[j].attr_name;
            jsons['parent_id'] = shopAttrData[j].parent_id;
            jsons['id'] = arrColorSize[0];
            arrColorList.push(jsons);
            colorIds.push(arrColorSize[0]);
            if (sType.pic == undefined) {
              listPic.push(that.data.picLink + that.data.shop.def_pic)
            } else {
              listPic.push(that.data.picLink + sType.pic);
            }
          }
          break;
        }

        var flagSizeId = false;
        for (var g = 0; g < sizeIds.length; g++) { //添加尺码id
          if (arrColorSize[1] == sizeIds[g]) {
            flagSizeId = true;
            break;
          }
        }
        if (!flagSizeId) {
          sizeIds.push(arrColorSize[1]);
        }
      }
    }
    if (arrColorList.length > 0) {
      that.data.selectColorId = arrColorList[0].id;
    }

    sizeIds.sort(function (a, b) {
      return a - b;
    })
    if (sizeIds.length > 0) {
      that.data.selectSizeId = sizeIds[0];
    }
    for (var i = 0; i < sizeIds.length; i++) {
      for (var j = 0; j < shopAttrData.length; j++) {
        if (sizeIds[i] == shopAttrData[j].id) { //查询尺码
          var jsons = {};
          jsons['name'] = shopAttrData[j].attr_name;
          jsons['parent_id'] = shopAttrData[j].parent_id;
          jsons['id'] = sizeIds[i];
          if (jsons['name'] && jsons['id']) {
            arrSizeList.push(jsons)
          }
          break;
        }
      }
    }

    //根据属性值查找属性名
    var dataList = [arrColorList, arrSizeList];
    for (var l = 0; l < dataList.length; l++) {
      var list = dataList[l];
      for (var k = 0; k < list.length; k++) {
        var parent_id = list[k].parent_id;
        var findflag = false;
        for (var j = 0; j < shopAttrData.length; j++) {
          var id = shopAttrData[j].id;
          var name = shopAttrData[j].attr_name;
          if (id == parent_id) {
            arrNameList.push(name);
            selectIndexs.push('');
            selectColor_SizeIds.push('');
            findflag = true;
            break;
          }
        }
        if (findflag == true) {
          break;
        }
      }
    }
    this.setData({
      stockColorData: arrColorList,
      stockSizeData: arrSizeList,
      stockPicData: listPic,
      stockNameData: arrNameList,
      selectIndexs: selectIndexs,
      selectColor_SizeIds: selectColor_SizeIds
    });
    // this.showShopStock(that.data.selectColorId, that.data.selectSizeId);
    this.showNewShopStock(that.data.selectIndexs, that.data.selectColor_SizeIds);
  },


  showNewShopStock: function (selectIndexs, selectColor_sizeIds) { //显示商品的库存
    var that = this;
    var dataTemp = [];
    dataTemp = that.data.stockTypeData;
    if (selectColor_sizeIds.length > 0) {
      for (var i = 0; i < dataTemp.length; i++) {
        var color_size = selectColor_sizeIds.join(':');
        var sType = dataTemp[i];
        if (sType.color_size == color_size) {

          var stock = sType.stock;
          var price = sType.price;
          var stock_shop_se_price = sType.price;
          var shopPic = that.data.Upyun + that.data.shop.shop_code.substring(1, 4) + '/' + that.data.shop.shop_code + '/' + that.data.shop.def_pic;
          var image = '';
          if (shop_type == 2 || shop_type == 3) {
            image = sType.attr_pic ? (that.data.picLink + sType.attr_pic) : shopPic;
          } else {
            image = sType.pic ? (that.data.picLink + sType.pic) : shopPic;
          }

          that.data.stock_type_id = sType.id;
          if (that.data.isOneYuanClick) //点击1元购
          {
            var se_price = this.data.wxcx_shop_group_price;
            price = (se_price * 1).toFixed(1);
            if (app.globalData.oneYuanFree > 0) //新用户0元购
            {
              price = '0.0';
            }
          } else {

            if (that.data.isActiveShop == true) {
              price = price;
            } else if (that.data.isShowJoinGroup || that.data.is_vip == 0 || that.data.isKT)//开团或者参团的价格
            {
              price = that.data.fightbottomOneBtnTv;
            }
            else {
              // price = that.get_discountPrice(that.data.shop.shop_se_price, that.data.reduceMoney);
              price = that.get_discountPrice(price, that.data.reduceMoney);
            }
          }

          that.setData({
            stockCount: stock,
            stockPrice: price,
            stockImage: image,
            stock_shop_se_price: stock_shop_se_price,
          })
          break;
        }
      }
    }
  },
  getNewStockTypeSizeColor: function () { //得到该商品的颜色和尺码
    var that = this;
    var dataTemp = [];
    dataTemp = that.data.stockTypeData;
    var arrColorList = [];
    var arrSizeList = [];

    var arrNameList = [];
    var arrNameIds = [];
    var arrTitleNameList = [];
    var arrTitleNameIds = [];
    var selectIndexs = [];
    var selectColor_SizeIds = [];
    var arrColor_SizeList = [];
    var arrColor_SizeIds = [];

    var colorIds = [];
    var listPic = [];
    var sizeIds = [];
    var shopAttrData = that.data.shopAttrData;
    for (var i = 0; i < dataTemp.length; i++) {
      var sType = dataTemp[i];
      var color_size = sType.color_size;
      var arrColorSize = color_size.split(":");
      var color_sizeList = [];
      var color_sizeIds = [];

      //根据id查询颜色名字
      for (var k = 0; k < arrColorSize.length; k++) {
        for (var j = 0; j < shopAttrData.length; j++) {
          if (arrColorSize[k] == shopAttrData[j].id) { //查询颜色
            var flag = false;
            for (var z = 0; z < color_sizeList.length; z++) { //如果有则不加入
              if (shopAttrData[j].attr_name == color_sizeList[z].name) {
                flag = true;
                break;
              }
            }
            if (!flag) {
              var jsons = {};
              jsons['name'] = shopAttrData[j].attr_name;
              jsons['parent_id'] = shopAttrData[j].parent_id;
              jsons['id'] = arrColorSize[k];

              var color_sizeflag = false;
              for (var m = 0; m < arrColor_SizeList.length; m++) {
                var json1 = arrColor_SizeList[m];
                if (jsons['id'] == json1['id']) {
                  color_sizeflag = true;
                  break;
                }
              }
              if (!color_sizeflag) {
                arrColor_SizeList.push(jsons);
              }

              var color_sizeIdflag = false;
              for (var n = 0; n < arrColor_SizeIds.length; n++) {
                var id = arrColor_SizeIds[n];
                if (id == arrColorSize[k]) {
                  color_sizeIdflag = true;
                  break;
                }
              }
              if (!color_sizeIdflag) {
                arrColor_SizeIds.push(arrColorSize[k]);
              }

              if (shop_type == 2 || shop_type == 3) //特价
              {
                if (sType.attr_pic == undefined) {
                  listPic.push(that.data.picLink + that.data.shop.def_pic)
                } else {
                  listPic.push(that.data.picLink + sType.attr_pic);
                }
              } else {
                if (sType.pic == undefined) {
                  listPic.push(that.data.picLink + that.data.shop.def_pic)
                } else {
                  listPic.push(that.data.picLink + sType.pic);
                }
              }

            }
            break;
          }
        }
      }
    }

    //根据属性值查找属性名
    for (var l = 0; l < arrColor_SizeList.length; l++) {
      var parent_id = arrColor_SizeList[l].parent_id;
      var findflag = false;

      for (var j = 0; j < shopAttrData.length; j++) {
        var id = shopAttrData[j].id;
        var name = shopAttrData[j].attr_name;
        if (id == parent_id) {
          findflag = true;
          var findNameFlag = false;
          for (var k = 0; k < arrNameList.length; k++) {
            if (name == arrNameList[k]) {
              findNameFlag = true
              break;
            }
          }
          if (!findNameFlag) {
            arrNameList.push(name);
            arrNameIds.push(id);
          }
        }
        if (findflag == true) {
          break;
        }
      }
    }

    var Color_SizeList = [];
    for (var k = 0; k < arrNameIds.length; k++) {
      var arrlist = [];
      var id = arrNameIds[k];
      for (var l = 0; l < arrColor_SizeList.length; l++) {
        var parent_id = arrColor_SizeList[l].parent_id;
        if (parent_id == id) {
          arrlist.push(arrColor_SizeList[l]);
        }
      }
      Color_SizeList.push(arrlist);
      selectIndexs.push('0');
      selectColor_SizeIds.push(arrlist[0].id);
    }

    //查找属性标题
    for (var m = 0; m < arrNameIds.length; m++) {
      var nameid = arrNameIds[m];
      for (var n = 0; n < shopAttrData.length; n++) {
        var id = shopAttrData[n].id;
        if (nameid == id) {
          arrTitleNameList.push(shopAttrData[n].attr_name);
          arrTitleNameIds.push(id);
          break;
        }
      }
      if (arrTitleNameList.length <= 0) {
        arrTitleNameList.push('');
      }
    }

    this.setData({
      colorIndex: 0,
      stockColorData: arrColorList,
      stockSizeData: arrSizeList,
      stockColorSizeData: Color_SizeList,
      stockPicData: listPic,
      stockNameData: arrTitleNameList,
      stockTitleNameData: arrTitleNameList,
      selectIndexs: selectIndexs,
      selectColor_SizeIds: selectColor_SizeIds,
      spaceName: "占"
    });

    // this.showShopStock(that.data.selectColorId, that.data.selectSizeId);
    this.showNewShopStock(that.data.selectIndexs, that.data.selectColor_SizeIds);
  },
  getShopAttrData: function () { //获得该商品属性数据(参数里尺码参考)
    var that = this;
    var str = [];
    var sizeData1 = [];
    str = that.data.shop_attr.split("_");
    for (var i = 0; i < str.length; i++) {
      var strson = str[i].split(",");
      sizeData1.push(strson);
    }
    var rows = 0;
    if (sizeData1.length == 0) {
      return;
    }
    var sizeData2 = [];
    for (var i = 0; i < sizeData1.length; i++) {
      var strTemp = sizeData1[i];
      if (strTemp[0] == '501') {
        sizeData2.push(strTemp);
        var len = strTemp.length;
        if (len > rows) {
          rows = len;
        }
      }
    }
    rows = rows - 2;
    var lSize = parseInt(rows / 5);
    var mond = rows % 5;
    if (mond > 0) {
      lSize = lSize + 1;
    }
    var p = 1;
    // var strFenGe = "分割";
    var sizeDataNew = [];
    for (var i = 0; i < lSize; i++) {
      for (var j = 0; j < sizeData2.length; j++) {
        var strY = sizeData2[j];
        var str = new Array(6);
        str[0] = strY[1];
        var len = strY.length;

        if ((5 * p - 3) < len) {
          str[1] = strY[(5 * p - 3)];
        }
        if ((5 * p - 2) < len) {
          str[2] = strY[(5 * p - 2)];
        }
        if ((5 * p - 1) < len) {
          str[3] = strY[(5 * p - 1)];
        }
        if ((5 * p) < len) {
          str[4] = strY[5 * p];
        }
        if ((5 * p + 1) < len) {
          str[5] = strY[5 * p + 1];
        }

        sizeDataNew.push(str);

      }
      p++;
      // if (i != lSize - 1) {
      //   sizeDataNew.push(strFenGe);
      // }
    }

    var arrLast = [];
    for (var i = 0; i < sizeDataNew.length; i++) { //属性每行循环
      var arrTemp1 = [];
      var arr = sizeDataNew[i];
      for (var j = 0; j < arr.length; j++) { //单行对应的属性名

        var id = arr[j];
        var flag = false;
        for (var z = 0; z < that.data.shopAttrData.length; z++) { //根据id查询属性名
          if (id == that.data.shopAttrData[z].id) {
            flag = true;
            arrTemp1.push(that.data.shopAttrData[z].attr_name)
            break;
          }
        }
        if (!flag) { //如果没有查到对应的属性名字，添加一个空字符串
          arrTemp1.push('null')
        }
      }
      if (arrTemp1.length > 1 && '' != arrTemp1[1]) {
        arrLast.push(arrTemp1);
      }
    }
    this.setData({
      sizeData: arrLast
    });
  },
  getImagePath: function () { //获得商品详情页详情的图片集合
    var that = this;
    var imagePathData = that.data.shop_pic.split(',');
    for (var i = 0; i < imagePathData.length; i++) {
      if (imagePathData[i]) {
        if (imagePathData[i].indexOf("reveal_") >= 0 || imagePathData[i].indexOf("real_") >= 0 || imagePathData[i].indexOf("detail_") >= 0) {
          that.data.imagePathData.push(imagePathData[i])
        }
      }
    }
    this.setData({
      imagePathData: that.data.imagePathData,
    })
  },


  touchMove: function (e) {
    if (!this.data.isRecommendFix && !this.data.isFixFlag && this.data.isShareFlag) {
      this.setData({
        isSHowAdFlag: false
      })
    }
  },
  touchEnd: function (e) {
    if (!this.data.isRecommendFix && !this.data.isFixFlag && this.data.isShareFlag) {
      this.setData({
        isSHowAdFlag: true
      })
    }
  },
  // 页面里的点击  ---start
  upperlimittap: function () { //新用户弹窗关闭
    this.setData({
      isNewUserShow: false
    })
  },
  upperlimittap: function () { //跳去赚钱
    this.setData({
      isNewUserShow: false
    })
    wx.redirectTo({
      url: "../../sign/sign?firstLogin=true",
    })
  },
  recommendShopItemClick: function (event) { //推荐商品条目点击
    var path = '';
    var shopcode = event.currentTarget.dataset.shop_code;
    if (this.data.isNewUserFlag) {
      path = '../detail/detail?' + "shop_code=" + shopcode + '&isNewUserFlag=' + this.data.isNewUserFlag;
    } else {
      path = '../detail/detail?' + "shop_code=" + shopcode;
    }
    wx.redirectTo({
      url: path,
    })
  },
  recommendTitleClick: function (event) { //商品推荐头的点击
    var that = this;
    this.data.currentTab = event.currentTarget.dataset.index;
    var type_name = event.currentTarget.dataset.name;
    var id = event.currentTarget.dataset.id;
    this.data.recommendPage = 1;
    this.data.recommend_type_name = type_name;
    this.data.recommend_type1 = id;
    this.getData(5, function (data) {
      that.dealBackData(5, data)
    })
    this.setData({
      currentTab: this.data.currentTab
    });
  },
  zeroBuyCloseClick: function () { //0元购弹窗上关闭按钮
    this.setData({
      zeroBuyDialogShowFlag: false
    });
  },
  zeroBuyToSign: function () { //0元购弹窗上去赚钱
    wx.redirectTo({
      url: "../../sign/sign",
    })
  },

  zeroBuyNowClick: function () { //0元购弹窗上立即购买
    this.setData({
      zeroBuyDialogShowFlag: false
    });
    var that = this;
    this.setData({
      showDialog: true
    });
    if (that.data.stockTypeData.length == 0) {
      this.getData(2, function (data) {
        that.dealBackData(2, data);
      });
    } else {
      // this.showShopStock(that.data.selectColorId, that.data.selectSizeId);
      this.showNewShopStock(that.data.selectIndexs, that.data.selectColor_SizeIds);
    }
  },

  //单独购买
  buyOrder: function () {
    var that = this;
    var t = that.data.roll_code ? 2 : 1;
    var page3 = 0;
    if (that.data.comefrom == 'sign' && (that.data.shouYePage == 'ThreePage' || that.data.shouYePage == 'FivePage')) {
      page3 = 1;
    }
    //获取会员信息
    util.get_VipUserIfon(that.data.shop_code, t, page3, function (data) {
      if (data.status == 1) {
        var is_buy = data.is_buy != undefined ? data.is_buy : "";
        var vip_type = data.vip_type != undefined ? data.vip_type : "";
        var vip_free = data.vip_free != undefined ? data.vip_free : "";
        var free_page = data.free_page != undefined ? data.free_page : "";
        var isVip = data.isVip != undefined ? data.isVip : "";

        if (that.data.isOneYuanClick) {

          // if (is_buy == 1 && vip_free != 1)//购买会员卡
          // {
          //     if (!that.data.nowDayisDaka)//当天任务没完成引导到赚钱任务
          //     {
          //       that.setData({
          //         guidebecomeMemberImage: '完成任务',
          //         guidebecomeMemberShow: true
          //       })
          //     }else{
          //     var guidebecomeMemberImage = '';
          //     if (that.data.isfreeLingClick) {
          //       guidebecomeMemberImage = '免费领';
          //     } else {
          //       guidebecomeMemberImage = '单独购买';
          //     }
          //     that.setData({
          //       guidebecomeMemberImage: guidebecomeMemberImage,
          //       guidebecomeMemberShow: true
          //     })
          //   }
          // } else {
          //   if (vip_type > 0 || vip_free == 1)// > 0会员卡级别正常或者有会员免费领
          //   {
          //     that.setData({
          //       showDialog: true
          //     });
          //     if (that.data.stockTypeData.length == 0) {
          //       that.getData(2, function (data) {
          //         that.dealBackData(2, data);
          //       });
          //     } else {
          //       that.showNewShopStock(that.data.selectIndexs, that.data.selectColor_SizeIds);
          //     }
          //   } else {// <0会员卡级别失效

          //       if (!that.data.nowDayisDaka)//当天任务没完成引导到赚钱任务
          //       {
          //         that.setData({
          //           guidebecomeMemberImage: '完成任务',
          //           guidebecomeMemberShow: true
          //         })
          //       }else{
          //           wx.navigateTo({
          //             url: '../../mine/addMemberCard/addMemberCard?memberComefrom=' + 'detail' + "&vip_type=" + vip_type,
          //           })
          //       }
          //   }
          // }

          //2020-2-13 最新修改
          // if (that.data.task_freeling != 'freeling')//如果是免费领任务直接去免费领
          // {
          //   if (isVip == 1)//如果是会员先去完成当天任务再去免费领 非会员直接免费领
          //   {
          //     if (!that.data.nowDayisDaka)//当天任务没完成引导到赚钱任务
          //     {
          //       that.setData({
          //         guidebecomeMemberImage: '完成任务',
          //         guidebecomeMemberShow: true
          //       })
          //       return;
          //     }
          //   } else {//非会员先分享4次再购买
          //     if (that.data.isFreelingShareCount > 0) {
          //       that.setData({
          //         isShowShare: true,
          //       })
          //       return;
          //     }
          //   }
          // } else {//是免费领任务 非会员先分享4次再购买，会员直接免费领
          //   if (isVip == 0)
          //   {
          //     if (that.data.isFreelingShareCount > 0) {
          //       that.setData({
          //         isShowShare: true,
          //       })
          //       return;
          //     }
          //   }
          // }

          //免费领分享完后去下单
          if (that.data.isFreelingShareCount > 0) {
            that.getShareShop(function (success) {
              if (success) {
                that.setData({
                  isShowShare: true,
                  isFreelingShareFlag: true
                })
              }
            });
            return;
          }

          // if (vip_free == 1 || vip_type >0 )//免费领
          // {
          //   that.setData({
          //     showDialog: true
          //   });
          //   if (that.data.stockTypeData.length == 0) {
          //     that.getData(2, function (data) {
          //       that.dealBackData(2, data);
          //     });
          //   } else {
          //     that.showNewShopStock(that.data.selectIndexs, that.data.selectColor_SizeIds);
          //   }
          // }else{
          //   if(vip_type < 0 || is_buy == 1)//会员等级不够
          //   {
          //     wx.navigateTo({
          //       url: '../../mine/addMemberCard/addMemberCard?memberComefrom=' + 'detail' + "&vip_type=" + vip_type,
          //     })
          //   }
          // }

          that.setData({
            showDialog: true
          });
          if (that.data.stockTypeData.length == 0) {
            that.getData(2, function (data) {
              that.dealBackData(2, data);
            });
          } else {
            that.showNewShopStock(that.data.selectIndexs, that.data.selectColor_SizeIds);
          }

        } else {

          //每个用户只限一次参团
          if (that.data.is_twice == 1 && that.data.isShowJoinGroup)//再次参团
          {
            if ((that.data.is_vip > 0 && that.data.is_vip != 3)||(that.data.is_vip == 3 &&that.data.max_vipType == 4))//是会员
            {
              that.showToast('每个会员仅限参团1次特价团哦。', 2000);
            } else {
              that.setData({
                guidebecomeMemberImage: '特价参团',
                guidebecomeMemberShow: true
              })
            }
          }else{//单独购买 或者参团
            that.setData({
              showDialog: true
            });
            if (that.data.stockTypeData.length == 0) {
              that.getData(2, function (data) {
                that.dealBackData(2, data);
              });
            } else {
              that.showNewShopStock(that.data.selectIndexs, that.data.selectColor_SizeIds);
            }
          }
        }
        that.setData({
          vip_type: vip_type,
          free_page: free_page
        })
      } else {
        that.showToast(data.message, 2000);
      }

    })
  },

  moneyDiscountClick: function () { //余额抵扣点击
    this.setData({
      moneyDiscountShowFlag: true,
      oneYuanDiscriptionTitle: "余额抵扣说明",
      moneyDiscount: this.data.moneyDiscount,
      reduceMoney: this.data.reduceMoney,
    })
  },
  //余额抵扣弹窗点击去赚余额 关闭
  getMoneyBtn: function () {
    this.setData({
      moneyDiscountShowFlag: false
    })
    wx.navigateTo({
      url: "../../sign/sign",
    })
  },
  //余额抵扣弹窗点击查看余额 关闭
  getYueBtn: function () {
    wx.navigateTo({
      url: '../../mine/wallet/wallet',
    })
    this.setData({
      moneyDiscountShowFlag: false
    })
  },
  closeYiDouBtn: function () {
    this.setData({
      moneyDiscountShowFlag: false,
      moneyTixianShowFlag: false,
      shareDiscriptionShow: false
    })
  },
  closeGogoTab: function () {
    this.setData({
      shareDiscriptionShow: false
    })
  },
  //资金明细
  zijingmingxiBtn: function () {
    wx.navigateTo({
      url: '../../mine/wallet/accountDetail/accountDetail?activityIndex=3',
    })
    this.setData({
      moneyTixianShowFlag: false
    })
  },
  //成为会员
  becomeMenberBtn: function () {
    wx.navigateTo({
      url: '../../mine/addMemberCard/addMemberCard'
    })
    this.setData({
      moneyTixianShowFlag: false
    })
  },
  //计算抵扣后价格
  get_discountPrice: function (before_price, reduceMoney) {

    var after_price = before_price * 1;

    //首页2 首页3 首页4 不参与抵扣
    if (this.data.shouYePage == "TwoPage") {
      after_price = Number(after_price - reduceMoney) > 0 ? (after_price - reduceMoney) : 0.0;
    } else {
      if (Number(this.data.shop_deduction) > 0 && Number(this.data.shop_deduction * after_price) <= Number(reduceMoney)) {
        if (this.data.max_vipType == 6)//至尊会员打95折
        {
          after_price = after_price * (1 - this.data.shop_deduction - 0.05);
        } else {
          after_price = after_price * (1 - this.data.shop_deduction);
        }

      } else {
        if (this.data.max_vipType == 6)//至尊会员打95折
        {
          after_price = Number(after_price * 0.95 - reduceMoney) > 0 ? (after_price * 0.95 - reduceMoney) : 0.0;
        } else {
          after_price = Number(after_price - reduceMoney) > 0 ? (after_price - reduceMoney) : 0.0;
        }
      }
    }
    after_price = Number(after_price) >= 0 ? after_price : 0.0;

    return after_price.toFixed(1);
  },
  //获取可抵扣余额
  get_discountHttp: function () {
    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var oldurl = config.Host + 'order/getZeroOrderDeductible?' + config.Version + '&token=' + token;
    util.http(oldurl, that.discount_data);
  },

  discount_data: function (data) {
    if (data.status == 1) {
      var money = data.one_not_use_price.toFixed(2);

      var reduceMoney = Number(money) > Number(this.data.shop.shop_se_price) ? this.data.shop.shop_se_price : money;
      var shop_deduction = Number(data.shop_deduction) > 1 ? 1.0 : data.shop_deduction;

      var discount_reduceMoney = Number(this.data.shop.shop_se_price * shop_deduction) < Number(reduceMoney) ? (this.data.shop.shop_se_price * shop_deduction) : reduceMoney;

      if (this.data.shop_type == 3)//特价广告商品最多可抵扣15元 抵扣不满15元一次性抵扣完
      {
        money = Number(money) >= 15 ? 15 : money;
        reduceMoney = money;
      }

      this.setData({
        moneyDiscount: data.order_price.toFixed(1),
        reduceMoney: reduceMoney > 0 ? (reduceMoney * 1).toFixed(2) : '0.0',
        discount_reduceMoney: discount_reduceMoney > 0 ? (discount_reduceMoney * 1).toFixed(2) : '0.0',
        orangereduceMoney: data.one_not_use_price.toFixed(2),
        shop_deduction: shop_deduction,
        is_open: data.is_open != undefined ? data.is_open : 0,
        max_vipType: data.maxType
      })

    } else {
      this.setData({
        moneyDiscount: '0.0',
        reduceMoney: '0.0',
        shop_deduction: '0.9'
      })
    }

    if (oneYuanData == 0) //1元购
    {
      var returnOneText = ((this.data.roll_code.length > 0 && this.data.rnum > 0 && this.data.SurplusTime > 0 && !this.data.is_redHongBao) ? "一键参团" : this.data.returnOneText);
      var returnTwoText = this.data.returnTwoText ? this.data.returnTwoText : (this.data.wxcx_shop_group_price * 1).toFixed(1);

      //是否是0元购
      if (app.globalData.oneYuanFree > 0) { //新用户0元购
        var rawardMoney = this.data.shop.shop_se_price * 0.5 > 50 ? 50 : this.data.shop.shop_se_price * 0.5;
        // var bottomOneYuan = (this.data.shop_type == 2 || this.data.shop_type == 3) ? false : true;
        this.setData({
          bottomOneYuan: true,
          bottomBtnTv: this.data.shop.shop_se_price,
          bottomBtnTv1: '赚￥' + rawardMoney.toFixed(1),
          bottomOneBtnTv: returnTwoText,
          bottomOneBtnTv1: returnOneText,
          fightbottomOneBtnTv: this.data.assmble_price != undefined ? this.data.assmble_price : '',
          shop_se_price: this.data.shop_se_price,
          shop_price: (this.data.shop.shop_price * 1).toFixed(1),
        });
      } else {


        var paymoney = this.get_discountPrice(this.data.shop.shop_se_price, this.data.reduceMoney);
        var rawardMoney = this.data.shop.shop_se_price * 0.5 > 50 ? 50 : this.data.shop.shop_se_price * 0.5;
        var spacetitle = this.data.shop_type == 3 ? "疯抢" : "";
        var bottomBtnTvTitle = (paymoney > 0 ? paymoney : '0.0');
        var shareRawardMoney = (this.data.shop.shop_se_price * 0.1).toFixed(1);
        // var bottomOneYuan = (this.data.shop_type == 2 || this.data.shop_type == 3) ? false : true;


        var shop_price; var shop_se_price;
        if (this.data.is_vipPage == 1)//会员界面
        {
          shop_se_price = (paymoney > 0) ? (paymoney * 1).toFixed(1) : '0.0';
          shop_price = (this.data.shop.shop_price * 1).toFixed(1);
        } else {
          shop_se_price = this.data.shop_se_price;
          shop_price = (this.data.shop.shop_price * 1).toFixed(1);
        }

        this.setData({
          spacetitle: spacetitle,
          bottomOneYuan: true,
          bottomBtnTv: bottomBtnTvTitle,
          bottomBtnTv1: '赚￥' + rawardMoney.toFixed(1),
          bottomOneBtnTv: returnTwoText,
          bottomOneBtnTv1: returnOneText,
          fightbottomOneBtnTv: this.data.assmble_price != undefined ? this.data.assmble_price:'',
          shareRawardMoney: shareRawardMoney,
          shop_se_price: shop_se_price,
          shop_price: shop_price,
        });


      }
    } else {

      var paymoney = this.get_discountPrice(this.data.shop.shop_se_price, this.data.reduceMoney);
      var rawardMoney = this.data.shop.shop_se_price * 0.5 > 50 ? 50 : this.data.shop.shop_se_price * 0.5;
      var bottomTitle = "";
      if (this.data.isActiveShop) {
        paymoney = this.data.shop_se_price;
        bottomTitle = "立即购买";
      } else {
        bottomTitle = '赚￥' + rawardMoney.toFixed(1);
      }

      var shop_price; var shop_se_price;
      if (this.data.is_vipPage == 1)//会员界面
      {
        shop_se_price = (paymoney > 0) ? (paymoney * 1).toFixed(1) : '0.0';
        shop_price = (this.data.shop.shop_price * 1).toFixed(1);
      } else {
        shop_se_price = this.data.shop_se_price;
        shop_price = (this.data.shop.shop_price * 1).toFixed(1);
      }

      var spacetitle = this.data.shop_type == 3 ? "疯抢" : "";
      var bottomBtnTvTitle = (paymoney > 0 ? paymoney : '0.0');

      this.setData({
        spacetitle: spacetitle,
        bottomOneYuan: false,
        bottomBtnTv: bottomBtnTvTitle,
        bottomBtnTv1: bottomTitle,

        shop_se_price: shop_se_price,
        shop_price: shop_price,
      });

    }
  },

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
  rawardMoney_data: function (data) {
    var that = this;
    var is_pop = data.is_pop != undefined ? data.is_pop : 0;
    var draw = data.draw != undefined ? data.draw : 0;
    //会员奖励金弹窗
    if (is_pop > 0 && app.globalData.moneyTixianShowCount == 0) {
      that.setData({
        moneyTixianShowFlag: true,
        rawardMoney: draw,
        oneYuanDiscriptionTitle: data.is_pop == 2 ? '奖励金清0' : '恭喜您',
      })
      app.globalData.moneyTixianShowCount += 1;
    }
  },
  // btnLeftClick: function () {//余额抵扣弹窗点击知道了
  //   this.setData({ moneyDiscountShowFlag: false })
  // },
  // btnRightClick: function () {//余额抵扣弹窗点击去赚钱
  //   wx.redirectTo({
  //     url: "../../sign/sign",
  //   })// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
  // },

  suppClick: function () { //供应商的点击

    wx.redirectTo({
      url: '../../listHome/brandsDetail/brandsDetail?' +
        "class_id=" + this.data.shop.supp_label_id +
        "&navigateTitle=" + this.data.shop.supp_label
    })


  },
  signBottomAdCloseClick: function () {
    this.setData({
      isShowSignBottomAd: false
    })
  },
  // redPackeClick: function () {//悬浮红包
  //   if (this.data.isShareFlag) {
  //     wx.redirectTo({
  //       url: "../../sign/sign",
  //     })
  //     return;
  //   }
  //   var that = this;
  //   if (null == this.data.token) {
  //     util.toAuthorizeWx(function (isSuccess) {
  //       if (isSuccess) {
  //         if (app.globalData.user != null) {
  //           that.data.token = app.globalData.user.userToken;
  //         }
  //         publicUtil.getBalanceNum(function (isSHow) {
  //           if (isSHow) {
  //             that.data.isShowRedPacked = true;
  //           } else {
  //             that.data.isShowRedPacked = false;
  //           }
  //           that.setData({ isShowRedPacked: that.data.isShowRedPacked });
  //         });
  //       } else {
  //         return;
  //       }
  //     });
  //   } else {
  //     wx.navigateTo({
  //       url: '../../sign/withdrawLimit/withdrawLimit?isBalanceLottery=true',
  //     })
  //   }
  // },

  toInviteFriendsClick: function () { //跳转到邀请好友
    var that = this;
    this.setData({
      isShowShare: false
    })
    var share_pic = '';
    if (this.data.shop.four_pic) {
      var picArray = this.data.shop.four_pic.split(',');
      if (picArray.length > 2) {
        share_pic = picArray[2] + '!450';
      } else {
        share_pic = this.data.shop.def_pic + '!450';
      }
    } else {
      share_pic = this.data.shop.def_pic + '!450';
    }
    wx.navigateTo({
      url: 'inviteFriends/invite?title=' + that.data.shareTitle + '&link=' + that.data.picLink + share_pic + '&shop_code=' + that.data.shop.shop_code,
    })
  },
  openSignClick: function () { //打开赚钱页
    wx.redirectTo({
      url: "../../sign/sign",
    }) // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
  },

  clickOneShare: function () { //1元购分享
    this.setData({
      isOneShowShare: true,
    })
    this.top_shopHttp();
  },
  cancelOneShare: function (e) { //取消1元购分享
    this.setData({
      isOneShowShare: false
    })
    // util.httpPushFormId(e.detail.formId);
  },

  //获取二级类目
  top_shopHttp: function () {
    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var oldurl = config.Host + 'shop/queryShopType2?' + config.Version + '&token=' + token + '&shop_code=' + that.data.shop_code;
    util.http(oldurl, that.type_data);
  },
  type_data: function (data) {
    if (data.status == 1) {
      this.setData({
        type_data: data.type2
      })

      var supp_label = '衣蝠';
      if (this.data.shop.supp_label) {
        supp_label = this.data.shop.supp_label;
      }

      var sharemoney = app.globalData.oneYuanFree > 0 ? '0' : this.data.wxcx_shop_group_price;

      var shareJson = '快来' + this.data.wxcx_shop_group_price + '元拼' + '【' + supp_label + '正品' + data.type2 + '】,' + '专柜价' + this.data.shop.shop_se_price + '元!';
      if (shop_type == 2 || shop_type == 3) {
        shareJson = '快来' + this.data.wxcx_shop_group_price + '元拼' + '【' + this.data.shop.shop_name + '】,' + '原价' + this.data.shop.shop_se_price + '元!';
      }
      this.data.shareTitle = shareJson;

      this.setData({
        isOneShowMoney: sharemoney
      })
    }
  },

  clickShare: function () { //分享按钮
    buttonClcik = 1;
    if (app.globalData.user) {
      this.toshareData(false);
    }
  },
  toshareData: function (share) {
    var shareJson = this.data.shareJson;
    var supp_label = '衣蝠';
    if (this.data.shop.supp_label) {
      supp_label = this.data.shop.supp_label;
    }
    var str1 = shareJson.replace('\$\{replace\}', this.data.shop_se_price);
    var str2 = str1.replace('\$\{replace\}', supp_label);
    var str3 = str2.replace('\$\{replace\}', '' + this.data.shop.shop_name);
    var str4 = str3.replace('\$\{replace\}', '' + this.data.shop_se_price);
    this.data.shareTitle = str4;

    this.setData({
      isShowShare: share
    })

    this.top_shopHttp();
  },
  confirmShare: function (e) { //确认分享
    
    var other_userid = e.detail.value.message;
    this.setData({
      isShowShare: false,
      other_userid: other_userid,
      isFreelingShareFlag:true
    })
  },
  cancelShare: function (e) { //取消分享按钮
    this.setData({
      isShowShare: false
    })
    formId = e.detail.formId;
    if (app.globalData.user != null) {
      util.httpPushFormId(e.detail.formId);
    }
  },

  selectClick: function (e) {
    formId = e.detail.formId;
    if (app.globalData.user != null) {
      util.httpPushFormId(e.detail.formId);
    }
  },
  selectColorClick: function (event) { //选择颜色
    var that = this;
    const index = event.currentTarget.dataset.index;
    this.setData({
      colorIndex: index,
      selectColorId: event.currentTarget.dataset.id
    })
    this.showShopStock(that.data.selectColorId, that.data.selectSizeId);
  },
  selectSizeClick: function (event) { //选择尺寸
    var that = this;
    const index = event.currentTarget.dataset.index;
    this.setData({
      sizeIndex: index
    })
    this.showShopStock(that.data.selectColorId, that.data.selectSizeId);
  },

  //选择尺寸和颜色2018-5-24
  selectColorSizeClick: function (event) {
    var that = this;
    const stockindex = event.currentTarget.dataset.stockindex;
    const index = event.currentTarget.dataset.index;

    var selectIndexs = that.data.selectIndexs;
    var selectColor_SizeIds = that.data.selectColor_SizeIds;
    selectIndexs[stockindex] = index;
    selectColor_SizeIds[stockindex] = event.currentTarget.dataset.id;

    this.setData({
      colorIndex: index,
      selectIndexs: selectIndexs,
      selectColor_SizeIds: selectColor_SizeIds
    })
    this.showNewShopStock(that.data.selectIndexs, that.data.selectColor_SizeIds);
  },


  toBuyClick: function () { //立即购买
    var that = this;
    buttonClcik = 2;
    that.setData({
      isOneYuanClick: false,
      isfreeLingClick: false,
    });


    //单独购买
    if(!that.data.isKT && !that.data.task_freeling != 'freeling' && that.data.is_vip >0)
    {
      that.setData({
        isOnlyBuyClick: true
      })
    }


    if (app.globalData.user && app.globalData.user.userToken != undefined) {
      
      //查询是否有前置20次抽奖
      util.newuser_luckdraw_query(function (data) {
        if (data.status == 1) {
          if (data.data.is_finish == 1 && that.data.first_diamond == 0) {//虚拟抽奖
            var comefrom = that.data.roll_code.length > 8 ? 'freeFight_style' : 'freeFight_style';
            wx.navigateTo({
              url: '/pages/sign/sign?comefrom=' + comefrom
            })
          } else {
            if (that.data.isNewUserFlag) {
              if (that.data.isOreadyToken) { //已经登录
                wx.redirectTo({
                  url: "../../sign/sign?firstLogin=true",
                })

              } else {
                util.toAuthorizeWx(function (isSuccess) {
                  if (isSuccess) {
                    that.data.isOreadyToken = true;
                    if (app.globalData.user && app.globalData.user.userToken && !app.globalData.user.firstLogin) {
                      wx.redirectTo({
                        url: "../../sign/sign?firstLogin=true",
                      })
                    }
                  } else {
                    return;
                  }
                });
              }
              return;
            }

            if (that.data.isSignClose) {
              that.setData({
                showDialog: true
              });
              if (that.data.stockTypeData.length == 0) {
                that.getData(2, function (data) {
                  that.dealBackData(2, data);
                });
              } else {

                that.showNewShopStock(that.data.selectIndexs, that.data.selectColor_SizeIds);

              }
            } else {
              that.gotobuy();
            }
          }
        }
      })

    } else {

      //查看用户是否授权
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) { //授权过
            //授权成功去登录
            wx.showLoading({ title: '请稍后', mask: true, })
            setTimeout(function () { wx.hideLoading(); }, 10000)

            app.New_userlogin(function (data) {
              wx.hideLoading();
              if (app.globalData.user && app.globalData.user.userToken == undefined && app.globalData.channel_type == 1){
                that.showToast('不符合条件', 2000);
              }

            });
          }
        }
      })
    }
  },

  //首页
  gotabshouye: function () {
    wx.switchTab({
      url: '../shouye',
    })
  },
  //我的最爱
  gotabwode: function () {
    // wx.switchTab({
    //   url: '../../mine/mine',
    // })
    buttonClcik = 4;
    if (!shop_likeClick) {
      var shop_likeurl = this.data.shop_like ? 'like/delLike?' : 'like/addLike?';
      var shop_like = this.data.shop_like;
      var shop_likeimage = this.data.shop_like ? 'shop_newaddunlike' : 'shop_newaddlike';
      var that = this;
      util.handle_shoplike(shop_likeurl, that.data.shop_code, function (data) {
        if (data.status == 1) {
          if (!shop_like) {
            that.xuanfuHongBaoAnimation();
          } else {
            setTimeout(function () {
              shop_likeClick = false;
            }, 3000);

            that.showToast('不再喜欢此宝贝', 2000);
          }

          that.setData({
            shop_like: !shop_like,
            shop_likeimage: shop_likeimage
          })
        }
      });
    }
  },

  //红包缩放动画
  hongBaoAnimation: function () {
    var circleCount = 0;
    // 心跳的外框动画  
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 1000, // 以毫秒为单位  
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
    }.bind(this), 1000);
  },
  //加喜欢动画
  xuanfuHongBaoAnimation: function () {
    var that = this;
    shop_likeClick = true;
    that.setData({
      is_showShopAnimation: true
    })

    xuanfuanimationMiddleHeaderItem = wx.createAnimation({
      duration: 2000, // 以毫秒为单位  
      timingFunction: 'linear',
      delay: 10,
      transformOrigin: '50% 50%',
      success: function (res) {
        console.log("***************************");
      }
    });

    setTimeout(function () {
      xuanfuanimationMiddleHeaderItem.scale(1.5).step({
        duration: 500
      }).scale(1.0).step({
        duration: 500
      }).scale(0.0).step({
        duration: 1000
      });

      that.setData({
        xuanfuanimationMiddleHeaderItem: xuanfuanimationMiddleHeaderItem.export() //输出动画
      });
    }.bind(that), 0)

    setTimeout(function () {
      shop_likeClick = false;
      clearInterval(xuanfuanimationMiddleHeaderItem);
      that.setData({
        xuanfuanimationMiddleHeaderItem: '',
        is_showShopAnimation: false
      })
    }, 2500);
  },
  oneBuyClick: function (e) { //1元购买

    var that = this;
    buttonClcik = 3;
    if (e != undefined) {
      that.data.currentTargetclick = e.currentTarget.dataset.click;
    }

    //当是点击会员免费领时 商品属性框不展示价格
    var isfreeLingClick = (that.data.currentTargetclick != "fightClick") ? true : false;
    if (that.data.returnTwoText == '会员免费领' || that.data.returnTwoText == '免费参团') {
      isfreeLingClick = true;
    }

    that.setData({
      isOneYuanClick: true,
      isfreeLingClick: isfreeLingClick,
      isOnlyBuyClick:false,
      buyCount: '1',
    });

    
    if (app.globalData.user && app.globalData.user.userToken != undefined) {
      var that = this;

      //如果是大促弹引导进入首页的框
      if (that.data.showendofpromotionDialog) {
        that.setData({
          pagestyle: 2,
          channelHongbaoNewuserShow: true
        })
        return;
      }
    
      //查询是否有前置20次抽奖
      util.newuser_luckdraw_query(function (data) {
        if (data.status == 1) {
          if (data.data.is_finish == 1 && that.data.first_diamond==0) {//虚拟抽奖
            var comefrom = that.data.roll_code.length > 8 ? 'freeFight_style' : 'detail_style';
            wx.navigateTo({
              url: '/pages/sign/sign?comefrom=' + comefrom
            })
          } else {
            if (!that.data.firstredHongbaoNewuserShow) {
              that.gotobuy();
            }
          }
        }
      })

    } else {

      //查看用户是否授权
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) { //授权过
            //授权成功去登录
            wx.showLoading({ title: '请稍后', mask: true, })
            setTimeout(function () { wx.hideLoading(); }, 10000)

            app.New_userlogin(function (data) {
              wx.hideLoading();
              if (app.globalData.user && app.globalData.user.userToken == undefined && app.globalData.channel_type == 1) {
                that.showToast('不符合条件', 2000);
              }

            });
          }
        }
      })
    }
  },
  gotobuy: function () {
    var that = this;

    if (that.data.roll_code.length > 8) {
      var userid = "";
      if (app.globalData.user != null) {
        userid = app.globalData.user.user_id;
      }
      if (that.data.fightUserid == userid && that.data.fightUserid && userid) {
        if (that.data.rnum == 0 || that.data.SurplusTime <= 0) {
          that.buyOrder(); //过期了重新开团
        } else{
          that.showToast('团长不能参与自己的团哦！', 2000);
        }
          
      } else {

        //查询是否有虚拟抽奖
        util.newuser_luckdraw_query(function (data) {
          if (data.status == 1) {
            if (that.data.is_finish == 1 && that.data.first_diamond == 0) {//虚拟抽奖
              wx.navigateTo({
                url: '/pages/sign/sign?comefrom=' + 'freeFight_style'
              })
              return;
            } 
          }
          that.buyOrder();//参团
        })
      }
    } else
      that.buyOrder();
  },
  closeClick: function (e) {
    formId = e.detail.formId;
    util.httpPushFormId(formId);
    this.closeSkuDialog();
  },
  closeSkuDialog: function () { //关闭立即购买弹窗
    //chushihua shuju
    var that = this;
    if (that.data.stockColorData.length > 0) {
      that.data.selectColorId = that.data.stockColorData[0].id;
    } else {
      that.data.selectColorId = '';
    }
    if (that.data.stockSizeData.length > 0) {
      that.data.selectSizeId = that.data.stockSizeData[0].id;
    } else {
      that.data.selectSizeId = '';
    }
    if (that.data.stockColorSizeData.length > 0) {
      for (var k = 0; k < that.data.selectColor_SizeIds.length; k++) {
        that.data.selectColor_SizeIds[k] = that.data.stockColorSizeData[k][0].id;
        that.data.selectIndexs[k] = 0;
      }
    }

    this.setData({
      showDialog: false,
      selectColorId: that.data.selectColorId,
      selectSizeId: that.data.selectSizeId,
      colorIndex: 0,
      sizeIndex: 0,
      selectColor_SizeIds: that.data.selectColor_SizeIds,
      selectIndexs: that.data.selectIndexs
    });
  },

  btnReduceClick: function () { //购买数量减

    var that = this;
    that.data.buyCount = that.data.buyCount - 1;
    if (that.data.buyCount < 1) {
      that.data.buyCount = 1;
    }
    this.setData({
      buyCount: that.data.buyCount
    });

  },
  btnAddClick: function () { //购买数量加
    var that = this;
    if (this.data.stockCount > that.data.buyCount) {
      if (!this.data.isOneYuanClick) {
        that.data.buyCount = that.data.buyCount + 1;
      }
    } else {
      this.showToast('库存不足！', 3000);
    }
    if (that.data.buyCount > 2) {
      that.data.buyCount = 2;
      this.showToast('抱歉，数量有限，最多只能购买两件噢！', 3000);
    } else if (this.data.isOneYuanClick) {
      that.data.buyCount = 1;
      this.showToast('1元购单次只能选择1件哦~', 3000);
    }
    this.setData({
      buyCount: that.data.buyCount
    });
  },
  onTapClick: function (event) { //详情、参数、评价的切换
    var thiscopy;
    thiscopy = this;
    const index = event.currentTarget.dataset.index;
    if (thiscopy.data.activityIndex == index) {
      return;
    }

    this.setData({
      activityIndex: index
    });
    if (index == 2) {
      // this.loadProgress();
      this.setProgress();
      var that = this;
      if (that.data.curPage == 1 && that.data.evaluateData.length == 0) {
        that.getData(1, function (data) {
          that.dealBackData(1, data)
        });
      }
    }
  },
  // 页面里的点击   ----end
  dateFormat: function (data) {
    var that = this;
    for (var i = 0; i < data.length; i++) {
      var date = that.getMyDate(data[i].add_date);
      data[i].add_date = date;

      if (data[i].comment_type == 1) {
        data[i].comment_type = '好评';
      } else if (data[i].comment_type == 2) {
        data[i].comment_type = '中评';
      } else if (data[i].comment_type == 3) {
        data[i].comment_type = '差评';
      }
    }
    return data;
  },
  // 切割字符串并添加新字段
  cutShopCode: function () {
    var thiscopy;
    thiscopy = this;
    var shop_code_cut = '';
    shop_code_cut = thiscopy.data.shop.shop_code.substring(1, 4);
    thiscopy.data.shop["cut_shop_code"] = shop_code_cut;
    var link = thiscopy.data.Upyun + shop_code_cut + '/' + thiscopy.data.shop.shop_code + '/';
    var bigImage = thiscopy.data.Upyun + shop_code_cut + '/' + thiscopy.data.shop.shop_code + '/' + thiscopy.data.shop.def_pic;

    thiscopy.setData({
      shop: thiscopy.data.shop,
      picLink: link,
      bigImage: bigImage
    })
    this.getCanvasPictiure();
  },

  // 设置进度条
  setProgress: function () {
    var that = this;
    if (that.data.postlist.eva_count == '0') {
      this.setData({
        progress_color: "100",
        progress_type: '100',
        progress_work: '100',
        progress_cost: '100',
      });
    } else {
      var color_count = that.data.postlist.color_count * 100;
      var type_count = that.data.postlist.type_count * 100;
      var work_count = that.data.postlist.work_count * 100;
      var cost_count = that.data.postlist.cost_count * 100;
      var eva_count = that.data.postlist.eva_count;
      var color = color_count / eva_count > 100 ? 100 : color_count / eva_count;
      var progress_type = type_count / eva_count > 100 ? 100 : type_count / eva_count;
      var work = work_count / eva_count > 100 ? 100 : work_count / eva_count;
      var cost = cost_count / eva_count > 100 ? 100 : cost_count / eva_count;

      this.setData({
        progress_color: parseInt(color),
        progress_type: parseInt(progress_type),
        progress_work: parseInt(work),
        progress_cost: parseInt(cost),
      });
    }
  },
  //获得年月日      得到日期oTime  
  getMyDate: function (str) {
    var oDate = new Date(str);
    var oYear = oDate.getFullYear();
    var oMonth = oDate.getMonth() + 1;
    var oDay = oDate.getDate();
    // oHour = oDate.getHours(),
    // oMin = oDate.getMinutes(),
    // oSen = oDate.getSeconds(),
    var oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay); //最后拼接时间  
    return oTime;
  },
  //补0操作  
  getzf: function (num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  },
  // 四舍五入 Dight要格式化的 数字，How要保留的小数位数。
  ForDight: function () { //Dight, How
    var that = this;
    var shop_se_price;
    if (this.data.isSignActiveShop) {
      shop_se_price = that.data.shop.shop_se_price;
    } else {
      if (this.data.isNewUserFlag) {
        // shop_se_price = that.data.shop.shop_se_price * that.data.shop.shop_rebate;
        shop_se_price = that.data.shop.shop_se_price;
      } else {
        shop_se_price = that.data.shop.shop_se_price;
      }

    }
    var shop_price = that.data.shop.shop_price * 1;
    if (this.data.isNewUserFlag) {
      that.data.shop_se_price = (shop_se_price * 1).toFixed(0);
      that.data.shop_price = shop_price.toFixed(0);
      that.data.discount = (shop_se_price * 10 / shop_price).toFixed(0);

      if (oneYuanData == 0) //1元购
      {
        // var se_price = app.globalData.oneYuanValue;
        var se_price = this.data.wxcx_shop_group_price;
        that.data.shop_se_price = (se_price * 1).toFixed(1);
        that.data.shop_price = (shop_se_price * 1).toFixed(1);

        if (app.globalData.oneYuanFree > 0) //新用户0元购
        {
          that.data.shop_se_price = '0.0';
        }
      } else {
        that.data.shop_se_price = (shop_se_price * 1).toFixed(1);
        that.data.shop_price = shop_price.toFixed(1);

      }
      that.data.discount = (shop_se_price * 10 / shop_price).toFixed(1);

      console.log('价格=' + that.data.shop_se_price + '||' + that.data.shop_price);
    } else {

      if (oneYuanData == 0) //1元购
      {
        // var se_price = app.globalData.oneYuanValue;
        var se_price = this.data.wxcx_shop_group_price;
        that.data.shop_se_price = (se_price * 1).toFixed(1);
        that.data.shop_price = (shop_se_price * 1).toFixed(1);

        if (app.globalData.oneYuanFree > 0) //新用户0元购
        {
          that.data.shop_se_price = '0.0';
        }

      } else {
        that.data.shop_se_price = (shop_se_price * 1).toFixed(1);
        that.data.shop_price = shop_price.toFixed(1);
      }
      that.data.discount = (shop_se_price * 10 / shop_price).toFixed(1);
    }

    var reduceMoney = that.data.reduceMoney > that.data.shop_price ? that.data.shop_price : that.data.reduceMoney;
    console.log('价格=' + that.data.shop_se_price + '||' + that.data.shop_price);
    var save_money = ((shop_price - shop_se_price) * 1).toFixed(1);
    this.setData({
      // shop_se_price: that.data.shop_se_price,
      // shop_price: (that.data.shop.shop_price * 1).toFixed(1),
      discount: that.data.discount,
      detaildiscount: that.data.memberdiscount > 0 ? that.data.memberdiscount : that.data.discount,
      reduceMoney: (reduceMoney * 1).toFixed(1),
      save_money: save_money,
    })
    // return Dight;
  },
  onReady: function () {
    if (this.data.isShareFlag) {
      this.setData({
        isShowSignBottomAd: true,
        isSHowAdFlag: true,
      })
    }
    // 页面渲染完成  
    // this.loadProgress();
    // this.setProgress();
    // this.getScrollOffset();

  },
  getScrollOffset: function () {
    wx.createSelectorQuery().selectViewport().scrollOffset(function (res) {
      // res.id      // 节点的ID
      // res.dataset // 节点的dataset
      // res.scrollLeft // 节点的水平滚动位置
      // res.scrollTop  // 节点的竖直滚动位置
      console.log("res.scrollTop", res.id)
    }).exec()
  },
  getRect: function () {
    var that = this;
    wx.createSelectorQuery().select('.bottom-image-pic').boundingClientRect(function (rect) {
      // rect.id      // 节点的ID
      // rect.dataset // 节点的dataset
      // rect.left    // 节点的左边界坐标
      // rect.right   // 节点的右边界坐标
      // rect.top     // 节点的上边界坐标
      // rect.bottom  // 节点的下边界坐标
      // rect.width   // 节点的宽度
      // rect.height  // 节点的高度
      // console.log("rect.top", rect.top)
      // console.log("rect.height", rect.height) 
      if (rect.top <= -rect.height) {
        if (that.data.isFixFlag == false && that.data.isRecommendFix == false) {
          that.setData({
            isFixFlag: true,
            isSHowAdFlag: false,
          })
        }
      } else {
        if (that.data.isFixFlag == true && that.data.isRecommendFix == false) {
          that.setData({
            isFixFlag: false,
            // isSHowAdFlag: true,
          })
        }
      }
    }).exec()
  },
  getRect2: function () {
    var that = this;
    wx.createSelectorQuery().select('.shop-recommend-tv').boundingClientRect(function (rect) {
      if (rect.top <= -rect.height) { //-rect.height
        if (that.data.isRecommendFix == false) {
          that.setData({
            isRecommendFix: true,
            isFixFlag: false,
            isSHowAdFlag: false,
          })
        }
      } else {
        if (that.data.isRecommendFix == true) {
          that.setData({
            isRecommendFix: false,
            isFixFlag: false,
            // isSHowAdFlag: true,
          })
        }
      }
    }).exec()
  },
  onScroll: function (e) {
    this.getRect();
    this.getRect2();
  },
  getData: function (flag, fun) { //flag:0，详情接口1;1，评论接口;2，商品属性接口
    wx.showNavigationBarLoading();
    var thiscopy;
    thiscopy = this;
    var requestUrl = config.Host;
    var that = this;
    if (null != app.globalData.user && app.globalData.user != undefined) {
      token = app.globalData.user.userToken;
    }
    thiscopy.setData({
      token: token
    });

    if (flag == 0) { //详情接口
      if (null != thiscopy.data.token) {
        requestUrl = requestUrl + 'shop/query?token=' + thiscopy.data.token;
        requestUrl = requestUrl + "&code=" + this.data.shop_code + this.data.Version;
        console.log("详情接口**********" + requestUrl);
        util.httpNeedLogin(requestUrl, function (data) {
          fun(data);
        }, function () {
          that.getData(0, function (data) {
            that.dealBackData(0, data);
          });
        })
        return;
      } else {
        requestUrl = requestUrl + 'shop/queryUnLogin?';
        requestUrl = requestUrl + "&code=" + this.data.shop_code + this.data.Version;
      }
    } else if (flag == 1) { //评论接口

      requestUrl = requestUrl + "shopComment/selCommentByShop?" + this.data.Version + "&page=" + this.data.curPage + "&rows=" + this.data.pageSize + "&shop_code=" + this.data.shop_code;
    } else if (flag == 2) { //商品属性接口 
      requestUrl = requestUrl + "shop/queryAttr?shop_code=" + this.data.shop_code + this.data.Version + "&find=false"
    } else if (flag == 3) { //分享商品图
      requestUrl = requestUrl + 'initiateApp/queryShareLifePic?' + this.data.Version;
    } else if (flag == 5) { //推荐列表

      if (token != undefined && token != '') {
        requestUrl = requestUrl + "shop/queryConUnLogin?" + this.data.Version + "&pager.curPage=" + this.data.recommendPage + "&pager.pageSize=30" + "&type1=" + this.data.recommend_type1 + "&type_name=" + this.data.recommend_type_name + '&token=' + token;
      } else {
        requestUrl = requestUrl + "shop/queryConUnLogin?" + this.data.Version + "&pager.curPage=" + this.data.recommendPage + "&pager.pageSize=30" + "&type1=" + this.data.recommend_type1 + "&type_name=" + this.data.recommend_type_name;
      }
    } else if (flag == 6) { //开关 
      requestUrl = requestUrl + 'cfg/getCurrWxcxType?token=' + this.data.token + this.data.Version;
    } else if (flag == 7) { //特价商品
      if (null != thiscopy.data.token) {
        requestUrl = requestUrl + 'shop/queryPackage?token=' + thiscopy.data.token;
        requestUrl = requestUrl + "&code=" + this.data.shop_code + this.data.Version;
        console.log("详情接口**********" + requestUrl);
        util.httpNeedLogin(requestUrl, function (data) {
          fun(data);
        }, function () {
          that.getData(0, function (data) {
            that.dealBackData(0, data);
          });
        })
        return;
      } else {
        requestUrl = requestUrl + 'shop/queryUnLogin?';
        requestUrl = requestUrl + "&code=" + this.data.shop_code + this.data.Version;
      }
    }
    util.http(requestUrl, function (data) {
      // console.log('--------', data)
      fun(data)
    })

    // wx.request({
    //   url: requestUrl,
    //   // method: 'POST',
    //   data: jsonParames,
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //     // "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   success: function (res) {
    //     wx.hideNavigationBarLoading();
    //     fun(res.data)
    //   }

    // })
  },

  getDataJson: function (flag, fun) { //获取分享文案
    wx.showNavigationBarLoading();
    var thiscopy;
    thiscopy = this;
    var requestUrl = '';
    var jsonParames = {};
    requestUrl = config.Upyun + "paperwork/paperwork.json";
    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = requestUrl + "";

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

    wx.request({
      url: requestUrl,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        app.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
        wx.hideNavigationBarLoading();
        fun(res.data)
      },
      fail: function (error) {
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;

    if ((isForceLook || isForceLookLimit) && that.data.activityIndex == 0) {
      // that.scanFinish();
      if (firstCome) {
        firstCome = false;
        publicUtil.scanFinish(that, isForceLook, isForceLookLimit, singvalue);
      }
    }
    if (that.data.activityIndex == 0) {
      that.getData(5, function (data) {
        that.dealBackData(5, data);
      })
    }
    if (that.data.activityIndex == 2) {
      that.data.curPage = that.data.curPage + 1;
      that.getData(1, function (data) {
        if (data.comments.length == 0) {
          that.data.curPage = that.data.curPage - 1;
        }
        var dealData = that.dateFormat(data.comments);
        for (var i = 0; i < dealData.length; i++) {
          var pic = dealData[i].pic;
          var picData = [];
          try {
            if (pic != null && '' != pic) {
              picData = pic.split(",");
              dealData[i]['pic_data'] = picData;
            }
            if (dealData[i].suppComment != undefined && dealData[i].suppComment != null) {
              dealData[i]['frist_replay'] = (dealData[i].suppComment)[0].supp_content;
            }
            if (dealData[i].suppEndComment != undefined && dealData[i].suppEndComment != null) {
              dealData[i]['second_replay'] = (dealData[i].suppEndComment)[0].supp_content;
            }

            if (dealData[i].comment != undefined && dealData[i].comment != null) {
              dealData[i]['second_judge'] = dealData[i].comment.content;

              var pic2 = (dealData[i].comment)[0].pic;
              var picData2 = [];
              if (pic2 != null && '' != pic2 && pic2 != undefined) {
                picData2 = pic2.split(",");
                dealData[i]['pic_data2'] = picData2;
              }
            }
          } catch (e) {

          }
        }

        var dataTemp = that.data.evaluateData.concat(dealData);
        that.setData({
          evaluateData: dataTemp,
        })

      });
    }

  },
  toLoadMore: function () {
    var that = this;

    if ((isForceLook || isForceLookLimit) && that.data.activityIndex == 0) {
      // that.scanFinish();
      if (firstCome) {
        firstCome = false;
        publicUtil.scanFinish(that, isForceLook, isForceLookLimit, singvalue);
      }
    }
    // recommendLoadFlag: true,
    //   evaluateLoadMore:true,
    if (this.data.recommendLoadFlag && this.data.activityIndex == 0) {
      this.data.recommendLoadFlag = false;
      this.getData(5, function (data) {
        that.dealBackData(5, data);
      })
    }
    if (this.data.evaluateLoadMore && that.data.activityIndex == 2) {
      this.data.evaluateLoadMore = false;
      that.data.curPage = that.data.curPage + 1;
      that.getData(1, function (data) {
        if (data && data.comments) {
          if (data.comments.length == 0) {
            that.data.curPage = that.data.curPage - 1;
          }
          var dealData = that.dateFormat(data.comments);
          for (var i = 0; i < dealData.length; i++) {
            var pic = dealData[i].pic;
            var picData = [];
            try {
              if (pic != null && '' != pic) {
                picData = pic.split(",");
                dealData[i]['pic_data'] = picData;
              }
              if (dealData[i].suppComment != undefined && dealData[i].suppComment != null) {
                dealData[i]['frist_replay'] = (dealData[i].suppComment)[0].supp_content;
              }
              if (dealData[i].suppEndComment != undefined && dealData[i].suppEndComment != null) {
                dealData[i]['second_replay'] = (dealData[i].suppEndComment)[0].supp_content;
              }

              if (dealData[i].comment != undefined && dealData[i].comment != null) {
                dealData[i]['second_judge'] = dealData[i].comment.content;

                var pic2 = (dealData[i].comment)[0].pic;
                var picData2 = [];
                if (pic2 != null && '' != pic2 && pic2 != undefined) {
                  picData2 = pic2.split(",");
                  dealData[i]['pic_data2'] = picData2;
                }
              }
            } catch (e) {

            }
          }


          var dataTemp = that.data.evaluateData.concat(dealData);
          that.setData({
            evaluateData: dataTemp,
          })
        } else {
          that.data.curPage = that.data.curPage - 1;
        }
        that.data.evaluateLoadMore = true;
      });
    }
  },
  loadProgress: function () {
    this.canvasCircular('canvasColor'); //色差
    this.canvasCircular('canvasType'); //版型
    this.canvasCircular('canvasWorkmanship'); //做工
    this.canvasCircular('canvasCostPerformance'); //性价比
  },
  canvasCircular: function (canvasArc) {
    var cxt_arc = wx.createCanvasContext(canvasArc); //创建并返回绘图上下文context对象。  
    var x = 34,
      y = 34,
      lineWidth = 4,
      radius = 30;
    cxt_arc.setLineWidth(lineWidth);
    cxt_arc.setStrokeStyle('#d2d2d2');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath(); //开始一个新的路径  
    cxt_arc.arc(x, y, radius, 0, 2 * Math.PI, false); //设置一个原点(106,106)，半径为100的圆的路径到当前路径  
    cxt_arc.stroke(); //对当前路径进行描边  

    cxt_arc.setLineWidth(lineWidth);
    cxt_arc.setStrokeStyle('#ff3f8b');
    cxt_arc.setLineCap('round');
    cxt_arc.beginPath(); //开始一个新的路径  
    cxt_arc.arc(x, y, radius, -Math.PI * 1 / 2, Math.PI * 1, false);
    cxt_arc.stroke(); //对当前路径进行描边  

    cxt_arc.draw();
  },













  // //浏览X件任务
  // scanFinish: function () {
  //   var that = this;
  //   if (firstCome) {
  //     firstCome = false;
  //     that.setData({ is_look: false });

  //     var signUrl = config.Host + "signIn2_0/signIning" +
  //       "?token=" + token +
  //       "&share=false" +
  //       "&index_id=" + xShop_signIndex +
  //       "&day=" + wx.getStorageSync("SIGN_DAY") + config.Version;

  //     if (isForceLook) {
  //       var forcelookNum = 0;
  //       var forceLookXShopNumKey = xShop_signIndex + "forceLookXShopNum";
  //       var dataString = new Date().toDateString();

  //       forcelookNum = wx.getStorageSync(forceLookXShopNumKey);

  //       if (!forcelookNum || wx.getStorageSync("forcelookNowTime") !== dataString) {
  //         forcelookNum = 0;
  //       }
  //       forcelookNum++;
  //       wx.setStorageSync("forcelookNowTime", dataString);

  //       if (xShop_doNum > 1) {// 需要奖励分多次发放
  //         that.signForceLook(forceLookXShopNumKey, forcelookNum, signUrl);
  //       } else {

  //         if (forcelookNum < singvalue) {
  //           wx.setStorageSync(forceLookXShopNumKey, forcelookNum);
  //           var showText = "再浏览" + (singvalue - forcelookNum) + "件即可完成任务喔~"
  //           that.showToast(showText, 4000);

  //         } else if (forcelookNum >= singvalue) {
  //           that.signForceLook(forceLookXShopNumKey, forcelookNum, signUrl);
  //         }
  //       }
  //     } else if (isForceLookLimit) {

  //       var forcelookLimitNum = 0;
  //       var forceLookLimitXShopNumKey = xShop_signIndex + "forceLookLimitXShopNum";
  //       var dataString = new Date().toDateString();

  //       forcelookLimitNum = wx.getStorageSync(forceLookLimitXShopNumKey);

  //       if (!forcelookLimitNum || wx.getStorageSync("nowTimeForcelookLimit") !== dataString) {
  //         forcelookLimitNum = 0;
  //       }

  //       wx.setStorageSync("nowTimeForcelookLimit", dataString);

  //       if (forcelookLimitNum / singvalue >= xShop_doNum
  //         || xShop_complete) {
  //         //浏览 奖励额度 达到上限
  //         xShop_complete = true;
  //         // wx.showModal({
  //         //   title: "完成浏览任务~",
  //         //   content: "今日的浏览奖励已达上限，记得明天再来。",
  //         //   showCancel: false,
  //         //   confirmColor: "#FF3F8B"
  //         // });
  //         that.setData({
  //           signFinishShow: true,
  //           signFinishDialog: {
  //             top_tilte: "任务完成！",
  //             tilte: "完成浏览任务~",
  //             contentText: "今日的浏览奖励已达上限，记得明天再来。",
  //             leftText: "任务列表",
  //             rigthText: "买买买"
  //           },
  //         });
  //         forcelookLimitNum++;
  //         wx.setStorageSync(forceLookLimitXShopNumKey, forcelookLimitNum);

  //       } else {

  //         if (forcelookLimitNum % singvalue + 1 < singvalue) {
  //           var showText = "再浏览" + (singvalue - (forcelookLimitNum % singvalue + 1)) + "件即可赢得" + xShop_jiangliValue +
  //             "元提现额度,继续努力~"
  //           that.showToast(showText, 4000);
  //           forcelookLimitNum++;
  //           wx.setStorageSync(forceLookLimitXShopNumKey, forcelookLimitNum);

  //         } else if (forcelookLimitNum % singvalue + 1 == singvalue) {
  //           that.signForceLookLimit(forceLookLimitXShopNumKey, forcelookLimitNum, signUrl);
  //         }

  //       }
  //     }

  //   }

  // },

  // signForceLook: function (forceLookXShopNumKey, forcelookNum, signUrl) {
  //   var that = this;
  //   util.http(signUrl, function (data) {
  //     if (data == null || data.status != 1) {
  //       that.showToast(data.message, 3000);
  //       return;
  //     }

  //     wx.setStorageSync(forceLookXShopNumKey, forcelookNum);

  //     if (forcelookNum < singvalue) {//小于要浏览次数
  //       var showText = "浏览完成，奖励" + xShop_jiangliValue + xShop_jiangliName + ",还有" + (singvalue - forcelookNum) + "次浏览机会喔~";
  //       that.showToast(showText, 4000);

  //     } else if (forcelookNum >= singvalue) {//任务完成
  //       xShop_complete = true;
  //       var showText = xShop_jiangliValue * xShop_doNum + xShop_jiangliName + "奖励已经存入账户，赶紧去买买买吧~";
  //       // wx.showModal({
  //       //   title: "完成【" + xShop_shopsName + "】浏览~",
  //       //   content: showText,
  //       //   showCancel: false,
  //       //   confirmColor: "#FF3F8B"
  //       // });
  //       // wx.removeStorageSync(shareXShopNumKey);
  //       that.setData({
  //         signFinishShow: true,
  //         signFinishDialog: {
  //           top_tilte: "任务完成！",
  //           tilte: "完成【" + xShop_shopsName + "】浏览~",
  //           contentText: showText,
  //           leftText: "任务列表",
  //           rigthText: "买买买"
  //         },
  //       });
  //     }
  //   })

  // },

  // signForceLookLimit: function (forceLookLimitXShopNumKey, forcelookLimitNum, signUrl) {
  //   var that = this;

  //   util.http(signUrl, function (data) {

  //     if (data == null || data.status != 1) {
  //       that.showToast(data.message, 3000);
  //       return;
  //     }
  //     var showText = xShop_jiangliValue + "元提现额度已经存入您的余额，再浏览" + singvalue + "件可再赢得" + xShop_jiangliValue + "元提现额度,继续努力~";
  //     that.showToast(showText, 4000);
  //     forcelookLimitNum++;
  //     wx.setStorageSync(forceLookLimitXShopNumKey, forcelookLimitNum);
  //   })
  // },
  scan_tips_know: function () {
    this.setData({
      is_look: true,
      scanTipsShow: false
    });
  },
  dialog_close: function () {
    this.setData({
      signFinishShow: false
    });
  },
  btn_left: function () {
    this.setData({
      signFinishShow: false
    });
  },
  btn_rigth: function () {
    // this.toMainPager();
    this.toSignPager();
  },
  //去首页
  toMainPager: function () {
    wx.switchTab({
      url: '../shouye',
    });
  },

  //去赚钱页面
  toSignPager: function () {
    util.backToSignPager('../../sign/sign');
  },


  // 去下单
  buyToOrder: function (e) {
    var that = this;
    if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
      util.httpPushFormId(e.detail.formId);

      if (this.data.stockCount == 0) {
        that.showToast('库存不足！', 3000);
        return;
      }
      var color = "";
      var size = "";
      var color_size = "";

      // if (this.data.stockColorData.length > 0) {
      //   color = this.data.stockColorData[this.data.colorIndex].name;
      // }
      // if (this.data.stockSizeData.length > 0) {
      //   size = this.data.stockSizeData[this.data.sizeIndex].name;
      // }

      // var color_sizeArr = [color, size];
      // for (var i = 0; i < this.data.stockNameData.length; i++) {
      //   color_size += this.data.stockNameData[i] + ":" + color_sizeArr[i] + " "
      // }

      for (var k = 0; k < this.data.selectColor_SizeIds.length; k++) {
        var index = this.data.selectIndexs[k];
        color_size += this.data.stockNameData[k];
        color_size += ':';
        color_size += this.data.stockColorSizeData[k][index].name;
        color_size += ' ';
      }

      var shopData = {
        stock_type_id: this.data.stock_type_id, //库存id
        // shopPic: this.data.stockPicData[this.data.colorIndex],
        shopPic: this.data.Upyun + this.data.shop.shop_code.substring(1, 4) + '/' + this.data.shop.shop_code + '/' + this.data.shop.def_pic,
        shopCode: this.data.shop_code,
        shopName: this.data.shop.shop_name,
        shopNum: this.data.buyCount,
        color: color,
        size: size,
        color_size: color_size,
        shopOldPrice: this.data.shop.shop_price,
        // shopPrice: this.data.shop.shop_se_price,
        shopPrice: this.data.stock_shop_se_price,
        brander: this.data.shop.supp_label,
        assmble_price: this.data.shop.assmble_price,

      };
      var s = 0;
      var wxcx_shop_group_price = '';
      if (this.data.isActiveShop) {
        s = 2;
      } else if (this.data.isOneYuanClick) //1元购
      {
        s = (app.globalData.oneYuanFree > 0) ? 9 : 10;
        wxcx_shop_group_price = this.data.wxcx_shop_group_price;
      }

      var isTM = (shop_type == 2 || shop_type == 3) ? "0" : "0"; //1特价商品 2普通商品
      var isTM_Advertisement = shop_type == 3 ? true : false;
      var isTM_shoptype = isTM_Advertisement ? 'page4shop' : '';
      var vip_free = Number(this.data.ordervip_free) > 0 ? '1' : '0';
      wx.setStorageSync('shopData', shopData);
      if (this.data.isOneYuanClick) {//拼团疯抢

        if (this.data.roll_code) {//参团

          var url = '../../listHome/order/confirmFight/confirmFight?' + 'buyType=' + s + '&wxcx_shop_group_price=' + wxcx_shop_group_price + "&roll_code=" + this.data.roll_code + "&isTM=" + isTM + "&isFirst=" + this.data.isFirst + "&isNew=" + this.data.isNew + "&is_redHongBao=" + this.data.is_redHongBao + '&vip_type=' + this.data.vip_type + '&vip_free=' + vip_free + '&free_page=' + this.data.free_page + '&is_vip=' + this.data.is_vip + '&first_group=' + this.data.first_group;
          wx.navigateTo({
            url: url
          })

        }
        else if (this.data.unvip_roll_code) {

          var url = '../../listHome/order/confirm/confirm?' + 'buyType=' + s + '&wxcx_shop_group_price=' + wxcx_shop_group_price + "&unvip_roll_code=" + this.data.unvip_roll_code + "&isTM=" + isTM + "&isFirst=" + this.data.isFirst + "&isNew=" + this.data.isNew + "&is_redHongBao=" + this.data.is_redHongBao + '&vip_type=' + this.data.vip_type + '&vip_free=' + vip_free + '&free_page=' + this.data.free_page + '&is_vip=' + this.data.is_vip + '&first_group=' + this.data.first_group;
          wx.navigateTo({
            url: url
          })

        }
        else if (this.data.vip_free > 0 || this.data.is_vip > 0)//免费领
        {
          var url = '../../listHome/order/confirm/confirm?' + 'buyType=' + s + '&wxcx_shop_group_price=' + wxcx_shop_group_price + "&isTM=" + isTM + '&vip_type=' + this.data.vip_type + '&shouYePage=' + this.data.shouYePage + '&vip_free=' + vip_free + '&free_page=' + this.data.free_page + '&is_vip=' + this.data.is_vip + '&first_group=' + this.data.first_group;

          wx.navigateTo({
            url: url
          })
        }
        else {//开团

          var url = '../../listHome/order/confirmFight/confirmFight?' + 'buyType=' + s + '&wxcx_shop_group_price=' + wxcx_shop_group_price + "&isTM=" + isTM + '&vip_type=' + this.data.vip_type + '&shouYePage=' + this.data.shouYePage + '&vip_free=' + vip_free + '&free_page=' + this.data.free_page + '&is_vip=' + this.data.is_vip + '&first_group=' + this.data.first_group;

          wx.navigateTo({
            url: url
          })
        }

      } else {

        if (this.data.is_vip > 0 && this.data.isKT == false && this.data.isShowJoinGroup == false)//单独购买
        {
          wx.redirectTo({
            url: '../../listHome/order/confirm/confirm?' + 'buyType=' + s + '&wxcx_shop_group_price=' + wxcx_shop_group_price + "&isTM=" + isTM + "&isTM_Advertisement=" + isTM_Advertisement + '&shop_type=' + isTM_shoptype + '&is_onlyBuy=1' + '&max_vipType=' + this.data.max_vipType + '&cashOnDelivery=' + this.data.cashOnDelivery + '&shouYePage=' + this.data.shouYePage + '&delivery_time=' + this.data.delivery_time
          })
        } else {//开团 参团

          if (this.data.isShowJoinGroup)//参团
          {
            var url = '../../listHome/order/confirmFight/confirmFight?' + 'buyType=' + s + '&wxcx_shop_group_price=' + wxcx_shop_group_price + "&roll_code=" + this.data.roll_code + "&isTM=" + isTM + "&isFirst=" + this.data.isFirst + "&isNew=" + this.data.isNew + "&is_redHongBao=" + this.data.is_redHongBao + '&vip_type=' + this.data.vip_type + '&vip_free=' + vip_free + '&free_page=' + this.data.free_page + '&is_vip=' + this.data.is_vip + '&first_group=' + this.data.first_group;
            wx.navigateTo({
              url: url
            })
          }else{//开团
          
            var url = '../../listHome/order/confirmFight/confirmFight?' + 'buyType=' + s + '&wxcx_shop_group_price=' + wxcx_shop_group_price + "&isTM=" + isTM + '&vip_type=' + this.data.vip_type + '&shouYePage=' + this.data.shouYePage + '&vip_free=' + vip_free + '&free_page=' + this.data.free_page + '&is_vip=' + this.data.is_vip + '&first_group=' + this.data.first_group;

            wx.navigateTo({
              url: url
            })
          }
        }

      }

      this.setData({
        showDialog: false,
      })
    } else {
      var that = this;
      that.setData({
        showDialog: false
      })
      that.globalLogin();//重新登录
    }
  },

  //生成分享的合成图片
  getCanvasPictiure: function () {
    var that = this;

    var share_pic = '';
    if (that.data.shop.four_pic) {
      var picArray = that.data.shop.four_pic.split(',');
      if (picArray.length > 2) {
        share_pic = picArray[2] + '!450';
      } else if (picArray.length > 0) {
        share_pic = picArray[0] + '!450';
      }
      else {
        share_pic = that.data.shop.def_pic + '!450';
      }
    } else {
      share_pic = that.data.shop.def_pic + '!450';
    }

    share_pic = that.data.picLink + share_pic;
    util.getCanvasPictiure("shareCanvas", share_pic, that.data.wxcx_shop_group_price, '商品分享',function (tempFilePath) {
      if (tempFilePath != undefined && tempFilePath != null) {
        that.setData({
          tempFilePath: tempFilePath
        })
      } else {
        that.setData({
          tempFilePath: share_pic
        })
      }
    })
  },

  onShareAppMessage: function (res) {
    var user_id = '';

    if (app.globalData.user) {
      user_id = app.globalData.user.user_id
    }

    //如果用户输入了他人的邀请碼刚分享出去的就是他人的邀请码
    if (this.data.other_userid != undefined && this.isNumber(this.data.other_userid) == true) {
      user_id = this.data.other_userid;
    }

    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }

    this.data.shareTitle = '点击购买👆' + '【' + this.data.shop_name + '】' + "今日特价" + this.data.wxcx_shop_group_price + "元！";

    if (that.data.tempFilePath == undefined || that.data.tempFilePath == null) {
      var share_pic = '';
      if (that.data.shop.four_pic) {
        var picArray = that.data.shop.four_pic.split(',');
        if (picArray.length > 2) {
          share_pic = picArray[2] + '!450';
        } else if (picArray.length > 0) {
          share_pic = picArray[0] + '!450';
        }
        else {
          share_pic = that.data.shop.def_pic + '!450';
        }
      } else {
        share_pic = that.data.shop.def_pic + '!450';
      }

      share_pic = that.data.picLink + share_pic;
      that.setData({
        tempFilePath: share_pic
      })
    }

    var path = '/pages/shouye/detail/detail?shop_code=' + this.data.shop_code + "&isShareFlag=true" + "&user_id=" + user_id;
    if (app.globalData.user != null && app.globalData.user.user_id != undefined) {
      path = '/pages/mine/toexamine_test/toexamine_test?shouYePage=ThreePage' + "&isShareFlag=true" + "&user_id=" + app.globalData.user.user_id;
    } else {
      path = '/pages/mine/toexamine_test/toexamine_test?shouYePage=ThreePage' + "&isShareFlag=true";
    }

    if (that.data.isFreelingShareFlag)
    {
      return {
        title: that.data.freeling_shareTitle,
        path: that.data.freeling_sharePath,
        imageUrl: that.data.freeling_shareImageUrl,
        success: function (res) {
         
        },
        fail: function (res) {
          // 转发失败
        }
      }
    } 
    else {
        return {
          title: this.data.shareTitle,
          path: path,
          imageUrl: this.data.tempFilePath,
          success: function (res) {
            
          },
          fail: function (res) {
            // 转发失败
          }
        }
    }
  },

  isNumber: function (val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
      return true;
    } else {
      return false;
    }
  },

  //是否授权
  shareLoginSetting: function () {
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    this.setData({
      showShareMC: true
    })
    var that = this;
    //查看用户是否授权 未授权弹授权提示弹窗
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) { //授权过


          if (!app.globalData.user) { //拿不到用户信息-去登录
            //登录成功回调
            app.New_userlogin(function () {

              app.queryJY(function (noJY) { //noJY:没有交易记录
                if (noJY) {
                  // wx.navigateTo({
                  //   url: '/pages/shouye/redHongBao?shouYePage=ThreePage',
                  // })
                }
                that.setData({
                  showShareMC: false
                })
                wx.hideLoading()

              })

            });
          } else { //拿了到用户信息-去查询
            app.queryJY(function (noJY) { //noJY:没有交易记录
              if (noJY) {
                // wx.navigateTo({
                //   url: '/pages/shouye/redHongBao?shouYePage=ThreePage',
                // })
              }
              that.setData({
                showShareMC: false
              })
              wx.hideLoading()

            })
          }

        } else { //未授权

          // wx.navigateTo({
          //   url: '/pages/shouye/redHongBao?shouYePage=ThreePage',
          // })
          that.setData({
            showShareMC: false
          })
          wx.hideLoading()

        }
      }
    })
  },

  //查询用户是否有交易记录
  jiaoYiJiLu: function () {
    var that = this;
    app.queryJY(function (noJY) { //noJY:没有交易记录
      var jiaoYiJiLu = !noJY;//true 有交易记录 false没有交易记录
      that.setData({
        jiaoYiJiLu: jiaoYiJiLu
      })
      wx.hideLoading()
    })
  },
  // 提交formId
  loginsubmit: function (e) {
    formId = e.detail.formId;
  },
  //分享弹窗
  shareClick: function (e) {
    formId = e.detail.formId;
    // this.toshareData(false);
    if (app.globalData.user != null) {
      util.httpPushFormId(formId);
    }
  },
  shareDiscriptionClick: function () {
    this.setData({
      shareDiscriptionShow: true,
      oneYuanDiscriptionTitle: '分享赚说明'
    })
  },
  //领取会员/补充会员费
  memberSubmit: function (e) {
    formId = e.detail.formId;
    var type = e.currentTarget.dataset.type;
    if (formId && app.globalData.user != null) {
      util.httpPushFormId(formId);
    }
    this.setData({
      upperMemberYiFuShow: false,
      supplementMemberShow: false
    })

    var url = '';
    if (type == '开卡') {
      if (wx.getStorageSync("showVipGuide")) {
        url = '../../mine/addMemberCard/addMemberCard?memberComefrom=' + 'detail'
      } else {
        wx.setStorageSync('showVipGuide', true)
        url = '../../mine/addMemberCard/addMemberCard?memberComefrom=' + 'detail'
      }
    } else {
      url = '../../mine/addMemberCard/addMemberCard?memberComefrom = ' + 'detail'
    }
    wx.navigateTo({
      url: url,
    })
  },
  //授权弹窗
  onclick: function (e) {
    var that = this;
    wx.hideLoading();
    wx.getUserInfo({
      //允许授权 获取用户信息
      success: function (res) {
        if (!app.globalData.user) {
          // that.loginHttp();
          that.globalLogin();//重新登录
        }else{
          if (that.data.channelHongbaoNewuserShow) {
            that.setData({
              channelHongbaoNewuserShow:false
            })
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
          app.New_userlogin(function () {
            util.httpPushFormId(formId);
            wx.hideLoading();

            if (that.data.firstredHongbaoNewuserShow) {
              that.redHongClick();
              that.setData({
                // ninthHongbaoShow:true,
                firstredHongbaoNewuserShow: false
              })
            }
            if (that.data.shareComeFromRedHongBao)
            {
              var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
              that.setData({
                showendofpromotionDialog: showendofpromotionDialog,
                shareComeFromRedHongBao: false
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
    if (app.homePagetoSign == true) {
      wx.navigateTo({
        url: '/pages/sign/sign',
      })
    }
  },
  //90元红包关闭
  ninthHongbaoSubmit:function(e){
    formId = e.detail.formId;
    if (app.globalData.user != null) {
      util.httpPushFormId(e.detail.formId);
    }
    this.setData({
      ninthHongbaoShow:false
    })
  },
  //登录成功回调
  loginHttp: function () {
    var that = this;
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    app.New_userlogin(function () {
      wx.hideLoading();
      //授权登录成功
      that.data.isOreadyToken = true;
      if (buttonClcik == 1) {

        that.toshareData(true);
      } else if (buttonClcik == 2) {
        that.toBuyClick();
      } else if (buttonClcik == 3) {
        that.oneBuyClick();
      } else if (buttonClcik == 4) {
        that.gotabwode();
      }
      // 提交formId
      if (formId) {
        util.httpPushFormId(formId);
      }

      that.userInfo_httpData();

    });
  },

  //自动登录
  globalLogin: function () {
    var that = this;
    wx.showLoading({
      title: '请稍后',
    })
    util.autoLogin(loginCount, function (loginfailYiFuShow, login_discribution, login_buttontitle, newloginCount) {
      loginCount = newloginCount;
      if (loginCount == 1)//登录成功
      {
        util.get_vip2(function (data) {
          if (data.status == 1) {
            that.setData({
              first_diamond:data.first_diamond
            })
          }

          var showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
          that.setData({
            showendofpromotionDialog: showendofpromotionDialog,
            shareComeFromRedHongBao: false,
          })

          //授权登录成功
          that.data.isOreadyToken = true;
          if (buttonClcik == 1) {
            that.toshareData(true);
          } else if (buttonClcik == 2) {
            that.toBuyClick();
          } else if (buttonClcik == 3) {
            that.oneBuyClick();
          } else if (buttonClcik == 4) {
            that.gotabwode();
          }
          // 提交formId
          if (formId) {
            util.httpPushFormId(formId);
          }
          that.oneYuan_httpData();
        });

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

  contactHandle: function (event) {
    console.log("event");
  },

  //************************拼单成功提示用户去提现********************* */
  //获取优惠券
  getcoupon_http: function () {
    var that = this;
    var oldurl = config.Host + '/coupon/getRollCoupon?' + config.Version;
    util.http(oldurl, that.coupon_data);
  },
  coupon_data: function (data) {
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
  getFightOrderStatus: function () {
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

        //弹过后清除条件
        wx.setStorageSync('FightSuccess', false);

        that.setData({
          fightSuccess_fail_isShow: false,
        })

        var NowTime = new Date().getTime();
        wx.setStorageSync("FightPopTime", NowTime);
        wx.setStorageSync("popCount", popcount + 1);

      }
    }
  },
  //去赚钱
  goToMoney: function () {
    this.setData({
      fightSuccess_fail_isShow: false
    })
    wx.navigateTo({
      url: '../../sign/sign',
    })
  },
  //立即去提现
  closeTixianBtn: function () {
    wx.navigateTo({
      url: '/pages/sign/inviteFriends/memberFriendsReward',
    })
    this.setData({
      moneyTixianShowFlag: false,
    })
  },
  closePop: function () {
    this.setData({
      fightSuccess_fail_isShow: false,
      supplementMemberShow: false
    })
  },
  closeNewThirty: function () {
    var that = this;
    that.setData({
      upperMemberYiFuShow: false,
      redHongbaoNewuserShow: false
    })
    if (that.data.firstredHongbaoNewuserShow) {
      that.setData({
        firstredHongbaoNewuserShow: false
      })
      showHongBao.loopShowHongbao(that, showHongBao, function (is_show) {
        if (is_show) {
          that.setData({
            firstredHongbaoNewuserShow: false
          })
        }
      })
    }
  },
  tixianview_close: function () {
    this.setData({
      isShowShare: false
    })
  },
  showYqmTips: function () {
    this.setData({
      showTips: true
    })
  },

  //每秒减一次
  startReportHeart: function () {
    var that = this;
    var poplastTime = that.data.poplastTime;
    redhongbaoCutdoenTimer = setTimeout(function () {
      poplastTime--;
      that.data.poplastTime = poplastTime;
      wx.setStorageSync('poplastTime', poplastTime);
      that.startReportHeart()
    }, 1000)
  },
  colseTips: function () {
    var that = this;
    that.setData({
      showTips: false,
    })

    if (that.data.contactkefuShow) {

      that.data.poplastTime = that.data.homePage3ElasticFrame;
      that.startReportHeart();

      redhongbaopopTimer = setTimeout(function () {

        if (app.globalData.user != null && app.globalData.user.userToken != undefined) {

        } else {//当用户没有登录授权时才循环弹出此框
          if (!that.data.redHongbaoNewuserShow && redhongbaonotshow == true) {
            that.setData({
              firstredHongbaoNewuserShow: false,
            })
          }
        }
      }, that.data.homePage3ElasticFrame * 1000)
      that.setData({
        contactkefuShow: false
      })
    }
  },
  contactkefu: function () {
    this.setData({
      contactkefuShow: false
    })
  },
  //共用
  closeVipDialog: function () {
    this.setData({
      showFrirstDayCopleteDialog: false
    })
  },
  xianjinRedsubmit: function (e) {
    redhongbaonotshow = true;
    formId = e.detail.formId;
    if (this.data.redHongbaoNewuserShow) {
      this.setData({
        redHongbaoNewuserShow: false,
      })
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
    }

    if (this.data.firstredHongbaoNewuserShow)
    {
      if (app.globalData.channel_type == 1)//渠道进入
      {
        this.setData({
          firstredHongbaoNewuserShow: false
        })
      } else {
        if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
          this.setData({
            firstredHongbaoNewuserShow: false
          })
        } 
      }
      showHongBao.clickHongbao(this, function (is_show) { })

    }
  },
  //引导用户成为会员
  guidebecomememberTap: function (e) {

    formId = e.detail.formId;
    if (app.globalData.user != null) {
      util.httpPushFormId(e.detail.formId);
    }
    if(this.data.guidebecomeMemberImage == '完成任务')
    {
      wx.redirectTo({
        url: '/pages/sign/sign',
      })
      
    }else{
      wx.navigateTo({
        url: '../../mine/addMemberCard/addMemberCard?memberComefrom=' + 'detail',
      })
    }
    
    this.setData({
      guidebecomeMemberShow: false
    })
  },

  //首日完成任务去转盘
  fistSignComplestTap: function () {
    wx.navigateTo({
      url: '/pages/mine/withdrawLimitTwo/withdrawLimitTwo',
    })
    this.setData({
      showFrirstDayCopleteDialog: false
    })
  },
  closeNewLuckImage: function () {
    this.setData({
      guidebecomeMemberShow: false
    })
  },
  Redhongsubmit: function () {
    redhongbaonotshow = false;
    if (this.data.redHongbaoNewuserShow) {
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

      if (app.globalData.user != undefined && app.globalData.user.userToken != undefined) {
        if (app.homePagetoSign == true) {
          wx.navigateTo({
            url: '/pages/sign/sign',
          })
        }
      }
      this.setData({
        redHongbaoNewuserShow: false,
      })
    }
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
