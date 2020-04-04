### 班级网站——班桥 后台接口开发

#### 新建项目并初始化

- 新建文件夹 class-community-data，`npm init -y`初始化
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
//分支同步
(hym) git checkout master
(master) git pull
(master) git checkout hym
(hym) git merge master
(hym) git commit "解决冲突"

//修改代码后，合并分支到主干之前要先同步分支代码，然后执行以下操作
(hym) git commit
(hym) git checkout master
(master) git merge hym --squash
(master) git commit ""
(master) git push origin master
```
