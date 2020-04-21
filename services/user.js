const fs = require('fs')
const path = require('path')
const multer = require('multer') //安装上传图片模块,multer会将文件的信息写到 req.file 上，如下代码所示。
const user = require('../models/user.js')
const verifyToken = require('../utils/token.js')
const defaultStatic = 'http://localhost:3000/www'
const default_avater = defaultStatic + '/useravatar/avatar.webp' //默认头像

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
  var result = await user.addUser(data)
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
      await verifyToken
        .setToken(result.data.phone_num, result.data.id)
        .then((token) => {
          result['token'] = token
        })
      res.status(200).json(result)
    } else {
      res.json(result)
    }
  } catch (e) {
    throw error
  }
}

//上传用户头像
/* 
data:{
  file:formData
  user_id:
} 
*/
exports.avaterUpload = (req, res) => {
  // let form = new multiparty.Form();
  // form.parse(req, function(err,fields,file){
  //   console.log(fields);
  //   console.log(file)
  // });

  var file = req.files[0]
  var { user_id } = req.body
  var img_name =  Date.now() + '-' + file.originalname
  //设置上传图片的目录
  var des_file = path.join(__dirname, '../public/useravatar/' + img_name)
  // res.end(JSON.stringify(req.files)+JSON.stringify(req.body)); 测试
  fs.readFile(file.path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if (err) {
        res.status(200).json({ status: 1, code: 500, message: '上传失败' })
      } else {
        var imgurl = defaultStatic + '/useravatar/' + img_name
        user
          .addAvater({ id: user_id, avatar_url: imgurl })
          .then(
            (result) => {
              res.status(200).json(result)
            }
            // (error) => {
            //   console.log(error)
            // }
          )
          .catch(function (err) {
            runtimeLog.error('[err]',err)
          })
      }
    })
  })
}
