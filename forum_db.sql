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

--
-- Table structure for table `subscriptionlog`
--

DROP TABLE IF EXISTS `subscriptionlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscriptionlog` (
  `subscriptionlogid` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `subscriptionid` smallint(6) NOT NULL DEFAULT '0',
  `userid` int(10) unsigned NOT NULL DEFAULT '0',
  `pusergroupid` smallint(6) NOT NULL DEFAULT '0',
  `status` smallint(6) NOT NULL DEFAULT '0',
  `regdate` int(10) unsigned NOT NULL DEFAULT '0',
  `expirydate` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`subscriptionlogid`),
  KEY `userid` (`userid`,`subscriptionid`),
  KEY `subscriptionid` (`subscriptionid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptionlog`
--

LOCK TABLES `subscriptionlog` WRITE;
/*!40000 ALTER TABLE `subscriptionlog` DISABLE KEYS */;
INSERT INTO `subscriptionlog` VALUES (1,1,1,6,1,1428465240,1460087700);
/*!40000 ALTER TABLE `subscriptionlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customavatar`
--

DROP TABLE IF EXISTS `customavatar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customavatar` (
  `userid` int(10) unsigned NOT NULL DEFAULT '0',
  `filedata` mediumblob,
  `dateline` int(10) unsigned NOT NULL DEFAULT '0',
  `filename` varchar(100) NOT NULL DEFAULT '',
  `visible` smallint(6) NOT NULL DEFAULT '1',
  `filesize` int(10) unsigned NOT NULL DEFAULT '0',
  `width` smallint(5) unsigned NOT NULL DEFAULT '0',
  `height` smallint(5) unsigned NOT NULL DEFAULT '0',
  `filedata_thumb` mediumblob,
  `width_thumb` int(10) unsigned NOT NULL DEFAULT '0',
  `height_thumb` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customavatar`
--

LOCK TABLES `customavatar` WRITE;
/*!40000 ALTER TABLE `customavatar` DISABLE KEYS */;
INSERT INTO `customavatar` VALUES (1,'ÿØÿà\0JFIF\0\0`\0`\0\0ÿþ\0;CREATOR: gd-jpeg v1.0 (using IJG JPEG v62), quality = 90\nÿÛ\0C\0    \n\r\Z\Z $.\' \",#(7),01444\'9=82<.342ÿÛ\0C     \r\r2!!22222222222222222222222222222222222222222222222222ÿÀ\0\0P\0P\"\0ÿÄ\0\Z\0\0\0\0\0\0\0\0\0\0\0\0\0\0ÿÄ\0/\0\0\0\0\0\0\0!1AQ\"a2q‘¡BÁ#RÿÄ\0\0\0\0\0\0\0\0\0\0\0\0\0\0ÿÄ\0\0\0\0\0\0\0\0\0\0\0\0!1AÿÚ\0\0\0?\0ÃIå\n{Ó‚áÔ‡Wå#¿zDÉ5¬Íñ²H»2°ÁÏ˜¼¥@Æk>#ö1”ú2fÛˆ.aåYH8ÍXíoRêû\Z SÚ¬Z4ÇèYrAýT·Ò3Dî|wmšT˜.«ªÍs)Y„jHåÿ\05\Z¬@÷ñH™ÇÎsÌpX÷©Îá{Î$ÖaÓ qÎ£y”€Àœõ@£ÔåtÜÖ9&D(!yÎæœ…‹òy·Ú·-;à^Ÿ`j7òJì7åÛ³c‡¤áž ½Ñå~snùG?ä„eOçƒ’ÃËHg7¨X%æ‘È<*j‡·@»(ç=ÈZ±Ø0bÑ6\n0Á¢²-n%€&YXøíX¢Ý8e)Ê)Æ_©/Çœ?$ZÔî‘$’<„yS¸ÇžûPÜ1¡6½¯éöYDb;åŽìAØÖíw§Zj#½·IPl‹ÒžÓ´Ë-6\r…¼V±¼Æ¡sîzgû­†9%ðè™ïü3Ðm´Kûëhd‚[xDå|ž‡¶Õ–ÛÅ*Úò(c‘ÛýÖ½Çœ_g=”š‘(¸’b#¸–<EÏÚ§¹=3â«úWE4*· —ð§íüžûþªNž‘^yN—6ÆGj?žN³Õ,\"gKˆRF•!‚â¦~ðÖ¹uÄv7÷7üvžÆE•Á\nN1Ê¾sßÚ§ô}Jï™,µDwÑæ9†åT“  =ˆàõö­Ï]Óïc[êò«o‘2¿È§ShuÐd7SâÇ$Ð;`“ÓÅa¿R1Æö’ íb¿4<Äè\nÒµž8Ð´+róßÅ4Ãì¶Ã»·ŽßÍaZÆ­sÄ\ZÍÎ«vI>¢‘Áª6°ÌŽá¥ÚÐÙƒÒä÷¡õd):N Ø\0$ùLyP[ÛöéE±ºÔÔ¶4ë|^tNÁ®kVQ…·Õ¯#QÑD§›¼ÕõE\n]êw“¡ÿ\0”‘Jh»âŸ±³ù× èzË^TM7*p½L*ÜJ2äzGqïVëLN­àþ¨!\n µ==ÕÅèsk{€fd¼Zý>±£Kk:¬ŠuaœŽõ“q?6uóm¹šÎCéßtö5yÐõ¶¹\ní…>õ-y¾£nðÊGÎzRèèzN¨šÐ#Ÿ!0ñlËÑ\0n„ûQily}]3“ïR\Z™±½–Øîcbò;S%½!k±ýK€g^´¬\rQvè!ÔKe,Y#½<Ëœþ(h\\3ò›ŠÕmî/¡¦Cgµ`È€Œ€I§¢³æû,Ø)ßí>Ô»È‡}…¢Ë8£y&0Ì?TÓO9[œy=©¦y7æB*6¦,d1¯Nþ·â’º¬ê$Ó\0§oVOñ@ˆä•°¨IÏŠ—±Ó·<ø-Ù|QZìÂx.¯fk™#9~ýÿ\0š\r¡e;©ýU¶Kulmú4<¶*Aôùª‡¡‘µÝù+\rÇ#µE!åÀíV{«NBp6ñU†å[Ö¦ki(KÔQÛùÅ)0=Cµ:}K\rf@Z\nðuÛo4¦æn›Q¸ àî)j™íŽ” Ø,6¼§ `Ñ© =+±óöÀ¥€2rsF`™Õ›µÆ\\ì)ÔÁt\0ô®‰Ûf„öÈÛ«PÑä\rñYÍáÅô¹õc+V™\0…×ÀÍd·²Ô\'cÿ\0²)µ‰M\r?ÿÙ',1427493485,'Primeira-imagem-do-filme-de-Angry-Birds-Ã©-revelada-2.jpg',1,1653,80,80,'ÿØÿà\0JFIF\0\0`\0`\0\0ÿþ\0;CREATOR: gd-jpeg v1.0 (using IJG JPEG v62), quality = 90\nÿÛ\0C\0   \n\r\Z\Z $.\' \",#(7),01444\'9=82<.342ÿÛ\0C     \r\r2!!22222222222222222222222222222222222222222222222222ÿÀ\0\0P\0P\"\0ÿÄ\0\Z\0\0\0\0\0\0\0\0\0\0\0\0\0\0ÿÄ\0/\0\0\0\0\0\0\0!1AQ\"a2q‘¡BÁ#RÿÄ\0\0\0\0\0\0\0\0\0\0\0\0\0\0ÿÄ\0\0\0\0\0\0\0\0\0\0\0\0!1AÿÚ\0\0\0?\0ÃIå\n{Ó‚áÔ‡Wå#¿zDÉ5¬Íñ²H»2°ÁÏ˜¼¥@Æk>#ö1”ú2fÛˆ.aåYH8ÍXíoRêû\Z SÚ¬Z4ÇèYrAýT·Ò3Dî|wmšT˜.«ªÍs)Y„jHåÿ\05\Z¬@÷ñH™ÇÎsÌpX÷©Îá{Î$ÖaÓ qÎ£y”€Àœõ@£ÔåtÜÖ9&D(!yÎæœ…‹òy·Ú·-;à^Ÿ`j7òJì7åÛ³c‡¤áž ½Ñå~snùG?ä„eOçƒ’ÃËHg7¨X%æ‘È<*j‡·@»(ç=ÈZ±Ø0bÑ6\n0Á¢²-n%€&YXøíX¢Ý8e)Ê)Æ_©/Çœ?$ZÔî‘$’<„yS¸ÇžûPÜ1¡6½¯éöYDb;åŽìAØÖíw§Zj#½·IPl‹ÒžÓ´Ë-6\r…¼V±¼Æ¡sîzgû­†9%ðè™ïü3Ðm´Kûëhd‚[xDå|ž‡¶Õ–ÛÅ*Úò(c‘ÛýÖ½Çœ_g=”š‘(¸’b#¸–<EÏÚ§¹=3â«úWE4*· —ð§íüžûþªNž‘^yN—6ÆGj?žN³Õ,\"gKˆRF•!‚â¦~ðÖ¹uÄv7÷7üvžÆE•Á\nN1Ê¾sßÚ§ô}Jï™,µDwÑæ9†åT“  =ˆàõö­Ï]Óïc[êò«o‘2¿È§ShuÐd7SâÇ$Ð;`“ÓÅa¿R1Æö’ íb¿4<Äè\nÒµž8Ð´+róßÅ4Ãì¶Ã»·ŽßÍaZÆ­sÄ\ZÍÎ«vI>¢‘Áª6°ÌŽá¥ÚÐÙƒÒä÷¡õd):N Ø\0$ùLyP[ÛöéE±ºÔÔ¶4ë|^tNÁ®kVQ…·Õ¯#QÑD§›¼ÕõE\n]êw“¡ÿ\0”‘Jh»âŸ±³ù× èzË^TM7*p½L*ÜJ2äzGqïVëLN­àþ¨!\n µ==ÕÅèsk{€fd¼Zý>±£Kk:¬ŠuaœŽõ“q?6uóm¹šÎCéßtö5yÐõ¶¹\ní…>õ-y¾£nðÊGÎzRèèzN¨šÐ#Ÿ!0ñlËÑ\0n„ûQily}]3“ïR\Z™±½–Øîcbò;S%½!k±ýK€g^´¬\rQvè!ÔKe,Y#½<Ëœþ(h\\3ò›ŠÕmî/¡¦Cgµ`È€Œ€I§¢³æû,Ø)ßí>Ô»È‡}…¢Ë8£y&0Ì?TÓO9[œy=©¦y7æB*6¦,d1¯Nþ·â’º¬ê$Ó\0§oVOñ@ˆä•°¨IÏŠ—±Ó·<ø-Ù|QZìÂx.¯fk™#9~ýÿ\0š\r¡e;©ýU¶Kulmú4<¶*Aôùª‡¡‘µÝù+\rÇ#µE!åÀíV{«NBp6ñU†å[Ö¦ki(KÔQÛùÅ)0=Cµ:}K\rf@Z\nðuÛo4¦æn›Q¸ àî)j™íŽ” Ø,6¼§ `Ñ© =+±óöÀ¥€2rsF`™Õ›µÆ\\ì)ÔÁt\0ô®‰Ûf„öÈÛ«PÑä\rñYÍáÅô¹õc+V™\0…×ÀÍd·²Ô\'cÿ\0²)µ‰M\r?ÿÙ',80,80);
/*!40000 ALTER TABLE `customavatar` ENABLE KEYS */;
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
