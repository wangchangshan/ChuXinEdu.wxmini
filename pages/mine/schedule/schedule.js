const util = require('../../../utils/util.js')
var app = getApp();
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        hiddenLoading: false,
        calendarModelShow: '',
        myDate: util.getToday(),
        weekDay: '',
        scheduleList: [],
        calendarConfig: {
            /**
             * 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
             * 初始化时不默认选中当天，则将该值配置为false。
             */
            multi: false, // 是否开启多选,
            theme: 'elegant', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题在 theme 文件夹扩展
            showLunar: false, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
            inverse: false, // 单选模式下是否支持取消选中,
            markToday: '今天', // 当天日期展示不使用默认数字，用特殊文字标记
            defaultDay: true, // 默认选中指定某天；当为 boolean 值 true 时则默认选中当天，非真值则在初始化时不自动选中日期，
            highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
            takeoverTap: false, // 是否完全接管日期点击事件（日期不会选中），配合 onTapDay() 使用
            preventSwipe: true, // 是否禁用日历滑动切换月份
            disablePastDay: false, // 是否禁选当天之前的日期
            disableLaterDay: false, // 是否禁选当天之后的日期
            firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
            onlyShowCurrentMonth: false, // 日历面板是否只显示本月日期
            hideHeadOnWeekMode: false, // 周视图模式是否隐藏日历头部
            showHandlerOnWeekMode: false // 周视图模式是否显示日历头部操作栏，hideHeadOnWeekMode 优先级高于此配置
        }
    },

    onLoad: function(options) {
        this.searchSchedule();
    },

    showCalendarModel() {
        this.setData({
            calendarModelShow: 'show'
        })
    },

    hideCalendarModal() {
        this.setData({
            calendarModelShow: ''
        })
    },

    afterTapDay(e) {
        var selectedDay = e.detail.year + '-' + e.detail.month + '-' + e.detail.day;
        this.setData({
            myDate: selectedDay,
            calendarModelShow: ''
        })
        this.searchSchedule();
    },

    jump2Detail(e) {
        wx.navigateTo({
            url: '/pages/mine/student/detail/detail?studentCode=' + e.currentTarget.dataset.code,
        })
    },

    searchSchedule: function() {
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
                if (result.data.code && result.data.code == '1401') {
                    this.setData({
                        hiddenLoading: true
                    });
                    return;
                }
                if (result.data.length > 0) {
                    let weekname = util.getWeekName(result.data[0].roomSchedule[0].scheduleDetail[0].courseWeekDay)
                    this.setData({
                        weekDay: weekname,
                        scheduleList: result.data,
                        hiddenLoading: true
                    });
                } else {
                    this.setData({
                        scheduleList: [],
                        hiddenLoading: true
                    });
                }
            }
        })
    },
});