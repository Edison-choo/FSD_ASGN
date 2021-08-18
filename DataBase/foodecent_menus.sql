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
-- Table structure for table `menus`
--

DROP TABLE IF EXISTS `menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `foodNo` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `specifications` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menus`
--

LOCK TABLES `menus` WRITE;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;
INSERT INTO `menus` VALUES (1,'SD01','Papaya salad',6,'Salad','','/uploads/menu/5/5-1625670034862.jpg',5),(2,'SS01','Stuffed Chicken Wing',4,'Side dishes','','/uploads/menu/5/5-1625670072369.jpg',5),(3,'SP01','Red tom yum soup',9,'Soup','Portion','/uploads/menu/5/5-1625670104587.jpg',5),(4,'DT01','Red ruby with jackfruits',4,'Dessert','','/uploads/menu/5/5-1625670132331.jpg',5),(5,'SD01','Chef Salad',4,'Salad','','/uploads/menu/7/7-1625670703565.png',7),(6,'GL01','Hamburger',6,'Grill','','/uploads/menu/7/7-1625670734393.jpg',7),(7,'GL02','Sirloin Steak',12,'Grill','Cook level','/uploads/menu/7/7-1625670782026.jpg',7),(8,'DT01','Tiramisu',5,'Dessert','','/uploads/menu/7/7-1625670824578.png',7),(9,'PA01','Aglio olio vongole',6,'Pasta','Portion','/uploads/menu/7/7-1625670850563.png',7),(10,'BR01','Cajun Chicken',5.5,'Burger','Portion,Spice level','/uploads/menu/8/8-1625672078542.png',8),(11,'TS01','Mild tenders',6.6,'Tenders','Portion,Spice level','/uploads/menu/8/8-1625672455816.png',8),(12,'SS01','Biscuits',1.5,'Signature sides','','/uploads/menu/8/8-1625672550660.png',8),(13,'DT01','Ice cream',4.2,'Dessert','','/uploads/menu/8/8-1625672871486.png',8),(17,'SS01','Chicken Bacon Ranch',7.8,'Sandwiches','','/uploads/menu/6/6-1629178518460.png',6),(18,'SS02','Chicken Teriyaki',7.1,'Sandwiches','','/uploads/menu/6/6-1629179928046.png',6),(19,'SS03','Cold Cut Trio',6.1,'Sandwiches','','/uploads/menu/6/6-1629179956260.png',6),(20,'SS04','Egg Mayo',6.1,'Sandwiches','','/uploads/menu/6/6-1629179979424.png',6),(21,'SS05','Italian B.M.T',7.3,'Sandwiches','','/uploads/menu/6/6-1629180020360.png',6),(22,'SS06','Meatball Marinara Melt',7.2,'Sandwiches','','/uploads/menu/6/6-1629180026722.png',6);
/*!40000 ALTER TABLE `menus` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-17 14:44:26
