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
        hiddenArtworkLoading: false,
        cPageIndex: 1,
        cPageSize: 15,
        iPageIndex:1,
        iPageSize:3,
        courseMore: true,
        artMore: true
    },

    onLoad: function (options) {
        this.setData({
            studentCode: options.studentCode,
            studentName: options.studentName
        });
        this.getCourseList();
    },

    onReachBottom: function (){
        if (this.data.activeIndex == 0){
            this.getCourseList();
        }
        else{
            this.getArtWorks();
        }
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
            this.getArtWorks();
        }
    },
    loadMoreCourse: function(e) {
        this.getCourseList();
    },
    getCourseList: function () {
        if (!this.data.courseMore) {
            return false;
        }
        wx.request({
            url: app.globalData.ServerBase + "/api/wxopen/getcourselist",
            data: {
                studentCode: this.data.studentCode,
                pageIndex: this.data.cPageIndex,
                pageSize: this.data.cPageSize
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

                if (result.data.length < this.data.cPageSize) {
                    this.setData({
                        courseMore: false
                    })
                }
                this.setData({
                    cPageIndex: this.data.cPageIndex + 1,
                    courseList: this.data.courseList.concat(result.data),
                    hiddenCourseLoading: true
                })
            }
        })
    },
    getArtWorks: function () {
        if (!this.data.artMore) {
            return false;
        }
        wx.request({
            url: app.globalData.ServerBase + "/api/wxopen/getartworklist",
            data: {
                studentCode: this.data.studentCode,
                pageIndex: this.data.iPageIndex,
                pageSize: this.data.iPageSize
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

                if (result.data.length < this.data.iPageSize) {
                    this.setData({
                        artMore: false
                    })
                }
                
                this.setData({
                    iPageIndex: this.data.iPageIndex + 1,
                    artworkList: this.data.artworkList.concat(result.data),
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
