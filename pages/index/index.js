const app = getApp()
Page({
    data: {
        PageCur: 'mine',
    },
    onLoad: function () {
    },

    onReachBottom: function () {
        this.paintingwall = this.selectComponent("#paintingwall")
        if(this.paintingwall)
        {
            this.paintingwall.onReachEnd()
        }
		else
		{
			wx.stopPullDownRefresh()
		}
    },

	onPullDownRefresh: function() {
		wx.stopPullDownRefresh() //停止下拉刷新
	},

    NavChange(e) {
        this.setData({
            PageCur: e.currentTarget.dataset.cur
        })
    },
    onShow: function () {
        // Do something when page show.
        //console.log('首页面index/index   onShow')
    },
    onShareAppMessage() {
        return {
            title: '初心美术——创意无限的美术培训室',
            imageUrl: '/images/logo.png',
            path: '/pages/index/index'
        }
    },
})