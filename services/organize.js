const fs = require('fs')
const path = require('path')
const multer = require('multer') //安装上传图片模块,multer会将文件的信息写到 req.file 上，如下代码所示。
const xlsx = require('node-xlsx')
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

/*
  {
    user_id:
    class_id
  }
*/
exports.getAlbum = (req, res) => {
  var results = {}
  user
    .getPower(req.query.class_id, req.query.user_id)
    .then((result) => {
      if (result.status === 0) {
        results['hasPower'] = result.data.hasPower
        results['power'] = result.data.power
      } else {
        results['hasPower'] = false
      }

      organize
        .getAlbum(req.query.class_id)
        .then((result) => {
          results['data'] = result.data
          results['status'] = result.status
          results['code'] = result.code
          res.status(200).json(results)
        })
        .catch(function (err) {
          console.error('[err]', err)
        })
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

/*
  {
    class_id:
    album_name
  }
*/
exports.createAlbum = (req, res) => {
  organize
    .createAlbum(req.body)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.getPhoto = (req, res) => {
  organize
    .getPhoto(req.query.album_id)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.photoupload = (req, res) => {
  var file = req.files[0]
  var album_id = req.body.album_id
  if (!file || album_id.length === 0) {
    res.status(400).json({ status: 1, code: 400, message: '请求信息有误' })
  }
  var img_name = Date.now() + '-' + file.originalname
  //设置上传图片的目录
  var des_file = path.join(__dirname, '../public/classphotos/' + img_name)
  //res.end(JSON.stringify(req.files)+JSON.stringify(req.body)); //测试
  fs.readFile(file.path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if (err) {
        res.status(200).json({ status: 1, code: 500, message: '上传失败' })
      } else {
        var imgurl = defaultStatic + '/classphotos/' + img_name
        organize
          .addPhoto({ album_id: album_id, photo_url: imgurl })
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

exports.delPhoto = (req, res) => {
  organize
    .delPhoto(req.query.photo_id)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.getRecentNotice = (req, res) => {
  organize
    .getRecentNotice(req.query.user_id, req.query.class_id)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.getNoticeList = (req, res) => {
  organize
    .getNoticeList(
      req.query.user_id,
      req.query.class_id,
      req.query.pageindex,
      req.query.pagesize
    )
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.uploadNoticeFile = (req, res) => {
  var file = req.files[0]
  if (!file) {
    res.status(200).json({ status: 0, code: 200, data: { url: null } })
  }
  var file_name = Date.now() + '-' + file.originalname
  //设置上传图片的目录
  var des_file = path.join(__dirname, '../public/noticefile/' + file_name)
  //res.end(JSON.stringify(req.files)+JSON.stringify(req.body)); //测试
  fs.readFile(file.path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if (err) {
        res.status(200).json({ status: 1, code: 500, message: '上传失败' })
      } else {
        var imgurl = defaultStatic + '/noticefile/' + file_name
        res.status(200).json({ status: 0, code: 200, data: { url: imgurl } })
      }
    })
  })
}

exports.uploadNotice = (req, res) => {
  var data = req.body
  organize.getclassMember(data.class_id).then((preResult) => {
    if (preResult.status === 0) {
      var unreadArr = []
      preResult.data.forEach((item) => {
        unreadArr.push(item.user_name)
      })
      data['unread'] = unreadArr.join(' ')
      organize
        .uploadNotice(data)
        .then((result) => {
          res.status(200).json(result)
        })
        .catch(function (err) {
          console.error('[err]', err)
        })
    } else {
      res.status(200).json({ status: 1, code: 500, message: '网络请求错误' })
    }
  })
}

exports.deleteNotice = (req, res) => {
  organize
    .deleteNotice(req.query.notice_id, req.query.user_id)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.readNotice = (req, res) => {
  organize
    .readNotice(req.body)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.getLeaveList = (req, res) => {
  organize
    .getLeaveList(req.query.class_id, req.query.pageindex, req.query.pagesize)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.getClassInfo = (req, res) => {
  organize
    .getClassInfo(req.query.class_id,req.query.user_id)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.uploadleaveFile = (req, res) => {
  var file = req.files[0]
  if (!file) {
    res.status(200).json({ status: 0, code: 200, data: { url: null } })
  }
  var file_name = Date.now() + '-' + file.originalname
  //设置上传图片的目录
  var des_file = path.join(__dirname, '../public/leavefile/' + file_name)
  //res.end(JSON.stringify(req.files)+JSON.stringify(req.body)); //测试
  fs.readFile(file.path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if (err) {
        res.status(200).json({ status: 1, code: 500, message: '上传失败' })
      } else {
        var imgurl = defaultStatic + '/leavefile/' + file_name
        res.status(200).json({ status: 0, code: 200, data: { url: imgurl } })
      }
    })
  })
}

exports.uploadleave = (req, res) => {
  var data = req.body
  organize
    .uploadleave(data)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.deleteLeave = (req, res) => {
  organize
    .deleteLeave(req.query.leave_id, req.query.user_id)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.getMember = (req, res) => {
  organize
    .getMember(req.query.class_id, req.query.user_id)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.deleteMember = (req, res) => {
  organize
    .deleteMember(req.query.class_id, req.query.user_id)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.getMemberExcel = (req, res) => {
  organize
    .getMember(req.query.class_id, req.query.user_id)
    .then((result) => {
      const conf = []
      var colName = ['学号', '姓名', '手机号']
      conf.push(colName) //第一行为列名

      //创建一个和表头对应且名称与数据库字段对应数据，便于循环取出数据
      let rows = ['id', 'user_num', 'user_name', 'user_phone']
      let data = result.data
      for (let i = 0; i < data.length; i++) {
        let row = [] //用来装载每次得到的数据
        //内循环取出每个字段的数据
        for (let j = 1; j < rows.length; j++) {
          if (data[i][rows[j]]) {
            row.push(data[i][rows[j]].toString())
          } else {
            row.push('')
          }
        }
        //将每一个{ }中的数据添加到承载中
        conf.push(row)
      }

      let buffer = xlsx.build([{ name: result.class_name, data: conf }])

      var file_name = Date.now() + '.xlsx'
      //设置上传图片的目录
      var des_file = path.join(__dirname, '../public/memberfile/' + file_name)
      // 写入文件
      fs.writeFile(des_file, buffer, { flag: 'w' }, (err) => {
        if (err) {
          res.status(200).json({ status: 1, code: 500, message: '下载失败' })
        } else {
          var fileurl = defaultStatic + '/memberfile/' + file_name
          res.status(200).json({ status: 0, code: 200, file_url: fileurl })
        }
      })
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.getApplyList = (req, res) => {
  organize
    .getApplyList(req.query.class_id)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.handlePower = (req,res)=>{
  organize
    .handlePower(req.body)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.removePower = (req,res)=>{
  organize
    .removePower(req.body)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

exports.classSupport = (req,res)=>{
  organize
    .classSupport(req.body)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(function (err) {
      console.error('[err]', err)
    })
}

