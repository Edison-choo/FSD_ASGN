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
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `res_name` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `timing` time DEFAULT NULL,
  `date` date DEFAULT NULL,
  `pax` int DEFAULT NULL,
  `confirm` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (2,'Subway@NYP','Yu Zheng','Lim','yuzhenglim2510@gmail.com','05:00:00','2021-08-18',3,0),(3,'Saizeriya@SSC','Yu Zheng','Lim','yuzhenglim2510@gmail.com','16:00:00','2021-08-19',2,0),(4,'Popeyes@Northpoint','Yu Zheng','Lim','yuzhenglim2510@gmail.com','18:00:00','2021-08-19',5,0),(5,'Swensen@Sunplaza','Yu Zheng','Lim','yuzhenglim2510@gmail.com','16:00:00','2021-08-20',3,0),(6,'SakonThai@Northpoint','Edison','Choo','edisonchoo234@gmail.com','12:00:00','2021-07-19',4,1),(7,'Subway@NYP','Edison','Choo','edisonchoo234@gmail.com','16:00:00','2021-08-20',6,1),(8,'Saizeriya@SSC','Edison','Choo','edisonchoo234@gmail.com','16:00:00','2021-08-19',4,0),(9,'Popeyes@Northpoint','Edison','Choo','edisonchoo234@gmail.com','19:00:00','2021-08-25',4,1),(10,'Swensen@Sunplaza','Edison','Choo','edisonchoo234@gmail.com','11:00:00','2021-08-22',5,0),(13,'SakonThai@Northpoint','Xuan Wei','Lim','joshualim2122@gmail.com','12:00:00','2021-07-19',4,1),(14,'Subway@NYP','Xuan Wei','Lim','joshualim2122@gmail.com','12:00:00','2021-07-25',7,1),(15,'Saizeriya@SSC','Xuan Wei','Lim','joshualim2122@gmail.com','12:00:00','2021-08-28',2,0),(16,'Popeyes@Northpoint','Xuan Wei','Lim','joshualim2122@gmail.com','14:00:00','2021-08-29',4,0),(17,'Swensen@Sunplaza','Xuan Wei','Lim','joshualim2122@gmail.com','18:00:00','2021-08-21',4,1),(18,'SakonThai@Northpoint','Wye Keong','Wee','notweewyekeong@gmail.com','12:00:00','2021-07-20',4,1),(19,'Subway@NYP','Wye Keong','Wee','notweewyekeong@gmail.com','15:00:00','2021-07-19',6,1),(20,'Saizeriya@SSC','Wye Keong','Wee','notweewyekeong@gmail.com','14:00:00','2021-08-28',4,0),(21,'Popeyes@Northpoint','Wye Keong','Wee','notweewyekeong@gmail.com','11:00:00','2021-08-21',4,0),(22,'Swensen@Sunplaza','Wye Keong','Wee','notweewyekeong@gmail.com','15:00:00','2021-08-20',1,1);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-17 15:57:41
