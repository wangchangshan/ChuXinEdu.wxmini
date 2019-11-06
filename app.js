//app.js
App({
    onLaunch: function () {

        wx.getSystemInfo({
            success: e => {
                this.globalData.StatusBar = e.statusBarHeight;
                let custom = wx.getMenuButtonBoundingClientRect();
                this.globalData.Custom = custom;
                //this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
                this.globalData.CustomBar = 65;
            }
        });

        let SKEY = wx.getStorageSync('SKEY');
        SKEY && wx.checkSession({

            success: () => {
                //console.log('sessionkey: ' + SKEY + ' 正常可用')
            },

            fail: () => {
                //console.log('sessionkey已过期')
                wx.setStorageSync('SKEY', null);
                wx.setStorageSync('USERINFO', null)
                this.globalData.UserInfo = null;
            }
        });

        this.globalData.UserType = SKEY && SKEY.charAt(0) || "0";
    },

    globalData: {
        UserInfo: wx.getStorageSync('USERINFO'),
        UserType: "0",
        //ServerBase: "http://localhost:8080",
        ServerBase: "https://www.shuyouxiaowu.com"
    }
})