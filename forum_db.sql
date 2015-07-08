-- MySQL dump 10.13  Distrib 5.5.43, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: forum_db
-- ------------------------------------------------------
-- Server version	5.5.43-0ubuntu0.14.04.1

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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `userid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `usergroupid` smallint(5) unsigned NOT NULL DEFAULT '0',
  `membergroupids` char(250) NOT NULL DEFAULT '',
  `displaygroupid` smallint(5) unsigned NOT NULL DEFAULT '0',
  `username` varchar(100) NOT NULL DEFAULT '',
  `password` char(32) NOT NULL DEFAULT '',
  `passworddate` date NOT NULL DEFAULT '0000-00-00',
  `email` char(100) NOT NULL DEFAULT '',
  `styleid` smallint(5) unsigned NOT NULL DEFAULT '0',
  `parentemail` char(50) NOT NULL DEFAULT '',
  `homepage` char(100) NOT NULL DEFAULT '',
  `icq` char(20) NOT NULL DEFAULT '',
  `aim` char(20) NOT NULL DEFAULT '',
  `yahoo` char(32) NOT NULL DEFAULT '',
  `msn` char(100) NOT NULL DEFAULT '',
  `skype` char(32) NOT NULL DEFAULT '',
  `showvbcode` smallint(5) unsigned NOT NULL DEFAULT '0',
  `showbirthday` smallint(5) unsigned NOT NULL DEFAULT '2',
  `usertitle` char(250) NOT NULL DEFAULT '',
  `customtitle` smallint(6) NOT NULL DEFAULT '0',
  `joindate` int(10) unsigned NOT NULL DEFAULT '0',
  `daysprune` smallint(6) NOT NULL DEFAULT '0',
  `lastvisit` int(10) unsigned NOT NULL DEFAULT '0',
  `lastactivity` int(10) unsigned NOT NULL DEFAULT '0',
  `lastpost` int(10) unsigned NOT NULL DEFAULT '0',
  `lastpostid` int(10) unsigned NOT NULL DEFAULT '0',
  `posts` int(10) unsigned NOT NULL DEFAULT '0',
  `reputation` int(11) NOT NULL DEFAULT '10',
  `reputationlevelid` int(10) unsigned NOT NULL DEFAULT '1',
  `timezoneoffset` char(4) NOT NULL DEFAULT '',
  `pmpopup` smallint(6) NOT NULL DEFAULT '0',
  `avatarid` smallint(6) NOT NULL DEFAULT '0',
  `avatarrevision` int(10) unsigned NOT NULL DEFAULT '0',
  `profilepicrevision` int(10) unsigned NOT NULL DEFAULT '0',
  `sigpicrevision` int(10) unsigned NOT NULL DEFAULT '0',
  `options` int(10) unsigned NOT NULL DEFAULT '33570831',
  `birthday` char(10) NOT NULL DEFAULT '',
  `birthday_search` date NOT NULL DEFAULT '0000-00-00',
  `maxposts` smallint(6) NOT NULL DEFAULT '-1',
  `startofweek` smallint(6) NOT NULL DEFAULT '1',
  `ipaddress` char(15) NOT NULL DEFAULT '',
  `referrerid` int(10) unsigned NOT NULL DEFAULT '0',
  `languageid` smallint(5) unsigned NOT NULL DEFAULT '0',
  `emailstamp` int(10) unsigned NOT NULL DEFAULT '0',
  `threadedmode` smallint(5) unsigned NOT NULL DEFAULT '0',
  `autosubscribe` smallint(6) NOT NULL DEFAULT '-1',
  `pmtotal` smallint(5) unsigned NOT NULL DEFAULT '0',
  `pmunread` smallint(5) unsigned NOT NULL DEFAULT '0',
  `salt` char(30) NOT NULL DEFAULT '',
  `ipoints` int(10) unsigned NOT NULL DEFAULT '0',
  `infractions` int(10) unsigned NOT NULL DEFAULT '0',
  `warnings` int(10) unsigned NOT NULL DEFAULT '0',
  `infractiongroupids` varchar(255) NOT NULL DEFAULT '',
  `infractiongroupid` smallint(5) unsigned NOT NULL DEFAULT '0',
  `adminoptions` int(10) unsigned NOT NULL DEFAULT '0',
  `profilevisits` int(10) unsigned NOT NULL DEFAULT '0',
  `friendcount` int(10) unsigned NOT NULL DEFAULT '0',
  `friendreqcount` int(10) unsigned NOT NULL DEFAULT '0',
  `vmunreadcount` int(10) unsigned NOT NULL DEFAULT '0',
  `vmmoderatedcount` int(10) unsigned NOT NULL DEFAULT '0',
  `socgroupinvitecount` int(10) unsigned NOT NULL DEFAULT '0',
  `socgroupreqcount` int(10) unsigned NOT NULL DEFAULT '0',
  `pcunreadcount` int(10) unsigned NOT NULL DEFAULT '0',
  `pcmoderatedcount` int(10) unsigned NOT NULL DEFAULT '0',
  `gmmoderatedcount` int(10) unsigned NOT NULL DEFAULT '0',
  `assetposthash` varchar(32) NOT NULL DEFAULT '',
  `fbuserid` varchar(255) NOT NULL DEFAULT '',
  `fbjoindate` int(10) unsigned NOT NULL DEFAULT '0',
  `fbname` varchar(255) NOT NULL DEFAULT '',
  `logintype` enum('vb','fb') NOT NULL DEFAULT 'vb',
  `fbaccesstoken` varchar(255) NOT NULL DEFAULT '',
  `newrepcount` smallint(5) unsigned NOT NULL DEFAULT '0',
  `bloggroupreqcount` int(10) unsigned NOT NULL DEFAULT '0',
  `showblogcss` int(11) NOT NULL DEFAULT '1',
  `panjo_selling` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`userid`),
  KEY `usergroupid` (`usergroupid`),
  KEY `username` (`username`),
  KEY `birthday` (`birthday`,`showbirthday`),
  KEY `birthday_search` (`birthday_search`),
  KEY `referrerid` (`referrerid`),
  KEY `fbuserid` (`fbuserid`),
  KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,6,'',0,'Admin','ef802d3cdff2501f7367c0f6ed7d5190','2015-03-27','theadmin@mydomain.com',0,'','','','','','','',2,2,'Administrator',0,1427491380,0,1428538837,1428538837,1427493480,1,1,10,1,'0',0,0,0,0,0,11552855,'','0000-00-00',-1,1,'',0,0,0,0,-1,0,0,'AO9K$v\\`KEqz}FpO-*>~(tawU<,+#P',0,0,0,'',0,0,0,0,0,0,0,0,0,0,0,0,'','',0,'','vb','',0,0,1,NULL),(2,7,'',0,'Moderator','5ede215e5ab431bea6ad35294716807e','2015-03-27','themod@mydomain.com',0,'','','','','','','',0,2,'',0,0,0,0,0,0,0,0,10,1,'',0,0,0,0,0,33570831,'','0000-00-00',-1,1,'',0,0,0,0,-1,0,0,'fOzv23%^Lzfdv!@3%$LgfgaZLXVC',0,0,0,'',0,0,0,0,0,0,0,0,0,0,0,0,'','',0,'','vb','',0,0,1,NULL),(3,9,'',0,'User1','980a88d12c933fe1d0d929f3ef7fc33f','2015-03-27','theuser1@mydomain.com',0,'','','','','','','',0,2,'',0,0,0,0,0,0,0,500,10,1,'',0,0,0,0,0,33570831,'','0000-00-00',-1,1,'',0,0,0,0,-1,0,0,'Av%i_p-ERkE6nESM3LF!&b5Ip@K86T',0,0,0,'',0,0,0,0,0,0,0,0,0,0,0,0,'','',0,'','vb','',0,0,1,NULL),(4,9,'',0,'User2','fe90fdcb46d0737d9d231dac9a1027be','2015-03-27','theuser2@mydomain.com',0,'','','','','','','',0,2,'',0,0,0,0,0,0,0,200,10,1,'',0,0,0,0,0,33570831,'','0000-00-00',-1,1,'',0,0,0,0,-1,0,0,'O0Gfy6h8xcOxo$W(d#z(8zP2ul7-qG',0,0,0,'',0,0,0,0,0,0,0,0,0,0,0,0,'','',0,'','vb','',0,0,1,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `session` (
  `sessionhash` char(32) NOT NULL DEFAULT '',
  `userid` int(10) unsigned NOT NULL DEFAULT '0',
  `host` char(15) NOT NULL DEFAULT '',
  `idhash` char(32) NOT NULL DEFAULT '',
  `lastactivity` int(10) unsigned NOT NULL DEFAULT '0',
  `location` char(255) NOT NULL DEFAULT '',
  `useragent` char(100) NOT NULL DEFAULT '',
  `styleid` smallint(5) unsigned NOT NULL DEFAULT '0',
  `languageid` smallint(5) unsigned NOT NULL DEFAULT '0',
  `loggedin` smallint(5) unsigned NOT NULL DEFAULT '0',
  `inforum` smallint(5) unsigned NOT NULL DEFAULT '0',
  `inthread` int(10) unsigned NOT NULL DEFAULT '0',
  `incalendar` smallint(5) unsigned NOT NULL DEFAULT '0',
  `badlocation` smallint(5) unsigned NOT NULL DEFAULT '0',
  `bypass` tinyint(4) NOT NULL DEFAULT '0',
  `profileupdate` smallint(5) unsigned NOT NULL DEFAULT '0',
  `apiclientid` int(10) unsigned NOT NULL DEFAULT '0',
  `apiaccesstoken` varchar(32) NOT NULL DEFAULT '',
  `isbot` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`sessionhash`),
  KEY `last_activity` (`lastactivity`) USING BTREE,
  KEY `user_activity` (`userid`,`lastactivity`) USING BTREE,
  KEY `guest_lookup` (`idhash`,`host`,`userid`),
  KEY `apiaccesstoken` (`apiaccesstoken`)
) ENGINE=MEMORY DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `strikes`
--

DROP TABLE IF EXISTS `strikes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `strikes` (
  `striketime` int(10) unsigned NOT NULL DEFAULT '0',
  `strikeip` char(15) NOT NULL DEFAULT '',
  `username` varchar(100) NOT NULL DEFAULT '',
  KEY `striketime` (`striketime`),
  KEY `strikeip` (`strikeip`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `strikes`
--

LOCK TABLES `strikes` WRITE;
/*!40000 ALTER TABLE `strikes` DISABLE KEYS */;
/*!40000 ALTER TABLE `strikes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-07-07 16:01:28
