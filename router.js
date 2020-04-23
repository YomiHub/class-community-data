const express = require('express');
const router = express.Router();
const user = require('./services/user.js');
const feature = require('./services/feature.js');

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
module.exports = router;