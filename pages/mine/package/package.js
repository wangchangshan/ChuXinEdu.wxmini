
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hiddenLoading: false,
        packageList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPackageList();
    },

    getPackageList: function () {
        wx.request({
            url: app.globalData.ServerBase + "/api/wxopen/getpackages",
            data: {
                q: {
                    packageName: '',
                    packageEnabled: '是'
                }
            },
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
                'skey': wx.getStorageSync('SKEY')
            },
            success: result => {
                if (result.data.code && result.data.code == '1401') {
                    this.setData({
                        hiddenLoading: true
                    });
                    return;
                }
                this.setData({
                    packageList: result.data,
                    hiddenLoading: true
                })
            }
        })
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