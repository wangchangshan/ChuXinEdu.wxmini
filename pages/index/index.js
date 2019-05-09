Page({
    data: {
        PageCur: 'home'
    },
    NavChange(e) {
        this.setData({
            PageCur: e.currentTarget.dataset.cur
        })
    },
    onShareAppMessage() {
        return {
            title: '初心美术——创意无限的美术培训室',
            imageUrl: '/images/share.jpg',
            path: '/pages/index/index'
        }
    },
})