Page({
    data: {
        cardCur: 0,
        swiperList: [{
            id: 0,
            type: 'image',
            url: '../../../images/1.jpg'
        }, {
                id: 1,
                type: 'image',
                url: '../../../images/2.jpg'
            },
            {
                id: 2,
                type: 'image',
                url: '../../../images/3.jpg'
            }],
        iconList: [{
            icon: 'friendfamous',
            color: 'orange',
            badge: 0,
            name: '师资力量'
        }, {
            icon: 'upstagefill',
            color: 'yellow',
            badge: 0,
            name: '获得荣誉'
        }, {
            icon: 'colorlens',
            color: 'olive',
            badge: 0,
            name: '精品课程'
        }, {
            icon: 'activity',
            color: 'cyan',
            badge: 0,
            name: '举办活动'
        }],
    },
    onLoad() {
        this.towerSwiper('swiperList');
        // 初始化towerSwiper 传已有的数组名即可
    },
    DotStyle(e) {
        this.setData({
            DotStyle: e.detail.value
        })
    },
    // towerSwiper
    // 初始化towerSwiper
    towerSwiper(name) {
        let list = this.data[name];
        for (let i = 0; i < list.length; i++) {
            list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
            list[i].mLeft = i - parseInt(list.length / 2)
        }
        this.setData({
            swiperList: list
        })
    },
})