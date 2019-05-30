const app = getApp();
Page({
    data: {
        list: [{
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
        isModalShow: '',
        showTips: false,
        studentTips: '',
        teacherTips: '',
        activeTabIndex: '1',
        studentCode: '',
        studentName: '',
        teacherKey: '',
        impowered: false,
        userInfo1: {},
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(111111111111111111)
        let loginFlag = wx.getStorageSync('skey');

        console.log("pageLoad  skey is : " + loginFlag)
        if (loginFlag) {
            // 检查 session_key 是否过期
            wx.checkSession({
                // session_key 有效(未过期), 加载用户头像等信息
                success: function() {
                    if (app.globalData.userInfo) {
                        this.setData({
                            userInfo1: app.globalData.userInfo,
                        })
                    } else if (this.data.canIUse) {
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        app.userInfoReadyCallback = res => {
                            this.setData({
                                userInfo1: res.userInfo,
                            })
                        }
                    } else {
                        // 在没有 open-type=getUserInfo 版本的兼容处理
                        wx.getUserInfo({
                            success: res => {
                                app.globalData.userInfo = res.userInfo
                                this.setData({
                                    userInfo1: res.userInfo,
                                })
                            }
                        })
                    }
                },

                // session_key 过期
                fail: function() {
                    app.globalData.userInfo = null;
                    this.setData({
                        impowered: false,
                        userInfo1: {}
                    })
                }
            });
        }
    },

    doLogin: function(e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            app.globalData.userInfo = e.detail.userInfo
            wx.login({
                success: res => {
                    console.log("用户登录凭证： " + res.code)
                    this.getLoginState(res.code);
                }
            });
        } else {
            //用户按了拒绝按钮
        }
    },

    getLoginState: function(code) {
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
                if (result.data.stateCode == '1404') {
                    this.setData({
                        studentCode: '',
                        studentName: '',
                        teacherKey: '',
                        isModalShow: 'show',
                        showTips: false,
                        studentTips: '',
                        teacherTips: ''
                    });
                    return;
                } else if (result.data.stateCode == '1200') {
                    // 之前注册登陆过，但是当前已经过期，后台已更新sessionKey
                    wx.setStorageSync('skey', result.data.sessionKey);

                    this.setData({
                        impowered: true,
                        userInfo1: app.globalData.userInfo
                    })
                }
            }
        })
    },

    hideModal(e) {
        this.setData({
            isModalShow: null
        })
    },

    tabSelect: function(e) {
        this.setData({
            activeTabIndex: e.currentTarget.dataset.id,
            showTips: false,
            studentTips: '',
            teacherTips: ''
        });
    },

    blurStudentCode: function(e) {
        this.setData({
            studentCode: e.detail.value
        })
    },

    blurStudentName: function(e) {
        this.setData({
            studentName: e.detail.value
        })
    },

    blurTeacherKey: function(e) {
        this.setData({
            teacherKey: e.detail.value
        })
    },

    submitRole: function() {
        if (this.data.activeTabIndex == 1) { // 家长
            var sCode = this.data.studentCode.toLowerCase();
            var sName = this.data.studentName.toLowerCase();
            if (sCode == '' || sCode == 'null' || sName == '' || sName == 'null') {
                this.setData({
                    showTips: true
                });
                return
            } else {
                this.setData({
                    showTips: false
                });
            }
        } else { // 教师
            var tKey = this.data.teacherKey.toLowerCase();
            if (tKey == '' || tKey == 'null') {
                this.setData({
                    showTips: true
                });
                return
            } else {
                this.setData({
                    showTips: false
                });
            }
        }
        wx.login({
            success: res => {
                if (this.data.activeTabIndex == 1) {
                    this.parentRegister(res.code);
                } else if (this.data.activeTabIndex == 2) {
                    this.teacherRegister(res.code);
                }
            }
        });
    },

    parentRegister: function(code) {
        wx.request({
            url: app.globalData.serverBase + "/api/wxuser/pregister",
            data: {
                code: code,
                studentCode: this.data.studentCode,
                studentName: this.data.studentName
            },
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
                'name': app.globalData.userInfo && app.globalData.userInfo.nickName || ''
            },
            success: result => {
                if (result.data.stateCode == '1404') {
                    this.setData({
                        studentTips: '输入的信息不正确，找不到相关学员！'
                    });
                    return;
                } else if (result.data.stateCode == '1200') {
                    this.setData({
                        isModalShow: null, 
                        impowered: true,
                        userInfo1: app.globalData.userInfo
                    });
                    wx.setStorageSync('skey', result.data.sessionKey);
                }
            }
        })
    },

    teacherRegister: function(code) {
        wx.request({
            url: app.globalData.serverBase + "/api/wxuser/tregister",
            data: {
                code: code,
                teacherWxKey: this.data.teacherKey
            },
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
                'name': app.globalData.userInfo && app.globalData.userInfo.nickName || ''
            },
            success: result => {
                if (result.data.stateCode == '1404') {
                    this.setData({
                        teacherTips: '无效的授权码！'
                    });
                    return;
                } else if (result.data.stateCode == '1200') {
                    this.setData({
                        isModalShow: null,
                        impowered: true,
                        userInfo1: app.globalData.userInfo
                    });
                    wx.setStorageSync('skey', result.data.sessionKey);
                } else if (result.data.stateCode == '1222') {
                    this.setData({
                        teacherTips: '过期的授权码！'
                    });
                    return;
                }
            }
        })
    }
});