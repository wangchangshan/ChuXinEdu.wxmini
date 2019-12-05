const util = require('../../../utils/util.js')
var app = getApp();
Page({
	data: {
		CustomBar: app.globalData.CustomBar,
        hiddenLoading: false,
        myDate: util.getToday(),
		weekDay: '',
		scheduleList: []
    },

    onLoad: function (options) {
        this.searchSchedule();
    },

	jump2Detail(e) {
		wx.navigateTo({
			url: '/pages/mine/student/detail/detail?studentCode=' + e.currentTarget.dataset.code,
		})
	},

    searchSchedule: function () {
        this.setData({
			scheduleList: [],
            hiddenLoading: false
        });
        wx.request({
			url: app.globalData.ServerBase + "/api/wxopen/getwxschedule",
            data: {
                day: this.data.myDate
            },
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
                'skey': wx.getStorageSync('SKEY')
            },
            success: result => {
                if (result.data.code && result.data.code == '1401'){
                    this.setData({
                        hiddenLoading: true
                    });
                    return;
                }
				if(result.data.length > 0){
					let weekname = util.getWeekName(result.data[0].roomSchedule[0].scheduleDetail[0].courseWeekDay)
					this.setData({
						weekDay: weekname,
						scheduleList: result.data,
						hiddenLoading: true
					});
				}
            }
        })
    },

    bindDateChange: function (e) {
        this.setData({
            myDate: e.detail.value
        });
        this.searchSchedule(this.data.myDate);
    }

});