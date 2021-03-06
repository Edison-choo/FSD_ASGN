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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `phone` int DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `cust_type` varchar(255) DEFAULT NULL,
  `profilepic` varchar(255) DEFAULT NULL,
  `uen` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Edison','Choo',87544649,'edisonchoo234@gmail.com',NULL,'$2a$10$ficPPvIi6ganMYgKX5aiKeghfq/7N49JVZU4B.OBjC0dD4xJQzLvO','customer','/uploads/userProfileImg/1/1-1629176271284.jpg',NULL,'2021-7-7'),(2,'Wye Keong','Wee',94499314,'notweewyekeong@gmail.com',NULL,'$2a$10$gMKrLRAuL2hi2Fie/cNt3OREB8fjWs6QJ.zIjr7aDKYDecRGEL1o6','customer',NULL,NULL,'2021-7-7'),(3,'Xuan Wei','Lim',97224136,'joshualim2122@gmail.com',NULL,'$2a$10$9l7/qzwLILGEn33q8MGYtOzwzHC8.CSujPyGdCzLL9Xk.tm/Gk92q','customer',NULL,NULL,'2021-7-7'),(4,'Yu Zheng','Lim',93399558,'yuzhenglim2510@gmail.com',NULL,'$2a$10$GFqhbe5mWDNFMAdWenloTOYX.sWXZ6vUnJUpOhvAaRBUyqHRuYlnK','customer',NULL,NULL,'2021-7-7'),(5,'SakonThai@Northpoint',NULL,NULL,'sakonthai@gmail.com',NULL,'$2a$10$6rR2s2/h30saHFsvQyfj7emqx1n.IX0a2SMp0.9u65MqScYT.sBMO','staff',NULL,'T09LL0001B','2021-8-17'),(6,'Subway@NYP',NULL,NULL,'subway@gmail.com',NULL,'$2a$10$ectXpDKgfpMV67.y1mOZZuCONEnwzChGrlLx29UPP1.k2YaT/AGKC','staff',NULL,'T09LL0001B','2021-8-17'),(7,'Saizeriya@SSC',NULL,NULL,'saizeriya@gmail.com',NULL,'$2a$10$pMalPITJy1dFqOHdYWOP2OTec7/rSBmoPwgtaBTCykqQGeqX6DxWO','staff',NULL,'T09LL0001B','2021-8-17'),(8,'Popeyes@Northpoint',NULL,NULL,'popeyes@gmail.com',NULL,'$2a$10$PU7ciyVQx/wfT7BCvBCuUe7af3ckHhvMEO2NalBt42M2pT51DvYi6','staff',NULL,'T09LL0001B','2021-8-17'),(9,'Swensen@Sunplaza',NULL,NULL,'swensen@gmail.com',NULL,'$2a$10$PU7ciyVQx/wfT7BCvBCuUe7af3ckHhvMEO2NalBt42M2pT51DvYi6','staff',NULL,'T09LL0001B','2021-8-17'),(14,'McDonalds@HougangMall',NULL,NULL,'mcdonaldshougang@gmail.com',NULL,'$2a$10$bhszY2VX5xvhgg1eNf70xu.NTDM7UG7ZqaINL2tu.TLLW1HYC9sda','staff',NULL,'T09LL0001B','2021-8-17'),(15,'HaidilaoHotPot@SeleterMall',NULL,NULL,'haidilaoseleter@gmail.com',NULL,'$2a$10$zYVG4FCMYg2Kl3Qlf1FsRe04BWDac0sIhsfvev.NImC0h/iJlh1F2','staff',NULL,'T09LL0001B','2021-8-17'),(16,'PeachGarden@ThomsonPlaza',NULL,NULL,'peachgardenthomson@gmail.com',NULL,'$2a$10$ASFbz14jcJ8WEmCmDsEVA.Z3xu6TD2jfrh6RGfQ271qxkCzJG..6S','staff',NULL,'T09LL0001B','2021-8-17'),(17,'IchibanBoshi@AMKHUB',NULL,NULL,'ichibanboshiamk@gmail.com',NULL,'$2a$10$XQSOX.qKwsGQIR/SxVf36uERD9OWtsdEDElRnEj8/AY9IKsu8sCb2','staff',NULL,'T09LL0001B','2021-8-17'),(18,'McDonalds@SunPlaza',NULL,NULL,'mcdonaldsunplaza@gmail.com',NULL,'$2a$10$/cE4z8TLrvJy5RiOaNbXKuA1wzHxz3FPjoIMv66CD1ZQyzwaR/Lbq','staff',NULL,'T09LL0001B','2021-8-17'),(19,'McDonalds@Northpoint',NULL,NULL,'mcdonaldsnp@gmail.com',NULL,'$2a$10$uUpHW.BxbzyeLrfjT6iOMeSVa60wE5/gnn9q9Gp1id/3B9WJEl6U2','staff',NULL,'T09LL0001B','2021-8-17');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-17 15:36:19
