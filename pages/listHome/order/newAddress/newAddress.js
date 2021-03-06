// pages/listHome/order/newAddress/newAddress.js


import config from '../../../../config';
// import addressList from '../../../../data/address_data.js';
var util = require('../../../../utils/util.js');
var app = getApp();
var WxNotificationCenter = require('../../../../utils/WxNotificationCenter.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    is_editAddress: 0,
    consignee: '',
    telphone: '',
    detailAddress: '',
    addressIndex: [],
    multiArray: [],
    id: '',
    is_default: 0,  //是否为默认地址

    province: '',
    city: '',
    area: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    if (options.telphone){
      var is_editAddress = options.is_editAddress;
      var consignee = options.consignee;
      var telphone = options.telphone;
      var detailAddress = options.detailAddress;
      var id = options.id;
      var is_default = options.is_default;

      this.setData({
        consignee: consignee,
        telphone: telphone,
        detailAddress: detailAddress,
        is_editAddress: options.is_editAddress,
        id: id,
        is_default: is_default,
        province: options.province,
        city: options.city,
        area: options.area,
      })

      if (is_editAddress == 1)
        wx.setNavigationBarTitle({
          title: '编辑收货地址'
        })
    }


    util.httpAddressJson(this.addressDataBase)
    
  },
  addressDataBase:function(data) {
    this.data.addressList = data;
    const addressData = data;
    var cities = [];
    var areas = [];
    var states = [];

    var is_editAddress = this.data.is_editAddress;
    var province = this.data.province;
    var city = this.data.city;
    var area = this.data.area;
    var addressIndex = (is_editAddress == 1) ? [0, 0, 0]:[];


    if (is_editAddress == undefined || (province == 0 && city == 0 && area == 0)) {
      for (let i = 0; i < addressData.length; i++) {
        states.push(addressData[i]['state']);
      }
      for (let j = 0; j < addressData[0]["cities"].length; j++) {
        cities.push(addressData[0]["cities"][j]['city']);
      }
      for (let j = 0; j < addressData[0]["cities"][0]['areas'].length; j++) {
        areas.push(addressData[0]["cities"][0]['areas'][j]['area']);
      }
      // addressIndex = [0,0,0];
    } else {

      for (let i = 0; i < addressData.length; i++) {
        states.push(addressData[i]['state']);
        if (addressData[i]['id'] == province) {
          addressIndex = [i, 0, 0];
          for (let j = 0; j < addressData[i]["cities"].length; j++) {
            cities.push(addressData[i]["cities"][j]['city']);
            if (addressData[i]["cities"][j]['id'] == city) {
              addressIndex = [addressIndex[0], j, 0];
              for (let k = 0; k < addressData[i]["cities"][j]['areas'].length; k++) {
                areas.push(addressData[i]["cities"][j]['areas'][k]['area']);
                if (addressData[i]["cities"][j]['areas'][k]['id'] == area)
                  addressIndex = [addressIndex[0], addressIndex[1], k];

              }
            }
          }
        }
      }
    }

    var dataArr = [states, cities, areas];

  
    this.setData({
      multiArray: dataArr,
      addressIndex: addressIndex,
    })

  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      addressIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (!this.data.addressIndex || this.data.addressIndex.length < 3)
      this.setData({addressIndex: [0,0,0]})

    if(e.detail.column==0)
      this.setData({ addressIndex: [e.detail.value, 0, 0] })

    var data = {
      multiArray: this.data.multiArray,
      addressIndex: this.data.addressIndex
    };
    data.addressIndex[e.detail.column] = e.detail.value;

    const addressData = this.data.addressList;
    var cities = [];
    var areas = [];
    var states = [];
    for (let i = 0; i < addressData.length; i++) {
      states.push(addressData[i]['state']);
    }
    if (addressData[data.addressIndex[0]]["cities"] !== undefined) {
      for (let j = 0; j < addressData[data.addressIndex[0]]["cities"].length; j++) {
        cities.push(addressData[data.addressIndex[0]]["cities"][j]['city']);
      }
    }
    if (addressData[data.addressIndex[0]]["cities"][data.addressIndex[1]]['areas'] !== undefined) {
      for (let j = 0; j < addressData[data.addressIndex[0]]["cities"][data.addressIndex[1]]['areas'].length; j++) {
        areas.push(addressData[data.addressIndex[0]]["cities"][data.addressIndex[1]]['areas'][j]['area']);
      }
    }

    if (cities.length && areas.length) {
      data.multiArray = [states, cities, areas];
    } else if (cities.length && areas.length == 0) {
      data.multiArray = [states, cities];
    } else if (cities.length == 0 && areas.length == 0) {
      data.multiArray = [states];
    }

    this.setData(data);
  },
  // 保存地址
  saveAddress: function (e) {
    util.httpPushFormId(e.detail.formId);
    var warn = '';
    var flag = false;
    if (e.detail.value.name == "") {
      warn = "请填写您的姓名！";
    } else if (e.detail.value.tel == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^1\d{10}$/.test(e.detail.value.tel))) {
      warn = "手机号格式不正确";
    } else if (!this.data.addressIndex||this.data.addressIndex.length < 3) {
      warn = "请选择省-市-区！";
    } else if (e.detail.value.detail == "") {
      warn = "请填写详细地址！";
    } else {
      flag = true;
      var addressList = this.data.addressList;
      var province = addressList[this.data.addressIndex[0]]['id'];
      var city = addressList[this.data.addressIndex[0]]["cities"][this.data.addressIndex[1]]['id'];
      var area = addressList[this.data.addressIndex[0]]["cities"][this.data.addressIndex[1]]['areas'][this.data.addressIndex[2]]['id'];


      if (this.data.is_editAddress) {
        var dataUrl = config.Host + "address/update?" + config.Version + "&token=" + app.globalData.user.userToken + "&consignee=" + e.detail.value.name + "&address=" + e.detail.value.detail + "&phone=" + e.detail.value.tel + "&province=" + province + "&city=" + city + "&area=" + area + '&id=' + this.data.id;//"&street=0";
        util.http(dataUrl, this.result)
      } else {
        var dataUrl = config.Host + "address/insert?" + config.Version + "&token=" + app.globalData.user.userToken + "&consignee=" + e.detail.value.name + "&address=" + e.detail.value.detail + "&phone=" + e.detail.value.tel + "&province=" + province + "&city=" + city + "&area=" + area;//"&street=0";
        util.http(dataUrl, this.result)
      }
    }
    if (flag == false) {
      this.showToast(warn, 2000);
    }
  },
  // 更新默认地址
  updateDefaultAddress:function () {
    var dataUrl = config.Host + "address/update?" + config.Version + "&token=" + app.globalData.user.userToken + '&id=' + this.data.id + '&is_default=1';
    util.http(dataUrl, this.result)
  },
  // 删除地址
  deleteAddress: function () {
    var dataUrl = config.Host + "address/delete?" + config.Version + "&token=" + app.globalData.user.userToken + '&id=' + this.data.id;
    util.http(dataUrl, this.result)
  },
  result: function (data) {
    if (data.status == 1) {
      var address_id = wx.getStorageSync('address_id')
      // if (address_id == this.data.id || (this.data.is_default==1&&address_id==0))
        WxNotificationCenter.postNotificationName("deleteAddress", "loginfinish");

      wx.navigateBack({

      })
    } else {
      this.showToast(data.message, 2000);
    }
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