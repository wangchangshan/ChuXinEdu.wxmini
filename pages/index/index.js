const app = getApp()
import api from '../../utils/util.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        today: '', //今日课程
        todayWeek: '', //开学周期 week周 day星期
        theDay: '', //今日时间
        todayClassName: '' //今日课程班级
    },
    getToday: function (todayClassName) {
        api.getToday({
            query: {
                name: todayClassName
            },
            success: (res) => {
                let today = res.data
                let todayWeek = api.todayInfo(res.data.startTime)
                this.setData({ today, todayWeek })
            },
            fail: (res) => {
                let today = 'error'
                this.setData({ today })
            },
            complete: (res) => {
                let theDay = api.getDate() + api.getDay()
                this.setData({ theDay })
            }
        })
    },
    toHelp: function () {
        wx.setStorageSync('help', '1')
        wx.navigateTo({
            url: '../more/help'
        })
    },
    setTodayClassName: function () {
        wx.navigateTo({
            url: '../core/set/today'
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let help = '1';//wx.getStorageSync('help') ? wx.getStorageSync('help') : 'none';
        let todayClassName = wx.getStorageSync('todayClassName') ? wx.getStorageSync('todayClassName') : 'none';
        this.getToday(todayClassName)
        this.setData({ help, todayClassName })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.reLaunch({
            url: 'index'
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '文经课表',
            desc: '「文经课表」提供烟台大学文经学院在校生班级与教师课表和空闲教室、图书馆藏及考试安排等查询服务。',
            path: '/pages/index/index'
        }
    }
})

// //index.js
// //获取应用实例
// const app = getApp()

// Page({
//   data: {
//     motto: 'Hello World',
//     userInfo: {},
//     hasUserInfo: false,
//     canIUse: wx.canIUse('button.open-type.getUserInfo')
//   },
//   //事件处理函数
//   bindViewTap: function() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onLoad: function () {
//     if (app.globalData.userInfo) {
//       this.setData({
//         userInfo: app.globalData.userInfo,
//         hasUserInfo: true
//       })
//     } else if (this.data.canIUse){
//       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//       // 所以此处加入 callback 以防止这种情况
//       app.userInfoReadyCallback = res => {
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     } else {
//       // 在没有 open-type=getUserInfo 版本的兼容处理
//       wx.getUserInfo({
//         success: res => {
//           app.globalData.userInfo = res.userInfo
//           this.setData({
//             userInfo: res.userInfo,
//             hasUserInfo: true
//           })
//         }
//       })
//     }
//   },
//   getUserInfo: function(e) {
//     console.log(e)
//     app.globalData.userInfo = e.detail.userInfo
//     this.setData({
//       userInfo: e.detail.userInfo,
//       hasUserInfo: true
//     })
//   }
// })
