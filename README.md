### 班级网站——班桥 后台接口开发

#### 新建项目并初始化

- 新建文件夹 class-community-data，在项目目录下新建.gitignore 文件，忽视不需要上传 git 的目录和文件，执行`git init -y`

```
node_modules
.vscode
.idea
.git
```

- 在 github 创建远程仓库，执行以下命令，将本地仓库与远程仓库合并

```
git add .
git commit -m "初始化项目"
git remote add origin https://***.git  //添加远程仓库 或者git@XX***.git
git branch hym   // 创建本地分支
git checkout hym  //切换到本地分支，默认是在master上
git branch --set-upstream-to=origin/hym hym  //origin/hym是远程分支
```
