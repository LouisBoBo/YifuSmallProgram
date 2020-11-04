import config from '../../../config';
var mytime = require('../../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    currentpage: 1,
    upyconfig: config.Upyun,
    typeNames: ["往期揭晓", "晒单分享"],
    indialist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.httpdata()
  },
  switchNav: function (e) {
    var page = this;
    var currenttab = e.target.dataset.current;
    if (this.data.currentTab == currenttab) {
      return false;
    } else {
      if (currenttab == 0) {
        page.httpdata();
      } else {
        page.setData({
          indialist: [],
          currentpage: 1,
        })
      }
      page.setData({
        currentTab: e.target.dataset.current,
      });
    }
  },
  //网络请求数据
  httpdata: function () {
    var that = this;
    var usertoken = app.globalData.user.userToken;

    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = config.Host + 'treasures/getWinParticipationList?' + config.Version + '&sort=otime&order=desc' + '&token=' + usertoken + '&page=' + that.data.currentpage;

    if (mUrl) {
      var tepm = mUrl.split("?");
      tongji_url = mUrl.split("?")[0]
      tongji_url = tongji_url.replace(config.Host, "");
      tongji_url = tongji_url.replace(config.PayHost, "")
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
      url: config.Host + 'treasures/getWinParticipationList?' + config.Version + '&sort=otime&order=desc' + '&token=' + usertoken + '&page=' + that.data.currentpage,
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.stopPullDownRefresh();
        app.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
        if (that.data.currentpage == 1) {
          that.setData({
            indialist: [],
          })
        }
        if (res.data.status == 1 && res.data.data.length) {
          var page = that.data.currentpage + 1;
          var oldlist = that.data.indialist;
          for (var i = 0; i < res.data.data.length; i++) {
            var obj = res.data.data[i];
            if (obj != null) {
              var newotime = mytime.getMyDate(obj.otime, '.');
              obj["newotime"] = newotime;

              var in_head = obj.in_head;
              if (in_head != null) {
                if (in_head.indexOf("http")) {
                  in_head = config.Upyun + in_head;
                }
              } else {
                in_head = "https://www.measures.wang/userinfo/head_pic/default.jpg";
              }
              obj.in_head = in_head;
              oldlist.push(obj);
            }
          }
          that.setData({
            indialist: oldlist,
            currentpage: page
          })
        }
      },
      fail: function (error) {
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })
  },
  //列表加载更多
  onReachBottom: function () {
    if (this.data.currentTab == 0) {
      this.httpdata();
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      currentpage: 1,
    })
    this.httpdata();
  },
  //商品详情
  shopdetailtap: function (event) {
    var shop_code = event.currentTarget.dataset.shopcode;
    wx.redirectTo({
      url: '../../shouye/detail/centsIndianaDetail/centsDetail?' + "shop_code=" + shop_code,
    })
  }
})