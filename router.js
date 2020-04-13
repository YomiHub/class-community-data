const express = require('express');
const router = express.Router();
const user = require('./services/user.js');

router.all('*', function (req, res, next) {
  //设置跨域访问
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Content-Type", "application/json;charset=utf-8");

  //axios发送post请求时，会先发送options请求，请求通过才会发送post
  if (req.method.toUpperCase() == "OPTIONS") {
    res.status(200).send('{"tip": "options ok"}');
    return;
  }
  next();
})

router.post('/addUser', user.addUser);

module.exports = router;