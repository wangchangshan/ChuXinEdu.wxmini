const app = getApp()
Page({
    data: {
        PageCur: 'home',
    },
    onLoad: function () {
    },

    onReachBottom: function () {
        this.paintingwall = this.selectComponent("#paintingwall")
        if(this.paintingwall)
        {
            this.paintingwall.onReachEnd()
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
            imageUrl: '/images/share.jpg',
            path: '/pages/index/index'
        }
    },
})