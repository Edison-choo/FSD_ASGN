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
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `startdate` datetime DEFAULT NULL,
  `enddate` datetime DEFAULT NULL,
  `discount` int DEFAULT NULL,
  `details` varchar(255) DEFAULT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `staffid` int DEFAULT NULL,
  `counter` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES (1,'Weekday Deals','2021-08-24 00:00:00','2021-08-31 00:00:00',5,'5% off a 1 piece Chicken meal, a burger meal, and a 1 piece Chicken Fillet from 11AM - 5PM!','/uploads/bannerimg/8/8-1629185483611.png',8,2),(2,'Ghost Pepper Chicken','2021-09-09 00:00:00','2021-08-30 00:00:00',10,'10% off all Hot N Cheesy Gosh Pepper Chicken meals! Meals come with a small sized drink and our new Thai Tea Biscuit!','/uploads/bannerimg/8/8-1629185709858.png',8,0),(3,'National Day Promotion','2021-08-09 00:00:00','2021-08-30 00:00:00',20,'National Day 2021 promotion islandwide! 20% all menu items from 11AM - 5PM!',NULL,8,1),(4,'Popeye\'s 10pc Bundle','2021-08-26 00:00:00','2021-09-26 00:00:00',42,'10 piece Chicken, 4 piece Tenders, 2 Large Mahsed potatoes for only $30.90! ','/uploads/bannerimg/8/8-1629186028058.jpg',8,1),(5,'Subway Everyday Meals','2021-08-21 00:00:00','2021-10-31 00:00:00',50,'Get a 6-inch sub with a 16oz drink and a cookie for only $5.90! Check out our brand new Shroom Poloni sub now!\r\n\r\nUsual Price: $11.80','/uploads/bannerimg/6/6-1629186808506.jpg',6,1),(6,'New Signature Flavours','2021-08-01 00:00:00','2021-10-01 00:00:00',5,'Try out our new signature flavours Bulgogi Chicken, Breaded Chicken Cutlet and Chucky Beef Steak ',NULL,6,0);
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-17 16:03:17
