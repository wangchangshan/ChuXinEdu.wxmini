var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
Page({
    data: {
        studentCode: '',
        studentName: '',
        tabs: ["课程记录", "作品展示"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        courseList: [],
        artworkList: [],
        hiddenCourseLoading: false,
        hiddenArtworkLoading: false
    },

    onLoad: function (options) {
        this.setData({
            studentCode: options.studentCode,
            studentName: options.studentName
        });
        this.getCourseList();
        this.getAllArtWorks();

        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    getCourseList: function () {
        wx.request({
            url: app.globalData.serverBase + "/api/open/getcourselist",
            data: {
                studentCode: this.data.studentCode
            },
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
                'name': app.globalData.userInfo && app.globalData.userInfo.nickName || ''
            },
            success: result => {
                if (result.data.code && result.data.code == '1401') {
                    this.setData({
                        hiddenCourseLoading: true
                    });
                    return;
                }
                result.data.forEach(item => {
                    item.courseDate = item.courseDate.split('T')[0];
                });
                this.setData({
                    courseList: result.data,
                    hiddenCourseLoading: true
                })
            }
        })
    },
    getAllArtWorks: function () {
        wx.request({
            url: app.globalData.serverBase + "/api/open/getartworklist",
            data: {
                studentCode: this.data.studentCode//'BJ-201809011'
            },
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
                'name': app.globalData.userInfo && app.globalData.userInfo.nickName || ''
            },
            success: result => {
                if (result.data.code && result.data.code == '1401') {
                    this.setData({
                        hiddenArtworkLoading: true
                    });
                    return;
                }
                this.setData({
                    artworkList: result.data,
                    hiddenArtworkLoading: true
                })
            }
        })
    },
    previewImage: function (e) {
        var currentId = e.target.dataset.workid;
        var curPic = '';
        var pics = [];
        this.data.artworkList.forEach(item => {
            pics.push(item.showURL);
            if (item.artworkId == currentId) {
                curPic = item.showURL;
            }
        });
        wx.previewImage({
            current: curPic,
            urls: pics
        })
    },
})
