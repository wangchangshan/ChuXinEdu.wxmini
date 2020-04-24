const util = require('../../../../utils/util.js')
var app = getApp();
Page({
	data: {
		studentPackageId: 0,
		studentName: '',
		courseList: [],
		artImagelist: [],
		hiddenCourseLoading: false,
		pageIndex: 1,
		pageSize: 15,
		courseMore: true,
	},

	onLoad: function (options) {
		this.setData({
			studentPackageId: options.sPackageId,
			studentName: options.studentName
		});
		this.getCourseList();
	},

	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},

	onReachBottom: function () {
		if (!this.data.courseMore) {
			wx.stopPullDownRefresh()
			return false;
		}
		this.getCourseList();
	},

	imagePreview: function(e){
		var curSrc = e.target.dataset.src;
		wx.previewImage({
			current: curSrc, 
			urls: this.data.artImagelist 
		})
	},

	getCourseList: function () {
		if (!this.data.courseMore) {
			return false;
		}
		wx.request({
			url: app.globalData.ServerBase + "/api/wxopen/getcoursesbypackage",
			data: {
				sPackageId: this.data.studentPackageId,
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
						hiddenCourseLoading: true
					});
					return;
				}

				if (result.data.totalCount < this.data.pageSize) {
					this.setData({
						courseMore: false
					})
				}

				var newCourse = result.data.courseList;
				var oldCourse = this.data.courseList;
				var finallyCourse = null;

				// 处理图片预览时用到的图片
				var newImageList = [];
				newCourse.forEach(function(item){
					item.courses.forEach(function(cell){
						cell.courseWeekday = util.getWeekName(cell.courseWeekday);
						cell.courseArtworks.forEach(function(art){
							newImageList.push(art.artworkUrl);
						})
					})
				})

				if (oldCourse.length > 1 && newCourse[0].yyyymm == oldCourse[oldCourse.length - 1].yyyymm)
				{
					// 合并第一个月
					newCourse[0].courses.forEach(function (item) {
						oldCourse[oldCourse.length - 1].courses.push(item)
					})

					//删除新数据的第一月
					newCourse.splice(0, 1)

					finallyCourse = oldCourse.concat(newCourse)
				}
				else
				{
					finallyCourse = oldCourse.concat(newCourse)
				}

				this.setData({
					pageIndex: this.data.pageIndex + 1,
					courseList: finallyCourse,
					artImagelist: this.data.artImagelist.concat(newImageList),
					hiddenCourseLoading: true
				})
			}
		})
	}
})
