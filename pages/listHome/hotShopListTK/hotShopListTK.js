import config from '../../../config';
// import sign from '../../sign/sign';
var app = getApp();

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
    isKT:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    try {
      isRMTS = options.isRMTS;
    } catch (e) {}



    console.log("isRMTS:" + isRMTS);




    isLiulanshuoming = false;
    outMmargeintop = 0;

    this.setData({
      outMmargeintop,
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

  },

  //获取是否是一元购
  oneYuan_httpData: function() {
    var that = this;
    var url = config.Host + 'cfg/on_off_3_7?' + config.Version;
    util.http(url, that.oneYuanData);
  },
  oneYuanData: function(data) {
    var that = this;
    if (data.status == 1) {

      app.globalData.oneYuanData = 0;
      app.globalData.typePageHide = 0;

      util.get_discountHttp(function(data) {
        if (data.status == 1) {
          var money = data.one_not_use_price.toFixed(2);
          var shop_deduction = Number(data.shop_deduction) > 1 ? 1.0 : data.shop_deduction;

          that.setData({
            reduceMoney: money,
            shop_deduction: shop_deduction != undefined ? shop_deduction : 0.0
          })
        }
        that.getData(function(data) {
          that.cutShopCode(data)
        });
      });
    }
  },
  toShopDetailClick: function(event) {
    util.httpPushFormId(event.detail.formId);
    var shop_code = event.currentTarget.dataset.code;
    var path = "../../shouye/detail/detail?" + "shop_code=" + shop_code +"&isKT=true";
    wx.navigateTo({
      url: path
    });

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

      //开团价格
      cutJson.shop_se_price = (data[i].assmble_price).toFixed(1);




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
          // cutJson.shop_price = shop_se_price;
          //开团价格
          cutJson.shop_se_price = (data[i].assmble_price).toFixed(1);
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
    if (app.globalData.user != undefined && app.globalData.user.userToken != undefined) {
      token = app.globalData.user.userToken
    }
    var strLink = '&token=' + token + config.Version;

    requestUrl = config.Host + 'shop/queryCondition?pager.curPage=' + this.data.curPage + '&pager.pageSize=' + this.data.pageSize + '&pager.sort=' + (this.data.topData)[this.data.activityIndex].sort + '&pager.order=' + (this.data.topData)[this.data.activityIndex].order;


    requestUrl = requestUrl + strLink;
    util.http(requestUrl, function(data) {

      if (data.status == 1) {
        var isVip = data.isVip != undefined ? data.isVip : '';
        var maxType = data.maxType != undefined ? data.maxType : '';

        thiscopy.data.isVip = isVip;
        thiscopy.data.maxType = maxType;
      }
   
        fun(data.listShop)
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