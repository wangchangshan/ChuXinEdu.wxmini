
var app = getApp();
Page({
    data: {
        inputShowed: false,
        inputVal: "",
        studentList: []
    }, 
    onLoad: function () {
        this.getStudentList();
    }, 
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },


    getStudentList: function() {
        wx.request({
            url: app.globalData.serverBase + "/api/student/getstudentlist",
            data: {
                pageIndex: 1,
                pageSize: 10,
                q: {
                    studentCode: '',
                    studentName: '',
                    studentStatus: '',
                }
            },
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
                'token': 'wx-mini'
            },
            success: result => {
                console.log(result);
                this.setData({
                    studentList: result.data.data
                });
            }
        })
    }
});