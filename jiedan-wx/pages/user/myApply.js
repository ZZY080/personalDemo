var server = require('../../js/server.js')
var md5 = require('../../utils/md5.js')
var app = getApp()
Page({
  data: {
    currentType: 0,
    hasPass: 0,
    notPass: 0,
    page: 1,
    endPage: false,
    applyList: [],
    firstLaunch: true
  },
  onLoad: function (options) {
    var type = options.type
    this.setData({
      currentType: type
    })
  },
  onShow: function () {
    this._myTakeList()
  },
  onReachBottom: function () {
    this._myTakeList()
  },
  onShareAppMessage: function () {

  },
  //点击头部tab
  applyTap: function (e) {
    var type = e.currentTarget.dataset.type
    if (this.data.currentType != type) {
      this.setData({
        currentType: type,
        page: 1,
        endPage: false,
        applyList: []
      })
      this._myTakeList()
    }
  },
  //点击我的申请列表
  applyListTap: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/user/myApply-details?id=' + id,
    })
  },
  //获取信息
  _myTakeList: function (t) {
    if (this.data.endPage) {
      return false
    }
    var ts = wx.getStorageSync('thirdSession')
    var user = wx.getStorageSync('userInfo')
    var uid = user.uid
    var type = this.data.currentType
    var page = this.data.page
    var nonceStr = md5.createNonceStr()
    var key = app.globalData.sig_key
    var str = '' + uid + ts + type + page + nonceStr + key
    var token = md5.hexMD5(str)

    var data = { ts: ts, uid: uid, type: type, page: page, nonceStr: nonceStr, token: token }
    var that = this
    wx.request({
      url: server.api + 'home/wxxcx/mytakelist',
      data: data,
      success: function (res) {
        var status = res.data.code
        var num = res.data.num
        var lists = res.data.lists
        if (status == 200) {
          that.setData({
            hasPass: num.has_pass,
            notPass: num.not_pass,
            page: that.data.page + 1
          })
          if (lists != null) {
            var concatList = that.data.applyList.concat(lists)
            that.setData({
              applyList: concatList
            })
            if (concatList.lenght<=0){
              that.setData({
                firstLaunch: false
              })
            }else{
              that.setData({
                firstLaunch: true
              })
            }
          } else {
            that.setData({
              endPage: true
            })
            if (that.data.applyList.length <= 0) {
              that.setData({
                firstLaunch: false
              })
            }
          }
        } else if (status == 401) {
          wx.switchTab({
            url: '/pages/user/index',
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