title: 全栈开发实战：用Vue2+Koa1开发完整的前后端项目（更新Koa2）
tags: 
  - 前端
  - Nodejs
categories:
  - Web
  - 开发
  - Nodejs
date: 2017-05-03 14:09:00
---

## 简介

本文从一名新手的角度（默认对Vue有了解，对Koa或者Express有了解）出发，从0开始构建一个数据通过Koa提供API的形式获取，页面通过Vue渲染的完整的前端项目。可以了解到Vue构建单页面的一些知识以及前端路由的使用、Koa如何提供API接口，如何进行访问过滤（路由）、验证（JSON-WEB-TOKEN）以及Sequelize操作MySQL数据库的一些知识和技巧，希望能够作为一篇入门全栈开发的文章吧。

**更新**：文末给出的github仓库已经更新Koa2版本。请使用Node.js v7.6.0及以上版本体验~

<!-- more -->

## 写在前面

我曾经写过一篇[文章](https://molunerfinn.com/nodejs-2/)，是用express和mongodb入门Nodejs的前后端开发，这篇文章里简单的做了一个小demo，能够让你读写mongodb数据库，并且从数据库里将数据读取出来显示到页面上。算是一个简单的读写小demo吧，也算是服务端渲染的一次初尝试。并且我还写过用nodejs写简单小爬虫的[文章](https://molunerfinn.com/nodejs-1/)，用爬虫来获取数据写入数据库。通过以上的的方法我用express写了一个小网站，记录并显示北邮人论坛每天的十大的[内容](http://topten.piegg.cn)。挺好玩的对吧，可以把想要做的事用代码来实现。

后来我接触到了Koa，并开始了学习，从express迁移到Koa其实曲线还算是比较平滑的。不过用Koa的方式也还是采用服务端渲染页面的方式。而且我发现目前网络上少有写过用Koa构建的前后端分离的应用、网站文章，我最近做的一个项目里需要用到的方式就是用Vue构建页面，数据的获取全部走后端API的形式，也就是所谓的前后端分离吧。正好在这过程中走了不少的坑，包括数据库的使用上也算是个新手，所以写篇文章记录一下，用同样的思路和方法构建一个简单的Todolist，欢迎讨论，轻拍~

## 项目架构

```
.
├── LICENSE
├── README.md
├── .env  // 环境变量配置文件
├── app.js  // Koa入口文件
├── build // vue-cli 生成，用于webpack监听、构建
│   ├── build.js
│   ├── check-versions.js
│   ├── dev-client.js
│   ├── dev-server.js
│   ├── utils.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   └── webpack.prod.conf.js
├── config // vue-cli 生成&自己加的一些配置文件
│   ├── default.conf
│   ├── dev.env.js
│   ├── index.js
│   └── prod.env.js
├── dist // Vue build 后的文件夹
│   ├── index.html // 入口文件
│   └── static // 静态资源
├── index.html // vue-cli生成，用于容纳Vue组件的主html文件。单页应用就只有一个html
├── package.json // npm的依赖、项目信息文件
├── server // Koa后端，用于提供Api
│   ├── config // 配置文件夹
│   ├── controllers // controller-控制器
│   ├── models // model-模型
│   ├── routes // route-路由
│   └── schema // schema-数据库表结构
├── src // vue-cli 生成&自己添加的utils工具类
│   ├── App.vue // 主文件
│   ├── assets // 相关静态资源存放
│   ├── components // 单文件组件
│   ├── main.js // 引入Vue等资源、挂载Vue的入口js
│   └── utils // 工具文件夹-封装的可复用的方法、功能
└── yarn.lock // 用yarn自动生成的lock文件
```

看起来好像很复杂的样子，其实很大一部分文件夹的结构是`vue-cli`这个工具帮我们生成的。而我们需要额外添加的主要是Koa的入口文件以及一个`server`文件夹用于Koa提供API。这样的话，在获取数据的方面就可以走Koa所提供的API，而Vue只需关心怎么把这些数据渲染到页面上就好了。

## 项目用到的一些关键依赖

以下依赖的版本都是本文所写的时候的版本，或者更旧一些

- Vue.js(v2.1.8)
- Vue-Router(v2.1.1)
- Axios(v0.15.3)
- Element(v1.1.2)
- Koa.js(v1.2.4) // 没采用Koa2
- Koa-Router@5.4\Koa-jwt\Koa-static等一系列Koa中间件
- Mysql(v2.12.0) // nodejs的mysql驱动，并不是mysql本身版本（项目采用mysql5.6）
- Sequelize(v3.28.0) // 操作数据库的ORM
- Yarn(v0.18.1) // 比起npm更快一些

剩下依赖可以参考本文最后给出的项目demo仓库。

## 项目启动

Nodejs与npm的安装不再叙述（希望大家装上的node版本大于等于6.x，不然还需要加上--harmony标志才可以开启es6），默认读者已经掌握npm安装依赖的方法。首先全局安装`npm i vue-cli -g`，当然本项目基本上是采用`yarn`，所以也可以`yarn global add vue-cli`。

> Tips: 可以给yarn换上淘宝源，速度更快: `yarn config set registry "https://registry.npm.taobao.org"`

然后我们初始化一个`Vue2的webpack`的模板：

`vue init webpack demo`

> Tips: 上面的demo可以填写你自己的项目名称

然后进行一些基本配置选择之后，你就可以得到一个基本的`vue-cli`生成的项目结构。

接着我们进入`vue-cli`生成的目录，安装`Vue`的项目依赖并安装`Koa`的项目依赖：`yarn && yarn add koa koa-router@5.4 koa-logger koa-json koa-bodyparser`，（注意是安装`koa-router`的5.4版，因为7.X版本是支持Koa2的）然后进行一些基本目录建立：

在`vue-cli`生成的`demo`目录下，建立`server`文件夹以及子文件夹：

```
├── server // Koa后端，用于提供Api
    ├── config // 配置文件夹
    ├── controllers // controller-控制器
    ├── models // model-模型
    ├── routes // route-路由
    └── schema // schema-数据库表结构
```

然后在`demo`文件夹下我们创建一个`app.js`的文件，作为`Koa`的启动文件。

写入如下基本的内容就可以启动`Koa`啦：

```javascript
const app = require('koa')()
  , koa = require('koa-router')()
  , json = require('koa-json')
  , logger = require('koa-logger'); // 引入各种依赖

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(function* (next){
  let start = new Date;
  yield next;
  let ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms); // 显示执行的时间
});

app.on('error', function(err, ctx){
  console.log('server error', err);
});

app.listen(8889,() => {
  console.log('Koa is listening in 8889');
});

module.exports = app;
```

然后在控制台输入`node app.js`，能看到输出`Koa is listening in 8889`，则说明我们的`Koa`已经启动成功了，并在8889端口监听。

## 前端页面构建

这个DEMO是做一个Todo-List，我们首先来做一个登录页面。

> Tips: 为了方便构建页面和美观，本文采用的Vue2的前端UI框架是`element-ui`。安装：`yarn add element-ui`

模板引擎我习惯用`pug`，CSS预处理我习惯用`stylus`，当然每个人自己的习惯和喜好是不一样的，所以大家根据自己平时的喜好来就行了。

为了方便大家查看代码，就不用`pug`了，学习成本相对高一些。不过CSS用`stylus`写起来简便，看起来也不会难懂，是我自己的习惯，所以还需要安装一下`yarn add stylus stylus-loader`。

> Tips: 安装stylus-loader是为了让webpack能够渲染stylus

然后要把`element-ui`引入项目中。打开`src/main.js`，将文件改写如下：

```js
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui' // 引入element-ui
import 'element-ui/lib/theme-default/index.css'

Vue.use(ElementUI) // Vue全局使用

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
```
然后我们在项目根目录下输入`npm run dev`，启动开发模式，这个模式有webpack的热加载，也就是你写完代码，浏览器立即就能响应变化。

为了实现响应式页面，我们要在项目目录下的`index.html`的`head`标签内加入以下`meta`：

`<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">`


### 登录界面

进入`src/components`目录，新建一个`Login.vue`的文件。然后我们来写第一个页面：

```html

<template>
  <el-row class="content">
    <el-col :xs="24" :sm="{span: 6,offset: 9}">
      <span class="title">
       欢迎登录 
      </span>
      <el-row>
        <el-input 
          v-model="account" 
          placeholder="账号"
          type="text">
        </el-input>
        <el-input 
          v-model="password" 
          placeholder="密码"
          type="password">
        </el-input>
        <el-button type="primary">登录</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      account: '',
      password: ''
    };
  }
};
</script>

<style lang="stylus" scoped>
  .el-row.content
    padding 16px
  .title
    font-size 28px
  .el-input
    margin 12px 0
  .el-button
    width 100%
    margin-top 12px    
</style>

```

在这里就有一些值得注意的地方。首先是`template`标签内的直接子元素最多只能挂载一个。也就是你不能这么写：

```html

<template>
  <el-row></el-row>
  <el-row></el-row>
</template>

```

否则会报错：`template syntax error Component template should contain exactly one root element`，template下只能有一个根元素。不过为了写多个元素，你可以这样：

```html

<template>
  <div>
    <el-row></el-row>
    <el-row></el-row>
  </div>
</template>

```

同时注意到，在`Login.vue`的`style`标签内有个`scoped`属性，这个属性能够使这些样式只在这个组件内生效（因为Webpack在渲染的时候会将这个组件内的元素自动打上一串形如`data-v-62a7f97e`这样的属性，对于这些样式也会变成形如`.title[data-v-62a7f97e]{ font-size: 28px;}`的样子，保证了不会和其他组件的样式冲突。

页面写完之后，如果不把组件注册到Vue之下那么页面是不会显示的。因此这个时候需要把`APP.vue`这个文件改写一下：

```html
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <Login></Login> <!--使用Login组件-->
  </div>
</template>

<script>
import Login from './components/Login' // 引入Login组件

export default {
  name: 'app',
  components: {
    Login // 注册组件
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

```

也就是把`Login`这个组件注册到`Vue`下，同时你再看浏览器，已经不再是`vue-cli`默认生成的`Hello`欢迎界面了。

![Login](https://img.piegg.cn/vue-koa-demo/login.png "Login")

接着我们写一下登录成功后的界面。

### TodoList页面

还是在`src/components`目录下，写一个叫做`TodoList.vue`的文件。

接着我们开始写一个TodoList：

```html
<template>
  <el-row class="content">
    <el-col :xs="{span:20,offset:2}" :sm="{span:8,offset:8}">
      <span>
        欢迎：{{name}}！你的待办事项是：
      </span>
      <el-input placeholder="请输入待办事项" v-model="todos" @keyup.enter.native="addTodos"></el-input>
      <el-tabs v-model="activeName">
        <el-tab-pane label="待办事项" name="first">
          <el-col :xs="24">
            <template v-if="!Done"> <!--v-if和v-for不能同时在一个元素内使用，因为Vue总会先执行v-for-->
              <template v-for="(item, index) in list">
                <div class="todo-list" v-if="item.status == false">
                  <span class="item">
                    {{ index + 1 }}. {{ item.content }}
                  </span>
                  <span class="pull-right">
                    <el-button size="small" type="primary" @click="finished(index)">完成</el-button>
                    <el-button size="small" :plain="true" type="danger" @click="remove(index)">删除</el-button>
                  </span>
                </div>
              </template> 
            </template>
            <div v-else-if="Done">
              暂无待办事项
            </div>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="已完成事项" name="second">
          <template v-if="count > 0">
            <template v-for="(item, index) in list">
              <div class="todo-list" v-if="item.status == true">
                <span class="item finished">
                  {{ index + 1 }}. {{ item.content }}
                </span>
                <span class="pull-right">
                  <el-button size="small" type="primary" @click="restore(index)">还原</el-button>
                </span>
              </div>
            </template> 
          </template>
          <div v-else>
            暂无已完成事项
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      name: 'Molunerfinn',
      todos: '',
      activeName: 'first',
      list:[],
      count: 0
    };
  },
  computed: { // 计算属性用于计算是否已经完成了所有任务
    Done(){
      let count = 0;
      let length = this.list.length;
      for(let i in this.list){
        this.list[i].status == true ? count += 1 : '';
      }
      this.count = count;
      if(count == length || length == 0){
        return true
      }else{
        return false
      }
    }
  },

  methods: {
    addTodos() {
      if(this.todos == '')
        return
      let obj = {
        status: false,
        content: this.todos
      }
      this.list.push(obj);
      this.todos = '';
    },
    finished(index) {
      this.$set(this.list[index],'status',true) // 通过set的方法让数组的变动能够让Vue检测到
      this.$message({
        type: 'success',
        message: '任务完成'
      })
    },
    remove(index) {
      this.list.splice(index,1);
      this.$message({
        type: 'info',
        message: '任务删除'
      })
    },
    restore(index) {
      this.$set(this.list[index],'status',false)
      this.$message({
        type: 'info',
        message: '任务还原'
      })
    }
  }
};
</script>

<style lang="stylus" scoped>
  .el-input
    margin 20px auto
  .todo-list
    width 100%
    margin-top 8px
    padding-bottom 8px
    border-bottom 1px solid #eee
    overflow hidden
    text-align left
    .item
      font-size 20px
      &.finished
        text-decoration line-through
        color #ddd
  .pull-right
    float right
</style>
```

页面构建其实没有什么特别好说的，但是因为我自己有踩点坑，所以还是专门讲一下：

1. `v-if`和`v-for`放在一个元素内同时使用，因为Vue总会先执行`v-for`，所以导致`v-if`不会被执行。替代地，你可以使用一个额外的`template`元素用来放置`v-if`或者`v-for`从而达到同样的目的。这是相关的[issue](https://github.com/vuejs/vue/issues/3106)。

2. 计算属性对于直接的数据比如`a: 2` -> `a: 3`这样的数据变动可以直接检测到。但是如果是本例中的`list`的某一项的`status`这个属性变化了，如果我们直接使用`list[index].status = true`这样的写法的话，Vue将无法检测到数据变动。替代地，可以使用`set`方法（全局是`Vue.set()`，实例中是`this.$set()`），通过`set`方法可以让数据的变动变得可以被检测到。从而让计算属性能够捕捉到变化。可以参考官方文档对于响应式原理的[描述](https://cn.vuejs.org/v2/guide/reactivity.html)。

![Todolist](https://img.piegg.cn/vue-koa-demo/todolist.gif "Todolist")

写完`TodoList`之后，我们需要将它和`vue-router`配合起来，从而使这个单页应用能够进行页面跳转。

### 页面路由

由于不采用服务端渲染，所以页面路由走的是前端路由。安装一下`vue-router`：`yarn add vue-router`。

安装好后，我们挂载一下路由。打开`main.js`文件改写如下：

```js
// src/main.js

import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'

Vue.use(ElementUI);
Vue.use(VueRouter);

import Login from `./components/Login`
import TodoList from `./components/TodoList`

const router =  new VueRouter({
  mode: 'history', // 开启HTML5的history模式，可以让地址栏的url长得跟正常页面跳转的url一样。（不过还需要后端配合，讲Koa的时候会说）
  base: __dirname, 
  routes: [
    {
      path: '/',  // 默认首页打开是登录页
      component: Login
    },
    {
      path: '/todolist',
      component: TodoList
    },
    {
      path: '*',
      redirect: '/' // 输入其他不存在的地址自动跳回首页
    }
  ]
})

const app = new Vue({
  router: router, // 启用router
  render: h => h(App) 
}).$mount('#app') //挂载到id为app的元素上

```

这样就把路由挂载好了，但是你打开页面发现好像还是没有什么变化。这是因为我们没有把路由视图放到页面上。现在我们改写一下`APP.vue`：

```html
<!-- APP.vue -->

<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view></router-view> <!-- 原本的Login换成了router-view 这就是路由视图渲染的目标元素-->
  </div>
</template>

<script>
export default {
  name: 'app' // 不需要再引入`Login`\`TodoList`组件了，因为在路由里已经注册了
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

```

然后再看一下你的页面，这个时候你如果在地址栏后加上`/todolist`那么就会跳转到`TodoList`页面啦。

不过我们如何通过点击登录按钮跳转到`TodoList`呢？改写一下`Login.vue`，就可以跳转了。

只需要给登录的`button`加一个方法即可：

```html
<!-- Login.vue -->
······

<!-- 给input增加键盘事件，当输入完密码回车也执行loginToDo方法 -->
<el-input 
  v-model="password" 
  placeholder="密码"
  type="password"
  @keyup.enter.native="loginToDo">
</el-input>
<!-- 增加一个click方法 loginToDo -->
<el-button type="primary" @click="loginToDo">登录</el-button>

······

<script>
export default {
  data () {
    return {
      account: '',
      password: ''
    };
  },
  methods: {
    loginToDo() {
      this.$router.push('/todolist') // 编程式路由，通过push方法，改变路由。
    }
  }
};
</script>

```

然后你就可以通过点击`登录`按钮进行页面跳转了。并且你可以发现，页面地址从`localhost:8080`变成了`localhost:8080/todolist`，长得跟正常的url跳转一样。（但是实际上我们是单页应用，只是在应用内进行页面跳转而已，没有向后端额外请求）

![login2todolist](https://img.piegg.cn/vue-koa-demo/login2todolist.gif "login2todolist")

至此，我们已经完成了一个纯前端的单页应用，能够进行页面跳转，能够做简单的ToDoList的添加和删除和还原。当然这个东西只能算是个能看不能用的东西——因为登录系统有名无实、ToDoList只要页面刷新一下就没了。

于是我们可以先把前端放一放。开启我们的后端之旅。

## 后端环境搭建

### MySQL

之所以没有用Node界大家普遍喜爱的`Mongodb`主要是因为之前我用过它，而没有用过`MySQL`，本着学习的态度，我决定用用`MySQL`。还有就是`Express + Mongodb`的教程其实很早之前就已经满大街都是了。所以如果你觉得`Mongodb`更合你的胃口，看完本文你完全可以用`Mongodb`构建一个类似的应用。

去`MySQL`的[官网](http://dev.mysql.com/downloads/)下载安装对应平台`MySQL`的`Community Server`。

通常来说安装的步骤都是比较简单的。对于`MySQL`的基本安装、开启步骤可以参考这篇[文章](http://www.rathishkumar.in/2016/01/how-to-install-mysql-server-on-windows.html)，这篇是windows的。当然其他平台的安装也是很方便的，都有相应的包管理工具可以获取。值得注意的就是，安装完`MySQL`之后你需要设定一下`root`账户的密码。保证安全性。如果你漏了设定，或者你不知道怎么设定，可以参考这篇[文章](https://www.howtoforge.com/setting-changing-resetting-mysql-root-passwords)

因为我对`MySQL`的SQL语句不是很熟悉，所以我需要一个可视化的工具来操作`MySQL`。Windows上我用的是[HediSQL](http://www.heidisql.com/)，macOS上我用的是[Sequel Pro](https://www.sequelpro.com/)。它们都是免费的。

然后我们可以用这些可视化工具连上MySQL的server（默认端口是3306）之后，创建一个新的数据库，叫做`todolist`。（当然你也可以用SQL语句:`CREATE DATABASE todolist`，之后不再赘述）。

接着我们可以来开始创建数据表了。

我们需要创建两张表，一张是用户表，一张是待办事项表。用户表用于登录、验证，待办事项表用于展示我们的待办事项。

创建一张`user`表，其中`password`我们稍后会进行`bcrypt`加密（取128位）。

| 字段 | 类型 | 说明|
| --- | --- | --- |
| id | int（自增） | 用户的id |
| user_name | CHAR(50) | 用户的名字 |
| password | CHAR(128) | 用户的密码 |

创建一张`list`表，所需的字段是`id`、`user_id`、`content`、`status`即可。

| 字段 | 类型 | 说明|
| --- | --- | --- |
| id | int（自增） | list的id |
| user_id | int(11) | 用户的id |
| content | CHAR(255) | list的内容 |
| status | tinyint(1) | list的状态 |

直接跟数据库打交道的部分基本就是这样了。

### Sequelize

跟数据库打交道的时候我们都需要一个好的操作数据库的工具，能够让我们用比较简单的方法来对数据库进行增删改查。对于`Mongodb`来说大家熟悉的是[`Mongoose`](http://mongoosejs.com/)以及我用过一个相对更简单点的[`Monk`](https://github.com/Automattic/monk)。对于`MySQL`，我选用的是[`Sequelize`](https://github.com/sequelize/sequelize)，它支持多种关系型数据库（`Sqlite`、`MySQL`、`Postgres`等），它的操作基本都能返回一个`Promise`对象，这样在Koa里面我们能够很方便地进行"同步"操作。

> 更多关于Sequelize的用法，可以参考[官方文档](http://docs.sequelizejs.com/en/latest/)，以及这两篇文章——[Sequelize中文API文档](http://itbilu.com/nodejs/npm/VkYIaRPz-.html)、[Sequelize和MySQL对照](https://segmentfault.com/a/1190000003987871)

在用`Sequelize`连接数据库之前我们需要把数据库的表结构用`sequelize-auto`导出来。

> 更多关于`sequelize-auto`的使用可以参考[官方介绍](https://github.com/sequelize/sequelize-auto)或者[这篇文章](http://itbilu.com/nodejs/npm/41mRdls_Z.html)

由此我们需要分别安装这几个依赖：`yarn global add sequelize-auto && yarn add sequelize mysql`。 

> 注：上面用yarn安装的mysql是nodejs环境下的mysql驱动。

进入`server`的目录，执行如下语句`sequelize-auto -o "./schema" -d todolist -h 127.0.0.1 -u root -p 3306 -x XXXXX -e mysql`，（其中 -o 参数后面的是输出的文件夹目录， -d 参数后面的是数据库名， -h 参数后面是数据库地址， -u 参数后面是数据库用户名， -p 参数后面是端口号， -x 参数后面是数据库密码，这个要根据自己的数据库密码来！ -e 参数后面指定数据库为mysql）

然后就会在`schema`文件夹下自动生成两个文件：

```js
// user.js

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(11), // 字段类型
      allowNull: false, // 是否允许为NULL
      primaryKey: true, // 主键
      autoIncrement: true // 是否自增
    },
    user_name: {
      type: DataTypes.CHAR(50), // 最大长度为50的字符串
      allowNull: false
    },
    password: {
      type: DataTypes.CHAR(32),
      allowNull: false
    }
  }, {
    tableName: 'user' // 表名
  });
};
```

```js
// list.js

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('list', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    content: {
      type: DataTypes.CHAR(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    }
  }, {
    tableName: 'list'
  });
};

```

自动化工具省去了很多我们手动定义表结构的时间。同时注意到生成的数据库表结构文件都自动帮我们`module.exports`出来了，所以很方便我们之后的引入。

在`server`目录下的`config`目录下我们新建一个`db.js`，用于初始化`Sequelize`和数据库的连接。

```js
// db.js

const Sequelize = require('sequelize'); // 引入sequelize

// 使用url连接的形式进行连接，注意将root: 后面的XXXX改成自己数据库的密码
const Todolist = new Sequelize('mysql://root:XXXX@localhost/todolist',{
  define: {
    timestamps: false // 取消Sequelzie自动给数据表加入时间戳（createdAt以及updatedAt）
  }
}) 

module.exports = {
  Todolist // 将Todolist暴露出接口方便Model调用
}
```

接着我们去`models`文件夹里将数据库和表结构文件连接起来。在这个文件夹下新建一个`user.js`的文件。我们先来写一个查询用户`id`的东西。

为此我们可以先在数据库里随意加一条数据：

![test](https://img.piegg.cn/vue-koa-demo/database-1.png "test")

通常我们要查询一个用户id为1的数据，会很自然的想到类似如下的写法：

```js

const userInfo = User.findOne({ where: { id: 1} }); // 查询
console.log(userInfo); // 输出结果

```

但是上面的写法实际上是行不通的。因为JS的特性让它的IO操作是异步的。而上面的写法，`userInfo`将是返回的一个`Promise`对象，而不是最终的`userInfo`。如果又想用同步的写法获取异步IO操作得到的数据的话，通常情况下是不能直接得到的。但是在Koa里，由于有[`co`](https://github.com/tj/co)的存在，让这一切变得十分简单。改写如下：

```js
// models/user.js
const db = require('../config/db.js'), 
      userModel = '../schema/user.js'; // 引入user的表结构
const TodolistDb = db.Todolist; // 引入数据库

const User = TodolistDb.import(userModel); // 用sequelize的import方法引入表结构，实例化了User。

const getUserById = function* (id){ // 注意是function* 而不是function 对于需要yield操作的函数都需要这种generator函数。
  const userInfo = yield User.findOne({ // 用yield控制异步操作，将返回的Promise对象里的数据返回出来。也就实现了“同步”的写法获取异步IO操作的数据
    where: {
      id: id
    }
  });

  return userInfo // 返回数据
}

module.exports = {
  getUserById  // 导出getUserById的方法，将会在controller里调用
}
```

接着我们在`controllers`写一个user的controller，来执行这个方法，并返回结果。

```js
// controllers/user.js 

const user = require('../models/user.js');

const getUserInfo = function* (){
  const id = this.params.id; // 获取url里传过来的参数里的id
  const result = yield user.getUserById(id);  // 通过yield “同步”地返回查询结果
  this.body = result // 将请求的结果放到response的body里返回
}

module.exports = {
  getUserInfo // 把获取用户信息的方法暴露出去 
}
```

写完这个还不能直接请求，因为我们还没有定义路由，请求经过`Koa`找不到这个路径是没有反应的。

在`routes`文件夹下写一个`auth.js`的文件。（其实`user`表是用于登录的，所以走`auth`）

```js
// routes/auth.js

const auth = require('../controllers/user.js'); 
const router = require('koa-router')();

router.get('/user/:id', auth.getUserInfo); // 定义url的参数是id,用user的auth方法引入router

module.exports = router; // 把router规则暴露出去
```

至此我们已经接近完成我们的第一个API了，还缺最后一步，将这个路由规则“挂载”到Koa上去。

回到根目录的`app.js`，改写如下：

```js
const app = require('koa')()
  , koa = require('koa-router')()
  , json = require('koa-json')
  , logger = require('koa-logger')
  , auth = require('./server/routes/auth.js'); // 引入auth

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(function* (next){
  let start = new Date;
  yield next;
  let ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.on('error', function(err, ctx){
  console.log('server error', err);
});

koa.use('/auth', auth.routes()); // 挂载到koa-router上，同时会让所有的auth的请求路径前面加上'/auth'的请求路径。

app.use(koa.routes()); // 将路由规则挂载到Koa上。

app.listen(8889,() => {
  console.log('Koa is listening in 8889');
});

module.exports = app;
```

打开你的控制台，输入`node app.js`，一切运行正常没有报错的话，大功告成，我们的第一个API已经构建完成！

如何测试呢？

### API Test

接口在跟跟前端对接之前，我们应该先进行一遍测试，防止出现问题。在测试接口的工具上，我推荐[`Postman`](https://www.getpostman.com/)，这个工具能够很好的模拟发送的各种请求，方便的查看响应结果，用来进行测试是最好不过了。

![Postman](https://img.piegg.cn/vue-koa-demo/postman-1.png)

测试成功，我发送了正确的url请求，返回的结果也是我想看到的。我们看到返回的结果实际上是个JSON，这对于我们前后端来说都是十分方便处理的数据格式。

但是如果我们代码出了问题，返回error了我们该怎么测试呢？如果说控制台能够反馈一定的信息，但是绝对不充分，并且我们很可能不知道哪步出错了导致最终结果出问题。

所以我推荐用[VSCode](https://code.visualstudio.com/)这个工具来帮我们调试nodejs后端的代码。它能够添加断点，能够很方便地查看请求的信息。并且配合上[`nodemon`](https://github.com/remy/nodemon)这类的工具，调试简直不要更舒服。

关于`VSCode`的nodejs调试，可以参考官方的这篇[文章](https://code.visualstudio.com/docs/editor/node-debugging)

> 我自己是用Sublime写代码，用VSCode调试，哈哈。

### 登录系统的实现

刚才实现的不过是一个简单的用户信息查询的接口，但是我们要实现的是一个登录系统，所以还需要做一些工作。

#### JSON-WEB-TOKEN

基于cookie或者session的登录验证已经屡见不鲜，前段时间`JSON-WEB-TOKEN`出来后很是风光了一把。引入了它之后，能够实现真正无状态的请求，而不是基于session和cookie的存储式的有状态验证。

关于JSON-WEB-TOKEN的描述可以参考这篇[文章](http://blog.leapoahead.com/2015/09/07/user-authentication-with-jwt/?utm_source=tuicool&utm_medium=referral)比较简单，我还推荐一篇[文章](https://segmentfault.com/a/1190000005783306)，将如何使用JSON-WEB-TOKEN写得很清楚。

另外可以在JSON-WEB-TOKEN的[官网](https://jwt.io/)上感受一下。

> Tips：JSON-WEB-TOKEN分三部分，头部信息+主体信息+密钥信息，其中主体传递的信息（是我们存放我们需要的信息的部分）是用BASE64编码的，所以很容易被解码，一定不能存放明文密码这种关键信息！替代地可以存放一些不是特别关键的信息，比如用户名这样能够做区分的信息。

简单来说，运用了JSON-WEB-TOKEN的登录系统应该是这样的：

1. 用户在登录页输入账号密码，将账号密码（密码进行md5加密）发送请求给后端
2. 后端验证一下用户的账号和密码的信息，如果符合，就下发一个TOKEN返回给客户端。如果不符合就不发送TOKEN回去，返回验证错误信息。
3. 如果登录成功，客户端将TOKEN用某种方式存下来（SessionStorage、LocalStorage）,之后要请求其他资源的时候，在请求头（Header）里带上这个TOKEN进行请求。
4. 后端收到请求信息，先验证一下TOKEN是否有效，有效则下发请求的资源，无效则返回验证错误。

通过这个TOKEN的方式，客户端和服务端之间的访问，是`无状态`的：也就是服务端不知道你这个用户到底还在不在线，只要你发送的请求头里的TOKEN是正确的我就给你返回你想要的资源。这样能够不占用服务端宝贵的空间资源，而且如果涉及到服务器集群，如果服务器进行维护或者迁移或者需要CDN节点的分配的话，`无状态`的设计显然维护成本更低。

话不多说，我们来把`JSON-WEB-TOKEN`用到我们的项目中。

`yarn add koa-jwt`，安装`Koa`的`JSON-WEB-TOKEN`库。

我们需要在`models`里的`user.js`加一个方法，通过用户名查找用户：

```js
// models/user.js
// ......
// 前面的省略了


// 新增一个方法，通过用户名查找
const getUserByName = function* (name){
  const userInfo = yield User.findOne({
    where: {
      user_name: name
    }
  })

  return userInfo
}

module.exports = {
  getUserById, // 导出getUserById的方法，将会在controller里调用
  getUserByName
}

```

然后我们写一下`controllers`里的`user.js`：

```js
// controllers/user.js

const user = require('../models/user.js');
const jwt = require('koa-jwt'); // 引入koa-jwt

const getUserInfo = function* (){
  const id = this.params.id; // 获取url里传过来的参数里的id
  const result = yield user.getUserById(id);  // 通过yield “同步”地返回查询结果
  this.body = result // 将请求的结果放到response的body里返回
}

const postUserAuth = function* (){
  const data = this.request.body; // post过来的数据存在request.body里
  const userInfo = yield user.getUserByName(data.name);

  if(userInfo != null){ // 如果查无此用户会返回null
    if(userInfo.password != data.password){
      this.body = {
        success: false, // success标志位是方便前端判断返回是正确与否
        info: '密码错误！'
      }
    }else{ // 如果密码正确
      const userToken = {
        name: userInfo.user_name,
        id: userInfo.id
      }
      const secret = 'vue-koa-demo'; // 指定密钥，这是之后用来判断token合法性的标志
      const token = jwt.sign(userToken,secret); // 签发token
      this.body = {
        success: true,
        token: token, // 返回token
      }
    }
  }else{
    this.body = {
      success: false,
      info: '用户不存在！' // 如果用户不存在返回用户不存在
    }
  }
}

module.exports = {
  getUserInfo,
  postUserAuth
}
```

再把`routes`里的路由规则更新一下：

```js
// routes/auth.js

const auth = require('../controllers/user.js'); 
const router = require('koa-router')();

router.get('/user/:id', auth.getUserInfo); // 定义url的参数是id,用user的auth方法引入router
router.post('/user', auth.postUserAuth);

module.exports = router; // 把router规则暴露出去
```

由此我们写完了用户认证的部分。接下去我们要改写一下前端登录的方法。

#### 引入Axios

之前在学`Vue`的时候一直用的是[`vue-resource`](https://github.com/pagekit/vue-resource)，不过后来`Vue2`出来之后，Vue官方不再默认推荐它为官方的`ajax`网络请求库了。替代地推荐了一些其他的库，比如就有我们今天要用的[`axios`](https://github.com/mzabriskie/axios)。我之前也没有用过它，不过看完它的star和简要介绍`Promise based HTTP client for the browser and node.js`，能够同时支持node和浏览器端的ajax请求工具（还是基于Promised的！），我想就有必要用一用啦。

`yarn add axios`，安装`axios`。然后我们在`src/main.js`里面引入`axios`：

```js

// scr/main.js

// ...

import Axios from 'axios'

Vue.prototype.$http = Axios // 类似于vue-resource的调用方法，之后可以在实例里直接用this.$http.get()等

// ...


```

```js
// Login.vue
// 省略前面的部分

 methods: {
    loginToDo() {
      let obj = {
        name: this.account,
        password: this.password
      } 
      this.$http.post('/auth/user', obj) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if(res.data.success){ // 如果成功
            sessionStorage.setItem('demo-token',res.data.token); // 用sessionStorage把token存下来
            this.$message({ // 登录成功，显示提示语
              type: 'success',
              message: '登录成功！'
            }); 
            this.$router.push('/todolist') // 进入todolist页面，登录成功
          }else{
            this.$message.error(res.data.info); // 登录失败，显示提示语
            sessionStorage.setItem('demo-token',null); // 将token清空
          }
        }, (err) => {
            this.$message.error('请求错误！')
            sessionStorage.setItem('demo-token',null); // 将token清空
        })
    }
  }
```



#### 密码bcrypt加密

最早的时候我是在前端用了md5加密，但是后来经过提醒这种方式并不安全。md5加密的容易被破解。所以就采用了`bcrypt`的加密方式。全部走后端加密。也许你会问这样明文给后端发送密码安全吗？没问题，只要用上HTTPS，这将不是问题。

`yarn add bcryptjs`安装bcryptjs。

```js
// controllers/user.js

const user = require('../models/user.js');
const jwt = require('koa-jwt'); // 引入koa-jwt
const bcrypt = require('bcryptjs');

const getUserInfo = function* (){
  const id = this.params.id; // 获取url里传过来的参数里的id
  const result = yield user.getUserById(id);  // 通过yield “同步”地返回查询结果
  this.body = result // 将请求的结果放到response的body里返回
}

const postUserAuth = function* (){
  const data = this.request.body; // post过来的数据存在request.body里
  const userInfo = yield user.getUserByName(data.name);

  if(userInfo != null){ // 如果查无此用户会返回null
    if(!bcrypt.compareSync(data.password, userInfo.password)){ // 验证密码是否正确
      this.body = {
        success: false, // success标志位是方便前端判断返回是正确与否
        info: '密码错误！'
      }
    }else{ // 如果密码正确
      const userToken = {
        name: userInfo.user_name,
        id: userInfo.id
      }
      const secret = 'vue-koa-demo'; // 指定密钥，这是之后用来判断token合法性的标志
      const token = jwt.sign(userToken,secret); // 签发token
      this.body = {
        success: true,
        token: token, // 返回token
      }
    }
  }else{
    this.body = {
      success: false,
      info: '用户不存在！' // 如果用户不存在返回用户不存在
    }
  }
}

module.exports = {
  getUserInfo,
  postUserAuth
}
```

因为我们数据库里还是存着明文的`123`作为密码，现在要先将它bcrypt化，加密后变为：`$2a$10$x3f0Y2SNAmyAfqhKVAV.7uE7RHs3FDGuSYw.LlZhOFoyK7cjfZ.Q6`，将其替换掉数据库里的`123`。不做这步我们将无法登录。

还没有大功告成，因为我们的界面跑在`8080`端口，但是Koa提供的API跑在`8889`端口，所以如果直接通过`/auth/user`这个url去post是请求不到的。就算写成`localhost:8889/auth/user`也会因为跨域问题导致请求失败。

这个时候有两种最方便的解决办法：

1. 如果是跨域，服务端只要在请求头上加上[`CORS`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)，客户端即可跨域发送请求。
2. 变成同域，即可解决跨域请求问题。

第一种也很方便，采用[`kcors`](https://github.com/koajs/cors)即可解决。
不过为了之后部署方便，我们采用第二种，变成同域请求。

打开根目录下的`config/index.js`，找到`dev`下的`proxyTable`，利用这个`proxyTable`我们能够将外部的请求通过`webpack`转发给本地，也就能够将跨域请求变成同域请求了。

将`proxyTable`改写如下:

```js
 proxyTable: {
  '/auth':{
    target: 'http://localhost:8889',
    changeOrigin: true
  },
  '/api':{
    target: 'http://localhost:8889',
    changeOrigin: true
  }
}
```

上面的意思是，我们在组件里请求的地址如果是`/api/xxxx`实际上请求的是`http://localhost:8889/api/xxxx`，但是由于`webpack`帮我们代理了localhost的8889端口的服务，所以我们可以把实际是跨域的请求当做是同域下的接口来调用。

此时重新启动一下`webpack`：先`ctrl+c`退出当前进程，然后`npm run dev`。

一切都万事了之后，我们可以看到如下激动人心的画面：

![login2todolist](https://img.piegg.cn/vue-koa-demo/login2todolist-2.gif "login2todolist")

#### 跳转拦截

虽然我们现在能够成功登录系统了，但是还是存在一个问题：我在地址栏手动将地址改为`localhost:8080/todolist`我还是能够成功跳转到登录后的界面啊。于是这就需要一个跳转拦截，当没有登录的时候，不管地址栏输入什么地址，最终都重新定向回登录页。

这个时候，从后端给我们传回来的`token`就派上大用处。有`token`就说明我们的身份是经过验证的，否则就是非法的。

`vue-router`提供了页面跳转的钩子，我们可以在`router`跳转前进行验证，如果`token`存在就跳转，如果不存在就返回登录页。

参考路由的[导航钩子](https://router.vuejs.org/zh-cn/advanced/navigation-guards.html)

打开`src/main.js`，修改如下：

```js
// src/main.js

// ...

const router = new VueRouter({....}) // 省略

router.beforeEach((to,from,next) =>{
  const token = sessionStorage.getItem('demo-token');
  if(to.path == '/'){ // 如果是跳转到登录页的
    if(token != 'null' && token != null){
      next('/todolist') // 如果有token就转向todolist不返回登录页
    }
    next(); // 否则跳转回登录页
  }else{
    if(token != 'null' && token != null){
      next() // 如果有token就正常转向
    }else{
      next('/') // 否则跳转回登录页
    }
  }
})

const app = new Vue({...}) // 省略

```

> **注意：一定要确保要调用 `next()` 方法，否则钩子就不会被 resolved。**如果纯粹调用`next(path)`这样的方法最终还是会回到`.beforeEach()`这个钩子里面来，如果没有写对条件就有可能出现死循环，栈溢出的情况。

然后我们就可以看到如下效果：

![login2todolist](https://img.piegg.cn/vue-koa-demo/login2todolist-3.gif "login2todolist")

> Tips：这种只判断token存不存在就通过的验证是很不安全的，此例只是做了一个演示，实际上还应该进行更深一层的判断，比如从token解包出来的信息里包含我们想要的信息才可以作为有效token，才可以登录。等等。本文只是做一个简要介绍。

#### 解析token

注意到我们在签发`token`的时候，写过这样几句话：

```js

// server/controllers/user.js

// ...

const userToken = {
  name: userInfo.user_name,
  id: userInfo.id
}
const secret = 'vue-koa-demo'; // 指定密钥，这是之后用来判断token合法性的标志
const token = jwt.sign(userToken,secret); // 签发token

// ...
```

我们将用户名和id打包进JWT的主体部分，同时我们解密的密钥是`vue-koa-demo`。所以我们可以通过这个信息，来进行登录后的用户名显示，以及用来区别这个用户是谁，这个用户有哪些`Todolist`。

接下来在`Todolist`页面进行token解析，从而让用户名显示为登录用户名。

**注意：** 前端直接暴露`secret-key`的做法其实并不安全。正确的做法应该是把token跟用户名和其他不是很重要的信息一起传过来，token只用于验证，而其他信息作为返回值正常返回。这样就不会暴露`secret-key`了。当然本文只是为了方便说明，给出的一个不恰当的获取用户信息的例子。

```js

// src/components/TodoList.vue

// ...

import jwt from 'jsonwebtoken' // 我们安装koa-jwt的时候会自动下载这个依赖

export default {

  created(){ // 组件创建时调用
    const userInfo = this.getUserInfo(); // 新增一个获取用户信息的方法
    if(userInfo != null){
      this.id = userInfo.id;
      this.name = userInfo.name;
    }else{
      this.id = '';
      this.name = ''
    }
  },

  data () {
    return {
      name: '', // 用户名改为空
      todos: '',
      activeName: 'first',
      list:[],
      count: 0,
      id: '' // 新增用户id属性，用于区别用户
    };
  },
  computed: {...}, //省略

  methods: {
    addTodos() {...}, // 省略
    finished(index) {...},
    remove(index) {...},
    restore(index) {...},
    getUserInfo(){ // 获取用户信息
      const token = sessionStorage.getItem('demo-token');
      if(token != null && token != 'null'){
        let decode = jwt.verify(token,'vue-koa-demo'); // 解析token
        return decode // decode解析出来实际上就是{name: XXX,id: XXX}
      }else {
        return null
      }
    }
  }
};

// ...
```

于是你就可以看到：

![todolist](https://img.piegg.cn/vue-koa-demo/todolist-1.png "todolist")

用户名已经不是我们之前默认的`Molunerfinn`而是登录名`molunerfinn`了。

## Todolist 增删改查的实现

这个部分就是前后端协作了。我们要实现之前在纯前端部分实现的内容。我以最基本的两个方法来举例子：获取`Todolist`以及增加`Todolist`，剩下其实思路大同小异，我就提供代码和注释了，我相信也很容易懂。

### Token的发送

之前说了，用JSON-WEB-TOKEN之后，这个系统的验证就完全依靠token了。如果token正确就下发资源，如果资源不正确，就返回错误信息。

因为我们用了`koa-jwt`，所以只需要在每条请求头上加上`Authorization`属性，值是`Bearer {token值}`，然后让`Koa`在接收请求之前验证一下token即可。但是如果每发一条请求就要手动写一句这个，太累了。于是我们可以做到全局`Header`设定。

打开`src/main.js`，在路由跳转的钩子里加上这句：

```js

// scr/main.json

router.beforeEach((to,from,next) =>{
  const token = sessionStorage.getItem('demo-token');
  if(to.path == '/'){ 
    if(token != 'null' && token != null){
      next('/todolist') 
    }
    next(); 
  }else{
    if(token != 'null' && token != null){
      Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token; // 全局设定header的token验证，注意Bearer后有个空格
      next() 
    }else{
      next('/') 
    }
  }
})

```

这样就完成了token的客户端发送设定。

### Koa端对Token的验证

接着我们实现两个简单的api，这两个api请求的路径就不是`/auth/xxx`而是`/api/xxx`了。我们还需要实现，访问`/api/*`路径的请求都需要经过`koa-jwt`的验证，而`/auth/*`的请求不需要。

首先去`models`目录下新建一个`todolist.js`的文件：

```js

// server/models/todolist.js

const db = require('../config/db.js'), 
      todoModel = '../schema/list.js'; // 引入todolist的表结构
const TodolistDb = db.Todolist; // 引入数据库

const Todolist = TodolistDb.import(todoModel); 

const getTodolistById = function* (id){  // 获取某个用户的全部todolist
  const todolist = yield Todolist.findAll({ // 查找全部的todolist
    where: {
      user_id: id
    },
    attributes: ['id','content','status'] // 只需返回这三个字段的结果即可
  });

  return todolist // 返回数据
}

const createTodolist = function* (data){ // 给某个用户创建一条todolist
  yield Todolist.create({
    user_id: data.id, // 用户的id，用来确定给哪个用户创建
    content: data.content,
    status: data.status 
  })
  return true
}

module.exports = {
  getTodolistById,
  createTodolist
}
```

接着去`controllers`目录下新建一个`todolist.js`的文件：

```js
// server/controllers/todolist

const todolist = require('../models/todolist.js');

const getTodolist = function* (){ // 获取某个用户的所有todolist
  const id = this.params.id; // 获取url里传过来的参数里的id
  const result = yield todolist.getTodolistById(id);  // 通过yield “同步”地返回查询结果
  this.body = result // 将请求的结果放到response的body里返回
}

const createTodolist = function* (){ // 给某个用户创建一条todolist
  const data = this.request.body; // post请求，数据是在request.body里的
  const result = yield todolist.createTodolist(data);

  this.body = {
    success: true
  }
}


module.exports = {
  getTodolist,
  createTodolist
}
```

然后去`routes`文件夹里新建一个`api.js`文件：

```js

// server/routes/api.js

const todolist = require('../controllers/todolist.js');
const router = require('koa-router')();

todolist(router); // 引入koa-router

module.exports = router; // 导出router规则

```

最后，去根目录下的`app.js`，给koa加上新的路由规则：

```js

// app.js

const app = require('koa')()
  , koa = require('koa-router')()
  , json = require('koa-json')
  , logger = require('koa-logger')
  , auth = require('./server/routes/auth.js')
  , api = require('./server/routes/api.js')
  , jwt = require('koa-jwt');

// ..... 省略

app.use(function* (next){
  let start = new Date;
  yield next;
  let ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(function *(next){  //  如果JWT验证失败，返回验证失败信息
  try {
    yield next;
  } catch (err) {
    if (401 == err.status) {
      this.status = 401;
      this.body = {
        success: false,
        token: null,
        info: 'Protected resource, use Authorization header to get access'
      };
    } else {
      throw err;
    }
  }
});

app.on('error', function(err, ctx){
  console.log('server error', err);
});

koa.use('/auth', auth.routes()); // 挂载到koa-router上，同时会让所有的auth的请求路径前面加上'/auth'的请求路径。
koa.use("/api",jwt({secret: 'vue-koa-demo'}),api.routes()) // 所有走/api/打头的请求都需要经过jwt中间件的验证。secret密钥必须跟我们当初签发的secret一致

app.use(koa.routes()); // 将路由规则挂载到Koa上。

// ...省略

```

至此，后端的两个api已经构建完成。

初始化配置相对复杂一些，涉及到`model`、`controllers`、`routes`和`app.js`，可能会让人望而却步。实际上第一次构建完成之后，后续要添加api，基本上只需要在`model`和`controllers`写好方法，定好接口即可，十分方便。

### 前端对接接口

后端接口已经开放，接下来要把前端和后端进行对接。主要有两个对接接口：

1. 获取某个用户的所有todolist
2. 创建某个用户的一条todolist

接下来就是改写`Todolist.vue`里的方法了：

```js

// todolist.js

// ... 省略

created(){
  const userInfo = this.getUserInfo();
  if(userInfo != null){
    this.id = userInfo.id;
    this.name = userInfo.name;
  }else{
    this.id = '';
    this.name = ''
  }
  this.getTodolist(); // 新增：在组件创建时获取todolist
},

// ... 省略

methods: {
  addTodos() {
    if(this.todos == '')
      return
    let obj = {
      status: false,
      content: this.todos,
      id: this.id
    }
    this.$http.post('/api/todolist', obj) // 新增创建请求
      .then((res) => {
        if(res.status == 200){ // 当返回的状态为200成功时
          this.$message({
            type: 'success',
            message: '创建成功！' 
          })
          this.getTodolist(); // 获得最新的todolist
        }else{
          this.$message.error('创建失败！') // 当返回不是200说明处理出问题
        }
      }, (err) => {
        this.$message.error('创建失败！') // 当没有返回值说明服务端错误或者请求没发送出去
        console.log(err)
      })
    this.todos = ''; // 将当前todos清空
  },
  // ... 省略一些方法
  getTodolist(){
    this.$http.get('/api/todolist/' + this.id) // 向后端发送获取todolist的请求
      .then((res) => {
        if(res.status == 200){
          this.list = res.data // 将获取的信息塞入实例里的list
        }else{
          this.$message.error('获取列表失败！')
        }
      }, (err) => {
        this.$message.error('获取列表失败！')
        console.log(err)
      })
  }
}

```

至此，前后端的部分已经完整构建。让我们来看看效果：

![todolist](https://img.piegg.cn/vue-koa-demo/login2todolist-4.gif "todolist")

做到这一步的时候其实我们的应用已经基本完成了。最后的收尾工作，让我们来收一下。

原本的前端版本还有`完成`、`删除`、`还原`三种状态，其中`完成`和`还原`只是状态的切换（更新），所以可以算是一个api，然后就是删除是单独一个api。于是我们就能算是完成了增、删、改、查了。接下去的部分就提供代码就行，其实思路跟之前的是一样的，只不过操作的函数不一样罢了。

### Todolist的改、删

```js

// server/models/todolist.js

// ...省略

const removeTodolist = function* (id,user_id){
  yield Todolist.destroy({
    where: {
      id,
      user_id
    }
  })
  return true
}

const updateTodolist = function* (id,user_id,status){
  yield Todolist.update(
    {
      status
    },
    {
      where: {
        id,
        user_id
      }
    }
  )
  return true
}

module.exports = {
  getTodolistById,
  createTodolist,
  removeTodolist,
  updateTodolist
}

```


```js

// server/controllers/todolist.js

// ... 省略

const removeTodolist = function* (){
  const id = this.params.id;
  const user_id = this.params.userId;
  const result = yield todolist.removeTodolist(id,user_id);

  this.body = {
    success: true
  }
}

const updateTodolist = function* (){
  const id = this.params.id;
  const user_id = this.params.userId;
  let status = this.params.status; 
  status == '0' ? status = true : status =  false;// 状态反转（更新）

  const result = yield todolist.updateTodolist(id,user_id,status);

  this.body = {
    success: true
  }
}

module.exports = (router) => {
  getTodolist,
  createTodolist,
  removeTodolist,
  updateTodolist
}

```

```html
 <!-- src/components/TodoList.vue -->

....

<!-- 把完成和还原的方法替换成了update -->
<el-button size="small" type="primary" @click="update(index)">完成</el-button>
....
<el-button size="small" type="primary" @click="update(index)">还原</el-button>
....
<script>
// ....省略
  methods:{
    // ... 省略
    update(index) {
      this.$http.put('/api/todolist/'+ this.id + '/' + this.list[index].id + '/' + this.list[index].status)
        .then((res) => {
          if(res.status == 200){
            this.$message({
              type: 'success',
              message: '任务状态更新成功！'
            })
            this.getTodolist();
          }else{
            this.$message.error('任务状态更新失败！')
          }
        }, (err) => {
          this.$message.error('任务状态更新失败！')
          console.log(err)
        })
    },
    remove(index) {
      this.$http.delete('/api/todolist/'+ this.id + '/' + this.list[index].id)
        .then((res) => {
          if(res.status == 200){
            this.$message({
              type: 'success',
              message: '任务删除成功！'
            })
            this.getTodolist();
          }else{
            this.$message.error('任务删除失败！')
          }
        }, (err) => {
          this.$message.error('任务删除失败！')
          console.log(err)
        })
    },
  }
// ... 省略
</script>
....
```

让我们来看看最后99%成品的效果吧：

![Todolist](https://img.piegg.cn/vue-koa-demo/todolist-5.gif 'todolist')

## 项目部署

很多教程到类似于我上面的部分就结束了。但是实际上我们做一个项目最想要的就是部署给大家用不是么？

在部署这块有些坑，需要让大家也一起知道一下。这个项目是个全栈项目（虽然是个很简单的。。。），所以就涉及到前后端通信的问题，也就会涉及到是同域请求还是跨域请求。

我们也说过，要解决这个问题有两种方便的解决办法，第一种，服务端加上`cors`，客户端就可以随意的跨域请求。但是这样会有个问题，因为我们是以同域的形式开发，请求的地址也是写的相对地址：`/api/*`、`auth/*`这样的路径，访问的路径的自然是同域。如果要在服务端加上`cors`，我们还需要将我们的所有请求地址改成`localhost:8889/api/*`，`localhost:8889/auth/*`，这样的话，如果服务端的端口号一变，我们还需要重新修改前端所有的请求地址。这样很不方便也很不科学。

因此，要将请求变为同域才是最好的解决办法——不管服务端端口号怎么变，只要是同域都可以请求到。

于是要把Vue和Koa结合起来变成一个完整的项目（之前实际上都是在开发模式下，webpack帮我们进行请求的代理转发，所以看起来像是同域请求，而Vue和Koa并没有完全结合起来），就得在生产模式下，将Vue的静态文件交给Koa“托管”，所有访问前端的请求全部走Koa端，包括静态文件资源的请求，也走Koa端，把Koa作为一个Vue项目的静态资源服务器，这样就可以让Vue里的请求走的都是同域了。（相当于，之前开发模式是webpack开启了一个服务器托管了Vue的资源和请求，现在生产模式下改成Koa托管Vue的资源和请求）

要在开发和生产模式改变不同的托管服务器，其实也很简单，只需要在生产模式下，用Koa的静态资源服务中间件托管构建好的Vue文件即可。

### Webpack打包

部署之前我们要用Webpack将我们的前端项目打包输出一下。但是如果直接用`npm run build`，你会发现打包出来的文件太大了：

```bash

                                                  Asset       Size  Chunks             Chunk Names
    static/css/app.d9034fc06fd57ce00d6e75ed49f0dafe.css     120 kB    2, 0  [emitted]  app
                 static/fonts/element-icons.a61be9c.eot    13.5 kB          [emitted]
                   static/img/element-icons.09162bc.svg    17.4 kB          [emitted]
             static/js/manifest.8ea250834bdc80e4d73b.js  832 bytes       0  [emitted]  manifest
               static/js/vendor.75bbe7ecea37b0d4c62d.js     623 kB    1, 0  [emitted]  vendor
                  static/js/app.e2d125562bfc4c57f9cb.js    16.5 kB    2, 0  [emitted]  app
                 static/fonts/element-icons.b02bdc1.ttf    13.2 kB          [emitted]
         static/js/manifest.8ea250834bdc80e4d73b.js.map    8.86 kB       0  [emitted]  manifest
           static/js/vendor.75bbe7ecea37b0d4c62d.js.map    3.94 MB    1, 0  [emitted]  vendor
              static/js/app.e2d125562bfc4c57f9cb.js.map    64.8 kB    2, 0  [emitted]  app
static/css/app.d9034fc06fd57ce00d6e75ed49f0dafe.css.map     151 kB    2, 0  [emitted]  app
                                             index.html  563 bytes          [emitted]
```

竟然有3.94MB的map文件。这肯定是不能接受的。于是要修改一下webpack的输出的设置，取消输出map文件。

找到根目录下的`config/index.js`：把`productionSourceMap: true`这句话改成`productionSourceMap: false`。然后再执行一遍`npm run build`。

```bash
                                              Asset       Size  Chunks             Chunk Names
             static/fonts/element-icons.a61be9c.eot    13.5 kB          [emitted]
             static/fonts/element-icons.b02bdc1.ttf    13.2 kB          [emitted]
               static/img/element-icons.09162bc.svg    17.4 kB          [emitted]
         static/js/manifest.3ba218c80028a707a728.js  774 bytes       0  [emitted]  manifest
           static/js/vendor.75bbe7ecea37b0d4c62d.js     623 kB    1, 0  [emitted]  vendor
              static/js/app.b6acaca2531fc0baa447.js    16.5 kB    2, 0  [emitted]  app
static/css/app.d9034fc06fd57ce00d6e75ed49f0dafe.css     120 kB    2, 0  [emitted]  app
                                         index.html  563 bytes          [emitted]
```

把sourceMap去掉了之后，体积就小下来了。虽然600+kb的大小还是有点大，不过放到服务端，gzip之后只剩150+kb的体积勉强还是可以接受。当然，对于webpack输出的优化，不是本文讨论的范围，有很多更好的文章讲述了这个东西，故本文不再详细展开。

打包好后就是相当于输出了一堆静态文件，当然这堆静态文件需要放在服务端才可以访问。我们要将这堆静态资源用Koa托管。

### Koa serve静态资源

`yarn add koa-static`

打开`app.js`，引入两个新依赖，其中`path`是nodejs原生自带。

```js
// app.js

// .... 
const path =require('path')
    , serve = require('koa-static');
// ....

// 静态文件serve在koa-router的其他规则之上 
app.use(serve(path.resolve('dist'))); // 将webpack打包好的项目目录作为Koa静态文件服务的目录

// 下面这些是之前就有的。。。为了方便找位置故标示出来
koa.use('/auth', auth.routes());
koa.use("/api",jwt({secret: 'vue-koa-demo'}),api.routes()) 

// ...
```

然后重新运行一遍`node app.js`，看到输出`Koa is listening in 8889`后，你可以打开浏览器`localhost:8889`就可以看到如下情景：

![vue-koa](https://img.piegg.cn/vue-koa-demo/vue-koa.png)

至此已经基本上接近尾声，不过还存在一个问题：如果我们登录进去之后，在todolist页面一刷新，就会出现：

![404](https://img.piegg.cn/vue-koa-demo/404.png '404')

为什么会出现这种情况？简单来说是因为我们使用了前端路由，用了HTML5 的History模式，如果没有做其他任何配置的话，刷新页面，那么浏览器将会去服务端访问这个页面地址，因为服务端并没有配置这个地址的路由，所以自然就返回404 Not Found了。

详细可以参考vue-router的[这篇文档](https://router.vuejs.org/zh-cn/essentials/history-mode.html)

该怎么解决？其实也很简单，多加一个中间件：`koa-history-api-fallback`即可.

`yarn add koa-history-api-fallback`

```js

//... 省略

const historyApiFallback = require('koa-history-api-fallback'); // 引入依赖

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());
app.use(historyApiFallback()); // 在这个地方加入。一定要加在静态文件的serve之前，否则会失效。

// ... 
```

这个时候，你再重新启动一下koa，登录之后再刷新页面，就不会再出现404 Not Found了。

### API Test

本来写到上面基本本文已经算是结束了。但是由于我在开发的过程中遇到了一些问题，所以还需要做一些微调。

我们知道koa的use方法是有顺序只差的。

```js
const app = require('koa');
app.use(A);
app.use(B);
```

```js
const app = require('koa');
app.use(B);
app.use(A);
```

这二者是有区别的，谁先被use，谁的规则就放到前面先执行。

因此如果我们将静态文件的serve以及`historyApiFallback`放在了api的请求之前，那么用postman测试api的时候总会先返回完整的页面：

![postman](https://img.piegg.cn/vue-koa-demo/postman.png)

因此正确的做法，应该是将它们放到我们写的api的规则之后：

```js

// app.js
// ...

koa.use('/auth', auth.routes()); // 挂载到koa-router上，同时会让所有的auth的请求路径前面加上'/auth'的请求路径。
koa.use("/api",jwt({secret: 'vue-koa-demo'}),api.routes()) // 所有走/api/打头的请求都需要经过jwt验证。

app.use(koa.routes()); // 将路由规则挂载到Koa上。

app.use(historyApiFallback()); // 将这两个中间件挂载在api的路由之后
app.use(serve(path.resolve('dist'))); // 将webpack打包好的项目目录作为Koa静态文件服务的目录

```

这样就能正常返回数据了。

### Nginx配置

真正部署到服务器的时候，我们肯定不会让大家输入`域名:8889`这样的方式让大家访问。所以需要用Nginx监听80端口，把访问我们指定域名的请求引导转发给Koa服务端。

大致的`nginx.conf`如下：

```nginx
http {

  # ....
  upstream koa.server{
    server 127.0.0.1:8889;
  }

  server {
    listen   80;
    server_name xxx.xxx.com;

    location / {
      proxy_pass http://koa.server;
      proxy_redirect off;
    }

    #....
  }
  #....
}
```

如果有精力还可以配置一下Nginx的Gzip，能让请求的JS\CSS\HTML等静态文件更小，响应速度更快些。

## 写在最后

至此，我们已经完成了一个从前端到后端，从本地到服务器的完整项目。虽然它真的是个很简单的小东西，被大家也已经用其他的方式写烂了（比如用localStorage做存储）。但是它作为一个完整的前后端的DEMO，我觉得让大家入门也相对更容易一些，能够体会到全栈开发也不是想象中的“那么难”（入门的难度还是可以接受的嘛）。有了Nodejs之后我们能够做的事真的好多！

当然，由于篇幅有限，本文能够讲述东西毕竟不够多，而且讲的东西也不可能面面俱到，很多东西都是点到即止，让大家能够自己发挥。其实还想讲讲`Event Bus`的简单使用，还有分页的基本实现等等，东西太多了，一时间大家消化不了。

实际上我在做前段时间的项目的时候，也是完全不知道怎么把Vue和Koa结合起来开发。我甚至不知道怎么用Koa来提供API，我只会用Koa来做服务端渲染，比如那些JADE\EJS等模板引擎渲染的页面。所以之前那个项目做完让我自己学到良多东西，故而也分享给大家。

实际上本文的Koa的api提供的形式也尽量和RESTful靠拢了，因此你也可以学会如何通过Koa提供RESTful形式的API了。

最后放上本文项目的Github[地址](https://github.com/Molunerfinn/vue-koa-demo)，如果这个项目对你有帮助，希望大家可以fork，给我提建议，如果再有时间，可以点个Star那就更好啦~

另外，本文的版本是用Koa1写成的。仓库已经更新Koa2。从Koa1->Koa2并没有什么难度，其实很关键的两点是：

1. 用`async await`替代`yield generation`
2. 用`koa2`的中间件替代`koa1`的中间件，原因同上一条

互相学习，如果能从这个项目里学到东西我就很开心啦~

> 注： 转载需经过同意，必须署名




