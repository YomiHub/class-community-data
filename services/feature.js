const fs = require('fs')
const path = require('path')
const multer = require('multer') //安装上传图片模块,multer会将文件的信息写到 req.file 上，如下代码所示。
const user = require('../models/user.js')
const feature = require('../models/feature.js')
const defaultStatic = 'http://localhost:3000/www'
const default_avater = defaultStatic + '/useravatar/avatar.webp' //默认头像

/*type,keyword,userid,pageindex,pagesize*/
exports.getList = async (req, res) => {
  var class_id='';
  var type = parseInt(req.query.type);
  try {
    if(type===2){
      var create = await user.getCreate(req.query.userid)
      if(create.status === 0&& create.data.length != 0){
        class_id = create.data[0].id;
      }
    }else if(type===1){
      var join = await user.getJoin(req.query.userid)
      if(join.status === 0&& join.data.length != 0){
        class_id = join.data[0].class_id
      }
    }
  } catch (error) {
    console.log(error)
  }
  
  
  feature.getList(type,req.query.keyword,class_id,req.query.pageindex,req.query.pagesize)
    .then((result) => {
      res.status(200).json(result)
    },(error)=>{
      res.status(200).json(error)
    })
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


