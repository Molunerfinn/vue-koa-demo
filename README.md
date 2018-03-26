# vue-koa-demo

A fullstack demo used Vue2 & Koa2(Koa1 version is [here](https://github.com/Molunerfinn/vue-koa-demo/tree/koa1))

:sunny: Easy to setup and learn

:100: Api test coverage

:rocket: Instant feedback 

:stuck_out_tongue_winking_eye: Vue SSR support in the [ssr](https://github.com/Molunerfinn/vue-koa-demo/tree/ssr) branch

:tada: Docker support

<p align="left">
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-green.svg?style=flat-square" alt="">
  </a>
  <a href="https://github.com/facebook/jest">
    <img src="https://img.shields.io/badge/tested_with-jest-99424f.svg?style=flat-square" alt="">
  </a>
  <a href='https://coveralls.io/github/Molunerfinn/vue-koa-demo?branch=master'>
    <img src='https://coveralls.io/repos/github/Molunerfinn/vue-koa-demo/badge.svg' alt='Coverage Status' />
  </a>
</p>

![Todolist](http://7xog0l.com1.z0.glb.clouddn.com/vue-koa-demo/todolist-5.gif 'todolist')

View the [article](https://molunerfinn.com/Vue+Koa/) for more details.

If you want to check the info of the test, view the [article](https://molunerfinn.com/Use-Jest-To-Test-Vue-Koa/) for more details.

## Install

`git clone https://github.com/Molunerfinn/vue-koa-demo.git`

`npm install` or `yarn`

Also you need to install MySQL & create a database named `todolist`,and execute 2 sql files `list.sql` & `user.sql`.Their are in `sql/`

After that, create a `.env` file and set the database username & password:

```env
# your database username
DB_USER=XXXX
# your database
DB_PASSWORD=YYYY 
# Koa is listening to this port
PORT=8889
```

If you want to run the test for the Project, please create a `.env.test` file to face this situation:

```env
# your database username
DB_USER=XXXX
# your database
DB_PASSWORD=YYYY 
# The port which is listened by koa in the test environment
PORT=8888
```

### Run

> Node.js & Docker support. **You need to create a `.env` file as above**.

### Node.js

Beacuse of using Koa2, `Node.js >= v7.6.0` is needed.

#### Development: 

`npm run dev` && `npm run server`

open browser: `localhost:8080`

> tips: login password is 123

#### Production:

`npm run start` 

open browser: `localhost:8889`

> tips: login password is 123

#### Test:

`npm run test` and find the coverage report in the `coverage/lcov/index.html`

### Docker

`docker-compose build` && `docker-compose up`

> mysql in docker use 3306 port inside & outside.

open browser: `localhost:8889`

> tips: login password is 123

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017 Molunerfinn


