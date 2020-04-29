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

exports.createClass = (data) => {
  return new Promise((resolve, reject) => {
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

exports.getAlbum = (class_id) => {
  return new Promise((resolve, reject) => {
    let data = [class_id]
    let sql = 'select * from album where class_id=?'
    db.base(sql, data, (results) => {
      resolve({ status: 0, code: 200, data: results })
    })
  })
}

exports.createAlbum = (data) => {
  return new Promise((resolve, reject) => {
    let sql = 'insert into album set ?'
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        let aftersql =
          'select id,album_name,class_id from album where class_id=? order by id desc limit 1'
        let afterdata = [data.class_id]
        db.base(aftersql, afterdata, (result) => {
          resolve({ status: 0, code: 200, data: result[0] })
        })
      } else {
        resolve({ status: 1, code: 500, message: '创建失败' })
      }
    })
  })
}

exports.addPhoto = (data) => {
  return new Promise((resolve, reject) => {
    let sql = 'insert into photos set ?'
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        let aftersql =
          'select * from photos where album_id=? order by id desc limit 1'
        let afterdata = [data.album_id]
        db.base(aftersql, afterdata, (result) => {
          resolve({ status: 0, code: 200, data: result[0] })
        })
      } else {
        resolve({ status: 1, code: 500, message: '插入失败' })
      }
    })
  })
}

exports.getPhoto = (album_id) => {
  return new Promise((resolve, reject) => {
    let data = [album_id]
    let sql = 'select * from photos where album_id=?'
    db.base(sql, data, (results) => {
      resolve({ status: 0, code: 200, data: results })
    })
  })
}

exports.delPhoto = (photo_id) => {
  return new Promise((resolve, reject) => {
    let data = [photo_id]
    let sql = 'delete from photos where id=?'
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: [] })
      } else {
        resolve({ status: 1, code: 500, message: '删除失败' })
      }
    })
  })
}

exports.getRecentNotice = (user_id, class_id) => {
  return new Promise((resolve, reject) => {
    let sql = 'select user.user_name,notice.id,notice.user_id,notice.class_id,notice.title,notice.content,notice.notice_file,notice.add_time,notice.unread,(select count(*) from focus_relation where focus_relation.user_id=? and focus_relation.class_id=? and (power=2 or power=3)) AS can_push from notice,user where notice.user_id=user.id and class_id=? order by id desc limit 1'
    db.base(sql, [user_id, class_id,class_id], (results) => {
      resolve({ status: 0, code: 200, data: results[0] })
    })
  })
}

exports.getNoticeList = (user_id, class_id, pageindex, pagesize) => {
  pageindex = parseInt(pageindex) || 1
  pagesize = parseInt(pagesize) || 2
  return new Promise((resolve, reject) => {
    let countSql = 'select count(*) as total from notice where class_id=?'
    let sql = 'select user.user_name,notice.id,notice.user_id,notice.class_id,notice.title,notice.content,notice.notice_file,notice.add_time,notice.unread from notice,user where notice.user_id=user.id and class_id=? order by id desc limit ?,?'
    db.base(sql, [class_id,(pageindex - 1) * pagesize, pagesize], (results) => {
      db.base(countSql, [class_id], (result) => {
        resolve({
          status: 0,
          code: 200,
          total: result[0].total,
          data: results,
        })
      })
    })
  })
}

exports.getclassMember = (class_id) => {
  return new Promise((resolve, reject) => {
    let sql = 'select user.user_name from user,focus_relation where focus_relation.user_id=user.id and focus_relation.class_id=?'
    db.base(sql, [class_id], (results) => {
      resolve({ status: 0, code: 200, data: results })
    })
  })
}

exports.uploadNotice = (data) => {
  return new Promise((resolve, reject) => {
    let sql = 'insert into notice set ?'
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        let aftersql =
          'select * from notice where class_id=? order by id desc limit 1'
        let afterdata = [data.class_id]
        db.base(aftersql, afterdata, (result) => {
          resolve({ status: 0, code: 200, data: result[0] })
        })
      } else {
        resolve({ status: 1, code: 500, message: '插入失败' })
      }
    })
  })
}

exports.deleteNotice = (notice_id,user_id) => {
  return new Promise((resolve, reject) => {
    let data = [notice_id,user_id]
    let sql = 'delete from notice where id=? and user_id=?'
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: [] })
      } else {
        resolve({ status: 1, code: 500, message: '删除失败' })
      }
    })
  })
}

exports.readNotice = (data) => {
  return new Promise((resolve, reject) => {
    let sql = 'update notice set unread=? where id=?'
    db.base(sql, [data.notice_unread,data.notice_id], (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: results })
      } else {
        resolve({ status: 1, code: 500, message: '网络请求失败' })
      }
    })
  })
}

exports.getLeaveList = (class_id, pageindex, pagesize) => {
  pageindex = parseInt(pageindex) || 1
  pagesize = parseInt(pagesize) || 2
  return new Promise((resolve, reject) => {
    let countSql = 'select count(*) as total from leave_word where class_id=?'
    let sql = 'select user.user_name,user.avatar_url,leave_word.id,leave_word.user_id,leave_word.class_id,leave_word.content,leave_word.leave_file,leave_word.leave_time from leave_word,user where leave_word.user_id=user.id and leave_word.class_id=? order by leave_word.id desc limit ?,?'
    db.base(sql, [class_id,(pageindex - 1) * pagesize, pagesize], (results) => {
      db.base(countSql, [class_id], (result) => {
        resolve({
          status: 0,
          code: 200,
          total: result[0].total,
          data: results,
        })
      })
    })
  })
}

exports.getClassInfo = (class_id) => {
  return new Promise((resolve, reject) => {
    let data = [class_id]
    let sql = 'select logo_url,name,id from organization where id=?'
    db.base(sql, data, (results) => {
      resolve({ status: 0, code: 200, data: results[0] })
    })
  })
}

exports.uploadleave = (data) => {
  return new Promise((resolve, reject) => {
    let sql = 'insert into leave_word set ?'
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        let aftersql =
          'select user.user_name,user.avatar_url,leave_word.id,leave_word.user_id,leave_word.class_id,leave_word.content,leave_word.leave_file,leave_word.leave_time from leave_word,user where leave_word.user_id=user.id and leave_word.class_id=? and leave_word.user_id=? order by id desc limit 1'
        let afterdata = [data.class_id,data.user_id]
        db.base(aftersql, afterdata, (result) => {
          resolve({ status: 0, code: 200, data: result[0] })
        })
      } else {
        resolve({ status: 1, code: 500, message: '插入失败' })
      }
    })
  })
}

exports.deleteLeave = (leave_id,user_id) => {
  return new Promise((resolve, reject) => {
    let data = [leave_id,user_id]
    let sql = 'delete from leave_word where id=? and user_id=?'
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: [] })
      } else {
        resolve({ status: 1, code: 500, message: '删除失败' })
      }
    })
  })
}
