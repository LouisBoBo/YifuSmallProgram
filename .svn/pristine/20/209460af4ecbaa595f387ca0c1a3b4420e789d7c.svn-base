// pages/shouye/detail/centsIndianaRecord/centsIndianaRecord.js
import config from '../../../../config';
var util = require('../../../../utils/util.js');
var app = getApp();
var token;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    no_data:false,
    curPage: 1,
    pageSize: 10,  
    datalist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    token = app.globalData.user.userToken;
    this.initData();
  },

  initData: function () {
    var dataUrl = config.Host + "treasures/getMyParticipationList" +
      // "?token=VW9TK4C34PP0GMAAFL5L" + 
      "?token=" + token +
      "&page=" + this.data.curPage +
      "&sort=btime&order=desc"  + config.Version;
    console.log(dataUrl);
    util.httpNeedLogin(dataUrl, this.manipulationData,function(){});
  },

  manipulationData: function (data) {
    wx.stopPullDownRefresh();
    console.log("manipulationData",data.data);
    var that = this;
    if (that.data.curPage == 1 &&
      (!data || !data.data || !data.data.length || data.data.length <= 0)) {
      that.setData({
        no_data: true,
        datalist: []
      });
      return;
    }
    var shop_code_cut = '';
    var newJson = {};
    var dataListTemp = that.data.curPage == 1 ? [] : that.data.datalist;
    for (var i in data.data) {
      newJson = data.data[i];
      shop_code_cut = newJson.shop_code.substring(1, 4);
      newJson["show_shop_pic"] = config.Upyun + shop_code_cut + "/" + newJson.shop_code + "/" + newJson.shop_pic;

      newJson["n_otime_title"] =""
      newJson["ing"] = true;
      newJson["tuikuan"] = false;
      newJson["yjx"] = false;
      newJson["zhongjiang"] = false;
      newJson["isBottomShow"] = true;
      newJson["n_otime"] = "";

      var status = newJson.status;
      
      if (status == 0){
        newJson["ing"] = true;
        newJson["tuikuan"] = false;
        newJson["yjx"] = false;
        newJson["zhongjiang"] = false;
        newJson["isBottomShow"] = false;
        newJson["n_otime_title"] = "开始时间"
        newJson["n_otime"] = util.getMyDate(newJson.btime, '.');
      }
      if (status == 2) {
        newJson["n_otime_title"] = ""
        newJson["n_otime"] = "未满足预定开奖人数";
        newJson["ing"] = false;
        newJson["tuikuan"] = true;
        newJson["yjx"] = false;
        newJson["zhongjiang"] = false;
        newJson["isBottomShow"] = false;
      }
      if (status == 3) {
        var user_id = app.globalData.user.user_id;

        if (newJson.in_uid != user_id) { // 不是当前用户中奖
          newJson["ing"] = false;
          newJson["tuikuan"] = false;
          newJson["yjx"] = true;
          newJson["zhongjiang"] = false;
          newJson["isBottomShow"] = true;
        } else {
          newJson["ing"] = false;
          newJson["tuikuan"] = false;
          newJson["yjx"] = false;
          newJson["zhongjiang"] = true;
          newJson["isBottomShow"] = true;
        }
        newJson["n_otime_title"] = "揭晓时间"
        newJson["n_otime"] = util.getMyDate(newJson.otime, '.');
      }
      if (status == 4){
        //等待开奖
        newJson["ing"] = true;
        newJson["tuikuan"] = false;
        newJson["yjx"] = false;
        newJson["zhongjiang"] = false;
        newJson["isBottomShow"] = false;
        newJson["n_otime_title"] = "开始时间"
        newJson["n_otime"] = util.getMyDate(newJson.btime, '.');
      }

      dataListTemp.push(newJson);
    }
    that.setData({
      no_data: false,
      datalist: dataListTemp
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      curPage: 1
    })
    that.initData();
  },

  onReachBottom: function () {
    if (no_data){
      return;
    }
    var that = this;
    that.setData({
      curPage: that.data.curPage + 1
    })
    that.initData();
  },
  shoplist_tap: function (event) {
    var index = event.currentTarget.dataset.tapindex;
    var item = this.data.datalist[index];

    var status = item.status;

    var shop_code = item.shop_code;
    var in_code = item.in_code;
    var otime = item.otime;
    var in_name = item.in_name;
    var in_head = item.in_head;
    var in_uid = item.in_uid;
    var issue_code = item.issue_code;
    var virtual_num = item.virtual_num;
    
    if (status!=2){
      wx.redirectTo({
        url: "../centsIndianaDetail/centsDetail?"+
        "shop_code=" + shop_code+
        "&in_code=" + in_code +
        "&otime=" + otime +
        "&in_name=" + in_name +
        "&in_head=" + in_head +
        "&in_uid=" + in_uid +
        "&issue_code=" + issue_code+
        "&virtual_num=" + virtual_num 
      });
    }

  }

})