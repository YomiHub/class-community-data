const mysql = require('mysql');

exports.base = (sql, data, callBack) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootpass',
    database: 'classcommunity'
  });

  connection.connect();

  connection.query(sql, data, (error, results, fileds) => {
    if (error) throw error;
    callBack(results);
  });

  connection.end();
}