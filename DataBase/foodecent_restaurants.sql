-- MySQL dump 10.13  Distrib 8.0.24, for Win64 (x86_64)
--
-- Host: localhost    Database: foodecent
-- ------------------------------------------------------
-- Server version	8.0.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffid` int DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `res_name` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `cuisine` varchar(255) DEFAULT NULL,
  `open_time` time DEFAULT NULL,
  `close_time` time DEFAULT NULL,
  `price` int DEFAULT NULL,
  `halal` tinyint(1) DEFAULT '0',
  `facebook` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `seat` varchar(4000) DEFAULT NULL,
  `square` varchar(4000) DEFAULT NULL,
  `tables` varchar(4000) DEFAULT NULL,
  `occupied` varchar(400) DEFAULT NULL,
  `queue` int DEFAULT '0',
  `reviewCount` int DEFAULT '0',
  `avgReview` float DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (1,5,'930 YISHUN AVENUE 2 NORTHPOINT CITY SINGAPORE 769098','#01 - 129','','SakonThai@Northpoint','Sakon Thai','89099950','Western','11:00:00','21:00:00',30,0,'','','https://www.instagram.com/sakon.thai/?hl=en','/uploads/resIcon/5/5-1629182620631.jpg','3b,2c,2e,4d,2d,4c,4e,3f,7b,6c,6d,8c,8d,7f,6e,8e,11b,10d,10e,12d,12e,11f,10c,12c,15b,14c,16c,16d,16e,15f,14e,14d,19b,18c,18d,18e,19f,20e,20d,20c,23b,22c,22d,22e,24e,24d,24c,23f,27b,26c,26d,26e,27f,28e,28d,28c,2j,3i,3k,4i,4k,5i,5k,6i,6k,7j,9j,10i,11i,12i,13i,14j,13k,12k,11k,10k,16j,17i,18i,20i,19i,21j,20k,19k,18k,17k,23j,24i,25i,26i,27i,28j,27k,26k,25k,24k,2o,3n,4n,5o,5p,4q,3q,2p,8o,8p,11o,11p,9n,10n,9q,10q','3c,3d,3e,7c,7d,7e,11d,11e,11c,15c,15d,15e,19c,19d,19e,23c,23d,23e,27c,27d,27e,3j,4j,5j,6j,10j,11j,12j,13j,17j,18j,19j,20j,24j,25j,26j,27j,3o,4p,4o,3p,9o,9p,10p,10o','{\"table-1\":[\"3b\",\"2c\",\"2e\",\"4d\",\"2d\",\"4c\",\"4e\",\"3f\",\"3c\",\"3d\",\"3e\"],\"table-2\":[\"7b\",\"6c\",\"6d\",\"8c\",\"8d\",\"7f\",\"6e\",\"8e\",\"7c\",\"7d\",\"7e\"],\"table-3\":[\"11b\",\"10d\",\"10e\",\"12d\",\"12e\",\"11f\",\"11d\",\"11e\",\"11c\",\"10c\",\"12c\"],\"table-4\":[\"15b\",\"14c\",\"16c\",\"16d\",\"16e\",\"15f\",\"14e\",\"14d\",\"15c\",\"15d\",\"15e\"],\"table-5\":[\"19b\",\"18c\",\"18d\",\"18e\",\"19f\",\"20e\",\"20d\",\"20c\",\"19c\",\"19d\",\"19e\"],\"table-6\":[\"23b\",\"22c\",\"22d\",\"22e\",\"24e\",\"24d\",\"24c\",\"23f\",\"23c\",\"23d\",\"23e\"],\"table-7\":[\"27b\",\"26c\",\"26d\",\"26e\",\"27f\",\"28e\",\"28d\",\"28c\",\"27c\",\"27d\",\"27e\"],\"table-8\":[\"2j\",\"3i\",\"3k\",\"4i\",\"4k\",\"5i\",\"5k\",\"6i\",\"6k\",\"7j\",\"3j\",\"4j\",\"5j\",\"6j\"],\"table-9\":[\"9j\",\"10i\",\"11i\",\"12i\",\"13i\",\"14j\",\"13k\",\"12k\",\"11k\",\"10k\",\"10j\",\"11j\",\"12j\",\"13j\"],\"table-10\":[\"16j\",\"17i\",\"18i\",\"20i\",\"19i\",\"21j\",\"20k\",\"19k\",\"18k\",\"17k\",\"17j\",\"18j\",\"19j\",\"20j\"],\"table-11\":[\"23j\",\"24i\",\"25i\",\"26i\",\"27i\",\"28j\",\"27k\",\"26k\",\"25k\",\"24k\",\"24j\",\"25j\",\"26j\",\"27j\"],\"table-12\":[\"2o\",\"3n\",\"4n\",\"5o\",\"5p\",\"4q\",\"3q\",\"2p\",\"3o\",\"4p\",\"4o\",\"3p\"],\"table-13\":[\"8o\",\"8p\",\"11o\",\"11p\",\"9n\",\"10n\",\"9q\",\"10q\",\"9o\",\"9p\",\"10p\",\"10o\"]}',',table-4,table-3,table-9,table-13,table-8,table-11',0,0,0),(2,6,'180 ANG MO KIO AVENUE 8 NANYANG POLYTECHNIC SINGAPORE 569830','#A229','https://subway.com','Subway@NYP','Subway','62220655','Western','08:00:00','20:30:00',10,1,'https://www.facebook.com/subway','https://www.twitter.com/subway','https://www.instagram.com/subway.singapore/','https://logo.clearbit.com/subway.com','3b,2c,2e,4d,2d,4c,4e,3f,7b,6c,6d,8c,8d,7f,6e,8e,11b,10d,10e,12d,12e,11f,10c,12c,15b,14c,16c,16d,16e,15f,14e,14d,19b,18c,18d,18e,19f,20e,20d,20c,23b,22c,22d,22e,24e,24d,24c,23f,27b,26c,26d,26e,27f,28e,28d,28c,2j,3i,3k,4i,4k,5i,5k,6i,6k,7j,9j,10i,11i,12i,13i,14j,13k,12k,11k,10k,16j,17i,18i,20i,19i,21j,20k,19k,18k,17k,23j,24i,25i,26i,27i,28j,27k,26k,25k,24k,2o,3n,4n,5o,5p,4q,3q,2p,8o,8p,11o,11p,9n,10n,9q,10q','3c,3d,3e,7c,7d,7e,11d,11e,11c,15c,15d,15e,19c,19d,19e,23c,23d,23e,27c,27d,27e,3j,4j,5j,6j,10j,11j,12j,13j,17j,18j,19j,20j,24j,25j,26j,27j,3o,4p,4o,3p,9o,9p,10p,10o','{\"table-1\":[\"3b\",\"2c\",\"2e\",\"4d\",\"2d\",\"4c\",\"4e\",\"3f\",\"3c\",\"3d\",\"3e\"],\"table-2\":[\"7b\",\"6c\",\"6d\",\"8c\",\"8d\",\"7f\",\"6e\",\"8e\",\"7c\",\"7d\",\"7e\"],\"table-3\":[\"11b\",\"10d\",\"10e\",\"12d\",\"12e\",\"11f\",\"11d\",\"11e\",\"11c\",\"10c\",\"12c\"],\"table-4\":[\"15b\",\"14c\",\"16c\",\"16d\",\"16e\",\"15f\",\"14e\",\"14d\",\"15c\",\"15d\",\"15e\"],\"table-5\":[\"19b\",\"18c\",\"18d\",\"18e\",\"19f\",\"20e\",\"20d\",\"20c\",\"19c\",\"19d\",\"19e\"],\"table-6\":[\"23b\",\"22c\",\"22d\",\"22e\",\"24e\",\"24d\",\"24c\",\"23f\",\"23c\",\"23d\",\"23e\"],\"table-7\":[\"27b\",\"26c\",\"26d\",\"26e\",\"27f\",\"28e\",\"28d\",\"28c\",\"27c\",\"27d\",\"27e\"],\"table-8\":[\"2j\",\"3i\",\"3k\",\"4i\",\"4k\",\"5i\",\"5k\",\"6i\",\"6k\",\"7j\",\"3j\",\"4j\",\"5j\",\"6j\"],\"table-9\":[\"9j\",\"10i\",\"11i\",\"12i\",\"13i\",\"14j\",\"13k\",\"12k\",\"11k\",\"10k\",\"10j\",\"11j\",\"12j\",\"13j\"],\"table-10\":[\"16j\",\"17i\",\"18i\",\"20i\",\"19i\",\"21j\",\"20k\",\"19k\",\"18k\",\"17k\",\"17j\",\"18j\",\"19j\",\"20j\"],\"table-11\":[\"23j\",\"24i\",\"25i\",\"26i\",\"27i\",\"28j\",\"27k\",\"26k\",\"25k\",\"24k\",\"24j\",\"25j\",\"26j\",\"27j\"],\"table-12\":[\"2o\",\"3n\",\"4n\",\"5o\",\"5p\",\"4q\",\"3q\",\"2p\",\"3o\",\"4p\",\"4o\",\"3p\"],\"table-13\":[\"8o\",\"8p\",\"11o\",\"11p\",\"9n\",\"10n\",\"9q\",\"10q\",\"9o\",\"9p\",\"10p\",\"10o\"]}',',table-4,table-3,table-9,table-13,table-8,table-11',1,0,0),(3,7,'604 SEMBAWANG ROAD SEMBAWANG SHOPPING CENTRE SINGAPORE 758459','#B1-15/16','https://saizeriya.com.sg','Saizeriya@SSC','Saizeriya','65709695','Italian','11:00:00','22:00:00',20,1,'https://www.facebook.com/SaizeriyaSingapore/','https://twitter.com/saizeriyasg','https://www.instagram.com/saizeriyasg/','/uploads/resIcon/7/7-1629183527378.png','3b,2c,2e,4d,2d,4c,4e,3f,7b,6c,6d,8c,8d,7f,6e,8e,11b,10d,10e,12d,12e,11f,10c,12c,15b,14c,16c,16d,16e,15f,14e,14d,19b,18c,18d,18e,19f,20e,20d,20c,23b,22c,22d,22e,24e,24d,24c,23f,27b,26c,26d,26e,27f,28e,28d,28c,2j,3i,3k,4i,4k,5i,5k,6i,6k,7j,9j,10i,11i,12i,13i,14j,13k,12k,11k,10k,16j,17i,18i,20i,19i,21j,20k,19k,18k,17k,23j,24i,25i,26i,27i,28j,27k,26k,25k,24k,2o,3n,4n,5o,5p,4q,3q,2p,8o,8p,11o,11p,9n,10n,9q,10q','3c,3d,3e,7c,7d,7e,11d,11e,11c,15c,15d,15e,19c,19d,19e,23c,23d,23e,27c,27d,27e,3j,4j,5j,6j,10j,11j,12j,13j,17j,18j,19j,20j,24j,25j,26j,27j,3o,4p,4o,3p,9o,9p,10p,10o','{\"table-1\":[\"3b\",\"2c\",\"2e\",\"4d\",\"2d\",\"4c\",\"4e\",\"3f\",\"3c\",\"3d\",\"3e\"],\"table-2\":[\"7b\",\"6c\",\"6d\",\"8c\",\"8d\",\"7f\",\"6e\",\"8e\",\"7c\",\"7d\",\"7e\"],\"table-3\":[\"11b\",\"10d\",\"10e\",\"12d\",\"12e\",\"11f\",\"11d\",\"11e\",\"11c\",\"10c\",\"12c\"],\"table-4\":[\"15b\",\"14c\",\"16c\",\"16d\",\"16e\",\"15f\",\"14e\",\"14d\",\"15c\",\"15d\",\"15e\"],\"table-5\":[\"19b\",\"18c\",\"18d\",\"18e\",\"19f\",\"20e\",\"20d\",\"20c\",\"19c\",\"19d\",\"19e\"],\"table-6\":[\"23b\",\"22c\",\"22d\",\"22e\",\"24e\",\"24d\",\"24c\",\"23f\",\"23c\",\"23d\",\"23e\"],\"table-7\":[\"27b\",\"26c\",\"26d\",\"26e\",\"27f\",\"28e\",\"28d\",\"28c\",\"27c\",\"27d\",\"27e\"],\"table-8\":[\"2j\",\"3i\",\"3k\",\"4i\",\"4k\",\"5i\",\"5k\",\"6i\",\"6k\",\"7j\",\"3j\",\"4j\",\"5j\",\"6j\"],\"table-9\":[\"9j\",\"10i\",\"11i\",\"12i\",\"13i\",\"14j\",\"13k\",\"12k\",\"11k\",\"10k\",\"10j\",\"11j\",\"12j\",\"13j\"],\"table-10\":[\"16j\",\"17i\",\"18i\",\"20i\",\"19i\",\"21j\",\"20k\",\"19k\",\"18k\",\"17k\",\"17j\",\"18j\",\"19j\",\"20j\"],\"table-11\":[\"23j\",\"24i\",\"25i\",\"26i\",\"27i\",\"28j\",\"27k\",\"26k\",\"25k\",\"24k\",\"24j\",\"25j\",\"26j\",\"27j\"],\"table-12\":[\"2o\",\"3n\",\"4n\",\"5o\",\"5p\",\"4q\",\"3q\",\"2p\",\"3o\",\"4p\",\"4o\",\"3p\"],\"table-13\":[\"8o\",\"8p\",\"11o\",\"11p\",\"9n\",\"10n\",\"9q\",\"10q\",\"9o\",\"9p\",\"10p\",\"10o\"]}',',table-4,table-3,table-9,table-13,table-8,table-11',0,0,0),(4,8,'930 YISHUN AVENUE 2 NORTHPOINT CITY SINGAPORE 769098','#01-15','https://popeyes.com','Popeyes@Northpoint','Popeyes','62356497','Western','10:00:00','22:00:00',10,1,'https://www.facebook.com/PopeyesSGP','','','/uploads/resIcon/8/8-1629183821970.png','1a,1b,3a,3b,5a,5b,7a,7b,9a,9b,11a,11b,6f,7e,8f,7g,2i,1j,2k,3j,6j,7i,8j,7k,1f,2e,2g,3f,11j,12i,13j,12k,2m,1n,3n,2o,7m,7o,8n,6n,12m,11n,12o,13n,3q,3r,5q,5r,7q,7r,9q,9r,11q,11r,13q,13r,15q,15r,17q,17r','2a,2b,6a,6b,10b,10a,2f,7f,2j,7j,12j,2n,7n,12n,4q,4r,8q,8r,12q,12r,16q,16r','{\"table-1\":[\"1a\",\"1b\",\"3a\",\"3b\",\"2a\",\"2b\"],\"table-2\":[\"5a\",\"5b\",\"6a\",\"6b\",\"7a\",\"7b\"],\"table-3\":[\"9a\",\"9b\",\"10b\",\"10a\",\"11a\",\"11b\"],\"table-4\":[\"2f\",\"1f\",\"2e\",\"2g\",\"3f\"],\"table-5\":[\"6f\",\"7e\",\"8f\",\"7g\",\"7f\"],\"table-6\":[\"2i\",\"1j\",\"2k\",\"3j\",\"2j\"],\"table-7\":[\"6j\",\"7i\",\"8j\",\"7k\",\"7j\"],\"table-8\":[\"11j\",\"12i\",\"13j\",\"12k\",\"12j\"],\"table-9\":[\"2m\",\"1n\",\"3n\",\"2o\",\"2n\"],\"table-10\":[\"7m\",\"7o\",\"8n\",\"7n\",\"6n\"],\"table-11\":[\"12m\",\"11n\",\"12o\",\"13n\",\"12n\"],\"table-12\":[\"3q\",\"3r\",\"5q\",\"5r\",\"4q\",\"4r\"],\"table-13\":[\"7q\",\"7r\",\"9q\",\"9r\",\"8q\",\"8r\"],\"table-14\":[\"11q\",\"11r\",\"13q\",\"13r\",\"12q\",\"12r\"],\"table-15\":[\"15q\",\"15r\",\"17q\",\"17r\",\"16q\",\"16r\"]}',',table-9,table-7,table-6,table-14,table-3',1,0,0),(5,9,'30 SEMBAWANG DRIVE SUN PLAZA SINGAPORE 757713','#02 - 21 / 22','https://www.swensens.com.sg/','Swensen@Sunplaza','Swensens','64810840','Western','11:30:00','22:30:00',30,1,'https://www.facebook.com/SwensensSingapore/','https://twitter.com/swensenssg?lang=en','https://www.instagram.com/swensenssingapore/?hl=en','/uploads/resIcon/9/9-1629184341235.jpg','1a,1b,3a,3b,5a,5b,7a,7b,9a,9b,11a,11b,6f,7e,8f,7g,2i,1j,2k,3j,6j,7i,8j,7k,1f,2e,2g,3f,11j,12i,13j,12k,2m,1n,3n,2o,7m,7o,8n,6n,12m,11n,12o,13n,3q,3r,5q,5r,7q,7r,9q,9r,11q,11r,13q,13r,15q,15r,17q,17r','2a,2b,6a,6b,10b,10a,2f,7f,2j,7j,12j,2n,7n,12n,4q,4r,8q,8r,12q,12r,16q,16r','{\"table-1\":[\"1a\",\"1b\",\"3a\",\"3b\",\"2a\",\"2b\"],\"table-2\":[\"5a\",\"5b\",\"6a\",\"6b\",\"7a\",\"7b\"],\"table-3\":[\"9a\",\"9b\",\"10b\",\"10a\",\"11a\",\"11b\"],\"table-4\":[\"2f\",\"1f\",\"2e\",\"2g\",\"3f\"],\"table-5\":[\"6f\",\"7e\",\"8f\",\"7g\",\"7f\"],\"table-6\":[\"2i\",\"1j\",\"2k\",\"3j\",\"2j\"],\"table-7\":[\"6j\",\"7i\",\"8j\",\"7k\",\"7j\"],\"table-8\":[\"11j\",\"12i\",\"13j\",\"12k\",\"12j\"],\"table-9\":[\"2m\",\"1n\",\"3n\",\"2o\",\"2n\"],\"table-10\":[\"7m\",\"7o\",\"8n\",\"7n\",\"6n\"],\"table-11\":[\"12m\",\"11n\",\"12o\",\"13n\",\"12n\"],\"table-12\":[\"3q\",\"3r\",\"5q\",\"5r\",\"4q\",\"4r\"],\"table-13\":[\"7q\",\"7r\",\"9q\",\"9r\",\"8q\",\"8r\"],\"table-14\":[\"11q\",\"11r\",\"13q\",\"13r\",\"12q\",\"12r\"],\"table-15\":[\"15q\",\"15r\",\"17q\",\"17r\",\"16q\",\"16r\"]}',',table-9,table-7,table-6,table-14,table-3',0,0,0);
/*!40000 ALTER TABLE `restaurants` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-17 15:21:12
