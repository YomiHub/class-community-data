const db = require('../utils/connectDB.js')
const CryptoJS = require('crypto-js')
const Secret = 'community_pass123'
//user表字段: id、avatar_url、user_num、user_pass、user_name、phone_num

//增加用户
exports.addUser = (data) => {
  return new Promise((resolve, reject) => {
    let preSql = 'select * from user where phone_num=?'
    db.base(preSql, [data.phone_num], (preResult) => {
      console.log(preResult)
      if (preResult.length === 0) {
        let sql = 'insert into user set ?'
        db.base(sql, data, (results) => {
          if (results.affectedRows == 1) {
            resolve({ status: 0, code: 200, data: [] })
          } else {
            resolve({ status: 1, code: 500, message: '注册失败' })
          }
        })
      } else {
        resolve({ status: 1, code: 400, message: '用户已经注册' })
      }
    })
  })
}

//用户登录校验
exports.userLogin = (queryData) => {
  return new Promise((resolve, reject) => {
    let sql = 'select * from user where phone_num=?'
    let data = [queryData['phone_num']]
    let loginPass = CryptoJS.AES.decrypt(
      queryData['user_pass'],
      Secret
    ).toString(CryptoJS.enc.Utf8)
    db.base(sql, data, (results) => {
      if (results.length != 0) {
        let realPass = CryptoJS.AES.decrypt(
          results[0]['user_pass'],
          Secret
        ).toString(CryptoJS.enc.Utf8)
        if (loginPass === realPass) {
          resolve({ status: 0, code: 200, data: results[0] })
        } else {
          resolve({ status: 1, code: 400, message: '密码错误' })
        }
      } else {
        resolve({ status: 1, code: 400, message: '账号错误' })
      }
    })
  })
}

//更新头像
exports.addAvater = (upload) => {
  return new Promise((resolve, reject) => {
    let sql = 'update user set avatar_url=? where id=?'
    let data = [upload.avatar_url, upload.id]
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: upload })
      } else {
        resolve({ status: 1, code: 500, message: '数据库更新失败' })
      }
    })
  })
}

//获取加入、创建的组织
exports.getCreate = (user_id) => {
  return new Promise((resolve, reject) => {
    let data = [user_id]
    let sql = 'select id,name from organization where user_id = ?'
    db.base(sql, data, (results) => {
      if (results.length != 0) {
        resolve({ status: 0, code: 200, data: results })
      } else {
        resolve({ status: 0, code: 200, data: [] })
      }
    })
  })
}

exports.getJoin = (user_id) => {
  return new Promise((resolve, reject) => {
    let data = [user_id]
    let sql =
      'select focus_relation.class_id,organization.name,focus_relation.power from focus_relation,organization where focus_relation.class_id=organization.id and focus_relation.user_id=? and (focus_relation.power=1 or focus_relation.power=2)'
    db.base(sql, data, (results) => {
      if (results.length != 0) {
        resolve({ status: 0, code: 200, data: results })
      } else {
        resolve({ status: 0, code: 200, data: [] })
      }
    })
  })
}

//设置个人实名信息
exports.updateInfo = (info) => {
  return new Promise((resolve, reject) => {
    let data = [info.user_name, info.user_num, info.user_phone, info.id]
    let sql = 'update user set user_name=?,user_num=?,user_phone=? where id=?'
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: [] })
      } else {
        resolve({ status: 1, code: 500, message: '更新失败' })
      }
    })
  })
}

//查询个人实名信息
exports.getInfo = (id) => {
  return new Promise((resolve, reject) => {
    let data = [id]
    let sql = 'select user_name,user_num,user_phone from user where id=?'
    db.base(sql, data, (results) => {
      if (results.length != 0) {
        resolve({ status: 0, code: 200, data: results[0] })
      } else {
        resolve({ status: 1, code: 400, message: '查询信息有误' })
      }
    })
  })
}

// 验证用户ID是否与密码匹配
exports.verifyInfo = (queryData) => {
  return new Promise((resolve, reject) => {
    let sql = 'select * from user where id=?'
    let data = [queryData['id']]
    let loginPass = CryptoJS.AES.decrypt(
      queryData['user_pass'],
      Secret
    ).toString(CryptoJS.enc.Utf8)
    db.base(sql, data, (results) => {
      if (results.length != 0) {
        let realPass = CryptoJS.AES.decrypt(
          results[0]['user_pass'],
          Secret
        ).toString(CryptoJS.enc.Utf8)
        if (loginPass === realPass) {
          resolve({ status: 0, code: 200, data:[] })
        } else {
          resolve({ status: 1, code: 400, message: '密码错误' })
        }
      } else {
        resolve({ status: 1, code: 400, message: '账号错误' })
      }
    })
  })
}

//转让班级
exports.removeClass = (queryData) => {
  return new Promise((resolve, reject) => {
    let sql = 'select * from user where id=?'
    let data = [queryData['other_id']]
    db.base(sql, data, (results) => {
      if (results.length != 0) {
        let nextsql = 'update organization set user_id=? where user_id=?'
        let nextdata = [queryData['other_id'], queryData['id']]
        db.base(nextsql, nextdata, (nextresults) => {
          console.log(nextresults)
          if (nextresults.affectedRows == 1) {
            resolve({ status: 0, code: 200, message: '转让成功' })
          } else {
            resolve({ status: 1, code: 500, message: '数据库更新失败' })
          }
        })
      } else {
        resolve({ status: 1, code: 400, message: '账号错误' })
      }
    })
  })
}

//查询管理权限
exports.getPower = (class_id,user_id) => {
  return new Promise((resolve, reject) => {
    let data = [class_id,user_id]
    let sql = 'select * from focus_relation where class_id=? and user_id=? and (power=2 or power=3)'
    db.base(sql, data, (results) => {
      if (results.length != 0) {
        resolve({ status: 0, code: 200, data: {hasPower:true,power:results[0].power} })
      } else {
        resolve({ status: 1, code: 400, message: '没有管理权限' })
      }
    })
  })
}


exports.getApplyStatus = (id,class_id) => {
  return new Promise((resolve, reject) => {
    let data = [id,class_id]
    let sql = 'select power,power_status from focus_relation where user_id=? and class_id=? and power_status=1'
    db.base(sql, data, (results) => {
      resolve({ status: 0, code: 200, data: results })
    })
  })
}


exports.sendApply = (data) => {
  return new Promise((resolve, reject) => {
    let sql = 'update focus_relation set power_status=1 where user_id=? and class_id=? and power=1'
    db.base(sql, [data.user_id,data.class_id], (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: results })
      } else {
        resolve({ status: 1, code: 500, message: '申请授权失败' })
      }
    })
  })
}