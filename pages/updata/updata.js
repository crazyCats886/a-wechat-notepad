// pages/updata/updata.js
const auth=require('../../utils/auth.js')
const util=require('../../utils/util.js')
const Bmob=require('../../utils/bmob.js')
const User = Bmob.Object.extend("Users")
const query=new Bmob.Query(User)
const user=new User()
const updata=require('../../utils/updata.js')
const My = Bmob.Object.extend('My')
const myQuery = new Bmob.Query(My)
const my = new My()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    items:[
      { name:'normal',  value:'普通', checked:true},
      { name: 'important', value: '重要'},
      { name: 'quickly', value: '紧急'}
    ],
    recordDes: { src:'../../images/panda.png', detail:'等待录音中'},
    uploadImgs:[],
    recordUrl:'',
    tagLevel:0,
    shortDes:'',
    tags:[],
    code:null,
    myCode: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  one2:function(){
    console.log('one2');
  },
  onLoad: function (options) {
    let that=this;
    //页面功能实现
    auth.authRecord();
    let myOne=wx.getStorageSync('my_one');
    query.get(myOne,{
      success:function(result){
        result.set('objectId',myOne);
        result.save();
      }
    })
  },
  //增加图片
  addPics:function(){
    let that=this;
    let imgsLength = that.data.uploadImgs.length;
    if( imgsLength >= 4 ) return;
    wx.chooseImage({
      count:4,
      success: function(res) {
        if(imgsLength+res.tempFilePaths.length > 4) return;
        let uploadImgs=that.data.uploadImgs;
        if(uploadImgs.length !== 0){
          uploadImgs=uploadImgs.concat(res.tempFilePaths);
          that.setData({
            uploadImgs: uploadImgs
          })
        }else{
          that.setData({
            uploadImgs: res.tempFilePaths
          }) 
        }
      },
      fail:function(err){
        console.error(err);
      }
    })
  },
  //删除图片
  deleteImage:function(e){
    console.log(e);
    let num=e.currentTarget.id;
    let that=this;
    let uploadImgs=that.data.uploadImgs;
    uploadImgs.splice(num,1);
    that.setData({
      uploadImgs:uploadImgs
    });
  },
  //图片预览
  previewImg:function(e){
    let that=this;
    let uploadImgs=that.data.uploadImgs;
    wx.previewImage({
      current:e.currentTarget.id,
      urls:uploadImgs 
    })
  },
  //文字输入区
  textareaChange:function(e){
    let that=this;
    that.setData({
      shortDes:e.detail.value
    });
  },
  //事务标签输入框
  tagsChange:function(e){
    let tags=e.detail.value.replace(/\？/gi,'?');
    let tagsArr=tags.split('?');
    let arr=[];
    for(let i=0;i<tagsArr.length;i++){
      if(tagsArr[i]==''){
        continue;
      }else{
        arr.push(tagsArr[i]);
      }
    }
    let that=this;
    that.setData({
      tags:arr
    });
  },
  //录音按钮事件处理
  showRecord:function(){
    let that = this;
    that.setData({
      recordDes: { src: '../../images/dog.png', detail: '长按录音' }
    });
  },
  startRecord:function(){
    auth.authRecord();
    let that=this;
    that.setData({
      recordDes: { src: '../../images/dog.png', detail: '录音中..'}
    });
    wx.startRecord({
      success:function(res){
        console.log(res.errMsg+':开始录音');
        console.log(res);
      },
      complete:function(res){
        console.log(res);
        that.setData({
          recordUrl:res.tempFilePath
        });
      },
      error:function(obj,err){
        console.log(obj+err);
      }
    })
  },
  touchEnd:function(){
    wx.stopRecord();
    let that = this;
    that.setData({
      recordDes: { src: '../../images/dog.png', detail: '完成录音' }
    });
  },
  playRecord:function(){
    auth.authRecord();
    let that = this;
    let recordUrl=that.data.recordUrl;
    if(recordUrl==''){
      that.setData({
        recordDes: { src: '../../images/bull.png', detail: '暂无录音' }
      });
    }else{
      wx.playVoice({
        filePath: recordUrl,
        success(){
          console.log('开始播放录音');
        }
      });
      that.setData({
        recordDes: { src: '../../images/bull.png', detail: '开始播放' }
      });
    }
  },
  deleteRecord:function(){
    auth.authRecord();
    let that = this;
    that.setData({
      recordUrl:'',
      recordDes: { src: '../../images/horse.png', detail: '已删除' }
    });
  },
  //单选按钮切换
  radioChange:function(e){
    console.log(e.detail.value);
    let tag=e.detail.value;
    let tagLevel;
    let that=this;
    switch (tag){
      case 'important':
        tagLevel=1;
        break;
      case 'quickly':
        tagLevel=2;
        break;
      default :
        tagLevel=0;    
    };
    that.setData({
      tagLevel:tagLevel
    });
  },
  //上传所有数据
  uploadAllData:function(){
    let that=this;
    let shortDes = that.data.shortDes;
    let tags = that.data.tags;
    let tagLevel = that.data.tagLevel;
    let uploadImgs = that.data.uploadImgs;
    let recordUrl = that.data.recordUrl;
    updata.uploadAll(shortDes,tags,tagLevel,uploadImgs,recordUrl);
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