// pages/sign/inviteFriends/memberFriendsReward.js
import config from '../../../config';
var util = require('../../../utils/util.js');
import ToastPannel from '../../../common/toastTest/toastTest.js';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    Upyun: config.Upyun,
    datalist: {},
    currentpage:1,
    ext_num: 0,
    ext_now: 0,
    ext_yet: 0,
    ext_reward: 0.0,

    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},
    length: 0,
    secondimgData: ['complaint_1.png', 'complaint_2.png', 'complaint_3.png'],
    secondtextData: ['发送给朋友', '添加到我的小程序', '添加到桌面'],
    thirdimgData: ['complaint_4.png', 'complaint_5.png', 'complaint_6.png', 'complaint_7.png'],
    thirdtextData: ['浮窗', '设置', '反馈与投诉', '重新进入小程序'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (!app.parent_id && options.user_id) {
      app.parent_id = options.user_id
    }
    
    //大促销已结束
    var showendofpromotionDialog;
    if (app.globalData.user != null) {
      showendofpromotionDialog = app.globalData.user.showSpecialPage != 1 ? true : false;
    } else {
      showendofpromotionDialog = true;
    }
    if(showendofpromotionDialog)
    {
      wx.setNavigationBarTitle({
        title: '我的卡券',
      })
      this.setData({
        showendofpromotionDialog: showendofpromotionDialog
      })
      wx.redirectTo({
        url: '/pages/mine/Coupon/Coupon',
      })
    }else{
      wx.setNavigationBarTitle({
        title: '好友奖励',
      })
    }
    
    new app.ToastPannel();
    this.getDayReward();
    this.getRewardList();
    this.checkLoginSetting();
    util.httpUpyunJson(this.shareData);
  },
  onShow:function(){
    var that = this;
    wx.onUserCaptureScreen(function (res) {
      console.log('……………………………………………………用户截屏了')
      setTimeout(function () {
        that.showModal();
      }, 1000)
    })
  },
  //列表加载更多
  onReachBottom: function () {
    this.getRewardList();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      currentpage: 1,
    })
    
    this.getDayReward();
    this.getRewardList();
  },
  // 今日奖励 数据
  getDayReward: function () {
    if (app.globalData.user == undefined || app.globalData.user == '') {
      wx.stopPullDownRefresh();
      return;
    }
    var dataUrl = config.Host + "wallet/getExtremeToDayCount?" + config.Version + "&token=" + app.globalData.user.userToken;
    util.http(dataUrl, this.dayReward)
  },

  // 好友奖励明细
  getRewardList: function () {
    if (app.globalData.user == undefined || app.globalData.user == '') {
      wx.stopPullDownRefresh();

      return;
    }
    var dataUrl = config.Host + "wallet/getExtremeTiChengInfo?" + config.Version + "&token=" + app.globalData.user.userToken + "&page=" + this.data.currentpage;
    util.http(dataUrl, this.dayRewardList)
  },
  dayReward: function (data) {
    wx.stopPullDownRefresh();
    var token = (app.globalData.user.userToken != undefined && app.globalData.user.userToken != null) ? app.globalData.user.userToken : '';
    if (data.status == 1) {
      var ext_num = data.data.ext_num ? data.data.ext_num : "0";
      var ext_now = data.data.ext_now ? (1 * data.data.ext_now ).toFixed(0) : "0";
      var ext_yet = data.data.ext_yet ? (1 * data.data.ext_yet).toFixed(0) : "0";
      var ext_money = data.data.ext_money ? (1 * data.data.ext_money).toFixed(1) : "0.0";
      var ext_time = data.data.time ? data.data.time : "0";
      
      this.setData({
        ext_num: ext_num,
        ext_now: ext_now,
        ext_yet: ext_yet,
        ext_time: ext_time,
        ext_reward: ext_money,
        token:token
      })

      var that = this;
      //获取是否是会员
      util.get_vip2(function (data) {
        var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
        var showBecameMember = (((data.isVip > 0 && data.isVip != 3) || (data.isVip == 3 && data.maxType == 4)) && data.first_diamond == 0)?true:false;
        that.setData({
          is_vip: isVip,
          showBecameMember: showBecameMember
        })
      })
    } else {
      this.showToast(data.message, 2000);
    }

  },
  dayRewardList: function (data) {

    if (this.data.currentpage == 1) {
      this.data.datalist = [];
    }

    if (data.status == 1) {
      
      var movies = this.data.datalist;
      var cutJson = {};
      var page = this.data.currentpage + 1;

      for (var idx in data.data) {
        var subject = data.data[idx];
        cutJson = subject;
        var pic = subject.pic;
        if (pic) {
          var fdStart = subject.pic.indexOf("http");
          if (fdStart == 0)
            cutJson['pic'] = pic;
          else
            cutJson['pic'] = config.Upyun + pic;
        }
        var nickname = subject.nickName;
        if (nickname.length > 7) {
          nickname = nickname.substr(0, 7) + '...';
          cutJson['nickName'] = nickname;
        }
        movies.push(cutJson)
      }

      this.setData({
        datalist: movies,
        currentpage: page
      });
    }else{
      this.showToast(data.message, 2000);
    }
  },

  gotoTixian:function(){
    //会员才能提现
    if (this.data.is_vip == false) {
      return;
    }
    var token = app.globalData.user.userToken;
    if(token != undefined && token != null && token != '')
    {
      wx.navigateTo({
        url: '../../mine/wallet/Withdrawals/Withdrawals',
      })
    }
  },

  //检查用户是否授权登录
  checkLoginSetting: function () {

    var that = this;
    //查看用户是否授权 未授权弹授权提示弹窗
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) { //授权过

          if (!app.globalData.user) { //拿不到用户信息-去登录
            app.New_userlogin(function () {
              that.getDayReward();
              that.getRewardList();
              util.httpUpyunJson(that.shareData);
            });
          } 
        } else { //未授权 弹授权提示弹窗
          that.setData({ showTips: true })
        }
      }
    })
  },
  // 授权弹窗
  onclick: function (e) {
    var that = this;
    wx.getUserInfo({
      //允许授权 获取用户信息
      success: function (res) {
        if (!app.globalData.user) {
          wx.showLoading({
            title: '请稍后',
            mask: true,
          })
          //授权成功去登录
          app.New_userlogin(function () {
            that.getDayReward();
            that.getRewardList();
            util.httpUpyunJson(that.shareData);

            that.setData({ showTips: false })
          });
        }
      },
      fail: function () {

      }
    })
   
  },
  
  /**
   * 分享数据
   */
  shareData: function (data) {
    var vip_share_links = data.vip_share_links.text;
    var memberData = vip_share_links.split(",");

    var shareTitle = data.wxcx_share_links.title ? data.wxcx_share_links.title : "我刚领的红包也分你一个，帮我提现就能拿钱哦~";
    var share_pic = config.Upyun + (data.wxcx_share_links.icon ? (data.wxcx_share_links.icon + '?' + Math.random()): "/small-iconImages/heboImg/shareBigImage_new.jpg");

    //设置分享的文案
    this.setData({
      memberData: memberData,
      shareTitle: shareTitle,
      shareImageUrl: share_pic
    });
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
    }, 500)//先执行下滑动画，再隐藏模块

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
  itemtap: function (e) {
    var clciktext = e.currentTarget.dataset.id;
    if (clciktext == "反馈与投诉") {
      console.log('clciktext=', clciktext);
      this.setData({
        hideModal: true
      })
      wx.navigateTo({
        url: '/pages/mine/Complaint/Complaint?path=/inviteFriends/memberFriendsReward',
      })
    }
  },
  //投诉分享
  complain_shareTap: function () {
    this.setData({
      hideModal: true
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

    var that = this;
    if (res.from === 'menu') {
      // 来自页面内转发按钮
    }else{
      // return {

      //   title: that.data.shareTitle,
      //   path: '/pages/shouye/shouye?' + "isShareFlag=true" + "&user_id=" + app.globalData.user.user_id,
      //   imageUrl: that.data.shareImageUrl,
      //   success: function (res) {
      //     // 转发成功
      //     that.showToast('分享成功', 2000);
      //   },
      //   fail: function (res) {
      //     // 转发失败
      //     that.showToast('分享失败', 2000);
      //   }
        
      // }



      var user_id = app.globalData.user.user_id;
      var page = 'pages/shouye/redHongBao';
      var str = user_id + ',' + 'ThreePage' + ',' + 'QRcode';

      //普通小程序二维码
      var path = 'pages/shouye/redHongBao?scene=' + str;
      return {
        title: '199元购物红包免费抢，多平台可用，快来试试人品吧	👉',
        path: path,
        imageUrl: config.Upyun + 'small-iconImages/heboImg/freeling_share199yuan.jpg',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }

    }
  },
})