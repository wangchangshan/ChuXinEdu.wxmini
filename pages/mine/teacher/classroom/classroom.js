var app = getApp();
Page({
    data: {
        classroomList: []
    },
    onLoad: function(options) {
        this.getClassroomList()
    },

    onPullDownRefresh: function () {
        this.getClassroomList()
        wx.stopPullDownRefresh() //停止下拉刷新
    },

    jump2Signin(e) {
        wx.navigateTo({
            url: '/pages/mine/student/signin/signin?roomcode=' + e.currentTarget.dataset.roomcode + '&roomname=' + e.currentTarget.dataset.roomname
        })
    },

    getClassroomList() {
        wx.request({
            url: app.globalData.ServerBase + "/api/wxopen/getclassrooms",
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
                'skey': wx.getStorageSync('SKEY')
            },
            success: result => {
                if (result.data.code && result.data.code == '1401') {
                    return;
                }

                for (var i = 0; i < result.data.length; i++) {
                    if (i < app.globalData.ColorList.length) {
                        result.data[i].color = app.globalData.ColorList[i].name;
                    }
                }
                this.setData({
                    classroomList: result.data
                });
            }
        })
    }
});