import config from '../config';
var app = getApp();
var MD5 = require('md5.js');
var base64_func = require('base64.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//接口加密
function Md5_httpUrl(url) {
  var oldurl = url + "yunshangshiji"
  var autherkey = MD5.md5(oldurl);

  var obj_base64 = new base64_func.Base64();
  var I10o = obj_base64.encode(autherkey);
  var newurl = url + "&authKey=" + autherkey + "&I10o=" + I10o + '&systime=' + new Date().getTime();
  return newurl;
}

// 数据请求  callBack回调操作
function http(url, callBack) {

  var tongji_url = "default";
  var tongji_parameter = "default"
  var mUrl = url + "";


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

  var method = (url.indexOf("/userFiles/upload") || url.indexOf("wxcxPush/getQRCode") || url.indexOf("wxcxPush/createQRCode")) == -1 ? 'GET' : 'POST';
  var uurrll = Md5_httpUrl(url);
  uurrll = encodeURI(uurrll);
  console.log(callBack)
  wx.showNavigationBarLoading()
  wx.request({
    url: uurrll,
    method: method,
    header: {
      "Content-Type": "application/json"
    },
    success: function(res) {
      console.log(callBack)
      callBack(res.data);
      console.log(uurrll);
      console.log(res.data);
      wx.hideNavigationBarLoading();


      app.mtj.trackEvent('i_f_success_count', {
        i_f_name: tongji_url,
      });

    },
    fail: function(error) {
      console.log(error)
      wx.hideNavigationBarLoading();

      app.mtj.trackEvent('i_f_error_count', {
        i_f_name: tongji_url,
        // i_f_from: "10",
      });
    }
  })
}

// 数据请求  callBack回调操作,refreshCallBack登录后台后的操作 (需要登录的接口调用用这个方法)
function httpNeedLogin(url, callBack, refreshCallBack) {


  var tongji_url = "default";
  var tongji_parameter = "default"
  var mUrl = url + "";

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



  var uurrll = Md5_httpUrl(url);
  wx.showNavigationBarLoading()
  wx.request({
    url: uurrll,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function(res) {
      if (res.data.status == 1) {
        callBack(res.data);
      } else {
        if (res.data.status == 10030) { //重新登录
          console.log("----用户被挤掉----")
          //清除用户信息
          app.globalData.user = null;
          wx.setStorageSync("3rd_session", "");
          //重新登录后台
          app.usergetInfomation(refreshCallBack);
          //刷新数据
          // refreshCallBack();
        } else {
          callBack(res.data);
        }
      }
      wx.hideNavigationBarLoading();

      app.mtj.trackEvent('i_f_success_count', {
        i_f_name: tongji_url,
      });
    },
    fail: function(error) {
      console.log(error)
      wx.hideNavigationBarLoading();

      app.mtj.trackEvent('i_f_error_count', {
        i_f_name: tongji_url,
        // i_f_from: "10",
      });
    }
  })
}

// UpyunJson数据  文案
function httpUpyunJson(callBack) {
  var url = config.Upyun + "paperwork/paperwork.json" + '?systime=' + new Date().getTime();

  var tongji_url = "default";
  var tongji_parameter = "default"
  var mUrl = url + "";

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
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function(res) {
      callBack(res.data);
      app.mtj.trackEvent('i_f_success_count', {
        i_f_name: tongji_url,
      });
    },
    fail: function(error) {
      console.log(error)
      app.mtj.trackEvent('i_f_error_count', {
        i_f_name: tongji_url,
        // i_f_from: "10",
      });
    }
  })
}
// 地址数据库
function httpAddressJson(callBack) {
  var basesData = app.globalData.user.addressData; //wx.getStorageSync("address");


  if (basesData) {
    console.log('storageaddress');
    callBack(basesData);
  } else {
    var url = config.Upyun + "paperwork/addressData.json";

    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = url + "";

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
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function(res) {
        console.log('requestaddress');
        var address = res.data;
        app.globalData.user.addressData = address;
        // wx.setStorageSync("address", address)
        // wx.setStorage({
        //   key: "address",
        //   data: address
        // })
        callBack(res.data);
        app.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });

      },
      fail: function(error) {
        console.log(error)
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })
  }
}
// 传给后台formId  （用于推送）
function httpPushFormId(formId) {
  // if (app.globalData.user) {
  //   var dataUrl = config.Host + "wxcxPush/addUserFormId?" + config.Version + "&token=" + app.globalData.user.userToken + '&form_id=' + formId;

  //   var tongji_url = "default";
  //   var tongji_parameter = "default"
  //   var mUrl = dataUrl + "";

  //   if (mUrl) {
  //     var tepm = mUrl.split("?");
  //     tongji_url = mUrl.split("?")[0]
  //     tongji_url = tongji_url.replace(config.Host, "");
  //     tongji_url = tongji_url.replace(config.PayHost, "")
  //     tongji_url = tongji_url.replace("//", "/")

  //     tongji_parameter = mUrl.substring(mUrl.indexOf("?") + 1, mUrl.length - 1)

  //     if (!tongji_url) {
  //       tongji_url = "default"
  //     }
  //     if (!tongji_parameter) {
  //       tongji_parameter = "default"
  //     }
  //   }


  //   wx.request({
  //     url: dataUrl,
  //     method: 'GET',
  //     header: {
  //       "Content-Type": "json"
  //     },
  //     success: function(res) {
  //       app.mtj.trackEvent('i_f_success_count', {
  //         i_f_name: tongji_url,
  //       });
  //     },
  //     fail: function(error) {
  //       app.mtj.trackEvent('i_f_error_count', {
  //         i_f_name: tongji_url,
  //         // i_f_from: "10",
  //       });
  //     }
  //   })

  // }

}

//获取可抵扣余额
function get_discountHttp(callBack) {
  var token = "";
  if (app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }
  var oldurl = config.Host + 'order/getZeroOrderDeductible?' + config.Version + '&token=' + token;

  var tongji_url = "default";
  var tongji_parameter = "default"
  var mUrl = oldurl + "";

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
    url: oldurl,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function(res) {
      app.mtj.trackEvent('i_f_success_count', {
        i_f_name: tongji_url,
      });
      callBack(res.data);

    },
    fail: function(error) {
      console.log(error)
      app.mtj.trackEvent('i_f_error_count', {
        i_f_name: tongji_url,
        // i_f_from: "10",
      });
    }
  })
}

function toAuthorizeWx(fun) { //去微信授权
  if (null != app.globalData.user && null != app.globalData.user.userToken) {
    fun(true)
  } else {
    wx.showModal({
      title: '是否要打开设置页面重新授权',
      showCancel: true,
      content: '需要获取你的公开信息（昵称、头像等），请到小程序的设置中打开用户信息授权',
      cancelText: '取消',
      confirmText: '去设置',
      confirmColor: '#ff3f8b',
      success: function(res) {
        if (res.confirm) {
          app.usergetInfomation_toOpenSeting(fun);
        } else if (res.cancel) {
          // var isSuccess=false;
          fun(false);
        }
      }
    })
  }
}

//获得日期年.月.日.分:时:秒  1.str是时间 2.other是年月日分隔符 3.daydate只有年月日没有时分秒
function getMyDate(str, other, daydate) {
  var oDate = new Date(str);
  var oYear = oDate.getFullYear();
  var oMonth = oDate.getMonth() + 1;
  var oDay = oDate.getDate();
  var oHour = oDate.getHours();
  var oMin = oDate.getMinutes();
  var oSen = oDate.getSeconds();

  //最后拼接时间
  if (daydate) {
    return [oYear, oMonth, oDay].map(formatNumber).join(other)
  } else {
    if (other == "sweet_friend") {
      return oYear + '年' + oMonth + '月' + oDay + '日' + ' ' + [oHour, oMin].map(formatNumber).join(':')
    } else {
      return [oYear, oMonth, oDay].map(formatNumber).join(other) + ' ' + [oHour, oMin, oSen].map(formatNumber).join(':')
    }
  }

}
//判断是不是当天
function isToday(str) {
  if (new Date(str).toDateString() === new Date().toDateString()) {
    console.log("当天");
    return "当天";
  } else if (new Date(str) < new Date()) {
    console.log("以前的日期");
    return "以前的日期";
  }
  return "";
}

function getVirtualName() {
  var virtualName = ['一', '娅', '清', '帆', '娇', '娉', '嘉', '三', '昊', '萍', '」', '明', '小', '成', '树', '向', '舒', '专', '尔', '昕', '世', '刖', '列', '则', '√', '君', '娜', '东', '思', '丞', '星', '娟', ' ', '映', '怡', '倡', '娣', '尤', '春', '娥', '营', '倩', '琬', '帮', '爰', '昱', '爱', '琳', '琴', '水', '永', '常', '丹', '琼', '丽', '鸾', '鸿', '桂', '际', '陈', '婉', '义', '汉', '晋', '晓', '塔', '展', '晖', '湘', '瑛', '瑜', '瑞', '江', '鹤', '书', '婧', '豪', '恬', '景', '驰', '葱', '艳', '平', '晴', '婵', '灵', '瑶', '晶', '婷', '幸', '艺', '智', '恺', '瑾', '艾', '承', '沁', '沂', '梅', '隅', '庆', '璇', '钊', '炎', '于', '云', '梓', '应', '颖', '暖', '肖', '亚', '媛', '炜', '芝', '粟', '钟', '红', '梦', '悦', '纪', '芬', '京', '庭', '纯', '钰', '花', '育', '芳', '芷', '芸', '芹', '人', '品', '雄', '雅', '蓉', '惋', '立', '苏', '经', '苑', '泓', '蓓', '裕', '高', '胜', '惠', '棠', '章', '滢', '竣', '嫣', '令', '勤', '若', '曦', '嫦', '继', '雨', '雪', '仪', '绪', '绫', '铭', '园', '雯', '英', '哲', '裴', '维', '银', '瓶', '曹', '建', '曼', '国', '泽', '曾', '开', '洁', '崇', '月', '有', '愉', '紊', '锐', '蔓', '夕', '优', '会', '茜', '贝', '霞', '伟', '生', '张', '素', '蔡', '欣', '贤', '津', '锦', '大', '木', '天', '太', '紫', '甫', '振', '焱', '洲', '茹', '政', '儿', '千', '商', '歆', '荇', '午', '光', '煊', '腊', '歌', '华', '李', '敏', '子', '齐', '青', '卓', '祖', '静', '楚', '奚', '赛', '潜', '～', '束', '正', '荣', '彤', '彦', '学', '慧', '照', '杨', '浩', '彩', '轩', '八', '杭', '杰', '兰', '筱', '影', '佳', '卷', '海', '蝾', '长', '睿', '卿', '宁', '如', '妃', '善', '超', '文', '宇', '薇', '莉', '玉', '安', '冉', '妍', '美', '薏', '榕', '林', '龙', '熙', '宝', '依', '玟', '涟', '冠', '宣', '群', '厦', '润', '馨', '冬', '玮', '斯', '新', '冰', '辰', '玲', '涵', '家', '德', '妹', '莹', '方', '羽', '禾', '秀', '菁', '珂', '心', '淇', '采', '秉', '菊', '珊', '俊', '友', '秋', '富', '凌', '翎', '柏', '金', '科', '淑', '燕', '志', '诗', '姗', '进', '姝', '保', '连', '俞', '翠', '忠', '凤', '知', '旦', '巧', '韧', '旭', '可', '柯', '路', '翰', '石', '诺', '淼', 'a', '0', 'A', 'b', 'B', 'c', 'C', 'd', 'D', '1', 'e', 'E', 'f', 'F', 'g', 'G', '2', 'h', 'H', 'i', 'I', 'j', '3', 'J', 'k', 'K', 'l', 'L', '4', 'm', 'M', 'n', 'N', '5', 'o', 'O', 'p', 'P', '6', 'q', 'Q', 'r', 'R', '7', 's', 'S', 't', '8', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'x', '9', 'X', 'y', 'Y', 'z', 'Z'];
  var x = parseInt(Math.random() * virtualName.length);
  return virtualName[x];
}

/**
 *  转盘额度奖励 页面 提现额度随机小数
 */
function getVirtualDecimalAwardsWithdrawal() {
  var virtualAwards = [
    ".55", ".56", ".57", ".58", ".59", ".65", ".66", ".67", ".68", ".69", ".75", ".76", ".77",
    ".78", ".79", ".85", ".86", ".87", ".88", ".89", ".95", ".96", ".97", ".98", ".99"
  ];
  var x = parseInt(Math.random() * virtualAwards.length);
  return virtualAwards[x];
}

//用户默认图片
function getDefaultImg() {
  var defaultImgArray = [
    "00e93901213fb80ed4129e1e33d12f2eb838943c.jpg",
    "0b55b319ebc4b745639a5b76cbfc1e178a821547.jpg",
    "0df431adcbef7609ed9165562bdda3cc7dd99e65.jpg",
    "1-140Z51032590-L.jpg",
    "1-15022PZ1030-L.jpg",
    "1-15022Q022050-L.jpg",
    "1-15041G419410-L.jpg",
    "1-15041G426280-L.jpg",
    "1-15061Z641250-L.jpg",
    "1-1505291Z2380-L.jpg",
    "1-1506161F4450-L.jpg",
    "1-1506161KU80-L.jpg",
    "1-150523100Q40-L.jpg",
    "1-1502061115170-L.jpg",
    "1-1502150950440-L.jpg",
    "1-1502152046340-L.jpg",
    "1-1502152119120-L.jpg",
    "1-1504121015250-L.jpg",
    "1-1505231004350-L.jpg",
    "1-1506141435450-L.jpg",
    "1-1512211535350-L.jpg",
    "1-1602031119350-L.jpg",
    "1b4c510fd9f9d72a1f3deed4d12a2834359bbb9a.jpg",
    "2_0Z31605562464.jpg",
    "2_091Q61202Z20.jpg",
    "2_01261A30Sc1.jpg",
    "2-150Q61646440-L.jpg",
    "2-14100QIZ30-L.jpg",
    "2-14110Q349580-L.jpg",
    "2-14112G13G00-L.jpg",
    "2-14112Q434520-L.jpg",
    "2-15012Q504000-L.jpg",
    "2-1312041AF10-L.jpg",
    "2-1409151K0170-L.jpg",
    "2-1409231I2590-L.jpg",
    "2-1412221P3260-L.jpg",
    "2-1501221HK10-L.jpg",
    "2-1501231A0120-L.jpg",
    "2-1503161KP20-L.jpg",
    "2-1505091H3080-L.jpg",
    "2-140914113K20-L.jpg",
    "2-140915111P20-L.jpg",
    "2-140922155R40-L.jpg",
    "2-150120130G60-L.jpg",
    "2-1409131036390-L.jpg",
    "2-1409261551460-L.jpg",
    "2-1411121444100-L.jpg",
    "2-1411221535020-L.jpg",
    "2-1411231045150-L.jpg",
    "2-1412012001430-L.jpg",
    "2-1412031916190-L.jpg",
    "2-1412061040490-L.jpg",
    "2-1501061329220-L.jpg",
    "2-1501091649430-L.jpg",
    "2-1503021949330-L.jpg",
    "2-1505291513240-L.jpg",
    "2-1510301500420-L.jpg",
    "2f738bd4b31c8701a0db8b10217f9e2f0608ffd2.jpg",
    "4a36acaf2edda3cc1a9b81d607e93901203f92cc.jpg",
    "4afbfbedab64034f4d744cacaac379310b551dda.jpg",
    "4afbfbedab64034f9474f3e1aac379310b551d9f.jpg",
    "4b90f603738da977106a694bb451f8198618e30d.jpg",
    "5bafa40f4bfbfbed8ccfc4b67df0f736aec31f60.jpg",
    "6a600c338744ebf8911eea95dcf9d72a6059a729.jpg",
    "6a600c338744ebf834504828ddf9d72a6059a787.jpg",
    "6c224f4a20a446233bb294859d22720e0df3d7d8.jpg",
    "6f061d950a7b02086a1f011764d9f2d3562cc875.jpg",
    "08f790529822720efd419ded7fcb0a46f21fab1e.jpg",
    "8b13632762d0f703ccd96b150dfa513d2797c594.jpg",
    "8c1001e93901213fed475fb450e736d12f2e9565.jpg",
    "9d82d158ccbf6c81214e1d0fb93eb13532fa40df.jpg",
    "9e3df8dcd100baa10cb08f5f4110b912c9fc2eb2.jpg",
    "9e3df8dcd100baa176ef765c4210b912c9fc2e11.jpg",
    "9e3df8dcd100baa13540b5554210b912c9fc2ef4.jpg",
    "9f2f070828381f30feff454daf014c086f06f074.jpg",
    "9f2f070828381f301b779cc1ad014c086e06f068.jpg",
    "9f510fb30f2442a70f77c453d743ad4bd01302ce.jpg",
    "32fa828ba61ea8d378b169e6920a304e241f5844.jpg",
    "35a85edf8db1cb1397c8b5b9d854564e93584bf3.jpg",
    "35a85edf8db1cb1398f8c0dad854564e93584b62.jpg",
    "55e736d12f2eb938ea1d4304d3628535e4dd6fd7.jpg",
    "72f082025aafa40f58e521bdaf64034f78f019aa.jpg",
    "72f082025aafa40f8118d8b5af64034f79f019ff.jpg",
    "95eef01f3a292df5658e95e3ba315c6035a873f2.jpg",
    "241f95cad1c8a78679af7ae96209c93d71cf504b.jpg",
    "342ac65c10385343abccbed79513b07ecb8088c0.jpg",
    "359b033b5bb5c9ea5b4b3204d039b6003bf3b398.jpg",
    "810a19d8bc3eb135f794676ba31ea8d3fc1f448b.jpg",
    "0824ab18972bd407202121137e899e510eb3097d.jpg",
    "838ba61ea8d3fd1f24f1dd2d344e251f95ca5f28.jpg",
    "8644ebf81a4c510fa9360e7a6459252dd52aa5e4.jpg",
    "9358d109b3de9c82748f306b6a81800a18d84368.jpg",
    "78310a55b319ebc4a8ce9af98626cffc1e17161f.jpg",
    "83025aafa40f4bfbed987d40054f78f0f736185d.jpg",
    "472309f7905298221c7fc70ad2ca7bcb0b46d4af.jpg",
    "622762d0f703918fce02b360543d269758eec44d.jpg",
    "8718367adab44aedc9a1af8cb71c8701a08bfbef.jpg",
    "a2cc7cd98d1001e983cf9da5bd0e7bec55e797ad.jpg",
    "a8ec8a13632762d09cc52d15a5ec08fa503dc6a5.jpg",
    "a8ec8a13632762d096a35751a5ec08fa503dc6bb.jpg",
    "a71ea8d3fd1f4134703af8b7201f95cad0c85eee.jpg",
    "a686c9177f3e6709bb5338ac38c79f3df8dc5515.jpg",
    "a8014c086e061d95f9772ada7ef40ad162d9ca1b.jpg",
    "ac4bd11373f08202757a1f954efbfbedaa641bab.jpg",
    "adaf2edda3cc7cd9a3cd46ce3d01213fb90e91c0.jpg",
    "b7fd5266d0160924386cdf48d70735fae6cd3413.jpg",
    "b90e7bec54e736d176f19d609f504fc2d46269f3.jpg",
    "b90e7bec54e736d1902d04a29e504fc2d562695a.jpg",
    "b219ebc4b74543a96e4bc33a18178a82b80114f7.jpg",
    "b219ebc4b74543a9324b85db1a178a82b9011450.jpg",
    "c2cec3fdfc039245120bd0e88294a4c27c1e259e.jpg",
    "c75c10385343fbf2c2c76371b37eca8064388ffd.jpg",
    "cc11728b4710b9120e2a3f1ac5fdfc039345226f.jpg",
    "cefc1e178a82b901b014f2d4768da9773812ef98.jpg",
    "cf1b9d16fdfaaf51355d7151895494eef11f7aa6.jpg",
    "d31b0ef41bd5ad6e0ef6ac0e87cb39dbb7fd3cc3.jpg",
    "d52a2834349b033b231b10ba11ce36d3d539bd3b.jpg",
    "d52a2834349b033b1731cd3d10ce36d3d439bd9f.jpg",
    "d058ccbf6c81800ab10541eab73533fa838b4776.jpg",
    "d1160924ab18972bd1c3eda7e5cd7b899f510ae5.jpg",
    "dbb44aed2e738bd45ad7a359a58b87d6267ff9e0.jpg",
    "dbb44aed2e738bd475d8c026a58b87d6277ff928.jpg",
    "dbb44aed2e738bd47415c346a78b87d6277ff995.jpg",
    "f703738da97739124564bc97fe198618377ae282.jpg",
    "f9198618367adab40be1e68a8ed4b31c8601e4c2.jpg",
    "fcfaaf51f3deb48f0c6f9828f61f3a292cf578c5.jpg",
    "fcfaaf51f3deb48fc87cdec9f41f3a292df5788b.jpg",
    "003caff3fc432116e70637a4e72a0e6f.jpg",
    "0069d04c17b28e3613cb5ffc2c5fd1c7.jpg",
    "00adc71d4386ee00cd6cf91ce76a7e6c.jpg",
    "00f63d8718cae90f5f28b7705535fcea.jpg",
    "06fd7f2b2108a9673a45d640945701bf.jpg",
    "0cc623c89ac97959de53fd33d2085a2a.jpg",
    "0e689ef49e51092465d3f49bd45fdc23.jpg",
    "11cd13cc12cc161f82d5fed035402973.jpg",
    "127f1c4004fd233fa630e115758cfa4d.jpg",
    "1393298880b21389a5ea2cefb557295e.jpg",
    "1504dc33a158ac3c3132d7bb37bd00e6.jpg",
    "15a638cb5d4b64f4aef3ed3fe735f236.jpg",
    "15b30b7a6ea0ab631fd6e091ff114ebb.jpg",
    "1f2b9f534bf838e631219123b7d9dfca.jpg",
    "20febae243f5a4c59e3f414cf2113467.jpg",
    "289c2e08d1de909475cf6f4a23c76346.jpg",
    "28eed47ce21be744ef5b12af152c00a5.jpg",
    "2a6eb172822bd8e5dd046945f94f17cd.jpg",
    "2fdc20f271ea9b21ee1ac6c518bbd927.jpg",
    "340ed9c8434c3eaa8bbf9bfb527b7161.jpg",
    "3fa1a3248d6a1ee87723bc62ccd12cce.jpg",
    "40fd31fb06418fc80d1e80b7e417977e.jpg",
    "414dd2f8107e5b2c435ce7ef41afa527.jpg",
    "442e5d5ef1a77b46e76e799c46c1c0a3.jpg",
    "46d51549d2455f86ab693963ff307a3f.jpg",
    "4b30c1011ee9742175e344a54be2e691.jpg",
    "4cc6aa5e2cb51d290d8340277431008f.jpg",
    "4fe423208f1ae50064aa1dceabdd76c2.jpg",
    "500288c814c44f6d24945b905a40d94f.jpg",
    "51f00b0f317e2f67e599516c3f6544d0.jpg",
    "5668a95f3112335c9b3eb0b97fab5184.jpg",
    "57db3d55de4b6fe6af00a1b9b020ec30.jpg",
    "58bf276f7dafc707cc742e3ec7375be1.jpg",
    "5c1da81c8da33dcad27def5c1609239b.jpg",
    "5e6d5ff09829cafdd8e32398578ca3c7.jpg",
    "627a8f19930f0dadae2b40645f1ab6ce.jpg",
    "6dc2618a53e97b233923c2a37ff0a696.jpg",
    "6ee370f811ea10bc8976899982417829.jpg",
    "6f6272901407bec142b18619626c9bfe.jpg",
    "6f718073167e8756997e631619fca2e4.jpg",
    "7349107275d39f9c68c65c6479a4016c.jpg",
    "79e53fe167e5006d93dd1a5447083080.jpg",
    "86ab3a2f55e8997598c53c04e6f62b88.jpg",
    "8718367adab44aed591d1ac0b41c8701a18bfb47.jpg",
    "885c41f764890c747581fcb04801aed8.jpg",
    "88eb6c99665f95af4f38f5ce84fc3db7.jpg",
    "89b9b1e03dc53d2b513892829d2b745d.jpg",
    "8e045f8a5d79ab22529272a3be793a8f.jpg",
    "8e1392a6832ba1eaf1949d340870d2b7.jpg",
    "8f65ddc0dd6a70d347fd34492340906e.jpg",
    "950837696c511141b469e90c3c549588.jpg",
    "9ba94460ddb6bb2472bbe3f49b664f1a.jpg",
    "9bc9b4ca5aa89cf1b06a48625dbd7299.jpg",
    "9e338e2c2dbff34ab2d9f196483284c1.jpg",
    "a0e89276879cbbe9c8573f313ae81507.jpg",
    "a9baa184faeebdfed2f9fb680ad974dd.jpg",
    "aacd354fd90c5d85a0f4fa67ba92b511.jpg",
    "b15d8bf6e2d8cf446bb1e23c539f72b1.jpg",
    "b26e371b0b6865ce32bd071233924ec2.jpg",
    "b27372786191fa8d1eb0b70657036142.jpg",
    "b6bfaa56f92972e59164f339d5b9c0e9.jpg",
    "b745f68f8f6ead40f2853892bbf24604.jpg",
    "bb49858913f69df822e5ee605858945a.jpg",
    "c170f29d4c29a4b5d6cc1c44cc678ad3.jpg",
    "c1d8e42282cf10a5dfac2864facfb211.jpg",
    "c4de9c499b42c99f34cfc42daa4b255a.jpg",
    "c697c6a5cc6fa9e86d7da4378fb8a01a.jpg",
    "c78d0ab1589983b26887c47908bc65c8.jpg",
    "cdecf61d2d8d2ec01816e65785411ce9.jpg",
    "cf0d4e20f5eb53c3940b6024267d61c4.jpg",
    "d46852dbe54a5c1c897fd71522aa6622.jpg",
    "dad61fc72a28350da2afa3875a3d5b01.jpg",
    "dd57601b66c24a3776f024b5ad3fb12a.jpg",
    "e031b0944ecb30262c73622274556755.jpg",
    "e3e911853614cfa5d6b31d54109992e7.jpg",
    "e768285b6e9b24b1d8e01bb5694d47a9.jpg",
    "e8b4caffa8c678c85ca50d23e3f72650.jpg",
    "eb6cad5e01bca43f44d7d936c72c61e1.jpg",
    "eebbdeee8ead64c721310f0c593202f0.jpg",
    "ef3db4a14db7d7e7101a30e790052586.jpg",
    "f037cedd5dc88a8193fcea91d4b17968.jpg",
    "f195aa1c86286b16f23ba4478cd5692b.jpg",
    "f246e4f9962c59f98879d625d270b156.jpg",
    "f65e0fc4fdb1872f8c7cc5cd79164c13.jpg",
    "f8995c081fbed9858cf12791c5722221.jpg",
    "fa1cd951c695c89745499907bde23a84.jpg",
    "fed2034f6b0be580bb384e98d959631e.jpg",
    "ffcebdfb695fe0d6b739ba5aacfb2d0d.jpg",
    "u=1454263356,41204913&fm=23&gp=0.jpg",
    "u=1782171325,1283049313&fm=23&gp=0.jpg",
    "u=2420669275,1149109575&fm=23&gp=0.jpg",
    "u=2550477077,794252701&fm=23&gp=0.jpg",
    "u=4210208584,451612848&fm=23&gp=0.jpg",
    "v.jpg"
  ];
  var x = parseInt(Math.random() * defaultImgArray.length);
  return defaultImgArray[x];
}

function getBubbleRemindData() {
  var bubble = {};
  var content = ['通过赚钱任务赚了', '分享美衣获得', '获得提现额度'];
  var money = ['20.58', '34.67', '34.49', '18.15', '50.81', '13.93', '55.82', '20.31', '44.48', '32.39', '54.83', '14.05', '34.07', '43.29', '48.66', '45.44', '44.33', '27.22', '37.65', '49.05', '5.29', '29.21', '32.33', '29.89', '5.95', '2.55', '16.20', '52.60', '8.39', '47.93', '48.68', '40.36', '26.52', '52.25', '38.49', '8.50', '14.34', '51.85', '28.35', '40.10', '53.78', '22.37', '44.91', '12.75', '4.51', '18.43', '33.50', '20.39', '11.72', '23.14', '52.36', '38.08', '37.10', '29.78', '43.57', '16.63', '2.28', '45.88', '16.14', '55.96', '37.35', '15.08', '53.51', '2.72', '24.39', '18.13', '26.83', '55.89', '53.98', '40.25', '47.78', '49.20', '12.83', '4.72', '9.13', '33.16', '2.04', '33.85', '28.38', '39.75', '54.15', '31.81', '7.66', '42.72', '49.40', '23.73', '2.55', '4.01', '54.88', '16.85', '47.56', '15.79', '38.54', '18.64', '17.07', '20.83', '38.31', '28.28', '26.63', '8.90'];
  var x = parseInt(Math.random() * content.length);
  var i = parseInt(Math.random() * money.length);
  bubble["user_name"] = this.getVirtualName() + "***" + this.getVirtualName();
  bubble["user_money"] = money[i];
  bubble["user_content"] = content[x];
  bubble["user_detail"] = x == 1 ? '元额外奖励' : '元';
  bubble["user_pic"] = config.Upyun + "defaultcommentimage/" + this.getDefaultImg();
  return bubble;
}
//赚钱任务分享统计
function task_share_Statistics(key, type, tab_type) {
  var token = "";
  if (app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }
  var dataUrl = config.Host + "record/add?" + config.Version + "&token=" + token + '&key=' + key + '&type=' + type + '&tab_type=' + tab_type;

  var tongji_url = "default";
  var tongji_parameter = "default"
  var mUrl = dataUrl + "";

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

  var url = Md5_httpUrl(dataUrl);
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function(res) {
      console.log("分享成功");
      app.mtj.trackEvent('i_f_success_count', {
        i_f_name: tongji_url,
      });

    },
    fail: function(error) {
      console.log("分享失败");
      app.mtj.trackEvent('i_f_error_count', {
        i_f_name: tongji_url,
        // i_f_from: "10",
      });
    }
  })
}

/**
 * 返回到赚钱
 * defPath 赚钱页面相对路劲
 */
function backToSignPager(defPath) {
  var pages = getCurrentPages();
  for (var i = 1; i < pages.length; i++) {
    var prevPage = pages[pages.length - (i + 1)]; //上一个页面
    if (prevPage.route == "pages/sign/sign") {
      wx.navigateBack({
        delta: i
      });
      return;
    }
  }
  wx.redirectTo({
    url: defPath,
  });
}

// 超过5层时，跳转销毁
function navigateTo(path) {
  var pages = getCurrentPages();
  if (pages.length >= 5) {
    wx.redirectTo({
      url: path,
    })
  } else {
    wx.navigateTo({
      url: path,
    })
  }
}

/**
 * 用户绑定上下级关系
 * user_id 上级用户ID
 * token 当前用户token
 */
function bindRelationship(parent_id, token) {
  // if (parent_id&&token){
  //   var dataUrl = config.Host + "user/setReferee?token=" + token + '&parent_id=' + parent_id + config.Version;
  //   dataUrl = encodeURI(dataUrl);
  //   var MD5url = Md5_httpUrl(dataUrl);
  //   wx.request({
  //     url: MD5url,
  //     method: 'GET',
  //     header: {
  //       'content-type': 'application/json;charset=utf-8' // 默认值
  //     },
  //     success: function (res) {
  //       console.log(url);
  //       console.log(res.data);
  //       console.log("绑定成功");
  //     }
  //   });
  // }
}

/**
 * 获取用户是否有交易记录
 */
function get_TrancactionRecord(callBack) {
  var Transaction_record = false;
  if (app.globalData.user != null) {
    var token = app.globalData.user.userToken;
    var dataUrl = config.Host + "order/getNewUserOrder" +
      "?token=" + token +
      config.Version;

    this.http(dataUrl, function(data) {

      if (data.tri == 1) {
        var tri = 0; // 0不提示 1提示
        callBack(tri);
      } else {
        if (data.count != 0) { //有交易记录
          Transaction_record = true;
          callBack(Transaction_record);
        } else { //没有交易记录      
          Transaction_record = false;
          callBack(Transaction_record);
        }
      }

    })
  } else {
    callBack(Transaction_record);
  }
}
/**
 * 用户首次疯抢完且未有单独购买成交订单48小时内访问小程序
 */
function get_userOrderRoll48Hours(callBack) {
  var userOrderRoll48Hours = 0; // 0不提示 1提示
  if (app.globalData.user != null) {
    var token = app.globalData.user.userToken;
    var dataUrl = config.Host + "order/userOrderRoll48Hours" +
      "?token=" + token +
      config.Version;

    this.http(dataUrl, function(data) {

      if (data.tri == 1) {
        userOrderRoll48Hours = 1;
        callBack(userOrderRoll48Hours);
      } else {
        userOrderRoll48Hours = 0;
        callBack(userOrderRoll48Hours);
      }
    })
  } else {
    callBack(userOrderRoll48Hours);
  }
}

/**
 * 获取是否是第三次抽奖
 */
function get_LuckDraw(callBack) {
  var token = app.globalData.user.userToken;
  var dataUrl = config.Host + "order/newUserTimeDiscount" +
    "?" + config.Version + '&token=' + token;

  this.http(dataUrl, function(data) {

    if (data.status == 1) {
      callBack(true);
    } else {
      callBack(false);
    }
  })
}
/**
 * 获取申请发货的微信号
 */
function get_WxhNumber(callBack) {
  var token = app.globalData.user.userToken;
  var dataUrl = config.Host + "order/queryWxhNumber" +
    "?" + config.Version + '&token=' + token;

  this.http(dataUrl, function(data) {

    if (data.status == 1) {
      callBack(data);
    } else {
      callBack(data);
    }
  })
}
/**
 * 获取道具卡的数量
 */
function get_daojuNumber(order_code,callBack) {
  var token = app.globalData.user.userToken;
  var dataUrl = config.Host + "userVipCard/selPropCardNum" +
    "?" + config.Version + '&token=' + token + '&order_code=' + order_code;

  this.http(dataUrl, function (data) {

    if (data.status == 1) {
      callBack(data);
    } else {
      callBack(data);
    }
  })
}
/**
 * 获取用户是否是会员
 */
function get_vip(callBack) {

  var token = '';
  if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
    token = app.globalData.user.userToken;
  }
  var dataUrl = config.Host + "userVipCard/userIsVip" +
    "?" + config.Version + '&token=' + token;

  this.http(dataUrl, function(data) {

    if (data.status == 1) {
      callBack(data);
    } else {
      callBack(data);
    }
  })
}
function get_vip2(callBack) {

  var token = '';
  if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
    token = app.globalData.user.userToken;
  }
  var dataUrl = config.Host + "userVipCard/userIsVip2" +
    "?" + config.Version + '&token=' + token;

  this.http(dataUrl, function (data) {

    if (data.status == 1) {
      callBack(data);
    } else {
      callBack(data);
    }
  })
}
//如果有79的免费领自动跳转到免费领列表2
function get_vip_tofreelingPage2(){
  this.get_vip(function(data){
    app.globalData.first_diamond = data.first_diamond != undefined ? data.first_diamond : 0;
    
    if (app.globalData.first_diamond == 1){
      setTimeout(function () {
        
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];
        if (currPage.route == 'pages/shouye/redHongBao')
        {
          return;
        }

        wx.navigateTo({
          url: "/pages/shouye/redHongBao?shouYePage=" + "ThreePage"
        })
      }, 100);
    }
  })
}

/**
 * 获取用户会员信息 会员免费领
 */
function get_VipUserIfon(shopcode, t, page3, callBack) {
  var token = '';
  if (app.globalData.user != undefined && app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }

  var dataUrl = config.Host + "userVipCard/vipBuyShopInfo" +
    "?" + config.Version + '&token=' + token + "&shop_code=" + shopcode + '&t=' + t + '&page3=' + page3;

  this.http(dataUrl, function(data) {

    if (data.status == 1) {
      callBack(data);
    } else {
      callBack(data);
    }
  })
}
/**
 * 获取用户是否是第一次拼团疯抢
 */
function getOrderStatus(callBack) {
  var token = "";
  if (app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }
  var oldurl = config.Host + 'order/getOrderStatus?' + config.Version + "&token=" + token;
  this.http(oldurl, function(data) {
    callBack(data);
  });
}

/**
 * 获取是否有拼团失败的订单
 */
function getFightFailOrder(callBack) {
  var token = "";
  if (app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }
  var oldurl = config.Host + 'order/queryRollFail?' + config.Version + "&token=" + token;
  this.http(oldurl, function(data) {
    callBack(data);
  });
}
/**
 * 添加喜欢 取消喜欢
 */
function handle_shoplike(shop_likeurl, shopcode, callBack) {
  var token = "";
  if (app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }
  var oldurl = config.Host + shop_likeurl + config.Version + "&token=" + token + '&shop_code=' + shopcode;
  this.http(oldurl, function(data) {
    callBack(data);
  });
}
/**
 * 获取首页2、首页3的开关
 */
function get_shouyeSwitch(advent_channel, callBack) {

  var dataUrl = config.Host + "cfg/config_switch" +
    "?" + config.Version;
  if (advent_channel != undefined && advent_channel.length > 0) {
    dataUrl = config.Host + "cfg/config_switch" +
      "?" + '&version=V1.31&channel=' + advent_channel + '&app_id=wxc211367f634ba3e9';
  }

  this.http(dataUrl, function(data) {
    // homePage2to3 = 1 是首页2 0是首页3
    if (data.status == 1) {
      callBack(data.data);
    } else {
      callBack(data.data);
    }
  })
}
/***
 * 提交用户档案
 */
function submit_personalRecord(personData, callBack) {
  var token = "";
  if (app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }

  var dataUrl = config.Host + "/userFiles/upload" +
    "?" + config.Version + '&token=' + token + '&jsonData=' + personData;

  this.http(dataUrl, function(data) {
    if (data.status == 1) {
      callBack(data);
    } else {
      callBack(data);
    }
  })
}

/***
 * 用户投诉
 * */
function submit_Complaint(personData, callBack) {
  var token = "";
  if (app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }

  var dataUrl = config.Host + "/logub/up" +
    "?" + config.Version + '&token=' + token + '&data=' + personData + '&uuid=123456' + '&type=5000';
  
  this.http(dataUrl, function (data) {
    if (data.status == 1) {
      callBack(data);
    } else {
      callBack(data);
    }
  })
}

/**
 * 获取用户个人二维码
 */
function get_qrcodehttp(page, callBack) {
  var token = "";
  if (app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }
  var oldurl = config.Host + "wxcxPush/createQRCode?" + config.Version + "&token=" + token + '&page=' + page;
  this.http(oldurl, function(data) {
    callBack(data);
  });
}

/**
 * 获取用户邀请好友状态
 */
function get_selInviteInfo(callBack)
{
  var token = "";
  if (app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }
  var oldurl = config.Host + "invite/selInviteInfo?" + config.Version + "&token=" + token;
  this.http(oldurl, function (data) {
    callBack(data);
  });
}

/**
 * 新用户是否有第一次虚拟抽奖
 */
function newuser_luckdraw_query(callBack) {
  var token = "";
  if (app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }
  var oldurl = config.Host + "wallet/judgeUserFirstIntoRaffle?" + config.Version + "&token=" + token;
  this.http(oldurl, function (data) {
    callBack(data);
  });
}

/**
 * 新用户第一次虚拟抽奖同步数据
 */
function newuser_luckdraw(money,callBack) {
  var token = "";
  if (app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }
  var oldurl = config.Host + "wallet/synchronizationUnLoginUserRaffle?" + config.Version + "&token=" + token + "&money=" + money;
  this.http(oldurl, function (data) {
    callBack(data);
  });
}

/**
 * 订阅消息
 */
function handleTempl_http(ids,callBack) {
  var token = "";
  if (app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }
  var oldurl = config.Host + "/wxcxPush/addUserTemplateId?" + config.Version + "&token=" + token + "&template_id=" + ids;
  this.http(oldurl, function (data) {
    callBack(data);
  });
}

//获取用户手机号
function getPhone_http(medata,callBack){
  var token = "";
  if (app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }
  var oldurl = config.Host + "/user/bindPhoneNumber?" + config.Version + "&token=" + token + '&code=' + medata.code + '&encryptedData=' + medata.encryptedData + '&iv=' + medata.iv;

  this.http(oldurl, function (data) {
    callBack(data);
  });
}
/**
 * 物流信息
 */
function logistic_http(logistic_order, callBack) {
  var token = "";
  if (app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }
  var oldurl = config.Host + "/order/expQuery?" + config.Version + "&token=" + token + "&nu=" + logistic_order;
  this.http(oldurl, function (data) {
    callBack(data);
  });
}
/**
 * 查询用户信息
 */
function query_userinfo(callBack){
  var token = "";
  if (app.globalData.user != null) {
    token = app.globalData.user.userToken;
  }
  var oldurl = config.Host + "/user/query_userinfo?" + config.Version + "&token=" + token;
  this.http(oldurl, function (data) {
    callBack(data);
  });
}
//自动登录
function autoLogin(logCount, callBack) {
  var that = this;
  var loginfailYiFuShow = false;
  var login_discribution = "";
  var login_buttontitle = "";
  var loginCount = logCount;
  var fun = callBack;
  wx.getSetting({
    success: res => {
      // 已经授权
      if (res.authSetting['scope.userInfo']) {
        loginCount++;
        app.New_userlogin(function(data) {
          wx.hideLoading();
          if (data == true) { //登录成功
            callBack(loginfailYiFuShow, login_discribution, login_buttontitle, 1);
          } else { //登录失败
            if (loginCount <= 5) {
              that.autoLogin(loginCount, fun);
            } else if (loginCount <= 7) {

              loginfailYiFuShow = true;
              login_discribution = "请尝试再次登录。";
              login_buttontitle = "再次登录";
              callBack(loginfailYiFuShow, login_discribution, login_buttontitle, loginCount);

            } else {

              loginfailYiFuShow = true;
              login_discribution = "系统繁忙，请稍后再试。";
              callBack(loginfailYiFuShow, login_discribution, login_buttontitle, loginCount);
            }
          }
        });
      }
    }
  })
}
//计算抵扣后价格
function get_discountPrice(before_price, shop_deduction, reduceMoney, max_vipType) {
  var after_price = before_price * 1;
  if (Number(shop_deduction) > 0 && Number(shop_deduction * after_price) <= Number(reduceMoney)) {
    if (max_vipType == 6) //至尊会员打95折
    {
      after_price = after_price * (1 - shop_deduction - 0.05);
    } else {
      after_price = after_price * (1 - shop_deduction);
    }
  } else {

    if (max_vipType == 6) //至尊会员打95折
    {
      after_price = Number(after_price * 0.95 - reduceMoney) > 0 ? (after_price * 0.95 - reduceMoney) : 0.0;
    } else {
      after_price = Number(after_price - reduceMoney) > 0 ? (after_price - reduceMoney) : 0.0;
    }
  }

  return after_price.toFixed(1);
}

/**
 * 生成用户个人二维码
 */
function get_QRcode(codepage) {

  var user_id = (app.globalData.user != null && app.globalData.user != undefined) ? app.globalData.user.user_id : '';

  var str = user_id + ',' + 'ThreePage' + ',' + 'QRcode';

  var scene = encodeURIComponent(str);

  var imgSrc = config.Host + "wxcxPush/getQRCode?" + config.Version + "&scene=" + scene + '&page=' + codepage;

  console.log('imgSrc=' + imgSrc);
  wx.downloadFile({
    url: imgSrc,
    method: 'GET',
    header: {
      'content-type': 'image/jpg' // 默认值
    },
    success: function(res) {
      console.log(res);
      //图片保存到本地
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: function(data) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function(err) {
          console.log(err);
          wx.showToast({
            title: '保存失败',
            icon: 'success',
            duration: 2000
          })
        },
        complete(res) {
          console.log(res);
        }
      })
    }
  })
}

//生成合成图片
function getCanvasPictiure(canvasId, imagesrc, price,shareType, callBack) {

  const wxGetImageInfo = wx.getImageInfo({
    src: imagesrc,
    success(res) {
      //背景图
      const ctx = wx.createCanvasContext(canvasId, this)
      ctx.drawImage(res.path, 0, 0, 380, 380)

      var that = this;
      wx.getImageInfo({
        src: config.Upyun + 'small-iconImages/heboImg/shareCanvas_price.png',
        success(res) {
          //二维码
          ctx.drawImage(res.path, 0, 400 - 190, 153 * 0.8, 96)

          ctx.setFillStyle('#fff') // 文字颜色：黑色
          ctx.font = 'normal bold 19px sans-seril'
          if (shareType == '拼团分享')
          {
            ctx.fillText('拼团特价', 15, 250)
          }else{
            ctx.fillText('今日特价', 15, 250)
          }
          
          ctx.setFillStyle('#fff') // 文字颜色：黑色
          ctx.font = 'normal bold 20px sans-seril'
          ctx.fillText('￥', 10, 292)

          ctx.setFillStyle('#fff') // 文字颜色：黑色
          ctx.font = 'normal bold 40px sans-seril'
          ctx.fillText(price, 28, 295)

          ctx.draw(false, setTimeout(function() {
            wx.canvasToTempFilePath({
              canvasId: canvasId,
              fileType: 'jpg',
              success(res) {
                console.log(res.tempFilePath)
                callBack(res.tempFilePath);
                console.log('tempFilePath=%%%%%%%%%%%%%%%%%%10' + res.errMsg);
              },
              fail(res) {
                console.log('res=' + res);
                callBack(imagesrc);
                console.log('tempFilePath=%%%%%%%%%%%%%%%%%%100' + res.errMsg);
              }
            }, this)
          }, 1000))
          ctx.setGlobalAlpha(0);

          // that.saveCanvasQRcode(canvasId, callBack);
        }
      })
    }
  })
}
//合成新的图片
function saveCanvasQRcode(canvasId, callBack) {
  var that = this;
  wx.canvasToTempFilePath({
    canvasId: canvasId,
    success(res) {
      console.log(res.tempFilePath)

      callBack(res.tempFilePath);
    },
    fail(res) {
      console.log('res=' + res);
    }
  })
}

function getDateWeek(sDate) {
  var dt = new Date(sDate.replace(/-/g, '/'));
  var a = ['7', '1', '2', '3', '4', '5', '6'];
  return a[dt.getDay()];

}

module.exports = {
  Md5_httpUrl: Md5_httpUrl,
  httpNeedLogin: httpNeedLogin,
  http: http,
  httpUpyunJson: httpUpyunJson,
  httpAddressJson: httpAddressJson,
  get_discountHttp: get_discountHttp,
  httpPushFormId: httpPushFormId,
  formatTime: formatTime,
  getMyDate: getMyDate,
  getVirtualName: getVirtualName,
  getVirtualDecimalAwardsWithdrawal: getVirtualDecimalAwardsWithdrawal,
  getDefaultImg: getDefaultImg,
  // toAuthorizeWx: toAuthorizeWx,
  isToday: isToday,
  task_share_Statistics: task_share_Statistics,
  backToSignPager: backToSignPager,
  navigateTo: navigateTo,
  bindRelationship: bindRelationship,
  getBubbleRemindData: getBubbleRemindData,
  get_TrancactionRecord: get_TrancactionRecord,
  get_shouyeSwitch: get_shouyeSwitch,
  get_LuckDraw: get_LuckDraw,
  get_VipUserIfon: get_VipUserIfon,
  get_vip: get_vip,
  get_vip2: get_vip2,
  get_WxhNumber: get_WxhNumber,
  autoLogin: autoLogin,
  getOrderStatus: getOrderStatus,
  get_discountPrice: get_discountPrice,
  getFightFailOrder: getFightFailOrder,
  handle_shoplike: handle_shoplike,
  get_QRcode: get_QRcode,
  get_qrcodehttp: get_qrcodehttp,
  submit_personalRecord: submit_personalRecord,
  get_userOrderRoll48Hours: get_userOrderRoll48Hours,
  getDateWeek: getDateWeek,
  getCanvasPictiure: getCanvasPictiure,
  get_selInviteInfo: get_selInviteInfo,
  newuser_luckdraw: newuser_luckdraw,
  handleTempl_http: handleTempl_http,
  get_daojuNumber: get_daojuNumber,
  get_vip_tofreelingPage2: get_vip_tofreelingPage2,
  submit_Complaint: submit_Complaint,
  logistic_http: logistic_http,
  newuser_luckdraw_query: newuser_luckdraw_query,
  getPhone_http: getPhone_http,
  query_userinfo: query_userinfo
}