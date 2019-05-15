# 数据库表修改用到的sql
ALTER TABLE `wechatmore_dev`.`game_rounds`
ADD COLUMN `host` VARCHAR(128) NULL AFTER `number`;
