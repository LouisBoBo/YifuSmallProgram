import config from'../../../../config.js';
var util = require('../../../../utils/util.js');
var app = getApp();
var order_code = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upyconfig: config.Upyun,
    Upyun: config.Upyun,
    isorderdetail: 'true',
    openBuySuccessShow:false,
    rawardMondy:"0",
    cardslist: ['', '', ''],
    guideFightDeliverShow:false,
    delivery_time:30,//发货时间
    isVip:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  
    var item = wx.getStorageSync("orderitem");   
    var shop_from = item.shop_from;
    var newshopname = "";
    var newshopprice = "";
    if (shop_from == 4 || shop_from == 6) {//夺宝订单
      newshopname = item.order_name;
      this.setData({
        isorderdetail: 'false',
      })
    }else{//普通订单
      newshopname = item.orderShops[0].shop_name;
      var newprice = item.orderShops[0].shop_price * 0.5 > 50 ? 50 : item.orderShops[0].shop_price*0.5;
      newshopprice = newprice.toFixed(1);
      order_code = item.order_code;
    }
    //商品名称
    if (newshopname.length > 16) {
      newshopname = newshopname.substr(0, 16) + '... ';
    }
    
    if (shop_from == 4 || shop_from == 6) {//夺宝订单
      item["new_shopname"] = newshopname;
    } else {//普通订单
      item.orderShops[0]["new_shopname"] = newshopname;
    }
    this.HandleData(item);

    if (options.isNormalBuy == "true")
    {
      this.setData({
        openBuySuccessShow: true,
        rawardMondy: newshopprice
      })
    }

    this.getpicData(item);//处理发货卡展示
  },
  onShow: function (){

    //发货卡购买成功后返回弹发货卡张数的弹框
    var kdeliverSuccessBack = wx.getStorageSync('KdeliverSuccessBack')
    if (kdeliverSuccessBack == '1') {
      var that = this;
      var item = that.data.orderdetail;
      util.get_daojuNumber(item.order_code,function (data) {
        item.send_num = data.deliveryCardNum;
        var isDeliver = data.isDeliver;
        if (isDeliver == 1)
         {
          item.orderstatus = "待发货";
          that.HandleData(item);
          that.setData({
            guideFightDeliverShow: false
          })
        }else if(item.send_num == 0){
          that.setData({
            guideFightDeliverShow: false
          })
        } else {
          that.getpicData(item);//处理发货卡展示
        }
      })

      wx.setStorageSync('KdeliverSuccessBack', '');
    }
  },
  getpicData: function (item){
    //免拼卡发货卡发货
    var send_num = item.send_num;
    var free_num = item.free_num;
    var picdatas = [];
    for (var j = 0; j < 3; j++) {
      if (send_num > j) {
        picdatas.push(config.Upyun + 'small-iconImages/heboImg/free_deliver.png')
      } else {
        picdatas.push(config.Upyun + 'small-iconImages/heboImg/luck_invitButton.png')
      }
    }
    //有免拼卡
    if (item.shop_from == 0 && item.whether_prize == 9 && item.new_free==12 && free_num > 0)
    {
      this.setData({
        is_deliver: false,
        cardslist: picdatas,
        free_num: free_num,
        guideFightDeliverShow:true
      })
    }

    var is_click = wx.getStorageSync(item.order_code);
    //有发货卡
    if (item.shop_from == 13 && item.whether_prize == 2 && item.new_free == 1 && send_num > 0 && send_num < 3 && is_click != 'true' && item.orderstatus != '订单关闭') 
    {
      this.setData({
        is_deliver: true,
        cardslist: picdatas,
        send_num: send_num,
        guideFightDeliverShow: true
      })
    }
  },
  HandleData:function(data){
    var orderlist = [];
    orderlist.push(data);
    var paytime = util.getMyDate(data.add_time,".") 
    this.setData({

      Upyun: config.Upyun,
  
      orderdetail:data,
      orderList: orderlist,
      orderpaytime: paytime,
    })
  },
  
  //商品详情
  orderdetailTap: function (event) {
    var item = event.currentTarget.dataset.item;
    var shopdata = event.currentTarget.dataset.shopdata;
    var shop_from = item.shop_from;
    var shopcode = "";
    if (shop_from == 4 || shop_from == 6) {//夺宝订单
      shopcode = item.bak;
    } else {//普通订单
      shopcode = shopdata.shop_code;
    }
    //免费领列表页2的订单看不到详情
    if (item.new_free != 13){
      wx.navigateTo({
        url: '../../../shouye/detail/detail?' + "shop_code=" + shopcode,
      })
    }
  },

  //拨打电话
  phonetap:function(event){
    wx.makePhoneCall({
      phoneNumber: '4008884224' 
    })
  },

  //去赚钱
  getMoneyTap:function(){
    this.setData({
      openBuySuccessShow:false
    })
    wx.navigateTo({
      url: '../../../sign/sign',
    })
  },
  closeFight:function(){
    this.setData({
      openBuySuccessShow: false
    })
  },
  //领免拼卡 发货卡
  fight_deliver_lingtap: function () {
    this.setData({
      // guideFightDeliverShow: false
    })
    if (this.data.send_num > 1) {
      wx.navigateTo({
        url: '/pages/sign/sign?comefrom=deliver_fightstyle',
      })
    }else{
      wx.navigateTo({
        url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=deliver'
      })
    }
  },

  //成为会员
  fight_deliver_memebertap: function () {
    this.setData({
      // guideFightDeliverShow: false
    })
    wx.navigateTo({
      url: '/pages/mine/addMemberCard/addMemberCard?memberComefrom=freelingOrder'
    })
  },

  //关闭免拼卡发货卡发货弹框
  closeInvitImage: function () {
    this.setData({
      guideFightDeliverShow: false
    })
  }

})