const app = getApp();
Component({
    options: {
        addGlobalClass: true
    },
    data: {
        cardCur: 0,
        environmentPicList: [],
        learnPicList: [],
        iconList: [{
            icon: 'friendfamous',
            color: 'orange',
            badge: 0,
            name: '师资力量',
            url: '/pages/dashboard/teachers/index'
        }, {
            icon: 'upstagefill',
            color: 'yellow',
            badge: 0,
            name: '获得荣誉',
            url: ''
        }, {
            icon: 'colorlens',
            color: 'olive',
            badge: 0,
            name: '精品课程',
            url: '/pages/dashboard/coursecategory/coursecategory'
        }, {
            icon: 'like',
            color: 'red',
            badge: 0,
            name: '关于我们',
            url: '/pages/dashboard/about/about',
            }],
        teachers: [
            {
                name: '唐得红',
                title: '国画教师',
                img: '/images/t001.png',
                url:'/pages/dashboard/teachers/resumes/tangdehong',
                color: 'cyan'
            }, {
                name: '马朝',
                title: '西画教师',
                img: '/images/t002.png',
                url: '/pages/dashboard/teachers/resumes/mazhao',
                color: 'blue'
            }, {
                name: '于孟珂',
                title: '书法教师',
				img: '/images/yumengke.jpg',
				url: '/pages/dashboard/teachers/resumes/yumengke',
                color: 'brown'
            },
        ]
    },
    lifetimes: {
        attached: function() {
            this.getPicList();
        },
        moved: function() {},
        detached: function() {},
    },
    methods: {
        getPicList: function() {
            wx.request({
                url: app.globalData.ServerBase + "/api/wxopen/getwxhomepicture",
                method: 'GET',
                header: {
                    'Content-Type': 'application/json',
                    'skey': wx.getStorageSync('SKEY')
                },
                success: result => {
                    if (result.data.code && result.data.code == '1401') {
                        return;
                    }
                    this.setData({
                        environmentPicList: result.data.filter((item) => {
                            return item.wxPictureType == '01'
                        }),
                        learnPicList: result.data.filter((item) => {
                            return item.wxPictureType == '00'
                        }),
                    })
                }
            })
        }
    }
})