const fs = require('fs')
const path = require('path')
const multer = require('multer') //安装上传图片模块,multer会将文件的信息写到 req.file 上，如下代码所示。
const user = require('../models/user.js')
const feature = require('../models/feature.js')
const defaultStatic = 'http://localhost:3000/www'

/*type,keyword,userid,pageindex,pagesize*/
exports.getList = async (req, res) => {
  var class_id = ''
  var type = parseInt(req.query.type)
  try {
    if (type === 2) {
      var create = await user.getCreate(req.query.userid)
      if (create.status === 0 && create.data.length != 0) {
        class_id = create.data[0].id
      }
    } else if (type === 1) {
      var join = await user.getJoin(req.query.userid)
      if (join.status === 0 && join.data.length != 0) {
        class_id = join.data[0].class_id
      }
    }
  } catch (error) {
    console.log(error)
  }

  feature
    .getList(
      type,
      req.query.keyword,
      class_id,
      req.query.pageindex,
      req.query.pagesize
    )
    .then(
      (result) => {
        res.status(200).json(result)
      },
      (error) => {
        res.status(200).json(error)
      }
    )
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.getHotList = (req, res) => {
  feature
    .getHotList()
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.uploadImg = (req, res) => {
  var file = req.files[0]
  var img_name = Date.now() + '-' + file.originalname
  //设置上传图片的目录
  var des_file = path.join(__dirname, '../public/featureimg/' + img_name)
  //res.end(JSON.stringify(req.files)+JSON.stringify(req.body)); //测试
  fs.readFile(file.path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if (err) {
        res.status(200).json({ status: 1, code: 500, message: '上传失败' })
      } else {
        var imgurl = defaultStatic + '/featureimg/' + img_name
        res.status(200).json({ status: 0, code: 200, logo_url: imgurl })
      }
    })
  })
}

exports.upload = (req, res) => {
  var data = req.body
  var time = new Date()
  data['add_time'] = time.toUTCString()
  feature
    .upload(data)
    .then((result) => {
      res.status(200).json({ status: 1, code: 200, data:result })
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}
