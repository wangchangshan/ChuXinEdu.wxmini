const app = getApp();
Page({
    data: {
        list: [
            {
                id: 'student',
                name: 'Students',
                title: '我的学生',
                url: '/pages/member/student/index',
                color: 'red',
                icon: 'peoplelist'
            },
            {
                id: 'schedule',
                name: 'Schedule',
                title: '课程表',
                url: '/pages/member/schedule/schedule',
                color: 'cyan',
                icon: 'calendar'
            },
            {
                id: 'packages',
                name: 'Study Plan',
                title: '课程套餐',
                url: '/pages/member/package/package',
                color: 'green',
                icon: 'shop'
            }
        ],
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },

    doLogin: function(e) {
        wx.login({
            success: res => {
                console.log("用户登录凭证： " + res.code)
                console.log(res)
                this.getSessionKey(res.code, 'wxbc88d5a1f9bda2ec', '4a70f1859bc22f0a5caaf7e771bad42c');
                wx.getUserInfo({
                    success: result => {
                        console.log("获取用户信息成功")
                        console.log(result)
                        //app.globalData.userInfo = result.userInfo
                        this.setData({
                            userInfo: result.userInfo,
                            hasUserInfo: true
                        })
                    },
                    fail: result => {
                        console.log("获取用户信息失败")

                        // 用户取消授权
                        // ...
                    }
                })
            },
            fail: res => {
                console.log("用户登录凭证失败")
                console.log(res);
            },
            complete: res => {
            }
        });
    },

    getLoginState: function(code){
        wx.request({
            url: app.globalData.serverBase + "/api/wxuser/getloginstate",
            data: {
                code: code
            },
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
                'name': app.globalData.userInfo && app.globalData.userInfo.nickName || ''
            },
            success: result => {
                if (result.data.code && result.data.code == '1401') {
                    this.setData({
                        hiddenLoading: true
                    });
                    return;
                }
                this.setData({
                    packageList: result.data,
                    hiddenLoading: true
                })
            }
        })
    },

    getSessionKey: function(code, appid, appSecret) {
        var opt = {
            method: 'GET',
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            params: {
                appid: appid,
                secret: appSecret,
                js_code: code,
                grant_type: 'authorization_code'
            }
        };

        wx.request({
            method: 'GET',
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
                appid: appid,
                secret: appSecret,
                js_code: code,
                grant_type: 'authorization_code'
            },
            success: response => {
                console.log("获取session_key成功")
                console.log(response)
                var data = response.data;
                if (!data.openid || !data.session_key || data.errcode) {
                    return {
                        result: -2,
                        errmsg: data.errmsg || '返回数据字段不完整'
                    }
                } else {
                    return data
                }
            }
        })
    },

    getUserInfo: function (e) {
        var code = wx.login();
        console.log('login code is ' + code);
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },

    kindToggle: function (e) {
        var id = e.currentTarget.id, list = this.data.list;
        for (var i = 0, len = list.length; i < len; ++i) {
            if (list[i].id == id) {
                list[i].open = !list[i].open
            } else {
                list[i].open = false
            }
        }
        this.setData({
            list: list
        });
    }
});
