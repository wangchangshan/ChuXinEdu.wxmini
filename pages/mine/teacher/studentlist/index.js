var app = getApp();
Page({
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        pageTitle: "学员列表",
        pageType: '',
        inputShowed: false,
        searchName: "",
        hiddenLoading: false,
        studentList: [],
        pageIndex: 1,
        pageSize: 10,
        studentMore: true
    },
    onLoad: function(options) {
        if (options.type == 'all') {
            this.setData({
                pageTitle: '我的学员',
                pageType: 'all'
            })
        } else if (options.type == 'birthday') {
            this.setData({
                pageTitle: '本周生日学员',
                pageType: 'birthday'
            })
        } else if (options.type == 'expiration') {
            this.setData({
                pageTitle: '即将到期学员',
                pageType: 'expiration'
            })
        }
        this.getStudentList(options.type)
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        if (!this.data.studentMore) {
            wx.stopPullDownRefresh()
            return false;
        }

        this.getStudentList(this.data.pageType)
    },
    clearInput: function() {
        this.setData({
            searchName: "",
			pageIndex: 1,
			studentList: []
        });
		this.getStudentList(this.data.pageType);
    },
    inputTyping: function(e) {
        this.setData({
            searchName: e.detail.value
        });
    },

    searchStudent() {
        this.setData({
            pageIndex: 1,
            studentList: []
        });
		this.getStudentList(this.data.pageType);
    },

    jump2Detail(e) {
        wx.navigateTo({
            url: '/pages/mine/student/detail/detail?studentCode=' + e.currentTarget.dataset.code,
        })
    },

    getStudentList(type) {
        var myUrl = "";
        var myHeader = null;
        var myData = null;
        var api = "";
        switch (type) {
            case "all":
                api = "/api/wxopen/getallstudents"
                myData = {
                    pageIndex: this.data.pageIndex,
                    pageSize: this.data.pageSize,
                    q: {
                        studentName: this.data.searchName
                    }
                }
                break;
            case "birthday":
                api = "/api/wxopen/getstudentstobirth"
                myData = {
                    pageIndex: this.data.pageIndex,
                    pageSize: this.data.pageSize
                }
                break;
            case "expiration":
                api = "/api/wxopen/getstudentstoexpiration"
                myData = {
                    pageIndex: this.data.pageIndex,
                    pageSize: this.data.pageSize
                }
                break;
            default:
                break;
        }
        if (api == '') {
            return
        }
        myUrl = app.globalData.ServerBase + api;
        myHeader = {
            'Content-Type': 'application/json',
            'skey': wx.getStorageSync('SKEY')
        }

        wx.request({
            url: myUrl,
            data: myData,
            method: 'GET',
            header: myHeader,
            success: result => {
                if (result.data.code && result.data.code == '1401') {
                    this.setData({
                        hiddenLoading: true
                    });
                    return;
                }

                if (result.data.totalCount < this.data.pageSize) {
                    this.setData({
                        studentMore: false
                    })
                }

                var curList = JSON.parse(result.data.data)

                if (type == 'all') {
                    curList.forEach(function(item) {
                        item.rest_course_info = JSON.parse(item.rest_course_info)
                    })
                }

                this.setData({
                    pageIndex: this.data.pageIndex + 1,
                    studentList: this.data.studentList.concat(curList),
                    hiddenLoading: true
                });
            }
        })
    }
});