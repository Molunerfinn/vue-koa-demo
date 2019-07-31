ALTER TABLE `users`
ADD COLUMN `cellphone` VARCHAR(45) NOT NULL DEFAULT '' AFTER `id`,
ADD COLUMN `password` VARCHAR(128) NOT NULL AFTER `cellphone`,
ADD UNIQUE INDEX `index_users_cellphone` (`cellphone` ASC);

ALTER TABLE `game_rounds`
ADD COLUMN `user_id` VARCHAR(45) NULL AFTER `game_id`,
ADD COLUMN `wxmp_id` VARCHAR(45) NULL AFTER `user_id`;
