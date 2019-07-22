ALTER TABLE `wechatmore_dev`.`users`
ADD COLUMN `cellphone` VARCHAR(45) NOT NULL DEFAULT '' AFTER `id`,
ADD COLUMN `password` VARCHAR(255) NOT NULL AFTER `cellphone`,
ADD UNIQUE INDEX `cellphone_UNIQUE` (`cellphone` ASC);

ALTER TABLE `wechatmore_dev`.`game_rounds`
ADD COLUMN `user_id` VARCHAR(45) NULL AFTER `game_id`,
ADD COLUMN `wxmp_id` VARCHAR(45) NULL AFTER `user_id`;
