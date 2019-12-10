
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
})