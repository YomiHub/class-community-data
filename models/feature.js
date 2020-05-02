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
      'select feature.id,feature.user_id,feature.class_id,feature.title,feature.brief,feature.likes,feature.clicks,feature.cover_img,feature.add_time,organization.logo_url,organization.name,(select count(*) from collect where collect.feature_id = feature.id) AS collect_count from feature,organization where organization.id=feature.class_id'
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
        return
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
      'select * from (select * from (select * from (select id,title,likes,clicks from feature order by id desc) AS temp limit 0,20) AS temp1 order by clicks desc) AS temp2 limit 0,8'
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

exports.getDetail = (user_id, feature_id) => {
  return new Promise((resolve, reject) => {
    let sql =
      'select feature.id,feature.user_id,feature.class_id,feature.title,feature.brief,feature.content,feature.likes,feature.clicks,feature.cover_img,feature.add_time,organization.logo_url,organization.name,organization.logo_url,(select count(*) from collect where collect.feature_id = feature.id) AS collect_count,(select count(*) from collect where collect.feature_id = feature.id and collect.user_id=?) AS if_collect,(select count(*) from focus_relation where focus_relation.class_id = feature.class_id and focus_relation.user_id=? and focus_relation.power=0) AS if_focus,organization.brief AS class_brief from feature,organization where organization.id=feature.class_id and feature.id=?'
    db.base(sql, [user_id, user_id, feature_id], (results) => {
      if (results.length != 0) {
        let afterSql = 'update feature set clicks=clicks+1 where id=?'
        db.base(afterSql, [feature_id], (result) => {
          resolve({ status: 0, code: 200, data: results[0] })
        })
      } else {
        resolve({ status: 1, code: 400, message: '查询信息有误' })
      }
    })
  })
}

exports.getComment = (feature_id, pageindex, pagesize) => {
  return new Promise((resolve, reject) => {
    let preSql = 'select count(*) as total from comment where comment.feature_id=?'
    db.base(preSql, [feature_id], (preResult) => {
      let sql =
        'select comment.id,comment.comment_user,comment.comment_likes,comment.comment,comment.comment_time,user.avatar_url,user.user_name from comment,user where comment.feature_id=? and comment.comment_user=user.id order by id desc limit ?,?'
      pageindex = parseInt(pageindex) || 1
      pagesize = parseInt(pagesize) || 2
      db.base(
        sql,
        [feature_id, (pageindex - 1) * pagesize, pagesize],
        (results) => {
          resolve({
            status: 0,
            code: 200,
            total: preResult[0].total,
            data: results,
          })
        }
      )
    })
  })
}

exports.getReplyComment = (comment_id) => {
  return new Promise((resolve, reject) => {
    let sql =
      'select reply_comment.id,reply_comment.reply_user,reply_comment.reply_content,reply_comment.reply_likes,reply_comment.reply_time,reply_comment.reply_for_user,user.avatar_url,user.user_name from reply_comment,user where reply_comment.comment_id=? and reply_comment.reply_user=user.id'
    db.base(sql, [comment_id], (results) => {
      resolve({ status: 0, code: 200, data: results })
    })
  })
}

exports.sendComment = (data) => {
  return new Promise((resolve, reject) => {
    let preSql = 'insert into comment set ?'
    db.base(preSql, data, (results) => {
      if (results.affectedRows == 1) {
        let sql =
          'select comment.id,comment.comment_user,comment.comment_likes,comment.comment,comment.comment_time,user.avatar_url,user.user_name from comment,user where comment.feature_id=? and comment.comment_user=user.id  and comment.comment_user=? order by id desc limit 1'
        db.base(sql, [data.feature_id, data.comment_user], (results) => {
          if (results.length !== 0) {
            resolve({ status: 0, code: 200, data: results[0] })
          } else {
            resulve({ status: 1, code: 200, data: [] })
          }
        })
      } else {
        resolve({ status: 1, code: 500, message: '发表失败' })
      }
    })
  })
}

exports.sendCommentReply = (data) => {
  return new Promise((resolve, reject) => {
    let preSql = 'insert into reply_comment set ?'
    db.base(preSql, data, (results) => {
      if (results.affectedRows == 1) {
        let sql =
          'select reply_comment.id,reply_comment.reply_user,reply_comment.reply_content,reply_comment.reply_likes,reply_comment.reply_time,reply_comment.reply_for_user,user.avatar_url,user.user_name from reply_comment,user where reply_comment.comment_id=? and reply_comment.reply_user=user.id and reply_comment.reply_user=?'
        db.base(sql, [data.comment_id, data.reply_user], (results) => {
          if (results.length !== 0) {
            resolve({ status: 0, code: 200, data: results[0] })
          } else {
            resulve({ status: 1, code: 200, data: [] })
          }
        })
      } else {
        resolve({ status: 1, code: 500, message: '发表失败' })
      }
    })
  })
}

exports.addFeatureLike = (data) => {
  return new Promise((resolve, reject) => {
    let sql = 'update feature set likes=likes+1 where id=?'
    db.base(sql, [data.feature_id], (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: results })
      } else {
        resolve({ status: 1, code: 500, message: '点赞失败' })
      }
    })
  })
}

exports.addCollect = (data) => {
  return new Promise((resolve, reject) => {
    let preSql = 'insert into collect set ?'
    db.base(preSql, data, (results) => {
      if (results.affectedRows == 1) {
        let sql =
          'select count(*) as collect_total from collect where feature_id=?'
        db.base(sql, [data.feature_id], (result) => {
          console.log(result)
          if (result.length != 0) {
            resolve({
              status: 0,
              code: 200,
              data: { collect_total: result[0].collect_total },
            })
          } else {
            resolve({ status: 0, code: 200, message: '查询出错' })
          }
        })
      } else {
        resolve({ status: 1, code: 500, message: '收藏失败' })
      }
    })
  })
}

exports.deleteFeature = (user_id, feature_id) => {
  return new Promise((resolve, reject) => {
    let sql = 'delete from feature where id=? and user_id=?'
    db.base(sql, [feature_id, user_id], (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: results })
      } else {
        resolve({ status: 1, code: 500, message: '删除失败' })
      }
    })
  })
}

exports.deleteComment = (user_id, comment_id) => {
  return new Promise((resolve, reject) => {
    let sql = 'delete from comment where id=? and comment_user=?'
    db.base(sql, [comment_id, user_id], (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: results })
      } else {
        resolve({ status: 1, code: 500, message: '删除失败' })
      }
    })
  })
}

exports.supportComment = (data) => {
  return new Promise((resolve, reject) => {
    let sql = 'update comment set comment_likes=comment_likes+1 where id=?'
    db.base(sql, [data.comment_id], (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: results })
      } else {
        resolve({ status: 1, code: 500, message: '点赞失败' })
      }
    })
  })
}

exports.supportReply = (data) => {
  return new Promise((resolve, reject) => {
    let sql = 'update reply_comment set reply_likes=reply_likes+1 where id=?'
    db.base(sql, [data.reply_id], (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: results })
      } else {
        resolve({ status: 1, code: 500, message: '点赞失败' })
      }
    })
  })
}

exports.addFocus = (data) => {
  return new Promise((resolve, reject) => {
    let sql = 'insert into focus_relation set ?'
    db.base(sql, data, (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: results })
      } else {
        resolve({ status: 1, code: 500, message: '关注失败' })
      }
    })
  })
}

exports.removeFocus = (user_id, class_id) => {
  return new Promise((resolve, reject) => {
    let sql = 'delete from focus_relation where user_id=? and class_id=? and power=0'
    db.base(sql, [user_id, class_id], (results) => {
      if (results.affectedRows == 1) {
        resolve({ status: 0, code: 200, data: results })
      } else {
        resolve({ status: 1, code: 500, message: '取消失败' })
      }
    })
  })
}


exports.getClassList= (class_id, pageindex, pagesize) => {
  return new Promise((resolve, reject) => {
    let preSql = 'select count(*) as total from feature where feature.class_id=?'
    db.base(preSql, [class_id], (preResult) => {
      let sql =
        'select feature.id,feature.user_id,feature.class_id,feature.title,feature.brief,feature.likes,feature.clicks,feature.cover_img,feature.add_time,organization.logo_url,organization.name,(select count(*) from collect where collect.feature_id = feature.id) AS collect_count from feature,organization where organization.id=feature.class_id and feature.class_id=? order by feature.id desc limit ?,?'
      pageindex = parseInt(pageindex) || 1
      pagesize = parseInt(pagesize) || 2
      db.base(
        sql,
        [class_id, (pageindex - 1) * pagesize, pagesize],
        (results) => {
          resolve({
            status: 0,
            code: 200,
            total: preResult[0].total,
            data: results,
          })
        }
      )
    })
  })
}


exports.getCollectList= (user_id, pageindex, pagesize) => {
  return new Promise((resolve, reject) => {
    let preSql = 'select count(*) as total from collect where user_id=?'
    db.base(preSql, [user_id], (preResult) => {
      let sql =
        'select feature.id,feature.user_id,feature.class_id,feature.title,feature.brief,feature.likes,feature.clicks,feature.cover_img,feature.add_time,organization.logo_url,organization.name,(select count(*) from collect where collect.feature_id = feature.id) AS collect_count from feature,organization,collect where organization.id=feature.class_id and feature.id=collect.feature_id and collect.user_id=? order by collect.id desc limit ?,?'
      pageindex = parseInt(pageindex) || 1
      pagesize = parseInt(pagesize) || 2
      db.base(
        sql,
        [user_id, (pageindex - 1) * pagesize, pagesize],
        (results) => {
          resolve({
            status: 0,
            code: 200,
            total: preResult[0].total,
            data: results,
          })
        }
      )
    })
  })
}