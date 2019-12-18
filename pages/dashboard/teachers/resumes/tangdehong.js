const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		teacherCode: 'T-000001',
		showArtwork: true,
		teacherArtworkList: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getTeacherArtwork();
	},

	getTeacherArtwork: function() {
		wx.request({
			url: app.globalData.ServerBase + "/api/wxopen/getteacherartwork",
			data: {
				teacherCode: this.data.teacherCode
			},
			method: 'GET',
			header: {
				'Content-Type': 'application/json',
				'skey': wx.getStorageSync('SKEY')
			},
			success: result => {
				if (result.data.code && result.data.code == '1401') {
					this.setData({
						showArtwork: false
					})
					return;
				}
				
				if (result.data.length > 0){
					this.setData({
						showArtwork: true,
						teacherArtworkList: result.data
					})
				}
				else {
					this.setData({
						showArtwork: false
					})
				}
			}
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})