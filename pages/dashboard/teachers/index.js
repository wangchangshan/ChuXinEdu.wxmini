// pages/dashboard/teachers/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        teachers: [
            {
                name: '唐得红',
                title: '国画教师',
                img: '/images/t001.png',
				url: '/pages/dashboard/teachers/resumes/tangdehong',
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
})