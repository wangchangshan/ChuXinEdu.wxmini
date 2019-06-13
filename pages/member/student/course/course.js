var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
Page({
    data: {
        studentCode: '',
        studentName: '',
        tabs: ["课程记录", "作品展示"],
        activeIndex: 0,
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
    },
    tabSelect: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.dataset.id,
        }); 
        if (e.currentTarget.dataset.id == 0 && this.data.courseList.length == 0){
            this.getCourseList();
        }
        else if (e.currentTarget.dataset.id == 1 && this.data.artworkList.length == 0){
            this.getAllArtWorks();
        }
    },
    getCourseList: function () {
        wx.request({
            url: app.globalData.ServerBase + "/api/wxopen/getcourselist",
            data: {
                studentCode: this.data.studentCode
            },
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
                'skey': wx.getStorageSync('SKEY')
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
            url: app.globalData.ServerBase + "/api/wxopen/getartworklist",
            data: {
                studentCode: this.data.studentCode//'BJ-201809011'
            },
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
                'skey': wx.getStorageSync('SKEY')
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
