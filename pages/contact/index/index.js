Page({
    data: {
		contactList: [{
			name: '唐老师',
			phone:'18513423024',
			weixin: '18513423024'
		}, {
				name: '马老师',
				phone: '17310182521',
				weixin: 'mz1239'
			}],
		showAddress: '北京市海淀区西三旗龙兴园',	
        longitude: 116.3259000000,
        latitude: 40.0555400000,
        name: '龙兴园南区6号楼4单元302室',
        address: '龙兴园南区6号楼4单元302室',
        markers: [{
            id: 1,
            longitude: 116.3259000000,
            latitude: 40.0555400000,
            callout: {
                content: '龙兴园南区6号楼4单元302室',
                color: '#ffffff',
                bgColor: "#0081ff",
                fontSize: 15,
                borderRadius: 5,
                display: 'ALWAYS',
                padding: 5
            },
            height: 25
        }]
    },
    onReady: function (e) {
        this.mapCtx = wx.createMapContext('myMap')
    },

	phonecall: function(e) {
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.num
		})
	},

	wxcopy: function(e){
		wx.setClipboardData({
			data: e.currentTarget.dataset.num
		})
	},

    getCenterLocation: function () {
        this.mapCtx.getCenterLocation({
            success: function (res) {
                //console.log(res.longitude)
                //console.log(res.latitude)
            }
        })
    },
    moveToLocation: function () {
        this.mapCtx.moveToLocation()
    },
})
