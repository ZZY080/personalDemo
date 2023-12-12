77// pages/send/index.js
var server = require('../../js/server.js')
var md5 = require('../../utils/md5.js')
var app = getApp()
Page({
  data: {
    typeId: -1,
    typeIndex: -1,
    budgetId: -1,
    budgetIndex: 0,
    typeList: [],//装修类型列表
    budgetList: [],//设计费预算列表
    pcList: [],//地区列表
    province: [],//省 组合成地区列表
    city: [],//市 组合成地区列表
    currentProvince: 0,//当前所选的province
    currentProvinceName: null,//当前所选的province名称
    currentCity: 0,//当前所选的city
    currentCityName: null,//当前所选的city名称
    name: null,
    phone: null,
    area: null,
    decoration_budget: null,
    desc: null,
    submitting: false,
    banner: '',
    decoration_budget_input: 0
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '发布需求'
    })
    this.setData({
      submitting: false
    })
    this._getRelease()
  },
  //地区确认
  pcChange: function (e) {
    // console.log(this.data.province, this.data.city, this.data.pcList)
    var confirm = e.detail.value
    // console.log(confirm)
    var pcList = this.data.pcList
    var p_index = confirm[0]//省
    var pid = pcList[0][p_index]['id']
    var p_name = pcList[0][p_index]['name']
    var c_index = confirm[1]//市
    var cid = pcList[1][c_index]['id']
    var c_name = pcList[1][c_index]['name']
    this.setData({
      currentProvince: pid,
      currentProvinceName: p_name,
      currentCity: cid,
      currentCityName: c_name
    })
  },
  //省市列表选择
  pcColumnChange: function (e) {
    var column = e.detail.column
    var index = e.detail.value
    var pcList = this.data.pcList
    switch (column) {
      case 0:
        var pid = pcList[0][index]['id']
        var name = pcList[0][index]['name']
        this.setData({
          currentProvince: pid,
          currentProvinceName: name,
          pcList: [pcList[0], []]
        })
        this._getPc(pid)
        break
      case 1:
        var cid = pcList[1][index]['id']
        var name = pcList[1][index]['name']
        this.setData({
          currentCity: cid,
          currentCityName: name
        })
        break
    }
  },
  _getPc: function (pid) {
    var that = this
    var nonceStr = md5.createNonceStr()
    var key = app.globalData.sig_key
    var str = '' + pid + nonceStr + key
    var token = md5.hexMD5(str)
    var data = { pid: pid, nonceStr: nonceStr, token: token }
    wx.request({
      url: server.api + 'home/wxxcx/getpc',
      data: data,
      success: function (res) {
        var status = res.data.code
        var city = res.data.data
        if (status == 200) {
          var province = that.data.province
          that.setData({
            pcList: [province, city],
            currentCity: city[0].id,
            currentCityName: city[0].name
          })
        } else {
          wx.showToast({
            title: res.data.msg || '省市获取有误',
            icon: 'loading'
          })
        }
      }
    })
  },
  //装修类型选择
  typeChange: function (e) {
    var no = e.detail.value
    var tid = this.data.typeList[no].id
    this.setData({
      typeIndex: no,
      typeId: tid
    })
    // console.log(no, tid)
  },
  //设计费预算选择
  budgetChange: function (e) {
    var no = e.detail.value
    var bid = this.data.budgetList[no].id
    this.setData({
      budgetIndex: no,
      budgetId: bid
    })
    // console.log(no, bid)
  },
  //手机号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //联系人
  nameInput: function (e) {
    this.setData({
      name: e.detail.value.trim()
    })
  },
  //装修面积
  areaInput: function (e) {
    this.setData({
      area: parseInt(e.detail.value)
    })
  },
  //装修预算
  decorationInput: function (e) {
    var input = parseInt(e.detail.value)
    console.log(input)
    if (input == '' || input == null || isNaN(input)) {
      var budget_input = 0
    }else{
      var budget_input = 1
    }
    
    this.setData({
      decoration_budget: parseInt(e.detail.value),
      decoration_budget_input: budget_input
    })
  },
  //描述说明
  descInput: function (e) {
    this.setData({
      desc: e.detail.value
    })
  },
  //确认发布
  releaseConfirm: function () {
    var typeId = this.data.typeId//装修类型
    var budgetId = this.data.budgetId//设计费用预算(不填表示0/m2)
    var area = parseInt(this.data.area)//装修面积
    var decoration_budget = parseInt(this.data.decoration_budget)//装修预算 (0表示面议)
    var desc = this.data.desc//说明
    if (desc!=null)desc = desc.trim()
    var name = this.data.name//联系人
    var phone = this.data.phone//手机号
    var province = this.data.currentProvince//省
    var city = this.data.currentCity//市
    this.setData({
      desc: desc
    })
    if (!province || !city) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none'
      })
      return false
    }
    if (typeId == -1) {
      wx.showToast({
        title: '请选择装修类型',
        icon: 'none'
      })
      return false
    }
    if (!area) {
      wx.showToast({
        title: '请填写装修面积',
        icon: 'none'
      })
      return false
    }
    if (!decoration_budget) {
      wx.showToast({
        title: '请填写装修预算',
        icon: 'none'
      })
      return false
    }
    if (!desc || desc.length <= 0) {
      wx.showToast({
        title: '请填写需求描述',
        icon: 'none'
      })
      return false
    }
    if (!name) {
      wx.showToast({
        title: '请填写联系人',
        icon: 'none'
      })
      return false
    } else {
      if (name.length < 2 || name.length > 5) {
        wx.showToast({
          title: '联系人为2-5个汉字',
          icon: 'none'
        })
        return false;
      }
      var name_reg = /^[\u0391-\uFFE5]+$/
      if (!name_reg.test(name)) {
        wx.showToast({
          title: '请正确填写中文联系人',
          icon: 'none'
        })
        return false;
      }
    }
    if (!phone) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none'
      })
      return false
    } else {
      var phone_reg = /^1[3456789]{1}\d{9}$/
      if (!phone_reg.test(phone)) {
        wx.showToast({
          title: '请正确填写手机号',
          icon: 'none'
        })
        return false;
      }
    }
    var nonceStr = md5.createNonceStr()
    var key = app.globalData.sig_key
    var str = '' + phone + province + city + area + typeId + budgetId + nonceStr + key
    var token = md5.hexMD5(str)
    var data = { province: province, city: city, decoration_type: typeId, area: area, decoration_budget: decoration_budget, design_budget: budgetId, desc: desc, name: name, phone: phone, nonceStr: nonceStr, token: token }
    // console.log(data)
    // return false;
    this._release(data)
  },
  //发布
  _release: function (datas) {
    var that = this
    if (that.data.submitting) {
      return false;
    } else {
      that.setData({
        submitting: true
      })
    }
    wx.showLoading({
      title: '发布中',
    })
    wx.request({
      url: server.api + 'home/wxxcx/release',
      data: datas,
      method: 'GET',
      success: function (res) {
        var result = res.data
        wx.hideLoading()
        if (result.status == 200) {
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 1500,
            complete: function () {
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/index/index'
                })
              }.bind(that), 1500)
            }
          })
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '需求发布出错~',
          icon: 'none'
        })
      }
    })
  },
  //获取分类
  _getRelease: function () {
    var that = this
    var nonceStr = md5.createNonceStr()
    var key = app.globalData.sig_key
    var str = nonceStr + key
    var token = md5.hexMD5(str)
    var data = { nonceStr: nonceStr, token: token }
    wx.request({
      url: server.api + 'home/wxxcx/getrelease',
      method: 'GET',
      data: data,
      success: function (res) {
        var tl = res.data.types
        var bl = res.data.budgets
        var province = res.data.province
        var city = res.data.city
        that.setData({
          typeList: tl,
          budgetList: bl,
          budgetId: bl[0].id,
          province: province,
          city: city,
          pcList: [province, city]
        })
      }
    })
  },
  onLoad: function (options) {

  },
  onShareAppMessage: function () {

  }
})