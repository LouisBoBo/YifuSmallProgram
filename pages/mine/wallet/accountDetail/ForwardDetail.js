// pages/mine/wallet/accountDetail/ForwardDetail.js
import config from '../../../../config';
var util = require('../../../../utils/util.js');
var app = getApp();

var fromBusiness_code;
var fromCheck;
var fromT_type;
var fromOrder_Code;

var isVirtualTKZ = false //虚拟退款中

var draw_time;
var order_price;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    dataList: [],
    detailItem: {},
    images: ["开始0", "提交到银行0", "到账0"],
    statustitles: ["开始", "提交到银行", "到账"],
    titles: ["提现金额:", "银行卡:", "提交时间:", "当前状态:"],
    tixian_refund: "提现",
    transfer_error: '',
    content: "处理中，预计1-2个工作日到账",
    tixianAgain: false,
    showtransfer_error: false,
    vritualTKZtime :'2019-3-3',
 

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    wx.setNavigationBarTitle({
      title: '退款详情',
    })

    this.setData({
      statustitles: ["卖家退款", "银行受理", "退款成功"],
      titles: ["退款金额:", "银行卡:", "提交时间:", "当前状态:"],
      tixian_refund: '退款',
    })

    isVirtualTKZ = options.isVirtualTKZ;
    //确定business_code t_type check
    if (options.item) //点明细进来
    {
      var item = JSON.parse(options.item);
      fromBusiness_code = item.business_code;
      fromCheck = "-1";
      fromT_type = item.t_type;
    } else { //订单列表过来的
      fromBusiness_code = options.business_code;
      fromCheck = options.check;
      fromT_type = "-1"
    }

    if(isVirtualTKZ){ //虚拟提现中单独处理
      draw_time = options.draw_time
      order_price = options.order_price
      this.data.vritualTKZtime = util.getMyDate(Number(draw_time), '.', '');
      this.initVtxz()
    }else{
      this.get_DetailDataHttp()

    }




    // if (options.item) //点明细进来
    // {
    //   var item = JSON.parse(options.item);
    //   if (item.t_type == 2) //自动提现即为退款
    //   {
    //     this.setData({
    //       statustitles: ["卖家退款", "银行受理", "退款成功"],
    //       titles: ["退款金额:", "银行卡:", "提交时间:", "当前状态:"],
    //       tixian_refund: '退款',
    //     })
    //     wx.setNavigationBarTitle({
    //       title: '退款详情',
    //     })
    //   }
    //   this.handleData(item);
    // } else { //从订单列表进来
    //   this.setData({
    //     statustitles: ["卖家退款", "银行受理", "退款成功"],
    //     titles: ["退款金额:", "银行卡:", "提交时间:", "当前状态:"],
    //     tixian_refund: '退款',
    //   })
    //   wx.setNavigationBarTitle({
    //     title: '退款详情',
    //   })
    //   this.get_DetailDataHttp(options.business_code)
    // }



  },
  //虚拟提现中单独处理
  initVtxz:function(){
    var image = [];
    var content = "";
    var cutJson = {};

    image = ["开始", "提交到银行0", "到账0"];
    content = "处理中";

    cutJson['detail'] = '待审核';

    cutJson['title'] =  '******';
    cutJson['add_time'] =this.data .vritualTKZtime;
    cutJson['money'] =  order_price + "元";

    this.setData({
      detailItem: cutJson
    });
    cutJson.check = 0
    this.handleData(cutJson);


  },

  //如果是订单过来的 重新获取数据
  get_DetailDataHttp: function() {
    var baseUrl = 'wallet/selDepositOrder?';
    var dataUrl = config.Host + baseUrl + '&token=' + app.globalData.user.userToken + config.Version + '&business_code=' + fromBusiness_code +
      '&check=' + fromCheck +
      '&t_type=' + fromT_type

    ;
    this.data.requestUrl = dataUrl;
    // dataUrl = dataUrl + "&page=" + this.data.curPage;
    util.http(dataUrl, this.resultData)
  },

  resultData: function(data) {
    
    var item = data

    //模拟的数据
    // item.ded_code = "111"

    // item.tri = "该订单退款的15元余额已被用于购买商品"
    // fromCheck = 0;
    //处理一些特殊情况
    if (item.ded_code) { //如果有抵扣订单 说明是 退款关闭 或 部分提现成功
      fromOrder_Code = item.ded_code;

      if (fromCheck == 1) { //部分提现成功

        this.setData({
          showTXclose: false,
          showPartTxSuccess: true,
          content: "成功",
          dikouOrder: item.ded_code,
          txCloseTri: item.tri,
          images: image,
        })


      } else { //退款关闭
        this.setData({
          showTXclose: true,
          images: ["开始", "提交到银行"],
          statustitles: ["卖家退款", "退款关闭"],
          content: "关闭",
          txCloseTri: item.tri,
          dikouOrder: item.ded_code,

        })
      }

      return
    }


    if (data.status == 1 && data.data) {
      var cutJson = {};

      var subject = data.data;
      cutJson = subject;

      var detail = '其他';
      if (subject.check == 3) {
        cutJson['detail'] = this.data.tixian_refund + '成功';
      } else if (subject.check == 0) {
        cutJson['detail'] = '待审核';
      } else if (subject.check == 1) {
        cutJson['detail'] = '通过';
      } else if (subject.check == 2) {
        cutJson['detail'] = '不通过';
      } else if (subject.check == 4) {
        cutJson['detail'] = '审核已通过';
      } else if (subject.check == 6) {
        cutJson['detail'] = this.data.tixian_refund + '已发起';
      } else if (subject.check == 7) {
        cutJson['detail'] = this.data.tixian_refund + '已提交至银行';
      } else if (subject.check == 8) {
        cutJson['detail'] = '银行发放中，预计1个工作日内到账';
      } else if (subject.check == 9) {
        cutJson['detail'] = '银行发放中，预计1个工作日内到账';
      } else if (subject.check == 10) {
        cutJson['detail'] = this.data.tixian_refund + '成功';
      } else if (subject.check == 11) {
        cutJson['detail'] = '转账失败';
      } else if (subject.check == 12) {
        cutJson['detail'] = '已重新申请';
      }

      cutJson['title'] = subject.collect_bank_name + '***' + subject.collect_bank_code;
      cutJson['add_time'] = util.getMyDate(subject.add_date, '.', '');
      cutJson['money'] = subject.money.toFixed(2) + "元";

      this.setData({
        detailItem: cutJson
      });

      this.handleData(cutJson);
    }
  },

  //处理数据
  handleData: function(item) {
    var datalist = [];

    var contents = [item.money, item.title, item.add_time, item.detail];

    var titles = this.data.titles;
    for (var i = 0; i < titles.length; i++) {
      var data = {};

      data.tittle = titles[i];
      data.content = contents[i];
      datalist.push(data);
    }

    this.setData({
      dataList: datalist,
    });

    this.getStatus(item);
  },
  //获取当前状态
  getStatus: function(item) {
    var image = [];
    var content = "";

    if (item.check == 0) {
      image = ["开始", "提交到银行0", "到账0"];

      if(isVirtualTKZ){
        content = "处理中";

      }else{
        content = "处理中，预计1-2个工作日到账";

      }


    } else if (item.check == 2 || item.check == 4 || item.check == 6) {
      image = ["开始", "提交到银行0", "到账0"];
      content = item.check == 2 ? "失败" : "处理中，预计1-2个工作日到账";
      if (item.check == 2) {
        this.setData({
          showtransfer_error: true,
          transfer_error: item.transfer_error
        })
      }
    } else if (item.check == 7 || item.check == 8 || item.check == 9) {
      image = ["开始", "提交到银行", "到账0"];
      content = "处理中，预计1-2个工作日到账";
    } else if (item.check == 3 || item.check == 10) {
      if (item.check == 3) {
        image = ["开始", "提交到银行", "到账"];
        content = "成功";
      } else {
        image = ["开始", "提交到银行", "到账0"];
        content = "处理中，预计1-2个工作日到账";
      }
    } else if (item.check == 11) {
      image = ["开始", "提交到银行0", "到账0"];
      content = "失败";
      this.setData({
        tixianAgain: true,
        showtransfer_error: true,
        transfer_error: item.transfer_error
      })
    } else {
      image = ["开始", "提交到银行", "到账0"];
      content = "处理中，预计1-2个工作日到账";
    }

    this.setData({
      images: image,
      content: content,
    })

  },

  //重新申请提现
  tixiantap: function() {
    wx.navigateTo({
      url: '../Withdrawals/Withdrawals',
    })
  },
  //去订单详情
  toOderDetial: function() {
    this.getOrderList(fromOrder_Code)
  },

  //订单详情数据
  getOrderList: function(order_code) {
    var token = app.globalData.user.userToken;
    var url = config.Host + 'order/getOrderDetialByGcodeOrOcode?token=' + token + config.Version + '&order_code=' + order_code;
    console.log(url);
    util.http(url, this.httpOrderdata);
  },

  httpOrderdata: function(data) {
    if (data.status == 1) {
      var orderitem = data.order;
      var orderShops = orderitem.orderShops;
      var shop_from = orderShops.shop_from;
      var last_time = orderShops.last_time;
      var issue_status = orderShops.issue_status;

      // var orderstaus = orderShops[0].status;
      var orderstaus = orderitem.status;


      var change = orderShops.change;
      var item = orderShops;
      var orderstatus = "";
      var ordershopstatus = "";
      var shop_pic = "";
      var shopcode = "";
      var newshopname = "";
      var pay_money = "";
      var shop_price = "";
      var orderButtonStatus = [];

      for (var j = 0; j < orderShops.length; j++) {
        shop_pic = orderShops[j].shop_pic;
        shopcode = orderShops[j].shop_code;
        shop_price = orderShops[j].shop_price;
        newshopname = orderShops[j].shop_name;
        pay_money = pay_money;
        shop_from = shop_from;

        orderShops[j].shop_price = shop_price.toFixed(1);
        if (shop_pic != null) {
          //商品图片
          var newcode = shopcode.substr(1, 3);
          var new_pic = newcode + '/' + shopcode + '/' + shop_pic;

          //商品名称
          if (newshopname.length > 9) {
            newshopname = newshopname.substr(0, 9) + '... ';
          }
          orderShops[j]["new_shop_pic"] = new_pic;
          orderShops[j]["new_shopname"] = newshopname;
        }
      }
      var statusstr;
      switch (orderstaus) {
        case 1:
          statusstr = "待付款";
          break;
        case 2:
          statusstr = "待发货";
          break;
        case 3:
          statusstr = "待收货";
          break;
        case 4:
          statusstr = "待评价";
          break;
        case 5:
          statusstr = "已评价";
          break;
        case 6:
          if (shop_from == 10) {
            statusstr = "疯抢未抢到";
          } else
            statusstr = "交易成功";
          break;
        case 7:
          statusstr = "延长收货";
          break;
        case 8:
          statusstr = "退款成功";
          break;
        case 9:
          statusstr = "取消订单";
          break;
        case 10:
          statusstr = "订单已过期";
          break;
        case 11:
          statusstr = "拼团中";
          break;
        case 12:
          statusstr = "待免费领";
          break;
        case 13:
          statusstr = "拼团失败";
          break;
        case 14:
          statusstr = "疯抢未抢到";
          break;
        case 15: //申请关闭拼团-已过96小时
          statusstr = "拼团中";
          break;
        case 16: //客服关闭拼团
          statusstr = "拼团关闭";
          break;
      }


      orderitem.orderstatus = statusstr;
      wx.setStorageSync("orderitem", orderitem);

      wx.redirectTo({
        url: '../../../mine/order/orderDetail/orderDetail?item=' + orderitem,

      })

    }
  },

})