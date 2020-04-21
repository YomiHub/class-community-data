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
    let data = [upload.avatar_url,upload.id]
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: upload })
      } else {
        resolve({ status: 1, code: 500, message: '数据库更新失败' })
      }
    })
  })
}
