var app = getApp();
Page({
	data: {
		studentCode: '',
		studentName: '',
		artworklist: [],
		previewlist:[],
		hiddenLoading: false,
		pageIndex: 1,
		pageSize: 16,
		hasMore: true,
	},

	onLoad: function (options) {
		this.setData({
			studentCode: options.studentCode,
			studentName: options.studentName
		});
		this.getArtworkList();
	},

	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},

	onReachBottom: function () {
		if (!this.data.hasMore) {
			wx.stopPullDownRefresh()
			return false;
		}
		this.getArtworkList();
	},

	imagePreview: function (e) {
		var curSrc = e.target.dataset.src;
		wx.previewImage({
			current: curSrc,
			urls: this.data.previewlist
		})
	},

	getArtworkList: function () {
		if (!this.data.hasMore) {
			return false;
		}
		wx.request({
			url: app.globalData.ServerBase + "/api/wxopen/getstudentartworks",
			data: {
				studentCode: this.data.studentCode,
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
						hasMore: false
					})
				}

				var newList = result.data.artworkList;
				var oldList = this.data.artworklist;
				var finallyList = null;

				// 处理图片预览时用到的图片
				var newImageList = [];
				newList.forEach(function (item) {
					item.artworks.forEach(function (cell) {
						newImageList.push(cell.artworkUrl);
					})
				})

				if (oldList.length > 1 && newList[0].yyyymm == oldList[oldList.length - 1].yyyymm) {
					// 合并第一个月
					newList[0].artworks.forEach(function (item) {
						oldList[oldList.length - 1].artworks.push(item)
					})

					//删除新数据的第一月
					newList.splice(0, 1)

					finallyList = oldList.concat(newList)
				}
				else {
					finallyList = oldList.concat(newList)
				}

				this.setData({
					pageIndex: this.data.pageIndex + 1,
					artworklist: finallyList,
					previewlist: this.data.previewlist.concat(newImageList),
					hiddenLoading: true
				})
			}
		})
	}
})
