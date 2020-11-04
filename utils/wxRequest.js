function e(e, n, d) {
    n.Loading && t.default.loading();
    var s = n.query || {};
    if ("DELETE" == n.method || "GET" == n.method || !n.method) {
        for (var r in s) d += ("&" + r + "=" + s[r]).replace("&", "?");
    }
    var l = {
        "content-Type": "application/json",
        Token: e
    };
    n.method, l = {
        "content-type": "application/json; charset=utf-8",
        Token: e
    };
    var p = void 0;
    "Convention" != n.apiType && n.apiType ? "Chat" == n.apiType ? p = o : "Img" == n.apiType && (p = i) : p = a, 
    wx.request({
        url: "" + p + d,
        method: n.method || "GET",
        data: s,
        header: l,
        success: function(e) {
            t.default.loaded(), 0 == e.data.status ? 0 == e.data.result.Code ? n.success && n.success(e.data.result) : n.fail ? (n.Loading && wx.hideLoading(), 
            n.fail(e.data.result)) : (console.log("error:" + d), n.Loading && wx.hideLoading(), 
            "string" == typeof e.data.result.ErrorMsg && wx.showToast({
                title: e.data.result.ErrorMsg,
                icon: "none"
            })) : 0 != e.data.status && (n.fail ? (n.Loading && wx.hideLoading(), n.fail(e.data.result)) : (n.Loading && wx.hideLoading(), 
            "string" == typeof e.data.result && wx.showToast({
                title: e.data.result,
                icon: "none",
                duration: 2e3
            })));
        },
        fail: function(e) {
            n.Loading && wx.hideLoading(), wx.showToast({
                title: "网络错误",
                icon: "none"
            });
        }
    });
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var t = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("./tip")), a = "https://www.xiaoxingli.com/", o = "https://im.xiaoxingli.com/", i = "https://img.xiaoxingli.com/Image/UploadImage";

exports.default = function() {
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, a = arguments[1], o = getApp(), i = void 0;
    if (!wx.getStorageSync("OpenId")) return o.Promise.then(function(o) {
        i = o, wx.setStorageSync("OpenId", o), "GetOpenId" !== t.specialType && e(i, t, a);
    }), void ("GetOpenId" === t.specialType && e(i, t, a));
    e(i = wx.getStorageSync("OpenId"), t, a);
};