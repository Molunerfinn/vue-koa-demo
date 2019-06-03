## 数据库表修改用到的sql
ALTER TABLE  `game_rounds` ADD COLUMN `host` VARCHAR(128) NULL AFTER `number`;

## 常用命令
1. 拷贝构建的页面到发布目录
cp -rf dist/. public


## 建立开发环境
npm install -g sequelize-cli
