// pages/listHome/order/address/choseAddress.js
/***
 * {"listdt":
 * [
 * {"id":6600,"user_id":null,"province":4,"city":88,"area":1339,"street":7693,"address":"是大概给我","consignee":"都好好的","postcode":"","phone":"18607358496","is_default":1},
 * {"id":6627,"user_id":null,"province":1,"city":37,"area":567,"street":0,"address":"42134231","consignee":"42134","postcode":"","phone":"18700000000","is_default":0},
 * {"id":6605,"user_id":null,"province":3,"city":77,"area":1192,"street":5885,"address":"都会觉得","consignee":"电话号","postcode":"","phone":"16548976456","is_default":0},
 * {"id":6598,"user_id":null,"province":4,"city":87,"area":1326,"street":7547,"address":"测试\n测试","consignee":"lldj","postcode":"","phone":"15648679494","is_default":0}
 * ],
 * "status":"1"} */

// import addressLis1t from '../../../../data/address_data.js';

import config from '../../../../config';
var util = require('../../../../utils/util.js');
var WxNotificationCenter = require("../../../../utils/WxNotificationCenter.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist: {},
    addressList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },

  // 地址数据
  addressData: function (data) {
    var addresses = [];
    var cutJson = {};
    for (var idx in data.listdt) {
      var subject = data.listdt[idx];

      // 根据id从本地地址数据获取
      var province = '';
      var city = '';
      var area = '';
      var street = '';
      var addressList = this.data.addressList;
      for (let i = 0; i < addressList.length; i++) {
        if (addressList[i]['id'] == subject.province) {
          province = addressList[i]['state'];
          if (!addressList[i]["cities"])
          {
            continue;
          }
          for (let j = 0; j < addressList[i]["cities"].length; j++) {
            if (addressList[i]["cities"][j]['id'] == subject.city) {
              city = addressList[i]["cities"][j]['city'];
              if (!addressList[i]["cities"][j]['areas']) {
                continue;
              }
              for (let k = 0; k < addressList[i]["cities"][j]['areas'].length; k++) {
                if (addressList[i]["cities"][j]['areas'][k]['id'] == subject.area) {
                  area = addressList[i]["cities"][j]['areas'][k]['area'];
                  if (isNaN(subject.street) && addressList[i]["cities"][j]['areas'][k]['streets'])
                    
                    for (let m = 0; m < addressList[i]["cities"][j]['areas'][k]['streets'].length; m++) {
                      if (addressList[i]["cities"][j]['areas'][k]['streets'][m]['id'] == subject.street)
                        street = addressList[i]["cities"][j]['areas'][k]['streets'][m]['street'];
                    }
                }
              }
            }
          }
        }
      }
      var addressDetail = province + city + area + street;

      cutJson = subject;
      cutJson["addressDetail"] = addressDetail;
      addresses.push(cutJson)
    }

    if (addresses.length > 0){
      this.setData({
        datalist: addresses,
      });
    }
  },

  // 添加新地址
  newAddressTap: function () {
    if (app.globalData.user != null && app.globalData.user.userToken != undefined)
      wx.redirectTo({
        url: '../newAddress/newAddress',
      })
    else
      util.toAuthorizeWx(function (isSuccess) {
        if (isSuccess == true) {

        }
      });
  },

  // 选择地址
  addressTap: function (e) {
    var phone = e.currentTarget.dataset.address.phone;
    var address = e.currentTarget.dataset.address.addressDetail + e.currentTarget.dataset.address.address;
    var consignee = e.currentTarget.dataset.address.consignee; //'hello world';
    var address_id = e.currentTarget.dataset.address.id;

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      phone: phone,
      address: address,
      consignee: consignee,
      address_id: address_id
    });
    // if(address.length >0)
    // {
    //   app.globalData.user.home_address = address;
    // }
    wx.navigateBack();
  },

  //  编辑地址
  editAddress: function (e) {
    var phone = e.currentTarget.dataset.address.phone;
    var address = e.currentTarget.dataset.address.address;
    var consignee = e.currentTarget.dataset.address.consignee;
    var address_id = e.currentTarget.dataset.address.id;
    // var city_area = e.currentTarget.dataset.address.addressDetail;
    var province = e.currentTarget.dataset.address.province;
    var city = e.currentTarget.dataset.address.city;
    var area = e.currentTarget.dataset.address.area;
    var id = e.currentTarget.dataset.address.id;
    var is_default = e.currentTarget.dataset.address.is_default;

    var url2= '../newAddress/newAddress?' +
      'telphone=' + phone +
      '&detailAddress=' + address +
      '&consignee=' + consignee +
      '&address_id=' + address_id +
      '&is_editAddress=' + 1 +
      '&province=' + province +
      '&city=' + city +
      '&area=' + area +
      '&id=' + id +
      '&is_default=' + is_default;

    util.navigateTo(url2)
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
 
    if (app.globalData.user != null && app.globalData.user.userToken != undefined)
      util.httpAddressJson(this.addressDataBase)
    else
      util.toAuthorizeWx(function (isSuccess) {
        if (isSuccess == true) {

        }
      });

  },
  addressDataBase: function (data) {


    this.data.addressList = data;
    var dataUrl = config.Host + "address/queryall?" + config.Version + "&token=" + app.globalData.user.userToken;
    util.http(dataUrl, this.addressData)


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})