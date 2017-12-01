const util=require('./util.js')
const Bmob = require('./bmob.js')
const User = Bmob.Object.extend('Users')
const query = new Bmob.Query(User)
const user = new User()

function uploadAll(shortDes,tags,tagLevel,uploadImgs,recordUrl){
  if(shortDes=='' && tags.length==0 && uploadImgs.length==0 && recordUrl=='') return;
  wx.showNavigationBarLoading();
  let that = this;
  let content={};
  //获取用户信息
  let id=wx.getStorageSync('my_date');
  let myId = wx.getStorageSync('my_id');
  let myOne=wx.getStorageSync('my_one');
  let myNick = wx.getStorageSync('my_nick');
  let myAvatar = wx.getStorageSync('my_avatar');
  //年月日及上传时间
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let uploadTime = util.formatTime(date);
  content.uploadTime = uploadTime;
  content.year=year;
  content.month=month;
  content.day=day;
  //获取用户输入的简短介绍、标签和事务等级
  // let shortDes = shortDes;
  // let tags = tags;
  // let tagLevel = tagLevel;
  content.shortDes = shortDes;
  content.tags = tags;
  content.tagLevel = tagLevel;
  /**
   * 判断图片和录音是否存在
  */
  let urlArr = [];
  let uploadRecordPath = '';
  query.equalTo('my_one',myOne);
  if(uploadImgs.length==0 && recordUrl=='' && shortDes=='' && tags.length == 0){
    return;
  }
  //用户没有上传图片和录音
  if (uploadImgs.length == 0 && recordUrl==''){
    if(shortDes=='' && tags.length == 0){
      return;
    }else{
      content.uploadImgs = [];
      content.recordPath = '';
      query.find({
        success: function (result) {
          console.log(result);
          uploadMessage(result, content, myId, myNick, myAvatar, id,myOne);
        }
      })
    }
  }
  //用户只上传图片，没有上传录音
  if (uploadImgs.length !== 0 && recordUrl==''){
    content.recordPath='';
    for(let i=0;i<uploadImgs.length;i++){
      let tempFilePath = [uploadImgs[i]];
      let extension = tempFilePath[0].split('.');
      if (extension) {
        extension = extension[extension.length - 1].toLowerCase();
      }
      let name = uploadTime + '.' + extension;
      let file = new Bmob.File(name, tempFilePath);
      file.save().then(function(res){
        let url=res.url();
        urlArr.push(url);
        return urlArr;
      }).then(function(urlArrs){
        content.uploadImgs=urlArrs;
        query.find({
          success: function (result) {
            uploadMessage(result, content, myId, myNick, myAvatar, id,myOne);
          }
        })
      })
    }
  }
  //用户只上传录音，没有上传图片
  if (uploadImgs.length == 0 && recordUrl != ''){
    content.uploadImgs=[];
    wx.saveFile({
      tempFilePath: recordUrl,
      success:function(res){
        uploadRecordPath = res.savedFilePath;
        content.recordPath=uploadRecordPath;
        query.find({
          success:function(result){
            console.log(result);
            uploadMessage(result, content, myId, myNick, myAvatar, id,myOne);
          }
        })
      }
    })
  }
  //用户上传图片和录音
  if (uploadImgs.length != 0 && recordUrl != ''){
    for (let i = 0; i < uploadImgs.length; i++) {
      let tempFilePath = [uploadImgs[i]];
      let extension = tempFilePath[0].split('.');
      if (extension) {
        extension = extension[extension.length - 1].toLowerCase();
      }
      let name = uploadTime + '.' + extension;
      let file = new Bmob.File(name, tempFilePath);
      file.save().then(function (res) {
        let url = res.url();
        urlArr.push(url);
        return urlArr;
      }).then(function (urlArrs) {
        content.uploadImgs = urlArrs;
        //上传录音
        //console.log(content);
        let uploadRecordPath = '';
        wx.saveFile({
          tempFilePath: recordUrl,
          success: function (res) {
            uploadRecordPath = res.savedFilePath;
            content.recordPath = uploadRecordPath;
            //所有数据上传
            query.find({
              success:function(result){
                //console.log(result);
                uploadMessage(result,content,myId,myNick,myAvatar,id,myOne);
              }
            })
          }
        })
      })
    }
  }
}

function uploadMessage(result,content,myId,myNick,myAvatar,id,myOne){
  console.log(result);
  if (!result[0] || !result[0].attributes){
    return;
  }
  let allContent=[];
  if (!result[0].attributes.content){
    allContent.push(content);
  }else{
    allContent=result[0].attributes.content;
    allContent.push(content);
  }
  query.get(myOne,{
    success:function(result){
      result.set('content',allContent);
      result.save(null,{
        success:function(res){
          wx.hideNavigationBarLoading();
          wx.navigateBack({
            delta: 1
          });
          wx.setStorageSync('more', 'yes');
          console.log('存储成功，objectId:' + res.id)
        },
        error:function(obj,err){
          console.log(err);
        }
      });
    },
    error:function(obj,err){
      console.log(err);
    }
  })
}

module.exports={
  uploadAll:uploadAll
}