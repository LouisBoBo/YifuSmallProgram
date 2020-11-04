// pages/listHome/order/confirmFight/confirmFight.js

import config from '../../../../config';
var util = require('../../../../utils/util.js');
var publicUtil = require('../../../../utils/publicUtil.js');
var WxNotificationCenter = require('../../../../utils/WxNotificationCenter.js');

var app = getApp();
var is_t = 1; //开团标识 1开团  2参团
var orderitem; //订单详情数据
var oneBuyCouponId;
var isNewTM; //1特卖，0普通
var payCallBackCount;
var zeroPay = false; //单独购买 是否是不需要支付的订单
var is_submitOrder; //是否可以提交订单

var pay_order_code;




var oldPrice; //商品原售价

var oldShopPriceFial; //商品原价


var order_channel; //下单渠道


var payUrl = 'wxpaycx/wapUinifiedOrderList?';







var tempShopData = [];


// 拼团下单专用

Page({

  /**
   * 页面的初始数据
   */
  data: {

    Upyun: config.Upyun,
    // 地址信息
    address: '',
    phone: '',
    consignee: '',
    address_id: '',
    shopData: {},
    showZeroBuyRemind: false,
    shopTotalMoney: 0, //商品总金额
    discountMoney: 0, //余额抵扣
    payMoney: 0, //实付款
    discountNum: 0, //专柜折扣
    banlance_redpacked_show: false, //体验抽奖红包是否显示
    totalAccount: 0, //支付金额（跳转抽奖界面需要的参数）
    buyType: 0, //下单类型  0.普通商品  1.夺宝商品(1分钱和原价两种：通过flag判断 1.1分钱) 2.活动商品 9/10 一元购拼团
    order_code: '', //支付的订单编号
    dataurl: '', //1元购下单链接
    wxcx_shop_group_price: '',
    roll_code: '' //拼团团号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    new app.ToastPannel();
    oneBuyCouponId = undefined
    isNewTM = options.isTM;

    //是否有拼团
    if (options.roll_code != undefined) {
      is_t = 2;
      this.setData({
        roll_code: options.roll_code,
        youhuiStr:"参团免费"
      })
    } else {
      is_t = 1; //开团

      this.setData({
        youhuiStr: "开团免费"

      })
    }


    


    order_channel = wx.getStorageSync("advent_channel")
    order_channel ? order_channel = '&order_channel=' + order_channel : ''

    payCallBackCount = 0;
    WxNotificationCenter.addNotification("deleteAddress", this.httpAddress, this)
    zeroPay = false;

    var shopData = wx.getStorageSync('shopData')


    shopData.assmble_price = shopData.assmble_price.toFixed(1);

    shopData['newOldprice'] = shopData.shopOldPrice;
    tempShopData = []
    tempShopData.push(shopData);

    //保留两位小数  shopOldPrice shopPrice
    shopData.shopPrice = Number(shopData.shopPrice).toFixed(2);
    shopData.shopOldPrice = Number(shopData.shopOldPrice).toFixed(2);

    oldPrice = Number(shopData.shopPrice).toFixed(2)
    oldShopPriceFial = Number(shopData.shopOldPrice).toFixed(2)

    this.setData({

      isTM: options.isTM,
      shop_type: options.shop_type != undefined ? options.shop_type : '',
      shopData: shopData,
      shopTotalMoney: (shopData.shopPrice * shopData.shopNum).toFixed(2),
      discountNum: (shopData.shopPrice / shopData.shopOldPrice * 10).toFixed(2),
      isNew: options.isNew != undefined ? options.isNew : '',
      is_redHongBao: options.is_redHongBao != undefined ? options.is_redHongBao : '',
    })


    // 修改商品支付价格

    var se_price = (this.data.wxcx_shop_group_price * 1).toFixed(2);
    shopData.shopOldPrice = shopData.shopPrice;
    shopData.shopPrice = se_price;


    this.setData({
      shopData: shopData,
      payMoney:  "0.00" ,
      shopTotalMoney: (shopData.shopPrice * shopData.shopNum).toFixed(2),
      oldShopPriceFial: oldShopPriceFial
    })
  },

  // 选择地址
  toChooseAddre: function(event) {
    wx.setStorageSync('address_id', this.data.address_id)
    wx.navigateTo({
      url: '../address/chooseAddress',
    })
  },

  // 获取 微信 地址
  toChooseWXAddreess: function(e) {
    var that = this;
    wx.showModal({
      title: '',
      content: '是否使用微信地址',
      confirmText: "确认",
      cancelText: "不使用",
      success: function(res) {
        if (res.confirm) {
          wx.chooseAddress({
            success: function(res) {
              // console.log(JSON.stringify(res))
              var detail = res.provinceName + res.cityName + res.countyName + res.detailInfo;
              var dataUrl = config.Host + "address/insert?" + config.Version + "&token=" + app.globalData.user.userToken + "&consignee=" + res.userName + "&address=" + detail + "&phone=" + res.telNumber + '&province=0&city=0&&area=0'; //+ "&province=" + province + "&city=" + city + "&area=" + area;//"&street=0";
              util.http(dataUrl, that.result)
            },
            fail: function(err) {
            }
          })

        } else if (res.cancel) {
          wx.navigateTo({
            url: '../address/chooseAddress',
          })
        }
      }
    })
  },
  result: function(data) {
    this.showToast(data.message, 2000);
  },

  // 提交订单
  submitOrder: function(e) {
    if (!is_submitOrder) //如果当前正在提交订单则不能重复提交
    {
      return;
    }
    //男性用户不可下单支付
    if (app.globalData.user.gender == 1) {
      this.showToast('系统维护中，暂不支持支付', 2000);
      return;
    }

    wx.showLoading({
      title: "请稍后",
      mask: true
    })

    util.httpPushFormId(e.detail.formId);
    var message = e.detail.value.message;

    // is_t = this.data.roll_code?'2':'1';//1开团  2参团
    var result = this.data.shopData.shopNum + '^' + this.data.shopData.shopCode + '^' + this.data.shopData.stock_type_id; //'1^1AAC163181121^30075^0';
    //开团
    var dataUrl = config.Host + "order/addOrderListPT?" +
      config.Version +
      "&token=" + app.globalData.user.userToken +
      '&message=' + message +
      '&result=' + result +
      '&address_id=' + this.data.address_id +
      '&t=' + is_t +
      order_channel



    if (is_t >= 2) //参团
    {

      dataUrl = config.Host + "order/addOrderListPT?" +
        config.Version +
        "&token=" + app.globalData.user.userToken +
        '&message=' + message +
        '&result=' + result +
        '&address_id=' + this.data.address_id +
        '&t=' + is_t +
        '&roll_code=' + this.data.roll_code +
        order_channel
    }

    var that = this;
    var ids = '';
    if (config.Host.indexOf("www.52yifu.wang") != -1)//测试环境
    {
      ids = ['SSLLEobwBCfsE8aXs89jzIsE9NNkmJxHNOSDSkpiaPo', 'VNIahV67MYiEKuhwDCCVvqdQuEZbTj1D5l7nj_TMWGk', 'vhbEjSHVOs5oCGbkhWxaAvhxzKj8fQGRDcCD2TI8vZI'];
    } else {
      ids = ['YYPs9vHnqNDTNNkhL0zJFnEqNYXBfMdVCU1hnVIm-Ow', 'MoZmyHvBikwilHNTS6u0MQvOh5faY-dwa0ogSRhMQaU', 'DC2E0pBII-4XTg-EczPnwN5jCY1B7s8YRSeoItQAMYA'];
    }
    wx.requestSubscribeMessage({
      tmplIds: ids,
      success(res) {
        console.log("订阅消息res=" + res)
        util.http(dataUrl, that.confirmorderResult);

        var temp_id = ids[0];
        if (res[temp_id] == 'accept') { //授权成功
          console.log("accept")
          //上传ids到后台
          util.handleTempl_http(ids, function (data) {
            if (data.status == 1) {}
          })
        }
      }
    })
    
    this.setData({
      dataurl: dataUrl
    });


    console.log("提交订单接口：" + dataUrl);

  },


  // 提交订单结果
  confirmorderResult: function(data) {
    wx.hideLoading()
    pay_order_code = data.order_code;
    var that = this;

    if (data.status == 1) {

      var click_id = wx.getStorageSync('gdt_vid')
      if (click_id) {
        var clickUrl = config.Host + 'wxMarkting/marketing_order?' + config.Version +
          '&click_id=' + click_id +
          '&order_code=' + pay_order_code +
          "&channel=" + wx.getStorageSync("advent_channel") +
          "&token=" + app.globalData.user.userToken +
          order_channel;


        util.http(clickUrl, function(data) {
          if (data.status == 1) {
            wx.setStorageSync('gdt_vid', '')
          }
        });
      }

      //参团失败
      if(data.st == 1){
        // that.showToast("该团人数已满，参团失败", 2000);
        wx.redirectTo({
          url: "../../../shouye/fightDetail/fightDetail?" + "order_code=" + that.data.order_code + "&code=" + that.data.roll_code + "&isTM=" + that.data.isTM + "&isFirst=" + this.data.isFirst + "&isNew=" + 
          this.data.isNew + 
          "&tips=" + this.data.tips + 
          "&is_t=" + is_t +
          "&fourthCTfail=1",
        })
        return
      }



      this.setData({
        totalAccount: data.price,
        roll_code: data.roll_code,
        isNew: data.isNew,
        isFirst: data.isFirst,
        tips: data.tips != undefined ? data.tips : "",
      });


      if (data.price <= 0) { //无需支付
        wx.redirectTo({
          url: "../../../shouye/fightDetail/fightDetail?" + "order_code=" + that.data.order_code + "&code=" + that.data.roll_code + "&isTM=" + that.data.isTM + "&isFirst=" + this.data.isFirst + "&isNew=" + this.data.isNew + "&tips=" + this.data.tips + "&is_t=" + is_t,
        })
      } else {

        //统一调起支付
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId, 3rd_session
            if (res.code) {
              var dataUrl = config.PayHost + payUrl + config.Version + "&token=" + app.globalData.user.userToken + '&order_code=' + order_code + '&order_name=我的' + '&code=' + res.code;
              util.http(dataUrl, that.orderPayResult)
            } else {
              is_submitOrder = true;
              console.log('获取用户登录态失败！' + res.errMsg)
              that.showToast('获取用户登录态失败！' + res.errMsg, 2000);
            }
          }
        })
      }
    } else {
      is_submitOrder = true;
      this.showToast(data.message, 2000);
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
        'success': function(res) {

          wx.redirectTo({
            url: "../../../shouye/fightDetail/fightDetail?" + "order_code=" + that.data.order_code + "&code=" + that.data.roll_code + "&isTM=" + that.data.isTM + "&isFirst=" + this.data.isFirst + "&isNew=" + this.data.isNew + "&tips=" + this.data.tips + "&is_t=" + is_t,
          })

          is_submitOrder = true;
        },
        'fail': function(res) {
          if (is_t >= 2) //如果是参团
          {
            that.showToast('支付失败,你已放弃本次拼团', 2000);
            is_t = 1;
          } else {
            that.showToast('支付失败', 2000);
            is_t = 1;
          }
          is_submitOrder = true;
        }
      })
    } else {
      is_submitOrder = true;
      that.showToast(data.message, 2000);
    }
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
    is_submitOrder = true;
    if (this.data.address == undefined || this.data.address == '') {
      this.httpAddress();
    }

  },
  httpAddress: function() {
    var dataUrl = config.Host + "address/queryDefault?" + config.Version + "&token=" + app.globalData.user.userToken;
    util.http(dataUrl, this.addressData)
  },
  // 地址数据
  addressData: function(data) {

    var phone = data['address']['phone'];
    var address = data['address']['address'];
    var consignee = data['address']['consignee'];
    if (address == undefined) {
      address = '',
        phone = '',
        consignee = ''
    }

    this.setData({
      phone: phone,
      address: address,
      consignee: consignee,
      address_id: 0
    });
  },


  closeConfirm: function() {
    wx.navigateBack({})
  }

})