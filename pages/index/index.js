Page({
    data: {
        PageCur: 'home',
        fuck: 123
    },
    NavChange(e) {
        this.setData({
            PageCur: e.currentTarget.dataset.cur
        })
    },
    onShow: function () {
        // Do something when page show.
        console.log('333')
    },
    onShareAppMessage() {
        return {
            title: '初心美术——创意无限的美术培训室',
            imageUrl: '/images/share.jpg',
            path: '/pages/index/index'
        }
    },
})