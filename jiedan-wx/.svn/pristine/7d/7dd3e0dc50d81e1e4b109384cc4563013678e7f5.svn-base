//app.js
App({
  onLaunch: function () {
    this._checkKey()
  },
  //判断会话的session_key是否过期
  _checkKey:function(){
    var that = this
    wx.checkSession({
      fail: function () {
        wx.clearStorageSync()
      }
    })
  },
  globalData:{
    sig_key:'lJ$jiedan$XCX$2018'
  }
})