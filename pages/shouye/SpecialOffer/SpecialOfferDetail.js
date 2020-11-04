import config from '../../../config';
import ToastPannel from '../../../common/toastTest/toastTest.js';
//获取本地化数据
// var postdata = require('../../../data/shouyedata.js');
var app = getApp();
var token = null;
var publicUtil = require('../../../utils/publicUtil.js');
var util = require('../../../utils/util.js');
var WxNotificationCenter = require('../../../utils/WxNotificationCenter.js');
//浏览件数相关//
var firstCome;//第一次滑到底时候 防止来回滑动计算次数
var isForceLook;
var isForceLookLimit;
var xShop_complete;
var task_type;
var xShop_signIndex;
var xShop_doValue;
var xShop_doNum;
var xShop_jiangliName;
var xShop_jiangliValue;
var xShop_shopsName;
var singvalue;
var shop_type;//1普通商品 2特价商品
//浏览件数相关//

Page({

  data: {
    uppertittle: '温馨提示',
    upperdistribution: "本商品为特价商品，完成1个衣蝠赚钱小任务即可以特价购买。更享受0元购特权，购买美衣返还全部购衣款入账户余额",
    upperbuttontitle: "去衣蝠赚钱小任务赚钱",
    picLink: '',//拼接了又盘云和商品编号的链接
    shop_code: '',
    showDialog: false,
    noDataFlag: true,
    starCount: 0,
    postlist: {},
    evaluateList: {},
    evaluateData: [],//评价数据集合
    shop_attr: '',//商品属性拼接字符串
    sizeData: [],//商品尺码数据
    strShopTag: '',//该商品商品标签字符串
    shopTagData: [],//商品标签数据
    shopAttrData: [],//商品属性数据
    stockTypeData: [],//商品库存分类表
    stockColorData: [],//商品库存颜色
    stockSizeData: [],//商品库存尺寸
    stockPicData: [],////商品库存图片
    stockNameData:[],//商品属性名
    stockCount: 0,//库存个数
    stockPrice: 0,//库存价格
    colorIndex: 0,//选中的颜色角标
    sizeIndex: 0,//选中的尺寸角标
    stock_type_id: '',//库存id
    type_data: '',//二级类目
    selectColorId: '',//选中颜色id
    selectSizeId: '',//选中尺寸id
    buyCount: 1,//购买数量
    Upyun: config.Upyun,
    Version: '',
    Channel: "",
    shop: {},
    shop_name: '',
    shop_se_price: 0,
    shop_price: 0,
    save_money: 0,
    discount: 0,
    reduceMoney: 0,//已抵扣余额
    topData: [],
    activityIndex: 0,
    imagePathData: [],//详情图片路径集合
    shop_pic: '',//详情页图片集合
    eva_count: 0,//评论数
    zeroOrderNum: 0,//0元购订单数量
    progress_color: "100",
    progress_type: '100',
    progress_work: '100',
    progress_cost: '100',
    curPage: 1,
    pageSize: 10,
    strLongTag: '',//长标签
    fristShortTag: '',//第一个短标签
    screenHeight: 0,
    screenWidth: 0,
    picHeight: 0,
    listItemHeight: 0,
    listItemWidth: 0,
    is_look: false,
    zeroBuyDialogShowFlag: false,
    moneyDiscountShowFlag: false,
    moneyDiscount: "0",//累计已抵扣的余额
    oneYuanDiscriptionTitle:"余额抵扣说明",
    getYiDouShow: false,//如何获得衣豆
    isOneYuanClick: false,//是否点击1元购
    oneyuanValue: 1,

    moneyDiscount: {
      tilte: "余额抵扣说明",
      contentText: "余额不仅可以提现，还可以下单时抵扣10%的商品价（活动商品除外）",//任务完成弹窗 具体类容
      leftText: "知道了",
      rigthText: "去赚余额"
    },

    scanTipsShow: false,
    signFinishShow: false,//任务完成弹窗是否显示
    signFinishDialog: {
      top_tilte: "",//任务完成弹窗 顶部标题
      tilte: "",//任务完成弹窗 标题
      contentText: "",//任务完成弹窗 具体类容
      leftText: "",//任务完成弹窗 左边按钮
      rigthText: ""//任务完成弹窗 右边按钮
    },


    sharePicLink: '',
    isShowShare: false,//分享弹窗
    isOneShowShare: false,//1元购分享弹窗
    isOneShowMoney: app.globalData.oneYuanValue > 0?app.globalData.oneYuanValue:1,//
    shareJson: '',//后台获取的分享标题
    shareTitle: '',//分享处理后的标题
    adData: [],//顶部轮播广告
    adDataAll: [],//全部广告
    isSHowAdFlag: false,//是否显示顶部广告轮播
    getRandomTempData: [],
    detailHeight: 0,
    isShowRedPacked: false,//悬浮红包

    signAdData: ['sign_ad1.png', 'sign_ad2.png', 'sign_ad3.png', 'sign_ad4.png', 'sign_ad5.png'],//底部签到图片链接
    signBottomLink: '',
    isShowSignBottomAd: false,
    isShareFlag: false,//分享出去直接跳进来的

    fristDistance: 1000,
    startDis: 0,
    endDis: 0,

    recommendTitleData: [],
    recommendListData: [],
    recommendPage: 1,
    recommend_type_name: '热卖',
    recommend_type1: '6',
    currentTab: 0,//推荐点击的条目

    isShowCustomTv: false,
    isSignActiveShop: false,//true代表活动商品

    haveCounts: 3,//活动商品剩余件数

    animationData: {},

    isFixFlag: false,
    isRecommendFix: false,
    recommendLoadFlag: true,
    evaluateLoadMore: true,
    isNewUserShow: false,
    isNewUserFlag: false,
    isOreadyToken: false,

    isSignClose: false,//控制zhuanqian开关

    bottomOneYuan: false,//控制购买方式
    bottomBtnTv: '单独购买',
    bottomOneBtnTv: '￥1.0\n1元购买',
  },
  onLoad: function (option) {

    if (!app.parent_id) {
      app.parent_id = option.user_id
    }

    if (options.user_id) {
      // app.shareToHomepage3()

    }

    app.oneYuan_httpData();//获取1元购
    
    console.log("option.isSign----", option)
    var that = this;
    if (option.user_id && app.globalData.user && app.globalData.user.userToken) {
      util.bindRelationship(option.user_id, app.globalData.user.userToken);//绑定用户上下级关系
    }
    if (option.user_id) {
      WxNotificationCenter.addNotification("testNotificationItem1Name", function () {
        if (app.globalData.user && app.globalData.user.userToken) {
          util.bindRelationship(option.user_id, app.globalData.user.userToken);//绑定用户上下级关系
        }
      }, this);
    }
    if (option.isNewUserFlag) {
      this.data.isNewUserFlag = true;
    }
    if (option.isSign) {//分享赢提现
      this.data.isNewUserFlag = true;
      // if (app.globalData.user && app.globalData.user.userToken) {
      //   that.data.isOreadyToken = true;
      //   if (app.globalData.user.firstLogin) {//新用户

      //   } else {//老用户
      //     wx.redirectTo({
      //       url: '../../sign/sign?firstLogin=false',
      //     })
      //   }
      // } else {
      //   that.data.isOreadyToken = false;
      //   WxNotificationCenter.addNotification("testNotificationItem1Name", function () {
      //     if (app.globalData.user && app.globalData.user.userToken) {
      //       that.data.isOreadyToken = true;
      //       if (app.globalData.user.firstLogin) {//新用户

      //       } else {//老用户
      //         wx.redirectTo({
      //           url: '../../sign/sign?firstLogin=false',
      //         })
      //       }
      //     } else {
      //       that.data.isOreadyToken = false;
      //     }
      //   }, this);
      // }
    }
    this.data.isShareFlag = option.isShareFlag;
    shop_type = option.shop_type;

    wx.createSelectorQuery();
    if (option.isSignActiveShop) {
      this.data.isSignActiveShop = option.isSignActiveShop;
    }
    this.setData({
      isSignActiveShop: this.data.isSignActiveShop,
      bottomOneBtnTv: "￥" + (app.globalData.oneYuanValue * 1).toFixed(1) + '\n' + app.globalData.oneYuanValue +"元购买",
      oneyuanValue: app.globalData.oneYuanValue,
    });

    app.ToastPannel();
    this.getRcommendTitleData();
    WxNotificationCenter.addNotification("shopNotificationItem1Name", function () {
      if (recommendTitleData.length == 0) {
        that.getRcommendTitleData();
      }
    }, this);


    that.data.shop_code = option.shop_code;

    if (this.data.isSignActiveShop) {
      var count = wx.getStorageSync("ssss" + option.shop_code);
      if (count) {
        this.setData({ haveCounts: count })
      } else {
        var s = Math.floor(Math.random() * 25 + 3);
        wx.setStorageSync("ssss" + option.shop_code, s);
        this.setData({ haveCounts: s });
      }
    }


    var rand = parseInt(Math.random() * 5);
    this.data.signBottomLink = this.data.signAdData[rand];
    if (null != app.globalData.user) {
      token = app.globalData.user.userToken;
    } else {
      token = null;
    }
    this.setData({ token: token })
    isForceLookLimit = option.isForceLookLimit;
    isForceLook = option.isForceLook;
    if (!this.data.isShareFlag) {
      if (null != this.data.token) {
        publicUtil.getBalanceNum(function (isSHow) {
          if (isSHow) {
            that.setData({ isShowRedPacked: true })
          } else {
            that.setData({ isShowRedPacked: false })
          }
        });
      } else {
        this.setData({ isShowRedPacked: true })
      }
    }
    //浏览X件任务
    if (isForceLook || isForceLookLimit) {
      // that.setData({ is_look: true });
      firstCome = true;
      var signTask = wx.getStorageSync("SIGN-TASK");

      xShop_complete = signTask.complete;
      task_type = signTask.task_type;
      xShop_signIndex = signTask.index;
      xShop_doValue = signTask.value;
      xShop_doNum = signTask.num;
      xShop_jiangliName = signTask.jiangliDanWei + signTask.jiangliContent;
      xShop_jiangliValue = signTask.jiangliValue;
      xShop_shopsName = signTask.shopsName;

      try {
        singvalue = parseInt(xShop_doValue.split(",")[1])
      } catch (e) {
        singvalue = parseInt(xShop_doNum);
      }
      var dataString = new Date().toDateString();
      var saveDay = wx.getStorageSync("scanshop_tips_day");
      if (saveDay != dataString) {
        that.setData({
          is_look: false,//侧边浏览先不显示
          scanTipsShow: true
        });
        wx.setStorageSync("scanshop_tips_day", dataString);
      } else {
        that.setData({
          is_look: true,
          scanTipsShow: false
        });
      }
    }

    //详情相关接口调用
    this.setData({
      signBottomLink: this.data.signBottomLink,
      starCount: 5,
      Version: config.Version,
      // Channel: config.ChannelPost,
      activityIndex: 0,
      topData:
      [{ name: '详情', }
      // { name: '参数', },
      // { name: '评价', },
      ],

      adDataAll:
      [{ link: 'icon_duobao_new', name: '0元团购', award: 'IPHONE X', id: 0 },
      { link: 'icon_fenxiangri', name: '超级分享日', award: '150元/人', id: 0 },
      { link: 'icon_honbaoyu', name: '千元红包雨 ', award: '1000个', id: 0 },
      { link: 'icon_liulan_sign', name: '浏览2分钟超值特价 ', award: '5.0', id: 1 },
      { link: 'icon_liulan_sign', name: '浏览2分钟SHOW社区', award: '5.0', id: 1 },
      { link: 'icon_fenxiang_nom', name: '分享1件时尚穿搭', award: '5.0', id: 1 },
      { link: 'icon_liulan_sign', name: '浏览1分钟冬装特卖', award: '3.0', id: 1 },
      { link: 'icon_liulan_sign', name: '浏览2篇穿搭话题 ', award: '3.0', id: 1 },
      { link: 'icon_fenxiang_nom', name: '分享1件冬日毛衣', award: '2.0', id: 1 },
      { link: 'icon_liulan_sign', name: '浏览2件新款卫衣', award: '3.0', id: 1 },
      { link: 'icon_gouwuche_sign', name: '加1件商品到购物车', award: '3.0', id: 1 }]
    })
    var that = this;
    if (shop_type == 2)
    {
      this.getData(7, function (data) {
        that.dealBackData(0, data);
      });
    }else{
      this.getData(0, function (data) {
        that.dealBackData(0, data);
      });
    }
    
    this.getData(3, function (data) {
      that.dealBackData(3, data);
    });
    this.getDataJson(4, function (data) {
      that.dealBackData(4, data);
    });
    // this.getData(5, function (data) {
    //   that.dealBackData(5, data);
    // });
    if (app.globalData.user && app.globalData.user.userToken) {
      this.getData(6, function (data) {//开关
        that.dealBackData(6, data);
      });
    } else {
      WxNotificationCenter.addNotification("testNotificationItem1Name_isSignClose", function () {
        if (app.globalData.user && app.globalData.user.userToken) {
          that.getData(6, function (data) {//开关
            that.dealBackData(6, data);
          });
        }
      }, this);
    }
    this.getTopAdData();
    this.get_discountHttp();

    wx.getSystemInfo({
      success: function (res) {
        var picHeight = res.windowWidth * 9 / 6;
        var listItemHeight = (res.windowWidth * 9 / 6) * 0.96 * 0.504;
        var listItemWidth = res.windowWidth * 0.96 * 0.504;
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          picHeight: picHeight,
          listItemHeight: listItemHeight,
          listItemWidth: listItemWidth,
        });
      }
    });

  },

  getRcommendTitleData: function () {
    var basesData = wx.getStorageSync("shop_tag_basedata");
    var titleDataTemp = [];
    var recommendTitleData = [];
    if (basesData) {
      titleDataTemp = basesData.data.shop_type;
    }
    if (titleDataTemp) {
      for (var i = 0; i < titleDataTemp.length; i++) {
        if (titleDataTemp[i].parent_id == 0 && titleDataTemp[i].is_show == 1) {
          var str = (titleDataTemp[i].ico).split(',')[0];
          var str1 = str.split('/')[2].split('.')[0];
          titleDataTemp[i]['link'] = this.data.Upyun + 'small-iconImages/zzq/' + str1;
          recommendTitleData.push(titleDataTemp[i]);
        }
      }
    }
    var by = function (name) {//数组排序函数
      return function (o, p) {
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
          a = parseInt(o[name]);
          b = parseInt(p[name]);
          if (a === b) { return 0; }
          if (typeof a === typeof b) { return a < b ? -1 : 1; }
          return typeof a < typeof b ? -1 : 1;
        }
        else { throw ("error"); }
      }
    }
    recommendTitleData.sort(by("sequence"));
    this.setData({
      recommendTitleData: recommendTitleData,
    })
    if (recommendTitleData.length > 0) {
      this.data.recommend_type_name = recommendTitleData[0].type_name;
      this.data.recommend_type1 = recommendTitleData[0].id;
    }

  },
  dealBackData(flag, data) {//处理接口返回的数据
    var that = this;
    if (flag == 0) {

      if (data.status != 1) {
        this.setData({ noDataFlag: true });
        this.showToast(data.message, 2000);
      } else {
        data.eva_count = '0';
        this.setData({ noDataFlag: false });
        // that.data.topData[2].name = '评价(' + data.eva_count + ')';
        that.setData({
          postlist: data,
          shop: data.shop,
          shop_name: data.shop.shop_name,
          shop_pic: data.shop.shop_pic,
          eva_count: data.eva_count,
          // zeroOrderNum: data.zeroOrderNum,
          topData: that.data.topData,
          shop_attr: data.shop.shop_attr,
          shopAttrData: data.attrList,
          strShopTag: data.shop.shop_tag,
          // isShowCustomTv: true,
        })

        this.cutShopCode();
        this.ForDight();
        this.getImagePath();
        this.getShopAttrData();
        this.getShopTagData();

        // var animation2 = wx.createAnimation({
        //   duration: 1000,
        //   timingFunction: 'ease',
        // })
        // animation2.translateX(-50).opacity(1).step()
        // that.setData({
        //   animationData: animation2.export()
        // })
        setTimeout(function () {
          that.setData({
            isShowCustomTv: true,
          });
          var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
            delay: 5000,
          })
          animation.translateX(50).opacity(0).step()
          that.setData({
            animationData: animation.export()
          })
        }, 2000);

        setTimeout(function () {
          that.setData({
            isShowCustomTv: false,
          });
        }, 8000);
      }
      this.queryMultipleNodes();

    } else if (flag == 1) {
      var dealData = that.dateFormat(data.comments);
      for (var i = 0; i < dealData.length; i++) {
        var pic = dealData[i].pic;
        var picData = [];
        if (pic != null && '' != pic) {
          picData = pic.split(",");
          dealData[i]['pic_data'] = picData;
        }
        try {
          if (dealData[i].suppComment != undefined && dealData[i].suppComment != null) {
            dealData[i]['frist_replay'] = (dealData[i].suppComment)[0].supp_content;
          }
          if (dealData[i].suppEndComment != undefined && dealData[i].suppEndComment != null) {
            dealData[i]['second_replay'] = (dealData[i].suppEndComment)[0].supp_content;
          }
          if (dealData[i].comment != undefined && dealData[i].comment != null) {
            dealData[i]['second_judge'] = (dealData[i].comment)[0].content;
            var pic2 = (dealData[i].comment)[0].pic;
            var picData2 = [];
            if (pic2 != null && '' != pic2 && pic2 != undefined) {
              picData2 = pic2.split(",");
              dealData[i]['pic_data2'] = picData2;
            }
          }
        } catch (e) {

        }
      }
      that.setData({
        evaluateData: dealData,
      })
    } else if (flag == 2) {
      that.data.stockTypeData = data.stocktype;
      this.getStockTypeSizeColor();
    } else if (flag == 3) {
      var sharePicLink;
      if (data.data == undefined || data.data.pic == undefined) {
        sharePicLink = that.data.Upyun + "small-iconImages/zzq/icon_share_defalut.png";
      } else {
        sharePicLink = that.data.Upyun + data.data.pic;
      }
      that.setData({
        sharePicLink: sharePicLink,
      })
    } else if (flag == 4) {//获取分享文案
      that.data.shareJson = data.wxcx_wxdddfx.title;
    } else if (flag == 5) {//获取推荐列表
      if (data.status == 1) {
        if (this.data.recommendPage == 1) {
          this.data.recommendListData = [];
        }
        var page = this.data.recommendPage + 1;
        this.data.recommendPage = page;
        this.newshoplist(data.listShop);
      } else {
        this.showToast(data.message, 2000);
      }
      this.data.recommendLoadFlag = true;
    } else if (flag == 6) {//开关，控制zhuanqian入口
      // console.log("%%%%%%%%%%%%%%", data)
      if (data.data == 0) {
        var paymoney = (this.data.shop_se_price - this.data.reduceMoney).toFixed(1);
        this.setData({
          isSignClose: true,
          bottomBtnTv: '￥' + (paymoney > 0 ? paymoney : 0.01) + '\n单独购买',
        })
      } else {
        if (this.data.isShareFlag) {
          this.setData({ isShowRedPacked: true })
        }
      }
    }

    if (app.globalData.oneYuanData == 0)//1元购
    {
      //是否是0元购
      if (app.globalData.oneYuanFree > 0) {//新用户0元购
        that.setData({
          bottomOneYuan: true,
          bottomBtnTv: '￥' + this.data.shop_price + '\n单独购买',
          bottomOneBtnTv: '￥0.0\n0元购买',
        });
      } else {
        var paymoney = (this.data.shop_price - this.data.reduceMoney).toFixed(1);
        that.setData({
          bottomOneYuan: true,
          bottomBtnTv: '￥' + (paymoney > 0 ? paymoney : 0.01) + '\n单独购买',
          bottomOneBtnTv: "￥" + (app.globalData.oneYuanValue*1).toFixed(1) + '\n' + app.globalData.oneYuanValue + "元购买"
        });
      }
    } else {
    
      var paymoney = (this.data.shop_se_price - this.data.reduceMoney).toFixed(1);
      this.setData({
        bottomOneYuan: false,
        bottomBtnTv: ' ￥' + (paymoney > 0 ? paymoney : 0.01) + '\n立即购买',
      });
    }
  },
  newshoplist: function (obj) {
    for (var i = 0; i < obj.length; i++) {
      var new_clde = obj[i].shop_code.substr(1, 3);
      var new_pic = new_clde + '/' + obj[i].shop_code + '/' + obj[i].def_pic;
      obj[i].def_pic = new_pic;
      var shop_se_price = 0;
      if (this.data.isNewUserFlag) {
        shop_se_price = ((obj[i].shop_se_price) * (this.data.shop.shop_rebate) * 1).toFixed(0);
      } else {
        shop_se_price = (obj[i].shop_se_price).toFixed(1);
      }
      var newshopname = obj[i].shop_name;
      if (newshopname.length > 12) {
        newshopname = '... ' + newshopname.substr(newshopname.length - 12, 12);
      }
      if (this.data.currentTab == 0) {
        var discount;
        if (this.data.isNewUserFlag) {
          discount = ((obj[i].shop_se_price) * (this.data.shop.shop_rebate) * 1 / obj[i].shop_price * 10).toFixed(0);

        } else {
          discount = (obj[i].shop_se_price / obj[i].shop_price * 10).toFixed(1);
          obj[i].shop_price = (obj[i].shop_price * 1).toFixed(1);
        }

        obj[i]["discount"] = discount;
      }
      if (this.data.isNewUserFlag) {
        obj[i].shop_price = (obj[i].shop_price * 1).toFixed(0);
      } else {
        obj[i].shop_price = (obj[i].shop_price * 1).toFixed(1);
      }
      obj[i].shop_name = newshopname;
      obj[i].shop_se_price = shop_se_price;

      //何波修改2018-4-4
      if (app.globalData.oneYuanData == 0)//是1元购
      {
        // var se_price = app.globalData.oneYuanValue;
        var se_price = (obj[i].wxcx_shop_group_price * 1).toFixed(1);
        obj[i].shop_price = obj[i].shop_se_price;
        obj[i].shop_se_price = (se_price * 1).toFixed(1);
      } else {
        obj[i].shop_se_price = shop_se_price;
        obj[i].supp_label = '';
      }
    }
    var all_shoplists = this.data.recommendListData;
    for (var j = 0; j < obj.length; j++) {
      all_shoplists.push(obj[j]);
    }
    this.setData({
      recommendListData: all_shoplists,
      supply_isShow: app.showSub

    })
  },
  queryMultipleNodes() {
    const that = this
    setTimeout(() => {
      wx.createSelectorQuery().select('.shop-detail-out').fields({
        dataset: true,
        size: true,
        scrollOffset: true,
        properties: ['scrollX', 'scrollY']
      }, function (res) {
        that.setData({
          detailHeight: res.height
        })
        console.log("res.height", that.data.detailHeight);
      }).exec()
    }, 300)

  },
  getTopAdData: function () {//获取顶部广告轮播数据
    var that = this;
    // 循环N次生成随机数 
    for (var i = 0; i < 1000; i++) {
      // 只生成4个随机数 
      if (that.data.getRandomTempData.length < 4) {
        that.generateRandom();
      } else {
        break;
      }
    }
    for (var i = 0; i < that.data.getRandomTempData.length; i++) {
      that.data.adData.push(that.data.adDataAll[that.data.getRandomTempData[i]])
    }
    this.setData({
      adData: that.data.adData,
    });
  },
  // 生成随机数的方法 
  generateRandom: function () {
    var that = this;
    var rand = parseInt(Math.random() * 11);
    for (var i = 0; i < that.data.getRandomTempData.length; i++) {
      if (that.data.getRandomTempData[i] == rand) {
        return;
      }
    }
    that.data.getRandomTempData.push(rand);
  },
  handletouchStart: function (event) {
    this.data.startDis = event.touches[0].clientY;
  },
  handletouchmove: function (event) {

    console.log('event', event)
    let pageX = event.touches[0].pageX;
    let pageY = event.touches[0].clientY;
    var temp = pageY - this.data.startDis;
    if (temp != 0) {
      this.data.fristDistance = this.data.fristDistance + temp;
    }


    //屏幕边界判断
    if (pageX < 30 || pageY < 30)
      return;
    if (pageX > this.data.screenWidth - 30)
      return;
    if (pageY > this.data.screenHeight - 30)
      return;
    this.setData({
      ballTop: event.touches[0].pageY - 30,
      ballLeft: event.touches[0].pageX - 30,
    });
  },

  getShopTagData: function () {//获得商品标签的数据
    // shopTagData
    var that = this;
    var arrTemp = [];
    var arrTag = [];
    var strTemp = '';
    arrTag = this.data.strShopTag.split(',');
    var shopTagAll = [];
    shopTagAll = wx.getStorageSync("shop_tag_basedata").data.shop_tag;
    for (var i = 0; i < arrTag.length; i++) {
      for (var j = 0; j < shopTagAll.length; j++) {
        if (arrTag[i] == shopTagAll[j].id) {
          if (shopTagAll[j].tag_name.endsWith('含)')) {
            if ('10' == shopTagAll[j].parent_id) {
              strTemp = "主面料成份含量:" + shopTagAll[j].tag_name;
            } else {
              strTemp = "羽绒服充绒量:" + shopTagAll[j].tag_name;
            }

          } else {
            arrTemp.push(shopTagAll[j]);
          }
          break;
        }
      }
    }
    var fristShortTag = '';
    if (arrTemp.length > 0) {
      if (strTemp) {
        fristShortTag = arrTemp[0].tag_name;
        arrTemp.shift();
      }
    }
    this.setData({ shopTagData: arrTemp, strLongTag: strTemp, fristShortTag: fristShortTag })
    // var by = function (name) {//数组排序函数
    //   return function (o, p) {
    //     var a, b;
    //     if (typeof o === "object" && typeof p === "object" && o && p) {
    //       a = parseInt(o[name]);
    //       b = parseInt(p[name]);
    //       if (a === b) { return 0; }
    //       if (typeof a === typeof b) { return a < b ? -1 : 1; }
    //       return typeof a < typeof b ? -1 : 1;
    //     }
    //     else { throw ("error"); }
    //   }
    // }
    // arrTemp.sort(by("sequence"));
  },
  showShopStock: function (colorId, sizeId) {//显示商品的库存
    var that = this;
    var dataTemp = [];
    dataTemp = that.data.stockTypeData;
    if (colorId != -1 && sizeId != -1) {
      for (var i = 0; i < dataTemp.length; i++) {
        var color_size = "";
        if(colorId)
        {
          color_size = colorId;
        }
        if (sizeId) {
          color_size = colorId + ":" + sizeId;
        }

        var sType = dataTemp[i];
        if (sType.color_size == color_size) {
         
          var stock = sType.stock;
          var price = sType.original_price;
          
          that.data.stock_type_id = sType.id;
          if (that.data.isOneYuanClick)//1元购
          {
            var se_price = app.globalData.oneYuanValue;
            price = (se_price * 1).toFixed(1);
            if (app.globalData.oneYuanFree > 0)//新用户0元购
            {
              price = '0.0';
            }
          }else{
            price = (price - that.data.reduceMoney > 0) ? (price - that.data.reduceMoney).toFixed(1):0.01;
          }
          that.setData({ stockCount: stock, stockPrice: price })
          break;
        }
      }
    }
  },
  getStockTypeSizeColor: function () {//得到该商品的颜色和尺码
    var that = this;
    var dataTemp = [];
    dataTemp = that.data.stockTypeData;
    var arrColorList = [];
    var arrSizeList = [];
    var arrNameList = [];
    var colorIds = [];
    var listPic = [];
    var sizeIds = [];
    var shopAttrData = that.data.shopAttrData;
    for (var i = 0; i < dataTemp.length; i++) {
      var sType = dataTemp[i];
      var color_size = sType.color_size;
      var arrColorSize = color_size.split(":");
      //根据id查询颜色名字
      for (var j = 0; j < shopAttrData.length; j++) {
        if (arrColorSize[0] == shopAttrData[j].id) {//查询颜色
          var flag = false;
          for (var z = 0; z < arrColorList.length; z++) {//如果有则不加入
            if (shopAttrData[j].attr_name == arrColorList[z].name) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            var jsons = {};
            jsons['name'] = shopAttrData[j].attr_name;
            jsons['parent_id'] = shopAttrData[j].parent_id;
            jsons['id'] = arrColorSize[0];
            arrColorList.push(jsons);
            colorIds.push(arrColorSize[0]);
            if (sType.pic == undefined) {
              listPic.push(that.data.picLink + that.data.shop.def_pic)
            } else {
              listPic.push(that.data.picLink + sType.pic);
            }


          }
          break;
        }
        var flagSizeId = false;
        for (var g = 0; g < sizeIds.length; g++) {//添加尺码id
          if (arrColorSize[1] == sizeIds[g]) {
            flagSizeId = true;
            break;
          }
        }
        if (!flagSizeId) {
          sizeIds.push(arrColorSize[1]);
        }
      }
    }
    if (arrColorList.length > 0) {
      that.data.selectColorId = arrColorList[0].id;
    }

    sizeIds.sort(function (a, b) {
      return a - b;
    })
    if (sizeIds.length > 0) {
      that.data.selectSizeId = sizeIds[0];
    }
    for (var i = 0; i < sizeIds.length; i++) {
      for (var j = 0; j < shopAttrData.length; j++) {
        if (sizeIds[i] == shopAttrData[j].id) {//查询尺码
          var jsons = {};
          jsons['name'] = shopAttrData[j].attr_name;
          jsons['parent_id'] = shopAttrData[j].parent_id;
          jsons['id'] = sizeIds[i];
          if (jsons['name'] && jsons['id']) {
            arrSizeList.push(jsons)
          }
          break;
        }
      }
    }

    //根据属性值查找属性名
    var dataList = [arrColorList, arrSizeList];
    for (var l = 0; l<dataList.length;l++)
    {
      var list = dataList[l];
      for (var k = 0; k < list.length; k++) {
        var parent_id = list[k].parent_id;
        var findflag = false;
        for (var j = 0; j < shopAttrData.length; j++) {
          var id = shopAttrData[j].id;
          var name = shopAttrData[j].attr_name;
          if (id == parent_id) {
            arrNameList.push(name);
            findflag = true;
            break;
          }
        }
        if (findflag == true) {
          break;
        }
      }
    }
    

    this.setData({ stockColorData: arrColorList, stockSizeData: arrSizeList, stockPicData: listPic, stockNameData: arrNameList});
    this.showShopStock(that.data.selectColorId, that.data.selectSizeId);
  },
  getShopAttrData: function () {//获得该商品属性数据(参数里尺码参考)
    var that = this;
    var str = [];
    var sizeData1 = [];
    str = that.data.shop_attr.split("_");
    for (var i = 0; i < str.length; i++) {
      var strson = str[i].split(",");
      sizeData1.push(strson);
    }
    var rows = 0;
    if (sizeData1.length == 0) {
      return;
    }
    var sizeData2 = [];
    for (var i = 0; i < sizeData1.length; i++) {
      var strTemp = sizeData1[i];
      if (strTemp[0] == '501') {
        sizeData2.push(strTemp);
        var len = strTemp.length;
        if (len > rows) {
          rows = len;
        }
      }
    }
    rows = rows - 2;
    var lSize = parseInt(rows / 5);
    var mond = rows % 5;
    if (mond > 0) {
      lSize = lSize + 1;
    }
    var p = 1;
    // var strFenGe = "分割";
    var sizeDataNew = [];
    for (var i = 0; i < lSize; i++) {
      for (var j = 0; j < sizeData2.length; j++) {
        var strY = sizeData2[j];
        var str = new Array(6);
        str[0] = strY[1];
        var len = strY.length;

        if ((5 * p - 3) < len) {
          str[1] = strY[(5 * p - 3)];
        }
        if ((5 * p - 2) < len) {
          str[2] = strY[(5 * p - 2)];
        }
        if ((5 * p - 1) < len) {
          str[3] = strY[(5 * p - 1)];
        }
        if ((5 * p) < len) {
          str[4] = strY[5 * p];
        }
        if ((5 * p + 1) < len) {
          str[5] = strY[5 * p + 1];
        }

        sizeDataNew.push(str);

      }
      p++;
      // if (i != lSize - 1) {
      //   sizeDataNew.push(strFenGe);
      // }
    }

    var arrLast = [];
    for (var i = 0; i < sizeDataNew.length; i++) {//属性每行循环
      var arrTemp1 = [];
      var arr = sizeDataNew[i];
      for (var j = 0; j < arr.length; j++) {//单行对应的属性名

        var id = arr[j];
        var flag = false;
        for (var z = 0; z < that.data.shopAttrData.length; z++) {//根据id查询属性名
          if (id == that.data.shopAttrData[z].id) {
            flag = true;
            arrTemp1.push(that.data.shopAttrData[z].attr_name)
            break;
          }
        }
        if (!flag) {//如果没有查到对应的属性名字，添加一个空字符串
          arrTemp1.push('null')
        }
      }
      if (arrTemp1.length > 1 && '' != arrTemp1[1]) {
        arrLast.push(arrTemp1);
      }
    }
    this.setData({ sizeData: arrLast });
  },
  getImagePath: function () {//获得商品详情页详情的图片集合
    var that = this;
    var imagePathData = that.data.shop_pic.split(',');
    for (var i = 0; i < imagePathData.length; i++) {
      if (imagePathData[i]) {
        if (imagePathData[i].indexOf("reveal_") >= 0 || imagePathData[i].indexOf("real_") >= 0 || imagePathData[i].indexOf("detail_") >= 0) {
          that.data.imagePathData.push(imagePathData[i])
        }
      }
    }
    this.setData({
      imagePathData: that.data.imagePathData,
    })
  },


  touchMove: function (e) {
    if (!this.data.isRecommendFix && !this.data.isFixFlag && this.data.isShareFlag) {
      this.setData({ isSHowAdFlag: false })
    }
  },
  touchEnd: function (e) {
    if (!this.data.isRecommendFix && !this.data.isFixFlag && this.data.isShareFlag) {
      this.setData({ isSHowAdFlag: true })
    }
  },
  // 页面里的点击  ---start
  upperlimittap: function () {//新用户弹窗关闭
    this.setData({ isNewUserShow: false })
  },
  upperlimittap: function () {//跳去赚钱
    this.setData({ isNewUserShow: false })
    wx.redirectTo({
      url: "../../sign/sign?firstLogin=true",
    })
  },
  recommendShopItemClick: function (event) {//推荐商品条目点击
    var path = '';
    var shopcode = event.currentTarget.dataset.shop_code;
    if (this.data.isNewUserFlag) {
      path = '../detail/detail?' + "shop_code=" + shopcode + '&isNewUserFlag=' + this.data.isNewUserFlag;
    } else {
      path = '../detail/detail?' + "shop_code=" + shopcode;
    }
    wx.redirectTo({
      url: path,
    })
  },
  recommendTitleClick: function (event) {//商品推荐头的点击
    var that = this;
    this.data.currentTab = event.currentTarget.dataset.index;
    var type_name = event.currentTarget.dataset.name;
    var id = event.currentTarget.dataset.id;
    this.data.recommendPage = 1;
    this.data.recommend_type_name = type_name;
    this.data.recommend_type1 = id;
    this.getData(5, function (data) {
      that.dealBackData(5, data)
    })
    this.setData({ currentTab: this.data.currentTab });
  },
  zeroBuyCloseClick: function () {//0元购弹窗上关闭按钮
    this.setData({ zeroBuyDialogShowFlag: false });
  },
  zeroBuyToSign: function () {//0元购弹窗上去赚钱
    wx.redirectTo({
      url: "../../sign/sign",
    })
  },

  zeroBuyNowClick: function () {//0元购弹窗上立即购买
    this.setData({ zeroBuyDialogShowFlag: false });
    var that = this;
    this.setData({ showDialog: true });
    if (that.data.stockTypeData.length == 0) {
      this.getData(2, function (data) {
        that.dealBackData(2, data);
      });
    } else {
      this.showShopStock(that.data.selectColorId, that.data.selectSizeId);
    }
  },

  //单独购买
  buyOrder: function () {
    var that = this;
    this.setData({ showDialog: true });
    if (that.data.stockTypeData.length == 0) {
      this.getData(2, function (data) {
        that.dealBackData(2, data);
      });
    } else {
      this.showShopStock(that.data.selectColorId, that.data.selectSizeId);
    }
  },

  moneyDiscountClick: function () {//余额抵扣点击
    this.setData({
      moneyDiscountShowFlag: true,
      moneyDiscount: this.data.moneyDiscount,
      reduceMoney: this.data.reduceMoney,
    })
  },
  //余额抵扣弹窗点击知道了 关闭
  getYiDouBtn: function () {
    this.setData({ moneyDiscountShowFlag: false })
  },

  //获取可抵扣余额
  get_discountHttp: function () {
    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var oldurl = config.Host + 'order/getZeroOrderDeductible?' + config.Version + '&token=' + token;
    util.http(oldurl, that.discount_data);
  },
  discount_data: function (data) {
    if (data.status == 1 && data.order_price>0) {
      var shop_deduction = Number(data.shop_deduction) > 1 ? 1.0 : data.shop_deduction;
      this.setData({
        moneyDiscount: data.order_price.toFixed(1),
        reduceMoney: data.one_not_use_price.toFixed(1),
        shop_deduction: shop_deduction != undefined ? shop_deduction : 0.0
      })
    }else{
      this.setData({
        moneyDiscount: 0,
        reduceMoney: 0,
        shop_deduction:0.0,
      })
    }

    // var paymoney = this.data.shop_price - this.data.reduceMoney;
    // this.setData({
    //   bottomBtnTv: ' ￥' + paymoney + '\n单独购买',
    // });

    if (app.globalData.oneYuanData == 0)//1元购
    {
      //是否是0元购
      if (app.globalData.oneYuanFree > 0) {//新用户0元购
        this.setData({
          bottomOneYuan: true,
          bottomBtnTv: '￥' + this.data.shop_price + '\n单独购买',
          bottomOneBtnTv: '￥0.0\n0元购买',
        });
      } else {
        var paymoney = (this.data.shop_price - this.data.reduceMoney).toFixed(1);
        this.setData({
          bottomOneYuan: true,
          bottomBtnTv: '￥' + ((paymoney>0)?paymoney:0) + '\n单独购买',
          bottomOneBtnTv: "￥" + (app.globalData.oneYuanValue * 1).toFixed(1) + '\n' + app.globalData.oneYuanValue + "元购买"
        });
      }
    } else {
      var paymoney = (this.data.shop_se_price - this.data.reduceMoney).toFixed(1);
      this.setData({
        bottomOneYuan: false,
        bottomBtnTv: ' ￥' + (paymoney > 0 ? paymoney : 0.01) + '\n立即购买',
      });
    }
  },

  // btnLeftClick: function () {//余额抵扣弹窗点击知道了
  //   this.setData({ moneyDiscountShowFlag: false })
  // },
  // btnRightClick: function () {//余额抵扣弹窗点击去赚钱
  //   wx.redirectTo({
  //     url: "../../sign/sign",
  //   })// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
  // },

  suppClick: function () {//供应商的点击

    wx.redirectTo({
      url: '../../listHome/brandsDetail/brandsDetail?' +
      "class_id=" + this.data.shop.supp_label_id +
      "&navigateTitle=" + this.data.shop.supp_label
    })


  },
  signBottomAdCloseClick: function () {
    this.setData({ isShowSignBottomAd: false })
  },
  redPackeClick: function () {//悬浮红包
    if (this.data.isShareFlag) {
      wx.redirectTo({
        url: "../../sign/sign",
      })
      return;
    }
    var that = this;
    if (null == this.data.token) {
      util.toAuthorizeWx(function (isSuccess) {
        if (isSuccess) {
          if (app.globalData.user != null) {
            that.data.token = app.globalData.user.userToken;
          }
          publicUtil.getBalanceNum(function (isSHow) {
            if (isSHow) {
              that.data.isShowRedPacked = true;
            } else {
              that.data.isShowRedPacked = false;
            }
            that.setData({ isShowRedPacked: that.data.isShowRedPacked });
          });
        } else {
          return;
        }
      });
    } else {
      wx.navigateTo({
        url: '../../sign/withdrawLimit/withdrawLimit?isBalanceLottery=true',
      })
    }
  },

  toInviteFriendsClick: function () {//跳转到邀请好友
    var that = this;
    this.setData({
      isShowShare: false
    })
    var share_pic = '';
    if (this.data.shop.four_pic) {
      var picArray = this.data.shop.four_pic.split(',');
      if (picArray.length > 2) {
        share_pic = picArray[2] + '!450';
      } else {
        share_pic = this.data.shop.def_pic + '!450';
      }
    } else {
      share_pic = this.data.shop.def_pic + '!450';
    }
    wx.navigateTo({
      url: 'inviteFriends/invite?title=' + that.data.shareTitle + '&link=' + that.data.picLink + share_pic + '&shop_code=' + that.data.shop.shop_code,
    })
  },
  openSignClick: function () {//打开赚钱页
    wx.redirectTo({ url: "../../sign/sign", })// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
  },

  clickOneShare: function () {//1元购分享
    this.setData({
      isOneShowShare: true,
    })
    this.top_shopHttp();
  },
  cancelOneShare: function (e) {//取消1元购分享
    this.setData({ isOneShowShare: false })
    // util.httpPushFormId(e.detail.formId);
  },

  //获取二级类目
  top_shopHttp: function () {
    var that = this;
    var token = "";
    if (app.globalData.user != null) {
      token = app.globalData.user.userToken;
    }
    var oldurl = config.Host + 'shop/queryShopType2?' + config.Version + '&token=' + token + '&shop_code=' + that.data.shop_code;
    util.http(oldurl, that.type_data);
  },
  type_data: function (data) {
    if (data.status == 1) {
      this.setData({
        type_data: data.type2
      })

      var supp_label = '衣蝠';
      if (this.data.shop.supp_label) {
        supp_label = this.data.shop.supp_label;
      }

      var sharemoney = app.globalData.oneYuanFree>0 ? '0' : app.globalData.oneYuanValue;

      var shareJson = '快来' + app.globalData.oneYuanValue +'元拼' + '【' + supp_label + '正品' + data.type2 + '】,' + '专柜价' + this.data.shop.shop_se_price + '元!';
      this.data.shareTitle = shareJson;
      this.setData({
        isOneShowMoney: sharemoney
      })
    }
  },

  clickShare: function () {//分享按钮

    var shareJson = this.data.shareJson;
    var supp_label = '衣蝠';
    if (this.data.shop.supp_label) {
      supp_label = this.data.shop.supp_label;
    }
    var str1 = shareJson.replace('\$\{replace\}', this.data.shop_se_price);
    var str2 = str1.replace('\$\{replace\}', supp_label);
    var str3 = str2.replace('\$\{replace\}', '' + this.data.shop.shop_name);
    var str4 = str3.replace('\$\{replace\}', '' + this.data.shop_se_price);
    this.data.shareTitle = str4;
    this.setData({ isShowShare: true })

    this.top_shopHttp();
  },
  cancelShare: function (e) {//取消分享按钮
    this.setData({ isShowShare: false })
    util.httpPushFormId(e.detail.formId);

  },

  selectColorClick: function (event) {//选择颜色
    var that = this;
    const index = event.currentTarget.dataset.index;
    this.setData({ colorIndex: index, selectColorId: event.currentTarget.dataset.id })
    this.showShopStock(that.data.selectColorId, that.data.selectSizeId);
  },
  selectSizeClick: function (event) {//选择尺寸
    var that = this;
    const index = event.currentTarget.dataset.index;
    this.setData({ sizeIndex: index })
    this.showShopStock(that.data.selectColorId, that.data.selectSizeId);
  },
  toBuyClick: function () {//立即购买
    var that = this;
    if (this.data.isNewUserFlag) {
      if (this.data.isOreadyToken) {//已经登录
        wx.redirectTo({
          url: "../../sign/sign?firstLogin=true",
        })

      } else {
        util.toAuthorizeWx(function (isSuccess) {
          if (isSuccess) {
            that.data.isOreadyToken = true;
            if (app.globalData.user && app.globalData.user.userToken && !app.globalData.firstLogin) {
              wx.redirectTo({
                url: "../../sign/sign?firstLogin=true",
              })
            }
          } else {
            return;
          }
        });
      }
      return;
    }
    var that = this;

    if (this.data.isSignClose) {
      this.setData({ showDialog: true });
      if (that.data.stockTypeData.length == 0) {
        this.getData(2, function (data) {
          that.dealBackData(2, data);
        });
      } else {
        this.showShopStock(that.data.selectColorId, that.data.selectSizeId);
      }
    } else {
      // this.setData({ zeroBuyDialogShowFlag: true });
      that.buyOrder();
    }

    that.setData({ isOneYuanClick: false });
  },

  oneBuyClick: function () {//1元购买
    var that = this;
    that.setData({
      isOneYuanClick: true,
      buyCount:'1',
    });

    that.clickOneShare();
  },

  closeSkuDialog: function () {//关闭立即购买弹窗
    //chushihua shuju
    var that = this;
    if (that.data.stockColorData.length > 0) {
      that.data.selectColorId = that.data.stockColorData[0].id;
    } else {
      that.data.selectColorId = '';
    }
    if (that.data.stockSizeData.length > 0) {
      that.data.selectSizeId = that.data.stockSizeData[0].id;
    } else {
      that.data.selectSizeId = '';
    }
    this.setData({ showDialog: false, selectColorId: that.data.selectColorId, selectSizeId: that.data.selectSizeId, colorIndex: 0, sizeIndex: 0 });
  },

  btnReduceClick: function () {//购买数量减

    var that = this;
    that.data.buyCount = that.data.buyCount - 1;
    if (that.data.buyCount < 1) {
      that.data.buyCount = 1;
    }
    this.setData({ buyCount: that.data.buyCount });

  },
  btnAddClick: function () {//购买数量加
    var that = this;
    if (this.data.stockCount > that.data.buyCount) {
      if (!this.data.isOneYuanClick) {
        that.data.buyCount = that.data.buyCount + 1;
      }
    } else {
      this.showToast('库存不足！', 3000);
    }
    if (that.data.buyCount > 2) {
      that.data.buyCount = 2;
      this.showToast('抱歉，数量有限，最多只能购买两件噢！', 3000);
    } else if (this.data.isOneYuanClick) {
      that.data.buyCount = 1;
      this.showToast('1元购单次只能选择1件哦~', 3000);
    }
    this.setData({ buyCount: that.data.buyCount });
  },
  onTapClick: function (event) {//详情、参数、评价的切换
    var thiscopy;
    thiscopy = this;
    const index = event.currentTarget.dataset.index;
    if (thiscopy.data.activityIndex == index) {
      return;
    }

    this.setData({ activityIndex: index });
    if (index == 2) {
      // this.loadProgress();
      this.setProgress();
      var that = this;
      if (that.data.curPage == 1 && that.data.evaluateData.length == 0) {
        that.getData(1, function (data) {
          that.dealBackData(1, data)
        });
      }
    }
  },
  // 页面里的点击   ----end
  dateFormat: function (data) {
    var that = this;
    for (var i = 0; i < data.length; i++) {
      var date = that.getMyDate(data[i].add_date);
      data[i].add_date = date;

      if (data[i].comment_type == 1) {
        data[i].comment_type = '好评';
      } else if (data[i].comment_type == 2) {
        data[i].comment_type = '中评';
      } else if (data[i].comment_type == 3) {
        data[i].comment_type = '差评';
      }
    }
    return data;
  },
  // 切割字符串并添加新字段
  cutShopCode: function () {
    var thiscopy;
    thiscopy = this;
    var shop_code_cut = '';
    shop_code_cut = thiscopy.data.shop.shop_code.substring(1, 4);
    thiscopy.data.shop["cut_shop_code"] = shop_code_cut;
    var link = thiscopy.data.Upyun + shop_code_cut + '/' + thiscopy.data.shop.shop_code + '/'
    thiscopy.setData({ shop: thiscopy.data.shop, picLink: link })
  },

  // 设置进度条
  setProgress: function () {
    var that = this;
    if (that.data.postlist.eva_count == '0') {
      this.setData({
        progress_color: "100",
        progress_type: '100',
        progress_work: '100',
        progress_cost: '100',
      });
    } else {
      var color_count = that.data.postlist.color_count * 100;
      var type_count = that.data.postlist.type_count * 100;
      var work_count = that.data.postlist.work_count * 100;
      var cost_count = that.data.postlist.cost_count * 100;
      var eva_count = that.data.postlist.eva_count;
      var color = color_count / eva_count > 100 ? 100 : color_count / eva_count;
      var progress_type = type_count / eva_count > 100 ? 100 : type_count / eva_count;
      var work = work_count / eva_count > 100 ? 100 : work_count / eva_count;
      var cost = cost_count / eva_count > 100 ? 100 : cost_count / eva_count;

      this.setData({
        progress_color: parseInt(color),
        progress_type: parseInt(progress_type),
        progress_work: parseInt(work),
        progress_cost: parseInt(cost),
      });
    }
  },
  //获得年月日      得到日期oTime  
  getMyDate: function (str) {
    var oDate = new Date(str);
    var oYear = oDate.getFullYear();
    var oMonth = oDate.getMonth() + 1;
    var oDay = oDate.getDate();
    // oHour = oDate.getHours(),
    // oMin = oDate.getMinutes(),
    // oSen = oDate.getSeconds(),
    var oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay);//最后拼接时间  
    return oTime;
  },
  //补0操作  
  getzf: function (num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  },
  // 四舍五入 Dight要格式化的 数字，How要保留的小数位数。
  ForDight: function () {//Dight, How
    var that = this;
    // that.data.shop_price = Math.round(that.data.shop.shop_price * Math.pow(10, 1)) / Math.pow(10, 1);
    // that.data.discount = Math.round(that.data.shop.shop_se_price * 0.9 * 10 / that.data.shop.shop_price * Math.pow(10, 1)) / Math.pow(10, 1);
    // that.data.reduceMoney = Math.round(that.data.shop.shop_se_price * 0.1 * Math.pow(10, 1)) / Math.pow(10, 1);
    var shop_se_price;
    if (this.data.isSignActiveShop) {
      shop_se_price = that.data.shop.shop_se_price;
    } else {
      if (this.data.isNewUserFlag) {
        shop_se_price = that.data.shop.shop_se_price * that.data.shop.shop_rebate;
      } else {
        shop_se_price = that.data.shop.shop_se_price;
      }

    }
    var shop_price = that.data.shop.shop_price * 1;
    if (this.data.isNewUserFlag) {
      that.data.shop_se_price = (shop_se_price * 1).toFixed(0);
      that.data.shop_price = shop_price.toFixed(0);
      that.data.discount = (shop_se_price * 10 / shop_price).toFixed(0);
      that.data.reduceMoney = ((that.data.shop.shop_se_price - shop_se_price) * 1).toFixed(0);
    } else {

      if (app.globalData.oneYuanData == 0)//1元购
      {
        var se_price = app.globalData.oneYuanValue;
        that.data.shop_se_price = (se_price * 1).toFixed(1);
        that.data.shop_price = (shop_se_price * 1).toFixed(1);
        if (app.globalData.oneYuanFree > 0)//新用户0元购
        {
          that.data.shop_se_price = '0.0';
        }
      } else {
        that.data.shop_se_price = (shop_se_price * 1).toFixed(1);
        that.data.shop_price = shop_price.toFixed(1);
      }
      that.data.discount = (shop_se_price * 10 / shop_price).toFixed(1);
      // that.data.reduceMoney = ((that.data.shop.shop_se_price - shop_se_price) * 1).toFixed(1);
    }
    var save_money = ((shop_price - shop_se_price) * 1).toFixed(1);
    this.setData({
      shop_se_price: that.data.shop_se_price,
      shop_price: that.data.shop_price,
      discount: that.data.discount,
      reduceMoney: that.data.reduceMoney,
      save_money: save_money,
    })
    // return Dight;
  },
  onReady: function () {
    if (this.data.isShareFlag) {
      this.setData({ isShowSignBottomAd: true, isSHowAdFlag: true, })
    }
    // 页面渲染完成  
    // this.loadProgress();
    // this.setProgress();
    // this.getScrollOffset();

  },
  getScrollOffset: function () {
    wx.createSelectorQuery().selectViewport().scrollOffset(function (res) {
      // res.id      // 节点的ID
      // res.dataset // 节点的dataset
      // res.scrollLeft // 节点的水平滚动位置
      // res.scrollTop  // 节点的竖直滚动位置
      console.log("res.scrollTop", res.id)
    }).exec()
  },
  getRect: function () {
    var that = this;
    wx.createSelectorQuery().select('.bottom-image-pic').boundingClientRect(function (rect) {
      // rect.id      // 节点的ID
      // rect.dataset // 节点的dataset
      // rect.left    // 节点的左边界坐标
      // rect.right   // 节点的右边界坐标
      // rect.top     // 节点的上边界坐标
      // rect.bottom  // 节点的下边界坐标
      // rect.width   // 节点的宽度
      // rect.height  // 节点的高度
      // console.log("rect.top", rect.top)
      // console.log("rect.height", rect.height) 
      if (rect.top <= -rect.height) {
        if (that.data.isFixFlag == false && that.data.isRecommendFix == false) {
          that.setData({
            isFixFlag: true,
            isSHowAdFlag: false,
          })
        }
      } else {
        if (that.data.isFixFlag == true && that.data.isRecommendFix == false) {
          that.setData({
            isFixFlag: false,
            // isSHowAdFlag: true,
          })
        }
      }
    }).exec()
  },
  getRect2: function () {
    var that = this;
    wx.createSelectorQuery().select('.shop-recommend-tv').boundingClientRect(function (rect) {
      if (rect.top <= -rect.height) {//-rect.height
        if (that.data.isRecommendFix == false) {
          that.setData({
            isRecommendFix: true,
            isFixFlag: false,
            isSHowAdFlag: false,
          })
        }
      } else {
        if (that.data.isRecommendFix == true) {
          that.setData({
            isRecommendFix: false,
            isFixFlag: false,
            // isSHowAdFlag: true,
          })
        }
      }
    }).exec()
  },
  onScroll: function (e) {
    this.getRect();
    this.getRect2();
  },
  getData: function (flag, fun) {//flag:0，详情接口1;1，评论接口;2，商品属性接口
    wx.showNavigationBarLoading();
    var thiscopy;
    thiscopy = this;
    var requestUrl = config.Host;
    var that = this;
    if (null != app.globalData.user) {
      token = app.globalData.user.userToken;
    }
    thiscopy.setData({ token: token });

    if (flag == 0) {//详情接口
      if (null != thiscopy.data.token) {
        requestUrl = requestUrl + 'shop/query?token=' + thiscopy.data.token;
        requestUrl = requestUrl + "&code=" + this.data.shop_code + this.data.Version;
        
        util.httpNeedLogin(requestUrl, function (data) {
          fun(data);
        }, function () {
          that.getData(0, function (data) {
            that.dealBackData(0, data);
          });
        })
        return;
      } else {
        requestUrl = requestUrl + 'shop/queryUnLogin?';
        requestUrl = requestUrl + "&code=" + this.data.shop_code + this.data.Version;
      }
    } else if (flag == 1) {//评论接口

      requestUrl = requestUrl + "shopComment/selCommentByShop?" + this.data.Version + "&page=" + this.data.curPage + "&rows=" + this.data.pageSize + "&shop_code=" + this.data.shop_code;
    } else if (flag == 2) {//商品属性接口 
      requestUrl = requestUrl + "shop/queryAttr?shop_code=" + this.data.shop_code + this.data.Version + "&find=false"
    } else if (flag == 3) {//分享商品图
      requestUrl = requestUrl + 'initiateApp/queryShareLifePic?' + this.data.Version;
    } else if (flag == 5) {//推荐列表
      requestUrl = requestUrl + "shop/queryConUnLogin?" + this.data.Version + "&pager.curPage=" + this.data.recommendPage + "&pager.pageSize=30" + "&type1=" + this.data.recommend_type1 + "&type_name=" + this.data.recommend_type_name;
    } else if (flag == 6) {//开关 
      requestUrl = requestUrl + 'cfg/getCurrWxcxType?token=' + this.data.token + this.data.Version;
    } else if (flag == 7) {//特价商品
      if (null != thiscopy.data.token) {
        requestUrl = requestUrl + 'shop/queryPackage?token=' + thiscopy.data.token;
        requestUrl = requestUrl + "&code=" + this.data.shop_code + this.data.Version;
        console.log("详情接口**********" + requestUrl);
        util.httpNeedLogin(requestUrl, function (data) {
          fun(data);
        }, function () {
          that.getData(0, function (data) {
            that.dealBackData(0, data);
          });
        })
        return;
      } else {
        requestUrl = requestUrl + 'shop/queryUnLogin?';
        requestUrl = requestUrl + "&code=" + this.data.shop_code + this.data.Version;
      }
    }
    util.http(requestUrl, function (data) {
      // console.log('--------', data)
      fun(data)
    })

    // wx.request({
    //   url: requestUrl,
    //   // method: 'POST',
    //   data: jsonParames,
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //     // "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   success: function (res) {
    //     wx.hideNavigationBarLoading();
    //     fun(res.data)
    //   }

    // })
  },

  getDataJson: function (flag, fun) {//获取分享文案
    wx.showNavigationBarLoading();
    var thiscopy;
    thiscopy = this;
    var requestUrl = '';
    var jsonParames = {};
    requestUrl = config.Upyun + "paperwork/paperwork.json";

    var tongji_url = "default";
    var tongji_parameter = "default"
    var mUrl = requestUrl + "";

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
      url: requestUrl,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        app.mtj.trackEvent('i_f_success_count', {
          i_f_name: tongji_url,
        });


        fun(res.data)
      },
      fail: function (error) {
        app.mtj.trackEvent('i_f_error_count', {
          i_f_name: tongji_url,
          // i_f_from: "10",
        });
      }
    })
  },


  /**
* 页面上拉触底事件的处理函数
*/
  onReachBottom: function () {
    var that = this;

    if ((isForceLook || isForceLookLimit) && that.data.activityIndex == 0) {
      // that.scanFinish();
      if (firstCome) {
        firstCome = false;
        publicUtil.scanFinish(that, isForceLook, isForceLookLimit, singvalue);
      }
    }
    if (this.data.activityIndex == 0) {
      this.getData(5, function (data) {
        that.dealBackData(5, data);
      })
    }
    if (that.data.activityIndex == 2) {
      that.data.curPage = that.data.curPage + 1;
      that.getData(1, function (data) {
        if (data.comments.length == 0) {
          that.data.curPage = that.data.curPage - 1;
        }
        var dealData = that.dateFormat(data.comments);
        for (var i = 0; i < dealData.length; i++) {
          var pic = dealData[i].pic;
          var picData = [];
          try {
            if (pic != null && '' != pic) {
              picData = pic.split(",");
              dealData[i]['pic_data'] = picData;
            }
            if (dealData[i].suppComment != undefined && dealData[i].suppComment != null) {
              dealData[i]['frist_replay'] = (dealData[i].suppComment)[0].supp_content;
            }
            if (dealData[i].suppEndComment != undefined && dealData[i].suppEndComment != null) {
              dealData[i]['second_replay'] = (dealData[i].suppEndComment)[0].supp_content;
            }

            if (dealData[i].comment != undefined && dealData[i].comment != null) {
              dealData[i]['second_judge'] = dealData[i].comment.content;

              var pic2 = (dealData[i].comment)[0].pic;
              var picData2 = [];
              if (pic2 != null && '' != pic2 && pic2 != undefined) {
                picData2 = pic2.split(",");
                dealData[i]['pic_data2'] = picData2;
              }
            }
          } catch (e) {

          }
        }

        var dataTemp = that.data.evaluateData.concat(dealData);
        that.setData({
          evaluateData: dataTemp,
        })

      });
    }

  },
  toLoadMore: function () {
    var that = this;

    if ((isForceLook || isForceLookLimit) && that.data.activityIndex == 0) {
      // that.scanFinish();
      if (firstCome) {
        firstCome = false;
        publicUtil.scanFinish(that, isForceLook, isForceLookLimit, singvalue);
      }
    }
    // recommendLoadFlag: true,
    //   evaluateLoadMore:true,
    if (this.data.recommendLoadFlag && this.data.activityIndex == 0) {
      this.data.recommendLoadFlag = false;
      this.getData(5, function (data) {
        that.dealBackData(5, data);
      })
    }
    if (this.data.evaluateLoadMore && that.data.activityIndex == 2) {
      this.data.evaluateLoadMore = false;
      that.data.curPage = that.data.curPage + 1;
      that.getData(1, function (data) {
        if (data && data.comments) {
          if (data.comments.length == 0) {
            that.data.curPage = that.data.curPage - 1;
          }
          var dealData = that.dateFormat(data.comments);
          for (var i = 0; i < dealData.length; i++) {
            var pic = dealData[i].pic;
            var picData = [];
            try {
              if (pic != null && '' != pic) {
                picData = pic.split(",");
                dealData[i]['pic_data'] = picData;
              }
              if (dealData[i].suppComment != undefined && dealData[i].suppComment != null) {
                dealData[i]['frist_replay'] = (dealData[i].suppComment)[0].supp_content;
              }
              if (dealData[i].suppEndComment != undefined && dealData[i].suppEndComment != null) {
                dealData[i]['second_replay'] = (dealData[i].suppEndComment)[0].supp_content;
              }

              if (dealData[i].comment != undefined && dealData[i].comment != null) {
                dealData[i]['second_judge'] = dealData[i].comment.content;

                var pic2 = (dealData[i].comment)[0].pic;
                var picData2 = [];
                if (pic2 != null && '' != pic2 && pic2 != undefined) {
                  picData2 = pic2.split(",");
                  dealData[i]['pic_data2'] = picData2;
                }
              }
            } catch (e) {

            }
          }


          var dataTemp = that.data.evaluateData.concat(dealData);
          that.setData({
            evaluateData: dataTemp,
          })
        } else {
          that.data.curPage = that.data.curPage - 1;
        }
        that.data.evaluateLoadMore = true;
      });
    }
  },
  loadProgress: function () {
    this.canvasCircular('canvasColor');//色差
    this.canvasCircular('canvasType'); //版型
    this.canvasCircular('canvasWorkmanship');//做工
    this.canvasCircular('canvasCostPerformance');//性价比
  },
  canvasCircular: function (canvasArc) {
    var cxt_arc = wx.createCanvasContext(canvasArc);//创建并返回绘图上下文context对象。  
    var x = 34, y = 34, lineWidth = 4, radius = 30;
    cxt_arc.setLineWidth(lineWidth);
    cxt_arc.setStrokeStyle('#d2d2d2');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径  
    cxt_arc.arc(x, y, radius, 0, 2 * Math.PI, false);//设置一个原点(106,106)，半径为100的圆的路径到当前路径  
    cxt_arc.stroke();//对当前路径进行描边  

    cxt_arc.setLineWidth(lineWidth);
    cxt_arc.setStrokeStyle('#ff3f8b');
    cxt_arc.setLineCap('round');
    cxt_arc.beginPath();//开始一个新的路径  
    cxt_arc.arc(x, y, radius, -Math.PI * 1 / 2, Math.PI * 1, false);
    cxt_arc.stroke();//对当前路径进行描边  

    cxt_arc.draw();
  },













  // //浏览X件任务
  // scanFinish: function () {
  //   var that = this;
  //   if (firstCome) {
  //     firstCome = false;
  //     that.setData({ is_look: false });

  //     var signUrl = config.Host + "signIn2_0/signIning" +
  //       "?token=" + token +
  //       "&share=false" +
  //       "&index_id=" + xShop_signIndex +
  //       "&day=" + wx.getStorageSync("SIGN_DAY") + config.Version;

  //     if (isForceLook) {
  //       var forcelookNum = 0;
  //       var forceLookXShopNumKey = xShop_signIndex + "forceLookXShopNum";
  //       var dataString = new Date().toDateString();

  //       forcelookNum = wx.getStorageSync(forceLookXShopNumKey);

  //       if (!forcelookNum || wx.getStorageSync("forcelookNowTime") !== dataString) {
  //         forcelookNum = 0;
  //       }
  //       forcelookNum++;
  //       wx.setStorageSync("forcelookNowTime", dataString);

  //       if (xShop_doNum > 1) {// 需要奖励分多次发放
  //         that.signForceLook(forceLookXShopNumKey, forcelookNum, signUrl);
  //       } else {

  //         if (forcelookNum < singvalue) {
  //           wx.setStorageSync(forceLookXShopNumKey, forcelookNum);
  //           var showText = "再浏览" + (singvalue - forcelookNum) + "件即可完成任务喔~"
  //           that.showToast(showText, 4000);

  //         } else if (forcelookNum >= singvalue) {
  //           that.signForceLook(forceLookXShopNumKey, forcelookNum, signUrl);
  //         }
  //       }
  //     } else if (isForceLookLimit) {

  //       var forcelookLimitNum = 0;
  //       var forceLookLimitXShopNumKey = xShop_signIndex + "forceLookLimitXShopNum";
  //       var dataString = new Date().toDateString();

  //       forcelookLimitNum = wx.getStorageSync(forceLookLimitXShopNumKey);

  //       if (!forcelookLimitNum || wx.getStorageSync("nowTimeForcelookLimit") !== dataString) {
  //         forcelookLimitNum = 0;
  //       }

  //       wx.setStorageSync("nowTimeForcelookLimit", dataString);

  //       if (forcelookLimitNum / singvalue >= xShop_doNum
  //         || xShop_complete) {
  //         //浏览 奖励额度 达到上限
  //         xShop_complete = true;
  //         // wx.showModal({
  //         //   title: "完成浏览任务~",
  //         //   content: "今日的浏览奖励已达上限，记得明天再来。",
  //         //   showCancel: false,
  //         //   confirmColor: "#FF3F8B"
  //         // });
  //         that.setData({
  //           signFinishShow: true,
  //           signFinishDialog: {
  //             top_tilte: "任务完成！",
  //             tilte: "完成浏览任务~",
  //             contentText: "今日的浏览奖励已达上限，记得明天再来。",
  //             leftText: "任务列表",
  //             rigthText: "买买买"
  //           },
  //         });
  //         forcelookLimitNum++;
  //         wx.setStorageSync(forceLookLimitXShopNumKey, forcelookLimitNum);

  //       } else {

  //         if (forcelookLimitNum % singvalue + 1 < singvalue) {
  //           var showText = "再浏览" + (singvalue - (forcelookLimitNum % singvalue + 1)) + "件即可赢得" + xShop_jiangliValue +
  //             "元提现额度,继续努力~"
  //           that.showToast(showText, 4000);
  //           forcelookLimitNum++;
  //           wx.setStorageSync(forceLookLimitXShopNumKey, forcelookLimitNum);

  //         } else if (forcelookLimitNum % singvalue + 1 == singvalue) {
  //           that.signForceLookLimit(forceLookLimitXShopNumKey, forcelookLimitNum, signUrl);
  //         }

  //       }
  //     }

  //   }

  // },

  // signForceLook: function (forceLookXShopNumKey, forcelookNum, signUrl) {
  //   var that = this;
  //   util.http(signUrl, function (data) {
  //     if (data == null || data.status != 1) {
  //       that.showToast(data.message, 3000);
  //       return;
  //     }

  //     wx.setStorageSync(forceLookXShopNumKey, forcelookNum);

  //     if (forcelookNum < singvalue) {//小于要浏览次数
  //       var showText = "浏览完成，奖励" + xShop_jiangliValue + xShop_jiangliName + ",还有" + (singvalue - forcelookNum) + "次浏览机会喔~";
  //       that.showToast(showText, 4000);

  //     } else if (forcelookNum >= singvalue) {//任务完成
  //       xShop_complete = true;
  //       var showText = xShop_jiangliValue * xShop_doNum + xShop_jiangliName + "奖励已经存入账户，赶紧去买买买吧~";
  //       // wx.showModal({
  //       //   title: "完成【" + xShop_shopsName + "】浏览~",
  //       //   content: showText,
  //       //   showCancel: false,
  //       //   confirmColor: "#FF3F8B"
  //       // });
  //       // wx.removeStorageSync(shareXShopNumKey);
  //       that.setData({
  //         signFinishShow: true,
  //         signFinishDialog: {
  //           top_tilte: "任务完成！",
  //           tilte: "完成【" + xShop_shopsName + "】浏览~",
  //           contentText: showText,
  //           leftText: "任务列表",
  //           rigthText: "买买买"
  //         },
  //       });
  //     }
  //   })

  // },

  // signForceLookLimit: function (forceLookLimitXShopNumKey, forcelookLimitNum, signUrl) {
  //   var that = this;

  //   util.http(signUrl, function (data) {

  //     if (data == null || data.status != 1) {
  //       that.showToast(data.message, 3000);
  //       return;
  //     }
  //     var showText = xShop_jiangliValue + "元提现额度已经存入您的余额，再浏览" + singvalue + "件可再赢得" + xShop_jiangliValue + "元提现额度,继续努力~";
  //     that.showToast(showText, 4000);
  //     forcelookLimitNum++;
  //     wx.setStorageSync(forceLookLimitXShopNumKey, forcelookLimitNum);
  //   })
  // },
  scan_tips_know: function () {
    this.setData({
      is_look: true,
      scanTipsShow: false
    });
  },
  dialog_close: function () {
    this.setData({
      signFinishShow: false
    });
  },
  btn_left: function () {
    this.setData({
      signFinishShow: false
    });
  },
  btn_rigth: function () {
    // this.toMainPager();
    this.toSignPager();
  },
  //去首页
  toMainPager: function () {
    wx.switchTab({
      url: '../shouye',
    });
  },

  //去赚钱页面
  toSignPager: function () {
    util.backToSignPager('../../sign/sign');
  },



  // 去下单
  buyToOrder: function (e) {
    var that = this;
    if (app.globalData.user != null && app.globalData.user.userToken != undefined) {
      util.httpPushFormId(e.detail.formId);

      if (this.data.stockCount == 0) {
        that.showToast('库存不足！', 3000);
        return;
      }

      var shopData = {
        stock_type_id: this.data.stock_type_id,           //库存id
        // shopPic: this.data.stockPicData[this.data.colorIndex],
        shopPic: this.data.Upyun + this.data.shop.shop_code.substring(1, 4) + '/' + this.data.shop.shop_code + '/' + this.data.shop.def_pic,
        shopCode: this.data.shop_code,
        shopName: this.data.shop_name,
        shopNum: this.data.buyCount,
        color: this.data.stockColorData[this.data.colorIndex].name,
        // size: this.data.stockSizeData[this.data.sizeIndex].name,
        shopOldPrice: this.data.shop_price,
        shopPrice: this.data.shop_se_price,
        // brander: this.data.shop.supp_label,
      };
      var s = 0;
      if (this.data.isSignActiveShop) {
        s = 2;
      } else if (this.data.isOneYuanClick)//1元购
      {
        s = (app.globalData.oneYuanFree > 0) ? 9 : 10;
      }

      wx.setStorageSync('shopData', shopData);

      wx.redirectTo({
        url: '../../listHome/order/confirm/confirm?' + 'buyType=' + s
      })
    }
    else
      util.toAuthorizeWx(function (isSuccess) {
        if (isSuccess == true) {

        }
      });
  },
  onShareAppMessage: function (res) {
    var user_id = '';
    var share_pic = '';
    if (this.data.shop.four_pic) {
      var picArray = this.data.shop.four_pic.split(',');
      if (picArray.length > 2) {
        share_pic = picArray[2] + '!450';
      } else {
        share_pic = this.data.shop.def_pic + '!450';
      }
    } else {
      share_pic = this.data.shop.def_pic + '!450';
    }
    if (app.globalData.user) {
      user_id = app.globalData.user.user_id
    }
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }

    if (that.data.isOneShowShare) {
      return {
        title: this.data.shareTitle,
        path: '/pages/shouye/detail/detail?shop_code=' + this.data.shop_code + "&isShareFlag=true" + "&user_id=" + user_id,
        imageUrl: this.data.picLink + share_pic, //this.data.shop.def_pic,
        success: function (res) {
          that.setData({ isOneShowShare: false })
          that.buyOrder();
        },
        fail: function (res) {
          // 转发失败
        }
      }
    } else {
      return {
        title: this.data.shareTitle,
        path: '/pages/shouye/detail/detail?shop_code=' + this.data.shop_code + "&isShareFlag=true" + "&user_id=" + user_id,
        imageUrl: this.data.picLink + share_pic, //this.data.shop.def_pic,
        success: function (res) {
          that.setData({ isShowShare: false })
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  }
})