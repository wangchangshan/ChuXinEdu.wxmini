var app = getApp();
const util = require('../../../../utils/util.js')
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		pageTitle: "",
		hiddenLoading: false,
		periodList: [],
		roomCode: '',
		pageIndex: 1,
		pageSize: 10,
		signDialogShow: '',
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

	showSignDialog() {
		this.setData({
			signDialogShow: 'show'
		})
	},
	hideSignDialog(){
		this.setData({
			signDialogShow: ''
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

				var curList = result.data.data

				curList.forEach(function (item) {
					item.courseWeekday = util.getWeekName(item.courseWeekday)
					item.courseDate = item.courseDate.split('T')[0]
				})

				this.setData({
					pageIndex: this.data.pageIndex + 1,
					periodList: this.data.periodList.concat(curList),
					hiddenLoading: true
				});
			}
		})
	}
});