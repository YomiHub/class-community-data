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
  try {
    var result = await user.addUser(data)
    res.status(200).json(result)
  } catch (e) {
    console.error('[err]', e)
  }
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
    console.error('[err]', e)
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
  var img_name = Date.now() + '-' + file.originalname
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
          .then((result) => {
            res.status(200).json(result)
          })
          .catch(function (err) {
            console.error('[err]', err)
          })
      }
    })
  })
}

//查询用户创建、加入的组织
/* 
data:{
  id
} 
*/
exports.getRelation = async (req, res) => {
  var user_id = req.query.id
  var create = await user.getCreate(user_id)
  var join = await user.getJoin(user_id)
  var result = {
    ifCreate: false,
    create_class: '',
    create_classname: '',
    ifJoin: false,
    join_class: '',
    join_classname: '',
    join_power: 1,
  }
  if (create.data && create.data.length != 0) {
    result['ifCreate'] = true
    result['create_class'] = create.data[0].id
    result['create_classname'] = create.data[0].name
  }
  if (join.data && join.data.length != 0) {
    result['ifJoin'] = true
    result['join_class'] = join.data[0].class_id
    result['join_classname'] = join.data[0].name
    result['join_power'] = join.data[0].power
  }
  res.status(200).json({ status: 0, code: 200, data: result })
}

exports.updateInfo = async (req, res) => {
  var data = req.body
  try {
    var result = await user.updateInfo(data)
    res.status(200).json(result)
  } catch (e) {
    console.error('[err]', e)
  }
}

exports.getInfo = (req, res) => {
  user
    .getInfo(req.query.id)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.removeClass = (req, res) => {
  var data = req.body
  user
    .verifyInfo(data)
    .then((result) => {
      if (result.status === 0) {
        user.removeClass(data).then((nextResult) => {
          if (nextResult.status === 0) {
            res
              .status(200)
              .json({ status: 0, code: result.code, data:[] })
          } else {
            res.status(200).json({
              status: 1,
              code: nextResult.code,
              message: nextResult.message,
            })
          }
        })
      } else {
        res
          .status(200)
          .json({ status: 1, code: result.code, message: result.message })
      }
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}


exports.getApplyStatus= (req, res) => {
  user
    .getApplyStatus(req.query.user_id,req.query.class_id)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.sendApply = (req,res)=>{
  user
    .sendApply(req.body)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}
