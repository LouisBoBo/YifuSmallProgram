// pages/mine/wallet/accountDetail/accountDetail.js
import config from '../../../../config';
var util = require('../../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Upyun: config.Upyun,
    activityIndex: 0,
    topData: [],
    curPage: 1,
    signAdData: ['sign_ad1.png', 'sign_ad2.png', 'sign_ad3.png', 'sign_ad4.png', 'sign_ad5.png'], //底部签到图片链接
    signBottomLink: '',
    isShowSignBottomAd: false,
    isShareFlag: false, //分享出去直接跳进来的

    isEmpty: true,
    requestUrl: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.isShareFlag = options.messagefrom;
    var rand = parseInt(Math.random() * 5);
    this.data.signBottomLink = this.data.signAdData[rand];

    this.setData({
      topData: [{
        name: '交易',
        str: "wallet/findFundDetail?"
      },
      {
        name: '退款/提现',
        str: "wallet/selDeposit?"
      },
      {
        name: '售后',
        str: "wallet/findFundDetail?&type=8"
      },
      {
        name: '余额',
        str: "wallet/findFundDetail?&type=2"
      }
      ],

      // { name: '余额', str: "wallet/selKickBack?" }],

      signBottomLink: this.data.signBottomLink
    })


    var baseUrl = 'wallet/findFundDetail?';
    if (options.activityIndex) {
      if (options.activityIndex == 1) {
        this.setData({
          activityIndex: 1
        })
        baseUrl = 'wallet/selDeposit?';
      } else if (options.activityIndex == 3) {
        this.setData({
          activityIndex: 3
        })
        baseUrl = 'wallet/findFundDetail?&type=2';
      }
      else {
        this.setData({
          activityIndex: options.activityIndex
        })
      }
    }

    var dataUrl = config.Host + baseUrl + '&token=' + app.globalData.user.userToken + config.Version + '&order=desc';
    this.data.requestUrl = dataUrl;
    dataUrl = dataUrl + "&page=" + this.data.curPage;
    util.http(dataUrl, this.resultData)
  },
  resultData: function (data) {
    var movies = [];
    var cutJson = {};
    if ((this.data.activityIndex == 0) || (this.data.activityIndex == 2) || (this.data.activityIndex == 3)) { //交易、售后、、余额统一处理
      for (var idx in data.fundDetails) {
        var subject = data.fundDetails[idx];
        cutJson = subject;

        var user_id = app.globalData.user.user_id;
        var money = subject.money.toFixed(2) + '';
        var fdStart = money.indexOf("-");

        if (fdStart == 0) {
          money = subject.money.substring(1);
        }

        cutJson['title'] = '订单号' + subject.order_code;

        var detail = '';
        if (subject.type == 1) {
          detail = '支付';
          money = '-' + money;
        } else if (subject.type == 2) {
          var pay_user = subject.pay_user.substring(subject.pay_user.length - 4);
          detail = '转账';
          if (user_id == subject.user_id) {
            money = '-' + money;
          } else if (user_id == subject.s_user_id)
            money = '+' + money;
          cutJson['title'] = subject.name + '***' + pay_user;
        } else if (subject.type == 3) {
          var pay_user = subject.pay_user.substring(subject.pay_user.length - 4);
          if (this.data.activityIndex == 0)
            detail = '提现';
          money = '-' + money;
          cutJson['title'] = subject.name + '***' + pay_user;
        } else if (subject.type == 4) {
          var pay_user = subject.pay_user.substring(subject.pay_user.length - 4);
          detail = '充值';
          money = '+' + money;
          cutJson['title'] = subject.name + '***' + pay_user;
        } else if (subject.type == 5) {
          detail = '提现额度';
          money = '+' + money;
          cutJson['title'] = '邀请好友奖励'; //左上
        } else if (subject.type == 6) {
          detail = '回佣';
          money = '+' + money;
        } else if (subject.type == 7) {
          detail = '回佣';
          money = '+' + money;
        } else if (subject.type == 8) {


          // if (this.data.activityIndex == 0)
          //   detail = '退款';
          // else if (this.data.activityIndex == 2)
          //   detail = '成功';

          detail = "退款成功";
          money = '+' + money;


        } else if (subject.type == 9) {
          var pay_user = subject.pay_user.substring(subject.pay_user.length - 4);
          detail = '转账';
          if (user_id == subject.user_id) {
            money = '-' + money;
          } else if (user_id == subject.s_user_id)
            money = '+' + money;
          cutJson['title'] = subject.name + '***' + pay_user;
        } else if (subject.type == 10) {
          var pay_user = subject.pay_user.substring(subject.pay_user.length - 4);
          detail = '转账';
          if (user_id == subject.user_id) {
            money = '-' + money;
          } else if (user_id == subject.s_user_id)
            money = '+' + money;
          cutJson['title'] = subject.name + '***' + pay_user;
        } else if (subject.type == 11) {
          detail = '转账';
          if (user_id == subject.user_id) {
            money = '-' + money;
          } else if (user_id == subject.s_user_id)
            money = '+' + money;
          cutJson['title'] = subject.name + subject.pay_user;
        } else if (subject.type == 12) {
          var pay_user = subject.pay_user.substring(subject.pay_user.length - 4);
          if (this.data.activityIndex == 0)
            detail = '提现';
          money = '-' + money;
          cutJson['title'] = subject.name + '***' + pay_user;
        } else if (subject.type == 13) {
          detail = '已到账';
          money = '+' + money;
        } else if (subject.type == 16) {
          detail = '发红包';
          money = '-' + money;
        } else if (subject.type == 17) {
          detail = '抢红包';
          money = '+' + money;
        } else if (subject.type == 18) {
          detail = '免费红包';
          money = '+' + money;
        } else if ((subject.type == 19) || (subject.type == 40)) {
          // detail = (subject.type == 40) ? 'H5签到' : '任务';
          detail = "奖励";

          money = '+' + money;
          cutJson['title'] = "任务奖励";
        } else if (subject.type == 20) {
          detail = '提现额度';
          money = '+' + money;
          cutJson['title'] = '提现失败退款';
        } else if (subject.type == 30) {
          detail = '分享';
          money = '+' + money;
          cutJson['title'] = '分享额外奖励';
        } else if (subject.type == 31) {
          detail = '奖励';
          money = '+' + money;
          cutJson['title'] = '签到额外奖励';
        } else if (subject.type == 32) {
          detail = '奖励';
          money = '+' + money;
          cutJson['title'] = '粉丝奖励';
        } else if (subject.type == 33) {
          detail = '返现';
          money = '+' + money;
          cutJson['title'] = '免付返现';
        } else if (subject.type == 34) {
          detail = '返现';
          money = '+' + money;
          cutJson['title'] = '新用户注册赠送';
        } else if (subject.type == 35) {
          detail = '点赞';
          money = '+' + money;
          cutJson['title'] = '点赞赠送';
        } else if ((subject.type == 36) || (subject.type == 37)) {
          detail = '赠送';
          money = '+' + money;
          cutJson['title'] = subject.name;
        } else if (subject.type == 38) {
          detail = '返现';
          money = '+' + money;
        } else if (subject.type == 39) {
          detail = '余额';
          money = '-' + money;
          cutJson['title'] = '余额衣豆抽奖';
        } else if (subject.type == 41) {
          detail = '奖励';
          money = '+' + money;
          cutJson['title'] = '好友任务奖励';
        } else if (subject.type == 42) {
          detail = '抽奖';
          money = '+' + money;
          cutJson['title'] = '账户余额';


        } else if (subject.type == 43) {

          cutJson['title'] = '余额衣豆抽奖'; //左上
          detail = '提现额度'; //右下
          money = '+' + money;

        } else if (subject.type == 44) {
          cutJson['title'] = '拼团疯抢返还'; //左上
          detail = '提现额度'; //右下
          money = '+' + money;
        }

        else if (subject.type == 45) {
          cutJson['title'] = '余额及卡费抵扣返还'; //左上
          detail = '余额及卡费'; //右下
          money = '+' + money;
        }

        else if (subject.type == 46) {
          cutJson['title'] = '余额及卡费抵扣'; //左上
          detail = '余额及卡费'; //右下
          money = '-' + money;
        }

        else if (subject.type == 47) {
          cutJson['title'] = '任务提现奖励'; //左上
          detail = '提现额度'; //右下
          money = '+' + money;
        }
        else if (subject.type == 48) {
          cutJson['title'] = '疯抢中奖'; //左上
          detail = '提现额度'; //右下
          money = '-' + money;
        }

        else if (subject.type == 49) {
          cutJson['title'] = '好友提现奖励'; //左上
          detail = '提现额度'; //右下
          money = '+' + money;
        }
        else if (subject.type == 50) {
          detail = subject.name;
          money = money;
        }
        else if (subject.type == 51) { //至尊会员奖励
          cutJson['title'] = '至尊会员奖励金'; //左上
          detail = '提现额度'; //右下
          money = '+' + money;
        }
        else if (subject.type == 52) {//至尊会员奖励 1级
          cutJson['title'] = '会员奖励金'; //左上
          detail = '提现额度'; //右下
          money = '+' + money;
        }
        else if (subject.type == 53) { //至尊会员奖励 2级
          cutJson['title'] = '会员奖励金'; //左上
          detail = '提现额度'; //右下
          money = '+' + money;
        }

        else if (subject.type == 54) {
          cutJson['title'] = '取消订单退款'; //左上
          detail = '提现额度'; //右下
          money = '+' + money;
        }

        else if (subject.type == 55) {
          cutJson['title'] = '下级会员奖励金'; //左上
          detail = "奖励金"; //右下
          money = '+' + money;
        }

        else if (subject.type == 56) {
          cutJson['title'] = '下级会员奖励金'; //左上 清除未使用的下级会员奖励金
          detail = "奖励金"; //右下
          money = '-' + money;
        }
        else if (subject.type == 57) {
          cutJson['title'] = '奖励金扣除'; //左上 清除未使用的下级会员奖励金
          detail = "奖励金"; //右下
          money = '-' + money;
        }
        else {
          detail = subject.name;
          money = '+' + money;
        }
        if (this.data.activityIndex == 0 && money.startsWith("-")) {
          money = money.substring(1, money.length)
        }

        if (this.data.activityIndex == 2 && money.startsWith("+")) {
          money = money.substring(1, money.length)
        }
        cutJson['add_time'] = util.getMyDate(subject.add_time, '.', '');
        cutJson['money'] = money;
        cutJson['detail'] = detail;


        movies.push(cutJson)
      }
    } else if (this.data.activityIndex == 1) {
      for (var idx in data.data) {
        var subject = data.data[idx];
        cutJson = subject;
        var tixian_refund = cutJson.t_type == 2 ? "退款" : "提现";
        var detail = '其他';
        if (subject.check == 3) {
          cutJson['detail'] = tixian_refund + '成功';
        } else if (subject.check == 0) {
          cutJson['detail'] = '待审核';
        } else if (subject.check == 1) {
          cutJson['detail'] = '通过';
        } else if (subject.check == 2) {
          cutJson['detail'] = '不通过';
        } else if (subject.check == 4) {
          cutJson['detail'] = '审核已通过';
        } else if (subject.check == 6) {
          cutJson['detail'] = tixian_refund + '已发起';
        } else if (subject.check == 7) {
          cutJson['detail'] = tixian_refund + '已提交至开户行';
        } else if (subject.check == 8) {
          cutJson['detail'] = '开户行发放中，预计1个工作日内到账';
        } else if (subject.check == 9) {
          cutJson['detail'] = '开户行发放中，预计1个工作日内到账';
        } else if (subject.check == 10) {
          cutJson['detail'] = tixian_refund + '成功';
        } else if (subject.check == 11) {
          cutJson['detail'] = '转账失败';
        } else if (subject.check == 12) {
          cutJson['detail'] = '已重新申请';
        }

        cutJson['title'] = subject.collect_bank_name + '***' + subject.collect_bank_code;
        cutJson['add_time'] = util.getMyDate(subject.add_date, '.', '');
        cutJson['money'] = subject.money.toFixed(2) + "元";

        movies.push(cutJson)
      }
    }

    //  else if (this.data.activityIndex == 3) {
    //   for (var idx in data.data) {
    //     var subject = data.data[idx];
    //     cutJson = subject;

    //     var title = '冻结';
    //     if (subject.is_free == 1) {
    //       title = '成功';
    //     } else if (subject.is_free == 0) {
    //       if (subject.status == 1)
    //         title = '已退款';
    //       else if (subject.status == 1)
    //         title = '退款中';
    //       else if (subject.status == 1)
    //         title = '还未收到货';
    //       else if (subject.status == 1)
    //         title = '无效';
    //     }
    //     cutJson['title'] = title;
    //     cutJson['detail'] = '订单号' + subject.order_code;
    //     cutJson['namePrice'] = subject.user_name == undefined ? '' : subject.user_name + '   ¥' + subject.order_price;
    //     cutJson['add_time'] = util.getMyDate(subject.add_date, '.', '');
    //     cutJson['money'] = '+' + subject.money.toFixed(2);

    //     cutJson['is_show'] = true;
    //     if (subject.type == 8) {
    //       cutJson['is_show'] = false;
    //       cutJson['detail'] = '惊喜任务签到翻倍';
    //       if (subject.is_free == 0)
    //         cutJson['title'] = '冻结';
    //       else if (subject.is_free == 1)
    //         cutJson['title'] = '成功';
    //     } else if (subject.type == 9) {
    //       cutJson['is_show'] = false;
    //       cutJson['detail'] = subject.is_free == 0 ? '邀请好友——好友未提现奖励' : '邀请好友——好友提现奖励';
    //       cutJson['title'] = subject.is_free == 0 ? '冻结' : '成功';
    //     } else if (subject.type == 10) {
    //       cutJson['is_show'] = false;
    //       var arr = ["免单第一次返现(签收商品后)", "免单第二次返现(签收后一个月)", "免单第三次返现(签收后二个月)", "免单第四次返现(签收后三个月)", "免单第五次返现(签收后四个月)"];
    //       cutJson['detail'] = arr[subject.is_buy];
    //     } else if (subject.type == 11) {
    //       cutJson['is_show'] = false;
    //       cutJson['title'] = subject.is_free == 0 ? '0元购返现冻结' : '0元购返现解冻';
    //     }

    //     movies.push(cutJson)
    //   }
    // }
    var totalMovies = {}

    //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.datalist.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      datalist: totalMovies
    });

    this.data.curPage += 1;
    wx.stopPullDownRefresh()
  },

  onTapClick: function (event) {
    const index = event.currentTarget.dataset.index + 1;
    this.setData({
      activityIndex: event.currentTarget.dataset.index
    })

    this.data.curPage = 1;
    this.data.datalist = {};

    // + '&token=KK1DNFVXFEH741J8RB5K';
    var baseUrl = this.data.topData[this.data.activityIndex].str;
    var dataUrl = config.Host + baseUrl + config.Version + '&order=desc' + '&token=' + app.globalData.user.userToken;
    this.data.requestUrl = dataUrl;
    this.data.isEmpty = true;
    dataUrl = dataUrl + "&page=" + this.data.curPage;
    util.http(dataUrl, this.resultData)
  },

  //跳转提现详情
  selectDetail: function (event) {

    var item = JSON.stringify(event.currentTarget.dataset.item);
    if (this.data.activityIndex == 1) {
      wx.navigateTo({
        url: 'ForwardDetail?item=' + item + "&check=" + "-1",
      })
    } else if (this.data.activityIndex == 2) {
      wx.navigateTo({
        url: 'RefundDetail?item=' + item,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (this.data.isShareFlag) {
      this.setData({
        isShowSignBottomAd: true,
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.curPage = 1;
    this.data.datalist = {};
    this.data.isEmpty = true;
    var dataUrl = this.data.requestUrl + "&page=1";
    util.http(dataUrl, this.resultData)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var dataUrl = this.data.requestUrl + "&page=" + this.data.curPage;
    util.http(dataUrl, this.resultData)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  openSignClick: function () { //打开赚钱页
    wx.switchTab({
      url: "../../../sign/sign",
    }) // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
  },
  signBottomAdCloseClick: function () {
    this.setData({
      isShowSignBottomAd: false
    })
  },
})