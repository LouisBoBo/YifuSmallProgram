import config from '../../../../config';
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    shareTitle: '',
    shareLink: '',
    shop_code:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shareTitle: options.title,
      shareLink: options.link,
      shop_code: options.shop_code,
    })
    console.log(options.link)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: this.data.shareTitle,
      path: '/pages/shouye/detail/detail?shop_code=' + this.data.shop_code + "&isShareFlag=true" + "&user_id=" + app.globalData.user.user_id,
      imageUrl: this.data.shareLink,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})