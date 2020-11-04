// pages/mine/Complaint/Complaint.js
var app = getApp();
var util = require('../../../utils/util.js');
var publicutil = require('../../../utils/publicUtil.js');
import config from '../../../config.js';
import ToastPannel from '../../../common/toastTest/toastTest.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},
    length:0,
    secondimgData: ['complaint_1.png', 'complaint_2.png','complaint_3.png'],
    secondtextData:['发送给朋友','添加到我的小程序','添加到桌面'],
    thirdimgData: ['complaint_4.png', 'complaint_5.png', 'complaint_6.png','complaint_7.png'],
    thirdtextData: ['浮窗', '设置', '反馈与投诉','重新进入小程序'],

    complaint_page:'1',
    complaint_firstData:['功能异常','支付问题','产品建议'],
    complaint_secondData:['无法打开小程序','小程序闪退','卡顿','黑屏白屏','死机','界面错位','界面加载慢','其他异常'],
    complaint_eleventhData: ['新冠肺炎疫情相关', '色情', '诱导', '骚扰', '欺诈', '恶意营销', '与服务类目不符', '违法犯罪', '侵权（冒名、诽谤、抄袭）', '不实信息', '隐私信息收集', '其他'],
    userImg:[]
  },

  // 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认600ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();//调用显示动画
    }, 200)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800,//动画的持续时间 默认800ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
        that.setData({
          hideModal: true
        })
    }, 720)//先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(600).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
 
  //点击反馈内容
  itemtap:function(e){
    var clciktext = e.currentTarget.dataset.id;
    if(clciktext == "反馈与投诉"){
      console.log('clciktext=', clciktext);
      wx.navigateTo({
        url: '/pages/mine/Complaint/Complaint',
      })
    }
  },
  //投诉分享
  complain_shareTap:function(){
    this.setData({
      hideModal: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    
    if(options.path)
    {
      this.setData({
        path:options.path
      })
    }
  },

  //投诉内容点击
  complaint_tap:function(e){
    var id = e.currentTarget.dataset.id;
    id = parseInt(id) + 1;

    var index = e.currentTarget.dataset.index;
    var complaintTitle = id <= 3 ? this.data.complaint_secondData[index] : this.data.complaint_eleventhData[index];
    
    this.setData({
      complaint_page: id,
      complaintTitle: complaintTitle
    })
  },
  //向微信投诉
  complaint_wx_tap:function(e){
    var index = 11;
    this.setData({
      complaint_page: index
    })
  },
  //左按钮
  lefttap:function(e){
    var id = e.currentTarget.dataset.id;
    id = parseInt(id) - 1;
    if(id==10)
    {
      id = 1;
    }
    this.setData({
      complaint_page: id
    })
  },
  //右按钮
  righttap:function(e){
    var id = e.currentTarget.dataset.id;
    if (id == 3 || id == 12) {
      return;
    }
    id = parseInt(id) + 1;
    var complaintTitle = id <= 3 ? this.data.complaint_secondData[0] : this.data.complaint_eleventhData[0];
    this.setData({
      complaint_page: id,
      complaintTitle: complaintTitle
    })
  },
  //关闭
  closeComplaint:function(e){
    wx.navigateBack({})
  },
  //提交
  checkComplaint: function (e) {
    var submitData = {};
    submitData.complaintTitle = this.data.complaintTitle;
    submitData.complaintMessage = this.data.message;
    submitData.complaintPhone = this.data.phone;
    submitData.complaintPath = this.data.path;

    this.submitData(submitData);
  },
  //上传图片
  uploadImg: function () {
    var e = this, t = this;
    wx.chooseImage({
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      count:4,
      success: function (a) {
        e.setData({
          files: a.tempFilePaths,
          userImg: a.tempFilePaths
        });
      }
    });
  },

  //提交用户图片+文档数据
  uploadFile: function (e) {//这里触发图片上传的方法
    var pics = this.data.userImg;
    var persondata = JSON.stringify(e);
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var dataUrl = config.Host + "/logub/up" + "?" + config.Version + '&token=' + token;
    var data = { url: dataUrl, path: pics, persondata: persondata, };
    wx.showLoading({
      title: "上传中···"
    }),
    publicutil.uploadimg({
      url: dataUrl,//这里是你图片上传的接口
      path: pics,//这里是选取的图片的地址数组 
      persondata: persondata, //用户数据
      uuid: '123456',
      type: 5000
    });
  
  },

  //提交用户文档数据
  submitData: function (e) {
    var that = this;
    var persondata = JSON.stringify(e);

    wx.showLoading({
      title: '正在上传数据...',
    })
    util.submit_Complaint(persondata, function (data) {
      wx.hideLoading();
      if (data.status == 1) {
        wx.hideLoading();

        var id = parseInt(that.data.complaint_page) + 1;
        that.setData({
          complaint_page: id,
        })
        
      } else {
        wx.hideLoading();
        that.showToast("提交失败", 5000);
      }
    })
  },

  //输入投诉内容
  lengthtap: function (e) {
    var message = e.detail.value;
    let length = e.detail.value.length;

    this.setData({
      message: message,
      length: length
    })

  },

  //输入投诉者手机号
  phonetap: function (e) {
    var phone = e.detail.value;
    this.setData({
      phone: phone,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})