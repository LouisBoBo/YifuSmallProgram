import config from '../../../config';
// import sign from '../../sign/sign';
var app = getApp();
var task_type;
var isComplete;
var jiangliValue;

var outMmargeintop = 60;
var util = require('../../../utils/util.js');
var isLiulanshuoming = true; //浏览说明头是否显示
var isRMTS = false; //是否是热门推首

Page({
  data: {
    noticeText: '亲，任务奖励就藏在这些商品详情页里噢，快去领取吧~',
    number: 0.7,
    number2: 1.0,
    Upyun: '',
    Version: '',
    Channel: '',
    sort: isRMTS ? "add_time" : "audit_time",
    order: "desc",
    activityIndex: 0,
    topData: [],
    datalist: [],
    curPage: 1,
    pageSize: 10,
    shopsName: '',
    shopsbanner: '',
    signValu: '',
    isShowHeadPic: false,
    haveSuppley: true,
    supplyName: "",
    isLiulanshuoming,
    outMmargeintop,
    isShowKnow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    try {
      isRMTS = options.isRMTS;
    } catch (e) {}



    var signTask = wx.getStorageSync("SIGN-TASK");
    isComplete = signTask.complete;
    jiangliValue = signTask.jiangliValue;

    var jingliName = options.jingliName;
    var index = options.index;
    var num = options.num;
    task_type = options.task_type;

    var value = '';
    value = options.value;
    console.log("value" + value)

    if ("collection#browse_shop" == value) {
      isRMTS = true;
    }
    console.log("isRMTS:" + isRMTS);


    var shopsbannerTemp = '';
    shopsbannerTemp = options.shopsbanner;
    var shopsNameTemp = options.shopsName;

    wx.setNavigationBarTitle({
      title: shopsNameTemp //页面标题为路由参数
    })
    if ("19" == task_type) {
      this.setData({
        noticeText: "每浏览" + value.split(',')[1] + "件衣服，即得" + jiangliValue + "元提现额度哦，快去领取吧~"
      })
    }

    if (shopsbannerTemp && shopsbannerTemp.length > 0 && (shopsbannerTemp.endsWith("png") || shopsbannerTemp.endsWith("jpg"))) {
      this.setData({
        isShowHeadPic: true
      })
    }
    //浏览说明头是否显示
    if (task_type == 4 || task_type == 19) {
      isLiulanshuoming = true;
      outMmargeintop = 60;
    } else {
      isLiulanshuoming = false;
      outMmargeintop = 0;
    }

    this.setData({
      outMmargeintop,
      isLiulanshuoming,
      signValu: value,
      shopsbanner: shopsbannerTemp,
      shopsName: shopsNameTemp,
      Upyun: config.Upyun,
      Version: config.VersionPost,
      Channel: config.ChannelPost,
      topData: [{
          name: '最新',
          _id: 'news',
          sort: isRMTS ? "add_time" : "audit_time",
          order: 'desc'
        },
        {
          name: '热销',
          _id: 'hot',
          sort: 'virtual_sales',
          order: 'desc'
        },
        {
          name: '价格↑',
          _id: 'priceUp',
          sort: 'shop_se_price',
          order: 'asc'
        },
        {
          name: '价格↓',
          _id: 'priceDown',
          sort: 'shop_se_price',
          order: 'desc'
        }
      ],
    })
    var thiscopy;
    thiscopy = this;
    thiscopy.oneYuan_httpData();
    // this.getData(function(data) {
    //   thiscopy.cutShopCode(data)
    // });

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
      
      app.globalData.oneYuanData = 0;
      app.globalData.typePageHide = 0;

      util.get_discountHttp(function (data) {
        if (data.status == 1) {
          var money = data.one_not_use_price.toFixed(2);
          var shop_deduction = Number(data.shop_deduction) > 1 ? 1.0 : data.shop_deduction;

          that.setData({
            reduceMoney: money,
            shop_deduction: shop_deduction != undefined ? shop_deduction : 0.0
          })
        }
        that.getData(function (data) {
          that.cutShopCode(data)
        });
      });
    }
  },
  toShopDetailClick: function(event) {
    util.httpPushFormId(event.detail.formId);
    var shop_code = event.currentTarget.dataset.code;
    var path = "../../shouye/detail/detail?" + "shop_code=" + shop_code;
    if ("19" == task_type && !isComplete) {
      //浏览赢提现
      wx.navigateTo({
        url: path + "&isForceLookLimit=true"
      });
    } else if ("4" == task_type && !isComplete) {
      //浏览X件商品
      wx.navigateTo({
        url: path + "&isForceLook=true"
      });
    } else {
      wx.navigateTo({
        url: path
      });
    }

  },
  clickTaskExplain: function() {
    this.setData({
      isShowKnow: true
    })
  },

  btnKnowClick: function() {
    this.setData({
      isShowKnow: false
    })
  },
  cutShopCode: function(data) {
    var thiscopy;
    thiscopy = this;
    var shop_code_cut = '';
    var cutJson = {};
    var dataListTemp = [];
    for (var i = 0; i < data.length; i++) {
      shop_code_cut = data[i].shop_code.substring(1, 4);
      cutJson = data[i];
      cutJson["cut_shop_code"] = shop_code_cut;
      console.log(cutJson);
      var shop_se_price = ((data[i].shop_se_price)).toFixed(1);
      // cutJson.shop_se_price = shop_se_price;

      //何波修改2018-4-4
      if (app.globalData.oneYuanData == 0) //是1元购
      {
        var se_price = (data[i].assmble_price * 1).toFixed(1);
        if (thiscopy.data.isVip > 0) {
          se_price = util.get_discountPrice(shop_se_price, thiscopy.data.shop_deduction, thiscopy.data.reduceMoney, thiscopy.data.maxType);
        }

        cutJson.shop_se_price = (se_price * 1).toFixed(1);
        cutJson.shop_price = shop_se_price;
      } else {
        cutJson.shop_se_price = shop_se_price;
        cutJson.supp_label = '';
      }

      dataListTemp.push(cutJson)
    }
    thiscopy.setData({
      datalist: dataListTemp,
      showSub: app.showSub

    })
  },
  onTapClick: function(event) {


    var thiscopy;
    thiscopy = this;
    thiscopy.setData({
      curPage: 1
    })
    const index = event.currentTarget.dataset.index;
    this.setData({
      activityIndex: index
    })

    this.getData(function(data) {

      thiscopy.cutShopCode(data)
    });


  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

    // var temp;
    // temp = thiscopy.curPage+1;
    //thiscopy.setData({ curPage: temp })
    console.log("-----------------")
    var thiscopy;
    thiscopy = this;
    var temp;
    temp = thiscopy.data.curPage + 1;
    thiscopy.setData({
      curPage: temp
    })
    thiscopy.getData(function(data) {


      var shop_code_cut = '';
      var cutJson = {};

      for (var i = 0; i < data.length; i++) {
        shop_code_cut = data[i].shop_code.substring(1, 4);
        cutJson = data[i];
        cutJson["cut_shop_code"] = shop_code_cut;
        console.log(cutJson);
        thiscopy.data.datalist.push(cutJson);
        var shop_se_price = ((data[i].shop_se_price)).toFixed(1);
        // cutJson.shop_se_price = shop_se_price;

        //何波修改2018-4-4
        if (app.globalData.oneYuanData == 0) //是1元购
        {
          var se_price = (data[i].assmble_price * 1).toFixed(1);
          if (thiscopy.data.isVip > 0) {
            se_price = util.get_discountPrice(shop_se_price, thiscopy.data.shop_deduction, thiscopy.data.reduceMoney, thiscopy.data.maxType);
          }

          cutJson.shop_se_price = (se_price * 1).toFixed(1);
          cutJson.shop_price = shop_se_price;
        } else {
          cutJson.shop_se_price = shop_se_price;
          cutJson.supp_label = '';
        }
      }
      thiscopy.setData({
        datalist: thiscopy.data.datalist
      })

    });
  },

  getData: function(fun) {
    wx.showNavigationBarLoading();
    var thiscopy;
    thiscopy = this;

    var requestUrl = '';

    var jsonParames = {};

    var token = '';
    if(app.globalData.user != undefined && app.globalData.user.userToken != undefined)
    {
      token = app.globalData.user.userToken
    }
    var strLink = '&token=' + token + config.Version;
    console.log("thiscopy.data.signValu", thiscopy.data.signValu);
    if ("collection#browse_shop" == thiscopy.data.signValu) { //强制浏览//shop/queryBrowseShopList
      
      requestUrl = config.Host + 'shop/queryBrowseShopList?curPage=' + this.data.curPage + '&pageSize=' + this.data.pageSize + '&sort=' + (this.data.topData)[this.data.activityIndex].sort + '&order=' + (this.data.topData)[this.data.activityIndex].order;
    } else { //热卖推荐shop/queryCondition
      
      requestUrl = config.Host + 'shop/queryCondition?pager.curPage=' + this.data.curPage + '&pager.pageSize=' + this.data.pageSize + '&pager.sort=' + (this.data.topData)[this.data.activityIndex].sort + '&pager.order=' + (this.data.topData)[this.data.activityIndex].order;
      var valueAll = [];
      var valueAllNew = [];
      valueAll = thiscopy.data.signValu.split(",");
      valueAllNew = valueAll[0].split("$");
      for (var i = 0; i < valueAllNew.length; i++) {
        var valuePin = valueAllNew[i].split("#");
        // jsonParames[valuePin[0]] = valuePin[1];
        requestUrl = requestUrl + '&' + valuePin[0] + '=' + valuePin[1]
      }
    }
    requestUrl = requestUrl + strLink;
    util.http(requestUrl, function(data) {

      if(data.status == 1)
      {
        var isVip = data.isVip != undefined ? data.isVip : '';
        var maxType = data.maxType != undefined ? data.maxType : '';

        thiscopy.data.isVip = isVip;
        thiscopy.data.maxType = maxType;
      }
      if ("collection#browse_shop" == thiscopy.data.signValu) {
        fun(data.list)
      } else {
        fun(data.listShop)
      }
    })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var thiscopy;
    thiscopy = this;
    thiscopy.setData({
      curPage: 1
    })
    this.getData(function(data) {
      thiscopy.cutShopCode(data)
      wx.stopPullDownRefresh()

    })
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})