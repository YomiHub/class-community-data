const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const expressJWT = require('express-jwt')
const verifyToken = require('./utils/token.js')
const multer = require('multer')
const app = express()
const server = require('http').Server(app);
const io =require('socket.io')(server)

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
    path: ['/api/login', '/api/register'], //除了这些地址，其他的URL都需要验证
  })
)

//当token失效返回提示信息
app.use(function (err, req, res, next) {
  if (err.status == 401) {
    return res.status(401).send('{"code":401,"message": "token失效"}')
  }
})

app.use(router)

var onlineUser = {}
var onlineCount = 0

io.on('connect', (socket)=>{
  console.log('a user connected')
  //监听新用户加入
  socket.on('login', function (obj) {
    socket.name = obj.userid
    //检查用户在线列表
    if (!onlineUser.hasOwnProperty(obj.userid)) {
      onlineUser[obj.userid] = obj.user_name
      obj['type'] = 0;  //用户加入提示类型的消息
      //在线人数+1
      onlineCount++
      //广播消息
      io.emit('loginSucess', {
        onlineUser: onlineUser,
        onlineCount: onlineCount,
        user: obj,
      })
      // console.log(obj.user_name + '加入了聊天室')
    }
  })

  //监听用户退出
  socket.on('disconnect', function () {
    console.log('user disconnected')
    //将退出用户在在线列表删除
    if (onlineUser.hasOwnProperty(socket.name)) {
      //退出用户信息type=-1
      var obj = {type:-1, userid: socket.name, user_name: onlineUser[socket.name] }
      //删除
      delete onlineUser[socket.name]
      //在线人数-1
      onlineCount--
      //广播消息
      io.emit('logout', {
        onlineUser: onlineUser,
        onlineCount: onlineCount,
        user: obj,
      })
      // console.log(obj.user_name + '退出了聊天室')
    }
  })

  //监听用户发布聊天内容
  socket.on('message', function (obj) {
    //向所有客户端广播发布的消息
    io.emit('newMessage', obj)
    // console.log(obj.user_name + '说：' + obj.message)
  })
})

server.listen(3000, () => {
  console.log('running')
})
