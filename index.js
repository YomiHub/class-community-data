const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const expressJWT = require('express-jwt')
const verifyToken = require('./utils/token.js')
const multer = require('multer')
const app = express()

const router = require('./router.js')
app.use('/www', express.static(path.join(__dirname, './public')))
app.use(bodyParser.urlencoded({ extended: false })) //表示使用系统模块querystring来处理
app.use(bodyParser.json())
//app.use(multer({ dest: '/tmp/'}).array('image')); //设置文件上传临时目录；必须与表单的name名字相同，表单的上传图片的input的name必须是array后面的内容
let multerObj = multer({
  dest: './public/uploads/',
  filename: function (req, file, cb) {
    // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    cb(null, file.fieldname + '-' + Date.now())
  },
}) // 设置文件上传目录
app.use(multerObj.any())

// 解析token获取用户信息
app.use(function (req, res, next) {
  //console.log(token)
  var token = req.headers['Authorization']
  if (token == undefined) {
    return next()
  } else {
    verifyToken
      .verToken(token)
      .then((data) => {
        req.data = data
        return next()
      })
      .catch((error) => {
        return next()
      })
  }
})

//验证token是否过期并规定哪些路由不用验证
app.use(
  '/api',
  expressJWT({
    secret: 'mes_qdhd_community_xhykjyxgs',
  }).unless({
    path: ['/api/login', '/api/register'],//除了这些地址，其他的URL都需要验证
  })
)

//当token失效返回提示信息
app.use(function (err, req, res, next) {
  if (err.status == 401) {
    return res.status(401).send('{"code":401,"message": "token失效"}')
  }
})

app.use(router)
app.listen(3000, () => {
  console.log('running')
})
