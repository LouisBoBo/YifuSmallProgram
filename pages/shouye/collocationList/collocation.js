import config from '../../../config';
var util = require('../../../utils/util.js');
var app = getApp();
var Upyun = config.Upyun;
var Version = config.Version;
var task_type;
var isComplete;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    noticeText: '亲，任务奖励就藏在这些商品详情页里噢，快去领取吧~',
    screenHeight: 0,
    screenWidth: 0,
    collocationListData: [],
    page: 1,
    leftTagData: {},
    rightTagData: {},
    isShowFlag: false,//false,浏览件数，true，浏览分钟数
    scanTipsShow: false,//蒙层弹窗
    isOtherFlag: true,
    isShowKnow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    task_type = options.task_type;
    if (task_type == 5) {//浏览分钟数
      this.setData({ isShowFlag: true });
      wx.setNavigationBarTitle({
        title: '时尚搭配',//页面标题为路由参数
      })
    } else {
      if (task_type == 19 || task_type == 4) {//浏览件数
        this.setData({ isShowFlag: false });
        wx.setNavigationBarTitle({
          title: '浏览有奖',//页面标题为路由参数
        })
      } else {
        this.setData({
          isShowFlag: true,
          // isOtherFlag:false,
        });
        wx.setNavigationBarTitle({
          title: '搭配',//页面标题为路由参数
        })
      }
    }
    this.setData({ Upyun: Upyun });
    var day = new Date().getDate();
    var saveDay = wx.getStorageSync("scanshop_tips_day_collocation");
    if (!this.data.isShowFlag && saveDay != day) {
      this.setData({
        scanTipsShow: true
      });
      wx.setStorageSync("scanshop_tips_day_collocation", day);
    }
    var signTask = wx.getStorageSync("SIGN-TASK");
    isComplete = signTask.complete;
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
    this.getData(1, function (data) {
      that.dealBackData(1, data)
    })
  },
  // 页面里的点击-------start
  scan_tips_know: function () {//蒙层弹窗点击知道了
    this.setData({
      scanTipsShow: false
    });
  },
  imageClick: function (event) {//图片点击
    if (event.currentTarget.dataset.code) {
      var collocation_code = event.currentTarget.dataset.code;
      wx.navigateTo({
        url: '../detail/collocationDetail/collocationDetail?code=' + collocation_code + '&task_type=' + task_type,
      })
    }
  },
  tagClick: function (event) {//标签点击
    if (this.data.scanTipsShow) {
      return;
    }
    if (event.currentTarget.dataset.code) {
      var path = '../detail/detail?shop_code=' + event.currentTarget.dataset.code;
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
    }
  },
  clickTaskExplain: function () {
    this.setData({ isShowKnow: true })
  },

  btnKnowClick: function () {
    this.setData({ isShowKnow: false })
  },
  recommendShopClick: function (event) {
    if (event.currentTarget.dataset.code) {
      wx.navigateTo({
        url: '../detail/detail?shop_code=' + event.currentTarget.dataset.code,
      })
    }
  },
  dealBackData: function (flag, data) {
    if (data) {
      if (data.status != 1) {
        return;
      }
    } else {
      return;
    }
    if (flag == 1) {
      if (this.data.page == 1) {
        this.data.collocationListData = [];
      }
      this.data.page = this.data.page + 1;
      var temp0 = [];
      temp0 = data.listShop;
      for (var i = 0; i < temp0.length; i++) {
        var tagData = [];
        tagData = temp0[i].collocation_shop;
        if (tagData.length >= 1) {
          tagData[0].shop_x = ((1 - tagData[0].shop_x) * 100).toFixed(1) + '%';
          tagData[0].shop_y = ((tagData[0].shop_y) * 100).toFixed(1) + '%';
          tagData[0].shop_se_price = (tagData[0].shop_se_price).toFixed(1);
          temp0[i]['left_tag'] = tagData[0];
        }
        if (tagData.length >= 2) {
          tagData[1].shop_x = ((tagData[1].shop_x) * 100).toFixed(1) + '%';
          tagData[1].shop_y = ((tagData[1].shop_y) * 100).toFixed(1) + '%';
          tagData[1].shop_se_price = (tagData[1].shop_se_price).toFixed(1);
          temp0[i]['right_tag'] = tagData[1];
        }

        var temp1 = [];
        var temp2 = [];
        temp2 = temp0[i].shop_type_list;
        if (temp2) {
          for (var j = 0; j < temp2.length; j++) {
            if (temp2[j].list) {
              var temp3 = [];
              temp3 = temp2[j].list;
              for (var z = 0; z < temp3.length; z++) {
                temp3[z].def_pic = Upyun + (temp3[z].shop_code).substring(1, 4) + '/' + temp3[z].shop_code + '/' + temp3[z].def_pic;
                var newshopname = temp3[z].shop_name;
                if (newshopname.length > 6) {
                  newshopname = '... ' + newshopname.substr(newshopname.length - 6, 6);
                }
                temp3[z].shop_name = newshopname;
                temp3[z].shop_se_price = (temp3[z].shop_se_price).toFixed(1);
                temp1.push(temp3[z]);
              }
              // temp1 = temp1.concat(temp2.list);
            }
          }
        }
        console.log("temp1", temp1)
        temp0[i]['list'] = temp1;
      }
      this.data.collocationListData = this.data.collocationListData.concat(temp0);
      this.setData({
        collocationListData: this.data.collocationListData,
      })
    }
  },
  // http://www.52yifu.wang/cloud-api/collocationShop/queryShopCondition?version=V1.31&pager.curPage=1&pager.pageSize=10&type=1&token=Y9Y4CV3L40CWI5QOTTVT&authKey=F3C8DC2844FBF0F7E18D8751151CB4B2&I10o=HtDNEOHNXtq0DOBGHtLQD0UnEOM4DzUnXJUnM0S0MtS%3D&channel=8&appVersion=V3.6.0
  getData: function (flag, fun) {
    var Token = '';
    if (app.globalData.user != null) {
      Token = app.globalData.user.userToken;
    }
    var requestUrl = config.Host;
    if (flag == 1) {//热门评论
      requestUrl = requestUrl + 'collocationShop/queryShopCondition?' + '&pager.curPage=' + this.data.page + "&pager.pageSize=10" + "&type=1" + Version + '&token=' + Token;
    }
    util.http(requestUrl, function (data) {
      fun(data)
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

    var that = this;
    this.data.page = 1;
    this.getData(1, function (data) {
      that.dealBackData(1, data);
      wx.stopPullDownRefresh();

    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    this.getData(1, function (data) {
      that.dealBackData(1, data);
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})