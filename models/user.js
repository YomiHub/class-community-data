const db = require('../utils/connectDB.js')

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
            resolve({ status: 0, data: data })
          } else {
            resolve({ status: 1,tip:'注册失败'})
          }
        })
      } else {
        resolve({ status: 1 ,tip:'用户已经注册'})
      }
    })
  })
}

//用户登录校验
exports.userLogin = (queryData) => {
  return new Promise((resolve, reject) => {
    let sql = 'select * from user where phone_num=? and user_pass=?'
    let data = [queryData.phone_num, queryData.user_pass]
    db.base(sql, data, (results) => {
      if (results.length != 0) {
        resolve({ status: 0, data: results[0] })
      } else {
        resolve({ status: 1,tip:'账号或密码错误' })
      }
    })
  })
}
