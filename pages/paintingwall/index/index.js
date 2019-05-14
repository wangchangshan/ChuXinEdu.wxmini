const app = getApp();
Page({
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        paintingList: [{
            studentName: '秦若雯',
            studentAvatar: 'http://47.104.231.152/api/upload/getimage?id=64&type=avatar-s',
            paintingAge: '8',
            sex: '女',
            paintingPath: '../../../images/test1.jpg',
            subject: '老虎'
        }, {
            studentName: '杨乘轩',
            studentAvatar: 'http://47.104.231.152/api/upload/getimage?id=1&type=avatar-s',
            paintingAge: '8',
            sex: '女',
            paintingPath: '../../../images/test2.jpg',
            subject: '小老鼠'
        }, {
            studentName: '金家熠',
            studentAvatar: 'http://47.104.231.152/api/upload/getimage?id=3&type=avatar-s',
            paintingAge: '8',
            sex: '女',
            paintingPath: '../../../images/test3.jpg',
            subject: '树与石'
        }
        ]
    },
    onLoad: function (options) {
        this.getPaintingList();
    },
    getPaintingList: function() {
        this.setData({
        });
    }
});
