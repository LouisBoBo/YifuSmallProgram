var t = "https://oltest.www.xiaoxingli.com/", e = "https://oltest.im.xiaoxingli.com/", n = function(e, n, o, r) {
    var s = t;
    r && (s = r), wx.request({
        url: s + n,
        method: "get",
        header: {
            Token: e
        },
        success: function(t) {
            return 0 == (t = t.data).result.Code ? "function" == typeof o && o(t.result.Data, t.result.AllCount) : (wx.showModal({
                content: t.result.ErrorMsg || t.result,
                showCancel: !1
            }), "function" == typeof o && o(t.result.ErrorMsg || t.result));
        },
        fail: function(t) {
            return wx.showToast({
                title: "网络出错，请刷新重试",
                icon: "none",
                duration: 1e3,
                mask: !0
            }), "function" == typeof o && o(!1);
        }
    });
}, o = function(e, n, o, r, s) {
    var u = t;
    s && (u = s), wx.request({
        url: u + n,
        header: {
            Token: e
        },
        data: o,
        method: "post",
        success: function(t) {
            return 0 == (t = t.data).status ? 0 == t.result.Code ? "function" == typeof r && r(t.result.Data, t.result.AllCount) : (wx.showModal({
                content: t.result.ErrorMsg || t.result,
                showCancel: !1
            }), "function" == typeof r && r(t.result.ErrorMsg || t.result)) : (wx.showModal({
                content: t.result.ErrorMsg || t.result,
                showCancel: !1
            }), "function" == typeof r && r(t));
        },
        fail: function(t) {
            return wx.showToast({
                title: "网络出错，请刷新重试",
                icon: "none",
                duration: 1e3,
                mask: !0
            }), "function" == typeof r && r(!1);
        }
    });
}, r = function(t, e, n) {
    wx.request({
        url: "https://oltest.img.xiaoxingli.com/Image/UploadImage",
        header: {
            Token: t
        },
        data: e,
        method: "post",
        success: function(t) {
            return t = t.data, "function" == typeof n && n(t);
        },
        fail: function(t) {
            return wx.showToast({
                title: "网络出错，请刷新重试",
                icon: "none",
                duration: 1e3,
                mask: !0
            }), "function" == typeof n && n(!1);
        }
    });
};

module.exports = {
    rootDocment: t,
    getReq: function(t, e, o) {
        if (wx.getStorageSync("OpenId")) {
            var r = wx.getStorageSync("OpenId") || [];
            n(r, e, o, "");
        } else t.Promise.then(function(t) {
            wx.setStorageSync("OpenId", t), n(t, e, o, "");
        });
    },
    postReq: function(t, e, n, r) {
        if (wx.getStorageSync("OpenId")) {
            var s = wx.getStorageSync("OpenId") || [];
            o(s, e, n, r, "");
        } else t.Promise.then(function(t) {
            wx.setStorageSync("OpenId", t), o(t, e, n, r, "");
        });
    },
    getReqIm: function(t, o, r) {
        if (wx.getStorageSync("OpenId")) {
            var s = wx.getStorageSync("OpenId") || [];
            n(s, o, r, e);
        } else t.Promise.then(function(t) {
            wx.setStorageSync("OpenId", t), n(t, o, r, e);
        });
    },
    postReqIm: function(t, n, r, s) {
        if (wx.getStorageSync("OpenId")) {
            var u = wx.getStorageSync("OpenId") || [];
            o(u, n, r, s, e);
        } else t.Promise.then(function(t) {
            wx.setStorageSync("OpenId", t), o(t, n, r, s, e);
        });
    },
    postImg: function(t, e, n) {
        if (wx.getStorageSync("OpenId")) {
            var o = wx.getStorageSync("OpenId") || [];
            r(o, e, n);
        } else t.Promise.then(function(t) {
            wx.setStorageSync("OpenId", t), r(t, e, n);
        });
    }
};