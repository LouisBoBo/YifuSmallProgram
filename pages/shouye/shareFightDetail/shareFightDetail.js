// pages/shouye/shareFightDetail/shareFightDetail.js
import config from '../../../config';
import ToastPannel from '../../../common/toastTest/toastTest.js';
var util = require('../../../utils/util.js');
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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    upyconfig: config.Upyun,
    shareFightShop:'true',
    imgUrls: [],
    isTM:'',
    isMad: false,
    scrollTop1: 0,
    scrollTop2: 0,
    currentTab: 0,
    leftTitle: '<上一步',
    rightTitle: '下一步>',
    showLeft:false,
    showRight:true,
    showShareTitle: '1、点下方【建群分享好友】再点【创建新聊天】',
    showTitle: ["1、点下方【建群分享好友】再点【创建新聊天】", "2、选择15位女性好友，点右上角【确定】","3、点【发送】，分享199元优惠券"],
    upperGoYiFuShow:false,
    video_isplaying:false,
    freelingMeiyi:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShopData(options.isSubmitOrder);
    util.httpUpyunJson(this.shareData)

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
  onUnload:function(){
    //清空保存的数据
    setTimeout(function () {
      wx.setStorageSync('first_shopdata', '');
    }, 5000)

    if (scollTimeOut) {
      clearInterval(scollTimeOut);
      scollTimeOut = null;
    }
    if (animationTimer) {
      clearInterval(animationTimer);
      animationTimer = null;
    }
    if (this.animationMiddleHeaderItem) {
      clearInterval(this.animationMiddleHeaderItem);
      this.animationMiddleHeaderItem = null;
    }
  },
  onShow:function(){
    this.hongBaoAnimation();
    if (isOpenShare)
    {
      this.setData({ upperGoYiFuShow:true});
      isOpenShare = false;
    }
  },
  onHide:function(){
    clearInterval(animationTimer);
    clearInterval(scollTimeOut);
    animationTimer = null;
    scollTimeOut = null;
  },
  //商品数据
  getShopData: function (isSubmitOrder){
    var orderShops = wx.getStorageSync('first_shopdata');

    if (!isSubmitOrder) {
      isSubmitOrder = "0"
    }
    
    for (var i = 0; i < orderShops.length; i++) {

      if (isSubmitOrder == '1')//下单过来的
      {
        orderShops[i].new_pic = orderShops[i].shopPic;
        orderShops[i].shop_price = orderShops[i].newOldprice;
        orderShops[i].shop_name = orderShops[i].shopName;
        orderShops[i].shop_code = orderShops[i].shopCode;
      }else{
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
      shopList:orderShops,
      path: "/pages/shouye/detail/detail?shop_code=" + orderShops[0].shop_code
    })
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
  
  //获取轮播数据
  shareData:function(data){
    console.log('data='+ data);
    var List = data.freeBuy_photo.list;
    var photoList = [];
    for (var i = 0; i < List.length; i++)
    {
      var imgurl = config.Upyun + List[i].value;
      if(imgurl)
      {
        photoList.push(imgurl);
      }
    }
    this.setData({
      imgUrls: photoList
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

  //滑动切换
  bindChange: function (e) {
    var current = e.detail.current;
    this.changeSwiperShow(current);
  },
  closeUpperGoYiFuShow:function(e){
    this.setData({
      upperGoYiFuShow: false
    })
  },

  //左按钮
  leftclick:function(){
    var current = this.data.currentTab - 1;
    this.changeSwiperShow(current);
  },
  //右按钮
  rightclick: function () {
    var current = this.data.currentTab + 1;
    if (current == this.data.imgUrls.length)
    {
      this.setData({upperGoYiFuShow:true});
    }else{
      this.changeSwiperShow(current);
    }
  },

  changeSwiperShow: function (current){
    var that = this;
    if (current == 0) {
      that.setData({ showLeft: false })
    } else if (current == that.data.imgUrls.length - 1) {
      that.setData({ rightTitle: '完成步骤>' })
    } else {
      that.setData({
        showLeft: true,
        rightTitle: '下一步>',
      })
    }

    that.setData({
      currentTab: current,
      showShareTitle: that.data.showTitle[current]
    });
  },
  openShare:function(){
    isOpenShare = true;
  },
  freelingShare:function(){
    this.setData({
      upperGoYiFuShow: false
    })
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

  /**播放视频*/
  videoplay: function (e) {
    var videoContext = wx.createVideoContext('freelingvideo', this);
    videoContext.play()
    this.setData({
      videoContext: videoContext,
      video_isplaying:true
    })
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