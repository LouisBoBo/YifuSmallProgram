import config from 'config';

import {
  ToastPannel
} from '/common/toastTest/toastTest';
const mtjwxsdk = require("./utils/mtj-wx-sdk.js");
var mUrl = "https://www.52yifu.wang/";
var MD5 = require('utils/md5.js');

var base64_func = require('utils/base64.js');
var WxNotificationCenter = require('utils/WxNotificationCenter.js');
var loginStatus = false;
var parent_id;
var share_Blacklist = false;
var WUSHIredPackageShow = false
var showThirtyEd = false;
var JieliHongbaoShowEd = false;
var isFightSuccess = false;
var showSub = true;
var homePagetoSign = true;

// var showSignPage;//赚钱任务页是否完整展示

App({
  ToastPannel,
  data: {

  },

  signData: {
    current_date: "", //用来判断是否是新手任务第一天 当是newbie01的时候是新手任务第一天 

    NotLoginSignedList: {}

  },



  //最新的
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //清空赚钱分钟相关数据
    wx.setStorageSync("SIGN-TASK-MM", "");
    wx.setStorageSync("MIN_BEGIN_MIN_INDEX", "");
    wx.setStorageSync("MIN_BEGIN_MIN_ETime", "");
    wx.setStorageSync("countdownUseED", false)

    this.shop_type_tagData();
    this.oneYuan_httpData();
    this.getSystemInfo();
    this.getSwitch() //获取开关
  },

  launchActive:function(){
    //启动时获取的信息
    var object = wx.getLaunchOptionsSync();
    //获取设备相关信息
    var device = wx.getSystemInfoSync();
    //获取WIFI
    wx.startWifi({
      success(res) {
        console.log(res.errMsg)
      }
    })
    //获取网络状态
    wx.onNetworkStatusChange(function (res) {
      console.log(res.isConnected)
      console.log(res.networkType)
    })
    var device1 = wx.onBLEPeripheralConnectionStateChanged();
    wx.onBLEPeripheralConnectionStateChanged(function (res) {
      console.log('res===============', res);
    })

    console.log('object=', object);
    console.log('device=', device);
    console.log('okokok', object);
  },

  //商品属性分类标签
  shop_type_tagData: function() {
    var that = this
    var basesData = wx.getStorageSync("shop_tag_basedata");
    if (basesData.data) {
      var ktype_tag_data = wx.getStorageSync("type_tag_data");
      var ktag_data = wx.getStorageSync("tag_data");
      var ktype_data = wx.getStorageSync("type_data");
      var ksupp_label_data = wx.getStorageSync("supp_label_data");
      var kfriend_circle_tag_data = wx.getStorageSync("friend_circle_tag_data");
    }
    var newurl = config.Host + 'shop/queryTA?' + config.Version + '&bool=true' + '&type_data=' + ktype_data + '&tag_data=' + ktag_data + '&type_tag_data=' + ktype_tag_data + '&supp_label_data=' + ksupp_label_data + '&friend_circle_tag_data=' + kfriend_circle_tag_data;




    // + '&type_data=' + ktype_data + '&tag_data=' + ktag_data + '&type_tag_data=' + ktype_tag_data + '&supp_label_data=' + ksupp_label_data + '&friend_circle_tag_data=' + kfriend_circle_tag_data;

    var url = this.Md5_httpUrl(newurl);

    if (!basesData.data) { //如果本地数据库没有，就去json拿完整数据
      url = config.Upyun + "shopTA/ta.json"

    }

    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = url;

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

    console.log('typeurl=', url);

    wx.request({
      url: url,
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      fail: function(error) {
        that.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      },
      success: function(res) {

        that.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });

        if (res.data.status == 1) {

          //shopGroupList单独处理
          that.getShopGroupList()
          // if (res.data.shopGroupList.length) {
          //   wx.setStorageSync("shopGroupList", res.data.shopGroupList)
          // }

          if (!basesData.data) { //如果是第一次，直接保存数据库和对比的data

            wx.setStorageSync("shop_tag_basedata", res)

            if (res.data.type_data.length) {
              wx.setStorageSync("type_data", res.data.type_data)
            }
            if (res.data.tag_data.length) {
              wx.setStorageSync("tag_data", res.data.tag_data)
            }
            if (res.data.type_tag_data.length) {
              wx.setStorageSync("type_tag_data", res.data.type_tag_data)
            }
            if (res.data.supp_label_data.length) {
              wx.setStorageSync("supp_label_data", res.data.supp_label_data)
            }
            if (res.data.friend_circle_tag_data.length) {
              wx.setStorageSync("friend_circle_tag_data", res.data.friend_circle_tag_data)
            }

            //发送缓存数据完成的通知
            setTimeout(function() {
              WxNotificationCenter.postNotificationName("shopNotificationItem1Name", "shopfinish");
            }, 2000);

            return
          }
          //如果本地以后数据库，需要取出各个本地的data逐一对比。如果有变动，需要获取最新的数据后保存最新的data,
          //然后对相应的本地数据库进行修改，最后重新保存本地数据库
          //JSON处理
          if (res.data.type_data != wx.getStorageSync("type_data")) {
            that.saveDataData(res, "shop_type", "type_data")
          }
          // if (res.data.type_data.length) {
          //   wx.setStorageSync("type_data", res.data.type_data)
          // }

          if (res.data.tag_data != wx.getStorageSync("tag_data")) {
            that.saveDataData(res, "shop_tag", "tag_data")
          }
          // if (res.data.tag_data.length) {
          //   wx.setStorageSync("tag_data", res.data.tag_data)
          // }


          if (res.data.type_tag_data != wx.getStorageSync("type_tag_data")) {
            that.saveDataData(res, "type_tag", "type_tag_data")
          }
          // if (res.data.type_tag_data.length) {
          //   wx.setStorageSync("type_tag_data", res.data.type_tag_data)
          // }

          if (res.data.supp_label_data != wx.getStorageSync("supp_label_data")) {
            that.saveDataData(res, "supp_label", "supp_label_data")
          }
          // if (res.data.supp_label_data.length) {
          //   wx.setStorageSync("supp_label_data", res.data.supp_label_data)
          // }


          if (res.data.friend_circle_tag_data != wx.getStorageSync("friend_circle_tag_data")) {
            that.saveDataData(res, "friend_circle_tag", "friend_circle_tag_data")
          }
          // if (res.data.friend_circle_tag_data.length) {
          //   wx.setStorageSync("friend_circle_tag_data", res.data.friend_circle_tag_data)
          // }
          // if (res.data.shopGroupList.length) {
          //   wx.setStorageSync("shopGroupList", res.data.shopGroupList)
          // }

        }
      }
    })
  },

  saveDataData: function(res, dataName, dataNmaeData) {
    var that = this
    var url;
    url = config.Upyun + "shopTA/" + dataName + ".json"
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
    // url = that.Md5_httpUrl(url);
    wx.request({
      url: url,
      data: {
        // x: '',
        // y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      fail: function(res) {
        that.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      },
      success: function(JSonRes) {

        that.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });

        // while (!wx.getStorageSync("TAG_DATA_SAVE_ED")) {
        //   continue

        // setTimeout(function () {

        //修改对应标签的值并重新保存
        var oldDataData = wx.getStorageSync("shop_tag_basedata");

        switch (dataNmaeData) {
          case "type_data":
            oldDataData.data.shop_type = JSonRes.data;
            wx.setStorageSync(dataNmaeData, res.data.type_data) //重新保存对比标签

            break

          case "tag_data":
            oldDataData.data.shop_tag = JSonRes.data;
            wx.setStorageSync(dataNmaeData, res.data.tag_data) //重新保存对比标签

            break
          case "type_tag_data":
            oldDataData.data.type_tag = JSonRes.data;
            wx.setStorageSync(dataNmaeData, res.data.type_tag_data) //重新保存对比标签

            break
          case "supp_label_data":
            oldDataData.data.supp_label = JSonRes.data;
            wx.setStorageSync(dataNmaeData, res.data.supp_label_data) //重新保存对比标签

            break

          case "friend_circle_tag_data":
            oldDataData.data.friend_circle_tag = JSonRes.data;
            wx.setStorageSync(dataNmaeData, res.data.friend_circle_tag_data) //重新保存对比标签

            break
        }

        // oldDataData.dataName = JSonRes.data;
        wx.setStorageSync("shop_tag_basedata", oldDataData)
        console.log("数据库保存完毕" + dataName)


        if ("shop_type" == dataName) {
          //发送缓存数据完成的通知
          WxNotificationCenter.postNotificationName("shopNotificationItem1Name", "shopfinish");
        }

        // }, 2000)

        // }



      }
    })

  },
  getShopGroupList: function() {
    var that = this
    var url;
    url = config.Upyun + "shopTA/shopGroupList.json"
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
    // url = that.Md5_httpUrl(url);
    wx.request({
      url: url,
      data: {
        // x: '',
        // y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data) {
          wx.setStorageSync("shopGroupList", res.data)
        }
        that.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });

      },
      fail: function(error) {
        that.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }

    })
  },

  //获取赚钱页是否隐藏
  moneyPageisHide: function(callback) {
    var that = this
    var url = config.Host + 'cfg/getlandingPage8778?' + config.Version;
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
    var newurl = this.Md5_httpUrl(url);
    console.log(newurl);

    wx.request({
      url: newurl,
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data.status == 1) {
          //data 0不隐藏 1隐藏
          that.globalData.moneyPageHide = res.data.data;
          callback(res.data.data);
        }
        that.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
      },
      fail: function(error) {

        that.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
        callback(0);
      }
    })
  },

  //获取是否是一元购
  oneYuan_httpData: function() {
    var that = this;
    var url = config.Host + 'cfg/on_off_3_7?' + config.Version;
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

    var newurl = this.Md5_httpUrl(url);
    console.log(newurl);

    wx.request({
      url: newurl,
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data.status == 1) {
          that.globalData.oneYuanValue = res.data.data.wxcx_value;
          that.globalData.oneYuanEvery = res.data.data.wxcx_every;
          that.globalData.typePageHide = res.data.data.typePageHide;
          //0一元购 1不是一元购
          that.globalData.oneYuanData = 0; //默认一元购
          //wxcx_zero >0就是0元购 等于0不是0元购
          that.globalData.oneYuanFree = 0;

          console.log('that.globalData.oneYuanData=', that.globalData.oneYuanData);
          console.log('that.globalData.oneYuanValue=', that.globalData.oneYuanValue);
        }

        that.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
      },
      fail: function(error) {
        that.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })
  },

  // 获取用户信息（去设置授权）
  usergetInfomation_toOpenSeting: function(fun) {
    wx.openSetting({
      success: res => {
        // console.log(res);
        if (res.authSetting['scope.userInfo']) {
          console.log('res1', res)
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('res2', res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log(res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              //授权成功登录衣蝠后台
              // this.usergetInfomation(function () { });
              this.New_userlogin(function() {});
            }
          })
        } else {
          var isSuccess = false;
          fun(false);
        }
      }
    })
  },

  // 获取用户信息
  usergetInfomation: function(refreshCallBack) {
    var that = this;
    wx.getSetting({
      success: res => {
        // console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log(res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }

              //授权成功登录衣蝠后台
              this.userlogin(res, function() {}, refreshCallBack);
            }
          })
        } else {
          // 未授权 弹出授权
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log(res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              //授权成功登录衣蝠后台
              this.userlogin(res, function() {}, refreshCallBack);
            },

            fail: function() {
              that.getSignBG();
              //拒绝授权
              //发送登录完成的监听
              WxNotificationCenter.postNotificationName("testNotificationItem1Name", "loginfinish");

              wx.setStorageSync("loginfinish", "true")
            }
          })
        }
      }
    })
  },

  //用户登录
  userlogin: function(data, fun, refreshCallBack) {
    var that = this;
    // 检测用户登录状态
    wx.checkSession({
      success: function() {
        console.log('微信session 未过期，并且在本生命周期一直有效')
        //检测后台服务器登录状态
        var rd_session = wx.getStorageSync("3rd_session")
        if (rd_session) {
          if (!rd_session.userToken) {
            wx.login({
              success: res => {
                // that.loginHttp(data, res.code, fun, refreshCallBack);
                that.submitCode_http(data, res.code, fun, refreshCallBack);
              }
            })
          } else {
            that.saveUserInfomation(rd_session, "", fun, refreshCallBack);
          }
        } else { //账号被挤掉

          // 登录过期
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId, 3rd_session
              // console.log('在这里登录获取' + res.code);
              //登录衣蝠后台
              // that.loginHttp(data, res.code, fun, refreshCallBack);

              that.submitCode_http(data, res.code, fun, refreshCallBack);

            }
          })
        }
      },
      fail: function() {
        // 登录过期
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId, 3rd_session
            // console.log('在这里登录获取' + res.code);
            //登录衣蝠后台
            // that.loginHttp(data, res.code, fun, refreshCallBack);

            that.submitCode_http(data, res.code, fun, refreshCallBack);
          }
        })
      }
    })
  },

  // 提交code
  submitCode_http: function(data, code, fun, refreshCallBack) {
    var that = this;
    var url = config.Host + 'user/submitcode?' + config.Version + '&code=' + code;

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

    var newurl = this.Md5_httpUrl(url);
    console.log(newurl);

    wx.request({
      url: url,
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data.status == 1) {
          that.loginHttp(data, code, fun, refreshCallBack);
        }
        that.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });

      },
      fail: function(error) {
        that.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })
  },

  //************************新登录流程********************* */

  //用户登录
  New_userlogin: function(refreshCallBack) {
    var that = this;
    // 检测用户登录状态
    wx.checkSession({
      success: function() {
        console.log('微信session 未过期，并且在本生命周期一直有效')
        //检测后台服务器登录状态
        var rd_session = wx.getStorageSync("3rd_session")
        if (rd_session) {
          if (!rd_session.userToken) {
            wx.login({
              success: res => {

                that.New_submitCode_http(res.code, function() {}, refreshCallBack);
              }
            })
          } else {
            that.saveUserInfomation(rd_session, "", function() {}, refreshCallBack);
          }
        } else { //账号被挤掉

          // 登录过期
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId, 3rd_session
              // console.log('在这里登录获取' + res.code);
              //登录衣蝠后台
              // that.loginHttp(data, res.code, fun, refreshCallBack);

              that.New_submitCode_http(res.code, function() {}, refreshCallBack);

            }
          })
        }
      },
      fail: function() {
        // 登录过期
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId, 3rd_session
            // console.log('在这里登录获取' + res.code);
            //登录衣蝠后台
            // that.loginHttp(data, res.code, fun, refreshCallBack);

            that.New_submitCode_http(res.code, function() {}, refreshCallBack);
          }
        })
      }
    })
  },

  // 提交code
  New_submitCode_http: function(code, fun, refreshCallBack) {
    var that = this;
    var url = config.Host + 'user/submitcode?' + config.Version + '&code=' + code;

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
    var newurl = this.Md5_httpUrl(url);
    console.log(newurl);

    wx.request({
      url: url,
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data.status == 1) {
          that.New_usergetInfomation(code, fun, refreshCallBack);
        }


        that.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });

      },
      fail: function(error) {
        var rd_session = wx.getStorageSync("3rd_session");
        that.saveUserInfomation(rd_session, "", function() {}, refreshCallBack);

        that.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })
  },

  // 获取用户信息
  New_usergetInfomation: function(code, fun, refreshCallBack) {
    var that = this;
    wx.getSetting({
      success: res => {
        // console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log(res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }

              this.loginHttp(res, code, fun, refreshCallBack);
            }
          })
        } else {
          // 未授权 弹出授权
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log(res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }

              this.loginHttp(res, code, fun, refreshCallBack);
            },

            fail: function() {
              that.getSignBG();
              //拒绝授权
              //发送登录完成的监听
              WxNotificationCenter.postNotificationName("testNotificationItem1Name", "loginfinish");

              wx.setStorageSync("loginfinish", "true")
              wx.hideLoading();
            }
          })
        }
      }
    })
  },


  //用户登录获取登录信息
  loginHttp: function(data, code, fun, refreshCallBack) {
    var that = this;
    var nickName = data.userInfo.nickName;
    var avatarUrl = data.userInfo.avatarUrl;
    var gender = data.userInfo.gender;
    var rawData = data.rawData;
    var signature = data.signature;
    var encryptedData = data.encryptedData;
    var iv = data.iv;

    rawData = encodeURIComponent(rawData);
    signature = encodeURIComponent(signature);
    encryptedData = encodeURIComponent(encryptedData);
    iv = encodeURIComponent(iv);

    var mParent_id = (that.parent_id != undefined && that.parent_id != 'undefined') ? that.parent_id : "";
    // mParent_id = '945812';//测试用
    var newurl;
    var v_type;
    wx.setStorageSync("isHomePageThreeGo", false);
    var s_type = wx.getStorageSync('v_type_channel');
    var a_type = wx.getStorageSync('advent_channel');
    if (a_type != undefined && a_type !=''){
      v_type = 'v_type=' + a_type;
    } else if (s_type != undefined && s_type != ''){
      v_type = s_type;
    }

    if (mParent_id != undefined && mParent_id != "") {
      newurl = config.Host + 'user/userLogin?device=4' + config.Version + '&rawData=' + rawData + '&signature=' + signature + '&code=' + code + '&encryptedData=' + encryptedData + '&iv=' + iv + "&parent_id=" + mParent_id + '&' + v_type;
    } else {
      newurl = config.Host + 'user/userLogin?device=4' + config.Version + '&rawData=' + rawData + '&signature=' + signature + '&code=' + code + '&encryptedData=' + encryptedData + '&iv=' + iv + '&' + v_type;
    }
    
    var showSpecialPage = wx.getStorageSync('showSpecialPage');
    // showSpecialPage = '1';//测试用
    if (showSpecialPage == '1') {
      newurl = newurl + '&showSpecialPage=1'
    }
    console.log('newurl =', newurl);

    var tongji_url = "default";
    var tongji_parameter = "default";
    var mUrl = newurl + '';

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
    var url = that.Md5_httpUrl(newurl);
    console.log('^^^^^^^^^^^^^url========', url)
    wx.request({
      url: url,
      method: 'POST',
      header: {
        // 'content-type': 'application/json;charset=utf-8' // 默认值
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },

      success: function(res) {
        wx.hideLoading();
        var newstatus = res.data.status;
        if (newstatus == 1) {
          mParent_id = ''
          //缓存用户登录状态标识
          if (res.data) {

            //提交用户未登录前做的任务
            if (wx.getStorageSync("unLoginCompelteList") && wx.getStorageSync("unLoginCompelteList").length > 0) {
              that.submitSign(res.data, fun, refreshCallBack);

            } else {
              that.saveUserInfomation(res.data, "islogin", fun, refreshCallBack);
            }

          }
        } else if (newstatus == 10031) {
          //微信登录延迟 重新登录一次
          if (!loginStatus) {
            that.New_userlogin(function() {});
            loginStatus = true;
          }
        } else {
          var rd_session = wx.getStorageSync("3rd_session")
          if (rd_session != null) {
            that.saveUserInfomation(rd_session, "", fun, refreshCallBack);
          } else {
            fun(false)
            //发送登录状态通知
            WxNotificationCenter.postNotificationName("testNotificationItem1Name", "loginfinish");
            wx.setStorageSync("loginfinish", "true")
          }
        }
        that.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
        console.log("百度统计成功：" + tongji_url);

      },
      fail: function(error) {
        wx.hideLoading();


        that.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
        console.log("百度统计失败：" + tongji_url);

      }
    })
  },
  //   that.submitSign(res.data, fun, refreshCallBack);

  submitSign: function (userData, fun, refreshCallBack){

    var that = this;
    var unLoginCompelteList = wx.getStorageSync("unLoginCompelteList");
    var indexIds = "";

    for (var i = 0; i < unLoginCompelteList.length; i++) {
      indexIds += (unLoginCompelteList[i].index_id + ",")
    }

    var url = config.Host + 'signIn2_0/signInings' +
      "?token=" + userData.token +
      "&indexIds=" + indexIds +
      config.Version;

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
    url = that.Md5_httpUrl(url);
    wx.request({
      url: url,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete: function (subres) {
        that.saveUserInfomation(userData, "islogin", fun, refreshCallBack);
        wx.setStorageSync("unLoginCompelteList", "")


      },
      success: function (res) {
        that.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
        console.log("百度统计成功：" + tongji_url);

      },
      fail: function (error) {
        that.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
        console.log("百度统计失败：" + tongji_url);

      }
      
    })






  },




  //存储用户登录信息
  saveUserInfomation: function(data, islogin, fun, refreshCallBack) {
    // console.log(data)

    // if (data.firstLogin == true) { //新用户发放8元优惠券
    this.getNewUserEight(data.token);
    // }

    var user = {};
    user.orderToken = data.orderToken;
    user.firstLogin = data.firstLogin;
    user.h5money = data.h5money;
    user.userToken = islogin ? data.token : data.userToken;
    user.pic = islogin ? data.userinfo.pic : data.pic;
    user.nickname = islogin ? data.userinfo.nickname : data.nickname;
    user.phone = islogin ? data.userinfo.phone : data.phone;
    user.wx_sex = islogin ? data.userinfo.wx_sex : data.wx_sex;
    user.gender = islogin ? data.userinfo.gender : data.gender;
    user.user_id = islogin ? data.userinfo.user_id : data.user_id;
    user.hobby = islogin ? data.userinfo.hobby : data.hobby;
    user.add_date = islogin ? data.userinfo.add_date : data.add_date;
    user.person_sign = islogin ? data.userinfo.person_sign : data.person_sign;
    user.home_address = islogin ? data.userinfo.home_address : data.home_address;
    user.wxcx_openid = islogin ? data.userinfo.wxcx_openid : data.wxcx_openid;
    user.unionid = islogin ? data.userinfo.unionid : data.unionid;
    user.uid = islogin ? data.userinfo.uid : data.uid;
    user.showSpecialPage = data.showSpecialPage != null ? data.showSpecialPage : 0;
    // user.uid = "oOhAjt-w73zEUBYQ6J0z9b-9uTrM";

    user.addressData = '';
    this.globalData.user = user;
    this.globalData.weburl = 'https://www.52yifu.com/public/component/web-im-1.1.0/index.html?curChatUserId=916&userid=' + user.user_id;
    wx.setStorageSync("3rd_session", user);

    var isSuccess = true;
    refreshCallBack(isSuccess);
    fun(isSuccess);
    this.getSignBG();

    //保存H5赚的钱
    wx.setStorageSync("h5money", data.h5money);

    if (!islogin && user.userToken) {
      this.wx_Statistics("point", "917", "9"); //小程序微信静默授权
      console.log("小程序微信静默授权", "小程序微信静默授权");
    }


    //发送登录状态通知
    WxNotificationCenter.postNotificationName("testNotificationItem1Name", "loginfinish");
    wx.setStorageSync("loginfinish", "true")

  },

  //获取赚钱背景
  getSignBG: function() {
    var that = this;

    var dataUrl = config.Host + "signIn2_0/isMonday" +
      "?" + config.Version;

    if (null != this.globalData.user && this.globalData.user.userToken != undefined) {
      dataUrl = config.Host + "signIn2_0/isMonday" +
        "?token=" + this.globalData.user.userToken +
        "&" + config.Version;
    } else {
      dataUrl = config.Host + "signIn2_0/isMonday" +
        "?" + config.Version;
    }
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

    dataUrl = that.Md5_httpUrl(dataUrl);
    wx.request({

      url: dataUrl,

      method: 'GET',
      //请求传参
      data: {},
      header: {
        "Content-Type": "json"
      },
      success: function(res) {

        try {
          wx.setStorageSync("HASMOD", res.data.isMonday)
        } catch (e) {}

        var hasTicheng = false;
        if (res.data.sup_day == 1 || res.data.fri_win == 1) {
          hasTicheng = true;
        }
        try {
          wx.setStorageSync("HASTICHENG", hasTicheng)
        } catch (e) {}

        try {
          wx.setStorageSync("HASMEIYUEJINGXI", res.data.monthly == 1 ? true : false)
        } catch (e) {}


        try {
          wx.setStorageSync("HALINGYUANGOU", res.data.zero_buy == 1 ? true : false)
        } catch (e) {}


        try {
          wx.setStorageSync("HAQIANYUANHONGBAO", res.data.red_rain == 1 ? true : false)
        } catch (e) {}

        that.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
      },

      complete: function(res) {

      },

      fail: function(error) {

        that.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })
  },


  //获取是否显示品牌和首页2变首页3（以后开关统一用这个）
  getSwitch: function() {
    var that = this;

    var dataUrl = config.Host + "cfg/config_switch" +
      "?" + config.Version;
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

    dataUrl = that.Md5_httpUrl(dataUrl);
    wx.request({

      url: dataUrl,

      method: 'GET',
      //请求传参
      data: {},
      header: {
        "Content-Type": "json"
      },
      success: function(res) {

        //是否显示品牌
        if (res.data.data.miniappDisplayOrHideBrand == "1") {
          that.showSub = true
        } else {
          that.showSub = false
        }


        //是首页2到首页3
        if (res.data.data.homePage2to3 == "1") {

        } else {

        }


        that.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
      },

      complete: function(res) {

      },

      fail: function(error) {

        that.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })
  },

  Md5_httpUrl: function(url) {
    var oldurl = url + "yunshangshiji"
    var autherkey = MD5.md5(oldurl);

    var obj_base64 = new base64_func.Base64();
    var I10o = obj_base64.encode(autherkey);
    var newurl = url + "&authKey=" + autherkey + "&I10o=" + I10o + '&systime=' + new Date().getTime();
    return newurl;
  },

  ////数据统计接口record/add
  wx_Statistics: function(key, type, tab_type) {
    var that = this;
    var token = "";
    if (that.globalData.user != null) {
      token = that.globalData.user.userToken;
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
    var url = this.Md5_httpUrl(dataUrl);
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function(res) {


        that.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
      },
      fail: function(error) {
        that.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })
  },
  getSystemInfo: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var systemInfo = '';
        if (res.platform == "devtools") {
          systemInfo = "PC";
        } else if (res.platform == "ios") {
          systemInfo = "ios";
        } else if (res.platform == "android") {
          systemInfo = "android";
        }

        that.globalData.systemInfo = systemInfo;
      }
    })
  },

  globalData: {
    userInfo: null,
    user: null,
    weburl: null,
    moneyPageHide: null,
    typePageHide: null, //是否隐藏首页左上角 右上角角标
    oneYuanData: null, //是否1元购 0：1元购 1：不是1元购
    oneYuanValue: null, //x元购
    oneYuanEvery: null, //多少元抽一次
    oneYuanFree: null, //0元购免费次数
    systemInfo: null, //当前设备系统
    singtasklist: mUrl + "signIn2_0/siTaskList",
    step: 0,
    moneyTixianShowCount: 0,
    showSignPage: true,
    channel_type: 0,
    first_diamond: 0, //是否有第一张钻石免费领（0否1是）
  },


  getNewUserEight: function(token) {

    var that = this;
    var dataUrl = config.Host + "coupon/giveNewCoupon" +
      "?token=" + token +
      "&" + config.Version;

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
    dataUrl = that.Md5_httpUrl(dataUrl);
    wx.request({
      url: dataUrl,
      method: 'GET',
      //请求传参
      data: {},
      header: {
        "Content-Type": "json"
      },
      success: function(res) {
        console.log("优惠券" + res.data)
        that.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });
      },

      complete: function(res) {},

      fail: function(error) {
        that.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })


  },

  //没有交易记录的和没有登录的分享页面先跳首页3
  queryJY: function(callBack) {
    var noJY = true //没有交易记录
    var that = this;
    if (this.globalData.user != null) {
      var token = this.globalData.user.userToken;
      var url = config.Host + "order/getNewUserOrder" +
        "?token=" + token +
        config.Version;







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

      var url = that.Md5_httpUrl(url);


      wx.request({
        url: url,
        data: {
          // x: '',
          // y: ''
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {

          if (res.data.count == 0) { //没有交易记录
            noJY = true
            // wx.navigateTo({
            //   url: '/pages/shouye/redHongBao?shouYePage=ThreePage',
            // })
          } else {
            noJY = false

          }
          callBack(noJY);

          that.mtj.trackEvent('i_f_success_count', {
            i_f_name: tongji_url,
          });

        },
        fail: function(error) {
          // noJY = false
          callBack(noJY);

          that.mtj.trackEvent('i_f_error_count', {
            i_f_name: tongji_url,
            // i_f_from: "10",
          });
        }

      })

    } else { //没有用户信息默认没有登录
      noJY = false
      callBack(noJY);

      // wx.navigateTo({
      //   url: '/pages/shouye/redHongBao?shouYePage=ThreePage',
      // })
    }
  }


})