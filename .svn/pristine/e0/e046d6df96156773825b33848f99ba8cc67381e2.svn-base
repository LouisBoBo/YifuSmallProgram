import config from '../config';
var util = require('util.js');
var app = getApp();
/**
 * 获取未下单新用户 体验抽奖次数 并返回是否显示体验抽奖红包
 */
function getBalanceNum(callback){
  var token = getApp().globalData.user.userToken
  var usetId = getApp().globalData.user.user_id
  var isShow = false;//callback返回参数 确定体验抽奖红包是否显示

  if (wx.getStorageSync("IS_AREADY_BUY" + usetId)) {
    callback(isShow); //已经购买过了 直接返回
    return;
  }
  
  var dataUrl = config.Host + "order/getOrderRaffleNum" +
    "?token=" + token + config.Version;
  util.http(dataUrl, function (data) {
    if (data.status != 1) {
        callback(isShow);
        return;
      }
      // console.log("getBalanceNum",res);
      // console.log(res.data.data);
      var balanceLottery = data.data;
      if (balanceLottery>0) {
        wx.setStorageSync("BALANCE_LOTTERY", balanceLottery)//剩余次数
        wx.setStorageSync("BALANCE_LOTTERY_SUM_COUNT", data.n)//总次数
        wx.setStorageSync("BALANCE_LOTTERY_SUM_VALUE", data.money)//当前抽中的总金额
        isShow = true;
      }else{
        if (balanceLottery==-1){
          wx.setStorageSync("IS_AREADY_BUY" + usetId, true)//已经购买过了
        }else{
          wx.setStorageSync("IS_AREADY_BUY" + usetId, false)//未购购买
        }
        isShow = false;
      }
      callback(isShow);
  });

}




//穿搭列表数据处理
function getIntimateListProcess(retData,dataList,callBack){
  var retInfo = [];
  var retInfo2 = [];
  //对data和data2分别去重 d=0(data)  d=1(data2)
  for (var d = 0; d < 2; d++) {
    var data = d == 0 ? retData.data : retData.data2;
    for (var i in data) {
      var isHaving = false;
      for (var j in dataList) {
        if (data[i].theme_id == dataList[j].theme_id) {
          isHaving = true;
          break;
        }
      }
      if (!isHaving) {
        dataList.push(data[i]);//存储不重复数据 下次比较
        if (d == 0) {
          retInfo.push(data[i]);
        } else if (d == 1) {
          retInfo2.push(data[i]);
        }
      }
    }
  }

  // data数据中 每间隔五条数据 插入一条data2(精选推荐)数据
  for (var i = 0; i < retInfo.length;) {
    // console.log("retInfo.length", retInfo.length);
    i += 5;
    if (!retInfo2.length || i >= retInfo.length) {
      break;
    }
    retInfo.splice(i,0,retInfo2[0]);
    retInfo2.shift();
    i += 1;
  }
  Array.prototype.push.apply(retInfo, retInfo2);
  callBack(retInfo)
}




//浏览X件任务
function scanFinish(that, isForceLook, isForceLookLimit, singvalue,type) {
  // var that = this;
    var signTask = wx.getStorageSync("SIGN-TASK");
    var xShop_complete = signTask.complete;
    var xShop_signIndex = signTask.index;
    var xShop_doValue = signTask.value;
    var xShop_doNum = signTask.num;
    var xShop_jiangliName = signTask.jiangliDanWei + signTask.jiangliContent;
    var xShop_jiangliValue = signTask.jiangliValue;
    var xShop_shopsName = signTask.shopsName;
    var token = getApp().globalData.user.userToken

    that.setData({ is_look: false });
    var signUrl = config.Host + "signIn2_0/signIning" +
      "?token=" + token +
      "&share=false" +
      "&index_id=" + xShop_signIndex +
      "&day=" + wx.getStorageSync("SIGN_DAY") + config.Version;

    if (isForceLook) {
      var forcelookNum = 0;
      var forceLookXShopNumKey = xShop_signIndex + "forceLookXShopNum";
      var dataString = new Date().toDateString();

      forcelookNum = wx.getStorageSync(forceLookXShopNumKey);

      if (!forcelookNum || wx.getStorageSync("forcelookNowTime") != dataString) {
        forcelookNum = 0;
      }
      forcelookNum++;
      wx.setStorageSync("forcelookNowTime", dataString);

      if (xShop_doNum > 1) {// 需要奖励分多次发放
        signForceLook(forceLookXShopNumKey, forcelookNum, signUrl, that, singvalue, type);
      } else {

        if (forcelookNum < singvalue) {
          wx.setStorageSync(forceLookXShopNumKey, forcelookNum);
          // var showText = "再浏览" + (singvalue - forcelookNum) + "次即可完成任务喔~"
          var showText = "浏览完成，返回列表再浏览" + (singvalue - forcelookNum) + "件即可完成任务~"
          if (type == 1) {//type = 1 浏览穿搭任务
            showText = "浏览完成，返回列表再浏览" + (singvalue - forcelookNum) + "条即可完成任务~"
          }
          
          that.showToast(showText, 4000);

        } else if (forcelookNum >= singvalue) {
          signForceLook(forceLookXShopNumKey, forcelookNum, signUrl, that, singvalue, type);
        }
      }
    } else if (isForceLookLimit) {

      var forcelookLimitNum = 0;
      var forceLookLimitXShopNumKey = xShop_signIndex + "forceLookLimitXShopNum";
      var dataString = new Date().toDateString();

      forcelookLimitNum = wx.getStorageSync(forceLookLimitXShopNumKey);

      if (!forcelookLimitNum || wx.getStorageSync("nowTimeForcelookLimit") != dataString) {
        forcelookLimitNum = 0;
      }

      wx.setStorageSync("nowTimeForcelookLimit", dataString);

      if (forcelookLimitNum / singvalue >= xShop_doNum
        || xShop_complete) {
        //浏览 奖励额度 达到上限
        that.setData({
          signFinishShow: true,
          signFinishDialog: {
            top_tilte: "任务完成！",
            tilte: "完成浏览任务~",
            contentText: "今日的浏览奖励已达上限，记得明天再来。",
            leftText: "继续浏览",
            rigthText: "去完成下个任务"
          },
        });
        xShop_complete = true;
        signTask.complete = xShop_complete;
        wx.setStorageSync("SIGN-TASK", signTask);

        forcelookLimitNum++;
        wx.setStorageSync(forceLookLimitXShopNumKey, forcelookLimitNum);

      } else {

        if (forcelookLimitNum % singvalue + 1 < singvalue) {
          var showText = "再浏览" + (singvalue - (forcelookLimitNum % singvalue + 1)) + "次即可赢得" + xShop_jiangliValue +
            "元提现额度,继续努力~"
          that.showToast(showText, 4000);
          forcelookLimitNum++;
          wx.setStorageSync(forceLookLimitXShopNumKey, forcelookLimitNum);

        } else if (forcelookLimitNum % singvalue + 1 == singvalue) {
          signForceLookLimit(forceLookLimitXShopNumKey, forcelookLimitNum, signUrl, that,singvalue);
        }

      }
    }

}

var signForceLook = function (forceLookXShopNumKey, forcelookNum, signUrl, that, singvalue, type) {
  var signTask = wx.getStorageSync("SIGN-TASK");
  var xShop_complete = signTask.complete;
  var xShop_signIndex = signTask.index;
  var xShop_doValue = signTask.value;
  var xShop_doNum = signTask.num;
  var xShop_jiangliName = signTask.jiangliDanWei + signTask.jiangliContent;
  var xShop_jiangliValue = signTask.jiangliValue;
  var xShop_shopsName = signTask.shopsName;
  util.http(signUrl, function (data) {
    if (data == null || data.status != 1) {
      that.showToast(data.message, 3000);
      return;
    }

    wx.setStorageSync(forceLookXShopNumKey, forcelookNum);

    if (forcelookNum < singvalue) {//小于要浏览次数
      var showText = "浏览完成，奖励" + xShop_jiangliValue + xShop_jiangliName + ",还有" + (singvalue - forcelookNum) + "次浏览机会喔~";
      that.showToast(showText, 4000);

    } else if (forcelookNum >= singvalue) {//任务完成
      var showText = xShop_jiangliValue * xShop_doNum + xShop_jiangliName + "奖励已存入账户。赶紧去买买吧。";
      if (xShop_jiangliName == '元余额')
      {
        showText = xShop_jiangliValue * xShop_doNum + "元奖金已存入账户。完成所有任务可提现哦。";
      }
      var fTitle = "完成【" + xShop_shopsName + "】浏览~"
      if(type==1){//type = 1 浏览穿搭任务
        fTitle = "完成浏览任务~"
      }
      // that.setData({
      //   signFinishShow: true,
      //   signFinishDialog: {
      //     top_tilte: "任务完成！",
      //     tilte: fTitle,
      //     contentText: showText,
      //     leftText: "继续浏览",
      //     rigthText: "去完成下个任务"
      //   },
      // });

      if (app.signData.isVip != 1 &&data.clock_in_status == 1 && app.signData.current_date == "newbie01") { //新用户第一天打卡成功
        that.setData({
          showFrirstDayCopleteDialog: true,
        })
      } else {
        that.setData({
          signFinishShow: true,
          signFinishDialog: {
            top_tilte: "任务完成！",
            tilte: fTitle,
            contentText: showText,
            leftText: "继续浏览",
            rigthText: "去完成下个任务"
          },
        });
      }

      xShop_complete = true;
      signTask.complete = xShop_complete;
      wx.setStorageSync("SIGN-TASK", signTask);
    }
  })

}

var signForceLookLimit = function (forceLookLimitXShopNumKey, forcelookLimitNum, signUrl, that, singvalue) {
  var signTask = wx.getStorageSync("SIGN-TASK");
  var xShop_complete = signTask.complete;
  var xShop_signIndex = signTask.index;
  var xShop_doValue = signTask.value;
  var xShop_doNum = signTask.num;
  var xShop_jiangliName = signTask.jiangliDanWei + signTask.jiangliContent;
  var xShop_jiangliValue = signTask.jiangliValue;
  var xShop_shopsName = signTask.shopsName;
  util.http(signUrl, function (data) {

    if (data == null || data.status != 1) {
      that.showToast(data.message, 3000);
      return;
    }
    var showText = xShop_jiangliValue + "元提现现金已经发放，到账时间为3-5个工作日，请耐心等待。再浏览" + singvalue + "次可再得" + xShop_jiangliValue + "元提现现金,继续努力~";
    that.showToast(showText, 4000);
    forcelookLimitNum++;
    wx.setStorageSync(forceLookLimitXShopNumKey, forcelookLimitNum);
  })
}

//上传图片
function uploadimg(data) {
  var that = this;
  var i = data.i ? data.i : 0;//当前上传的哪张图片
  var success = data.success ? data.success : 0;//上传成功的个数
  var fail = data.fail ? data.fail : 0;//上传失败的个数

  var url = util.Md5_httpUrl(data.url);
  wx.uploadFile({
    url: url,
    filePath: data.path[i],
    name: 'file',//这里根据自己的实际情况改
    formData: {
      data: data.persondata, //这里是上传图片时一起上传的数据
    },
    success: (resp) => {
      success++;//图片上传成功，图片上传成功的变量+1
      console.log(resp)
      console.log(i);
      //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1 
    },
    fail: (res) => {
      fail++;//图片上传失败，图片上传失败的变量+1
      console.log('fail:' + i + "fail:" + fail);
    },
    complete: () => {
      console.log(i);
      i++;//这个图片执行完上传后，开始上传下一张            
      if (i == data.path.length) {   //当图片传完时，停止调用          
        console.log('执行完毕');
        console.log('成功：' + success + " 失败：" + fail);
        // callBack('success');
        wx.hideLoading();
      } else {//若图片还没有传完，则继续调用函数                
        console.log(i);
        data.i = i;
        data.success = success;
        data.fail = fail;
        that.uploadimg(data);
        // callBack('fail');
      }
    }
  });
}

module.exports = {
  getBalanceNum: getBalanceNum,
  getIntimateListProcess: getIntimateListProcess,
  scanFinish: scanFinish,//浏览任务计数
  uploadimg: uploadimg
}