const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const router = require('./router.js');

app.use('/www', express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }));//表示使用系统模块querystring来处理
app.use(bodyParser.json());
app.use(router);

app.listen(3000, () => {
  console.log('running');
})
