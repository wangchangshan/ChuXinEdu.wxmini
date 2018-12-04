Page({
    data: {
        list: [
            {
                id: 'schedule',
                name: '课程表',
                url: '/pages/schedule/schedule',
                fa: 'fa-calendar'
            },
            {
                id: 'student',
                name: '我的学生',
                url: '/pages/student/index',
                fa: 'fa-users'
            },
            {
                id: 'packages',
                name: '课程套餐',
                url: '/pages/package/package',
                fa: 'fa-shopping-bag'
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    kindToggle: function (e) {
        var id = e.currentTarget.id, list = this.data.list;
        for (var i = 0, len = list.length; i < len; ++i) {
            if (list[i].id == id) {
                list[i].open = !list[i].open
            } else {
                list[i].open = false
            }
        }
        this.setData({
            list: list
        });
    }
});
