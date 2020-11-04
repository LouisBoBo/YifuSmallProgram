// pages/shouye/shareGroupChat/shareGroupChat.js
import config from '../../../config';
import ToastPannel from '../../../common/toastTest/toastTest.js';
var util = require('../../../utils/util.js');
import NumberAnimate from'../../../utils/NumberAnimate.js';

var MD5 = require('../../../utils/md5.js');
var app = getApp();
var dataListTemp1 = [];
var supplabelList = [];
var typelist = [];
var isMoving = false;
var isOpenShare = false;
var scollTimeOut;
var scollTimePause;
var animationTimer;
var needShareCount = 2;//总共需要分享2次
var yikanMoney = 0;
var zaikanMoney = 100;
var shareBTNstring = "分享微信群聊";
var shop;
var kanProgress = 0;

var haiChaMoney = 0;

var shopPrice = 0;
var isSubmitOrder ;
var n1timer ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    upyconfig: config.Upyun,
    shareFightShop: 'true',
    imgUrls: [],
    isTM: '',

    yikanEndStr: "再分享2个群即可砍到0元",
    kanProgress,
    needShareCount,
    yikanMoney,
    zaikanMoney,
    shareBTNstring,

    isMad: false,
    scrollTop1: 0,
    scrollTop2: 0,
    currentTab: 0,
    leftTitle: '<上一步',
    rightTitle: '下一步>',
    showLeft: false,
    showRight: true,
    showShareTitle: '1、点下方【建群分享好友】再点【创建新聊天】',
    showTitle: ["1、点下方【建群分享好友】再点【创建新聊天】", "2、选择15位女性好友，点右上角【确定】", "3、点【发送】，分享199元优惠券"],
    video_isplaying: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    isSubmitOrder = options.isSubmitOrder;

    var basesData = wx.getStorageSync("shop_tag_basedata");
    typelist = basesData.data.type_tag;
    var supAll = basesData.data.supp_label;
    for (var i = 0; i < supAll.length; i++) {
      var type = supAll[i].type;
      if (type == 1) {
        supplabelList.push(supAll[i]);
      }
    }
    console.log("品牌列表" + supplabelList)




    this.initLimitAwardsList();
  },
  onShow: function () {


    this.hongBaoAnimation();
    if (isOpenShare) {//分享成功   
      needShareCount--;

      if (needShareCount == 1) {
        yikanMoney = (shopPrice * 0.8).toFixed(0);
        haiChaMoney = (shopPrice * 0.2).toFixed(0);
        zaikanMoney = (shopPrice * 0.2).toFixed(0);
        shareBTNstring = "分享群聊(1/2)"
        kanProgress = 80;

      }else{
        kanProgress = 100;
        this.setData({ upperGoYiFuShow: true });

      }



      this.setData({
        haiChaMoney,
        needShareCount,
        // yikanMoney,
        zaikanMoney,
        shareBTNstring,
        kanProgress,
        yikanEndStr: "再分享1个群即可砍到0元"

      })
      // this.numberChangeYiKan(yikanMoney);
      // this.numberChangeZaiKan(zaikanMoney);

      let num1 = yikanMoney;
      let refreshTime = 2000 / (num1 / 3);
      let n1 = new NumberAnimate({
        from: num1,//开始时的数字
        speed: 1500,// 总时间
        refreshTime: refreshTime,// 刷新一次的时间
        decimals: 0,//小数点后的位数
        onUpdate: () => {//更新回调函数
          this.setData({
            yikanMoney: n1.tempValue
          });
        },
        onComplete: () => {//完成回调函数
          // this.setData({
          //   num1Complete: " 完成了"
          // });
        }
      });
      n1timer = n1;
      isOpenShare = false;
    }

  },
  onUnload:function(){
    //清空保存的数据
    setTimeout(function () {
      wx.setStorageSync('first_shopdata', '');
    }, 5000)

    if (scollTimeOut) {
      clearInterval(scollTimeOut);
      scollTimeOut = null;
    }
    if (animationTimer){
      clearInterval(animationTimer);
      animationTimer = null;
    }
    if(this.animationMiddleHeaderItem){
      clearInterval(this.animationMiddleHeaderItem);
      this.animationMiddleHeaderItem = null;
    }
    if (n1timer.interval){
      clearInterval(n1timer.interval);
      n1timer.interval = null;
    }
  },

  closeUpperGoYiFuShow: function (e) {
    this.setData({
      upperGoYiFuShow: false
    })
  },

  mengcengTap: function () {
    this.setData({
      closeMC: true
    })
  },
  openShare: function () {
    isOpenShare = true;
  },
  //商品数据
  getShopData: function (isSubmitOrder) {
    var orderShops = wx.getStorageSync('first_shopdata');

    var that = this;
    if (!isSubmitOrder) {
      isSubmitOrder = "0"
    }

    shop = orderShops[0];
    if (isSubmitOrder == '1') {
      shop.original_price = orderShops[0].shopPrice;
    }
    shopPrice = shop.original_price;


    for (var i = 0; i < orderShops.length; i++) {

      if (isSubmitOrder == '1') //下单过来的
      {
        orderShops[i].new_pic = orderShops[i].shopPic;
        orderShops[i].shop_price = orderShops[i].newOldprice;
        orderShops[i].shop_name = orderShops[i].shopName;
        orderShops[i].shop_code = orderShops[i].shopCode;
      } else {
        var shop_code = orderShops[i].shop_code;
        var shop_pic = orderShops[i].shop_pic;
        //商品图片
        var newcode = shop_code.substr(1, 3);
        var new_pic = this.data.Upyun + newcode + '/' + shop_code + '/' + shop_pic;

        orderShops[i].new_pic = new_pic;
        orderShops[i].shop_price = orderShops[i].original_price;
      }
    }

    this.setData({
      isSubmitOrder: isSubmitOrder,
      shopList: orderShops,
      path: "/pages/shouye/detail/detail?shop_code=" + orderShops[0].shop_code
    })

  

    setTimeout(function () {
      //默认砍掉50%
      yikanMoney = (shopPrice * 0.5).toFixed(0);
      haiChaMoney = (shopPrice * 0.5).toFixed(0)
      zaikanMoney = (shopPrice * 0.3).toFixed(0);
      kanProgress = 50;



      // yikanMoney = (shopPrice * 0.4).toFixed(0);
      // haiChaMoney = (shopPrice * 0.6).toFixed(0)
      // zaikanMoney = (shopPrice * 0.3).toFixed(0);
      // kanProgress = 40;

      that.setData({
        // yikanMoney,
        haiChaMoney,
        zaikanMoney,
        kanProgress,
        yikanEndStr:"再分享2个群即可砍到0元"
      })

      let num1 = yikanMoney;
      let refreshTime = 2000 / (num1 / 3);
      let n1 = new NumberAnimate({
        from: num1,//开始时的数字
        speed: 1500,// 总时间
        refreshTime: refreshTime,// 刷新一次的时间
        decimals: 0,//小数点后的位数
        onUpdate: () => {//更新回调函数
          that.setData({
            yikanMoney: n1.tempValue
          });
        },
        onComplete: () => {//完成回调函数
          // this.setData({
          //   num1Complete: " 完成了"
          // });
        }
      });
      n1timer = n1;
    }, 1500)
  },


  //商品详情
  shopDetailTap: function (e) {
    var url = "";
    var shop_code = e.currentTarget.dataset.shop_code
    if (this.data.isTM == 1) {
      url = '../detail/detail?' + "shop_code=" + shop_code + "&shop_type=2";
    } else {
      url = '../detail/detail?' + "shop_code=" + shop_code;
    }
    wx.navigateTo({
      url: url
    })
  },


  //获取滚动列表数据
  initLimitAwardsList: function () {
    var that = this;
    for (var i = 0; i < 50; i++) {
      dataListTemp1.push(that.addToLimitList());
    }
    that.setData({
      mListData1: dataListTemp1
    });

    
    needShareCount = 2;
    this.setData({
      needShareCount
    })

    // that.count_down();
    this.getShopData(isSubmitOrder);
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
      that.setData({
        scrollTop1: that.data.scrollTop1 + 60,
        scrollTop2: that.data.scrollTop2 + 60
      });
    } else {
      that.setData({
        scrollTop1: that.data.scrollTop1 + 60
      });
    }
    scollTimeOut = setTimeout(function () {
      that.count_down();
    }, 1000)
  },
  scrolltolower1: function () {
    var temp1 = this.data.mListData1;

    Array.prototype.push.apply(temp1, dataListTemp1);
    this.setData({
      mListData1: temp1
    });
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

    // limitData["content"] = buyprice + "元买走了" + randomSub + randomType2;
    limitData["content"] = "免费领走了" + randomSub + randomType2;

    limitData["pic"] = config.Upyun + "defaultcommentimage/" + util.getDefaultImg();
    return limitData;
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
        this.animationMiddleHeaderItem.scale(1.1).step();
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



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var user_id = app.globalData.user.user_id;
    var page = 'pages/shouye/redHongBao';
    var str = user_id + ',' + 'ThreePage' + ',' + 'QRcode';

    //普通小程序二维码
    var path = 'pages/shouye/redHongBao?scene=' + str;
    return {
      title: '199元购物红包免费抢，多平台可用，快来试试人品吧',
      path: path,
      imageUrl: config.Upyun + 'small-iconImages/heboImg/freeling_share199yuan.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})