// pages/sign/qutfitList/qutfitList.js
import config from '../../../config';
var util = require('../../../utils/util.js');
var publicUtil = require('../../../utils/publicUtil.js');
var app = getApp();
var token;
var user_id;
var isSignComplete=true;
var signTask;//赚钱任务 对象
var task_type = 0;
var signIndex;//SignFragment.signIndex
var doValue;// SignFragment.doValue;
var doNum;//SignFragment.doNum
var jiangliName ;
var jiangliValue ;
var is_share;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    imgWidth: 0,
    bottomHeigth:0,
    col1: [],//左边列表
    col2: [],//右边列表
    dataList: [],//保存去重后所有数据data和data2 且未排序 用来去重
    col1H : 0,//左边图片总高度
    col2H: 0,//右边边图片总高度
    curPage: 1,

    isShare:false,//分享热门穿搭话题帖子
    selectindex:-1,
    leftOrRigth:-1,//选择的是左边的还是右边的 0左边 1 右边
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    token = app.globalData.user.userToken;
    user_id = app.globalData.user.user_id;

    signTask = wx.getStorageSync("SIGN-TASK");
    isSignComplete = signTask.complete;
    // task_type = signTask.task_type;
    // console.log("signTask", signTask);
    task_type = options.task_type;
    if ("14" == task_type) {//分享热门穿搭
      this.setData({
        isShare: true,
      });
      signIndex = signTask.index;
      doValue = signTask.value;
      doNum = signTask.num;
      jiangliName = signTask.jiangliDanWei + signTask.jiangliContent;
      jiangliValue = signTask.jiangliValue;
      wx.setNavigationBarTitle({
        title: '分享热门穿搭'
      })
    }else{
      this.setData({
        isShare: false,
      });
      wx.setNavigationBarTitle({
        title: '热门穿搭'
      })
    }

    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.47;//0.47占屏幕的47%
        let bottomHeigth = (ww / 750) * 145;//145为布局中的底部的总高度单位rpx
        this.setData({
          bottomHeigth:bottomHeigth,
          imgWidth: imgWidth
        });
      }
    });

    this.initData();
    // this.onItemLoad();
  },
  onShow:function(){
    if(is_share)
    {
      var shareNum = parseInt(doValue);// 要分享的件数
      this.signShare(shareNum);
      util.task_share_Statistics("qdfx", "702", "7");//赚钱任务分享成功统计

      is_share = false;
    }
  },
  initData: function () {
    var that = this;
    var dataUrl = config.Host + "fc/circleTopicSquare" +
      "?token=" + token
      + "&curPage=" + that.data.curPage
      + "&pageSize=30" + config.Version;
    util.http(dataUrl, that.getIntimateList);
  },

  /**
  * 处理请求的列表数据
  */
  getIntimateList: function (retData) {
    wx.stopPullDownRefresh();
    var that = this;
    if (retData.status != 1) {
      that.showToast(retData.message, 2000);
      return;
    }
    // console.log("------", this.data.dataList)
    //先对数据去重和排序处理后 再加载数据
    if (this.data.curPage == 1) {
      this.setData({
        col1: [],//左边列表
        col2: [],//右边列表
        dataList: [],
        col1H: 0,//左边图片总高度
        col2H: 0,//右边边图片总高度
      }); 
    }

    publicUtil.getIntimateListProcess(retData, that.data.dataList, that.onItemLoad);

  },

  //双瀑布流加载数据
  onItemLoad: function (retInfo) {
    var that = this;
    var col1Temp = that.data.col1;
    var col2Temp = that.data.col2;
    let imgWidth = that.data.imgWidth;  //图片设置的宽度
    let imgHeight = imgWidth;
    let bottomHeigth = that.data.bottomHeigth;
    for (let i in retInfo) {
      let item = retInfo[i];
      if (1 == item.theme_type) {// 精选推荐帖子
        imgHeight = imgWidth * 900 / 600; //自适应高度
        item["imgHeight"] = imgHeight;
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
        item["imgHeight"] = imgHeight;
        item["show_pic"] = config.Upyun + "myq/theme/" + item.user_id + "/" + pic.split(":")[0] + "!280";
      }
      if (!item.head_pic.startsWith('http')) {
        item["head_pic"] = config.Upyun + item.head_pic;
      }else{
        item["head_pic"] = item.head_pic;
      }

      // let col1 = this.data.col1;
      // let col2 = this.data.col2;
      let col1H = that.data.col1H;
      let col2H = that.data.col2H;
      if (col1H <= col2H) {
        col1H += (imgHeight + bottomHeigth);
        col1Temp.push(item);
      } else {
        col2H += (imgHeight + bottomHeigth);
        col2Temp.push(item);
      }
      that.setData({
        col1H: col1H,
        col2H: col2H
      });
    }
    that.setData({
      col1: col1Temp,
      col2: col2Temp
    });

  },

  itemTap: function (event) {
    var theme_id = event.currentTarget.dataset.theme_id;
    // 12浏览X件 19 浏览X件赢提现  14分享X件
    var path = "../../shouye/detail/sweetFriendsDetail/friendsDetail?theme_id=" + theme_id;
    if ("19" == task_type && !isSignComplete) {
      //浏览赢提现
      wx.navigateTo({
        url: path + "&isForceLookLimit=true"
      });
    } else if ("12" == task_type && !isSignComplete) {
      //浏览X件
      wx.navigateTo({
        url: path + "&isForceLook=true"
      });
    } else {
      wx.navigateTo({
        url: path
      });
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      curPage: 1
    });
    if(this.data.isShare){
      that.setData({
        selectindex: -1,
        leftOrRigth: -1,
      });
    }
    that.initData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    that.setData({
      curPage: that.data.curPage+1
    })
    that.initData();
  },




  sharetap: function () {
    is_share = true;
    if (this.data.selectindex < 0) {
      this.showToast("请选择您要分享穿搭喔~", 3000);
    }
  },

  item_select_left:function(event){
    var index = event.currentTarget.dataset.selectindex;
    if (this.data.selectindex == index && this.data.leftOrRigth==0) {
      this.setData({
        selectindex: -1,
        leftOrRigth: -1,
      });
      return;
    }
    this.setData({
      leftOrRigth:0,
      selectindex: index
    });
  },
  item_select_rigth: function (event) {
    var index = event.currentTarget.dataset.selectindex;
    if (this.data.selectindex == index && this.data.leftOrRigth == 1) {
      this.setData({
        selectindex: -1,
        leftOrRigth: -1,
      });
      return;
    }
    this.setData({
      leftOrRigth: 1,
      selectindex: index
    });
  },


  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      var col = that.data.leftOrRigth == 0 ? this.data.col1 : this.data.col2;
      var item = col[this.data.selectindex];
      return {
        title: item.content,
        path: "/pages/shouye/detail/sweetFriendsDetail/friendsDetail?theme_id=" + item.theme_id + "&isShareFlag=true&user_id=" + user_id,
        imageUrl: item.show_pic,
        success: function (res) {
          // var shareNum = parseInt(doValue);// 要分享的件数
          // that.signShare(shareNum);
          // util.task_share_Statistics("qdfx", "702", "7");//赚钱任务分享成功统计
        },
        fail: function (res) {
          // 转发失败  
        }
      };

    }else{
       //右上角转发
      var item = this.data.col1[0];
      var content = "";
      var show_pic = "";
      if (that.data.leftOrRigth != -1) {
        var col = that.data.leftOrRigth == 0 ? this.data.col1 : this.data.col2;
        item = col[this.data.selectindex];
        content = item.content;
        show_pic = item.show_pic;
      } else if (item){
        content = item.content;
        show_pic = item.show_pic;
      }
      return {
        title: content,
        path: "/pages/shouye/detail/sweetFriendsDetail/friendsDetail?theme_id=" + item.theme_id + "&isShareFlag=true&user_id=" + user_id,
        imageUrl: show_pic
      }

    }
  },

  //计数分享件数 并调用赚钱任务接口
  signShare: function (shareNum) {
    if (isSignComplete) {
      return;
    }
    var num = 0;
    var that = this;
    var shareXShopNumKey = signIndex + "shareXShopNum";
    var dataString = new Date().toDateString();

    num = wx.getStorageSync(shareXShopNumKey);

    if (!num || wx.getStorageSync("share_now_time") != dataString) {
      num = 0;
    }
    num++;
    wx.setStorageSync("share_now_time", dataString);

    if (num < shareNum) {// 小于要求的分享次数
      if (doNum == 1) {// 就是一次性发放奖励
        var showText = "再分享" + (shareNum - num) + "条可完成任务喔~";
        // console.log(showText);
        this.showToast(showText, 4000);
        wx.setStorageSync(shareXShopNumKey, num);
        return;
      }
    }
    // console.log(num);

    var signUrl = config.Host + "signIn2_0/signIning" +
      "?token=" + token +
      "&share=true" +
      // "&mac=00%3A03%3A7f%3Aaa%3Abb%3A00"+
      "&index_id=" + signIndex +
      "&day=" + wx.getStorageSync("SIGN_DAY") + config.Version;
    //分享完成赚钱任务接口
    util.http(signUrl, function (data) {
      if (data.status != 1) {
        return;
      }

      wx.setStorageSync(shareXShopNumKey, num);

      if (num < shareNum) {
        var showText = "分享成功奖励" +
          jiangliValue + jiangliName + "，还有" + (shareNum - num) + "次机会喔~";
        that.showToast(showText, 4000);
      } else if (num >= shareNum) {//任务完成
        isSignComplete = true;
        wx.setStorageSync("sharemeiyichuandaback", true);//保存标志 完成弹窗回到赚钱页面弹出
        util.backToSignPager('../sign');
        // var showText = shareXShop_jiangliValue * shareXShop_doNum + shareXShop_jiangliName + "奖励已经存入账户，赶紧去买买买吧~";
      }
    });
  },




})