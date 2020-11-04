// pages/listHome/order/oneLuckPan/oneLuckPan.js
import config from '../../../../config.js';
var util = require('../../../../utils/util.js');
var app = getApp();
var isMoving = false;
var firstChou = false;
var scollTimeOut;
var scollTimePause;
var dataListTemp1 = [];
var supplabelList = [];//所有品牌集合
var typelist = [];//二级类目集合
Page({
  data: {
    Upyun: config.Upyun,
    icon_zhizhen: "onebuy_zhizhen.png",
    oneYuanDiscriptionTitle: '疯抢返还说明',
    awardsList: {},
    animationData: '',
    btnDisabled: '',
    totalNum: 32,// 奖品总数
    timer: null,
    step: 0,
    scrollTop1: 0,
    scrollTop2: 0,
    mListData1: [],
    showGuiZe: false,
    tapshowGuiZe :false,
    showStopBtn:false,
    oneyuanValue: 1,
    oneyuanCount: 1,
    wxcx_shop_group_price:1,
  },
  onLoad: function () {
    dataListTemp1 = [];
    isMoving = false;
    firstChou = true;

    this.setOneyuanCount();
    this.setData({
      showGuiZe: true,
    });

    wx.setNavigationBarTitle({
      // title: app.globalData.oneYuanValue + '元抽奖',
      title: "疯抢人气大牌",
    })
    wx.setStorageSync("discountShow", false);

    //品牌列表
    var basesData = wx.getStorageSync("shop_tag_basedata");
    typelist = basesData.data.type_tag;
    //  supplabelList = basesData.data.supp_label;
    //只取type = 1的

    var basesData = wx.getStorageSync("shop_tag_basedata");
    var supAll = basesData.data.supp_label;
    for (var i = 0; i < supAll.length; i++) {
      var type = supAll[i].type;
      if (type == 1) {
        supplabelList.push(supAll[i]);
      }
    }

    // this.initData(false);
    // pRatio = wx.getSystemInfoSync().pixelRatio;
    if (scollTimeOut) {
      clearInterval(scollTimeOut);
      scollTimeOut = null;
    }
    if (scollTimePause) {
      clearInterval(scollTimePause);
      scollTimePause = null;
    }
    this.initLimitAwardsList();
  },

  //设置抽奖次数
  setOneyuanCount:function(){
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
  dayReward_show:function(){
    this.setData({
      tapshowGuiZe: true,
    })
  },
  /**
  * 开始抽奖
  */
  startLuckBtn: function (event) {
    var that = this;

    if (that.data.showGuiZe )
    {
      that.stop();
    }

    that.setData({
      showGuiZe: false,
      tapshowGuiZe: false,
    })
  },
  //再抽一次
  startLuckBtn_Again: function (event) {

    //关闭抽奖结果弹窗
    this.setData({
      showChoujiangComplete: false,
    })

    //下单
    this.stop();

  },
  //活动规则上的开始抽奖
  activestartLuckBtn: function (event) {
    if (this.data.timer == null) {//停止状态
        this.stop();
    }
    this.setData({
      showGuiZe: false,
      tapshowGuiZe: false,
    })
  },
  //抽奖结果
  animiComplete: function () {
    this.setData({
      showChoujiangComplete: true
    });

    this.updateChoujiangStatus();
  },
  //抽奖结果弹窗上面的X
  dialog_close_toBind: function () {
    this.setData({
      showChoujiangComplete: false,
    });
  },

  //更新抽奖状态
  updateChoujiangStatus: function () {

    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var ulrstr = firstChou ? 'order/updateOrderOneFromCZ?' :'order/updateOrderOneFrom?';
    
    var oldurl = config.Host + ulrstr + config.Version + '&token=' + token
      + '&order_code=' + wx.getStorageSync("oneYuan_order_code");
    util.http(oldurl, that.updateCallBack);
  },
  updateCallBack: function (data) {
    firstChou = false;
  },

  //获取可抵扣余额
  top_shopHttp: function () {
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
      this.setData({
        moneyDiscountShowFlag: true,
        moneyDiscount: data.order_price.toFixed(1),
      })

      wx.setStorageSync("discountShow", true);
    }
  },

  //余额抵扣弹窗点击知道了 关闭
  getYiDouBtn: function () {
    this.setData({ moneyDiscountShowFlag: false })
  },

  //查看余额
  getYueBtn: function () {
    wx.navigateTo({
      url: '../../../mine/wallet/wallet',
    })
    this.setData({ moneyDiscountShowFlag: false })
  },

  // 提交订单
  submitOrder: function () {

    var that = this;
    var dataUrl = wx.getStorageSync("oneYuanOrderUrl");
    util.http(dataUrl, that.confirmorderResult);
    this.setData({ 
      dataurl: dataUrl ,
      tapshowGuiZe: false
    });
  },


  // 提交订单结果
  confirmorderResult: function (data) {

    var that = this;

    if (data.status == 1) {
      this.setData({ totalAccount: data.price })
      // wxpaycx / wapUinifiedOrder 单个;wxpaycx / wapUinifiedOrderList 多个
      var payUrl = 'wxpaycx/wapUinifiedOrderList?';
      if (data.url == 1 || this.data.buyType == 1)
        payUrl = 'wxpaycx/wapUinifiedOrder?';

      var order_code = data.order_code;
      wx.setStorageSync("oneYuan_order_code", order_code);

      //保存当前1元下单的链接
      wx.setStorageSync("oneYuanOrderUrl", this.data.dataurl);

      if (data.price == 0) { //新用户  直接开始抽奖

        //随机一个不中奖的区域1-63
        that.roateStartLuck(parseInt(Math.random() * 63 + 1));
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

  // 支付
  //   appId: "wxeb7839c8cbeef680"
  // nonceStr: "zr73uq589vbk59tlntcri8a1dgxkk44w"
  // package: "prepay_id=wx2017112416500900940db3290184964231"
  // paySign: "2DADDBA31784C2D2271FA0343A1B10AD"
  // signType: "MD5"
  // timeStamp: 1511858924066
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
          //支付成功自动抽奖
          firstChou = true;
          that.setOneyuanCount();
          that.stop()
        },
        'fail': function (res) {
         
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


  // 转盘抽奖部分
  stop() {

    var currentargs = "";
    console.log('stop', this.data.timer);
    if (this.data.animationData != "") {
      currentargs = this.data.animationData.actions[0].animates[0].args[0];
      console.log('currentargs=', currentargs);
    }

    if (this.data.timer !== null) {//停止
      var that = this;
      
      that.setData({
        oneyuanCount: that.data.oneyuanCount-1,
      })
      if (currentargs % 360 != 0) {
        clearInterval(that.data.timer)
        that.animiComplete();
        that.setData({
          timer: null,
          showStopBtn: false
        })
      } else {

        var time = setTimeout(function () {
          clearInterval(that.data.timer)
          that.animiComplete();
          that.setData({
            timer: null,
            showStopBtn: false
          })
        }, 33);
      }
    } else {//抽奖
    
      if (!firstChou && this.data.oneyuanCount<1) { //如果已经抽过了，再点抽奖按钮就需要下单
        this.submitOrder();
        return;
      }else{
        this.getLottery()//没抽过
      }
      // firstChou = false;
    }
  },

  getLottery: function () {
    var that = this
    var awardIndex = Math.random() * parseInt(this.data.totalNum) >>> 0;

    // 获取奖品配置
    var awardsConfig = app.awardsConfig,
      runNum = 8
    if (awardIndex < 2) awardsConfig.chance = false
    console.log(awardIndex)

    // 记录奖品
    var winAwards = wx.getStorageSync('winAwards') || { data: [] }
    winAwards.data.push(awardsConfig.awards[awardIndex].name + '1个')
    wx.setStorageSync('winAwards', winAwards)
    if (this.data.timer === null) {
      var timesRun = 0;
      var timer = setInterval(function () {
        that.rotateAni(that.data.step++)

        // timesRun += 1;
        // if (timesRun === 20) {
        //   clearInterval(timer);
        // }

      }, 33);
      that.setData({
        timer: timer
      })
    }
  },

  onShow() {
    this.animationData = wx.createAnimation({
      duration: 33,
      timingFunction: 'ease-out', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0',
      success: function (res) {
        console.log("res")
      }
    })
  },
  onHide(){
    clearInterval(this.data.timer)
  },
  onUnload(){
    clearInterval(this.data.timer)
  },
  rotateAni(n) {
    console.log("rotate==" + n)
    this.animationData.rotate(5 * (n)).step()
    this.setData({
      animationData: this.animationData.export(),
      showStopBtn: true
    })
  },

  //获取数据     1元购抢购列表
  initLimitAwardsList: function () {
    var that = this;
    for (var i = 0; i < 50; i++) {
      dataListTemp1.push(that.addToLimitList());
    }
    that.setData({
      mListData1: dataListTemp1
    });
    that.count_down();
  },

  count_down: function () {
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
    scollTimeOut = setTimeout(function () {
      that.count_down();
    }, 1000)
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
  out_touchend: function () {
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
  out_touchmove: function () {
    isMoving = true;
    if (scollTimeOut) {
      clearInterval(scollTimeOut);
      scollTimeOut = null;
    }
    // console.log("out_touchmove", isMoving);
  },

  addToLimitList: function () {
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

    limitData["content"] = buyprice + "元买走了" + randomSub + randomType2;

    limitData["pic"] = config.Upyun + "defaultcommentimage/" + util.getDefaultImg();
    return limitData;
  },

  onReady: function (e) {

    var that = this;

    // getAwardsConfig
    app.awardsConfig = {
      chance: true,
      awards: [
        { 'index': 0, 'name': '1元红包' },
        { 'index': 1, 'name': '5元话费' },
        { 'index': 2, 'name': '6元红包' },
        { 'index': 3, 'name': '8元红包' },
        { 'index': 4, 'name': '10元话费' },
        { 'index': 5, 'name': '199元话费' },
        { 'index': 6, 'name': '100元话费' },
        { 'index': 7, 'name': '100元红包' },
        { 'index': 8, 'name': '1元红包' },
        { 'index': 9, 'name': '5元话费' },
        { 'index': 10, 'name': '6元红包' },
        { 'index': 11, 'name': '8元红包' },
        { 'index': 12, 'name': '10元话费' },
        { 'index': 13, 'name': '199元话费' },
        { 'index': 14, 'name': '100元话费' },
        { 'index': 15, 'name': '100元红包' },
        { 'index': 16, 'name': '1元红包' },
        { 'index': 17, 'name': '5元话费' },
        { 'index': 18, 'name': '6元红包' },
        { 'index': 19, 'name': '8元红包' },
        { 'index': 20, 'name': '10元话费' },
        { 'index': 21, 'name': '199元话费' },
        { 'index': 22, 'name': '100元话费' },
        { 'index': 23, 'name': '100元红包' },
        { 'index': 24, 'name': '1元红包' },
        { 'index': 25, 'name': '5元话费' },
        { 'index': 26, 'name': '6元红包' },
        { 'index': 27, 'name': '8元红包' },
        { 'index': 28, 'name': '10元话费' },
        { 'index': 29, 'name': '199元话费' },
        { 'index': 30, 'name': '100元话费' },
        { 'index': 31, 'name': '100元红包' }
      ]
    }

    // wx.setStorageSync('awardsConfig', JSON.stringify(awardsConfig))


    // 绘制转盘
    var awardsConfig = app.awardsConfig.awards,
      len = awardsConfig.length,
      rotateDeg = 360 / len / 2 + 90,
      html = [],
      turnNum = 1 / len  // 文字旋转 turn 值
    that.setData({
      btnDisabled: app.awardsConfig.chance ? '' : 'disabled'
    })
    var ctx = wx.createContext()
    for (var i = 0; i < len; i++) {
      // 保存当前状态
      ctx.save();
      // 开始一条新路径
      ctx.beginPath();
      // 位移到圆心，下面需要围绕圆心旋转
      ctx.translate(150, 150);
      // 从(0, 0)坐标开始定义一条新的子路径
      ctx.moveTo(0, 0);
      // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
      ctx.rotate((360 / len * i - rotateDeg) * Math.PI / 180);
      // 绘制圆弧
      ctx.arc(0, 0, 150, 0, 2 * Math.PI / len, false);

      // 颜色间隔
      if (i % 2 == 0) {
        ctx.setFillStyle('rgba(255,184,32,.1)');
      } else {
        ctx.setFillStyle('rgba(255,203,63,.1)');
      }

      // 填充扇形
      ctx.fill();
      // 绘制边框
      ctx.setLineWidth(0.5);
      ctx.setStrokeStyle('rgba(228,55,14,.1)');
      ctx.stroke();

      // 恢复前一个状态
      ctx.restore();

      // 奖项列表
      html.push({ turn: i * turnNum + 'turn', lineTurn: i * turnNum + turnNum / 2 + 'turn', award: awardsConfig[i].name });
    }
    that.setData({
      awardsList: html
    });

  }

})