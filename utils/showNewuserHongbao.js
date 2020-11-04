import config from '../config';
var util = require('util.js');
var app = getApp();
var redhongbaopopTimer;

//第一次弹出的时间
function getShowHongbao(that, callback) {
  
  util.get_shouyeSwitch('', function(swhitchdata) {
    var homePage3FirstTime = swhitchdata.homePage3FirstTime != undefined ? swhitchdata.homePage3FirstTime : '1';
    var homePage3ElasticFrame = swhitchdata.homePage3ElasticFrame != undefined ? swhitchdata.homePage3ElasticFrame : '0';
    var noMemberHomePage3ElasticFrame = swhitchdata.noMemberHomePage3ElasticFrame != undefined ? swhitchdata.noMemberHomePage3ElasticFrame : '0';

    if (homePage3FirstTime > 0 && that.data.comefrom != 'sign') {
      that.data.noMemberHomePage3ElasticFrame = noMemberHomePage3ElasticFrame;
      that.data.homePage3ElasticFrame = homePage3ElasticFrame;
      that.data.homePage3FirstTime = homePage3FirstTime;

      redhongbaopopTimer = setTimeout(function() {
        callback(true)
      }, homePage3FirstTime * 1000);
    }
  });
}

//循环弹出
function loopShowHongbao(that, showHongBao, callback) {

  if(that.data.homePage3ElasticFrame >0)
  {
    redhongbaopopTimer = setTimeout(function () {

      if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
        callback(false)
        clearTimeout(redhongbaopopTimer); //清除定时器
      } else {//当用户没有登录授权时才循环弹出此框
        callback(true)
        showHongBao.loopShowHongbao(that, showHongBao, function () { });
      }
    }, that.data.homePage3ElasticFrame * 1000)
  }
}

//点击领红包
function clickHongbao(that , callback){
  
  if (that.data.clickLogin && app.globalData.channel_type != 1) {
    if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
      wx.navigateTo({
        url: '/pages/sign/sign?comefrom=hongbaostyle',
      })
    }
  } else {
    wx.navigateTo({
      url: '/pages/sign/sign?comefrom=hongbaostyle',
    })
  }
  

  //如果取到广告click_id就回传
  var click_id = wx.getStorageSync('gdt_vid');
  if (click_id) {
    var clickUrl = config.Host + 'wxMarkting/marketing_reservation?' + config.Version +
      '&click_id=' + click_id +
      "&channel=" + wx.getStorageSync("advent_channel");
    util.http(clickUrl, function (data) {
      if (data.status == 1) {
        wx.setStorageSync('gdt_vid', '')
      }
    });
  }
}

//停止动画
function stoppopTimer(that, callback) {
  clearTimeout(redhongbaopopTimer); //清除定时器
}
module.exports = {
  getShowHongbao: getShowHongbao,
  loopShowHongbao: loopShowHongbao,
  stoppopTimer: stoppopTimer,
  clickHongbao: clickHongbao
}