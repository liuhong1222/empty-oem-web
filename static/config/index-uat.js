/**
* 验收环境
*/
; (function () {
  window.SITE_CONFIG = {}

    // api接口请求地址
    // window.SITE_CONFIG['baseUrl'] = 'http://localhost:9999/open/';
  window.SITE_CONFIG['baseUrl'] = 'http://172.16.40.132:9999/open/'

  window.SITE_CONFIG['imgUrl'] = 'http://172.16.40.144:9191/'
  window.SITE_CONFIG['zxaImgUrl'] = 'http://172.16.40.144:8081/'
    // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = '' // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
