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
                img: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg',
				url: '/pages/dashboard/teachers/resumes/yumengke',
                color: 'brown'
            },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})