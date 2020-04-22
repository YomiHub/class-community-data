### 班级网站——班桥 后台接口开发

#### 新建项目并初始化

- 新建文件夹 class-community-data，在文件夹下新建入口文件 index.js，然后执行命令`npm init -y`初始化
- 在项目目录下新建.gitignore 文件，忽视不需要上传 git 的目录和文件，执行`git init -y`

```
node_modules
.vscode
.idea
.git
```

- 在 github 创建远程仓库，执行以下命令，将本地仓库与远程仓库合并

```
git remote add origin https://***.git  //添加远程仓库 或者git@XX***.git
git branch hym   // 创建本地分支  git branch查看分支
git checkout hym  //切换到本地分支，默认是在master上

//git push origin hym  如果远程没有分支，则用该命令将hym 提交到远程仓库上面，新建一个该分支。
//git push origin hym:master  可以替代上述的新建分支命令
git branch --set-upstream-to=origin/hym hym  //origin/hym是远程分支，将本地分支与远程分支关联
git add .
git commit -m "初始化项目"
git push
```

- 分支同步主干代码，并将分支与合并到主干

```
#分支同步
(hym) git checkout master
(master) git pull origin master --allow-unrelated-histories  #拉取远程代码,第一次合并提交，合并两个独立启动仓库的历史
(master) git checkout hym
(hym) git merge master  #将远程主干代码合并到分支
(hym) git commit -m "解决冲突"

#修改代码后，合并分支到主干之前要先同步分支代码，然后执行以下操作
(hym) git pull  #拉取分支最新代码
(hym) git checkout master
(master) git merge hym --squash    #将分支代码合并到主干
(master) git commit -m ""
(master) git pull origin master
(master) git push origin master   #git push -u origin master  关联并push代码--set-upstream
```

#### 安装基本使用到的包

- `npm install express body-parser mysqljs/mysql jsonwebtoken express-jwt -S`
  + express-jwt内部引用了jsonwebtoken，对其封装使用。 在实际的项目中这两个都需要引用，他们两个的定位不一样。jsonwebtoken是用来生成token给客户端的，express-jwt是用来验证token的
  + unless 规则查看 https://github.com/jfromaniello/express-unless
- 创建文件夹 public 存放静态资源、models、sevices，以及路由文件 router.js
- 创建utils文件夹，文件connectDB.js用于连接数据库、token.js用于设置、校验token
- 安装multer，用于上传文件,`npm install multer -S`
- `npm i express-unless --save`

#### 创建数据库，以及数据表

- 这里使用 navicat 来创建，首先创建 classcommunity 数据库，编码为 utf8_bin
- 创建数据表，参考链接:https://www.processon.com/view/link/5e820a0de4b0069b2bbd9505

#### 创建触发器
- 对于organization表：执行insert时，触发：insert 记录到focus中，默认创建者关注班级，且权限最高位3，即管理者
- 对于organization表：执行update时，触发：删除原本创建者的记录，同时追加新创建者的记录（user_id以及权限值为3则为创建者）

#### 数据库字段描述
- 对于focus表：power值为0、1、2、3，分别表示关注者、加入者、管理者、创建者