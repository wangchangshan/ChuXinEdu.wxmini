const util = require('../../../../utils/util.js')
var app = getApp();
Page({
    data: {
        hiddenLoading: false,
        studentCode: '',
        studentName: '',
        periods: [],
        schedule: {}
    },

    onLoad: function (options) {
        this.setData({
            studentCode: options.studentCode,
            studentName: options.studentName
        });
        this.getWeekSchedule();
    },

    getWeekSchedule: function () {
        this.setData({
            schedule: [],
            hiddenLoading: false
        });
        wx.request({
            url: app.globalData.ServerBase + "/api/wxopen/getstudentweekcourse",
            data: {
                studentCode: this.data.studentCode
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
                
                result.data.forEach(item => {
                    item.courseDate = item.courseDate.split('T')[0];
                    item.courseWeekDay = util.getWeekName(item.courseWeekDay);
                });
                this.setData({
                    schedule: result.data,
                    hiddenLoading: true
                });
            }
        })
    }

});