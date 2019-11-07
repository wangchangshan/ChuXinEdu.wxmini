const app = getApp();
Component({
    options: {
        addGlobalClass: true
    },
    data: {
        pageIndex: 1,
        pageSize: 3,
        paintingList: [],
        artMore: true
    },
    lifetimes: {
        attached: function () { 
            this.getPaintingList();
        },
        moved: function () { },
        detached: function () { },
    },
    methods: {
        onReachEnd: function () {
            this.getPaintingList();
        },
        getPaintingList: function () {
            if (!this.data.artMore) {
                return false;
            }
            wx.request({
                url: app.globalData.ServerBase + "/api/wxopen/getwxbestdraw",
                data: {
                    wxPicCode: '02',
                    pageIndex: this.data.pageIndex,
                    pageSize: this.data.pageSize
                },
                method: 'GET',
                header: {
                    'Content-Type': 'application/json',
                    'skey': wx.getStorageSync('SKEY')
                },
                success: result => {
                    if (result.data.code && result.data.code == '1401') {
                        return;
                    } 
                    
                    if (result.data.length < this.data.pageSize) {
                        this.setData({
                            artMore: false
                        })
                    }

                    this.setData({
                        pageIndex: this.data.pageIndex + 1,                        
                        paintingList: this.data.paintingList.concat(result.data),
                    })
                }
            })
        }
    }
});


