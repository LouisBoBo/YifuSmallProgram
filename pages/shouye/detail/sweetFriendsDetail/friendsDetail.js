// pages/shouye/detail/sweetFriendsDetail/friendsDetail.js
var app = getApp();
var util = require('../../../../utils/util.js');
import config from '../../../../config';
var publicUtil = require('../../../../utils/publicUtil.js');
var WxNotificationCenter = require('../../../../utils/WxNotificationCenter.js');

//签到任务
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
//浏览件数相关//
var isLoadingFlag = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Version: config.Version,
    Token: '',
    Upyun: config.Upyun,
    detailData: [],
    head_pic: '',
    detailListData: [],
    tagsAllData: [],
    tagsData: [],//标签
    imageTagsData: [],//图片上的标签
    evaluateAllData: [],
    shopRecommentData: [],
    suppLabelAllData: [],//所有品牌
    styleAllData: [],//风格
    theme_id: '224',//帖子ID
    sharePicPath: '',
    isAttentionUrl: '',
    isAddFriendsFlag: '',

    bottomHeigth: 0,
    imgWidth: 0,
    col1: [],//左边列表
    col2: [],//右边列表
    dataList: [],//保存去重后所有数据data和data2 且未排序 用来去重
    col1H: 0,//左边图片总高度
    col2H: 0,//右边边图片总高度
    curPage: 1,


    //赚钱签到
    scanTipsShow: false,
    signFinishShow: false,//任务完成弹窗是否显示
    signFinishDialog: {
      top_tilte: "",//任务完成弹窗 顶部标题
      tilte: "",//任务完成弹窗 标题
      contentText: "",//任务完成弹窗 具体类容
      leftText: "",//任务完成弹窗 左边按钮
      rigthText: ""//任务完成弹窗 右边按钮
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (!app.parent_id) {
      app.parent_id = options.user_id
    }

    if (options.user_id){
      // app.shareToHomepage3()

    }

    if (options.user_id && app.globalData.user && app.globalData.user.userToken) {
      util.bindRelationship(options.user_id, app.globalData.user.userToken);//绑定用户上下级关系
    }
    if (options.user_id) {
      WxNotificationCenter.addNotification("testNotificationItem1Name", function () {
        if (app.globalData.user && app.globalData.user.userToken) {
          util.bindRelationship(options.user_id, app.globalData.user.userToken);//绑定用户上下级关系
        }
      }, this);
    }
    this.data.theme_id = options.theme_id;
    new app.ToastPannel();
    var that = this;
    if (null != app.globalData.user) {
      this.data.Token = app.globalData.user.userToken;
    } else {
      this.data.Token = null;
    };
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.47;//0.47占屏幕的47%
        let bottomHeigth = (ww / 750) * 145;//145为布局中的底部的总高度单位rpx
        this.setData({
          bottomHeigth: bottomHeigth,
          imgWidth: imgWidth
        });
      }
    });

    this.data.tagsAllData = wx.getStorageSync("shop_tag_basedata").data.friend_circle_tag;
    this.data.suppLabelAllData = wx.getStorageSync("shop_tag_basedata").data.supp_label;
    this.data.styleAllData = wx.getStorageSync("shop_tag_basedata").data.shop_tag;
    console.log('this.data.suppLabelAllData', this.data.suppLabelAllData);
    console.log('this.data.styleAllData', this.data.styleAllData);
    this.getData(0, function (data) {//获取密友圈详情(包含热门评论)
      that.dealBackData(0, data)
    });
    // this.getData(2, function (data) {//获取相关推荐
    //   that.dealBackData(2, data)
    // });

    //赚钱
    isForceLookLimit = options.isForceLookLimit;
    isForceLook = options.isForceLook;

    //浏览X件任务
    if (isForceLook || isForceLookLimit) {
      console.log("----", "111111111")
      that.setData({ is_look: true });
      firstCome = true;
      var signTask = wx.getStorageSync("SIGN-TASK");
      console.log('signTask', signTask)
      xShop_complete = signTask.complete;
      task_type = signTask.task_type;
      xShop_signIndex = signTask.index;
      xShop_doValue = signTask.value;
      xShop_doNum = signTask.num;
      xShop_jiangliName = signTask.jiangliDanWei + signTask.jiangliContent;
      xShop_jiangliValue = signTask.jiangliValue;
      xShop_shopsName = signTask.shopsName;

      try {
        singvalue = parseInt(xShop_doValue)//.split(",")[1]
      } catch (e) {
        singvalue = parseInt(xShop_doNum);
      }
      var dataString = new Date().toDateString();
      // var saveDay = wx.getStorageSync("scanshop_tips_day_sweet");
      // if (saveDay != dataString) {
      //   that.setData({
      //     is_look: false,//侧边浏览先不显示
      //     scanTipsShow: true
      //   });
      //   wx.setStorageSync("scanshop_tips_day_sweet", dataString);
      // } else {
      //   that.setData({
      //     is_look: true,
      //     scanTipsShow: false
      //   });
      // }
    }
  },

  // 页面里的点击-------------start
  imageTagsClick: function (event) {//图片上的标签点击
    var shop_code = event.currentTarget.dataset.code;
    var label_id = event.currentTarget.dataset.label_id;
    var label_name = event.currentTarget.dataset.name
    if (shop_code) {
      wx.navigateTo({
        url: '../detail?shop_code=' + shop_code,
      })
    } else if (label_id) {
      wx.redirectTo({
        url: '../../../listHome/brandsDetail/brandsDetail?' +
        "class_id=" + label_id +
        "&navigateTitle=" + label_name,
      })
    }
  },
  addFriendClick: function () {//添加密友
    var that = this;
    if (this.data.Token) {
      this.getData(3, function (data) {
        that.dealBackData(3, data)
      })
    } else {
      util.toAuthorizeWx(function (isSuccess) {
        if (isSuccess) {

          if (app.globalData.user != null) {
            that.data.Token = app.globalData.user.userToken;
            that.setData({ Token: that.data.Token })

          }
          that.getData(3, function (data) {
            that.dealBackData(3, data)
          })
        } else {
          return;
        }
      });
    }

  },
  tagsClick: function (event) {//点击标签
    var tagData = event.currentTarget.dataset.tagdata;
    console.log(tagData)
    if (tagData.type_style == 1) {//0,标签，1，后台品牌，2，自定义品牌，3风格
      wx.redirectTo({
        url: '../../../listHome/brandsDetail/brandsDetail?' +
        "class_id=" + tagData.id +
        "&navigateTitle=" + tagData.name,
      })
    } else if (tagData.type_style == 3) {
      wx.redirectTo({
        url: '../../../shopType/shopCategoryList/shopCategoryList?' +
        "style=" + tagData.id +
        "&navigateTitle=" + tagData.name
      })
    }

  },
  itemTap: function (event) {//相关推荐的点击
    var theme_id = event.currentTarget.dataset.theme_id;
    wx.redirectTo({
      url: "../sweetFriendsDetail/friendsDetail?theme_id=" + theme_id,
    });

  },
  shopRecommentClick: function (event) {//推荐商品点击
    if (event.currentTarget.dataset.code) {
      wx.navigateTo({
        url: '../detail?shop_code=' + event.currentTarget.dataset.code,
      })
    }
  },
  // 页面里的点击-------------end
  dealBackData: function (flag, data) {
    var that = this;
    if (flag == 0) {//密友圈详情
      if (data != undefined && data.status == 1) {
        if ((data.data.post_details.head_pic).startsWith('http')) {
          this.data.head_pic = data.data.post_details.head_pic;
        } else {
          this.data.head_pic = this.data.Upyun + data.data.post_details.head_pic;
        }
        var detailData = data.data.post_details;
        var time = util.getMyDate(detailData.send_time, 'sweet_friend');
        detailData.send_time = time;
        if ("1" != detailData.theme_type) {//其他
          var pics = detailData.pics;
          var picDataTemp = [];
          picDataTemp = pics.split(',');
          for (var i = 0; i < picDataTemp.length; i++) {
            var url = this.data.Upyun + "myq/theme/" + detailData.user_id + "/" + picDataTemp[i].split(':')[0] + "!450";
            var picData = {};
            picData.pic_url = url;
            this.data.detailListData.push(picData);
          }

          //获取商品推荐
          this.data.shopRecommentData = detailData.shop_list;
          var picData = [];
          picData = detailData.shop_list;
          for (var i = 0; i < picData.length; i++) {
            var shop_code = picData[i].shop_code;
            var url = this.data.Upyun + shop_code.substring(1, 4) + '/' + shop_code + '/'
              + picData[i].def_pic + "!450";
            this.data.shopRecommentData[i].shop_se_price = (this.data.shopRecommentData[i].shop_se_price).toFixed(1);
            this.data.shopRecommentData[i]['pic_url'] = url;
          }


        } else {//精选推荐
          this.data.detailListData = detailData.shop_list;
          var picData = [];
          picData = detailData.shop_list;
          for (var i = 0; i < picData.length; i++) {
            var shop_code = picData[i].shop_code;
            var url = this.data.Upyun + shop_code.substring(1, 4) + '/' + shop_code + '/'
              + picData[i].def_pic + "!450";
            this.data.detailListData[i]['pic_url'] = url;
          }
        }
        this.data.evaluateAllData = data.data.hot_comments;//热门评论
        if (this.data.detailListData.length > 0) {
          this.data.sharePicPath = this.data.detailListData[0]['pic_url'];
        }
        if (data.data.post_details.attention_status == 1) {
          this.data.isAttentionUrl = this.data.Upyun +
            "small-iconImages/zzq/icon_attention.png";
          this.data.isAddFriendsFlag = 1;
        } else {
          this.data.isAddFriendsFlag = 2;
          this.data.isAttentionUrl = this.data.Upyun +
            "small-iconImages/zzq/icon_add_friends.png";
        }
        this.setData({
          detailData: data.data.post_details,
          head_pic: this.data.head_pic,
          detailListData: this.data.detailListData,
          shopRecommentData: this.data.shopRecommentData,
          isAttentionUrl: this.data.isAttentionUrl,
        })
        this.getTags();//获取标签
        this.getImageTags(data.data.post_details);//获取图片上的标签
        this.getData(1, function (data) {//获取最新评论
          that.dealBackData(1, data)
        })
      }
      // console.log('data', data);
    } else if (flag == 1) {
      if (data && data.data) {
        for (var i = 0; i < data.data.length; i++) {
          if ("0" == data.data[i].status) {
            this.data.evaluateAllData.push(data.data[i])
          } else if (app.globalData.user != null && data.data[i].user_id == app.globalData.user.user_id) {
            this.data.evaluateAllData.push(data[i])
          }
        }
      }
      this.setData({ evaluateAllData: this.data.evaluateAllData })
    } else if (flag == 2) {//相关推荐
      isLoadingFlag = false;
      that.setData({
        curPage: that.data.curPage + 1
      })
      var that = this;
      if (data) {
        if (data.status != 1) {
          that.showToast(data.message, 2000);
          return;
        }
        //先对数据去重和排序处理后 再加载数据
        publicUtil.getIntimateListProcess(data, that.data.dataList, that.onItemLoad);
      }
    } else if (flag == 3) {//关注与取消关注
      if (data && data.status == 1) {
        if (this.data.isAddFriendsFlag == 1) {
          this.data.isAddFriendsFlag = 2;
          this.data.isAttentionUrl = this.data.Upyun +
            "small-iconImages/zzq/icon_add_friends.png";
        } else {
          this.data.isAddFriendsFlag = 1;
          this.data.isAttentionUrl = this.data.Upyun +
            "small-iconImages/zzq/icon_attention.png";
        }
        console.log('flag', this.data.isAddFriendsFlag)
        this.setData({ isAttentionUrl: this.data.isAttentionUrl, isAddFriendsFlag: this.data.isAddFriendsFlag })
      } else if (data) {
        this.showToast(data.message, 2000);
      }
    }
  },

  //双瀑布流加载数据
  onItemLoad: function (retInfo) {
    // console.log("++++++", this.data.dataList)
    console.log("########", retInfo);
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    for (let i in retInfo) {
      let item = retInfo[i];
      let imgHeight = imgWidth;

      if (1 == item.theme_type) {// 精选推荐帖子
        imgHeight = imgWidth * 900 / 600; //自适应高度
        if (item.shop_list && item.shop_list.length) {
          var shop_code = item.shop_list[0].shop_code;
          var show_pic = config.Upyun + shop_code.substring(1, 4) + "/" + shop_code + "/"
            + item.shop_list[0].def_pic + "!280";
          item["show_pic"] = show_pic;
        }
      } else {//其他帖子
        let pic = item.pics.split(",")[0];
        let rate = 1;
        try {
          rate = pic.split(":")[1];
        } catch (e) {
          rate = 1;
        }
        imgHeight = imgWidth / rate; //自适应高度
        item["show_pic"] = config.Upyun + "myq/theme/" + item.user_id + "/" + pic.split(":")[0] + "!280";
      }

      item["imgHeight"] = imgHeight;
      if (!item.head_pic.startsWith('http')) {
        item["head_pic"] = config.Upyun + item.head_pic;
      }
      // let loadingCount = this.data.loadingCount - 1;
      let col1 = this.data.col1;
      let col2 = this.data.col2;
      let col1H = this.data.col1H;
      let col2H = this.data.col2H;
      let bottomHeigth = this.data.bottomHeigth;

      if (col1H <= col2H) {
        col1H += (imgHeight + bottomHeigth);
        col1.push(item);
      } else {
        col2H += (imgHeight + bottomHeigth);
        col2.push(item);
      }

      let data = {
        col1: col1,
        col2: col2,
        col1H: col1H,
        col2H: col2H
      };
      this.setData(data);
    }
  },
  getImageTags: function (data) {//获取图片上的标签
    if (data.supp_label_list) {
      var temp0 = [];
      temp0 = data.supp_label_list;
      var temp1 = []; //存储标签全部数据
      var temp2 = []; //存储标签名字
      for (var i = 0; i < temp0.length; i++) {
        var tempFor0 = [];
        var supp_label_hashmap = temp0[i];
        var label_name = supp_label_hashmap.label_name;
        var label_x = supp_label_hashmap.label_x;
        var label_y = supp_label_hashmap.label_y;
        // 品牌ID
        var label_id = supp_label_hashmap.label_id;
        var label_type = supp_label_hashmap.label_type;
        var only_id = supp_label_hashmap.only_id;
        var shop_code = supp_label_hashmap.shop_code;
        if (shop_code) {
          //带商品品牌标签
          if (label_id) {
            var suppLabelAllData = this.data.suppLabelAllData;
            for (var j = 0; j < suppLabelAllData.length; j++) {
              if (label_id == suppLabelAllData[j].id) {
                temp1.push(suppLabelAllData[j]);
                tempFor0.push(suppLabelAllData[j]);
                break;
              }
            }
            if (tempFor0.length > 0) {
              label_name = tempFor0[0].name;
            } else {
              label_name = "衣蝠精选";
            }
          } else {
            label_name = "衣蝠精选";
          }
          var jsonTemp = {};
          jsonTemp.name = label_name;
          jsonTemp.label_type = 0;//代表精选商品标签
          jsonTemp.shop_code = shop_code;
          if (label_x.startsWith("-")) {//右面
            jsonTemp.left_direction = 1;
            jsonTemp.left_x = (label_x.substring(1, label_x.length) * 100).toFixed(0) + '%';
          } else {
            jsonTemp.left_direction = 0;//左面
            jsonTemp.left_x = (label_x * 100).toFixed(0) + '%';
          }
          jsonTemp.direction = supp_label_hashmap.direction;//箭头方向  0,向左，1向右    

          if (label_y.startsWith("-")) {//右面
            jsonTemp.top_direction = 1;
            jsonTemp.top_y = (label_y.substring(1, label_y.length) * 100).toFixed(0) + '%';
          } else {
            jsonTemp.top_direction = 0;//左面
            jsonTemp.top_y = (label_y * 100).toFixed(0) + '%';
          }
          if (label_y.startsWith("-") && label_x.startsWith("-")) {
            jsonTemp.deal_direction = 4;
          } else if (label_y.startsWith("-")) {
            jsonTemp.deal_direction = 3;
          } else if (label_x.startsWith("-")) {
            jsonTemp.deal_direction = 2;
          } else {
            jsonTemp.deal_direction = 1;
          }
          temp2.push(jsonTemp);
        } else {  //普通品牌标签        
          if (label_id) {
            var suppLabelAllData = this.data.suppLabelAllData;
            for (var j = 0; j < suppLabelAllData.length; j++) {
              if (label_id == suppLabelAllData[j].id) {
                temp1.push(suppLabelAllData[j]);
                tempFor0.push(suppLabelAllData[j]);
                break;
              }
            }
            if (tempFor0.length > 0) {
              label_name = tempFor0[0].name;
              var jsonTemp = {};
              jsonTemp.name = label_name;
              jsonTemp.label_type = 1;//代表普通标签
              if (1 == label_type) {
                jsonTemp.label_id = label_id;
              }


              if (label_x.startsWith("-")) {//右面
                jsonTemp.left_direction = 1;
                jsonTemp.left_x = (label_x.substring(1, label_x.length) * 100).toFixed(0) + '%';
              } else {
                jsonTemp.left_direction = 0;//左面
                jsonTemp.left_x = (label_x * 100).toFixed(0) + '%';
              }
              jsonTemp.direction = supp_label_hashmap.direction;//箭头方向  0,向左，1向右    

              if (label_y.startsWith("-")) {//右面
                jsonTemp.top_direction = 1;
                jsonTemp.top_y = (label_y.substring(1, label_y.length) * 100).toFixed(0) + '%';
              } else {
                jsonTemp.top_direction = 0;//左面
                jsonTemp.top_y = (label_y * 100).toFixed(0) + '%';
              }
              if (label_y.startsWith("-") && label_x.startsWith("-")) {
                jsonTemp.deal_direction = 4;
              } else if (label_y.startsWith("-")) {
                jsonTemp.deal_direction = 3;
              } else if (label_x.startsWith("-")) {
                jsonTemp.deal_direction = 2;
              } else {
                jsonTemp.deal_direction = 1;
              }
              temp2.push(jsonTemp);

            } else {

            }
          } else {

          }

        }
      }
      this.setData({ imageTagsData: temp2 });
      console.log("imageTagsData", this.data.imageTagsData)
    }

  },
  getTags: function () {//获取标签
    var tagDataTemp = [];
    var temp0 = [];//热门标签和自定义标签
    tagDataTemp = this.data.detailData.tags;
    if (tagDataTemp) {
      for (var i = 0; i < tagDataTemp.length; i++) {
        for (var j = 0; j < this.data.tagsAllData.length; j++) {
          if (tagDataTemp[i] == (this.data.tagsAllData)[j].id) {
            (this.data.tagsAllData)[j]["type_style"] = '0';//标签
            temp0.push((this.data.tagsAllData)[j]);
            break;
          }
        }
      }
    }
    var detailData = this.data.detailData;
    if ("1" == detailData.theme_type) {//精选推荐
      this.setData({ tagsData: temp0, })
    } else {//其他
      var temp1 = [];
      var temp2 = [];//后台品牌
      var temp3 = [];//自定义品牌
      var temp4 = [];//风格

      temp1 = detailData.supp_label_list;
      if (temp1) {
        for (var i = 0; i < temp1.length; i++) {
          var supp_label_hashmap = temp1[i];
          var label_id = supp_label_hashmap.label_id;
          var label_type = supp_label_hashmap.label_type;
          var only_id = supp_label_hashmap.only_id;
          var style = supp_label_hashmap.style;
          if ("1" == label_type) {//后台品牌
            temp2.push(label_id);
          } else {//自定义品牌
            temp3.push(label_id);
          }
          temp4.push(style);
        }
      }
      var suppLabelAllData = this.data.suppLabelAllData;
      var styleAllData = this.data.styleAllData;
      for (var i = 0; i < temp2.length; i++) {
        for (var j = 0; j < suppLabelAllData.length; j++) {
          if (temp2[i] == suppLabelAllData[j].id) {
            suppLabelAllData[j]['type_style'] = '1';//后台品牌
            this.data.tagsData.push(suppLabelAllData[j]);
            break;
          }
        }
      }
      for (var i = 0; i < temp3.length; i++) {
        for (var j = 0; j < suppLabelAllData.length; j++) {
          if (temp3[i] == suppLabelAllData[j].id) {
            suppLabelAllData[j]['type_style'] = '2';//自定义品牌
            this.data.tagsData.push(suppLabelAllData[j]);
            break;
          }
        }
      }
      for (var i = 0; i < temp4.length; i++) {
        for (var j = 0; j < styleAllData.length; j++) {
          if (styleAllData[j].parent_id == 2 && styleAllData[j].is_show == 1 && temp4[i] == styleAllData[j].id) {
            styleAllData[j]['name'] = styleAllData[j].tag_name;
            styleAllData[j]['type_style'] = '3';//风格
            this.data.tagsData.push(styleAllData[j]);
            break;
          }
        }
      }

      for (var i = 0; i < temp0.length; i++) {
        this.data.tagsData.push(temp0[i])
      }
      // this.data.tagsData.concat(temp0);
      this.setData({ tagsData: this.data.tagsData, })
    }
  },

  unique: function (array) {//数组去重
    var res = [];
    var json = {};
    for (var i = 0; i < array.length; i++) {
      if (!json[array[i]]) {
        res.push(array[i]);
        json[array[i]] = 1;
      }
    }
    return res;
  },
  // http://www.52yifu.wang/cloud-api//fc/topicDetails?version=V1.31&token=VD9RTK4SNFS3R95VBTD7&theme_id=149&authKey=774F622C96387FB014DF9E3510E636F2&I10o=Dzc0HtYyXuX5DtX4D0BGXNO0HOY5HJX1XJLPDtX2HtS%3D&channel=8&appVersion=V3.6.0 //密友圈详情

  // http://www.52yifu.wang/cloud-api/fc/latestComments?version=V1.31&token=VD9RTK4SNFS3R95VBTD7&theme_id=149&curPage=1&pageSize=10&authKey=1B9DDDE0BD2E9C32758250F607A16986&I10o=XUS5HOHOHJLGHNTPEUXzXtc1ENS1XOY2XNdLXJY5ENY%3D&channel=8&appVersion=V3.6.0 // 最新评论

  // http://www.52yifu.wang/cloud-api/fc/subjectRecommend?version=V1.31&token=PB94YTV39SDGQX57NIQL&theme_id=127&curPage=2&pageSize=10&authKey=A3CF586D387DEE8ACE2CC89BF0C6B27F&I10o=MJDNHtU4DuMzENdOHUU4MUDPXuDNENvGHtLNDuSyD0Y%3D&channel=8&appVersion=V3.6.0 //相关推荐


  // http://www.52yifu.wang/cloud-api//fc/addOrDelMiYou?version=V1.31&token=PB94YTV39SDGQX57NIQL&friend_user_id=944149&type=1&authKey=384E227EA172F3AEDB4FB7C251D90F48&I10o=Xzq0HJSyD0ZLXJcyHtDLHUHGDOBGD0XyDJPOEJLQDNq%3D&channel=8&appVersion=V3.6.0//关注密友

  // https://www.52yifu.wang/cloud-wxcx/fc/addOrDelMiYou?token=FU9I44AJ08DGTMX8SKDY&friend_user_id587079&type=1&version=V1.31&channel=68&authKey=df5e5c955f9136cdb72382346a21ade4&I10o=ZGY1ZTVjOTU1ZjkxMzZjZGI3MjM4MjM0NmEyMWFkZTQ=
  getData: function (flag, fun) {//flag:0，密友圈详情(包含热门评论)
    // wx.showNavigationBarLoading();
    var requestUrl = config.Host;
    var strLink = this.data.Version
    if (flag == 0) {//详情接口
      if (this.data.Token) {
        requestUrl = requestUrl + 'fc/topicDetails?token=' + this.data.Token;//VD9RTK4SNFS3R95VBTD7
      } else {
        requestUrl = requestUrl + 'fc/topicDetails?token=';
      }
      requestUrl = requestUrl + "&theme_id=" + this.data.theme_id + strLink;//149,127
    } else if (flag == 1) {//获取最新评论
      if (this.data.Token) {
        requestUrl = requestUrl + 'fc/latestComments?token=' + this.data.Token;
      } else {
        requestUrl = requestUrl + 'fc/latestComments?token=';
      }
      requestUrl = requestUrl + "&theme_id=" + this.data.theme_id + '&curPage=1' + '&pageSize=10' + strLink;
    } else if (flag == 2) {//相关推荐
      if (this.data.Token) {
        requestUrl = requestUrl + 'fc/subjectRecommend?token=' + this.data.Token;
      } else {
        requestUrl = requestUrl + 'fc/subjectRecommend?token=';
      }
      requestUrl = requestUrl + "&theme_id=" + this.data.theme_id + '&curPage=' + this.data.curPage + '&pageSize=10' + strLink;
    } else if (flag == 3) {//关注与取消关注密友
      var type = '1';
      if (this.data.isAddFriendsFlag == 1) {//已关注，取消关注
        type = '2';
      }
      requestUrl = requestUrl + 'fc/addOrDelMiYou?token=' + this.data.Token;
      requestUrl = requestUrl + "&friend_user_id=" + this.data.detailData.user_id + '&type=' + type + strLink;
    }
    util.http(requestUrl, function (data) {
      fun(data)
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  scan_tips_know: function () {
    this.setData({
      is_look: true,
      // scanTipsShow: false
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
    this.toSignPager();
  },
  //去首页
  toMainPager: function () {
    wx.switchTab({
      url: '../../shouye',
    });
  },

  //去赚钱页面
  toSignPager: function () {
    // wx.redirectTo({
    //   url: '../../../sign/sign',
    // });
    util.backToSignPager('../../../sign/sign');
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;

    if ((isForceLook || isForceLookLimit)) {
      console.log("----", "2222222")
      // that.scanFinish();
      if (firstCome) {
        console.log("----", "3333333")
        firstCome = false;
        publicUtil.scanFinish(that, isForceLook, isForceLookLimit, singvalue, 1);
      }
    }
    if (!isLoadingFlag) {
      isLoadingFlag = true;
     
      that.getData(2, function (data) {
        that.dealBackData(2, data)
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var user_id = '';
    if (app.globalData.user) {
      user_id = app.globalData.user.user_id
    }
    var that = this;
    if (res.from === 'button') {
      // console.log(res.target)
    }
    return {
      title: this.data.detailData.content,
      path: '/pages/shouye/detail/sweetFriendsDetail/friendsDetail?theme_id=' + this.data.theme_id + "&isShareFlag=true" + "&user_id=" + user_id,
      imageUrl: this.data.sharePicPath,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})