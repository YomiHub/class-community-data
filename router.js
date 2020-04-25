const express = require('express');
const router = express.Router();
const user = require('./services/user.js');
const feature = require('./services/feature.js');
const organize = require('./services/organize.js');

router.all('*', function (req, res, next) {
  //设置跨域访问
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
  res.header("Content-Type", "application/json;charset=utf-8");
  // ("Content-Type","application/x-www-form-urlencoded");

  //axios发送post请求时，会先发送options请求，请求通过才会发送post
  if (req.method.toUpperCase() == "OPTIONS") {
    res.status(200).send('{"tip": "options ok"}');
    return;
  }
  next();
})

router.post('/api/register', user.addUser);
router.post('/api/login', user.userLogin);
router.post('/api/avater/upload', user.avaterUpload);
router.get('/api/userinfo/relation',user.getRelation);
router.post('/api/userinfo/update',user.updateInfo);
router.get('/api/userinfo/getinfo',user.getInfo);
router.post('/api/userinfo/removeclass',user.removeClass)

router.get('/api/feature/getlist',feature.getList)
router.get('/api/feature/gethotlist',feature.getHotList)
router.post('/api/feature/uploadimg',feature.uploadImg)
router.post('/api/feature/upload',feature.upload)


router.post('/api/class/joinclass',organize.joinClass)
router.post('/api/class/logoupload',organize.logoUpload)
router.post('/api/class/createclass',organize.createClass)
router.get('/api/class/getalbum',organize.getAlbum)
router.post('/api/class/createalbum',organize.createAlbum)
router.post('/api/class/photoupload',organize.photoupload)
router.get('/api/class/getphoto',organize.getPhoto)
router.delete('/api/class/delphoto',organize.delPhoto)

module.exports = router;