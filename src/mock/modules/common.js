// 登录
export function login () {
  return {
    // isOpen: false,
    url: '/sys/login',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0,
      'expire': 43200,
      'token': '573a5cb08506e7ee35a3445ab3aff3da'
    }
  }
}

// 退出
export function logout () {
  return {
    // isOpen: false,
    url: '/sys/logout',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 登录
export function checkVrifyCode () {
  return {
    // isOpen: false,
    url: '/sys/checkVrifyCode',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0,
      'expire': 43200,
      'token': '573a5cb08506e7ee35a3445ab3aff3da',
      'isFirstLogin': false,
      'roleIdList': [1]
    }
  }
}

export function getCustomList () {
  return {
    // isOpen: false,
    url: 'agent/cust/custList',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'data': {
        list: [{
          user_phone: 'xxxxx',
          id: 1,
          custName: 'xxxx'
        }],
        total: 1
      }
    }
  }
}

export function getAgentList () {
  return {
    // isOpen: false,
    url: 'agent/agentInfo/list',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'data': {
        list: [{
          mchId: 1,
          companyName: 'xxxx'
        }],
        total: 1
      }
    }
  }
}
