/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

// export function loadSource (path) {
//   let imgEle = new Image()
//   let newPath = '/map_engine_file/' + path
//   imgEle.onload = () => {
//     return path
//   }
//   return path
// }
/**
 * 格式化日期
 * @param {*} date
 */
export function formatDate (date) {
  let seperator1 = '-'
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  return year + seperator1 + month + seperator1 + strDate
}

/**
 * 计算文件大小
 * @param {*} size
 */
export function computeFileSize (size) {
  size = +size
  if (!size) {
    return '0KB'
  }
  let formatSize = (size / 1024).toFixed(2)
  formatSize = +formatSize
  if (formatSize < 1) {
    return '< 1KB'
  }
  return formatSize + 'KB'
}

/**
 * 从对象中分理出一个有指定字段组成的新对象
 * @param {*} object
 * @param {*} keys
 */
export function splitObj (object, keys) {
  let result = {}
  for (let key in object) {
    if (keys.includes(key)) {
      result[key] = object[key]
    }
  }
  return result
}
