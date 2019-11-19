const util = require('../../../utils/util.js')
const app = getApp();
Component({
    options: {
        addGlobalClass: true
    },
    lifetimes: {
        attached: function() {
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
        teacherOverview: [{
            num: 0,
            name: '我的学员',
            url: '/pages/mine/teacher/studentlist/index?type=all'
        }, {
            num: 0,
            name: '今日排课',
			url: '/pages/mine/schedule/schedule'
        }, {
            num: 0,
            name: '生日提醒',
            url: '/pages/mine/teacher/studentlist/index?type=birthday'
        }, {
            num: 0,
            name: '即将到期',
            url: '/pages/mine/teacher/studentlist/index?type=expiration',
        }],
        teacherEdu: [{
            icon: 'roundcheck',
            color: 'green',
            name: '销课签到',
            url: ''
        }, {
            icon: 'calendar',
            color: 'blue',
            name: '课程安排',
            url: '/pages/mine/schedule/schedule'
        }, {
            icon: 'picfill',
            color: 'olive',
            name: '精品画作',
            url: ''
        },{
            icon: 'shop',
            color: 'cyan',
            name: '课程套餐',
            url: '/pages/mine/package/package'
        }],
		
		studentOverview: [],
		studentSchedule:[],
		studentScheduleCount: 1,
		studentPackages: [],
        isModalShow: '',
        showTips: false,
        studentTips: '',
        teacherTips: '',
        activeTabIndex: '1',
        studentCode: '',
        studentName: '',
		studentBirthday: '',
		studentPhone: '',
		studentSex: '',
		studentAddress: '',
        teacherCode: '',
        teacherName: '',
        displayName: '',
        teacherKey: '',
        impowered: false,
        curUser: null,
        curUserType: 0,
        curUserTypeName: '游客',
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    methods: {
        doLogin: function(e) {
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

        getLoginState: function(code) {
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

						var overview = result.data.overView;
                        if (this.data.curUserType == 1) {
							this.setStudentInfo(result.data.innerPersonCode, result.data.innerPersonName, overview)
                        } else if (this.data.curUserType == 2) {
                            var studentCount = "teacherOverview[0].num";
                            var todayCourseCount = "teacherOverview[1].num";
                            var studentBirthCount = "teacherOverview[2].num";
                            var expirationCount = "teacherOverview[3].num";
                            this.setData({
                                curUserTypeName: '教 师',
                                teacherCode: result.data.innerPersonCode,
                                teacherName: result.data.innerPersonName,
                                [studentCount]: overview.tStudentCount,
                                [todayCourseCount]: overview.tTodayCourseCount,
                                [studentBirthCount]: overview.tStudentBirthCount,
                                [expirationCount]: overview.tExpirationCount
                            });
                        }
                    }
                }
            })
        },

        getUserInfoBySKey: function(skey) {
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

						var overview = result.data.overView;
                        if (this.data.curUserType == 1) {
							this.setStudentInfo(result.data.innerPersonCode, result.data.innerPersonName, overview)
                        } else if (this.data.curUserType == 2) {                            
                            var studentCount = "teacherOverview[0].num";
                            var todayCourseCount = "teacherOverview[1].num";
                            var studentBirthCount = "teacherOverview[2].num";
                            var expirationCount = "teacherOverview[3].num";
                            this.setData({
                                curUserTypeName: '教 师',
                                teacherCode: result.data.innerPersonCode,
                                teacherName: result.data.innerPersonName,
                                [studentCount]: overview.tStudentCount,
                                [todayCourseCount]: overview.tTodayCourseCount,
                                [studentBirthCount]: overview.tStudentBirthCount,
                                [expirationCount]: overview.tExpirationCount
                            });
                        }
                    }
                }
            })
        },

		setStudentInfo: function (code, name, overview){
			var restCourseObj = JSON.parse(overview.studentCourseOverview)
			restCourseObj = restCourseObj.concat([{
				rest_course_count: overview.studentArtworkCount,
				course_category_name: '课堂作品',
				url: '/pages/mine/teacher/studentlist/index?type=expiration',
			}]);
			this.setData({
				curUserTypeName: '学 员',
				studentCode: code,
				studentName: name,
				studentBirthday: overview.studentBirthday.split('T')[0],
				studentPhone: overview.studentPhone,
				studentSex: overview.studentSex,
				studentAddress: overview.studentAddress,
				studentOverview: restCourseObj
			})
			this.getStudentWeekSchedule(code)
			this.getStudentPackage(code);
		},

		setTeacherInfo: function (code, name, overview) {

		},

		getStudentPackage: function (studentCode) {
			wx.request({
				url: app.globalData.ServerBase + "/api/wxopen/getstudentpackages",
				data: {
					studentCode: studentCode,
				},
				method: 'GET',
				header: {
					'Content-Type': 'application/json',
					'skey': wx.getStorageSync('SKEY')
				},
				success: result => {
					if (result.data.code && result.data.code == '1401') {
						return;
					}
					
					this.setData({
						studentPackages: result.data,
					});
				}
			})
		},

		getStudentWeekSchedule: function (studentCode) {
			this.setData({
				schedule: [],
				hiddenLoading: false
			});
			wx.request({
				url: app.globalData.ServerBase + "/api/wxopen/getstudentweekcourse",
				data: {
					studentCode: studentCode
				},
				method: 'GET',
				header: {
					'Content-Type': 'application/json',
					'skey': wx.getStorageSync('SKEY')
				},
				success: result => {
					if (result.data.code && result.data.code == '1401') {
						this.setData({
							hiddenLoading: true
						});
						return;
					}

					result.data.forEach(item => {
						item.courseWeekDay = util.getWeekName(item.courseWeekDay);
					});
					this.setData({
						studentSchedule: result.data,
						studentScheduleCount: result.data.length
					});
				}
			})
		},

		// --------------注册登录部分 start-----------------
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

        teacherRegister: function(code) {
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

		// --------------注册登录部分 end--------------
    },

});