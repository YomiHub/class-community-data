const user = require('../models/user.js')
const verifyToken = require('../utils/token.js')
const default_avater = '/www/useravater/avater.webp' //默认头像

//用户注册
/* 
data:{
  phone_num:
  user_pass:
  user_name:
} 
*/
exports.addUser = async (req, res) => {
  var data = req.body
  data['avatar_url'] = default_avater
  var result = await user.addUser(data);
  res.status(200).json(result)
}

//用户登录
/* 
data:{
  phone_num:
  user_pass:
} 
*/
exports.userLogin = async (req, res) => {
  var data = req.body
  var result
  try {
    result = await user.userLogin(data)
    if (result.status === 0) {
      //生成token
      await verifyToken.setToken(result.data.phone_num, result.data.id).then((token) => {
        result['token'] = token
      })
      res.status(200).json(result)
    }else{
      res.json(result)
    }
  } catch (e) {
    throw error;
  }
}
