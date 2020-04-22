const Jwt = require('jsonwebtoken')
const signkey = 'mes_qdhd_community_xhykjyxgs'

exports.setToken = function (username, userid) {
  return new Promise((resolve, reject) => {
    const token = Jwt.sign({
      name: username,
      _id: userid
    }, signkey, { expiresIn: '8h' })
    resolve(token)
  })
}

exports.verToken = function (token) {
  return new Promise((resolve, reject) => {
    var info = Jwt.verify(token.split(' ')[1], signkey)
    resolve(info)
  })
}