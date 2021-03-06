var app = getApp();
var util = require("../../../../utils/util.js");
var WxNotificationCenter = require("../../../../utils/WxNotificationCenter.js");
import config from "../../../../config.js";
var wxOpenId = '';
var money = '';
var name = '';
var identity = '';
var tixianMoney = ''; //用户要提现的金额

var coupon = 0
var cond = 0

var isVipTX = 0;

var isOK = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    configUpyun: config.Upyun,
    Upyun: config.Upyun,
    openYifuDialogShow: false,
    balance: "0.00",
    extract: "0.00",
    ex_free: "0.00",
    freeze_balance: "0.00",
    idcardFlag: 0,
    sections_first: ["30", "50", "100"],
    minicill: 0, //单次提现不得低于此金额
    sections_second: ["微信"],
    sections_images: ["/small-iconImages/heboImg/pay_icon_微信支付.png"],
    select_normol: config.Upyun + "/small-iconImages/heboImg/pay_icon_nor.png",
    select_xuanzh: config.Upyun + "/small-iconImages/heboImg/shop_select.png",
    currentTab: 0,
    stylecurrentTab: 0,
    isUpperNotitle: true,
    upperdistribution: "你的提现额度不足，马上去兑换好物~",
    upperbuttontitle: "好物1元起兑",
    upperGoYiFuShow: false,
    ForwardSuccessShow: false,
    upperForwardShow: false,
    is_bingTixianView: false,
    uppertittle: "4.9元起提，请增加提现额度",
    upperdistribution_list: ["衣蝠为你准备了20元提现现金，可以马上提现", "每日完成赚钱小任务都有机会赚取到2-5元不等的提现现金", "你也可以继续参与疯抢，未抢到退还全部金额，可立即提现", "你也可以直接购买限时特价品，最低4块9还包邮哦"],
    upperbuttontitle_list: ["立即领取", "赚钱任务", "继续疯抢", "限时特价"],
    inputvalues: '',
    inputValue: '',
    showkaitongVip:false,
    supplementMemberShow: false,
    member_discribution: '会员费30日后才能提现哦。',
    member_buttontitle: '知道了',
  },

  tixiansubmit: function(e) {
    var formId = e.detail.formId;
    if (formId && app.globalData.user != null) {
      util.httpPushFormId(formId);
    }
  },
  thirty_tap: function() {
    wx.navigateBack({

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    new app.ToastPannel();
    this.http_getwalletData();
    coupon = options.coupon
    cond = options.cond
    isVipTX = options.isVipTX;
    if(!isVipTX){
      isVipTX = 0
    }
    if (options.isRed) {
      this.setData({
        balance: 20,
        lijianMoney: coupon,
        deTXmoney: 20 - options.coupon,
        showThirtyRed: true
      })
    }

    var that = this;
    //获取是否是会员
    util.get_vip(function (data) {
      var isVip = data.isVip != undefined ? data.isVip : 0; //0不是 1是
      that.setData({
        is_vip: isVip
      })
    })

    //监听登录成功 刷新界面
    WxNotificationCenter.addNotification("testNotificationAuthorizationName", this.http_getwalletData, this);
  },
  //钱包数据
  http_getwalletData: function() {
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var url = config.Host + 'wallet/doDepositAgo?' + config.Version + '&token=' + token;
    util.http(url, this.walletData);
  },
  walletData: function(data) {
    if (data.status == 1) {
      // var sss = data["kts"];
      // var arr = sss.split(",");

      isOK = data.isOk;


      if (isVipTX == 0) {
        data["minicill"] = 40.0
      }
      var minicill_sss = data["minicill"];

      if(isVipTX == 0){
        minicill_sss = minicill_sss ? minicill_sss : '40.0';

      }else{
        minicill_sss = minicill_sss ? minicill_sss : '4.9';

      }


      this.setData({
        balance: (data.balance * 1).toFixed(2),
        extract: (data.extract * 1).toFixed(2),
        ex_free: (data.ex_free * 1).toFixed(2),
        freeze_balance: (data.freeze_balance * 1).toFixed(2),
        vip_balance: (data.vip_balance * 1).toFixed(2),
        // sections_first: arr,
        minicill: minicill_sss,
        idcardFlag: (data.idcardFlag != null && data.idcardFlag != undefined) ? data.idcardFlag : "",
        uppertittle: minicill_sss + "元起提，请增加提现额度",
      })

      if (isOK == -1 ){
        this.setData({
          showkaitongVip:false
        })

      }
      if (isOK == -2) {
        this.setData({
          supplementMemberShow: true
        })

      }

    }
  },
  //增加提现额度
  suspendtap: function(event) {
    // wx.redirectTo({
    //   url: '../../../sign/withdrawLimit/withdrawLimit',
    // })

    wx.navigateTo({
      url: "/pages/sign/inviteFriends/memberFriendsReward",
    })

    // this.setData({
    //   // upperForwardShow: true
    //   showNeedTiXian: true



    // })
  },

  //关闭弹框
  forwardsuccesstap: function() {
    this.setData({
      showNeedTiXian: false
    })
  },

  searchInputEvent: function(obj) {
    console.log("okok" + obj.detail.value);
    var inputValue = obj.detail.value;
    this.setData({
      inputValue: inputValue
    })
  },

  //选择提现金额
  firstswitchNav: function(e) {
    var page = this;
    var currenttab = e.target.dataset.index;
    if (this.data.currentTab == currenttab) {
      return false;
    } else {
      var current = e.target.dataset.index;
      var selectblance = this.data.sections_first[current];
      // if (this.data.balance < selectblance) {
      //   // this.showToast("您的余额不足，请继续做赚钱任务积累余额", 2000);
      //   // this.setData({
      //   //   upperForwardShow: true
      //   // })
      //   this.setData({
      //     upperGoYiFuShow: true
      //   })
      // } else if (this.data.extract < selectblance) {
      //   // this.showToast("你的提现额度不足", 2000);
      //   this.setData({
      //     upperGoYiFuShow: true
      //   })
      // }
      // else {
      //   page.setData({
      //     currentTab: current,
      //   });
      // }

      //新的提现方式有提现额度就可以提现 与钱包余额独立开来
      if (this.data.extract < selectblance) {
        // this.showToast("你的提现额度不足", 2000);
        this.setData({
          // upperForwardShow: true

          showNeedTiXian: true

        })
      } else {
        page.setData({
          currentTab: current,
        });
      }
    }
  },
  //选择提现方式
  secondswitchNav: function(e) {
    var page = this;
    var currenttab = e.target.dataset.index;
    if (this.data.stylecurrentTab == currenttab) {
      return false;
    } else {
      var current = e.target.dataset.index;
      page.setData({
        stylecurrentTab: current,
      });
    }
  },

  closeTixianComplete: function() { //提现成功后关闭提示
    this.setData({
      ForwardSuccessShow: false,
      showTXgoSign: false,
      showNeedTiXian: false
    })
  },

  goGZH: function() { //提现成功后去关注公众号、

    this.setData({
      ForwardSuccessShow: false,
      shopGuideGZH: true

    })
  },


  closeShopGuideGZH: function() { //关闭关注指南

    this.setData({
      shopGuideGZH: false
    })

  },

  //绑定微信
  bingWx: function(event) {
    util.httpPushFormId(event.detail.formId);
    name = event.detail.value.message;
    this.checktextareaStr(name)
  },
  checktextareaStr: function(message) {
    if (message.length <= 0 || message == " ") {
      this.showToast("输入姓名才能绑定~", 2000);
    } else {
      var result = this.chkstrlen(message);
      if (result == "false" || message.length > 5) {
        this.showToast("姓名有误，请重新输入", 2000);
        return;
      }
      var token = app.globalData.user.userToken;
      var open_id = app.globalData.user.wxcx_openid;
      var url = config.Host + "wallet/addWxOpenid?" + config.Version + "&token=" + token + "&openid=" + open_id + "&u_name=" + message;
      util.http(url, this.resultData);
    }
  },
  resultData: function(data) {
    this.setData({
      is_showTixianView: false
    })
    if (data.status) {
      this.showToast(data.message, 2000);
    }
  },

  chkstrlen: function(str) {
    var strlen = "";
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) //是汉字
      {} else //不是汉字
        strlen = "false";
    }
    return strlen;
  },

  //提现说明 验证身份
  addWx: function(event) {
    util.httpPushFormId(event.detail.formId);
    // money = this.data.sections_first[this.data.currentTab];
    money = tixianMoney;
    name = event.detail.value.namemessage;
    identity = event.detail.value.idmessage;
    if (this.data.idcardFlag == 0) {
      if (name.length == 0) {
        this.showToast('姓名不能为空', 2000);
        return;
      }
      // if (identity.length == 0) {
      //   this.showToast('身份证号不能为空', 2000);
      //   return;
      // }
    } else {
      if (name.length == 0) {
        this.showToast('姓名不能为空', 2000);
        return;
      }
    }


    // this.AuthenticationHttp(name, identity);
    if (this.data.stylecurrentTab == 0) //微信提现
    {
      this.httpCheckData(money, name, identity); //微信提现
    } else { //银行卡提现
      wx.navigateTo({
        url: '../myCard/myCard?' + '&showtype=selectCard' + '&money=' + money,
      })
    }
  },

  AuthenticationHttp: function(name, id) {
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var url = config.Host + 'wallet/addCardDoType?' + config.Version + '&token=' + token + '&idcard=' + id;
    util.http(url, this.AuthenticationhandleData);
  },
  AuthenticationhandleData: function(data) {
    if (data.status == 1) {
      this.setData({
        is_showTixianView: false,
        idcardFlag: 1,
      })

      this.httpCheckData(money, name); //微信提现
    } else {
      this.showToast(data.message, 2000);
    }
  },
  tixianview_close: function() {
    this.setData({
      is_showTixianView: false,
      is_bingTixianView: false
    })
  },

  //下一步
  submittixian: function(e) {
    //如果没有输入则终止操作
    if (this.data.inputValue.length <= 0) {
      this.showToast("请输入提现金额", 2000);
      return;
    }
    tixianMoney = e.detail.value.namemessage;


    //选择的金额
    // var selectblance = this.data.sections_first[this.data.currentTab];
    var selectblance = tixianMoney;

    var canTX = false;
    canTX = Number(selectblance) >= Number(this.data.minicill) && Number(selectblance) <= Number(this.data.extract);


    if ((isVipTX == 0)  && Number(selectblance) < Number(this.data.minicill) ){
      this.setData({
        showkaitongVip: false
      })
      return
    }
    if ((isVipTX == 0) && Number(selectblance) > Number(this.data.extract)*0.3 ) {
      this.setData({
        showkaitongVip: false
      })
      return
    }

    //会员才能提现
    if (this.data.is_vip == false) {
      return;
    }

    if(!canTX){

      if (isOK == -1) {

        this.setData({ 
          showkaitongVip: false

        })
        return
      }

      if(isOK == -2){

        this.setData({ 
          supplementMemberShow: true

        })
        return
      }

        this.setData({ //提现额度不足
          // upperForwardShow: true
          showNeedTiXian: true

        })
    

      return
    }

    var number_tixian = Number(tixianMoney);
    if (number_tixian < Number(this.data.minicill) || isNaN(number_tixian)) {
      // this.showToast("单次提现金额不得低于" + this.data.minicill + '元', 2000);

      this.setData({
        showNeedTiXian: true
      })
      return;
    }
    //检查是否验证身份 若没有去验证身份
    if (this.data.idcardFlag == 0) {
      this.setData({
        is_showTixianView: 'true'
      })
      return;
    }

    
    this.tixianFunc(selectblance);



  },
  tixianFunc: function(selectblance) {
    if (this.data.stylecurrentTab == 0) //微信提现
    {
      this.http_getwxOpenid();
    } else { //银行卡提现
      wx.navigateTo({
        url: '../myCard/myCard?' + '&showtype=selectCard' + '&money=' + selectblance,
      })
    }
  },
  //获取绑定微信wxOpenId
  http_getwxOpenid: function() {
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var url = config.Host + 'wallet/getWxOpenid?' + config.Version + '&token=' + token;
    util.http(url, this.getwxOpenid);
  },
  getwxOpenid: function(data) {
    if (data.status == 1 && data.data == 1) { //授权过
      wxOpenId = data.wxOpenId;
      // money = this.data.sections_first[this.data.currentTab];
      money = tixianMoney;

      this.setData({
        is_showTixianView: true
      })

    } else { //没授权
      this.setData({
        is_bingTixianView: true
      })
    }
  },
  //微信提现
  httpCheckData: function(money, name, identity) {
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var url = '';
    if (this.data.idcardFlag == 1) {
      url = config.Host + 'wallet/wxDepositAdd?' + config.Version + '&token=' + token + '&collect_name=' + name + '&collect_bank_code=' + app.globalData.user.wxcx_openid + '&message=微信提现' + '&money=' + money;
    } else {
      // url = config.Host + 'wallet/wxDepositAdd?' + config.Version + '&token=' + token + '&collect_name=' + name + '&collect_bank_code=' + app.globalData.user.wxcx_openid + '&identity=' + identity +'&message=微信提现' + '&money=' + money;

      url = config.Host + 'wallet/wxDepositAdd?' + config.Version + '&token=' + token + '&collect_name=' + name + '&collect_bank_code=' + app.globalData.user.wxcx_openid + '&message=微信提现' + '&money=' + money;
    }
    util.http(url, this.handleData);
  },
  handleData: function(data) {
    this.setData({
      is_showTixianView: false,
    })
    if (data.status == 1) {

      if (wx.getStorageSync("NOT_FIRST_TIXIAN_SUCCESS") == true) { //非第一次提现成功
        this.setData({
          showTXgoSign: true
        })
      } else { //第一次提现成功
        this.setData({
          ForwardSuccessShow: true
        })
        wx.setStorageSync("NOT_FIRST_TIXIAN_SUCCESS", true)
      }
      this.http_getwalletData(); //重新刷新钱包数据
    } else {
      // isOK = data.isOk;
      // if (data.isOk == -1) {
      //   this.setData({
      //     supplementMemberShow: false
      //   })


      // }else
        this.showToast(data.message, 2000);
    }
  },
  // 好物1元起兑
  fowardlimittap: function(e) {
    if (this.data.showNeedTiXian == true) {
      switch (e.currentTarget.dataset.id) {
        case (0):
          {
            //超级分享日
            wx.navigateTo({
              url: '../../../sign/inviteFriends/inviteFriends',
            })
            break;
          }
        case (1):
          {
            //赚钱任务
            wx.navigateTo({
              url: '../../../sign/sign',
            })
            break;
          }
        case (2):
          {
            //APP首页
            wx.switchTab({
              url: "../../../shouye/shouye",
            }) // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
            break;
          }
        case (3):
          {
            //特价商品列表
            wx.navigateTo({
              url: '../../../shouye/SpecialOffer/SpecialOffer',
            })
            break;
          }
      }
    }
    this.setData({
      upperGoYiFuShow: false,
      upperForwardShow: false,
      ForwardSuccessShow: false,
    })
  },
  upperlimittap: function() {
    this.setData({
      upperGoYiFuShow: false,
      upperForwardShow: false,
      ForwardSuccessShow: false,
    })
  },
  open_yifu_iknow: function() {
    this.setData({
      openYifuDialogShow: false
    });
  },

  //继续去赚钱任务
  forwardsuccesstap: function() {
    this.setData({
      ForwardSuccessShow: false,
      showTXgoSign: false
    })
    //赚钱任务
    wx.navigateTo({
      url: '../../../sign/sign',
    })
  },
  closeBtn: function() {
    this.setData({
      ForwardSuccessShow: false
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  loginsubmit: function(e) {
    var formId = e.detail.formId;
    util.httpPushFormId(e.detail.formId);
  },
  closePop:function(){
    this.setData({
      supplementMemberShow:false,
      showkaitongVip:false

    })
  },
  memberSubmit:function(){
    this.setData({
      supplementMemberShow: false
    })
  },

   kaitongVipTap: function () {

    //  var url = '../../member/member?memberComefrom=' + "mine";
    //  wx.navigateTo({
    //    url: url,
    //  })

     if (wx.getStorageSync("showVipGuide")) {
       wx.navigateTo({
         url: '../../addMemberCard/addMemberCard',
       })
     } else {
       wx.setStorageSync('showVipGuide', true)
       wx.navigateTo({
        //  url: '../../member/member?memberComefrom=' + "mine",
         url: '../../addMemberCard/addMemberCard?memberComefrom=mine',
       })
     }


     this.setData({
       showkaitongVip:false
     })


  },


  xuFeiVipTap: function () {

    var url = '../../addMemberCard/addMemberCard'
    wx.navigateTo({
      url: url,
    })
    this.setData({
      showkaitongVip: false,
      supplementMemberShow: false

    })


  }
  //   function clearNoNum:(obj)
  // 	{
  //     //先把非数字的都替换掉，除了数字和.
  //     obj.value = obj.value.replace(/[^\d.]/g, "");
  //     //必须保证第一个为数字而不是.
  //     obj.value = obj.value.replace(/^\./g, "");
  //     //保证只有出现一个.而没有多个.
  //     obj.value = obj.value.replace(/\.{2,}/g, ".");
  //     //保证.只出现一次，而不能出现两次以上
  //     obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

  //     var inputMoney = $("#inputMoney").val();
  //     if("" == inputMoney){
  //   $("#moneyShow").html("0.00");
  // }else {
  //   $("#moneyShow").html(inputMoney);
  // }
  // $("#inputMoneyMessage").html("");
  //   }
})