const user = require('../models/user.js')

//用户注册
exports.addUser = (req, res) => {
  var data = req.body;
  var result = user.addUser(data);
  res.json(result);
}