// pages/sign/inviteFriends/friendsReward.js
import config from '../../../config';
var util = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    Upyun: config.Upyun,
    friendNum1: 0.00,            //位好友赢得余额
    friendNum2: 0.00,            //位好友赢得提现
    friendMoney1: 0.00,          //余额
    friendMoney2: 0.00,          //提现
    friendMyMoney1: 0.00,        //我获得的余额
    friendMyMoney2: 0.00,        //我获得的提现
    datalist: {},
    curPage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDayReward();

  },
  // 今日奖励 数据
  getDayReward: function () {
    var dataUrl = config.Host + "wallet/getTcToDayCount?" + config.Version + "&token=" + app.globalData.user.userToken;
    util.http(dataUrl, this.dayReward)
  },
  
  dayReward: function (data) {
    if (data.status == 1) {
      var xj_num = data.data.xj_num ? (1*data.data.xj_num).toFixed(2):"0.00";
      var ed_num = data.data.ed_num ? (1*data.data.ed_num).toFixed(2) : "0.00";
      var f_money = data.data.f_money ? (1*data.data.f_money).toFixed(2) : "0.00";
      var f_extra = data.data.f_extra ? (1*data.data.f_extra).toFixed(2) : "0.00";
      var money = data.data.money ? (1*data.data.money).toFixed(2) : "0.00";
      var extra = data.data.extra ? (1*data.data.extra).toFixed(2) : "0.00";

      this.setData({
        friendNum1: xj_num,
        friendNum2: ed_num,
        friendMoney1: f_money,
        friendMoney2: f_extra,
        friendMyMoney1: money,
        friendMyMoney2: extra,
      })
      
      var movies = [];
      var cutJson = {};

      for (var idx in data.data.listUser) {
        var subject = data.data.listUser[idx];
        cutJson = subject;
        var pic = subject.pic;
        if(pic){
          var fdStart = subject.pic.indexOf("http");
          if (fdStart == 0)
            cutJson['pic'] = pic;
          else
            cutJson['pic'] = config.Upyun + pic;
        }
        

        // var newstr = subject.add_date;
        // var tmp = newstr.substring(0, 4) + '.' + newstr.substring(4, 6) + '.' + newstr.substring(6, newstr.length);
        // cutJson['add_date'] = tmp;
        cutJson['add_date'] = util.getMyDate(subject.add_date, '.', '3');
        movies.push(cutJson)
      }

      this.setData({
        datalist: movies
      });
    
    }

  },
  

  
})