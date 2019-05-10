
var app = getApp();
var allStudentList = [];
Page({
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        inputShowed: false,
        searchName: "",
        hiddenLoading: false,
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


    getStudentList: function () {
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
                'name': app.globalData.userInfo && app.globalData.userInfo.nickName || ''
            },
            success: result => {
                if (result.data.code && result.data.code == '1401') {
                    this.setData({
                        hiddenLoading: true
                    });
                    return;
                }
                allStudentList = result.data.data;
                this.setData({
                    studentList: allStudentList,
                    hiddenLoading: true
                });
            }
        })
    }
});