const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const expressJWT = require('express-jwt');
const verifyToken = require('./utils/token.js')

const router = require('./router.js');

app.use('/www', express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }));//表示使用系统模块querystring来处理
app.use(bodyParser.json());
// 解析token获取用户信息
app.use(function(req, res, next) {
  var token = req.headers['Authorization'];
  if(token == undefined){
    return next();
  }else{
    verifyToken.verToken(token).then((data)=> {
      req.data = data;
      return next();
    }).catch((error)=>{
      return next();
    })
  }
});

//验证token是否过期并规定哪些路由不用验证
app.use(expressJWT({
  secret: 'mes_qdhd_community_xhykjyxgs'
}).unless({
  path: ['/login','/register']//除了这两个地址，其他的URL都需要验证
}));

//当token失效返回提示信息
app.use(function(err, req, res, next) {
  if (err.status == 401) {
    return res.status(401).send('{"tip": "token失效"}');
  }
});

app.use(router);
app.listen(3000, () => {
  console.log('running');
})
