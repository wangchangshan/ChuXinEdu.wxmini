const app = getApp()
Page({
    data: {
        PageCur: 'dashboard',
    },
    onLoad: function (option) {
        if(option.target) {
            this.setData({
                PageCur: option.target
            });
        }
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
		this.mine = this.selectComponent("#mine")
		if (this.mine) {
			this.mine.onPullDown()
			wx.stopPullDownRefresh() //停止下拉刷新
		}
		else {
			wx.stopPullDownRefresh() //停止下拉刷新
		}
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
            imageUrl: '/images/logo1.png',
            path: '/pages/index/index?target=paintingwall'
        }
    },
})