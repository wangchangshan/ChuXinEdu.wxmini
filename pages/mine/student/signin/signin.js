let app = getApp();
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
        pageSize: 12,
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
        let roomCode = options.roomcode;
        let roomName = options.roomname;
        this.setData({
            pageTitle: roomName + '待签到列表',
            roomCode: roomCode
        })
        this.getStudentList()
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
		this.setData({
			pageIndex: 1,
			periodList: []
		})
		this.getStudentList()
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
			signStudentCourseId: e.currentTarget.dataset.courseid,
            signStudentCode: e.currentTarget.dataset.code,
            signStudentName: e.currentTarget.dataset.name,
            signSubject: '',
            signImgUids: []
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

                let newList = result.data.data;
                let oldList = this.data.periodList;
                let finallyList = null;

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

	onQingjia(e){
		wx.showModal({
			content: '是否确定学员【' + e.currentTarget.dataset.name + '】已请假？',
			cancelText: '取消',
			confirmText: '确定',
			success: res => {
				if (res.confirm) {
					wx.showToast({
						title: '请假中...',
						icon: 'loading',
						mask: true,
						duration: 6000
					})
					this.setData({
						signStudentCourseId: e.currentTarget.dataset.courseid
					})
					wx.request({
						url: app.globalData.ServerBase + "/api/wxopen/wxcourseqingjia",
						data: {
							StudentCourseId: e.currentTarget.dataset.courseid
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

							let curPeriodList = this.removeCourseLine();
							wx.hideToast();
							wx.showToast({
								title: '请假成功',
								icon: 'success',
								mask: true,
								duration: 1000
							})
							this.setData({
								signDialogShow: 'hide',
								periodList: curPeriodList
							});
						}
					})
				}
			}
		})
	},

    submitSign() {
        wx.showToast({
            title: '正在提交课程信息...',
            icon: 'loading',
            mask: true,
            duration: 8000
        })

        // 有作品上传
        if (this.data.imgList.length > 0) {
            this.uploadArtwork();
        } else {
            this.postSignConent();
        }
    },

    uploadArtwork() {
        let count = 0;
        for (let i = 0; i < this.data.imgList.length; i++) {
            let myuid = (new Date()).getTime();
            //上传文件
            wx.uploadFile({
                url: app.globalData.ServerBase + "/api/wxopen/uploadartwork",
                filePath: this.data.imgList[i],
                name: 'wx_sign_image',
                formData: {
                    courseId: this.data.signStudentCourseId,
                    studentCode: this.data.signStudentCode,
                    studentName: this.data.signStudentName,
					uid: myuid
                },
                header: {
                    "Content-Type": "multipart/form-data",
                    'skey': wx.getStorageSync('SKEY')
                },
                success: (res) => {
					let oldUids = this.data.signImgUids
					oldUids.push(myuid)
                    this.setData({
						signImgUids: oldUids
                    })
                    count++;
                    //最后一张 
					if (count == this.data.imgList.length) {
                        this.postSignConent();
                    }
                },
                fail: (res) => {
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

				let curPeriodList = this.removeCourseLine();

				wx.hideToast();
				wx.showToast({
					title: '签到成功',
					icon: 'success',
					mask: true,
					duration: 1000
				})			
				this.setData({
					signDialogShow: 'hide',
					periodList: curPeriodList
				});
			}
		})
	},

	removeCourseLine() {
		let curPeriodList = this.data.periodList
		let isBreak = false;
		for (let i = 0; i < curPeriodList.length; i++) {
			if (isBreak) {
				break;
			}
			for (let j = 0; j < curPeriodList[i].signCourses.length; j++) {
				if (this.data.signStudentCourseId == curPeriodList[i].signCourses[j].studentCourseId) {
					curPeriodList[i].signCourses.splice(j, 1);
					if (curPeriodList[i].signCourses.length == 0) {
						curPeriodList.splice(i, 1);
					}
					isBreak = true;
					break;
				}
			}
		}

		return curPeriodList
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