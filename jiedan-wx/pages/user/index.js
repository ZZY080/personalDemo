var app = getApp()
var server = require('../../js/server.js')
var md5 = require('../../utils/md5.js')
Page({
  data: {
    userInfo: {},
    hasPass: 0,
    notPass: 0,
    totalNum: 0,
    authModalStatus: false,
    loginModalStatus: false
  },
  //拒绝登陆后重新授权
  loginAfterRefuse:function(options){
    var user = options.detail
    console.log("user",user)
    var iv = user.iv
    var encryptedData = user.encryptedData
    var that = this

    wx.login({
      success: function (res) {
        var code = res.code
        console.log("code",code)
        if (code && iv && encryptedData) {
          wx.showLoading({
            title: '登录中',
          })
          that._getUserInfo(code, encryptedData, iv)
        } else {
          wx.showToast({
            title: '授权失败',
            icon:'none'
          })
        }
      }
    })
  },
  onLoad: function () {

  },
  onShow: function () {
    this._checkLogin()
  },
  //查看申请信息
  viewMyApply: function (e) {
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      if (userInfo.approve == 0) {
        wx.showToast({
          title: '请完成认证',
          icon: 'none'
        })
      } else {
        var type = e.currentTarget.dataset.type
        wx.navigateTo({
          url: '/pages/user/myApply?type=' + type,
        })
      }
    } else {
      wx.showToast({
        title: '请登录',
        icon: 'none'
      })
    }
  },
  //获取接单信息
  _myTake: function (ts, user) {
    var that = this
    var uid = user.uid
    var nonceStr = md5.createNonceStr()
    var key = app.globalData.sig_key
    var str = '' + uid + ts + nonceStr + key
    var token = md5.hexMD5(str)
    var data = { uid: uid, ts: ts, nonceStr: nonceStr, token: token }
    wx.request({
      url: server.api + 'home/wxxcx/mytake',
      data: data,
      method: 'GET',
      success: function (res) {
        var status = res.data.code
        var list = res.data.lists
        var approve = res.data.approve
        if (status == 200) {
          user.approve = approve
          wx.setStorageSync('userInfo', user)
          that.setData({
            hasPass: list.has_pass,
            notPass: list.not_pass,
            totalNum: list.total,
            userInfo: user
          })
          that._setTabStyle()
        } else if (status == 401) {
          //redis过期，登陆失败
          that._login()
        }
      }
    })
  },
  //检查是否登陆
  _checkLogin: function () {
    var that = this
    var userInfo = wx.getStorageSync("userInfo")
    var thirdSession = wx.getStorageSync("thirdSession")
    if (thirdSession && userInfo) {
      this.setData({
        userInfo: userInfo
      })
      that._myTake(thirdSession, userInfo)
    } else {
      that.setData({
        loginModalStatus: true
      })
    }
  },
  //授权登陆
  _login: function () {
    // console.log('_login')
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code
          wx.getUserInfo({
            withCredentials: true,
            success: function (re) {
              wx.showLoading({
                title: '登录中',
              })
              var iv = re.iv
              var encryptedData = re.encryptedData
              that._getUserInfo(code, encryptedData, iv)
            }
          })
        } else {
          wx.showToast({
            title: '授权失败！',
          })
        }
      }
    })
  },
  //获取用户信息
  _getUserInfo: function (code, encryptedData, iv) {
    // console.log('_getUserInfo')
    var that = this
    var nonceStr = md5.createNonceStr()
    var key = app.globalData.sig_key
    var str = '' + code + encryptedData + iv + nonceStr + key
    var token = md5.hexMD5(str)
    wx.request({
      url: server.api + "/home/wxxcx/wxlogin",
      method: 'GET',
      data: { code: code, encryptedData: encryptedData, iv: iv, nonceStr: nonceStr, token: token },
      success: function (res) {
        if (res.data.status === 200) {
          var user = res.data.data.unionid
          var openid = res.data.data.openid
          var avatar = res.data.data.avatar
          var nickname = res.data.data.nickname
          var thirdSession = res.data.data.thirdSession
          wx.setStorageSync('thirdSession', thirdSession)
          that._userLogin(user, openid, avatar, nickname)
        } else {
          wx.showToast({
            title: '请求登陆失败！',
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
  //建E登陆,获取用户信息
  _userLogin: function (user, openid, avatar, nickname) {
    // console.log('_userLogin')
    var nonceStr = md5.createNonceStr()
    var key = app.globalData.sig_key
    var str = '' + user + openid + nonceStr + key
    var token = md5.hexMD5(str)
    var that = this
    wx.request({
      url: server.api + 'home/wxxcx/login',
      data: { user: user, openid:openid, avatar: avatar, nickname: nickname, nonceStr: nonceStr, token: token},
      method: 'GET',
      success: function (res) {
        // console.log(res)
        wx.hideLoading()
        if (res.data.status === 200) {
          wx.setStorageSync('userInfo', res.data)
          that.setData({
            userInfo: res.data
          })
          that._myTake(wx.getStorageSync('thirdSession'), res.data)
        } else {
          var msg = res.data.msg || '登陆失败';
          wx.showToast({
            title: msg,
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
  //设置tabbar的样式
  _setTabStyle: function () {
    var sum = this.data.totalNum;
    if (sum > 0) {
      wx.setTabBarBadge({
        index: 1,
        text: '' + sum
      })
    } else {
      wx.removeTabBarBadge({
        index: 1
      })
    }
  },
  //显示modal
  goAuth: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    if (currentStatu == "close1") {
      return false;
    }
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });
    this.animation = animation;
    animation.opacity(0).rotateX(-100).step();
    this.setData({
      animationAuthData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationAuthData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            authModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData({
        authModalStatus: true
      });
    }
  },
  dealLogin: function () {
    this.setData({
      loginModalStatus: false
    })
  }
})
