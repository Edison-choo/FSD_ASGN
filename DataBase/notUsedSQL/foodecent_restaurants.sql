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
  `comp_email` varchar(255) DEFAULT NULL,
  `res_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `cuisine` varchar(255) DEFAULT NULL,
  `open_time` varchar(255) DEFAULT NULL,
  `close_time` varchar(255) DEFAULT NULL,
  `halal` tinyint(1) DEFAULT '0',
  `facebook` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `seat` varchar(4000) DEFAULT NULL,
  `square` varchar(4000) DEFAULT NULL,
  `tables` varchar(4000) DEFAULT NULL,
  `occupied` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (1,5,'930 Yishun Ave 2, #01-129 Northpoint City, Singapore 769098','sakonthai@gmail.com','Sakon Thai@Northpoint','91111111','Thai','09:00','23:00',1,'https://www.facebook.com/ilovesakonthai/','','https://www.instagram.com/sakon.thai/?hl=en','/uploads/resIcon/5/5-1625669951982.jpg','16g,15h,15i,17h,17i,16j,22g,21h,21i,23h,23i,22j,10g,11h,11i,9h,9i,10j','16h,16i,22h,22i,10h,10i','{\"table-1\":[\"16h\",\"16i\",\"16g\",\"15h\",\"15i\",\"17h\",\"17i\",\"16j\"],\"table-2\":[\"22h\",\"22i\",\"22g\",\"21h\",\"21i\",\"23h\",\"23i\",\"22j\"],\"table-3\":[\"10h\",\"10i\",\"10g\",\"11h\",\"11i\",\"9h\",\"9i\",\"10j\"]}',''),(2,6,'930 Yishun Ave 2, Northpoint City North Wing, #B2-03/07, Singapore 769098','anwar_r@subway.com.sg','Subway@Northpoint','91111111','Western','10:00','23:00',1,'https://www.facebook.com/subway','https://twitter.com/subway','https://www.instagram.com/subway.singapore/','/uploads/resIcon/6/6-1625669671678.jpg','2a,1b,1c,3b,3c,2d,2g,1h,1i,3h,3i,2j,7d,6e,6f,8e,8f,7g','2b,2c,2h,2i,7e,7f','{\"table-1\":[\"2b\",\"2c\",\"2a\",\"1b\",\"1c\",\"3b\",\"3c\",\"2d\"],\"table-2\":[\"2h\",\"2i\",\"2g\",\"1h\",\"1i\",\"3h\",\"3i\",\"2j\"],\"table-3\":[\"7e\",\"7f\",\"7d\",\"6e\",\"6f\",\"8e\",\"8f\",\"7g\"]}',''),(3,7,'604 Sembawang Road, #B1-15/16, Sembawang Shopping Centre, Singapore 758459','saizeriya@gmail.com','Saizeriya@SSC','91111111','Italian','09:00','23:00',0,'https://www.facebook.com/SaizeriyaSingapore/','','https://www.instagram.com/saizeriyasg/?hl=en','/uploads/resIcon/7/7-1625670467870.jpg','10l,8k,10j,8i,10h,8g,9f,11f,12h,13f,14h,15f,16h,17f,18g,18i,16j,18k,16l,17n,16o,16p,18o,18p,17q,8o,8p,10o,10p,9q,9n','9l,9j,9k,9i,9h,9g,11g,12g,10g,13g,14g,15g,16g,17g,17h,17i,17j,17k,17l,17o,17p,9o,9p','{\"table-1\":[\"9l\",\"9j\",\"9k\",\"9i\",\"9h\",\"9g\",\"11g\",\"12g\",\"10g\",\"13g\",\"14g\",\"15g\",\"16g\",\"17g\",\"17h\",\"17i\",\"17j\",\"17k\",\"17l\",\"10l\",\"8k\",\"10j\",\"8i\",\"10h\",\"8g\",\"9f\",\"11f\",\"12h\",\"13f\",\"14h\",\"15f\",\"16h\",\"17f\",\"18g\",\"18i\",\"16j\",\"18k\",\"16l\"],\"table-2\":[\"17o\",\"17p\",\"17n\",\"16o\",\"16p\",\"18o\",\"18p\",\"17q\"],\"table-3\":[\"8o\",\"8p\",\"10o\",\"10p\",\"9q\",\"9n\",\"9o\",\"9p\"]}',''),(4,8,'930 Yishun Ave 2, #01-15, Singapore 769098','popeyes@gmail.com','Popeyes@Northpoint','91111111','Western','09:00','23:00',1,'https://www.facebook.com/PopeyesSGP/','https://twitter.com/popeyessg?lang=en','https://www.instagram.com/popeyes.sg/?hl=en','/uploads/resIcon/8/8-1625671019224.png','6g,6i,9g,9i,12g,12i,15g,15i,18g,18i','6h,9h,12h,15h,18h','{\"table-1\":[\"6h\",\"6g\",\"6i\"],\"table-2\":[\"9h\",\"9g\",\"9i\"],\"table-3\":[\"12h\",\"12g\",\"12i\"],\"table-4\":[\"15h\",\"15g\",\"15i\"],\"table-5\":[\"18h\",\"18g\",\"18i\"]}','');
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

-- Dump completed on 2021-07-08  0:10:48
