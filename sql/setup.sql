DROP TABLE IF EXISTS `dppintu_game_players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dppintu_game_players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) NOT NULL DEFAULT '',
  `game_round_id` bigint(11) NOT NULL DEFAULT 0,
  `nickname` varchar(128) DEFAULT NULL,
  `rank` bigint(11) NOT NULL DEFAULT 0,
  `score` float(10,2) NOT NULL DEFAULT 0.00,
  `max_score` float(10,2) NOT NULL DEFAULT 0.00,
  `avatar` varchar(300) NOT NULL DEFAULT '',
  `cellphone` varchar(64) NOT NULL DEFAULT '',
  `realname` varchar(64) NOT NULL DEFAULT '',
  `token` varchar(64) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14518 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dppintu_game_results`
--

DROP TABLE IF EXISTS `dppintu_game_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dppintu_game_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_round_id` bigint(11) NOT NULL DEFAULT 0,
  `game_player_id` bigint(11) NOT NULL DEFAULT 0,
  `to_game_player_id` bigint(11) NOT NULL DEFAULT 0,
  `score` float(10,2) NOT NULL DEFAULT 0.00,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;
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
  `desc` text DEFAULT NULL,
  `award_desc` text DEFAULT NULL,
  `duration` bigint(11) NOT NULL DEFAULT 0,
  `code` varchar(24) NOT NULL DEFAULT '',
  `appid` varchar(64) NOT NULL DEFAULT '',
  `contact_required` tinyint(1) NOT NULL DEFAULT 1,
  `number` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `host` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dpyiy_game_days`
--

DROP TABLE IF EXISTS `dpyiy_game_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dpyiy_game_days` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_round_id` bigint(11) NOT NULL DEFAULT 0,
  `game_player_id` bigint(11) NOT NULL DEFAULT 0,
  `day` date NOT NULL,
  `visit_count` bigint(11) NOT NULL DEFAULT 0,
  `share_count` bigint(11) NOT NULL DEFAULT 0,
  `play_count` bigint(11) NOT NULL DEFAULT 0,
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
  `game_round_id` bigint(11) NOT NULL DEFAULT 0,
  `wechat_account_id` bigint(11) DEFAULT NULL,
  `nickname` varchar(128) DEFAULT NULL,
  `rank` bigint(11) NOT NULL DEFAULT 0,
  `score` float(10,2) NOT NULL DEFAULT 0.00,
  `avatar` varchar(300) NOT NULL DEFAULT '',
  `cellphone` varchar(64) NOT NULL DEFAULT '',
  `realname` varchar(64) NOT NULL DEFAULT '',
  `token` varchar(64) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `max_score` float(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dpyiy_game_results`
--

DROP TABLE IF EXISTS `dpyiy_game_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dpyiy_game_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_round_id` bigint(11) NOT NULL DEFAULT 0,
  `game_player_id` bigint(11) NOT NULL DEFAULT 0,
  `to_game_player_id` bigint(11) NOT NULL DEFAULT 0,
  `score` bigint(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4;
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
  `desc` text DEFAULT NULL,
  `award_desc` text DEFAULT NULL,
  `duration` bigint(11) DEFAULT 0,
  `code` varchar(24) NOT NULL DEFAULT '',
  `appid` varchar(64) NOT NULL DEFAULT '',
  `contact_required` tinyint(1) NOT NULL DEFAULT 1,
  `initial_score` bigint(11) DEFAULT 0,
  `final_score` bigint(11) DEFAULT 0,
  `unit_score` bigint(11) DEFAULT 0,
  `number` varchar(45) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `number` (`number`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
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
  `scores` int(11) NOT NULL DEFAULT 0,
  `certificate_code` varchar(255) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `award_time` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `index_game_award_players_on_game_award_id` (`game_award_id`),
  KEY `index_game_award_players_on_game_player_id` (`game_player_id`),
  KEY `index_game_award_players_on_game_round_id` (`game_round_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4;
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
  `prize_count` int(11) NOT NULL DEFAULT 0,
  `prize_name` varchar(255) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `score` int(11) NOT NULL DEFAULT 0,
  `money` int(11) NOT NULL DEFAULT 0,
  `at_percent` float NOT NULL DEFAULT 0,
  `day_play_count_limit` int(11) NOT NULL DEFAULT 0,
  `day_share_plus` int(11) NOT NULL DEFAULT 0,
  `game_cdays_required` int(11) NOT NULL DEFAULT 0,
  `game_days_required` int(11) NOT NULL DEFAULT 0,
  `wx_card_id` varchar(255) DEFAULT NULL,
  `day_first_achieved_required` tinyint(1) NOT NULL DEFAULT 0,
  `day_probability` int(11) NOT NULL DEFAULT 0,
  `day_prize_count` int(11) NOT NULL DEFAULT 0,
  `now_date` int(11) NOT NULL DEFAULT 0,
  `now_prize_count` int(11) NOT NULL DEFAULT 0,
  `taxon` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `index_game_awards_on_game_round_id` (`game_round_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;
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
  `play_count` int(11) NOT NULL DEFAULT 0,
  `share_count` int(11) NOT NULL DEFAULT 0,
  `exercise_count` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `visit_count` int(11) NOT NULL DEFAULT 0,
  `lot_count` int(11) NOT NULL DEFAULT 0,
  `award_count` int(11) NOT NULL DEFAULT 0,
  `game_results_count` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4;
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
  `aasm_state` int(11) NOT NULL DEFAULT 0,
  `position` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `score` float(10,2) NOT NULL DEFAULT 0.00,
  `max_score` float(10,2) NOT NULL DEFAULT 0.00,
  `play_time` int(11) NOT NULL DEFAULT 0,
  `realname` varchar(255) NOT NULL DEFAULT '',
  `cellphone` varchar(255) NOT NULL DEFAULT '',
  `rank` int(11) NOT NULL DEFAULT 0,
  `cache_free_at` datetime DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `birth` date DEFAULT NULL,
  `votes_count` int(11) NOT NULL DEFAULT 0,
  `memo` varchar(255) DEFAULT NULL,
  `score_token` varchar(64) DEFAULT NULL,
  `token` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4;
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
  `score` float(10,2) NOT NULL DEFAULT 0.00,
  `game_player_id` int(11) DEFAULT NULL,
  `to_game_player_id` int(11) DEFAULT 0,
  `trail` text DEFAULT NULL,
  `trail_score` int(11) NOT NULL DEFAULT 0,
  `ip` varchar(255) DEFAULT NULL,
  `memo` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `realname` varchar(255) DEFAULT NULL,
  `cellphone` varchar(255) DEFAULT NULL,
  `delivery_cellphone` varchar(255) DEFAULT NULL,
  `delivery_time_option` int(11) NOT NULL DEFAULT 0,
  `delivery_time_at` datetime DEFAULT NULL,
  `delivery_sms` varchar(2048) DEFAULT NULL,
  `delivery_sms_option` int(11) NOT NULL DEFAULT 0,
  `delivery_sms_at` date DEFAULT NULL,
  `game_round_id` int(11) DEFAULT NULL,
  `delivery_room` varchar(255) DEFAULT NULL,
  `game_day_id` bigint(20) DEFAULT NULL,
  `time_span` int(11) NOT NULL DEFAULT 0,
  `is_best` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `index_game_results_on_game_day_id` (`game_day_id`)
) ENGINE=InnoDB AUTO_INCREMENT=929 DEFAULT CHARSET=utf8mb4;
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
  `desc` text DEFAULT NULL,
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
  `attachment_width` int(11) DEFAULT NULL,
  `attachment_height` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_game_round_assets_on_viewable_type_and_viewable_id` (`viewable_type`,`viewable_id`),
  KEY `index_assets_on_game_round_id_and_type` (`game_round_id`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_rounds`
--

DROP TABLE IF EXISTS `game_rounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_rounds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` bigint(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT 'created',
  `creator_id` bigint(11) DEFAULT NULL,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `desc` text DEFAULT NULL,
  `award_desc` text DEFAULT NULL,
  `duration` bigint(11) DEFAULT 0,
  `code` varchar(24) NOT NULL DEFAULT 'dppintu',
  `appid` varchar(64) NOT NULL DEFAULT '',
  `contact_required` tinyint(1) NOT NULL DEFAULT 1,
  `number` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `host` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `game_rounds_number` (`number`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;
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
  `desc` text DEFAULT NULL,
  `disabled` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
  `code` int(11) DEFAULT 0,
  `desc` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `wx_oauth2_scope` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;
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
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `campaign_id` bigint(11) DEFAULT 0,
  `preferences` varchar(255) DEFAULT '',
  `desc` text DEFAULT NULL,
  `award_desc` text DEFAULT NULL,
  `wx_keyword` varchar(255) NOT NULL DEFAULT '',
  `contact_required` bigint(11) NOT NULL DEFAULT 0,
  `awards` bigint(11) NOT NULL DEFAULT 0,
  `award_counts` varchar(255) DEFAULT '',
  `display_players` bigint(11) NOT NULL DEFAULT 0,
  `duration` bigint(11) NOT NULL DEFAULT 0,
  `gear` bigint(11) NOT NULL DEFAULT 0,
  `countdown` bigint(11) NOT NULL DEFAULT 0,
  `aasm_state` bigint(11) NOT NULL DEFAULT 0,
  `play_times` bigint(11) NOT NULL DEFAULT 0,
  `close_at` datetime DEFAULT NULL,
  `open_at` datetime DEFAULT NULL,
  `award_times` bigint(11) NOT NULL DEFAULT 0,
  `code` varchar(255) NOT NULL DEFAULT 'ido',
  `screen_style` bigint(11) NOT NULL DEFAULT 0,
  `cache_free_at` datetime DEFAULT NULL,
  `appid` varchar(255) DEFAULT '',
  `company_id` bigint(11) DEFAULT 0,
  `relative_game_round_id` bigint(11) DEFAULT 0,
  `host_name` varchar(255) DEFAULT '',
  `team1_id` bigint(11) DEFAULT 0,
  `team2_id` bigint(11) DEFAULT 0,
  `match_start_at` datetime DEFAULT NULL,
  `match_end_at` datetime DEFAULT NULL,
  `default_store_id` varchar(24) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `host` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ido_gameround_store_gifts`
--

DROP TABLE IF EXISTS `ido_gameround_store_gifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ido_gameround_store_gifts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_round_id` bigint(11) NOT NULL DEFAULT 0,
  `store_id` bigint(11) NOT NULL DEFAULT 0,
  `gift_id` bigint(11) NOT NULL DEFAULT 0,
  `qty` bigint(11) NOT NULL DEFAULT 0,
  `info` varchar(255) NOT NULL DEFAULT 'null',
  `remaining` bigint(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ido_gifts`
--

DROP TABLE IF EXISTS `ido_gifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ido_gifts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gift_id` bigint(11) NOT NULL DEFAULT 0,
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
  `openid` varchar(255) NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL DEFAULT 'null',
  `tel` bigint(11) NOT NULL DEFAULT 0,
  `birth` varchar(255) NOT NULL DEFAULT 'null',
  `default_store_id` bigint(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `openid_UNIQUE` (`openid`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ido_players`
--

DROP TABLE IF EXISTS `ido_players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ido_players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) NOT NULL DEFAULT '0',
  `nickname` varchar(255) NOT NULL DEFAULT 'null',
  `headurl` varchar(255) NOT NULL DEFAULT 'null',
  `to_player_id` varchar(255) NOT NULL DEFAULT '0',
  `default_store_id` bigint(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ido_results`
--

DROP TABLE IF EXISTS `ido_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ido_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) NOT NULL DEFAULT '0',
  `to_player_id` varchar(255) NOT NULL DEFAULT '0',
  `createtime` varchar(255) NOT NULL DEFAULT 'null',
  `sourceid` varchar(255) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sourceid_UNIQUE` (`sourceid`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ido_stores`
--

DROP TABLE IF EXISTS `ido_stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ido_stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` bigint(11) NOT NULL DEFAULT 0,
  `store_name` varchar(255) NOT NULL DEFAULT '0',
  `tel` bigint(11) NOT NULL DEFAULT 0,
  `remaining` bigint(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `zhaobaba_game_days`
--

DROP TABLE IF EXISTS `zhaobaba_game_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zhaobaba_game_days` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_round_id` bigint(11) NOT NULL DEFAULT 0,
  `game_player_id` bigint(11) NOT NULL DEFAULT 0,
  `day` date NOT NULL,
  `visit_count` bigint(11) NOT NULL DEFAULT 0,
  `share_count` bigint(11) NOT NULL DEFAULT 0,
  `play_count` bigint(11) NOT NULL DEFAULT 0,
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
  `game_round_id` bigint(11) NOT NULL DEFAULT 0,
  `nickname` varchar(128) DEFAULT NULL,
  `rank` bigint(11) NOT NULL DEFAULT 0,
  `score` float(10,2) NOT NULL DEFAULT 0.00,
  `max_score` float(10,2) NOT NULL DEFAULT 0.00,
  `avatar` varchar(300) NOT NULL DEFAULT '',
  `cellphone` varchar(64) NOT NULL DEFAULT '',
  `realname` varchar(64) NOT NULL DEFAULT '',
  `token` varchar(64) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `zhaobaba_game_results`
--

DROP TABLE IF EXISTS `zhaobaba_game_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zhaobaba_game_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_round_id` bigint(11) NOT NULL DEFAULT 0,
  `game_player_id` bigint(11) NOT NULL DEFAULT 0,
  `to_game_player_id` bigint(11) NOT NULL DEFAULT 0,
  `score` float(10,2) NOT NULL DEFAULT 0.00,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
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
  `desc` text DEFAULT NULL,
  `award_desc` text DEFAULT NULL,
  `host` varchar(128) DEFAULT NULL,
  `duration` bigint(11) NOT NULL DEFAULT 0,
  `code` varchar(24) NOT NULL DEFAULT '',
  `appid` varchar(64) NOT NULL DEFAULT '',
  `contact_required` tinyint(1) NOT NULL DEFAULT 1,
  `number` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
