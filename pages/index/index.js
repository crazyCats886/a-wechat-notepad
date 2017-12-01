//index.js
//获取应用实例
const app = getApp()
const Bmob = require('../../utils/bmob.js')
const User = Bmob.Object.extend('Users')
const query = new Bmob.Query(User)
const user = new User()

Page({
  data: {
    avatar:'',
    myNick:'',
    pageCode:'',
    pageData:null,
    num:1
  },
  onLoad:function(){
    let that = this;
    let num=that.data.num;
    if(num==1){
      wx.getUserInfo({
        success: function (data) {
          let userInfo = data.userInfo;
          let nickName = userInfo.nickName;
          let avatarUrl = userInfo.avatarUrl;
          that.setData({
            avatar: avatarUrl,
            myNick: nickName,
            num:2
          })
        }
      })
    }
    let myNick = wx.getStorageSync('my_nick');
    let myAvatar = wx.getStorageSync('my_avatar');
    let myId=wx.getStorageSync('my_id');
    let myDate=wx.getStorageSync('my_date');
    let myOne=wx.getStorageSync('my_one');
    that.setData({
      avatar: myAvatar,
      myNick: myNick
    })
    query.get(myOne,{
      success:function(result){
        if(result.attributes['my_one']){
          return;
        }else{
          result.set('my_one', myOne);
          result.save();
        }
      }
    })
    query.equalTo('my_id',myId);
    query.find({
      success:function(result){
        console.log(result);
        if(result.length==0 || !result[0].attributes.content){
          return;
        }else{
          if(result[0].attributes.content){
            let contents = result[0].attributes.content.reverse();
            let pageData=[];
            if(contents.length <=10){
              pageData=contents;
            }else{
              for(let i=0;i<10;i++){
                pageData.push(contents[i]);
              }
            }
            that.setData({
              pageData: pageData
            });
          }else{
            return;
          }
        }
      }
    })
  },
  toUpdata:function(){
    let myOne = wx.getStorageSync('my_one');
    let that = this;
    query.get(myOne, {
      success: function (result) {
        //console.log(result);
        if (result.attributes['my_one']) {
          return;
        } else {
          result.set('my_one', myOne);
          result.save();
        }
      },
      error: function (obj, err) {
        console.log(err);
      }
    })
    wx.navigateTo({
      url: '../updata/updata'
    })
  },
  // onReady:function(){
  //   let myNick = wx.getStorageSync('my_nick');
  //   let myAvatar = wx.getStorageSync('my_avatar');
  //   let myId = wx.getStorageSync('my_id');
  //   let myDate = wx.getStorageSync('my_date');
  //   let myOne = wx.getStorageSync('my_one');
  //   let that = this;
  //   query.get(myOne, {
  //     success: function (result) {
  //       console.log(result);
  //       if(result.attributes['my_id']){
  //         return;
  //       }else{
  //         result.set('my_id', myId);
  //         result.set('my_nick', myNick);
  //         result.set('my_avatar', myAvatar);
  //         result.set('my_date', myDate);
  //         result.set('my_one', myOne);
  //         result.save();
  //       }
  //     },
  //     error: function (obj, err) {
  //       console.log(err);
  //     }
  //   })
  // },
  onShow:function(options){
    let myId = wx.getStorageSync('my_id');
    let myAvatar=wx.getStorageSync('my_avatar');
    let myNick=wx.getStorageSync('my_nick');
    let that=this;
    that.setData({
      avatar: myAvatar,
      myNick: myNick
    });
    query.equalTo('my_id', myId);
    query.find({
      success: function (result) {
        console.log(result);
        if (result.length === 0 || !result[0].attributes) {
          return;
        } else {
          let contents = result[0].attributes.content.reverse();
          console.log(contents);
          let pageData = [];
          if(contents.length <= 10){
            pageData=contents;
          }else{
            for (let i = 0; i < 10; i++) {
              pageData.push(contents[i]);
            }
          }
          that.setData({
            pageData: pageData
          })
        }
      }
    })
  },
  playRecord:function(e){
    console.log(e);
    let index=e.currentTarget.id;
    let that=this;
    let content=that.data.pageData[index].recordPath;
    wx.playVoice({
      filePath: content,
      success:function(){
        console.log('开始播放录音');
      }
    })
  },
  previewImgs:function(e){
    let index=e.currentTarget.id;
    let that=this;
    let content=that.data.pageData[index].uploadImgs;
    wx.previewImage({
      urls: content,
      complete:function(){
        return false;
      }
    })
  }
  // onPullDownRefresh:function(){
  //   let that=this;
  //   let myOne=wx.getStorageSync('my_one');
  //   query.get(myOne,{
  //     success:function(result){
  //       wx.stopPullDownRefresh();
  //       if(!result.attributes.content){
  //         return;
  //       }else{
  //         let content=result.attributes.content;
  //         that.setData({
  //           pageData:content
  //         })
  //       }
  //     }
  //   })
  // }
})
