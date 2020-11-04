import config from '../config';
var util = require('util.js');
var app = getApp();
var countDownTimer;
//拼团倒计时
function countdown(that,fightUtil,cutdownTime,callback) {
  var cutdown_total_micro_second = cutdownTime;
  if (cutdown_total_micro_second <= 0) {
    //时间截至
    that.setData({
      time: '00' + ':' + '00' + ':' + '00'
    });
    callback(that.data.time)
    clearTimeout(countDownTimer);
    return;
  }else{
    var time = fightUtil.dateformat(that,cutdown_total_micro_second);
    callback(time);
  }
  //如果重新刷新先清掉定时器
  if (that.data.is_fresh)
  {
    clearTimeout(countDownTimer);
  }
  countDownTimer = setTimeout(function () {
    cutdown_total_micro_second -= 1000;
    fightUtil.countdown(that, fightUtil, cutdown_total_micro_second,callback);
  }, 1000)
}

function dateformat(that,micro_second) {

  // 总秒数
  var second = Math.floor(micro_second / 1000);

  // 天数
  var day = "" + Math.floor(second / 3600 / 24);
  // 小时
  var hr = "" + Math.floor(second / 3600 % 24);
  // 分钟
  var min = "" + Math.floor(second / 60 % 60);
  // 秒
  var sec = "" + Math.floor(second % 60);


  if (hr.length < 2) {
    hr = '0' + hr;
  }

  if (min.length < 2) {
    min = '0' + min;
  }

  if (sec.length < 2) {
    sec = '0' + sec;
  }

  that.setData({
    time: hr + ':' + min + ':' + sec
  });

  return that.data.time;
}
//停止定时器
function stoppopTimer() {
  clearTimeout(countDownTimer); //清除定时器
}
module.exports = {
  countdown: countdown,
  dateformat: dateformat,
  stoppopTimer: stoppopTimer
}