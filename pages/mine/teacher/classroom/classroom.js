var app = getApp();
Page({
    data: {
        classroomList: []
    },
    onLoad: function(options) {
        this.getClassroomList()
    },

    jump2Signin(e) {
        wx.navigateTo({
            url: '/pages/mine/teacher/studentlist/index?type=signin',
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
                        result.data[i].label = app.globalData.ColorList[i].name;
                    }
                }
                this.setData({
                    classroomList: result.data
                });
            }
        })
    }
});