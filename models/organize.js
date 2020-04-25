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

exports.getAlbum = (class_id)=>{
  return new Promise((resolve, reject) => {
    let data = [class_id]
    let sql = 'select * from album where class_id=?'
    db.base(sql, data, (results) => {
        resolve({ status: 0, code: 200, data: results })
    })
  })
}

exports.createAlbum = (data)=>{
  return new Promise((resolve,reject)=>{
    let sql = 'insert into album set ?'
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        let aftersql = 'select id,album_name,class_id from album where class_id=? order by id desc limit 1'
        let afterdata = [data.class_id]
        db.base(aftersql, afterdata, (result) => {
          resolve({ status: 0, code: 200, data: result[0] })
        })
      } else {
        resolve({ status: 1, code: 500, message:"创建失败" })
      }
    })
  })
}

exports.addPhoto = (data)=>{
  return new Promise((resolve,reject)=>{
    let sql = 'insert into photos set ?'
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        let aftersql = 'select * from photos where album_id=? order by id desc limit 1'
        let afterdata = [data.album_id]
        db.base(aftersql, afterdata, (result) => {
          resolve({ status: 0, code: 200, data: result[0] })
        })
      } else {
        resolve({ status: 1, code: 500, message:"插入失败" })
      }
    })
  })
}


exports.getPhoto= (album_id)=>{
  return new Promise((resolve, reject) => {
    let data = [album_id]
    let sql = 'select * from photos where album_id=?'
    db.base(sql, data, (results) => {
        resolve({ status: 0, code: 200, data: results })
    })
  })
}

exports.delPhoto= (photo_id)=>{
  return new Promise((resolve, reject) => {
    let data = [photo_id]
    let sql = 'delete from photos where id=?'
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data:[]})
      } else {
        resolve({ status: 1, code: 500, message:"删除失败" })
      }
    })
  })
}