/**
 * 生产环境
 */
; (function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = '/open/' // stable 环境
  // window.SITE_CONFIG['baseUrl'] = 'http://172.16.42.144:8658/open/' // stable 环境 使用绝对路径因为前后端不在同一环境下会出现跨域的问题
  // window.SITE_CONFIG['baseUrl'] = 'http://oem.haifou.com/open/' // 线上

  // 资源路径
  window.SITE_CONFIG['imgUrl'] = 'http://test.haifou.com:8088/' // stable 环境
  // window.SITE_CONFIG['imgUrl'] = 'http://shdb.253.com:8180/' // 线上

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})();
