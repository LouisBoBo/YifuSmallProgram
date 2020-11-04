//index.js
//获取应用实例
// 赚钱页面做任务 跳转到购物页面专用
import config from '../../../config';
import DataBase from '../../../data/dataBase.js';
var app = getApp();


Page({
  data: {
    Upyun: config.Upyun,
    isShowMakeMoney: true
  },

  onLoad: function () {
    var isShowMakeMoney = app.globalData.user.shouyecount;
    if (isShowMakeMoney==false)
      this.setData({isShowMakeMoney: isShowMakeMoney})

    const allTypes = DataBase.getTypesData();
    const allBrand = DataBase.getBrandsData();
    const hotTitle = DataBase.gethotTitleData();

    this.setData({
      allTypes: allTypes,
      allBrandsData: allBrand,
      searchPlacehorder: hotTitle[0]
    })
    console.log('00000000000----' + config.Upyun + allBrand[0].icon)
  },

  // // 搜索
  // wxSerchFocus: function (e) {
  //   wx.navigateTo({
  //     url: '../shopSearch/shopSearch',
  //   })
  // },
  // //商品分类
  // typeTap: function () {
  //   console.log('商品分类');
  //   wx.navigateTo({
  //     url: '../../shouye/shopClassType/shopClassType',
  //   })
  // },
  // //赚钱页
  // moneytap: function () {
  //   wx.navigateTo({
  //     url: '../../sign/sign',
  //   })
  // },

  // 分类点击
  categoryTap: function (event) {
    var id = event.currentTarget.dataset.id;
    var name = event.currentTarget.dataset.name;

    wx.navigateTo({
      url: '../shopCategoryList/shopCategoryList?' +
      "class_id=" + id +
      "&navigateTitle=" + name

    })
  },
  
  // 品牌点击
  onBrandTap: function (event) {
    // encodeURIComponent / decodeURIComponent：
    // 以UTF - 8编码编码所有字符串。
    var id = event.currentTarget.dataset.id;
    var name = encodeURIComponent(event.currentTarget.dataset.name);
    var pic = event.currentTarget.dataset.pic;
    var remark = encodeURIComponent(event.currentTarget.dataset.remark)

    wx.navigateTo({
      
      url: '../../listHome/brandsDetail/brandsDetail?' +
      "class_id=" + id +
      "&navigateTitle=" + name +
      "&brandPic=" + pic +
      "&remark=" + remark 
    })
  },
  // 更多品牌点击
  onMoreBrandTap: function (event) {
    console.log("onMoreBrandTap");
    wx.navigateTo({
      url: '../moreBrandsList/moreBrandsList'
    })
    // wx.navigateTo({
    //   url: '../listHome/order/confirm/confirm'
    // })
  }


})
