Page({
    data: {
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
