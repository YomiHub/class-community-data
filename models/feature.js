const db = require('../utils/connectDB.js')

//分页获取风采列表
/* 
  type:
    0：所有风采
    1或2：根据class_id获取列表 
    3 根据关键词获取列表
*/
exports.getList = (type, keyword, classId, pageindex, pagesize) => {
  return new Promise((resolve, reject) => {
    let sql =
      'select feature.id,feature.user_id,feature.class_id,feature.title,feature.brief,feature.likes,feature.clicks,feature.cover_img,feature.add_time,organization.name,(select count(*) from collect where collect.feature_id = feature.id) AS collect_count from feature,organization where organization.id=feature.class_id'
    let countSql = 'select count(*) as total from feature'
    let predata
    pageindex = parseInt(pageindex) || 1
    pagesize = parseInt(pagesize) || 2

    if (type === 0) {
      sql += ' order by id desc limit ?,?'
      predata = [(pageindex - 1) * pagesize, pagesize]
    } else if (type === 3) {
      sql +=
        " and feature.brief like '%" +
        keyword +
        "%' ESCAPE '' order by id desc limit ?,?"
      countSql += " where brief like '%" + keyword + "%' ESCAPE ''"
      predata = [(pageindex - 1) * pagesize, pagesize]
    } else {
      if (classId.length == 0) {
        reject({
          status: 0,
          code: 200,
          message: '没有创建或者加入的班级',
        })
      }
      sql += ' and feature.class_id=? order by id desc limit ?,?'
      countSql += ' where class_id=' + classId
      predata = [classId, (pageindex - 1) * pagesize, pagesize]
    }

    db.base(sql, predata, (preResult) => {
      db.base(countSql, null, (results) => {
        resolve({
          status: 0,
          code: 200,
          total: results[0].total,
          data: preResult,
        })
      })
    })
  })
}

exports.getHotList = () => {
  return new Promise((resolve, reject) => {
    //查询最近20条的前8点击数的feature
    let sql =
      'select * from (select * from (select * from (select id,title,likes,clicks from feature order by id desc) AS temp limit 0,20) AS temp1 order by clicks desc) AS temp2 limit 1,8'
    db.base(sql, null, (results) => {
      if (results.length != 0) {
        resolve({ status: 0, code: 200, data: results })
      } else {
        resolve({ status: 1, code: 400, message: '查询信息有误' })
      }
    })
  })
}

exports.upload = (data) => {
  return new Promise((resolve, reject) => {
    let sql = 'insert into feature set ?'
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: [] })
      } else {
        resolve({ status: 1, code: 500, message: '发表失败' })
      }
    })
  })
}
