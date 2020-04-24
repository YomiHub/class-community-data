const fs = require('fs')
const path = require('path')
const multer = require('multer') //安装上传图片模块,multer会将文件的信息写到 req.file 上，如下代码所示。
const organize = require('../models/organize.js')
const user = require('../models/user.js')
const defaultStatic = 'http://localhost:3000/www'

/*
  {
    user_id:
    class_id:
    class_pass:
    identity:0为家长、1为学生、2为教师
  }
*/
exports.joinClass = (req, res) => {
  var data = req.body
  user
    .getJoin(data.user_id)
    .then((result) => {
      if (result.data.length === 0) {
        organize
          .joinClass(data)
          .then((result) => {
            res.status(200).json(result)
          })
          .catch(function (err) {
            console.error('[err]', err)
          })
      } else {
        res
          .status(200)
          .json({ status: 1, code: 400, message: '已经加入过班级' })
      }
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.logoUpload = (req, res) => {
  var file = req.files[0]
  var img_name = Date.now() + '-' + file.originalname
  //设置上传图片的目录
  var des_file = path.join(__dirname, '../public/classavatar/' + img_name)
  //res.end(JSON.stringify(req.files)+JSON.stringify(req.body)); //测试
  fs.readFile(file.path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if (err) {
        res.status(200).json({ status: 1, code: 500, message: '上传失败' })
      } else {
        var imgurl = defaultStatic + '/classavatar/' + img_name
        res.status(200).json({ status: 0, code: 200, logo_url: imgurl })
      }
    })
  })
}

/*
  {
    logo_url
    user_id:
    name:
    pass:
    brief:
  }
*/
exports.createClass = (req, res) => {
  var data = req.body
  user
    .getCreate(data.user_id)
    .then((result) => {
      if (result.data.length === 0) {
        organize
          .createClass(data)
          .then((result) => {
            res.status(200).json(result)
          })
          .catch(function (err) {
            console.error('[err]', err)
          })
      } else {
        res
          .status(200)
          .json({ status: 1, code: 400, message: '已经创建过班级' })
      }
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}
