var server = require('../../js/server.js')
var md5 = require('../../utils/md5.js')
var app = getApp()
Page({
  data: {
    orderInfo: {},  //订单信息
    isTake: false  //是否申请接单
  },
  onLoad: function (options) {
    var id = options.id
    this._getOrderInfo(id)
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onShareAppMessage: function () {

  },
  //申请接单
  requestTake: function (e) {
    var userInfo = wx.getStorageSync('userInfo')
    var ts = wx.getStorageSync('thirdSession')
    var rid = e.target.dataset.rid
    // console.log(userInfo,ts,rid)
    if (userInfo) {
      if (userInfo.approve == 0) {
        wx.showToast({
          title: '请完成设计师认证',
          icon: 'none'
        })
      } else {
        this._requestTake(rid)
      }
    } else {
      wx.showToast({
        title: '请登录',
        icon: 'none'
      })
    }
  },
  _requestTake: function (rid) {
    var that = this
    var user = wx.getStorageSync('userInfo')
    var uid = user.uid
    var nickname = user.nickname

    var ts = wx.getStorageSync('thirdSession')
    var nonceStr = md5.createNonceStr()
    var key = app.globalData.sig_key
    var str = '' + uid + rid + ts + nonceStr + key
    var token = md5.hexMD5(str)
    var data = { rid: rid, uid: uid, ts: ts, nickname: nickname, nonceStr: nonceStr, token: token }
    wx.request({
      url: server.api + 'home/wxxcx/take',
      method: 'GET',
      data: data,
      success: function (res) {
        var status = res.data.code
        if (status == 200) {
          wx.showToast({
            title: '申请成功',
            icon: 'success'
          })
          that.setData({
            isTake: true
          })
        } else {
          wx.showToast({
            title: res.data.msg || '接单失败',
            icon: 'loading'
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络错误',
          icon: 'loading'
        })
      }
    })
  },
  //获取订单信息
  _getOrderInfo: function (id) {
    var that = this
    var user = wx.getStorageSync('userInfo')
    var ts = wx.getStorageSync('thirdSession')

    var nonceStr = md5.createNonceStr()
    var key = app.globalData.sig_key
    var str = '' + id + nonceStr + key
    var token = md5.hexMD5(str)
    var data = {}
    if (user && ts) {
      var data = { id: id, uid: user.uid, ts: ts, nonceStr: nonceStr, token: token }
    } else {
      var data = { id: id, nonceStr: nonceStr, token: token }
    }
    wx.request({
      url: server.api + 'home/wxxcx/details',
      data: data,
      method: 'GET',
      success: function (res) {
        // console.log(res)
        var status = res.data.code
        var detail = res.data.details
        var isTake = res.data.is_take
        if (status == 200) {
          that.setData({
            orderInfo: detail,
            isTake: isTake
          })
        } else if (status == 404) {
          wx.showToast({
            title: '该订单已被抢',
            icon: 'loading',
            duration: 1500
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }, 1500)
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络错误',
          icon: 'loading'
        })
      }
    })
  }
})