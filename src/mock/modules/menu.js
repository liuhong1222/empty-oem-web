import isInteger from 'lodash/isInteger'

const adminNav = {
  'msg':'success',
  'menuList':[
      {
          'menuId':49,
          'parentId':0,
          'parentName':null,
          'name':'工作台',
          'url':null,
          'perms':null,
          'type':0,
          'icon':'shouye',
          'orderNum':1,
          'open':null,
          'list':[
              {
                  'menuId':50,
                  'parentId':49,
                  'parentName':null,
                  'name':'管理员权限',
                  'url':'console/admin',
                  'perms':null,
                  'type':1,
                  'icon':'shezhi',
                  'orderNum':0,
                  'open':null,
                  'list':null
              }
          ]
      },
      {
          'menuId':31,
          'parentId':0,
          'parentName':null,
          'name':'用户管理',
          'url':null,
          'perms':null,
          'type':0,
          'icon':'admin',
          'orderNum':2,
          'open':null,
          'list':[
              {
                  'menuId':32,
                  'parentId':31,
                  'parentName':null,
                  'name':'代理商列表',
                  'url':'user/agent',
                  'perms':null,
                  'type':1,
                  'icon':'log',
                  'orderNum':0,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':42,
                  'parentId':31,
                  'parentName':null,
                  'name':'客户列表',
                  'url':'user/user',
                  'perms':null,
                  'type':1,
                  'icon':'log',
                  'orderNum':0,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':75,
                  'parentId':31,
                  'parentName':null,
                  'name':'代理等级管理',
                  'url':'user/level',
                  'perms':null,
                  'type':1,
                  'icon':'log',
                  'orderNum':0,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':83,
                  'parentId':31,
                  'parentName':null,
                  'name':'代理商设置列表',
                  'url':'user/agentsetting',
                  'perms':null,
                  'type':1,
                  'icon':'log',
                  'orderNum':0,
                  'open':null,
                  'list':null
              }
          ]
      },
      {
          'menuId':59,
          'parentId':0,
          'parentName':null,
          'name':'财务管理',
          'url':null,
          'perms':null,
          'type':0,
          'icon':'tubiao',
          'orderNum':3,
          'open':null,
          'list':[
              {
                  'menuId':60,
                  'parentId':59,
                  'parentName':null,
                  'name':'代理商充值记录',
                  'url':'finance/agentrecharge',
                  'perms':null,
                  'type':1,
                  'icon':'tubiao',
                  'orderNum':0,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':91,
                  'parentId':59,
                  'parentName':null,
                  'name':'我的充值记录',
                  'url':'finance/myrecharge',
                  'perms':null,
                  'type':1,
                  'icon':'tubiao',
                  'orderNum':1,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':92,
                  'parentId':59,
                  'parentName':null,
                  'name':'客户充值记录',
                  'url':'finance/userrecharge',
                  'perms':null,
                  'type':1,
                  'icon':'tubiao',
                  'orderNum':2,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':61,
                  'parentId':59,
                  'parentName':null,
                  'name':'客户退款记录',
                  'url':'finance/userrefund',
                  'perms':null,
                  'type':1,
                  'icon':'tubiao',
                  'orderNum':3,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':62,
                  'parentId':59,
                  'parentName':null,
                  'name':'客户消耗记录',
                  'url':'finance/userconsume',
                  'perms':null,
                  'type':1,
                  'icon':'tubiao',
                  'orderNum':4,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':202,
                  'parentId':59,
                  'parentName':null,
                  'name':'客户转代理商记录',
                  'url':'finance/userchange',
                  'perms':'',
                  'type':1,
                  'icon':'tubiao',
                  'orderNum':5,
                  'open':null,
                  'list':null
              }
          ]
      },
      {
          'menuId':189,
          'parentId':0,
          'parentName':null,
          'name':'新闻管理',
          'url':'',
          'perms':null,
          'type':0,
          'icon':'duanxin',
          'orderNum':4,
          'open':null,
          'list':[
              {
                  'menuId':190,
                  'parentId':189,
                  'parentName':null,
                  'name':'代理商新闻列表',
                  'url':'news/all/list',
                  'perms':null,
                  'type':1,
                  'icon':'menu',
                  'orderNum':1,
                  'open':null,
                  'list':null
              }
          ]
      },
      {
          'menuId':205,
          'parentId':0,
          'parentName':null,
          'name':'消息管理',
          'url':'',
          'perms':null,
          'type':0,
          'icon':'duanxin',
          'orderNum':4,
          'open':null,
          'list':[
              {
                  'menuId':206,
                  'parentId':205,
                  'parentName':null,
                  'name':'代理商消息列表',
                  'url':'message/all/list',
                  'perms':null,
                  'type':1,
                  'icon':'menu',
                  'orderNum':1,
                  'open':null,
                  'list':null
              }
          ]
      },
      {
          'menuId':221,
          'parentId':0,
          'parentName':null,
          'name':'产品管理审核',
          'url':'product/audit',
          'perms':null,
          'type':0,
          'icon':'menu',
          'orderNum':8,
          'open':null,
          'list':[
              {
                  'menuId':222,
                  'parentId':221,
                  'parentName':null,
                  'name':'产品线审核列表',
                  'url':'product/prolineaudit',
                  'perms':null,
                  'type':1,
                  'icon':'zhedie',
                  'orderNum':8,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':223,
                  'parentId':221,
                  'parentName':null,
                  'name':'产品审核列表',
                  'url':'product/proaudit',
                  'perms':null,
                  'type':1,
                  'icon':'zhedie',
                  'orderNum':8,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':224,
                  'parentId':221,
                  'parentName':null,
                  'name':'常见问题审核列表',
                  'url':'product/quesaudit',
                  'perms':'productFaq:all:list',
                  'type':1,
                  'icon':'zhedie',
                  'orderNum':8,
                  'open':null,
                  'list':null
              }
          ]
      },
      {
          'menuId':1,
          'parentId':0,
          'parentName':null,
          'name':'系统管理',
          'url':null,
          'perms':null,
          'type':0,
          'icon':'system',
          'orderNum':9,
          'open':null,
          'list':[
              {
                  'menuId':2,
                  'parentId':1,
                  'parentName':null,
                  'name':'管理员列表',
                  'url':'sys/user',
                  'perms':null,
                  'type':1,
                  'icon':'admin',
                  'orderNum':1,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':3,
                  'parentId':1,
                  'parentName':null,
                  'name':'角色管理',
                  'url':'sys/role',
                  'perms':null,
                  'type':1,
                  'icon':'role',
                  'orderNum':2,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':4,
                  'parentId':1,
                  'parentName':null,
                  'name':'菜单管理',
                  'url':'sys/menu',
                  'perms':null,
                  'type':1,
                  'icon':'menu',
                  'orderNum':3,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':5,
                  'parentId':1,
                  'parentName':null,
                  'name':'SQL监控',
                  'url':'http://localhost:8080/renren-fast/druid/sql.html',
                  'perms':null,
                  'type':1,
                  'icon':'sql',
                  'orderNum':4,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':6,
                  'parentId':1,
                  'parentName':null,
                  'name':'定时任务',
                  'url':'job/schedule',
                  'perms':null,
                  'type':1,
                  'icon':'job',
                  'orderNum':5,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':27,
                  'parentId':1,
                  'parentName':null,
                  'name':'参数管理',
                  'url':'sys/config',
                  'perms':'sys:config:list,sys:config:info,sys:config:save,sys:config:update,sys:config:delete',
                  'type':1,
                  'icon':'config',
                  'orderNum':6,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':30,
                  'parentId':1,
                  'parentName':null,
                  'name':'文件上传',
                  'url':'oss/oss',
                  'perms':'sys:oss:all',
                  'type':1,
                  'icon':'oss',
                  'orderNum':6,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':29,
                  'parentId':1,
                  'parentName':null,
                  'name':'系统日志',
                  'url':'sys/log',
                  'perms':'sys:log:list',
                  'type':1,
                  'icon':'log',
                  'orderNum':7,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':65,
                  'parentId':1,
                  'parentName':null,
                  'name':'账号管理',
                  'url':'sys/agentaccount',
                  'perms':null,
                  'type':1,
                  'icon':'admin',
                  'orderNum':8,
                  'open':null,
                  'list':null
              },
              {
                  'menuId':217,
                  'parentId':1,
                  'parentName':null,
                  'name':'修改密码',
                  'url':'sys/editPwd',
                  'perms':null,
                  'type':1,
                  'icon':'jiesuo',
                  'orderNum':11,
                  'open':null,
                  'list':null
              }
          ]
      }
  ],
  'code':0,
  'permissions':[
      'open:agent:set:updateBasicInfo',
      'user:product:list',
      'open:agent:set:findCustService',
      'sys:config:save',
      'sys:config:update',
      'user:level:info:list',
      'open:agent:user:changeAgent',
      'open:agent:set:updateContract',
      'open:agent:set:findWxLogin',
      'user:level:save',
      'open:agent:set:audit:approved',
      'open:agent:set:updateWeixinpay',
      'sys:menu:select',
      'sys:schedule:update',
      'open:agent:sms:sendVerifyCode',
      'open:agent:set:findDomainInfo',
      'open:agent:set:updateDomainInfo',
      'user:level:info',
      'news:all:delete',
      'user:product:findById',
      'user:user:info:list:export',
      'sys:role:update',
      'finance:agent:recharge:list:export',
      'productFaq:all:audit',
      'open:agent:cust:getPackageInfo',
      'user:agent:update',
      'sys:user:save',
      'open:agent:set:updateCustService',
      'sys:menu:update',
      'sys:menu:delete',
      'open:agent:set:audit:rejected',
      'sys:menu:list',
      'open:agent:cust:refunds',
      'open:agent:set:findContract',
      'sys:schedule:resume',
      'open:agent:set:findWeixinpay',
      'sys:user:update',
      'sys:menu:info',
      'sys:role:select',
      'news:all:audit',
      'user:line:findById',
      'console:admin:info',
      'sys:menu:save',
      'user:product:updateStatus',
      'user:agent:info:list:export',
      'open:agent:cust:recharge',
      'open:agent:desk:getAdminDeskInfo',
      'open:agent:sms:checkMobile',
      'user:level:delete',
      'sys:schedule:run',
      'sys:config:delete',
      'user:co:info',
      'finance:user:recharge:list',
      'sys:role:delete',
      'finance:user:consume:list',
      'sys:schedule:pause',
      'sys:log:list',
      'user:line:findNameList',
      'finance:agent:recharge:list',
      'finance:user:refund:list:export',
      'open:agent:cust:getPackageInfoById',
      'open:agent:set:updateAlipay',
      'user:line:updateStatus',
      'open:agent:user:changeAgentList',
      'user:level:update',
      'finance:user:consume:list:export',
      'productFaq:all:list',
      'sys:role:list',
      'open:agent:set:delAgent',
      'sys:schedule:save',
      'open:agent:cust:getCustInfo',
      'stats:agentCanUpgrade:count',
      'sys:role:save',
      'open:agent:set:findBasicInfo',
      'user:agent:setting',
      'sys:schedule:log',
      'user:indv:info',
      'message:all:audit',
      'sys:schedule:list',
      'user:user:info:list',
      'open:agent:set:updateWxLogin',
      'message:all:detail',
      'sys:agentSysUser:list',
      'sys:agentSysUser:update',
      'sys:oss:all',
      'sys:schedule:info',
      'user:agent:info:list',
      'news:all:detail',
      'sys:config:info',
      'sys:agentSysUser:delete',
      'news:all:list',
      'sys:user:delete',
      'message:all:delete',
      'sys:config:list',
      'finance:my:recharge:list',
      'user:line:list',
      'finance:my:recharge:list:export',
      'open:agent:user:changeAgentListExport',
      'sys:agentSysUser:save',
      'user:agent:save',
      'sys:user:list',
      'sys:agentSysUser:list:export',
      'user:agent:recharge',
      'productFaq:all:detail',
      'sys:role:info',
      'sys:schedule:delete',
      'open:agent:desk:updateMail',
      'user:agent:license:upload',
      'open:agent:sms:updateMobile',
      'user:agent:info',
      'open:agent:set:agentSetList',
      'user:agent:resume',
      'message:all:list',
      'sys:user:info',
      'finance:user:refund:list',
      'open:agent:desk:findMobile',
      'user:account:presentNum',
      'open:agent:set:findAlipay',
      'user:agent:pause'
  ]
}

const agentNav = {
  "msg":"success",
  "menuList":[
      {
          "menuId":49,
          "parentId":0,
          "parentName":null,
          "name":"工作台",
          "url":null,
          "perms":null,
          "type":0,
          "icon":"shouye",
          "orderNum":1,
          "open":null,
          "list":[
              {
                  "menuId":51,
                  "parentId":49,
                  "parentName":null,
                  "name":"我的权限",
                  "url":"console/agent",
                  "perms":null,
                  "type":1,
                  "icon":"shezhi",
                  "orderNum":1,
                  "open":null,
                  "list":null
              }
          ]
      },
      {
          "menuId":31,
          "parentId":0,
          "parentName":null,
          "name":"用户管理",
          "url":null,
          "perms":null,
          "type":0,
          "icon":"admin",
          "orderNum":2,
          "open":null,
          "list":[
              {
                  "menuId":259,
                  "parentId":31,
                  "parentName":null,
                  "name":"认证审核管理",
                  "url":"user/auth",
                  "perms":null,
                  "type":1,
                  "icon":"log",
                  "orderNum":0,
                  "open":null,
                  "list":null
              },
              {
                  "menuId":42,
                  "parentId":31,
                  "parentName":null,
                  "name":"客户列表",
                  "url":"user/user",
                  "perms":null,
                  "type":1,
                  "icon":"log",
                  "orderNum":0,
                  "open":null,
                  "list":null
              },
              {
                  "menuId":88,
                  "parentId":31,
                  "parentName":null,
                  "name":"设置",
                  "url":"user/selfsetting",
                  "perms":null,
                  "type":1,
                  "icon":"log",
                  "orderNum":0,
                  "open":null,
                  "list":null
              }
          ]
      },
      {
          "menuId":59,
          "parentId":0,
          "parentName":null,
          "name":"财务管理",
          "url":null,
          "perms":null,
          "type":0,
          "icon":"tubiao",
          "orderNum":3,
          "open":null,
          "list":[
              {
                  "menuId":91,
                  "parentId":59,
                  "parentName":null,
                  "name":"我的充值记录",
                  "url":"finance/myrecharge",
                  "perms":null,
                  "type":1,
                  "icon":"tubiao",
                  "orderNum":1,
                  "open":null,
                  "list":null
              },
              {
                  "menuId":92,
                  "parentId":59,
                  "parentName":null,
                  "name":"客户充值记录",
                  "url":"finance/userrecharge",
                  "perms":null,
                  "type":1,
                  "icon":"tubiao",
                  "orderNum":2,
                  "open":null,
                  "list":null
              },
              {
                  "menuId":61,
                  "parentId":59,
                  "parentName":null,
                  "name":"客户退款记录",
                  "url":"finance/userrefund",
                  "perms":null,
                  "type":1,
                  "icon":"tubiao",
                  "orderNum":3,
                  "open":null,
                  "list":null
              },
              {
                  "menuId":62,
                  "parentId":59,
                  "parentName":null,
                  "name":"客户消耗记录",
                  "url":"finance/userconsume",
                  "perms":null,
                  "type":1,
                  "icon":"tubiao",
                  "orderNum":4,
                  "open":null,
                  "list":null
              }
          ]
      },
      {
          "menuId":189,
          "parentId":0,
          "parentName":null,
          "name":"新闻管理",
          "url":"",
          "perms":null,
          "type":0,
          "icon":"duanxin",
          "orderNum":4,
          "open":null,
          "list":[
              {
                  "menuId":191,
                  "parentId":189,
                  "parentName":null,
                  "name":"我的新闻列表",
                  "url":"news/my/list",
                  "perms":null,
                  "type":1,
                  "icon":"menu",
                  "orderNum":2,
                  "open":null,
                  "list":null
              }
          ]
      },
      {
          "menuId":205,
          "parentId":0,
          "parentName":null,
          "name":"消息管理",
          "url":"",
          "perms":null,
          "type":0,
          "icon":"duanxin",
          "orderNum":4,
          "open":null,
          "list":[
              {
                  "menuId":207,
                  "parentId":205,
                  "parentName":null,
                  "name":"我的消息列表",
                  "url":"message/my/list",
                  "perms":null,
                  "type":1,
                  "icon":"menu",
                  "orderNum":2,
                  "open":null,
                  "list":null
              }
          ]
      },
      {
          "menuId":225,
          "parentId":0,
          "parentName":null,
          "name":"产品管理",
          "url":"product/audit",
          "perms":null,
          "type":0,
          "icon":"menu",
          "orderNum":7,
          "open":null,
          "list":[
              {
                  "menuId":226,
                  "parentId":225,
                  "parentName":null,
                  "name":"产品线管理",
                  "url":"proManage/prolinemanage",
                  "perms":null,
                  "type":1,
                  "icon":"zhedie",
                  "orderNum":1,
                  "open":null,
                  "list":null
              },
              {
                  "menuId":227,
                  "parentId":225,
                  "parentName":null,
                  "name":"产品详情管理",
                  "url":"proManage/prodetailmanage",
                  "perms":null,
                  "type":1,
                  "icon":"zhedie",
                  "orderNum":2,
                  "open":null,
                  "list":null
              },
              {
                  "menuId":228,
                  "parentId":225,
                  "parentName":null,
                  "name":"常见问题管理",
                  "url":"proManage/quesemanage",
                  "perms":"productFaq:my:list",
                  "type":1,
                  "icon":"zhedie",
                  "orderNum":3,
                  "open":null,
                  "list":null
              }
          ]
      },
      {
          "menuId":1,
          "parentId":0,
          "parentName":null,
          "name":"系统管理",
          "url":null,
          "perms":null,
          "type":0,
          "icon":"system",
          "orderNum":9,
          "open":null,
          "list":[
              {
                  "menuId":65,
                  "parentId":1,
                  "parentName":null,
                  "name":"账号管理",
                  "url":"sys/agentaccount",
                  "perms":null,
                  "type":1,
                  "icon":"admin",
                  "orderNum":8,
                  "open":null,
                  "list":null
              },
              {
                  "menuId":217,
                  "parentId":1,
                  "parentName":null,
                  "name":"修改密码",
                  "url":"sys/editPwd",
                  "perms":null,
                  "type":1,
                  "icon":"jiesuo",
                  "orderNum":11,
                  "open":null,
                  "list":null
              }
          ]
      }
  ],
  "code":0,
  "permissions":[
      "open:agent:set:updateBasicInfo",
      "user:product:list",
      "user:line:findNameList",
      "productFaq:my:update",
      "productFaq:my:updateFaqOrder",
      "open:agent:set:findCustService",
      "finance:user:refund:list:export",
      "message:my:list",
      "open:agent:cust:getPackageInfoById",
      "open:agent:fund:findOrderStatus",
      "open:agent:set:updateAlipay",
      "user:product:updateOrder",
      "productFaq:my:delete",
      "user:line:updateStatus",
      "finance:user:consume:list:export",
      "open:agent:user:changeAgent",
      "open:agent:set:updateContract",
      "open:agent:set:findWxLogin",
      "open:agent:set:updateWeixinpay",
      "message:my:detail",
      "user:product:reorder",
      "open:agent:desk:updateAgentPackage",
      "open:agent:cust:getCustInfo",
      "open:agent:sms:sendVerifyCode",
      "open:agent:set:findDomainInfo",
      "open:agent:set:updateDomainInfo",
      "open:agent:fund:recharge",
      "open:agent:set:findBasicInfo",
      "open:agent:desk:updateWarnNumber",
      "open:agent:desk:findAgentPackage",
      "user:indv:info",
      "user:product:findById",
      "user:auth:info:update",
      "user:user:info:list:export",
      "message:my:save",
      "user:line:updateOrder",
      "agent:order:recharge:record",
      "open:agent:desk:getAgentDeskInfo",
      "message:my:delete",
      "productFaq:my:list",
      "user:user:info:list",
      "open:agent:cust:getPackageInfo",
      "open:agent:set:updateWxLogin",
      "news:my:save",
      "open:agent:set:updateCustService",
      "sys:agentSysUser:list",
      "sys:agentSysUser:update",
      "news:my:delete",
      "sys:agentSysUser:delete",
      "user:line:saveOrUpdate",
      "open:agent:cust:refunds",
      "productFaq:my:save",
      "open:agent:set:findContract",
      "user:auth:info:list",
      "open:agent:set:findWeixinpay",
      "finance:my:recharge:list",
      "user:line:list",
      "finance:my:recharge:list:export",
      "news:my:update",
      "sys:agentSysUser:save",
      "user:line:findById",
      "news:my:list",
      "open:agent:desk:updateAutoPresentCfg",
      "user:product:updateStatus",
      "user:product:saveOrUpdate",
      "sys:agentSysUser:list:export",
      "productFaq:my:detail",
      "open:agent:desk:updateMail",
      "open:agent:sms:updateMobile",
      "news:my:detail",
      "message:my:update",
      "productFaq:my:againOrder",
      "open:agent:cust:recharge",
      "open:agent:sms:checkMobile",
      "finance:user:refund:list",
      "user:co:info",
      "user:line:reorder",
      "finance:user:recharge:list",
      "open:agent:desk:findMobile",
      "finance:user:consume:list",
      "user:account:presentNum",
      "open:agent:set:findAlipay"
  ]
}

// 获取导航菜单列表 / 权限
export function nav () {
  console.log(adminNav, agentNav);
  return {
    // isOpen: false,
    url: '/sys/menu/nav',
    type: 'get',
    data: adminNav
  }
}

// 获取菜单列表
export function list () {
  return {
    isOpen: false,
    url: '/sys/menu/list',
    type: 'get',
    data: [{
      'menuId': 1,
      'parentId': 0,
      'parentName': null,
      'name': '系统管理',
      'url': null,
      'perms': null,
      'type': 0,
      'icon': 'fa fa-cog',
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 2,
      'parentId': 1,
      'parentName': '系统管理',
      'name': '管理员列表',
      'url': 'modules/sys/user.html',
      'perms': null,
      'type': 1,
      'icon': 'fa fa-user',
      'orderNum': 1,
      'open': null,
      'list': null
    },
    {
      'menuId': 3,
      'parentId': 1,
      'parentName': '系统管理',
      'name': '角色管理',
      'url': 'modules/sys/role.html',
      'perms': null,
      'type': 1,
      'icon': 'fa fa-user-secret',
      'orderNum': 2,
      'open': null,
      'list': null
    },
    {
      'menuId': 4,
      'parentId': 1,
      'parentName': '系统管理',
      'name': '菜单管理',
      'url': 'modules/sys/menu.html',
      'perms': null,
      'type': 1,
      'icon': 'fa fa-th-list',
      'orderNum': 3,
      'open': null,
      'list': null
    },
    {
      'menuId': 5,
      'parentId': 1,
      'parentName': '系统管理',
      'name': 'SQL监控',
      'url': 'druid/sql.html',
      'perms': null,
      'type': 1,
      'icon': 'fa fa-bug',
      'orderNum': 4,
      'open': null,
      'list': null
    },
    {
      'menuId': 6,
      'parentId': 1,
      'parentName': '系统管理',
      'name': '定时任务',
      'url': 'modules/job/schedule.html',
      'perms': null,
      'type': 1,
      'icon': 'fa fa-tasks',
      'orderNum': 5,
      'open': null,
      'list': null
    },
    {
      'menuId': 7,
      'parentId': 6,
      'parentName': '定时任务',
      'name': '查看',
      'url': null,
      'perms': 'sys:schedule:list,sys:schedule:info',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 8,
      'parentId': 6,
      'parentName': '定时任务',
      'name': '新增',
      'url': null,
      'perms': 'sys:schedule:save',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 9,
      'parentId': 6,
      'parentName': '定时任务',
      'name': '修改',
      'url': null,
      'perms': 'sys:schedule:update',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 10,
      'parentId': 6,
      'parentName': '定时任务',
      'name': '删除',
      'url': null,
      'perms': 'sys:schedule:delete',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 11,
      'parentId': 6,
      'parentName': '定时任务',
      'name': '暂停',
      'url': null,
      'perms': 'sys:schedule:pause',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 12,
      'parentId': 6,
      'parentName': '定时任务',
      'name': '恢复',
      'url': null,
      'perms': 'sys:schedule:resume',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 13,
      'parentId': 6,
      'parentName': '定时任务',
      'name': '立即执行',
      'url': null,
      'perms': 'sys:schedule:run',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 14,
      'parentId': 6,
      'parentName': '定时任务',
      'name': '日志列表',
      'url': null,
      'perms': 'sys:schedule:log',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 15,
      'parentId': 2,
      'parentName': '管理员列表',
      'name': '查看',
      'url': null,
      'perms': 'sys:user:list,sys:user:info',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 16,
      'parentId': 2,
      'parentName': '管理员列表',
      'name': '新增',
      'url': null,
      'perms': 'sys:user:save,sys:role:select',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 17,
      'parentId': 2,
      'parentName': '管理员列表',
      'name': '修改',
      'url': null,
      'perms': 'sys:user:update,sys:role:select',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 18,
      'parentId': 2,
      'parentName': '管理员列表',
      'name': '删除',
      'url': null,
      'perms': 'sys:user:delete',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 19,
      'parentId': 3,
      'parentName': '角色管理',
      'name': '查看',
      'url': null,
      'perms': 'sys:role:list,sys:role:info',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 20,
      'parentId': 3,
      'parentName': '角色管理',
      'name': '新增',
      'url': null,
      'perms': 'sys:role:save,sys:menu:list',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 21,
      'parentId': 3,
      'parentName': '角色管理',
      'name': '修改',
      'url': null,
      'perms': 'sys:role:update,sys:menu:list',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 22,
      'parentId': 3,
      'parentName': '角色管理',
      'name': '删除',
      'url': null,
      'perms': 'sys:role:delete',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 23,
      'parentId': 4,
      'parentName': '菜单管理',
      'name': '查看',
      'url': null,
      'perms': 'sys:menu:list,sys:menu:info',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 24,
      'parentId': 4,
      'parentName': '菜单管理',
      'name': '新增',
      'url': null,
      'perms': 'sys:menu:save,sys:menu:select',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 25,
      'parentId': 4,
      'parentName': '菜单管理',
      'name': '修改',
      'url': null,
      'perms': 'sys:menu:update,sys:menu:select',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 26,
      'parentId': 4,
      'parentName': '菜单管理',
      'name': '删除',
      'url': null,
      'perms': 'sys:menu:delete',
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 27,
      'parentId': 1,
      'parentName': '系统管理',
      'name': '参数管理',
      'url': 'modules/sys/config.html',
      'perms': 'sys:config:list,sys:config:info,sys:config:save,sys:config:update,sys:config:delete',
      'type': 1,
      'icon': 'fa fa-sun-o',
      'orderNum': 6,
      'open': null,
      'list': null
    },
    {
      'menuId': 29,
      'parentId': 1,
      'parentName': '系统管理',
      'name': '系统日志',
      'url': 'modules/sys/log.html',
      'perms': 'sys:log:list',
      'type': 1,
      'icon': 'fa fa-file-text-o',
      'orderNum': 7,
      'open': null,
      'list': null
    },
    {
      'menuId': 30,
      'parentId': 1,
      'parentName': '系统管理',
      'name': '文件上传',
      'url': 'modules/oss/oss.html',
      'perms': 'sys:oss:all',
      'type': 1,
      'icon': 'fa fa-file-image-o',
      'orderNum': 6,
      'open': null,
      'list': null
    },
    {
      'menuId': 31,
      'parentId': 0,
      'parentName': null,
      'name': 'test',
      'url': null,
      'perms': null,
      'type': 0,
      'icon': null,
      'orderNum': 5,
      'open': null,
      'list': null
    },
    {
      'menuId': 46,
      'parentId': 2,
      'parentName': '管理员列表',
      'name': 'test',
      'url': null,
      'perms': null,
      'type': 2,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    },
    {
      'menuId': 47,
      'parentId': 1,
      'parentName': '系统管理',
      'name': 'test2',
      'url': '/test/test2.html',
      'perms': null,
      'type': 1,
      'icon': null,
      'orderNum': 0,
      'open': null,
      'list': null
    }]
  }
}

// 获取上级菜单
export function select () {
  return {
    isOpen: false,
    url: '/sys/menu/select',
    type: 'get',
    data: {}
  }
}

// 获取菜单信息
export function info (id) {
  return {
    isOpen: false,
    url: '/sys/menu/info' + (isInteger(id) ? `/${id}` : ''),
    type: 'get',
    data: {}
  }
}

// 添加菜单
export function add (params) {
  return {
    isOpen: false,
    url: '/sys/menu/save',
    type: 'post',
    data: {}
  }
}

// 修改菜单
export function update (params) {
  return {
    isOpen: false,
    url: '/sys/menu/update',
    type: 'post',
    data: {}
  }
}

// 删除菜单
export function del (id) {
  return {
    isOpen: false,
    url: '/sys/menu/delete' + (isInteger(id) ? `/${id}` : ''),
    type: 'post',
    data: {}
  }
}
