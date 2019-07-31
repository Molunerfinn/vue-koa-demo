ALTER TABLE `game_photos`
ADD COLUMN `viewable_id` BIGINT(11) NULL AFTER `file_size`,
ADD COLUMN `viewable_type` VARCHAR(255) NULL AFTER `viewable_id`;
