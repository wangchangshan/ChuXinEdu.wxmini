const util = require('../../utils/util.js')
var app = getApp();
Page({
    data: {
        hiddenLoading: false,
        date: util.getToday(),
        periods:[],
        schedule: {}
    },

    onLoad: function (options) {
        this.searchSchedule(this.data.date);
    },

    searchSchedule: function () {
        this.setData({
            periods: [],
            schedule: {},
            hiddenLoading: false
        });
        wx.request({
            url: app.globalData.serverBase + "/api/open/getcoursearrangedbyday",
            data: {
                day: this.data.date
            },
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
                'token': 'wx-mini'
            },
            success: result => {
                var tempPeriod = [];
                var tempStudent = {};
                result.data.forEach(item => {
                    if (tempPeriod.indexOf(item.coursePeriod) == -1){
                        tempPeriod.push(item.coursePeriod);
                        tempStudent[item.coursePeriod] = [{
                            studentName : item.studentName,
                            folderName : item.courseFolderName,
                            colorclass: item.courseFolderCode
                        }];
                    }
                    else{
                        tempStudent[item.coursePeriod].push({
                            studentName : item.studentName,
                            folderName: item.courseFolderName,
                            colorclass: item.courseFolderCode
                        });
                    }
                });
                this.setData({
                    periods : tempPeriod,
                    schedule : tempStudent,
                    hiddenLoading: true
                });
            }
        })
    },

    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        });
        this.searchSchedule(this.data.date);
    }

});