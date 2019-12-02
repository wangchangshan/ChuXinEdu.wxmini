const util = require('../../../../utils/util.js')
var app = getApp();
var allStudentList = [];
Page({
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        studentCode: '',
        studentName: '',
        studentSex: '',
        studentAvatarPath: '',
        studentBirthday: '',
        studentPhone: '',
        studentAddress: '',
        studentOverview: [],
        studentSchedule: [],
        studentScheduleCount: 1,
        studentPackages: [],
        hiddenLoading: false,
    },
    onLoad: function(option) {
        this.setData({
            studentCode: option.studentCode
        })
        this.getStudentList();
    },

    makePhoneCall: function(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.num
        })
    },

	overViewJump: function (e){
		if (e.currentTarget.dataset.type == "课堂作品") {
			wx.navigateTo({
				url: '/pages/mine/student/artwork/artwork?studentCode=' + this.data.studentCode + '&studentName=' + this.data.studentName,
			})
		}
	},

    getStudentList: function() {
        wx.request({
            url: app.globalData.ServerBase + "/api/wxopen/getstudentdetail",
            data: {
                studentCode: this.data.studentCode,
            },
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
                'skey': wx.getStorageSync('SKEY')
            },
            success: result => {
                if (result.data.code && result.data.code == '1401') {
                    this.setData({
                        hiddenLoading: true
                    });
                    return;
                }
                var overview = result.data.overView;

                var restCourseObj = JSON.parse(overview.studentCourseOverview)
                restCourseObj = restCourseObj.concat([{
                    rest_course_count: overview.studentArtworkCount,
                    course_category_name: '课堂作品',
                    url: '',
                }]);
                result.data.weekCourse.forEach(item => {
                    item.courseWeekDay = util.getWeekName(item.courseWeekDay);
                });

                result.data.allPackage.forEach(item => {
                    item['percentage'] = ((item.actualCourseCount - item.restCourseCount) / item.actualCourseCount).toFixed(2) * 100;
                });

                this.setData({
                    studentName: overview.studentName,
                    studentSex: overview.studentSex,
                    studentAvatarPath: overview.studentAvatarPath,
					studentBirthday: overview.studentBirthday && overview.studentBirthday.split('T')[0],
                    studentPhone: overview.studentPhone,
                    studentAddress: overview.studentAddress,
                    studentCourseOverview: restCourseObj,
                    studentSchedule: result.data.weekCourse,
                    studentPackages: result.data.allPackage,
                    studentScheduleCount: result.data.weekCourse.length,
                    hiddenLoading: true
                });
            }
        })
    }
});