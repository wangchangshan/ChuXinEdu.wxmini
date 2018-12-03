var course = [
    {
        "studentCourseId": 24,
        "studentCoursePackageId": 1,
        "arrangeTemplateCode": "at-001",
        "classroom": "room1",
        "coursePeriod": "16:00-17:30",
        "courseWeekDay": "day3",
        "courseDate": "2017-12-13T00:00:00",
        "studentCode": "BJ-201712001",
        "studentName": "杨承轩",
        "teacherCode": "T-000002",
        "teacherName": "马朝",
        "packageCode": "P-000002",
        "courseCategoryCode": "meishu",
        "courseCategoryName": "美术",
        "courseFolderCode": "meishu_01",
        "courseFolderName": "西画",
        "courseSubject": "水彩鹦鹉",
        "courseType": "正式",
        "activityId": 0,
        "attendanceStatusCode": "01",
        "attendanceStatusName": "上课销课"
    },
    {
        "studentCourseId": 25,
        "studentCoursePackageId": 1,
        "arrangeTemplateCode": "at-001",
        "classroom": "room1",
        "coursePeriod": "16:00-17:30",
        "courseWeekDay": "day3",
        "courseDate": "2017-12-20T00:00:00",
        "studentCode": "BJ-201712001",
        "studentName": "杨承轩",
        "teacherCode": "T-000002",
        "teacherName": "马朝",
        "packageCode": "P-000002",
        "courseCategoryCode": "meishu",
        "courseCategoryName": "美术",
        "courseFolderCode": "meishu_01",
        "courseFolderName": "西画",
        "courseSubject": "荷花",
        "courseType": "正式",
        "activityId": 0,
        "attendanceStatusCode": "01",
        "attendanceStatusName": "上课销课"
    },
    {
        "studentCourseId": 47,
        "studentCoursePackageId": 1,
        "arrangeTemplateCode": "at-001",
        "classroom": "room1",
        "coursePeriod": "16:00-17:30",
        "courseWeekDay": "day2",
        "courseDate": "2018-08-28T00:00:00",
        "studentCode": "BJ-201712001",
        "studentName": "杨承轩",
        "teacherCode": "T-000002",
        "teacherName": "马朝",
        "packageCode": "P-000002",
        "courseCategoryCode": "meishu",
        "courseCategoryName": "美术",
        "courseFolderCode": "meishu_01",
        "courseFolderName": "西画",
        "courseSubject": "动漫",
        "courseType": "正式",
        "activityId": 0,
        "attendanceStatusCode": "01",
        "attendanceStatusName": "上课销课"
    },
    {
        "studentCourseId": 48,
        "studentCoursePackageId": 1,
        "arrangeTemplateCode": "at-001",
        "classroom": "room1",
        "coursePeriod": "17:30-19:00",
        "courseWeekDay": "day2",
        "courseDate": "2018-08-28T00:00:00",
        "studentCode": "BJ-201712001",
        "studentName": "杨承轩",
        "teacherCode": "T-000002",
        "teacherName": "马朝",
        "packageCode": "P-000002",
        "courseCategoryCode": "meishu",
        "courseCategoryName": "美术",
        "courseFolderCode": "meishu_01",
        "courseFolderName": "西画",
        "courseSubject": "动漫上色",
        "courseType": "正式",
        "activityId": 0,
        "attendanceStatusCode": "01",
        "attendanceStatusName": "上课销课"
    },
    {
        "studentCourseId": 15,
        "studentCoursePackageId": 1,
        "arrangeTemplateCode": "at-001",
        "classroom": "room1",
        "coursePeriod": "16:00-17:30",
        "courseWeekDay": "day3",
        "courseDate": "2018-08-29T00:00:00",
        "studentCode": "BJ-201712001",
        "studentName": "杨承轩",
        "teacherCode": "T-000002",
        "teacherName": "马朝",
        "packageCode": "P-000002",
        "courseCategoryCode": "meishu",
        "courseCategoryName": "美术",
        "courseFolderCode": "meishu_01",
        "courseFolderName": "西画",
        "courseSubject": "狐狸",
        "courseType": "正式",
        "activityId": 0,
        "attendanceStatusCode": "01",
        "attendanceStatusName": "上课销课"
    }
];

var app = getApp();
Page({
    data: {
        courseList: []
    },    

    onLoad: function () {
        this.getCourseList();
    }, 
    
    getCourseList: function () {
        wx.request({
            url: app.globalData.serverBase + "/api/student/getcourselist",
            data: {
                studentCode: 'BJ-201803001'
            },
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
                'token': 'wx-mini'
            },
            success: result => {
                console.log(result);
                result.data.forEach(item => {
                    item.courseDate = item.courseDate.split('T')[0];
                });
                this.setData({
                    courseList: result.data
                })
            }
        })
    },
})
