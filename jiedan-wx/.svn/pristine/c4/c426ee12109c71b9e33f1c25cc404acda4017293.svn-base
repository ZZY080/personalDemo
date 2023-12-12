var server = require('../../js/server.js')
var md5 = require('../../utils/md5.js')
var app = getApp()
Page({
  data: {
    takeId: 0,
    details: []
  },
  onLoad: function (options) {
    var id = options.id
    this.setData({
      takeId: id
    })
  },
  onShow: function () {
    this._getTakeDetail()
  },
  onPullDownRefresh: function () {

  },
  shareAppMessage: function () {

  },
  makeCall: function () {
    var phone = this.data.details.phone
    if (phone != 0) {
      wx.makePhoneCall({
        phoneNumber: phone
      })
    }
  },
  //获取详情
  _getTakeDetail: function (rid) {
    var id = this.data.takeId
    var user = wx.getStorageSync('userInfo')
    var uid = user.uid
    var ts = wx.getStorageSync('thirdSession')
    var nonceStr = md5.createNonceStr()
    var key = app.globalData.sig_key
    var str = '' + id + uid + ts + nonceStr + key
    var token = md5.hexMD5(str)
    var data = { rid: id, uid: uid, ts: ts, nonceStr: nonceStr, token: token }
    var that = this
    wx.request({
      url: server.api + 'home/wxxcx/mytakedetail',
      data: data,
      method: 'GET',
      success: function (res) {
        var status = res.data.code
        if (status == 200) {
          var detail = res.data.data
          // console.log(detail)
          that.setData({
            details: detail
          })
        } else {
          wx.showToast({
            title: res.data.msg || '请求出错',
            icon: 'loading'
          })
        }
      }
    })
  }
})