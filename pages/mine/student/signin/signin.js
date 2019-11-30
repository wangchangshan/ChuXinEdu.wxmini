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
        signTitle:'',
        signStudentName: '',
        signSubject:'',
		studentMore: true
	},
	onLoad: function (options) {
		var roomCode = options.roomcode;
		var roomName = options.roomname;
		this.setData({
			pageTitle: roomName + '待签到列表',
			pageType: 'signin',
			roomCode: roomCode
		})
		this.getStudentList(options.type)
	},
	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},
	onReachBottom: function () {
		if (!this.data.studentMore) {
			wx.stopPullDownRefresh()
			return false;
		}

		this.getStudentList()
	},

	showSignDialog(e) {
		this.setData({
			signDialogShow: 'show',
            signTitle: ' ' + e.currentTarget.dataset.title,
            signStudentName: e.currentTarget.dataset.name,
            signSubject: '',
		})
	},
	hideSignDialog(){
		this.setData({
			signDialogShow: ''
		})
	},
    blurSubject(e) {
        this.setData({
            signSubject: e.detail.value
        })
    },
    submitSign(){

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

                newList.forEach(function (item) {
					item.courseWeekday = util.getWeekName(item.courseWeekday)
					item.courseDate = item.courseDate.split('T')[0]
				})

                if (oldList.length > 1 && newList[0].courseDate == oldList[oldList.length - 1].courseDate && newList[0].coursePeriod == oldList[oldList.length - 1].coursePeriod) {
                    // 合并
                    newList[0].signCourses.forEach(function (item) {
                        oldList[oldList.length - 1].signCourses.push(item)
                    })

                    newList.splice(0, 1)
                    finallyList = oldList.concat(newList)
                }
                else {
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


    ChooseImage() {
        wx.chooseImage({
            count: 4, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album','camera'], //从相册选择
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