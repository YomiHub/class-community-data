const db = require('../utils/connectDB.js');

//user表字段: id、avatar_url、user_num、user_pass、user_name、phone_num

//增加用户
exports.addUser = (data) => {
  let sql = 'insert into user set ?';
  db.base(sql, data, (results) => {
    if (results.affectedRows == 1) {
      return { status: 0, message: data };
    } else {
      return { status: 1 };
    }
  })
}