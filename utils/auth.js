function authRecord(){
  let authRecord = wx.getStorageSync('authRecord');
  if (!authRecord){
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              wx.setStorageSync('authRecord', 'ok')
            }
          })
        }
      }
    })
  }
}

module.exports={
  authRecord:authRecord
}