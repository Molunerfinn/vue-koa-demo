# 用Vue+Koa开发完整的前后端项目-全栈开发

## 简介

本文从一名新手的角度（默认对Vue有了解，对Koa或者Express有了解）出发，从0开始构建一个数据通过Koa提供API的形式获取，页面通过Vue渲染的完整的前端项目。可以了解到Vue构建单页面的一些知识以及前端路由的使用、Koa如何提供API接口，如何进行访问引导过滤（路由）、验证（JSON-WEB-TOKEN）以及Sequelize操作Mysql数据库踩的一些小坑，希望能够作为一篇入门全栈开发的文章吧。

## 写在前面

我曾经写过一篇[文章](https://molunerfinn.com/nodejs-2/)，是用express和mongodb入门Nodejs的前后端开发，这篇文章里简单的做了一个小demo，能够让你读写mongodb数据库，并且从数据库里将数据读取出来显示到页面上。算是一个简单的读写小demo吧，也算是服务端渲染的一次初尝试。并且我还写过用nodejs写简单小爬虫的[文章](https://molunerfinn.com/nodejs-1/)，用爬虫来获取数据写入数据库。通过以上的的方法我用express写了一个小网站，记录并显示北邮人论坛每天的十大的[内容](http://topten.piegg.cn)。挺好玩的对吧，可以把想要做的事用代码来实现。

后来我接触到了Koa，并开始了学习，从express迁移到Koa其实曲线还算是比较平滑的。不过用Koa的方式也还是采用服务端渲染页面的方式。而且我发现目前网络上少有写过用Koa构建的前后端分离的应用、网站文章，我最近做的一个项目里需要用到的方式就是用Vue构建页面，数据的获取全部走后端API的形式，也就是所谓的前后端分离吧。正好在这过程中走了不少的坑，包括数据库的使用上也算是个新手，所以写篇文章记录一下，欢迎讨论，轻拍~

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
- Element(v1.1.2)
- Koa.js(v1.2.4) // 没采用Koa2
- Koa-Router\Koa-jwt\Koa-static等一系列Koa中间件
- Mysql(v2.12.0) // nodejs的mysql驱动，并不是mysql本身版本（项目采用mysql5.6）
- Sequelize(v3.28.0) // 操作数据库的ORM
- yarn(v0.19.0) // 比起npm更快一些

剩下依赖可以参考本文最后给出的项目demo仓库。

## 项目启动

Nodejs与npm的安装不再叙述（希望大家装上的node版本大于等于6.x，不然还需要加上--harmony标志才可以开启es6），默认读者已经掌握npm安装依赖的方法。首先全局安装`npm i vue-cli -g`，当然本项目基本上是采用`yarn`，所以也可以`yarn global add vue-cli`。

> Tips: 可以给yarn换上淘宝源，速度更快: `yarn config set registry "https://registry.npm.taobao.org"`

然后我们初始化一个`Vue2的webpack`的模板：

`vue init webpack demo`

> Tips: 上面的demo可以填写你自己的项目名称

然后进行一些基本配置选择之后，你就可以得到一个基本的`vue-cli`生成的项目结构。

接着我们进入`vue-cli`生成的目录，安装`Vue`的项目依赖并安装`Koa`的项目依赖：`yarn && yarn add koa koa-router koa-logger koa-json koa-bodyparser`，然后进行一些基本目录建立：

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
  , logger = require('koa-logger');

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.on('error', function(err, ctx){
  console.log('server error', err);
});

app.use(koa.routes());

console.log('Koa is listening in 8889');

app.listen(8889);

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
                <div class="todo-list" v-if="item.isDone == false">
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
              <div class="todo-list" v-if="item.isDone == true">
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
        this.list[i].isDone == true ? count += 1 : '';
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
        isDone: false,
        content: this.todos
      }
      this.list.push(obj);
      this.todos = '';
    },
    finished(index) {
      this.$set(this.list[index],'isDone',true) // 通过set的方法让数组的变动能够让Vue检测到
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
      this.$set(this.list[index],'isDone',false)
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

1. `v-if`和`v-for`放在一个元素内同时使用，因为Vue总会先执行`v-for`，替代地，你可以使用一个额外的`template`元素用来放置`v-if`或者`v-for`从而达到同样的目的。这是相关的[issue](https://github.com/vuejs/vue/issues/3106)。

2. 计算属性对于直接的数据比如`a: 2`这样的数据变动可以直接检测到。但是如果是本例中的`list`的某一项的`isDone`这个属性变化了，如果我们直接使用`list[index].isDone = true`这样的写法的话，Vue将无法检测到数据变动。替代地，可以使用`set`方法（全局是`Vue.set()`，实例中是`this.$set()`)，通过`set`方法可以让数据的变动变得可以被检测到。从而让计算属性能够捕捉到变化。可以参考官方文档对于响应式原理的[描述](https://cn.vuejs.org/v2/guide/reactivity.html)。

写完`TodoList`之后，我们需要将它和`vue-router`配合起来，从而使这个单页应用能够进行页面跳转。

### 页面路由

由于不采用服务端渲染，所以页面路由走的是前端路由。安装一下`vue-router`：`yarn add vue-router`。

安装好后，我们挂载一下路由。打开`APP.vue`文件改写如下：

```js
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
  ······

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

至此，我们已经完成了一个纯前端的单页应用，能够进行页面跳转，能够做简单的ToDoList的添加和删除和还原。当然这个东西只能算是个能看不能用的东西——因为登录系统有名无实、ToDoList只要页面刷新一下就没了。

于是我们可以先把前端放一放。开启我们的后端之旅。



