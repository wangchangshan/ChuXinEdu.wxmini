//app.js
App({
    onLaunch: function() {
        wx.getSystemInfo({
            success: e => {
                this.globalData.StatusBar = e.statusBarHeight;
                let custom = wx.getMenuButtonBoundingClientRect();
                this.globalData.Custom = custom;
                // this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
                this.globalData.CustomBar = 65;
            }
        });

        console.log(111111111111111111)
        let loginFlag = wx.getStorageSync('skey');

        console.log("pageLoad  skey is : " + loginFlag)
        console.log("user info is :")
        console.log(this.globalData.userInfo)
        if (loginFlag) {
            // 检查 session_key 是否过期
            wx.checkSession({
                // session_key 过期
                fail: function () {
                    this.globalData.userInfo = null;

                    console.log('sessionkey已经过期')
                }
            });
        }
    },
    globalData: {
        impower: false,
        userInfo: 123,
        curStudentAvatar: '',
        serverBase: "http://localhost:5000"
        //serverBase: "http://47.104.231.152"
    }
})