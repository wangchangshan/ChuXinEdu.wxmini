const app = getApp();
Component({
    options: {
        addGlobalClass: true
    },
    lifetimes: {
        attached: function () {
            // 添加'SKEY'的验证，为了防止同意授权但是没有输入注册码提交成功的情况。
            if (app.globalData.UserInfo && wx.getStorageSync('SKEY')) {
                
                this.getUserInfoBySKey(wx.getStorageSync('SKEY'));
                this.setData({
                    impowered: true,
                    curUser: app.globalData.UserInfo,
                    curUserType: app.globalData.UserType
                })
            }
        }
    },
    data: {
        tlist: [{
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
        plist: [
        {
            id: 'schedule',
            name: 'Schedule',
            title: '本周课程',
            url: '/pages/member/student/myschedule/index',
            color: 'cyan',
            icon: 'calendar'
        },
        {
            id: 'packages',
            name: 'history',
            title: '课程记录',
            url: '/pages/member/student/course/course',
            color: 'green',
            icon: 'list'
        }
        ],
        isModalShow: '',
        showTips: false,
        studentTips: '',
        teacherTips: '',
        activeTabIndex: '1',
        studentCode: '',
        studentName: '',
        teacherCode: '',
        teacherName: '',
        displayName: '',
        teacherKey: '',
        impowered: false,
        curUser: null,
        curUserType: 0,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    methods: {
        doLogin: function (e) {
            if (e.detail.userInfo) {
                app.globalData.UserInfo = e.detail.userInfo
                wx.setStorageSync('USERINFO', e.detail.userInfo);

                wx.login({
                    success: res => {
                        //console.log("用户登录凭证： " + res.code)
                        this.getLoginState(res.code);
                    }
                });
            } else {
                //用户按了拒绝按钮
                wx.setStorageSync('SKEY', null);
            }
        },

        getLoginState: function (code) {
            wx.request({
                url: app.globalData.ServerBase + "/api/wxuser/getloginstate",
                data: {
                    code: code
                },
                method: 'GET',
                header: {
                    'Content-Type': 'application/json',
                    'skey': wx.getStorageSync('SKEY')
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
                        // 之前后台注册登陆过，但是当前已经过期，后台已更新sessionKey
                        wx.setStorageSync('SKEY', result.data.sessionKey);

                        this.setData({
                            impowered: true,
                            displayName: result.data.innerPersonName,
                            curUser: app.globalData.UserInfo,
                            curUserType: result.data.sessionKey.charAt(0)
                        })

                        if(this.data.curUserType == 1)
                        {
                            this.setData({
                                studentCode: result.data.innerPersonCode,
                                studentName: result.data.innerPersonName,
                            })
                        }
                        else if (this.data.curUserType == 2)
                        {
                            this.setData({
                                teacherCode: result.data.innerPersonCode,
                                teacherName: result.data.innerPersonName
                            })
                        }
                    }
                }
            })
        },

        getUserInfoBySKey: function (skey) {
            wx.request({
                url: app.globalData.ServerBase + "/api/wxuser/getwxuserinfo",
                data: {
                    sKey: skey
                },
                method: 'GET',
                header: {
                    'Content-Type': 'application/json',
                },
                success: result => {
                    if (result.data.stateCode == '1404') {
                        this.setData({
                            curUser: null,
                            impowered: null,
                            studentCode: '',
                            studentName: '',
                            teacherKey: '',
                            showTips: false,
                            studentTips: '',
                            teacherTips: ''
                        });
                        return;
                    } else if (result.data.stateCode == '1200') {

                        this.setData({
                            displayName: result.data.innerPersonName,
                            curUserType: skey.charAt(0)
                        })

                        if (this.data.curUserType == 1) {
                            this.setData({
                                studentCode: result.data.innerPersonCode,
                                studentName: result.data.innerPersonName,
                            })
                        }
                        else if (this.data.curUserType == 2) {
                            this.setData({
                                teacherCode: result.data.innerPersonCode,
                                teacherName: result.data.innerPersonName
                            })
                        }
                    }
                }
            })
        },

        hideModal(e) {
            this.setData({
                isModalShow: null
            })
        },

        tabSelect: function (e) {
            this.setData({
                activeTabIndex: e.currentTarget.dataset.id,
                showTips: false,
                studentTips: '',
                teacherTips: ''
            });
        },

        blurStudentCode: function (e) {
            this.setData({
                studentCode: e.detail.value
            })
        },

        blurStudentName: function (e) {
            this.setData({
                studentName: e.detail.value
            })
        },

        blurTeacherKey: function (e) {
            this.setData({
                teacherKey: e.detail.value
            })
        },

        submitRole: function () {
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

        parentRegister: function (code) {
            wx.request({
                url: app.globalData.ServerBase + "/api/wxuser/pregister",
                data: {
                    code: code,
                    studentCode: this.data.studentCode,
                    studentName: this.data.studentName
                },
                method: 'GET',
                header: {
                    'Content-Type': 'application/json',
                    'skey': wx.getStorageSync('SKEY')
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
                            displayName: this.data.studentName,
                            curUser: app.globalData.UserInfo,
                            curUserType: result.data.sessionKey.charAt(0)
                        });
                        wx.setStorageSync('SKEY', result.data.sessionKey);
                    }
                }
            })
        },

        teacherRegister: function (code) {
            wx.request({
                url: app.globalData.ServerBase + "/api/wxuser/tregister",
                data: {
                    code: code,
                    teacherWxKey: this.data.teacherKey
                },
                method: 'GET',
                header: {
                    'Content-Type': 'application/json',
                    'skey': wx.getStorageSync('SKEY')
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
                            teacherCode: result.data.teacherCode,
                            teacherName: result.data.teacherName,
                            displayName: result.data.teacherName,
                            curUser: app.globalData.UserInfo,
                            curUserType: result.data.sessionKey.charAt(0)
                        });
                        wx.setStorageSync('SKEY', result.data.sessionKey);
                    } else if (result.data.stateCode == '1222') {
                        this.setData({
                            teacherTips: '过期的授权码！'
                        });
                        return;
                    }
                }
            })
        }
    },
    
});