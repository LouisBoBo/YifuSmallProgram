// pages/sign/shareQshop/shareQshop.js
import config from '../../../config';
var util = require('../../../utils/util.js');
var app = getApp();

var signTask;//赚钱任务 对象
var task_type=0;
var shareXShop_signIndex;//SignFragment.signIndex
var shareXShop_doValue ;// SignFragment.doValue;
var shareXShop_doNum ;//SignFragment.doNum
var shareXShop_jiangliName ;//SignFragment.jiangliID
var shareXShop_jiangliValue;//SignFragment.jiangliValue
var shareXShop_complete;//签到任务完成状态 默认false

var shareJson="";
var token;
var user_id;
var is_share;
Page({

  data: {
    signFinishShow:false,
    signFinishDialog: {
      top_tilte: "",//任务完成弹窗 顶部标题
      tilte: "",//任务完成弹窗 标题
      contentText: "",//任务完成弹窗 具体类容
      leftText: "",//任务完成弹窗 左边按钮
      rigthText: ""//任务完成弹窗 右边按钮
    },
    shareTitle:"",
    haveNoData: false,
    Upyun: config.Upyun,
    selectindex: -1,
    curPage: 1,
    pageSize: 10,
    datalist: []
  },

  onLoad: function (options) {
    // 调用应用实例的方法获取全局数据
    // let app = getApp();
    // toast组件实例
    new app.ToastPannel();

    signTask = wx.getStorageSync("SIGN-TASK");
    // console.log(signTask);
    shareXShop_complete = signTask.complete;
    task_type = signTask.task_type;
    shareXShop_signIndex = signTask.index;
    shareXShop_doValue = signTask.value;
    shareXShop_doNum = signTask.num;
    shareXShop_jiangliName = signTask.jiangliDanWei + signTask.jiangliContent;
    shareXShop_jiangliValue = signTask.jiangliValue;

    token = app.globalData.user.userToken;
    user_id = app.globalData.user.user_id;
    // console.log(user_id);
    // token="DU9M44U0X4XCHKD8AIYK"
    this.oneYuan_httpData();
    this.getJson();

  },
  onShow:function(){
    if (is_share)
    {
      var shareNum = parseInt(shareXShop_doValue);//分享品质美衣 要分享的件数
      this.signShareQShop(shareNum);//分享品质美衣
      util.task_share_Statistics("qdfx", "702", "7");//赚钱任务分享成功统计

      is_share = false;
    }
  },

  //获取是否是一元购
  oneYuan_httpData: function () {
    var that = this;
    var url = config.Host + 'cfg/on_off_3_7?' + config.Version;
    util.http(url, that.oneYuanData);
  },
  oneYuanData: function (data) {
    var that = this;
    if (data.status == 1) {

      app.globalData.oneYuanData = 0;
      app.globalData.typePageHide = 0;

      util.get_discountHttp(function (data) {
        if (data.status == 1) {
          var money = data.one_not_use_price.toFixed(2);
          var shop_deduction = Number(data.shop_deduction) > 1 ? 1.0 : data.shop_deduction;

          that.setData({
            reduceMoney: money,
            shop_deduction: shop_deduction != undefined ? shop_deduction : 0.0
          })
        }
        that.initData();
      });
    }
  },

  initData: function () {
    var dataUrl = config.Host + "shop/queryCondition" +
      "?token=" + token +
      "&pager.curPage=" + this.data.curPage +
      "&pager.pageSize=" + this.data.pageSize +
      "&type1=6&type_name=" +config.Version;
    // console.log(dataUrl);
    util.httpNeedLogin(dataUrl, this.cutShopCode,function(){});
  },

  cutShopCode: function (data) {
    // console.log(data);
    wx.stopPullDownRefresh();
    var that = this;
    if (that.data.curPage == 1 &&
     (!data||!data.listShop || !data.listShop.length||data.listShop.length <= 0)) {
      that.setData({ 
        haveNoData: true ,
        datalist: []
        });
      return;
    }

    if(data.status == 1)
    {
      var isVip = data.isVip != undefined ? data.isVip : '';
      var maxType = data.maxType != undefined ? data.maxType : '';

      that.data.isVip = isVip;
      that.data.maxType = maxType;
    }
    var shop_code_cut = '';
    var cutJson = {};
    var dataListTemp = that.data.curPage==1? []:that.data.datalist;
    // for (var i = 0; i < data.listShop.length; i++) {
    for (var i in data.listShop){
      shop_code_cut = data.listShop[i].shop_code.substring(1, 4);
      cutJson = data.listShop[i];
      cutJson["cut_shop_code"] = shop_code_cut;
      var shop_se_price = (cutJson.shop_se_price).toFixed(1);
      // cutJson["shop_se_price"] = (cutJson.shop_se_price * 0.9).toFixed(1);

      //何波修改2018-4-4
      if (app.globalData.oneYuanData == 0)//是1元购
      {
        // var se_price = app.globalData.oneYuanValue;
        var se_price = (cutJson.wxcx_shop_group_price * 1).toFixed(1);
        if (that.data.isVip > 0) {
          se_price = util.get_discountPrice(shop_se_price, that.data.shop_deduction, that.data.reduceMoney, that.data.maxType);
        }
        cutJson.shop_se_price = (se_price * 1).toFixed(1);
        cutJson.shop_price = shop_se_price;
      } else {
        cutJson["shop_se_price"] = (cutJson.shop_se_price).toFixed(1);
        cutJson.supp_label = '';
      }
      dataListTemp.push(cutJson)
    }
    that.setData({
      haveNoData: false,
      datalist: dataListTemp,
      supply_isShow:app.showSub

    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      haveNoData: false,
      curPage: 1,
      selectindex: -1
    })
    that.initData();
  },
  onReachBottom: function () {
    var that = this;
    that.setData({
      curPage: that.data.curPage+1
    })
    that.initData();
  },
  dialog_close: function () {
    this.setData({
      signFinishShow: false
    });
  },
  btn_left:function(){
    this.toSignPager();
  },
  btn_rigth:function(){
    this.toMainPager();
  },
  //买买买去首页
  toMainPager: function () {
    wx.switchTab({
      url: '../../shouye/shouye',
    });
  },

  //去赚钱页面
  toSignPager: function () {
    wx.navigateTo({
      url: '../sign',
    });
  },

  //生成分享的合成图片
  getCanvasPictiure: function (price) {
    var that = this;
    wx.showLoading({
      title: '请稍后',
      mask: true,
    });
    var shareshop = that.data.datalist[that.data.selectindex];
    var sharePic = shareshop.four_pic.split(",")[2];
    if (!sharePic) {
      sharePic = shareshop.def_pic;
    }
    var show_pic = config.Upyun + shareshop.cut_shop_code + "/" + shareshop.shop_code + "/" + sharePic;

    util.getCanvasPictiure("shareCanvas", show_pic, price, '商品分享',function (tempFilePath) {
      wx.hideLoading();
      if (tempFilePath != undefined && tempFilePath != null) {
        that.setData({
          tempFilePath: tempFilePath
        })
      } else {
        that.setData({
          tempFilePath: show_pic
        })
      }
    })
  },

  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      var shareshop = this.data.datalist[this.data.selectindex];
      // console.log(shareshop);
      // shareshop.shop_name
      if(!that.data.shareTitle){
        that.setData({
          shareTitle: shareshop.shop_name
        });
      }
      // var sharePic = shareshop.four_pic.split(",")[2];
      // if (!sharePic){
      //   sharePic = shareshop.def_pic;
      // }
      // var show_pic = config.Upyun + shareshop.cut_shop_code + "/" + shareshop.shop_code + "/" + sharePic;
      var shareTitle = '点击购买👆' + '【' + shareshop.shop_name + '】' + "今日特价" + shareshop.wxcx_shop_group_price + "元！";
      return {
        title: shareTitle,
        path: "/pages/shouye/detail/detail?isShareFlag=true&shop_code=" + shareshop.shop_code + "&user_id=" + user_id,
        imageUrl: that.data.tempFilePath,
        success: function (res) {
          // var shareNum = parseInt(shareXShop_doValue);//分享品质美衣 要分享的件数
          // that.signShareQShop(shareNum);//分享品质美衣
          // util.task_share_Statistics("qdfx", "702", "7");//赚钱任务分享成功统计
        },
        fail: function (res) {
          // 转发失败
        }
      };

    }else{
      //右上角转发
      var shareshop = this.data.datalist[0];
      var shop_name = "";
      var show_pic = "";
      var sharePic = shareshop.four_pic.split(",")[2];
      if (!sharePic) {
        sharePic = shareshop.def_pic;
      }
      if (this.data.selectindex != undefined && this.data.selectindex!=-1){
        shareshop = this.data.datalist[this.data.selectindex];
        shop_name = shareshop.shop_name;
        show_pic=that.data.tempFilePath
      } else if (shareshop){
        shop_name = shareshop.shop_name;
        show_pic = config.Upyun + shareshop.cut_shop_code + "/" + shareshop.shop_code + "/" + sharePic;
      }
      var shareTitle = '点击购买👆' + '【' + shareshop.shop_name + '】' + "今日特价" + shareshop.wxcx_shop_group_price + "元！";
      return {
        title: shareTitle,
        path: "/pages/shouye/detail/detail?isShareFlag=true&shop_code=" + shareshop.shop_code + "&user_id=" + user_id,
        imageUrl: show_pic,
      }
    }
  },

  //获取二级类目
  geType2SuppLabe: function (supp_label, shop_se_price, shop_code) {
    var that = this;
    that.setData({
      shareTitle: ""
    });
    var dataUrl = config.Host + "shop/queryShopType2" +
      "?token=" + token +
      "&shop_code=" + shop_code + config.Version;
    util.httpNeedLogin(dataUrl, function(data){
      if (typeof (supp_label) == 'undefined' || supp_label == "null" || !supp_label) {
        supp_label = "衣蝠";
      }
      var type2 = data.type2;
      if (!type2) {
        type2 = "美衣";
      }

      //设置分享的文案
      if (!shareJson) {
        that.setData({
          shareTitle: supp_label + "品牌" + type2 + "仅售" + shop_se_price + "元，次月返" + shop_se_price + "元,等于0元",
        });
      } else {
        var str1 = shareJson.replace('\$\{replace\}', supp_label);
        var str2 = str1.replace('\$\{replace\}', type2);
        var str3 = str2.replace('\$\{replace\}', '' + shop_se_price);
        var str4 = str3.replace('\$\{replace\}', '' + shop_se_price);
        that.setData({
          shareTitle: str4
        });
      }

    },function(){});
    // wx.request({
    //   url: dataUrl,
    //   data: {},
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     // 来自页面内转发按钮
    //     // console.log(res.target)
    //     // if (typeof (supp_label) == 'undefined' || supp_label == "null" || !supp_label) {
    //     //   var supp_label_id = res.data.supp_label_id;
    //     // }

    //     if (typeof (supp_label) == 'undefined' || supp_label == "null" || !supp_label) {
    //       supp_label = "衣蝠";
    //     }
    //     var type2 = res.data.type2;
    //     if (!type2){
    //       type2 = "美衣";
    //     }

    //     //设置分享的文案
    //     if (!shareJson){
    //       that.setData({
    //         shareTitle: supp_label + "品牌" + type2 + "仅售" + shop_se_price + "元，次月返" + shop_se_price + "元,等于0元",
    //       });
    //     }else{
    //       var str1 = shareJson.replace('\$\{replace\}', supp_label);
    //       var str2 = str1.replace('\$\{replace\}', type2);
    //       var str3 = str2.replace('\$\{replace\}', '' + shop_se_price);
    //       var str4 = str3.replace('\$\{replace\}', '' + shop_se_price);
    //       that.setData({
    //         shareTitle: str4
    //       });
    //     }
       
    //   }
    // })
  },

  getJson: function () {
    shareJson = "";
    var that = this;
    var dataUrl = config.Upyun + "paperwork/paperwork.json";
    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = dataUrl + "";

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
      url: dataUrl,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res.data.wxdddfx.title);


        app.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });

        shareJson = res.data.wxdddfx.title
      },
      fail: function (error) {
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })
  },

  sharetap:function(){
    is_share = true;
    if (this.data.selectindex<0){
      this.showToast("请选择您要分享的美衣喔！", 3000);
    }
  },

  shoplist_tap: function (event) {
    // console.log(event.currentTarget.dataset.shop_code);
    var shop_code = event.currentTarget.dataset.shop_code;
    wx.navigateTo({
      url: "../../shouye/detail/detail?shop_code=" + shop_code,
    });
  },


  item_select: function (event) {
    var index = event.currentTarget.dataset.selectindex;
    if (this.data.selectindex == index){
      this.setData({
        selectindex: -1
      });
      return;
    }
    this.setData({
      selectindex: index
    });
    var shareshop = this.data.datalist[this.data.selectindex];
    this.geType2SuppLabe(shareshop.supp_label,shareshop.shop_se_price,shareshop.shop_code);
    this.getCanvasPictiure(shareshop.shop_se_price);
  },


  //计数分享件数 并调用赚钱任务接口
  signShareQShop: function (shareNum) {
    if (shareXShop_complete){
        return;
    }
    var num = 0;
    var that = this;
    var shareXShopNumKey = shareXShop_signIndex + "shareXShopNum";
    var dataString = new Date().toDateString();

    num = wx.getStorageSync(shareXShopNumKey);

    if (!num || wx.getStorageSync("share_now_time") != dataString) {
      num = 0;
    }
    num++;
    wx.setStorageSync("share_now_time", dataString);
    
    if (num < shareNum) {// 小于要求的分享次数
      if (shareXShop_doNum == 1) {// 就是一次性发放奖励 是现金奖励 就需要每次调接口 分次奖励
        var showText = "再分享" + (shareNum - num) + "件可完成任务喔~";
        // console.log(showText);
        this.showToast(showText, 4000);
        wx.setStorageSync(shareXShopNumKey, num);
        return;
      }
    }
    // console.log(num);

    var signUrl = config.Host + "signIn2_0/signIning"+
      "?token=" + token +
      "&share=true"+
      // "&mac=00%3A03%3A7f%3Aaa%3Abb%3A00"+
      "&index_id=" + shareXShop_signIndex+
      "&day=" + wx.getStorageSync("SIGN_DAY") + config.Version;
    //分享完成赚钱任务接口
    util.http(signUrl, function (data) {
      if (data.status!=1) {
          return;
      }

      wx.setStorageSync(shareXShopNumKey, num);

      if (num < shareNum) {
        var showText = "分享成功奖励" +
          shareXShop_jiangliValue + shareXShop_jiangliName + "，还有" + (shareNum - num) + "次机会喔~";
        that.showToast(showText, 4000);
      } else if (num >= shareNum) {//任务完成
        shareXShop_complete = true;
        wx.setStorageSync("sharemeiyichuandaback", true);//保存标志 完成弹窗回到赚钱页面弹出
        util.backToSignPager('../sign');
        // var showText = shareXShop_jiangliValue * shareXShop_doNum + shareXShop_jiangliName + "奖励已经存入账户，赶紧去买买买吧~";
        // that.setData({
        //   signFinishShow: true,
        //   signFinishDialog: {
        //     top_tilte: "任务完成！",
        //     tilte: "分享成功~",
        //     contentText: showText,
        //     leftText: "任务列表",
        //     rigthText: "买买买"
        //   },
        // });
      }
    });
  },


})