import config from '../../../config';
import ToastPannel from '../../../common/toastTest/toastTest.js';
var util = require('../../../utils/util.js');
var fightUtil = require('../../../utils/freeFightCutdown.js');
var MD5 = require('../../../utils/md5.js');
var showHongBao = require('../../../utils/showNewuserHongbao.js');
var app = getApp();
var shop_code = '';
var total_micro_second; //拼团剩余时间
var cutdown_total_micro_second; //倒计时时间
var firstFresh; //是否第一次刷新
var loginCount;
var sharePic;
var pay_success;
var is_paying;//是否正在支付
var formId;
var is_firstComming;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    upyconfig: config.Upyun,
    orderlist: ["微信好友", "微信群"],
    orderimage: ["small-iconImages/heboImg/weixin.png", "small-iconImages/heboImg/weixin_friend.png"],

    showFootview: 'true', //是否显示邀请好友按键
    fightSuccess_fail_status: '1', 
    shopList: [],
    isTM: "", //是否是特卖商品
    initiator: "", //拼团发起人
    user_portrait: "", //发起人头像
    add_time: "", //开团时间
    roll_code: "", //拼团编号
    short_num: "", //还差几人
    validMin: "", //剩余时间
    shareTitle: "", //分享的标题
    shareImage: "", //分享的图片
    shareSuplb: "", //分享商品的品牌
    shareName: "", //分享的商品名称
    sharePrice: "", //分享商品的原价
    shareSe_price: "", //分享商品的售价
    isFromDetail: "", //是否从商品详情过来
    isJoinGroup: false, //是否参团 
    isFirst_New: false, //是否新用户首次开团
    fightOver:false,//拼团是否结束
    isFirst: '',
    isNew: '',
    load_timer: true, //定时器
    start_time: '', //开始时间
    end_time: '', //结束时间
    clock_hr: '00', //时
    clock_min: '00', //分
    clock_ss: '00', //秒

    recommendTitleData: [],
    recommendListData: [],
    recommendPage: 1,
    recommend_type_name: '热卖',
    recommend_type1: '6',
    currentTab: 0, //推荐点击的条目
    // upperGoYiFuShow:true,
    suspensionHongBao_isShow:true,
    firstredHongbaoNewuserShow:false,
    fightHongBao:true,
    reduceMoney:0,
    freeling_isshow:true,
    normaluserPicData:['','','',''],//拼团人图像
    is_commander:false,//是否是团长
    clickLogin: true,//点击红包授权
    guidefightCouponShow:false,//免拼卡
    guideFightDeliverShow:false,//免拼卡发货卡 发货
    cardslist:['','',''],
    clickLogin:true
  },

  onHide:function(){
    wx.hideLoading()
    showHongBao.stoppopTimer(this, function () { })
  },

  /*
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;

    loginCount = 0;

    if (options.isShareFlag) {
      that.setData({
        isShareFlag: options.isShareFlag
      })
    }

    if (options.is_t != undefined)
    {
      that.setData({
        is_t: options.is_t //1开团  2参团  其它是参团
      })
    }

    if (options.is_FightShow != undefined)
    {
      that.setData({
        is_FightShow: options.is_FightShow
      })
    }
    // if (app.globalData.channel_type == 1) {
    //   that.setData({
    //     channel_type: app.globalData.channel_type
    //   })
    // }

    new app.ToastPannel();
    if (options) {

      console.log("***************code=" + options.code);
      //如果没有登录直接跳转到首页
      // if (options.code) {
      //   setTimeout(function () {
      //     if (app.globalData.user == null || app.globalData.user.userToken == undefined) {
      //       app.globalData.roll_code = options.code;
      //       wx.switchTab({
      //         url: '/pages/shouye/shouye',
      //       })
      //     }
      //   }, 2000)
      // }

      //是否新用户是否第一次下单
      var tips = options.tips != undefined ? options.tips : "";
      var isFirst_New = (tips == 1) ? true : false;
      if(tips == 2)
      {
        that.setData({
          fightSuccess_fail_isShow : true,
          fightSuccess_fail_status : '1'
        })
      }

      if (options.fourthCTfail != undefined)
      {
        that.setData({
          fourthCTfail: options.fourthCTfail 
        })
      }

      // if (options.isPush != undefined)
      // {
      //   var cutdowntime = 30 * 60 * 1000;
      //   fightUtil.countdown(that, fightUtil, cutdowntime,function(data){
      //     that.setData({
      //       is_fresh:true,
      //       time:data
      //     })
      //   })
      //   that.setData({
      //     guidefightCouponShow:true
      //   })
      // }
      
      that.setData({
        roll_code: options.code,
        isTM: options.isTM,
        fightStatus: options.status,
        isFromDetail: options.isFromDetail,
        isJoinGroup: options.isJoinGroup == 'true'?true:false,
        // isFirst_New: isFirst_New,
        isFirst: options.isFirst ? options.isFirst : '',
        isNew: options.isNew ? options.isNew : ''
      })
    }
    if (that.data.isJoinGroup) {
      showHongBao.getShowHongbao(that, function (is_show) {
        if (is_show) {
          that.setData({
            firstredHongbaoNewuserShow: true
          })
        }
      });
    }
    firstFresh = true;
    pay_success = false;
    is_firstComming = true;

    app.globalData.oneYuanData = 0; //默认是一元购
    that.getSystemInfo();
    that.fightShopNum_timeHttp();
    that.getRcommendTitleData();
    that.hongBaoAnimation();
    that.xuanfuHongBaoAnimation();
  },
  onShow: function() {
    app.globalData.oneYuanData = 0; //默认是一元购
    if (!firstFresh) {
      this.fightShopNum_timeHttp();

      this.data.recommendPage = 1;
      this.shopLishHttp();
    }

    var that = this;
    if (that.data.isJoinGroup && !is_firstComming && that.data.homePage3ElasticFrame > 0)
    {
      showHongBao.getShowHongbao(that, function (is_show) {
        if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
          return;
        }
        if (is_show) {
          that.setData({
            firstredHongbaoNewuserShow: true
          })
        }
      });
    }
    is_firstComming = false;
    that.xuanfu_image();

    //免拼卡购买成功后返回弹免拼卡张数的弹框
    var kfreeSuccessBack = wx.getStorageSync('KfreeSuccessBack')
    if (kfreeSuccessBack == '1'){

      util.get_daojuNumber(that.data.order_code,function(data){
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
        
        if (isDeliver == 1)//发货状态
        {
          that.setData({
            guideFightDeliverShow: false
          })
          wx.navigateBack({})//如果是购买第三张免拼卡返回则返回到订单列表
        }else if(free_num == 0)
        {
          that.setData({
            guideFightDeliverShow: false
          })
        }else{
          that.setData({
            free_num: free_num,
            cardslist: picdatas,
            guideFightDeliverShow: true
          })
        }
      })

      wx.setStorageSync('KfreeSuccessBack', '');
    }

    if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
      that.setData({
        notShowHongBao: true
      })
    }
  },
  
  onUnload() {
    this.setData({
      load_timer: false,
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
    var animationTimer = setInterval(function () {
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

  xuanfu_image: function () {
    var that = this;
    //悬浮小图标
    util.get_userOrderRoll48Hours(function (userOrderRoll48Hours) {
      if (userOrderRoll48Hours == 1) {
        that.setData({
          SmallRedHongBao: config.Upyun + 'small-iconImages/heboImg/small-madjobRedHongBao.png',
        })
      } else {
        
        //获取是否是会员
        util.get_vip(function (data) {
          var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
          var smallImage = isVip == 0 ? "smallRedHongbao_nintymoney.png" : "smallRedHongbao_hundredmoney.png";

          that.setData({
            SmallRedHongBao: config.Upyun + 'small-iconImages/heboImg/' + smallImage,
          })
        })
      }

    })
  },
  //红包摇摆动画
  xuanfuHongBaoAnimation: function () {
    this.setData({
      SmallRedHongBao: config.Upyun + 'small-iconImages/heboImg/small-madjobRedHongBao.png',
    })
    this.xuanfuanimationMiddleHeaderItem = wx.createAnimation({
      duration: 2000,    // 以毫秒为单位  
      timingFunction: 'linear',
      delay: 50,
      transformOrigin: '50% 50%',
      success: function (res) {
        console.log("***************************");
      }
    });
    var xuanfuanimationTimer = setInterval(function () {
      this.xuanfuanimationMiddleHeaderItem.scale(1.2).step({ duration: 300 }).rotate(-15).step({ duration: 300 }).rotate(15).step({ duration: 300 }).rotate(0).step({ duration: 300 }).scale(1.0).step({ duration: 300 });

      this.setData({
        xuanfuanimationMiddleHeaderItem: this.xuanfuanimationMiddleHeaderItem.export()  //输出动画
      });

    }.bind(this), 2000);
  },

  //获取拼团人数 时间
  fightShopNum_timeHttp: function() {
    var token = (app.globalData.user != null) ? app.globalData.user.userToken : "";
    var url = config.Host + 'order/getRollInit?token=' + token + config.Version + "&roll_code=" + this.data.roll_code;
    util.http(url, this.shopNum_timedata);
  },
  shopNum_timedata: function(data) {
    var that = this;
    if (data.status == 1) {
      var picCount = data.data.count;
      var picData = data.data.userPicData;
      var fight_userid = data.data.fight_userid;
      var userid = app.globalData.user != undefined?app.globalData.user.user_id:'';
      var isLookGroup = fight_userid == userid?false:true;
      var is_commander = fight_userid == userid ? true : false;
      var order_code = '';
      var myself_paymoney = false;
      var userPicList = [];
      var free_num = data.data.free_num;

      if(data.data.order != undefined)
      { 
        order_code = data.data.order.order_code;
        myself_paymoney = (data.data.order.pay_status == 1 || pay_success == true) ? true : false;
      }
     
      for (var i = 0; i < picCount;i++)
      {
        if(picData[i])
        {
          var fdStart = picData[i].indexOf("http");
          if (fdStart == 0)
            picData[i] = picData[i];
          else{
            picData[i] = config.Upyun + picData[i];
          }
            
          userPicList.push(picData[i]);
        }else{
          userPicList.push('../../../iconImages/icon_question_mark.png');
        }
      }

      //免拼卡发货卡发货
      var picdatas = [];
      for(var j= 0; j< 3; j++)
      {
        if(free_num > j)
        {
          picdatas.push(config.Upyun + 'small-iconImages/heboImg/free_fight.png')
        }else{
          picdatas.push(config.Upyun + 'small-iconImages/heboImg/luck_invitButton.png')
        }
      }
      var is_showTixianCoupon = ((data.data.isVip > 0 && data.data.isVip !=3) || (data.data.isVip == 3 && data.data.maxType == 4))?false:true;
      that.setData({
        short_num: data.data.rnum,
        validMin: data.data.validMin,
        fightOver: (data.data.rnum <= 0 || data.data.validMin <= 0)?true:false,
        add_time: data.data.paytime,
        is_robot: data.data.is_robot,
        isVip: data.data.isVip,
        maxType:data.data.maxType,
        userPicData: userPicList,
        isLookGroup: isLookGroup,
        order_code: order_code != undefined ? order_code:'',
        myself_paymoney: myself_paymoney,
        is_commander: is_commander,
        cardslist: picdatas,
        free_num:free_num,
        is_showTixianCoupon:is_showTixianCoupon
      });
      if (firstFresh == true) {
        that.fightShopHttp();
        firstFresh = false;
      }
    }

    // 拼团已经失效则直接进入小程序首页
    if (that.data.isJoinGroup == true) {
      if (that.data.short_num <= 0 || that.data.validMin <= 0) {
        that.showToast("该团结束啦，自动跳转衣蝠首页，挑一个喜欢的商品开团吧。", 5000);

        setTimeout(function() {
          wx.switchTab({
            url: '/pages/shouye/shouye',
          })
        }, 5000)
      }else{
        var that = this;
        //获取会员信息 非会员用户进入直接显示为小程序首页
        // util.get_vip(function (data) {
        //   var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
        //   if (isVip <= 0 && data.status == 1) {
        //     setTimeout(function () {
        //       app.globalData.roll_code = that.data.roll_code;
        //       wx.switchTab({
        //         url: '/pages/shouye/shouye',
        //       })
        //     }, 1000)
        //   }else{
        //     that.setData({
        //       freeling_isshow:true
        //     })
        //   }
        // })

        that.setData({
          freeling_isshow: true
        })
      }
    }
  },
  //拼团商品数据
  fightShopHttp: function() {
    var token = (app.globalData.user != null) ? app.globalData.user.userToken : "";
    var url = config.Host + 'order/queryByRollToCode?token=' + token + config.Version + "&code=" + this.data.roll_code;
    util.http(url, this.shopdata);
  },
  shopdata: function(data) {
    if (data.data) {
      var start_time = data.data[0].add_time;
      var n_status = data.data[0].n_status;
      var suppleLabel = data.data[0].supp_label;
      var shopName = data.data[0].shop_name;
      var shop_roll = data.data[0].shop_roll;
      var shareprice = data.data[0].assmble_price;
      var shop_se_price = data.data[0].shop_se_price;
      var wxcx_shop_group_price = data.data[0].wxcx_shop_group_price;
      var dataList = [];
      var moreDataList = [];
      for (var i = 0; i < data.data.length; i++) {
        var add_time = util.getMyDate(Number(data.data[i].add_time), '.', '');
        shop_code = data.data[i].shop_code;
        var shop_pic = data.data[i].shop_url;
        var user_portrait = data.data[i].user_portrait;
        if (user_portrait.indexOf('http') == -1) {
          user_portrait = this.data.Upyun + data.data[i].user_portrait;
          data.data[i].user_portrait = user_portrait;
        }

        //商品图片
        var newcode = shop_code.substr(1, 3);
        var new_pic = this.data.Upyun + newcode + '/' + shop_code + '/' + shop_pic;

        sharePic = new_pic;
        var link = this.data.Upyun + newcode + '/' + shop_code + '/'
        if (data.data[i].four_pic) {
          var picArray = data.data[i].four_pic.split(',');
          if (picArray.length > 2) {
            sharePic = link + picArray[2] + '!450';
          }
        }


        data.data[i].new_pic = new_pic;
        data.data[i].add_time = add_time;

        moreDataList.push(data.data[i]);
        if(i == 0)
        {
          dataList.push(data.data[0]);
        }
        this.setData({
          shareImage: new_pic,
          shareSe_price: shop_se_price,
          sharePrice: shareprice,
          shareName: shopName,
          shareSuplb: suppleLabel,
          shareSuplb: suppleLabel ? suppleLabel : "衣蝠"
        });
      }

      

      this.setData({
        shopList: this.data.isJoinGroup ? dataList : moreDataList,
        moreDataList: moreDataList,
        hideMoreImg: (this.data.isJoinGroup && moreDataList.length>1)?false:true,
        start_time: start_time,
        n_status: n_status,
        short_num: n_status == 0 ? this.data.short_num : 0,
        validMin: n_status == 0 ? this.data.validMin : 0,
      })

      total_micro_second = this.data.validMin || [];
      cutdown_total_micro_second = total_micro_second*1.8;
      this.countdown(); //拼团倒计时
      // this.showFightPopvie(); //拼团状态弹窗
      this.showFightStatus(); //拼团状态弹窗
      this.top_shopHttp(); //获取商品二级类目
      this.getCanvasPictiure();//生成合成的分享图
    }
  },

  //展示更多的拼团商品
  moreClickTap:function(){
    this.setData({
      hideMoreImg:true,
      shopList: this.data.moreDataList
    })
  },
  //商品详情
  shopDetailTap: function(e) {
    var url = "";
    var shop_code = e.currentTarget.dataset.shop_code;
    if (this.data.isTM == 1) {
      if (this.data.isJoinGroup == true) {
        url = '../detail/detail?' + "shop_code=" + shop_code + "&shop_type=2 " + "&roll_code=" + this.data.roll_code + "&isFirst=" + this.data.isFirst + "&isNew=" + this.data.isNew + '&isShareFlag=true';

      } else {
        url = '../detail/detail?' + "shop_code=" + shop_code + "&shop_type=2";
      }

    } else {
      if (this.data.isJoinGroup == true) {
        url = '../detail/detail?' + "shop_code=" + shop_code + "&roll_code=" + this.data.roll_code + "&isFirst=" + this.data.isFirst + "&isNew=" + this.data.isNew + '&isShareFlag=true';
      } else {
        url = '../detail/detail?' + "shop_code=" + shop_code;
      }
    }
    wx.navigateTo({
      url: url
    })
  },
  //获取商品二级类目
  top_shopHttp: function() {
    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var oldurl = config.Host + 'shop/queryShopType2?' + config.Version + '&token=' + token + '&shop_code=' + shop_code;
    util.http(oldurl, that.type_data);
  },
  type_data: function(data) {

    //获取品牌商
    var basesData = wx.getStorageSync("shop_tag_basedata");
    var supperlabList = basesData.data.supp_label;
    for (var i = 0; i < supperlabList.length; i++) {
      var supperid = supperlabList[i]["id"];
      if (data.supp_label_id == supperid) {
        var supp_label = supperlabList[i]["name"];
        if (supp_label != undefined) {
          this.setData({
            shareSuplb: supp_label
          });
        }

        break;
      }
    }
    if (data.status == 1) {

      var type_data = data.type2;
      var supp_label = this.data.shareSuplb;
      var shareJson = '快来' + this.data.sharePrice + '元拼' + '【' + supp_label + '正品' + data.type2 + '】,' + '专柜价' + this.data.shareSe_price + '元!';
      if (!type_data) {
        shareJson = '快来' + this.data.sharePrice + '元拼' + '【' + this.data.shareName + '】,' + '原价' + this.data.shareSe_price + '元!';
      }
      this.data.shareTitle = shareJson;
    }
  },

  //邀请好友参团
  inviteFriendTap: function() {
    if (this.data.footview_text == '已成团，请在时效内付款')
    {
      if(!this.data.myself_paymoney)
      {
        //去支付
        if (!is_paying)
        {
          is_paying = true;
          this.fightPay();
        }
      }
    } else if (this.data.footview_text == '已付款'){

    }
    else{
      this.setData({
        fightSuccess_fail_isShow: true,
      })
    }
  },
  fightPay:function(){
    var that = this;
    //男性用户不可下单支付
    if (app.globalData.user.gender == 1) {
      this.showToast('系统维护中，暂不支持支付', 2000);
      return;
    }

    //统一调起支付
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId, 3rd_session
        if (res.code) {
          var dataUrl = config.PayHost + 'wxpaycx/wapUinifiedOrderList?' + config.Version + "&token=" + app.globalData.user.userToken + '&order_code=' + this.data.order_code + '&order_name=我的' + '&code=' + res.code;
          util.http(dataUrl, that.orderPayResult)
        } else {
          is_paying = false;
          console.log('获取用户登录态失败！' + res.errMsg)
          that.showToast('获取用户登录态失败！' + res.errMsg, 2000);
        }
      }
    })
  },
  orderPayResult: function (data) {

    var that = this;
    if (data.status == 1) {
      var xml = data.xml;
      wx.requestPayment({
        'timeStamp': xml.timeStamp + "",
        'nonceStr': xml.nonceStr,
        'package': xml.package,
        'signType': xml.signType,
        'paySign': xml.paySign,
        'success': function (res) {
          that.showToast('支付成功', 2000);
          
          //刷新界面数据
          pay_success = true;
          is_paying = false;
          that.fightShopNum_timeHttp();

          that.setData({
            myself_paymoney: true
          })
          that.fightShopHttp();
        },
        'fail': function (res) {
          is_paying = false;
          that.showToast('支付失败', 2000);
        }
      })
    } else {
      is_paying = false;
      that.showToast(data.message, 2000);
    }
  },
  //分享好友
  sharetap: function() {
    this.setData({
      fightSuccess_fail_isShow: false,
    })
  },
  //关掉弹窗
  closeTap: function(e) {
    var index = e.currentTarget.dataset.id;
    if (index == "2" || index == "4") {
      wx.switchTab({
        url: '/pages/shouye/shouye',
      })
    }

    this.setData({
      fightSuccess_fail_isShow: false,
    })
  },
  //拼团未成功去赚钱
  gomoneyTap: function() {
    this.setData({
      fightSuccess_fail_isShow: false,
    })
    wx.navigateTo({
      url: '../../../pages/sign/sign',
    })
  },

  //拼团未成功去提现
  gotixianTap: function() {
    this.setData({
      fightSuccess_fail_isShow: false,
    })
    wx.navigateTo({
      url: '../../../pages/mine/wallet/Withdrawals/Withdrawals',
    })
  },

  //拼团状态提示弹窗
  showFightPopvie: function() {

    var showFootview = "";
    var fightSuccess_fail_isShow = "";
    var fightSuccess_fail_status = "";

    if (this.data.fightStatus == 1) //人满了 未付款
    {

    } else if (this.data.fightStatus == 2) //人满了 已付款
    {

    } else if (this.data.fightStatus == 11) //人未满
    {

      showFootview = true;
      fightSuccess_fail_isShow = true;

      if(this.data.isJoinGroup == true)//参团
      {
        fightSuccess_fail_status = '6';//参团 人未满
      }else{//开团
        fightSuccess_fail_status = '1';

        if (this.data.short_num != 0) //人数未满
        {
          total_micro_second = this.data.validMin || [];
          if (total_micro_second <= 0) {
            fightSuccess_fail_status = '3';
          }
        } else { //人数已满且参团人未付款
          showFootview = false;
          fightSuccess_fail_status = '5';
        }
      }
      
    } else if (this.data.fightStatus == 13) //拼团失败
    {

      showFootview = true;
      fightSuccess_fail_isShow = true;

      if(this.data.isJoinGroup == true)//参团
      {
        fightSuccess_fail_status = '8';//参团过期
      }else{//开团
        if (this.data.short_num != 0) {
          fightSuccess_fail_status = "3";
        }
      }
    
    } else if (this.data.fightStatus == 15) //拼团中
    {
      fightSuccess_fail_isShow = true;
      if (this.data.short_num != 0)//人数未满
      {
        showFootview = true;
        fightSuccess_fail_status = '1';
      } else {//人数已满且参团人未付款
        showFootview = false;
        fightSuccess_fail_status = '5';
      }
    } else {

      showFootview = true;
      fightSuccess_fail_isShow = true;
      total_micro_second = this.data.validMin || [];

      if (this.data.short_num != 0) //人数未满
      {
        if (total_micro_second <= 0) {
          fightSuccess_fail_status = '4'; //很遗憾已经过期
        } else {
          fightSuccess_fail_status = '1'; //还没有过期
        }
      } else {
        if (total_micro_second > 0) {
          //很遗憾人数已满
          fightSuccess_fail_status = '5';
        }
      }
    }

    this.setData({
      showFootview: showFootview,
      fightSuccess_fail_isShow: fightSuccess_fail_isShow,
      fightSuccess_fail_status: fightSuccess_fail_status,
    })
  },

  //fightSuccess_fail_status 1.开团成功 6.参团成功 7.参团不成功（人满）8.参团不成功（过期）9.拼团未成功 人满有人未付款导致失败 10.拼团未成功 过期导致失败
  showFightStatus: function() {
    var showFootview = "";
    var footview_text = '';
    var fightSuccess_fail_isShow = "";
    var fightSuccess_fail_status = "";

    total_micro_second = this.data.validMin || [];
    
    if(this.data.is_t == 1)//开团
    {
      showFootview = true;
      fightSuccess_fail_isShow = true;

      footview_text = '继续邀请好友参团';
      fightSuccess_fail_status = "1";
    }else if(this.data.is_t == 2)//参团
    {
      showFootview = true;
      fightSuccess_fail_isShow = true;

      if (this.data.fourthCTfail == 1){//第4人参团失败特殊处理
        footview_text = '拼团已结束';
        fightSuccess_fail_status = '7';//参团 人已满
      }
      else if (total_micro_second <= 0)//过期
      {
        footview_text = '拼团已结束';
        fightSuccess_fail_status = '8';//参团过期
      } else//未过期
      {
        if (this.data.short_num != 0)//团未满
        {
          footview_text = '继续邀请好友参团';
          fightSuccess_fail_status = '6';//参团 人未满
        }else//团已满
        {
          fightSuccess_fail_isShow = false;
          fightSuccess_fail_status = '7';//参团 人已满
        }
      }
    }else{//看团
      showFootview = true;
      fightSuccess_fail_isShow = true;

      if (total_micro_second <= 0)//过期
      {
        footview_text = '拼团已结束';
        if (this.data.short_num != 0)//团未满
        {
          fightSuccess_fail_status = "10";//拼团过期
        } else//团已满
        {
          fightSuccess_fail_status = "9";//拼团过期
        }
      } else//未过期
      {
        
        if (this.data.short_num != 0)//团未满
        {
          footview_text = '继续邀请好友参团';

          fightSuccess_fail_status = "11";//拼团人未满
        } else//团已满
        {
          fightSuccess_fail_isShow = false;
          //去支付
          if (this.data.myself_paymoney) {
            footview_text = '已付款';
          } else {
            this.setData({
              fightOver:true
            })
            footview_text = '已成团，请在时效内付款';
          }
        }
      }
    }

    if (fightSuccess_fail_status == 9 || fightSuccess_fail_status == 10)
    {
      var that = this;
      var cutdowntime = 30 * 60 * 1000;
      fightUtil.countdown(that, fightUtil, cutdowntime, function (data) {
        that.setData({
          is_fresh:true,
          time: data
        })
      })
      if (that.data.is_FightShow == 1){
        fightSuccess_fail_isShow = false;
        if (that.data.free_num > 0 && that.data.free_num < 3 ) {
          that.setData({
            guideFightDeliverShow: true
          })
        } else if (that.data.free_num == 0) {
          that.setData({
            guidefightCouponShow: true
          })
        }
      }else{
        fightSuccess_fail_isShow = true;
      }
    }
    if (fightSuccess_fail_status == 1 || fightSuccess_fail_status == 11 || fightSuccess_fail_status == 6)
    {
      var that = this;
      var cutdowntime = 30 * 60 * 1000;
      fightUtil.countdown(that, fightUtil, cutdowntime, function (data) {
        that.setData({
          is_fresh: true,
          time: data
        })
      })
    }
    this.setData({
      showFootview: showFootview,
      footview_text: footview_text,
      fightSuccess_fail_isShow: fightSuccess_fail_isShow,
      fightSuccess_fail_status: fightSuccess_fail_status,
    })
  },
  //拼团倒计时
  countdown: function() {
    var that = this;
    that.dateformat(cutdown_total_micro_second);
    if (cutdown_total_micro_second<=0 || total_micro_second <= 0 || that.data.n_status == 1 || this.data.load_timer == false) {
      //时间截至
      that.setData({
        clock_hr: "00",
        clock_min: "00",
        clock_ss: "00",
        fightOver: true,
        footview_text: '拼团已结束',
      });
      return;
    }

    setTimeout(function() {
      cutdown_total_micro_second -= 1000;
      that.countdown();
    }, 555)
  },

  dateformat: function(micro_second) {

    var that = this;
    // 总秒数
    var second = Math.floor(micro_second / 1000 );

    // 天数
    var day = "" + Math.floor(second / 3600 / 24);
    // 小时
    var hr = "" + Math.floor(second / 3600 % 24);
    // 分钟
    var min = "" + Math.floor(second / 60 % 60);
    // 秒
    var sec = "" + Math.floor(second % 60);

    // console.log(day + "天" + hr + "小时" + min + "分钟" + sec + "秒");

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

  /**
   * 参团商品
   */
  onReachBottom: function() {
    this.shopLishHttp();
  },
  getSystemInfo: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var picHeight = res.windowWidth * 9 / 6;
        var listItemHeight = (res.windowWidth * 9 / 6) * 0.96 * 0.504;
        var listItemWidth = res.windowWidth * 0.96 * 0.504;
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          picHeight: picHeight,
          listItemHeight: listItemHeight,
          listItemWidth: listItemWidth,
        });
      }
    });
  },

  recommendShopItemClick: function(event) { //推荐商品条目点击

    var shopcode = event.currentTarget.dataset.shop_code;
    var path = '../detail/detail?' + "shop_code=" + shopcode + "&roll_code=" + this.data.roll_code + "&isFirst=" + this.data.isFirst + "&isNew=" + this.data.isNew + '&isShareFlag=true';

    wx.navigateTo({
      url: path,
    })
  },
  recommendTitleClick: function(event) { //商品推荐头的点击
    var that = this;
    this.data.currentTab = event.currentTarget.dataset.index;
    var type_name = event.currentTarget.dataset.name;
    var id = event.currentTarget.dataset.id;
    this.data.recommendPage = 1;
    this.data.recommend_type_name = type_name;
    this.data.recommend_type1 = id;
    this.shopLishHttp();
    this.setData({
      currentTab: this.data.currentTab
    });
  },
  getRcommendTitleData: function() {
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
    var by = function(name) { //数组排序函数
      return function(o, p) {
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

      this.shopLishHttp();
    }else{
      this.data.recommend_type_name = "热卖";
      this.data.recommend_type1 = "6";

      this.shopLishHttp();
    }
  },

  //获取商品列表数据
  shopLishHttp: function() {
    var that = this;
    var requestUrl = config.Host;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }

    var newUrl = requestUrl + "shop/queryConUnLogin?" + config.Version + "&pager.curPage=" + that.data.recommendPage + "&pager.pageSize=30" + "&type1=" + that.data.recommend_type1 + "&type_name=" + that.data.recommend_type_name;
    if (token != undefined && token != '')
    {
      newUrl = requestUrl + "shop/queryConUnLogin?" + config.Version + "&pager.curPage=" + that.data.recommendPage + "&pager.pageSize=30" + "&type1=" + that.data.recommend_type1 + "&type_name=" + that.data.recommend_type_name + '&token=' + token;
    }

    util.get_discountHttp(function (data) {
      if (data.status == 1) {
        var money = data.one_not_use_price.toFixed(2);
        var shop_deduction = Number(data.shop_deduction) > 1 ? 1.0 : data.shop_deduction;
        that.setData({
          reduceMoney: money,
          shop_deduction: shop_deduction != undefined ? shop_deduction : 0.0
        })
      }

      util.http(newUrl, that.shopList_data);
    });
  },

  shopList_data: function(data) {
    if (data.status == 1) {
      var isVip = data.isVip != undefined ? data.isVip : '';
      var maxType = data.maxType != undefined ? data.maxType : '';

      this.data.isVip = isVip;
      this.data.maxType = maxType;

      if (this.data.recommendPage == 1) {
        this.data.recommendListData = [];
      }
      var page = this.data.recommendPage + 1;
      this.data.recommendPage = page;
      this.newshoplist(data.listShop);
    } else {
      this.showToast(data.message, 2000);
    }
  },

  newshoplist: function(obj) {
    for (var i = 0; i < obj.length; i++) {
      var new_clde = obj[i].shop_code.substr(1, 3);
      var new_pic = new_clde + '/' + obj[i].shop_code + '/' + obj[i].def_pic;
      obj[i].def_pic = new_pic;
      var shop_se_price = 0;
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
      if (app.globalData.oneYuanData == 0) //是1元购
      {
        var se_price = (obj[i].assmble_price * 1).toFixed(1);
        if (this.data.isVip > 0) //如果是会员 列表价格=单独购买价-抵扣价格
        {
          // se_price = obj[i].shop_se_price - this.data.reduceMoney > 0 ? (obj[i].shop_se_price - this.data.reduceMoney) : '0.0';

          se_price = util.get_discountPrice(obj[i].shop_se_price, this.data.shop_deduction, this.data.reduceMoney, this.data.maxType);
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
      supply_isShow: app.showSub,
      showFightData:true

    })
  },

  shareLoginSetting: function() {
   
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
            app.New_userlogin(function() {

              app.queryJY(function(noJY) { //noJY:没有交易记录
                if (noJY) {
                  
                  that.setData({
                    upperGoYiFuShow: true,
                    suspensionHongBao_isShow:true
                  })
                }                
              })

            });
          } else { //拿了到用户信息-去查询
            app.queryJY(function(noJY) { //noJY:没有交易记录
              if (noJY) {
                that.setData({
                  upperGoYiFuShow: true,
                  suspensionHongBao_isShow: true
                })
              }
            })
          }

        } else { //未授权

          that.setData({
            upperGoYiFuShow: true,
            suspensionHongBao_isShow: true
          })

        }
      }
    })
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
            that.xuanfu_image();
            wx.hideLoading();

            if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
              that.setData({
                notShowHongBao: true
              })
            }
            if (isxuanfu == 'xuanfu') {
              that.redHongClick();
            }else{
              if (that.data.firstredHongbaoNewuserShow) {
                that.redHongClick();
                that.setData({
                  // ninthHongbaoShow: true,
                  firstredHongbaoNewuserShow: false
                })
              }
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
  ninthHongbaoSubmit: function (e) {
    formId = e.detail.formId;
    if (app.globalData.user != null) {
      util.httpPushFormId(e.detail.formId);
    }
    this.setData({
      ninthHongbaoShow: false
    })
  },
  //30-50元红包点存入我的帐户
  xianjinRedsubmit: function (e) {
    var that = this;
    formId = e.detail.formId;
    if(that.data.firstredHongbaoNewuserShow)
    {
      // if (app.globalData.channel_type == 1)//渠道进入
      // {
      //   that.setData({
      //     firstredHongbaoNewuserShow: false
      //   })
      // }else{
      //   if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
      //     that.setData({
      //       firstredHongbaoNewuserShow: false
      //     })
      //   }
      // }
      // showHongBao.clickHongbao(that, function (is_show) { })


      if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
        that.setData({
          firstredHongbaoNewuserShow: false
        })
      }
    }else{
      wx.navigateTo({

        url: '../redHongBao?shouYePage=ThreePage' + '&roll_code=' + that.data.roll_code + "&isFirst=" + that.data.isFirst + "&isNew=" + that.data.isNew,
      })
      that.setData({
        upperGoYiFuShow: false
      })
    }

  },
  closeNewThirty:function(){
    this.setData({
      upperGoYiFuShow: false
    })
    if(this.data.firstredHongbaoNewuserShow)
    {
      var that = this;
      that.setData({
        firstredHongbaoNewuserShow: false
      })
      showHongBao.loopShowHongbao(that, showHongBao, function (is_show) {
        if (is_show) {
          that.setData({
            firstredHongbaoNewuserShow: true
          })
        }
      })
    }
  },
  //悬浮红包
  signHongBaosubmit: function (e) {
    var that = this;
    formId = e.detail.formId;
    if (app.globalData.user != null) {
      util.httpPushFormId(e.detail.formId);
    }

    // if (app.globalData.channel_type == 1)//渠道进入
    // {
    //   wx.navigateTo({
    //     url: '/pages/sign/sign',
    //   })
    // }else{
    //   if (app.globalData.user != null && app.globalData.user.userToken != undefined) {

    //     util.get_userOrderRoll48Hours(function (userOrderRoll48Hours) {
    //       if (userOrderRoll48Hours == 1) {
    //         wx.navigateTo({
    //           url: '/pages/shouye/redHongBao?shouYePage=FourPage',
    //         })
    //       } else {

    //         wx.navigateTo({
    //           url: '/pages/sign/sign',
    //         })
    //       }
    //     })
    //   } 
    // }
  },

  //生成分享的合成图片
  getCanvasPictiure: function () {
    var that = this;
    wx.showLoading({
      title: '请稍后',
      mask: true,
    });
    util.getCanvasPictiure("shareCanvas", sharePic, that.data.sharePrice,'拼团分享', function (tempFilePath) {
      wx.hideLoading();
      if (tempFilePath != undefined && tempFilePath != null) {
        that.setData({
          tempFilePath: tempFilePath
        })
      } else {
        that.setData({
          tempFilePath: sharePic
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    //关闭分享弹窗
    this.setData({
      fightSuccess_fail_isShow: false,
    })

    var user_id = app.globalData.user != undefined ? app.globalData.user.user_id : '';;

    return {
      title: this.data.shareTitle,
      path: '/pages/shouye/fightDetail/fightDetail?shop_code=' + shop_code + "&isShareFlag=true" + "&user_id=" + user_id + "&code=" + this.data.roll_code + "&isJoinGroup=true" + "&isTM=" + this.data.isTM + "&isFirst=" + this.data.isFirst + "&isNew=" + this.data.isNew,
      // imageUrl: sharePic,
      imageUrl: this.data.tempFilePath,
      success: function(res) {

      },
      fail: function(res) {
        // 转发失败
      }
    }
  },

  //自动登录
  globalLogin: function () {
    var that = this;
    util.autoLogin(loginCount, function (loginfailYiFuShow, login_discribution, login_buttontitle, newloginCount) {
      loginCount = newloginCount;
      if (loginCount == 1)//登录成功
      {
        that.shopLishHttp();
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
  //关闭免拼卡弹框
  closeFreeFightCoupon:function(){
    this.setData({
      guidefightCouponShow:false
    })
  },
  //去购买免拼卡
  freeFightcouponTap:function(){
    this.setData({
      guidefightCouponShow: false,
      fightSuccess_fail_isShow:false,
    })

    if (this.data.free_num > 0 && this.data.free_num < 3) {
      this.setData({
        guideFightDeliverShow: true
      })
    } else {
      
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
              url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=freeFight'
            })
          }
        }
      })
    }

  },
  //领免拼卡 发货卡
  fight_deliver_lingtap:function(){
    this.setData({
      // guideFightDeliverShow: false,
      fightSuccess_fail_isShow:false
    })
    if (this.data.free_num > 1) {
      wx.navigateTo({
        url: '/pages/sign/sign?comefrom=deliver_fightstyle',
      })
    }else{
     
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
              url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=freeFight'
            })
          }
        }
      })
    }
  },

  //成为会员
  fight_deliver_memebertap:function(){
    this.setData({
      // guideFightDeliverShow: false,
      fightSuccess_fail_isShow:false
    })
    wx.navigateTo({
      url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=Fight'
    })
  },

  //关闭免拼卡发货卡发货弹框
  closeInvitImage:function(){
    this.setData({
      guideFightDeliverShow:false
    })
  }
})