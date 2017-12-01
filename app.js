//app.js
const Bmob = require('utils/bmob.js');
const common = require('utils/common.js');
Bmob.initialize("66c4766d588932ba187727edad2a67e4", "4e2e91594966fb50a9633cde25c6f0c0");
const User = Bmob.Object.extend("Users");
const query = new Bmob.Query(User)
const user = new User();

App({
  onLaunch: function () {
    //如果用户没有清理缓存，且不是第一次登录，
    //可以直接从缓存中获取信息，不需要再次登录
    let value=wx.getStorageSync('my_id');
    if(value){
      return;
    }else{
      /*
      *需要登录的情况
      *1.用户从来没有登录过该小程序
      *2.用户登录过小程序但清理过缓存
      */
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              success: function (data) {
                console.log(data);
                let userInfo = data.userInfo;
                let nickName = userInfo.nickName;
                let avatarUrl = userInfo.avatarUrl;
                let avatar = avatarUrl.split('https://')[1];
                let encodeAvatar = encodeURIComponent(avatar).replace(/[.%_]/gi, '66');
                let date = Date.now();
                // user.set('my_id',encodeAvatar);
                // user.set('my_nick', nickName);
                // user.set('my_avatar', avatarUrl);
                // user.set('my_date', date);
                query.equalTo('my_id',encodeAvatar);
                query.find({
                  success:function(result){
                    //用户从来没有登录过该小程序
                    if(result.length==0){
                      user.set('my_id', encodeAvatar);
                      user.set('my_nick', nickName);
                      user.set('my_avatar', avatarUrl);
                      user.set('my_date', date);
                      wx.setStorageSync('my_id', encodeAvatar);
                      wx.setStorageSync('my_nick', nickName);
                      wx.setStorageSync('my_avatar', avatarUrl);
                      wx.setStorageSync('my_date', date);
                      user.save(null, {
                        success: function (result) {
                          console.log('存储成功，objectId:' + result.id);
                          wx.setStorageSync('my_one', result.id);
                        },
                        error: function (obj, err) {
                          console.log(err);
                        }
                      })
                    }else{
                      //用户登录过小程序，但清理了缓存
                      console.log(result);
                      let userData=result[0].attributes;
                      wx.setStorageSync('my_id', userData['my_id']);
                      wx.setStorageSync('my_nick', userData['my_nick']);
                      wx.setStorageSync('my_avatar', userData['my_avatar']);
                      wx.setStorageSync('my_date', userData['my_date']);
                      wx.setStorageSync('my_one', userData['my_one']);
                    }
                  }
                })
                
                // query.equalTo('my_id', encodeAvatar);
                // query.find({
                //   success: function (result) {
                //     console.log(result);
                //     if (result.length == 0) {
                //       wx.setStorageSync('my_id', encodeAvatar);
                //       wx.setStorageSync('my_nick', nickName);
                //       wx.setStorageSync('my_avatar', avatarUrl);
                //       wx.setStorageSync('my_date', date);
                //       user.save(null, {
                //         success: function (res) {
                //           console.log('存储成功，objectId:' + res.id);
                //           wx.setStorageSync('my_one', res.id);
                //         },
                //         error: function (err) {
                //           console.log(err);
                //         }
                //       })
                //     } else {
                //       let allContent = result[0].attributes;
                //       wx.setStorageSync('my_id', allContent['my_id']);
                //       wx.setStorageSync('my_nick', allContent['my_nick']);
                //       wx.setStorageSync('my_avatar', allContent['my_avatar']);
                //       wx.setStorageSync('my_date', allContent['my_date']);
                //       wx.setStorageSync('my_one', allContent['my_one']);
                //     }
                //   }
                // })

              }
            })
          }
        }
      }) 
    }
  }
})