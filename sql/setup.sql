-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: wechatmore_dev
-- ------------------------------------------------------
-- Server version	5.7.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `DpYiyGamePlayers`
--

DROP TABLE IF EXISTS `DpYiyGamePlayers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DpYiyGamePlayers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) NOT NULL DEFAULT '',
  `game_round_id` bigint(11) NOT NULL DEFAULT '0',
  `wechat_account_id` bigint(11) DEFAULT NULL,
  `nickname` varchar(128) DEFAULT NULL,
  `rank` bigint(11) NOT NULL DEFAULT '0',
  `score` bigint(11) NOT NULL DEFAULT '0',
  `avatar` varchar(300) NOT NULL DEFAULT '',
  `cellphone` varchar(64) NOT NULL DEFAULT '',
  `realname` varchar(64) NOT NULL DEFAULT '',
  `token` varchar(64) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `api_logs`
--

DROP TABLE IF EXISTS `api_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `api_vendor` int(11) NOT NULL DEFAULT '0',
  `game_round_id` int(11) DEFAULT NULL,
  `game_player_id` int(11) DEFAULT NULL,
  `api_request_url` varchar(255) DEFAULT NULL,
  `api_param` text,
  `api_reponse` text,
  `memo` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=571 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ar_internal_metadata`
--

DROP TABLE IF EXISTS `ar_internal_metadata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ar_internal_metadata` (
  `key` varchar(255) CHARACTER SET utf8 NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `campaign_settings`
--

DROP TABLE IF EXISTS `campaign_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `campaign_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) DEFAULT NULL,
  `wx_qrcode_file_name` varchar(255) DEFAULT NULL,
  `wx_qrcode_content_type` varchar(255) DEFAULT NULL,
  `wx_qrcode_file_size` int(11) DEFAULT NULL,
  `wx_qrcode_updated_at` datetime DEFAULT NULL,
  `wx_name` varchar(255) DEFAULT NULL,
  `wx_status` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_campaign_settings_on_campaign_id` (`campaign_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `campaigns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `creator_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `pv` int(11) NOT NULL DEFAULT '0',
  `uv` int(11) NOT NULL DEFAULT '0',
  `genre` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT '0',
  `wx_qrcode_file_name` varchar(255) DEFAULT NULL,
  `wx_qrcode_content_type` varchar(255) DEFAULT NULL,
  `wx_qrcode_file_size` int(11) DEFAULT NULL,
  `wx_qrcode_updated_at` datetime DEFAULT NULL,
  `wx_name` varchar(255) DEFAULT NULL,
  `wx_status` int(11) DEFAULT NULL,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `host` varchar(255) DEFAULT NULL,
  `desc` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_campaigns_on_creator_id` (`creator_id`) USING BTREE,
  CONSTRAINT `fk_rails_6a6fe9ea9a` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cities` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `province_id` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `name_en` varchar(255) DEFAULT NULL,
  `name_abbr` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_cities_on_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=352 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `companies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `desc` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `devise_usage_logs`
--

DROP TABLE IF EXISTS `devise_usage_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `devise_usage_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_ip` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_devise_usage_logs_on_user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `districts`
--

DROP TABLE IF EXISTS `districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `districts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `city_id` int(11) DEFAULT NULL,
  `name_en` varchar(255) DEFAULT NULL,
  `name_abbr` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_districts_on_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2863 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dppintu_game_players`
--

DROP TABLE IF EXISTS `dppintu_game_players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dppintu_game_players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) NOT NULL DEFAULT '',
  `game_round_id` bigint(11) NOT NULL DEFAULT '0',
  `nickname` varchar(128) DEFAULT NULL,
  `rank` bigint(11) NOT NULL DEFAULT '0',
  `score` float(10,2) NOT NULL DEFAULT '0.00',
  `max_score` float(10,2) NOT NULL DEFAULT '0.00',
  `avatar` varchar(300) NOT NULL DEFAULT '',
  `cellphone` varchar(64) NOT NULL DEFAULT '',
  `realname` varchar(64) NOT NULL DEFAULT '',
  `token` varchar(64) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5004 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dppintu_game_results`
--

DROP TABLE IF EXISTS `dppintu_game_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dppintu_game_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_round_id` bigint(11) NOT NULL DEFAULT '0',
  `game_player_id` bigint(11) NOT NULL DEFAULT '0',
  `to_game_player_id` bigint(11) NOT NULL DEFAULT '0',
  `score` float(10,2) NOT NULL DEFAULT '0.00',
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dppintu_game_rounds`
--

DROP TABLE IF EXISTS `dppintu_game_rounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dppintu_game_rounds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` bigint(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `state` varchar(24) DEFAULT 'created',
  `creator_id` bigint(11) DEFAULT NULL,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `desc` text,
  `award_desc` text,
  `duration` bigint(11) NOT NULL DEFAULT '0',
  `code` varchar(24) NOT NULL DEFAULT '',
  `appid` varchar(64) NOT NULL DEFAULT '',
  `contact_required` tinyint(1) NOT NULL DEFAULT '1',
  `number` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `zhaobaba_number` (`number`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dpyiy_game_days`
--

DROP TABLE IF EXISTS `dpyiy_game_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dpyiy_game_days` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_round_id` bigint(11) NOT NULL DEFAULT '0',
  `game_player_id` bigint(11) NOT NULL DEFAULT '0',
  `day` date NOT NULL,
  `visit_count` bigint(11) NOT NULL DEFAULT '0',
  `share_count` bigint(11) NOT NULL DEFAULT '0',
  `play_count` bigint(11) NOT NULL DEFAULT '0',
  `ip` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dpyiy_game_players`
--

DROP TABLE IF EXISTS `dpyiy_game_players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dpyiy_game_players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) NOT NULL DEFAULT '',
  `game_round_id` bigint(11) NOT NULL DEFAULT '0',
  `wechat_account_id` bigint(11) DEFAULT NULL,
  `nickname` varchar(128) DEFAULT NULL,
  `rank` bigint(11) NOT NULL DEFAULT '0',
  `score` bigint(11) NOT NULL DEFAULT '0',
  `avatar` varchar(300) NOT NULL DEFAULT '',
  `cellphone` varchar(64) NOT NULL DEFAULT '',
  `realname` varchar(64) NOT NULL DEFAULT '',
  `token` varchar(64) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dpyiy_game_results`
--

DROP TABLE IF EXISTS `dpyiy_game_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dpyiy_game_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_round_id` bigint(11) NOT NULL DEFAULT '0',
  `game_player_id` bigint(11) NOT NULL DEFAULT '0',
  `to_game_player_id` bigint(11) NOT NULL DEFAULT '0',
  `score` bigint(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dpyiy_game_rounds`
--

DROP TABLE IF EXISTS `dpyiy_game_rounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dpyiy_game_rounds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` bigint(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `creator_id` bigint(11) DEFAULT NULL,
  `state` varchar(24) DEFAULT 'created',
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `desc` text,
  `award_desc` text,
  `duration` bigint(11) DEFAULT '0',
  `code` varchar(24) NOT NULL DEFAULT '',
  `appid` varchar(64) NOT NULL DEFAULT '',
  `contact_required` tinyint(1) NOT NULL DEFAULT '1',
  `initial_score` bigint(11) DEFAULT '0',
  `final_score` bigint(11) DEFAULT '0',
  `unit_score` bigint(11) DEFAULT '0',
  `number` varchar(45) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `number` (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_award_players`
--

DROP TABLE IF EXISTS `game_award_players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_award_players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_round_id` int(11) DEFAULT NULL,
  `game_player_id` int(11) DEFAULT NULL,
  `game_award_id` int(11) DEFAULT NULL,
  `scores` int(11) NOT NULL DEFAULT '0',
  `certificate_code` varchar(255) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `award_time` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `index_game_award_players_on_game_award_id` (`game_award_id`) USING BTREE,
  KEY `index_game_award_players_on_game_player_id` (`game_player_id`) USING BTREE,
  KEY `index_game_award_players_on_game_round_id` (`game_round_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_awards`
--

DROP TABLE IF EXISTS `game_awards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_awards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_round_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `prize_count` int(11) NOT NULL DEFAULT '0',
  `prize_name` varchar(255) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `score` int(11) NOT NULL DEFAULT '0',
  `money` int(11) NOT NULL DEFAULT '0',
  `at_percent` float NOT NULL DEFAULT '0',
  `day_play_count_limit` int(11) NOT NULL DEFAULT '0',
  `day_share_plus` int(11) NOT NULL DEFAULT '0',
  `game_cdays_required` int(11) NOT NULL DEFAULT '0',
  `game_days_required` int(11) NOT NULL DEFAULT '0',
  `wx_card_id` varchar(255) DEFAULT NULL,
  `day_first_achieved_required` tinyint(1) NOT NULL DEFAULT '0',
  `day_probability` int(11) NOT NULL DEFAULT '0',
  `day_prize_count` int(11) NOT NULL DEFAULT '0',
  `now_date` date DEFAULT NULL,
  `now_prize_count` int(11) NOT NULL DEFAULT '0',
  `taxon` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `index_game_awards_on_game_round_id` (`game_round_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_days`
--

DROP TABLE IF EXISTS `game_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_days` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_player_id` int(11) DEFAULT NULL,
  `day` date DEFAULT NULL,
  `play_count` int(11) NOT NULL DEFAULT '0',
  `share_count` int(11) NOT NULL DEFAULT '0',
  `exercise_count` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `visit_count` int(11) NOT NULL DEFAULT '0',
  `lot_count` int(11) NOT NULL DEFAULT '0',
  `award_count` int(11) NOT NULL DEFAULT '0',
  `game_results_count` int(11) NOT NULL DEFAULT '0',
  `paid` tinyint(1) NOT NULL DEFAULT '0',
  `game_round_id` int(11) NOT NULL DEFAULT '0',
  `ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_players`
--

DROP TABLE IF EXISTS `game_players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) NOT NULL,
  `game_round_id` int(11) DEFAULT NULL,
  `wechat_account_id` int(11) DEFAULT NULL,
  `nickname` varchar(128) NOT NULL DEFAULT '',
  `avatar` varchar(300) NOT NULL DEFAULT '',
  `aasm_state` int(11) NOT NULL DEFAULT '0',
  `position` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `score` int(11) NOT NULL DEFAULT '0',
  `max_score` int(11) NOT NULL DEFAULT '0',
  `play_time` int(11) NOT NULL DEFAULT '0',
  `realname` varchar(255) NOT NULL DEFAULT '',
  `cellphone` varchar(255) NOT NULL DEFAULT '',
  `rank` int(11) NOT NULL DEFAULT '0',
  `cache_free_at` datetime DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `birth` date DEFAULT NULL,
  `votes_count` int(11) NOT NULL DEFAULT '0',
  `memo` varchar(255) DEFAULT NULL,
  `score_token` varchar(64) DEFAULT NULL,
  `cardid` varchar(32) DEFAULT NULL,
  `state` int(11) NOT NULL DEFAULT '0',
  `token` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30442 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_results`
--

DROP TABLE IF EXISTS `game_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `score` int(11) NOT NULL DEFAULT '0',
  `game_player_id` int(11) DEFAULT NULL,
  `trail` text,
  `trail_score` int(11) NOT NULL DEFAULT '0',
  `ip` varchar(255) DEFAULT NULL,
  `memo` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `realname` varchar(255) DEFAULT NULL,
  `cellphone` varchar(255) DEFAULT NULL,
  `game_round_id` int(11) DEFAULT NULL,
  `delivery_room` varchar(255) DEFAULT NULL,
  `game_day_id` bigint(20) DEFAULT NULL,
  `time_span` int(11) NOT NULL DEFAULT '0',
  `is_best` tinyint(1) NOT NULL DEFAULT '0',
  `to_game_player_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `index_game_results_on_game_day_id` (`game_day_id`)
) ENGINE=InnoDB AUTO_INCREMENT=555 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_round_assets`
--

DROP TABLE IF EXISTS `game_round_assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_round_assets` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `desc` text,
  `game_round_id` int(11) DEFAULT NULL,
  `game_player_id` int(11) DEFAULT NULL,
  `attachment_file_name` varchar(255) DEFAULT NULL,
  `attachment_content_type` varchar(255) DEFAULT NULL,
  `attachment_file_size` int(11) DEFAULT NULL,
  `attachment_updated_at` datetime DEFAULT NULL,
  `type` varchar(75) DEFAULT NULL,
  `viewable_type` varchar(255) DEFAULT NULL,
  `viewable_id` bigint(20) DEFAULT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_game_round_assets_on_viewable_type_and_viewable_id` (`viewable_type`,`viewable_id`),
  KEY `index_assets_on_game_round_id_and_type` (`game_round_id`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_round_bargains`
--

DROP TABLE IF EXISTS `game_round_bargains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_round_bargains` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` bigint(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `creator_id` bigint(11) DEFAULT NULL,
  `state` bigint(11) DEFAULT '0',
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `desc` text,
  `award_desc` text,
  `duration` bigint(11) DEFAULT '0',
  `code` varchar(24) NOT NULL DEFAULT '',
  `appid` varchar(64) NOT NULL DEFAULT '',
  `contact_required` tinyint(1) NOT NULL DEFAULT '1',
  `initial_score` bigint(11) DEFAULT '0',
  `final_score` bigint(11) DEFAULT '0',
  `unit_score` bigint(11) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_rounds`
--

DROP TABLE IF EXISTS `game_rounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_rounds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL,
  `creator_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `preferences` varchar(255) DEFAULT NULL,
  `desc` text,
  `award_desc` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `wx_keyword` varchar(255) NOT NULL DEFAULT '',
  `contact_required` tinyint(1) NOT NULL DEFAULT '0',
  `awards` int(11) NOT NULL DEFAULT '0',
  `award_counts` varchar(255) DEFAULT NULL,
  `display_players` int(11) NOT NULL DEFAULT '0',
  `duration` int(11) NOT NULL,
  `gear` int(11) NOT NULL,
  `countdown` int(11) NOT NULL DEFAULT '0',
  `aasm_state` int(11) NOT NULL DEFAULT '0',
  `play_times` int(11) NOT NULL DEFAULT '0',
  `close_at` datetime DEFAULT NULL,
  `open_at` datetime DEFAULT NULL,
  `award_times` int(11) NOT NULL DEFAULT '0',
  `code` varchar(255) NOT NULL DEFAULT '',
  `screen_style` int(11) NOT NULL DEFAULT '0',
  `cache_free_at` datetime DEFAULT NULL,
  `appid` varchar(64) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `relative_game_round_id` int(11) DEFAULT NULL,
  `host_name` varchar(255) DEFAULT NULL,
  `team1_id` int(11) DEFAULT NULL,
  `team2_id` int(11) DEFAULT NULL,
  `match_start_at` datetime DEFAULT NULL,
  `match_end_at` datetime DEFAULT NULL,
  `state` varchar(24) NOT NULL DEFAULT 'created',
  `final_score` int(11) NOT NULL DEFAULT '0',
  `initial_score` int(11) NOT NULL DEFAULT '0',
  `unit_score` int(11) NOT NULL DEFAULT '0',
  `number` varchar(45) DEFAULT NULL,
  `host` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_game_rounds_on_campaign_id` (`campaign_id`) USING BTREE,
  KEY `index_game_rounds_on_creator_id` (`creator_id`) USING BTREE,
  KEY `index_game_rounds_on_game_id` (`game_id`) USING BTREE,
  KEY `game_rounds_number` (`number`),
  CONSTRAINT `fk_rails_1b12f8b206` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`),
  CONSTRAINT `fk_rails_1fad632fad` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_rails_c227274a3b` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=234 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_teams`
--

DROP TABLE IF EXISTS `game_teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_teams` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `game_round_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `flag_url` varchar(255) DEFAULT NULL,
  `flag_name` varchar(255) DEFAULT NULL,
  `desc` text,
  `disabled` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `code` int(11) DEFAULT '0',
  `desc` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `wx_oauth2_scope` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ido_game_rounds`
--

DROP TABLE IF EXISTS `ido_game_rounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ido_game_rounds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` bigint(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `creator_id` bigint(11) DEFAULT NULL,
  `default_store_id` varchar(24) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ido_gameround_store_gifts`
--

DROP TABLE IF EXISTS `ido_gameround_store_gifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ido_gameround_store_gifts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_round_id` bigint(11) NOT NULL DEFAULT '0',
  `store_id` bigint(11) NOT NULL DEFAULT '0',
  `gift_id` bigint(11) NOT NULL DEFAULT '0',
  `qty` bigint(11) NOT NULL DEFAULT '0',
  `info` varchar(255) NOT NULL DEFAULT 'null',
  `remaining` bigint(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ido_gifts`
--

DROP TABLE IF EXISTS `ido_gifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ido_gifts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gift_id` bigint(11) NOT NULL DEFAULT '0',
  `gift_name` varchar(255) NOT NULL DEFAULT 'null',
  `image_name` varchar(255) NOT NULL DEFAULT 'null',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ido_player_infos`
--

DROP TABLE IF EXISTS `ido_player_infos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ido_player_infos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` bigint(11) NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL DEFAULT 'null',
  `tel` bigint(11) NOT NULL DEFAULT '0',
  `birth` varchar(255) NOT NULL DEFAULT 'null',
  `default_store_id` bigint(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ido_players`
--

DROP TABLE IF EXISTS `ido_players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ido_players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` bigint(11) NOT NULL DEFAULT '0',
  `nickname` varchar(255) NOT NULL DEFAULT 'null',
  `headurl` varchar(255) NOT NULL DEFAULT 'null',
  `to_player_id` bigint(11) NOT NULL DEFAULT '0',
  `default_store_id` bigint(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ido_results`
--

DROP TABLE IF EXISTS `ido_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ido_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` bigint(11) NOT NULL DEFAULT '0',
  `to_player_id` bigint(11) NOT NULL DEFAULT '0',
  `createtime` varchar(255) NOT NULL DEFAULT 'null',
  `sourceid` varchar(255) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ido_stores`
--

DROP TABLE IF EXISTS `ido_stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ido_stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` bigint(11) NOT NULL DEFAULT '0',
  `store_name` varchar(255) NOT NULL DEFAULT '0',
  `tel` bigint(11) NOT NULL DEFAULT '0',
  `remaining` bigint(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photographs`
--

DROP TABLE IF EXISTS `photographs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photographs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_player_id` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `desc` text,
  `image_file_name` varchar(255) DEFAULT NULL,
  `image_content_type` varchar(255) DEFAULT NULL,
  `image_file_size` int(11) DEFAULT NULL,
  `image_updated_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pintu_game_players`
--

DROP TABLE IF EXISTS `pintu_game_players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pintu_game_players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) NOT NULL DEFAULT '',
  `game_round_id` bigint(11) NOT NULL DEFAULT '0',
  `nickname` varchar(128) DEFAULT NULL,
  `rank` bigint(11) NOT NULL DEFAULT '0',
  `score` float(10,2) NOT NULL DEFAULT '0.00',
  `max_score` float(10,2) NOT NULL DEFAULT '0.00',
  `avatar` varchar(300) NOT NULL DEFAULT '',
  `cellphone` varchar(64) NOT NULL DEFAULT '',
  `realname` varchar(64) NOT NULL DEFAULT '',
  `token` varchar(64) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pintu_game_results`
--

DROP TABLE IF EXISTS `pintu_game_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pintu_game_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_round_id` bigint(11) NOT NULL DEFAULT '0',
  `game_player_id` bigint(11) NOT NULL DEFAULT '0',
  `to_game_player_id` bigint(11) NOT NULL DEFAULT '0',
  `score` float(10,2) NOT NULL DEFAULT '0.00',
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `provinces`
--

DROP TABLE IF EXISTS `provinces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `provinces` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `name_en` varchar(255) DEFAULT NULL,
  `name_abbr` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_provinces_on_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `schema_migrations`
--

DROP TABLE IF EXISTS `schema_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schema_migrations` (
  `version` varchar(255) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `player_limit` int(11) NOT NULL DEFAULT '0',
  `address` varchar(255) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(128) NOT NULL DEFAULT '',
  `encrypted_password` varchar(255) NOT NULL DEFAULT '',
  `reset_password_token` varchar(128) DEFAULT NULL,
  `reset_password_sent_at` datetime DEFAULT NULL,
  `remember_created_at` datetime DEFAULT NULL,
  `sign_in_count` int(11) NOT NULL DEFAULT '0',
  `current_sign_in_at` datetime DEFAULT NULL,
  `last_sign_in_at` datetime DEFAULT NULL,
  `current_sign_in_ip` varchar(255) DEFAULT NULL,
  `last_sign_in_ip` varchar(255) DEFAULT NULL,
  `confirmation_token` varchar(128) DEFAULT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `confirmation_sent_at` datetime DEFAULT NULL,
  `unconfirmed_email` varchar(255) DEFAULT NULL,
  `failed_attempts` int(11) NOT NULL DEFAULT '0',
  `unlock_token` varchar(128) DEFAULT NULL,
  `locked_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT 'guest',
  `username` varchar(64) NOT NULL DEFAULT '',
  `api_token` varchar(255) NOT NULL DEFAULT '',
  `company_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_users_on_email` (`email`) USING BTREE,
  UNIQUE KEY `index_users_on_username` (`username`) USING BTREE,
  UNIQUE KEY `index_users_on_confirmation_token` (`confirmation_token`) USING BTREE,
  UNIQUE KEY `index_users_on_reset_password_token` (`reset_password_token`) USING BTREE,
  UNIQUE KEY `index_users_on_unlock_token` (`unlock_token`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_player_id` int(11) DEFAULT NULL,
  `openid` varchar(255) DEFAULT NULL,
  `voted_at` date DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wechat_accounts`
--

DROP TABLE IF EXISTS `wechat_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wechat_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uniacid` int(11) NOT NULL DEFAULT '0',
  `token` varchar(32) NOT NULL DEFAULT '',
  `access_token` varchar(255) NOT NULL DEFAULT '',
  `encoding_aes_key` varchar(255) NOT NULL DEFAULT '',
  `status` int(11) NOT NULL DEFAULT '0',
  `name` varchar(32) NOT NULL DEFAULT '',
  `account` varchar(32) NOT NULL DEFAULT '',
  `original_id` varchar(50) NOT NULL DEFAULT '',
  `signature` varchar(100) NOT NULL DEFAULT '',
  `country` varchar(24) NOT NULL DEFAULT '',
  `province` varchar(24) NOT NULL DEFAULT '',
  `city` varchar(24) NOT NULL DEFAULT '',
  `username` varchar(32) NOT NULL DEFAULT '',
  `password` varchar(32) NOT NULL DEFAULT '',
  `appid` varchar(50) NOT NULL DEFAULT '',
  `appsecret` varchar(50) NOT NULL DEFAULT '',
  `subscribeurl` varchar(120) NOT NULL DEFAULT '',
  `auth_refresh_token` varchar(255) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wechat_sessions`
--

DROP TABLE IF EXISTS `wechat_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wechat_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(64) NOT NULL,
  `hash_store` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_wechat_sessions_on_openid` (`openid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wx_component_secrets`
--

DROP TABLE IF EXISTS `wx_component_secrets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wx_component_secrets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `preauthcode` varchar(255) DEFAULT NULL,
  `ticket_updated_at` datetime DEFAULT NULL,
  `access_token_updated_at` datetime DEFAULT NULL,
  `preauthcode_updated_at` datetime DEFAULT NULL,
  `access_token_expires_in` int(11) DEFAULT NULL,
  `preauthcode_expires_in` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wx_follower_tokens`
--

DROP TABLE IF EXISTS `wx_follower_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wx_follower_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) DEFAULT NULL,
  `wx_token` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wx_followers`
--

DROP TABLE IF EXISTS `wx_followers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wx_followers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subscribe` int(11) DEFAULT NULL,
  `openid` varchar(255) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `sex` int(11) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `headimgurl` varchar(255) DEFAULT NULL,
  `subscribe_time` datetime DEFAULT NULL,
  `unionid` varchar(255) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `groupid` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wx_mp_users`
--

DROP TABLE IF EXISTS `wx_mp_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wx_mp_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `appid` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `nick_name` varchar(255) DEFAULT NULL,
  `head_img` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `wx_token` varchar(255) DEFAULT NULL,
  `service_type_id` int(11) DEFAULT NULL,
  `verify_type_info` varchar(255) DEFAULT NULL,
  `access_token_updated_at` datetime DEFAULT NULL,
  `access_token_expires_in` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `creator_id` int(11) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `qrcode_url` varchar(255) DEFAULT NULL,
  `auth_code` varchar(255) DEFAULT NULL,
  `func_info` text,
  `expires_in` int(11) NOT NULL DEFAULT '0',
  `service_type` int(11) NOT NULL DEFAULT '0',
  `bind_type` int(11) NOT NULL DEFAULT '0',
  `openid` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `app_secret` varchar(255) DEFAULT NULL,
  `app_id` varchar(255) DEFAULT NULL,
  `encrypt_mode` int(11) DEFAULT '0',
  `encoding_aes_key` varchar(255) DEFAULT NULL,
  `is_oauth` tinyint(1) NOT NULL DEFAULT '0',
  `binds_count` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `zhaobaba_game_days`
--

DROP TABLE IF EXISTS `zhaobaba_game_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zhaobaba_game_days` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_round_id` bigint(11) NOT NULL DEFAULT '0',
  `game_player_id` bigint(11) NOT NULL DEFAULT '0',
  `day` date NOT NULL,
  `visit_count` bigint(11) NOT NULL DEFAULT '0',
  `share_count` bigint(11) NOT NULL DEFAULT '0',
  `play_count` bigint(11) NOT NULL DEFAULT '0',
  `ip` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `zhaobaba_game_players`
--

DROP TABLE IF EXISTS `zhaobaba_game_players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zhaobaba_game_players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) NOT NULL DEFAULT '',
  `game_round_id` bigint(11) NOT NULL DEFAULT '0',
  `nickname` varchar(128) DEFAULT NULL,
  `rank` bigint(11) NOT NULL DEFAULT '0',
  `score` float(10,2) NOT NULL DEFAULT '0.00',
  `max_score` float(10,2) NOT NULL DEFAULT '0.00',
  `avatar` varchar(300) NOT NULL DEFAULT '',
  `cellphone` varchar(64) NOT NULL DEFAULT '',
  `realname` varchar(64) NOT NULL DEFAULT '',
  `token` varchar(64) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `zhaobaba_game_results`
--

DROP TABLE IF EXISTS `zhaobaba_game_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zhaobaba_game_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_round_id` bigint(11) NOT NULL DEFAULT '0',
  `game_player_id` bigint(11) NOT NULL DEFAULT '0',
  `to_game_player_id` bigint(11) NOT NULL DEFAULT '0',
  `score` float(10,2) NOT NULL DEFAULT '0.00',
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `zhaobaba_game_rounds`
--

DROP TABLE IF EXISTS `zhaobaba_game_rounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zhaobaba_game_rounds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` bigint(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `state` varchar(24) DEFAULT 'created',
  `creator_id` bigint(11) DEFAULT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `desc` text,
  `award_desc` text,
  `host` varchar(128) DEFAULT NULL,
  `duration` bigint(11) NOT NULL DEFAULT '0',
  `code` varchar(24) NOT NULL DEFAULT '',
  `appid` varchar(64) NOT NULL DEFAULT '',
  `contact_required` tinyint(1) NOT NULL DEFAULT '1',
  `number` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-06 16:03:17
