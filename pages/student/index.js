
var app = getApp();
var allStudentList = [];
Page({
    data: {
        inputShowed: false,
        searchName: "",
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
            searchName: "",
            inputShowed: false,
            studentList: allStudentList
        });
    },
    clearInput: function () {
        this.setData({
            searchName: "",
            studentList: allStudentList
        });
    },
    inputTyping: function (e) {
        this.setData({
            searchName: e.detail.value,
            studentList: allStudentList.filter(data => !e.detail.value || data.studentName.includes(e.detail.value))
        });
    },


    getStudentList: function() {
        wx.request({
            url: app.globalData.serverBase + "/api/open/getstudentlist",
            data: {
                pageIndex: 1,
                pageSize: 200,
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
                allStudentList = result.data.data;
                this.setData({
                    studentList: allStudentList
                });
            }
        })
    }
});