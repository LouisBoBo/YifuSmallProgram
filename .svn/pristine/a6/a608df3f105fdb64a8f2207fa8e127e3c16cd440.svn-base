import config from '../../../../config';
import ToastPannel from '../../../../common/toastTest/toastTest.js';
const util = require('../../../../utils/util.js')
var WxNotificationCenter = require('../../../../utils/WxNotificationCenter.js');
var currentDayMaxShareCount = 500;//一天最多分享的次数
var app = getApp();
Page({
  data: {
    picLink: '',//拼接了又盘云和商品编号的链接
    shop_code: '',
    showDialog: false,
    noDataFlag: true,
    postlist: {},
    evaluateList: {},
    takeRecordData: [],//参与记录数据集合
    ruleData: [],//夺宝规则

    havePeopleCount: 0,
    codes: [],//参与号码
    strCodes: '',//最终处理后的参与号码
    mOstatus: "",//开奖状态
    issue_code: '',//期号
    startTime: 0,
    currentStatus: '',//进行中
    currentBuyStatus: '',//立即参与
    isEndFlag: false,//是否结束
    isShowResult: false,//是否显示中奖信息
    winnerNumber: '',//中奖号码
    isShowShareFlag: false,//分享弹窗
    shareCount: 0,//分享次数
    centsBuyCount: 0,//1分钱购买次数
    dayOreadyShare: 0,//今天已经分享的次数
    flagMax: 3,//分享满多少次给一次机会

    payCountMoney: 0,//应付总额
    payShareDiscount: 0,//分享抵扣
    payNeed: 0,//还需支付

    isCanTakeFlag: true,//shi fou can yi canyu 
    isShowPayFlag: false,//支付弹窗
    isTwoPayFlag: false,//原价支付


    buyCount: 1,//购买数量
    Upyun: config.Upyun,
    Version: '',
    Channel: "",
    shop: {},
    shop_name: '',
    shop_se_price: 0,
    shop_price: 0,
    topData: [],
    activityIndex: 0,
    imagePathData: [],//详情图片路径集合
    shop_pic: '',//详情页图片集合
    shareStyle: '',//用来判断分享样式

    jsonShareTitle: '',//Json里获取分享随机商品title
    jsonShareIndianaTitle: '',//Json里获取分享夺宝商品的title
    shop_code_share: '',//随机商品的商品编号
    shop_se_price_share: '',
    supp_label_share: '',
    shop_name_share: '',
    shareWxPic: '',//处理后的分享图片链接
    shareWxTitle: '',//处理后的分享标题
    shareWxPath: '',//分享的跳转路径
    shareH5Title: "",//分享h5赚钱页的标题
    shareH5PicPath: '',//分享h5赚钱的图片



    curPage: 1,
    pageSize: 10,

    is_look: false,
  },
  onLoad: function (option) {


    if (!app.parent_id) {
      app.parent_id = option.user_id
    }

    if (option.user_id && app.globalData.user && app.globalData.user.userToken) {
      util.bindRelationship(option.user_id, app.globalData.user.userToken);//绑定用户上下级关系
    }
    if (option.user_id) {
      WxNotificationCenter.addNotification("testNotificationItem1Name", function () {
        if (app.globalData.user && app.globalData.user.userToken){
        util.bindRelationship(option.user_id, app.globalData.user.userToken);//绑定用户上下级关系
        }
      }, this);
    }
    app.ToastPannel();
    var txClickTaskList = wx.getStorageSync('SIGN-TASK');
    var value = '';
    var shareStyle = '';
    if (txClickTaskList.value != undefined) {
      value = txClickTaskList.value;
      shareStyle = value.split(',')[0].split('=')[1];
    }
    this.data.shop_code = option.shop_code;
    this.data.is_look = option.is_look;
    var that = this;
    this.setData({
      is_look: this.data.is_look,
      // Upyun: config.Upyun,
      Version: config.Version,
      // Channel: config.ChannelPost,
      activityIndex: 0,
      shareStyle: shareStyle,
      topData:
      [{ name: '图文详情', },
      { name: '参与记录', },
      { name: '抽奖规则', },
      ],
    })
    var that = this;
    this.getData(0, function (data) {
      that.dealBackData(0, data);
    });
    this.getDataJson(2, function (data) {
      that.dealBackData(2, data);
    });


  },

  dealBackData(flag, data) {//处理接口返回的数据
    var that = this;
    if (flag == 0) {
      if (data.status != 1) {
        this.setData({ noDataFlag: true });
        this.showToast(data.message, 2000);
      } else {
        that.data.havePeopleCount = data.shop.active_people_num - data.num - data.virtual_num > 0 ? data.shop.active_people_num - data.num - data.virtual_num : 0;
        var time = this.getStandardTime(data.shop.active_start_time);
        var winnerNumber = '本期幸运号码: ' + data.in_code;
        if (data.in_head != undefined) {
          if (!data.in_head.startsWith('http')) {
            data.in_head = that.data.Upyun + data.in_head;
          }
        }
        data.otime = that.getStandardTime(data.otime);
        that.setData({
          winnerNumber: winnerNumber,
          startTime: time,
          noDataFlag: false,
          havePeopleCount: that.data.havePeopleCount,
          postlist: data,
          shop: data.shop,
          codes: data.codes,
          shop_name: data.shop.shop_name,
          shop_pic: data.shop.shop_pic,
          mOstatus: data.ostatus,
          issue_code: data.shop.shop_batch_num,

        })
        this.cutShopCode();
        this.ForDight();
        this.getImagePath();
        this.getOwnTakeNumber();
        this.showByOststus();
      }
    } else if (flag == 1) {
      if (data.list && data.list.length > 0) {
        var dealData = data.list;
        for (var i = 0; i < dealData.length; i++) {
          dealData[i].atime = that.getStandardTime(dealData[i].atime);
          if (!dealData[i].uhead.startsWith('http')) {
            dealData[i].uhead = that.data.Upyun + dealData[i].uhead;
          }
        }
        that.setData({
          takeRecordData: dealData,
        })
      }
    } else if (flag == 2) {
      var ruleData = [];
      var ruleJson = {};
      ruleJson = data.dbgz.text;

      that.data.jsonShareTitle = data.wxdddfx.title;
      that.data.jsonShareIndianaTitle = data.indiana_yf.title;
      that.data.shareH5Title = data.h5money_yf.title;
      that.data.shareH5PicPath = data.h5money_yf.icon;

      //  var len=  Object.keys(ruleData).length
      for (var key in ruleJson) {
        ruleData.push(ruleJson[key]);
      }
      that.setData({ ruleData: ruleData });
    } else if (flag == 3) {//获取分享弹窗信息
      if (data.status != undefined && data.status == 1) {
        var shareCount = that.data.flagMax - data.sc;
        this.setData({ shareCount: shareCount, centsBuyCount: data.oc, dayOreadyShare: data.scDay })
      }
    } else if (flag == 5) {//分享随机商品
      if (data.status != undefined && data.status == 1) {
        var shop_code = data.shop.shop_code;
        // if (shop_code.equals("null") || shop_code == null || shop_code.equals("")) {
        //   ToastUtil.showShortText(context, "未获取到商品！");
        //   return;
        // }
        if (data.shop.supp_label != undefined && '' != data.shop.supp_label && null != data.shop.supp_label) {
          that.data.supp_label_share = data.shop.supp_label;
        } else {
          that.data.supp_label_share = '衣蝠';
        }

        that.data.shop_se_price_share = data.shop.shop_se_price;
        that.data.shop_name_share = data.shop.shop_name;
        //  var shopLink = data.get("link");//商品链接
        var def_pic = data.shop.def_pic;
        if (data.shop.four_pic) {
          var str = data.shop.four_pic.split(",");
          if (str.length > 2) {
            def_pic = str[2];
          }
        }
        var shop_code_cut = '';
        shop_code_cut = shop_code.substring(1, 4);
        var link = that.data.Upyun + shop_code_cut + '/' + shop_code + '/' + def_pic
        that.data.shareWxPic = link;
        that.data.shop_code_share = shop_code;
        that.getData(6, function (data) {
          that.dealBackData(6, data);
        })

      }
    } else if (flag == 6) {//根据分享商品的商品编号获取二级类目id
      if (data.status != undefined && data.status == 1) {
        var type2 = data.type2;
        if (type2 == null) {
          type2 = that.data.shop_name_share;
        }
        var str1 = that.data.jsonShareTitle.replace("\$\{replace\}", that.data.supp_label_share);
        var str2 = str1.replace("\$\{replace\}", type2);
        var str3 = str2.replace("\$\{replace\}", (that.data.shop_se_price_share * 0.5).toFixed(1));
        var str4 = str3.replace("\$\{replace\}", (that.data.shop_se_price_share * 0.5).toFixed(1));
        that.data.shareWxTitle = str4;
      }
    } else if (flag == 7) {//获取随机分享的夺宝商品
      var that = this;
      if (data.status != undefined && data.status == 1) {
        var indianaShop_name = data.shop.shop_name;
        var shop_code = data.shop.shop_code;
        var def_pic = data.shop.def_pic;
        var shop_code_cut = '';
        shop_code_cut = shop_code.substring(1, 4);
        var link = that.data.Upyun + shop_code_cut + '/' + shop_code + '/' + def_pic
        that.data.shareWxPic = link;
        that.data.shop_code_share = shop_code;
        that.data.shareWxTitle = that.data.jsonShareIndianaTitle.replace("\$\{replace\}", indianaShop_name);

      }
    }
  },

  showByOststus: function () {//根据状态设置页面显示
    var that = this;
    var mOstatus = this.data.mOstatus;
    var my_num = this.data.postlist.my_num;
    var frist_join = this.data.postlist.countTrea;
    var currentStatus = '进行中';
    var currentBuyStatus = '立即参与';
    var isEndFlag = false;
    if (mOstatus == 0 || mOstatus == 4) {//进行中
      currentStatus = '进行中';
      if (my_num == 0) {//自己没有参与过本期
        isEndFlag = false;
        if (frist_join == 0) {//从来没有参与过夺宝
          currentBuyStatus = '一分钱抽奖';
        } else {
          currentBuyStatus = '立即参与';
        }
      } else {
        currentBuyStatus = '再次参与';
      }
      if (that.data.havePeopleCount == 0) {
        currentBuyStatus = '正在开奖';
        that.data.isCanTakeFlag = false;
      }
    } else if (mOstatus == 2) {//已揭晓
      isEndFlag = true;
      currentStatus = '已揭晓';
      currentBuyStatus = '已结束';
      that.data.isCanTakeFlag = false;
    } else if (mOstatus == 3) {
      that.data.isShowResult = true;
      isEndFlag = true;
      currentStatus = '已揭晓';
      currentBuyStatus = '已结束';
      that.data.isCanTakeFlag = false;
    }
    this.setData({
      isShowResult: that.data.isShowResult,
      isEndFlag: isEndFlag,
      currentStatus: currentStatus,
      currentBuyStatus: currentBuyStatus
    });
  },

  getStandardTime: function (time) {//获取标准时间
    var time = util.getMyDate(time, '.');
    return time;
  },
  getOwnTakeNumber: function () {//获取自己的参与号码
    var strLast = '';
    var that = this;
    var codes = that.data.codes;
    for (var i = 0; i < codes.length; i++) {
      var str = codes[i];
      var strs = [];
      strs = str.split(",");
      if (i != codes.length - 1) {
        for (var j = 0; j < strs.length; j++) {
          strLast = strLast + strs[j] + '、';
        }
      } else {
        for (var j = 0; j < strs.length; j++) {
          if (j != strs.length - 1) {
            // sbf.append(strs[j]).append("、");
            strLast = strLast + strs[j] + '、';
          } else {
            // sbf.append(strs[j]);
            strLast = strLast + strs[j];
          }
        }
      }
    }
    this.setData({ strCodes: strLast })
  },

  getImagePath: function () {//获得商品详情页详情的图片集合
    var that = this;
    that.data.imagePathData = that.data.shop_pic.split(',');
    this.setData({
      imagePathData: that.data.imagePathData,
    })
  },

  // 页面里的点击---------start
  recordClick: function () {//参与记录

    wx.redirectTo({
      url: '../centsIndianaRecord/centsIndianaRecord',
    })
  },
  announceClick: function () {//往期揭晓
    wx.redirectTo({
      url: '../../indianaRecord/indianaRecord',
    })
  },
  buyToOrder: function (e) {//去下单（跳到确认订单）
    var that = this;
    if (app.globalData.user != null && app.globalData.user.userToken != undefined) {

      util.httpPushFormId(e.detail.formId);

      var shop = this.data.shop;
      var shopPrice = 0.01;
      var flag = 0;
      if (this.data.isTwoPayFlag) {//2元支付
        shopPrice = shop.shop_se_price;
        flag = 0;
      } else {
        shopPrice = 0.01;
        flag = 1;
      }
      var shopData = {
        shopPic: that.data.picLink + shop.def_pic,
        shopCode: shop.shop_code,
        shopPrice: that.data.shop.shop_se_price,
        shopOldPrice: shop.shop_price,
        shopName: shop.shop_name,
        shopNum: that.data.buyCount,
        flag: flag
      };
      wx.redirectTo({

        url: '../../../listHome/order/confirm/confirm?' + "shopData=" + JSON.stringify(shopData) + '&buyType=1',
      })
    }
    else
      util.toAuthorizeWx(function (isSuccess) {
        if (isSuccess == true) {

        }
      });

  },

  centsBuyClick: function () {//1分钱购买
    if (this.data.centsBuyCount == 0) {

      this.showToast('你的1分抽奖次数不足哦。再分享' + this.data.shareCount + '次即可赢得一次1分抽奖的机会，现在就去分享吧。', 3000);
      return;
    }
    var payCountMoney = this.data.shop.shop_se_price.toFixed(2);
    var payShareDiscount = (this.data.shop.shop_se_price.toFixed(2) - 0.01).toFixed(2);
    var payNeed = 0.01;
    this.setData({ isShowPayFlag: true, isShowShareFlag: false, isTwoPayFlag: false, payCountMoney: payCountMoney, payShareDiscount: payShareDiscount, payNeed: payNeed })
  },
  twoBuyClick: function () {//原价购买
    var payCountMoney = this.data.shop.shop_se_price.toFixed(2);
    this.setData({ isShowPayFlag: true, isShowShareFlag: false, isTwoPayFlag: true, payCountMoney: payCountMoney })
  },
  payCancelClick: function () {//支付取消
    this.setData({ isShowPayFlag: false, isShowShareFlag: true, buyCount: 1 })
  },
  toBuyClick: function () {//立即购买
    if (!this.data.isCanTakeFlag) {
      return;
    }
    var that = this;
    this.setData({ isShowShareFlag: true });
    this.getData(3, function (data) {
      that.dealBackData(3, data)
    })
    if (that.data.shareStyle == 'link') {//分享随机商品 
      that.getData(5, function (data) {
        that.dealBackData(5, data);
      });
    } else if (that.data.shareStyle == 'indiana') {//分享夺宝
      that.getData(7, function (data) {
        that.dealBackData(7, data);
      });
    } else {
      //TODO:暂时分享随机夺宝商品
      that.getData(7, function (data) {
        that.dealBackData(7, data);
      });
    }
  },
  closeDialogClick: function () {
    this.setData({ isShowShareFlag: false });
  },
  closeSkuDialog: function () {//关闭立即购买弹窗
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
    this.setData({ showDialog: false, selectColorId: that.data.selectColorId, selectSizeId: that.data.selectSizeId, colorIndex: 0, sizeIndex: 0 });
  },

  btnReduceClick: function () {//购买数量减

    var that = this;
    that.data.buyCount = that.data.buyCount - 1;
    if (that.data.buyCount < 1) {
      that.data.buyCount = 1;
    }
    var payCountMoney;
    var payShareDiscount;
    var payNeed;
    if (that.data.isTwoPayFlag) {
      payCountMoney = (that.data.shop.shop_se_price * that.data.buyCount).toFixed(2);
    } else {
      payCountMoney = (that.data.shop.shop_se_price * that.data.buyCount).toFixed(2);
      payShareDiscount = ((this.data.shop.shop_se_price.toFixed(2) - 0.01) * that.data.buyCount).toFixed(2);
      payNeed = (0.01 * that.data.buyCount).toFixed(2);
    }

    this.setData({ buyCount: that.data.buyCount, payCountMoney: payCountMoney, payShareDiscount: payShareDiscount, payNeed: payNeed });

  },
  btnAddClick: function () {//购买数量加
    var that = this;
    this.data.buyCount = that.data.buyCount + 1;

    if (this.data.buyCount > 200) {
      this.data.buyCount = 200;
      this.showToast.show("一次最多只能参与200次哦~", 3000);
      return;
    }

    if (this.data.buyCount > this.data.havePeopleCount) {
      this.data.buyCount = this.data.havePeopleCount;
      this.showToast("本次夺宝只剩余" + that.data.havePeopleCount + "次夺宝机会", 3000);
      return;
    }
    if (!this.data.isTwoPayFlag) {
      if (this.data.buyCount > this.data.centsBuyCount) {
        this.data.buyCount = this.data.centsBuyCount;
        this.showToast('你只有' + this.data.centsBuyCount + '次1分钱抽奖机会', 3000);
        return;
      }
    }
    var payCountMoney;
    var payShareDiscount;
    var payNeed;
    if (that.data.isTwoPayFlag) {
      payCountMoney = (that.data.shop.shop_se_price * that.data.buyCount).toFixed(2);
    } else {
      payCountMoney = (that.data.shop.shop_se_price * that.data.buyCount).toFixed(2);
      payShareDiscount = ((this.data.shop.shop_se_price.toFixed(2) - 0.01) * that.data.buyCount).toFixed(2);
      payNeed = (0.01 * that.data.buyCount).toFixed(2);
    }

    this.setData({ buyCount: that.data.buyCount, payCountMoney: payCountMoney, payShareDiscount: payShareDiscount, payNeed: payNeed });
  },
  onTapClick: function (event) {//详情、参数、评价的切换
    var thiscopy;
    thiscopy = this;
    const index = event.currentTarget.dataset.index;
    if (thiscopy.data.activityIndex == index) {
      return;
    }

    this.setData({ activityIndex: index });
    if (index == 1) {
      var that = this;
      if (that.data.curPage == 1 && that.data.takeRecordData.length == 0) {
        that.getData(1, function (data) {
          that.dealBackData(1, data)
        });
      }
    }
  },
  // 页面里的点击-----------end

  // 切割字符串并添加新字段
  cutShopCode: function () {
    var thiscopy;
    thiscopy = this;
    var shop_code_cut = '';
    shop_code_cut = thiscopy.data.shop.shop_code.substring(1, 4);
    thiscopy.data.shop["cut_shop_code"] = shop_code_cut;
    var link = thiscopy.data.Upyun + shop_code_cut + '/' + thiscopy.data.shop.shop_code + '/'
    thiscopy.setData({ shop: thiscopy.data.shop, picLink: link })
  },


  // 四舍五入 Dight要格式化的 数字，How要保留的小数位数。
  ForDight: function () {//Dight, How
    var that = this;
    that.data.shop_se_price = Math.round(that.data.shop.shop_se_price * 0.9 * Math.pow(10, 1)) / Math.pow(10, 1);
    that.data.shop_price = Math.round(that.data.shop.shop_price * Math.pow(10, 1)) / Math.pow(10, 1);
    that.data.shop_se_price = (that.data.shop_se_price).toFixed(1);
    that.data.shop_price = (that.data.shop_price).toFixed(1);
    this.setData({
      shop_se_price: that.data.shop_se_price,
      shop_price: that.data.shop_price,
    })
    // return Dight;
  },
  onReady: function () {

    // 页面渲染完成  

  },

  //http://www.52yifu.wang/cloud-api/treasures/getParticipationMan?version=V1.31&token=C9OSV4GB3BMVX9TB5OW7&shop_code=1AAB20171120IKpRwZXW&issue_code=171120001&page=1&rows=10&authKey=1A7B9584B7A50B313E00179A3B3CEC0A&I10o=XUO3Mtu1ENHGD0O1XOSzXJDPXNKnDzvLX0SzM0ZNXOO%3D&channel=8&appVersion=V3.6.0  参与记录

  // http://www.52yifu.wang/cloud-api/shop/queryIndiana?version=V1.31&token=C9OSV4GB3BMVX9TB5OW7&shop_code=1AAB20171120IKpRwZXW&authKey=D13D297DE81909177C503AE6257CB15C&I10o=HNOzHNS5D0HPENO5XNunDzdNDJKzMUU2XtU3M0SnDUX%3D&channel=8&appVersion=V3.6.0  夺宝详情接口

  // https://yssj-real-test.b0.upaiyun.com/paperwork/paperwork.json//抽奖规则

  // http://www.52yifu.wang/cloud-api/treasures/shareQuery?version=V1.31&token=Y9OJXL4V3TDH9SSA5SG7&authKey=ACE32F066B29584CB28D94A09A977C26&I10o=MUDPXzTQXNY2MtS5DJq0M0SyEOM5DOOmEUO5DzdNXtY%3D&channel=8&appVersion=V3.6.0
  //分享前相关数据

  // http://www.52yifu.wang/cloud-api/treasures/shareAdd?version=V1.31&token=Y9OJXL4V3TDH9SSA5SG7&shop_code=CAAX20171125FOypsH5A&authKey=B3F9AA3B71F25E6488CA7F6C342A6F0E&I10o=MtDQEUPLX0S3XUYyDUU2DNq4M0O3HtBNXzMyMJBQXOU%3D&channel=8&appVersion=V3.6.0//分享后提交后台

  // shop/shareShop //分享随机商品

  //shop/queryShopType2//根据商品编号查询供应商

  // http://www.52yifu.wang/cloud-api/shop/getIndianaLink?version=V1.31&token=TWB9GEY43XKAXBL9Y57H&authKey=A633321437ACD1FC5700F1F31D44F3DD&I10o=MJYzXzXyXJMzD0PNHNPQMzU3XNLQXUYzXUM0DOYzHOM%3D&channel=8&appVersion=V3.6.0//获取分享的夺宝商品
  getData: function (flag, fun) {//flag:0，详情接口1;1，参与记录;2，抽奖规则;3分享前相关数据;4，分享成功后提交后台;5，分享随机商品;6，根据分享的普通商品商品编号获取二级类目名称;7，获取分享的夺宝商品;
    // wx.showNavigationBarLoading();
    var thiscopy;
    thiscopy = this;
    var requestUrl = config.Host;
    var token = app.globalData.user.userToken;
    // var jsonParames = {};
    // jsonParames["channel"] = this.data.Channel
    // jsonParames["version"] = this.data.Version
    // jsonParames["appVersion"] = "V3.6.0"
    var strLink = this.data.Version
    if (flag == 0) {//详情接口
      // jsonParames["token"] = app.globalData.user.userToken
      // jsonParames["shop_code"] = this.data.shop_code
      // requestUrl = config.Host + 'shop/queryIndiana';

      requestUrl = requestUrl + 'shop/queryIndiana?token=' + token + '&shop_code=' + this.data.shop_code + strLink;
    } else if (flag == 1) {//参与记录
      // jsonParames["token"] = app.globalData.user.userToken
      // jsonParames["page"] = this.data.curPage
      // jsonParames["rows"] = this.data.pageSize
      // jsonParames["shop_code"] = this.data.shop_code
      // jsonParames["issue_code"] = this.data.issue_code
      // requestUrl = config.Host + 'treasures/getParticipationMan';

      requestUrl = requestUrl + 'treasures/getParticipationMan?token=' + token + '&page=' + this.data.curPage + '&rows=' + this.data.pageSize + '&shop_code=' + this.data.shop_code + '&issue_code=' + this.data.issue_code + strLink;
    } else if (flag == 3) {//分享前相关数据
      // jsonParames["token"] = app.globalData.user.userToken
      // requestUrl = config.Host + "treasures/shareQuery";

      requestUrl = requestUrl + 'treasures/shareQuery?token=' + token + strLink;
    } else if (flag == 4) {//分享后提交后台
      // jsonParames["token"] = app.globalData.user.userToken
      // jsonParames["shop_code"] = this.data.shop_code
      // requestUrl = config.Host + "treasures/shareAdd";

      requestUrl = requestUrl + 'treasures/shareAdd?token=' + token + '&shop_code=' + this.data.shop_code + strLink;
    } else if (flag == 5) {//分享随机商品
      // jsonParames["token"] = app.globalData.user.userToken
      // jsonParames["getShop"] = true
      // requestUrl = config.Host + "shop/shareShop";

      requestUrl = requestUrl + 'shop/shareShop?token=' + token + '&getShop=true' + strLink;
    } else if (flag == 6) {//根据商品编号查询供应商
      // jsonParames["token"] = app.globalData.user.userToken
      // jsonParames["shop_code"] = this.data.shop_code_share
      // requestUrl = config.Host + "shop/queryShopType2";

      requestUrl = requestUrl + 'shop/queryShopType2?token=' + token + '&shop_code=' + this.data.shop_code_share + strLink;
    } else if (flag == 7) {
      // jsonParames["token"] = app.globalData.user.userToken
      // requestUrl = config.Host + "shop/getIndianaLink";

      requestUrl = requestUrl + 'shop/getIndianaLink?token=' + token + strLink;
    }
    util.http(requestUrl, function (data) {
      fun(data)
    })
    // wx.request({
    //   url: requestUrl,
    //   method: 'POST',
    //   data: jsonParames,
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   success: function (res) {
    //     wx.hideNavigationBarLoading();
    //     // console.log(res.data)
    //     fun(res.data)

    //   }

    // })
  },

  getDataJson: function (flag, fun) {//flag:0，详情接口1;1，参与记录;2，抽奖规则
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
      // method: 'POST',
      // data: jsonParames,
      header: {
        // "Content-Type": "application/x-www-form-urlencoded"
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        app.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
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
    if (that.data.activityIndex == 1) {
      that.data.curPage = that.data.curPage + 1;
      that.getData(1, function (data) {
        if (data.list.length == 0) {
          that.data.curPage = that.data.curPage - 1;
        } else {
          var dealData = data.list;
          for (var i; i < dealData.length; i++) {
            dealData[i].atime = that.getStandardTime(dealData[i].atime);
            if (!dealData[i].uhead.startsWith('http')) {
              dealData[i].uhead = that.data.Upyun + dealData[i].uhead;
            }
          }
          var dataTemp = that.data.takeRecordData.concat(dealData);
          that.setData({
            takeRecordData: dataTemp,
          })
        }

      });
    }


  },
  // * 用户点击右上角分享
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    if (that.data.shareStyle == 'link') {//分享普通商品
      if (app.globalData.user) {
        that.data.shareWxPath = '/pages/shouye/detail/detail?shop_code=' + this.data.shop_code_share + "&isShareFlag=true" + "&user_id=" + app.globalData.user.user_id;
      } else {
        that.data.shareWxPath = '/pages/shouye/detail/detail?shop_code=' + this.data.shop_code_share + "&isShareFlag=true";
      }
    } else if (that.data.shareStyle == 'h5money') {//分享小程序赚钱
      // that.data.shareWxTitle = that.data.shareH5Title;
      // that.data.shareWxPic = that.data.Upyun + that.data.shareH5PicPath;
      that.data.shareWxTitle = "快来为我点赞，即奖100元现金，每月更可赢千元任务奖励。";
      // that.data.shareWxPic = that.data.Upyun + 'qingfengpic/share_sign_pic.png';
      var randomImg = Math.floor(Math.random() * 3 + 1);
      that.data.shareWxPic = that.data.Upyun + "small-iconImages/qingfengpic/sign_money_" + randomImg + ".png"

      if (app.globalData.user) {
        that.data.shareWxPath = "/pages/sign/sign?isShareFlag=true&goto=sign&user_id=" + app.globalData.user.user_id;
      } else {
        that.data.shareWxPath = "/pages/sign/sign?isShareFlag=true&goto=sign";
      }
    } else {//分享夺宝商品
      if (app.globalData.user) {
        that.data.shareWxPath = "/pages/shouye/detail/centsIndianaDetail/centsDetail?shop_code=" + this.data.shop_code + "&isShareFlag=true" + "&user_id=" + app.globalData.user.user_id;
      } else {
        that.data.shareWxPath = "/pages/shouye/detail/centsIndianaDetail/centsDetail?shop_code=" + this.data.shop_code + "&isShareFlag=true"
      }
    }
    return {
      title: that.data.shareWxTitle,
      path: that.data.shareWxPath,
      imageUrl: that.data.shareWxPic,
      success: function (res) {
        if (that.data.dayOreadyShare > currentDayMaxShareCount) {
          that.showToast("你当日的分享次数过于频繁，请48小时后再来分享。", 3000);
          return;
        }
        that.getData(4, function (data) {
          if (data.status != undefined && data.status == 1) {
            var shareCount = that.data.shareCount;
            var flagMax = that.data.flagMax;
            var centsBuyCount = that.data.centsBuyCount;
            shareCount = shareCount - 1;
            that.data.dayOreadyShare = parseInt(that.data.dayOreadyShare) + 1;
            // console.log('-----', that.data.dayOreadyShare)
            if (shareCount <= 0) {
              shareCount = flagMax;
              centsBuyCount = centsBuyCount + 1;
            }
            that.setData({ shareCount: shareCount, centsBuyCount: centsBuyCount });
            that.showToast("分享成功，再分享" + shareCount + "次即可赢得一次1分抽奖的机会，继续努力。", 3000);
          }
        })

      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})