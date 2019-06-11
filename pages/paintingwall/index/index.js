const app = getApp();
Component({
    options: {
        addGlobalClass: true
    },
    data: {
        paintingList: []
    },
    lifetimes: {
        attached: function () { 
            this.getPaintingList();
        },
        moved: function () { },
        detached: function () { },
    },
    methods: {
        getPaintingList: function () {
            wx.request({
                url: app.globalData.ServerBase + "/api/wxopen/getwxpicture/02",
                method: 'GET',
                header: {
                    'Content-Type': 'application/json'
                },
                success: result => {
                    if (result.data.code && result.data.code == '1401') {
                        return;
                    }
                    this.setData({
                        paintingList: result.data
                    })
                }
            })
        }
    }
});


