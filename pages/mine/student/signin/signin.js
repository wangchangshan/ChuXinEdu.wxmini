var app = getApp();
const util = require('../../../../utils/util.js')
Page({
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        pageTitle: "",
        hiddenLoading: false,
        periodList: [],
        imgList: [],
        roomCode: '',
        pageIndex: 1,
        pageSize: 10,
        signDialogShow: '',
        signTitle: '',
        signStudentCourseId: 0,
        signStudentCode: '',
        signStudentName: '',
        signSubject: '',
        signImgUids: [],
        studentMore: true
    },
    onLoad: function(options) {
        var roomCode = options.roomcode;
        var roomName = options.roomname;
        this.setData({
            pageTitle: roomName + '待签到列表',
            pageType: 'signin',
            roomCode: roomCode
        })
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

        this.getStudentList()
    },

    showSignDialog(e) {
        this.setData({
            imgList: [],
            signDialogShow: 'show',
            signTitle: e.currentTarget.dataset.title,
            signStudentCourseId: e.currentTarget.dataset.courseId,
            signStudentCode: e.currentTarget.dataset.code,
            signStudentName: e.currentTarget.dataset.name,
            signSubject: '',
            signImgUids: ''
        })
    },
    hideSignDialog() {
        this.setData({
            signDialogShow: ''
        })
    },
    blurSubject(e) {
        this.setData({
            signSubject: e.detail.value
        })
    },

    getStudentList() {
        wx.request({
            url: app.globalData.ServerBase + "/api/wxopen/getcoursestosignin",
            data: {
                roomCode: this.data.roomCode,
                pageIndex: this.data.pageIndex,
                pageSize: this.data.pageSize
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

                if (result.data.totalCount < this.data.pageSize) {
                    this.setData({
                        studentMore: false
                    })
                }

                var newList = result.data.data;
                var oldList = this.data.periodList;
                var finallyList = null;

                newList.forEach(function(item) {
                    item.courseWeekday = util.getWeekName(item.courseWeekday)
                    item.courseDate = item.courseDate.split('T')[0]
                })

                if (oldList.length > 1 && newList[0].courseDate == oldList[oldList.length - 1].courseDate && newList[0].coursePeriod == oldList[oldList.length - 1].coursePeriod) {
                    // 合并
                    newList[0].signCourses.forEach(function(item) {
                        oldList[oldList.length - 1].signCourses.push(item)
                    })

                    newList.splice(0, 1)
                    finallyList = oldList.concat(newList)
                } else {
                    finallyList = oldList.concat(newList)
                }

                this.setData({
                    pageIndex: this.data.pageIndex + 1,
                    periodList: finallyList,
                    hiddenLoading: true
                });
            }
        })
    },

    submitSign() {
        wx.showToast({
            title: '正在提交课程信息...',
            icon: 'loading',
            mask: true,
            duration: 1000
        })

        // 有作品上传
        if (this.data.imgList.length > 0) {
            this.uploadArtwork();
        } else {
            this.postSignConent();
        }
    },

    postSignConent() {
        wx.request({
            url: app.globalData.ServerBase + "/api/wxopen/wxstudentsignin",
            data: {
                CourseListId: this.data.signStudentCourseId,
                StudentCode: this.data.signStudentCode,
                TeacherCode: wx.getStorageSync('SKEY'),
                FileUIds: this.data.signImgUids,
                CostCount: 1,
                Title: this.data.signSubject
            },
            method: 'POST',
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
                debugger
                wx.hideToast();
                this.setData({
                    signDialogShow: 'hide',
                });
            }
        })
    },

    uploadArtwork() {
        var count = 0;
        for (var i = 0; i < this.data.imgList.length; i++) {
            var myuid = (new Date()).getTime();
            //上传文件
            wx.uploadFile({
                url: app.globalData.ServerBase + "/api/wxopen/uploadartwork",
                filePath: this.data.imgList[i],
                name: 'wx_sign_image',
                formData: {
                    courseId: this.data.signStudentCourseId,
                    studentCode: this.data.signStudentCode,
                    studentName: this.data.signStudentName,
                    uid: (new Date()).getTime()
                },
                header: {
                    "Content-Type": "multipart/form-data",
                    'skey': wx.getStorageSync('SKEY')
                },
                success: function(res) {
                    this.setData({
                        signImgUids: this.data.signImgUids.concat(myuid)
                    })
                    count++;
                    //最后一张 
                    if (count == res.tempFilePaths.length) {
                        this.postSignConent();
                    }
                },
                fail: function(res) {
                    wx.hideToast();
                    wx.showModal({
                        title: '错误提示',
                        content: '上传图片失败',
                        showCancel: false,
                        success: function(res) {}
                    })
                }
            });
        }
    },



    ChooseImage() {
        wx.chooseImage({
            count: 2, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], //从相册选择
            success: (res) => {
                if (this.data.imgList.length != 0) {
                    this.setData({
                        imgList: this.data.imgList.concat(res.tempFilePaths)
                    })
                } else {
                    this.setData({
                        imgList: res.tempFilePaths
                    })
                }
            }
        });
    },
    ViewImage(e) {
        wx.previewImage({
            urls: this.data.imgList,
            current: e.currentTarget.dataset.url
        });
    },
    DelImg(e) {
        wx.showModal({
            title: '测试',
            content: '确定要删除这张图片吗？',
            cancelText: '取消',
            confirmText: '删除',
            success: res => {
                if (res.confirm) {
                    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
                    this.setData({
                        imgList: this.data.imgList
                    })
                }
            }
        })
    },
});