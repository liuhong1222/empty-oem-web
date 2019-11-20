const imgUrlConfig = {
  imgUrl: '',
  zxaImgUrl: ''
}
console.log(window.SITE_CONFIG)
// imgUrlConfig.imgUrl = 'http://127.0.0.1:9191/';   //军哥
// imgUrlConfig.imgUrl = 'http://shdb.253.com:8180/';   //军哥
// imgUrlConfig.zxaImgUrl = 'http://shdb.253.com:8081/';  //张新安

imgUrlConfig.imgUrl = window.SITE_CONFIG.imgUrl   // 军哥
imgUrlConfig.zxaImgUrl = window.SITE_CONFIG.zxaImgUrl  // 张新安
export default imgUrlConfig
