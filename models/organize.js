const db = require('../utils/connectDB.js')

exports.joinClass = (data) => {
  return new Promise((resolve, reject) => {
    let preSql = 'select * from organization where id=? and pass=?'
    db.base(preSql, [data.class_id, data.class_pass], (preResult) => {
      if (preResult.length != 0) {
        var setInfo = {
          user_id: data.user_id,
          class_id: data.class_id,
          identity: data.identity,
          power: 1,
          power_status: 1,
        }
        let sql = 'insert into focus_relation set ?'
        db.base(sql, setInfo, (results) => {
          if (results.affectedRows == 1) {
            resolve({ status: 0, code: 200, data: [] })
          } else {
            resolve({ status: 1, code: 500, message: '加入失败' })
          }
        })
      } else {
        resolve({ status: 1, code: 400, message: '班级ID或班级验证码错误' })
      }
    })
  })
}

exports.createClass = (data)=>{
  return new Promise((resolve,reject)=>{
    let sql = 'insert into organization set ?'
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: [] })
      } else {
        resolve({ status: 1, code: 500, message: '创建失败' })
      }
    })
  })
}