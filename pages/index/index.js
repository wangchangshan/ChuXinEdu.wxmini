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
                url: '/pages/schedule/schedule',
                fa: 'fa-shopping-bag'
            }
        ]
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
