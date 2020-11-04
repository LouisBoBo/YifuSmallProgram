import config from '../../../config';
var util = require('../../../utils/util.js');
var app = getApp();


var likeCount = 0

var selectedIndex = []

var showEditer = true;
var shareJson = "";
var token;
var user_id;
Page({

  data: {
    showEditer: showEditer,
    signFinishShow: false,
    signFinishDialog: {
      top_tilte: "",//任务完成弹窗 顶部标题
      tilte: "",//任务完成弹窗 标题
      contentText: "",//任务完成弹窗 具体类容
      leftText: "",//任务完成弹窗 左边按钮
      rigthText: ""//任务完成弹窗 右边按钮
    },
    shareTitle: "",
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
    selectedIndex = []
    showEditer = true;
    
    if (!app.globalData.user){
      this.setData({
        likeCount: 0,
        haveNoData: true,
        datalist: []
      });

      return
    }
    likeCount = options.likeCount
    token = app.globalData.user.userToken;
    user_id = app.globalData.user.user_id;
    

    var that = this;
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
  },
  onShow: function () {

  },
  initData: function () {
    var dataUrl = config.Host + "like/selLike" +
      "?token=" + token +
      "&pager.curPage=" + this.data.curPage +
      "&pager.pageSize=" + this.data.pageSize +
      "&type1=6&type_name=" + config.Version;
    // console.log(dataUrl);
    util.httpNeedLogin(dataUrl, this.cutShopCode, function () { });
  },

  cutShopCode: function (data) {
    // console.log(data);
    wx.stopPullDownRefresh();
    var that = this;

    var isVip = data.isVip != undefined ? data.isVip : '';
    var maxType = data.maxType != undefined ? data.maxType : '';
    that.data.isVip = isVip;
    that.data.maxType = maxType;

    data.listShop = data.likes

    if (that.data.curPage == 1 &&
      (!data || !data.listShop || !data.listShop.length || data.listShop.length <= 0)) {
      that.setData({
        likeCount: 0,
        haveNoData: true,
        datalist: []
      });
      return;
    }

    var shop_code_cut = '';
    var cutJson = {};
    var dataListTemp = that.data.curPage == 1 ? [] : that.data.datalist;
    // for (var i = 0; i < data.listShop.length; i++) {
    for (var i in data.listShop) {
      shop_code_cut = data.listShop[i].shop_code.substring(1, 4);
      cutJson = data.listShop[i];
      cutJson["cut_shop_code"] = shop_code_cut;
      var shop_se_price = (cutJson.shop_se_price).toFixed(1);
      // cutJson["shop_se_price"] = (cutJson.shop_se_price * 0.9).toFixed(1);

      //何波修改2018-4-4
      if (app.globalData.oneYuanData == 0)//是1元购
      {
        var se_price = (cutJson.wxcx_shop_group_price * 1).toFixed(1);

        if (that.data.isVip > 0) //如果是会员 列表价格=单独购买价-抵扣价格
        {
          se_price = util.get_discountPrice(cutJson.shop_se_price, that.data.shop_deduction, that.data.reduceMoney, that.data.maxType);
        }

        cutJson.shop_se_price = (se_price * 1).toFixed(1);
        cutJson.shop_price = shop_se_price;
      } else {
        cutJson.shop_se_price = shop_se_price;
        cutJson.supp_label = '';
      }
      //添加选中状态
      cutJson.selected = false;

      dataListTemp.push(cutJson)
    }
    that.setData({
      likeCount: likeCount,
      haveNoData: false,
      datalist: dataListTemp,
      supply_isShow: app.showSub

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
      curPage: that.data.curPage + 1
    })
    that.initData();
  },
  dialog_close: function () {
    this.setData({
      signFinishShow: false
    });
  },
  btn_left: function () {
    this.toSignPager();
  },
  btn_rigth: function () {
    this.toMainPager();
  },


  cancelTap: function (event) { //取消点击
    showEditer = true
    this.setData({
      showEditer: showEditer
    })
  },
  edtiorTap:function(){ //编辑点击
    showEditer ? showEditer = false : showEditer = true
    this.setData({
      showEditer: showEditer
    })

  },


  delShopTap: function () {//删除点击

    var that = this;



    var tempData = this.data.datalist
    if(selectedIndex.length>0){


   
      var delLoveShopCodeStr = ''    
      for(var i = 0;i < selectedIndex.length;i++){

        // if(i == 0){
        //   delLoveShopCodeStr = delLoveShopCodeStr + tempData[selectedIndex[i]].shop_code
        // }else{
          delLoveShopCodeStr = delLoveShopCodeStr + ',' + tempData[selectedIndex[i]].shop_code
        // }
      }

     that.deleteMyLove(delLoveShopCodeStr)

    }else{
      that.showToast("请选择要删除的商品哦",2000)
    }

  },


  deleteMyLove: function (delLoveShopCodeStr){
    var that = this
    var dataUrl = config.Host + "like/delLike" +
      "?token=" + token +
      "&shop_codes=" + delLoveShopCodeStr
      + config.Version
      ;

    util.http(dataUrl, function(data){
     if( data.status == 1){
       
      var tempDataListTemp = [];
       var dataListTemp = that.data.datalist;

       for (var x = 0; x < dataListTemp.length;x++ ){
         if (selectedIndex.indexOf(x) == -1){
           tempDataListTemp.push(dataListTemp[x])
         }
       }

      //重新赋值要显示的列表
       dataListTemp = tempDataListTemp

      console.log(dataListTemp)


       likeCount = likeCount - selectedIndex.length;
       if(likeCount == 0){
         showEditer = false 
       }
       that.setData({
         haveNoData:likeCount == 0? true:false,
         showEditer: showEditer,
         likeCount: likeCount,
         datalist: dataListTemp,
       })

      //清空选中的订单数组
       selectedIndex = []
       that.showToast("删除成功",1500)



     }else{
       that.showToast(data.message,3000)

     }
    });
  },

  shoplist_tap: function (event) {
    // console.log(event.currentTarget.dataset.shop_code);
    var shop_code = event.currentTarget.dataset.shop_code;
    wx.navigateTo({
      url: "../../shouye/detail/detail?shop_code=" + shop_code,
    });
  },



  item_select: function (event) {
    var that = this;
    //选中的角标
    var index = event.currentTarget.dataset.selectindex;


    var add = true;



    //判断当前选中的角标是否是之前已经加进去的角标
    var tempSelectedIndex = selectedIndex
    if (tempSelectedIndex.length > 0) {
      for (var i = 0; i < selectedIndex.length; i++) {
        if (selectedIndex[i] == index) { //点击的是已经选中的
          add = false
          break
        } else { //点击的不是已经选中的
          add =  true
        } 
      }
    } else { //刚进来没有点击过
      add = true
    }

    that.data.datalist[index].selected = add
    var dataListTemp = that.data.datalist
    that.setData({
      datalist: dataListTemp,
    })
    if(add){
      selectedIndex.push(index)
    }else{
      var tempSelectedIndex = selectedIndex
      tempSelectedIndex.forEach(function (item, mIndex, arr) {
        if (item == index) {
          selectedIndex.splice(mIndex, 1);
        }
      });
    }

    console.log('选中的' + selectedIndex)








    // //判断当前选中的角标是否是之前已经加进去的角标
    // var tempSelectedIndex = selectedIndex
    // if (tempSelectedIndex.length > 0){
    //   for (var i = 0; i < selectedIndex.length; i++) {
    //     if (selectedIndex[i] == index ){ //点击的是已经选中的

    //       var dataListTemp;
    //       that.data.datalist[index].selected = false
    //       dataListTemp = that.data.datalist
    //       that.setData({
    //         datalist: dataListTemp,
    //       })

    //       delete selectedIndex[index]

    //     }else{ //点击的不是已经选中的
    //       var dataListTemp;
    //       that.data.datalist[index].selected = true
    //       dataListTemp = that.data.datalist
    //       that.setData({
    //         datalist: dataListTemp,
    //       })

    //       selectedIndex.push(index)

    //     }
    //   }
    // }else{ //刚进来没有点击过
    //   var dataListTemp;
    //   that.data.datalist[index].selected = true
    //   dataListTemp = that.data.datalist
    //   that.setData({
    //     datalist: dataListTemp,
    //   })
    //   selectedIndex.push(index)

    // }









    // if (this.data.selectindex == index) {
    //   this.setData({
    //     selectindex: -1
    //   });
    //   return;
    // }

    // this.setData({
    //   selectindex: index
    // });




    // var shareshop = this.data.datalist[this.data.selectindex];
  },


})