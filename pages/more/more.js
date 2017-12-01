// pages/more/more.js
const Bmob = require('../../utils/bmob.js')
const User = Bmob.Object.extend('Users')
const query = new Bmob.Query(User)
const user = new User()
const monthData=require('../../utils/month.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData:null,
    nowMonth:{},
    lastMonth:{},
    beforeLastMonth:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    let myId=wx.getStorageSync('my_id');
    query.equalTo('my_id',myId);
    query.find({
      success:function(result){
        if(result.length==0){
          return;
        }else{
          if (result[0].attributes.content){
            let contents = result[0].attributes.content.reverse();
            //console.log(contents);
            let date = new Date();
            let month = date.getMonth() + 1;
            let allMonths = monthData.month(month, contents);
            //console.log(allMonths);
            that.setData({
              nowMonth: allMonths[0],
              lastMonth: allMonths[1],
              beforeLastMonth: allMonths[2]
            })
          }
        }
      }
    })
  },
  goDetail:function(e){
    console.log(e.currentTarget);
    let tapDetail=e.currentTarget.id.split(',');
    let month=tapDetail[0];
    let index=tapDetail[1];
    wx.navigateTo({
      url: `../detail/detail?month=${month}&index=${index}`
    })
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
    let that = this;
    let myId = wx.getStorageSync('my_id');
    let more=wx.getStorageSync('more');
    if(more=='yes'){
      query.equalTo('my_id', myId);
      query.find({
        success: function (result) {
          let contents = result[0].attributes.content.reverse();
          let date = new Date();
          let month = date.getMonth() + 1;
          let allMonths = monthData.month(month, contents);
          //console.log(allMonths);
          that.setData({
            nowMonth: allMonths[0]
          })
          wx.setStorageSync('more', 'no');
        }
      })
    }else{
      return;
    }
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
  
  }
})