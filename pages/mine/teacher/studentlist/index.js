
var app = getApp();
var allStudentList = [];
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
		pagesize: 12,
		studentMore: true
	},
	onLoad: function (options) {
		if(options.type == 'birthday')
		{
			this.getBirthStudentList();
			this.setData({
				pageTitle: '本周生日学员',
				pageType: 'birthday'
			})
		}
		else if (options.type == 'expiration')
		{
			this.setData({
				pageTitle: '本周生日学员',
				pageType: 'expiration'
			})
		}
		// this.getStudentList();
	},
	onReachBottom: function () {
		if (this.data.pageType == 'birthday') {
			this.getBirthStudentList();
		}
	},
	showInput: function () {
		this.setData({
			inputShowed: true
		});
	},
	clearInput: function () {
		this.setData({
			searchName: "",
			studentList: allStudentList
		});
	},
	inputTyping: function (e) {
		this.setData({
			searchName: e.detail.value,
			studentList: allStudentList.filter(data => !e.detail.value || data.studentName.includes(e.detail.value))
		});
	},

	getBirthStudentList(){
		wx.request({
			url: app.globalData.ServerBase + "/api/wxopen/getstudentstobirth",
			data: {
				pageIndex: 1,
				pageSize: 12
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

				if (result.data.totalCount < this.data.pageSize)
				{
					this.setData({
						studentMore: false
					})
				}

				var curList = JSON.parse(result.data.data)
				this.setData({
					pageIndex: this.data.pageIndex + 1,
					studentList: this.data.studentList.concat(curList),
					hiddenLoading: true
				});
			}
		})
	},


	getStudentList: function () {
		wx.request({
			url: app.globalData.ServerBase + "/api/wxopen/getstudentlist",
			data: {
				pageIndex: 1,
				pageSize: 200,
				q: {
					studentCode: '',
					studentName: '',
					studentStatus: '',
				}
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
				allStudentList = result.data.data;
				this.setData({
					studentList: allStudentList,
					hiddenLoading: true
				});
			}
		})
	}
});