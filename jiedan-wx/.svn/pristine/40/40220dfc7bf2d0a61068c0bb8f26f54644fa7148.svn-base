var server = require('../../js/server.js')
var md5 = require('../../utils/md5.js')
var app = getApp()
Page({
  data: {
    view: {},
    firstLaunch: true,//首次加载
    scrollTop: 0,
    floorstatus: false,//显示回到顶部按钮
    showorder: false,//显示排序列表
    showtype: false,//显示类型列表
    order: 0,//排序：0发布时间，10装修预算asc,11装修预算desc,20装修面积asc,21装修面积desc
    order_type: 0,//类型:0全部,1住宅,2别墅，3商业空间，4办公室，5餐饮，6其他
    typeList: ['全部', '住宅', '别墅', '商业空间', '办公室', '餐饮', '其他'],
    requirementsList: [],//需求列表
    page: 1,//当前页数
    endPage: false,//是否最后一页
    province: null,//获取到的省市
    city: null,
    banner: ''
  },
  onShareAppMessage:function(){
    
  },
  goTop: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  onPageScroll: function (e) {
    if (e.scrollTop > 200) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  //上拉加載
  onReachBottom: function () {
    this._getLocateAndRequire()
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that._goSearch()
  },
  //点击排序
  taborder: function (e) {
    var show = this.data.showorder
    this.setData({
      showorder: !show,
      showtype: false
    });
  },
  //点击类型
  tabtype: function (e) {
    var show = this.data.showtype
    this.setData({
      showtype: !show,
      showorder: false
    });
  },
  onLoad: function (e) {
    this._getBanner()
    this._getLocateAndRequire()
    this._getWH()
  },
  onShow: function (e) {
    // this._goSearch()
  },
  //详情页
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/index/details?id=' + id,
    })
  },
  //排序点击 - 发布时间
  orderTap0: function (e) {
    var order = this.data.order
    if (order != 0) {
      this.setData({
        order: 0,
      })
      this._goSearch()
    }
  },
  //排序点击 - 装修预算
  orderTap10: function (e) {
    var order = this.data.order
    var val = 10
    if (order == 10) {
      val = 11
    }
    this.setData({
      order: val,
    })
    this._goSearch()
  },
  //排序点击 - 装修面积
  orderTap20: function (e) {
    var order = this.data.order
    var val = 20
    if (order == 20) {
      val = 21
    }
    this.setData({
      order: val,
    })
    this._goSearch()
  },
  //类型点击
  orderTypeTap: function (e) {
    var c_type = e.target.dataset.type
    var order_type = this.data.order_type
    if (c_type != order_type) {
      this.setData({
        order_type: c_type,
      })
      this._goSearch()
    }
  },
  //重置筛选条件
  _goSearch: function () {
    this.setData({
      page: 1,
      endPage: false,
      requirementsList: [],
      firstLaunch: true
    })
    this._getLocateAndRequire()
  },
  //获取用户位置然后获取首页列表
  _getLocateAndRequire: function () {
    var that = this
    var province = that.data.province
    var city = that.data.city
    if (province == null || province == null) {
      wx.getLocation({
        success: function (res) {
          wx.showLoading({
            title: '加载中'
          })
          // console.log(res)
          var latitude = res.latitude
          var longitude = res.longitude
          //测试江苏省、苏州市
          // var latitude = 31.19
          // var longitude = 120.4
          wx.request({
            url: 'https://apis.map.qq.com/ws/geocoder/v1/?coord_type=1&key=QMBBZ-F6TLS-XA3OO-6YL4A-LJQAE-KOBHA&location=' + latitude + ',' + longitude,
            method: 'GET',
            success: function (re) {
              //请求省市的结果
              var re_province = re.data.result.address_component.province
              var re_city = re.data.result.address_component.city
              that.setData({
                province: re_province,
                city: re_city
              })
            },
            complete: function () {
              //请求后的省市查询
              var c_province = that.data.province
              var c_city = that.data.city
              that._getRequirementsList(c_province, c_city)
            }
          })
        },
        fail: function () {
          that._getRequirementsList(province, city)
        }
      })
    } else {
      that._getRequirementsList(province, city)
    }
  },
  //获取首页列表
  _getRequirementsList: function (province, city) {
    if (this.data.endPage) {
      return false
    }
    var order = this.data.order
    var order_type = this.data.order_type
    var page = this.data.page

    var nonceStr = md5.createNonceStr()
    var key = app.globalData.sig_key
    var str = '' + order + order_type + page + nonceStr + key
    var token = md5.hexMD5(str)
    var data = { order: order, order_type: order_type, page: page, province: province, city: city, nonceStr: nonceStr, token: token }
    var that = this
    wx.request({
      url: server.api + 'home/wxxcx/index',
      method: 'GET',
      data: data,
      success: function (res) {
        var status = res.data.code;
        var lists = res.data.lists;
        if (status == 200) {
          that.setData({
            requirementsList: that.data.requirementsList.concat(lists),
            page: that.data.page + 1,
            firstLaunch: false
          })
        } else if (status == 201) {
          that.setData({
            endPage: true,
            firstLaunch: false
          })
        }
      },
      complete: function () {
        wx.hideLoading()
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  //获取banner
  _getBanner: function () {
    var that = this
    var nonceStr = md5.createNonceStr()
    var key = app.globalData.sig_key
    var token = md5.hexMD5(nonceStr + key)
    var data = { token: token, nonceStr: nonceStr }
    wx.request({
      url: server.api + 'home/wxxcx/getbanner',
      data: data,
      method: 'GET',
      success: function (res) {
        var status = res.data.code
        if (status == 200) {
          var pic = res.data.data
          that.setData({
            banner: server.small + pic
          })
        }
      }
    })
  },
  //获取设备的宽高
  _getWH: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        var width = res.windowWidth
        var height = res.windowHeight
        that.setData({
          view: { Width: width, Height: height }
        })
      }
    })
  }
})