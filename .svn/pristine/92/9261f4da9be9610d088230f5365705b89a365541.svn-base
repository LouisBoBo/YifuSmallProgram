function n(n, e) {
    if (!(n instanceof e)) throw new TypeError("Cannot call a class as a function");
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e = function() {
    function n(n, e) {
        for (var t = 0; t < e.length; t++) {
            var o = e[t];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), 
            Object.defineProperty(n, o.key, o);
        }
    }
    return function(e, t, o) {
        return t && n(e.prototype, t), o && n(e, o), e;
    };
}(), t = function() {
    function t() {
        n(this, t), this.isLoading = !1;
    }
    return e(t, null, [ {
        key: "success",
        value: function(n) {
            var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 500;
            if (setTimeout(function() {
                wx.showToast({
                    title: n,
                    icon: "success",
                    mask: !0,
                    duration: e
                });
            }, 300), e > 0) return new Promise(function(n, t) {
                setTimeout(function() {
                    n();
                }, e);
            });
        }
    }, {
        key: "confirm",
        value: function(n) {
            var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "提示";
            return new Promise(function(o, i) {
                wx.showModal({
                    title: t,
                    content: n,
                    showCancel: !0,
                    success: function(n) {
                        n.confirm ? o(e) : n.cancel && i(e);
                    },
                    fail: function(n) {
                        i(e);
                    }
                });
            });
        }
    }, {
        key: "toast",
        value: function(n, e, t) {
            setTimeout(function() {
                wx.showToast({
                    title: n,
                    icon: "none",
                    mask: !0,
                    duration: e || 1e3
                });
            }, 300), t && setTimeout(function() {
                t();
            }, 1e3);
        }
    }, {
        key: "alert",
        value: function(n) {
            wx.showToast({
                title: n,
                image: "../images/alert.png",
                mask: !0,
                duration: 1500
            });
        }
    }, {
        key: "error",
        value: function(n, e) {
            wx.showToast({
                title: n,
                image: "../images/error.png",
                mask: !0,
                duration: 500
            }), e && setTimeout(function() {
                e();
            }, 500);
        }
    }, {
        key: "loading",
        value: function() {
            var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "加载中";
            t.isLoading || (t.isLoading = !0, wx.showLoading({
                title: n,
                mask: !0
            }));
        }
    }, {
        key: "loaded",
        value: function() {
            t.isLoading && (t.isLoading = !1, wx.hideLoading());
        }
    }, {
        key: "share",
        value: function(n, e, o) {
            return {
                title: n,
                path: e,
                desc: o,
                success: function(n) {
                    t.toast("分享成功");
                }
            };
        }
    } ]), t;
}();

exports.default = t, t.isLoading = !1;